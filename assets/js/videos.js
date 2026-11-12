// Englify — videos
  // ==========================================
  // --- VIDIOLAR (alilm.uz uslubi — YouTube tinglash diktanti) ---
  // Video har 10 sekundda to'xtaydi, foydalanuvchi eshitganini yozadi,
  // to'g'ri bo'lsa video davom etadi. Transkript brauzer orqali yuklanadi
  // (Invidious / CORS-proxy) va localStorage keshlanadi (sb_vtcps_<vid>).
  // Transkript topilmasa — o'z-o'zini tekshirish rejimi ishlaydi.
  // Yangi video qoshish: FVID_DATA ga { k, e, t, s, yt, d, len } qoshing
  // (yt — YouTube video ID yoki to'liq link). c:[[10,"matn"],...] —
  // tayyor transkript bo'lsa internet kerak emas.
  // ==========================================
  let vidTimer = null;
  let fvidPlayer = null;
  let fvidState = null;

  const FVID_DATA = [
    { k:"wekz", e:"🐰", t:"Judy Hopps monologi — Zootopia", s:"Shadowing: tingla va yoz", yt:"wekz30LAbIU", d:"6:27", len:387, c:[[10, "When I was a kid, when I was a kid,"], [20, "I thought Zootopia was this perfect place. I"], [30, "thought Zootopia was this perfect place where everyone"], [40, "got along and anyone could be anything."], [50, "Where everyone got along and anyone could be anything."], [60, "Turns out turns out"], [70, "real life's a little bit more complicated. Real life's a little bit more complicated"], [80, "than a slogan on a bumper sticker"], [90, "than a slogan on a bumper sticker. Real life is messy."], [100, "Real life is messy. We"], [110, "all have limitations. We all have limitations."], [120, "We all make mistakes. We all make mistakes."], [130, "Which means, hey, glass half full. Which means, hey, glass half full."], [140, "We all have a lot in common. We all have a lot in"], [150, "common. And the more we try to understand one another,"], [160, "And the more we try to understand one another, the more exceptional"], [170, "each of us will be. The more exceptional each of us will be."], [180, "But we have to try. But we have to try."], [190, "So, no matter what type of animal you are, So, no matter what type of animal you"], [200, "are, from the biggest elephant to our first fox,"], [210, "From the biggest elephant"], [220, "to our first fox."], [230, "I implore you try."], [240, "I implore you, try try to make the"], [250, "world a better place. Try to make the world a better place."], [260, "Look inside yourself and recognize"], [270, "Look inside yourself and recognize that change starts with you."], [280, "That change starts with you."], [290, "It starts with me. It starts with me."], [300, "It starts with all of us."], [310, "It starts with all of us."], [320, "When I was a kid, I thought Zootopia was this perfect place where everyone"], [330, "got along and anyone could be anything. Turns out real life's a little bit more complicated than a slogan on a bumper sticker."], [340, "Real life is messy. We all have limitations. We all make mistakes, which means, hey, glass half"], [350, "full, we all have a lot in common. And the more we try to understand one another, the more exceptional each of us will be. But"], [360, "we have to try. So no matter what type of animal you are, from the biggest elephant to our first fox,"], [370, "I implore you, try try to make the world a better place."], [380, "Look inside yourself and recognize that change starts with you. It starts with me."], [390, "It starts with all of us."]] },
    { k:"puss2", e:"🐾", t:"Puss in Boots: The Last Wish", s:"The Last Wish jang sahnasi", yt:"6-9cVbJIGrU", d:"2:58", len:178, c:[[10, "okay that is after me what I've been called a lot of things but never death I like it that's my"], [20, "wish Goldie's wish [Music]"], [40, "[Music] foreign"], [70, "[Music]"], [80, "ER I need your help duly noted but a little busy at the moment"], [90, "foreign [Music]"], [120, "okay [Music]"], [140, "like I told you baby you're the smash I'm the crab yes yes"], [150, "no hey stop pause how do you like cheese"], [160, "at home die throw up already soft boss okay okay you"], [170, "know maybe it's time to bury the hatchet oh I shouldn't have telegraphed it"]] },
    { k:"panda1", e:"🐼", t:"Kung Fu Panda — Shifu va Tai Lung", s:"Ustoz va shogird jangi", yt:"B-KrktB83c8", d:"5:03", len:303, c:[[10, "[Music]"], [20, "I have come home Master this is no longer your home and I am no longer your master"], [30, "yes you have a new favorite so where is this PO did I scare him off this"], [40, "battle is between you and me so that is how it's going to be that is how it must [Music]"], [60, "be I wrot it in jail for 20 years because of your weakness a thing your master is not weakness"], [70, "you knew I was the Dragon Warrior you always knew but when ugay said otherwise what did you"], [80, "do what did you do nothing you were not meant to be the Dragon Warrior that was not my"], [90, "fault not your fault who filled my head with dreams who drove me to train until my bones cracked who denied me my destiny"], [100, "[Music] it was never my decision"], [110, "to [Music] make it is [Music]"], [120, "now give me the scroll I would rather die"], [130, "[Music]"], [150, "w"], [160, "[Music] [Music]"], [170, "what I ever did I"], [180, "did to make you proud tell me how proud you are sheo help me help me"], [190, "[Music] I"], [200, "I have always been proud of you from the first moment I've been proud of you and"], [210, "it was my pride that Blinded Me I loved you too much to see what you were becoming what I"], [220, "was turning you into I'm I'm [Music]"], [230, "sorry I don't want your apology I want my"], [240, "scroll what where is it Dragon Warrior has taken scroll halfway across China"], [250, "by now oh you will never see that scrubble TI long never never"], [260, "[Music] hey stairs who"], [270, "are you buddy I am the Dragon Warrior you"], [280, "you him he's a panda you're a panda what are you going to do big guy sit on me don't tempt me now"], [290, "I'm going to use this you want it come get it"], [300, "[Music] finally"], [310, "w"]] },
    { k:"tfone", e:"🤖", t:"Transformers One — Optimus va Megatron", s:"Optimus va Megatronning o'sishi", yt:"nIOap79iplY", d:"6:01", len:361, c:[[10, "[screaming]"], [20, "&gt;&gt;"], [30, "D."], [40, "D-16."], [50, "We can leave Cybertron together. Don't do this."], [60, "What are you doing? It's over, D. Everyone in Iacon knows the truth. &gt;&gt; So do I. He took everything from us. I have to do"], [70, "this. No, you don't. Rebuilding Iacon cannot begin with an execution. He deserves to die. Can't you see that? We're better than this. Don't"], [80, "be like Sentinel. Pax, you need to move out of my way before I move you myself. D, listen."], [110, "No. No, no, no, no, no. Why? Why did you do that? Why? &gt;&gt;"], [120, "[gasps] &gt;&gt; D."], [130, "No. I'm done saving you."], [140, "&gt;&gt; [music] [music]"], [150, "[music]"], [160, "[music]"], [180, "[music]"], [190, "[music]"], [200, "[music] [music]"], [210, "[music] [music]"], [220, "[music] [music]"], [230, "[music] &gt;&gt; The age of primes"], [240, "has ended. No more false prophets. Follow me and you will [music] never again be deceived. Rise, all!"], [250, "Orion Pax, your noble"], [260, "sacrifice [music] for the greater good has proven you worthy in the eyes of [music] Primus. He entrusts in you"], [270, "the [music] future of Cybertron. And the Matrix [music] of Leadership. I"], [280, "will lead us all into the future. &gt;&gt; [music]"], [290, "[music] [music]"], [300, "&gt;&gt; I am Megatron! Arise, Optimus"], [310, "Prime. &gt;&gt; [music] &gt;&gt; Burn it down! All of it!"], [320, "All hail Megatron! He's going to kill everyone. We have"], [330, "to stop him. Come on. Stop! It's over. It's over when every last one of his followers is dead."], [350, "&gt;&gt; [music]"]] },
    { k:"tf4", e:"🚗", t:"Transformers 4 — KSI bazasiga hujum", s:"Avtobotlar KSI bazasida", yt:"RZsVTwcaMyU", d:"7:26", len:446, c:[[10, "yes this is dissection room 7 Galvatron render post-mortem number 12 continued head disfigurement petit been number 32"], [20, "so what about the deal is it done did you get the seed we get it when the bounty hunter gets prime huh"], [30, "meanwhile there has been a complication of what a que si we don't use words like that a civilian harboring"], [40, "the Autobots has hacked into one of your mini-drones meaning they may know of your involvement what"], [50, "I need more transform iam and I need it now to build more"], [60, "prototypes you tell your alien bounty hunter that I have staked my company on this deal and I have merely staked my life hey"], [70, "you came to me on this remember you retire from the CIA you get a seven-figure piece of my company and you and I revolutionize National Defense together but"], [80, "attinger buddy for both our sakes you need to deliver the seed"], [90, "[Music]"], [100, "I mean you see my camera"], [110, "they're melting ratchet they slaughtered ratchet I'm gonna tear them apart metal"], [120, "just metal that's what I always thought of them they're not living things with Souls like ours and"], [130, "at once I spoke to one and you're working with transform him oh yeah that's what I do I I am I'm out there digging for it that's just not much left to find"], [140, "so that's how badly you boys need more huh reduced to melting evil old Decepticons down no that's an Autobot there"], [150, "the ones who fought for us I bet there's taking care from here right same badge code scan to two separate gates I'm having a classified area lockdown now"], [160, "check that guy"], [180, "all"], [190, "right corporate espionage it's a very serious crime mr. Jager"], [210, "look"], [220, "I want a lawyer the Justice Department somebody I can trust I'm just trying to protect my family okay not from your company from the government mr. Yeager who do you think I"], [230, "work for you're trying to protect your family that's admirable I'm trying to defend the nation from alien war we've had a taste of what that looks like and we are not gonna tolerate another"], [240, "no there is a version of this conversation or you get to go back to your barn your daughter gets to graduate with honors and life as you know it we'll"], [250, "go on you'll have no idea what you're involved with here really what's the other version of this conversation"], [260, "when we send in the hired help to murder my little girl are you gonna man up and do it yourself what's your"], [270, "preference I'm gonna ask you this once where is Optimus Prime [Applause]"], [320, "there's over"], [330, "bring me out of this Frankenstein"], [340, "box that's company property they're not your"], [350, "property they were my friends oh so"], [360, "much now you got found in front of you huh go ahead show us your true colors once and for all just give me the word I'll splatter why"], [370, "don't you tell its fingers here that this is all the spoils of war dead metal innovation what we do here is science"], [380, "because if we don't do it somebody else will because you cannot stop technology we're new"], [390, "paper eyes is ass I broke the code I own your whole genome"], [400, "the world will know what you're doing here the world the world will approve we can make you now don't"], [410, "you get it we don't need you anymore who's cruel"], [420, "[Music] Autobots we're done we're down we're not gonna kick a little bit of"], [430, "attention to kill something lately this is our chance we have to stop him you have to stop him it's never been tested in the field Labs military bases but not on civilians to earn a Defense"], [440, "Department contract was just attacked in a terrorist attack this is now a CIA military op you're indemnified respond"], [450, "this guy"]] },
    { k:"panda4", e:"🎋", t:"Kung Fu Panda 4 — Happy Bunny taverna", s:"Tavernadagi kulgili jang", yt:"RuB2_rXKO_Y", d:"5:06", len:306, c:[[10, "the happy bunny Tavern well that sounds inviting anybody lose a"], [20, "rabbit fire"], [30, "faster welcome to the happy bunny Tavern Now find us a ride maybe you can get us some food and stay out of trouble"], [40, "hey what you guys playing ah John and the stakes are high can I play surely you'll go easy Ono beginner cuz I'm very"], [50, "beginning hey there what can I get you a boat ride to Juniper City that's this guy who's he"], [60, "he's the captain thanks oh I win again beginner's luck I guess never played before"], [70, "huh I'm sorry are you accusing me of cheating I would like to speak to the manager please I am the manager I'll give you a boat right to Juniper City but I"], [80, "won't carry anything illegal I don't want any trouble trouble runs from me then you'll cost you double I'm confused should I have said that I like trouble in that case"], [90, "it'll cost you triple oh uh maybe we can go back to the double price you got a deal great do I shake his hand or your your"], [100, "hand can I get anything else for you ma'am yes everything again except for the broth it was very Bland keep saring"], [110, "wa one of everything is my go-to order but how did you pay for this legally lawfully fair and square I'm proud of"], [120, "you oh wow look at the time"], [130, "remember we have to do that thing down by the place with that guy did you actually think you could grift a meal out of me there's got to be some sort of misunderstanding"], [140, "here and apparently I'm the one misunderstanding please allow us to pay for our meal and yours too I'm only hungry for"], [150, "Dum things Vengeance well then come and get it no no no no no don't come and get it destroy them"], [160, "[Music]"], [170, "I got"], [180, "it there you go all better come on gotcha keep staring"], [190, "[Music]"], [210, "I'll take"], [220, "[Music] that think this belongs to [Music]"], [230, "[Music] you go"], [240, "stealing yeah I think it's a little too late for that it's never too late to do the right thing no hit"], [250, "them watch [Music]"], [260, "[Applause] out whoa nice move"], [270, "you got to teach me that you die [Music] Panda woo"], [280, "who whoa"], [290, "W who designs a Tavern on a cliff I shouldn't have eaten all those dumplings huh"], [300, "[Music] uh-oh still"], [310, "MO"]] },
    { k:"pussmap", e:"🗺️", t:"Puss in Boots 2 — Jack Horner", s:"Jack Horner va uning to'dasi", yt:"OawVcKZ-xRw", d:"2:46", len:166, c:[[10, "what did the crazy dog go I think you like him no no I don't I think you're ready to name him no he doesn't need this is a path to get my wish you"], [20, "mean my wish you mean My Wish sorry"], [30, "the biggest dozen let him go oh I don't know I might keep him would you like a treat nice"], [40, "granny bag little Jack it's not a granny bag it is a magic Nanny bag now make with the map or we'll see what the unicorn"], [50, "horn really does yeah yeah you're gonna shoot a puppy all right check yeah in the face why give"], [60, "us the map or else that they command gets it yeah I don't even have the map little bow creep stop throwing my men at me [Music]"], [70, "[Applause] I've got a plan first"], [80, "one till the dog gets the wish yeah what oh come on [Music] foreign [Music]"], [110, "[Music] ER my bad"], [120, "[Music] thank you"], [140, "[Music] pull it away"], [150, "thanks for the naps"], [160, "all right you've just been primed by the Three Bears crime family yeah"]] },
    { k:"penguins", e:"🐧", t:"Madagaskar penguenlari", s:"Skipper — o'z yo'li bilan", yt:"vczPkLcXPtc", d:"5:13", len:313, c:[[10, "put on your jammies penguin oh they are even cute when they're asleep not to me"], [20, "i want these potables out of my way and out of my mission ship them to one of our safe houses the most remote place on the planet"], [30, "uh where the heck are we oxygen content is low"], [40, "i suggest we limit our breathing ah private sorry i get gassy when i fly"], [50, "too sweet he does well he must be on a plane what did north wind do to us oh they gave us badges"], [60, "not badges tranquilizer darts classified that lowdown dirty dog is trying to kick us off the mission he thinks we can't save"], [70, "the penguins because we're just penguins well penguins are our flesh and feathers they're us and if anyone's gonna save us it's us"], [80, "but skipper we've got to be five miles up that pretty much limits our options i make my own options"], [90, "[Music] brilliant move skipper but now we seem to be outside the plane well kind of got caught up in the moment well high"], [100, "tide's 20 20. okay kowalski your turn to pick up the slack uh oh why don't we catch that plane third"], [110, "strike log it we've got another target at 12 o'clock good it's only 11 30. follow me boys we're going in hot"], [120, "[Music]"], [130, "[Music] where does this aircraft go from the odd shape of this bagel i'd say we're headed for paris france"], [140, "forget it not with their tax laws then i would suggest a mid-air transfer that's permeability"], [150, "bingo there's all right boys can't stay dog danger is my mistress ah freak out more"], [160, "height suppressing pretzels crowded pretzels we're leaving just in time cause these folks are gonna freak deploy blocks"], [170, "stay on target we're gonna catch it we're gonna get it frankie we're not gonna catch it"], [180, "start grabbing boxes boys"], [190, "oh private stop playing with those backpacks find something useful now we're talking let's get to work 400"], [200, "meters 300 meters fake american kowalski sorry sir 218 yards 109 yards"], [210, "couple take our prisoner the one that belongs to us into"], [220, "custody what you melted him you birds are sick [Applause] it's going in through the pipes"], [230, "no"], [240, "no no no no drivers"], [250, "[Music] he's got private he's getting away he's getting away skipper the north winds playing"], [260, "sweet chariot of the gods but can you fly it man there's only one way to find out"], [270, "showtime everyone big smiles for the big apple"], [280, "listen up doris you turn us into freaks and then what you think that's gonna make everybody love you no but they'll"], [290, "despise you and i'm sure gonna love that"], [300, "[Music]"], [320, "you"]] }
  ];

  let FVID_ALL = FVID_DATA.slice();
  function fvidRebuildAll(){
    FVID_ALL = FVID_DATA.concat(fvidGetUsr().map(function(u){ return fvidUsrEntry(u); }));
  }
  function fvidGetUsr(){
    try{
      const s = getSession();
      return JSON.parse(localStorage.getItem("sb_fvidusr_" + (s ? s.email : "")) || "[]");
    }catch(e){ return []; }
  }
  function fvidSetUsr(a){
    try{
      const s = getSession();
      if(s) localStorage.setItem("sb_fvidusr_" + s.email, JSON.stringify(a));
    }catch(e){}
  }
  function fvidUsrEntry(u){
    return { k:"usr" + u.yt, e:"🎬", t:(u.t || "YouTube video"), s:"Mening linkingiz", yt:u.yt, d:"—", len:0, usr:1 };
  }
  function fvidYtId(s){
    s = (s || "").trim();
    if(/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    const m = s.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  function fvidFetchTitle(yt, cb){
    const u = "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + yt);
    fetch(u).then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
      cb(j && j.title ? String(j.title).slice(0, 80) : null);
    }).catch(function(){ cb(null); });
  }

  function updateNavAvatars(){
    try{
      const a = document.getElementById("dash-topbar-avatar");
      const L = (a && a.textContent.trim().charAt(0).toUpperCase()) || "S";
      document.querySelectorAll(".b-av").forEach(el => el.textContent = L);
    }catch(e){}
  }

  function fvidEsc(s){
    return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function fvidGetProg(){
    try{
      const s = getSession();
      return JSON.parse(localStorage.getItem("sb_videos_" + (s ? s.email : "")) || '{"done":{},"minutes":0}');
    }catch(e){ return { done:{}, minutes:0 }; }
  }
  function fvidSetProg(p){
    try{
      const s = getSession();
      if(s) localStorage.setItem("sb_videos_" + s.email, JSON.stringify(p));
    }catch(e){}
  }

  function fvidStop(){
    if(vidTimer){ clearInterval(vidTimer); vidTimer = null; }
    try{ if(fvidPlayer && fvidPlayer.pauseVideo) fvidPlayer.pauseVideo(); }catch(e){}
  }

  function openVideos(){
    fvidStop();
    fvidState = { screen:"intro" };
    showPanel("videos", "Vidiolar");
    // Avval universal intro, keyin "Boshlash" → video list
    const heroSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="4"/><path d="m10 9 5 3-5 3z"/></svg>';
    const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const listSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>';
    const dictSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
    document.getElementById("videos-content").innerHTML = alRenderIntro({
      colorClass: 'al-skyblue',
      heroSvg: heroSvg,
      title: 'Vidiolar',
      sub: 'YouTube videolarini tinglab, diktant yozing — har 10 soniyada to\'xtaydi va siz eshitganingizni yozasiz',
      chips: [
        { svg: listSvg, text: '8+ video' },
        { svg: clockSvg, text: '10s/pauza' },
        { svg: dictSvg, text: 'Diktant' }
      ],
      howtoHead: 'QANDAY ISHLATISH?',
      steps: [
        { txt: '<b>Videoni tanlang</b> — Zootopia, Puss in Boots, Kung Fu Panda va boshqalar' },
        { txt: 'Video har <b>10 soniyada</b> to\'xtaydi — oxirgi 10 soniyada eshitganingizni yozing' },
        { txt: 'To\'g\'ri yozsangiz — <b>video davom etadi</b>, xato bo\'lsa qayta tinglang' },
        { txt: 'Natija <b>aniqlik foizi</b> bilan Natijalar bo\'limida saqlanadi' }
      ],
      note: 'O\'z YouTube linkingizni qo\'shing — video sayt ichida o\'ynaydi. Faylni to\'g\'ridan-to\'g\'ri ochsangiz: papkadagi Englify-server.bat ni ishga tushiring (videolar shunda ichida o\'ynaydi)',
      btnText: 'Videolar ro\'yxatini ko\'rish',
      btnAction: 'fvidRenderList()',
      motivate: 'Tinglab yozish — eng samarali til o\'rganish usuli! 🎬'
    });
  }

  function fvidBack(){
    fvidStop();
    fvidState = { screen:"intro" };
    // Back → intro ga qaytaramiz
    openVideos();
  }

  function fvidRenderList(){
    fvidState.screen = "list";
    fvidStop();
    fvidPlayer = null;
    fvidRebuildAll();
    const p = fvidGetProg();
    document.getElementById("videos-content").innerHTML = `
      <div class="fvid-wrap">
        <div class="fvid-head"><h2>Vidiolar</h2><p>Videoni tanlang va tinglash mashqini boshlang</p></div>
        <div class="fvid-tip">🎬 Video har <b>10 sekundda</b> to'xtaydi — eshitganingizni yozing. To'g'ri yozsangiz video davom etadi!</div>
        ${location.protocol === "file:" ? `<div class="fvid-filewarn">⚠️ Fayl brauzerda to'g'ridan-to'g'ri ochilgan — YouTube videolarni sayt ichiga olishni bloklaydi (Error 153). <b>Yechim:</b> papkadagi <b>Englify-server.bat</b>ni ikki marta bosing — sayt mahalliy serverda ochiladi va videolar sayt ichida to'liq o'ynaydi.</div>` : ""}
        <div class="fvid-list">
          ${FVID_ALL.map(function(v, i){
            const dn = p.done && p.done[v.k];
            return `<div class="fvid-item${v.usr ? " usr" : ""}" onclick="fvidOpen(${i})">
              <div class="fvid-num">${i + 1}</div>
              <div class="fvid-info"><h4>${v.e} ${fvidEsc(v.t)}${i === 0 ? '<span class="fvid-badge1">1-VIDEO</span>' : ''}</h4><div class="fvid-meta">🕒 ${v.d} · ${fvidEsc(v.s)}</div></div>
              <div class="fvid-right">${dn ? `<span class="fvid-tag ok">✓ ${dn.pct}%</span>` : `<span class="fvid-tag new">Yangi</span>`}${v.usr ? `<button class="fvid-del" onclick="event.stopPropagation();fvidDelUsr('${v.yt}')">✕</button>` : ''}<button class="fvid-play">▶</button></div>
            </div>`;
          }).join("")}
        </div>
        <div class="fvid-addrow" id="fvid-addrow" style="display:none;">
          <input id="fvid-addin" type="text" placeholder="YouTube link yoki ID: https://youtu.be/..." onkeydown="if(event.key==='Enter'){event.preventDefault();fvidAddCommit();}">
          <button class="fvid-btn pri" onclick="fvidAddCommit()">Qo'shish</button>
        </div>
        <button class="fvid-addbtn" id="fvid-addbtn" onclick="fvidAddToggle()">➕ YouTube link qo'shish</button>
      </div>
    `;
  }

  function fvidAddToggle(){
    const row = document.getElementById("fvid-addrow");
    const btn = document.getElementById("fvid-addbtn");
    if(!row || !btn) return;
    const show = row.style.display === "none";
    row.style.display = show ? "flex" : "none";
    btn.style.display = show ? "none" : "block";
    if(show){ const inp = document.getElementById("fvid-addin"); if(inp) inp.focus(); }
  }

  function fvidAddCommit(){
    const inp = document.getElementById("fvid-addin");
    if(!inp) return;
    const id = fvidYtId(inp.value);
    if(!id){
      inp.value = "";
      inp.placeholder = "Link noto'g'ri — https://youtu.be/... shaklida kiriting";
      return;
    }
    const exIx = FVID_ALL.map(function(v){ return v.yt; }).indexOf(id);
    if(exIx >= 0){ fvidOpen(exIx); return; }
    const usr = fvidGetUsr();
    if(usr.map(function(u){ return u.yt; }).indexOf(id) >= 0){ fvidRenderList(); return; }
    usr.unshift({ yt: id, t: "" });
    fvidSetUsr(usr);
    fvidRebuildAll();
    const ix = FVID_ALL.map(function(v){ return v.k; }).indexOf("usr" + id);
    fvidFetchTitle(id, function(t){
      if(!t) return;
      const arr = fvidGetUsr();
      const it = arr.filter(function(u){ return u.yt === id; })[0];
      if(it){ it.t = t; fvidSetUsr(arr); fvidRebuildAll(); }
      if(fvidState && fvidState.screen === "player" && fvidState.vi === ix){
        const ttl = document.querySelector(".fvid-vhead h3");
        if(ttl) ttl.textContent = "🎬 " + t;
      }
    });
    fvidOpen(ix);
  }

  function fvidDelUsr(yt){
    fvidSetUsr(fvidGetUsr().filter(function(u){ return u.yt !== yt; }));
    fvidRebuildAll();
    fvidRenderList();
  }
  function fvidOpen(i){
    fvidStop();
    fvidRebuildAll();
    const v = FVID_ALL[i];
    if(!v) return;
    fvidState = { screen:"player", vi:i, phase:"idle", k:0, cps:[], mode:"auto", tries:0, okCount:0, firstTry:0, lastPauseK:-1 };
    fvidRenderPlayer();
  }


  function fvidRenderPlayer(){
    const st = fvidState;
    const vi = st.vi;
    const v = FVID_ALL[vi];
    fvidStop();
    fvidPlayer = null;
    document.getElementById("videos-content").innerHTML = `
      <div class="fvid-wrap">
        <button class="fvid-back" onclick="fvidBack()">← Vidiolar</button>
        <div class="fvid-vhead"><h3>${v.e} ${fvidEsc(v.t)}</h3><span>${fvidEsc(v.s)} · ${v.d}</span></div>
        ${location.protocol === "file:" ? `<div class="fvid-filewarn">⚠️ Fayl brauzerda to'g'ridan-to'g'ri ochilgan — YouTube bunday holatda videoni sayt ichiga olishni taqiqlaydi (Error 153). Video sayt ichida to'liq o'ynashi uchun papkadagi <b>Englify-server.bat</b>ni ikki marta bosing yoki saytni hostingga joylang. Hozircha videoni <b>📺 YouTube'da ochish</b> tugmasi orqali ko'rishingiz mumkin.</div>` : ""}
        <div class="fvid-stage">
          <div id="fvid-yt"></div>
          <div class="fvid-cover" id="fvid-cover" onclick="fvidStart()">
            <button class="fvid-big">▶</button>
            <b>Diktant bilan boshlash</b>
            <span>Video ingliz tilida. Har 10 sekundda avtomatik to'xtaydi — oxirgi 10 sekundda eshitganlaringizni yozing. To'g'ri yozsangiz, video davom etadi.</span>
            <button class="fvid-btn ghost" style="margin-top:12px;" onclick="event.stopPropagation();fvidStartWatch()">🎬 Faqat ko'rish — diktantsiz</button>
            <button class="fvid-btn ghost" style="margin-top:8px;" onclick="event.stopPropagation();fvidOpenYT()">📺 YouTube'da ochish</button>
          </div>
        </div>
        <div class="fvid-progrow">
          <div class="fvid-prog"><div class="fvid-fill" id="fvid-fill"></div></div>
          <span class="fvid-pcount" id="fvid-pcount">0 / ?</span>
        </div>
        <div class="fvid-loading" id="fvid-tstat"><div class="fvid-spin"></div> Transkript tayyorlanmoqda...</div>
        <div class="fvid-dict" id="fvid-dict"><div style="color:#93a0b8;font-size:13.5px;">🔊 Videoni boshlang — diktant shu yerda paydo bo'ladi.</div></div>
      </div>
    `;
    fvidEnsureCps(v, function(res){
      if(!fvidState || fvidState.screen !== "player" || fvidState.vi !== vi) return;
      if(fvidState.cps.length > 0) return;
      const ts = document.getElementById("fvid-tstat");
      if(res && res.cps && res.cps.length){
        fvidState.cps = res.cps;
        fvidState.mode = "auto";
        if(ts) ts.innerHTML = "✅ Transkript tayyor — " + res.cps.length + " ta qism";
      } else {
        const arr = [];
        const L = v.len || 120;
        for(let t = 10; t <= L; t += 10) arr.push([t, ""]);
        fvidState.cps = arr;
        fvidState.mode = "self";
        if(ts) ts.innerHTML = "✍️ O'z-o'zini tekshirish rejimi — yozganingizni o'zingiz tekshirasiz";
      }
      const pc = document.getElementById("fvid-pcount");
      if(pc) pc.textContent = fvidState.k + " / " + fvidState.cps.length;
    });
  }

  function fvidEnsureYT(cb){
    if(window.YT && window.YT.Player){ cb(); return; }
    window.fvidYTQueue = window.fvidYTQueue || [];
    window.fvidYTQueue.push(cb);
    if(window.fvidYTLoading) return;
    window.fvidYTLoading = true;
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function(){
      if(typeof prev === "function"){ try{ prev(); }catch(e){} }
      (window.fvidYTQueue || []).forEach(function(f){ try{ f(); }catch(e){} });
      window.fvidYTQueue = [];
    };
  }

  function fvidStart(){
    if(!fvidState || fvidState.screen !== "player") return;
    const cov = document.getElementById("fvid-cover");
    if(cov) cov.style.display = "none";
    fvidState.phase = "playing";
    fvidEnsureYT(function(){
      if(!fvidState || fvidState.screen !== "player") return;
      const v = FVID_ALL[fvidState.vi];
      try{
        fvidPlayer = new YT.Player("fvid-yt", {
          videoId: v.yt,
          playerVars: { controls:0, disablekb:1, modestbranding:1, rel:0, playsinline:1, fs:0, iv_load_policy:3, autoplay:1 },
          events: {
            onReady: function(){
              try{
                const dur = (fvidPlayer && fvidPlayer.getDuration) ? Number(fvidPlayer.getDuration() || 0) : 0;
                if(fvidState && dur > 0){
                  if(!v.len) v.len = Math.round(dur);
                  if(fvidState.mode === "self" && fvidState.cps && fvidState.cps.length && fvidState.cps[fvidState.cps.length - 1][0] < Math.floor(dur) - 5){
                    const arr2 = [];
                    for(let t = 10; t <= Math.floor(dur); t += 10) arr2.push([t, ""]);
                    if(arr2.length > fvidState.cps.length) fvidState.cps = arr2;
                  }
                  if(fvidState.cps && fvidState.cps.length){
                    if(fvidState.cps.length > 1){
                      fvidState.cps = fvidState.cps.filter(function(cc, ix2){ return ix2 < fvidState.cps.length - 1 ? cc[0] < dur - 0.4 : true; });
                    }
                    const lc = fvidState.cps[fvidState.cps.length - 1];
                    if(lc && lc[0] > dur - 0.6) lc[0] = Math.max(2, dur - 0.9);
                    const pc2 = document.getElementById("fvid-pcount");
                    if(pc2) pc2.textContent = fvidState.k + " / " + fvidState.cps.length;
                  }
                }
              }catch(e){}
              try{ fvidPlayer.playVideo(); }catch(e){}
              fvidState.phase = "playing";
              if(!vidTimer) vidTimer = setInterval(fvidTick, 300);
            },
            onStateChange: function(ev){
              if(ev.data === 0 && fvidState && fvidState.screen === "player" && fvidState.phase === "playing") fvidFinish("end");
            }
          }
        });
      }catch(e){}
    });
  }

  function fvidStartWatch(){
    if(!fvidState || fvidState.screen !== "player") return;
    const cov = document.getElementById("fvid-cover");
    if(cov) cov.style.display = "none";
    fvidState.phase = "watch";
    const ts = document.getElementById("fvid-tstat");
    if(ts) ts.style.display = "none";
    const pr = document.querySelector("#videos-content .fvid-progrow");
    if(pr) pr.style.display = "none";
    const d = document.getElementById("fvid-dict");
    if(d) d.innerHTML = '<div class="fvid-banner">🎬 Ko\'rish rejimi — video to\'xtovsiz o\'ynaydi.</div><div class="fvid-dsub">Diktant mashqisi uchun videoni qayta ochib, "▶ Diktant bilan boshlash"ni bosing.</div>';
    fvidEnsureYT(function(){
      if(!fvidState || fvidState.screen !== "player") return;
      const v = FVID_ALL[fvidState.vi];
      try{
        fvidPlayer = new YT.Player("fvid-yt", {
          videoId: v.yt,
          playerVars: { controls:1, disablekb:0, modestbranding:1, rel:0, playsinline:1, fs:1, iv_load_policy:3, autoplay:1 },
          events: {
            onReady: function(){ try{ fvidPlayer.playVideo(); }catch(e){} },
            onStateChange: function(ev){
              if(ev.data === 0 && fvidState && fvidState.screen === "player" && fvidState.phase === "watch") fvidWatchDone();
            }
          }
        });
      }catch(e){}
    });
  }

  function fvidWatchDone(){
    if(!fvidState) return;
    fvidStop();
    const v = FVID_ALL[fvidState.vi];
    const vi = fvidState.vi;
    document.getElementById("videos-content").innerHTML = `
      <div class="fvid-wrap">
        <div class="fvid-donebox">
          <div class="fe">🎬</div>
          <h3>Video tugadi!</h3>
          <p>${v.e} ${fvidEsc(v.t)}</p>
          <div class="fvid-actions" style="justify-content:center;">
            <button class="fvid-btn ghost" onclick="fvidBack()">← Vidiolar</button>
            <button class="fvid-btn pri" onclick="fvidOpen(${vi})">⟳ Yana ko'rish</button>
          </div>
        </div>
      </div>
    `;
  }

  function fvidOpenYT(){
    try{
      const v = FVID_ALL[fvidState.vi];
      if(v) window.open("https://www.youtube.com/watch?v=" + v.yt, "_blank");
    }catch(e){}
  }

  function fvidTick(){
    if(!fvidState || fvidState.screen !== "player" || fvidState.phase !== "playing") return;
    try{
      if(!fvidPlayer || !fvidPlayer.getCurrentTime) return;
      const stt = fvidPlayer.getPlayerState();
      if(stt === 0){ fvidFinish("end"); return; }
      if(stt !== 1) return;
      const t = fvidPlayer.getCurrentTime();
      const cps = fvidState.cps;
      if(!cps.length) return;
      const f = document.getElementById("fvid-fill");
      if(f) f.style.width = Math.min(100, (fvidState.k / cps.length) * 100) + "%";
      const cp = cps[fvidState.k];
      if(!cp){ fvidFinish("done"); return; }
      if(t >= cp[0] - 0.25){
        try{ fvidPlayer.pauseVideo(); }catch(e){}
        fvidPauseDictate();
      }
    }catch(e){}
  }

  function fvidPauseDictate(){
    const st = fvidState;
    if(!st || st.screen !== "player") return;
    if(st.lastPauseK !== st.k){ st.tries = 0; st.lastPauseK = st.k; }
    st.phase = "dict";
    const cps = st.cps;
    const cp = cps[st.k] || [0, ""];
    const isSelf = st.mode === "self";
    const d = document.getElementById("fvid-dict");
    if(!d) return;
    d.classList.remove("dim");
    d.innerHTML = `
      <div class="fvid-banner">⏸ Video to'xtadi <span class="fvid-qnum">${st.k + 1} / ${cps.length} qism</span></div>
      <div class="fvid-dsub">${isSelf
        ? "Oxirgi 10 sekundda aytilganlarni yozing. So'ng o'zingizni tekshiring — shubhali bo'lsa qayta tinglang."
        : "Oxirgi 10 sekundda aytilgan so'zlarni yozing (tekshirish: Ctrl+Enter)."}</div>
      <textarea id="fvid-ta" class="fvid-ta" placeholder="Bu yerda yozing..." oninput="fvidWC()"></textarea>
      <div class="fvid-wc" id="fvid-wc">0 so'z</div>
      <div class="fvid-actions">
        ${isSelf
          ? `<button class="fvid-btn pri" onclick="fvidSelf(1)">✓ To'g'ri yozdim</button><button class="fvid-btn ghost" onclick="fvidReplay()">🔄 Qayta tinglash</button><button class="fvid-btn ghost" onclick="fvidResume()">⏭ O'tkazib yuborish</button>`
          : `<button class="fvid-btn pri" onclick="fvidCheck()">✓ Tekshirish</button><button class="fvid-btn ghost" onclick="fvidReplay()">🔄 Qayta tinglash</button><button class="fvid-btn warn" id="fvid-skip" style="display:none;" onclick="fvidReveal()">⏭ Javobni ko'rsatish</button>`}
      </div>
      <div class="fvid-fb" id="fvid-fb"></div>
      <div id="fvid-hint"></div>
      <div id="fvid-ansbox"></div>
    `;
    const ta = document.getElementById("fvid-ta");
    if(ta){
      ta.focus();
      ta.addEventListener("keydown", function(ev){
        if(ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)){
          ev.preventDefault();
          if(isSelf) fvidSelf(1); else fvidCheck();
        }
      });
    }
    const pc = document.getElementById("fvid-pcount");
    if(pc) pc.textContent = st.k + " / " + cps.length;
  }

  function fvidWC(){
    const ta = document.getElementById("fvid-ta");
    const el = document.getElementById("fvid-wc");
    if(!ta || !el) return;
    const n = ta.value.trim().split(/\s+/).filter(Boolean).length;
    el.textContent = n + " so'z";
  }

  function fvidNorm(s){
    return (s || "").toLowerCase().replace(/[\u2019\u2018`]/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function fvidCheckAns(user, exp){
    const a = fvidNorm(user).split(" ").filter(Boolean);
    const b = fvidNorm(exp).split(" ").filter(Boolean);
    if(!a.length || !b.length) return false;
    const map = {};
    b.forEach(w => { map[w] = (map[w] || 0) + 1; });
    let hit = 0;
    a.forEach(w => { if(map[w] > 0){ hit++; map[w]--; } });
    const rec = hit / b.length;
    const sim = 2 * hit / (a.length + b.length);
    if(b.length <= 3) return rec === 1 && a.length <= b.length + 2;
    return sim >= 0.78 || (rec >= 0.9 && a.length <= Math.round(b.length * 1.6));
  }

  function fvidCheck(){
    const st = fvidState;
    if(!st || st.screen !== "player" || st.phase !== "dict") return;
    const ta = document.getElementById("fvid-ta");
    const fb = document.getElementById("fvid-fb");
    if(!ta || !fb) return;
    const val = ta.value.trim();
    if(!val){
      fb.className = "fvid-fb bad";
      fb.textContent = "✍️ Avval eshitganingizni yozing";
      return;
    }
    const cp = st.cps[st.k] || [0, ""];
    if(fvidCheckAns(val, cp[1])){
      st.okCount++;
      if(st.tries === 0) st.firstTry++;
      fb.className = "fvid-fb ok";
      fb.textContent = "✅ To'g'ri! Video davom etmoqda...";
      setTimeout(fvidResume, 800);
    } else {
      st.tries++;
      fb.className = "fvid-fb bad";
      fb.textContent = st.tries >= 2 ? "❌ To'liq emas. Maslahatga qarang yoki javobni ko'rsating" : "❌ To'liq emas. Yana tinglab urinib ko'ring";
      const d = document.getElementById("fvid-dict");
      if(d){ d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake"); }
      if(st.tries >= 2){
        const h = document.getElementById("fvid-hint");
        if(h && !h.innerHTML){
          h.innerHTML = `<div class="fvid-hint">💡 Maslahat: ${cp[1].split(/\s+/).map(function(w){ return w.charAt(0) + "…"; }).join(" ")}</div>`;
        }
        const sk = document.getElementById("fvid-skip");
        if(sk) sk.style.display = "inline-block";
      }
    }
  }

  function fvidReveal(){
    const st = fvidState;
    if(!st) return;
    const cp = st.cps[st.k] || [0, ""];
    const sk = document.getElementById("fvid-skip");
    if(sk) sk.style.display = "none";
    const box = document.getElementById("fvid-ansbox");
    if(box){
      box.innerHTML = `<div class="fvid-ans"><b>To'g'ri javob:</b> ${fvidEsc(cp[1])}<div style="margin-top:9px;"><button class="fvid-btn pri" onclick="fvidResume()">⏭ Davom etish</button></div></div>`;
    }
  }

  function fvidResume(){
    const st = fvidState;
    if(!st || st.screen !== "player") return;
    st.k++;
    const pcr = document.getElementById("fvid-pcount");
    if(pcr) pcr.textContent = st.k + " / " + st.cps.length;
    if(st.k >= st.cps.length){ fvidFinish("done"); return; }
    const d = document.getElementById("fvid-dict");
    if(d){
      d.classList.add("dim");
      d.innerHTML = `<div class="fvid-banner">▶ Video davom etmoqda...</div><div class="fvid-dsub">Keyingi to'xtash: ${st.k + 1}/${st.cps.length} — tayyorlaning.</div>`;
    }
    st.phase = "playing";
    try{
      const cp = st.cps[st.k];
      fvidPlayer.seekTo(Math.max(0, cp[0] - 0.05), true);
      fvidPlayer.playVideo();
    }catch(e){}
  }

  function fvidReplay(){
    const st = fvidState;
    if(!st || st.screen !== "player") return;
    const cp = st.cps[st.k];
    if(!cp) return;
    const d = document.getElementById("fvid-dict");
    if(d){
      d.classList.add("dim");
      d.innerHTML = `<div class="fvid-banner">🔁 Qayta eshitilmoqda...</div><div class="fvid-dsub">Video oxirgi 10 sekundni yana ko'rsatadi — diqqat bilan tinglang.</div>`;
    }
    st.phase = "playing";
    try{
      fvidPlayer.seekTo(Math.max(0, cp[0] - 10), true);
      fvidPlayer.playVideo();
    }catch(e){}
  }

  function fvidSelf(ok){
    const st = fvidState;
    if(!st || st.screen !== "player" || st.phase !== "dict") return;
    const fb = document.getElementById("fvid-fb");
    if(ok){
      st.okCount++;
      st.firstTry++;
      if(fb){ fb.className = "fvid-fb ok"; fb.textContent = "✅ Zo'r! Video davom etmoqda..."; }
      setTimeout(fvidResume, 650);
    } else {
      fvidReplay();
    }
  }

  function fvidFinish(reason){
    const st = fvidState;
    if(!st || st.screen !== "player" || st.phase === "done") return;
    fvidStop();
    st.phase = "done";
    const v = FVID_ALL[st.vi];
    const total = st.cps.length;
    const ok = st.okCount;
    const pct = total ? Math.round(ok / total * 100) : 0;
    try{
      const p = fvidGetProg();
      p.done = p.done || {};
      p.done[v.k] = { pct: pct, ok: ok, total: total, date: new Date().toISOString().split("T")[0] };
      p.minutes = (p.minutes || 0) + Math.round((v.len || 0) / 60);
      fvidSetProg(p);
      const dn = Object.keys(p.done).length;
      let sum = 0;
      Object.keys(p.done).forEach(function(k){ sum += (p.done[k].pct || 0); });
      if(dn > 0){
        testProgress.videos = { count: dn, pct: Math.round(sum / dn), date: new Date().toISOString().split("T")[0] };
        if(typeof updateResultsDisplay === "function") updateResultsDisplay();
      }
    }catch(e){}
    const next = (st.vi + 1) % FVID_ALL.length;
    document.getElementById("videos-content").innerHTML = `
      <div class="fvid-wrap">
        <div class="fvid-donebox">
          <div class="fe">${pct >= 80 ? "🏆" : (pct >= 50 ? "🎉" : "💪")}</div>
          <h3>Video tugadi!</h3>
          <p>${v.e} ${fvidEsc(v.t)}</p>
          <div class="fvid-stats">
            <div class="fvid-stat"><b>${ok}/${total}</b><span>qism to'g'ri</span></div>
            <div class="fvid-stat"><b>${st.firstTry}</b><span>birinchi urinishda</span></div>
            <div class="fvid-stat"><b>${pct}%</b><span>aniqlik</span></div>
          </div>
          ${reason === "end" && ok < total ? `<p style="color:#fbbf24;font-size:12.5px;margin-top:-6px;">ℹ️ Video oxiri musiqa bo'lgani uchun so'nggi qism o'tkazib yuborildi.</p>` : ``}
          <div class="fvid-actions" style="justify-content:center;">
            <button class="fvid-btn ghost" onclick="fvidBack()">← Vidiolar</button>
            <button class="fvid-btn ghost" onclick="fvidOpen(${st.vi})">⟳ Yana bir marta</button>
            <button class="fvid-btn pri" onclick="fvidOpen(${next})">Keyingi video →</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Transkriptni yuklash: Invidious / CORS-proxy / kesh ---
  function fvidBraceJson(s, i){
    let depth = 0, instr = false, esc = false;
    for(let j = i; j < s.length; j++){
      const c = s.charAt(j);
      if(instr){
        if(esc) esc = false;
        else if(c === "\\") esc = true;
        else if(c === "\"") instr = false;
      } else {
        if(c === "\"") instr = true;
        else if(c === "{") depth++;
        else if(c === "}"){
          depth--;
          if(depth === 0){
            try{ return JSON.parse(s.slice(i, j + 1)); }catch(e){ return null; }
          }
        }
      }
    }
    return null;
  }

  const FVID_PROXIES = [
    function(u){ return "https://api.allorigins.win/raw?url=" + encodeURIComponent(u); },
    function(u){ return "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u); }
  ];

  const FVID_INVID = ["https://invidious.jing.rocks", "https://inv.nadeko.net", "https://invidious.privacyredirect.com"];

  function fvidFetchTxt(url, cb){
    let pi = 0;
    function step(){
      if(pi >= FVID_PROXIES.length){ cb(null); return; }
      let pu = "";
      try{ pu = FVID_PROXIES[pi](url); }catch(e){ cb(null); return; }
      fetch(pu).then(function(r){
        if(!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      }).then(function(t){
        if(t && t.length > 200) cb(t);
        else throw new Error("short");
      }).catch(function(){ pi++; setTimeout(step, 400); });
    }
    step();
  }

  function fvidCacheSet(ck, obj){
    try{ localStorage.setItem(ck, JSON.stringify(obj)); }catch(e){}
  }

  function fvidVttTime(s){
    const p = (s || "").trim().replace(",", ".").split(":");
    let t = 0;
    if(p.length === 3) t = Number(p[0]) * 3600 + Number(p[1]) * 60 + parseFloat(p[2]);
    else if(p.length === 2) t = Number(p[0]) * 60 + parseFloat(p[1]);
    return isNaN(t) ? 0 : t;
  }

  function fvidVttToCps(vtt, vlen){
    const lines = vtt.replace(/\r/g, "").split("\n");
    const evs = [];
    let cur = null;
    lines.forEach(function(ln){
      if(ln.indexOf("-->") >= 0){
        if(cur && cur.txt.length) evs.push(cur);
        const seg = ln.split("-->");
        cur = { t0: fvidVttTime(seg[0]), t1: fvidVttTime(seg[1]), txt: [] };
      } else if(cur){
        const t = ln.replace(/<[^>]+>/g, "").trim();
        if(t) cur.txt.push(t);
        else if(cur.txt.length){ evs.push(cur); cur = null; }
      }
    });
    if(cur && cur.txt.length) evs.push(cur);
    return fvidEvsToCps(evs, vlen);
  }

  function fvidEvsToCps(evs, vlen){
    let end = vlen || 0;
    evs.forEach(function(e){ if(e.t1 > end) end = e.t1; });
    if(end <= 0) return null;
    const nb = Math.floor(end / 10) + (end % 10 ? 1 : 0);
    const words = [];
    for(let i = 0; i < nb; i++) words.push([]);
    evs.forEach(function(e){
      if(!e.txt || !e.txt.length) return;
      const bi = Math.min(Math.floor(e.t0 / 10), nb - 1);
      words[bi].push(e.txt.join(" "));
    });
    const cps = [];
    for(let i = 0; i < nb; i++){
      let t = words[i].join(" ");
      t = t.replace(/\[(music|applause|laughter|sound|noise|instrumental|cheering)[^\]]*\]/gi, " ").replace(/[♪♫]+/g, " ").replace(/>+/g, " ").replace(/\s+/g, " ").trim();
      if(t.replace(/[^a-zA-Z']/g, "").length < 2) continue;
      cps.push([Math.min((i + 1) * 10, Math.floor(end)), t]);
    }
    return cps;
  }

  function fvidJson3ToCps(jt, vlen){
    const d = JSON.parse(jt);
    const evs = [];
    (d.events || []).forEach(function(e){
      if(!e.segs) return;
      const txt = e.segs.map(function(s){ return s.utf8 || ""; }).join("").replace(/\n/g, " ").trim();
      if(!txt) return;
      evs.push({ t0: (e.tStartMs || 0) / 1000, t1: (e.tStartMs || 0) / 1000 + (e.dDurationMs || 0) / 1000, txt: [txt] });
    });
    return fvidEvsToCps(evs, vlen);
  }

  function fvidEnsureCps(v, cb){
    if(v.c && v.c.length){ cb({ cps: v.c, kind: "auto" }); return; }
    const ck = "sb_vtcps_" + v.k;
    try{
      const raw = localStorage.getItem(ck);
      if(raw){
        const o = JSON.parse(raw);
        if(o && o.cps && o.cps.length){ cb({ cps: o.cps, kind: "auto" }); return; }
        if(o && o.fail && (Date.now() - o.t) < 3600000){ cb(null); return; }
      }
    }catch(e){}
    let fin = false;
    function done(res){
      if(fin) return;
      fin = true;
      if(res && res.cps && res.cps.length >= 3){
        fvidCacheSet(ck, { cps: res.cps, t: Date.now() });
        cb({ cps: res.cps, kind: "auto" });
      } else {
        fvidCacheSet(ck, { fail: 1, t: Date.now() });
        cb(null);
      }
    }
    // 1) Invidious instanslari (WebVTT)
    let ii = 0;
    function tryInv(){
      if(fin) return;
      if(ii >= FVID_INVID.length){ tryProxy(); return; }
      const base = FVID_INVID[ii++];
      fetch(base + "/api/v1/captions/" + v.yt).then(function(r){
        return r.ok ? r.json() : null;
      }).then(function(list){
        const caps = (list && list.captions) || [];
        const en = caps.filter(function(c){ return ((c.languageCode || c.code || "") + "").indexOf("en") === 0; })[0];
        if(!en) throw new Error("no-en");
        const u = en.url ? (base + en.url) : (base + "/api/v1/captions/" + v.yt + "?lang=en");
        return fetch(u).then(function(r2){
          return r2.ok ? r2.text() : null;
        }).then(function(vtt){
          if(!vtt || vtt.indexOf("-->") < 0) throw new Error("no-vtt");
          const cps = fvidVttToCps(vtt, v.len || 0);
          if(!cps || cps.length < 3) throw new Error("few-cps");
          done({ cps: cps });
        });
      }).catch(function(){ setTimeout(tryInv, 300); });
    }
    // 2) Watch sahifa -> captionTracks -> json3 (CORS proxy orqali)
    function tryProxy(){
      if(fin) return;
      const wurl = "https://www.youtube.com/watch?v=" + v.yt + "&hl=en&bpctr=9999999999&has_verified=1";
      fvidFetchTxt(wurl, function(html){
        if(!html){ done(null); return; }
        const ix = html.indexOf("ytInitialPlayerResponse");
        const bi = ix >= 0 ? html.indexOf("{", ix) : -1;
        const pr = bi >= 0 ? fvidBraceJson(html, bi) : null;
        const tracks = (pr && pr.captions && pr.captions.playerCaptionsTracklistRenderer && pr.captions.playerCaptionsTracklistRenderer.captionTracks) || [];
        const en = tracks.filter(function(t){ return (t.languageCode || "").indexOf("en") === 0; });
        const pick = en.filter(function(t){ return t.kind !== "asr"; })[0] || en[0] || null;
        const vlen = (pr && pr.videoDetails && Number(pr.videoDetails.lengthSeconds)) || v.len || 0;
        if(!pick || !pick.baseUrl){ done(null); return; }
        let u = pick.baseUrl;
        if(u.indexOf("fmt=") < 0) u += "&fmt=json3";
        fvidFetchTxt(u, function(jt){
          if(!jt){ done(null); return; }
          let cps = null;
          try{ cps = fvidJson3ToCps(jt, vlen); }catch(e){}
          done(cps && cps.length >= 3 ? { cps: cps } : null);
        });
      });
    }
    tryInv();
  }


  // ==========================================
