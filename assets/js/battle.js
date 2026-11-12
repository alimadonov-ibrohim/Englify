// Englify — battle
  // Battle Mode — rejim tanlash (eski btlRenderIntro)
  function btlShowModes(){
    btlState.screen = 'modes';
    document.getElementById('battle-content').innerHTML = `
      <div class="btlm-wrap">
        <div class="btlm-head">
          <div>
            <div class="btlm-title-row"><span class="btlm-swords">⚔️</span><h2 class="btlm-title">Battle Mode</h2></div>
            <p class="btlm-sub">1v1 · 2v2 · 3v3 · 4v4 —— jamoaviy bilim jangi</p>
          </div>
          <button class="btlm-close" onclick="btlRenderIntro()" aria-label="Orqaga">←</button>
        </div>
        <div class="btlm-grid">
          <div class="btlm-card btlm-random">
            <div class="btlm-ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></div>
            <div class="btlm-name">🎲 Random</div>
            <div class="btlm-desc">Onlayn jamoalar bilan tezkor jang</div>
            <button class="btlm-start" onclick="btlModeRandom()">Boshlash →</button>
          </div>
          <div class="btlm-card btlm-dost">
            <div class="btlm-ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div class="btlm-name">👥 Do'st</div>
            <div class="btlm-desc">Kod bilan guruh bo'lib kurash</div>
            <button class="btlm-start" onclick="btlModeDost()">Boshlash →</button>
          </div>
        </div>
        <div class="btlm-foot">7 savol • har savolga 15 soniya • har o'yinchiga alohida savollar</div>
      </div>`;
  }

  function btlMyRating(){
    const b = testProgress.battle || {};
    return 1200 + (b.wins || 0) * 15 - (b.losses || 0) * 10;
  }

  function btlSimUser(u){
    return {
      name: u.name, ic: u.ic, rating: u.rating,
      acc: Math.min(88, Math.round(50 + (u.rating - 1100) / 12) + Math.floor(Math.random() * 6)),
      tmin: 3.5 + Math.random() * 2,
      tmax: 7.5 + Math.random() * 3.5,
      pts: 0, done: false, correct: false, ansT: 8
    };
  }

  function btlTeamMy(){
    return btlState.playerPts + (btlState.allies || []).reduce((s, a) => s + a.pts, 0);
  }

  function btlTeamOp(){
    return btlState.botPts + (btlState.opponents || []).slice(1).reduce((s, o) => s + o.pts, 0);
  }

  /* ===== REAL 1v1 MATCHMAKING =====
     Bir xil manzildagi (masalan http://127.0.0.1:8138) ikki oyna/tab ochilsa,
     ulardagi haqiqiy foydalanuvchilar avtomatik juftlashadi.
     BroadcastChannel bo'lmasa, localStorage presence orqali onlaynlar ko'rinadi. */
  const BTL_PRESENCE_KEY = 'sb_btl_presence_v1';

  function btlNetId(){
    if(!btlNet.id) btlNet.id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    return btlNet.id;
  }
  function btlMyName(){
    try { const s = getSession(); if(s && s.name) return s.name; } catch(e){}
    return "O'yinchi";
  }
  function btlPresenceRead(){
    try { const o = JSON.parse(localStorage.getItem(BTL_PRESENCE_KEY) || '{}'); return (o && typeof o === 'object') ? o : {}; } catch(e){ return {}; }
  }
  function btlPresenceWrite(){
    try {
      const o = btlPresenceRead();
      const now = Date.now();
      Object.keys(o).forEach(function(k){ if(!o[k] || (now - o[k].ts) > 7000) delete o[k]; });
      o[btlNet.id] = { id:btlNet.id, name:btlMyName(), mode:btlState.mode, ts:now };
      localStorage.setItem(BTL_PRESENCE_KEY, JSON.stringify(o));
    } catch(e){}
  }
  function btlPresenceLeave(){
    try {
      const o = btlPresenceRead();
      delete o[btlNet.id];
      localStorage.setItem(BTL_PRESENCE_KEY, JSON.stringify(o));
    } catch(e){}
  }
  function btlCountOnline(){
    const o = btlPresenceRead();
    const now = Date.now();
    return Object.keys(o).filter(function(k){ return o[k] && (now - o[k].ts) < 7000 && k !== btlNet.id; }).length;
  }
  function btlUpdateOnline(){
    const el = document.getElementById('btlm-online');
    if(el) el.textContent = String(btlCountOnline());
  }
  function btlNetSend(obj){
    if(btlNet.ch){ try { btlNet.ch.postMessage(obj); } catch(e){} }
  }
  function btlPresenceOnStorage(ev){
    if(ev && ev.key === BTL_PRESENCE_KEY){
      btlUpdateOnline();
      if(btlNet.searching) btlNetAnnounce();
    }
  }
  function btlNetAnnounce(){
    if(!btlNet.searching || !btlNet.ch) return;
    btlNetSend({
      type:'search', id:btlNetId(), mode:btlState.mode,
      name:btlMyName(), ic:'🙂', rating:btlMyRating(), ts:Date.now()
    });
  }
  function btlNetInit(){
    btlNetClose();
    btlNetId();
    if('BroadcastChannel' in window){
      try {
        btlNet.ch = new BroadcastChannel('englify_battle_v1');
        btlNet.ch.onmessage = function(ev){ btlNetOnMsg(ev.data || {}); };
      } catch(e){ btlNet.ch = null; }
    }
    btlPresenceWrite();
    btlNet.hb = setInterval(function(){
      btlPresenceWrite();
      btlUpdateOnline();
      if(btlNet.searching) btlNetAnnounce();
    }, 1500);
    btlNet.notifyTimer = setInterval(btlUpdateOnline, 2500);
    try { window.addEventListener('storage', btlPresenceOnStorage); } catch(e){}
  }
  function btlNetClose(){
    btlNet.searching = false;
    btlNet.opp = null;
    btlNet.matchId = null;
    if(btlNet.waitTimer){ clearTimeout(btlNet.waitTimer); btlNet.waitTimer = null; }
    if(btlNet.notifyTimer){ clearInterval(btlNet.notifyTimer); btlNet.notifyTimer = null; }
    if(btlNet.hb){ clearInterval(btlNet.hb); btlNet.hb = null; }
    if(btlNet.ch){ try { btlNet.ch.close(); } catch(e){} btlNet.ch = null; }
    btlPresenceLeave();
    try { window.removeEventListener('storage', btlPresenceOnStorage); } catch(e){}
    btlNet.id = null;
  }
  function btlNetOnMsg(m){
    if(!m || !m.type) return;
    if(m.id === btlNetId()) return;
    if(m.type === 'search'){
      if(btlNet.searching && btlState.screen === 'match' && m.mode === btlState.mode){
        // Kichik ID host bo'ladi — ikki tomon bir vaqtda host bo'lmasligi uchun
        if(String(btlNetId()) < String(m.id)) btlHostMatch(m);
      }
      btlUpdateOnline();
    } else if(m.type === 'match'){
      if(m.to === btlNetId() && btlState.screen === 'match') btlGuestMatch(m);
    } else if(m.type === 'answer'){
      if(m.matchId === btlNet.matchId) btlNetOppAnswer(m);
    } else if(m.type === 'timeout'){
      if(m.matchId === btlNet.matchId) btlNetOppTimeout(m);
    } else if(m.type === 'leave'){
      if(m.matchId === btlNet.matchId && btlState.screen === 'battle' && !btlState.botDone){
        btlState.botDone = true;
        const bs = document.getElementById('btl-bot-status');
        if(bs){ bs.className = 'btl-bot-status no'; bs.textContent = btlState.bot.ic + ' ' + btlState.bot.name + " o'yindan chiqdi"; }
        btlMaybeAdvance();
      }
    }
  }
  function btlHostMatch(opp){
    if(!btlNet.searching) return;
    btlNet.searching = false;
    btlNet.opp = opp;
    btlNet.matchId = 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    btlState.realMatch = true;
    btlState.mode = '1v1';
    btlState.allies = [];
    btlState.bot = { id:opp.id, name:opp.name || "O'yinchi", ic:opp.ic || '🙂', rating:opp.rating || btlMyRating() };
    btlState.opponents = [btlState.bot];
    btlState.questions = sbPickMany(BTL_QBANK, btlState.total);
    btlNetSend({
      type:'match', to:opp.id, matchId:btlNet.matchId,
      host:{ id:btlNetId(), name:btlMyName(), ic:'🙂', rating:btlMyRating() },
      questions: btlState.questions
    });
    btlShowFound(btlState.bot);
  }
  function btlGuestMatch(m){
    if(!m.host) return;
    btlNet.searching = false;
    btlNet.opp = m.host;
    btlNet.matchId = m.matchId;
    btlState.realMatch = true;
    btlState.mode = '1v1';
    btlState.allies = [];
    btlState.bot = { id:m.host.id, name:m.host.name || "O'yinchi", ic:m.host.ic || '🙂', rating:m.host.rating || btlMyRating() };
    btlState.opponents = [btlState.bot];
    btlState.questions = (Array.isArray(m.questions) && m.questions.length) ? m.questions : sbPickMany(BTL_QBANK, btlState.total);
    btlShowFound(btlState.bot);
  }
  function btlShowFound(opp){
    btlClearLobbyTimers();
    if(btlNet.waitTimer){ clearTimeout(btlNet.waitTimer); btlNet.waitTimer = null; }
    const spin = document.getElementById('btlm-spin');
    const st = document.getElementById('btlm-search-t');
    const statusEl = document.getElementById('btlm-status');
    if(spin) spin.style.display = 'none';
    if(st){ st.style.color = '#5eead4'; st.textContent = 'Raqib topildi ✓'; }
    if(statusEl) statusEl.innerHTML = '<span>Jang boshlanmoqda</span><span class="btlm-countdown" id="btlm-cd">3</span>';
    btlMatchJoin({ name:opp.name, ic:opp.ic, rating:opp.rating }, 'r', true);
    let n = 3;
    const iv = setInterval(function(){
      const el = document.getElementById('btlm-cd');
      if(!el) return;
      n--;
      if(n <= 0){
        clearInterval(iv);
        if(btlState.screen === 'match') btlStart(true);
        return;
      }
      el.textContent = String(n);
      el.classList.remove('btlm-cd-anim');
      void el.offsetWidth;
      el.classList.add('btlm-cd-anim');
    }, 900);
    btlLobbyTimers.push(iv);
  }
  function btlNetOppAnswer(m){
    if(!btlState.realMatch || btlState.screen !== 'battle') return;
    // Raqib javobi bizdan bir savol oldinda kelsa — navbatga qo'yamiz
    if(m.qi > btlState.qIdx){ btlState.netQueue[m.qi] = m; return; }
    if(m.qi !== btlState.qIdx || btlState.botDone) return;
    const q = btlState.questions[m.qi];
    if(!q) return;
    btlState.botDone = true;
    const bs = document.getElementById('btl-bot-status');
    if(m.choice === q.ans){
      const t = Math.max(0, Math.min(15, Number(m.time) || 0));
      const pts = 10 + Math.round(t * 0.5);
      btlState.botPts += pts;
      if(bs){ bs.className = 'btl-bot-status ok'; bs.textContent = btlState.bot.ic + ' ' + btlState.bot.name + ' javob berdi ✓ (+' + pts + ' ball)'; }
      btlFloatPts('+' + pts, 'bot');
    } else {
      if(bs){ bs.className = 'btl-bot-status no'; bs.textContent = btlState.bot.ic + ' ' + btlState.bot.name + ' xato javob berdi ✗'; }
    }
    btlUpdateBars();
    btlMaybeAdvance();
  }
  function btlNetOppTimeout(m){
    if(!btlState.realMatch || btlState.screen !== 'battle') return;
    if(m.qi > btlState.qIdx){ btlState.netQueue[m.qi] = m; return; }
    if(m.qi !== btlState.qIdx || btlState.botDone) return;
    btlState.botDone = true;
    const bs = document.getElementById('btl-bot-status');
    if(bs){ bs.className = 'btl-bot-status no'; bs.textContent = btlState.bot.ic + ' ' + btlState.bot.name + ' vaqtida javob bermadi'; }
    btlUpdateBars();
    btlMaybeAdvance();
  }

  function btlModeRandom(){
    btlClearLobbyTimers();
    btlState.screen = 'match';
    btlState.mode = '1v1';
    btlState.matchDone = false;
    btlState.realMatch = false;
    btlState.allies = [];
    btlState.opponents = [];
    btlState.bot = null;
    document.getElementById('battle-content').innerHTML = `
      <div class="btlm-wrap">
        <div class="btlm-head">
          <div>
            <div class="btlm-title-row"><span class="btlm-swords">🎲</span><h2 class="btlm-title">Random jang</h2></div>
            <p class="btlm-sub">Haqiqiy foydalanuvchi bilan 1 vs 1 onlayn jang</p>
          </div>
          <button class="btlm-close" onclick="battleBack()" aria-label="Yopish">✕</button>
        </div>
        <div class="btlm-fmt-row">
          <button class="btlm-fmt active" id="btlm-fmt-1v1">1 vs 1 — REAL</button>
        </div>
        <div class="btlm-search">
          <div class="btlm-spin" id="btlm-spin"></div>
          <div class="btlm-search-t" id="btlm-search-t">Ikkinchi o'yinchi qidirilmoqda</div>
          <div class="btlm-search-s"><span class="live">●</span> Onlayn: <span id="btlm-online">0</span> foydalanuvchi</div>
        </div>
        <div class="btlm-teams">
          <div>
            <div class="btlm-team-h">🙂 SIZNING JAMOA</div>
            <div class="btlm-team-col" id="btlm-team-l"></div>
          </div>
          <div>
            <div class="btlm-team-h">🎯 RAQIB</div>
            <div class="btlm-team-col" id="btlm-team-r"></div>
          </div>
        </div>
        <div class="btlm-status" id="btlm-status"><span>Real o'yinchi qidiruv aktiv</span><span class="dots"></span></div>
        <p style="font-size:12px;color:var(--ink-soft);text-align:center;margin-top:12px;line-height:1.6;">Ikkinchi o'yinchi uchun saytni boshqa oynada oching: <b>http://127.0.0.1:8138</b></p>
      </div>`;
    btlBeginSearch();
  }

  function btlSetMode(m){
    // Hozircha faqat real 1v1 rejimi mavjud
    if(m !== '1v1' || btlState.screen !== 'match') return;
    const el = document.getElementById('btlm-fmt-1v1');
    if(el) el.classList.add('active');
  }

  function btlBeginSearch(){
    btlClearLobbyTimers();
    btlState.matchDone = false;
    btlState.realMatch = false;
    btlState.allies = [];
    btlState.opponents = [];
    btlState.bot = null;
    btlState.mode = '1v1';
    const l = document.getElementById('btlm-team-l');
    const r = document.getElementById('btlm-team-r');
    const spin = document.getElementById('btlm-spin');
    const st = document.getElementById('btlm-search-t');
    const statusEl = document.getElementById('btlm-status');
    if(l) l.innerHTML = `<div class="btlm-player"><div class="btlm-player-av">🙂</div><div class="btlm-player-name">Siz</div><div class="btlm-player-rate">⭐ ${btlMyRating()}</div><div class="btlm-player-tag">tayyor</div></div>`;
    if(r) r.innerHTML = '';
    if(spin) spin.style.display = 'flex';
    if(st){ st.style.color = '#fff'; st.textContent = "Ikkinchi o'yinchi qidirilmoqda..."; }
    if(statusEl) statusEl.innerHTML = '<span>Real o\'yinchi qidiruv aktiv</span><span class="dots"></span>';
    // Haqiqiy matchmaking — boshqa oyna/tabdagi foydalanuvchilar bilan
    btlNetInit();
    btlNet.searching = true;
    btlPresenceWrite();
    btlUpdateOnline();
    btlNetAnnounce();
    if(!btlNet.ch && statusEl){
      statusEl.innerHTML = '<span>Bu brauzerda real matchmaking mavjud emas — Chrome/Edge ishlatib, saytni http://127.0.0.1:8138 orqali oching</span>';
    } else if(location.protocol === 'file:' && statusEl){
      statusEl.innerHTML = '<span>Real jang uchun saytni server orqali oching: http://127.0.0.1:8138</span>';
    }
    btlNet.waitTimer = setTimeout(function(){
      if(btlState.screen !== 'match' || !btlNet.searching) return;
      const st2 = document.getElementById('btlm-search-t');
      const sp2 = document.getElementById('btlm-spin');
      if(st2){ st2.style.color = '#fde68a'; st2.textContent = 'Hozircha real raqib topilmadi'; }
      if(sp2) sp2.style.display = 'none';
      const se = document.getElementById('btlm-status');
      if(se) se.innerHTML = '<span>Saytni ikkinchi oynada ochib, qayta urinib ko\'ring</span>';
    }, 12000);
  }

  function btlMatchJoin(m, side, first){
    if(btlState.screen !== 'match' || btlState.matchDone) return;
    const col = document.getElementById(side === 'l' ? 'btlm-team-l' : 'btlm-team-r');
    if(!col) return;
    col.innerHTML += `
      <div class="btlm-player">
        <div class="btlm-player-av">${m.ic}</div>
        <div class="btlm-player-name">${m.name}</div>
        <div class="btlm-player-rate">⭐ ${m.rating}</div>
        <div class="btlm-player-tag">qo'shildi ✓</div>
      </div>`;
    if(first){
      const stEl = document.getElementById('btlm-search-t');
      if(stEl){ stEl.style.color = '#5eead4'; stEl.textContent = 'Raqib topildi ✓'; }
    }
    if(side === 'r' && first && !btlState.bot) btlState.bot = m;
  }

  function btlSimAnswer(m){
    if(btlState.screen !== 'battle' || m.done) return;
    m.done = true;
    const bs = document.getElementById('btl-bot-status');
    const side = (btlState.allies || []).indexOf(m) >= 0 ? 'player' : 'bot';
    if(m.correct){
      const pts = 10 + Math.round((15 - Math.min(m.ansT || 8, 14)) * 0.5);
      m.pts += pts;
      if(bs){ bs.className = 'btl-bot-status ok'; bs.textContent = m.ic + ' ' + m.name + ' javob berdi ✓ (+' + pts + ' ball)'; }
      btlFloatPts('+' + pts, side);
    } else {
      if(bs){ bs.className = 'btl-bot-status no'; bs.textContent = m.ic + ' ' + m.name + ' xato javob berdi ✗'; }
    }
    btlUpdateBars();
  }


  const BTL_FRIENDS = [
    { name:'Malika',  ic:'👩‍🎓', acc:66 },
    { name:'Jasur',   ic:'🧑‍💻', acc:72 },
    { name:'Nilufar', ic:'👩‍🏫', acc:70 },
    { name:'Azizbek', ic:'🧑‍🎨', acc:62 },
    { name:'Sardor',  ic:'🧑‍🚀', acc:75 }
  ];

  function btlGenCode(){
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let s = '';
    for(let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return 'SB-' + s;
  }

  function btlClearLobbyTimers(){
    btlLobbyTimers.forEach(t => { clearTimeout(t); clearInterval(t); });
    btlLobbyTimers = [];
  }

  // 👥 Do'st — xona kodi bilan do'stlik jangi
  function btlModeDost(){
    btlClearLobbyTimers();
    btlState.screen = 'room';
    btlState.lobbyStarted = false;
    btlState.roomCode = btlGenCode();
    btlState.friend = null;
    btlState.bot = null;
    document.getElementById('battle-content').innerHTML = `
      <div class="btlm-wrap">
        <div class="btlm-head">
          <div>
            <div class="btlm-title-row"><span class="btlm-swords">👥</span><h2 class="btlm-title">Do'st bilan jang</h2></div>
            <p class="btlm-sub">Kodni do'stlaringizga yuboring — bir xil kod bilan bir maydonda jang qilasiz</p>
          </div>
          <button class="btlm-close" onclick="battleBack()" aria-label="Orqaga">✕</button>
        </div>
        <div class="btlm-room-label">XONA KODI</div>
        <div class="btlm-code-box"><span class="btlm-code" id="btlm-code">${btlState.roomCode}</span></div>
        <button class="btlm-copy" id="btlm-copy-btn" onclick="btlCopyCode()">📋 Nusxa olish</button>
        <div class="btlm-join-row" id="btlm-join-row">
          <input id="btlm-join-input" maxlength="10" placeholder="Do'st kodi: SB-XXYY" aria-label="Kod kiriting">
          <button class="btlm-join-btn" onclick="btlLobbyJoin()">Qo'shilish</button>
        </div>
        <div class="btlm-players" id="btlm-players"></div>
        <div class="btlm-status" id="btlm-status"><span>Do'stlaringiz kutilmoqda</span><span class="dots"></span></div>
      </div>`;
    // simulyatsiya: do'st avtomatik qo'shiladi
    btlLobbyTimers.push(setTimeout(() => btlLobbyJoin(), 1800));
  }

  function btlCopyCode(){
    const btn = document.getElementById('btlm-copy-btn');
    const done = () => {
      if(!btn) return;
      btn.textContent = '✓ Nusxalandi';
      setTimeout(() => { if(btn) btn.textContent = '📋 Nusxa olish'; }, 1600);
    };
    try {
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(btlState.roomCode).then(done).catch(done);
      } else {
        const ta = document.createElement('textarea');
        ta.value = btlState.roomCode;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        done();
      }
    } catch(e){ done(); }
  }

  function btlLobbyJoin(){
    if(btlState.lobbyStarted || btlState.screen !== 'room') return;
    btlState.lobbyStarted = true;
    const input = document.getElementById('btlm-join-input');
    if(input && input.value.trim()){
      let v = input.value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
      if(!v.startsWith('SB-')) v = 'SB-' + v.replace(/^-+/, '');
      if(v.length >= 3) btlState.roomCode = v.slice(0, 8);
    }
    const codeEl = document.getElementById('btlm-code');
    if(codeEl) codeEl.textContent = btlState.roomCode;
    const inputRow = document.getElementById('btlm-join-row');
    if(inputRow) inputRow.style.display = 'none';
    const f = BTL_FRIENDS[Math.floor(Math.random() * BTL_FRIENDS.length)];
    btlState.friend = f;
    btlState.bot = { id:'friend', ic:f.ic, name:f.name, desc:"Do'st", acc:f.acc, tmin:4, tmax:9, stat:"Do'st jangi" };
    const lobby = document.getElementById('btlm-players');
    if(lobby){
      lobby.innerHTML = `
        <div class="btlm-player">
          <div class="btlm-player-av">🙂</div>
          <div class="btlm-player-name">Siz</div>
          <div class="btlm-player-tag host">xonani ochdingiz</div>
        </div>
        <div class="btlm-player">
          <div class="btlm-player-av">${f.ic}</div>
          <div class="btlm-player-name">${f.name}</div>
          <div class="btlm-player-tag">qo'shildi ✓</div>
        </div>`;
    }
    const st = document.getElementById('btlm-status');
    if(st) st.innerHTML = '<span>Jang boshlanmoqda</span><span class="btlm-countdown" id="btlm-cd">3</span>';
    let n = 3;
    const tick = () => {
      const el = document.getElementById('btlm-cd');
      if(!el){ btlClearLobbyTimers(); return; }
      n--;
      if(n <= 0){
        btlClearLobbyTimers();
        if(btlState.screen === 'room') btlStart();
        return;
      }
      el.textContent = String(n);
      el.classList.remove('btlm-cd-anim');
      void el.offsetWidth;
      el.classList.add('btlm-cd-anim');
    };
    btlLobbyTimers.push(setTimeout(() => {
      if(btlState.screen !== 'room') return;
      btlLobbyTimers.push(setInterval(tick, 900));
    }, 900));
  }
  function btlStart(keepQuestions){
    if(!btlState.bot) return;
    btlState.screen = 'loading';
    // Real jangda ikkala o'yinchi bir xil savollarni oladi (host tanlaydi).
    if(!keepQuestions || !btlState.questions || !btlState.questions.length){
      btlState.questions = sbPickMany(BTL_QBANK, btlState.total);
    }
    document.getElementById('battle-content').innerHTML = `
      <div class="btl-wrap" style="text-align:center;">
        <div class="btl-ring-wrap">
          <svg width="144" height="144" viewBox="0 0 144 144" style="transform:rotate(-90deg);">
            <circle cx="72" cy="72" r="54" fill="none" stroke="var(--field)" stroke-width="10"/>
            <circle id="btl-ring" cx="72" cy="72" r="54" fill="none" stroke="url(#btlGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="339.292" stroke-dashoffset="339.292"/>
            <defs>
              <linearGradient id="btlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#dc2626"/>
                <stop offset="100%" stop-color="#991b1b"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="btl-ring-pct" id="btl-ring-pct">0%</div>
        </div>
        <h3 class="btl-title" style="margin-bottom:8px;">Maydon tayyorlanmoqda...</h3>
        <p style="color:var(--ink-soft);font-size:13.5px;margin:0 0 6px;">${btlState.bot.ic} ${btlState.bot.name} maydonga chiqmoqda</p>
        <div class="btl-load-bar"><div class="btl-load-fill" id="btl-load" style="width:0%"></div></div>
      </div>`;
    const C = 2 * Math.PI * 54;
    let pct = 0;
    btlLoadTimer = setInterval(() => {
      pct += 9 + Math.random()*11;
      if(pct >= 100){
        pct = 100;
        clearInterval(btlLoadTimer);
        const rp = document.getElementById('btl-ring-pct');
        const r = document.getElementById('btl-ring');
        const l = document.getElementById('btl-load');
        if(rp) rp.textContent = '100%';
        if(r) r.setAttribute('stroke-dashoffset', '0');
        if(l) l.style.width = '100%';
        setTimeout(() => btlBegin(), 400);
        return;
      }
      const rp = document.getElementById('btl-ring-pct');
      const r = document.getElementById('btl-ring');
      const l = document.getElementById('btl-load');
      if(rp) rp.textContent = Math.floor(pct) + '%';
      if(r) r.setAttribute('stroke-dashoffset', String(C * (1 - pct/100)));
      if(l) l.style.width = pct + '%';
    }, 130);
  }

  function btlBegin(){
    btlState.screen = 'battle';
    btlState.qIdx = 0;
    btlState.playerPts = 0;
    btlState.botPts = 0;
    btlState.advancing = false;
    btlState.netQueue = {};
    btlState.streak = 0;
    btlState.maxStreak = 0;
    btlState.correctCount = 0;
    let pInitial = 'S';
    try {
      const sess = getSession();
      if(sess && sess.name) pInitial = sess.name.trim()[0].toUpperCase();
    } catch(e){}
    document.getElementById('battle-content').innerHTML = `
      <div class="btl-wrap">
        <div class="btl-vs-head" style="position:relative;">
          <div class="btl-side">
            <div class="btl-av player">${pInitial}</div>
            <div class="btl-side-info">
              <div class="btl-name">${btlState.mode === '1v1' ? 'Siz' : 'Sizning jamoa'}<span class="btl-streak" id="btl-streak" style="display:none;">🔥 x<span id="btl-streak-n">2</span></span></div>
              <div class="btl-bar"><div class="btl-bar-fill player" id="btl-p-bar" style="width:0%"></div></div>
              <div class="btl-pts"><span id="btl-p-pts">0</span> ball</div>
              <div class="btl-members" id="btl-members-l"></div>
            </div>
          </div>
          <div class="btl-vs-badge">VS</div>
          <div class="btl-side right">
            <div class="btl-av bot">${btlState.bot.ic}</div>
            <div class="btl-side-info">
              <div class="btl-name" style="text-align:right;">${btlState.bot.name}${btlState.mode !== '1v1' ? ' jamoasi' : ''}</div>
              <div class="btl-bar"><div class="btl-bar-fill bot" id="btl-b-bar" style="width:0%"></div></div>
              <div class="btl-pts" style="text-align:right;"><span id="btl-b-pts">0</span> ball</div>
              <div class="btl-members" id="btl-members-r" style="text-align:right;"></div>
            </div>
          </div>
        </div>
        <div class="btl-qcount" id="btl-qcount">1/${btlState.total} SAVOL</div>
        <div class="btl-qcard" style="position:relative;">
          <div class="btl-qtext" id="btl-qtext"></div>
          <div id="btl-opts"></div>
        </div>
        <div class="btl-timer-row">
          <span class="btl-timer-sec" id="btl-tsec">15s</span>
          <div class="btl-timer-bar"><div class="btl-timer-fill" id="btl-tfill" style="width:100%"></div></div>
        </div>
        <div class="btl-bot-status" id="btl-bot-status">${btlState.bot.ic} ${btlState.bot.name} o'ylamoqda...</div>
      </div>`;
    btlAsk();
  }

  function btlAsk(){
    const q = btlState.questions[btlState.qIdx];
    btlState.playerDone = false;
    btlState.botDone = false;
    btlState.advancing = false;
    btlState.timeLeft = 15;
    const qc = document.getElementById('btl-qcount');
    if(qc) qc.textContent = (btlState.qIdx + 1) + '/' + btlState.total + ' SAVOL';
    const qt = document.getElementById('btl-qtext');
    if(qt) qt.textContent = q.q;
    const opts = document.getElementById('btl-opts');
    if(opts){
      opts.innerHTML = q.opts.map((o, i) => `
        <button class="btl-opt" id="btl-opt-${i}" onclick="btlPick(${i})">
          <span class="btl-opt-letter">${'ABCD'[i]}</span>
          <span>${o}</span>
        </button>`).join('');
    }
    const bs = document.getElementById('btl-bot-status');
    if(bs){ bs.className = 'btl-bot-status'; bs.textContent = btlState.bot.ic + ' ' + btlState.bot.name + " o'ylamoqda..."; }
    if(btlState.realMatch){
      // Real raqib javobini tarmoq orqali kutamiz
      if(btlBotTimer) clearTimeout(btlBotTimer);
      const bs2 = document.getElementById('btl-bot-status');
      if(bs2){ bs2.className = 'btl-bot-status'; bs2.textContent = btlState.bot.ic + ' ' + btlState.bot.name + ' javobini kutmoqda...'; }
    } else {
      // bot javobini rejalashtirish
      btlState.botTime = btlState.bot.tmin + Math.random() * (btlState.bot.tmax - btlState.bot.tmin);
      btlState.botCorrect = Math.random() * 100 < btlState.bot.acc;
      if(btlBotTimer) clearTimeout(btlBotTimer);
      btlBotTimer = setTimeout(btlBotAnswer, Math.min(btlState.botTime, 13.5) * 1000);
      // jamoadoshlar va qolgan raqiblar
      btlSimTimers.forEach(clearTimeout);
      btlSimTimers = [];
      const sims = (btlState.allies || []).concat((btlState.opponents || []).slice(1));
      sims.forEach(m => {
        m.done = false;
        const t = m.tmin + Math.random() * (m.tmax - m.tmin);
        m.ansT = t;
        m.correct = Math.random() * 100 < m.acc;
        btlSimTimers.push(setTimeout(() => btlSimAnswer(m), Math.min(t, 13.8) * 1000));
      });
    }
    // taymer
    if(btlQTimer) clearInterval(btlQTimer);
    btlQTimer = setInterval(btlTick, 100);
    btlTick();
    // Oldindan kelib qolgan raqib javobini qo'llash
    if(btlState.realMatch && btlState.netQueue && btlState.netQueue[btlState.qIdx]){
      const queued = btlState.netQueue[btlState.qIdx];
      delete btlState.netQueue[btlState.qIdx];
      setTimeout(function(){ btlNetOppAnswer(queued); }, 30);
    }
  }

  function btlTick(){
    btlState.timeLeft -= 0.1;
    const secEl = document.getElementById('btl-tsec');
    const fillEl = document.getElementById('btl-tfill');
    const disp = Math.max(0, Math.ceil(btlState.timeLeft));
    if(secEl){
      secEl.textContent = disp + 's';
      secEl.classList.toggle('warn', btlState.timeLeft <= 8 && btlState.timeLeft > 4);
      secEl.classList.toggle('danger', btlState.timeLeft <= 4);
    }
    if(fillEl){
      fillEl.style.width = Math.max(0, (btlState.timeLeft / 15) * 100) + '%';
      fillEl.classList.toggle('warn', btlState.timeLeft <= 8 && btlState.timeLeft > 4);
      fillEl.classList.toggle('danger', btlState.timeLeft <= 4);
    }
    if(btlState.timeLeft <= 0){
      clearInterval(btlQTimer);
      // vaqt tugadi
      if(!btlState.playerDone){
        btlState.playerDone = true;
        btlState.streak = 0;
        const q = btlState.questions[btlState.qIdx];
        const cEl = document.getElementById('btl-opt-' + q.ans);
        if(cEl) cEl.classList.add('correct');
        for(let i = 0; i < 4; i++){
          const oEl = document.getElementById('btl-opt-' + i);
          if(oEl && i !== q.ans) oEl.classList.add('dim');
        }
        btlFloatPts('+0', 'player');
      }
      if(!btlState.botDone){
        if(btlState.realMatch){
          const qi = btlState.qIdx;
          btlNetSend({ type:'timeout', matchId:btlNet.matchId, qi:qi });
          // Raqib javobi kelmasa — 2.5 soniyadan keyin davom etamiz
          setTimeout(function(){
            if(btlState.screen === 'battle' && btlState.qIdx === qi && !btlState.botDone){
              btlState.botDone = true;
              btlUpdateBars();
              btlMaybeAdvance();
            }
          }, 2500);
        } else {
          if(btlBotTimer) clearTimeout(btlBotTimer);
          btlBotAnswer();
        }
      }
      btlMaybeAdvance();
    }
  }

  function btlPick(i){
    if(btlState.playerDone || btlState.screen !== 'battle') return;
    btlState.playerDone = true;
    const q = btlState.questions[btlState.qIdx];
    const correct = (i === q.ans);
    // barcha variantlarni bloklash
    for(let k = 0; k < 4; k++){
      const oEl = document.getElementById('btl-opt-' + k);
      if(oEl) oEl.classList.add('locked');
    }
    if(correct){
      btlState.streak++;
      btlState.maxStreak = Math.max(btlState.maxStreak, btlState.streak);
      btlState.correctCount++;
      let pts = 10 + Math.round(btlState.timeLeft * 0.5);
      if(btlState.streak >= 3 && !btlState.realMatch) pts += 5;
      btlState.playerPts += pts;
      const cEl = document.getElementById('btl-opt-' + i);
      if(cEl) cEl.classList.add('correct');
      btlFloatPts('+' + pts, 'player');
    } else {
      btlState.streak = 0;
      const wEl = document.getElementById('btl-opt-' + i);
      if(wEl) wEl.classList.add('wrong');
      const cEl = document.getElementById('btl-opt-' + q.ans);
      if(cEl) cEl.classList.add('correct');
      btlFloatPts('+0', 'player');
    }
    // qolgan variantlarni xira qilish
    for(let k = 0; k < 4; k++){
      if(k !== i && k !== q.ans){
        const oEl = document.getElementById('btl-opt-' + k);
        if(oEl) oEl.classList.add('dim');
      }
    }
    if(btlState.realMatch){
      btlNetSend({
        type:'answer', matchId:btlNet.matchId, qi:btlState.qIdx,
        choice:i, time:Math.max(0, btlState.timeLeft)
      });
    }
    btlUpdateBars();
    btlMaybeAdvance();
  }

  function btlBotAnswer(){
    if(btlState.botDone || btlState.screen !== 'battle') return;
    btlState.botDone = true;
    if(btlBotTimer) clearTimeout(btlBotTimer);
    const bs = document.getElementById('btl-bot-status');
    if(btlState.botCorrect){
      let pts = 10 + Math.round((15 - Math.min(btlState.botTime, 14)) * 0.5);
      btlState.botPts += pts;
      if(bs){ bs.className = 'btl-bot-status ok'; bs.textContent = btlState.bot.ic + ' ' + btlState.bot.name + ' javob berdi ✓ (+' + pts + ' ball)'; }
    } else {
      if(bs){ bs.className = 'btl-bot-status no'; bs.textContent = btlState.bot.ic + ' ' + btlState.bot.name + ' xato javob berdi ✗'; }
    }
    btlUpdateBars();
    btlMaybeAdvance();
  }

  function btlMaybeAdvance(){
    if(btlState.advancing) return;
    if(btlState.playerDone && btlState.botDone && btlState.screen === 'battle'){
      btlState.advancing = true;
      if(btlQTimer) clearInterval(btlQTimer);
      // seriya ko'rsatkichini yangilash
      const st = document.getElementById('btl-streak');
      const stN = document.getElementById('btl-streak-n');
      if(st && stN){
        st.style.display = btlState.streak >= 2 ? 'inline-flex' : 'none';
        stN.textContent = btlState.streak;
      }
      setTimeout(() => {
        if(btlState.screen !== 'battle') return;
        btlState.qIdx++;
        if(btlState.qIdx >= btlState.total) btlFinish();
        else btlAsk();
      }, 1400);
    }
  }

  function btlUpdateBars(){
    const pEl = document.getElementById('btl-p-pts');
    const bEl = document.getElementById('btl-b-pts');
    const pBar = document.getElementById('btl-p-bar');
    const bBar = document.getElementById('btl-b-bar');
    const my = btlTeamMy();
    const op = btlTeamOp();
    const scale = 110 * (({'1v1':1,'2v2':2,'4v4':4})[btlState.mode] || 1);
    if(pEl) pEl.textContent = my;
    if(bEl) bEl.textContent = op;
    if(pBar) pBar.style.width = Math.min(100, (my / scale) * 100) + '%';
    if(bBar) bBar.style.width = Math.min(100, (op / scale) * 100) + '%';
    const ml = document.getElementById('btl-members-l');
    const mr = document.getElementById('btl-members-r');
    if(ml && btlState.mode !== '1v1'){
      ml.innerHTML = ['🙂 ' + btlState.playerPts].concat((btlState.allies || []).map(a => a.ic + ' ' + a.pts)).join(' · ');
    }
    if(mr && btlState.mode !== '1v1'){
      mr.innerHTML = [btlState.bot.ic + ' ' + btlState.botPts].concat((btlState.opponents || []).slice(1).map(o => o.ic + ' ' + o.pts)).join(' · ');
    }
  }

  function btlFloatPts(text, side){
    const head = document.querySelector('.btl-vs-head');
    if(!head) return;
    const f = document.createElement('div');
    f.className = 'btl-float-pts';
    f.textContent = text;
    f.style.color = side === 'player' ? '#2563eb' : '#dc2626';
    f.style[side === 'player' ? 'left' : 'right'] = '24px';
    f.style.top = '10px';
    head.appendChild(f);
    setTimeout(() => { if(f.parentNode) f.remove(); }, 1300);
  }

  function btlFinish(){
    btlState.screen = 'result';
    btlState.advancing = false;
    btlState.netQueue = {};
    if(btlState.realMatch && btlNet.matchId){
      btlNetSend({ type:'leave', matchId:btlNet.matchId, id:btlNet.id });
    }
    btlNetClose();
    if(btlQTimer) clearInterval(btlQTimer);
    if(btlBotTimer) clearTimeout(btlBotTimer);
    btlSimTimers.forEach(clearTimeout);
    btlSimTimers = [];
    const teamMode = btlState.mode !== '1v1';
    const my = btlTeamMy();
    const op = btlTeamOp();
    const win = my > op;
    const draw = my === op;
    const accuracy = Math.round((btlState.correctCount / btlState.total) * 100);
    const prev = testProgress.battle || { wins: 0, losses: 0, draws: 0 };
    testProgress.battle = {
      completed: true,
      band: 0,
      pct: accuracy,
      score: my + '-' + op + (win ? " g'alaba" : (draw ? ' durrang' : " mag'lubiyat")) + (teamMode ? ' (' + btlState.mode + ')' : ''),
      date: new Date().toISOString().split('T')[0],
      wins: (prev.wins || 0) + (win ? 1 : 0),
      losses: (prev.losses || 0) + (!win && !draw ? 1 : 0),
      draws: (prev.draws || 0) + (draw ? 1 : 0)
    };
    if(typeof saveUserProgress === 'function') saveUserProgress();
    const icon = win ? '🏆' : (draw ? '🤝' : '💔');
    const title = win ? "G'alaba!" : (draw ? 'Durrang!' : "Mag'lubiyat!");
    const sub = teamMode
      ? (win ? "Jamoaingiz raqiblarni yengdi — zo'r hamkorlik!" : (draw ? "Jamoalar teng kuch — qayta jang qiling!" : "Raqib jamoasi kuchliroq chiqdi — yana urinib ko'ring!"))
      : (win ? btlState.bot.ic + ' ' + btlState.bot.name + 'ni yutdingiz! Ajoyib o\'yin!' : (draw ? "Raqib bilan teng o'ynadingiz — yana urinib ko'ring!" : btlState.bot.ic + ' ' + btlState.bot.name + ' yutdi — keyingi safar tezroq javob bering!'));
    const myLine = ['Siz ' + btlState.playerPts].concat((btlState.allies || []).map(a => a.name + ' ' + a.pts)).join(' · ');
    const opLine = [btlState.bot.name + ' ' + btlState.botPts].concat((btlState.opponents || []).slice(1).map(o => o.name + ' ' + o.pts)).join(' · ');
    document.getElementById('battle-content').innerHTML = `
      <div class="btl-wrap">
        <div class="btl-res-card">
          <div class="btl-res-icon">${icon}</div>
          <div class="btl-res-title">${title}</div>
          <div class="btl-res-sub">${sub}</div>
          <div class="btl-vs-final">
            <span class="num">${my}</span>
            <span class="dash">—</span>
            <span class="num">${op}</span>
          </div>
          <div style="font-size:11.5px;opacity:.85;margin-top:4px;">${teamMode ? 'Sizning jamoa vs ' + btlState.bot.name + ' jamoasi' : 'Siz vs ' + btlState.bot.name}</div>
        </div>
        <div class="btl-stats-grid">
          <div class="btl-stat-item"><div class="btl-stat-num">${btlState.correctCount}/${btlState.total}</div><div class="btl-stat-label">TO'G'RI JAVOB</div></div>
          <div class="btl-stat-item"><div class="btl-stat-num">${accuracy}%</div><div class="btl-stat-label">ANIQLIK</div></div>
          <div class="btl-stat-item"><div class="btl-stat-num">🔥${btlState.maxStreak}</div><div class="btl-stat-label">MAX SERIYA</div></div>
        </div>
        ${teamMode ? `
        <div class="btl-teams-bd">
          <div><span class="tag mine">🙂 SIZNING JAMOA</span> ${myLine}</div>
          <div><span class="tag opp">🎯 RAQIB JAMOA</span> ${opLine}</div>
        </div>` : ''}
        <div class="btl-feedback">
          <strong>Jang tahlili:</strong><br>
          • Sizning balingiz: <strong>${btlState.playerPts}</strong> — ${teamMode ? 'Jamoa bali' : 'Raqib bali'}: <strong>${my} — ${op}</strong><br>
          • Umumiy rekord: ${testProgress.battle.wins} g'alaba, ${testProgress.battle.losses} mag'lubiyat, ${testProgress.battle.draws} durrang<br>
          ${win
            ? "• Zo'r! Tezlik bonusi va seriyalardan unumli foydalaning — keyingi jangda qiyinroq raqiblar kutmoqda."
            : "• Maslahat: javobni oxirgi soniyalarda emas, imkon qadar tez bering — tezlik bonusi ko'proq ball beradi."}
        </div>
        <div class="btl-comeback">Har kuni jang qiling — tezlik va aniqlik o'sib boradi! ⚔️</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btl-btn" style="flex:1;" onclick="openBattle()">🔄 Yana jang</button>
          <button class="btl-btn-outline" style="flex:1;" onclick="switchTab('home')">🏠 Bosh sahifa</button>
        </div>
      </div>`;
  }

  function btlCleanup(){
    if(btlState && btlState.realMatch && btlNet.matchId){
      btlNetSend({ type:'leave', matchId:btlNet.matchId, id:btlNet.id });
    }
    btlNetClose();
    btlClearLobbyTimers();
    btlSimTimers.forEach(clearTimeout);
    btlSimTimers = [];
    if(btlLoadTimer) clearInterval(btlLoadTimer);
    if(btlQTimer) clearInterval(btlQTimer);
    if(btlBotTimer) clearTimeout(btlBotTimer);
    btlLoadTimer = null;
    btlQTimer = null;
    btlBotTimer = null;
  }

  /* Orqaga — jang davomida tasdiq so'raladi */
  function battleBack(){
    if(btlState.screen === 'battle'){
      if(!confirm("Jang tugallanmagan! Agar chiqsangiz, natija saqlanmaydi. Chiqishni tasdiqlaysizmi?")) return;
    }
    if(btlState.screen === 'loading') clearInterval(btlLoadTimer);
    btlCleanup();
    switchTab('home');
  }

