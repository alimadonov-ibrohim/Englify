# Englify mahalliy serveri - http://localhost:8138/Englify.html
# YouTube videolari sayt ichida oynashi uchun kerak (file:// rejimida YouTube bloklaydi)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# --- AI backendni avtomatik ishga tushirish (maslahat/AI bo'limlari ishlashi uchun) ---
function Test-AiBackend {
  try {
    $r = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/health' -TimeoutSec 2
    return [bool]($r -and $r.ok)
  } catch { return $false }
}
if (-not (Test-AiBackend)) {
  $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
  if ($nodeCmd) {
    try {
      Start-Process -FilePath $nodeCmd.Source -ArgumentList 'backend/server.js' -WorkingDirectory $root -WindowStyle Hidden | Out-Null
      Write-Host 'AI backend ishga tushirilmoqda (http://127.0.0.1:8000)...'
      for ($i = 0; $i -lt 25; $i++) {
        Start-Sleep -Milliseconds 300
        if (Test-AiBackend) { Write-Host 'AI backend tayyor.'; break }
      }
    } catch {
      Write-Host ('AI backendni ishga tushirib bo''lmadi: ' + $_.Exception.Message)
    }
  } else {
    Write-Host 'Node.js topilmadi - AI bo''limlari ishlamaydi. https://nodejs.org dan o''rnating.'
  }
}

$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8138/')
try { $l.Start() } catch {
  Write-Host "Server start bo'lmadi: $($_.Exception.Message)"
  Write-Host "Balki port 8138 band. Boshqa oyna ochiq bo'lishi mumkin - uni yopib ko'ring."
  Read-Host "Chiqish uchun Enter bosing"
  exit 1
}
Write-Host "=========================================="
Write-Host " Englify server ishlayapti:"
Write-Host " http://localhost:8138/Englify.html"
Write-Host " To'xtatish: shu oynani yoping"
Write-Host "=========================================="
$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.htm'  = 'text/html; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.gif'  = 'image/gif'
  '.svg'  = 'image/svg+xml'
  '.js'   = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.ico'  = 'image/x-icon'
  '.webmanifest' = 'application/manifest+json'
  '.apk'  = 'application/vnd.android.package-archive'
  '.mp3'  = 'audio/mpeg'
  '.mp4'  = 'video/mp4'
}
while ($l.IsListening) {
  try {
    $c = $l.GetContext()
    $p = $c.Request.Url.AbsolutePath
    if ($p -eq '/') { $p = '/Englify.html' }
    $f = Join-Path $root ($p.TrimStart('/') -replace '/', '\')
    if ((Test-Path -LiteralPath $f -PathType Leaf) -and ((Resolve-Path -LiteralPath $f).Path.StartsWith($root))) {
      $ext = [IO.Path]::GetExtension($f).ToLower()
      $m = 'application/octet-stream'
      if ($mime.ContainsKey($ext)) { $m = $mime[$ext] }
      $b = [IO.File]::ReadAllBytes($f)
      $c.Response.ContentType = $m
      $c.Response.ContentLength64 = $b.Length
      $c.Response.OutputStream.Write($b, 0, $b.Length)
    } else {
      $c.Response.StatusCode = 404
      $b = [Text.Encoding]::UTF8.GetBytes('404 - topilmadi')
      $c.Response.OutputStream.Write($b, 0, $b.Length)
    }
    $c.Response.Close()
  } catch {
    Write-Host "Xato: $($_.Exception.Message)"
  }
}
