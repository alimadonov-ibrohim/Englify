# ============================================================
#  Englify — APK yig'ish skripti (Android SDK bilan, Gradle'siz)
#  Ishlatish:  powershell -ExecutionPolicy Bypass -File build-apk.ps1
#  Natija:     dist\Englify.apk
# ============================================================
$ErrorActionPreference = 'Stop'

$root    = Split-Path -Parent $MyInvocation.MyCommand.Path   # ...\Englify\android-apk
$project = Split-Path -Parent $root                          # ...\Englify

# ---------- JDK ----------
$jdk = $env:JAVA_HOME
if (-not $jdk -or -not (Test-Path (Join-Path $jdk 'bin\javac.exe'))) {
    $candidates = @(
        'C:\Program Files\JetBrains\PyCharm 2025.3.1.1\jbr',
        'C:\Program Files\Android\Android Studio\jbr',
        "$env:LOCALAPPDATA\Programs\Android Studio\jbr",
        'C:\Program Files\Eclipse Adoptium'
    )
    foreach ($c in $candidates) {
        if (Test-Path (Join-Path $c 'bin\javac.exe')) { $jdk = $c; break }
        if (Test-Path $c) {
            $sub = Get-ChildItem $c -Directory -ErrorAction SilentlyContinue |
                   Where-Object { Test-Path (Join-Path $_.FullName 'bin\javac.exe') } |
                   Select-Object -First 1
            if ($sub) { $jdk = $sub.FullName; break }
        }
    }
}
if (-not $jdk) { throw "JDK topilmadi. JAVA_HOME ni o'rnating (JDK 17+)." }
$env:JAVA_HOME = $jdk
$env:PATH = (Join-Path $jdk 'bin') + ';' + $env:PATH

# ---------- Android SDK ----------
$sdk = $env:ANDROID_HOME
if (-not $sdk) { $sdk = $env:ANDROID_SDK_ROOT }
if (-not $sdk) { $sdk = "$env:LOCALAPPDATA\Android\Sdk" }
if (-not (Test-Path $sdk)) { throw "Android SDK topilmadi: $sdk" }

$btDir = Join-Path $sdk 'build-tools'
if (-not (Test-Path $btDir)) { throw "build-tools topilmadi: $btDir" }
$bt = Get-ChildItem $btDir -Directory | Sort-Object { try { [version]$_.Name } catch { [version]'0.0' } } -Descending | Select-Object -First 1
if (-not $bt) { throw "build-tools versiyasi topilmadi" }
$btPath = $bt.FullName

$platDir = Join-Path $sdk 'platforms'
if (-not (Test-Path $platDir)) { throw "platforms topilmadi: $platDir" }
$platform = Get-ChildItem $platDir -Directory | Sort-Object Name -Descending | Select-Object -First 1
if (-not $platform) { throw "Android platform topilmadi" }
$androidJar = Join-Path $platform.FullName 'android.jar'
if (-not (Test-Path $androidJar)) { throw "android.jar topilmadi: $androidJar" }
$targetSdk = ($platform.Name -replace '[^0-9]', '')

Write-Host "JDK:        $jdk"
Write-Host "SDK:        $sdk"
Write-Host "Build-tools:$btPath"
Write-Host "Platform:   $($platform.Name)"

# ---------- Papkalar ----------
$build  = Join-Path $env:TEMP 'englify-apk-build'
$assets = Join-Path $build 'assets'
$www    = Join-Path $assets 'www'
$res    = Join-Path $build 'res'
$src    = Join-Path $root 'src'
$dist   = Join-Path $root 'dist'

function Copy-FileRetry($source, $destination, $tries = 12) {
    for ($i = 0; $i -lt $tries; $i++) {
        try {
            $dir = Split-Path -Parent $destination
            if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
            if (Test-Path $destination) { Remove-Item $destination -Force -ErrorAction SilentlyContinue }
            [System.IO.File]::Copy($source, $destination, $true)
            return
        } catch {
            Start-Sleep -Milliseconds 400
        }
    }
    throw "Nusxalab bo'lmadi: $destination"
}

Remove-Item $build -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $dist -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $build, $www, $dist | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $build 'classes'), (Join-Path $build 'dex'), (Join-Path $build 'gen') | Out-Null

# ---------- Sayt fayllarini APK ichiga ko'chirish ----------
Write-Host "Sayt fayllari ko'chirilmoqda..."
Copy-FileRetry (Join-Path $project 'Englify.html') (Join-Path $www 'Englify.html')
if (Test-Path (Join-Path $project 'manifest.json')) { Copy-FileRetry (Join-Path $project 'manifest.json') (Join-Path $www 'manifest.json') }
foreach ($f in @('icon-192.png', 'icon-512.png', 'englify-logo.png')) {
    $p = Join-Path $project $f
    if (Test-Path $p) { Copy-FileRetry $p (Join-Path $www $f) }
}
Copy-Item (Join-Path $project 'assets') (Join-Path $www 'assets') -Recurse -Force

# ---------- Icon ----------
$drawable = Join-Path $res 'drawable'
New-Item -ItemType Directory -Force -Path $drawable | Out-Null
Copy-FileRetry (Join-Path $project 'icon-512.png') (Join-Path $drawable 'ic_launcher.png')

# ---------- aapt2 compile ----------
Write-Host "Resurslar yig'ilmoqda..."
$resZip = Join-Path $build 'res.zip'
& (Join-Path $btPath 'aapt2.exe') compile --dir $res -o $resZip
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile xatosi" }

# ---------- aapt2 link ----------
$unsigned = Join-Path $build 'app-unsigned.apk'
& (Join-Path $btPath 'aapt2.exe') link -o $unsigned -I $androidJar `
    --manifest (Join-Path $root 'AndroidManifest.xml') `
    --min-sdk-version 21 --target-sdk-version $targetSdk `
    $resZip
if ($LASTEXITCODE -ne 0) { throw "aapt2 link xatosi" }

# ---------- Java kompilyatsiya ----------
Write-Host "Java kodi kompilyatsiya qilinmoqda..."
$classes = Join-Path $build 'classes'
& (Join-Path $jdk 'bin\javac.exe') -source 8 -target 8 -bootclasspath $androidJar `
    -d $classes (Join-Path $src 'uz\englify\app\MainActivity.java')
if ($LASTEXITCODE -ne 0) { throw "javac xatosi" }

# ---------- DEX ----------
Write-Host "DEX yaratilmoqda..."
$classesJar = Join-Path $build 'classes.jar'
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $classesJar) { Remove-Item $classesJar -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($classes, $classesJar)

$dexDir = Join-Path $build 'dex'
& (Join-Path $btPath 'd8.bat') --release --lib $androidJar --min-api 21 --output $dexDir $classesJar
if ($LASTEXITCODE -ne 0) { throw "d8 xatosi" }

# ---------- Sayt assets va classes.dex ni APK ga qo'shish ----------
Write-Host "Sayt fayllari va classes.dex APK ga qo'shilmoqda..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($unsigned, 'Update')

$wwwFull = (Resolve-Path $www).Path.TrimEnd('\')
Get-ChildItem $www -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($wwwFull.Length).TrimStart('\') -replace '\\', '/'
    $entryName = 'assets/www/' + $rel
    $existing = $zip.GetEntry($entryName)
    if ($existing) { $existing.Delete() }
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
        $zip, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}

$dex = Join-Path $dexDir 'classes.dex'
if (-not (Test-Path $dex)) { throw "classes.dex yaratilmadi" }
$existingDex = $zip.GetEntry('classes.dex')
if ($existingDex) { $existingDex.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
    $zip, $dex, 'classes.dex', [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null

$zip.Dispose()

# ---------- zipalign ----------
Write-Host "zipalign..."
$aligned = Join-Path $build 'app-aligned.apk'
& (Join-Path $btPath 'zipalign.exe') -f 4 $unsigned $aligned
if ($LASTEXITCODE -ne 0) { throw "zipalign xatosi" }

# ---------- Keystore ----------
$ks = Join-Path $root 'englify.keystore'

# Parolni repo'ga yozmang: lokal keystore.properties yoki muhit o'zgaruvchilaridan olinadi.
$storePass = $env:ENGLIFY_KEYSTORE_PASS
$keyPass = $env:ENGLIFY_KEY_PASS
$ksProps = Join-Path $root 'keystore.properties'
if (Test-Path $ksProps) {
    Get-Content $ksProps | ForEach-Object {
        if ($_ -match '^\s*storePassword\s*=\s*(.+?)\s*$') { $storePass = $matches[1] }
        if ($_ -match '^\s*keyPassword\s*=\s*(.+?)\s*$') { $keyPass = $matches[1] }
    }
}
if (-not $storePass) { $storePass = Read-Host "Keystore paroli" }
if (-not $keyPass) { $keyPass = $storePass }

if (-not (Test-Path $ks)) {
    Write-Host "Imzolash kaliti yaratilmoqda..."
    & (Join-Path $jdk 'bin\keytool.exe') -genkeypair -v -keystore $ks -alias englify `
        -keyalg RSA -keysize 2048 -validity 10000 `
        -storepass $storePass -keypass $keyPass `
        -dname "CN=Englify, OU=Mobile, O=Englify, L=Tashkent, ST=Tashkent, C=UZ"
    if ($LASTEXITCODE -ne 0) { throw "keytool xatosi" }
}

# ---------- Imzolash ----------
Write-Host "APK imzolanmoqda..."
$finalTmp = Join-Path $build 'Englify.apk'
& (Join-Path $btPath 'apksigner.bat') sign `
    --ks $ks --ks-pass "pass:$storePass" --key-pass "pass:$keyPass" `
    --out $finalTmp $aligned
if ($LASTEXITCODE -ne 0) { throw "apksigner xatosi" }

$final = Join-Path $dist 'Englify.apk'
Copy-FileRetry $finalTmp $final

# ---------- Tekshirish ----------
& (Join-Path $btPath 'apksigner.bat') verify --verbose $final
if ($LASTEXITCODE -ne 0) { throw "APK imzosi tekshiruvdan o'tmadi" }

Write-Host ""
Write-Host "============================================"
Write-Host " TAYYOR: $final"
Write-Host (" Hajmi:  " + [math]::Round((Get-Item $final).Length / 1MB, 2) + " MB")
Write-Host "============================================"
