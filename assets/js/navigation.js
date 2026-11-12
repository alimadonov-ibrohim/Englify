// Englify — navigation
  // --- ASOSIY NAVIGATSIYA ---
  function showView(view){
    // 'home' (landing) olib tashlangandi — har qanday 'home' so'rovi login ga yo'naltiriladi
    if(view === 'home') view = 'login';

    // Dashboard faqat login qilganlarga
    try { if(typeof updateNavAvatars === 'function') updateNavAvatars(); } catch(e){}
    if(view === 'dashboard'){
      const session = getSession();
      if(!session){
        view = 'login';
        const errEl = document.getElementById('login-error');
        if(errEl){
          errEl.textContent = 'Dashboardga kirish uchun avval tizimga kiring.';
          errEl.style.display = 'block';
        }
      } else {
        const normalized = withRole(session);
        setSession(normalized);
        applyUserToUI(normalized);
      }
    }

    // Admin panel — faqat admin
    if(view === 'admin'){
      if(!isAdmin()){
        alert('Ruxsat berilmagan. Faqat admin kira oladi.');
        view = getSession() ? 'dashboard' : 'login';
      }
    }

    // view-home olib tashlangan — faqat login/register/dashboard/admin qoladi
    const homeView = document.getElementById('view-home');
    if(homeView) homeView.style.display = 'none';
    document.getElementById('view-login').style.display = view === 'login' ? 'block' : 'none';
    document.getElementById('view-register').style.display = view === 'register' ? 'block' : 'none';
    document.getElementById('view-dashboard').style.display = view === 'dashboard' ? 'block' : 'none';
    const adminView = document.getElementById('view-admin');
    if(adminView) adminView.style.display = view === 'admin' ? 'block' : 'none';
    if(view === 'admin') adminShow('dash');

    // To'liq ekran dashboard — yuqori oq bo'shliq va ortiqcha joy yo'q
    document.body.classList.toggle('dash-mode', view === 'dashboard' || view === 'admin');


    if(view !== 'dashboard') {
      window.scrollTo(0,0);
    } else {
      switchTab('home');
      // Load user-specific progress if any
      loadUserProgress();
    }
  }

  // --- DASHBOARD TAB NAVIGATION ---
  function switchTab(tabId){
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(tabId);
    if(targetPanel) targetPanel.classList.add('active');

    const titles = {
      home: (typeof t === 'function' ? t('home') : 'Asosiy'),
      results: (typeof t === 'function' ? t('results') : 'Natijalar'),
      vocab: (typeof t === 'function' ? t('vocab') : "Lug'at"),
      videos: 'Vidiolar',
      profile: (typeof t === 'function' ? t('profile') : 'Profil')
    };
    if(document.getElementById('page-title')) {
      document.getElementById('page-title').textContent = titles[tabId] || 'Dashboard';
    }
    try { if(typeof updateNavAvatars === 'function') updateNavAvatars(); } catch(e){}

    document.querySelectorAll('.b-nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.dash-nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
    });

    try { if(typeof writingTimer !== 'undefined') clearInterval(writingTimer); } catch(e){}
    try { if(typeof speakingTimer !== 'undefined') clearInterval(speakingTimer); } catch(e){}
    try { if(typeof speakingLoadTimer !== 'undefined') clearInterval(speakingLoadTimer); } catch(e){}
    try { if(typeof speakingPrepTimer !== 'undefined') clearInterval(speakingPrepTimer); } catch(e){}
    try { if(typeof speakingRecTimer !== 'undefined') clearInterval(speakingRecTimer); } catch(e){}
    try { if(typeof aisLoadTimer !== 'undefined') clearInterval(aisLoadTimer); } catch(e){}
    try { if(typeof aisRecTimer !== 'undefined') clearInterval(aisRecTimer); } catch(e){}
    try { sbTtsStop(); } catch(e){}
    try { if(typeof aisRecognition !== 'undefined' && aisRecognition) aisRecognition.abort(); } catch(e){}
    try { if(typeof btlLoadTimer !== 'undefined') clearInterval(btlLoadTimer); } catch(e){}
    try { if(typeof btlQTimer !== 'undefined') clearInterval(btlQTimer); } catch(e){}
    try { if(typeof btlBotTimer !== 'undefined') clearTimeout(btlBotTimer); } catch(e){}
    try { if(typeof btlClearLobbyTimers === 'function') btlClearLobbyTimers(); } catch(e){}
    try { if(typeof btlSimTimers !== 'undefined' && btlSimTimers.length){ btlSimTimers.forEach(clearTimeout); btlSimTimers = []; } } catch(e){}
    try { if(typeof fexTimer !== 'undefined' && fexTimer){ clearInterval(fexTimer); fexTimer = null; } } catch(e){}
    try { if(typeof vidTimer !== 'undefined' && vidTimer){ clearInterval(vidTimer); vidTimer = null; } } catch(e){}
    try { if(typeof readTimer !== 'undefined') clearInterval(readTimer); } catch(e){}
    try { if(typeof listeningTimer !== 'undefined') clearInterval(listeningTimer); } catch(e){}
    try { if(typeof dailyTimer !== 'undefined') clearInterval(dailyTimer); } catch(e){}
    try { if(typeof dailyQTimer !== 'undefined') clearInterval(dailyQTimer); } catch(e){}
    try { if(typeof dailyLoadTimer !== 'undefined') clearInterval(dailyLoadTimer); } catch(e){}
    try { if(typeof listeningQTimer !== 'undefined') clearInterval(listeningQTimer); } catch(e){}
    try { if(typeof listeningLoadTimer !== 'undefined') clearInterval(listeningLoadTimer); } catch(e){}
    try { if(typeof readingQTimer !== 'undefined') clearInterval(readingQTimer); } catch(e){}
    try { if(typeof readingLoadTimer !== 'undefined') clearInterval(readingLoadTimer); } catch(e){}

    if(tabId === 'results') updateResultsDisplay();
    if(tabId === 'vocab') renderVocabCards();
    if(tabId === 'profile') updateCertificateAvailability();
    if(tabId === 'videos' && typeof openVideos === 'function') openVideos();
  }

  function showPanel(id, title){
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    const p = document.getElementById(id);
    if(p) p.classList.add('active');
    // page-title elementi mavjud bo'lsa yangilaymiz (xavfsiz tekshiruv)
    const pt = document.getElementById('page-title');
    if(pt) pt.textContent = title || '';
  }
  
  function formatTime(s){
    const m=Math.floor(s/60).toString().padStart(2,'0');
    const sec=(s%60).toString().padStart(2,'0');
    return m+':'+sec;
  }

  function closeModal(id){
    const m = document.getElementById(id);
    if(m) m.style.display = 'none';
  }

  // ==========================================
