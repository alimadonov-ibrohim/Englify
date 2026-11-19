// Englify — admin
  // ========== ADMIN PANEL (localStorage DB) ==========
  const ADB = {
    usersKey: 'sb_users',
    coursesKey: 'sb_admin_courses',
    testsKey: 'sb_admin_tests',
    resultsKey: 'sb_admin_results',
    dictKey: 'sb_admin_dict',
    notifKey: 'sb_admin_notif',
    logsKey: 'sb_admin_logs',
    certsKey: 'sb_admin_certs',
    settingsKey: 'sb_admin_settings'
  };
  const ADMIN_SETTINGS_DEFAULT = {
    siteName: 'Englify',
    supportEmail: 'support@englify.uz',
    defaultLevel: 'B2',
    dailyQuestions: 15,
    allowRegistration: true,
    maintenance: false,
    announcement: ''
  };
  function adbGet(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch(e){ return fallback; }
  }
  function adbSet(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
  function adminLog(action, target){
    const logs = adbGet(ADB.logsKey, []);
    const s = getSession() || {};
    logs.unshift({ action, target: String(target||''), admin: s.email||'admin', at: new Date().toISOString() });
    adbSet(ADB.logsKey, logs.slice(0, 100));
  }
  function ensureAdminSeed(){
    let courses = adbGet(ADB.coursesKey, null);
    if(!courses){
      courses = [
        {id:1,title:'General English',price:0,duration:6,status:'active',students:0,youtube:'https://youtu.be/d-fvgkbTED0?list=PLkREkayoYCyI9KGsZ2TfeVccRv9zqP0gl&t=5'},
        {id:2,title:'IELTS Preparation',price:0,duration:3,status:'active',students:0,youtube:''}
      ];
      adbSet(ADB.coursesKey, courses);
    }
    let tests = adbGet(ADB.testsKey, null);
    if(!tests){
      tests = [{id:1,title:'Daily Vocabulary Quiz',category:'Vocabulary',status:'published',questions:2}];
      adbSet(ADB.testsKey, tests);
    }
    let dict = adbGet(ADB.dictKey, null);
    if(!dict){
      dict = [
        {id:1,word:'Freedom',translation:'Erkinlik',lang:'en'}
      ];
      adbSet(ADB.dictKey, dict);
    }
    if(adbGet(ADB.settingsKey, null) === null){
      adbSet(ADB.settingsKey, Object.assign({}, ADMIN_SETTINGS_DEFAULT));
    }
    if(adbGet(ADB.certsKey, null) === null){
      adbSet(ADB.certsKey, []);
    }
  }

  /* ===================== SHARED USER / RESULT CACHE ===================== */
  /* Admin panel lokal (localStorage) va server (backend API) ma'lumotlarini
     birlashtiradi. Shu tufayli boshqa qurilmada email bilan ro'yxatdan o'tgan
     foydalanuvchi ham Foydalanuvchilar bo'limida ko'rinadi. */
  const ADMIN_BUILTIN_ADMINS = ['alimardonovio11@gmail.com', 'admin@englify.uz'];
  const adminState = {
    tab: 'dash',
    serverUsers: [],
    serverUsersError: '',
    usersLoading: false,
    serverResults: [],
    resultsError: '',
    resultsLoading: false,
    usersQuery: ''
  };

  function adminEsc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function adminToken(){
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch(e){ return ''; }
  }

  async function adminFetch(method, path, body){
    const headers = { 'Content-Type': 'application/json' };
    const token = adminToken();
    if(token) headers['Authorization'] = 'Bearer ' + token;
    const ctrl = new AbortController();
    const timer = setTimeout(function(){ try { ctrl.abort(); } catch(e){} }, 15000);
    let res;
    try {
      res = await fetch(API_BASE + path, {
        method: method || 'GET',
        headers: headers,
        body: (body === undefined || body === null) ? undefined : JSON.stringify(body),
        signal: ctrl.signal
      });
    } finally {
      clearTimeout(timer);
    }
    let data = null;
    try { data = await res.json(); } catch(e){ data = null; }
    if(!res.ok){
      const err = new Error((data && data.detail) || ('HTTP ' + res.status));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  function adminLocalUsersMap(){
    const map = {};
    const local = adbGet(ADB.usersKey, {});
    Object.keys(local).forEach(function(key){
      const u = local[key] || {};
      const email = String(u.email || key || '').trim().toLowerCase();
      if(!email) return;
      map[email] = {
        name: String(u.name || ''),
        email: email,
        phone: String(u.phone || ''),
        role: isAdminEmail(email) ? 'admin' : String(u.role || 'user'),
        status: String(u.status || 'active'),
        provider: String(u.provider || 'password'),
        createdAt: String(u.createdAt || ''),
        lastLoginAt: String(u.lastLoginAt || ''),
        source: 'local'
      };
    });

    const session = getSession();
    if(session && session.email){
      const email = String(session.email).toLowerCase();
      if(!map[email]){
        map[email] = {
          name: String(session.name || ''),
          email: email,
          phone: String(session.phone || ''),
          role: isAdminEmail(email) ? 'admin' : String(session.role || 'user'),
          status: 'active',
          provider: 'session',
          createdAt: '',
          lastLoginAt: '',
          source: 'local'
        };
      }
    }

    // Test progress kalitlaridan emailni aniqlaymiz (ism bo'lmasa ham ro'yxatda turadi)
    try {
      for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        if(!key || key.indexOf('sb_progress_') !== 0) continue;
        const email = key.slice('sb_progress_'.length).trim().toLowerCase();
        if(!email || map[email]) continue;
        map[email] = {
          name: '',
          email: email,
          phone: '',
          role: isAdminEmail(email) ? 'admin' : 'user',
          status: 'active',
          provider: 'local',
          createdAt: '',
          lastLoginAt: '',
          source: 'local'
        };
      }
    } catch(e){}

    return map;
  }

  function adminMergedUsers(){
    const map = adminLocalUsersMap();
    adminState.serverUsers.forEach(function(u){
      if(!u || !u.email) return;
      const email = String(u.email).toLowerCase();
      const local = map[email] || {};
      map[email] = {
        name: String(u.name || local.name || ''),
        email: email,
        phone: String(u.phone || local.phone || ''),
        role: isAdminEmail(email) ? 'admin' : String(u.role || local.role || 'user'),
        status: String(u.status || local.status || 'active'),
        provider: String(u.provider || local.provider || 'password'),
        createdAt: String(u.createdAt || local.createdAt || ''),
        lastLoginAt: String(u.lastLoginAt || local.lastLoginAt || ''),
        source: local.email ? 'local+server' : 'server',
        server: true
      };
    });
    return Object.keys(map).map(function(k){ return map[k]; }).sort(function(a, b){
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
    });
  }

  function adminRefreshUsers(force){
    if(!adminToken()){
      adminState.serverUsers = [];
      adminState.serverUsersError = 'no-token';
      return Promise.resolve(false);
    }
    if(adminState.usersLoading) return adminState.usersPromise || Promise.resolve(false);
    adminState.usersLoading = true;
    adminState.usersPromise = adminFetch('GET', '/api/auth/users')
      .then(function(data){
        adminState.serverUsers = (data && Array.isArray(data.users)) ? data.users : (Array.isArray(data) ? data : []);
        adminState.serverUsersError = '';
        return true;
      })
      .catch(function(err){
        adminState.serverUsers = [];
        adminState.serverUsersError = err.status === 401
          ? 'no-auth'
          : (err.name === 'AbortError' ? 'Server javob bermadi (timeout)' : (err.message || 'error'));
        return false;
      })
      .then(function(ok){
        adminState.usersLoading = false;
        if(adminState.tab === 'users'){
          adminRenderUsers();
          adminUpdateUserStats();
        } else if(adminState.tab === 'dash'){
          adminRenderDash();
        } else if(adminState.tab === 'stats'){
          adminRenderStats();
        } else if(adminState.tab === 'admins'){
          adminRenderAdmins();
        }
        return ok;
      });
    return adminState.usersPromise;
  }

  function adminResultsLocal(){
    const list = adbGet(ADB.resultsKey, []);
    return Array.isArray(list) ? list : [];
  }

  function adminMergedResults(){
    const map = {};
    adminResultsLocal().forEach(function(r){
      const key = String(r.email || r.student || '') + '|' + String(r.type || r.test || '') + '|' + String(r.date || '').slice(0, 10);
      map[key] = Object.assign({}, r, { source: 'local' });
    });
    adminState.serverResults.forEach(function(r){
      if(!r) return;
      const key = String(r.email || r.student || '') + '|' + String(r.type || r.test || '') + '|' + String(r.date || '').slice(0, 10);
      map[key] = Object.assign({}, map[key] || {}, r, { source: map[key] ? 'local+server' : 'server' });
    });
    return Object.keys(map).map(function(k){ return map[k]; }).sort(function(a, b){
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function adminRefreshResults(){
    if(!adminToken()){
      adminState.serverResults = [];
      adminState.resultsError = 'no-token';
      return Promise.resolve(false);
    }
    if(adminState.resultsLoading) return adminState.resultsPromise || Promise.resolve(false);
    adminState.resultsLoading = true;
    adminState.resultsPromise = adminFetch('GET', '/api/results')
      .then(function(data){
        adminState.serverResults = (data && Array.isArray(data.results)) ? data.results : (Array.isArray(data) ? data : []);
        adminState.resultsError = '';
        return true;
      })
      .catch(function(err){
        adminState.serverResults = [];
        adminState.resultsError = err.status === 401
          ? 'no-auth'
          : (err.name === 'AbortError' ? 'Server javob bermadi (timeout)' : (err.message || 'error'));
        return false;
      })
      .then(function(ok){
        adminState.resultsLoading = false;
        if(adminState.tab === 'results') adminRenderResults();
        else if(adminState.tab === 'dash') adminRenderDash();
        else if(adminState.tab === 'stats') adminRenderStats();
        return ok;
      });
    return adminState.resultsPromise;
  }

  function adminServerNote(){
    if(adminState.serverUsersError === 'no-token' || adminState.serverUsersError === 'no-auth'){
      return '<div style="background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:12px;padding:10px 14px;font-size:12.5px;margin-bottom:14px;">' +
        '⚠️ Serverdagi foydalanuvchilar ko‘rinmayapti — admin sifatida <b>parol bilan</b> qayta kiring. Hozir faqat shu brauzerdagi hisoblar ko‘rsatilmoqda.</div>';
    }
    if(adminState.serverUsersError && adminState.serverUsersError !== 'error'){
      return '<div style="background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:12px;padding:10px 14px;font-size:12.5px;margin-bottom:14px;">Server bilan aloqa: ' +
        adminEsc(adminState.serverUsersError) + '</div>';
    }
    return '';
  }

  function adminEmailArg(email){
    return encodeURIComponent(String(email || '')).replace(/'/g, '%27');
  }

  function adminStatCard(label, value, hint, id){
    return '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;">' +
      '<div style="font-size:12px;color:var(--ink-soft);font-weight:600;">' + adminEsc(label) + '</div>' +
      '<div style="font-family:Fraunces,serif;font-size:27px;font-weight:700;color:var(--blue-deep);margin-top:4px;">' + (id ? '<span id="' + adminEsc(id) + '">' + adminEsc(value) + '</span>' : adminEsc(value)) + '</div>' +
      (hint ? '<div style="font-size:11.5px;color:var(--ink-soft);margin-top:2px;">' + adminEsc(hint) + '</div>' : '') +
    '</div>';
  }

  function adminModal(title, body, footer){
    adminCloseModal();
    const wrap = document.createElement('div');
    wrap.id = 'admin-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';
    wrap.innerHTML = '<div style="background:var(--card);border-radius:18px;max-width:560px;width:100%;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,.35);max-height:90vh;overflow:auto;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
        '<strong style="font-size:16px;">' + adminEsc(title) + '</strong>' +
        '<button type="button" onclick="adminCloseModal()" style="border:none;background:transparent;font-size:22px;cursor:pointer;line-height:1;color:var(--ink-soft);">×</button>' +
      '</div><div>' + body + '</div>' +
      (footer ? '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;flex-wrap:wrap;">' + footer + '</div>' : '') +
    '</div>';
    wrap.addEventListener('click', function(e){ if(e.target === wrap) adminCloseModal(); });
    document.body.appendChild(wrap);
  }

  function adminCloseModal(){
    const m = document.getElementById('admin-modal');
    if(m) m.remove();
  }

  function adminShow(tab){
    ensureAdminSeed();
    adminState.tab = tab;
    const s = getSession() || {};
    const nameEl = document.getElementById('admin-ui-name');
    const emailEl = document.getElementById('admin-ui-email');
    if(nameEl) nameEl.textContent = s.name || 'Admin';
    if(emailEl) emailEl.textContent = s.email || '';
    document.querySelectorAll('#admin-sidebar .dash-nav-link[data-ap]').forEach(a=>{
      a.classList.toggle('active', a.getAttribute('data-ap')===tab);
    });
    const titles = {dash:'Dashboard',ai:'AI Admin',users:'Foydalanuvchilar',courses:'Kurslar',tests:'Testlar',results:'Natijalar',dict:"Lug'at",notif:'Bildirishnomalar',certs:'Sertifikatlar',stats:'Statistika',admins:'Adminlar',backup:'Zaxira nusxa',settings:'Sozlamalar',logs:'Loglar'};
    const pt = document.getElementById('admin-page-title');
    if(pt) pt.textContent = titles[tab] || 'Admin';
    const box = document.getElementById('admin-content');
    if(!box) return;

    if(tab==='dash'){
      adminRefreshUsers();
      adminRefreshResults();
      adminRenderDash();
    }

    if(tab==='ai'){
      adminRenderAI();
    }

    if(tab==='users'){
      adminRefreshUsers();
      adminRenderUsersPanel();
    }

    if(tab==='stats'){
      adminRefreshUsers();
      adminRefreshResults();
      adminRenderStats();
    }

    if(tab==='admins'){
      adminRefreshUsers();
      adminRenderAdmins();
    }

    if(tab==='backup'){
      adminRenderBackup();
    }

    if(tab==='courses'){
      const courses = adbGet(ADB.coursesKey, []);
      box.innerHTML = `
        <div style="margin-bottom:14px;"><button class="dash-btn dash-btn-primary" onclick="adminAddCourse()">+ Kurs</button></div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">Nom</th><th style="padding:12px;text-align:left;">Oy</th>
              <th style="padding:12px;text-align:left;">Status</th><th style="padding:12px;text-align:left;">Amallar</th>
            </tr></thead>
            <tbody>${courses.map(c=>`<tr>
              <td style="padding:12px;border-top:1px solid var(--line);">${c.title}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${c.duration}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${c.status}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">
                <button class="dash-btn dash-btn-outline" style="padding:4px 10px;" onclick="adminToggleCourse(${c.id})">${c.status==='active'?'Deaktiv':'Aktiv'}</button>
                <button class="dash-btn" style="padding:4px 10px;background:#fee2e2;color:#b91c1c;" onclick="adminDelCourse(${c.id})">🗑</button>
              </td></tr>`).join('')}</tbody>
          </table>
        </div>`;
    }

    if(tab==='tests'){
      const tests = adbGet(ADB.testsKey, []);
      box.innerHTML = `
        <div style="margin-bottom:14px;"><button class="dash-btn dash-btn-primary" onclick="adminAddTest()">+ Test</button></div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">Nom</th><th style="padding:12px;text-align:left;">Category</th>
              <th style="padding:12px;text-align:left;">Status</th><th style="padding:12px;text-align:left;">Amallar</th>
            </tr></thead>
            <tbody>${tests.map(t=>`<tr>
              <td style="padding:12px;border-top:1px solid var(--line);">${t.title}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${t.category||''}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${t.status}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">
                <button class="dash-btn dash-btn-outline" style="padding:4px 10px;" onclick="adminPublishTest(${t.id})">Publish</button>
                <button class="dash-btn" style="padding:4px 10px;background:#fee2e2;color:#b91c1c;" onclick="adminDelTest(${t.id})">🗑</button>
              </td></tr>`).join('')}</tbody>
          </table>
        </div>`;
    }

    if(tab==='results'){
      adminRefreshResults();
      adminRenderResults();
    }

    if(tab==='dict'){
      const dict = adbGet(ADB.dictKey, []);
      box.innerHTML = `
        <div style="margin-bottom:14px;display:flex;gap:10px;flex-wrap:wrap;">
          <input id="ad-q" placeholder="Qidiruv..." style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;flex:1;" oninput="adminRenderDict()">
          <button class="dash-btn dash-btn-primary" onclick="adminAddWord()">+ So‘z</button>
        </div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">So‘z</th><th style="padding:12px;text-align:left;">Tarjima</th>
              <th style="padding:12px;text-align:left;">Til</th><th style="padding:12px;text-align:left;">Amallar</th>
            </tr></thead>
            <tbody id="ad-body"></tbody>
          </table>
        </div>`;
      window._adminDictCache = dict;
      adminRenderDict();
    }

    if(tab==='notif'){
      const list = adbGet(ADB.notifKey, []);
      box.innerHTML = `
        <div style="margin-bottom:14px;"><button class="dash-btn dash-btn-primary" onclick="adminSendNotif()">+ Bildirishnoma</button></div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">Sarlavha</th><th style="padding:12px;text-align:left;">Xabar</th><th style="padding:12px;text-align:left;">Sana</th>
            </tr></thead>
            <tbody>${list.length?list.map(n=>`<tr>
              <td style="padding:12px;border-top:1px solid var(--line);">${n.title}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${n.message}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${(n.at||'').slice(0,16)}</td>
            </tr>`).join(''):'<tr><td colspan="3" style="padding:20px;text-align:center;color:var(--ink-soft);">Bo‘sh</td></tr>'}</tbody>
          </table>
        </div>`;
    }

    if(tab==='certs'){
      const certs = adbGet(ADB.certsKey, []);
      const month = new Date().toISOString().slice(0,7);
      const today = new Date().toISOString().slice(0,10);
      const thisMonth = certs.filter(c => String(c.date||'').slice(0,7) === month).length;
      const types = {};
      certs.forEach(c => { types[c.type||'other'] = (types[c.type||'other']||0)+1; });
      box.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:18px;">
          ${[
            ['Jami sertifikatlar', certs.length],
            ['Shu oyda berilgan', thisMonth],
            ['IELTS', types.ielts||0],
            ['Kurs', types.course||0]
          ].map(([l,n])=>`<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">
            <div style="font-size:12px;color:var(--ink-soft);font-weight:600;">${l}</div>
            <div style="font-family:Fraunces,serif;font-size:28px;font-weight:700;color:var(--blue-deep);margin-top:6px;">${n}</div>
          </div>`).join('')}
        </div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:18px;">
          <strong style="font-size:14px;">Yangi sertifikat berish</strong>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-top:12px;">
            <input id="ac-student" placeholder="O‘quvchi ismi" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">
            <select id="ac-type" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">
              <option value="ielts">IELTS Mock</option>
              <option value="course">Kurs bitiruv</option>
            </select>
            <input id="ac-band" placeholder="Band / daraja (7.0)" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">
            <input id="ac-date" type="date" value="${today}" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">
          </div>
          <button class="dash-btn dash-btn-primary" style="margin-top:12px;" onclick="adminIssueCert()">+ Sertifikat berish</button>
        </div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">O‘quvchi</th><th style="padding:12px;text-align:left;">Turi</th>
              <th style="padding:12px;text-align:left;">Band</th><th style="padding:12px;text-align:left;">Kod</th>
              <th style="padding:12px;text-align:left;">Sana</th><th style="padding:12px;text-align:left;">Amallar</th>
            </tr></thead>
            <tbody>${certs.length?certs.map(c=>`<tr>
              <td style="padding:12px;border-top:1px solid var(--line);">${adminAIEsc(c.student||'')}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${adminAIEsc(c.title||c.type||'')}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${adminAIEsc(c.band||'')}</td>
              <td style="padding:12px;border-top:1px solid var(--line);font-family:monospace;">${adminAIEsc(c.code||'')}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${adminAIEsc(c.date||'')}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">
                <button class="dash-btn dash-btn-outline" style="padding:4px 10px;" onclick="adminCopyCert('${adminAIEsc(c.code||'')}')">Nusxa</button>
                <button class="dash-btn" style="padding:4px 10px;background:#fee2e2;color:#b91c1c;" onclick="adminDelCert(${c.id})">🗑</button>
              </td></tr>`).join(''):'<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--ink-soft);">Sertifikatlar yo‘q</td></tr>'}</tbody>
          </table>
        </div>`;
    }

    if(tab==='settings'){
      const st = adminGetSettings();
      const levelOpts = ['A2','B1','B2','C1'].map(l=>`<option value="${l}"${st.defaultLevel===l?' selected':''}>${l}</option>`).join('');
      box.innerHTML = `
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:18px;max-width:760px;">
          <strong style="font-size:15px;">Sayt sozlamalari</strong>
          <p style="font-size:12.5px;color:var(--ink-soft);margin:6px 0 16px;">Bu sozlamalar shu brauzerda saqlanadi va sayt nomi kabi ko‘rinishlarga qo‘llanadi.</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;">
            <label style="display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:700;color:var(--ink-soft);">Sayt nomi
              <input id="as-site" value="${adminAIEsc(st.siteName)}" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-weight:400;">
            </label>
            <label style="display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:700;color:var(--ink-soft);">Qo‘llab-quvvatlash email
              <input id="as-email" type="email" value="${adminAIEsc(st.supportEmail)}" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-weight:400;">
            </label>
            <label style="display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:700;color:var(--ink-soft);">Standart daraja
              <select id="as-level" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-weight:400;">${levelOpts}</select>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:700;color:var(--ink-soft);">Daily savollar soni
              <input id="as-daily" type="number" min="5" max="50" value="${Number(st.dailyQuestions)||15}" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-weight:400;">
            </label>
          </div>
          <label style="display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:700;color:var(--ink-soft);margin-top:14px;">E’lon (ixtiyoriy)
            <textarea id="as-ann" rows="2" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-weight:400;resize:vertical;">${adminAIEsc(st.announcement)}</textarea>
          </label>
          <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:16px;">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;cursor:pointer;">
              <input id="as-reg" type="checkbox"${st.allowRegistration?' checked':''}> Ro‘yxatdan o‘tishga ruxsat
            </label>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;cursor:pointer;">
              <input id="as-maint" type="checkbox"${st.maintenance?' checked':''}> Texnik xizmat rejimi
            </label>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;">
            <button class="dash-btn dash-btn-primary" onclick="adminSaveSettings()">💾 Saqlash</button>
            <button class="dash-btn dash-btn-outline" onclick="adminResetSettings()">↺ Standart holat</button>
          </div>
        </div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:18px;max-width:760px;">
          <strong style="font-size:15px;color:#b91c1c;">Xavfli zona</strong>
          <p style="font-size:12.5px;color:var(--ink-soft);margin:6px 0 14px;">Bu amallarni qaytarib bo‘lmaydi. Avval CSV eksport qilib oling.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="dash-btn dash-btn-outline" style="color:#b91c1c;border-color:#fecaca;" onclick="adminClearResults()">Natijalarni tozalash</button>
            <button class="dash-btn dash-btn-outline" style="color:#b91c1c;border-color:#fecaca;" onclick="adminClearLogs()">Loglarni tozalash</button>
            <button class="dash-btn" style="background:#fee2e2;color:#b91c1c;" onclick="adminClearAllData()">Barcha admin ma’lumotlari</button>
          </div>
        </div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;max-width:760px;">
          <strong style="font-size:15px;">Tizim ma’lumotlari</strong>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:12px;font-size:13px;">
            <div><span style="color:var(--ink-soft);">Versiya:</span> <b>1.0</b></div>
            <div><span style="color:var(--ink-soft);">Platforma:</span> <b>Web / PWA</b></div>
            <div><span style="color:var(--ink-soft);">Ma’lumotlar:</span> <b>localStorage</b></div>
            <div><span style="color:var(--ink-soft);">Sertifikatlar:</span> <b>${adbGet(ADB.certsKey, []).length}</b></div>
          </div>
        </div>`;
    }

    if(tab==='logs'){
      const logs = adbGet(ADB.logsKey, []);
      box.innerHTML = `
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">Admin</th><th style="padding:12px;text-align:left;">Action</th>
              <th style="padding:12px;text-align:left;">Target</th><th style="padding:12px;text-align:left;">Vaqt</th>
            </tr></thead>
            <tbody>${logs.length?logs.map(l=>`<tr>
              <td style="padding:12px;border-top:1px solid var(--line);">${l.admin}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${l.action}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${l.target}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${(l.at||'').slice(0,19)}</td>
            </tr>`).join(''):'<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--ink-soft);">Loglar yo‘q</td></tr>'}</tbody>
          </table>
        </div>`;
    }
  }

  /* ===================== DASHBOARD ===================== */
  function adminRenderDash(){
    const box = document.getElementById('admin-content');
    if(!box) return;
    const users = adminMergedUsers();
    const courses = adbGet(ADB.coursesKey, []);
    const tests = adbGet(ADB.testsKey, []);
    const results = adminMergedResults();
    const certs = adbGet(ADB.certsKey, []);
    const today = new Date().toISOString().slice(0, 10);
    const todayReg = users.filter(function(u){ return String(u.createdAt || '').slice(0, 10) === today; }).length;
    const activeUsers = users.filter(function(u){ return u.status !== 'blocked'; }).length;
    const admins = users.filter(function(u){ return u.role === 'admin'; }).length;
    const serverOk = !!adminToken();

    box.innerHTML = adminServerNote() +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:22px;">' +
        adminStatCard('Jami foydalanuvchilar', users.length, serverOk ? 'server + lokal' : 'faqat lokal') +
        adminStatCard('Bugun ro‘yxatdan', todayReg) +
        adminStatCard('Aktiv foydalanuvchilar', activeUsers) +
        adminStatCard('Adminlar', admins) +
        adminStatCard('Jami kurslar', courses.length) +
        adminStatCard('Jami testlar', tests.length) +
        adminStatCard('Natijalar', results.length) +
        adminStatCard('Sertifikatlar', certs.length) +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">' +
        '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">' +
            '<strong>Yangi foydalanuvchilar</strong>' +
            '<button class="dash-btn dash-btn-outline" style="padding:4px 10px;font-size:12px;" onclick="adminShow(\'users\')">Barchasi</button>' +
          '</div>' +
          (users.length ? '<table style="width:100%;border-collapse:collapse;font-size:13px;">' + users.slice(0, 6).map(function(u){
            return '<tr><td style="padding:7px 0;border-top:1px solid var(--line);">' +
              '<div style="font-weight:600;">' + adminEsc(u.name || 'Ismsiz') + '</div>' +
              '<div style="font-size:11.5px;color:var(--ink-soft);">' + adminEsc(u.email) + '</div></td>' +
              '<td style="padding:7px 0;border-top:1px solid var(--line);text-align:right;font-size:11.5px;color:var(--ink-soft);">' +
              adminEsc(String(u.createdAt || '').slice(0, 10) || '—') + '</td></tr>';
          }).join('') + '</table>' : '<div style="color:var(--ink-soft);font-size:13px;padding:10px 0;">Hozircha foydalanuvchi yo‘q.</div>') +
        '</div>' +
        '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">' +
          '<strong>Tezkor amallar</strong>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">' +
            '<button class="dash-btn dash-btn-primary" onclick="adminShow(\'users\')">Foydalanuvchilar</button>' +
            '<button class="dash-btn dash-btn-outline" onclick="adminShow(\'stats\')">Statistika</button>' +
            '<button class="dash-btn dash-btn-outline" onclick="adminShow(\'courses\')">Kurslar</button>' +
            '<button class="dash-btn dash-btn-outline" onclick="adminShow(\'tests\')">Testlar</button>' +
            '<button class="dash-btn dash-btn-outline" onclick="adminShow(\'certs\')">Sertifikatlar</button>' +
            '<button class="dash-btn dash-btn-outline" onclick="adminShow(\'backup\')">Zaxira</button>' +
            '<button class="dash-btn dash-btn-outline" onclick="adminShow(\'settings\')">Sozlamalar</button>' +
          '</div>' +
          '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line);font-size:12.5px;color:var(--ink-soft);">' +
            'Ulanish: <b style="color:' + (serverOk ? '#15803d' : '#b45309') + ';">' + (serverOk ? 'server + lokal' : 'faqat lokal (parol bilan qayta kiring)') + '</b><br>' +
            'Lokal hisoblar: <b>' + Object.keys(adminLocalUsersMap()).length + '</b> · Server hisoblari: <b>' + adminState.serverUsers.length + '</b>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ===================== FOYDALANUVCHILAR ===================== */
  function adminRenderUsersPanel(){
    const box = document.getElementById('admin-content');
    if(!box) return;
    box.innerHTML = adminServerNote() +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:16px;">' +
        adminStatCard('Jami', '0', '', 'au-total') +
        adminStatCard('Aktiv', '0', '', 'au-active') +
        adminStatCard('Bloklangan', '0', '', 'au-blocked') +
        adminStatCard('Adminlar', '0', '', 'au-admins') +
        adminStatCard('Bugun', '0', '', 'au-today') +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;margin-bottom:14px;">' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
          '<input id="au-q" placeholder="Ism yoki email bo‘yicha qidirish..." value="' + adminEsc(adminState.usersQuery) + '" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;flex:1;min-width:200px;" oninput="adminRenderUsers()">' +
          '<select id="au-role" onchange="adminRenderUsers()" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card);">' +
            '<option value="">Barcha rollar</option><option value="admin">Admin</option><option value="user">O‘quvchi</option>' +
          '</select>' +
          '<select id="au-status" onchange="adminRenderUsers()" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card);">' +
            '<option value="">Barcha holatlar</option><option value="active">Aktiv</option><option value="blocked">Bloklangan</option>' +
          '</select>' +
          '<button class="dash-btn dash-btn-outline" onclick="adminRefreshUsersNow()">↻ Yangilash</button>' +
          '<button class="dash-btn dash-btn-outline" onclick="adminExportUsers()">⬇ CSV</button>' +
          '<button class="dash-btn dash-btn-primary" onclick="adminAddUser()">+ Foydalanuvchi</button>' +
        '</div>' +
        '<div id="au-count" style="font-size:12px;color:var(--ink-soft);margin-top:8px;"></div>' +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:13.5px;min-width:860px;">' +
          '<thead><tr style="background:var(--paper);color:var(--ink-soft);">' +
            '<th style="padding:12px;text-align:left;">Ism</th>' +
            '<th style="padding:12px;text-align:left;">Email</th>' +
            '<th style="padding:12px;text-align:left;">Telefon</th>' +
            '<th style="padding:12px;text-align:left;">Rol</th>' +
            '<th style="padding:12px;text-align:left;">Holat</th>' +
            '<th style="padding:12px;text-align:left;">Ro‘yxatdan o‘tgan</th>' +
            '<th style="padding:12px;text-align:left;">Manba</th>' +
            '<th style="padding:12px;text-align:left;">Amallar</th>' +
          '</tr></thead>' +
          '<tbody id="au-body"></tbody>' +
        '</table>' +
      '</div>';
    adminRenderUsers();
  }

  function adminUpdateUserStats(){
    const users = adminMergedUsers();
    const today = new Date().toISOString().slice(0, 10);
    const set = function(id, val){ const el = document.getElementById(id); if(el) el.textContent = String(val); };
    set('au-total', users.length);
    set('au-active', users.filter(function(u){ return u.status !== 'blocked'; }).length);
    set('au-blocked', users.filter(function(u){ return u.status === 'blocked'; }).length);
    set('au-admins', users.filter(function(u){ return u.role === 'admin'; }).length);
    set('au-today', users.filter(function(u){ return String(u.createdAt || '').slice(0, 10) === today; }).length);
  }

  function adminRenderUsers(){
    const qEl = document.getElementById('au-q');
    if(qEl) adminState.usersQuery = qEl.value || '';
    const q = String(adminState.usersQuery || '').toLowerCase().trim();
    const roleFilter = (document.getElementById('au-role') || {}).value || '';
    const statusFilter = (document.getElementById('au-status') || {}).value || '';
    let users = adminMergedUsers();
    window._adminUsersCache = users;

    if(q){
      users = users.filter(function(u){
        return String(u.email || '').toLowerCase().includes(q) ||
          String(u.name || '').toLowerCase().includes(q) ||
          String(u.phone || '').toLowerCase().includes(q);
      });
    }
    if(roleFilter){
      users = users.filter(function(u){ return (u.role || 'user') === roleFilter; });
    }
    if(statusFilter){
      users = users.filter(function(u){ return (u.status || 'active') === statusFilter; });
    }

    const body = document.getElementById('au-body');
    if(!body) return;

    body.innerHTML = users.map(function(u){
      const emailEnc = adminEmailArg(u.email || '');
      const isBlocked = (u.status || 'active') === 'blocked';
      const role = u.role === 'admin' ? 'admin' : 'user';
      const roleBadge = role === 'admin'
        ? '<span style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:999px;font-size:11.5px;font-weight:700;">Admin</span>'
        : '<span style="background:var(--blue-tint);color:var(--blue-deep);padding:2px 8px;border-radius:999px;font-size:11.5px;font-weight:700;">O‘quvchi</span>';
      const statusBadge = isBlocked
        ? '<span style="background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:999px;font-size:11.5px;font-weight:700;">Bloklangan</span>'
        : '<span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:999px;font-size:11.5px;font-weight:700;">Aktiv</span>';
      const source = u.source === 'server' ? 'server' : (u.source === 'local+server' ? 'server + lokal' : 'lokal');
      return '<tr>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' +
          '<button type="button" onclick="adminViewUser(decodeURIComponent(\'' + emailEnc + '\'))" style="border:none;background:transparent;padding:0;font:inherit;font-weight:600;color:var(--blue-deep);cursor:pointer;text-align:left;">' + adminEsc(u.name || 'Ismsiz') + '</button>' +
          '<div style="font-size:11px;color:var(--ink-soft);">' + adminEsc(u.provider || '') + '</div>' +
        '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(u.email) + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(u.phone || '—') + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' + roleBadge + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' + statusBadge + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(String(u.createdAt || '').slice(0, 10) || '—') + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);font-size:11.5px;color:var(--ink-soft);">' + adminEsc(source) + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);white-space:nowrap;">' +
          '<button class="dash-btn dash-btn-outline" style="padding:4px 9px;font-size:11.5px;" onclick="adminSetUserStatus(decodeURIComponent(\'' + emailEnc + '\'), \'' + (isBlocked ? 'active' : 'blocked') + '\')">' + (isBlocked ? 'Unblock' : 'Block') + '</button> ' +
          '<button class="dash-btn dash-btn-outline" style="padding:4px 9px;font-size:11.5px;" onclick="adminSetUserRole(decodeURIComponent(\'' + emailEnc + '\'), \'' + (role === 'admin' ? 'user' : 'admin') + '\')">' + (role === 'admin' ? 'Demote' : 'Admin') + '</button> ' +
          '<button class="dash-btn" style="padding:4px 9px;font-size:11.5px;background:#fee2e2;color:#b91c1c;" onclick="adminDelUser(decodeURIComponent(\'' + emailEnc + '\'))">🗑</button>' +
        '</td>' +
      '</tr>';
    }).join('') || '<tr><td colspan="8" style="padding:22px;text-align:center;color:var(--ink-soft);">Foydalanuvchi topilmadi. Yangi hisob yaratilsa shu yerda avtomatik ko‘rinadi.</td></tr>';

    const countEl = document.getElementById('au-count');
    if(countEl) countEl.textContent = 'Ko‘rsatilmoqda: ' + users.length + ' ta · Jami: ' + (window._adminUsersCache || []).length + ' ta';
    adminUpdateUserStats();
  }

  function adminRefreshUsersNow(){
    adminState.serverUsersError = '';
    adminRefreshUsers(true).then(function(ok){
      adminRenderUsers();
      if(!ok && adminState.serverUsersError && adminState.serverUsersError !== 'no-token' && adminState.serverUsersError !== 'no-auth'){
        alert('Server bilan aloqa yo‘q: ' + adminState.serverUsersError + '\nLokal hisoblar ko‘rsatilmoqda.');
      }
    });
  }

  function adminViewUser(email){
    email = String(email || '').toLowerCase();
    const u = adminMergedUsers().filter(function(x){ return x.email === email; })[0];
    if(!u) return alert('Foydalanuvchi topilmadi.');
    const isBlocked = (u.status || 'active') === 'blocked';
    const body =
      '<div style="display:grid;grid-template-columns:120px 1fr;gap:10px;font-size:13.5px;">' +
        '<div style="color:var(--ink-soft);">Ism</div><div><b>' + adminEsc(u.name || '—') + '</b></div>' +
        '<div style="color:var(--ink-soft);">Email</div><div>' + adminEsc(u.email) + '</div>' +
        '<div style="color:var(--ink-soft);">Telefon</div><div>' + adminEsc(u.phone || '—') + '</div>' +
        '<div style="color:var(--ink-soft);">Rol</div><div>' + adminEsc(u.role || 'user') + '</div>' +
        '<div style="color:var(--ink-soft);">Holat</div><div>' + adminEsc(u.status || 'active') + '</div>' +
        '<div style="color:var(--ink-soft);">Ro‘yxatdan</div><div>' + adminEsc(String(u.createdAt || '').slice(0, 19).replace('T', ' ') || '—') + '</div>' +
        '<div style="color:var(--ink-soft);">Oxirgi kirish</div><div>' + adminEsc(String(u.lastLoginAt || '').slice(0, 19).replace('T', ' ') || '—') + '</div>' +
        '<div style="color:var(--ink-soft);">Manba</div><div>' + adminEsc(u.source || 'lokal') + '</div>' +
      '</div>';
    const footer =
      '<button class="dash-btn dash-btn-outline" onclick="adminCopyEmail(decodeURIComponent(\'' + adminEmailArg(email) + '\'))">📋 Email nusxa</button>' +
      '<button class="dash-btn dash-btn-outline" onclick="adminSetUserStatus(decodeURIComponent(\'' + adminEmailArg(email) + '\'), \'' + (isBlocked ? 'active' : 'blocked') + '\')">' + (isBlocked ? 'Blokdan chiqarish' : 'Bloklash') + '</button>' +
      '<button class="dash-btn dash-btn-primary" onclick="adminCloseModal()">Yopish</button>';
    adminModal('Foydalanuvchi ma’lumoti', body, footer);
  }

  function adminCopyEmail(email){
    const text = String(email || '');
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ alert('Email nusxalandi:\n' + text); }).catch(function(){ alert(text); });
    } else {
      alert(text);
    }
  }

  function adminAddUser(){
    const body =
      '<div style="display:flex;flex-direction:column;gap:10px;">' +
        '<input id="anu-name" placeholder="Ism va familiya" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">' +
        '<input id="anu-email" type="email" placeholder="Email (ism@example.com)" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">' +
        '<input id="anu-phone" placeholder="Telefon (ixtiyoriy)" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">' +
        '<input id="anu-pass" type="password" placeholder="Parol (kamida 6 ta belgi)" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;">' +
        '<div id="anu-error" style="display:none;color:#b91c1c;font-size:12.5px;"></div>' +
        '<div style="font-size:12px;color:var(--ink-soft);">Hisob serverga ham yoziladi (agar admin parol bilan kirgan bo‘lsa), shuning uchun boshqa qurilmada ham ko‘rinadi.</div>' +
      '</div>';
    const footer =
      '<button class="dash-btn dash-btn-outline" onclick="adminCloseModal()">Bekor qilish</button>' +
      '<button class="dash-btn dash-btn-primary" onclick="adminCreateUserFromModal()">+ Yaratish</button>';
    adminModal('Yangi foydalanuvchi', body, footer);
    setTimeout(function(){ const el = document.getElementById('anu-name'); if(el) el.focus(); }, 60);
  }

  async function adminCreateUserFromModal(){
    const name = (document.getElementById('anu-name')?.value || '').trim();
    const email = (document.getElementById('anu-email')?.value || '').trim().toLowerCase();
    const phone = (document.getElementById('anu-phone')?.value || '').trim();
    const password = (document.getElementById('anu-password')?.value || document.getElementById('anu-pass')?.value || '');
    const errEl = document.getElementById('anu-error');
    function fail(msg){ if(errEl){ errEl.textContent = msg; errEl.style.display = 'block'; } else alert(msg); }

    if(name.length < 2) return fail('Ism va familiyani kiriting.');
    if(!isValidEmail(email)) return fail("To'g'ri email manzilini kiriting.");
    if(password.length < 6) return fail('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
    if(adminLocalUsersMap()[email] || adminState.serverUsers.some(function(u){ return String(u.email).toLowerCase() === email; })){
      return fail("Bu email allaqachon ro'yxatdan o'tgan.");
    }

    let serverCreated = false;
    if(adminToken()){
      try {
        await adminFetch('POST', '/api/auth/register', { name: name, email: email, phone: phone, password: password, terms: true });
        serverCreated = true;
      } catch(e){
        if(e.status === 400) return fail(e.message || 'Bu email serverda band.');
        // server yo'q — lokal davom etamiz
      }
    }

    const users = adbGet(ADB.usersKey, {});
    users[email] = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: isAdminEmail(email) ? 'admin' : 'user',
      status: 'active',
      provider: 'password',
      createdAt: new Date().toISOString(),
      lastLoginAt: '',
      synced: serverCreated
    };
    adbSet(ADB.usersKey, users);
    adminLog('create_user', email);
    adminCloseModal();
    alert('✅ Foydalanuvchi yaratildi: ' + email + (serverCreated ? '\n(serverga ham saqlandi)' : '\n(faqat shu qurilmada)'));
    adminShow('users');
    if(serverCreated) adminRefreshUsers(true);
  }

  async function adminSetUserStatus(email, status){
    email = String(email || '').toLowerCase();
    const users = adbGet(ADB.usersKey, {});
    if(users[email]) {
      users[email].status = status;
      adbSet(ADB.usersKey, users);
    }
    const cached = adminState.serverUsers.filter(function(u){ return String(u.email).toLowerCase() === email; })[0];
    if(cached) cached.status = status;

    if(adminToken()){
      try { await adminFetch('PATCH', '/api/auth/users', { email: email, status: status }); }
      catch(e){ alert('Serverda yangilanmadi: ' + (e.message || 'xatolik')); }
    }
    adminLog(status === 'blocked' ? 'block_user' : 'unblock_user', email);
    adminShow('users');
  }

  // Eski nom bilan moslik
  function adminBlockUser(email, status){ return adminSetUserStatus(email, status); }

  async function adminSetUserRole(email, role){
    email = String(email || '').toLowerCase();
    if(ADMIN_BUILTIN_ADMINS.indexOf(email) >= 0 && role !== 'admin'){
      return alert('Bu email doimiy admin — rolini olib tashlab bo‘lmaydi.');
    }
    const users = adbGet(ADB.usersKey, {});
    if(users[email]) {
      users[email].role = role;
      adbSet(ADB.usersKey, users);
    }

    let extras = [];
    try { extras = JSON.parse(localStorage.getItem(ADMIN_EMAILS_EXTRA_KEY) || '[]'); } catch(e){ extras = []; }
    if(!Array.isArray(extras)) extras = [];
    extras = extras.map(function(x){ return String(x).toLowerCase(); }).filter(Boolean);
    if(role === 'admin'){
      if(extras.indexOf(email) < 0 && ADMIN_BUILTIN_ADMINS.indexOf(email) < 0) extras.push(email);
    } else {
      extras = extras.filter(function(x){ return x !== email; });
    }
    localStorage.setItem(ADMIN_EMAILS_EXTRA_KEY, JSON.stringify(extras));

    const cached = adminState.serverUsers.filter(function(u){ return String(u.email).toLowerCase() === email; })[0];
    if(cached) cached.role = role;

    if(adminToken() && adminState.serverUsers.some(function(u){ return String(u.email).toLowerCase() === email; })){
      try { await adminFetch('PATCH', '/api/auth/users', { email: email, role: role }); }
      catch(e){ alert('Serverda yangilanmadi: ' + (e.message || 'xatolik')); }
    }
    adminLog(role === 'admin' ? 'promote_admin' : 'demote_admin', email);
    adminShow('users');
  }

  async function adminDelUser(email){
    email = String(email || '').toLowerCase();
    if(!confirm('⚠️ ' + email + ' hisobini butunlay o‘chirasizmi?')) return;
    const me = (getSession() || {}).email || '';
    if(String(me).toLowerCase() === email) return alert('O‘zingizni o‘chira olmaysiz.');

    const users = adbGet(ADB.usersKey, {});
    delete users[email];
    adbSet(ADB.usersKey, users);
    adminState.serverUsers = adminState.serverUsers.filter(function(u){ return String(u.email).toLowerCase() !== email; });

    if(adminToken()){
      try { await adminFetch('DELETE', '/api/auth/users', { email: email }); }
      catch(e){
        if(e.status !== 404) alert('Serverda o‘chirilmadi: ' + (e.message || 'xatolik'));
      }
    }
    adminLog('delete_user', email);
    adminShow('users');
  }

  function adminExportUsers(){
    const users = adminMergedUsers();
    let csv = 'Ism,Email,Telefon,Rol,Holat,Royxatdan otgan,Manba\n';
    users.forEach(function(u){
      csv += '"' + String(u.name || '').replace(/"/g, '""') + '","' + String(u.email || '').replace(/"/g, '""') + '","' +
        String(u.phone || '').replace(/"/g, '""') + '","' + (u.role || 'user') + '","' + (u.status || 'active') + '","' +
        String(u.createdAt || '') + '","' + (u.source || 'local') + '"\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'englify-users-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    adminLog('export_users', users.length);
  }

  /* ===================== STATISTIKA ===================== */
  function adminRenderStats(){
    const box = document.getElementById('admin-content');
    if(!box) return;
    const users = adminMergedUsers();
    const results = adminMergedResults();
    const today = new Date().toISOString().slice(0, 10);
    const total = users.length || 1;
    const registered = users.filter(function(u){ return !!u.createdAt; });
    const avgPct = results.length
      ? Math.round(results.reduce(function(a, r){ return a + (Number(r.percentage) || 0); }, 0) / results.length)
      : 0;
    const best = results.length ? Math.max.apply(null, results.map(function(r){ return Number(r.percentage) || 0; })) : 0;

    // Oxirgi 14 kun ro'yxatdan o'tishlar
    const days = [];
    for(let i = 13; i >= 0; i--){
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key: key,
        label: key.slice(5),
        count: registered.filter(function(u){ return String(u.createdAt).slice(0, 10) === key; }).length
      });
    }
    const maxDay = Math.max.apply(null, days.map(function(d){ return d.count; }).concat([1]));

    const byType = {};
    results.forEach(function(r){
      const key = String(r.type || r.test || 'other');
      if(!byType[key]) byType[key] = { count: 0, sum: 0, best: 0 };
      byType[key].count++;
      byType[key].sum += Number(r.percentage) || 0;
      byType[key].best = Math.max(byType[key].best, Number(r.percentage) || 0);
    });

    function barRow(label, value, max, color){
      const width = max ? Math.max(2, Math.round(value / max * 100)) : 0;
      return '<div style="display:flex;align-items:center;gap:10px;font-size:12.5px;margin:7px 0;">' +
        '<span style="width:88px;color:var(--ink-soft);flex-shrink:0;">' + adminEsc(label) + '</span>' +
        '<span style="flex:1;background:var(--paper);height:9px;border-radius:999px;overflow:hidden;">' +
          '<span style="display:block;height:100%;width:' + width + '%;background:' + color + ';border-radius:999px;"></span>' +
        '</span>' +
        '<b style="width:34px;text-align:right;">' + value + '</b>' +
      '</div>';
    }

    box.innerHTML = adminServerNote() +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:18px;">' +
        adminStatCard('Foydalanuvchilar', users.length) +
        adminStatCard('Aktiv', users.filter(function(u){ return u.status !== 'blocked'; }).length) +
        adminStatCard('Bugun', users.filter(function(u){ return String(u.createdAt).slice(0, 10) === today; }).length) +
        adminStatCard('Natijalar', results.length) +
        adminStatCard('O‘rtacha', avgPct + '%') +
        adminStatCard('Eng yaxshi', best + '%') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-bottom:16px;">' +
        '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">' +
          '<strong>Ro‘yxatdan o‘tish (14 kun)</strong>' +
          '<div style="margin-top:12px;">' + days.map(function(d){
            return barRow(d.label, d.count, maxDay, 'linear-gradient(90deg,#3b5cf6,#8b3ff5)');
          }).join('') + '</div>' +
        '</div>' +
        '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">' +
          '<strong>Rollar va holatlar</strong>' +
          '<div style="margin-top:12px;">' +
            barRow('Adminlar', users.filter(function(u){ return u.role === 'admin'; }).length, total, '#f59e0b') +
            barRow('O‘quvchilar', users.filter(function(u){ return u.role !== 'admin'; }).length, total, '#3b5cf6') +
            barRow('Aktiv', users.filter(function(u){ return u.status !== 'blocked'; }).length, total, '#22c55e') +
            barRow('Bloklangan', users.filter(function(u){ return u.status === 'blocked'; }).length, total, '#ef4444') +
          '</div>' +
          '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--line);font-size:12.5px;color:var(--ink-soft);">' +
            'Server hisoblari: <b>' + adminState.serverUsers.length + '</b> · Lokal: <b>' + Object.keys(adminLocalUsersMap()).length + '</b>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">' +
        '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">' +
          '<strong>Natijalar turlari bo‘yicha</strong>' +
          '<div style="margin-top:12px;">' +
            (Object.keys(byType).length ? Object.keys(byType).map(function(k){
              const v = byType[k];
              return barRow(k, v.count, Math.max.apply(null, Object.keys(byType).map(function(x){ return byType[x].count; })), '#0f9aa8') +
                '<div style="font-size:11.5px;color:var(--ink-soft);margin:-2px 0 8px 98px;">O‘rtacha ' +
                Math.round(v.sum / v.count) + '% · eng yaxshi ' + v.best + '%</div>';
            }).join('') : '<div style="color:var(--ink-soft);font-size:13px;">Hali natija yo‘q. Test topshirilganda avtomatik yoziladi.</div>') +
          '</div>' +
        '</div>' +
        '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">' +
          '<strong>Oxirgi ro‘yxatdan o‘tganlar</strong>' +
          '<div style="margin-top:10px;">' +
            (users.length ? users.slice(0, 8).map(function(u){
              return '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid var(--line);font-size:13px;">' +
                '<span><b>' + adminEsc(u.name || 'Ismsiz') + '</b><div style="font-size:11.5px;color:var(--ink-soft);">' + adminEsc(u.email) + '</div></span>' +
                '<span style="font-size:11.5px;color:var(--ink-soft);">' + adminEsc(String(u.createdAt || '').slice(0, 10) || '—') + '</span></div>';
            }).join('') : '<div style="color:var(--ink-soft);font-size:13px;">Hozircha yo‘q.</div>') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ===================== ADMINLAR ===================== */
  function adminExtraAdmins(){
    try {
      const list = JSON.parse(localStorage.getItem(ADMIN_EMAILS_EXTRA_KEY) || '[]');
      return Array.isArray(list) ? list.map(function(x){ return String(x).toLowerCase(); }).filter(Boolean) : [];
    } catch(e){ return []; }
  }

  function adminRenderAdmins(){
    const box = document.getElementById('admin-content');
    if(!box) return;
    const users = adminMergedUsers();
    const extras = adminExtraAdmins();
    const all = {};
    ADMIN_BUILTIN_ADMINS.forEach(function(email){ all[email] = true; });
    extras.forEach(function(email){ all[email] = true; });
    users.forEach(function(u){ if(u.role === 'admin') all[u.email] = true; });
    const adminEmails = Object.keys(all);

    const rows = adminEmails.map(function(email){
      const u = users.filter(function(x){ return x.email === email; })[0] || {};
      const builtin = ADMIN_BUILTIN_ADMINS.indexOf(email) >= 0;
      return '<tr>' +
        '<td style="padding:11px;border-top:1px solid var(--line);"><b>' + adminEsc(u.name || '—') + '</b></td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(email) + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' + (builtin ? 'doimiy' : (extras.indexOf(email) >= 0 ? 'qo‘shilgan' : 'server')) + '</td>' +
        '<td style="padding:11px;border-top:1px solid var(--line);">' +
          (builtin ? '<span style="font-size:12px;color:var(--ink-soft);">O‘chirilmaydi</span>' :
            '<button class="dash-btn dash-btn-outline" style="padding:4px 10px;font-size:11.5px;color:#b91c1c;" onclick="adminRemoveAdminEmail(decodeURIComponent(\'' + adminEmailArg(email) + '\'))">Adminlikdan olish</button>') +
        '</td></tr>';
    }).join('');

    box.innerHTML = adminServerNote() +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:16px;max-width:820px;">' +
        '<strong>Yangi admin qo‘shish</strong>' +
        '<p style="font-size:12.5px;color:var(--ink-soft);margin:6px 0 12px;">Admin qilingan email bilan ro‘yxatdan o‘tgan foydalanuvchi admin panelni ko‘ra oladi.</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          '<input id="aa-email" type="email" placeholder="admin@example.com" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;flex:1;min-width:220px;">' +
          '<button class="dash-btn dash-btn-primary" onclick="adminAddAdminEmail()">+ Admin qo‘shish</button>' +
        '</div>' +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;max-width:820px;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:13.5px;">' +
          '<thead><tr style="background:var(--paper);color:var(--ink-soft);">' +
            '<th style="padding:12px;text-align:left;">Ism</th><th style="padding:12px;text-align:left;">Email</th>' +
            '<th style="padding:12px;text-align:left;">Turi</th><th style="padding:12px;text-align:left;">Amallar</th>' +
          '</tr></thead><tbody>' + (rows || '<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--ink-soft);">Admin yo‘q</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>' +
      '<p style="font-size:12px;color:var(--ink-soft);margin-top:12px;max-width:820px;">Doimiy adminlar: ' +
        ADMIN_BUILTIN_ADMINS.map(adminEsc).join(', ') + '</p>';
  }

  async function adminAddAdminEmail(){
    const input = document.getElementById('aa-email');
    const email = String((input && input.value) || '').trim().toLowerCase();
    if(!isValidEmail(email)) return alert('To‘g‘ri email kiriting.');
    let extras = adminExtraAdmins();
    if(ADMIN_BUILTIN_ADMINS.indexOf(email) < 0 && extras.indexOf(email) < 0){
      extras.push(email);
      localStorage.setItem(ADMIN_EMAILS_EXTRA_KEY, JSON.stringify(extras));
    }
    const users = adbGet(ADB.usersKey, {});
    if(users[email]){
      users[email].role = 'admin';
      adbSet(ADB.usersKey, users);
    }
    if(adminToken() && adminState.serverUsers.some(function(u){ return String(u.email).toLowerCase() === email; })){
      try { await adminFetch('PATCH', '/api/auth/users', { email: email, role: 'admin' }); }
      catch(e){
        if(e.status !== 404) alert('Serverda yangilanmadi: ' + (e.message || 'xatolik'));
      }
    }
    adminLog('add_admin', email);
    alert('✅ Admin qo‘shildi: ' + email);
    adminShow('admins');
  }

  async function adminRemoveAdminEmail(email){
    email = String(email || '').toLowerCase();
    if(ADMIN_BUILTIN_ADMINS.indexOf(email) >= 0) return alert('Doimiy adminni olib tashlab bo‘lmaydi.');
    if(!confirm(email + ' adminlikdan olinsinmi?')) return;
    const extras = adminExtraAdmins().filter(function(x){ return x !== email; });
    localStorage.setItem(ADMIN_EMAILS_EXTRA_KEY, JSON.stringify(extras));
    const users = adbGet(ADB.usersKey, {});
    if(users[email]){
      users[email].role = 'user';
      adbSet(ADB.usersKey, users);
    }
    adminState.serverUsers.forEach(function(u){ if(String(u.email).toLowerCase() === email) u.role = 'user'; });
    if(adminToken()){
      try { await adminFetch('PATCH', '/api/auth/users', { email: email, role: 'user' }); }
      catch(e){ /* foydalanuvchi serverda bo'lmasligi mumkin */ }
    }
    adminLog('remove_admin', email);
    adminShow('admins');
  }

  /* ===================== ZAXIRA NUSXA ===================== */
  function adminBackupKeys(){
    const keys = [];
    try {
      for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        if(key && key.indexOf('sb_') === 0) keys.push(key);
      }
    } catch(e){}
    return keys.sort();
  }

  function adminRenderBackup(){
    const box = document.getElementById('admin-content');
    if(!box) return;
    const keys = adminBackupKeys();
    let totalBytes = 0;
    const rows = keys.map(function(key){
      const size = (localStorage.getItem(key) || '').length;
      totalBytes += size;
      return '<tr><td style="padding:8px 11px;border-top:1px solid var(--line);font-family:monospace;font-size:12px;">' + adminEsc(key) + '</td>' +
        '<td style="padding:8px 11px;border-top:1px solid var(--line);text-align:right;font-size:12px;">' + (size / 1024).toFixed(1) + ' KB</td></tr>';
    }).join('');

    box.innerHTML = adminServerNote() +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:18px;">' +
        adminStatCard('Kalitlar', keys.length) +
        adminStatCard('Hajm', (totalBytes / 1024).toFixed(1) + ' KB') +
        adminStatCard('Foydalanuvchilar', adminMergedUsers().length) +
        adminStatCard('Natijalar', adminMergedResults().length) +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:16px;max-width:820px;">' +
        '<strong>Zaxira nusxa olish va tiklash</strong>' +
        '<p style="font-size:12.5px;color:var(--ink-soft);margin:6px 0 12px;">Barcha lokal admin ma’lumotlari (foydalanuvchilar, kurslar, testlar, natijalar, lug‘at, sertifikatlar, sozlamalar) bitta JSON faylga saqlanadi.</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          '<button class="dash-btn dash-btn-primary" onclick="adminExportBackup()">⬇ Zaxira nusxa (JSON)</button>' +
          '<button class="dash-btn dash-btn-outline" onclick="document.getElementById(\'ab-file\').click()">⬆ Zaxiradan tiklash</button>' +
          '<button class="dash-btn dash-btn-outline" onclick="adminExportUsers()">⬇ Foydalanuvchilar (CSV)</button>' +
          '<button class="dash-btn dash-btn-outline" onclick="adminExportResults()">⬇ Natijalar (CSV)</button>' +
          '<input id="ab-file" type="file" accept="application/json,.json" style="display:none;" onchange="adminImportBackup(event)">' +
        '</div>' +
        '<div style="font-size:12px;color:#b45309;margin-top:12px;">⚠️ Zaxira faylida foydalanuvchi parollari ham bor — uni hech kimga yubormang.</div>' +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;max-width:820px;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
          '<thead><tr style="background:var(--paper);color:var(--ink-soft);"><th style="padding:10px 11px;text-align:left;">Kalit</th><th style="padding:10px 11px;text-align:right;">Hajm</th></tr></thead>' +
          '<tbody>' + (rows || '<tr><td colspan="2" style="padding:18px;text-align:center;color:var(--ink-soft);">Ma’lumot yo‘q</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>';
  }

  function adminExportBackup(){
    if(!confirm('Zaxira faylida parollar ham bor. Davom etasizmi?')) return;
    const data = {};
    adminBackupKeys().forEach(function(key){ data[key] = localStorage.getItem(key); });
    const payload = {
      app: 'Englify',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'englify-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    adminLog('export_backup', Object.keys(data).length);
  }

  function adminImportBackup(ev){
    const file = ev && ev.target && ev.target.files && ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const data = parsed && parsed.data ? parsed.data : parsed;
        if(!data || typeof data !== 'object') throw new Error('Format noto‘g‘ri');
        const keys = Object.keys(data).filter(function(k){ return k.indexOf('sb_') === 0; });
        if(!keys.length) throw new Error('Faylda sb_ ma’lumotlari topilmadi');
        if(!confirm(keys.length + ' ta kalit tiklanadi. Mavjud ma’lumotlar ustiga yoziladi. Davom etasizmi?')) return;
        keys.forEach(function(k){
          const v = data[k];
          localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
        });
        adminLog('import_backup', keys.length);
        alert('✅ Zaxira tiklandi (' + keys.length + ' ta kalit).');
        adminShow('backup');
      } catch(e){
        alert('Import xatosi: ' + e.message);
      } finally {
        if(ev && ev.target) ev.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  /* ===================== NATIJALAR ===================== */
  function adminRenderResults(){
    const box = document.getElementById('admin-content');
    if(!box) return;
    const results = adminMergedResults();
    const avg = results.length
      ? Math.round(results.reduce(function(a, r){ return a + (Number(r.percentage) || 0); }, 0) / results.length)
      : 0;
    const best = results.length ? Math.max.apply(null, results.map(function(r){ return Number(r.percentage) || 0; })) : 0;
    const note = (adminState.resultsError === 'no-token' || adminState.resultsError === 'no-auth')
      ? '<div style="background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:12px;padding:10px 14px;font-size:12.5px;margin-bottom:14px;">⚠️ Serverdagi natijalar ko‘rinmayapti — admin sifatida qayta kiring. Hozir lokal natijalar ko‘rsatilmoqda.</div>'
      : '';

    box.innerHTML = note + adminServerNote() +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:16px;">' +
        adminStatCard('Jami natijalar', results.length) +
        adminStatCard('O‘rtacha', avg + '%') +
        adminStatCard('Eng yaxshi', best + '%') +
        adminStatCard('Bugun', results.filter(function(r){ return String(r.date || '').slice(0, 10) === new Date().toISOString().slice(0, 10); }).length) +
      '</div>' +
      '<div style="margin-bottom:14px;display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button class="dash-btn dash-btn-outline" onclick="adminRefreshResultsNow()">↻ Yangilash</button>' +
        '<button class="dash-btn dash-btn-outline" onclick="adminExportResults()">⬇ CSV</button>' +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:13.5px;min-width:780px;">' +
          '<thead><tr style="background:var(--paper);color:var(--ink-soft);">' +
            '<th style="padding:12px;text-align:left;">O‘quvchi</th><th style="padding:12px;text-align:left;">Email</th>' +
            '<th style="padding:12px;text-align:left;">Test</th><th style="padding:12px;text-align:left;">Turi</th>' +
            '<th style="padding:12px;text-align:left;">%</th><th style="padding:12px;text-align:left;">Band</th>' +
            '<th style="padding:12px;text-align:left;">Sana</th><th style="padding:12px;text-align:left;">Manba</th>' +
          '</tr></thead>' +
          '<tbody>' + (results.length ? results.map(function(r){
            return '<tr>' +
              '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(r.student || '—') + '</td>' +
              '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(r.email || '—') + '</td>' +
              '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(r.test || '—') + '</td>' +
              '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(r.type || '—') + '</td>' +
              '<td style="padding:11px;border-top:1px solid var(--line);"><b>' + (Number(r.percentage) || 0) + '%</b></td>' +
              '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(r.band || '—') + '</td>' +
              '<td style="padding:11px;border-top:1px solid var(--line);">' + adminEsc(String(r.date || '').slice(0, 10)) + '</td>' +
              '<td style="padding:11px;border-top:1px solid var(--line);font-size:11.5px;color:var(--ink-soft);">' + adminEsc(r.source || 'lokal') + '</td>' +
            '</tr>';
          }).join('') : '<tr><td colspan="8" style="padding:22px;text-align:center;color:var(--ink-soft);">Natijalar yo‘q. Test topshirilganda avtomatik yoziladi.</td></tr>') +
          '</tbody>' +
        '</table>' +
      '</div>';
  }

  function adminRefreshResultsNow(){
    adminState.resultsError = '';
    adminRefreshResults().then(function(ok){
      adminRenderResults();
      if(!ok && adminState.resultsError && adminState.resultsError !== 'no-token' && adminState.resultsError !== 'no-auth'){
        alert('Server bilan aloqa yo‘q: ' + adminState.resultsError);
      }
    });
  }
  function adminAddCourse(){
    const title = prompt('Kurs nomi:');
    if(!title) return;
    const courses = adbGet(ADB.coursesKey, []);
    courses.unshift({ id: Date.now(), title, price:0, duration:3, status:'active', students:0, youtube:'' });
    adbSet(ADB.coursesKey, courses);
    adminLog('create_course', title);
    adminShow('courses');
  }
  function adminToggleCourse(id){
    const courses = adbGet(ADB.coursesKey, []);
    const c = courses.find(x=>x.id===id);
    if(c){ c.status = c.status==='active'?'inactive':'active'; adbSet(ADB.coursesKey, courses); adminLog('toggle_course', c.title); }
    adminShow('courses');
  }
  function adminDelCourse(id){
    if(!confirm('Kursni o‘chirish?')) return;
    let courses = adbGet(ADB.coursesKey, []);
    const c = courses.find(x=>x.id===id);
    courses = courses.filter(x=>x.id!==id);
    adbSet(ADB.coursesKey, courses);
    adminLog('delete_course', c?c.title:id);
    adminShow('courses');
  }
  function adminAddTest(){
    const title = prompt('Test nomi:');
    if(!title) return;
    const tests = adbGet(ADB.testsKey, []);
    tests.unshift({ id: Date.now(), title, category:'General', status:'draft', questions:0 });
    adbSet(ADB.testsKey, tests);
    adminLog('create_test', title);
    adminShow('tests');
  }
  function adminPublishTest(id){
    const tests = adbGet(ADB.testsKey, []);
    const t = tests.find(x=>x.id===id);
    if(t){ t.status='published'; adbSet(ADB.testsKey, tests); adminLog('publish_test', t.title); }
    adminShow('tests');
  }
  function adminDelTest(id){
    if(!confirm('Testni o‘chirish?')) return;
    let tests = adbGet(ADB.testsKey, []);
    const t = tests.find(x=>x.id===id);
    tests = tests.filter(x=>x.id!==id);
    adbSet(ADB.testsKey, tests);
    adminLog('delete_test', t?t.title:id);
    adminShow('tests');
  }
  function adminExportResults(){
    const results = adminMergedResults();
    let csv = 'Student,Email,Test,Type,Percentage,Band,Date\n';
    results.forEach(function(r){
      csv += '"' + String(r.student || '').replace(/"/g, '""') + '","' +
        String(r.email || '').replace(/"/g, '""') + '","' +
        String(r.test || '').replace(/"/g, '""') + '","' +
        String(r.type || '').replace(/"/g, '""') + '",' +
        (Number(r.percentage) || 0) + ',"' + String(r.band || '') + '","' +
        String(r.date || '') + '"\n';
    });
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'englify-results-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    adminLog('export_results', results.length);
  }
  function adminRenderDict(){
    const q = (document.getElementById('ad-q')?.value || '').toLowerCase();
    let dict = window._adminDictCache || adbGet(ADB.dictKey, []);
    if(q) dict = dict.filter(w => (w.word||'').toLowerCase().includes(q) || (w.translation||'').toLowerCase().includes(q));
    const body = document.getElementById('ad-body');
    if(!body) return;
    body.innerHTML = dict.map(w=>`<tr>
      <td style="padding:12px;border-top:1px solid var(--line);">${w.word}</td>
      <td style="padding:12px;border-top:1px solid var(--line);">${w.translation}</td>
      <td style="padding:12px;border-top:1px solid var(--line);">${w.lang||''}</td>
      <td style="padding:12px;border-top:1px solid var(--line);">
        <button class="dash-btn" style="padding:4px 10px;background:#fee2e2;color:#b91c1c;" onclick="adminDelWord(${w.id})">🗑</button>
      </td></tr>`).join('');
  }
  function adminAddWord(){
    const word = prompt('So‘z:');
    const translation = prompt('Tarjima:');
    if(!word || !translation) return;
    const dict = adbGet(ADB.dictKey, []);
    dict.unshift({ id: Date.now(), word, translation, lang: 'en' });
    adbSet(ADB.dictKey, dict);
    adminLog('create_word', word);
    adminShow('dict');
  }
  function adminDelWord(id){
    if(!confirm('O‘chirish?')) return;
    let dict = adbGet(ADB.dictKey, []);
    dict = dict.filter(w=>w.id!==id);
    adbSet(ADB.dictKey, dict);
    adminLog('delete_word', id);
    adminShow('dict');
  }
  function adminSendNotif(){
    const title = prompt('Sarlavha:');
    const message = prompt('Xabar:');
    if(!title || !message) return;
    const list = adbGet(ADB.notifKey, []);
    list.unshift({ title, message, at: new Date().toISOString() });
    adbSet(ADB.notifKey, list);
    adminLog('send_notification', title);
    adminShow('notif');
  }

  /* ===================== SERTIFIKATLAR ===================== */
  const ADMIN_CERT_TYPES = {
    ielts:  { title: 'IELTS Mock Sertifikati' },
    course: { title: 'Kurs Bitiruv Sertifikati' }
  };

  function adminIssueCert(){
    const student = (document.getElementById('ac-student')?.value || '').trim();
    const type = document.getElementById('ac-type')?.value || 'ielts';
    const band = (document.getElementById('ac-band')?.value || '').trim();
    const date = (document.getElementById('ac-date')?.value || new Date().toISOString().slice(0,10)).trim();
    if(!student) return alert('O‘quvchi ismini kiriting');
    const meta = ADMIN_CERT_TYPES[type] || ADMIN_CERT_TYPES.ielts;
    const certs = adbGet(ADB.certsKey, []);
    certs.unshift({
      id: Date.now(),
      student: student,
      type: type,
      title: meta.title,
      band: band || '—',
      date: date,
      code: 'SB-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      at: new Date().toISOString()
    });
    adbSet(ADB.certsKey, certs);
    adminLog('issue_certificate', student + ' — ' + meta.title);
    adminShow('certs');
  }

  function adminDelCert(id){
    if(!confirm('Sertifikatni o‘chirish?')) return;
    const certs = adbGet(ADB.certsKey, []);
    const c = certs.find(x => x.id === id);
    adbSet(ADB.certsKey, certs.filter(x => x.id !== id));
    adminLog('delete_certificate', c ? (c.student + ' ' + c.code) : id);
    adminShow('certs');
  }

  function adminCopyCert(code){
    const text = 'https://englify.uz/cert/' + code;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ alert('Havola nusxalandi:\n' + text); })
        .catch(function(){ alert(text); });
    } else {
      alert(text);
    }
  }

  /* ===================== SOZLAMALAR ===================== */
  function adminGetSettings(){
    const saved = adbGet(ADB.settingsKey, {}) || {};
    return Object.assign({}, ADMIN_SETTINGS_DEFAULT, saved);
  }

  function adminApplySettings(){
    try {
      const st = adminGetSettings();
      const name = String(st.siteName || '').trim();
      if(name){
        document.querySelectorAll('.brand-name').forEach(function(el){ el.textContent = name; });
      }
    } catch(e){ /* ko'rinishni qo'llash ixtiyoriy */ }
  }

  function adminSaveSettings(){
    const st = adminGetSettings();
    st.siteName = (document.getElementById('as-site')?.value || st.siteName).trim() || 'Englify';
    st.supportEmail = (document.getElementById('as-email')?.value || st.supportEmail).trim();
    st.defaultLevel = document.getElementById('as-level')?.value || st.defaultLevel;
    st.dailyQuestions = Math.max(5, Math.min(50, Number(document.getElementById('as-daily')?.value) || 15));
    st.allowRegistration = !!document.getElementById('as-reg')?.checked;
    st.maintenance = !!document.getElementById('as-maint')?.checked;
    st.announcement = (document.getElementById('as-ann')?.value || '').trim();
    adbSet(ADB.settingsKey, st);
    adminLog('update_settings', st.siteName);
    adminApplySettings();
    alert('Sozlamalar saqlandi');
    adminShow('settings');
  }

  function adminResetSettings(){
    if(!confirm('Sozlamalarni standart holatga qaytarasizmi?')) return;
    localStorage.removeItem(ADB.settingsKey);
    adbSet(ADB.settingsKey, Object.assign({}, ADMIN_SETTINGS_DEFAULT));
    adminLog('reset_settings', 'default');
    adminApplySettings();
    adminShow('settings');
  }

  function adminClearResults(){
    if(!confirm('Barcha natijalarni o‘chirasizmi? Bu amalni qaytarib bo‘lmaydi.')) return;
    adbSet(ADB.resultsKey, []);
    adminLog('clear_results', 'all');
    adminShow('settings');
  }

  function adminClearLogs(){
    if(!confirm('Barcha loglarni o‘chirasizmi?')) return;
    adbSet(ADB.logsKey, []);
    adminLog('clear_logs', 'all');
    adminShow('settings');
  }

  function adminClearAllData(){
    if(!confirm('Barcha admin ma’lumotlari (kurslar, testlar, natijalar, lug‘at, bildirishnomalar, sertifikatlar, sozlamalar) o‘chiriladi. Davom etasizmi?')) return;
    [ADB.coursesKey, ADB.testsKey, ADB.resultsKey, ADB.dictKey, ADB.notifKey, ADB.logsKey, ADB.certsKey, ADB.settingsKey].forEach(function(k){
      localStorage.removeItem(k);
    });
    ensureAdminSeed();
    adminLog('clear_all_data', 'all');
    adminApplySettings();
    adminShow('settings');
  }

  /* ===================== AI ADMIN ===================== */
  /* Faqat admin panel ma'lumotlari asosida javob beradi.
     Parollar/tokenlar hech qachon kontekstga qo'shilmaydi. */
  let adminAIMessages = [];
  let adminAIBusy = false;

  function adminAIEsc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function adminAIContext(){
    const users = adminMergedUsers().map(function(u){
      return {
        email: String(u.email || ''),
        name: String(u.name || ''),
        role: u.role === 'admin' ? 'admin' : 'user',
        status: String(u.status || 'active'),
        createdAt: String(u.createdAt || '')
      };
    });

    const coursesAll = adbGet(ADB.coursesKey, []);
    const courses = coursesAll.map(function(c){
      return {
        title: String(c.title || ''),
        status: String(c.status || ''),
        duration: Number(c.duration) || 0,
        students: Number(c.students) || 0
      };
    });

    const testsAll = adbGet(ADB.testsKey, []);
    const tests = testsAll.map(function(t){
      return {
        title: String(t.title || ''),
        category: String(t.category || ''),
        status: String(t.status || ''),
        questions: Number(t.questions) || 0
      };
    });

    const resultsAll = adminMergedResults();
    const results = resultsAll.map(function(r){
      return {
        email: String(r.email || ''),
        student: String(r.student || ''),
        test: String(r.test || ''),
        type: String(r.type || ''),
        percentage: Number(r.percentage) || 0,
        date: String(r.date || '')
      };
    });

    const dictAll = adbGet(ADB.dictKey, []);
    const dictionary = dictAll.map(function(w){
      return { word: String(w.word || ''), translation: String(w.translation || ''), lang: String(w.lang || '') };
    });

    const notifAll = adbGet(ADB.notifKey, []);
    const notifications = notifAll.map(function(n){
      return { title: String(n.title || ''), message: String(n.message || ''), at: String(n.at || '') };
    });

    const logsAll = adbGet(ADB.logsKey, []);
    const logs = logsAll.map(function(l){
      return { admin: String(l.admin || ''), action: String(l.action || ''), target: String(l.target || ''), at: String(l.at || '') };
    });

    const certsAll = adbGet(ADB.certsKey, []);
    const certificates = certsAll.map(function(c){
      return { student: String(c.student || ''), title: String(c.title || ''), band: String(c.band || ''), code: String(c.code || ''), date: String(c.date || '') };
    });
    const settings = adminGetSettings();

    const today = new Date().toISOString().slice(0, 10);
    const stats = {
      totalUsers: users.length,
      admins: users.filter(function(u){ return u.role === 'admin'; }).length,
      blockedUsers: users.filter(function(u){ return u.status === 'blocked'; }).length,
      activeUsers: users.filter(function(u){ return u.status !== 'blocked'; }).length,
      todayRegistrations: users.filter(function(u){ return u.createdAt.slice(0, 10) === today; }).length,
      totalCourses: courses.length,
      activeCourses: courses.filter(function(c){ return c.status === 'active'; }).length,
      totalTests: tests.length,
      publishedTests: tests.filter(function(t){ return t.status === 'published'; }).length,
      totalResults: results.length,
      totalWords: dictionary.length,
      totalNotifications: notifications.length,
      totalCertificates: certificates.length,
      totalLogs: logs.length
    };

    return {
      generatedAt: new Date().toISOString(),
      stats: stats,
      users: users.slice(0, 300),
      courses: courses,
      tests: tests,
      results: results.slice(0, 150),
      dictionary: dictionary.slice(0, 200),
      notifications: notifications.slice(0, 50),
      certificates: certificates.slice(0, 100),
      settings: settings,
      logs: logs.slice(0, 50)
    };
  }

  function adminAIStatChips(ctx){
    const st = ctx.stats;
    return [
      ['Foydalanuvchilar', st.totalUsers],
      ['Kurslar', st.totalCourses],
      ['Testlar', st.totalTests],
      ['Natijalar', st.totalResults]
    ].map(function(row){
      return '<div class="aai-stat"><b>' + row[1] + '</b><span>' + row[0] + '</span></div>';
    }).join('');
  }

  function adminRenderAI(){
    const ctx = adminAIContext();
    const box = document.getElementById('admin-content');
    if(!box) return;
    box.innerHTML = `
      <div class="aai-shell">
        <div class="aai-hero">
          <div class="aai-hero-glow"></div>
          <div class="aai-hero-top">
            <div class="aai-brand">
              <div class="aai-brand-ic">✦</div>
              <div>
                <div class="aai-brand-name">AI Admin</div>
                <div class="aai-brand-sub">Englify ma'lumotlar bo'yicha yordamchi</div>
              </div>
            </div>
            <span class="aai-live"><span class="dot"></span> Live</span>
          </div>
          <div class="aai-stats">${adminAIStatChips(ctx)}</div>
        </div>

        <div class="aai-chat">
          <div class="aai-thread" id="aai-thread"></div>

          <div class="aai-quick" id="aai-quick">
            <button class="aai-chip" onclick="adminAIQuick('Foydalanuvchilar soni qancha?')">👥 Foydalanuvchilar soni</button>
            <button class="aai-chip" onclick="adminAIQuick('Foydalanuvchilar ismlari bilan')">🪪 Ismlar ro'yxati</button>
            <button class="aai-chip" onclick="adminAIQuick('Kurslar royxati qanday?')">📚 Kurslar</button>
            <button class="aai-chip" onclick="adminAIQuick('Bugun nechta foydalanuvchi royxatdan otdi?')">📅 Bugungi ro'yxat</button>
            <button class="aai-chip" onclick="adminAIQuick('Natijalar statistikasi qanday?')">📊 Natijalar</button>
            <button class="aai-chip" onclick="adminAIQuick('Lugatda nechta soz bor?')">📖 Lug'at</button>
          </div>

          <form class="aai-inputbar" onsubmit="adminAISend(event)">
            <input id="aai-input" class="aai-input" autocomplete="off" placeholder="Masalan: foydalanuvchilar soni qancha va ismlari kimlar?">
            <button type="submit" class="aai-send" aria-label="Yuborish">➤</button>
          </form>
          <div class="aai-foot">🔒 AI faqat admin panel ma'lumotlari asosida javob beradi. Parollar hech qachon ko'rsatilmaydi.</div>
        </div>
      </div>`;
    adminAIRenderThread();
    setTimeout(function(){
      const input = document.getElementById('aai-input');
      if(input) input.focus();
    }, 60);
  }

  function adminAIQuick(text){
    const input = document.getElementById('aai-input');
    if(input){ input.value = text; }
    adminAISend();
  }

  function adminAIMsgHTML(m){
    if(m.role === 'user'){
      return '<div class="aai-msg user"><div class="aai-av">🧑‍💼</div><div class="aai-bubble">' +
        adminAIEsc(m.text) + '</div></div>';
    }
    const meta = m.meta
      ? '<div class="aai-meta">' + adminAIEsc(m.meta) + '</div>'
      : '';
    return '<div class="aai-msg ai"><div class="aai-av">✦</div><div class="aai-bubble">' +
      m.html + meta + '</div></div>';
  }

  function adminAIRenderThread(){
    const thread = document.getElementById('aai-thread');
    if(!thread) return;
    let html = '';
    if(!adminAIMessages.length){
      html = `
        <div class="aai-empty">
          <div class="aai-empty-ic">✦</div>
          <div class="aai-empty-title">Salom! Men AI Admin yordamchisiman</div>
          <div class="aai-empty-sub">Admin paneldagi foydalanuvchilar, kurslar, testlar, natijalar, lug'at va bildirishnomalar haqida savol bering.</div>
        </div>`;
    } else {
      html = adminAIMessages.map(adminAIMsgHTML).join('');
    }
    if(adminAIBusy){
      html += '<div class="aai-msg ai"><div class="aai-av">✦</div><div class="aai-bubble aai-typing"><span></span><span></span><span></span></div></div>';
    }
    thread.innerHTML = html;
    thread.scrollTop = thread.scrollHeight;
  }

  function adminAIPush(role, payload, meta){
    if(role === 'user'){
      adminAIMessages.push({ role: 'user', text: String(payload || '') });
    } else {
      adminAIMessages.push({ role: 'ai', html: payload, meta: meta || '' });
    }
    if(adminAIMessages.length > 40) adminAIMessages = adminAIMessages.slice(-40);
    adminAIRenderThread();
  }

  function adminAISend(ev){
    if(ev && ev.preventDefault) ev.preventDefault();
    if(adminAIBusy) return;
    const input = document.getElementById('aai-input');
    if(!input) return;
    const text = String(input.value || '').trim();
    if(!text) return;
    input.value = '';
    adminAIPush('user', text);
    adminAIBusy = true;
    adminAIRenderThread();

    const ctx = adminAIContext();
    const local = adminAILocalAnswer(text, ctx);

    if(local){
      setTimeout(function(){
        adminAIBusy = false;
        adminAIPush('ai', local, '⚡ Lokal ma\'lumot · aniq hisob');
      }, 260);
      return;
    }

    const history = adminAIMessages.slice(-8).map(function(m){
      return { role: m.role === 'ai' ? 'assistant' : 'user', content: m.role === 'ai' ? adminAIStrip(m.html) : m.text };
    });

    aiApiPost('/api/ai/admin', {
      message: text,
      context: ctx,
      messages: history
    }, 45000).then(function(data){
      const reply = data && data.reply ? String(data.reply) : '';
      if(!reply) throw new Error('empty');
      adminAIBusy = false;
      adminAIPush('ai', adminAIFormat(reply), '🤖 ' + (data.provider || 'AI') + (data.model ? ' · ' + data.model : ''));
    }).catch(function(err){
      adminAIBusy = false;
      const fallback = adminAILocalAnswer(text, adminAIContext()) || adminAIFallback(text, adminAIContext());
      const reason = (err && err.status === 503)
        ? 'AI backend kaliti sozlanmagan'
        : 'AI bilan aloqa uzildi';
      adminAIPush('ai', fallback, '⚡ ' + reason + ' — lokal javob');
    });
  }

  function adminAIStrip(html){
    return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function adminAIInline(s){
    return adminAIEsc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function adminAIFormat(text){
    const lines = String(text || '').replace(/\r/g, '').split('\n');
    let html = '';
    let inList = false;
    lines.forEach(function(line){
      const trimmed = line.trim();
      const bullet = trimmed.match(/^[-*•]\s+(.*)$/);
      const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);
      if(bullet || numbered){
        if(!inList){ html += '<ul class="aai-list">'; inList = true; }
        html += '<li>' + adminAIInline(bullet ? bullet[1] : numbered[1]) + '</li>';
      } else {
        if(inList){ html += '</ul>'; inList = false; }
        if(trimmed) html += '<p>' + adminAIInline(trimmed) + '</p>';
      }
    });
    if(inList) html += '</ul>';
    return html || '<p></p>';
  }

  function adminAIList(items){
    if(!items.length) return '<p class="aai-muted">Ma\'lumot yo\'q.</p>';
    return '<ul class="aai-list">' + items.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>';
  }

  /* Oddiy, aniq savollarga lokal (deterministik) javob.
     Bu hisob-kitob xatolarini oldini oladi. Murakkab savollar AI'ga yuboriladi. */
  function adminAILocalAnswer(question, ctx){
    const q = String(question || '').toLowerCase();
    const st = ctx.stats;
    const wantsCount = /nech|qancha|soni|jami|count|how many|total/.test(q);
    const wantsNames = /ism|ismlari|kim(lar)?|names?|ro.?yxat|list|ko.?rsat|show/.test(q);
    const userTopic = /foydalanuvchi|user|odam|ism|registr|ro.?yxatdan|block|blok/.test(q);
    const courseTopic = /kurs|course/.test(q);
    const testTopic = /test|imtihon/.test(q);
    const resultTopic = /natija|result|ball|band|baholash|statistika/.test(q);
    const dictTopic = /lug.?at|dictionary|so.?z|word/.test(q);
    const notifTopic = /bildirishnoma|notification|xabar|notif/.test(q);
    const logTopic = /\blog|amallar|activity|tarix/.test(q);

    if(userTopic){
      if(/bugun|today/.test(q)){
        return '<p><strong>Bugun ro\'yxatdan o\'tganlar:</strong> ' + st.todayRegistrations + ' ta</p>' +
          adminAIList(ctx.users
            .filter(function(u){ return u.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10); })
            .map(function(u){ return '<strong>' + adminAIEsc(u.name || '—') + '</strong> · ' + adminAIEsc(u.email); }));
      }
      if(/block|blok/.test(q)){
        return '<p><strong>Bloklangan foydalanuvchilar:</strong> ' + st.blockedUsers + ' ta</p>' +
          adminAIList(ctx.users
            .filter(function(u){ return u.status === 'blocked'; })
            .map(function(u){ return '<strong>' + adminAIEsc(u.name || '—') + '</strong> · ' + adminAIEsc(u.email); }));
      }
      if(wantsNames){
        return '<p><strong>Jami foydalanuvchilar:</strong> ' + st.totalUsers + ' ta ' +
          '<span class="aai-tag">' + st.admins + ' admin</span></p>' +
          adminAIList(ctx.users.map(function(u, i){
            const role = u.role === 'admin' ? ' · <span class="aai-tag">admin</span>' : '';
            const status = u.status === 'blocked' ? ' · <span class="aai-tag bad">bloklangan</span>' : '';
            return '<strong>' + (i + 1) + '. ' + adminAIEsc(u.name || 'Ismsiz') + '</strong> · ' +
              adminAIEsc(u.email) + role + status;
          }));
      }
      if(wantsCount){
        return '<p><strong>Jami foydalanuvchilar:</strong> ' + st.totalUsers + ' ta</p>' +
          '<ul class="aai-list">' +
            '<li>Adminlar: <strong>' + st.admins + '</strong></li>' +
            '<li>Aktiv foydalanuvchilar: <strong>' + st.activeUsers + '</strong></li>' +
            '<li>Bloklanganlar: <strong>' + st.blockedUsers + '</strong></li>' +
            '<li>Bugun ro\'yxatdan o\'tganlar: <strong>' + st.todayRegistrations + '</strong></li>' +
          '</ul>' +
          '<p class="aai-muted">Ismlar ro\'yxatini ko\'rish uchun: "foydalanuvchilar ismlari bilan" deb so\'rang.</p>';
      }
      // Ism yoki email bo'yicha qidirish
      const found = ctx.users.filter(function(u){
        const name = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return (name && q.includes(name)) || (email && q.includes(email));
      });
      if(found.length === 1){
        const u = found[0];
        return '<p><strong>' + adminAIEsc(u.name || 'Ismsiz') + '</strong></p>' +
          '<ul class="aai-list">' +
            '<li>Email: <strong>' + adminAIEsc(u.email) + '</strong></li>' +
            '<li>Rol: <strong>' + adminAIEsc(u.role) + '</strong></li>' +
            '<li>Holat: <strong>' + adminAIEsc(u.status) + '</strong></li>' +
            '<li>Ro\'yxatdan o\'tgan: <strong>' + adminAIEsc((u.createdAt || '').slice(0, 10) || '—') + '</strong></li>' +
          '</ul>';
      }
      if(/haqida|ma.?lumot|umumiy|hammasi|royxat|list/.test(q)){
        return '<p><strong>Foydalanuvchilar:</strong> ' + st.totalUsers + ' ta (' + st.admins + ' admin, ' +
          st.blockedUsers + ' bloklangan)</p>' +
          '<p class="aai-muted">Aniq ro\'yxat uchun "ismlari bilan" deb so\'rang.</p>';
      }
      return null;
    }

    if(courseTopic){
      if(!(wantsCount || wantsNames || /royxat|list|qanday|statistika|umumiy|hammasi|nechta/.test(q))) return null;
      return '<p><strong>Kurslar:</strong> ' + st.totalCourses + ' ta, shundan ' + st.activeCourses + ' tasi aktiv</p>' +
        adminAIList(ctx.courses.map(function(c){
          const badge = c.status === 'active'
            ? '<span class="aai-tag good">aktiv</span>'
            : '<span class="aai-tag">' + adminAIEsc(c.status || 'nofaol') + '</span>';
          return '<strong>' + adminAIEsc(c.title) + '</strong> ' + badge +
            ' · ' + c.duration + ' oy · ' + c.students + ' o\'quvchi';
        }));
    }

    if(testTopic){
      if(!(wantsCount || wantsNames || /royxat|list|qanday|statistika|umumiy|hammasi|nechta|published|chop/.test(q))) return null;
      return '<p><strong>Testlar:</strong> ' + st.totalTests + ' ta, shundan ' + st.publishedTests + ' tasi chop etilgan</p>' +
        adminAIList(ctx.tests.map(function(t){
          const badge = t.status === 'published'
            ? '<span class="aai-tag good">published</span>'
            : '<span class="aai-tag">' + adminAIEsc(t.status || 'draft') + '</span>';
          return '<strong>' + adminAIEsc(t.title) + '</strong> ' + badge +
            (t.category ? ' · ' + adminAIEsc(t.category) : '') +
            ' · ' + t.questions + ' savol';
        }));
    }

    if(resultTopic){
      if(!(wantsCount || wantsNames || /royxat|list|qanday|statistika|umumiy|hammasi|nechta|o.?rtacha|average|eng /.test(q))) return null;
      const avg = ctx.results.length
        ? Math.round(ctx.results.reduce(function(a, r){ return a + r.percentage; }, 0) / ctx.results.length)
        : 0;
      return '<p><strong>Natijalar:</strong> ' + st.totalResults + ' ta</p>' +
        '<ul class="aai-list">' +
          '<li>O\'rtacha foiz: <strong>' + avg + '%</strong></li>' +
          '<li>Eng yuqori: <strong>' + (ctx.results.length ? Math.max.apply(null, ctx.results.map(function(r){ return r.percentage; })) + '%' : '—') + '</strong></li>' +
        '</ul>' +
        (ctx.results.length ? adminAIList(ctx.results.slice(0, 10).map(function(r){
          return '<strong>' + adminAIEsc(r.student || '—') + '</strong> · ' + adminAIEsc(r.test || '—') +
            ' · <strong>' + r.percentage + '%</strong> · ' + adminAIEsc((r.date || '').slice(0, 10));
        })) : '');
    }

    if(dictTopic){
      if(!(wantsCount || wantsNames || /royxat|list|qanday|umumiy|hammasi|nechta/.test(q))) return null;
      return '<p><strong>Lug\'at:</strong> ' + st.totalWords + ' ta so\'z</p>' +
        adminAIList(ctx.dictionary.slice(0, 12).map(function(w){
          return '<strong>' + adminAIEsc(w.word) + '</strong> — ' + adminAIEsc(w.translation) +
            (w.lang ? ' <span class="aai-tag">' + adminAIEsc(w.lang) + '</span>' : '');
        })) +
        (st.totalWords > 12 ? '<p class="aai-muted">... va yana ' + (st.totalWords - 12) + ' ta so\'z</p>' : '');
    }

    if(notifTopic){
      if(!(wantsCount || wantsNames || /royxat|list|qanday|umumiy|hammasi|nechta/.test(q))) return null;
      return '<p><strong>Bildirishnomalar:</strong> ' + st.totalNotifications + ' ta</p>' +
        adminAIList(ctx.notifications.slice(0, 10).map(function(n){
          return '<strong>' + adminAIEsc(n.title) + '</strong> — ' + adminAIEsc(n.message) +
            ' <span class="aai-muted">(' + adminAIEsc((n.at || '').slice(0, 10)) + ')</span>';
        }));
    }

    if(logTopic){
      if(!(wantsCount || wantsNames || /royxat|list|qanday|umumiy|hammasi|nechta|tarix/.test(q))) return null;
      return '<p><strong>Amallar tarixi:</strong> ' + st.totalLogs + ' ta yozuv</p>' +
        adminAIList(ctx.logs.slice(0, 12).map(function(l){
          return '<strong>' + adminAIEsc(l.admin || 'admin') + '</strong> · ' + adminAIEsc(l.action) +
            (l.target ? ' · ' + adminAIEsc(l.target) : '') +
            ' <span class="aai-muted">(' + adminAIEsc((l.at || '').slice(0, 16).replace('T', ' ')) + ')</span>';
        }));
    }

    if(wantsCount && /hammasi|umumiy|statistika|overview|summary|ma.?lumot/.test(q)){
      return adminAIStatsOverview(ctx);
    }

    return null;
  }

  function adminAIStatsOverview(ctx){
    const st = ctx.stats;
    return '<p><strong>Admin panel umumiy ko\'rinishi</strong></p>' +
      '<ul class="aai-list">' +
        '<li>Foydalanuvchilar: <strong>' + st.totalUsers + '</strong> (' + st.admins + ' admin, ' + st.blockedUsers + ' bloklangan)</li>' +
        '<li>Bugun ro\'yxatdan o\'tganlar: <strong>' + st.todayRegistrations + '</strong></li>' +
        '<li>Kurslar: <strong>' + st.totalCourses + '</strong> (' + st.activeCourses + ' aktiv)</li>' +
        '<li>Testlar: <strong>' + st.totalTests + '</strong> (' + st.publishedTests + ' published)</li>' +
        '<li>Natijalar: <strong>' + st.totalResults + '</strong></li>' +
        '<li>Lug\'at so\'zlari: <strong>' + st.totalWords + '</strong></li>' +
        '<li>Bildirishnomalar: <strong>' + st.totalNotifications + '</strong></li>' +
        '<li>Sertifikatlar: <strong>' + (st.totalCertificates || 0) + '</strong></li>' +
        '<li>Sayt nomi: <strong>' + adminAIEsc(ctx.settings && ctx.settings.siteName || 'Englify') + '</strong></li>' +
      '</ul>';
  }

  function adminAIFallback(question, ctx){
    const q = String(question || '').toLowerCase();
    const outside = /ob.?havo|weather|futbol|football|python|kod|dastur|matematika|tarix|siyosat|film|musiqa|retsept|cook|travel|sayohat/.test(q);
    if(outside){
      return '<p>Bu savol admin panel ma\'lumotlariga tegishli emas. Men faqat quyidagilar haqida javob bera olaman:</p>' +
        '<ul class="aai-list">' +
          '<li>Foydalanuvchilar (soni, ismlari, holati)</li>' +
          '<li>Kurslar va testlar</li>' +
          '<li>Natijalar statistikasi</li>' +
          '<li>Lug\'at va bildirishnomalar</li>' +
          '<li>Admin amallari tarixi</li>' +
        '</ul>';
    }
    return adminAIStatsOverview(ctx) +
      '<p class="aai-muted">Savolingizni aniqroq bering — masalan «foydalanuvchilar ismlari bilan» yoki «bugun nechta ro\'yxatdan o\'tdi?».</p>';
  }


  // Sayt nomi sozlamasi ilova yuklanganda qo'llanadi
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', adminApplySettings);
  } else {
    adminApplySettings();
  }

