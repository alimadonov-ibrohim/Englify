// Englify — listening
  // --- LISTENING MOCK (yangi dizayn, AI jonli audio) ---
  /* Listening bank — faqat zaxira uchun (AI ishlamasa). Har birida 10 savol. */
  const LISTEN_BANK = [
    {
      id: 'languages',
      title: 'The Value of Learning English',
      script: "Today we will talk about the importance of learning English. English is an international language, and it is used in many countries for work, study and travel. Students learn English because it gives them access to a wider world of information, books and films. Experts also say that learning a new language improves memory and confidence. The best way to make progress is to practice a little every day: listen to short recordings, read simple texts and speak with friends. Small steps lead to big results over time.",
      qs: [
        { q: "What is the main topic of the talk?", opts: ["Sports", "Learning English", "Food", "Travel"], ans: 1, hint: "Today we will talk about the importance of learning English." },
        { q: "Why do many students choose to study English?", opts: ["It is easy", "It is an international language", "It is required for cooking", "It has no grammar"], ans: 1, hint: "Many students study English because it is an international language." },
        { q: "Where is English used, according to the talk?", opts: ["Only in one country", "In many countries", "Only at home", "Only in exams"], ans: 1, hint: "English is an international language, and it is used in many countries for work, study and travel." },
        { q: "What access does English give students?", opts: ["More information, books and films", "Cheap travel tickets", "Free university courses", "Better cooking skills"], ans: 0, hint: "It gives them access to a wider world of information, books and films." },
        { q: "What do experts say about learning a new language?", opts: ["It is unnecessary", "It improves memory and confidence", "It is only for children", "It has no benefits"], ans: 1, hint: "Experts also say that learning a new language improves memory and confidence." },
        { q: "What do experts recommend?", opts: ["Studying only before exams", "Practicing a little every day", "Learning many languages at once", "Watching TV only"], ans: 1, hint: "The best way to make progress is to practice a little every day." },
        { q: "Which activity is NOT mentioned as daily practice?", opts: ["Listening to short recordings", "Reading simple texts", "Speaking with friends", "Playing computer games"], ans: 3, hint: "The talk mentions listening, reading and speaking with friends." },
        { q: "According to the talk, what do small steps lead to?", opts: ["Small problems", "Big results", "Long delays", "No progress"], ans: 1, hint: "Because small steps lead to big results over time." },
        { q: "Which benefit is NOT mentioned in the talk?", opts: ["More information", "Better memory", "More confidence", "A guaranteed higher salary"], ans: 3, hint: "The talk mentions information, memory and confidence, but not a guaranteed salary." },
        { q: "What is the best title for this talk?", opts: ["The History of English", "Why Learning English Matters", "How to Cook at Home", "Travel in Europe"], ans: 1, hint: "The whole talk is about the importance and benefits of learning English." }
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
  const LSN_PLAY_SVG = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.2-6.8c.6-.4.6-1.3 0-1.7L9.6 4.3c-.7-.4-1.6.1-1.6.9z"/></svg>';
  const LSN_PAUSE_SVG = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4.2" height="15" rx="1.6"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.6"/></svg>';
  const LSN_REPLAY_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';
  let lmState = { screen:'intro', idx:0, answers:{}, correct:0, revealed:false, timeLeft:30, audioOn:false, rate:1, source:'local' };
  let listeningQTimer=null, listeningLoadTimer=null, listeningProgTimer=null;

  function lsnEsc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function lsnWords(text){ return String(text || '').trim().split(/\s+/).filter(Boolean).length; }
  function lsnFmt(sec){
    sec = Math.max(0, Math.round(sec || 0));
    return Math.floor(sec/60) + ':' + String(sec%60).padStart(2, '0');
  }
  function lsnStopAllAudio(){
    lmState.audioOn = false;
    clearInterval(listeningProgTimer);
    listeningProgTimer = null;
    try { sbStudioStop(); } catch(e){}
  }

  function openListening(){
    clearInterval(listeningQTimer); clearInterval(listeningLoadTimer);
    lsnStopAllAudio();
    showPanel('listening','Listening Mock');
    LISTEN_DATA = LISTEN_BANK[0];
    lmState = { screen:'intro', idx:0, answers:{}, correct:0, revealed:false, timeLeft:30, audioOn:false, rate:1, source:'local' };
    lmRenderIntro();
  }

  /* 1) INTRO EKRANI */
  function lmRenderIntro(){
    lmState.screen = 'intro';
    lsnStopAllAudio();
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const qSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
    const aiSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    document.getElementById('listening-content').innerHTML = alRenderIntro({
      colorClass: 'al-purple',
      heroSvg: heroSvg,
      title: 'Listening Mock',
      sub: 'Har safar AI siz uchun yangi audio matn va 10 ta savol yaratadi — xuddi haqiqiy IELTS imtihonidek',
      chips: [
        { svg: aiSvg, text: 'Jonli AI audio' },
        { svg: qSvg, text: '10 ta savol' },
        { svg: clockSvg, text: '~6 daqiqa' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: 'AI <b>yangi audio</b> va savollarni tayyorlaydi — har kirishda boshqa mavzu' },
        { txt: 'Audioni <b>diqqat bilan</b> tinglang, kerak bo\'lsa to\'xtatib qayta eshiting' },
        { txt: 'Har bir savolga <b>30 soniya</b> vaqt beriladi' },
        { txt: 'Natijangiz <b>Band 4.0–9.0</b> shkalasida baholanadi' }
      ],
      note: '🎧 Audio Gemini neural ovozi bilan tayyorlanadi — tiniq va tabiiy eshitiladi',
      btnText: 'AI audio yaratish',
      btnAction: 'startListening()',
      motivate: 'Har kuni bitta listening — eng tez o\'sadigan ko\'nikma!'
    });
  }

  /* 2) LOADING EKRANI */
  function startListening(){
    clearInterval(listeningLoadTimer);
    lsnStopAllAudio();
    const state = lmState;
    lmState.screen = 'loading';
    lmState.source = 'local';

    function generateOnce(){
      return aiGenerate('listening', 'B2', 22000).then(function(d){
        if(!d || !String(d.script || '').trim() || !aiValidQuestionList(d.qs, 10)) return null;
        return {
          id: d.id || ('ai-listen-' + Date.now()),
          title: String(d.title || 'AI Listening').slice(0, 140),
          script: String(d.script).slice(0, 9000),
          qs: d.qs.slice(0, 10).map(function(q){
            return { q:String(q.q), opts:q.opts.slice(0,4).map(String), ans:q.ans, hint:String(q.hint || '') };
          })
        };
      }).catch(function(e){
        console.warn('Listening AI matni olinmadi', e);
        return null;
      });
    }

    lmState.aiPromise = generateOnce().then(function(first){
      if(first) return first;
      // Bir marta qayta urinish — AI formati mos kelmasa
      return generateOnce();
    });

    const ring = (2 * Math.PI * 54).toFixed(2);
    document.getElementById('listening-content').innerHTML = `
      <div class="lsn-wrap lsn-loading">
        <div class="lsn-ring-wrap">
          <svg width="150" height="150" viewBox="0 0 120 120" style="transform:rotate(-90deg);">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--field)" stroke-width="8"/>
            <circle id="lsn-ring" cx="60" cy="60" r="54" fill="none" stroke="url(#lsnGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${ring}" stroke-dashoffset="${ring}" style="transition:stroke-dashoffset .4s ease-out;"/>
            <defs><linearGradient id="lsnGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient></defs>
          </svg>
          <div class="lsn-ring-pct" id="lsn-pct">0%</div>
        </div>
        <div class="lsn-load-badge">🤖 Gemini AI</div>
        <h2 class="lsn-load-title">Audio tayyorlanmoqda...</h2>
        <p class="lsn-load-sub" id="lsn-ltxt">Mavzu tanlanmoqda...</p>
        <div class="lsn-load-dots"><span></span><span></span><span></span></div>
      </div>`;

    const msgs = ['Mavzu tanlanmoqda...', 'AI matn yozmoqda...', '10 ta savol tuzilmoqda...', 'Ovoz va transkript tayyorlanmoqda...'];
    let pct = 0, mi = 0;
    const txt = document.getElementById('lsn-ltxt');
    const msgTimer = setInterval(function(){
      mi = (mi + 1) % msgs.length;
      if(txt && state.screen === 'loading') txt.textContent = msgs[mi];
    }, 2600);

    listeningLoadTimer = setInterval(function(){
      pct += Math.max(2, Math.round((92 - pct) / 12));
      if(pct >= 92) pct = 92;
      lmUpdateLoad(pct);
      if(pct >= 92) clearInterval(listeningLoadTimer);
    }, 180);

    function lmFinish(out){
      clearInterval(msgTimer);
      clearInterval(listeningLoadTimer);
      if(lmState !== state || state.screen !== 'loading') return;
      if(out && out[0]){
        LISTEN_DATA = out[0];
        lmState.source = 'ai';
      } else {
        LISTEN_DATA = LISTEN_BANK[Math.floor(Math.random() * LISTEN_BANK.length)] || LISTEN_BANK[0];
        lmState.source = 'local';
      }
      lmUpdateLoad(100);
      setTimeout(function(){
        if(lmState !== state || state.screen !== 'loading') return;
        lmRenderAudio();
      }, 380);
    }
    Promise.all([
      aiWithTimeout(lmState.aiPromise, 14000, null),
      new Promise(function(resolve){ setTimeout(resolve, 1100); })
    ]).then(lmFinish).catch(function(){ lmFinish([null]); });
  }

  function lmUpdateLoad(p){
    const ringEl = document.getElementById('lsn-ring');
    const off = (2 * Math.PI * 54).toFixed(2);
    if(ringEl) ringEl.style.strokeDashoffset = (off * (1 - p/100)).toFixed(2);
    const pctEl = document.getElementById('lsn-pct');
    if(pctEl) pctEl.textContent = p + '%';
  }

  /* 3) AUDIO EKRANI */
  function lmRenderAudio(){
    lmState.screen = 'audio';
    lmState.audioOn = false;
    const words = lsnWords(LISTEN_DATA.script);
    const est = Math.max(20, Math.round(words / 2.5));
    document.getElementById('listening-content').innerHTML = `
      <div class="lsn-wrap">
        <div class="lsn-hero-card">
          <div class="lsn-hero-glow"></div>
          <div class="lsn-hero-top">
            <span class="lsn-badge ${lmState.source === 'ai' ? 'ai' : 'local'}" id="lsn-src">${lmState.source === 'ai' ? '🤖 AI audio' : '📚 Zaxira audio'}</span>
            <span class="lsn-words">${words} so'z · ~${Math.ceil(est/60)} daq</span>
          </div>
          <h2 class="lsn-audio-title">${lsnEsc(LISTEN_DATA.title)}</h2>
          <div class="lsn-player">
            <button class="lsn-play" id="lsn-play" onclick="lmSpeak()" aria-label="Tinglash">${LSN_PLAY_SVG}</button>
            <div class="lsn-player-main">
              <div class="lsn-progress" onclick="lsnSeekHint()"><div class="lsn-progress-fill" id="lsn-pfill"></div></div>
              <div class="lsn-player-meta"><span id="lsn-time">0:00</span><span id="lsn-dur">${lsnFmt(est)}</span></div>
            </div>
          </div>
          <div class="lsn-wave" id="lsn-wave">${'<span></span>'.repeat(32)}</div>
          <div class="lsn-speed-row">
            <span class="lsn-speed-label">Tezlik</span>
            <button class="lsn-speed ${lmState.rate===0.8?'on':''}" onclick="lsnSetRate(0.8)">0.8×</button>
            <button class="lsn-speed ${lmState.rate===1?'on':''}" onclick="lsnSetRate(1)">1×</button>
            <button class="lsn-speed ${lmState.rate===1.2?'on':''}" onclick="lsnSetRate(1.2)">1.2×</button>
            <span class="lsn-speed-note" id="lsn-voice-note">${('speechSynthesis' in window) ? 'Neural ovoz' : ''}</span>
          </div>
        </div>
        <button class="lsn-transcript-btn" id="lsn-tg" onclick="lmToggleTranscript()"><span>📄 Transkriptni ko'rsatish</span><span class="chev">▾</span></button>
        <div class="lsn-transcript" id="lsn-script" style="display:none;">${lsnEsc(LISTEN_DATA.script)}</div>
        <button class="lsn-primary" onclick="lmBeginTesting()">Savollarga o'tish <span>→</span></button>
        <button class="lsn-ghost" onclick="startListening()">↻ Boshqa AI audio yaratish</button>
      </div>`;
  }

  function lsnSeekHint(){ /* progress bosilganda qayta boshlash */ }

  function lsnSetRate(r){
    lmState.rate = r;
    document.querySelectorAll('.lsn-speed').forEach(function(b){ b.classList.remove('on'); });
    const idx = r === 0.8 ? 0 : r === 0.9 ? 1 : r === 1.2 ? 2 : 1;
    const btns = document.querySelectorAll('.lsn-speed');
    if(btns[idx]) btns[idx].classList.add('on');
    if(lmState.audioOn){
      lsnStopAllAudio();
      lmSetAudioUI(false);
      setTimeout(lmSpeak, 120);
    }
  }

  function lmSpeak(){
    if(!lmState.audioOn){
      if(!('speechSynthesis' in window) && !(window.Audio && window.fetch)){
        lmToggleTranscript(true);
        return;
      }
      lsnStartPlayback();
    } else {
      lsnStopAllAudio();
      lmSetAudioUI(false);
      const note = document.getElementById('lsn-voice-note');
      if(note) note.textContent = 'To\'xtatildi';
    }
  }

  function lsnStartPlayback(){
    lsnStopAllAudio();
    lmState.audioOn = true;
    lmState.playStart = Date.now();
    const words = lsnWords(LISTEN_DATA.script);
    lmState.estSec = Math.max(20, Math.round(words / 2.5));
    lmSetAudioUI(true);
    const note = document.getElementById('lsn-voice-note');
    if(note) note.textContent = 'Audio ijro etilmoqda';

    lmState.chunkProgress = false;
    listeningProgTimer = setInterval(function(){
      if(!lmState.audioOn) return;
      const el = (Date.now() - lmState.playStart) / 1000;
      const p = Math.min(97, el / lmState.estSec * 100);
      const fill = document.getElementById('lsn-pfill');
      const t = document.getElementById('lsn-time');
      // Haqiqiy chunk progressi bo'lsa, taxminiy foizni ustidan yozmaymiz
      if(fill && !lmState.chunkProgress) fill.style.width = p + '%';
      if(t) t.textContent = lsnFmt(el);
    }, 200);

    sbStudioSpeak(LISTEN_DATA.script, {
      rate: lmState.rate,
      onProgress: function(ratio){
        lmState.chunkProgress = true;
        const fill = document.getElementById('lsn-pfill');
        if(fill && lmState.audioOn) fill.style.width = Math.max(2, Math.min(99, ratio * 100)) + '%';
      },
      onFallback: function(){
        const badge = document.getElementById('lsn-src');
        if(badge && lmState.source === 'ai') badge.textContent = '🔊 Brauzer ovozi';
        const n = document.getElementById('lsn-voice-note');
        if(n) n.textContent = 'Brauzer ovozi';
      },
      onDone: function(){
        if(lmState.screen !== 'audio') return;
        lmState.audioOn = false;
        clearInterval(listeningProgTimer);
        listeningProgTimer = null;
        lmSetAudioUI(false);
        const fill = document.getElementById('lsn-pfill');
        if(fill) fill.style.width = '100%';
        const t = document.getElementById('lsn-time');
        if(t) t.textContent = lsnFmt(lmState.estSec);
      }
    });
  }

  function lmSetAudioUI(playing){
    const btn = document.getElementById('lsn-play');
    const wave = document.getElementById('lsn-wave');
    if(btn) btn.innerHTML = playing ? LSN_PAUSE_SVG : LSN_PLAY_SVG;
    if(btn) btn.classList.toggle('playing', playing);
    if(wave) wave.classList.toggle('play', playing);
  }

  function lmToggleTranscript(force){
    const sc = document.getElementById('lsn-script');
    const tg = document.getElementById('lsn-tg');
    if(!sc) return;
    const show = (force === true) ? true : (sc.style.display === 'none');
    sc.style.display = show ? 'block' : 'none';
    if(tg){
      tg.querySelector('span').textContent = show ? '📄 Transkriptni yashirish' : "📄 Transkriptni ko'rsatish";
      tg.classList.toggle('open', show);
    }
  }

  /* 4) TESTING EKRANI */
  function lmBeginTesting(){
    lsnStopAllAudio();
    clearInterval(listeningProgTimer);
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
    const dots = LISTEN_DATA.qs.map(function(_, i){
      let cls = '';
      if(i < lmState.idx) cls = (lmState.answers[i] === LISTEN_DATA.qs[i].ans) ? 'done' : 'miss';
      if(i === lmState.idx) cls = 'now';
      return '<span class="lsn-dot ' + cls + '"></span>';
    }).join('');
    document.getElementById('listening-content').innerHTML = `
      <div class="lsn-wrap">
        <div class="lsn-qhead">
          <div class="lsn-dots">${dots}</div>
          <div class="lsn-timer-ring" id="lsn-ringbox">
            <svg width="46" height="46" viewBox="0 0 46 46">
              <circle cx="23" cy="23" r="19" fill="none" stroke="var(--field)" stroke-width="4"/>
              <circle class="lsn-ring-fg" id="lsn-tring" cx="23" cy="23" r="19" fill="none" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round" stroke-dasharray="119.38" stroke-dashoffset="0" style="transform:rotate(-90deg);transform-origin:23px 23px;"/>
            </svg>
            <span class="lsn-timer-num" id="lsn-sec">30</span>
          </div>
        </div>
        <div class="lsn-qcard">
          <div class="lsn-qnum">SAVOL ${lmState.idx+1} <span>/ ${total}</span></div>
          <div class="lsn-qtext">${lsnEsc(q.q)}</div>
        </div>
        <div class="lsn-opts">
          ${q.opts.map(function(o,i){
            return '<button class="lsn-opt" id="lsn-opt-' + i + '" onclick="lmPick(' + i + ')">' +
              '<span class="letter">' + String.fromCharCode(65+i) + '</span>' +
              '<span class="txt">' + lsnEsc(o) + '</span>' +
              '<span class="tick"></span>' +
            '</button>';
          }).join('')}
        </div>
        <div class="lsn-qfoot">
          <button class="lsn-replay" onclick="lmReplay()">${LSN_REPLAY_SVG} Qayta tinglash</button>
          <span class="lsn-qhint">Javobdan so'ng avtomatik keyingisi</span>
        </div>
        <div class="lsn-feedback" id="lsn-fb"></div>
      </div>`;
    listeningQTimer = setInterval(lmTick, 1000);
  }

  function lmTick(){
    lmState.timeLeft--;
    const sec = document.getElementById('lsn-sec');
    const ring = document.getElementById('lsn-tring');
    const box = document.getElementById('lsn-ringbox');
    if(!sec || !ring || lmState.screen !== 'testing'){ clearInterval(listeningQTimer); return; }
    const t = Math.max(lmState.timeLeft, 0);
    sec.textContent = t;
    ring.style.strokeDashoffset = (119.38 * (1 - t/30)).toFixed(2);
    if(t <= 10){ ring.setAttribute('stroke', '#f59e0b'); if(box) box.classList.add('warn'); }
    if(t <= 5){ ring.setAttribute('stroke', '#ef4444'); if(box){ box.classList.remove('warn'); box.classList.add('danger'); } }
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
      const el = document.getElementById('lsn-opt-' + k);
      if(!el) return;
      el.classList.add('locked');
      if(k === q.ans){
        el.classList.add('correct');
        const tick = el.querySelector('.tick');
        if(tick) tick.textContent = '✓';
      } else if(k === i){
        el.classList.add('wrong');
        const tick = el.querySelector('.tick');
        if(tick) tick.textContent = '✗';
      }
    });
    const fb = document.getElementById('lsn-fb');
    if(fb){
      if(timeout){ fb.className = 'lsn-feedback timeout'; fb.textContent = '⏰ Vaqt tugadi'; }
      else if(ok){ fb.className = 'lsn-feedback ok'; fb.textContent = '✓ To\'g\'ri javob!'; }
      else { fb.className = 'lsn-feedback no'; fb.textContent = '✗ Noto\'g\'ri — to\'g\'ri javob belgilandi'; }
    }
    setTimeout(lmNext, timeout ? 1600 : 1200);
  }

  function lmNext(){
    if(lmState.screen !== 'testing') return;
    lmState.idx++;
    if(lmState.idx >= LISTEN_DATA.qs.length){ lmFinish(); return; }
    lmRenderQ();
  }

  function lmReplay(){
    if(lmState.screen !== 'testing') return;
    // Asosiy audio ijro etilayotgan bo'lsa, uni to'xtatamiz
    if(lmState.audioOn){ lsnStopAllAudio(); lmSetAudioUI(false); }
    const q = LISTEN_DATA.qs[lmState.idx];
    const line = q.hint || q.q;
    const btn = document.querySelector('.lsn-replay');
    if(btn) btn.classList.add('playing');
    sbStudioSpeak(line, {
      rate: lmState.rate,
      onDone: function(){ if(btn) btn.classList.remove('playing'); },
      onFallback: function(){ if(btn) btn.classList.remove('playing'); }
    });
  }

  /* 5) NATIJA EKRANI */
  function lmFinish(){
    clearInterval(listeningQTimer);
    lsnStopAllAudio();
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
    const C = 2 * Math.PI * 52;
    const off = (C * (1 - pct / 100)).toFixed(1);
    const reviewRows = details.map(function(d, k){
      const uaTxt = (d.user === null || d.user === undefined) ? '—' : (String.fromCharCode(65 + d.user) + '. ' + d.opts[d.user]);
      return `<div class="lsn-rev-item">
        <div class="lsn-rev-top">
          <div class="lsn-rev-ic ${d.ok ? 'ok' : 'no'}">${d.ok ? '✓' : '✗'}</div>
          <div class="lsn-rev-q">
            <div class="lsn-rev-num">${k+1}.</div>
            <div>${lsnEsc(d.q)}</div>
            ${d.ok ? '' : `<div class="lsn-rev-ans">Sizning javobingiz: ${lsnEsc(uaTxt)} → To'g'ri: ${String.fromCharCode(65 + d.ans)}. ${lsnEsc(d.opts[d.ans])}</div>`}
          </div>
        </div>
        ${lmRevDetail(d, k)}
      </div>`;
    }).join('');
    document.getElementById('listening-content').innerHTML = `
      <div class="lsn-wrap">
        <div class="lsn-res-card">
          <div class="lsn-res-ring">
            <svg width="150" height="150" viewBox="0 0 120 120" style="transform:rotate(-90deg);">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--field)" stroke-width="11"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#lsnResGrad)" stroke-width="11" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off}"/>
              <defs><linearGradient id="lsnResGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient></defs>
            </svg>
            <div class="lsn-res-inner"><span class="lsn-res-emoji">${emoji}</span><span class="lsn-res-pct ${cls}">${pct}%</span></div>
          </div>
          <div class="lsn-res-stats">
            <div><b>${lmState.correct}/${total}</b><span>to'g'ri</span></div>
            <div><b>${band}</b><span>band</span></div>
            <div><b>${total}</b><span>savol</span></div>
          </div>
          <div class="lsn-res-title">${pct >= 70 ? 'Ajoyib natija!' : pct >= 50 ? 'Yaxshi, davom eting!' : 'Mashq qilishda davom eting!'}</div>
        </div>
        <div class="lsn-panel">
          <div class="lsn-panel-h">📋 Javoblarni ko'rish</div>
          ${reviewRows}
        </div>
        <div class="lsn-comeback">Har kuni mashq qiling — natijangiz albatta o'sadi! 🎯</div>
        <button class="lsn-primary" onclick="startListening()">↻ Yangi AI audio bilan urinish</button>
        <button class="lsn-ghost" onclick="switchTab('home')">Bosh sahifa</button>
      </div>`;
    window.scrollTo(0, 0);
  }

  function lmRevDetail(d, k){
    const rows = d.opts.map(function(o, i){
      const isAns = (i === d.ans);
      const isUser = (!d.ok && i === d.user);
      let cls = '';
      let mark = '';
      if(isAns){ cls = 'hit'; mark = ' ✓'; }
      else if(isUser){ cls = 'miss'; mark = ' ✗'; }
      return `<div class="lsn-rev-opt ${cls}"><b>${String.fromCharCode(65 + i)}.</b><span>${lsnEsc(o)}${mark}</span></div>`;
    }).join('');
    return `<button class="lsn-rev-toggle" onclick="lmToggleDetail(${k})" id="lsn-tg-${k}">▾ Batafsil</button>
      <div class="lsn-rev-detail" id="lsn-det-${k}" style="display:none;">
        <div class="lsn-rev-passage">🎧 "${lsnEsc(d.hint)}"</div>
        ${rows}
      </div>`;
  }

  function lmToggleDetail(k){
    const det = document.getElementById('lsn-det-' + k);
    const tg = document.getElementById('lsn-tg-' + k);
    if(!det) return;
    const open = (det.style.display !== 'none');
    det.style.display = open ? 'none' : 'block';
    if(tg) tg.innerHTML = open ? '▾ Batafsil' : '▴ Yopish';
  }

  /* Orqaga — test davomida tasdiq so'raladi */
  function listeningBack(){
    if(lmState.screen === 'testing' && !lmState.revealed){
      if(!confirm("Imtihon tugallanmagan! Agar chiqsangiz, shu javoblaringiz o'chadi va shu joydan davom eta olmaysiz. Chiqishni tasdiqlaysizmi?")) return;
    }
    clearInterval(listeningLoadTimer);
    clearInterval(listeningQTimer);
    lsnStopAllAudio();
    switchTab('home');
  }
