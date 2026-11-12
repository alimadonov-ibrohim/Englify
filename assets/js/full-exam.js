// Englify — full-exam
  // --- FULL EXAM SIMULATION (alilm.uz uslubi) ---
  // Haqiqiy imtihon xonasi: 4 bo'lim ketma-ket, umumiy 40 daqiqa taymer,
  // orqaga qaytish yo'q, yakunda Band 4.0–9.0 natija va to'liq tahlil.
  // ==========================================
  let fexTimer = null;
  let fexState = null;

  const FEX_TOTAL_TIME = 40 * 60;

  const FEX_SECTIONS = [
    { id:"listening", icon:"🎧", name:"Listening", en:"Eshitib tushunish", time:"10 daqiqa", desc:"Audio 2 marta eshitiladi. 10 ta savolga javob bering — keyingi bo'limga o'tgach javoblarni o'zgartirib bo'lmaydi." },
    { id:"reading",   icon:"📖", name:"Reading",   en:"O'qib tushunish",  time:"12 daqiqa", desc:"Matnni diqqat bilan o'qing va 10 ta savolga javob bering." },
    { id:"uoe",       icon:"🧩", name:"Use of English", en:"Grammatika va lug'at", time:"8 daqiqa", desc:"Grammatika, so'z boyligi va iboralar — 10 ta savol." },
    { id:"writing",   icon:"✍️", name:"Writing",   en:"Insho — Task 2",   time:"10 daqiqa", desc:"Kamida 250 so'zlik insho yozing. Mavzu oynada tayyor turadi." }
  ];

  const FEX_DATA = {
    listening: {
      script: "Good morning, everyone, and welcome to the GreenCity bike-sharing programme. Before you rent your first bicycle, let me explain how the system works. First, you need to download the GreenCity app and register with your phone number. The registration fee is five dollars, and the first thirty minutes of every ride are completely free. After that, we charge one dollar for each additional fifteen minutes. You can find our bikes at more than sixty stations across the city, and the app shows you the nearest station with available bikes. Please remember: return the bike to any station and make sure the wheel locks correctly, otherwise the ride will continue and you will be charged. Finally, helmets are not provided, so we strongly recommend bringing your own. If you have any questions, our support team is available twenty-four hours a day. Enjoy the ride!",
      qs: [
        { q:"What must users do first to use the bikes?", o:["Pay in cash at a station","Download the app and register","Buy a monthly ticket","Visit the main office"], a:1 },
        { q:"How much is the registration fee?", o:["It is free","Three dollars","Ten dollars","Five dollars"], a:3 },
        { q:"How long is the free period of every ride?", o:["15 minutes","20 minutes","30 minutes","60 minutes"], a:2 },
        { q:"After the free period, riders pay one dollar for every ___ minutes.", o:["10","15","20","30"], a:1 },
        { q:"How many bike stations are there across the city?", o:["More than sixty","Only six","Sixteen","Sixty-six"], a:0 },
        { q:"What does the app show users?", o:["The weather forecast","Traffic accidents","The nearest station with bikes","Bus schedules"], a:2 },
        { q:"What happens if the wheel does not lock correctly?", o:["The bike breaks down","You get a warning","Nothing happens","The ride continues and you are charged"], a:3 },
        { q:"Helmets are...", o:["free at every station","not provided","sold in the app","required by law"], a:1 },
        { q:"When is the support team available?", o:["In the mornings only","On weekdays","Twenty-four hours a day","Only through email"], a:2 },
        { q:"What is the speaker's final recommendation?", o:["Ride slowly in the city","Buy two bicycles","Register again next month","Bring your own helmet"], a:3 }
      ]
    },
    reading: {
      passage: "Instant noodles are one of the most popular convenience foods in the world. They were invented in 1958 by Momofuku Ando, a Japanese businessman who wanted to find a quick and cheap solution to the food shortages in Japan after the Second World War. Ando experimented for almost a year in a small shed in his garden before he discovered the right method: flash-frying the noodles removes the water and allows them to be stored for months.\n\nThe first product, Chicken Ramen, was expensive — it cost six times more than fresh udon noodles. However, as production grew, prices fell quickly, and by the 1970s instant noodles had become a daily food for millions of families. In 1971 Ando introduced Cup Noodles, a plastic container that allowed people to cook and eat the noodles anywhere, without a bowl. This invention changed the market completely, and today more than one hundred billion servings are eaten every year.\n\nInterestingly, instant noodles have even travelled to space. In 2005, Ando — then ninety-five years old — developed a special version for Japanese astronauts, with smaller noodles and thicker soup so that it would not spill in zero gravity. Ando died in 2007 at the age of ninety-six, but his invention remains one of the most important food innovations of the twentieth century.",
      qs: [
        { q:"When were instant noodles invented?", o:["In 1945","In 1951","In 1971","In 1958"], a:3 },
        { q:"Why did Ando start his experiments?", o:["Because of food shortages after the war","Because he wanted to become rich","Because he loved cooking","Because his company ordered it"], a:0 },
        { q:"Where did Ando do his experiments?", o:["In a large factory","In a university laboratory","In a small shed in his garden","In a famous restaurant"], a:2 },
        { q:"What does flash-frying do to the noodles?", o:["It adds water to them","It removes water so they can be stored for months","It makes them softer","It cools them quickly"], a:1 },
        { q:"The first Chicken Ramen cost ___ fresh udon noodles.", o:["less than","the same as","twice as much as","six times more than"], a:3 },
        { q:"What changed the market completely in 1971?", o:["Cup Noodles — people could eat anywhere","Lower production prices","Television advertising","A new chicken flavour"], a:0 },
        { q:"How many servings are eaten every year today?", o:["One hundred million","One billion","Ten billion","More than one hundred billion"], a:3 },
        { q:"Why was the space version special?", o:["It was much cheaper","It had smaller noodles and thicker soup","It was completely dry","It had no flavour"], a:1 },
        { q:"How old was Ando when he developed the space noodles?", o:["Ninety-five","Fifty-eight","Seventy-one","Ninety-six"], a:0 },
        { q:"In the last paragraph, invention is closest in meaning to...", o:["mistake","a new device or creation","old tradition","accident"], a:1 }
      ]
    },
    uoe: {
      qs: [
        { q:"By the time we arrived, the film ___.", o:["already started","had already started","has already started","was already starting"], a:1 },
        { q:"If I ___ more time, I would learn another language.", o:["have","had","will have","would have"], a:1 },
        { q:"She is very good ___ solving difficult problems.", o:["in","on","at","for"], a:2 },
        { q:"I am looking forward ___ from you soon.", o:["to hearing","hearing","to hear","for hearing"], a:0 },
        { q:"This is the museum ___ my father worked for twenty years.", o:["that","which","where","when"], a:2 },
        { q:"The exam was ___ difficult than we expected.", o:["much","more","most","very"], a:1 },
        { q:"You ___ be tired after such a long flight.", o:["can","must","should","may"], a:1 },
        { q:"___ of the students passed the test — only five out of thirty.", o:["A few","Few","Little","Much"], a:1 },
        { q:"We decided to ___ the meeting until next Monday.", o:["put off","put on","put up","put out"], a:0 },
        { q:"The company ___ new employees every spring.", o:["takes up","takes on","takes after","takes in"], a:1 }
      ]
    },
    prompts: [
      "Some people believe that students should study online, while others think traditional classrooms are more effective. Discuss both views and give your own opinion.",
      "Many cities around the world are becoming more crowded. What problems does overpopulation in cities cause, and how can governments solve them?"
    ]
  };

  /* Full Exam paper rotation — har kirishda yangi Listening/Reading/UOE/Writing.
     Listening va Reading banklari oddiy bo'limlar bilan bir xil manbadan olinadi. */
  const FEX_LISTEN_BANK = [
    { title: 'Section 1 — City bike-sharing announcement', script: FEX_DATA.listening.script, qs: FEX_DATA.listening.qs }
  ].concat(LISTEN_BANK.map(function(set){
    return {
      title: 'Listening — ' + (set.title || 'Section 1'),
      script: set.script,
      qs: set.qs.map(function(x){ return { q: x.q, o: x.opts, a: x.ans }; })
    };
  }));

  const FEX_READING_BANK = [
    { title: 'The Story of Instant Noodles', passage: FEX_DATA.reading.passage, qs: FEX_DATA.reading.qs }
  ].concat(READING_BANK.map(function(set){
    const first = (set.passage || '').split('\n')[0].trim();
    return {
      title: first || 'Reading Passage',
      passage: set.passage,
      qs: set.qs.map(function(x){ return { q: x.q, o: x.opts, a: x.ans }; })
    };
  }));

  const FEX_UOE_BANK = FEX_DATA.uoe.qs.concat([
    { q:"She has been working here ___ 2019.", o:["for","since","from","during"], a:1 },
    { q:"I wish I ___ more carefully yesterday.", o:["studied","had studied","study","would study"], a:1 },
    { q:"The book ___ by millions of people around the world.", o:["has read","has been read","have been read","is reading"], a:1 },
    { q:"Neither of the answers ___ correct.", o:["are","were","is","be"], a:2 },
    { q:"He asked me where I ___ from.", o:["come","came","had come","coming"], a:1 },
    { q:"Despite ___ hard, she did not pass the exam.", o:["work","working","worked","to work"], a:1 },
    { q:"There isn't ___ milk left in the fridge.", o:["many","much","a few","few"], a:1 },
    { q:"It's the first time I ___ such a beautiful place.", o:["saw","see","have seen","had seen"], a:2 },
    { q:"If you had left earlier, you ___ the train.", o:["will not miss","would not miss","would not have missed","did not miss"], a:2 },
    { q:"The teacher made us ___ the text again.", o:["to read","reading","read","readed"], a:2 },
    { q:"I'd rather ___ at home tonight.", o:["staying","to stay","stay","stayed"], a:2 },
    { q:"By next year, they ___ the project.", o:["will finish","will have finished","have finished","finished"], a:1 }
  ]);

  const FEX_PROMPTS = FEX_DATA.prompts.concat([
    "Some people think that sport is essential for young people, while others believe academic subjects are more important. Discuss both views and give your own opinion.",
    "Many people believe that governments should provide free internet access to everyone. To what extent do you agree or disagree?",
    "Some people argue that advertising encourages people to buy things they do not need. Do the disadvantages of advertising outweigh its advantages?"
  ]);

  function fexBuildPaper(){
    const L = sbPickFresh(FEX_LISTEN_BANK, 'fex_listening') || FEX_LISTEN_BANK[0];
    const R = sbPickFresh(FEX_READING_BANK, 'fex_reading') || FEX_READING_BANK[0];
    FEX_DATA.listening = {
      title: L.title,
      script: L.script,
      qs: L.qs.map(function(x){ return { q: x.q, o: x.o || x.opts, a: (x.a !== undefined ? x.a : x.ans) }; })
    };
    const firstLine = (R.passage || '').split('\n')[0].trim();
    const passageBody = (R.title && firstLine === R.title)
      ? R.passage.split('\n').slice(1).join('\n')
      : R.passage;
    FEX_DATA.reading = {
      title: R.title,
      passage: passageBody,
      qs: R.qs.map(function(x){ return { q: x.q, o: x.o || x.opts, a: (x.a !== undefined ? x.a : x.ans) }; })
    };
    FEX_DATA.uoe = { qs: sbPickMany(FEX_UOE_BANK, 10) };
    FEX_DATA.prompts = sbPickMany(FEX_PROMPTS, 4);
  }

  function fexBand(pct){
    const th = [92,85,78,71,64,57,50,43,36,29];
    const bd = [9.0,8.5,8.0,7.5,7.0,6.5,6.0,5.5,5.0,4.5];
    for(let i=0;i<th.length;i++){ if(pct >= th[i]) return bd[i]; }
    return 4.0;
  }

  function fexGradeLabel(b){
    if(b >= 8.5) return "Expert — C2 daraja";
    if(b >= 7.5) return "Very Good — C1 daraja";
    if(b >= 6.5) return "Good — B2 daraja";
    if(b >= 5.5) return "Competent — B1 daraja";
    if(b >= 4.5) return "Modest — A2 daraja";
    return "Limited — A1 daraja";
  }

  function openFullExam(){
    fexCleanup();
    // Har kirishda butunlay yangi imtihon varianti
    fexBuildPaper();
    fexState = {
      screen:"intro", sec:0, started:false, finished:false, plays:0,
      prompt: Math.floor(Math.random() * FEX_DATA.prompts.length),
      left: FEX_TOTAL_TIME, writing: "",
      answers: [Array(10).fill(null), Array(10).fill(null), Array(10).fill(null)],
      aiReady: false
    };
    const examRef = fexState;
    // Har kirishda AI butun imtihon variantini yaratadi. Tayyor bo'lmaguncha
    // "Imtihonni boshlash" tugmasi kutish ekranini ko'rsatadi.
    fexState.aiPromise = aiGenerate('full-exam', 'B2', 120000)
      .then(function(d){
        if(fexState !== examRef) return false;
        if(!d || !d.listening || !d.reading || !d.uoe ||
           !String(d.listening.script || '').trim() ||
           !String(d.reading.passage || '').trim() ||
           !aiValidFexQuestions(d.listening.qs, 10) ||
           !aiValidFexQuestions(d.reading.qs, 10) ||
           !aiValidFexQuestions(d.uoe.qs, 10) ||
           !Array.isArray(d.prompts) || d.prompts.length < 4){
          return false;
        }
        function safeQ(q){
          return { q:String(q.q), o:q.o.slice(0,4).map(function(x){ return String(x); }), a:q.a, hint:String(q.hint || '') };
        }
        FEX_DATA.listening = {
          title: String(d.listening.title || 'AI Listening').slice(0, 140),
          script: String(d.listening.script).slice(0, 9000),
          qs: d.listening.qs.slice(0, 10).map(safeQ)
        };
        FEX_DATA.reading = {
          title: String(d.reading.title || 'AI Reading').slice(0, 140),
          passage: String(d.reading.passage).slice(0, 14000),
          qs: d.reading.qs.slice(0, 10).map(safeQ)
        };
        FEX_DATA.uoe = { qs: d.uoe.qs.slice(0, 10).map(safeQ) };
        FEX_DATA.prompts = d.prompts.slice(0, 4).map(function(x){ return String(x); });
        fexState.prompt = Math.floor(Math.random() * FEX_DATA.prompts.length);
        fexState.aiReady = true;
        return true;
      })
      .catch(function(e){
        console.warn('Full Exam AI varianti olinmadi, lokal bank ishlatiladi', e);
        return false;
      });
    showPanel("fullexam", "Full Exam Simulation");
    fexRenderIntro();
  }

  function fexCleanup(){
    if(fexTimer){ clearInterval(fexTimer); fexTimer = null; }
    try{ sbTtsStop(); }catch(e){}
  }

  function fexBack(){
    if(fexState && !fexState.finished && (fexState.screen === "section" || fexState.screen === "brief")){
      if(!confirm("Imtihon tugallanmagan! Chiqsangiz, natija saqlanmaydi. Chiqishni tasdiqlaysizmi?")) return;
    }
    fexCleanup();
    switchTab("home");
  }

  function fexClock(){
    const l = Math.max(0, fexState.left);
    const m = Math.floor(l/60).toString().padStart(2,"0");
    const s = (l%60).toString().padStart(2,"0");
    return m + ":" + s;
  }

  function fexRenderIntro(){
    fexState.screen = "intro";
    const prev = (testProgress.fullexam && testProgress.fullexam.completed) ? testProgress.fullexam : null;
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const qSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
    const bandSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    document.getElementById("fex-content").innerHTML = alRenderIntro({
      colorClass: 'al-blue',
      heroSvg: heroSvg,
      title: 'Full Exam Simulation',
      sub: 'Haqiqiy imtihon xonasi — 4 bo\'lim ketma-ket, 40 daqiqa, taymerni to\'xtatib bo\'lmaydi',
      chips: [
        { svg: clockSvg, text: '40 daqiqa' },
        { svg: qSvg, text: '30+1 savol' },
        { svg: bandSvg, text: 'Band 4.0–9.0' }
      ],
      howtoHead: 'IMTIHON QOIDALARI',
      steps: [
        { txt: '4 bo\'lim ketma-ket: <b>Listening → Reading → Use of English → Writing</b>' },
        { txt: 'Taymer <b>to\'xtamaydi</b> — vaqt tugasa imtihon avtomatik yakunlanadi' },
        { txt: 'Oldingi bo\'limga <b>qaytish mumkin emas</b> — haqiqiy imtihondagidek' },
        { txt: 'Listening audio <b>faqat 2 marta</b> eshitiladi · Writing <b>250+ so\'z</b>' }
      ],
      note: prev ? ('Oldingi natijangiz: Band ' + Number(prev.band).toFixed(1) + ' · ' + prev.score + ' · ' + prev.date) : 'Yakunda to\'liq tahlil: har bir savol, Band natijasi, Writing bahosi',
      btnText: 'Imtihonni boshlash',
      btnAction: 'fexStartExam()',
      motivate: 'Rasmiy imtihonga to\'liq tayyorgarlik — omad!'
    });
  }

  async function fexStartExam(){
    if(!fexState) return;
    if(!fexState.aiReady && fexState.aiPromise){
      fexState.screen = "loading";
      document.getElementById("fex-content").innerHTML = `
        <div class="fex-brief">
          <div class="fb-eyebrow">AI IMTIHON VARIANTI</div>
          <div class="wri-spin" style="margin:0 auto 16px;"></div>
          <h2>Yangi imtihon yaratilmoqda...</h2>
          <p class="fb-desc">Gemini 10 ta Listening, 10 ta Reading, 10 ta Use of English savoli va 4 ta Writing mavzusini tayyorlamoqda. Bu odatda 10–30 soniya oladi.</p>
        </div>`;
      await fexState.aiPromise;
      if(!fexState || fexState.screen !== "loading") return;
    }
    fexState.screen = "brief";
    fexState.prompt = Math.floor(Math.random() * FEX_DATA.prompts.length);
    fexRenderBrief(0);
  }

  function fexRenderBrief(i){
    fexState.screen = "brief";
    const s = FEX_SECTIONS[i];
    document.getElementById("fex-content").innerHTML = `
      <div class="fex-brief">
        <div class="fb-eyebrow">BO'LIM ${i+1} / 4</div>
        <div class="fb-ic">${s.icon}</div>
        <h2>${s.name}</h2>
        <div class="fb-en">${s.en}</div>
        <p class="fb-desc">${s.desc}</p>
        <div class="fex-btime">⏱ Tavsiya etilgan vaqt: ${s.time}</div>
        <div><button class="fex-next" style="min-width:230px;" onclick="fexBeginSection(${i})">${i === 0 ? "Imtihonni boshlash va taymerni ishga tushirish" : "Bo'limni boshlash →"}</button></div>
        ${i > 0 ? `<div class="fex-prev" style="margin-top:14px;">Oldingi bo'lim javoblaringiz saqlab qolindi ✓</div>` : ""}
      </div>
    `;
  }

  function fexBeginSection(i){
    fexState.sec = i;
    fexState.screen = "section";
    if(i === 0 && !fexState.started){
      fexState.started = true;
      fexTimer = setInterval(fexTick, 1000);
    }
    fexRenderSection();
  }

  function fexTick(){
    if(!fexState || fexState.finished) return;
    fexState.left--;
    const c = document.getElementById("fex-clock");
    if(c){
      c.textContent = fexClock();
      if(fexState.left <= 300) c.classList.add("low");
    }
    if(fexState.left <= 0) fexFinish(true);
  }

  function fexQsHtml(secId){
    return `<div class="fex-qs">` + FEX_DATA[secId].qs.map((item, qi) => `
      <div class="fex-q" id="fex-q-${qi}">
        <div class="fex-q-n" id="fex-n-${qi}">${qi+1}</div>
        <div class="fex-q-body">
          <div class="fex-q-t">${item.q}</div>
          <div class="fex-opts">
            ${item.o.map((opt, oi) => `<div class="fex-opt" onclick="fexSelect(${qi},${oi})"><span class="fex-opt-l">${"ABCD"[oi]}</span><span>${opt}</span></div>`).join("")}
          </div>
        </div>
      </div>`).join("") + `</div>`;
  }

  function fexRenderSection(){
    const i = fexState.sec;
    const s = FEX_SECTIONS[i];
    let mid = "";
    if(s.id === "listening"){
      mid = `
        <div class="fex-audio">
          <button class="fa-btn" id="fex-play" onclick="fexPlayAudio()">▶</button>
          <div class="fa-t"><b>${FEX_DATA.listening.title || 'Section 1 — Listening'}</b>
          <span>Eshitishlar qoldi: <span id="fex-plays-left">2 marta</span> · Audio faqat 2 marta ishlaydi</span></div>
        </div>`;
    } else if(s.id === "reading"){
      mid = `
        <div class="fex-passage"><h4>Reading Passage — ${FEX_DATA.reading.title || 'Reading'}</h4>${FEX_DATA.reading.passage.replace(/\n\n/g, "</p><p style='margin:0 0 10px;'>").replace(/^/, "<p style='margin:0 0 10px;'>") + "</p>"}</div>`;
    } else if(s.id === "writing"){
      mid = `
        <div class="fex-prompt"><b>WRITING TASK 2</b><p>${FEX_DATA.prompts[fexState.prompt]}</p></div>
        <textarea class="fex-essay" id="fex-essay" placeholder="Inshoyingizni shu yerga yozing... (kirish, asosiy qismlar va xulosa)" oninput="fexEssayInput(this)">${fexState.writing}</textarea>
        <div class="fex-wc-row">
          <div class="fex-wc-bar"><div class="fex-wc-fill" id="fex-wc-fill"></div></div>
          <div class="fex-wc-n" id="fex-wc-n">${fexState.writing.trim() ? fexState.writing.trim().split(/\s+/).length : 0} / 250 so'z</div>
        </div>`;
    }
    document.getElementById("fex-content").innerHTML = `
      <div class="fex-topbar">
        <div><div class="fex-clock" id="fex-clock">${fexClock()}</div><div class="fex-clock-sub">QOLGAN VAQT</div></div>
        <div class="fex-steps">${FEX_SECTIONS.map((x, ix) => `<div class="fex-step ${ix === i ? "on" : (ix < i ? "ok" : "")}">${x.icon}</div>`).join("")}</div>
      </div>
      <div class="fex-paper">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px;">
          <div style="font-size:15px;font-weight:800;color:var(--ink);">${s.icon} ${s.name} <span style="font-size:11.5px;color:var(--ink-soft);font-weight:700;">— ${s.en}</span></div>
          ${s.id !== "writing" ? `<div class="fex-count" id="fex-count" style="margin:0;">Javob berilgan: <b>0/10</b></div>` : `<div style="font-size:12px;font-weight:800;color:#b45309;">✍️ Kamida 250 so'z</div>`}
        </div>
        ${mid}
        ${s.id !== "writing" ? fexQsHtml(s.id) : ""}
      </div>
      <div class="fex-actions">
        <button class="fex-next" onclick="fexNextSection()">${i < 3 ? "Bo'limni yakunlash →" : "Imtihonni yakunlash ✓"}</button>
      </div>
    `;
    if(s.id === "writing") fexEssayCount();
  }

  function fexSelect(qi, oi){
    if(!fexState || fexState.screen !== "section") return;
    fexState.answers[fexState.sec][qi] = oi;
    const q = document.getElementById("fex-q-" + qi);
    if(q) q.querySelectorAll(".fex-opt").forEach((el, ix) => el.classList.toggle("sel", ix === oi));
    const n = document.getElementById("fex-n-" + qi);
    if(n) n.classList.add("done");
    fexUpdateCount();
  }

  function fexUpdateCount(){
    const el = document.getElementById("fex-count");
    if(!el) return;
    if(fexState.sec === 3) return;
    const done = fexState.answers[fexState.sec].filter(x => x !== null).length;
    el.innerHTML = `Javob berilgan: <b>${done}/10</b>`;
  }

  function fexPlayAudio(){
    if(!fexState || fexState.plays >= 2) return;
    try{
      if(!("speechSynthesis" in window)){
        alert("Brauzeringiz audio o'qishni qo'llab-quvvatlamaydi. Savollarga matn asosida javob bering.");
        return;
      }
      fexState.plays++;
      const pl = document.getElementById("fex-plays-left");
      if(pl) pl.textContent = (2 - fexState.plays) + " marta";
      if(fexState.plays >= 2){ const b = document.getElementById("fex-play"); if(b) b.disabled = true; }
      sbTtsSpeak(FEX_DATA.listening.script, {
        rate: 0.95,
        pitch: 1.0,
        volume: 1.0,
        onDone: function(){
          const b = document.getElementById("fex-play");
          if(b && fexState && fexState.plays < 2) b.disabled = false;
        }
      });
    }catch(e){}
  }

  function fexEssayInput(el){
    fexState.writing = el.value;
    fexEssayCount();
  }

  function fexEssayCount(){
    const words = fexState.writing.trim() ? fexState.writing.trim().split(/\s+/).length : 0;
    const n = document.getElementById("fex-wc-n");
    const f = document.getElementById("fex-wc-fill");
    if(n) n.textContent = words + " / 250 so'z";
    if(f) f.style.width = Math.min(100, Math.round(words/250*100)) + "%";
  }

  function fexNextSection(){
    if(!fexState || fexState.screen !== "section") return;
    if(fexState.sec < 3){
      const unanswered = fexState.answers[fexState.sec].filter(x => x === null).length;
      if(unanswered > 0){
        if(!confirm(unanswered + " ta savol javobsiz qoldi! Baribir keyingi bo'limga o'tasizmi? (Orqaga qaytib bo'lmaydi)")) return;
      }
      fexRenderBrief(fexState.sec + 1);
    } else {
      const words = fexState.writing.trim() ? fexState.writing.trim().split(/\s+/).length : 0;
      if(words < 120){
        if(!confirm("Insho juda qisqa (" + words + " so'z). Imtihonni shu holatda yakunlaysizmi?")) return;
      }
      fexFinish(false);
    }
  }

  function fexScoreWriting(text){
    const t = (text || "").trim();
    const words = t ? t.split(/\s+/).length : 0;
    const paras = t ? t.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 1;
    const conn = ["however","moreover","furthermore","although","though","whereas","therefore","in addition","firstly","secondly","finally","nevertheless","consequently","overall","in contrast","for instance","for example","thus","on the other hand"];
    const low = t.toLowerCase();
    const used = conn.filter(c => low.indexOf(c) !== -1);
    let pts = 0;
    if(words >= 300) pts = 6;
    else if(words >= 250) pts = 5;
    else if(words >= 200) pts = 4;
    else if(words >= 150) pts = 3;
    else if(words >= 100) pts = 2;
    else if(words >= 40) pts = 1;
    if(words >= 250) pts += (used.length >= 5 ? 2 : (used.length >= 3 ? 1 : 0));
    if(words >= 250 && paras >= 4) pts += 1;
    pts = Math.max(1, Math.min(10, pts));
    const tips = [];
    if(words < 250) tips.push("Insho kamida 250 so'zdan iborat bo'lishi kerak — siz " + words + " so'z yozdingiz.");
    if(used.length < 3) tips.push("Ko'proq bog'lovchi vositalar ishlating: however, moreover, therefore, in addition, on the other hand.");
    if(paras < 4) tips.push("Inshoni 4-5 xatboshiga bo'ling: kirish, 2-3 asosiy qism va xulosa.");
    if(!tips.length) tips.push("Zo'r! Hajm, tuzilma va bog'lovchilar talabga mos — natijani o'qituvchingizga ko'rsatib tahlil qildiring.");
    return { pts: pts, words: words, paras: paras, conn: used.length, tips: tips };
  }

  function fexFinish(auto){
    if(!fexState || fexState.finished) return;
    fexState.finished = true;
    fexCleanup();
    const stateRef = fexState;
    const det = [];
    ["listening","reading","uoe"].forEach(function(k, ix){
      let c = 0;
      FEX_DATA[k].qs.forEach(function(item, qi){ if(fexState.answers[ix][qi] === item.a) c++; });
      det.push(c);
    });
    const w = fexScoreWriting(fexState.writing);
    const essay = String(fexState.writing || "").trim();
    const essayWords = essay.split(/\s+/).filter(Boolean).length;
    const willUseAi = essayWords >= 30;
    if(willUseAi) w.aiPending = true;
    const total = det[0] + det[1] + det[2] + w.pts;
    const pct = Math.round(total / 40 * 100);
    const band = fexBand(pct);
    const used = Math.max(1, Math.round((FEX_TOTAL_TIME - Math.max(0, fexState.left)) / 60));
    function saveFexResult(wr, totalScore, pctScore, bandScore){
      testProgress.fullexam = {
        completed: true, band: bandScore, pct: pctScore, score: totalScore + "/40 ball",
        date: new Date().toISOString().split("T")[0],
        sections: { listening: det[0], reading: det[1], uoe: det[2], writing: wr.pts },
        timeUsed: used
      };
      try{ if(typeof updateResultsDisplay === "function") updateResultsDisplay(); }catch(e){}
    }
    saveFexResult(w, total, pct, band);
    fexRenderResult(det, w, total, pct, band, auto, used);

    // Writing qismini haqiqiy Gemini baholaydi; xato bo'lsa lokal baho qoladi.
    if(willUseAi){
      const task = FEX_DATA.prompts[fexState.prompt] || FEX_DATA.prompts[0] || "";
      aiApiPost("/api/ai/score-writing", { task: task, essay: essay }, 60000)
        .then(function(ai){
          if(fexState !== stateRef || !ai || !ai.criteria) return;
          const aiPts = Math.max(1, Math.min(10, Math.round((Number(ai.overall) || 0) / 9 * 10)));
          const aiTips = [];
          if(ai.summary) aiTips.push("AI xulosa: " + ai.summary);
          (ai.strengths || []).slice(0, 2).forEach(function(x){ aiTips.push("✓ " + x); });
          (ai.weaknesses || []).slice(0, 2).forEach(function(x){ aiTips.push("⚠ " + x); });
          const w2 = Object.assign({}, w, {
            pts: aiPts,
            ai: true,
            aiPending: false,
            aiOverall: ai.overall,
            aiCriteria: ai.criteria,
            tips: aiTips.length ? aiTips : w.tips
          });
          const total2 = det[0] + det[1] + det[2] + w2.pts;
          const pct2 = Math.round(total2 / 40 * 100);
          const band2 = fexBand(pct2);
          saveFexResult(w2, total2, pct2, band2);
          fexRenderResult(det, w2, total2, pct2, band2, auto, used);
        })
        .catch(function(e){
          console.warn("Full Exam Writing AI bahosi olinmadi, lokal baho qoladi", e);
          if(fexState !== stateRef) return;
          w.aiPending = false;
          fexRenderResult(det, w, total, pct, band, auto, used);
        });
    }
  }

  function fexToggleScript(){
    const el = document.getElementById("fex-script");
    if(el) el.style.display = el.style.display === "block" ? "none" : "block";
  }

  function fexRenderResult(det, w, total, pct, band, auto, used){
    const secMeta = [
      { icon:"🎧", name:"Listening", pts:det[0] },
      { icon:"📖", name:"Reading", pts:det[1] },
      { icon:"🧩", name:"Use of English", pts:det[2] },
      { icon:"✍️", name:"Writing", pts:w.pts, gold:true }
    ];
    const letters = "ABCD";
    let review = "";
    ["listening","reading","uoe"].forEach(function(k, ix){
      const s = FEX_SECTIONS[ix];
      review += `<h3 style="margin-top:14px;">${s.icon} ${s.name} — ${det[ix]}/10 to'g'ri</h3><div class="rv-sub">Sizning javoblaringiz va to'g'ri variantlar:</div>`;
      FEX_DATA[k].qs.forEach(function(item, qi){
        const mine = fexState.answers[ix][qi];
        const ok = mine === item.a;
        review += `<div class="fex-rv">
          <span class="mk ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"}</span>
          <div><b>${qi+1}.</b> ${item.q}<br><span class="corr">Siz: <b>${mine === null ? "—" : letters[mine]}</b>${ok ? "" : ` · To'g'ri javob: <b style="color:#15803d;">${letters[item.a]}</b>`}</span></div>
        </div>`;
      });
      if(k === "listening"){
        review += `<button class="fex-script-toggle" onclick="fexToggleScript()">📄 Listening transkriptini ko'rsatish</button>
        <div class="fex-script" id="fex-script">${FEX_DATA.listening.script}</div>`;
      }
    });
    document.getElementById("fex-content").innerHTML = `
      <div class="fex-res-hero">
        ${auto ? `<div class="fex-res-note">⏰ Vaqt tugadi — imtihon avtomatik yakunlandi</div>` : ""}
        <div class="fex-band">${band.toFixed(1)} <small>BAND</small></div>
        <div><span class="fex-grade">${fexGradeLabel(band)}</span></div>
        <div class="fex-res-sub">40 balldan <b>${total}</b> · ${pct}% · ${used} daqiqa sarflandi · ${new Date().toISOString().split("T")[0]}</div>
      </div>
      <div class="fex-secres">
        ${secMeta.map(m => `
          <div class="fex-sr">
            <div class="fex-sr-h"><div>${m.icon} ${m.name}</div><span>${m.pts}/10 ball</span></div>
            <div class="fex-sr-track"><div class="fex-sr-fill ${m.gold ? "w" : ""}" style="width:${m.pts*10}%;"></div></div>
          </div>`).join("")}
      </div>
      <div class="fex-review">
        <h3>📚 To'liq javoblar tahlili</h3>
        <div class="rv-sub">Har bir savolni to'g'ri javob bilan solishtiring — xatolaringiz ustida ishlang.</div>
        ${review}
        <h3 style="margin-top:16px;">✍️ Writing — ${w.pts}/10 ball</h3>
        <div class="rv-sub">${w.words} so'z · ${w.paras} xatboshi · ${w.conn} xil bog'lovchi · ${w.ai ? ("Gemini AI baholadi (IELTS Band " + Number(w.aiOverall).toFixed(1) + ")") : (w.aiPending ? "Gemini AI tekshirmoqda..." : "avtomatik baholash")}</div>
        ${w.aiCriteria ? `<div class="rv-sub" style="margin-top:6px;">AI mezonlari: Task Response ${w.aiCriteria.tr} · Coherence ${w.aiCriteria.cc} · Lexical ${w.aiCriteria.lr} · Grammar ${w.aiCriteria.gra}</div>` : ""}
        <ul class="fex-wtips">${w.tips.map(t => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      </div>
      <div class="fex-actions">
        <button class="fex-next" onclick="openFullExam()">🔄 Qayta topshirish</button>
        <button class="fex-next" style="background:var(--ink-soft);" onclick="switchTab('home')">🏠 Bosh sahifa</button>
      </div>
    `;
  }



  function btlRenderIntro(){
    btlState.screen = 'intro';
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const qSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
    const teamSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>';
    document.getElementById('battle-content').innerHTML = alRenderIntro({
      colorClass: 'al-crimson',
      heroSvg: heroSvg,
      title: 'Battle Mode',
      sub: 'Onlayn foydalanuvchilar bilan 1v1 · 2v2 · 4v4 jamoaviy bilim jangi — tezlik va aniqlik',
      chips: [
        { svg: qSvg, text: '7 savol' },
        { svg: clockSvg, text: '15s/savol' },
        { svg: teamSvg, text: '1v1 · 2v2 · 4v4' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: '<b>Random</b> (onlayn matchmaking) yoki <b>Do\'st</b> (kod bilan) tanlang' },
        { txt: 'Har savolga <b>15 soniya</b> — tez javob = ko\'proq ball' },
        { txt: '<b>3+ to\'g\'ri ketma-ket</b> = seriya bonusi (+5 ball)' },
        { txt: 'G\'alaba/mag\'lubiyat rekordi <b>Natijalar</b> bo\'limida saqlanadi' }
      ],
      note: 'Jangda faqat haqiqiy javoblar hisoblanadi — javob bermasangiz +0 ball va seriya buziladi',
      btnText: 'Boshlash',
      btnAction: 'btlShowModes()',
      motivate: 'Tezlik va aniqlik — g\'alaba kaliti! ⚔️'
    });
  }

