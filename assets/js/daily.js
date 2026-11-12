// Englify — daily
  // --- DAILY TESTS — ALILM UZ USLUBI (intro → loading → testing → result) ---
  const DAILY_BANK = [
    // GRAMMATIKA (8)
    {type:'grammar', q:"Choose the correct form: She ___ to school every day.", opts:["go","goes","going","gone"], ans:1},
    {type:'grammar', q:"Past tense of 'write' is:", opts:["writed","wrote","written","writing"], ans:1},
    {type:'grammar', q:"I ___ TV when the phone rang.", opts:["watched","was watching","am watching","watch"], ans:1},
    {type:'grammar', q:"There isn't ___ milk left in the fridge.", opts:["many","much","a few","several"], ans:1},
    {type:'grammar', q:"If it ___ tomorrow, we will stay at home.", opts:["rains","will rain","rained","is raining"], ans:0},
    {type:"grammar", q:"He is ___ honest man.", opts:["a","an","the","—"], ans:1},
    {type:"grammar", q:"They have lived in Tashkent ___ 2015.", opts:["for","since","from","during"], ans:1},
    {type:"grammar", q:"Neither of the students ___ the answer.", opts:["know","knows","are knowing","have known"], ans:1},
    // LUG'AT (8)
    {type:"vocabulary", q:"What is the synonym of 'happy'?", opts:["Sad","Joyful","Angry","Tired"], ans:1},
    {type:"vocabulary", q:"What does 'environment' mean?", opts:["Atrof-muhit","Maktab","Ish","Oila"], ans:0},
    {type:"vocabulary", q:"Choose the antonym of 'ancient':", opts:["Old","Modern","Antique","Historic"], ans:1},
    {type:"vocabulary", q:"'To give up' means:", opts:["To quit","To start","To continue","To win"], ans:0},
    {type:"vocabulary", q:"Which word is a countable noun?", opts:["Water","Rice","Book","Sugar"], ans:2},
    {type:"vocabulary", q:"The opposite of 'expand' is:", opts:["Enlarge","Contract","Grow","Widen"], ans:1},
    {type:"vocabulary", q:"'Reliable' most nearly means:", opts:["Trustworthy","Lazy","Weak","Noisy"], ans:0},
    {type:"vocabulary", q:"A person who studies at a university is called a:", opts:["teacher","student","librarian","principal"], ans:1},
    // O'QISH (3 — passage bilan)
    {type:"reading", passage:"Anna wakes up at 6 a.m. every morning. She runs in the park for thirty minutes before breakfast, then takes the bus to work.", q:"What does Anna do before breakfast?", opts:["She runs in the park","She takes the bus","She cooks dinner","She reads books"], ans:0},
    {type:"reading", passage:"The Great Wall of China was built over many centuries to protect the country from invaders. Today it is one of the most popular tourist attractions in the world.", q:"Why was the Great Wall built?", opts:["To attract tourists","To protect the country","To train soldiers","To trade goods"], ans:1},
    {type:"reading", passage:"Scientists say that bees are very important for nature. They carry pollen from flower to flower, which helps plants produce fruit and seeds.", q:"What do bees help plants produce?", opts:["Water and air","Fruit and seeds","Honey only","Leaves"], ans:1},
    // GAP TO'LDIRISH (8)
    {type:"sentence", q:"We ___ dinner when the guests arrived.", opts:["cooked","were cooking","cook","have cook"], ans:1},
    {type:"sentence", q:"He is interested ___ learning German.", opts:["in","on","at","for"], ans:0},
    {type:"sentence", q:"The book ___ I bought yesterday is amazing.", opts:["who","which","what","whose"], ans:1},
    {type:"sentence", q:"I'd rather ___ at home tonight.", opts:["to stay","stay","staying","stayed"], ans:1},
    {type:"sentence", q:"She has been working here ___ five years.", opts:["since","for","during","from"], ans:1},
    {type:"sentence", q:"By this time next year, I ___ my degree.", opts:["will finish","will have finished","am finishing","finish"], ans:1},
    {type:"sentence", q:"If I ___ you, I would apologize immediately.", opts:["am","was","were","be"], ans:2},
    {type:"sentence", q:"The report must ___ by Friday.", opts:["submit","be submitted","be submitting","submitted"], ans:1},
    // QO'SHIMCHA — har kuni aylanish xilma-xil bo'lishi uchun
    {type:"grammar", q:"She is looking forward to ___ from you.", opts:["hear","hearing","heard","be heard"], ans:1},
    {type:"grammar", q:"By the time we arrived, the film ___.", opts:["already started","had already started","has already started","was starting"], ans:1},
    {type:"grammar", q:"This is the house ___ we lived in 2010.", opts:["who","which","where","whose"], ans:2},
    {type:"grammar", q:"The more you practise, ___.", opts:["the better you get","you get better","better you get","the best you get"], ans:0},
    {type:"vocabulary", q:"'Scarce' is closest in meaning to:", opts:["Rare","Common","Cheap","Heavy"], ans:0},
    {type:"vocabulary", q:"Choose the correct collocation:", opts:["make a decision","do a decision","take a decision","put a decision"], ans:0},
    {type:"vocabulary", q:"'Diligent' most nearly means:", opts:["Lazy","Hardworking","Careless","Angry"], ans:1},
    {type:"vocabulary", q:"The antonym of 'generous' is:", opts:["Kind","Stingy","Rich","Polite"], ans:1},
    {type:"reading", passage:"Tom gets up at seven and walks to the nearby bakery. He buys fresh bread every morning before going to work.", q:"What does Tom buy every morning?", opts:["Milk","Fresh bread","Coffee","Fruit"], ans:1},
    {type:"reading", passage:"Mount Everest is the highest mountain in the world. Thousands of climbers travel to Nepal every year hoping to reach its summit.", q:"Where is Mount Everest located?", opts:["In Nepal","In Egypt","In Brazil","In Canada"], ans:0},
    {type:"reading", passage:"Regular exercise improves heart health, reduces stress and helps people sleep better. Doctors recommend at least thirty minutes of activity a day.", q:"How much daily activity do doctors recommend?", opts:["Ten minutes","At least thirty minutes","Two hours","One hour"], ans:1},
    {type:"reading", passage:"The city library is open from nine in the morning until eight in the evening. Students can borrow up to five books for two weeks.", q:"How long can students keep borrowed books?", opts:["One week","Two weeks","One month","Three days"], ans:1},
    {type:"sentence", q:"I wish I ___ more time to prepare.", opts:["have","had","will have","would have"], ans:1},
    {type:"sentence", q:"Hardly ___ the station when the train left.", opts:["had I reached","I had reached","did I reach","I reached"], ans:0},
    {type:"sentence", q:"She denied ___ the money.", opts:["to take","taking","take","taken"], ans:1},
    {type:"sentence", q:"It is high time we ___ home.", opts:["go","will go","went","are going"], ans:2}
  ];
  const DAILY_TYPES = { grammar:"Grammatika", vocabulary:"Lug'at", reading:"O'qish", sentence:"Gap to'ldirish" };
  const DAILY_MIX = ["grammar","vocabulary","reading","sentence"];
  const DAILY_TOTAL = 15;
  let dtState = { screen:"intro", questions:[], idx:0, answers:{}, correct:0, revealed:false, result:null, timeLeft:30, level:null };
  let dailyTimer = null, dailyQTimer = null, dailyLoadTimer = null;

  function dtToday(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  const DAILY_AI_KEY = 'sb_daily_ai_v2';
  const DAILY_LEVEL_KEY = 'sb_daily_level_v1';
  const DAILY_LEVELS = [
    { id:'A2', name:'Elementary', desc:'Oddiy kundalik mavzular va asosiy grammatika' },
    { id:'B1', name:'Intermediate', desc:"O'rtacha matnlar, keng tarqalgan lug'at" },
    { id:'B2', name:'Upper-Intermediate', desc:'IELTS 6.5+ darajasidagi savollar' },
    { id:'C1', name:'Advanced', desc:"Murakkab tuzilmalar, idiomlar va nozik ma'nolar" }
  ];

  function dtGetSavedLevel(){
    try {
      const l = String(localStorage.getItem(DAILY_LEVEL_KEY) || '').toUpperCase();
      if(DAILY_LEVELS.some(function(x){ return x.id === l; })) return l;
    } catch(e){}
    return null;
  }

  function dtLevelName(id){
    const l = DAILY_LEVELS.filter(function(x){ return x.id === id; })[0];
    return l ? l.name : '';
  }

  function dtNormalizeAiQuestions(data){
    if(!data || !Array.isArray(data.questions)) return null;
    const types = ['grammar','vocabulary','reading','sentence'];
    const out = [];
    const seen = {};
    data.questions.forEach(function(q){
      if(out.length >= DAILY_TOTAL || !aiValidQuestion(q)) return;
      let type = String(q.type || '').toLowerCase();
      if(types.indexOf(type) < 0) type = q.passage ? 'reading' : types[out.length % 4];
      const passage = String(q.passage || '').trim();
      if(type === 'reading' && passage.length < 20) return;
      const key = q.q.trim().toLowerCase();
      if(seen[key]) return;
      seen[key] = true;
      const item = { type:type, q:q.q.trim(), opts:q.opts.slice(0,4), ans:q.ans };
      if(type === 'reading') item.passage = passage;
      out.push(item);
    });
    return out.length === DAILY_TOTAL ? out : null;
  }

  function dtGetAiQuestions(level){
    try {
      const c = JSON.parse(localStorage.getItem(DAILY_AI_KEY) || 'null');
      if(c && c.date === dtToday() && c.level === level && Array.isArray(c.questions) && c.questions.length === DAILY_TOTAL){
        const ok = c.questions.every(function(q){
          return q && typeof q.q === 'string' && q.q.length > 3 &&
            Array.isArray(q.opts) && q.opts.length === 4 &&
            Number.isInteger(q.ans) && q.ans >= 0 && q.ans <= 3 &&
            (!q.passage || typeof q.passage === 'string');
        });
        if(ok) return c.questions;
      }
    } catch(e){}
    return null;
  }

  function dtSaveAiQuestions(questions, level){
    try {
      localStorage.setItem(DAILY_AI_KEY, JSON.stringify({ date: dtToday(), level: level, questions: questions }));
    } catch(e){}
  }

  // Keyingi 24 soatlik yangilanishgacha qolgan vaqt (yarim tunda)
  function dtNextRefreshSec(){
    const n = new Date();
    const t = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 0, 0);
    return Math.max(0, Math.floor((t.getTime() - n.getTime()) / 1000));
  }
  function dtRefreshText(){
    let s = dtNextRefreshSec();
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    return '⏳ Yangi savollargacha: ' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }
  function dtStartRefreshWatcher(){
    clearInterval(dailyTimer);
    const openedOn = dtToday();
    dailyTimer = setInterval(function(){
      const panel = document.getElementById('daily');
      if(!panel || !panel.classList.contains('active')) return;
      const el = document.getElementById('dt-refresh-cd');
      if(el) el.textContent = dtRefreshText();
      if(dtToday() !== openedOn){
        clearInterval(dailyTimer);
        openDaily();
      }
    }, 1000);
  }

  // Sana urug'i bilan aralashtirish — har kuni boshqa 15 ta savol (alilm kabi 24 soatda yangilanadi)
  function dtSeededPick(level){
    const today = dtToday();
    const lvl = String(level || 'B2');
    let seed = 0;
    for(let i = 0; i < today.length; i++){ seed = (seed * 31 + today.charCodeAt(i)) % 2147483647; }
    for(let i = 0; i < lvl.length; i++){ seed = (seed * 31 + lvl.charCodeAt(i) + 17) % 2147483647; }
    function rnd(){ seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    const pools = {};
    DAILY_MIX.forEach(function(t){
      pools[t] = DAILY_BANK.filter(function(q){ return q.type === t; }).slice();
      for(let i = pools[t].length - 1; i > 0; i--){
        const j = Math.floor(rnd() * (i + 1));
        const tmp = pools[t][i]; pools[t][i] = pools[t][j]; pools[t][j] = tmp;
      }
    });
    const picked = [];
    let guard = 0;
    while(picked.length < DAILY_TOTAL && guard < 100){
      guard++;
      let added = false;
      for(const t of DAILY_MIX){
        if(picked.length >= DAILY_TOTAL) break;
        if(pools[t] && pools[t].length > 0){ picked.push(pools[t].shift()); added = true; }
      }
      if(!added) break;
    }
    return picked;
  }

  function dtIc(type){
    if(type === 'grammar') return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
    if(type === 'vocabulary') return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>';
    if(type === 'reading') return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';
  }

  function openDaily(){
    clearInterval(dailyTimer); clearInterval(dailyQTimer); clearInterval(dailyLoadTimer);
    showPanel('daily','Daily Tests');
    dtState = { screen:"intro", questions:[], idx:0, answers:{}, correct:0, revealed:false, result:null, timeLeft:30, level:dtGetSavedLevel() };
    const today = dtToday();
    const savedDate = localStorage.getItem('sb_daily_date');
    const savedRes = localStorage.getItem('sb_daily_result');
    if(savedDate === today && savedRes){
      try { dtState.result = JSON.parse(savedRes); } catch(e){ dtState.result = null; }
    }
    dtRenderIntro();
    dtStartRefreshWatcher();
  }

  /* 1) INTRO EKRANI */
  function dtRenderIntro(){
    dtState.screen = 'intro';
    const done = !!dtState.result;
    const savedLevel = dtState.level || dtGetSavedLevel();
    const doneNote = done
      ? "✅ Bugungi test topshirildi" + (dtState.result.level ? " (" + dtState.result.level + ")" : "") + " — " + dtState.result.totalCorrect + "/" + dtState.result.totalQuestions + " (" + dtState.result.percentage + "%). Ertaga yana 15 ta yangi savol keladi!"
      : "Har kuni 15 ta yangi savol. Savollar Gemini AI tomonidan darajangizga moslab yaratiladi.";
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const targetSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>';
    const starSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    const levelSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16"/><path d="M8 15l3-4 3 2 4-6"/></svg>';
    document.getElementById('daily-content').innerHTML = alRenderIntro({
      colorClass: 'al-orange',
      heroSvg: heroSvg,
      title: 'Daily Tests',
      sub: 'Har kuni 15 ta yangi savol — darajangizga moslab Gemini AI yaratadi',
      chips: [
        { svg: clockSvg, text: '~5 daqiqa' },
        { svg: targetSvg, text: '15 ta savol' },
        { svg: levelSvg, text: 'Daraja: ' + (savedLevel || 'tanlanadi') },
        { svg: starSvg, text: '+2 ball' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: 'Testni boshlashdan oldin <b>darajangizni tanlang</b> — A2, B1, B2 yoki C1' },
        { txt: 'Savollarni <b>Gemini AI</b> tanlagan darajangizga moslab yaratadi' },
        { txt: 'Har bir savolga <b>30 soniya</b> vaqt beriladi — tez o\'ylang' },
        { txt: '4 ta bo\'lim: <b>Grammatika</b>, <b>Lug\'at</b>, <b>O\'qish</b>, <b>Gap to\'ldirish</b>' },
        { txt: 'Natijangiz <b>Natijalar</b> bo\'limida saqlanadi va o\'rtacha Bandga ta\'sir qiladi' }
      ],
      note: doneNote + '<br><span id="dt-refresh-cd" style="font-size:12px;font-weight:800;">' + dtRefreshText() + '</span>',
      btnText: done ? 'Qayta urinish' : 'Boshlash',
      btnAction: 'startDaily()',
      motivate: 'Har kuni mashq — har kuni rivojlanish! Ertaga yana 15 ta yangi savol'
    });
  }

  /* 2a) DARAJA TANLASH EKRANI */
  function dtRenderLevel(){
    clearInterval(dailyTimer); clearInterval(dailyQTimer); clearInterval(dailyLoadTimer);
    dtState.screen = 'level';
    const saved = dtGetSavedLevel();
    const targetSvg = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#fff"/></svg>';
    const cards = DAILY_LEVELS.map(function(l){
      const active = saved === l.id ? ' dtl-card-active' : '';
      return '<button class="dtl-card' + active + '" onclick="dtChooseLevel(\'' + l.id + '\')">'
        + '<span class="dtl-badge dtl-' + l.id.toLowerCase() + '">' + l.id + '</span>'
        + '<span class="dtl-body"><b>' + l.name + '</b><small>' + l.desc + '</small></span>'
        + '<span class="dtl-go">→</span>'
        + '</button>';
    }).join('');
    document.getElementById('daily-content').innerHTML = `
      <div class="dtx-wrap">
        <div class="dtl-hero">${targetSvg}</div>
        <h2 class="dtx-title">Darajangizni tanlang</h2>
        <p class="dtl-sub">Savollar Gemini AI tomonidan tanlagan darajangizga moslab yaratiladi.</p>
        <div class="dtl-list">${cards}</div>
        <div class="dtl-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>
          <span>Darajangizni bilmasangiz, <b>B1</b> yoki <b>B2</b> dan boshlang. Keyinroq o'zgartirishingiz mumkin.</span>
        </div>
        <button class="dtl-back" onclick="switchTab('home')">← Bosh sahifaga qaytish</button>
      </div>`;
  }

  function dtChooseLevel(level){
    const ok = DAILY_LEVELS.some(function(l){ return l.id === level; });
    if(!ok) level = 'B2';
    dtState.level = level;
    try { localStorage.setItem(DAILY_LEVEL_KEY, level); } catch(e){}
    dtStartWithLevel(level);
  }

  function startDaily(){
    dtRenderLevel();
  }

  /* 2b) LOADING EKRANI (aylana progress) */
  function dtStartWithLevel(level){
    clearInterval(dailyLoadTimer);
    const lvl = level || 'B2';
    dtState.level = lvl;
    dtState.screen = 'loading';
    // Tanlangan daraja uchun testni AI bir marta yaratadi va kun davomida localStorage'da saqlanadi.
    dtState.loadToken = (dtState.loadToken || 0) + 1;
    const cached = dtGetAiQuestions(lvl);
    dtState.aiPromise = cached
      ? Promise.resolve(cached)
      : aiGenerate('daily', lvl, 60000)
          .then(function(data){
            const qs = dtNormalizeAiQuestions(data);
            if(qs) dtSaveAiQuestions(qs, lvl);
            return qs;
          })
          .catch(function(e){
            console.warn('Daily AI savollari olinmadi, lokal bank ishlatiladi', e);
            return null;
          });
    const ring = (2 * Math.PI * 54).toFixed(2);
    document.getElementById('daily-content').innerHTML = `
      <div class="dtx-wrap">
        <div class="dtx-ring-wrap">
          <svg width="144" height="144" viewBox="0 0 120 120" style="transform:rotate(-90deg);">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--field)" stroke-width="8"/>
            <circle id="dtx-ring" cx="60" cy="60" r="54" fill="none" stroke="url(#dtxGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${ring}" stroke-dashoffset="${ring}" style="transition:stroke-dashoffset .3s ease-out;"/>
            <defs><linearGradient id="dtxGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#ef4444"/></linearGradient></defs>
          </svg>
          <div class="dtx-ring-pct" id="dtx-pct">0%</div>
        </div>
        <h2 style="font-family:'Fraunces',serif;font-size:19px;font-weight:600;text-align:center;margin-bottom:8px;">Savollar tayyorlanmoqda...</h2>
        <p style="font-size:13.5px;color:var(--ink-soft);text-align:center;line-height:1.6;"><b>${lvl}</b> darajangiz uchun savollar Gemini AI tomonidan yaratilmoqda. Iltimos kuting...</p>
        <div class="dtx-load-bar"><div class="dtx-load-fill" id="dtx-lfill" style="width:0%;"></div></div>
        <p style="text-align:center;font-size:12px;color:var(--ink-soft);margin-top:10px;" id="dtx-ltxt">Yuklanmoqda 0%</p>
      </div>`;
    let pct = 0;
    dailyLoadTimer = setInterval(function(){
      pct += Math.floor(Math.random() * 6) + 3;
      if(pct >= 92){
        pct = 92;
        clearInterval(dailyLoadTimer); dailyLoadTimer = null;
        dtUpdateLoad(pct);
        const loadTxt = document.getElementById('dtx-ltxt');
        if(loadTxt) loadTxt.textContent = 'AI ' + lvl + ' darajada 15 ta yangi savol yaratmoqda...';
        dtBeginTesting();
        return;
      }
      dtUpdateLoad(pct);
    }, 110);
  }

  function dtUpdateLoad(p){
    const ringEl = document.getElementById('dtx-ring');
    const off = (2 * Math.PI * 54).toFixed(2);
    if(ringEl) ringEl.style.strokeDashoffset = (off * (1 - p/100)).toFixed(2);
    const pctEl = document.getElementById('dtx-pct');
    if(pctEl) pctEl.textContent = p + '%';
    const fill = document.getElementById('dtx-lfill');
    if(fill) fill.style.width = p + '%';
    const txt = document.getElementById('dtx-ltxt');
    if(txt) txt.textContent = 'Yuklanmoqda ' + p + '%';
  }

  /* 3) TESTING EKRANI (har savolga 30 soniya) */
  async function dtBeginTesting(){
    const state = dtState;
    const token = state.loadToken;
    let qs = dtGetAiQuestions(state.level);
    if(!qs && state.aiPromise){
      try { qs = await state.aiPromise; } catch(e){ qs = null; }
    }
    if(dtState !== state || state.loadToken !== token || state.screen !== 'loading') return;
    state.questions = (qs && qs.length === DAILY_TOTAL) ? qs : dtSeededPick(state.level);
    state.idx = 0; state.answers = {}; state.correct = 0; state.revealed = false;
    dtUpdateLoad(100);
    await new Promise(function(resolve){ setTimeout(resolve, 350); });
    if(dtState !== state || state.loadToken !== token || state.screen !== 'loading') return;
    state.screen = 'testing';
    showPanel('daily','Daily Test');
    dtRenderQ();
  }

  function dtRenderQ(){
    clearInterval(dailyQTimer);
    const q = dtState.questions[dtState.idx];
    const total = dtState.questions.length;
    dtState.revealed = false;
    dtState.timeLeft = 30;
    document.getElementById('daily-content').innerHTML = `
      <div class="dtx-wrap">
        <div class="dtx-progrow">
          <div class="dtx-prog"><div class="dtx-prog-fill" style="width:${Math.round((dtState.idx+1)/total*100)}%;"></div></div>
          <span class="dtx-count">${dtState.idx+1} / ${total}</span>
        </div>
        <div class="dtx-timer-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" stroke-width="2.2" stroke-linecap="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          <span class="dtx-timer-sec" id="dtx-sec">30s</span>
          <div class="dtx-timer-bar"><div class="dtx-timer-fill" id="dtx-tfill" style="width:100%;"></div></div>
          <span class="dtx-chip ${q.type}">${DAILY_TYPES[q.type]}</span>
        </div>
        ${q.passage ? `<div class="dtx-passage">${q.passage}</div>` : ''}
        <div class="dtx-q">${q.q}</div>
        ${q.opts.map((o,i)=>`
          <button class="dtx-opt" id="dtx-opt-${i}" onclick="dtPick(${i})">
            <span class="letter">${String.fromCharCode(65+i)}</span>
            <span>${o}</span>
          </button>`).join('')}
        <div class="dtx-fb" id="dtx-fb"></div>
      </div>`;
    dailyQTimer = setInterval(dtTick, 1000);
  }

  function dtTick(){
    dtState.timeLeft--;
    const sec = document.getElementById('dtx-sec');
    const fill = document.getElementById('dtx-tfill');
    if(!sec || !fill || dtState.screen !== 'testing'){ clearInterval(dailyQTimer); return; }
    const t = Math.max(dtState.timeLeft, 0);
    sec.textContent = t + 's';
    fill.style.width = (t/30*100) + '%';
    fill.classList.toggle('warn', t <= 10 && t > 5);
    fill.classList.toggle('danger', t <= 5);
    sec.classList.toggle('danger', t <= 5);
    if(t <= 0 && !dtState.revealed) dtReveal(null, true);
  }

  function dtPick(i){
    if(dtState.revealed || dtState.screen !== 'testing') return;
    dtReveal(i, false);
  }

  function dtReveal(i, timeout){
    if(dtState.revealed) return;
    dtState.revealed = true;
    clearInterval(dailyQTimer);
    const q = dtState.questions[dtState.idx];
    dtState.answers[dtState.idx] = i;
    const ok = (i === q.ans);
    if(ok) dtState.correct++;
    q.opts.forEach(function(_, k){
      const el = document.getElementById('dtx-opt-' + k);
      if(!el) return;
      el.classList.add('dim');
      if(k === q.ans) el.classList.add('correct');
      else if(k === i) el.classList.add('wrong');
    });
    const ansLetter = document.querySelector('#dtx-opt-' + q.ans + ' .letter');
    if(ansLetter) ansLetter.textContent = '✓';
    if(i !== null && i !== undefined && !ok){
      const selLetter = document.querySelector('#dtx-opt-' + i + ' .letter');
      if(selLetter) selLetter.textContent = '✗';
    }
    const fb = document.getElementById('dtx-fb');
    if(fb){
      if(timeout){ fb.className = 'dtx-fb timeout'; fb.textContent = '⏰ Vaqt tugadi!'; }
      else if(ok){ fb.className = 'dtx-fb ok'; fb.textContent = '✓ To\'g\'ri!'; }
      else { fb.className = 'dtx-fb no'; fb.textContent = '✗ Noto\'g\'ri'; }
    }
    setTimeout(dtNext, timeout ? 1400 : 1000);
  }

  function dtNext(){
    if(dtState.screen !== 'testing') return;
    dtState.idx++;
    if(dtState.idx >= dtState.questions.length){ dtFinish(); return; }
    dtRenderQ();
  }

  /* 4) NATIJA EKRANI */
  function dtFinish(){
    clearInterval(dailyQTimer);
    const total = dtState.questions.length;
    const byType = {};
    const details = [];
    dtState.questions.forEach(function(q, k){
      const ua = dtState.answers[k];
      const ok = (ua === q.ans);
      if(!byType[q.type]) byType[q.type] = { correct:0, total:0 };
      byType[q.type].total++;
      if(ok) byType[q.type].correct++;
      details.push({ type:q.type, q:q.q, passage:(q.passage || ''), opts:q.opts, ans:q.ans, user:ua, ok:ok });
    });
    const pct = Math.round(dtState.correct / total * 100);
    const result = { percentage:pct, totalCorrect:dtState.correct, totalQuestions:total, byType:byType, details:details, level:(dtState.level || null) };
    dtState.result = result;
    const today = dtToday();
    try {
      localStorage.setItem('sb_daily_date', today);
      localStorage.setItem('sb_daily_result', JSON.stringify(result));
      let hist = [];
      try { hist = JSON.parse(localStorage.getItem('sb_daily_history') || '[]'); } catch(e){ hist = []; }
      hist.push({ percentage:pct, date:today });
      if(hist.length > 50) hist = hist.slice(-50);
      localStorage.setItem('sb_daily_history', JSON.stringify(hist));
    } catch(e){}
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
    testProgress.daily = {
      completed: true,
      band: band,
      pct: pct,
      score: dtState.correct + '/' + total + " to'g'ri",
      date: today
    };
    if(typeof saveUserProgress === 'function') saveUserProgress();
    if(typeof updateResultsDisplay === 'function') updateResultsDisplay();
    dtRenderResult(result, false);
  }

  function dtRenderResult(r, fromHistory){
    dtState.screen = 'result';
    const p = r.percentage;
    const emoji = p >= 80 ? '🏆' : p >= 60 ? '🌟' : p >= 40 ? '👍' : '💪';
    const cls = p >= 70 ? 'good' : p >= 50 ? 'mid' : 'bad';
    const typeRows = Object.keys(r.byType).map(function(t){
      const d = r.byType[t];
      const tp = Math.round(d.correct / d.total * 100);
      const barCls = tp >= 70 ? '#22c55e' : tp >= 40 ? '#eab308' : '#ef4444';
      return `<div class="dtx-type-row">
        <div class="dtx-type-head">
          <span class="dtx-chip ${t}">${DAILY_TYPES[t]}</span>
          <span class="dtx-type-num">${d.correct}/${d.total}</span>
        </div>
        <div class="dtx-type-bar"><div class="dtx-type-fill" style="width:${tp}%;background:${barCls};"></div></div>
      </div>`;
    }).join('');
    const reviewRows = r.details.map(function(d, k){
      const uaTxt = (d.user === null || d.user === undefined) ? '—' : (String.fromCharCode(65 + d.user) + '. ' + d.opts[d.user]);
      return `<div class="dtx-rev-item">
        <div class="dtx-rev-top">
          <div class="dtx-rev-ic ${d.ok ? 'ok' : 'no'}">${d.ok ? '✓' : '✗'}</div>
          <div class="dtx-rev-q">
            <div>${d.q}</div>
            ${d.ok ? '' : `<div class="dtx-rev-ans">Sizning javobingiz: ${uaTxt} → To'g'ri javob: ${String.fromCharCode(65 + d.ans)}. ${d.opts[d.ans]}</div>`}
          </div>
          <span class="dtx-chip ${d.type}">${DAILY_TYPES[d.type]}</span>
        </div>
        ${dtRevDetail(d, k)}
      </div>`;
    }).join('');
    document.getElementById('daily-content').innerHTML = `
      <div class="dtx-wrap">
        <div class="dtx-res-card">
          <div class="dtx-res-emoji">${emoji}</div>
          <div class="dtx-res-pct ${cls}">${p}%</div>
          <div class="dtx-res-sub">${r.totalCorrect}/${r.totalQuestions} to'g'ri javob${r.level ? ' · Daraja: ' + r.level : ''}</div>
        </div>
        <div class="dtx-panel">
          <div class="dtx-panel-h"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.2" stroke-linecap="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> Bo'limlar bo'yicha</div>
          ${typeRows}
        </div>
        <div class="dtx-panel">
          <div class="dtx-panel-h"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg> Javoblarni ko'rish</div>
          ${reviewRows}
        </div>
        <div class="dtx-comeback">${fromHistory ? '✅ Bugungi test topshirildi. ' : ''}Ertaga yana 15 ta yangi savol keladi! 🎯</div>
        <button class="dtx-btn" onclick="switchTab('home')">Bosh sahifa</button>
        ${fromHistory ? `<button class="dtx-btn-outline" style="margin-top:12px;" onclick="startDaily()">Qayta urinish</button>` : ''}
      </div>`;
  }

  function dtRevDetail(d, k){
    const rows = d.opts.map(function(o, i){
      const isAns = (i === d.ans);
      const isUser = (!d.ok && i === d.user);
      let cls = '';
      let mark = '';
      if(isAns){ cls = 'hit'; mark = ' ✓'; }
      else if(isUser){ cls = 'miss'; mark = ' ✗'; }
      return `<div class="dtx-rev-opt ${cls}"><b>${String.fromCharCode(65 + i)}.</b><span>${o}${mark}</span></div>`;
    }).join('');
    return `<button class="dtx-rev-toggle" onclick="dtToggleDetail(${k})" id="dtx-tg-${k}">▾ Batafsil</button>
      <div class="dtx-rev-detail" id="dtx-det-${k}" style="display:none;">
        ${d.passage ? `<div class="dtx-rev-passage">"${d.passage}"</div>` : ''}
        ${rows}
      </div>`;
  }

  function dtToggleDetail(k){
    const det = document.getElementById('dtx-det-' + k);
    const tg = document.getElementById('dtx-tg-' + k);
    if(!det) return;
    const open = (det.style.display !== 'none');
    det.style.display = open ? 'none' : 'block';
    if(tg) tg.innerHTML = open ? '▾ Batafsil' : '▴ Yopish';
  }

  /* Orqaga — test davomida tasdiq so'raladi (alilm kabi) */
  function dailyBack(){
    if(dtState.screen === 'testing' && !dtState.revealed){
      if(!confirm("Imtihon tugallanmagan! Agar chiqsangiz, shu javoblaringiz o'chadi va shu joydan davom eta olmaysiz. Chiqishni tasdiqlaysizmi?")) return;
    }
    dtState.screen = 'exited';
    clearInterval(dailyTimer); clearInterval(dailyQTimer); clearInterval(dailyLoadTimer);
    switchTab('home');
  }

