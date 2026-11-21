// Englify — create-test
  // CREATE TEST — YANGI DIZAYN (rasm asosida)
  let recentTests = [];
  try { recentTests = JSON.parse(localStorage.getItem('sb_recent_tests') || '[]'); } catch(e){ recentTests = []; }
  if(!Array.isArray(recentTests)) recentTests = [];

  let testDraft = null;

  function crtFreshDraft(){
    return { mode:'single', title:'', desc:'', time:10, questions:[], editorOpen:false };
  }

  function crtSaveRecent(){
    try { localStorage.setItem('sb_recent_tests', JSON.stringify(recentTests.slice(0,50))); } catch(e){}
  }

  const CRT_ICONS = {
    pencil: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
    layers: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
  };

  function openCreate(){
    showPanel('create','Test yaratish');
    if(!testDraft) testDraft = crtFreshDraft();
    renderCreate();
  }

  function crtSetMode(m){
    if(testDraft.mode !== m){ testDraft.mode = m; testDraft.editorOpen = false; }
    renderCreate();
  }

  function crtSetTime(s){
    testDraft.time = s;
    renderCreate();
  }

  function crtUpdateSubtitle(v){
    const el = document.querySelector('.crt-subtitle');
    if(el) el.textContent = (v || '').trim() ? v.trim() : "Ma'lumotlarni to'ldiring va savollar qo'shing";
  }

  function crtPillsHtml(){
    return [5,10,15,20,30].map(function(s){
      return '<button type="button" class="crt-pill ' + (testDraft.time === s ? 'active' : '') + '" onclick="crtSetTime(' + s + ')">' + s + 's</button>';
    }).join('');
  }

  function crtSingleFormHtml(){
    const d = testDraft;
    const qList = d.questions.map(function(q, i){
      return '<div class="crt-q-item">'
        + '<div class="crt-q-num">' + (i+1) + '</div>'
        + '<div class="crt-q-body">'
        +   '<strong>' + escapeHtml(q.text) + '</strong>'
        +   '<span>To\u2018g\u2018ri javob: ' + escapeHtml(q.options[q.correct] || '\u2014') + '</span>'
        + '</div>'
        + '<button type="button" class="crt-q-del" onclick="crtDelQuestion(' + i + ')" title="O\u2018chirish">✕</button>'
        + '</div>';
    }).join('');

    const editor = d.editorOpen ? crtEditorHtml() : '';

    return '<div class="crt-card">'
      + '<h3>Yangi test</h3>'
      + '<p class="crt-hint">Ma\u2019lumotlarni to\u2018ldiring</p>'
      + '<label class="crt-label">TEST NOMI <span class="req">*</span></label>'
      + '<input id="crt-title" class="crt-input" type="text" placeholder="TEST NOMI" value="' + escapeHtml(d.title) + '" oninput="testDraft.title=this.value; crtUpdateSubtitle(this.value);">'
      + '<label class="crt-label">TAVSIF</label>'
      + '<textarea class="crt-textarea" placeholder="TAVSIF" oninput="testDraft.desc=this.value;">' + escapeHtml(d.desc) + '</textarea>'
      + '<div class="crt-time-label">Vaqt limiti (soniya/savol)</div>'
      + '<div class="crt-pills">' + crtPillsHtml() + '</div>'
      + '<div id="crt-questions">' + qList + '</div>'
      + editor
      + '<button type="button" class="crt-add-btn" onclick="crtToggleEditor()">' + CRT_ICONS.plus + ' Savollar qo\u2018shish</button>'
      + (d.questions.length ? '<button type="button" class="crt-create-btn" onclick="createTest()">✅ Testni yaratish</button>' : '')
      + '</div>';
  }

  function crtPackFormHtml(){
    const d = testDraft;
    return '<div class="crt-card">'
      + '<h3>To\u2018liq pack</h3>'
      + '<p class="crt-hint">15 ta testdan iborat to\u2018plam yarating — har biriga alohida havola beriladi</p>'
      + '<label class="crt-label">PACK NOMI <span class="req">*</span></label>'
      + '<input id="crt-title" class="crt-input" type="text" placeholder="PACK NOMI" value="' + escapeHtml(d.title) + '" oninput="testDraft.title=this.value; crtUpdateSubtitle(this.value);">'
      + '<label class="crt-label">TAVSIF</label>'
      + '<textarea class="crt-textarea" placeholder="TAVSIF" oninput="testDraft.desc=this.value;">' + escapeHtml(d.desc) + '</textarea>'
      + '<div class="crt-time-label">Har bir test uchun vaqt limiti (soniya/savol)</div>'
      + '<div class="crt-pills">' + crtPillsHtml() + '</div>'
      + '<button type="button" class="crt-add-btn" onclick="createPack()">' + CRT_ICONS.layers + ' Pack yaratish — 15 test</button>'
      + '</div>';
  }

  function crtEditorHtml(){
    const letters = ['A','B','C','D'];
    const rows = letters.map(function(L, i){
      return '<div class="crt-opt-row">'
        + '<input type="radio" name="crt-correct" value="' + i + '" ' + (i === 0 ? 'checked' : '') + ' title="To\u2018g\u2018ri javob">'
        + '<span class="crt-opt-letter">' + L + '</span>'
        + '<input type="text" class="crt-opt-input" id="crt-opt-' + i + '" placeholder="' + L + ' variant">'
        + '</div>';
    }).join('');

    return '<div class="crt-q-editor">'
      + '<div class="crt-q-editor-head"><span>Yangi savol</span><button type="button" onclick="crtToggleEditor()">✕</button></div>'
      + '<label class="crt-label">SAVOL MATNI <span class="req">*</span></label>'
      + '<textarea id="crt-q-text" class="crt-textarea" placeholder="Savolni yozing..."></textarea>'
      + '<label class="crt-label">JAVOB VARIANTLARI <span class="crt-label-note">— to\u2018g\u2018ri javobni belgilang</span></label>'
      + '<div class="crt-opt-list">' + rows + '</div>'
      + '<div class="crt-editor-actions">'
      + '<button type="button" class="crt-save-q" onclick="crtSaveQuestion()">Savolni saqlash</button>'
      + '<button type="button" class="crt-cancel-q" onclick="crtToggleEditor()">Bekor qilish</button>'
      + '</div>'
      + '</div>';
  }

  function renderCreate(){
    const c = document.getElementById('create-content');
    if(!c) return;
    const d = testDraft;
    const sub = (d.title || '').trim() ? d.title.trim() : "Ma'lumotlarni to'ldiring va savollar qo'shing";
    const inner = d.mode === 'pack' ? crtPackFormHtml() : crtSingleFormHtml();

    c.innerHTML = '<div class="crt-wrap">'
      + '<div class="crt-header">'
      +   '<button class="crt-back" onclick="switchTab(\'home\')" title="Orqaga">' + CRT_ICONS.back + '</button>'
      +   '<div>'
      +     '<div class="crt-title">Test yaratish</div>'
      +     '<div class="crt-subtitle">' + escapeHtml(sub) + '</div>'
      +   '</div>'
      + '</div>'
      + '<div class="crt-tabs">'
      +   '<button type="button" class="crt-tab ' + (d.mode === 'single' ? 'active' : '') + '" onclick="crtSetMode(\'single\')">' + CRT_ICONS.pencil + '<span>1 ta test</span></button>'
      +   '<button type="button" class="crt-tab ' + (d.mode === 'pack' ? 'active' : '') + '" onclick="crtSetMode(\'pack\')">' + CRT_ICONS.layers + '<span>To\u2018liq pack</span><span class="crt-badge">15 test</span></button>'
      + '</div>'
      + '<div id="crt-form-area">' + inner + '</div>'
      + '<div class="crt-section-label">MENING TESTLARIM</div>'
      + '<div id="crt-recent-list"></div>'
      + '</div>';

    renderRecent();
  }

  function crtToggleEditor(){
    testDraft.editorOpen = !testDraft.editorOpen;
    renderCreate();
    if(testDraft.editorOpen){
      const el = document.getElementById('crt-q-text');
      if(el) el.focus();
    }
  }

  function crtSaveQuestion(){
    const textEl = document.getElementById('crt-q-text');
    const text = ((textEl && textEl.value) || '').trim();
    if(!text){ alert('Savol matnini kiriting!'); if(textEl) textEl.focus(); return; }
    const opts = [];
    const letters = ['A','B','C','D'];
    for(let i = 0; i < 4; i++){
      const inp = document.getElementById('crt-opt-' + i);
      const v = ((inp && inp.value) || '').trim();
      if(!v){ alert(letters[i] + ' variantini kiriting!'); if(inp) inp.focus(); return; }
      opts.push(v);
    }
    const checked = document.querySelector('input[name="crt-correct"]:checked');
    const correct = checked ? parseInt(checked.value, 10) : 0;
    testDraft.questions.push({ text: text, options: opts, correct: correct });
    testDraft.editorOpen = false;
    renderCreate();
  }

  function crtDelQuestion(i){
    testDraft.questions.splice(i, 1);
    renderCreate();
  }

  function createTest(){
    const title = (testDraft.title || '').trim();
    if(!title){
      alert("Iltimos, avval test nomini kiriting!");
      const tEl = document.getElementById('crt-title');
      if(tEl) tEl.focus();
      return;
    }
    const link = crtMakeLink();
    const created = {
      title: title,
      desc: (testDraft.desc || '').trim(),
      time: testDraft.time,
      count: testDraft.questions.length,
      questions: JSON.parse(JSON.stringify(testDraft.questions)),
      link: link,
      code: crtCodeFromLink(link),
      date: new Date().toLocaleDateString('uz-UZ')
    };
    recentTests.unshift(created);
    crtSaveRecent();
    testDraft = crtFreshDraft();
    renderCreate();
    crtShowSuccess(created);
  }

  function crtShowSuccess(test){
    const area = document.getElementById('crt-form-area');
    if(!area) return;
    const meta = test.count ? test.count + ' ta savol · ' + test.time + 's/savol' : 'savollar qo\u2018shilmagan';
    area.innerHTML = '<div class="crt-card" style="text-align:center;">'
      + '<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#1fa85c,#0f8f7c);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;color:#fff;">✓</div>'
      + '<h3>Test yaratildi!</h3>'
      + '<p class="crt-hint" style="margin-bottom:16px;"><strong>' + escapeHtml(test.title) + '</strong> · ' + meta + '</p>'
      + '<input class="crt-input" style="text-align:center;font-size:13px;margin-bottom:6px;" value="' + escapeHtml(test.link) + '" readonly onclick="this.select()">'
      + '<button type="button" class="crt-add-btn" style="margin-top:10px;" onclick="crtCopyLink(\'' + test.link + '\', this)">🔗 Havolani nusxalash</button>'
      + '<div style="display:flex;gap:10px;margin-top:10px;">'
      + '<button type="button" class="crt-cancel-q" onclick="renderCreate()">+ Yana test yaratish</button>'
      + '<button type="button" class="crt-cancel-q" onclick="switchTab(\'home\')">Asosiyga qaytish</button>'
      + '</div>'
      + '</div>';
  }

  function createPack(){
    const name = (testDraft.title || '').trim();
    if(!name){
      alert("Iltimos, avval pack nomini kiriting!");
      const tEl = document.getElementById('crt-title');
      if(tEl) tEl.focus();
      return;
    }
    const timeUsed = testDraft.time;
    const descUsed = (testDraft.desc || '').trim();
    const created = [];
    for(let i = 1; i <= 15; i++){
      const link = crtMakeLink();
      created.push({
        title: name + ' #' + i,
        desc: descUsed,
        time: timeUsed,
        count: 0,
        link: link,
        code: crtCodeFromLink(link),
        questions: [],
        date: new Date().toLocaleDateString('uz-UZ'),
        pack: name
      });
    }
    recentTests = created.concat(recentTests);
    crtSaveRecent();
    testDraft = crtFreshDraft();
    renderCreate();

    const area = document.getElementById('crt-form-area');
    if(area){
      area.innerHTML = '<div class="crt-card" style="text-align:center;">'
        + '<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;color:#fff;">📦</div>'
        + '<h3>Pack yaratildi!</h3>'
        + '<p class="crt-hint" style="margin-bottom:16px;"><strong>' + escapeHtml(name) + '</strong> · 15 ta test · har biri ' + timeUsed + 's/savol</p>'
        + '<button type="button" class="crt-add-btn" onclick="crtCopyAllLinks(this)">🔗 Barcha havolalarni nusxalash</button>'
        + '<div style="display:flex;gap:10px;margin-top:10px;">'
        + '<button type="button" class="crt-cancel-q" onclick="renderCreate()">+ Yana pack yaratish</button>'
        + '<button type="button" class="crt-cancel-q" onclick="switchTab(\'home\')">Asosiyga qaytish</button>'
        + '</div>'
        + '</div>';
    }
  }

  function crtCopyLink(link, btn){
    const done = function(){
      if(btn){
        const old = btn.innerHTML;
        btn.innerHTML = '✓ Nusxalandi';
        setTimeout(function(){ btn.innerHTML = old; }, 1600);
      }
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(link).then(done).catch(function(){ window.prompt('Havolani nusxalang:', link); });
    } else {
      window.prompt('Havolani nusxalang:', link);
    }
  }

  function crtCopyAllLinks(btn){
    const links = recentTests.slice(0,15).map(function(x){ return x.title + ' — ' + x.link; }).join('\n');
    const done = function(){
      if(btn){
        const old = btn.innerHTML;
        btn.innerHTML = '✓ 15 ta havola nusxalandi';
        setTimeout(function(){ btn.innerHTML = old; }, 1600);
      }
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(links).then(done).catch(function(){ window.prompt('Havolalarni nusxalang:', links); });
    } else {
      window.prompt('Havolalarni nusxalang:', links);
    }
  }

  function crtDeleteTest(idx){
    if(!confirm("Bu testni o'chirishni xohlaysizmi?")) return;
    recentTests.splice(idx, 1);
    crtSaveRecent();
    renderRecent();
  }

  /* ============================================================
     ULASTARILADIGAN TEST HAVOLASI
     https://englify.alimardonovi.uz/test/XXXXXX
     ============================================================ */
  const CRT_SHARE_DOMAIN = 'https://englify.alimardonovi.uz/test/';

  function crtMakeLink(){
    return CRT_SHARE_DOMAIN + Math.random().toString(36).slice(2,8);
  }

  function crtCodeFromLink(link){
    return String(link || '').split('/').pop().toUpperCase();
  }

  // Sahifa yuklanganda /test/XXXXXX bo'lsa — testni ochamiz
  function crtOpenFromLocation(){
    let code = '';
    try {
      const m = String(location.pathname || '').match(/\/test\/([A-Za-z0-9_-]+)/);
      if(m) code = m[1].toUpperCase();
    } catch(e){}
    if(!code){
      try {
        const q = new URLSearchParams(location.search).get('test');
        if(q) code = String(q).toUpperCase();
      } catch(e){}
    }
    if(!code) return false;
    const found = recentTests.find(function(t){ return t.code === code || crtCodeFromLink(t.link) === code; });
    // Test havolasi ochiq — login talab qilmaymiz, dashboard'ni to'g'ridan ko'rsatamiz
    const dash = document.getElementById('view-dashboard');
    if(dash) dash.style.display = 'block';
    const login = document.getElementById('view-login');
    if(login) login.style.display = 'none';
    const reg = document.getElementById('view-register');
    if(reg) reg.style.display = 'none';
    document.body.classList.add('dash-mode');

    if(!found){
      switchTab('home');
      alert('Bu test topilmadi.\n\nTest faqat yaratilgan brauzer/qurilmada saqlanadi. Testni yaratgan qurilmada oching.');
      return true;
    }
    crtStartTest(found);
    return true;
  }

  // Testni yechish ekrani
  function crtStartTest(test){
    if(!test) return;
    const qs = Array.isArray(test.questions) ? test.questions : [];
    if(!qs.length){
      alert('Bu testda savollar yo‘q.');
      return;
    }
    const secPerQ = Number(test.time) || 10;
    const st = { test: test, qs: qs, i: 0, answers: [], left: secPerQ * qs.length, timer: null };

    const draw = function(){
      const panel = document.getElementById('create');
      if(!panel) return;
      panel.classList.add('active');
      document.querySelectorAll('.panel').forEach(function(p){ if(p !== panel) p.classList.remove('active'); });
      const pt = document.getElementById('page-title');
      if(pt) pt.textContent = test.title || 'Test';

      const q = st.qs[st.i];
      const opts = (q.options || []).map(function(o, i){
        return '<button type="button" class="crt-answer" data-i="' + i + '" onclick="crtAnswer(' + i + ')">'
          + '<b>' + 'ABCD'[i] + '</b><span>' + escapeHtml(o) + '</span></button>';
      }).join('');
      const mm = String(Math.floor(st.left / 60)).padStart(2, '0');
      const ss = String(st.left % 60).padStart(2, '0');

      const area = document.getElementById('crt-form-area');
      if(!area) return;
      area.innerHTML = '<div class="crt-card">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">'
        + '<div><h3 style="margin:0;font-size:19px;">' + escapeHtml(test.title) + '</h3>'
        + '<div class="crt-hint" style="margin-top:4px;">Savol ' + (st.i + 1) + ' / ' + st.qs.length + '</div></div>'
        + '<div style="font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;" id="crt-timer">' + mm + ':' + ss + '</div>'
        + '</div>'
        + '<div class="crt-progress" style="height:6px;background:var(--field);border-radius:100px;margin-bottom:18px;overflow:hidden;">'
        + '<div style="height:100%;width:' + Math.round((st.i / st.qs.length) * 100) + '%;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width .25s;"></div></div>'
        + '<div style="font-size:17px;font-weight:700;line-height:1.6;margin-bottom:18px;">' + escapeHtml(q.text) + '</div>'
        + '<div class="crt-answers">' + opts + '</div>'
        + '</div>';
    };

    window.crtAnswer = function(i){
      st.answers[st.i] = i;
      st.i++;
      if(st.i >= st.qs.length){ clearInterval(st.timer); crtFinishTest(st); return; }
      draw();
    };

    if(st.timer) clearInterval(st.timer);
    st.timer = setInterval(function(){
      st.left--;
      const el = document.getElementById('crt-timer');
      if(el){
        const mm = String(Math.floor(Math.max(0, st.left) / 60)).padStart(2, '0');
        const ss = String(Math.max(0, st.left) % 60).padStart(2, '0');
        el.textContent = mm + ':' + ss;
      }
      if(st.left <= 0){
        clearInterval(st.timer);
        crtFinishTest(st);
      }
    }, 1000);

    draw();
  }

  function crtFinishTest(st){
    let correct = 0;
    st.qs.forEach(function(q, i){ if(st.answers[i] === Number(q.correct)) correct++; });
    const pct = Math.round(correct / st.qs.length * 100);
    const area = document.getElementById('crt-form-area');
    if(area){
      area.innerHTML = '<div class="crt-card" style="text-align:center;">'
        + '<div style="font-size:52px;margin-bottom:8px;">' + (pct >= 70 ? '🎉' : '📘') + '</div>'
        + '<h3>Test tugadi!</h3>'
        + '<div style="font-size:44px;font-weight:800;font-family:Fraunces,serif;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;margin:12px 0;">' + pct + '%</div>'
        + '<p class="crt-hint">To‘g‘ri javoblar: <b>' + correct + '</b> / ' + st.qs.length + '</p>'
        + '<button class="crt-add-btn" style="margin-top:14px;" onclick="crtStartTest(window.crtLastTest)">Qayta ishlash</button>'
        + '<button class="crt-cancel-q" style="margin-top:10px;" onclick="switchTab(\'home\')">Asosiyga qaytish</button>'
        + '</div>';
    }
    window.crtLastTest = st.test;
    // Natijani saqlaymiz
    try {
      if(!testProgress.custom) testProgress.custom = { completed: false, date: '' };
      testProgress.custom.completed = true;
      testProgress.custom.pct = pct;
      testProgress.custom.date = new Date().toLocaleDateString('uz-UZ');
      if(typeof saveTestProgress === 'function') saveTestProgress();
      if(typeof renderRecent === 'function') renderRecent();
      if(typeof updateResultsDisplay === 'function') updateResultsDisplay();
    } catch(e){}
  }

