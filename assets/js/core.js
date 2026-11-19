// Englify — core
  // --- ANDROID APK: native Android TTS ko'prigi ---
  // WebView'ning o'z TTS'i zaif bo'lishi mumkin. Ilovada native TextToSpeech ishlatamiz.
  (function(){
    try{
      var bridge = window.EnglifyTTS || window.YuksalishTTS;
      if(!bridge || typeof bridge.speak !== 'function') return;

      function Utterance(text){
        this.text = String(text == null ? '' : text);
        this.lang = 'en-US'; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null;
        this.onstart = null; this.onend = null; this.onerror = null;
      }

      var speaking = false;
      var ttsToken = 0;

      var synth = {
        get speaking(){ return speaking; },
        pending: false,
        paused: false,
        speak: function(u){
          if(!u) return;
          var token = ++ttsToken;
          speaking = true;
          var text = (typeof u.text === 'string') ? u.text : String(u.text || '');
          var lang = u.lang || 'en-US';
          var rate = Number(u.rate) || 0.95;
          var started = false;

          function start(){
            if(started || token !== ttsToken) return;
            started = true;
            try{
              bridge.speak(text, lang, rate);
            }catch(e){
              speaking = false;
              if(u.onerror){ try{ u.onerror({ error: 'synthesis-failed', utterance: u }); }catch(e2){} }
              return;
            }
            if(u.onstart){ setTimeout(function(){ if(token === ttsToken){ try{ u.onstart({}); }catch(e){} } }, 30); }
            var words = text.split(/\s+/).filter(Boolean).length;
            var ms = Math.max(1200, Math.round(words * 430 / Math.max(0.5, rate)) + 200);
            setTimeout(function(){
              if(token !== ttsToken) return;
              speaking = false;
              if(u.onend){ try{ u.onend({}); }catch(e){} }
            }, ms);
          }

          var ready = true;
          try { ready = (typeof bridge.isReady !== 'function') || !!bridge.isReady(); } catch(e){ ready = true; }
          if(ready){ start(); return; }

          var tries = 0;
          var timer = setInterval(function(){
            tries++;
            var r = false;
            try { r = (typeof bridge.isReady === 'function') && !!bridge.isReady(); } catch(e){ r = false; }
            if(r || tries >= 50){ clearInterval(timer); start(); }
          }, 100);
        },
        cancel: function(){
          ttsToken++;
          speaking = false;
          try{ bridge.stop(); }catch(e){}
        },
        pause: function(){
          ttsToken++;
          speaking = false;
          try{ bridge.stop(); }catch(e){}
        },
        resume: function(){},
        getVoices: function(){
          return [{ name: 'Android TTS (native)', lang: 'en-US', default: true, voiceURI: 'android-tts', localService: true }];
        },
        addEventListener: function(){}, removeEventListener: function(){}, dispatchEvent: function(){ return false; }
      };

      // Ba'zi WebView'larda speechSynthesis read-only bo'ladi — xavfsiz almashtiramiz.
      try {
        Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true, writable: true });
      } catch(e){
        try { window.speechSynthesis = synth; } catch(e2){
          try {
            var nativeSynth = window.speechSynthesis;
            if(nativeSynth){
              nativeSynth.speak = synth.speak;
              nativeSynth.cancel = synth.cancel;
              nativeSynth.pause = synth.pause;
              nativeSynth.resume = synth.resume;
              nativeSynth.getVoices = synth.getVoices;
            }
          } catch(e3){}
        }
      }
      if(!window.SpeechSynthesisUtterance){
        try { window.SpeechSynthesisUtterance = Utterance; } catch(e){}
      }
    }catch(e){}
  })();

  // --- Shared TTS: Listening / Full Exam / Vocabulary uchun tiniq ovoz ---
  // Brauzerda eng yaxshi ingliz ovozini tanlaydi; APK'da native Android TTS ishlatiladi.
  let sbTtsToken = 0;
  let sbTtsVoice = null;
  let sbTtsVoices = [];

  function sbTtsRefreshVoices(){
    if(!('speechSynthesis' in window)) return [];
    try {
      const list = speechSynthesis.getVoices() || [];
      if(list.length) sbTtsVoices = list;
    } catch(e){}
    return sbTtsVoices;
  }

  function sbTtsVoiceScore(v){
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

  function sbTtsPickVoice(){
    const voices = sbTtsRefreshVoices();
    const english = voices.filter(function(v){ return /^en([-_]|$)/i.test(String(v.lang || '')); });
    if(!english.length) return null;
    english.sort(function(a, b){ return sbTtsVoiceScore(b) - sbTtsVoiceScore(a); });
    return english[0];
  }

  function sbTtsSplit(text, maxLen){
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if(!clean) return [];
    const limit = maxLen || 190;
    const sentences = clean.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [clean];
    const chunks = [];
    let current = '';
    sentences.forEach(function(sentence){
      const part = sentence.trim();
      if(!part) return;
      if(current && (current + ' ' + part).length > limit){
        chunks.push(current);
        current = part;
      } else {
        current = current ? current + ' ' + part : part;
      }
    });
    if(current) chunks.push(current);
    return chunks.slice(0, 40);
  }

  function sbTtsStop(){
    sbTtsToken++;
    if('speechSynthesis' in window){
      try { speechSynthesis.cancel(); } catch(e){}
    }
  }

  function sbTtsSpeak(text, opts){
    opts = opts || {};
    if(!('speechSynthesis' in window)){
      if(opts.onDone) setTimeout(opts.onDone, 0);
      return;
    }
    const chunks = sbTtsSplit(text, opts.maxChunk || 190);
    if(!chunks.length){
      if(opts.onDone) setTimeout(opts.onDone, 0);
      return;
    }

    const token = ++sbTtsToken;
    try { speechSynthesis.cancel(); } catch(e){}
    try { speechSynthesis.resume(); } catch(e){}

    let index = 0;
    function speakNext(){
      if(token !== sbTtsToken) return;
      if(index >= chunks.length){
        if(opts.onDone) opts.onDone();
        return;
      }

      const part = chunks[index++];
      const u = new SpeechSynthesisUtterance(part);
      const voice = sbTtsVoice || sbTtsPickVoice();
      if(voice){
        sbTtsVoice = voice;
        u.voice = voice;
        u.lang = voice.lang || opts.lang || 'en-US';
      } else {
        u.lang = opts.lang || 'en-US';
      }
      u.rate = (opts.rate != null ? opts.rate : 0.95);
      u.pitch = (opts.pitch != null ? opts.pitch : 1.0);
      u.volume = (opts.volume != null ? opts.volume : 1.0);

      let finished = false;
      let watchdog = null;
      function finishChunk(){
        if(finished) return;
        finished = true;
        if(watchdog) clearTimeout(watchdog);
        if(token !== sbTtsToken) return;
        setTimeout(speakNext, 70);
      }

      u.onstart = function(){ if(opts.onStart) try{ opts.onStart(); }catch(e){} };
      u.onend = finishChunk;
      u.onerror = function(ev){
        if(ev && (ev.error === 'interrupted' || ev.error === 'canceled')){
          finished = true;
          if(watchdog) clearTimeout(watchdog);
          return;
        }
        finishChunk();
      };

      const words = part.split(/\s+/).filter(Boolean).length;
      watchdog = setTimeout(finishChunk, Math.max(2600, words * 460 + 1200));

      try { speechSynthesis.speak(u); } catch(e){ finishChunk(); }
    }

    function startWhenVoicesReady(){
      if(token !== sbTtsToken) return;
      if(sbTtsRefreshVoices().length === 0){
        let started = false;
        const start = function(){
          if(started) return;
          started = true;
          try { speechSynthesis.removeEventListener('voiceschanged', start); } catch(e){}
          sbTtsRefreshVoices();
          sbTtsVoice = null;
          speakNext();
        };
        try { speechSynthesis.addEventListener('voiceschanged', start); } catch(e){}
        setTimeout(start, 900);
      } else {
        sbTtsVoice = null;
        speakNext();
      }
    }

    setTimeout(startWhenVoicesReady, 60);
  }

  if('speechSynthesis' in window){
    sbTtsRefreshVoices();
    try {
      speechSynthesis.addEventListener('voiceschanged', function(){
        sbTtsRefreshVoices();
        sbTtsVoice = null;
      });
    } catch(e){
      speechSynthesis.onvoiceschanged = function(){ sbTtsRefreshVoices(); sbTtsVoice = null; };
    }
  }

  // --- STUDIO TTS: Gemini bilan haqiqiy, tiniq ovoz ---
  // Matn kichik bo'laklarga bo'linadi; har bir bo'lak serverda WAV'ga aylantiriladi
  // va Audio elementi orqali ijro etiladi. Server ishlamasa brauzer TTS'ga qaytadi.
  const SB_STUDIO_VOICE = 'Kore';
  const SB_STUDIO_CHUNK = 300;
  const SB_STUDIO_CACHE_MAX = 10;
  const sbStudioCache = new Map();
  let sbStudioToken = 0;
  let sbStudioAudio = null;
  let sbStudioCancel = null;
  let sbStudioDisabledUntil = 0;

  function sbStudioSplit(text, maxLen){
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if(!clean) return [];
    const limit = maxLen || SB_STUDIO_CHUNK;
    const sentences = clean.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [clean];
    const chunks = [];
    let current = '';
    function pushPart(part){
      part = part.trim();
      if(!part) return;
      if(current && (current + ' ' + part).length > limit){
        chunks.push(current);
        current = part;
      } else {
        current = current ? current + ' ' + part : part;
      }
    }
    sentences.forEach(function(sentence){
      let part = sentence.trim();
      while(part.length > limit){
        let cut = part.lastIndexOf(',', limit);
        if(cut < limit * 0.45) cut = part.lastIndexOf(' ', limit);
        if(cut < limit * 0.45) cut = limit;
        pushPart(part.slice(0, cut + 1));
        part = part.slice(cut + 1).trim();
      }
      pushPart(part);
    });
    if(current) chunks.push(current);
    return chunks;
  }

  function sbStudioStop(){
    sbStudioToken++;
    const cancel = sbStudioCancel;
    sbStudioCancel = null;
    if(cancel){ try{ cancel(); }catch(e){} }
    if(sbStudioAudio){ try{ sbStudioAudio.pause(); }catch(e){} sbStudioAudio = null; }
    try { sbTtsStop(); } catch(e){}
  }

  function sbStudioCacheUrl(key, b64, mime){
    try {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for(let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: mime || 'audio/wav' }));
      sbStudioCache.set(key, url);
      if(sbStudioCache.size > SB_STUDIO_CACHE_MAX){
        const oldest = sbStudioCache.keys().next().value;
        if(oldest){
          try { URL.revokeObjectURL(sbStudioCache.get(oldest)); } catch(e){}
          sbStudioCache.delete(oldest);
        }
      }
      return url;
    } catch(e){
      return 'data:' + (mime || 'audio/wav') + ';base64,' + b64;
    }
  }

  async function sbStudioFetchChunk(text, voice){
    const key = voice + '|' + text;
    if(sbStudioCache.has(key)) return sbStudioCache.get(key);
    if(Date.now() < sbStudioDisabledUntil) throw new Error('studio-tts-disabled');

    const ctrl = new AbortController();
    const timer = setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, 30000);
    try {
      const res = await fetch(API_BASE + '/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, voice: voice }),
        signal: ctrl.signal
      });
      let data = null;
      try { data = await res.json(); } catch(e){ data = null; }
      if(!res.ok || !data || !data.audio){
        const err = new Error((data && data.detail) || ('TTS HTTP ' + res.status));
        err.status = res.status;
        if(res.status === 404 || res.status === 503) sbStudioDisabledUntil = Date.now() + 10 * 60 * 1000;
        else if(res.status === 429) sbStudioDisabledUntil = Date.now() + 60 * 1000;
        throw err;
      }
      return sbStudioCacheUrl(key, data.audio, data.mime);
    } finally {
      clearTimeout(timer);
    }
  }

  function sbStudioPlay(url, rate){
    return new Promise(function(resolve, reject){
      const audio = new Audio(url);
      sbStudioAudio = audio;
      audio.playbackRate = rate || 1;
      audio.volume = 1;
      let done = false;
      const cancel = function(){
        if(done) return;
        done = true;
        if(sbStudioCancel === cancel) sbStudioCancel = null;
        if(sbStudioAudio === audio) sbStudioAudio = null;
        try { audio.pause(); } catch(e){}
        reject(new Error('stopped'));
      };
      function finish(ok){
        if(done) return;
        done = true;
        if(sbStudioCancel === cancel) sbStudioCancel = null;
        if(sbStudioAudio === audio) sbStudioAudio = null;
        if(ok) resolve(); else reject(new Error('playback'));
      }
      sbStudioCancel = cancel;
      audio.onended = function(){ finish(true); };
      audio.onerror = function(){ finish(false); };
      audio.play().catch(function(){ finish(false); });
    });
  }

  async function sbStudioSpeak(text, opts){
    opts = opts || {};
    const chunks = sbStudioSplit(text, opts.maxChunk || SB_STUDIO_CHUNK);
    if(!chunks.length){
      if(opts.onDone) setTimeout(opts.onDone, 0);
      return;
    }
    // Avvalgi ijroni to'xtatamiz (ovoz ustma-ust tushmasligi uchun)
    try { sbStudioStop(); } catch(e){}
    const token = ++sbStudioToken;
    const voice = opts.voice || SB_STUDIO_VOICE;
    const rate = (opts.rate != null ? opts.rate : 1.0);

    function fallback(from){
      if(token !== sbStudioToken) return;
      if(opts.onFallback) try{ opts.onFallback(); }catch(e){}
      sbTtsSpeak(chunks.slice(from).join(' '), {
        rate: 0.95,
        pitch: 1,
        volume: 1,
        onStart: opts.onStart,
        onDone: opts.onDone
      });
    }

    let pending = sbStudioFetchChunk(chunks[0], voice).then(function(u){ return { url: u }; })
      .catch(function(e){ return { error: e }; });

    for(let i = 0; i < chunks.length; i++){
      if(token !== sbStudioToken) return;
      const got = await pending;
      if(token !== sbStudioToken) return;
      if(got.error){ fallback(i); return; }

      if(i + 1 < chunks.length){
        const nextText = chunks[i + 1];
        pending = sbStudioFetchChunk(nextText, voice).then(function(u){ return { url: u }; })
          .catch(function(e){ return { error: e }; });
      }

      if(i === 0 && opts.onStart) try{ opts.onStart(); }catch(e){}
      if(opts.onChunk) try{ opts.onChunk(i, chunks[i], chunks.length); }catch(e){}
      try {
        await sbStudioPlay(got.url, rate);
      } catch(e){
        if(token !== sbStudioToken) return;
        fallback(i);
        return;
      }
      if(opts.onProgress) try{ opts.onProgress((i + 1) / chunks.length, i + 1, chunks.length); }catch(e){}
    }
    if(token === sbStudioToken && opts.onDone) opts.onDone();
  }

  // --- AUTH + BACKEND API ---
  // Lokal: node backend/server.js → http://127.0.0.1:8000
  // Vercel: /api/* same-origin serverless funksiyalar orqali ishlaydi.
  const API_BASE = (typeof window !== 'undefined' && window.SB_API_BASE) ||
    ((typeof location !== 'undefined' &&
      (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'))
      ? 'http://127.0.0.1:8000'
      : '');
  const USERS_KEY = 'sb_users';
  const SESSION_KEY = 'sb_session';
  const TOKEN_KEY = 'sb_access';
  const REFRESH_KEY = 'sb_refresh';
  const ADMIN_EMAILS = ['alimardonovio11@gmail.com', 'admin@englify.uz'];

  async function api(method, path, body, useAuth) {
    const opts = {
      method: method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (useAuth !== false) {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t) opts.headers['Authorization'] = 'Bearer ' + t;
    }
    if (body !== undefined && body !== null) opts.body = JSON.stringify(body);
    const ctrl = new AbortController();
    const timer = setTimeout(function(){ try { ctrl.abort(); } catch(e){} }, 15000);
    opts.signal = ctrl.signal;
    let res;
    try {
      res = await fetch(API_BASE + path, opts);
    } finally {
      clearTimeout(timer);
    }
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (!res.ok) {
      const err = new Error((data && data.detail) || ('HTTP ' + res.status));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // --- AI BACKEND (OpenAI / Gemini) ---
  // Kalit faqat backend/.env da saqlanadi — brauzerga hech qachon yuborilmaydi.
  let aiBackendInfo = null;

  async function aiApiPost(path, body, timeoutMs) {
    const ctrl = new AbortController();
    const timer = setTimeout(function(){ try { ctrl.abort(); } catch(e){} }, timeoutMs || 60000);
    try {
      const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}),
        signal: ctrl.signal
      });
      let data = null;
      try { data = await res.json(); } catch(e){ data = null; }
      if (!res.ok) {
        const err = new Error((data && data.detail) || ('HTTP ' + res.status));
        err.status = res.status;
        err.data = data;
        throw err;
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  async function aiGenerate(kind, level, timeoutMs) {
    const res = await aiApiPost('/api/ai/generate', {
      kind: kind,
      level: level || 'B2'
    }, timeoutMs || 60000);
    return (res && res.data) ? res.data : null;
  }

  function aiValidQuestion(q) {
    return !!(q && typeof q.q === 'string' && q.q.trim() &&
      Array.isArray(q.opts) && q.opts.length === 4 &&
      Number.isInteger(q.ans) && q.ans >= 0 && q.ans <= 3);
  }

  function aiValidQuestionList(list, count) {
    return Array.isArray(list) && list.length >= count && list.slice(0, count).every(aiValidQuestion);
  }

  function aiValidFexQuestions(list, count) {
    return Array.isArray(list) && list.length >= count && list.slice(0, count).every(function(q){
      return q && typeof q.q === 'string' && q.q.trim() &&
        Array.isArray(q.o) && q.o.length === 4 &&
        Number.isInteger(q.a) && q.a >= 0 && q.a <= 3;
    });
  }

  async function aiHealthCheck(force) {
    if (aiBackendInfo && !force) return aiBackendInfo;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(function(){ try { ctrl.abort(); } catch(e){} }, 2500);
      const res = await fetch(API_BASE + '/api/health', { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      aiBackendInfo = await res.json();
      return aiBackendInfo;
    } catch (e) {
      aiBackendInfo = { ok: false, aiEnabled: false, provider: 'none' };
      return aiBackendInfo;
    }
  }

  const ADMIN_EMAILS_EXTRA_KEY = 'sb_admin_emails';
  function getAdminEmails(){
    const list = ADMIN_EMAILS.slice();
    try {
      const extra = JSON.parse(localStorage.getItem(ADMIN_EMAILS_EXTRA_KEY) || '[]');
      if(Array.isArray(extra)){
        extra.forEach(function(e){
          const email = String(e || '').trim().toLowerCase();
          if(email && list.indexOf(email) < 0) list.push(email);
        });
      }
    } catch(e){}
    return list;
  }
  function isAdminEmail(email){
    return getAdminEmails().includes(String(email || '').trim().toLowerCase());
  }
  function isAdmin(){
    const s = getSession();
    return !!(s && (s.role === 'admin' || isAdminEmail(s.email)));
  }
  function withRole(user){
    if(!user) return user;
    const email = (user.email || '').toLowerCase();
    const role = isAdminEmail(email) ? 'admin' : (user.role || 'user');
    return Object.assign({}, user, { email: email, role: role });
  }

  function getUsers(){
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
    catch(e){ return {}; }
  }
  function saveUsers(users){
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function getSession(){
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch(e){ return null; }
  }
  function setSession(user){
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  function clearSession(){
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
  function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Lokal (eski) admin hisobini serverda ham yaratib, token oladi.
  // Shu tufayli admin panel barcha qurilmalardagi foydalanuvchilarni ko'radi.
  async function ensureServerAccount(email, password, name){
    function saveTokens(data){
      if(!data) return null;
      if(data.access) localStorage.setItem(TOKEN_KEY, data.access);
      if(data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
      return data;
    }
    try {
      return saveTokens(await api('POST', '/api/auth/login', { email, password }, false));
    } catch(e1){
      if(e1.status !== 401 && e1.status !== 400 && e1.status !== 404) return null;
    }
    try {
      return saveTokens(await api('POST', '/api/auth/register', {
        name: name || email.split('@')[0],
        email: email,
        phone: '',
        password: password,
        terms: true
      }, false));
    } catch(e2){
      if(e2.status === 400){
        try {
          return saveTokens(await api('POST', '/api/auth/login', { email, password }, false));
        } catch(e3){ return null; }
      }
      return null;
    }
  }

  function doRegister(){
    try {
      const errEl = document.getElementById('register-error');
      const okEl  = document.getElementById('register-success');
      if(errEl) errEl.style.display = 'none';
      if(okEl) okEl.style.display = 'none';

      const nameEl = document.getElementById('r-name');
      const emailEl = document.getElementById('r-email');
      const phoneEl = document.getElementById('r-phone');
      const passEl = document.getElementById('r-password');
      const termsEl = document.getElementById('r-terms');

      const name = (nameEl && nameEl.value || '').trim();
      const email = (emailEl && emailEl.value || '').trim().toLowerCase();
      const phone = (phoneEl && phoneEl.value || '').trim();
      const password = (passEl && passEl.value) || '';
      const terms = termsEl ? termsEl.checked : true;

      function showRegError(msg){
        if(errEl){
          errEl.textContent = msg;
          errEl.style.display = 'block';
        } else {
          alert(msg);
        }
      }

      if(!name){
        showRegError('Ism va familiyangizni kiriting.');
        return;
      }
      if(!email || !isValidEmail(email)){
        showRegError('To\'g\'ri email manzilini kiriting (masalan: ism@gmail.com).');
        return;
      }
      if(password.length < 6){
        showRegError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak.');
        return;
      }
      if(!terms){
        showRegError('Foydalanish shartlariga rozilik bildiring.');
        return;
      }

      // Backend API (asosiy), localStorage fallback
      (async function(){
        try {
          const data = await api('POST', '/api/auth/register', {
            name, email, phone, password, terms: true
          }, false);
          localStorage.setItem(TOKEN_KEY, data.access);
          if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
          const sessionUser = withRole(data.user);
          setSession(sessionUser);

          // Admin panel darhol ko'rishi uchun lokal nusxa ham saqlanadi
          const users = getUsers();
          users[email] = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            role: sessionUser.role,
            status: (data.user && data.user.status) || 'active',
            provider: (data.user && data.user.provider) || 'password',
            createdAt: (data.user && data.user.createdAt) || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            synced: true
          };
          saveUsers(users);

          applyUserToUI(sessionUser);
          if(okEl){ okEl.textContent = '✅ Muvaffaqiyatli ro‘yxatdan o‘tdingiz!'; okEl.style.display = 'block'; }
          setTimeout(function(){ showView('dashboard'); }, 600);
          return;
        } catch (apiErr) {
          // Backend ishlamasa — localStorage
          if (apiErr.status === 400 || apiErr.status === 403) {
            showRegError(apiErr.message);
            return;
          }
          console.warn('API register failed, using localStorage', apiErr);
        }

        const users = getUsers();
        if(users[email]){
          showRegError('Bu email allaqachon ro\'yxatdan o\'tgan. Kirish bo\'limidan foydalaning.');
          return;
        }
        // Serverga ulanmaganmiz — eski tokenni ishlatmaymiz
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        const role = isAdminEmail(email) ? 'admin' : 'user';
        users[email] = { name: name, email: email, phone: phone, password: password, role: role, createdAt: new Date().toISOString() };
        saveUsers(users);
        if(okEl){ okEl.textContent = '✅ Muvaffaqiyatli (local)!'; okEl.style.display = 'block'; }
        const sessionUser = withRole({ email: email, name: name, role: role });
        setSession(sessionUser);
        applyUserToUI(sessionUser);
        setTimeout(function(){ showView('dashboard'); }, 600);
      })();

    } catch(e){
      console.error('Register error:', e);
      alert('Ro\'yxatdan o\'tishda xatolik: ' + e.message);
    }
  }

  function doLogin(){
    try {
      const errEl = document.getElementById('login-error');
      if(errEl) errEl.style.display = 'none';

      function showLoginError(msg){
        if(errEl){
          errEl.textContent = msg;
          errEl.style.display = 'block';
        } else {
          alert(msg);
        }
      }

      const email = (document.getElementById('l-email').value || '').trim().toLowerCase();
      const password = document.getElementById('l-password').value || '';

      if(!email || !isValidEmail(email)){
        showLoginError('To\'g\'ri email manzilini kiriting.');
        return;
      }
      if(!password){
        showLoginError('Parolni kiriting.');
        return;
      }

      (async function(){
        try {
          const data = await api('POST', '/api/auth/login', { email, password }, false);
          localStorage.setItem(TOKEN_KEY, data.access);
          if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
          const sessionUser = withRole(data.user);

          // Lokal nusxani server ma'lumotlari bilan yangilaymiz
          const users = getUsers();
          const prev = users[email] || {};
          users[email] = Object.assign({}, prev, {
            name: (data.user && data.user.name) || prev.name || email.split('@')[0],
            email: email,
            phone: (data.user && data.user.phone) || prev.phone || '',
            password: password,
            role: sessionUser.role,
            status: (data.user && data.user.status) || 'active',
            provider: (data.user && data.user.provider) || 'password',
            createdAt: (data.user && data.user.createdAt) || prev.createdAt || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            synced: true
          });
          saveUsers(users);

          setSession(sessionUser);
          applyUserToUI(sessionUser);
          showView('dashboard');
          return;
        } catch (apiErr) {
          if (apiErr.status === 403) {
            showLoginError(apiErr.message || 'Bu hisob bloklangan.');
            return;
          }
          console.warn('API login fallback', apiErr);
        }
        const users = getUsers();
        const user = users[email];
        if(!user){
          showLoginError("Email yoki parol noto'g'ri.");
          return;
        }
        if(user.password !== password){
          showLoginError("Parol noto'g'ri. Qayta urinib ko'ring.");
          return;
        }
        if(user.status === 'blocked'){
          showLoginError('Bu hisob bloklangan. Admin bilan bog‘laning.');
          return;
        }
        if(isAdminEmail(user.email)){
          users[user.email] = Object.assign({}, user, { role: 'admin' });
          saveUsers(users);
        }
        // Server tokeni bu lokal sessiyaga tegishli emas — tozalaymiz
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        const sessionUser = withRole({ email: user.email, name: user.name, role: user.role, phone: user.phone });
        setSession(sessionUser);
        applyUserToUI(sessionUser);
        showView('dashboard');

        // Admin panel serverdagi foydalanuvchilarni ko'rishi uchun serverda ham hisob yaratamiz
        // (eski lokal hisoblar keyingi kirishda serverga ko'chiriladi)
        ensureServerAccount(user.email, password, user.name).then(function(data){
          if(!data) return;
          try { if(typeof adminRefreshUsers === 'function') adminRefreshUsers(); } catch(e){}
          try { if(typeof adminRefreshResults === 'function') adminRefreshResults(); } catch(e){}
        }).catch(function(){});
      })();
    } catch(e){
      console.error('Login error:', e);
      alert('Kirishda xatolik: ' + e.message);
    }
  }

  function doLogout(){
    try {
      adviceState.seq++;
      adviceState.messages = [];
      adviceState.busy = false;
      adviceState.started = false;
      adviceState.health = null;
      adviceState.attachments = [];
      adviceState.draft = '';
    } catch(e){}
    clearSession();
    showView('home');
  }

