// Englify — ai-speaking
  // --- AI SPEAKING — alilm.uz uslubi (real-vaqt suhbat) ---
  const AIS_SCENARIOS = [
    {
      id: 'daily',
      icon: '☕',
      name: 'Kundalik suhbat',
      desc: 'Do\'st bilan erkin muloqot',
      opener: "Hi there! I'm your AI speaking partner. Let's chat in English. How are you doing today?",
      topicQs: [
        "That sounds interesting! Tell me more about it.",
        "Oh really? Why do you think so?",
        "I see. What did you do then?",
        "That's nice. How did you feel about it?",
        "Got it. What are your plans for the rest of the day?",
        "Interesting! Can you give me an example?",
        "I understand. What would you do differently next time?"
      ],
      hints: ['family', 'work', 'school', 'hobby', 'weekend', 'food', 'weather', 'friend'],
      goodbye: "It was great chatting with you! Keep practicing your English every day. See you soon!"
    },
    {
      id: 'ielts1',
      icon: '🎓',
      name: 'IELTS Part 1',
      desc: 'Savol-javob mashqi',
      opener: "Hello! I'll ask you IELTS Speaking Part 1 questions. Let's start: Do you work or are you a student?",
      topicQs: [
        "Why did you choose that field of study or work?",
        "What do you enjoy most about it?",
        "Is there anything you don't like about it?",
        "What are your hobbies or free-time activities?",
        "How long have you been interested in that?",
        "Do you prefer spending your free time alone or with others? Why?",
        "Let's talk about your hometown. What's it like?",
        "What do you like most about your hometown?",
        "Would you recommend it as a place to visit? Why?"
      ],
      hints: ['study', 'work', 'hobby', 'hometown', 'family', 'food', 'music', 'travel'],
      goodbye: "Thank you! That's the end of Part 1. You responded well. Practice giving longer, more detailed answers."
    },
    {
      id: 'travel',
      icon: '✈️',
      name: 'Sayohat',
      desc: 'Mehmonxona/aeroport dialog',
      opener: "Welcome! Imagine you just arrived at a hotel in London. I'm the receptionist. How can I help you today?",
      topicQs: [
        "Certainly. Do you have a reservation with us?",
        "Great. May I have your name and passport, please?",
        "Would you like a single or double room?",
        "How many nights will you be staying?",
        "Breakfast is included. Would you like a wake-up call?",
        "Here's your key card. Room 305 on the third floor. Anything else?",
        "The elevator is just around the corner. Enjoy your stay!",
        "Of course. Is there anything specific you'd like to know about the city?"
      ],
      hints: ['room', 'reservation', 'breakfast', 'key', 'elevator', 'checkout', 'wifi', 'passport'],
      goodbye: "Thank you for staying with us! Practice these phrases for your next trip abroad. Safe travels!"
    },
    {
      id: 'restaurant',
      icon: '🍽️',
      name: 'Restoran',
      desc: 'Menyu buyurtma berish',
      opener: "Good evening! Welcome to our restaurant. Have you dined with us before? A table for how many people?",
      topicQs: [
        "Perfect. Would you like to sit by the window or in a quieter area?",
        "Here's our menu. Our specials today are grilled salmon and mushroom risotto. Would you like to start with something to drink?",
        "Excellent choice. Are you ready to order your main course, or do you need a few more minutes?",
        "Great. How would you like your steak cooked — rare, medium, or well done?",
        "Would you like any side dishes or a salad with that?",
        "Perfect. I'll get that started for you. Anything else for now?",
        "How is everything tasting? Would you like to see the dessert menu?",
        "Certainly, I'll bring the bill. Was everything to your satisfaction?"
      ],
      hints: ['menu', 'order', 'drink', 'steak', 'salad', 'dessert', 'bill', 'water'],
      goodbye: "Thank you for dining with us! Practice restaurant vocabulary for confident dining abroad. Come again!"
    },
    {
      id: 'interview',
      icon: '💼',
      name: 'Ish suhbati',
      desc: 'Job interview mashqi',
      opener: "Good morning! Thank you for coming in today. I'm the hiring manager. Could you please introduce yourself?",
      topicQs: [
        "Thank you. What attracted you to this position?",
        "Can you tell me about your previous work experience?",
        "What would you say are your greatest strengths?",
        "And what about areas you'd like to improve?",
        "Describe a challenge you faced at work and how you handled it.",
        "Where do you see yourself in five years?",
        "Do you have any questions for me about the role or the company?",
        "Why should we hire you over other candidates?"
      ],
      hints: ['experience', 'strength', 'weakness', 'skill', 'team', 'project', 'goal', 'company'],
      goodbye: "Thank you for the interview. We'll be in touch soon. Practice confident, structured answers!"
    },
    {
      id: 'freetalk',
      icon: '🌟',
      name: 'Erkin mavzu',
      desc: 'Istalgan mavzuda suhbat',
      opener: "Hello! Today let's talk about something you're passionate about. What topic interests you most right now?",
      topicQs: [
        "That's a fascinating topic! Tell me more about what got you interested in it.",
        "I'd love to hear more. What's the most surprising thing you've learned about it?",
        "How has it changed your perspective or your life?",
        "Do you think it's something everyone should know about? Why?",
        "What advice would you give to someone just starting to explore this?",
        "Are there any common misconceptions people have about it?",
        "Where do you see this going in the future?",
        "Is there anything else you'd like to share about it?"
      ],
      hints: ['passion', 'interest', 'experience', 'opinion', 'future', 'advice', 'learn', 'share'],
      goodbye: "What a wonderful conversation! Your enthusiasm really shines through. Keep sharing your passions!"
    }
  ];

  let aisState = {
    screen: 'intro',
    scenario: null,
    messages: [],
    turns: 0,
    words: 0,
    startTime: 0,
    ttsOn: true,
    qIdx: 0,
    feedback: []
  };
  let aisLoadTimer = null;
  let aisRecTimer = null;
  let aisRecognition = null;
  let aisIsRecording = false;
  let aisContinuous = false;   // doimiy tinglash rejimi (bir marta ruxsat -> uzluksiz suhbat)
  let aisTurnBusy = false;     // foydalanuvchi javobi qayta ishlanmoqda
  let aisResumeTimer = null;

  /* ---------- AI Speaking: tiniq va ravon ovoz (TTS) ---------- */
  let aisTtsToken = 0;
  let aisTtsVoice = null;
  let aisTtsVoices = [];

  function aisRefreshVoices(){
    if(!('speechSynthesis' in window)) return [];
    try {
      const list = speechSynthesis.getVoices() || [];
      if(list.length) aisTtsVoices = list;
    } catch(e){}
    return aisTtsVoices;
  }

  function aisVoiceScore(v){
    const name = String(v.name || '').toLowerCase();
    const lang = String(v.lang || '').toLowerCase();
    let score = 0;
    if(lang === 'en-us') score += 12;
    else if(lang === 'en-gb') score += 10;
    else if(lang.indexOf('en') === 0) score += 6;
    else return -999;

    if(name.indexOf('google us english') >= 0) score += 120;
    if(name.indexOf('google uk english female') >= 0) score += 112;
    if(name.indexOf('google uk english male') >= 0) score += 105;
    if(name.indexOf('natural') >= 0 || name.indexOf('neural') >= 0) score += 110;
    if(name.indexOf('online') >= 0) score += 20;
    if(/(aria|jenny|sonia|libby|emma|ava|samantha|allison|susan|karen|moira|tessa|fiona|serena)/.test(name)) score += 48;
    if(/(daniel|alex|ryan|guy|brian|christopher|eric|roger|steffan|george|james|mark)/.test(name)) score += 34;
    if(name.indexOf('zira') >= 0) score += 30;
    if(name.indexOf('david') >= 0) score += 22;
    if(v.localService) score += 4;
    if(v.default) score += 1;
    if(/(espeak|compact|mobile|novelty|whisper|bells|bad news|good news|bahh|boing|bubbles|cellos|deranged|hysterical|pipe organ|trinoids|zarvox|albert|fred)/.test(name)) score -= 200;
    return score;
  }

  function aisPickVoice(){
    const voices = aisRefreshVoices();
    const english = voices.filter(function(v){ return /^en([-_]|$)/i.test(String(v.lang || '')); });
    if(!english.length) return null;
    english.sort(function(a, b){ return aisVoiceScore(b) - aisVoiceScore(a); });
    return english[0];
  }

  function aisSplitSpeech(text){
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if(!clean) return [];
    const sentences = clean.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [clean];
    const chunks = [];
    let current = '';
    sentences.forEach(function(sentence){
      const part = sentence.trim();
      if(!part) return;
      if(current && (current + ' ' + part).length > 190){
        chunks.push(current);
        current = part;
      } else {
        current = current ? current + ' ' + part : part;
      }
    });
    if(current) chunks.push(current);
    return chunks.slice(0, 16);
  }

  function aisStopTts(){
    aisTtsToken++; // eski utterance callbacklari endi hech narsa qilmaydi
    try { sbTtsStop(); } catch(e){}
  }

  function aisSpeakText(text, onDone){
    if(!('speechSynthesis' in window) || !aisState.ttsOn){
      if(onDone) setTimeout(onDone, 0);
      return;
    }
    const chunks = aisSplitSpeech(text);
    if(!chunks.length){
      if(onDone) setTimeout(onDone, 0);
      return;
    }

    const token = ++aisTtsToken;
    try { sbTtsStop(); } catch(e){}
    try { speechSynthesis.resume(); } catch(e){}

    let index = 0;
    function speakNext(){
      if(token !== aisTtsToken) return;
      if(index >= chunks.length){
        if(onDone) onDone();
        return;
      }

      const part = chunks[index++];
      const u = new SpeechSynthesisUtterance(part);
      const voice = aisTtsVoice || aisPickVoice();
      if(voice){
        aisTtsVoice = voice;
        u.voice = voice;
        u.lang = voice.lang || 'en-US';
      } else {
        u.lang = 'en-US';
      }
      // Sekinroq va bir xil balandlik — talaffuz aniq eshitiladi.
      u.rate = 0.92;
      u.pitch = 1.0;
      u.volume = 1.0;

      let finished = false;
      let watchdog = null;
      function finishChunk(){
        if(finished) return;
        finished = true;
        if(watchdog) clearTimeout(watchdog);
        if(token !== aisTtsToken) return;
        setTimeout(speakNext, 90);
      }

      u.onend = finishChunk;
      u.onerror = function(ev){
        // cancel/interrupted — yangi javob boshlangan bo'lishi mumkin
        if(ev && (ev.error === 'interrupted' || ev.error === 'canceled')){
          finished = true;
          if(watchdog) clearTimeout(watchdog);
          return;
        }
        finishChunk();
      };

      // Ba'zi brauzerlarda onend kelmay qoladi — suhbat tiqilib qolmasin.
      const words = part.split(/\s+/).filter(Boolean).length;
      watchdog = setTimeout(finishChunk, Math.max(2600, words * 460 + 1200));

      try {
        speechSynthesis.speak(u);
      } catch(e){
        finishChunk();
      }
    }

    function startWhenVoicesReady(){
      if(token !== aisTtsToken) return;
      if(aisRefreshVoices().length === 0 && speechSynthesis.getVoices().length === 0){
        let started = false;
        const start = function(){
          if(started) return;
          started = true;
          try { speechSynthesis.removeEventListener('voiceschanged', start); } catch(e){}
          aisRefreshVoices();
          aisTtsVoice = null;
          speakNext();
        };
        try { speechSynthesis.addEventListener('voiceschanged', start); } catch(e){}
        setTimeout(start, 900);
      } else {
        // Har safar eng yaxshi ovozni qayta tanlaymiz (masalan, Google ovozlari
        // keyinroq yuklansa ham to'g'ri ovoz ishlatiladi).
        aisTtsVoice = null;
        speakNext();
      }
    }

    setTimeout(startWhenVoicesReady, 90);
  }

  if('speechSynthesis' in window){
    aisRefreshVoices();
    try {
      speechSynthesis.addEventListener('voiceschanged', function(){
        aisRefreshVoices();
        if(!aisTtsVoice) aisTtsVoice = aisPickVoice();
      });
    } catch(e){
      speechSynthesis.onvoiceschanged = function(){ aisRefreshVoices(); };
    }
  }

  const AIS_HERO_SVG = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>';

  function openAISpeaking(){
    aisCleanup();
    aisState = {
      screen: 'intro',
      scenario: null,
      messages: [],
      turns: 0,
      words: 0,
      startTime: 0,
      ttsOn: true,
      qIdx: 0,
      feedback: []
    };
    showPanel('aispeaking', 'AI Speaking');
    aisRenderIntro();
    aiHealthCheck(true).then(function(h){
      if(aisState.screen !== 'intro') return;
      const note = document.querySelector('#aispeaking-content .al-intro-note');
      if(!note || note.dataset.aiStatus) return;
      note.dataset.aiStatus = '1';
      const badge = (h && h.aiEnabled)
        ? '<div style="margin-bottom:5px;">🟢 <b>Haqiqiy AI ulangan</b> · ' + escapeHtml(h.provider || 'AI') + '</div>'
        : '<div style="margin-bottom:5px;">🟡 AI backend kaliti sozlanmagan — suhbat lokal rejimda ishlaydi</div>';
      note.innerHTML = badge + note.innerHTML;
    });
  }

  function aisRenderIntro(){
    aisState.screen = 'intro';
    // AVTOMATIK stsenariy tanlanadi — scenario grid olib tashlandi
    // Har safar boshqa stsenariy tanlanadi (xilma-xillik uchun)
    if(!aisState.scenario){
      aisState.scenario = AIS_SCENARIOS[Math.floor(Math.random() * AIS_SCENARIOS.length)];
    }
    const s = aisState.scenario;
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const chatSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    const aiSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    document.getElementById('aispeaking-content').innerHTML = alRenderIntro({
      colorClass: 'al-emerald',
      heroSvg: heroSvg,
      title: 'AI Speaking',
      sub: 'Sun\'iy intellekt bilan real-vaqt inglizcha suhbat — ' + s.icon + ' ' + s.name + ' stsenariyisi',
      chips: [
        { svg: chatSvg, text: 'Real-vaqt suhbat' },
        { svg: clockSvg, text: s.name },
        { svg: aiSvg, text: 'AI fikr-mulohaza' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: 'AI birinchi savolni beradi — siz <b>mikrofon</b> orqali gapiring yoki <b>matn</b> yozing' },
        { txt: 'Har bir javobingizdan so\'ng AI <b>fikr-mulohaza</b> beradi va keyingi savolni beradi' },
        { txt: 'Suhbat <b>' + s.name + '</b> mavzusida bo\'lib o\'tadi — ' + s.desc },
        { txt: 'Kamida <b>3 ta savol-javob</b> va <b>20+ so\'z</b> kerak — aks holda natija saqlanmaydi' }
      ],
      note: '💡 Mikrofon orqali gapiring (Chrome tavsiya etiladi) yoki matn kiriting. AI javoblarni ovozli eshitish uchun TTS yoqilgan.',
      btnText: 'Suhbatni boshlash',
      btnAction: 'aisStart()',
      motivate: 'Erkin gapirish — til o\'rganishning eng tezkor yo\'li! Stsenariy har safar avtomatik tanlanadi'
    });
  }

  function aisSelectScenario(id){
    aisState.scenario = AIS_SCENARIOS.find(s => s.id === id);
    document.querySelectorAll('.ais-scenario').forEach(el => el.classList.remove('selected'));
    const el = document.getElementById('ais-sc-' + id);
    if(el) el.classList.add('selected');
    const btn = document.getElementById('ais-start-btn');
    if(btn) btn.disabled = false;
  }

  function aisStart(){
    if(!aisState.scenario) return;
    aisState.screen = 'loading';
    document.getElementById('aispeaking-content').innerHTML = `
      <div class="ais-wrap" style="text-align:center;">
        <div class="ais-ring-wrap">
          <svg width="144" height="144" viewBox="0 0 144 144" style="transform:rotate(-90deg);">
            <circle cx="72" cy="72" r="54" fill="none" stroke="var(--field)" stroke-width="10"/>
            <circle id="ais-ring" cx="72" cy="72" r="54" fill="none" stroke="url(#aisGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="339.292" stroke-dashoffset="339.292"/>
            <defs>
              <linearGradient id="aisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981"/>
                <stop offset="100%" stop-color="#047857"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="ais-ring-pct" id="ais-ring-pct">0%</div>
        </div>
        <h3 class="ais-title" style="margin-bottom:8px;">AI tayyorlanmoqda...</h3>
        <p style="color:var(--ink-soft);font-size:13.5px;margin:0 0 6px;">${aisState.scenario.icon} ${aisState.scenario.name} stsenariysi yuklanmoqda</p>
        <div class="ais-load-bar"><div class="ais-load-fill" id="ais-load" style="width:0%"></div></div>
      </div>`;
    const C = 2 * Math.PI * 54;
    let pct = 0;
    aisLoadTimer = setInterval(() => {
      pct += 10 + Math.random()*12;
      if(pct >= 100){
        pct = 100;
        clearInterval(aisLoadTimer);
        const rp = document.getElementById('ais-ring-pct');
        const r = document.getElementById('ais-ring');
        const l = document.getElementById('ais-load');
        if(rp) rp.textContent = '100%';
        if(r) r.setAttribute('stroke-dashoffset', '0');
        if(l) l.style.width = '100%';
        setTimeout(() => aisBeginChat(), 400);
        return;
      }
      const rp = document.getElementById('ais-ring-pct');
      const r = document.getElementById('ais-ring');
      const l = document.getElementById('ais-load');
      if(rp) rp.textContent = Math.floor(pct) + '%';
      if(r) r.setAttribute('stroke-dashoffset', String(C * (1 - pct/100)));
      if(l) l.style.width = pct + '%';
    }, 130);
  }

  function aisBeginChat(){
    aisState.screen = 'chat';
    aisState.messages = [];
    aisState.turns = 0;
    aisState.words = 0;
    aisState.startTime = Date.now();
    aisRenderChat();
    // AI birinchi xabar
    setTimeout(() => {
      aisAddAIMessage(aisState.scenario.opener, null);
    }, 300);
  }

  const AIS_LOGO_SVG = '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="aisLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><path d="M50 12 L86 78 L14 78 Z" fill="url(#aisLogoGrad)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/><path d="M50 34 L70 70 L30 70 Z" fill="rgba(255,255,255,0.85)"/><circle cx="50" cy="58" r="5" fill="#1d4ed8"/></svg>';

  let aisVoiceState = 'idle'; // idle | listening | ai_speaking | processing
  let aisTranscriptOpen = false;

  function aisRenderChat(){
    const s = aisState.scenario;
    const elapsed = Math.floor((Date.now() - aisState.startTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    document.getElementById('aispeaking-content').innerHTML = `
      <div class="ais-voice-screen">
        <div class="ais-voice-top">
          <button class="ais-voice-mute ${aisState.ttsOn ? '' : 'muted'}" id="ais-mute-btn" onclick="aisToggleMute()" title="${aisState.ttsOn ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}">${aisState.ttsOn ? '🔊' : '🔇'}</button>
          <div class="ais-voice-timer-block">
            <div class="ais-voice-timer">⏱ <span id="ais-vtimer">${mm}:${ss}</span></div>
            <div class="ais-voice-counter">Suhbat: <span id="ais-vcount">${aisState.turns}</span> ta savol-javob</div>
          </div>
          <button class="ais-voice-end" onclick="aisEndSession()" title="Tugatish">✕</button>
        </div>

        <div id="ais-fb-toast-wrap"></div>

        <div class="ais-voice-center">
          <div class="ais-voice-ring" id="ais-voice-ring">
            <div class="ais-voice-logo">${AIS_LOGO_SVG}</div>
          </div>
          <div class="ais-voice-status" id="ais-voice-status">ALILM gapiryapti...</div>
          <div class="ais-voice-hint" id="ais-voice-hint">Ingliz tilida gapiring...</div>
        </div>

        <div class="ais-voice-transcript-toggle" id="ais-tr-toggle" onclick="aisToggleTranscript()">
          <span>Suhbat tarixi (<span id="ais-vmsg-count">${aisState.messages.length}</span>)</span>
          <span class="chev">▾</span>
        </div>
        <div class="ais-voice-transcript" id="ais-voice-transcript"></div>

        <div class="ais-voice-bottom">
          <button class="ais-voice-mic" id="ais-voice-mic" onclick="aisToggleMic()" title="Gapirish">
            <span id="ais-voice-mic-ic">🎤</span>
          </button>
          <div class="ais-voice-mic-label" id="ais-voice-mic-label">Mikrofonni bosing va gapiring</div>
          <div style="margin-top:8px;width:100%;">
            <div id="ais-text-toggle" style="text-align:center;font-size:11.5px;color:rgba(255,255,255,0.7);cursor:pointer;text-decoration:underline;margin-bottom:6px;" onclick="aisToggleTextInput()">Yoki matn orqali yozing ⌨</div>
            <div id="ais-text-row" style="display:none;gap:8px;">
              <input type="text" class="ais-text-field" id="ais-text" style="background:rgba(255,255,255,0.95);color:#1e3a8a;border-color:rgba(255,255,255,0.3);" placeholder="Javobingizni yozing..." onkeydown="if(event.key==='Enter') aisSendText()">
              <button class="ais-send-btn" onclick="aisSendText()">➤</button>
            </div>
          </div>
        </div>
      </div>`;
    // transcriptni to'ldirish
    aisRenderTranscript();
    // timer
    if(aisRecTimer) clearInterval(aisRecTimer);
    aisRecTimer = setInterval(() => {
      const el = Math.floor((Date.now() - aisState.startTime) / 1000);
      const m = String(Math.floor(el / 60)).padStart(2, '0');
      const s2 = String(el % 60).padStart(2, '0');
      const t = document.getElementById('ais-vtimer');
      if(t) t.textContent = m + ':' + s2;
    }, 1000);
  }

  function aisSetVoiceState(state){
    aisVoiceState = state;
    const ring = document.getElementById('ais-voice-ring');
    const status = document.getElementById('ais-voice-status');
    const hint = document.getElementById('ais-voice-hint');
    const mic = document.getElementById('ais-voice-mic');
    const micIc = document.getElementById('ais-voice-mic-ic');
    const micLbl = document.getElementById('ais-voice-mic-label');
    if(!ring) return;
    ring.classList.remove('ai-active', 'listening');
    if(mic) mic.classList.remove('recording', 'disabled');
    if(state === 'idle'){
      if(status) status.textContent = 'Tayyor';
      if(hint) hint.textContent = 'Ingliz tilida gapiring...';
      if(micIc) micIc.textContent = '🎤';
      if(micLbl) micLbl.textContent = 'Mikrofonni bosing va gapiring';
    } else if(state === 'listening'){
      ring.classList.add('listening');
      if(status) status.textContent = 'Siz gapiryapsiz...';
      if(hint) hint.textContent = 'To\'xtatish uchun yana bosing';
      if(mic) mic.classList.add('recording');
      if(micIc) micIc.textContent = '⏹';
      if(micLbl) micLbl.textContent = 'Gapiring...';
    } else if(state === 'ai_speaking'){
      ring.classList.add('ai-active');
      if(status) status.textContent = 'ALILM gapiryapti...';
      if(hint) hint.textContent = 'Tinglang...';
      if(mic) mic.classList.add('disabled');
      if(micIc) micIc.textContent = '🎧';
      if(micLbl) micLbl.textContent = 'AI javob bermoqda';
    } else if(state === 'processing'){
      ring.classList.add('ai-active');
      if(status) status.textContent = 'O\'ylabmoqda...';
      if(hint) hint.textContent = 'Iltimos, kuting';
      if(mic) mic.classList.add('disabled');
      if(micIc) micIc.textContent = '⏳';
      if(micLbl) micLbl.textContent = 'AI tayyorlanmoqda';
    }
  }

  function aisToggleMute(){
    aisState.ttsOn = !aisState.ttsOn;
    const btn = document.getElementById('ais-mute-btn');
    if(btn){
      btn.classList.toggle('muted', !aisState.ttsOn);
      btn.textContent = aisState.ttsOn ? '🔊' : '🔇';
      btn.title = aisState.ttsOn ? 'Ovozni o\'chirish' : 'Ovozni yoqish';
    }
    if(!aisState.ttsOn){
      aisStopTts();
      if(aisVoiceState === 'ai_speaking') aisSetVoiceState('idle');
      aisResumeMic();
    }
  }

  function aisToggleTranscript(){
    aisTranscriptOpen = !aisTranscriptOpen;
    const tg = document.getElementById('ais-tr-toggle');
    const tr = document.getElementById('ais-voice-transcript');
    if(tg) tg.classList.toggle('open', aisTranscriptOpen);
    if(tr) tr.classList.toggle('open', aisTranscriptOpen);
    if(aisTranscriptOpen) aisRenderTranscript();
  }

  function aisToggleTextInput(){
    const row = document.getElementById('ais-text-row');
    if(row) row.style.display = (row.style.display === 'none' || !row.style.display) ? 'flex' : 'none';
  }

  function aisRenderTranscript(){
    const tr = document.getElementById('ais-voice-transcript');
    if(!tr) return;
    tr.innerHTML = aisState.messages.map(m => aisMsgHTML(m)).join('');
    tr.scrollTop = tr.scrollHeight;
    const cnt = document.getElementById('ais-vmsg-count');
    if(cnt) cnt.textContent = aisState.messages.length;
  }

  function aisMsgHTML(m){
    if(m.role === 'ai'){
      return `
        <div class="ais-msg ais-msg-ai">
          <div class="ais-msg-ic">🤖</div>
          <div class="ais-msg-bubble">
            ${escapeHTML(m.text)}
            ${m.feedback ? `<div class="ais-msg-fb">💡 ${escapeHTML(m.feedback)}</div>` : ''}
          </div>
        </div>`;
    } else {
      return `
        <div class="ais-msg ais-msg-user">
          <div class="ais-msg-ic">🧑</div>
          <div class="ais-msg-bubble">${escapeHTML(m.text)}</div>
        </div>`;
    }
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function aisShowFbToast(text, type){
    const wrap = document.getElementById('ais-fb-toast-wrap');
    if(!wrap) return;
    const t = document.createElement('div');
    t.className = 'ais-voice-fb-toast ' + (type || '');
    t.textContent = '💡 ' + text;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 2800);
    setTimeout(() => { if(t.parentNode) t.remove(); }, 3300);
  }

  function aisAddAIMessage(text, feedback){
    aisState.messages.push({role:'ai', text:text, feedback:feedback});
    // transcript yangilash (agar ochiq bo'lsa)
    if(aisTranscriptOpen) aisRenderTranscript();
    else {
      const cnt = document.getElementById('ais-vmsg-count');
      if(cnt) cnt.textContent = aisState.messages.length;
    }
    // feedback toast
    if(feedback) aisShowFbToast(feedback, feedback === 'short' ? 'warn' : 'ok');
    // AI gapirish holati
    aisSetVoiceState('ai_speaking');
    if(aisState.ttsOn && 'speechSynthesis' in window){
      aisSpeakText(text, function(){
        if(aisVoiceState === 'ai_speaking') aisSetVoiceState('idle');
        aisResumeMic();
      });
    } else {
      // TTS yoqilmagan — taxminiy davomdan keyin idle
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const dur = Math.max(1800, Math.min(9000, words * 380 + 900));
      setTimeout(() => { if(aisVoiceState === 'ai_speaking') aisSetVoiceState('idle'); aisResumeMic(); }, dur);
    }
  }

  function aisAddUserMessage(text){
    aisState.messages.push({role:'user', text:text});
    aisState.turns++;
    aisState.words += text.trim().split(/\s+/).filter(Boolean).length;
    if(aisTranscriptOpen) aisRenderTranscript();
    else {
      const cnt = document.getElementById('ais-vmsg-count');
      if(cnt) cnt.textContent = aisState.messages.length;
    }
    const tEl = document.getElementById('ais-vcount');
    if(tEl) tEl.textContent = aisState.turns;
  }

  function aisSpeak(text){
    if(!('speechSynthesis' in window)) return;
    aisSpeakText(text, null);
  }

  /* Uzluksiz tinglash: mikrofon ruxsati bir marta so'raladi,
     keyin foydalanuvchi gapirganda avtomatik yozib oladi va AI bilan
     navbatma-navbat suhbat davom etadi. Har safar qayta ruxsat so'ralmaydi. */
  function aisBuildRecognition(){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return null;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onstart = () => {
      aisIsRecording = true;
      if(aisVoiceState !== 'ai_speaking' && aisVoiceState !== 'processing') aisSetVoiceState('listening');
    };
    rec.onresult = (ev) => {
      if(aisTurnBusy) return;
      let finalTxt = '';
      let interim = '';
      for(let i = ev.resultIndex; i < ev.results.length; i++){
        const r = ev.results[i];
        const t = (r[0] && r[0].transcript) ? r[0].transcript : '';
        if(r.isFinal) finalTxt += t + ' ';
        else interim += t + ' ';
      }
      interim = interim.trim();
      if(interim){
        const hint = document.getElementById('ais-voice-hint');
        if(hint) hint.textContent = '🎙 ' + interim.slice(0, 90);
      }
      if(finalTxt.trim()){
        aisTurnBusy = true;
        try { rec.stop(); } catch(e){}
        aisIsRecording = false;
        aisSetVoiceState('processing');
        setTimeout(() => {
          aisTurnBusy = false;
          aisHandleUserInput(finalTxt.trim());
        }, 120);
      }
    };
    rec.onerror = (ev) => {
      aisIsRecording = false;
      if(ev.error === 'not-allowed' || ev.error === 'service-not-allowed'){
        aisContinuous = false;
        aisSetVoiceState('idle');
        const row = document.getElementById('ais-text-row');
        if(row) row.style.display = 'flex';
        alert('Mikrofon ruxsati berilmadi. Matn maydonidan foydalanishingiz mumkin.');
        return;
      }
      // no-speech / aborted / network — suhbatni davom ettiramiz
      if(aisContinuous) aisResumeMic();
      else if(aisVoiceState === 'listening') aisSetVoiceState('idle');
    };
    rec.onend = () => {
      aisIsRecording = false;
      if(aisContinuous && aisState.screen === 'chat' && !aisTurnBusy &&
         aisVoiceState !== 'ai_speaking' && aisVoiceState !== 'processing'){
        aisResumeMic();
      } else if(!aisContinuous && aisVoiceState === 'listening'){
        aisSetVoiceState('idle');
      }
    };
    return rec;
  }

  function aisResumeMic(){
    if(!aisContinuous || aisState.screen !== 'chat') return;
    if(aisIsRecording || aisTurnBusy) return;
    if(aisVoiceState === 'ai_speaking' || aisVoiceState === 'processing') return;
    clearTimeout(aisResumeTimer);
    aisResumeTimer = setTimeout(function(){
      if(!aisContinuous || aisState.screen !== 'chat') return;
      if(aisIsRecording || aisTurnBusy) return;
      if(aisVoiceState === 'ai_speaking' || aisVoiceState === 'processing') return;
      try {
        if(!aisRecognition) aisRecognition = aisBuildRecognition();
        if(aisRecognition) aisRecognition.start();
      } catch(e){ /* allaqachon ishga tushgan bo'lsa — e'tiborsiz */ }
    }, 420);
  }

  function aisToggleMic(){
    if(aisVoiceState === 'ai_speaking' || aisVoiceState === 'processing') return;
    // Ikkinchi bosish — suhbat rejimini to'xtatish
    if(aisIsRecording || aisContinuous){
      aisContinuous = false;
      aisTurnBusy = false;
      clearTimeout(aisResumeTimer);
      if(aisRecognition){ try { aisRecognition.abort(); } catch(e){} }
      aisIsRecording = false;
      aisSetVoiceState('idle');
      const lbl = document.getElementById('ais-voice-mic-label');
      if(lbl) lbl.textContent = 'Mikrofonni bosing va gapiring';
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){
      const row = document.getElementById('ais-text-row');
      if(row) row.style.display = 'flex';
      const tog = document.getElementById('ais-text-toggle');
      if(tog) tog.textContent = 'Brauzeringiz mikrofonni qo\'llab-quvvatlamaydi — matn kiriting ⌨';
      alert('Sizning brauzeringiz mikrofon orqali nutqni tanib olishni qo\'llab-quvvatlamaydi. Iltimos, matn maydonidan foydalaning yoki Chrome brauzerida urinib ko\'ring.');
      return;
    }
    try {
      aisStopTts();
      aisContinuous = true;
      aisTurnBusy = false;
      if(!aisRecognition) aisRecognition = aisBuildRecognition();
      aisRecognition.start();
      const lbl = document.getElementById('ais-voice-mic-label');
      if(lbl) lbl.textContent = 'Suhbat rejimi yoqildi — to\'xtatish uchun bosing';
    } catch(e){
      try { aisRecognition = aisBuildRecognition(); aisRecognition.start(); }
      catch(e2){
        aisContinuous = false;
        aisSetVoiceState('idle');
        alert('Mikrofon ishga tushmadi: ' + (e2.message || e2));
      }
    }
  }

  function aisStopRec(){
    if(aisRecognition){
      try { aisRecognition.stop(); } catch(e){}
    }
  }

  function aisSendText(){
    const ta = document.getElementById('ais-text');
    if(!ta) return;
    const txt = ta.value.trim();
    if(!txt) return;
    ta.value = '';
    aisSetVoiceState('processing');
    aisHandleUserInput(txt);
  }

  function aisHandleUserInput(text){
    if(aisState.screen !== 'chat') return;
    aisAddUserMessage(text);
    const fb = aisGenerateFeedback(text);
    aisState.feedback.push(fb);

    // Suhbat yakuni — lokal xayrlashuv
    if(aisState.turns >= 8){
      setTimeout(() => {
        if(aisState.screen !== 'chat') return;
        aisAddAIMessage(aisState.scenario.goodbye, fb.text);
        setTimeout(() => aisEndSession(), 1500);
      }, 400);
      return;
    }

    // AI backendga so'rov (OpenAI/Gemini). Ishlaymasa — lokal savolga qaytamiz.
    const history = aisState.messages.slice(-14).map(function(m){
      return { role: m.role === 'ai' ? 'assistant' : 'user', content: m.text };
    });
    aisSetVoiceState('processing');
    aiApiPost('/api/ai/chat', {
      scenario: {
        title: aisState.scenario.title,
        desc: aisState.scenario.desc,
        questions: aisState.scenario.topicQs,
        turn: aisState.turns
      },
      messages: history,
      message: text
    }, 60000).then(function(data){
      if(aisState.screen !== 'chat') return;
      const reply = data && data.reply ? String(data.reply).trim() : '';
      const aiFb = data && data.feedback ? String(data.feedback).trim() : '';
      if(!reply) throw new Error('empty AI reply');
      aisAddAIMessage(reply, aiFb || fb.text);
    }).catch(function(err){
      if(aisState.screen !== 'chat') return;
      if(err && err.status !== 503) console.warn('AI chat fallback:', err.message || err);
      setTimeout(function(){
        if(aisState.screen !== 'chat') return;
        const nextQ = aisPickNextQuestion(text);
        aisAddAIMessage(nextQ, fb.text);
      }, 250);
    });
  }

  function aisGenerateFeedback(text){
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wc = words.length;
    const fb = {text:'', type:'neutral'};
    if(wc < 5){
      fb.text = 'Juda qisqa! Kamida 5-8 so\'zdan iborat to\'liq jumla gapiring.';
      fb.type = 'short';
    } else if(wc > 60){
      fb.text = 'Yaxshi, batafsil javob! Lekin aniqroq bo\'lishga harakat qiling.';
      fb.type = 'long';
    } else {
      // grammatika/lug'at tekshiruvi
      const hasConnector = /\b(because|although|however|therefore|so|but|and|for example|in addition|firstly|secondly|finally)\b/i.test(text);
      const hasFuture = /\b(will|going to|shall)\b/i.test(text);
      const hasPast = /\b(was|were|went|did|had|said|made|came|saw|took|gave)\b/i.test(text);
      const hasArticle = /\b(a|an|the)\b/i.test(text);
      const lower = text.toLowerCase();
      const unique = new Set(words.map(w => w.toLowerCase().replace(/[^a-z']/g,''))).size;
      const diversity = wc ? unique / wc : 0;
      let tips = [];
      if(hasConnector) tips.push('yaxshi bog\'lovchi so\'zlar ishlatdingiz');
      if(hasPast) tips.push('o\'tgan zamonni to\'g\'ri ishlatdingiz');
      if(hasFuture) tips.push('kelasi zamonni qo\'lladingiz');
      if(diversity > 0.6) tips.push("lug'at xilma-ligligi yaxshi");
      if(!hasArticle && wc > 8) tips.push('article (a/an/the) qo\'shishni harakat qiling');
      if(tips.length){
        fb.text = 'Yaxshi! ' + tips.join(', ') + '.';
        fb.type = 'good';
      } else {
        fb.text = 'Yaxshi javob! Ko\'proq bog\'lovchi so\'zlar va murakkabroq gaplar sinab ko\'ring.';
        fb.type = 'ok';
      }
    }
    return fb;
  }

  function aisPickNextQuestion(userText){
    const s = aisState.scenario;
    const lower = userText.toLowerCase();
    // kalit so'z bo'yicha moslashtirish (eng yaqin savol)
    let bestIdx = -1;
    let bestScore = 0;
    s.hints.forEach((h, i) => {
      if(lower.includes(h) && i !== aisState.qIdx){
        if(i > bestScore){ bestIdx = i; bestScore = i; }
      }
    });
    // ketma-ket navbat (agar hech qanday moslik bo'lmasa)
    if(bestIdx === -1){
      aisState.qIdx = (aisState.qIdx + 1) % s.topicQs.length;
    } else {
      aisState.qIdx = bestIdx;
    }
    return s.topicQs[aisState.qIdx];
  }

  function aisEndSession(){
    if(aisRecTimer) clearInterval(aisRecTimer);
    aisContinuous = false;
    aisTurnBusy = false;
    clearTimeout(aisResumeTimer);
    aisStopTts();
    if(aisRecognition){ try{ aisRecognition.abort(); }catch(e){} }
    // progress saqlash
    const mins = Math.max(1, Math.floor((Date.now() - aisState.startTime) / 60000));
    const avgWordPerTurn = aisState.turns ? Math.round(aisState.words / aisState.turns) : 0;

    // === HAQIQIY BAHOLASH ===
    // Foydalanuvchi kamida 3 ta suhbat (savol-javob) qilishi kerak
    if(aisState.turns < 3 || aisState.words < 20){
      // Suhbat yetarli emas — natija saqlanmaydi
      testProgress.aispeaking = {
        completed: false,
        band: 0,
        pct: 0,
        score: 'Suhbat yetarli emas (' + aisState.turns + ' suhbat, ' + aisState.words + " so'z)",
        date: new Date().toISOString().split('T')[0],
        turns: aisState.turns,
        words: aisState.words,
        minutes: mins
      };
      if(typeof saveUserProgress === 'function') saveUserProgress();
      // Natija ekrani — ogohlantirish
      document.getElementById('aispeaking-content').innerHTML = `
        <div class="ais-wrap">
          <div class="ais-res-card" style="background:linear-gradient(135deg,#ef4444,#dc2626);">
            <div class="ais-res-icon">⚠️</div>
            <div class="ais-res-title">Suhbat yetarli emas</div>
            <div class="ais-res-sub" style="opacity:.92;">AI Speaking baholanishi uchun kamida 3 ta savol-javob va 20+ so'z kerak</div>
          </div>
          <div class="ais-stats-grid">
            <div class="ais-stat-item"><div class="ais-stat-num">${aisState.turns}</div><div class="ais-stat-label">SUHBAT</div></div>
            <div class="ais-stat-item"><div class="ais-stat-num">${aisState.words}</div><div class="ais-stat-label">SO'ZLAR</div></div>
            <div class="ais-stat-item"><div class="ais-stat-num">${mins}</div><div class="ais-stat-label">DAQIQA</div></div>
          </div>
          <div class="ais-comeback">Iltimos, suhbatni davom ettiring — AI sizga savol beradi, siz javob bering.</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="ais-btn" style="flex:1;" onclick="openAISpeaking()">🔄 Qayta boshlash</button>
            <button class="ais-btn-outline" style="flex:1;" onclick="switchTab('home')">🏠 Bosh sahifa</button>
          </div>
        </div>`;
      return;
    }

    // Yaxshi javoblar ulushi + so'z soni + davomiyligi
    const goodCount = aisState.feedback.filter(f => f.type === 'good').length;
    const shortCount = aisState.feedback.filter(f => f.type === 'short').length;
    const longCount = aisState.feedback.filter(f => f.type === 'long').length;

    // Asosiy ball — yaxshi javoblar ulushi (0-100%)
    let scorePct = aisState.turns > 0 ? Math.round((goodCount / aisState.turns) * 60) : 0;
    // Qo'shimcha ball — so'z soni (50+ so'z = +20, 100+ = +30, 200+ = +40)
    if(aisState.words >= 200) scorePct += 25;
    else if(aisState.words >= 100) scorePct += 18;
    else if(aisState.words >= 50) scorePct += 12;
    // Qo'shimcha ball — davomiylik (3+ daqiqa = +10, 5+ = +15)
    if(mins >= 5) scorePct += 15;
    else if(mins >= 3) scorePct += 10;
    // Jazo — qisqa javoblar ko'p bo'lsa (-5 har biri, max -20)
    scorePct -= Math.min(20, shortCount * 5);
    // Clamp 30-100
    const clampedPct = Math.max(30, Math.min(100, scorePct));
    // Bandga konvertatsiya
    let band = 4.0;
    if(clampedPct >= 95) band = 9.0;
    else if(clampedPct >= 90) band = 8.5;
    else if(clampedPct >= 85) band = 8.0;
    else if(clampedPct >= 80) band = 7.5;
    else if(clampedPct >= 75) band = 7.0;
    else if(clampedPct >= 70) band = 7.0;
    else if(clampedPct >= 65) band = 6.5;
    else if(clampedPct >= 60) band = 6.5;
    else if(clampedPct >= 55) band = 6.0;
    else if(clampedPct >= 50) band = 6.0;
    else if(clampedPct >= 40) band = 5.5;
    else if(clampedPct >= 30) band = 5.0;
    else band = 4.5;
    testProgress.aispeaking = {
      completed: true,
      band: band,
      pct: clampedPct,
      score: aisState.turns + ' suhbat, ' + aisState.words + ' so\'z',
      date: new Date().toISOString().split('T')[0],
      turns: aisState.turns,
      words: aisState.words,
      minutes: mins
    };
    if(typeof saveUserProgress === 'function') saveUserProgress();
    aisRenderResult(mins, avgWordPerTurn, band, clampedPct);
  }

  function aisRenderResult(mins, avgW, band, pct){
    aisState.screen = 'result';
    const goodCount = aisState.feedback.filter(f => f.type === 'good').length;
    const shortCount = aisState.feedback.filter(f => f.type === 'short').length;
    const longCount = aisState.feedback.filter(f => f.type === 'long').length;
    const tips = [];
    if(shortCount > 0) tips.push('Javoblaringizni batafsilroq, 5-10 so\'zli to\'liq jumlalar bilan yozing.');
    if(goodCount > 0) tips.push('Bog\'lovchi so\'zlar va murakkab gaplarni davom ettiring — bu IELTSda yuqori ball beradi.');
    if(longCount === 0 && shortCount === 0) tips.push('Har bir savolga 2-3 ta bog\'langan jumla bilan javob bering.');
    if(aisState.words < 50) tips.push('Ko\'proq so\'z ishlatishga harakat qiling — maqsad 60+ so\'z.');
    tips.push('Har kuni 5-10 daqiqalik AI suhbat mashqi qiling — sezilarli yaxshilanish bo\'ladi.');
    document.getElementById('aispeaking-content').innerHTML = `
      <div class="ais-wrap">
        <div class="ais-res-card">
          <div class="ais-res-icon">🎉</div>
          <div class="ais-res-title">Suhbat yakunlandi!</div>
          <div class="ais-res-sub">${aisState.scenario.icon} ${aisState.scenario.name} — ${mins} daqiqa, ${aisState.turns} suhbat</div>
        </div>
        <div class="ais-stats-grid">
          <div class="ais-stat-item"><div class="ais-stat-num">${aisState.turns}</div><div class="ais-stat-label">SUHBAT</div></div>
          <div class="ais-stat-item"><div class="ais-stat-num">${aisState.words}</div><div class="ais-stat-label">SO'ZLAR</div></div>
          <div class="ais-stat-item"><div class="ais-stat-num">${avgW}</div><div class="ais-stat-label">O'RT. SO'Z/SUHBAT</div></div>
        </div>
        <div class="ais-feedback">
          <strong>📊 Baholash:</strong> Taxminiy Band <strong style="color:#10b981;">${band}</strong> (${pct}%)
          <ul>
            <li><strong>Yaxshi javoblar:</strong> ${goodCount} ta</li>
            <li><strong>Qisqa javoblar:</strong> ${shortCount} ta</li>
            <li><strong>Uzun javoblar:</strong> ${longCount} ta</li>
          </ul>
          <strong style="display:block;margin-top:8px;">💡 Tavsiyalar:</strong>
          <ul>
            ${tips.map(t => '<li>' + t + '</li>').join('')}
          </ul>
        </div>
        <div class="ais-comeback">Har kuni 5-10 daqiqalik AI suhbat — erkin gapirishingiz tez yaxshilanadi! 🌱</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="ais-btn" style="flex:1;" onclick="openAISpeaking()">🔄 Yana suhbat</button>
          <button class="ais-btn-outline" style="flex:1;" onclick="switchTab('home')">🏠 Bosh sahifa</button>
        </div>
      </div>`;
  }

  function aisCleanup(){
    if(aisLoadTimer) clearInterval(aisLoadTimer);
    if(aisRecTimer) clearInterval(aisRecTimer);
    aisContinuous = false;
    aisTurnBusy = false;
    clearTimeout(aisResumeTimer);
    aisStopTts();
    if(aisRecognition){ try{ aisRecognition.abort(); }catch(e){} aisRecognition = null; }
    aisIsRecording = false;
  }

  /* Orqaga — suhbat davomida tasdiq so'raladi */
  function aispeakingBack(){
    const inProgress = (aisState.screen === 'chat' && aisState.turns > 0) || aisState.screen === 'loading';
    if(inProgress){
      if(!confirm("Suhbat tugallanmagan! Agar chiqsangiz, natija saqlanmaydi. Chiqishni tasdiqlaysizmi?")) return;
    }
    aisCleanup();
    switchTab('home');
  }

