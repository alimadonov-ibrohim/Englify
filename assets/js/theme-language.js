// Englify — theme-language
  // ========== THEME (Qorong'u / Yorug') ==========
  function getTheme(){
    return localStorage.getItem('sb_theme') || 'light';
  }
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('sb_theme', theme);
    const btn = document.getElementById('theme-toggle-btn');
    if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  function toggleTheme(){
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    const themeLab = document.getElementById('prof-theme-label');
    if(themeLab) themeLab.textContent = next === 'dark' ? "Qorong'u rejim" : "Yorug' rejim";
  }

  // ========== MULTI LANGUAGE (uz / en / de) ==========
  const I18N = {
    uz: {
      home: 'Asosiy', courses: 'Kurslar', results: 'Natijalar', vocab: "Lug'at", profile: 'Profil',
      login: 'Kirish', register: "Ro'yxatdan o'tish", logout: 'Chiqish',
      search: 'Qidirish', addWord: "Qo'shish", dictTitle: "Ingliz & Nemis Tili Lug'ati",
      searchPh: "So‘z qidiring (masalan: freedom / Freiheit)...",
      loading: 'Qidirilmoqda...', notFound: 'So‘z topilmadi. Boshqa so‘z yozib ko‘ring.',
      error: 'Xatolik yuz berdi. Internetni tekshiring.',
      meaning: 'Ma\'nosi', example: 'Misol', speak: 'Talaffuz'
    },
    en: {
      home: 'Home', courses: 'Courses', results: 'Results', vocab: 'Dictionary', profile: 'Profile',
      login: 'Login', register: 'Sign up', logout: 'Logout',
      search: 'Search', addWord: 'Add', dictTitle: 'English & German Dictionary',
      searchPh: 'Search a word (e.g. freedom / Freiheit)...',
      loading: 'Searching...', notFound: 'Word not found. Try another word.',
      error: 'Something went wrong. Check your internet.',
      meaning: 'Meaning', example: 'Example', speak: 'Pronounce'
    },
    de: {
      home: 'Start', courses: 'Kurse', results: 'Ergebnisse', vocab: 'Wörterbuch', profile: 'Profil',
      login: 'Anmelden', register: 'Registrieren', logout: 'Abmelden',
      search: 'Suchen', addWord: 'Hinzufügen', dictTitle: 'Englisch & Deutsch Wörterbuch',
      searchPh: 'Wort suchen (z.B. freedom / Freiheit)...',
      loading: 'Suche läuft...', notFound: 'Wort nicht gefunden. Bitte anderes Wort versuchen.',
      error: 'Fehler aufgetreten. Internet prüfen.',
      meaning: 'Bedeutung', example: 'Beispiel', speak: 'Aussprache'
    }
  };

  function getLang(){
    return localStorage.getItem('sb_lang') || 'uz';
  }

  function t(key){
    const lang = getLang();
    return (I18N[lang] && I18N[lang][key]) || (I18N.uz[key] || key);
  }

  function setLanguage(lang){
    if(!I18N[lang]) lang = 'uz';
    localStorage.setItem('sb_lang', lang);
    document.documentElement.lang = lang;
    const sel = document.getElementById('lang-select');
    if(sel) sel.value = lang;

    // Sidebar nav
    document.querySelectorAll('.dash-nav-link').forEach(link => {
      const tab = link.getAttribute('data-tab');
      const span = link.querySelector('span:last-child');
      if(span && tab && I18N[lang][tab]) span.textContent = I18N[lang][tab];
    });
    // Bottom nav
    document.querySelectorAll('.b-nav-tab').forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      if(tab && I18N[lang][tab]){
        const label = btn.childNodes[btn.childNodes.length-1];
        // text node after icon
        const texts = Array.from(btn.childNodes).filter(n => n.nodeType === 3);
        // simpler: update last span if exists
      }
      const spans = btn.querySelectorAll('span');
      // bottom nav structure uses emoji + text as textContent partly
    });
    // Page title map
    const titles = { home: t('home'), results: t('results'), vocab: t('vocab'), profile: t('profile') };
    const active = document.querySelector('.panel.active');
    if(active && titles[active.id]) {
      const pt = document.getElementById('page-title');
      if(pt) pt.textContent = titles[active.id];
    }
    // Vocab placeholders
    const searchInput = document.getElementById('vocab-search-input');
    if(searchInput) searchInput.placeholder = t('searchPh');
    const dictH1 = document.querySelector('#vocab h1');
    if(dictH1) dictH1.textContent = t('dictTitle');
  }

