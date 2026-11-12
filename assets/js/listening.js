// Englify — listening
  // --- LISTENING MOCK (alilm.uz uslubi) ---
  /* Listening bank — har kirishda yangi to'plam tanlanadi (har birida 10 savol) */
  const LISTEN_BANK = [
    {
      id: 'languages',
      title: 'The Value of Learning Languages',
      script: "Today we will talk about the importance of learning foreign languages. Many students study English because it is an international language. German is also popular in Europe, especially for work and study opportunities in countries like Germany and Austria. Learning a new language also opens the door to new cultures and friendships. Experts recommend practicing a little every day, because small steps lead to big results.",
      qs: [
        { q: "What is the main topic of the talk?", opts: ["Sports", "Foreign languages", "Food", "Travel"], ans: 1, hint: "Today we will talk about the importance of learning foreign languages." },
        { q: "Why do many students choose to study English?", opts: ["It is easy", "It is an international language", "It is required for cooking", "It has no grammar"], ans: 1, hint: "Many students study English because it is an international language." },
        { q: "Where is German especially popular for career opportunities?", opts: ["Asia", "Africa", "Europe", "South America"], ans: 2, hint: "German is also popular in Europe, especially for work and study opportunities in countries like Germany and Austria." },
        { q: "What does learning a new language open the door to?", opts: ["New cultures and friendships", "Cheap travel tickets", "Free university courses", "Better cooking skills"], ans: 0, hint: "Learning a new language also opens the door to new cultures and friendships." },
        { q: "What do experts recommend?", opts: ["Studying only before exams", "Practicing a little every day", "Learning many languages at once", "Watching TV in English only"], ans: 1, hint: "Experts recommend practicing a little every day, because small steps lead to big results." },
        { q: "Which two countries are mentioned as places where German is useful?", opts: ["Germany and Austria", "France and Spain", "Italy and Greece", "England and Ireland"], ans: 0, hint: "German is also popular in Europe, especially for work and study opportunities in countries like Germany and Austria." },
        { q: "What is the speaker's attitude towards learning languages?", opts: ["It is unnecessary", "It is a waste of time", "It is valuable and encouraging", "It is only for children"], ans: 2, hint: "Learning a new language also opens the door to new cultures and friendships." },
        { q: "According to the talk, what do small steps lead to?", opts: ["Small problems", "Big results", "Long delays", "No progress"], ans: 1, hint: "Because small steps lead to big results." },
        { q: "Which benefit is NOT mentioned in the talk?", opts: ["New cultures", "New friendships", "Study opportunities abroad", "A guaranteed higher salary"], ans: 3, hint: "The talk mentions cultures, friendships, work and study opportunities, but not a guaranteed salary." },
        { q: "What is the best title for this talk?", opts: ["The History of English", "Why Learning Foreign Languages Matters", "How to Cook German Food", "Travel in Europe"], ans: 1, hint: "The whole talk is about the importance and benefits of learning foreign languages." }
      ]
    },
    {
      id: 'library',
      title: 'Northside Community Library',
      script: "Welcome to Northside Community Library. Before you join, here is some practical information. Membership is free for students and senior citizens, while other adults pay a small annual fee of twelve dollars. You can borrow up to eight books at a time, and the loan period is three weeks. If you return a book late, the fine is fifty cents per day, but you can renew it online twice before the due date. The library opens at nine in the morning from Monday to Friday and at ten at weekends. Our quiet study room is on the second floor, and group discussion rooms must be booked at the front desk. Free computer classes are held every Wednesday afternoon. Finally, please note that food and drinks are not allowed near the computers, although you may use the cafe on the ground floor.",
      qs: [
        { q: "Who can join the library for free?", opts: ["Only children", "Students and senior citizens", "All adults", "Only teachers"], ans: 1, hint: "Membership is free for students and senior citizens." },
        { q: "How much do other adults pay?", opts: ["Nothing", "Five dollars", "Twelve dollars", "Fifty dollars"], ans: 2, hint: "Other adults pay a small annual fee of twelve dollars." },
        { q: "How many books can be borrowed at one time?", opts: ["Three", "Five", "Eight", "Twelve"], ans: 2, hint: "You can borrow up to eight books at a time." },
        { q: "How long is the loan period?", opts: ["One week", "Two weeks", "Three weeks", "One month"], ans: 2, hint: "The loan period is three weeks." },
        { q: "What is the fine for returning a book late?", opts: ["Fifty cents per day", "One dollar per day", "Twelve dollars", "There is no fine"], ans: 0, hint: "The fine is fifty cents per day." },
        { q: "How many times can a book be renewed online?", opts: ["Once", "Twice", "Three times", "Unlimited"], ans: 1, hint: "You can renew it online twice before the due date." },
        { q: "When does the library open at weekends?", opts: ["At eight", "At nine", "At ten", "At noon"], ans: 2, hint: "The library opens at nine in the morning from Monday to Friday and at ten at weekends." },
        { q: "Where is the quiet study room?", opts: ["On the ground floor", "On the first floor", "On the second floor", "Outside the building"], ans: 2, hint: "Our quiet study room is on the second floor." },
        { q: "What must be booked at the front desk?", opts: ["Computers", "Group discussion rooms", "Cafe tables", "Books"], ans: 1, hint: "Group discussion rooms must be booked at the front desk." },
        { q: "What are visitors asked not to do near the computers?", opts: ["Talk quietly", "Use the internet", "Eat and drink", "Read books"], ans: 2, hint: "Food and drinks are not allowed near the computers." }
      ]
    },
    {
      id: 'sleep',
      title: 'Healthy Sleep Habits',
      script: "Good evening, and thank you for coming to tonight's talk on healthy sleep. Many people believe that eight hours is the perfect amount for everyone, but research shows that the ideal length actually varies from person to person. Most adults need between seven and nine hours, while teenagers often need more. The quality of sleep matters as much as the quantity. To improve your sleep, try to go to bed and wake up at the same time every day, even at weekends. Avoid coffee after three in the afternoon, because caffeine stays in the body for several hours. Also, keep your bedroom cool, dark and quiet, and put your phone away at least thirty minutes before sleeping. If you still feel tired during the day after making these changes, you should speak to a doctor. Finally, remember that short naps of twenty minutes can be helpful, but long naps in the afternoon may make it harder to sleep at night.",
      qs: [
        { q: "What do many people wrongly believe about sleep?", opts: ["Sleep is not important", "Eight hours is perfect for everyone", "Everyone needs ten hours", "Naps are harmful"], ans: 1, hint: "Many people believe that eight hours is the perfect amount for everyone." },
        { q: "How much sleep do most adults need?", opts: ["Three to five hours", "Five to seven hours", "Seven to nine hours", "Ten to twelve hours"], ans: 2, hint: "Most adults need between seven and nine hours." },
        { q: "Which group often needs more sleep?", opts: ["Teenagers", "Older adults", "Babies only", "Office workers"], ans: 0, hint: "Teenagers often need more." },
        { q: "What matters as much as the quantity of sleep?", opts: ["The colour of the room", "The quality of sleep", "The size of the bed", "The time of dinner"], ans: 1, hint: "The quality of sleep matters as much as the quantity." },
        { q: "What should you do at weekends?", opts: ["Sleep all day", "Keep the same sleep schedule", "Go to bed much later", "Skip breakfast"], ans: 1, hint: "Try to go to bed and wake up at the same time every day, even at weekends." },
        { q: "Why should you avoid coffee after three in the afternoon?", opts: ["It tastes bad", "Caffeine stays in the body for several hours", "It makes you hungry", "It is expensive"], ans: 1, hint: "Caffeine stays in the body for several hours." },
        { q: "How should your bedroom be?", opts: ["Warm and bright", "Cool, dark and quiet", "Large and noisy", "Cold and full of light"], ans: 1, hint: "Keep your bedroom cool, dark and quiet." },
        { q: "What should you do with your phone before sleeping?", opts: ["Put it away thirty minutes before bed", "Use it in bed", "Charge it next to your pillow", "Turn the volume up"], ans: 0, hint: "Put your phone away at least thirty minutes before sleeping." },
        { q: "When should you speak to a doctor?", opts: ["Every night", "If you still feel tired during the day", "Before going to bed", "Only in winter"], ans: 1, hint: "If you still feel tired during the day after making these changes, you should speak to a doctor." },
        { q: "What does the speaker say about naps?", opts: ["All naps are bad", "Short twenty-minute naps can help", "Long naps are the best", "You should nap every hour"], ans: 1, hint: "Short naps of twenty minutes can be helpful, but long naps in the afternoon may make it harder to sleep at night." }
      ]
    }
  ];
  let LISTEN_DATA = LISTEN_BANK[0];
  const LMX_PLAY_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#6a3ff2"><path d="M8 5v14l11-7z"/></svg>';
  const LMX_PAUSE_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#6a3ff2"><path d="M6 5h4v14H6z"/><path d="M14 5h4v14h-4z"/></svg>';
  let lmState = { screen:'intro', idx:0, answers:{}, correct:0, revealed:false, timeLeft:30, audioOn:false };
  let listeningQTimer=null, listeningLoadTimer=null;

  function openListening(){
    clearInterval(listeningQTimer); clearInterval(listeningLoadTimer);
    try { sbTtsStop(); } catch(e){}
    showPanel('listening','Listening Mock');
    // Har kirishda yangi tinglash matni (10 savol bilan)
    LISTEN_DATA = sbPickFresh(LISTEN_BANK, 'listening') || LISTEN_BANK[0];
    lmState = { screen:'intro', idx:0, answers:{}, correct:0, revealed:false, timeLeft:30, audioOn:false };
    lmRenderIntro();
  }

  /* 1) INTRO EKRANI */
  function lmRenderIntro(){
    lmState.screen = 'intro';
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const qSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
    const bandSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    document.getElementById('listening-content').innerHTML = alRenderIntro({
      colorClass: 'al-purple',
      heroSvg: heroSvg,
      title: 'Listening Mock',
      sub: 'IELTS Listening — audioni tinglang va 10 ta savolga javob bering, real vaqt bilan',
      chips: [
        { svg: clockSvg, text: '~6 daqiqa' },
        { svg: qSvg, text: '10 ta savol' },
        { svg: bandSvg, text: 'Band 8.5 gacha' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: 'Audioni <b>diqqat bilan</b> tinglang — kerak bo\'lsa qayta eshity olasiz' },
        { txt: 'Har bir savolga <b>30 soniya</b> vaqt beriladi — tez javob bering' },
        { txt: 'Transkriptni ochib <b>matnni o\'qib</b> ham tekshira olasiz' },
        { txt: 'Natijangiz <b>Band 4.0–9.0</b> shkalasida baholanadi' }
      ],
      note: '🎧 Audioni eshitib javob berasiz — kerak bo\'lsa transkriptni ham ko\'rishingiz mumkin',
      btnText: 'Boshlash',
      btnAction: 'startListening()',
      motivate: 'Tinglash ko\'nikmasi — har kuni mashq qiling, natija albatta o\'sadi!'
    });
  }

  /* 2) LOADING EKRANI (aylana progress) */
  function startListening(){
    clearInterval(listeningLoadTimer);
    const state = lmState;
    lmState.screen = 'loading';
    lmState.aiPromise = aiGenerate('listening', 'B2', 70000)
      .then(function(d){
        if(!d || !String(d.script || '').trim() || !aiValidQuestionList(d.qs, 10)) return null;
        return {
          id: d.id || ('ai-listen-' + Date.now()),
          title: String(d.title || 'AI Listening').slice(0, 140),
          script: String(d.script).slice(0, 9000),
          qs: d.qs.slice(0, 10).map(function(q){
            return { q:String(q.q), opts:q.opts.slice(0,4), ans:q.ans, hint:String(q.hint || '') };
          })
        };
      })
      .catch(function(e){
        console.warn('Listening AI matni olinmadi, lokal bank ishlatiladi', e);
        return null;
      });
    const ring = (2 * Math.PI * 54).toFixed(2);
    document.getElementById('listening-content').innerHTML = `
      <div class="lmx-wrap">
        <div class="lmx-ring-wrap">
          <svg width="144" height="144" viewBox="0 0 120 120" style="transform:rotate(-90deg);">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--field)" stroke-width="8"/>
            <circle id="lmx-ring" cx="60" cy="60" r="54" fill="none" stroke="url(#lmxGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${ring}" stroke-dashoffset="${ring}" style="transition:stroke-dashoffset .3s ease-out;"/>
            <defs><linearGradient id="lmxGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#6a3ff2"/><stop offset="100%" stop-color="#9333ea"/></linearGradient></defs>
          </svg>
          <div class="lmx-ring-pct" id="lmx-pct">0%</div>
        </div>
        <h2 style="font-family:'Fraunces',serif;font-size:19px;font-weight:600;text-align:center;margin-bottom:8px;">Audio tayyorlanmoqda...</h2>
        <p style="font-size:13.5px;color:var(--ink-soft);text-align:center;line-height:1.6;">Listening savollari yuklanmoqda. Iltimos kuting...</p>
        <div class="lmx-load-bar"><div class="lmx-load-fill" id="lmx-lfill" style="width:0%;"></div></div>
        <p style="text-align:center;font-size:12px;color:var(--ink-soft);margin-top:10px;" id="lmx-ltxt">Yuklanmoqda 0%</p>
      </div>`;
    let pct = 0;
    listeningLoadTimer = setInterval(function(){
      pct += Math.floor(Math.random() * 6) + 3;
      if(pct >= 92){
        pct = 92;
        clearInterval(listeningLoadTimer); listeningLoadTimer = null;
        lmUpdateLoad(pct);
        const loadTxt = document.getElementById('lmx-ltxt');
        if(loadTxt) loadTxt.textContent = 'AI audio matni va 10 ta savol yaratmoqda...';
        Promise.all([
          lmState.aiPromise || Promise.resolve(null),
          new Promise(function(resolve){ setTimeout(resolve, 900); })
        ]).then(function(out){
          if(lmState !== state || state.screen !== 'loading') return;
          if(out[0]) LISTEN_DATA = out[0];
          lmUpdateLoad(100);
          setTimeout(function(){
            if(lmState !== state || state.screen !== 'loading') return;
            lmRenderAudio();
          }, 350);
        });
        return;
      }
      lmUpdateLoad(pct);
    }, 110);
  }

  function lmUpdateLoad(p){
    const ringEl = document.getElementById('lmx-ring');
    const off = (2 * Math.PI * 54).toFixed(2);
    if(ringEl) ringEl.style.strokeDashoffset = (off * (1 - p/100)).toFixed(2);
    const pctEl = document.getElementById('lmx-pct');
    if(pctEl) pctEl.textContent = p + '%';
    const fill = document.getElementById('lmx-lfill');
    if(fill) fill.style.width = p + '%';
    const txt = document.getElementById('lmx-ltxt');
    if(txt) txt.textContent = 'Yuklanmoqda ' + p + '%';
  }

  /* 3) AUDIO EKRANI — ovozli ijro + transkript */
  function lmRenderAudio(){
    lmState.screen = 'audio';
    const canSpeak = ('speechSynthesis' in window);
    document.getElementById('listening-content').innerHTML = `
      <div class="lmx-wrap">
        <div class="lmx-audio-card">
          <div class="lmx-audio-top">
            <button class="lmx-play" id="lmx-play" onclick="lmSpeak()" aria-label="Tinglash">${LMX_PLAY_SVG}</button>
            <div>
              <div class="lmx-audio-t">Audio yozuv</div>
              <div class="lmx-audio-sub">${canSpeak ? "Tinglash uchun play bosing" : "Matnni o'qing"}</div>
            </div>
          </div>
          <div class="lmx-wave" id="lmx-wave">${'<span></span>'.repeat(15)}</div>
        </div>
        <button class="lmx-transcript-toggle" id="lmx-tg" onclick="lmToggleTranscript()">📄 Transkriptni ko'rsatish</button>
        <div class="lmx-transcript" id="lmx-script" style="display:${canSpeak ? 'none' : 'block'};">"${LISTEN_DATA.script}"</div>
        <button class="lmx-btn" style="margin-top:14px;" onclick="lmBeginTesting()">Savollarga o'tish →</button>
      </div>`;
  }

  function lmSpeak(){
    if(!('speechSynthesis' in window)){ lmToggleTranscript(true); return; }
    if(lmState.audioOn){
      try { sbTtsStop(); } catch(e){}
      lmState.audioOn = false; lmSetAudioUI(false); return;
    }
    lmState.audioOn = true; lmSetAudioUI(true);
    try {
      sbTtsSpeak(LISTEN_DATA.script, {
        rate: 0.92,
        pitch: 1.0,
        volume: 1.0,
        onDone: function(){ lmState.audioOn = false; lmSetAudioUI(false); }
      });
    } catch(e){ lmState.audioOn = false; lmSetAudioUI(false); }
  }

  function lmSetAudioUI(playing){
    const btn = document.getElementById('lmx-play');
    const wave = document.getElementById('lmx-wave');
    if(btn) btn.innerHTML = playing ? LMX_PAUSE_SVG : LMX_PLAY_SVG;
    if(wave) wave.classList.toggle('play', playing);
  }

  function lmToggleTranscript(force){
    const sc = document.getElementById('lmx-script');
    const tg = document.getElementById('lmx-tg');
    if(!sc) return;
    const show = (force === true) ? true : (sc.style.display === 'none');
    sc.style.display = show ? 'block' : 'none';
    if(tg) tg.textContent = show ? '📄 Transkriptni yashirish' : "📄 Transkriptni ko'rsatish";
  }

  /* 4) TESTING EKRANI (har savolga 30 soniya) */
  function lmBeginTesting(){
    try { sbTtsStop(); } catch(e){}
    lmState.audioOn = false;
    lmState.idx = 0; lmState.answers = {}; lmState.correct = 0; lmState.revealed = false;
    lmState.screen = 'testing';
    showPanel('listening','Listening Mock');
    lmRenderQ();
  }

  function lmRenderQ(){
    clearInterval(listeningQTimer);
    try { sbTtsStop(); } catch(e){}
    const q = LISTEN_DATA.qs[lmState.idx];
    const total = LISTEN_DATA.qs.length;
    lmState.revealed = false; lmState.timeLeft = 30;
    document.getElementById('listening-content').innerHTML = `
      <div class="lmx-wrap">
        <div class="lmx-progrow">
          <div class="lmx-prog"><div class="lmx-prog-fill" style="width:${Math.round((lmState.idx+1)/total*100)}%;"></div></div>
          <span class="lmx-count">${lmState.idx+1} / ${total}</span>
        </div>
        <div class="lmx-timer-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" stroke-width="2.2" stroke-linecap="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          <span class="lmx-timer-sec" id="lmx-sec">30s</span>
          <div class="lmx-timer-bar"><div class="lmx-timer-fill" id="lmx-tfill" style="width:100%;"></div></div>
          <button class="lmx-replay" onclick="lmReplay()" title="Qayta tinglash">🔊</button>
          <span class="lmx-chip">Tinglash</span>
        </div>
        <div class="lmx-q">${q.q}</div>
        ${q.opts.map((o,i)=>`
          <button class="lmx-opt" id="lmx-opt-${i}" onclick="lmPick(${i})">
            <span class="letter">${String.fromCharCode(65+i)}</span>
            <span>${o}</span>
          </button>`).join('')}
        <div class="lmx-fb" id="lmx-fb"></div>
      </div>`;
    listeningQTimer = setInterval(lmTick, 1000);
  }

  function lmTick(){
    lmState.timeLeft--;
    const sec = document.getElementById('lmx-sec');
    const fill = document.getElementById('lmx-tfill');
    if(!sec || !fill || lmState.screen !== 'testing'){ clearInterval(listeningQTimer); return; }
    const t = Math.max(lmState.timeLeft, 0);
    sec.textContent = t + 's';
    fill.style.width = (t/30*100) + '%';
    fill.classList.toggle('warn', t <= 10 && t > 5);
    fill.classList.toggle('danger', t <= 5);
    sec.classList.toggle('danger', t <= 5);
    if(t <= 0 && !lmState.revealed) lmReveal(null, true);
  }

  function lmPick(i){
    if(lmState.revealed || lmState.screen !== 'testing') return;
    lmReveal(i, false);
  }

  function lmReveal(i, timeout){
    if(lmState.revealed) return;
    lmState.revealed = true;
    clearInterval(listeningQTimer);
    const q = LISTEN_DATA.qs[lmState.idx];
    lmState.answers[lmState.idx] = i;
    const ok = (i === q.ans);
    if(ok) lmState.correct++;
    q.opts.forEach(function(_, k){
      const el = document.getElementById('lmx-opt-' + k);
      if(!el) return;
      el.classList.add('dim');
      if(k === q.ans) el.classList.add('correct');
      else if(k === i) el.classList.add('wrong');
    });
    const ansLetter = document.querySelector('#lmx-opt-' + q.ans + ' .letter');
    if(ansLetter) ansLetter.textContent = '✓';
    if(i !== null && i !== undefined && !ok){
      const selLetter = document.querySelector('#lmx-opt-' + i + ' .letter');
      if(selLetter) selLetter.textContent = '✗';
    }
    const fb = document.getElementById('lmx-fb');
    if(fb){
      if(timeout){ fb.className = 'lmx-fb timeout'; fb.textContent = '⏰ Vaqt tugadi!'; }
      else if(ok){ fb.className = 'lmx-fb ok'; fb.textContent = "✓ To'g'ri!"; }
      else { fb.className = 'lmx-fb no'; fb.textContent = "✗ Noto'g'ri"; }
    }
    setTimeout(lmNext, timeout ? 1400 : 1000);
  }

  function lmNext(){
    if(lmState.screen !== 'testing') return;
    lmState.idx++;
    if(lmState.idx >= LISTEN_DATA.qs.length){ lmFinish(); return; }
    lmRenderQ();
  }

  function lmReplay(){
    if(lmState.screen !== 'testing') return;
    try {
      if(!('speechSynthesis' in window)) return;
      const q = LISTEN_DATA.qs[lmState.idx];
      sbTtsSpeak(q.hint, { rate: 0.9, pitch: 1.0, volume: 1.0 });
    } catch(e){}
  }

  /* 5) NATIJA EKRANI */
  function lmFinish(){
    clearInterval(listeningQTimer);
    try { sbTtsStop(); } catch(e){}
    const total = LISTEN_DATA.qs.length;
    const details = [];
    LISTEN_DATA.qs.forEach(function(q, k){
      const ua = lmState.answers[k];
      details.push({ q:q.q, hint:q.hint, opts:q.opts, ans:q.ans, user:ua, ok:(ua === q.ans) });
    });
    const pct = Math.round(lmState.correct / total * 100);
    let band = 4.0;
    if(pct >= 95) band = 9.0;
    else if(pct >= 90) band = 8.5;
    else if(pct >= 85) band = 8.0;
    else if(pct >= 80) band = 7.5;
    else if(pct >= 75) band = 7.0;
    else if(pct >= 70) band = 7.0;
    else if(pct >= 65) band = 6.5;
    else if(pct >= 60) band = 6.5;
    else if(pct >= 55) band = 6.0;
    else if(pct >= 50) band = 6.0;
    else if(pct >= 40) band = 5.5;
    else if(pct >= 30) band = 5.0;
    else if(pct >= 20) band = 4.5;
    testProgress.listening = {
      completed: true,
      band: band,
      pct: pct,
      score: lmState.correct + '/' + total + " to'g'ri",
      date: new Date().toISOString().split('T')[0]
    };
    if(typeof saveUserProgress === 'function') saveUserProgress();
    if(typeof updateResultsDisplay === 'function') updateResultsDisplay();
    lmState.screen = 'result';
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : pct >= 40 ? '👍' : '💪';
    const cls = pct >= 70 ? 'good' : pct >= 50 ? 'mid' : 'bad';
    const reviewRows = details.map(function(d, k){
      const uaTxt = (d.user === null || d.user === undefined) ? '—' : (String.fromCharCode(65 + d.user) + '. ' + d.opts[d.user]);
      return `<div class="lmx-rev-item">
        <div class="lmx-rev-top">
          <div class="lmx-rev-ic ${d.ok ? 'ok' : 'no'}">${d.ok ? '✓' : '✗'}</div>
          <div class="lmx-rev-q">
            <div>${d.q}</div>
            ${d.ok ? '' : `<div class="lmx-rev-ans">Sizning javobingiz: ${uaTxt} → To'g'ri javob: ${String.fromCharCode(65 + d.ans)}. ${d.opts[d.ans]}</div>`}
          </div>
        </div>
        ${lmRevDetail(d, k)}
      </div>`;
    }).join('');
    document.getElementById('listening-content').innerHTML = `
      <div class="lmx-wrap">
        <div class="lmx-res-card">
          <div class="lmx-res-emoji">${emoji}</div>
          <div class="lmx-res-pct ${cls}">${pct}%</div>
          <div class="lmx-res-sub">${lmState.correct}/${total} to'g'ri javob • Band ${band}</div>
        </div>
        <div class="lmx-panel">
          <div class="lmx-panel-h">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a3ff2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
            Javoblarni ko'rish
          </div>
          ${reviewRows}
        </div>
        <div class="lmx-comeback">Har kuni mashq qiling — natijangiz albatta o'sadi! 🎯</div>
        <button class="lmx-btn" onclick="switchTab('home')">Bosh sahifa</button>
        <button class="lmx-btn-outline" style="margin-top:12px;" onclick="openListening()">Qayta urinish</button>
      </div>`;
  }

  function lmRevDetail(d, k){
    const rows = d.opts.map(function(o, i){
      const isAns = (i === d.ans);
      const isUser = (!d.ok && i === d.user);
      let cls = '';
      let mark = '';
      if(isAns){ cls = 'hit'; mark = ' ✓'; }
      else if(isUser){ cls = 'miss'; mark = ' ✗'; }
      return `<div class="lmx-rev-opt ${cls}"><b>${String.fromCharCode(65 + i)}.</b><span>${o}${mark}</span></div>`;
    }).join('');
    return `<button class="lmx-rev-toggle" onclick="lmToggleDetail(${k})" id="lmx-tg-${k}">▾ Batafsil</button>
      <div class="lmx-rev-detail" id="lmx-det-${k}" style="display:none;">
        <div class="lmx-rev-passage">🎧 "${d.hint}"</div>
        ${rows}
      </div>`;
  }

  function lmToggleDetail(k){
    const det = document.getElementById('lmx-det-' + k);
    const tg = document.getElementById('lmx-tg-' + k);
    if(!det) return;
    const open = (det.style.display !== 'none');
    det.style.display = open ? 'none' : 'block';
    if(tg) tg.innerHTML = open ? '▾ Batafsil' : '▴ Yopish';
  }

  /* Orqaga — test davomida tasdiq so'raladi (alilm kabi) */
  function listeningBack(){
    if(lmState.screen === 'testing' && !lmState.revealed){
      if(!confirm("Imtihon tugallanmagan! Agar chiqsangiz, shu javoblaringiz o'chadi va shu joydan davom eta olmaysiz. Chiqishni tasdiqlaysizmi?")) return;
    }
    if(lmState.screen === 'loading') clearInterval(listeningLoadTimer);
    clearInterval(listeningQTimer);
    try { sbTtsStop(); } catch(e){}
    switchTab('home');
  }

