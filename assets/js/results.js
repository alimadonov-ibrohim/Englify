// Englify — results
  // --- 100% ANIQ ISHLAYDIGAN NATIJALAR TIZIMI ---
  // ==========================================
  let testProgress = {
    listening: { completed: false, band: 0, pct: 0, score: '', date: '' },
    reading:   { completed: false, band: 0, pct: 0, score: '', date: '' },
    writing:   { completed: false, band: 0, pct: 0, score: '', date: '' },
    speaking:  { completed: false, band: 0, pct: 0, score: '', date: '' },
    daily:     { completed: false, band: 0, pct: 0, score: '', date: '' },
    aispeaking:{ completed: false, band: 0, pct: 0, score: '', date: '', turns: 0, words: 0, minutes: 0 },
    battle:    { completed: false, band: 0, pct: 0, score: '', date: '', wins: 0, losses: 0, draws: 0 },
    fullexam:  { completed: false, band: 0, pct: 0, score: '', date: '', sections: null, timeUsed: 0 }
  };

  function saveUserProgress(){
    const session = getSession();
    if(!session) return;
    const key = 'sb_progress_' + session.email;
    localStorage.setItem(key, JSON.stringify({
      testProgress,
      earnedCertificates
    }));
    // Sync latest skill to backend if token exists
    try {
      if (localStorage.getItem(TOKEN_KEY)) {
        ['reading','listening','writing','speaking','daily'].forEach(function(type){
          const s = testProgress[type];
          if (s && s.completed) {
            api('POST', '/api/results', {
              type: type,
              test: type + ' Mock',
              score: s.score,
              percentage: s.pct,
              band: s.band
            }).catch(function(){});
          }
        });
      }
    } catch(e){}
  }

  function loadUserProgress(){
    const session = getSession();
    if(!session) return;
    const key = 'sb_progress_' + session.email;
    try {
      const data = JSON.parse(localStorage.getItem(key) || 'null');
      if(data){
        if(data.testProgress) testProgress = data.testProgress;
        if(data.earnedCertificates) earnedCertificates = data.earnedCertificates;
      }
    } catch(e){}
    updateResultsDisplay();
    renderCertificates();
    updateCertificateAvailability();
  }

  function updateResultsDisplay(){
    let totalCompleted = 0;
    let bandSum = 0;
    let bandCount = 0;
    let pctSum = 0;
    let historyItems = [];
    // Skill-specific statistika
    let listeningPct = 0, readingPct = 0, writingBand = 0, speakingBand = 0, dailyPct = 0;
    let listeningDone = false, readingDone = false, writingDone = false, speakingDone = false, dailyDone = false;
    let allPcts = []; // natija taqsimoti uchun

    // 1. Listening
    if(testProgress.listening.completed){
      totalCompleted++;
      bandSum += testProgress.listening.band;
      bandCount++;
      pctSum += testProgress.listening.pct;
      listeningPct = testProgress.listening.pct;
      listeningDone = true;
      allPcts.push(testProgress.listening.pct);
      historyItems.push({type:'🎧 Listening Mock', detail: testProgress.listening.score, score: 'Band ' + testProgress.listening.band, date: testProgress.listening.date, key:'listening'});
    }

    // 2. Reading
    if(testProgress.reading.completed){
      totalCompleted++;
      bandSum += testProgress.reading.band;
      bandCount++;
      pctSum += testProgress.reading.pct;
      readingPct = testProgress.reading.pct;
      readingDone = true;
      allPcts.push(testProgress.reading.pct);
      historyItems.push({type:'📖 Reading Mock', detail: testProgress.reading.score, score: 'Band ' + testProgress.reading.band, date: testProgress.reading.date, key:'reading'});
    }

    // 3. Writing
    if(testProgress.writing.completed){
      totalCompleted++;
      bandSum += testProgress.writing.band;
      bandCount++;
      pctSum += testProgress.writing.pct;
      writingBand = testProgress.writing.band;
      writingDone = true;
      allPcts.push(testProgress.writing.pct);
      historyItems.push({type:'✍️ Writing Mock', detail: 'Task 2 Essay', score: 'Band ' + testProgress.writing.band, date: testProgress.writing.date, key:'writing'});
    }

    // 4. Speaking
    if(testProgress.speaking.completed){
      totalCompleted++;
      bandSum += testProgress.speaking.band;
      bandCount++;
      pctSum += testProgress.speaking.pct;
      speakingBand = testProgress.speaking.band;
      speakingDone = true;
      allPcts.push(testProgress.speaking.pct);
      historyItems.push({type:'🎤 Speaking Mock', detail: 'Part 1, 2, 3', score: 'Band ' + testProgress.speaking.band, date: testProgress.speaking.date, key:'speaking'});
    }

    // 5. Daily Tests
    if(testProgress.daily.completed){
      totalCompleted++;
      bandSum += Number(testProgress.daily.band) || 0;
      bandCount++;
      pctSum += testProgress.daily.pct;
      dailyPct = testProgress.daily.pct;
      dailyDone = true;
      allPcts.push(testProgress.daily.pct);
      historyItems.push({type:'⏳ Daily Tests', detail: testProgress.daily.score, score: 'Band ' + testProgress.daily.band + ' (' + testProgress.daily.pct + '%)', date: testProgress.daily.date, key:'daily'});
    }

    // 6. AI Speaking
    if(testProgress.aispeaking && testProgress.aispeaking.completed){
      allPcts.push(testProgress.aispeaking.pct);
      historyItems.push({type:'🤖 AI Speaking', detail: testProgress.aispeaking.score, score: 'Band ' + testProgress.aispeaking.band, date: testProgress.aispeaking.date, key:'aispeaking'});
    }

    // 7. Battle Mode
    if(testProgress.battle && testProgress.battle.completed){
      allPcts.push(testProgress.battle.pct);
      historyItems.push({type:'⚔️ Battle Mode', detail: testProgress.battle.score, score: testProgress.battle.pct + '% aniqlik', date: testProgress.battle.date, key:'battle'});
    }

    // 8. Full Exam Simulation
    if(testProgress.fullexam && testProgress.fullexam.completed){
      totalCompleted++;
      bandSum += Number(testProgress.fullexam.band) || 0;
      bandCount++;
      pctSum += testProgress.fullexam.pct;
      allPcts.push(testProgress.fullexam.pct);
      historyItems.push({type:'🎓 Full Exam', detail:'Listening · Reading · Writing · Use of English', score:'Band ' + Number(testProgress.fullexam.band).toFixed(1), date: testProgress.fullexam.date, key:'fullexam'});
    }

    // Vidiolar
    if(testProgress.videos && testProgress.videos.count > 0){
      allPcts.push(testProgress.videos.pct);
      historyItems.push({type:'🎬 Vidiolar', detail:testProgress.videos.count + ' ta video diktant tugallangan', score:testProgress.videos.pct + '% aniqlik', date:testProgress.videos.date, key:'videos'});
    }

    // === HAQIQIY HISOB-KITOB ===
    const avgBand = bandCount > 0 ? (Math.round((bandSum / bandCount) * 2) / 2).toFixed(1) : '0.0';
    const avgPct = totalCompleted > 0 ? Math.round(pctSum / totalCompleted) : 0;
    const bestPct = allPcts.length ? Math.max.apply(null, allPcts) : 0;

    // Streak kunlar — ketma-ket test topshirgan kunlar soni (history bo'yicha)
    const streak = computeStreakDays();

    // Haqiqiy o'qish vaqti
    let realMinutes = 0;
    ['listening','reading','writing','speaking','daily','aispeaking','battle','fullexam'].forEach(function(k){
      const t = testProgress[k];
      if(!t || !t.completed) return;
      if(k === 'fullexam' && t.timeUsed) realMinutes += t.timeUsed;
      else if(k === 'aispeaking' && t.minutes) realMinutes += t.minutes;
      else if(k === 'listening') realMinutes += 5;
      else if(k === 'reading') realMinutes += 6;
      else if(k === 'writing') realMinutes += 30;
      else if(k === 'speaking') realMinutes += 4;
      else if(k === 'daily') realMinutes += 8;
      else if(k === 'battle') realMinutes += 3;
    });
    if(testProgress.videos && testProgress.videos.minutes){
      realMinutes += testProgress.videos.minutes;
    }
    // Jami vaqt MM:SS formatida
    const totalSecs = Math.round(realMinutes * 60);
    const mm = Math.floor(totalSecs / 60);
    const ss = totalSecs % 60;
    const timeStr = mm + ':' + String(ss).padStart(2,'0');

    // Natija taqsimoti: 80%+, 60-79%, <60%
    let highCount = 0, midCount = 0, lowCount = 0;
    allPcts.forEach(function(p){
      if(p >= 80) highCount++;
      else if(p >= 60) midCount++;
      else lowCount++;
    });
    const totalForDist = allPcts.length || 1;
    const highPct = Math.round(highCount / totalForDist * 100);
    const midPct = Math.round(midCount / totalForDist * 100);
    const lowPct = Math.round(lowCount / totalForDist * 100);

    // === YANGI ELEMENTLARNI TO'LDIRISH ===
    const setText = function(id, val){ const el = document.getElementById(id); if(el) el.textContent = val; };
    const setHTML = function(id, val){ const el = document.getElementById(id); if(el) el.innerHTML = val; };
    const setWidth = function(id, val){ const el = document.getElementById(id); if(el) el.style.width = val + '%'; };

    // Foydalanuvchi nomi
    const session = getSession();
    if(session && session.email){
      const uname = '@' + session.email.split('@')[0];
      setText('results-username', uname);
    }

    // Yuqori 4 ta karta
    setText('rs-total-tests', totalCompleted);
    setText('rs-avg-pct', avgPct + '%');
    setText('rs-best-pct', bestPct + '%');
    setText('rs-streak', streak);

    // STATISTIKA bo'limi
    setText('rs-stat-tests', totalCompleted);
    setText('rs-stat-avg', avgPct + '%');
    setText('rs-stat-best', bestPct + '%');
    setText('rs-stat-time', timeStr);

    // Skill o'rtachalari (Writing/Speaking — Band /9.0 IELTS)
    const wEl = document.getElementById('rs-stat-writing-band');
    if(wEl){
      wEl.textContent = writingDone ? Number(writingBand).toFixed(1) : '—';
      // Past ball (<5.0) bo'lsa qizil
      if(writingDone && Number(writingBand) < 5.0) wEl.classList.add('low');
      else wEl.classList.remove('low');
    }
    const sEl = document.getElementById('rs-stat-speaking-band');
    if(sEl){
      sEl.textContent = speakingDone ? Number(speakingBand).toFixed(1) : '—';
      if(speakingDone && Number(speakingBand) < 5.0) sEl.classList.add('low');
      else sEl.classList.remove('low');
    }
    setText('rs-stat-daily', dailyDone ? dailyPct + '%' : '0%');
    setText('rs-stat-listening', listeningDone ? listeningPct + '%' : '0%');
    setText('rs-stat-reading', readingDone ? readingPct + '%' : '0%');

    // Natija taqsimoti barlar
    setWidth('rs-dist-green', highPct);
    setWidth('rs-dist-yellow', midPct);
    setWidth('rs-dist-red', lowPct);
    setText('rs-dist-green-count', '(' + highCount + ')');
    setText('rs-dist-yellow-count', '(' + midCount + ')');
    setText('rs-dist-red-count', '(' + lowCount + ')');

    // Imtihonlar tarixi jadvali
    const tbody = document.getElementById('results-history-body');
    if(!historyItems.length){
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--ink-soft);padding:24px;">Hali testlar topshirilmadi. Yuqoridagi bo'limlardan testlarni boshlang!</td></tr>`;
      if(typeof updateCertificateAvailability === 'function') updateCertificateAvailability();
      if(typeof saveUserProgress === 'function') saveUserProgress();
      return;
    }
    tbody.innerHTML = historyItems.map(item => `
      <tr>
        <td><strong>${item.type}</strong><br><span style="font-size:12px;color:var(--ink-soft);">${item.detail}</span></td>
        <td style="color:var(--ink-soft);font-size:12.5px;">${item.date}</td>
        <td><strong style="color:var(--blue-deep);font-size:14px;">${item.score}</strong></td>
        <td><button class="dash-btn dash-btn-outline" style="padding:4px 10px;font-size:12px;" onclick="retakeSpecificTest('${item.key}')">Qayta topshirish</button></td>
      </tr>
    `).join('');

    if(typeof updateCertificateAvailability === 'function') updateCertificateAvailability();
    if(typeof saveUserProgress === 'function') saveUserProgress();
  }

  // Ketma-ket kunlar (streak) hisoblash — history dagi testlar sanalari bo'yicha
  function computeStreakDays(){
    const dates = [];
    ['listening','reading','writing','speaking','daily','aispeaking','battle','fullexam'].forEach(function(k){
      const t = testProgress[k];
      if(t && t.completed && t.date) dates.push(t.date);
    });
    if(testProgress.videos && testProgress.videos.date) dates.push(testProgress.videos.date);
    if(!dates.length) return 0;
    // Sanalarni unique va sort qilamiz (eng yangidan eski)
    const uniq = Array.from(new Set(dates)).sort().reverse();
    // Bugungi sana
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    // Bugun test topshirilgan bo'lsa, streak = 1 dan boshlaymiz
    if(uniq[0] !== todayStr) return 0; // bugun test yo'q — streak 0
    let streak = 1;
    for(let i = 1; i < uniq.length; i++){
      // Oldingi sana 1 kun oldin bo'lishi kerak
      const prev = new Date(uniq[i-1]);
      const cur = new Date(uniq[i]);
      const diff = Math.round((prev - cur) / (1000 * 60 * 60 * 24));
      if(diff === 1) streak++;
      else break;
    }
    return streak;
  }

  function retakeSpecificTest(key){
    if(key === 'writing') openWriting();
    else if(key === 'listening') openListening();
    else if(key === 'reading') openReading();
    else if(key === 'speaking') openSpeaking();
    else if(key === 'aispeaking') openAISpeaking();
    else if(key === 'battle') openBattle();
    else if(key === 'fullexam') openFullExam();
    else if(key === 'videos') openVideos();
    else openDaily();
  }

  function loadDemoExactResults(){
    // Demo natijalar — misol uchun (haqiqiy emas). Tasdiqlash so'raladi.
    if(!confirm("Demo natijalarni yuklaysizmi? Bu hozirgi natijalarni almashtiradi (Listening 7.5, Reading 7.0, Writing 6.5, Speaking 7.0, Daily 100% pROYeKSION.")) return;
    testProgress = {
      listening: { completed: true, band: 7.5, pct: 85, score: '5/5 to\'g\'ri', date: new Date().toISOString().split('T')[0] },
      reading:   { completed: true, band: 7.0, pct: 78, score: '4/5 to\'g\'ri', date: new Date().toISOString().split('T')[0] },
      writing:   { completed: true, band: 6.5, pct: 72, score: 'Band 6.5 (270 so\'z)', date: new Date().toISOString().split('T')[0] },
      speaking:  { completed: true, band: 7.0, pct: 78, score: 'Band 7.0 (120 so\'z)', date: new Date().toISOString().split('T')[0] },
      daily:     { completed: true, band: 8.0, pct: 100, score: '15/15 to\'g\'ri', date: new Date().toISOString().split('T')[0] },
      aispeaking:{ completed: false, band: 0, pct: 0, score: '', date: '', turns: 0, words: 0, minutes: 0 },
      battle:    { completed: false, band: 0, pct: 0, score: '', date: '', wins: 0, losses: 0, draws: 0 },
      fullexam:  { completed: false, band: 0, pct: 0, score: '', date: '', sections: null, timeUsed: 0 }
    };
    updateResultsDisplay();
    // Home panel ni ham yangilash (user info + recent tests)
    try { if(typeof updateHomeUserInfo === 'function') updateHomeUserInfo(); } catch(e){}
    try { if(typeof renderRecent === 'function') renderRecent(); } catch(e){}
    alert("✅ Demo natijalar yuklandi! Endi Natijalar bo'limi HAQIQIY hisob-kitob ko'rsatadi.");
  }

  function resetTestProgress(){
    if(confirm("Test natijalarini tozalab, 0 dan topshirishni xohlaysizmi?")){
      testProgress = {
        listening: { completed: false, band: 0, pct: 0, score: '', date: '' },
        reading:   { completed: false, band: 0, pct: 0, score: '', date: '' },
        writing:   { completed: false, band: 0, pct: 0, score: '', date: '' },
        speaking:  { completed: false, band: 0, pct: 0, score: '', date: '' },
        daily:     { completed: false, band: 0, pct: 0, score: '', date: '' },
        aispeaking:{ completed: false, band: 0, pct: 0, score: '', date: '', turns: 0, words: 0, minutes: 0 },
        battle:    { completed: false, band: 0, pct: 0, score: '', date: '', wins: 0, losses: 0, draws: 0 },
        fullexam:  { completed: false, band: 0, pct: 0, score: '', date: '', sections: null, timeUsed: 0 }
      };
      updateResultsDisplay();
    }
  }

  /* ============================================================
     FRESH CONTENT ROTATION ENGINE
     Har bir bo'limga kirilganda mavzu/savollar yangilanadi.
     Holat localStorage'da saqlanadi — sahifa yangilanganda ham
     takrorlanmaydi (bank tugagach yana boshidan aylanadi).
     ============================================================ */
  const SB_ROTATE_KEY = 'sb_rotate_state_v1';

  function sbRotateState(){
    try {
      const o = JSON.parse(localStorage.getItem(SB_ROTATE_KEY) || '{}');
      return (o && typeof o === 'object') ? o : {};
    } catch(e){ return {}; }
  }
  function sbSaveRotateState(o){
    try { localStorage.setItem(SB_ROTATE_KEY, JSON.stringify(o)); } catch(e){}
  }

  // Bank ichidan "yangi" indeks tanlaydi: oxirgi ishlatilganidan farqli,
  // imkon qadar butun bank aylanib chiqmaguncha takrorlanmaydi.
  function sbFreshIndex(length, poolKey){
    if(!length) return -1;
    const st = sbRotateState();
    const rec = st[poolKey] || { last: -1, used: [] };
    let used = Array.isArray(rec.used) ? rec.used.filter(function(i){ return i >= 0 && i < length; }) : [];
    let pool = [];
    for(let i = 0; i < length; i++) if(used.indexOf(i) === -1) pool.push(i);
    if(!pool.length){ used = []; for(let i = 0; i < length; i++) pool.push(i); }
    let candidates = pool.filter(function(i){ return i !== rec.last; });
    if(!candidates.length) candidates = pool;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    used.push(pick);
    while(used.length > Math.max(1, length - 1)) used.shift();
    st[poolKey] = { last: pick, used: used };
    sbSaveRotateState(st);
    return pick;
  }

  function sbPickFresh(arr, poolKey){
    if(!Array.isArray(arr) || !arr.length) return null;
    return arr[sbFreshIndex(arr.length, poolKey)];
  }

  // Massivdan n ta elementni tasodifiy (takrorlanmasdan) tanlaydi
  function sbPickMany(arr, n){
    const a = (arr || []).slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a.slice(0, Math.max(0, n));
  }

