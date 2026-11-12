// Englify — home-recent
  const RECENT_ICONS = {
    daily: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8v6a4 4 0 0 1-8 0V3z"/><path d="M8 5H5v1a3.5 3.5 0 0 0 3.5 3.5M16 5h3v1a3.5 3.5 0 0 1-3.5 3.5"/><path d="M12 13v5M9 21h6"/></svg>',
    writing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.8 3.6a2.1 2.1 0 0 1 3 3L8.4 18l-4.2 1.2L5.4 15 16.8 3.6z"/><path d="M14.4 6l3 3"/></svg>',
    speaking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21M9 21h6"/></svg>',
    reading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.4C10.4 5.1 8.2 4.5 4.5 4.5v13c3.7 0 5.9.6 7.5 1.9 1.6-1.3 3.8-1.9 7.5-1.9v-13c-3.7 0-5.9.6-7.5 1.9z"/><path d="M12 6.4v13"/></svg>',
    listening: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-1.5a8 8 0 0 1 16 0V14"/><rect x="2.5" y="13.5" width="4" height="6.5" rx="2"/><rect x="17.5" y="13.5" width="4" height="6.5" rx="2"/></svg>',
    aispeaking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3.5 12.7 8 17 9.7 12.7 11.4 11 16l-1.7-4.6L5 9.7 9.3 8 11 3.5z"/><path d="M18 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"/></svg>',
    battle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4.5 13.5H10L9 22l8.5-11.5H12L13 2z"/></svg>',
    fullexam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4z"/><path d="M6 10.5v4.8c0 1.7 2.7 3.2 6 3.2s6-1.5 6-3.2v-4.8"/><path d="M21.5 8.5v5"/></svg>',
    videos: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.52.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.1L12 16.9 6.4 20l1.3-6.1L3 9.6l6.3-.7L12 3z"/></svg>'
  };

  function renderRecent(){
    // ALILM uslubidagi "SO'NGGI TESTLAR" grid — mock test natijalari bilan
    const homeList = document.getElementById('recent-list');
    const crtList = document.getElementById('crt-recent-list');

    // 1) Home panel dagi "SO'NGGI TESTLAR" — mock test natijalari
    if(homeList){
      const items = [];
      // Mock test natijalari testProgress dan
      const mockMeta = [
        {key:'daily', ic: RECENT_ICONS.daily, bg:'linear-gradient(180deg,#ffa53a,#f97316)', name:'Daily Tests'},
        {key:'writing', ic: RECENT_ICONS.writing, bg:'linear-gradient(180deg,#4cd964,#16a34a)', name:'Writing Mock'},
        {key:'speaking', ic: RECENT_ICONS.speaking, bg:'linear-gradient(180deg,#ff6259,#dc2626)', name:'Speaking Mock'},
        {key:'reading', ic: RECENT_ICONS.reading, bg:'linear-gradient(180deg,#3cc3d6,#0d9488)', name:'Reading Mock'},
        {key:'listening', ic: RECENT_ICONS.listening, bg:'linear-gradient(180deg,#7b78f2,#4f46e5)', name:'Listening Mock'},
        {key:'aispeaking', ic: RECENT_ICONS.aispeaking, bg:'linear-gradient(180deg,#4f8ef7,#2563eb)', name:'AI Speaking', isDone:true},
        {key:'battle', ic: RECENT_ICONS.battle, bg:'linear-gradient(180deg,#ff6259,#b91c1c)', name:'Battle Mode'},
        {key:'fullexam', ic: RECENT_ICONS.fullexam, bg:'linear-gradient(180deg,#2f6fd6,#0e2a5c)', name:'Full Exam'},
        {key:'videos', ic: RECENT_ICONS.videos, bg:'linear-gradient(180deg,#5b8def,#2563eb)', name:'Vidiolar'}
      ];
      mockMeta.forEach(function(m){
        const t = testProgress[m.key];
        if(!t) return;
        if(m.key === 'videos'){
          if(t.count > 0){
            items.push({
              ic: m.ic, bg: m.bg, name: m.name,
              date: t.date || '',
              score: t.pct + '%', scoreClass: t.pct >= 80 ? 'high' : t.pct >= 60 ? 'mid' : 'low'
            });
          }
        } else if(t.completed){
          let scoreText, scoreClass;
          if(m.isDone){
            scoreText = '✓'; scoreClass = 'done';
          } else if(m.key === 'writing' || m.key === 'speaking'){
            // Band score → foiz
            const pct = Math.round(Number(t.band) / 9 * 100);
            scoreText = pct + '%';
            scoreClass = pct >= 80 ? 'high' : pct >= 60 ? 'mid' : 'low';
          } else {
            scoreText = t.pct + '%';
            scoreClass = t.pct >= 80 ? 'high' : t.pct >= 60 ? 'mid' : 'low';
          }
          items.push({
            ic: m.ic, bg: m.bg, name: m.name,
            date: t.date || '',
            score: scoreText, scoreClass: scoreClass
          });
        }
      });
      // Foydalanuvchi yaratgan testlar
      recentTests.slice(0, 5).forEach(function(t){
        items.push({
          ic: RECENT_ICONS.star, bg: 'linear-gradient(180deg,#7b78f2,#4f46e5)',
          name: t.title || 'Mening testim',
          date: t.date || '',
          score: t.count ? t.count + ' savol' : 'Yangi',
          scoreClass: 'done'
        });
      });

      if(!items.length){
        homeList.innerHTML = '<div class="al-recent-empty">Hali testlar yo\'q. Yuqoridagi bo\'limlardan testlarni boshlang!</div>';
      } else {
        homeList.innerHTML = items.slice(0, 8).map(function(it){
          return '<div class="al-recent-item">'
            + '<div class="al-recent-ic" style="background:' + it.bg + ';">' + it.ic + '</div>'
            + '<div class="al-recent-info">'
            + '<div class="al-recent-name">' + escapeHtml(it.name) + '</div>'
            + '<div class="al-recent-date">' + escapeHtml(it.date) + '</div>'
            + '</div>'
            + '<span class="al-recent-score ' + it.scoreClass + '">' + it.score + '</span>'
            + '</div>';
        }).join('');
      }
    }

    // 2) Create panel dagi ro'yxat (eski uslub saqlangan)
    if(crtList){
      if(!recentTests.length){
        crtList.className = 'empty';
        crtList.innerHTML = "Hali testlar yo'q. Birinchi testni yarating!";
        return;
      }
      crtList.className = '';
      crtList.innerHTML = recentTests.slice(0,20).map(function(tItem, idx){
        const meta = tItem.date + (tItem.count ? ' · ' + tItem.count + ' savol' : '') + ' · ' + (tItem.time || 10) + 's/savol';
        return '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 18px;border:1px solid var(--line);border-radius:12px;margin-bottom:10px;background:var(--card);">'
          + '<div style="min-width:0;">'
          + '<strong style="font-size:14.5px;">' + escapeHtml(tItem.title) + '</strong>'
          + '<div style="font-size:12px;color:var(--ink-soft);margin-top:2px;">' + escapeHtml(meta) + '</div>'
          + '</div>'
          + '<div style="display:flex;gap:8px;flex-shrink:0;">'
          + '<button class="dash-btn dash-btn-outline" style="padding:6px 12px;font-size:12px;" onclick="crtCopyLink(\'' + tItem.link + '\', this)">Havola</button>'
          + '<button class="dash-btn dash-btn-outline" style="padding:6px 10px;font-size:12px;color:#e11d48;border-color:#fda4af;" onclick="crtDeleteTest(' + idx + ')" title="O\u2018chirish">🗑</button>'
          + '</div>'
          + '</div>';
      }).join('');
    }
  }

  // === ALILM-STYLE HOME: XP/Level hisoblash va user card yangilash ===
  function computeUserXP(){
    let xp = 0;
    // Har bir bajarilgan test uchun XP
    if(testProgress.listening && testProgress.listening.completed) xp += Math.round((testProgress.listening.pct || 0) / 10) + 10;
    if(testProgress.reading && testProgress.reading.completed) xp += Math.round((testProgress.reading.pct || 0) / 10) + 10;
    if(testProgress.writing && testProgress.writing.completed) xp += Math.round((testProgress.writing.pct || 0) / 10) + 15;
    if(testProgress.speaking && testProgress.speaking.completed) xp += Math.round((testProgress.speaking.pct || 0) / 10) + 15;
    if(testProgress.daily && testProgress.daily.completed) xp += Math.round((testProgress.daily.pct || 0) / 10) + 5;
    if(testProgress.aispeaking && testProgress.aispeaking.completed) xp += Math.round((testProgress.aispeaking.pct || 0) / 10) + 10;
    if(testProgress.battle && testProgress.battle.completed) xp += Math.round((testProgress.battle.pct || 0) / 10) + 10;
    if(testProgress.fullexam && testProgress.fullexam.completed) xp += Math.round((testProgress.fullexam.pct || 0) / 5) + 30;
    if(testProgress.videos && testProgress.videos.count) xp += testProgress.videos.count * 5;
    return xp;
  }

  function updateHomeUserInfo(){
    const session = getSession();
    if(!session) return;
    const name = session.name || 'Foydalanuvchi';
    const ini = name.charAt(0).toUpperCase();
    const xp = computeUserXP();
    // Level: har 1000 XP = 1 level
    const level = Math.floor(xp / 1000) + 1;
    const xpInLevel = xp % 1000;
    const xpToNext = 1000 - xpInLevel;
    const pct = Math.round(xpInLevel / 1000 * 100);

    const setText = function(id, val){ const el = document.getElementById(id); if(el) el.textContent = val; };
    const setWidth = function(id, val){ const el = document.getElementById(id); if(el) el.style.width = val + '%'; };

    setText('al-home-username', name);
    setText('al-home-level', 'Level ' + level);
    setText('al-home-xp', xp + ' XP');
    setText('al-home-xp-hint', (level + 1) + '-darajagacha yana ' + xpToNext + ' XP kerak');
    setWidth('al-home-xp-bar', pct);
    setText('al-home-avatar', ini);
    setText('dash-welcome-eyebrow', 'Salom, ' + name.split(' ')[0] + '!');
  }

  // Test kodi bilan qo'shilish (demo — agar backend bo'lmasa, xabar ko'rsatadi)
  function joinTestByCode(){
    const input = document.getElementById('al-test-code-input');
    if(!input) return;
    const code = input.value.trim().toUpperCase();
    if(!code){
      alert('Iltimos, test kodini kiriting (masalan: A_EVWMJ6)');
      return;
    }
    // Avval foydalanuvchi yaratgan testlar orasidan qidiramiz
    const found = recentTests.find(function(t){ return t.link && t.link.toUpperCase().includes(code); });
    if(found){
      // Testni ochamiz
      if(typeof crtStartTest === 'function'){
        crtStartTest(found);
      } else {
        alert('Test topildi: "' + found.title + '". Tez orada ochiladi!');
      }
      return;
    }
    // Topilmasa — demo xabar
    alert('Test kodi "' + code + '" topilmadi.\n\nMavjud test kodlari uchun "Yangi test yaratish" tugmasi orqali test yarating va kodni do\'stlarga ulashing.');
  }

