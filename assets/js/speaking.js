// Englify — speaking
  // --- SPEAKING MOCK (Gapirish style + Speechace ready) ---
  // Speechace API kalitini shu yerga qo'ying (Premium kerak). Bo'sh qoldirilsa — smart mock ishlaydi.
  const SPEECHACE_API_KEY = ''; // masalan: 'sk_xxxx'
  const SPEECHACE_ENDPOINT = 'https://api.speechace.co/api/scoring/speech/v9/json';

  const SPEAKING_TOPICS = [
    {
      title: 'Describe a place you visited that left a strong impression on you.',
      points: [
        'where it was',
        'when you went',
        'who you went with',
        'and explain why it left a strong impression on you'
      ]
    },
    {
      title: 'Describe a person who has inspired you.',
      points: [
        'who this person is',
        'how you know them',
        'what they have achieved',
        'and explain why they inspire you'
      ]
    },
    {
      title: 'Describe a skill you would like to learn in the future.',
      points: [
        'what the skill is',
        'why you want to learn it',
        'how you would learn it',
        'and explain how it would benefit you'
      ]
    },
    {
      title: 'Describe an important decision you made.',
      points: [
        'what the decision was',
        'when you made it',
        'what the result was',
        'and explain why it was important'
      ]
    },
    {
      title: 'Describe a memorable journey you have taken.',
      points: [
        'where you went',
        'how you travelled',
        'who you travelled with',
        'and explain why it was memorable'
      ]
    },
    {
      title: 'Describe a piece of technology you find useful.',
      points: [
        'what it is',
        'how you use it',
        'how often you use it',
        'and explain why it is useful to you'
      ]
    },
    {
      title: 'Describe a public place in your city that you like.',
      points: [
        'where it is',
        'what people do there',
        'how often you go there',
        'and explain why you like it'
      ]
    },
    {
      title: 'Describe a person you know who is good at cooking.',
      points: [
        'who this person is',
        'what they cook',
        'how they learned to cook',
        'and explain why you think they are good at it'
      ]
    },
    {
      title: 'Describe a time when you helped someone.',
      points: [
        'who you helped',
        'what the situation was',
        'how you helped them',
        'and explain how you felt about it'
      ]
    },
    {
      title: 'Describe a book or film that influenced you.',
      points: [
        'what it was',
        'when you read or watched it',
        'what it was about',
        'and explain how it influenced you'
      ]
    },
    {
      title: 'Describe a hobby you enjoy in your free time.',
      points: [
        'what the hobby is',
        'when you started it',
        'how often you do it',
        'and explain why you enjoy it'
      ]
    },
    {
      title: 'Describe a difficult challenge you faced and solved.',
      points: [
        'what the challenge was',
        'when it happened',
        'how you solved it',
        'and explain what you learned from it'
      ]
    },
    {
      title: 'Describe a shop or market you often visit.',
      points: [
        'where it is',
        'what it sells',
        'how often you go there',
        'and explain why you choose it'
      ]
    },
    {
      title: 'Describe a special meal you remember.',
      points: [
        'what the meal was',
        'who you shared it with',
        'where it took place',
        'and explain why it was special'
      ]
    },
    {
      title: 'Describe a goal you would like to achieve in the future.',
      points: [
        'what the goal is',
        'when you would like to achieve it',
        'what steps you need to take',
        'and explain why this goal matters to you'
      ]
    }
  ];

  let smState = {
    screen: 'intro',
    topic: null,
    prepLeft: 60,
    speakLeft: 120,
    mediaRecorder: null,
    audioChunks: [],
    audioBlob: null,
    audioUrl: null,
    transcript: '',
    result: null
  };
  let speakingLoadTimer = null;
  let speakingPrepTimer = null;
  let speakingRecTimer = null;

  const SMX_HERO_SVG = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';

  function smCleanup(){
    clearInterval(speakingLoadTimer);
    clearInterval(speakingPrepTimer);
    clearInterval(speakingRecTimer);
    const mr = smState && smState.mediaRecorder;
    if(mr && mr.state !== 'inactive'){ try{ mr.stop(); }catch(e){} }
  }

  function openSpeaking(){
    smCleanup();
    smState = {
      screen: 'intro',
      topic: sbPickFresh(SPEAKING_TOPICS, 'speaking') || SPEAKING_TOPICS[0],
      prepLeft: 60,
      speakLeft: 120,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      audioUrl: null,
      transcript: '',
      result: null
    };
    showPanel('speaking', 'Speaking Mock');
    smRenderIntro();
  }

  function smRenderIntro(){
    smState.screen = 'intro';
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const micSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>';
    const aiSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    document.getElementById('speaking-content').innerHTML = alRenderIntro({
      colorClass: 'al-rose',
      heroSvg: heroSvg,
      title: 'Speaking Mock',
      sub: 'IELTS Speaking Part 2 — mavzuni o\'qib, 1–2 daqiqa gapiring, AI baholaydi',
      chips: [
        { svg: clockSvg, text: '60s tayyorgarlik' },
        { svg: micSvg, text: '2 min gapirish' },
        { svg: aiSvg, text: 'AI baholash' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: '<b>Mavzu kartasini</b> oling — nima haqida gapirish kerakligini o\'qing' },
        { txt: '<b>60 soniya</b> tayyorgarlik ko\'ring — qisqa eslatma yozing' },
        { txt: '<b>1–2 daqiqa</b> gapiring — mikrofon yoki matn orqali' },
        { txt: 'AI <b>IELTS mezonlari</b> bo\'yicha baholaydi: Fluency, Lexical, Grammar, Pronunciation' }
      ],
      note: 'Mikrofon orqali gapirish uchun brauzeringiz mikrofon ruxsatini bergan bo\'lishi kerak. Agar mikrofon ishlamasa, matn kiritish imkoniyati ham bor!',
      btnText: 'Boshlash',
      btnAction: 'startSpeaking()',
      motivate: 'Nutq ko\'nikmasi — har kuni mashq, har kuni yaxshilanish!'
    });
  }

  function startSpeaking(){
    const state = smState;
    smState.screen = 'loading';
    smState.aiPromise = aiGenerate('speaking', 'B2', 60000)
      .then(function(d){
        if(!d || typeof d.title !== 'string' || !Array.isArray(d.points) || d.points.length < 4) return null;
        const points = d.points.slice(0, 5).map(function(x){ return String(x || '').trim(); }).filter(Boolean);
        if(points.length < 4) return null;
        return { title: String(d.title).slice(0, 400), points: points };
      })
      .catch(function(e){
        console.warn('Speaking mavzusi AI bilan olinmadi, lokal bank ishlatiladi', e);
        return null;
      });
    document.getElementById('speaking-content').innerHTML = `
      <div class="smx-wrap" style="text-align:center;">
        <div class="smx-ring-wrap">
          <svg width="144" height="144" viewBox="0 0 144 144" style="transform:rotate(-90deg);">
            <circle cx="72" cy="72" r="54" fill="none" stroke="var(--field)" stroke-width="10"/>
            <circle id="smx-ring" cx="72" cy="72" r="54" fill="none" stroke="url(#smxGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="339.292" stroke-dashoffset="339.292"/>
            <defs>
              <linearGradient id="smxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e11d48"/>
                <stop offset="100%" stop-color="#be185d"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="smx-ring-pct" id="smx-ring-pct">0%</div>
        </div>
        <h3 class="smx-title" style="margin-bottom:8px;">Tayyorlanmoqda...</h3>
        <p id="smx-load-note" style="color:var(--ink-soft);font-size:13.5px;margin:0 0 6px;">AI yangi mavzu kartasini yaratmoqda</p>
        <div class="smx-load-bar"><div class="smx-load-fill" id="smx-load" style="width:0%"></div></div>
      </div>`;
    const C = 2 * Math.PI * 54;
    let pct = 0;
    speakingLoadTimer = setInterval(() => {
      pct += 8 + Math.random()*10;
      if(pct >= 100){
        pct = 100;
        clearInterval(speakingLoadTimer);
        const ringP = document.getElementById('smx-ring-pct');
        const ring = document.getElementById('smx-ring');
        const load = document.getElementById('smx-load');
        if(ringP) ringP.textContent = '100%';
        if(ring) ring.setAttribute('stroke-dashoffset', '0');
        if(load) load.style.width = '100%';
        Promise.all([
          smState.aiPromise || Promise.resolve(null),
          new Promise(function(resolve){ setTimeout(resolve, 450); })
        ]).then(function(out){
          if(smState !== state || state.screen !== 'loading') return;
          if(out[0] && out[0].title && out[0].points && out[0].points.length >= 4) state.topic = out[0];
          setTimeout(function(){
            if(smState !== state || state.screen !== 'loading') return;
            smRenderPrep();
          }, 350);
        });
        return;
      }
      const ringP = document.getElementById('smx-ring-pct');
      const ring = document.getElementById('smx-ring');
      const load = document.getElementById('smx-load');
      if(ringP) ringP.textContent = Math.floor(pct) + '%';
      if(ring) ring.setAttribute('stroke-dashoffset', String(C * (1 - pct/100)));
      if(load) load.style.width = pct + '%';
    }, 130);
  }

  function smRenderPrep(){
    smState.screen = 'prep';
    smState.prepLeft = 60;
    const t = smState.topic;
    document.getElementById('speaking-content').innerHTML = `
      <div class="smx-wrap">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <span style="font-size:13px;font-weight:800;color:#e11d48;letter-spacing:.04em;">IELTS SPEAKING — PART 2</span>
          <span style="font-size:12px;color:var(--ink-soft);font-weight:700;">Tayyorgarlik</span>
        </div>
        <div class="smx-topic-card">
          <div class="smx-topic-head">
            <span style="font-size:18px;">📋</span>
            <span class="smx-topic-label">MAVZU KARTASI</span>
          </div>
          <div class="smx-topic-body">
            <h3 class="smx-topic-title">${t.title}</h3>
            <div class="smx-topic-points">
              <strong style="color:var(--ink);font-size:13px;">You should say:</strong><br>
              ${t.points.map(p => '• ' + p).join('<br>')}
            </div>
          </div>
        </div>
        <div class="smx-prep-timer-wrap">
          <div class="smx-prep-timer" id="smx-prep-timer">${smState.prepLeft}s</div>
          <div class="smx-prep-label">TAYYORGARLIK VAQTI</div>
        </div>
        <div style="background:rgba(225,29,72,0.06);border:1px solid rgba(225,29,72,0.22);border-radius:12px;padding:12px 14px;font-size:12.5px;color:#9f1239;text-align:center;margin-bottom:16px;line-height:1.6;">
          ⏱ Qisqa eslatma yozishingiz mumkin. Vaqt tugagach gapirish avtomatik boshlanadi.
        </div>
        <button class="smx-btn" onclick="clearInterval(speakingPrepTimer);smBeginRecord();">Tayyor — Gapirishni boshlash →</button>
      </div>`;
    speakingPrepTimer = setInterval(() => {
      smState.prepLeft--;
      const el = document.getElementById('smx-prep-timer');
      if(el){
        el.textContent = smState.prepLeft + 's';
        el.style.color = smState.prepLeft <= 10 ? '#ef4444' : '#e11d48';
      }
      if(smState.prepLeft <= 0){
        clearInterval(speakingPrepTimer);
        smBeginRecord();
      }
    }, 1000);
  }

  function smBeginRecord(){
    smState.screen = 'record';
    smState.speakLeft = 120;
    smState.audioChunks = [];
    smState.audioBlob = null;
    smState.transcript = '';
    smRenderRecord();
    speakingRecTimer = setInterval(() => {
      smState.speakLeft--;
      const sec = document.getElementById('smx-rec-sec');
      const fill = document.getElementById('smx-rec-fill');
      if(sec){
        sec.textContent = formatTime(smState.speakLeft);
        if(smState.speakLeft <= 10) sec.classList.add('danger');
      }
      if(fill){
        const pct = (smState.speakLeft / 120) * 100;
        fill.style.width = pct + '%';
        fill.classList.toggle('warn', smState.speakLeft <= 30 && smState.speakLeft > 10);
        fill.classList.toggle('danger', smState.speakLeft <= 10);
      }
      if(smState.speakLeft <= 0){
        clearInterval(speakingRecTimer);
        smStopRec(true);
      }
    }, 1000);
  }

  function smRenderRecord(){
    const t = smState.topic;
    document.getElementById('speaking-content').innerHTML = `
      <div class="smx-wrap">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <span style="font-size:13px;font-weight:800;color:#e11d48;letter-spacing:.04em;">GAPIRISH VAQTI</span>
          <span style="font-size:12px;color:var(--ink-soft);font-weight:700;max-width:60%;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.title.replace(/'/g,'&#39;')}</span>
        </div>
        <div class="smx-record-card">
          <div class="smx-rec-dot" id="smx-rec-dot">🎤</div>
          <div class="smx-rec-status" id="smx-rec-status">Yozishga tayyor</div>
          <div class="smx-rec-hint">Mikrofon orqali yozing yoki matn kiriting</div>
        </div>
        <div class="smx-timer-row">
          <span class="smx-timer-sec" id="smx-rec-sec">${formatTime(smState.speakLeft)}</span>
          <div class="smx-timer-bar"><div class="smx-timer-fill" id="smx-rec-fill" style="width:100%"></div></div>
        </div>
        <div class="smx-mic-row">
          <button class="smx-mic-btn" id="smx-mic-start" onclick="smStartMic()">🔴 Yozishni boshlash</button>
          <button class="smx-mic-stop" id="smx-mic-stop" style="display:none;" onclick="smStopRec(false)">⏹ To'xtatish va baholash</button>
        </div>
        <div class="smx-text-card">
          <div class="smx-text-label">Yoki matn bilan yuboring (mikrofon ishlamasa)</div>
          <textarea class="smx-textarea" id="smx-text-fallback" placeholder="Gapirganingizni shu yerga yozing (kamida 20 so'z)..."></textarea>
          <button class="smx-btn-outline" style="width:100%;padding:12px;font-size:14px;" onclick="smSubmitText()">Matnni yuborish va baholash →</button>
        </div>
        <button class="smx-btn-outline" style="width:100%;padding:12px;font-size:13px;background:var(--field);color:var(--ink-soft);border-color:var(--line);" onclick="speakingBack()">Bekor qilish</button>
      </div>`;
  }

  async function smStartMic(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      smState.audioChunks = [];
      const mr = new MediaRecorder(stream);
      smState.mediaRecorder = mr;
      mr.ondataavailable = e => { if(e.data.size > 0) smState.audioChunks.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(tr => tr.stop());
        smState.audioBlob = new Blob(smState.audioChunks, { type: 'audio/webm' });
        smState.audioUrl = URL.createObjectURL(smState.audioBlob);
      };
      mr.start();
      const startBtn = document.getElementById('smx-mic-start');
      const stopBtn = document.getElementById('smx-mic-stop');
      const status = document.getElementById('smx-rec-status');
      if(startBtn) startBtn.style.display = 'none';
      if(stopBtn) stopBtn.style.display = 'flex';
      if(status) status.textContent = '🔴 Yozilmoqda — gapiring...';
    } catch(err){
      alert('Mikrofon ruxsati berilmadi. Matn kiritish variantidan foydalaning.\n' + (err.message || ''));
    }
  }

  function smStopRec(auto){
    clearInterval(speakingRecTimer);
    const mr = smState.mediaRecorder;
    if(mr && mr.state !== 'inactive'){
      mr.stop();
      setTimeout(() => smEvaluate(), 500);
    } else {
      smEvaluate();
    }
  }

  function smSubmitText(){
    clearInterval(speakingRecTimer);
    const ta = document.getElementById('smx-text-fallback');
    const text = (ta && ta.value || '').trim();
    if(!text || text.split(/\s+/).length < 20){
      alert("Iltimos, kamida 20 ta so'z yozing (1–2 daqiqa gapirishga yaqin).");
      speakingRecTimer = setInterval(() => {
        smState.speakLeft--;
        const sec = document.getElementById('smx-rec-sec');
        const fill = document.getElementById('smx-rec-fill');
        if(sec){
          sec.textContent = formatTime(smState.speakLeft);
          if(smState.speakLeft <= 10) sec.classList.add('danger');
        }
        if(fill){
          const pct = (smState.speakLeft / 120) * 100;
          fill.style.width = pct + '%';
          fill.classList.toggle('warn', smState.speakLeft <= 30 && smState.speakLeft > 10);
          fill.classList.toggle('danger', smState.speakLeft <= 10);
        }
        if(smState.speakLeft <= 0){
          clearInterval(speakingRecTimer);
          smStopRec(true);
        }
      }, 1000);
      return;
    }
    smState.transcript = text;
    smEvaluate();
  }

  function smRenderEval(){
    document.getElementById('speaking-content').innerHTML = `
      <div class="smx-wrap">
        <div class="smx-eval">
          <div class="smx-eval-icon">⏳</div>
          <h3 class="smx-eval-title">Baholanmoqda...</h3>
          <p class="smx-eval-desc">AI sizning nutqingizni IELTS mezonlari bo'yicha tahlil qilmoqda</p>
          <div class="smx-load-bar" style="max-width:240px;margin-top:8px;"><div class="smx-load-fill" style="width:100%;animation:smxPulse 1.2s infinite;"></div></div>
        </div>
      </div>`;
  }

  async function smEvaluate(){
    const evalState = smState;
    smState.screen = 'evaluating';
    smRenderEval();
    // 1) Speechace API — agar kalit bo'lsa va audio yozilgan bo'lsa
    if(SPEECHACE_API_KEY && smState.audioBlob){
      try {
        const form = new FormData();
        form.append('user_audio_file', smState.audioBlob, 'speaking.webm');
        form.append('include_ielts_feedback', '1');
        form.append('relevance_context', smState.topic.title + ' ' + smState.topic.points.join(', '));
        const url = SPEECHACE_ENDPOINT + '?key=' + encodeURIComponent(SPEECHACE_API_KEY) + '&dialect=en-us';
        const res = await fetch(url, { method: 'POST', body: form });
        const data = await res.json();
        if(data && data.status === 'success' && data.speech_score){
          smFinishFromSpeechace(data.speech_score);
          return;
        }
      } catch(e){
        console.warn('Speechace xatosi, smart baholash ishlatiladi', e);
      }
    }
    // 2) Smart baholash — HAQIQIY transkript talab qilinadi
    const durationSec = 120 - smState.speakLeft;
    const transcript = (smState.transcript || '').trim();
    // AGAR foydalanuvchi hech narsa yozmagan/yozmagan bo'lsa — Band 0 (topshirilmagan)
    if(!transcript || transcript.split(/\s+/).filter(Boolean).length < 10){
      // Foydalanuvchi hech narsa qilmagan — test topshirilmagan hisoblanadi
      smFinishFailed();
      return;
    }
    // 3) Haqiqiy Gemini bahosi. Backend ishlamasa lokal tahlilga qaytadi.
    try {
      const ai = await aiApiPost('/api/ai/score-speaking', {
        topic: smState.topic,
        transcript: transcript,
        duration: durationSec
      }, 60000);
      if(smState !== evalState) return;
      if(ai && typeof ai.overall === 'number'){
        smFinishFromAI(ai, transcript, durationSec);
        return;
      }
    } catch(e){
      console.warn('Speaking AI bahosi olinmadi, lokal tahlil ishlatiladi', e);
    }
    if(smState !== evalState) return;
    smScoreFromTranscript(transcript, durationSec);
  }

  // Foydalanuvchi speaking mockni to'liq bajarmaganida chaqiriladi
  function smFinishFailed(){
    smState.screen = 'result';
    // Test topshirilmagan — progress saqlanmaydi (yoki 0 band bilan saqlanadi)
    document.getElementById('speaking-content').innerHTML = `
      <div class="smx-wrap">
        <div style="text-align:center;padding:40px 20px;">
          <div style="font-size:48px;margin-bottom:14px;">⚠️</div>
          <h2 style="font-family:'Fraunces',serif;font-size:22px;margin-bottom:8px;color:#dc2626;">Speaking topshirilmadi</h2>
          <p style="font-size:14px;color:var(--ink-soft);line-height:1.6;margin-bottom:24px;">
            Siz hech narsa gapirmadingiz yoki yozmadingiz. Speaking Mock baholanishi uchun <b>kamida 20 so'z</b> gapirish/yozish kerak.<br><br>
            Iltimos, mikrofon orqali yozing yoki matn maydonidan foydalaning.
          </p>
          <button class="smx-btn" onclick="openSpeaking()" style="margin:0 auto;">🔄 Qayta urinish</button>
          <button class="smx-btn-outline" style="margin:12px auto 0;" onclick="switchTab('home')">🏠 Bosh sahifa</button>
        </div>
      </div>`;
  }

  function smGenerateMockTranscript(topic, durationSec){
    // ESKI funksiya — endi ishlatilmaydi (saqlab qo'yilgan, lekin chaqirilmaydi)
    // Foydalanuvchi haqiqiy transkript yozmasa, test topshirilmagan hisoblanadi
    return '';
  }

  function smScoreFromTranscript(transcript, durationSec){
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const dur = durationSec != null ? durationSec : Math.max(40, Math.min(120, Math.round(wordCount / 2.2)));

    // === HAQIQIY BAHOLASH (IELTS mezonlari bo'yicha) ===
    // 1) Fluency & Coherence — so'z tezligi va davomiyligi asosida
    let fluency = 5.0;
    const wpm = dur > 0 ? wordCount / (dur / 60) : 0; // so'z/daqiqa
    if(wordCount >= 150 && dur >= 80 && wpm >= 100 && wpm <= 180) fluency = 7.5;
    else if(wordCount >= 120 && dur >= 70) fluency = 7.0;
    else if(wordCount >= 80 && dur >= 50) fluency = 6.5;
    else if(wordCount >= 50 && dur >= 30) fluency = 6.0;
    else if(wordCount >= 30) fluency = 5.5;

    // 2) Lexical Resource — so'z xilma-xilligi
    const uniq = new Set(words.map(w => w.toLowerCase().replace(/[^a-z']/g,''))).size;
    const diversity = wordCount ? uniq / wordCount : 0;
    let lexical = 5.0;
    if(diversity >= 0.65 && wordCount >= 80) lexical = 7.5;
    else if(diversity >= 0.55 && wordCount >= 60) lexical = 7.0;
    else if(diversity >= 0.45 && wordCount >= 50) lexical = 6.5;
    else if(diversity >= 0.4) lexical = 6.0;
    else if(diversity >= 0.3) lexical = 5.5;

    // 3) Grammatical Range — bog'lovchilar va murakkab gaplar
    const connectors = ['because','although','however','therefore','for example','in addition',
                        'firstly','secondly','finally','moreover','furthermore','consequently',
                        'nevertheless','on the other hand','in conclusion','as a result','whereas','while'];
    const connHits = connectors.filter(c => new RegExp('\\b' + c + '\\b','i').test(transcript)).length;
    let grammar = 5.0;
    if(connHits >= 5 && wordCount >= 100) grammar = 7.5;
    else if(connHits >= 3 && wordCount >= 80) grammar = 7.0;
    else if(connHits >= 2 && wordCount >= 60) grammar = 6.5;
    else if(connHits >= 1 && wordCount >= 40) grammar = 6.0;
    else if(wordCount >= 30) grammar = 5.5;

    // 4) Pronunciation / Task Response — so'z soni va davomiyligi
    // (haqiqiy audio tahlil Speechace bilan mumkin; bu yerda taxminiy)
    let pronunciation = 5.0;
    if(wordCount >= 150 && dur >= 90) pronunciation = 7.5;
    else if(wordCount >= 120 && dur >= 70) pronunciation = 7.0;
    else if(wordCount >= 80 && dur >= 50) pronunciation = 6.5;
    else if(wordCount >= 50 && dur >= 30) pronunciation = 6.0;
    else if(wordCount >= 30) pronunciation = 5.5;

    // 5) Topic relevance — mavzu kalit so'zlarini tekshirish
    const topicWords = (smState.topic.title + ' ' + smState.topic.points.join(' '))
      .toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/)
      .filter(w => w.length > 3);
    const topicHits = topicWords.filter(w => transcript.toLowerCase().indexOf(w) !== -1).length;
    const relevance = topicWords.length ? topicHits / topicWords.length : 0;
    // Agar javob mavzuga to'liq mos kelmasa, ball pasayadi
    if(relevance < 0.15){
      fluency = Math.max(4.5, fluency - 1.5);
      grammar = Math.max(4.5, grammar - 1.0);
    } else if(relevance < 0.3){
      fluency = Math.max(5.0, fluency - 0.5);
    }

    const scores = [fluency, lexical, grammar, pronunciation];
    const overall = Math.round((scores.reduce((a,b)=>a+b,0) / scores.length) * 2) / 2;
    const pct = Math.round((overall / 9) * 100);
    const result = {
      overall, fluency, lexical, grammar, pronunciation, pct,
      wordCount, duration: dur, transcript,
      source: SPEECHACE_API_KEY ? 'speechace-or-smart' : 'smart-ai',
      wpm: Math.round(wpm),
      diversity: Math.round(diversity * 100),
      connectors: connHits,
      relevance: Math.round(relevance * 100)
    };
    smFinish(result);
  }

  function smFinishFromSpeechace(ss){
    const ielts = ss.ielts_score || {};
    const overall = ielts.overall || 6.5;
    const result = {
      overall,
      fluency: ielts.fluency || overall,
      lexical: ielts.vocab || overall,
      grammar: ielts.grammar || overall,
      pronunciation: ielts.pronunciation || overall,
      pct: Math.round((overall / 9) * 100),
      wordCount: (ss.transcript || '').split(/\s+/).filter(Boolean).length,
      duration: 120 - smState.speakLeft,
      transcript: ss.transcript || '',
      source: 'speechace',
      raw: ss
    };
    smFinish(result);
  }

  function smFinishFromAI(ai, transcript, durationSec){
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const dur = durationSec != null ? durationSec : Math.max(40, Math.min(120, Math.round(wordCount / 2.2)));
    const wpm = dur > 0 ? wordCount / (dur / 60) : 0;
    const uniq = new Set(words.map(function(w){ return w.toLowerCase().replace(/[^a-z']/g,''); })).size;
    const diversity = wordCount ? uniq / wordCount : 0;
    const connectors = ['because','although','however','therefore','for example','in addition',
      'firstly','secondly','finally','moreover','furthermore','consequently',
      'nevertheless','on the other hand','in conclusion','as a result','whereas','while'];
    const connHits = connectors.filter(function(c){ return new RegExp('\\b' + c + '\\b','i').test(transcript); }).length;
    const topicWords = ((smState.topic && smState.topic.title) || '').toLowerCase()
      .replace(/[^a-z\s]/g,' ').split(/\s+/).filter(function(w){ return w.length > 3; });
    const topicHits = topicWords.filter(function(w){ return transcript.toLowerCase().indexOf(w) !== -1; }).length;
    const relevance = topicWords.length ? topicHits / topicWords.length : 0;
    const result = {
      overall: ai.overall,
      fluency: ai.fluency,
      lexical: ai.lexical,
      grammar: ai.grammar,
      pronunciation: ai.pronunciation,
      pct: Math.round((ai.overall / 9) * 100),
      wordCount: wordCount,
      duration: dur,
      transcript: transcript,
      source: 'ai-backend',
      wpm: Math.round(wpm),
      diversity: Math.round(diversity * 100),
      connectors: connHits,
      relevance: Math.round(relevance * 100),
      aiFeedback: {
        strengths: ai.strengths || [],
        weaknesses: ai.weaknesses || [],
        tips: ai.tips || []
      }
    };
    smFinish(result);
  }

  function smFinish(result){
    smState.result = result;
    testProgress.speaking = {
      completed: true,
      band: result.overall,
      pct: result.pct,
      score: 'Band ' + result.overall,
      date: new Date().toISOString().split('T')[0]
    };
    if(typeof saveUserProgress === 'function') saveUserProgress();
    smRenderResult(result);
  }

  function smRenderResult(r){
    smState.screen = 'result';
    document.getElementById('speaking-content').innerHTML = `
      <div class="smx-wrap">
        <div style="text-align:center;margin-bottom:18px;">
          <div style="font-size:42px;margin-bottom:8px;">🎉</div>
          <h2 class="smx-title" style="margin-bottom:4px;">AI bahosi tayyor!</h2>
          <p style="color:var(--ink-soft);font-size:13.5px;margin:0;">IELTS Speaking Part 2 mezonlari asosida</p>
        </div>
        <div class="smx-res-card">
          <div class="smx-res-label">Overall Band Score</div>
          <div class="smx-res-band">${r.overall}</div>
          <div class="smx-res-pct">O'zlashtirish: ${r.pct}%</div>
        </div>
        <div class="smx-band-grid">
          <div class="smx-band-item"><div class="smx-band-name">Fluency & Coherence</div><div class="smx-band-val">${r.fluency}</div></div>
          <div class="smx-band-item"><div class="smx-band-name">Lexical Resource</div><div class="smx-band-val">${r.lexical}</div></div>
          <div class="smx-band-item"><div class="smx-band-name">Grammatical Range</div><div class="smx-band-val">${r.grammar}</div></div>
          <div class="smx-band-item"><div class="smx-band-name">Pronunciation</div><div class="smx-band-val">${r.pronunciation}</div></div>
        </div>
        <div class="smx-analysis">
          <strong>📊 Tahlil:</strong><br>
          • So'zlar soni: <strong>${r.wordCount}</strong><br>
          • Davomiylik: <strong>${r.duration || '—'} soniya</strong><br>
          • So'z/daqiqa: <strong>${r.wpm || '—'}</strong> (maqsad: 100-180)<br>
          • Lug'at xilma-xilligi: <strong>${r.diversity || '—'}%</strong> (maqsad: 55%+)<br>
          • Bog'lovchi so'zlar: <strong>${r.connectors || 0} ta</strong> (maqsad: 3+)<br>
          • Mavzuga moslik: <strong>${r.relevance || '—'}%</strong> (maqsad: 40%+)<br>
          • Baholash manbai: <strong>${r.source === 'speechace' ? 'Speechace API' : (r.source === 'ai-backend' ? 'Gemini AI (backend)' : 'AI smart baholash')}</strong>
          ${r.transcript ? '<div class="smx-transcript">"' + (r.transcript.slice(0,200) + (r.transcript.length>200?'…':'')) + '"</div>' : ''}
        </div>
        ${r.aiFeedback ? `
        <div class="smx-analysis" style="margin-top:12px;text-align:left;">
          <strong>🤖 Gemini AI fikr-mulohazasi</strong><br>
          ${r.aiFeedback.strengths.length ? '<b style="color:#15803d;">Kuchli tomonlar:</b><br>' + r.aiFeedback.strengths.map(function(x){ return '✓ ' + escapeHtml(x); }).join('<br>') + '<br>' : ''}
          ${r.aiFeedback.weaknesses.length ? '<b style="color:#b45309;">Yaxshilash kerak:</b><br>' + r.aiFeedback.weaknesses.map(function(x){ return '• ' + escapeHtml(x); }).join('<br>') + '<br>' : ''}
          ${r.aiFeedback.tips.length ? '<b>Amaliy maslahatlar:</b><br>' + r.aiFeedback.tips.map(function(x){ return '→ ' + escapeHtml(x); }).join('<br>') : ''}
        </div>` : ''}
        ${smState.audioUrl ? `
          <div class="smx-audio-wrap">
            <div class="smx-audio-label">🎧 Yozuvingizni tinglang</div>
            <audio controls src="${smState.audioUrl}" style="width:100%;"></audio>
          </div>` : ''}
        <div class="smx-comeback">Har kuni mashq qiling — nutqingiz albatta yaxshilanadi! 🎤</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="smx-btn" style="flex:1;" onclick="switchTab('results')">Natijalarimni ko'rish 📊</button>
          <button class="smx-btn-outline" style="flex:1;" onclick="openSpeaking()">Yana bir bor 🎤</button>
        </div>
      </div>`;
  }

  /* Orqaga — test davomida tasdiq so'raladi (alilm kabi) */
  function speakingBack(){
    const inProgress = (smState.screen === 'prep' && smState.prepLeft > 0 && smState.prepLeft < 60)
                    || (smState.screen === 'record')
                    || (smState.screen === 'evaluating');
    if(inProgress){
      if(!confirm("Imtihon tugallanmagan! Agar chiqsangiz, natijangiz saqlanmaydi. Chiqishni tasdiqlaysizmi?")) return;
    }
    if(smState.screen === 'loading') clearInterval(speakingLoadTimer);
    smCleanup();
    switchTab('home');
  }

