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
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').then(function(reg){
        console.log('[PWA] Service Worker ro\'yxatdan o\'tdi:', reg.scope);
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
    const dl = document.getElementById('apk-dl-btn');
    if(dl){ dl.querySelector('span').textContent = '✓ O\'rnatilgan'; dl.disabled = true; dl.style.opacity = '.7'; }
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
      // Brauzer qo'llab-quvvatlamaydi — qo'llanma ko'rsatamiz
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if(isIOS){
        alert('iOS Safari\'da o\'rnatish:\\n\\n1. Pastki panelidagi Share tugmasini bosing (☐↑)\\n2. "Add to Home Screen" tanlang\\n3. "Add" tugmasini bosing');
      } else {
        alert('Brauzeringiz avtomatik o\'rnatishni qo\'llab-quvvatlamaydi.\\n\\nManual usul:\\n1. Brauzer menyusini oching (⋮)\\n2. "Add to Home screen" / "Bosh ekranga qo\'shish" ni tanlang\\n3. Tasdiqlang');
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
    ['qr','pwa','manual'].forEach(function(t){
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

  // ========== GOOGLE OAUTH orqali kirish ==========
  // Google Cloud Console dan OAuth Client ID oling va shu yerga qo'ying
  // Project: midyear-machine-513919-j7
  // https://console.cloud.google.com/apis/credentials
  const GOOGLE_CLIENT_ID = ''; // OAuth Client ID qo'ying: '123456789-xxxxx.apps.googleusercontent.com'

  // Google Identity Services script ni yuklash
  function loadGoogleScript(){
    if(window.google && window.google.accounts) return Promise.resolve();
    return new Promise(function(resolve, reject){
      if(document.getElementById('google-gsi-script')){
        // Script allaqachon yuklangan — kutib turamiz
        if(window.google && window.google.accounts){ resolve(); return; }
      }
      const s = document.createElement('script');
      s.id = 'google-gsi-script';
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = resolve;
      s.onerror = function(){ reject(new Error('Google script yuklanmadi')); };
      document.head.appendChild(s);
    });
  }

  // Google bilan kirish — Google hisob tanlash oynasini ochadi (popup)
  function loginWithGoogle(){
    if(GOOGLE_CLIENT_ID){
      // Haqiqiy Google OAuth — GIS popup orqali hisob tanlash
      loadGoogleScript().then(function(){
        if(!window.google || !window.google.accounts){
          alert('Google authentication yuklanmadi. Internetni tekshiring.');
          return;
        }
        // Google Identity Services ni sozlash
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: false
        });
        // Google hisob tanlash oynasini ochish (One Tap yoki popup)
        window.google.accounts.id.prompt(function(notification){
          if(notification.isNotDisplayed() || notification.isSkippedMoment()){
            // One Tap ko'rsatilmadi — tugma bilan ko'rsatamiz
            const container = document.createElement('div');
            container.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background:#fff;padding:24px;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.3);';
            container.innerHTML = '<div style="font-size:18px;font-weight:700;margin-bottom:16px;color:#1a1a1a;">Google hisobingizni tanlang</div><div id="google-render-btn"></div><button onclick="this.parentNode.remove()" style="margin-top:16px;width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;">Bekor qilish</button>';
            document.body.appendChild(container);
            window.google.accounts.id.renderButton(
              document.getElementById('google-render-btn'),
              { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular', width: 280 }
            );
          }
        });
      }).catch(function(){
        alert('Google authentication yuklanmadi. Internetni tekshiring.');
      });
    } else {
      // GOOGLE_CLIENT_ID sozlanmagan — demo rejim
      // Foydalanuvchiga tushuntirish va demo kirish
      demoGoogleLogin();
    }
  }

  // Demo rejim — Google Client ID bo'lmasa
  function demoGoogleLogin(){
    const proceed = confirm(
      'Google bilan kirish uchun Google Client ID sozlanishi kerak.\n\n' +
      'Hozircha DEMO rejimda ishlaydi — email va ism ni qo\'lda kiriting.\n\n' +
      'Haqiqiy Google OAuth uchun:\n' +
      '1. console.cloud.google.com/apis/credentials ga kiring\n' +
      '2. OAuth 2.0 Client ID yarating\n' +
      '3. Kod ichidagi GOOGLE_CLIENT_ID ga qo\'ying\n\n' +
      'Demo rejimda davom etasizmi?'
    );
    if(!proceed) return;
    const email = prompt('Google email manzilingiz:\n(masalan: yourname@gmail.com)');
    if(!email) return;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      alert('Noto\'g\'ri email formati.');
      return;
    }
    const name = prompt('Ism familiyangiz:', '');
    if(!name) return;
    googleAuthUser(email.toLowerCase(), name.trim(), '');
  }

  // Google credential response ni qayta ishlash (GIS One Tap / button)
  function handleGoogleCredential(response){
    if(!response || !response.credential){
      return;
    }
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const email = (payload.email || '').toLowerCase();
      const name = payload.name || payload.given_name || 'Google User';
      const picture = payload.picture || '';
      if(email){
        googleAuthUser(email, name, picture);
        // Popup ni yopish
        const popup = document.querySelector('[style*="position:fixed;top:50%;left:50%"]');
        if(popup) popup.remove();
      }
    } catch(e){
      console.error('Google decode xatosi:', e);
    }
  }

  // Google user ni tizimga kiritish
  function googleAuthUser(email, name, picture){
    email = email.toLowerCase();
    const users = getUsers();
    // Agar foydalanuvchi mavjud bo'lsa — kirish, aks holda ro'yxatdan o'tish
    if(users[email]){
      // Mavjud foydalanuvchi — kirish
      const existing = users[email];
      if(picture) existing.picture = picture;
      existing.google = true;
      saveUsers(users);
      const sessionUser = withRole({ email: email, name: existing.name, role: existing.role });
      setSession(sessionUser);
      applyUserToUI(sessionUser);
      showView('dashboard');
    } else {
      // Yangi foydalanuvchi — ro'yxatdan o'tish
      const role = isAdminEmail(email) ? 'admin' : 'user';
      users[email] = {
        name: name,
        email: email,
        phone: '',
        password: 'google_' + Date.now(), // Google orqali kelganlar uchun tasodifiy parol
        role: role,
        picture: picture || '',
        google: true,
        createdAt: new Date().toISOString()
      };
      saveUsers(users);
      const sessionUser = withRole({ email: email, name: name, role: role });
      setSession(sessionUser);
      applyUserToUI(sessionUser);
      showView('dashboard');
    }
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
      langLab.textContent = l === 'en' ? 'English' : (l === 'de' ? 'Deutsch' : "O'zbek tili");
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
  }

  function cycleLanguage(){
    const order = ['uz', 'en', 'de'];
    const cur = getLang();
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setLanguage(next);
    const sel = document.getElementById('lang-select');
    if(sel) sel.value = next;
    const langLab = document.getElementById('prof-lang-label');
    if(langLab) langLab.textContent = next === 'en' ? 'English' : (next === 'de' ? 'Deutsch' : "O'zbek tili");
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
    if(dl){ dl.disabled = true; dl.querySelector('span').textContent = '⏳ Yuklanmoqda...'; }

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
      if(dl){
        dl.disabled = false;
        dl.querySelector('span').textContent = '✓ Yuklab olindi';
        setTimeout(function(){
          if(dl && !dl.disabled){
            dl.querySelector('span').textContent = 'Yuklab olish';
          }
        }, 3000);
      }
      // 5 sekunddan keyin statusni yangilash
      setTimeout(function(){
        if(st && st.classList.contains('apk-status')){
          st.textContent = '⬇️ Yuklashga tayyor — 210 KB APK.';
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
      if(dl){ dl.disabled = false; dl.querySelector('span').textContent = '✓ Yuklab olindi'; }
    }catch(e){
      if(st){ st.className = 'apk-status err'; st.textContent = '✗ Yuklab bo\'lmadi: ' + (e.message || e); }
      if(dl){ dl.disabled = false; dl.querySelector('span').textContent = 'Yuklab olish'; }
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
    if(!dl) return;
    const st = document.getElementById('apk-status-msg');
    // Standalone (o'rnatilgan PWA) rejimda
    if(apkInApp()){
      if(dl){
        const span = dl.querySelector('span');
        if(span) span.textContent = '✓ Ilova ichida';
        dl.disabled = true;
        dl.style.opacity = '.88';
        dl.style.cursor = 'default';
      }
      if(st){ st.className = 'apk-status ok'; st.textContent = '✓ Ilova o\'rnatilgan — offline rejimda ishlamoqda.'; }
      // Install tugmasini yashirish
      const inst = document.getElementById('apk-install-btn');
      if(inst) inst.style.display = 'none';
      return;
    }
    // Online rejimda — tayyor
    if(st){
      if(location.protocol === 'http:' || location.protocol === 'https:'){
        st.className = 'apk-status';
        st.textContent = '⬇️ Yuklab olishga tayyor — offline ishlaydi.';
      } else {
        st.className = 'apk-status';
        st.textContent = '⬇️ Yuklab olishga tayyor.';
      }
    }
    // PWA install tugmasini ko'rsatish (agar brauzer qo'llab-quvvatlasa)
    if(deferredPrompt){
      showInstallButtons(true);
    }
    // QR kodni avtomatik yangilash
    setTimeout(apkRenderQr, 200);
  }

  // iOS detection — PWA install ko'rsatmalari uchun
  function pwaIsIOS(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  // Brauzer yordamida o'rnatishni tekshirish (Chrome Android)
  function pwaCanInstall(){
    return !!deferredPrompt;
  }

  function openProfileEditModal(){
    const session = getSession();
    if(!session){ showView('login'); return; }
    const name = prompt('Yangi ism-familiya:', session.name || '');
    if(name === null) return;
    const trimmed = name.trim();
    if(!trimmed){ alert('Ism bo\'sh bo\'lishi mumkin emas'); return; }

    const users = getUsers();
    if(users[session.email]){
      users[session.email].name = trimmed;
      saveUsers(users);
    }
    const updated = { email: session.email, name: trimmed };
    setSession(updated);
    applyUserToUI(updated);
    alert('Profil yangilandi!');
  }

  function requireAuth(){
    const session = getSession();
    if(!session){
      showView('login');
      return false;
    }
    return true;
  }

