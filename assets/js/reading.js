// Englify — reading
  // --- READING MOCK (alilm.uz uslubi) ---
  /* Reading bank — har kirishda yangi matn tanlanadi.
     Har bir matnda 10 ta savol bor; Reading Mock barcha 10 tasini ishlatadi,
     variantlar aralashtiriladi (to'g'ri javob turli harflarda bo'ladi). */
  const READING_BANK = [
    {
      id: 'technology',
      passage: `The Impact of Technology on Education
In recent decades, technology has transformed almost every aspect of our lives, and education is no exception. Digital tools have democratized access to information across the globe.
One of the most significant advantages is accessibility. Students from remote regions can now participate in courses provided by prestigious institutions.
However, screen time and digital dependency require careful moderation. Balance between traditional pedagogical methods and innovative tech is crucial.`,
      qs: [
        { q: "What is the primary theme of the passage?", opts: ["History of universities", "Impact of technology on education", "Video games", "Online payments"], ans: 1, hint: "In recent decades, technology has transformed almost every aspect of our lives, and education is no exception." },
        { q: "What major advantage of technology is highlighted?", opts: ["It eliminates textbooks", "It increases accessibility for remote students", "It cancels tests", "It replaces teachers entirely"], ans: 1, hint: "One of the most significant advantages is accessibility. Students from remote regions can now participate in courses provided by prestigious institutions." },
        { q: "What caution is advised in the text?", opts: ["Technology must be banned", "Digital dependency and screen time need moderation", "Schools should close", "Students must study alone"], ans: 1, hint: "However, screen time and digital dependency require careful moderation." },
        { q: "What balance does the author recommend?", opts: ["100% digital only", "Balance between traditional methods and digital tools", "Ignore modern tech", "Only online games"], ans: 1, hint: "Balance between traditional pedagogical methods and innovative tech is crucial." },
        { q: "The overall tone of the author is:", opts: ["Pessimistic", "Constructive and balanced", "Aggressive", "Indifferent"], ans: 1, hint: "Technology has transformed almost every aspect of our lives... Balance between traditional pedagogical methods and innovative tech is crucial." },
        { q: "Where can students from remote regions now study?", opts: ["Only in local schools", "Courses provided by prestigious institutions", "Nowhere", "Only in libraries"], ans: 1, hint: "Students from remote regions can now participate in courses provided by prestigious institutions." },
        { q: "What has digital technology done to access to information?", opts: ["Limited it", "Democratized it across the globe", "Made it expensive", "Removed it"], ans: 1, hint: "Digital tools have democratized access to information across the globe." },
        { q: "What does 'democratized access' most nearly mean?", opts: ["Made available to everyone", "Made it political", "Made it secret", "Made it slower"], ans: 0, hint: "Democratized access means information is available to a wide range of people, not only a few." },
        { q: "Which statement is NOT supported by the passage?", opts: ["Technology can improve access", "Screen time needs moderation", "Traditional methods can still be useful", "Traditional methods are no longer needed"], ans: 3, hint: "The passage says balance is crucial, not that traditional methods are useless." },
        { q: "What does the author suggest about digital dependency?", opts: ["It should be ignored", "It requires careful moderation", "It is always harmful", "It is the only solution"], ans: 1, hint: "However, screen time and digital dependency require careful moderation." }
      ]
    },
    {
      id: 'gardening',
      passage: `The Rise of Urban Gardening
In many cities around the world, unused rooftops and empty lots are being transformed into community gardens. These green spaces allow residents to grow fresh vegetables, reduce stress, and meet their neighbours.
Supporters argue that urban gardens also cool the air during hot summers and help manage rainwater, which can reduce flooding. However, creating a garden is not always simple. Soil in abandoned industrial areas may contain harmful chemicals, so testing is essential before planting. In addition, gardeners need reliable access to water and permission from the landowner.
Some critics claim that the spaces would be better used for housing. Nevertheless, many city councils now offer small grants and training programmes to encourage residents to start their own gardens.`,
      qs: [
        { q: "What is the main idea of the passage?", opts: ["Housing problems in cities", "Turning unused city spaces into community gardens", "The history of farming", "How to build rooftops"], ans: 1, hint: "Unused rooftops and empty lots are being transformed into community gardens." },
        { q: "Which places are being transformed into gardens?", opts: ["Schools and hospitals", "Rooftops and empty lots", "Rivers and lakes", "Airports and stations"], ans: 1, hint: "Unused rooftops and empty lots are being transformed into community gardens." },
        { q: "Which social benefit of gardens is mentioned?", opts: ["Higher house prices", "Meeting neighbours", "More traffic", "Longer working hours"], ans: 1, hint: "These green spaces allow residents to grow fresh vegetables, reduce stress, and meet their neighbours." },
        { q: "What environmental benefit do gardens provide in summer?", opts: ["They cool the air", "They increase pollution", "They create noise", "They block sunlight completely"], ans: 0, hint: "Urban gardens also cool the air during hot summers." },
        { q: "How can gardens help with rainwater?", opts: ["By storing it in bottles", "By helping to reduce flooding", "By making it dirty", "By pumping it away"], ans: 1, hint: "Help manage rainwater, which can reduce flooding." },
        { q: "Why is soil testing essential?", opts: ["To make the soil colourful", "Because industrial soil may contain harmful chemicals", "To slow down planting", "Because plants cannot grow in cities"], ans: 1, hint: "Soil in abandoned industrial areas may contain harmful chemicals, so testing is essential." },
        { q: "What do gardeners need besides water?", opts: ["A licence to drive", "Permission from the landowner", "A university degree", "A large truck"], ans: 1, hint: "Gardeners need reliable access to water and permission from the landowner." },
        { q: "What do critics say about the spaces?", opts: ["They should be gardens", "They would be better used for housing", "They should be closed", "They are too expensive"], ans: 1, hint: "Some critics claim that the spaces would be better used for housing." },
        { q: "What do city councils offer to encourage gardens?", opts: ["Free houses", "Small grants and training programmes", "New cars", "Extra taxes"], ans: 1, hint: "Many city councils now offer small grants and training programmes." },
        { q: "What is the author's tone in the passage?", opts: ["Supportive but realistic", "Completely negative", "Angry", "Uninterested"], ans: 0, hint: "The author presents benefits and challenges in a balanced way." }
      ]
    },
    {
      id: 'bees',
      passage: `How Bees Communicate
Honeybees are among the most remarkable communicators in the animal kingdom. When a forager discovers a rich source of nectar, it returns to the hive and performs a movement known as the waggle dance.
The direction of the dance indicates the angle of the food relative to the sun, while the duration of the waggling tells other bees how far away it is. Recent research has shown that bees can also use sound and scent to share information.
Although the dance was first described by the scientist Karl von Frisch in the 1940s, some details were debated for decades. Modern high-speed cameras have confirmed that the insects adjust the dance according to the wind and the quality of the food.
Understanding bee communication is not only fascinating but also important, because bees pollinate a large proportion of the crops that humans eat.`,
      qs: [
        { q: "What is the main topic of the passage?", opts: ["How honeybees communicate", "How bees build houses", "The history of honey", "Why bees are dangerous"], ans: 0, hint: "Honeybees are among the most remarkable communicators in the animal kingdom." },
        { q: "What is the waggle dance?", opts: ["A way of sleeping", "A movement used to share the location of food", "A type of flower", "A warning sound"], ans: 1, hint: "When a forager discovers a rich source of nectar, it returns to the hive and performs a movement known as the waggle dance." },
        { q: "What does the direction of the dance indicate?", opts: ["The age of the bee", "The angle of the food relative to the sun", "The colour of the flowers", "The size of the hive"], ans: 1, hint: "The direction of the dance indicates the angle of the food relative to the sun." },
        { q: "What does the duration of the waggling tell other bees?", opts: ["How far away the food is", "How old the queen is", "What time it is", "How many bees are needed"], ans: 0, hint: "The duration of the waggling tells other bees how far away it is." },
        { q: "Besides movement, what do bees use to share information?", opts: ["Sound and scent", "Written notes", "Colour only", "Electricity"], ans: 0, hint: "Recent research has shown that bees can also use sound and scent to share information." },
        { q: "Who first described the waggle dance?", opts: ["Charles Darwin", "Karl von Frisch", "Isaac Newton", "Marie Curie"], ans: 1, hint: "The dance was first described by the scientist Karl von Frisch." },
        { q: "When was the dance first described?", opts: ["In the 1940s", "In the 1800s", "In the 2000s", "In the 1600s"], ans: 0, hint: "Karl von Frisch described it in the 1940s." },
        { q: "What helped confirm the details of the dance?", opts: ["Modern high-speed cameras", "Newspapers", "Old paintings", "Radio programmes"], ans: 0, hint: "Modern high-speed cameras have confirmed that the insects adjust the dance." },
        { q: "What do bees adjust the dance according to?", opts: ["The wind and the quality of the food", "The colour of the sky", "The number of flowers only", "The age of the hive"], ans: 0, hint: "The insects adjust the dance according to the wind and the quality of the food." },
        { q: "Why is understanding bee communication important?", opts: ["Because bees pollinate many crops humans eat", "Because bees make music", "Because bees can talk to humans", "Because bees are pets"], ans: 0, hint: "Bees pollinate a large proportion of the crops that humans eat." }
      ]
    }
  ];
  let READING_DATA = { passage: READING_BANK[0].passage, qs: rdPrepareQuestions(READING_BANK[0].qs.slice(0, 10)) };
  let rdState = { screen:'intro', idx:0, answers:{}, correct:0, revealed:false, timeLeft:60, refOpen:false };
  let readingQTimer=null, readingLoadTimer=null;

  /* Variantlarni aralashtirish: to'g'ri javob har xil harflarda bo'ladi.
     10 ta savol uchun A/B/C/D pozitsiyalari teng taqsimlanadi. */
  function rdShuffleQuestion(q, target){
    const opts = q.opts.slice();
    const correctText = opts[q.ans];
    const rest = opts.filter(function(_, i){ return i !== q.ans; });
    for(let i = rest.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const t = rest[i]; rest[i] = rest[j]; rest[j] = t;
    }
    const pos = (typeof target === 'number') ? target : Math.floor(Math.random() * 4);
    rest.splice(pos, 0, correctText);
    return { q: q.q, opts: rest, ans: pos, hint: q.hint || '' };
  }

  function rdPrepareQuestions(list){
    const qs = (list || []).slice();
    const targets = qs.map(function(_, i){ return i % 4; });
    for(let i = targets.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const t = targets[i]; targets[i] = targets[j]; targets[j] = t;
    }
    return qs.map(function(q, i){ return rdShuffleQuestion(q, targets[i]); });
  }

  function openReading(){
    clearInterval(readingQTimer); clearInterval(readingLoadTimer);
    showPanel('reading',"O'qib tushunish");
    // Har kirishda yangi matn + undan 10 ta yangi savol (variantlar aralashtiriladi)
    const set = sbPickFresh(READING_BANK, 'reading') || READING_BANK[0];
    READING_DATA = { passage: set.passage, qs: rdPrepareQuestions(sbPickMany(set.qs, 10)) };
    rdState = { screen:'intro', idx:0, answers:{}, correct:0, revealed:false, timeLeft:60, refOpen:false };
    rdRenderIntro();
  }

  /* 1) INTRO EKRANI */
  function rdRenderIntro(){
    rdState.screen = 'intro';
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const qSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
    const bandSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    document.getElementById('reading-content').innerHTML = alRenderIntro({
      colorClass: 'al-teal',
      heroSvg: heroSvg,
      title: 'Reading Mock',
      sub: 'IELTS Reading — akademik matnni o\'qib, 10 ta savolga javob bering',
      chips: [
        { svg: clockSvg, text: '~10 daqiqa' },
        { svg: qSvg, text: '10 ta savol' },
        { svg: bandSvg, text: 'Band 8.5 gacha' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: 'Matnni <b>diqqat bilan o\'qing</b> — barcha tafsilotlarni ushlang' },
        { txt: 'Har bir savolga <b>60 soniya</b> vaqt beriladi' },
        { txt: 'Savol paytida matnni <b>qayta ochib</b> o\'qish mumkin' },
        { txt: 'Natijangiz <b>Band 4.0–9.0</b> shkalasida baholanadi' }
      ],
      note: '📘 Matnni o\'qib chiqing — savol paytida ham matnni qayta ko\'rishingiz mumkin',
      btnText: 'Boshlash',
      btnAction: 'startReading()',
      motivate: 'Tez va aniq o\'qish — har kuni mashq orqali rivojlanadi!'
    });
  }

  /* 2) LOADING EKRANI (aylana progress) */
  function startReading(){
    clearInterval(readingLoadTimer);
    const state = rdState;
    rdState.screen = 'loading';
    rdState.aiPromise = aiGenerate('reading', 'B2', 70000)
      .then(function(d){
        if(!d || !String(d.passage || '').trim() || !aiValidQuestionList(d.qs, 10)) return null;
        return {
          id: d.id || ('ai-read-' + Date.now()),
          title: String(d.title || 'AI Reading').slice(0, 140),
          passage: String(d.passage).slice(0, 14000),
          qs: d.qs.slice(0, 10).map(function(q){
            return { q:String(q.q), opts:q.opts.slice(0,4), ans:q.ans, hint:String(q.hint || '') };
          })
        };
      })
      .catch(function(e){
        console.warn('Reading AI matni olinmadi, lokal bank ishlatiladi', e);
        return null;
      });
    const ring = (2 * Math.PI * 54).toFixed(2);
    document.getElementById('reading-content').innerHTML = `
      <div class="rdx-wrap">
        <div class="rdx-ring-wrap">
          <svg width="144" height="144" viewBox="0 0 120 120" style="transform:rotate(-90deg);">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--field)" stroke-width="8"/>
            <circle id="rdx-ring" cx="60" cy="60" r="54" fill="none" stroke="url(#rdxGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${ring}" stroke-dashoffset="${ring}" style="transition:stroke-dashoffset .3s ease-out;"/>
            <defs><linearGradient id="rdxGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0f9aa8"/><stop offset="100%" stop-color="#0e7c86"/></linearGradient></defs>
          </svg>
          <div class="rdx-ring-pct" id="rdx-pct">0%</div>
        </div>
        <h2 style="font-family:'Fraunces',serif;font-size:19px;font-weight:600;text-align:center;margin-bottom:8px;">Matn tayyorlanmoqda...</h2>
        <p style="font-size:13.5px;color:var(--ink-soft);text-align:center;line-height:1.6;">Reading savollari yuklanmoqda. Iltimos kuting...</p>
        <div class="rdx-load-bar"><div class="rdx-load-fill" id="rdx-lfill" style="width:0%;"></div></div>
        <p style="text-align:center;font-size:12px;color:var(--ink-soft);margin-top:10px;" id="rdx-ltxt">Yuklanmoqda 0%</p>
      </div>`;
    let pct = 0;
    readingLoadTimer = setInterval(function(){
      pct += Math.floor(Math.random() * 6) + 3;
      if(pct >= 92){
        pct = 92;
        clearInterval(readingLoadTimer); readingLoadTimer = null;
        rdUpdateLoad(pct);
        const loadTxt = document.getElementById('rdx-ltxt');
        if(loadTxt) loadTxt.textContent = 'AI matn va 10 ta savol yaratmoqda...';
        Promise.all([
          rdState.aiPromise || Promise.resolve(null),
          new Promise(function(resolve){ setTimeout(resolve, 900); })
        ]).then(function(out){
          if(rdState !== state || state.screen !== 'loading') return;
          if(out[0]) READING_DATA = { passage: out[0].passage, qs: rdPrepareQuestions(sbPickMany(out[0].qs, 10)) };
          rdUpdateLoad(100);
          setTimeout(function(){
            if(rdState !== state || state.screen !== 'loading') return;
            rdRenderPassage();
          }, 350);
        });
        return;
      }
      rdUpdateLoad(pct);
    }, 110);
  }

  function rdUpdateLoad(p){
    const ringEl = document.getElementById('rdx-ring');
    const off = (2 * Math.PI * 54).toFixed(2);
    if(ringEl) ringEl.style.strokeDashoffset = (off * (1 - p/100)).toFixed(2);
    const pctEl = document.getElementById('rdx-pct');
    if(pctEl) pctEl.textContent = p + '%';
    const fill = document.getElementById('rdx-lfill');
    if(fill) fill.style.width = p + '%';
    const txt = document.getElementById('rdx-ltxt');
    if(txt) txt.textContent = 'Yuklanmoqda ' + p + '%';
  }

  /* 3) MATN EKRANI */
  function rdRenderPassage(){
    rdState.screen = 'passage';
    const wc = READING_DATA.passage.trim().split(/\s+/).length;
    document.getElementById('reading-content').innerHTML = `
      <div class="rdx-wrap">
        <div class="rdx-passage-card">
          <div class="rdx-passage-head">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span class="rdx-passage-title">Reading Passage</span>
            <span class="rdx-chip" style="background:rgba(255,255,255,0.18);color:#fff;">IELTS Academic</span>
          </div>
          <div class="rdx-passage-body">
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
              <span class="rdx-chip">📝 ${wc} so'z</span>
              <span class="rdx-chip">⏱ Tavsiya: 2 daqiqa</span>
            </div>
            <p class="rdx-passage-text">${READING_DATA.passage}</p>
          </div>
        </div>
        <button class="rdx-btn" onclick="rdBeginTesting()">Savollarga o'tish (${READING_DATA.qs.length} ta) →</button>
        <button class="rdx-btn-outline" style="margin-top:12px;" onclick="openReading()">← Orqaga</button>
      </div>`;
  }

  /* 4) TESTING EKRANI (har savolga 60 soniya) */
  function rdBeginTesting(){
    rdState.idx = 0; rdState.answers = {}; rdState.correct = 0; rdState.revealed = false; rdState.refOpen = false;
    rdState.screen = 'testing';
    showPanel('reading',"O'qib tushunish");
    rdRenderQ();
  }

  function rdRenderQ(){
    clearInterval(readingQTimer);
    const q = READING_DATA.qs[rdState.idx];
    const total = READING_DATA.qs.length;
    rdState.revealed = false; rdState.timeLeft = 60;
    document.getElementById('reading-content').innerHTML = `
      <div class="rdx-wrap">
        <div class="rdx-progrow">
          <div class="rdx-prog"><div class="rdx-prog-fill" style="width:${Math.round((rdState.idx+1)/total*100)}%;"></div></div>
          <span class="rdx-count">${rdState.idx+1} / ${total}</span>
        </div>
        <div class="rdx-timer-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" stroke-width="2.2" stroke-linecap="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          <span class="rdx-timer-sec" id="rdx-sec">60s</span>
          <div class="rdx-timer-bar"><div class="rdx-timer-fill" id="rdx-tfill" style="width:100%;"></div></div>
          <button class="rdx-ref${rdState.refOpen ? ' on' : ''}" id="rdx-ref" onclick="rdToggleRef()" title="Matnni ko'rish">📖</button>
          <span class="rdx-chip">O'qish</span>
        </div>
        <div class="rdx-passage-ref" id="rdx-refbox" style="display:${rdState.refOpen ? 'block' : 'none'};">${READING_DATA.passage}</div>
        <div class="rdx-q">${q.q}</div>
        ${q.opts.map((o,i)=>`
          <button class="rdx-opt" id="rdx-opt-${i}" onclick="rdPick(${i})">
            <span class="letter">${String.fromCharCode(65+i)}</span>
            <span>${o}</span>
          </button>`).join('')}
        <div class="rdx-fb" id="rdx-fb"></div>
      </div>`;
    readingQTimer = setInterval(rdTick, 1000);
  }

  function rdToggleRef(){
    rdState.refOpen = !rdState.refOpen;
    const box = document.getElementById('rdx-refbox');
    const btn = document.getElementById('rdx-ref');
    if(box) box.style.display = rdState.refOpen ? 'block' : 'none';
    if(btn) btn.classList.toggle('on', rdState.refOpen);
  }

  function rdTick(){
    rdState.timeLeft--;
    const sec = document.getElementById('rdx-sec');
    const fill = document.getElementById('rdx-tfill');
    if(!sec || !fill || rdState.screen !== 'testing'){ clearInterval(readingQTimer); return; }
    const t = Math.max(rdState.timeLeft, 0);
    sec.textContent = t + 's';
    fill.style.width = (t/60*100) + '%';
    fill.classList.toggle('warn', t <= 20 && t > 10);
    fill.classList.toggle('danger', t <= 10);
    sec.classList.toggle('danger', t <= 10);
    if(t <= 0 && !rdState.revealed) rdReveal(null, true);
  }

  function rdPick(i){
    if(rdState.revealed || rdState.screen !== 'testing') return;
    rdReveal(i, false);
  }

  function rdReveal(i, timeout){
    if(rdState.revealed) return;
    rdState.revealed = true;
    clearInterval(readingQTimer);
    const q = READING_DATA.qs[rdState.idx];
    rdState.answers[rdState.idx] = i;
    const ok = (i === q.ans);
    if(ok) rdState.correct++;
    q.opts.forEach(function(_, k){
      const el = document.getElementById('rdx-opt-' + k);
      if(!el) return;
      el.classList.add('dim');
      if(k === q.ans) el.classList.add('correct');
      else if(k === i) el.classList.add('wrong');
    });
    const ansLetter = document.querySelector('#rdx-opt-' + q.ans + ' .letter');
    if(ansLetter) ansLetter.textContent = '✓';
    if(i !== null && i !== undefined && !ok){
      const selLetter = document.querySelector('#rdx-opt-' + i + ' .letter');
      if(selLetter) selLetter.textContent = '✗';
    }
    const fb = document.getElementById('rdx-fb');
    if(fb){
      if(timeout){ fb.className = 'rdx-fb timeout'; fb.textContent = '⏰ Vaqt tugadi!'; }
      else if(ok){ fb.className = 'rdx-fb ok'; fb.textContent = "✓ To'g'ri!"; }
      else { fb.className = 'rdx-fb no'; fb.textContent = "✗ Noto'g'ri"; }
    }
    setTimeout(rdNext, timeout ? 1400 : 1000);
  }

  function rdNext(){
    if(rdState.screen !== 'testing') return;
    rdState.idx++;
    if(rdState.idx >= READING_DATA.qs.length){ rdFinish(); return; }
    rdRenderQ();
  }

  /* 5) NATIJA EKRANI */
  function rdFinish(){
    clearInterval(readingQTimer);
    const total = READING_DATA.qs.length;
    const details = [];
    READING_DATA.qs.forEach(function(q, k){
      const ua = rdState.answers[k];
      details.push({ q:q.q, hint:q.hint, opts:q.opts, ans:q.ans, user:ua, ok:(ua === q.ans) });
    });
    const pct = Math.round(rdState.correct / total * 100);
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
    testProgress.reading = {
      completed: true,
      band: band,
      pct: pct,
      score: rdState.correct + '/' + total + " to'g'ri",
      date: new Date().toISOString().split('T')[0]
    };
    if(typeof saveUserProgress === 'function') saveUserProgress();
    if(typeof updateResultsDisplay === 'function') updateResultsDisplay();
    rdState.screen = 'result';
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : pct >= 40 ? '👍' : '💪';
    const cls = pct >= 70 ? 'good' : pct >= 50 ? 'mid' : 'bad';
    const reviewRows = details.map(function(d, k){
      const uaTxt = (d.user === null || d.user === undefined) ? '—' : (String.fromCharCode(65 + d.user) + '. ' + d.opts[d.user]);
      return `<div class="rdx-rev-item">
        <div class="rdx-rev-top">
          <div class="rdx-rev-ic ${d.ok ? 'ok' : 'no'}">${d.ok ? '✓' : '✗'}</div>
          <div class="rdx-rev-q">
            <div>${d.q}</div>
            ${d.ok ? '' : `<div class="rdx-rev-ans">Sizning javobingiz: ${uaTxt} → To'g'ri javob: ${String.fromCharCode(65 + d.ans)}. ${d.opts[d.ans]}</div>`}
          </div>
        </div>
        ${rdRevDetail(d, k)}
      </div>`;
    }).join('');
    document.getElementById('reading-content').innerHTML = `
      <div class="rdx-wrap">
        <div class="rdx-res-card">
          <div class="rdx-res-emoji">${emoji}</div>
          <div class="rdx-res-pct ${cls}">${pct}%</div>
          <div class="rdx-res-sub">${rdState.correct}/${total} to'g'ri javob • Band ${band}</div>
        </div>
        <div class="rdx-panel">
          <div class="rdx-panel-h">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f9aa8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Javoblarni ko'rish
          </div>
          ${reviewRows}
        </div>
        <div class="rdx-comeback">Har kuni mashq qiling — natijangiz albatta o'sadi! 🎯</div>
        <button class="rdx-btn" onclick="switchTab('home')">Bosh sahifa</button>
        <button class="rdx-btn-outline" style="margin-top:12px;" onclick="openReading()">Qayta urinish</button>
      </div>`;
  }

  function rdRevDetail(d, k){
    const rows = d.opts.map(function(o, i){
      const isAns = (i === d.ans);
      const isUser = (!d.ok && i === d.user);
      let cls = '';
      let mark = '';
      if(isAns){ cls = 'hit'; mark = ' ✓'; }
      else if(isUser){ cls = 'miss'; mark = ' ✗'; }
      return `<div class="rdx-rev-opt ${cls}"><b>${String.fromCharCode(65 + i)}.</b><span>${o}${mark}</span></div>`;
    }).join('');
    return `<button class="rdx-rev-toggle" onclick="rdToggleDetail(${k})" id="rdx-tg-${k}">▾ Batafsil</button>
      <div class="rdx-rev-detail" id="rdx-det-${k}" style="display:none;">
        <div class="rdx-rev-passage">📘 "${d.hint}"</div>
        ${rows}
      </div>`;
  }

  function rdToggleDetail(k){
    const det = document.getElementById('rdx-det-' + k);
    const tg = document.getElementById('rdx-tg-' + k);
    if(!det) return;
    const open = (det.style.display !== 'none');
    det.style.display = open ? 'none' : 'block';
    if(tg) tg.innerHTML = open ? '▾ Batafsil' : '▴ Yopish';
  }

  /* Orqaga — test davomida tasdiq so'raladi (alilm kabi) */
  function readingBack(){
    if(rdState.screen === 'testing' && !rdState.revealed){
      if(!confirm("Imtihon tugallanmagan! Agar chiqsangiz, shu javoblaringiz o'chadi va shu joydan davom eta olmaysiz. Chiqishni tasdiqlaysizmi?")) return;
    }
    if(rdState.screen === 'loading') clearInterval(readingLoadTimer);
    clearInterval(readingQTimer);
    switchTab('home');
  }

