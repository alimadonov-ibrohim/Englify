// Englify — admin
  // ========== ADMIN PANEL (localStorage DB) ==========
  const ADB = {
    usersKey: 'sb_users',
    coursesKey: 'sb_admin_courses',
    testsKey: 'sb_admin_tests',
    resultsKey: 'sb_admin_results',
    dictKey: 'sb_admin_dict',
    notifKey: 'sb_admin_notif',
    logsKey: 'sb_admin_logs'
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
    const titles = {dash:'Dashboard',users:'Foydalanuvchilar',courses:'Kurslar',tests:'Testlar',results:'Natijalar',dict:"Lug'at",notif:'Bildirishnomalar',logs:'Loglar'};
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
            ['Natijalar', results.length]
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
          </div>
        </div>`;
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
    let csv = 'Student,Test,Percentage,Date\\n';
    results.forEach(r=>{ csv += `"${r.student||''}","${r.test||''}",${r.percentage||0},"${r.date||''}"\\n`; });
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

