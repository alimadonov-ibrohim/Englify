// Englify — writing
  // --- WRITING MOCK (alilm.uz oqimi asosida) ---
  let writingTimer=null, writingSeconds=60*60, writingState=null;

  const WRITING_PARTS = [
    { name:"Introduction — Paraphrase", hint:"Savoldagi gapni o'z so'zlaringiz bilan qayta yozing. Savol so'zlarini ko'chirmang!", min:25 },
    { name:"Thesis",                    hint:"Asosiy qaroringizni va uning sababini 1-2 gapda aniq yozing.", min:20 },
    { name:"Body 1",                    hint:"Birinchi g'oya: mavzu jumla + izoh + misol.", min:45 },
    { name:"Body 2",                    hint:"Ikkinchi g'oya: mavzu jumla + izoh + misol. Birinchi g'oyani takrorlamang!", min:45 },
    { name:"Conclusion",                hint:"Xulosa: fikrlaringizni qisqa umumlashtiring. Yangi g'oya qo'shmang!", min:25 }
  ];
  const WRITING_CRITERIA = [
    { key:"tr",  label:"Task Response",                color:"#22c55e" },
    { key:"cc",  label:"Coherence & Cohesion",         color:"#0ea5e9" },
    { key:"lr",  label:"Lexical Resource",             color:"#a855f7" },
    { key:"gra", label:"Grammatical Range & Accuracy", color:"#f59e0b" }
  ];
  const WRITING_TOPICS = [
    "Some people believe that technology has made learning easier and more accessible. Others argue that it has created more problems than benefits for students. Discuss both views and give your own opinion.",
    "Many people think that protecting the environment is the responsibility of governments, while others believe every individual should take action. Discuss both views and give your own opinion.",
    "Nowadays many young people prefer to work for international companies rather than local businesses. What are the advantages and disadvantages of this choice?",
    "More and more people are moving from rural areas to big cities. What problems does this cause? How can these problems be solved?",
    "Some people think that children should start learning a foreign language at primary school, while others believe it is better to begin at secondary school. Discuss both views and give your own opinion.",
    "Online shopping is replacing traditional shopping in many countries. Do the advantages of this development outweigh the disadvantages?",
    "Many students today choose to study abroad instead of in their home country. What are the benefits and drawbacks of studying overseas?",
    "Some people believe that university education should be free for everyone, while others think students should pay for it themselves. Discuss both views and give your opinion.",
    "In many countries, people are living longer than ever before. What are the advantages and disadvantages of an ageing population?",
    "Social media has changed the way people communicate. Do the benefits of social media outweigh its negative effects?",
    "Some people think that sports and physical education should be a compulsory part of the school curriculum. To what extent do you agree or disagree?",
    "Many companies now allow employees to work from home. Is this a positive or negative development for workers and employers?",
    "Tourism has grown rapidly in recent decades. What are the positive and negative effects of tourism on local communities?",
    "Some people believe that governments should spend more money on public transport than on new roads. Discuss both views and give your opinion.",
    "Children today spend too much time in front of screens. What problems does this cause, and what solutions can you suggest?",
    "Some people argue that exams are the best way to assess students, while others prefer continuous assessment. Discuss both views and give your opinion.",
    "The amount of food wasted by households and restaurants is increasing. Why does this happen, and how can it be reduced?",
    "Many people believe that success in life depends mainly on hard work, while others think luck plays the biggest role. Discuss both views and give your opinion.",
    "Cities are becoming noisier and more polluted. What are the main causes of these problems, and what measures can be taken?",
    "Some people think that reading fiction is a waste of time, while others believe it is valuable. Discuss both views and give your opinion."
  ];
  const WRITING_LINKERS = ["however","moreover","furthermore","in addition","firstly","first of all","secondly","thirdly","finally","therefore","consequently","although","though","despite","whereas","on the other hand","in conclusion","to begin with","for instance","for example","as a result","in contrast","similarly","nevertheless","in my opinion","i believe"];

  function wcWords(t){ t = (t || "").trim(); return t ? t.split(/\s+/).length : 0; }

  function writingBack(){
    if(writingState && writingState.active){
      if(confirm("Mock hali tugamadi. Sahifadan chiqsangiz, mock bekor qilinadi. Davom etasizmi?")){
        clearInterval(writingTimer);
        writingState = null;
        switchTab('home');
        setTimeout(function(){ alert("🚫 Sahifadan chiqdingiz — mock bekor qilindi! Qayta boshlang."); }, 200);
      }
    } else {
      switchTab('home');
    }
  }

  /* ---------- FORMAT TANLASH ---------- */

  // === Universal ALILM-style intro sahifa generatori ===
  // Rang sinfiga qarab (al-green, al-orange, ...) har bir modul uchun mos kirish sahifasi
  function alRenderIntro(opts){
    // opts: { colorClass, heroSvg, title, sub, chips:[{svg,text}], howtoHead, steps:[{txt, bold}], note, btnText, btnAction, motivate }
    const chipsHtml = (opts.chips || []).map(function(c){
      return '<span>' + (c.svg || '') + c.text + '</span>';
    }).join('');
    const stepsHtml = (opts.steps || []).map(function(s, i){
      return '<div class="al-howto-step">'
        + '<span class="al-howto-num">' + (i+1) + '</span>'
        + '<div class="al-howto-txt">' + s.txt + '</div>'
        + '</div>';
    }).join('');
    return `<div class="al-intro-wrap ${opts.colorClass}">
      <div class="al-intro-glow">
        <div class="al-intro-hero" style="background:var(--al-grad);">
          ${opts.heroSvg}
        </div>
        <h2 class="al-intro-title">${opts.title}</h2>
        <p class="al-intro-sub">${opts.sub}</p>
        ${chipsHtml ? '<div class="al-intro-chips">' + chipsHtml + '</div>' : ''}
        <div class="al-howto-card">
          <div class="al-howto-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <h3>${opts.howtoHead || 'QANDAY ISHLATISH?'}</h3>
          </div>
          <div class="al-howto-body">${stepsHtml}</div>
        </div>
        ${opts.note ? '<div class="al-intro-note">' + opts.note + '</div>' : ''}
        <button class="al-intro-btn" onclick="${opts.btnAction}">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          ${opts.btnText || 'Boshlash'}
        </button>
        <button class="al-intro-back" onclick="switchTab('home')">← Bosh sahifaga qaytish</button>
        ${opts.motivate ? '<div class="al-intro-motivate"><span class="star">⭐</span> ' + opts.motivate + '</div>' : ''}
      </div>
    </div>`;
  }

  function openWriting(){
    showPanel('writing','Writing Mock');
    clearInterval(writingTimer);
    writingState = null;
    const heroSvg = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const taskSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
    const starSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>';
    document.getElementById('writing-content').innerHTML = alRenderIntro({
      colorClass: 'al-green',
      heroSvg: heroSvg,
      title: 'Writing Mock',
      sub: 'IELTS Writing imtihonida 2 ta vazifa bo\'ladi — real vaqt hisobida baholanadi',
      chips: [
        { svg: clockSvg, text: '60 daqiqa' },
        { svg: taskSvg, text: 'Task 1 + Task 2' },
        { svg: starSvg, text: '+5 ball' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: '<b>Task 1</b> — kamida 150 so\'z, <b>Task 2</b> — kamida 250 so\'z yozing' },
        { txt: 'Vaqt tugashi bilan avtomatik yakunlanadi — rejalashtirib yozing' },
        { txt: 'Fikringizni aniq, izchil paragraflarda ifodalang — <b>Band Score</b> shunga bog\'liq' },
        { txt: 'Tugatgach <b>"Yuborish"</b>ni bosing — natijani Natijalar bo\'limida ko\'rasiz' }
      ],
      note: 'IELTS mezonlari bo\'yicha 4 ta mezonda baholanadi: Task Response, Coherence, Lexical Resource, Grammar',
      btnText: 'Boshlash',
      btnAction: 'writingShowFormats()',
      motivate: 'Tayyormisiz? Omad! Natijani Natijalar bo\'limida ko\'rasiz'
    });
  }

  // Writing Mock — format tanlash (eski openWriting)
  function writingShowFormats(){
    showPanel('writing','Writing Mock — Format');
    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:520px;">
        <button class="al-intro-back" style="margin-bottom:12px;width:auto;" onclick="openWriting()">← Orqaga</button>
        <div class="wfx-hero" style="margin-bottom:14px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </div>
        <h2 class="wfx-title" style="margin-bottom:6px;">Imtihon formatini tanlang</h2>
        <p class="wfx-sub" style="margin-bottom:20px;">Qaysi formatda topshirasiz?</p>

        <div class="wfx-card auto" onclick="startWriting()" role="button">
          <div class="wfx-card-head">
            <div class="wfx-icon auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V5"/><circle cx="12" cy="3.6" r="1" fill="#fff" stroke="none"/><circle cx="9" cy="13.5" r="1.3" fill="#fff" stroke="none"/><circle cx="15" cy="13.5" r="1.3" fill="#fff" stroke="none"/><path d="M9.5 17h5"/></svg>
            </div>
            <div>
              <div class="wfx-card-title">Writing Mock (Avto)</div>
              <span class="wfx-badge auto">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>
                AI baholaydi
              </span>
            </div>
          </div>
          <p class="wfx-desc">AI mavzu beradi va javobni darhol o'zi baholaydi — band ball shu zahoti chiqadi</p>
        </div>

        <div class="wfx-card manual" onclick="openWritingManual()" role="button">
          <div class="wfx-card-head">
            <div class="wfx-icon manual">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>
            </div>
            <div>
              <div class="wfx-card-title">Writing Mock (Qo‘lda)</div>
              <span class="wfx-badge manual">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/></svg>
                Ustoz tekshiradi
              </span>
            </div>
          </div>
          <p class="wfx-desc">Ustozimiz tayyorlagan savol beriladi, javobingizni yuboring — ustozimiz tekshirib, natijani shu bo‘limda e’lon qiladi</p>
        </div>
      </div>`;
  }

  /* ---------- AVTO (AI baholaydi) ---------- */

  function startWriting(){
    showPanel('writing','Writing Mock (Avto)');
    clearInterval(writingTimer);
    writingState = { mode:"auto", active:false };
    const chips = WRITING_CRITERIA.map(function(c){
      return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;padding:5px 12px;border-radius:100px;background:var(--field);border:1px solid var(--line);"><span style="width:8px;height:8px;border-radius:50%;background:' + c.color + ';"></span>' + c.label + '</span>';
    }).join('');
    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:560px;">
        <div class="wri-topic" style="text-align:center;padding:26px 24px;">
          <div class="wfx-icon auto" style="margin:0 auto 14px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <h2 style="font-family:'Fraunces',serif;font-size:22px;margin-bottom:12px;">IELTS Writing Task 2</h2>
          <p style="font-size:14px;color:var(--ink-soft);line-height:1.7;margin-bottom:16px;">Bu bo'limda sizga IELTS Writing mavzusi beriladi. Esseingiz 5 qismda yoziladi: <b style="color:var(--ink);">Introduction (Paraphrase + Thesis), Body 1, Body 2</b> va <b style="color:var(--ink);">Conclusion</b>. Sun'iy intellekt har bir qismni alohida qat'iy tekshiradi va IELTS tizimi bo'yicha 0 dan 9 gacha ball beradi.</p>
          <div class="wri-note">ℹ️ Baholash IELTS'ning 4 ta rasmiy mezonlari bo'yicha amalga oshiriladi. Har bir mezon alohida baholanadi va o'rtacha ball yakuniy natija sifatida ko'rsatiladi.</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:14px 0 22px;">${chips}</div>
          <button class="wri-btn" onclick="writingGenerate()">🚀 Boshlash</button>
        </div>
      </div>`;
  }

  function writingGenerate(){
    clearInterval(writingTimer);
    showPanel('writing','Writing Mock (Avto)');
    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:520px;">
        <div class="wmx-sub-item" style="text-align:center;padding:46px 24px;">
          <div class="wri-spin"></div>
          <h2 style="font-family:'Fraunces',serif;font-size:21px;margin-bottom:8px;">Mavzu yaratilmoqda...</h2>
          <p style="font-size:13.5px;color:var(--ink-soft);">Sun'iy intellekt sizga mos yangi Task 2 mavzusini tanlamoqda</p>
        </div>
      </div>`;
    const started = Date.now();
    aiGenerate('writing', 'B2', 30000)
      .then(function(d){ return (d && d.topic) ? String(d.topic) : null; })
      .catch(function(e){ console.warn('Writing mavzusi AI bilan olinmadi, lokal bank ishlatiladi', e); return null; })
      .then(function(aiTopic){
        const wait = Math.max(0, 1800 - (Date.now() - started));
        setTimeout(function(){
          const topic = aiTopic || sbPickFresh(WRITING_TOPICS, 'writing_auto') || WRITING_TOPICS[0];
          writingState = { mode:"auto", active:true, topic:topic, aiPowered: !!aiTopic };
          writingSeconds = 60*60;
          renderWritingEditor();
          clearInterval(writingTimer);
          writingTimer = setInterval(writingTick, 1000);
        }, wait);
      });
  }

  function writingTick(){
    writingSeconds--;
    const t = document.getElementById('wri-timer') || document.getElementById('wmx-timer');
    if(t) t.textContent = formatTime(Math.max(writingSeconds,0));
    if(writingSeconds <= 0){
      clearInterval(writingTimer);
      if(writingState && writingState.mode === 'manual') submitWritingManual(true);
      else submitWritingAuto(true);
    }
  }

  function renderWritingEditor(){
    const s = writingState;
    const parts = WRITING_PARTS.map(function(p, i){
      return '<div class="wri-part">'
        + '<div class="wri-part-head">'
        +   '<span class="wri-num">' + (i+1) + '</span>'
        +   '<div style="flex:1;min-width:0;"><div class="wri-part-name">' + p.name + '</div><div class="wri-part-hint">' + p.hint + '</div></div>'
        +   '<span class="wri-wc" id="wri-wc-' + i + '">0 / ' + p.min + '</span>'
        + '</div>'
        + '<textarea class="wri-ta" id="wri-ta-' + i + '" oninput="updateWriWC()"></textarea>'
        + '</div>';
    }).join('');

    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:640px;">
        <div class="wri-topic">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div style="min-width:0;">
              <div class="wri-topic-label">MAVZU</div>
              <div class="wri-topic-text">${escapeHtml(s.topic)}</div>
            </div>
            <span class="wri-timer" id="wri-timer">60:00</span>
          </div>
        </div>
        <p class="wri-time-hint">⏱ Vaqt: 60 daqiqa — vaqt tugaganda javobingiz avtomatik yuboriladi</p>
        ${parts}
        <div class="wri-total-row">
          <span>So'zlar soni: <strong id="wri-total" style="color:var(--ink);">0</strong> so'z</span>
          <span id="wri-status" style="font-weight:700;color:#ef4444;">Kamida 150 so'z yozing</span>
        </div>
        <button class="wri-btn" id="wri-submit" disabled onclick="submitWritingAuto()">Tayyor</button>
      </div>`;
  }

  function updateWriWC(){
    let total = 0, allOk = true;
    WRITING_PARTS.forEach(function(p, i){
      const el = document.getElementById('wri-ta-' + i);
      const w = wcWords(el ? el.value : '');
      total += w;
      const chip = document.getElementById('wri-wc-' + i);
      if(chip){
        chip.textContent = w + ' / ' + p.min;
        if(w >= p.min) chip.classList.add('ok'); else chip.classList.remove('ok');
      }
      if(w < p.min) allOk = false;
    });
    const tot = document.getElementById('wri-total');
    if(tot) tot.textContent = total;
    const st = document.getElementById('wri-status');
    const btn = document.getElementById('wri-submit');
    // IELTS Writing Task 2 standarti — kamida 250 so'z
    if(total < 250){
      if(st){ st.textContent = "Kamida 250 so'z yozing (IELTS standarti). Yana " + (250 - total) + " ta so'z kerak"; st.style.color = "#ef4444"; }
      if(btn){ btn.disabled = true; btn.textContent = "Kamida 250 so'z yozing"; }
    } else if(!allOk){
      if(st){ st.textContent = "Har bir qism kamida kerakli so'z soniga yetishi kerak"; st.style.color = "#f59e0b"; }
      if(btn){ btn.disabled = true; btn.textContent = "Har qismni to'ldiring"; }
    } else {
      if(st){ st.textContent = "Tayyor ✓ (" + total + " so'z)"; st.style.color = "#16a34a"; }
      if(btn){ btn.disabled = false; btn.textContent = "Tayyor"; }
    }
  }

  function wriAnalyze(topic, texts){
    const counts = texts.map(wcWords);
    const total = counts.reduce(function(a,b){ return a + b; }, 0);
    const all = texts.join(' ').toLowerCase();
    const linkerHits = WRITING_LINKERS.filter(function(l){ return all.indexOf(l) !== -1; });
    const uniq = new Set(all.replace(/[^a-z'\s]/g, ' ').split(/\s+/).filter(Boolean));
    const diversity = total ? uniq.size / total : 0;
    const sents = all.split(/[.!?]+/).map(function(x){ return x.trim(); }).filter(Boolean);
    const avgLen = sents.length ? total / sents.length : 0;

    // === HAQIQIY VALIDATSIYA: mavzuga moslik ===
    // Mavzu kalit so'zlari — foydalanuvchi javobida qanchaligi bor?
    const topicWords = (topic || '').toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter(function(w){ return w.length > 4; }); // faqat muhim so'zlar
    const topicHits = topicWords.filter(function(w){ return all.indexOf(w) !== -1; }).length;
    const relevance = topicWords.length ? topicHits / topicWords.length : 0;

    const partBands = counts.map(function(c, i){
      // Har bir qism uchun — hajm + bog'lovchi mavjudligi
      let b = 4.0 + 4 * Math.min(c / (WRITING_PARTS[i].min * 1.5), 1);
      if(i > 0 && WRITING_LINKERS.some(function(l){ return (texts[i] || '').toLowerCase().indexOf(l) !== -1; })) b += 0.5;
      // Mavzuga moslik past bo'lsa, jazo
      if(relevance < 0.2) b -= 1.0;
      return Math.max(4, Math.min(9, Math.round(b * 2) / 2));
    });

    // Task Response — hajm + mavzuga moslik
    let tr = 4.0;
    if(total >= 280 && relevance >= 0.5) tr = 8.0;
    else if(total >= 250 && relevance >= 0.4) tr = 7.5;
    else if(total >= 220 && relevance >= 0.3) tr = 7.0;
    else if(total >= 180 && relevance >= 0.25) tr = 6.5;
    else if(total >= 150) tr = 5.5;
    else if(total >= 100) tr = 5.0;
    else tr = 4.5;
    if(relevance < 0.15) tr = Math.max(4, tr - 1.5); // mavzuga to'liq mos kelmasa

    // Coherence & Cohesion — bog'lovchilar soni
    let cc = 4.0;
    if(linkerHits.length >= 8) cc = 8.0;
    else if(linkerHits.length >= 6) cc = 7.5;
    else if(linkerHits.length >= 4) cc = 7.0;
    else if(linkerHits.length >= 3) cc = 6.5;
    else if(linkerHits.length >= 2) cc = 6.0;
    else if(linkerHits.length >= 1) cc = 5.5;
    else cc = 5.0;

    // Lexical Resource — xilma-xillik + hajm
    let lr = 4.0;
    if(diversity >= 0.6 && total >= 250) lr = 8.0;
    else if(diversity >= 0.55 && total >= 220) lr = 7.5;
    else if(diversity >= 0.5 && total >= 180) lr = 7.0;
    else if(diversity >= 0.45 && total >= 150) lr = 6.5;
    else if(diversity >= 0.4) lr = 6.0;
    else if(diversity >= 0.3) lr = 5.5;
    else lr = 5.0;

    // Grammatical Range & Accuracy — gap uzunligi + tuzilma
    let gra = 4.0;
    if(avgLen >= 14 && avgLen <= 22 && sents.length >= 8) gra = 7.5;
    else if(avgLen >= 12 && avgLen <= 24 && sents.length >= 6) gra = 7.0;
    else if(avgLen >= 10 && avgLen <= 26 && sents.length >= 5) gra = 6.5;
    else if(avgLen >= 8 && avgLen <= 28) gra = 6.0;
    else if(avgLen >= 6) gra = 5.5;
    else gra = 5.0;

    const overall = Math.round(((tr + cc + lr + gra) / 4) * 2) / 2;

    const strengths = [];
    if(total >= 250) strengths.push("Hajm IELTS standartiga mos — " + total + " so'z yozilgan.");
    if(linkerHits.length >= 4) strengths.push("Bog'lovchi vositalar (however, moreover, therefore...) orinli qo'llanilgan — " + linkerHits.length + " ta.");
    if(diversity >= 0.5) strengths.push("Lug'at boyligi yaxshi — so'zlar takrori kam (" + Math.round(diversity*100) + "% xilma-xillik).");
    if(avgLen >= 12 && avgLen <= 22) strengths.push("Gap tuzilishi muvozanatli — o'rtacha " + avgLen.toFixed(1) + " so'z.");
    if(relevance >= 0.5) strengths.push("Mavzuga yuqori darajada mos (" + Math.round(relevance*100) + "% kalit so'zlar ishlatilgan).");
    if(counts.every(function(c, i){ return c >= WRITING_PARTS[i].min; })) strengths.push("Barcha 5 qism kerakli hajmga yetgan.");
    if(sents.length >= 8) strengths.push("Etarli miqdorda gap (" + sents.length + " ta) yozilgan.");
    if(!strengths.length) strengths.push("Essay 5 qismda to'liq yozildi va tahlil qilindi.");

    const weaknesses = [];
    if(total < 250) weaknesses.push("Hajm yetarli emas — IELTS standarti kamida 250 so'z. Hozir " + total + " so'z.");
    if(linkerHits.length < 3) weaknesses.push("Bog'lovchi vositalar yetarli emas — however, moreover, therefore kabilarni qo'shing.");
    if(diversity < 0.4) weaknesses.push("Ba'zi so'zlar takrorlangan — sinonimlardan foydalaning (xilma-xillik " + Math.round(diversity*100) + "%).");
    if(avgLen < 10) weaknesses.push("Gaplar juda qisqa (o'rtacha " + avgLen.toFixed(1) + " so'z) — ularni murakkab gaplarga birlashtiring.");
    if(avgLen > 28) weaknesses.push("Gaplar juda uzun (o'rtacha " + avgLen.toFixed(1) + " so'z) — bir nechta gapga bo'lib yozing.");
    if(relevance < 0.3) weaknesses.push("Mavzuga moslik zaif — savolga aniq javob bering, kalit so'zlardan foydalaning.");
    counts.forEach(function(c, i){
      if(c < WRITING_PARTS[i].min) weaknesses.push("«" + WRITING_PARTS[i].name + "» qismi minimal hajmdan qisqa (" + c + "/" + WRITING_PARTS[i].min + " so'z).");
    });
    if(!weaknesses.length) weaknesses.push("Jiddiy zaif tomon aniqlanmadi — davom eting!");

    const errors = [];
    const topicWordsIntro = (topic || "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(function(w){ return w.length > 5; });
    if(topicWordsIntro.length){
      const p0 = (texts[0] || "").toLowerCase();
      const copied = topicWordsIntro.filter(function(w){ return p0.indexOf(w) !== -1; }).length;
      if(copied / topicWordsIntro.length > 0.6) errors.push("Introduction'da savol so'zlari deyarli ko'chirilgan — o'z so'zlaringiz bilan paraphrase qiling.");
    }
    const lowerISents = sents.filter(function(x){ return /^[a-z]/.test(x); }).length;
    if(lowerISents > 0) errors.push(lowerISents + " ta gap bosh harf bilan boshlanmagan.");
    if(/\bi\b(?!\')/.test(all) && !/\bI\b/.test(texts.join(' '))) errors.push("«i» zamiri doim katta harf bilan yoziladi (I).");
    if(!errors.length) errors.push("Juda ko'p grammatik xato aniqlanmadi ✓");

    return {
      counts:counts, total:total, partBands:partBands,
      criteria:{ tr:tr, cc:cc, lr:lr, gra:gra },
      overall:overall,
      strengths:strengths, weaknesses:weaknesses, errors:errors,
      // Qo'shimcha statistika
      relevance:Math.round(relevance*100),
      diversity:Math.round(diversity*100),
      linkers:linkerHits.length,
      sentences:sents.length,
      avgLen:avgLen.toFixed(1)
    };
  }

  function aiMergeWritingResult(localRes, ai){
    const clamp = function(v){
      const n = Number(v);
      if(!isFinite(n)) return 4;
      return Math.max(0, Math.min(9, Math.round(n * 2) / 2));
    };
    const crit = (ai && ai.criteria) || {};
    const criteria = {
      tr: clamp(crit.tr != null ? crit.tr : localRes.criteria.tr),
      cc: clamp(crit.cc != null ? crit.cc : localRes.criteria.cc),
      lr: clamp(crit.lr != null ? crit.lr : localRes.criteria.lr),
      gra: clamp(crit.gra != null ? crit.gra : localRes.criteria.gra)
    };
    const avg = (criteria.tr + criteria.cc + criteria.lr + criteria.gra) / 4;
    const overall = clamp(ai && ai.overall != null ? ai.overall : avg);
    const partBands = (ai && Array.isArray(ai.partBands) && ai.partBands.length === 5)
      ? ai.partBands.map(clamp)
      : localRes.partBands.slice();
    const arr = function(x){
      return Array.isArray(x) ? x.map(String).filter(Boolean).slice(0, 8) : [];
    };
    const strengths = arr(ai && ai.strengths);
    const weaknesses = arr(ai && ai.weaknesses);
    const errors = arr(ai && ai.errors);
    return Object.assign({}, localRes, {
      criteria: criteria,
      overall: overall,
      partBands: partBands,
      strengths: strengths.length ? strengths : localRes.strengths,
      weaknesses: weaknesses.length ? weaknesses : localRes.weaknesses,
      errors: errors.length ? errors : localRes.errors,
      aiPowered: true
    });
  }

  function submitWritingAuto(autoExpired){
    clearInterval(writingTimer);
    const s = writingState || { mode:"auto", topic:"" };
    const texts = WRITING_PARTS.map(function(p, i){
      const el = document.getElementById('wri-ta-' + i);
      return el ? el.value.trim() : '';
    });
    const res = wriAnalyze(s.topic, texts);

    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:520px;">
        <div class="wmx-sub-item" style="text-align:center;padding:46px 24px;">
          ${autoExpired ? '<p style="font-weight:800;color:#f59e0b;margin-bottom:14px;">⏰ Vaqt tugadi! Esseingiz avtomatik tekshirishga yuborilmoqda...</p>' : ''}
          <div class="wri-spin"></div>
          <h2 style="font-family:'Fraunces',serif;font-size:21px;margin-bottom:8px;">Baholash</h2>
          <p style="font-size:13.5px;color:var(--ink-soft);line-height:1.65;"><b style="color:var(--ink);">Esseyingiz baholanmoqda...</b><br>Sun'iy intellekt IELTS mezonlari bo'yicha tekshirmoqda. Iltimos kuting...</p>
        </div>
      </div>`;

    // Avval haqiqiy AI (OpenAI/Gemini) baholaydi. Backend yo'q yoki kalit yo'q bo'lsa — lokal tahlil.
    aiApiPost('/api/ai/score-writing', {
      task: s.topic || '',
      parts: texts,
      essay: texts.join('\n\n')
    }, 45000).then(function(data){
      if(!data || !data.criteria) throw new Error('AI javobi noto\'g\'ri');
      renderWritingResult(aiMergeWritingResult(res, data));
    }).catch(function(err){
      if(err && err.status !== 503) console.warn('AI writing fallback:', err.message || err);
      setTimeout(function(){ renderWritingResult(res); }, 1200);
    });
  }

  function renderWritingResult(res){
    testProgress.writing = {
      completed: true,
      band: res.overall,
      pct: Math.round(res.overall / 9 * 100),
      score: 'Band ' + res.overall + ' (' + res.total + " so'z)",
      date: new Date().toISOString().split('T')[0]
    };
    if(typeof saveUserProgress === 'function') saveUserProgress();
    if(typeof updateResultsDisplay === 'function') updateResultsDisplay();

    const parts = res.partBands.map(function(b, i){
      return '<span style="display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:100px;background:var(--field);border:1px solid var(--line);">' + WRITING_PARTS[i].name.split('—')[0].trim() + ' <b style="color:#16a34a;">' + b + '</b></span>';
    }).join('');

    const crits = WRITING_CRITERIA.map(function(c){
      const v = res.criteria[c.key];
      return '<div class="wri-crit">'
        + '<div class="wri-crit-top"><span class="wri-crit-label">' + c.label + '</span><span class="wri-crit-band" style="background:' + c.color + ';">' + v + '</span></div>'
        + '<div class="wri-crit-bar"><div class="wri-crit-fill" style="width:' + Math.round(v / 9 * 100) + '%;background:' + c.color + ';"></div></div>'
        + '</div>';
    }).join('');

    const list = function(arr){ return '<ul>' + arr.map(function(x){ return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul>'; };

    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:560px;">
        <h2 style="font-family:'Fraunces',serif;font-size:23px;text-align:center;margin-bottom:18px;">🎯 IELTS Writing Natija${res.aiPowered ? ' <span style="display:inline-block;vertical-align:middle;font-family:Manrope,sans-serif;font-size:10.5px;font-weight:800;letter-spacing:.04em;background:linear-gradient(90deg,#a855f7,#7e22ce);color:#fff;padding:3px 9px;border-radius:100px;">AI</span>' : ''}</h2>
        <div style="background:linear-gradient(135deg,#22c55e,#15803d);color:#fff;border-radius:18px;padding:24px;text-align:center;margin-bottom:18px;">
          <div style="font-size:13px;opacity:.92;">Umumiy ball</div>
          <div style="font-size:52px;font-weight:800;font-family:'Fraunces',serif;line-height:1.15;">${res.overall}</div>
          <div style="font-size:13px;opacity:.92;">O'zlashtirish: ${Math.round(res.overall / 9 * 100)}% · ${res.total} so'z</div>
        </div>
        <div style="margin-bottom:20px;">
          <div style="font-size:13px;font-weight:800;letter-spacing:.04em;color:var(--ink-soft);margin-bottom:10px;">QISMLAR BO'YICHA BAHOLAR</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">${parts}</div>
        </div>
        <div class="wmx-sub-item" style="margin-bottom:18px;">
          <div style="font-size:13px;font-weight:800;letter-spacing:.04em;color:var(--ink-soft);margin-bottom:14px;">IELTS MEZONLARI BO'YICHA</div>
          ${crits}
        </div>
        <div class="wmx-sub-item" style="margin-bottom:18px;">
          <div style="font-size:13px;font-weight:800;letter-spacing:.04em;color:var(--ink-soft);margin-bottom:14px;">💡 AI FIKR VA TAVSIYALAR</div>
          <div class="wri-fb ok"><b style="color:#16a34a;">✅ Kuchli tomonlar</b>${list(res.strengths)}</div>
          <div class="wri-fb warn"><b style="color:#d97706;">⚠️ Zaif tomonlar</b>${list(res.weaknesses)}</div>
          <div class="wri-fb err"><b style="color:#ef4444;">❌ Xatoliklar</b>${list(res.errors)}</div>
        </div>
        <button class="wri-btn" onclick="writingGenerate()">🔄 Qayta yozish</button>
        <button class="dash-btn dash-btn-outline" style="width:100%;margin-top:10px;" onclick="switchTab('home')">🏠 Bosh sahifa</button>
      </div>`;
  }

  /* ---------- QO'LDA (ustoz tekshiradi) ---------- */

  const WRITING_TEACHER_TASKS = [
    { title:'Education & Technology', text:"Some people believe that technology has made learning easier and more accessible. Others argue that it has created more problems than benefits for students.\n\nDiscuss both views and give your own opinion. Write at least 250 words." },
    { title:'Environment & Responsibility', text:"Many people think that protecting the environment is the responsibility of governments, while others believe every individual should take action.\n\nDiscuss both views and give your own opinion. Write at least 250 words." },
    { title:'Work & Career', text:"Nowadays many young people prefer to work for international companies rather than local businesses.\n\nWhat are the advantages and disadvantages of this choice? Give reasons and include any relevant examples. Write at least 250 words." },
    { title:'Cities & Lifestyle', text:"More and more people are moving from rural areas to big cities.\n\nWhat problems does this cause? How can these problems be solved? Write at least 250 words." },
    { title:'Health & Sport', text:"Some people believe that governments should invest more in preventive healthcare and sport rather than in treating illnesses.\n\nTo what extent do you agree or disagree? Write at least 250 words." },
    { title:'Media & Society', text:"Social media companies collect large amounts of personal data from their users.\n\nDo the advantages of this practice outweigh the disadvantages? Write at least 250 words." },
    { title:'Travel & Culture', text:"International tourism helps people understand other cultures, but it can also damage local traditions and environments.\n\nDiscuss both sides and give your own opinion. Write at least 250 words." },
    { title:'Education & Exams', text:"Some people argue that final examinations are the fairest way to assess students, while others believe continuous assessment is better.\n\nDiscuss both views and give your own opinion. Write at least 250 words." }
  ];

  function getWritingSubs(){
    try {
      const arr = JSON.parse(localStorage.getItem('sb_writing_subs') || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch(e){ return []; }
  }
  function saveWritingSubs(arr){
    try { localStorage.setItem('sb_writing_subs', JSON.stringify(arr.slice(0,100))); } catch(e){}
  }

  function openWritingManual(){
    showPanel('writing',"Writing Mock (Qo'lda)");
    clearInterval(writingTimer);
    writingState = null;
    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:640px;">
        <div class="wmx-sub-item" style="text-align:center;padding:28px 24px;">
          <div class="wfx-icon manual" style="margin:0 auto 14px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>
          </div>
          <h2 style="font-family:'Fraunces',serif;font-size:21px;margin-bottom:10px;">Writing Mock (Qo'lda)</h2>
          <p style="font-size:14px;color:var(--ink-soft);line-height:1.7;margin-bottom:20px;">Sizga IELTS Writing mavzusi beriladi (savollarni ustozimiz tayyorlaydi). Javobingizni to'liq insho qilib YOZING (kamida 150 so'z) — ustozimiz tekshiradi va natijani shu bo'limda e'lon qiladi.</p>
          <button class="wri-btn purple" onclick="writingManualLoad()">📥 Mavzu olish</button>
        </div>
        <div id="wri-manual-area"></div>
      </div>`;
    renderWritingSubsList('wri-manual-area');
  }

  function writingManualLoad(){
    clearInterval(writingTimer);
    const session = getSession();
    const subs = getWritingSubs();
    const myCount = session ? subs.filter(function(x){ return x.email === session.email; }).length : 0;
    const task = sbPickFresh(WRITING_TEACHER_TASKS, 'writing_manual_' + (session ? session.email : 'guest')) || WRITING_TEACHER_TASKS[0];
    writingState = { mode:"manual", active:true, task:task };
    writingSeconds = 60*60;
    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:640px;">
        <div class="wri-topic">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div style="min-width:0;">
              <div class="wri-topic-label">MAVZU — USTOZ TAYYORLAGAN</div>
              <div class="wri-topic-text">${escapeHtml(task.title)}</div>
              <div style="font-size:13.5px;color:var(--ink-soft);line-height:1.7;margin-top:8px;white-space:pre-line;">${escapeHtml(task.text)}</div>
            </div>
            <span class="wri-timer purple" id="wmx-timer">60:00</span>
          </div>
        </div>
        <p class="wri-time-hint">⏱ Vaqt: 60 daqiqa — vaqt tugaganda javobingiz avtomatik ustozga yuboriladi</p>
        <textarea id="wmx-essay" placeholder="Esseyingizni shu yerga yozing... Kamida 150 so'z yozing!" oninput="updateWMXWC()"></textarea>
        <div class="wri-total-row">
          <span>So'zlar soni: <strong id="wmx-wc" style="color:var(--ink);">0</strong> so'z</span>
          <span id="wmx-wc-status" style="font-weight:700;color:#ef4444;">Kamida 150 so'z yozing</span>
        </div>
        <button class="wri-btn purple" id="wmx-submit" disabled onclick="submitWritingManual()">Tayyor</button>
        <button class="dash-btn dash-btn-outline" style="width:100%;margin-top:10px;" onclick="openWritingManual()">← Orqaga</button>
      </div>`;
    clearInterval(writingTimer);
    writingTimer = setInterval(writingTick, 1000);
  }

  function updateWMXWC(){
    const el = document.getElementById('wmx-essay');
    if(!el) return;
    const w = wcWords(el.value);
    const wc = document.getElementById('wmx-wc');
    const st = document.getElementById('wmx-wc-status');
    const btn = document.getElementById('wmx-submit');
    if(wc) wc.textContent = w;
    if(st){
      if(w >= 150){ st.textContent = "Tayyor ✓"; st.style.color = "#16a34a"; }
      else { st.textContent = "Yana " + (150 - w) + " ta so'z kerak"; st.style.color = "#ef4444"; }
    }
    if(btn){ btn.disabled = w < 150; btn.textContent = w < 150 ? "Kamida 150 so'z yozing" : "Tayyor"; }
  }

  function submitWritingManual(autoExpired){
    clearInterval(writingTimer);
    const el = document.getElementById('wmx-essay');
    const text = el ? el.value.trim() : '';
    const words = wcWords(text);
    if(!autoExpired && words < 150){
      alert("Kamida 150 so'z yozing!");
      return;
    }
    const session = getSession() || {};
    const subs = getWritingSubs();
    const task = (writingState && writingState.task) || WRITING_TEACHER_TASKS[0];
    subs.unshift({
      id: 'wmx' + Date.now(),
      email: session.email || '',
      name: session.name || session.email || "O'quvchi",
      taskTitle: task.title,
      taskText: task.text,
      answer: text,
      words: words,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      band: null,
      feedback: ''
    });
    saveWritingSubs(subs);
    writingState = null;

    document.getElementById('writing-content').innerHTML = `
      <div class="wfx-wrap" style="max-width:640px;">
        <div class="wmx-sub-item" style="text-align:center;padding:34px 24px;">
          ${autoExpired ? '<p style="font-weight:800;color:#f59e0b;margin-bottom:12px;">⏰ Vaqt tugadi! Javobingiz avtomatik ustozga yuborilmoqda...</p>' : ''}
          <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#7e22ce);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;color:#fff;">✓</div>
          <h2 style="font-family:'Fraunces',serif;font-size:22px;margin-bottom:8px;">Javobingiz qabul qilindi!</h2>
          <p style="font-size:14px;color:var(--ink-soft);line-height:1.65;margin-bottom:20px;">Tez orqada tekshirib javobni aytamiz. Natija shu bo'limda ko'rinadi.</p>
          <button class="wri-btn purple" onclick="writingManualLoad()">📤 Yana yuborish</button>
          <button class="dash-btn dash-btn-outline" style="width:100%;margin-top:10px;" onclick="switchTab('home')">🏠 Bosh sahifa</button>
        </div>
        <div id="wri-manual-area"></div>
      </div>`;
    renderWritingSubsList('wri-manual-area');
  }

  function renderWritingSubsList(containerId){
    const c = document.getElementById(containerId);
    if(!c) return;
    const session = getSession() || {};
    const subs = getWritingSubs();
    const mine = subs.filter(function(s){ return s.email === session.email; });
    const admin = (typeof isAdmin === 'function') && isAdmin();

    const bandOptions = [4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9].map(function(b){
      return '<option value="' + b + '">Band ' + b + '</option>';
    }).join('');

    const itemHtml = function(s, withGrade){
      const graded = s.status === 'graded';
      const d = new Date(s.submittedAt);
      const dateStr = isNaN(d.getTime()) ? '' : d.toLocaleDateString('uz-UZ');
      let h = '<div class="wmx-sub-item">'
        + '<div class="wmx-sub-head">'
        +   '<div class="wmx-sub-title">📚 ' + escapeHtml(s.taskTitle) + (s.name ? ' <span style="font-weight:600;color:var(--ink-soft);font-size:12.5px;">· ' + escapeHtml(s.name) + '</span>' : '') + '</div>'
        +   (graded
            ? '<span class="wmx-badge-st graded">✅ Baholandi — Band ' + s.band + '</span>'
            : '<span class="wmx-badge-st pending">⏳ Tekshirilmoqda</span>')
        + '</div>'
        + '<div class="wmx-meta">📅 ' + dateStr + ' · ' + (s.words || 0) + " so'z</div>"
        + '<div class="wmx-answer">' + escapeHtml(s.answer || "(bo'sh javob)") + '</div>';
      if(graded){
        h += '<div class="wmx-band-box">'
          + '<div class="wmx-band-num">' + s.band + '</div>'
          + '<div><div style="font-size:12px;opacity:.9;">Ustoz bahosi</div><div style="font-size:13px;font-weight:700;">Band ' + s.band + ' · ' + Math.round(s.band / 9 * 100) + '%</div></div>'
          + '</div>';
        if(s.feedback) h += '<div class="wmx-feedback">💬 <strong>Ustoz izohi:</strong> ' + escapeHtml(s.feedback) + '</div>';
      }
      if(withGrade && !graded){
        h += '<div class="wmx-grade-row">'
          + '<select id="wmx-band-' + s.id + '">' + bandOptions + '</select>'
          + '<input type="text" id="wmx-fb-' + s.id + '" placeholder="Izoh (ixtiyoriy)...">'
          + '<button type="button" class="wmx-grade-btn" onclick="gradeWritingSub(\'' + s.id + '\')">Baholash</button>'
          + '</div>';
      }
      h += '</div>';
      return h;
    };

    let html = '<div class="wmx-section-label" style="margin-top:22px;">📥 Oxirgi yuborgan javoblaringiz (' + mine.length + ')</div>';
    if(!mine.length){
      html += '<div class="wmx-empty">Hali javob yubormagansiz. «Mavzu olish» tugmasini bosib, birinchi essayingizni yuboring ✍️</div>';
    } else {
      html += mine.map(function(s){ return itemHtml(s, false); }).join('');
    }

    if(admin){
      const pending = subs.filter(function(s){ return s.status !== 'graded'; });
      html += '<div class="wmx-section-label">🧑‍🏫 Ustoz uchun — tekshirish (' + pending.length + ' kutilmoqda)</div>';
      if(!pending.length){
        html += '<div class="wmx-empty">Tekshirilishi kerak bo\'lgan javob yo\'q ✓</div>';
      } else {
        html += pending.map(function(s){ return itemHtml(s, true); }).join('');
      }
    }
    html += '<button class="dash-btn dash-btn-outline" style="width:100%;margin-top:18px;" onclick="openWriting()">← Format tanlash</button>';
    c.innerHTML = html;
  }

  function gradeWritingSub(id){
    const subs = getWritingSubs();
    const s = subs.find(function(x){ return x.id === id; });
    if(!s) return;
    const bandEl = document.getElementById('wmx-band-' + id);
    const fbEl = document.getElementById('wmx-fb-' + id);
    const band = parseFloat(bandEl ? bandEl.value : '0');
    const fb = fbEl ? fbEl.value.trim() : '';
    if(!band || band < 4 || band > 9){
      alert("Band 4.0 – 9.0 orasida bo'lishi kerak!");
      return;
    }
    s.status = 'graded';
    s.band = band;
    s.feedback = fb;
    s.gradedAt = new Date().toISOString();
    saveWritingSubs(subs);
    wmxApplyGradeToStudent(s.email, s);
    renderWritingSubsList('wri-manual-area');
  }

  function wmxApplyGradeToStudent(email, sub){
    if(!email || !sub) return;
    try {
      const key = 'sb_progress_' + email;
      const data = JSON.parse(localStorage.getItem(key) || 'null');
      if(data && data.testProgress){
        data.testProgress.writing = {
          completed: true,
          band: sub.band,
          pct: Math.round(sub.band / 9 * 100),
          score: 'Band ' + sub.band + ' (ustoz bahosi)',
          date: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch(e){}
    // Agar admin o'z javobini baholayotgan bo'lsa — joriy testProgress va UI ni yangilash
    const session = getSession();
    if(session && session.email === email){
      if(typeof testProgress !== 'undefined'){
        testProgress.writing = {
          completed: true,
          band: sub.band,
          pct: Math.round(sub.band / 9 * 100),
          score: 'Band ' + sub.band + ' (ustoz bahosi)',
          date: new Date().toISOString().split('T')[0]
        };
        if(typeof saveUserProgress === 'function') saveUserProgress();
        if(typeof updateResultsDisplay === 'function') updateResultsDisplay();
        if(typeof updateCertificateAvailability === 'function') updateCertificateAvailability();
      }
    }
  }

