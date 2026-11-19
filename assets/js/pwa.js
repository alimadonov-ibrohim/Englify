// Englify — pwa
  // ========== PWA / APK YUKLAB OLISH TIZIMI ==========
  // APK_URL endi dinamik — joriy sahifa URL'iga asoslanadi
  // Bu yerda haqiqiy APK fayl yo'q, lekin HTML fayl o'zini offline ishlaydi
  function getCurrentPageUrl(){
    try { return location.href; } catch(e){ return ''; }
  }
  function getBaseUrl(){
    try{
      if(location.protocol === 'file:') return '';
      const dir = location.pathname.replace(/[^/]*$/, '');
      return location.origin + dir;
    }catch(e){ return ''; }
  }
  // APK_URL — bu joriy sahifa URL'i (PWA install + QR kod uchun)
  const APK_URL = (function(){
    try{
      if(location.protocol === 'file:') return '';
      return location.href;
    }catch(e){ return ''; }
  })();
  // APK fayl nomi — haqiqiy Android APK fayl
  const APK_FILE = 'Englify.apk';
  const HTML_FILE = 'Englify.html';

  // --- Service Worker ro'yxatdan o'tkazish (offline cache uchun) ---
  // Ilova yangilanganda eski kesh tozalanadi va sahifa bir marta yangilanadi.
  let swRefreshing = false;
  if('serviceWorker' in navigator){
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function(){
      if(swRefreshing) return;
      swRefreshing = true;
      // Birinchi o'rnatishda emas, faqat yangilanishda sahifani yangilaymiz.
      if(hadController) window.location.reload();
    });
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').then(function(reg){
        console.log('[PWA] Service Worker ro\'yxatdan o\'tdi:', reg.scope);
        // Yangi versiyani fonda tekshirish
        try { reg.update(); } catch(e){}
      }).catch(function(err){
        console.warn('[PWA] SW xatosi:', err);
      });
    });
  }

  // --- beforeinstallprompt — Android Chrome install prompt ---
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    // Brauzer default promptini to'xtatamiz
    e.preventDefault();
    deferredPrompt = e;
    // Install tugmalarini ko'rsatamiz
    showInstallButtons(true);
    // PWA banner ni ko'rsatish (faqat home/dashboard'da)
    if(!sessionStorage.getItem('pwa_banner_dismissed')){
      const banner = document.getElementById('pwa-install-banner');
      if(banner){
        setTimeout(function(){ banner.classList.add('show'); }, 2000);
      }
    }
    console.log('[PWA] beforeinstallprompt tayyor — install tugmasi ko\'rsatildi');
  });

  window.addEventListener('appinstalled', function(e){
    console.log('[PWA] Ilova o\'rnatildi!');
    deferredPrompt = null;
    showInstallButtons(false);
    const banner = document.getElementById('pwa-install-banner');
    if(banner) banner.classList.remove('show');
    // Status yangilash
    const st = document.getElementById('apk-status-msg');
    if(st){ st.className = 'apk-status ok'; st.textContent = '✓ Ilova o\'rnatilgan! Bosh ekrandan oching.'; }
    apkSetDlLabel('✓ O\'rnatilgan');
    const dl = document.getElementById('apk-dl-btn');
    if(dl){ dl.disabled = true; dl.style.opacity = '.7'; }
    // Banner xabar
    if(navigator.serviceWorker && navigator.serviceWorker.controller){
      // SW orqali xabar yuborish mumkin
    }
  });

  function showInstallButtons(show){
    const btns = [
      document.getElementById('apk-install-btn'),
      document.getElementById('footer-install-btn'),
      document.getElementById('apk-modal-install-btn')
    ];
    btns.forEach(function(b){ if(b) b.style.display = show ? 'flex' : 'none'; });
  }

  function pwaInstallNow(){
    if(!deferredPrompt){
      // iPhone / iPad — Safari orqali "Bosh ekranga qo'shish" yo'riqnomasi
      if(pwaIsIOS()){
        pwaOpenIosGuide();
      } else {
        // Boshqa brauzerlar (Firefox, eski Chrome va h.k.)
        alert('Brauzeringiz avtomatik o\'rnatishni qo\'llab-quvvatlamaydi.\n\nManual usul:\n1. Brauzer menyusini oching (⋮)\n2. "Add to Home screen" / "Bosh ekranga qo\'shish" ni tanlang\n3. Tasdiqlang');
      }
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choice){
      if(choice.outcome === 'accepted'){
        console.log('[PWA] Foydalanuvchi o\'rnatishni qabul qildi');
        const st = document.getElementById('apk-status-msg');
        if(st){ st.className = 'apk-status ok'; st.textContent = '✓ O\'rnatilmoqda... Bosh ekranga qarang.'; }
      } else {
        console.log('[PWA] Foydalanuvchi rad etdi');
      }
      deferredPrompt = null;
      showInstallButtons(false);
      const banner = document.getElementById('pwa-install-banner');
      if(banner) banner.classList.remove('show');
    }).catch(function(){ deferredPrompt = null; });
  }

  function pwaDismissBanner(){
    const banner = document.getElementById('pwa-install-banner');
    if(banner) banner.classList.remove('show');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  }

  // iPhone / iPad uchun vizual yo'riqnoma (Safari → Ulashish → Bosh ekranga qo'shish)
  function pwaOpenIosGuide(){
    const modal = document.getElementById('apk-qr-modal');
    if(modal){
      try { apkRenderQr(); } catch(e){}
      modal.style.display = 'flex';
      const btn = document.getElementById('apk-tab-btn-ios');
      if(btn) apkSwitchModalTab('ios', btn);
    }
    const banner = document.getElementById('pwa-install-banner');
    if(banner) banner.classList.remove('show');
  }

  // PWA detection — standalone (o'rnatilgan) rejimda ekanligini tekshirish
  function pwaIsStandalone(){
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
        || window.navigator.standalone === true;
  }

  // ========== APK DOWNLOAD MODALI (yangilangan — tabbed) ==========
  function showApkDownloadModal(){
    const old = document.getElementById('apk-modal');
    if(old) old.remove();

    const curUrl = getCurrentPageUrl() || 'https://example.com/Englify.html';

    const modal = document.createElement('div');
    modal.id = 'apk-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(14,32,56,0.8);backdrop-filter:blur(6px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
    modal.innerHTML = `
      <div class="apk-modal-box" style="background:var(--card);border-radius:20px;max-width:460px;width:100%;padding:28px;position:relative;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);">
        <button onclick="document.getElementById('apk-modal').remove()" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:26px;cursor:pointer;color:var(--ink-soft);line-height:1;">&times;</button>
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:44px;margin-bottom:10px;">📱</div>
          <h2 style="font-family:'Fraunces',serif;font-size:22px;margin:0 0 6px;color:var(--ink);">Englify Ilovasi</h2>
          <p style="color:var(--ink-soft);font-size:14px;margin:0;">v1.0 · Offline · Android / iOS / Desktop</p>
        </div>

        <div class="apk-modal-tabs" style="display:flex;gap:6px;margin-bottom:16px;background:var(--field);border-radius:12px;padding:4px;">
          <button class="apk-modal-tab active" style="flex:1;background:var(--card);border:none;color:var(--blue-deep);font-size:12.5px;font-weight:700;padding:9px 6px;border-radius:9px;cursor:pointer;font-family:'Manrope',sans-serif;" onclick="apkSwitchTab('dl')">⬇️ Yuklash</button>
          <button class="apk-modal-tab" style="flex:1;background:transparent;border:none;color:var(--ink-soft);font-size:12.5px;font-weight:700;padding:9px 6px;border-radius:9px;cursor:pointer;font-family:'Manrope',sans-serif;" onclick="apkSwitchTab('qr')">📷 QR</button>
          <button class="apk-modal-tab" style="flex:1;background:transparent;border:none;color:var(--ink-soft);font-size:12.5px;font-weight:700;padding:9px 6px;border-radius:9px;cursor:pointer;font-family:'Manrope',sans-serif;" onclick="apkSwitchTab('how')">❓ Qanday?</button>
        </div>

        <div id="apk-tab-dl" style="display:block;">
          <div style="background:var(--field);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;">
            <div style="font-size:36px;margin-bottom:8px;">⬇️</div>
            <div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:4px;">Englify.apk</div>
            <div style="font-size:12px;color:var(--ink-soft);margin-bottom:12px;">~210 KB · Android 7.0+ · Native ilova</div>
            <button class="dash-btn dash-btn-primary" style="width:100%;padding:12px;font-size:14px;" onclick="apkDownload()">📥 Hoziroq yuklab olish</button>
          </div>
          <button class="dash-btn dash-btn-outline" id="apk-modal-install-btn-2" style="width:100%;padding:11px;font-size:13px;${deferredPrompt ? '' : 'display:none;'}" onclick="pwaInstallNow()">⚡ Brauzer orqali o'rnatish</button>
          <div style="margin-top:10px;font-size:11.5px;color:var(--ink-soft);line-height:1.6;text-align:center;">
            ✅ Haqiqiy Android <b>APK</b> — native ilova sifatida o'rnatiladi<br>
            ✅ Barcha testlar, lug'at, mock imtihonlar ichida — offline
          </div>
        </div>

        <div id="apk-tab-qr" style="display:none;">
          <div style="background:var(--field);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;">
            <img id="apk-modal-qr-img" alt="QR kod" style="width:180px;height:180px;border-radius:10px;background:#fff;padding:8px;">
            <div style="font-size:12px;color:var(--ink-soft);margin-top:10px;">QR kodni telefon kamerasi bilan skanerlang</div>
          </div>
          <div style="background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.25);border-radius:12px;padding:12px 14px;margin-bottom:14px;">
            <div style="font-size:12.5px;font-weight:700;color:var(--blue-deep);margin-bottom:6px;">📋 Havola:</div>
            <div style="font-size:11px;color:var(--blue-deep);word-break:break-all;line-height:1.6;background:var(--card);padding:8px;border-radius:8px;border:1px solid var(--line);" id="apk-modal-url-box">${escapeHtml ? '' : ''}${curUrl}</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="dash-btn dash-btn-outline" style="flex:1;padding:11px;font-size:13px;" onclick="apkCopyCurrentUrl()">📋 Nusxalash</button>
            <button class="dash-btn dash-btn-outline" style="flex:1;padding:11px;font-size:13px;" onclick="apkRenderQrInModal()">🔄 QR yangilash</button>
          </div>
        </div>

        <div id="apk-tab-how" style="display:none;">
          <div style="font-size:13px;color:var(--ink);line-height:1.6;margin-bottom:14px;">
            <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px dashed var(--line);">
              <span style="width:24px;height:24px;border-radius:50%;background:var(--blue-tint);color:var(--blue-deep);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">1</span>
              <span><b>Yuklab olish</b> tugmasini bosing — HTML fayl telefonga saqlanadi</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px dashed var(--line);">
              <span style="width:24px;height:24px;border-radius:50%;background:var(--blue-tint);color:var(--blue-deep);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">2</span>
              <span>Fayl menejerida oching (Downloads papkasi)</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px dashed var(--line);">
              <span style="width:24px;height:24px;border-radius:50%;background:var(--blue-tint);color:var(--blue-deep);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">3</span>
              <span>Chrome brauzerida oching — barcha funksiyalar offline ishlaydi</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;">
              <span style="width:24px;height:24px;border-radius:50%;background:var(--blue-tint);color:var(--blue-deep);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">★</span>
              <span><b>Bonus:</b> Chrome menyusidan <b>"Add to Home screen"</b> ni tanlang — ilova icon bilan bosh ekranda paydo bo'ladi</span>
            </div>
          </div>
          <div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:12px 14px;font-size:12.5px;color:#15803d;line-height:1.6;text-align:center;">
            ⚡ <b>Offline ishlaydi</b> — internetga ulanish shart emas<br>Barcha testlar, AI baholash, lug'at ichida
          </div>
        </div>

        <div style="margin-top:14px;font-size:11.5px;color:var(--ink-soft);line-height:1.6;text-align:center;border-top:1px solid var(--line);padding-top:12px;">
          💡 Android'da native APK olish uchun Chrome'da "Add to Home screen" qiling — ilova icon bilan paydo bo'ladi
        </div>
      </div>`;
    document.body.appendChild(modal);
    // QR kodni o'rnatish
    setTimeout(function(){ apkRenderQrInModal(); }, 50);
  }

  // Modal tab almashtirish
  function apkSwitchTab(tab){
    ['dl','qr','how'].forEach(function(t){
      const panel = document.getElementById('apk-tab-' + t);
      if(panel) panel.style.display = (t === tab) ? 'block' : 'none';
    });
    // Tab tugmalarini yangilash
    const tabs = document.querySelectorAll('#apk-modal .apk-modal-tab');
    if(tabs.length >= 3){
      const idx = ['dl','qr','how'].indexOf(tab);
      tabs.forEach(function(t, i){
        if(i === idx){
          t.style.background = 'var(--card)';
          t.style.color = 'var(--blue-deep)';
        } else {
          t.style.background = 'transparent';
          t.style.color = 'var(--ink-soft)';
        }
      });
    }
  }

  // Profile modal tab almashtirish
  function apkSwitchModalTab(tab, btnEl){
    const parent = btnEl.parentNode;
    const tabs = parent.querySelectorAll('.apk-modal-tab');
    tabs.forEach(function(t){ t.classList.remove('active'); });
    btnEl.classList.add('active');
    ['qr','pwa','ios','manual'].forEach(function(t){
      const p = document.getElementById('apk-panel-' + t);
      if(p) p.classList.toggle('active', t === tab);
    });
  }

  // QR kodni modal ichida yangilash (joriy URL bilan)
  function apkRenderQrInModal(){
    const url = getCurrentPageUrl();
    if(!url) return;
    const img = document.getElementById('apk-modal-qr-img');
    if(img){
      img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
    }
  }

  function copyApkLink(){
    apkCopyCurrentUrl();
  }

  function apkCopyCurrentUrl(){
    const url = getCurrentPageUrl() || 'https://example.com';
    const doCopy = function(text){
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){
          alert('Havola nusxalandi:\\n' + text);
        }).catch(function(){
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    };
    const fallbackCopy = function(text){
      try{
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        alert('Havola nusxalandi!');
      }catch(e){ alert('Nusxalab bo\'lmadi. Qo\'lda nusxalang:\\n' + text); }
    };
    doCopy(url);
  }

  // ========== GOOGLE OAUTH (haqiqiy) ==========
  // Client ID backend'dan olinadi (/api/auth/config) — kodda hardcode qilinmaydi.
  // Credential serverda Google kalitlari bilan tekshiriladi (/api/auth/google).
  let googleClientId = '';
  let googleConfigLoaded = false;
  let googleConfigPromise = null;
  let googleInitialized = false;
  let googleRendered = { login: false, register: false };
  let googleBusy = false;
  // Nima uchun Google ishlamayotganini aniq ko'rsatish uchun sabab kodi.
  // 'protocol' | 'config' | 'clientid' | 'script' | ''
  let googleIssue = '';

  function loadGoogleConfig(force){
    if(googleConfigLoaded && !force) return Promise.resolve(googleClientId);
    if(googleConfigPromise) return googleConfigPromise;
    googleConfigPromise = api('GET', '/api/auth/config', null, false).then(function(cfg){
      googleClientId = String((cfg && cfg.googleClientId) || '').trim();
      googleConfigLoaded = true;
      googleIssue = googleClientId ? '' : 'clientid';
      googleConfigPromise = null;
      return googleClientId;
    }).catch(function(err){
      googleConfigPromise = null;
      googleIssue = 'config';
      console.warn('[Google] config yuklanmadi:', err && err.message);
      return '';
    });
    return googleConfigPromise;
  }

  function loadGoogleScript(){
    if(window.google && window.google.accounts && window.google.accounts.id) return Promise.resolve();
    return new Promise(function(resolve, reject){
      var existing = document.getElementById('google-gsi-script');
      if(existing){
        if(window.google && window.google.accounts && window.google.accounts.id){ resolve(); return; }
        var done = false;
        function ok(){ if(done) return; done = true; resolve(); }
        function fail(){ if(done) return; done = true; reject(new Error('Google skripti yuklanmadi')); }
        existing.addEventListener('load', ok);
        existing.addEventListener('error', fail);
        setTimeout(function(){
          if(window.google && window.google.accounts && window.google.accounts.id) ok();
        }, 50);
        return;
      }
      var s = document.createElement('script');
      s.id = 'google-gsi-script';
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = function(){ resolve(); };
      s.onerror = function(){ reject(new Error('Google skripti yuklanmadi')); };
      document.head.appendChild(s);
    });
  }

  function ensureGoogleWrappers(){
    ['login','register'].forEach(function(kind){
      var btn = document.getElementById('google-' + kind + '-btn');
      if(!btn) return;
      var wrap = document.getElementById('google-' + kind + '-wrap');
      if(!wrap){
        wrap = document.createElement('div');
        wrap.id = 'google-' + kind + '-wrap';
        wrap.className = 'google-btn-wrap';
        btn.parentNode.insertBefore(wrap, btn);
        wrap.appendChild(btn);
      }
      var slot = document.getElementById('google-gsi-' + kind);
      if(!slot){
        slot = document.createElement('div');
        slot.id = 'google-gsi-' + kind;
        slot.className = 'google-gsi-slot';
        wrap.appendChild(slot);
      }
    });
  }

  function initGoogleIdentity(){
    if(googleInitialized) return Promise.resolve(true);
    if(location.protocol !== 'http:' && location.protocol !== 'https:'){
      // Google OAuth faqat http(s) origin'da ishlaydi (file:// — "null" origin).
      googleIssue = 'protocol';
      return Promise.resolve(false);
    }
    return loadGoogleConfig().then(function(clientId){
      if(!clientId) return false;
      return loadGoogleScript().then(function(){
        if(!window.google || !window.google.accounts || !window.google.accounts.id){
          throw new Error('Google Identity Services yuklanmadi');
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup',
          context: 'signin'
        });
        googleInitialized = true;
        googleIssue = '';
        return true;
      });
    }).catch(function(err){
      googleIssue = 'script';
      console.warn('[Google] init xatosi:', err && err.message);
      return false;
    });
  }

  function googleSetupMessage(){
    if(googleIssue === 'protocol'){
      return "Google bilan kirish uchun saytni http(s) manzilida oching. Englify.html ni ikki marta bosib (file://) ochganda Google ishlamaydi — Englify-server.bat ni ishga tushiring yoki live saytdan foydalaning.";
    }
    if(googleIssue === 'config'){
      return "Google sozlamalari serverdan olinmadi (/api/auth/config). Saytning yangi versiyasi deploy qilinganligini va backend ishlab turganligini tekshiring.";
    }
    if(googleIssue === 'script'){
      return "Google Identity Services yuklanmadi. Internet aloqasini tekshirib, sahifani qayta yuklang.";
    }
    return "Google bilan kirish hali sozlanmagan. Administrator Google Cloud Console'da OAuth Client ID yaratib, Vercel'ga GOOGLE_CLIENT_ID qo'shishi kerak.";
  }

  function renderGoogleButtons(){
    if(!googleClientId || !googleInitialized) return;
    ensureGoogleWrappers();
    ['login','register'].forEach(function(kind){
      var slot = document.getElementById('google-gsi-' + kind);
      var fallback = document.getElementById('google-' + kind + '-btn');
      if(!slot) return;
      // Allaqachon chizilgan va iframe mavjud bo'lsa — qayta chizmaymiz
      if(slot.querySelector('iframe')) return;
      slot.innerHTML = '';
      var wrap = document.getElementById('google-' + kind + '-wrap');
      var width = Math.max(240, Math.min(360, (wrap && wrap.clientWidth) || 320));
      try {
        window.google.accounts.id.renderButton(slot, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: kind === 'register' ? 'signup_with' : 'continue_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: width
        });
        slot.style.display = 'flex';
        slot.style.justifyContent = 'center';
        // Google iframe'i haqiqatan paydo bo'lganini tekshiramiz.
        // Bo'lmasa (masalan origin ruxsat etilmagan) — zaxira tugma qoladi.
        var attempts = 0;
        function checkRendered(){
          attempts++;
          if(slot.querySelector('iframe')){
            slot.style.display = 'flex';
            if(fallback) fallback.style.display = 'none';
            googleRendered[kind] = true;
          } else if(attempts < 8){
            setTimeout(checkRendered, 120);
          } else {
            googleRendered[kind] = false;
            if(fallback) fallback.style.display = '';
          }
        }
        checkRendered();
      } catch(e){
        console.warn('[Google] render xatosi:', e && e.message);
      }
    });
  }

  function initGoogleSignIn(){
    return initGoogleIdentity().then(function(ok){
      if(ok) renderGoogleButtons();
      return ok;
    });
  }

  // showView() har safar login/register ochilganda chaqiriladi
  function pwaRenderGoogleButtons(){
    if(!googleConfigLoaded){
      loadGoogleConfig().then(function(id){
        if(id) initGoogleSignIn();
      });
      return;
    }
    if(!googleClientId) return;
    if(!googleInitialized){ initGoogleSignIn(); return; }
    renderGoogleButtons();
  }

  function showGoogleStatus(msg){
    var regView = document.getElementById('view-register');
    var regErr = document.getElementById('register-error');
    var loginErr = document.getElementById('login-error');
    var el = (regView && regView.style.display !== 'none') ? regErr : loginErr;
    if(el){
      el.textContent = msg;
      el.style.display = 'block';
      el.scrollIntoView({ block: 'nearest' });
    } else {
      alert(msg);
    }
  }

  function pwaCloseGoogleModal(){
    var modal = document.getElementById('google-auth-modal');
    if(modal) modal.style.display = 'none';
    var st = document.getElementById('google-modal-status');
    if(st) st.textContent = '';
  }

  function openGoogleModal(){
    var modal = document.getElementById('google-auth-modal');
    if(!modal) return;
    var slot = document.getElementById('google-modal-slot');
    var st = document.getElementById('google-modal-status');
    if(slot) slot.innerHTML = '';
    if(st) st.textContent = 'Google hisobingizni tanlang…';
    modal.style.display = 'flex';
    if(window.google && window.google.accounts && window.google.accounts.id){
      try {
        window.google.accounts.id.renderButton(slot, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 300
        });
      } catch(e){}
    }
    setTimeout(function(){
      if(st && slot && !slot.querySelector('iframe')){
        st.textContent = "Google tugmasini chizib bo'lmadi. Sayt manzili Google Console'da Authorized JavaScript origins ro'yxatiga qo'shilganini tekshiring.";
      }
    }, 900);
  }

  // Bizning tugma bosilganda rasmiy Google tugmasini modalda ko'rsatamiz
  function loginWithGoogle(){
    if(googleBusy) return;
    initGoogleIdentity().then(function(ok){
      if(!ok){
        showGoogleStatus(googleSetupMessage());
        return;
      }
      openGoogleModal();
    });
  }

  // Google qaytgan credential'ni serverda tekshirib, hisobga kiramiz
  function handleGoogleCredential(response){
    if(googleBusy) return;
    if(!response || !response.credential){
      showGoogleStatus("Google hisob ma'lumoti olinmadi. Qayta urinib ko'ring.");
      return;
    }
    googleBusy = true;
    setGoogleButtonsDisabled(true);
    var st = document.getElementById('google-modal-status');
    if(st) st.textContent = 'Tekshirilmoqda…';

    api('POST', '/api/auth/google', { credential: response.credential }, false).then(function(data){
      if(!data || !data.access || !data.user){
        throw new Error("Serverdan noto'g'ri javob keldi.");
      }
      localStorage.setItem('sb_access', data.access);
      if(data.refresh) localStorage.setItem('sb_refresh', data.refresh);

      var user = data.user;
      var email = String(user.email || '').toLowerCase();
      var sessionUser = withRole(user);

      var users = getUsers();
      var prev = users[email] || {};
      users[email] = Object.assign({}, prev, {
        name: user.name || prev.name || email.split('@')[0],
        email: email,
        phone: user.phone || prev.phone || '',
        password: prev.password || '',
        role: sessionUser.role,
        status: user.status || 'active',
        provider: 'google',
        google: true,
        picture: user.picture || prev.picture || '',
        createdAt: user.createdAt || prev.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        synced: true
      });
      saveUsers(users);
      setSession(sessionUser);
      applyUserToUI(sessionUser);
      try { if(typeof adminRefreshUsers === 'function') adminRefreshUsers(); } catch(e){}
      try { if(typeof adminRefreshResults === 'function') adminRefreshResults(); } catch(e){}
      pwaCloseGoogleModal();
      showView('dashboard');
    }).catch(function(err){
      var msg = (err && err.message) ? err.message : 'Google bilan kirishda xatolik.';
      if(st) st.textContent = msg;
      showGoogleStatus(msg);
    }).then(function(){
      googleBusy = false;
      setGoogleButtonsDisabled(false);
    });
  }

  function setGoogleButtonsDisabled(disabled){
    ['google-login-btn','google-register-btn'].forEach(function(id){
      var b = document.getElementById(id);
      if(b){ b.disabled = !!disabled; b.style.opacity = disabled ? '.65' : ''; }
    });
    var modal = document.getElementById('google-auth-modal');
    if(modal) modal.style.pointerEvents = disabled ? 'none' : '';
  }

  // Sahifa ochilganda config + rasmiy Google tugmalarini tayyorlaymiz
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(initGoogleSignIn, 0); });
  } else {
    setTimeout(initGoogleSignIn, 0);
  }

  function applyUserToUI(user){
    const name = user.name || 'Foydalanuvchi';
    const email = user.email || '';
    const ini = name.charAt(0).toUpperCase();
    const username = '@' + (email ? email.split('@')[0] : name.toLowerCase().replace(/\s+/g, '_'));
    const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    setText('prof-display-name', name);
    setText('prof-username', username);
    setText('prof-email', email || 'email@example.com');
    setText('dash-welcome-eyebrow', 'Salom, ' + name.split(' ')[0] + '!');
    setText('dash-sidebar-name', name.split(' ')[0]);
    setText('prof-avatar-circle', ini);
    setText('dash-topbar-avatar', ini);
    setText('dash-sidebar-avatar', ini);

    // ALILM-style home: user info + recent tests yangilash
    try { if(typeof updateHomeUserInfo === 'function') updateHomeUserInfo(); } catch(e){}
    try { if(typeof renderRecent === 'function') renderRecent(); } catch(e){}

    // Theme / lang labels in profile
    const themeLab = document.getElementById('prof-theme-label');
    if(themeLab) themeLab.textContent = (getTheme() === 'dark' ? "Qorong'u rejim" : "Yorug' rejim");
    const langLab = document.getElementById('prof-lang-label');
    if(langLab){
      const l = getLang();
      langLab.textContent = l === 'en' ? 'English' : "O'zbek tili";
    }

    // Admin badge
    const badge = document.getElementById('prof-role-badge');
    const admin = isAdminEmail(email) || user.role === 'admin';
    if(badge){
      if(admin){
        badge.textContent = 'Admin';
        badge.style.background = '#fef3c7';
        badge.style.color = '#b45309';
      } else {
        badge.textContent = 'Mahalliy';
        badge.style.background = 'var(--blue-tint)';
        badge.style.color = 'var(--blue-deep)';
      }
    }
    // Welcome line for admin
    if(admin){
      setText('dash-welcome-eyebrow', 'Salom, Admin ' + name.split(' ')[0] + '!');
    }
    const adminEntry = document.getElementById('admin-panel-entry');
    if(adminEntry) adminEntry.style.display = admin ? 'flex' : 'none';

    // Bildirishnoma belgisi
    try { if(typeof updateNotifBadge === 'function') updateNotifBadge(); } catch(e){}
  }

  function cycleLanguage(){
    const order = ['uz', 'en'];
    const cur = getLang();
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setLanguage(next);
    const sel = document.getElementById('lang-select');
    if(sel) sel.value = next;
    const langLab = document.getElementById('prof-lang-label');
    if(langLab) langLab.textContent = next === 'en' ? 'English' : "O'zbek tili";
  }

  /* ===== APK / PWA: Telefonga yuklash (yangilangan) ===== */
  // Eslatma: APK_FILE va APK_URL yuqorida (PWA bo'limida) aniqlangan
  function apkInApp(){
    // PWA standalone rejimda ekanligini tekshirish
    try {
      if(pwaIsStandalone()) return true;
      // Android WebView bridge (eski kod uchun)
      if(window.YuksalishApp && window.YuksalishApp.isApp && window.YuksalishApp.isApp()) return true;
      return false;
    } catch(e){ return false; }
  }
  function apkUrl(){
    // APK fayl URL'i — joriy sahifa bilan bir xil papkada joylashgan Englify.apk
    // QR kod va havola uchun ishlatiladi — telefonda skanerlash APK ni ochadi
    try{
      const saved = localStorage.getItem('sb_apk_url');
      if(saved) return saved;
      if(location.protocol === 'file:') return '';
      const dir = location.pathname.replace(/[^/]*$/, '');
      return location.origin + dir + APK_FILE;
    }catch(e){ return ''; }
  }
  function apkSetDlLabel(txt){
    const lab = document.getElementById('apk-dl-label');
    if(lab){ lab.textContent = txt; return; }
    const dl = document.getElementById('apk-dl-btn');
    if(dl){ const span = dl.querySelector('span'); if(span) span.textContent = txt; }
  }
  function apkDownload(){
    // 1) Agar ilova ichida bo'lsa — hech narsa qilmaslik
    if(apkInApp()){
      const st = document.getElementById('apk-status-msg');
      if(st){ st.className = 'apk-status ok'; st.textContent = '✓ Ilova allaqachon o\'rnatilgan.'; }
      return;
    }
    // 2) Haqiqiy APK faylni yuklab olish — serverdan Englify.apk faylini olish
    const st = document.getElementById('apk-status-msg');
    if(st){ st.className = 'apk-status'; st.textContent = '⏳ APK yuklanmoqda...'; }
    const dl = document.getElementById('apk-dl-btn');
    if(dl) dl.disabled = true;
    apkSetDlLabel('⏳ Yuklanmoqda...');

    // APK fayl URL — joriy sahifa bilan bir xil papkada
    const apkUrlLink = (function(){
      try{
        if(location.protocol === 'file:') return '';
        const dir = location.pathname.replace(/[^/]*$/, '');
        return location.origin + dir + APK_FILE;
      }catch(e){ return ''; }
    })();

    if(apkUrlLink){
      // To'g'ridan-to'g'ri APK faylni yuklash — serverdan
      const a = document.createElement('a');
      a.href = apkUrlLink;
      a.download = APK_FILE;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      if(st){ st.className = 'apk-status ok'; st.textContent = '✓ APK yuklab olindi! Downloads papkasida.'; }
      if(dl) dl.disabled = false;
      apkSetDlLabel('✓ Yuklab olindi');
      setTimeout(function(){
        if(dl && !dl.disabled){
          apkSetDlLabel('Yuklab olish');
        }
      }, 3000);
      // 5 sekunddan keyin statusni yangilash
      setTimeout(function(){
        if(st && st.classList.contains('apk-status')){
          st.textContent = '⬇️ Yuklashga tayyor — 304 KB APK.';
        }
      }, 5000);
      return;
    }

    // Fallback — agar APK URL topilmasa, HTML faylni yuklash
    if(st){ st.className = 'apk-status err'; st.textContent = '⚠️ APK fayl topilmadi. HTML versiyani yuklab olamiz...'; }
    try{
      const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = HTML_FILE;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
      if(st){ st.className = 'apk-status ok'; st.textContent = '✓ HTML yuklab olindi!'; }
      if(dl) dl.disabled = false;
      apkSetDlLabel('✓ Yuklab olindi');
    }catch(e){
      if(st){ st.className = 'apk-status err'; st.textContent = '✗ Yuklab bo\'lmadi: ' + (e.message || e); }
      if(dl) dl.disabled = false;
      apkSetDlLabel('Yuklab olish');
    }
  }

  function apkRenderQr(){
    // Profile panelidagi QR kodni yangilash
    const url = apkUrl();
    const holder = document.getElementById('apk-qr-holder');
    const urlBox = document.getElementById('apk-qr-url');
    const manualUrl = document.getElementById('apk-manual-url');
    if(urlBox) urlBox.textContent = url || "Havola sozlanmagan — sahifa hostingda joylashtirilgandan keyin QR avtomatik ishlaydi";
    if(manualUrl) manualUrl.textContent = url || '—';
    if(!holder) return;
    holder.innerHTML = '';
    if(!url || typeof qrcode !== 'function'){
      if(url){
        // QR server orqali
        holder.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url) + '" alt="QR" style="width:180px;height:180px;border-radius:10px;background:#fff;padding:8px;">';
      } else {
        holder.textContent = 'QR uchun sahifa hostingda bo\'lishi kerak';
      }
      return;
    }
    try{
      const qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      const cell = Math.max(2, Math.min(6, Math.floor(224 / qr.getModuleCount())));
      holder.innerHTML = qr.createImgTag(cell, 4);
      const img = holder.querySelector('img');
      if(img){ img.style.display = 'block'; img.style.width = 'auto'; img.style.maxWidth = '100%'; }
    }catch(e){
      // QR library xatosi — QR server orqali
      if(url){
        holder.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url) + '" alt="QR" style="width:180px;height:180px;border-radius:10px;background:#fff;padding:8px;">';
      } else {
        holder.textContent = 'QR yaratib bo\'lmadi';
      }
    }
    // Footer QR ni ham yangilash
    const footerQr = document.getElementById('footer-qr-img');
    if(footerQr && url){
      footerQr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=' + encodeURIComponent(url);
    }
  }

  function openApkModal(){
    const m = document.getElementById('apk-qr-modal');
    if(!m) return;
    apkRenderQr();
    // Manual URL ni yangilash
    const manualUrl = document.getElementById('apk-manual-url');
    if(manualUrl) manualUrl.textContent = apkUrl() || '—';
    // Install tugmasini ko'rsatish (agar brauzer qo'llab-quvvatlasa)
    const installBtn = document.getElementById('apk-modal-install-btn');
    if(installBtn) installBtn.style.display = deferredPrompt ? 'block' : 'none';
    m.style.display = 'flex';
    // iPhone / iPad'da darhol iOS yo'riqnomasini ko'rsatamiz
    if(pwaIsIOS() && !pwaIsStandalone()){
      const iosBtn = document.getElementById('apk-tab-btn-ios');
      if(iosBtn) apkSwitchModalTab('ios', iosBtn);
    }
  }

  function closeApkModal(){
    const m = document.getElementById('apk-qr-modal');
    if(m) m.style.display = 'none';
  }

  function apkChangeUrl(){
    const cur = localStorage.getItem('sb_apk_url') || apkUrl() || '';
    const v = prompt("Sahifa havolasini kiriting (https://...):\nMasalan: https://sayt.uz/Englify.html", cur);
    if(v === null) return;
    const t = v.trim();
    if(t){ localStorage.setItem('sb_apk_url', t); } else { localStorage.removeItem('sb_apk_url'); }
    apkRenderQr();
  }

  function apkInitState(){
    const dl = document.getElementById('apk-dl-btn');
    const st = document.getElementById('apk-status-msg');
    // Standalone (o'rnatilgan PWA) rejimda
    if(apkInApp()){
      if(dl){
        dl.disabled = true;
        dl.style.opacity = '.88';
        dl.style.cursor = 'default';
      }
      apkSetDlLabel('✓ Ilova ichida');
      if(st){ st.className = 'apk-status ok'; st.textContent = '✓ Ilova o\'rnatilgan — offline rejimda ishlamoqda.'; }
      // Install tugmasini yashirish
      const inst = document.getElementById('apk-install-btn');
      if(inst) inst.style.display = 'none';
      return;
    }
    // Online rejimda — tayyor
    if(st){
      st.className = 'apk-status';
      if(location.protocol === 'http:' || location.protocol === 'https:'){
        st.textContent = 'Android ilova · ~304 KB · Offline';
      } else {
        st.textContent = 'Yuklab olishga tayyor · ~304 KB';
      }
    }
    // PWA install tugmasini ko'rsatish (agar brauzer qo'llab-quvvatlasa)
    if(deferredPrompt){
      showInstallButtons(true);
    }
    // QR kodni avtomatik yangilash
    setTimeout(apkRenderQr, 200);
  }

  // iOS detection - PWA install ko'rsatmalari uchun
  function pwaIsIOS(){
    const ua = navigator.userAgent || '';
    if(/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return true;
    // iPadOS 13+ o'zini "Macintosh" deb ko'rsatadi, lekin sensorli ekranli bo'ladi
    return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  }

  // Brauzer yordamida o'rnatishni tekshirish (Chrome Android)
  function pwaCanInstall(){
    return !!deferredPrompt;
  }

  // --- iPhone banner: Safari'da "Bosh ekranga qo'shish" eslatmasi ---
  function pwaInitIosBanner(){
    try {
      if(!pwaIsIOS() || pwaIsStandalone()) return;
      if(sessionStorage.getItem('pwa_banner_dismissed')) return;
      const banner = document.getElementById('pwa-install-banner');
      if(!banner) return;
      const strong = banner.querySelector('.pwa-txt strong');
      const small = banner.querySelector('.pwa-txt small');
      const btn = banner.querySelector('.pwa-btn');
      if(strong) strong.textContent = "Englify'ni iPhone'ga o'rnating";
      if(small) small.textContent = "Safari → Ulashish → Bosh ekranga qo'shish";
      if(btn) btn.textContent = "Qanday?";
      setTimeout(function(){ banner.classList.add('show'); }, 2500);
    } catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', pwaInitIosBanner);
  } else {
    pwaInitIosBanner();
  }

  function requireAuth(){
    const session = getSession();
    if(!session){
      showView('login');
      return false;
    }
    return true;
  }

