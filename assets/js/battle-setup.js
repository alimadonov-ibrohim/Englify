// Englify — battle-setup
  // --- BATTLE MODE — alilm.uz uslubi (botlarga qarshi jonli quiz jangi) ---
  // 🎲 Random — sayt foydalanuvchilari bilan onlayn matchmaking (1v1 / 2v2 / 4v4)
  const BTL_USERS = [
    { name:'Dilshod_07', ic:'🧑‍💻', rating:1247 },
    { name:'Malika_A',   ic:'👩‍🎓', rating:1310 },
    { name:'Javohir05',  ic:'🧑‍🎓', rating:1189 },
    { name:'Nilufar_uz', ic:'👩‍🏫', rating:1355 },
    { name:'Sardor_97',  ic:'🧑‍🚀', rating:1272 },
    { name:'Aziza_04',   ic:'👩‍💼', rating:1221 },
    { name:'Bekzod_tj',  ic:'🧑‍🎨', rating:1154 },
    { name:'Zuhra_11',   ic:'👩‍🔬', rating:1298 },
    { name:'Otabek_09',  ic:'🧑‍🔧', rating:1204 },
    { name:'Madina_uz',  ic:'👩‍✈️', rating:1333 },
    { name:'Rustam_03',  ic:'🧑‍🍳', rating:1168 },
    { name:'Kamola_28',  ic:'👩‍🎨', rating:1259 }
  ];



  const BTL_QBANK = [
    {cat:'grammar', q:'Choose the correct form: She ___ to the gym every morning.', opts:['go','goes','is go','going'], ans:1},
    {cat:'grammar', q:'I have lived in this city ___ 2019.', opts:['for','from','since','during'], ans:2},
    {cat:'grammar', q:'If I ___ rich, I would travel the world.', opts:['am','were','will be','would be'], ans:1},
    {cat:'grammar', q:'He said he ___ already finished the report.', opts:['has','have','had','was'], ans:2},
    {cat:'grammar', q:'Neither the manager nor the employees ___ happy with the decision.', opts:['is','was','are','has been'], ans:2},
    {cat:'grammar', q:'The cake ___ by my grandmother yesterday.', opts:['made','was made','is made','has made'], ans:1},
    {cat:'grammar', q:"I'd rather you ___ smoke in here.", opts:["don't","didn't","won't","haven't"], ans:1},
    {cat:'grammar', q:'By next year, she ___ her master\u2019s degree.', opts:['completes','will complete','will have completed','is completing'], ans:2},
    {cat:'grammar', q:'Hardly ___ the station when the train left.', opts:['had I reached','I had reached','did I reached','I reached'], ans:0},
    {cat:'grammar', q:'The more you practice, ___.', opts:['you get better','the better you get','better you get','the best you get'], ans:1},
    {cat:'grammar', q:'He is used ___ up early every day.', opts:['to wake','wake','to waking','waking'], ans:2},
    {cat:'grammar', q:'I wish I ___ more time to prepare.', opts:['have','had','will have','would have'], ans:1},
    {cat:'grammar', q:'She denied ___ the money.', opts:['to take','taking','take','taken'], ans:1},
    {cat:'grammar', q:"It's high time we ___ home.", opts:['go','will go','went','are going'], ans:2},
    {cat:'vocab',   q:"What is the synonym of 'diligent'?", opts:['Lazy','Hardworking','Angry','Careless'], ans:1},
    {cat:'idiom',   q:"'To break the ice' means:", opts:['To break something','To start a conversation','To be cold','To dance'], ans:1},
    {cat:'vocab',   q:"The antonym of 'scarce' is:", opts:['Rare','Limited','Abundant','Small'], ans:2},
    {cat:'vocab',   q:"'Reluctant' most nearly means:", opts:['Unwilling','Excited','Tired','Fast'], ans:0},
    {cat:'idiom',   q:"'To hit the books' means:", opts:['To throw books','To buy books','To study hard','To clean up'], ans:2},
    {cat:'vocab',   q:'Choose the correct collocation:', opts:['make a decision','do a decision','take a decision','put a decision'], ans:0},
    {cat:'vocab',   q:"'Fragile' is closest in meaning to:", opts:['Strong','Delicate','Heavy','Loud'], ans:1},
    {cat:'idiom',   q:"'To call it a day' means:", opts:['To stop working','To start a fight','To name a day','To celebrate'], ans:0},
    {cat:'idiom',   q:"If you are 'under the weather', you are:", opts:['Wet','Feeling ill','Outside','Happy'], ans:1},
    {cat:'grammar', q:'Which sentence is correct?', opts:['Despite the rain, we went out.','Despite of the rain, we went out.','Although the rain, we went out.','In spite the rain, we went out.'], ans:0}
  ];

  let btlState = {
    screen: 'intro',
    bot: null,
    questions: [],
    qIdx: 0,
    playerPts: 0,
    botPts: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    playerDone: false,
    botDone: false,
    botCorrect: false,
    botTime: 0,
    timeLeft: 15,
    total: 7,
    mode: '1v1',
    allies: [],
    opponents: [],
    realMatch: false,
    advancing: false,
    netQueue: {}
  };
  let btlLoadTimer = null;
  let btlQTimer = null;
  let btlBotTimer = null;
  let btlLobbyTimers = [];
  let btlSimTimers = [];
  /* Real 1v1 matchmaking holati (BroadcastChannel + localStorage presence) */
  let btlNet = { ch:null, id:null, hb:null, searching:false, opp:null, matchId:null, waitTimer:null, notifyTimer:null };

  function openBattle(){
    btlCleanup();
    btlState = {
      screen: 'intro', bot: null, questions: [], qIdx: 0,
      playerPts: 0, botPts: 0, streak: 0, maxStreak: 0, correctCount: 0,
      playerDone: false, botDone: false, botCorrect: false, botTime: 0,
      timeLeft: 15, total: 7, lobbyStarted: false, roomCode: '', friend: null,
      mode: '1v1', allies: [], opponents: [], matchDone: false,
      realMatch: false, advancing: false, netQueue: {}
    };
    showPanel('battle', 'Battle Mode');
    btlRenderIntro();
  }
