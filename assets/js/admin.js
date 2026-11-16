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
        {id:2,title:'IELTS Preparation',price:0,duration:3,status:'active',students:0,youtube:''},
        {id:3,title:'Goethe A1-B1',price:0,duration:8,status:'active',students:0,youtube:'https://youtu.be/oGY1i_fWQMY?list=PLkREkayoYCyJWJqU-mecKaouuLIEDRTZv&t=13'}
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
        {id:1,word:'Haus',translation:'Uy',lang:'de'},
        {id:2,word:'Buch',translation:'Kitob',lang:'de'},
        {id:3,word:'Freedom',translation:'Erkinlik',lang:'en'}
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

  function adminShow(tab){
    ensureAdminSeed();
    const s = getSession() || {};
    const nameEl = document.getElementById('admin-ui-name');
    const emailEl = document.getElementById('admin-ui-email');
    if(nameEl) nameEl.textContent = s.name || 'Admin';
    if(emailEl) emailEl.textContent = s.email || '';
    document.querySelectorAll('#admin-sidebar .dash-nav-link[data-ap]').forEach(a=>{
      a.classList.toggle('active', a.getAttribute('data-ap')===tab);
    });
    const titles = {dash:'Dashboard',ai:'AI Admin',users:'Foydalanuvchilar',courses:'Kurslar',tests:'Testlar',results:'Natijalar',dict:"Lug'at",notif:'Bildirishnomalar',certs:'Sertifikatlar',settings:'Sozlamalar',logs:'Loglar'};
    const pt = document.getElementById('admin-page-title');
    if(pt) pt.textContent = titles[tab] || 'Admin';
    const box = document.getElementById('admin-content');
    if(!box) return;

    if(tab==='dash'){
      const users = adbGet(ADB.usersKey, {});
      const userList = Object.values(users);
      const courses = adbGet(ADB.coursesKey, []);
      const tests = adbGet(ADB.testsKey, []);
      const results = adbGet(ADB.resultsKey, []);
      const today = new Date().toISOString().slice(0,10);
      const todayReg = userList.filter(u => (u.createdAt||'').slice(0,10)===today).length;
      box.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:24px;">
          ${[
            ['Jami foydalanuvchilar', userList.length],
            ['Bugun ro‘yxatdan', todayReg],
            ['Jami kurslar', courses.length],
            ['Aktiv kurslar', courses.filter(c=>c.status==='active').length],
            ['Jami testlar', tests.length],
            ['Natijalar', results.length],
            ['Sertifikatlar', adbGet(ADB.certsKey, []).length]
          ].map(([l,n])=>`<div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">
            <div style="font-size:12px;color:var(--ink-soft);font-weight:600;">${l}</div>
            <div style="font-family:Fraunces,serif;font-size:28px;font-weight:700;color:var(--blue-deep);margin-top:6px;">${n}</div>
          </div>`).join('')}
        </div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;">
          <strong>Tezkor amallar</strong>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
            <button class="dash-btn dash-btn-primary" onclick="adminShow('users')">Users</button>
            <button class="dash-btn dash-btn-outline" onclick="adminShow('courses')">Kurslar</button>
            <button class="dash-btn dash-btn-outline" onclick="adminShow('tests')">Testlar</button>
            <button class="dash-btn dash-btn-outline" onclick="adminShow('certs')">Sertifikatlar</button>
            <button class="dash-btn dash-btn-outline" onclick="adminShow('settings')">Sozlamalar</button>
          </div>
        </div>`;
    }

    if(tab==='ai'){
      adminRenderAI();
    }

    if(tab==='users'){
      const users = Object.entries(adbGet(ADB.usersKey, {})).map(([email,u])=>({email,...u}));
      box.innerHTML = `
        <div style="margin-bottom:14px;display:flex;gap:10px;flex-wrap:wrap;">
          <input id="au-q" placeholder="Qidiruv..." style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;flex:1;min-width:180px;" oninput="adminRenderUsers()">
          <button class="dash-btn dash-btn-primary" onclick="adminAddUser()">+ User</button>
        </div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">Email</th><th style="padding:12px;text-align:left;">Ism</th>
              <th style="padding:12px;text-align:left;">Role</th><th style="padding:12px;text-align:left;">Status</th><th style="padding:12px;text-align:left;">Amallar</th>
            </tr></thead>
            <tbody id="au-body"></tbody>
          </table>
        </div>`;
      window._adminUsersCache = users;
      adminRenderUsers();
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
      const results = adbGet(ADB.resultsKey, []);
      box.innerHTML = `
        <div style="margin-bottom:14px;"><button class="dash-btn dash-btn-outline" onclick="adminExportResults()">⬇ CSV</button></div>
        <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
            <thead><tr style="background:var(--paper);color:var(--ink-soft);">
              <th style="padding:12px;text-align:left;">Student</th><th style="padding:12px;text-align:left;">Test</th>
              <th style="padding:12px;text-align:left;">%</th><th style="padding:12px;text-align:left;">Sana</th>
            </tr></thead>
            <tbody>${results.length?results.map(r=>`<tr>
              <td style="padding:12px;border-top:1px solid var(--line);">${r.student||''}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${r.test||''}</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${r.percentage||0}%</td>
              <td style="padding:12px;border-top:1px solid var(--line);">${(r.date||'').slice(0,10)}</td>
            </tr>`).join(''):'<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--ink-soft);">Natijalar yo‘q</td></tr>'}</tbody>
          </table>
        </div>`;
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
            ['Goethe', types.goethe||0]
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
              <option value="goethe">Goethe-Zertifikat</option>
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

  function adminRenderUsers(){
    const q = (document.getElementById('au-q')?.value || '').toLowerCase();
    let users = window._adminUsersCache || [];
    if(q) users = users.filter(u => (u.email||'').toLowerCase().includes(q) || (u.name||'').toLowerCase().includes(q));
    const body = document.getElementById('au-body');
    if(!body) return;
    body.innerHTML = users.map(u=>`<tr>
      <td style="padding:12px;border-top:1px solid var(--line);">${u.email}</td>
      <td style="padding:12px;border-top:1px solid var(--line);">${u.name||''}</td>
      <td style="padding:12px;border-top:1px solid var(--line);">${isAdminEmail(u.email)?'admin':(u.role||'user')}</td>
      <td style="padding:12px;border-top:1px solid var(--line);">${u.status||'active'}</td>
      <td style="padding:12px;border-top:1px solid var(--line);">
        <button class="dash-btn dash-btn-outline" style="padding:4px 10px;" onclick="adminBlockUser('${u.email}', '${(u.status||'active')==='blocked'?'active':'blocked'}')">${(u.status||'active')==='blocked'?'Unblock':'Block'}</button>
        <button class="dash-btn" style="padding:4px 10px;background:#fee2e2;color:#b91c1c;" onclick="adminDelUser('${u.email}')">🗑</button>
      </td></tr>`).join('') || '<tr><td colspan="5" style="padding:16px;text-align:center;color:var(--ink-soft);">User yo‘q</td></tr>';
  }
  function adminAddUser(){
    const email = prompt('Email:');
    if(!email || !isValidEmail(email)) return alert('Email noto‘g‘ri');
    const name = prompt('Ism:') || email.split('@')[0];
    const password = prompt('Parol (min 6):') || '123456';
    const users = adbGet(ADB.usersKey, {});
    if(users[email.toLowerCase()]) return alert('Email band');
    users[email.toLowerCase()] = { name, email: email.toLowerCase(), password, role: isAdminEmail(email)?'admin':'user', status:'active', createdAt: new Date().toISOString() };
    adbSet(ADB.usersKey, users);
    adminLog('create_user', email);
    adminShow('users');
  }
  function adminBlockUser(email, status){
    const users = adbGet(ADB.usersKey, {});
    if(!users[email]) return;
    users[email].status = status;
    adbSet(ADB.usersKey, users);
    adminLog(status==='blocked'?'block_user':'unblock_user', email);
    adminShow('users');
  }
  function adminDelUser(email){
    if(!confirm('O‘chirish?')) return;
    const users = adbGet(ADB.usersKey, {});
    delete users[email];
    adbSet(ADB.usersKey, users);
    adminLog('delete_user', email);
    adminShow('users');
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
    const results = adbGet(ADB.resultsKey, []);
    let csv = 'Student,Test,Percentage,Date\n';
    results.forEach(r=>{ csv += `"${r.student||''}","${r.test||''}",${r.percentage||0},"${r.date||''}"\n`; });
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'results.csv'; a.click();
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
    goethe: { title: 'Goethe-Zertifikat' },
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
    const usersRaw = adbGet(ADB.usersKey, {});
    const users = Object.keys(usersRaw).map(function(key){
      const u = usersRaw[key] || {};
      const email = String(u.email || key || '');
      return {
        email: email,
        name: String(u.name || ''),
        role: isAdminEmail(email) ? 'admin' : String(u.role || 'user'),
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

    const resultsAll = adbGet(ADB.resultsKey, []);
    const results = resultsAll.map(function(r){
      return {
        student: String(r.student || ''),
        test: String(r.test || ''),
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

