// Englify — advice
  // --- AI BILAN MASLAHAT (Gemini mentor) ---
  const ADVICE_WELCOME = "Salom! Men Englify AI maslahatchisiman. 👋\n\nGrammatika, lug'at, talaffuz, IELTS (Listening, Reading, Writing, Speaking), o'qish rejasi yoki tushunmagan mavzularingiz bo'yicha savol bering. O'zbek yoki ingliz tilida yozishingiz mumkin — javobni shu tilda beraman.";

  const ADVICE_SUGGESTIONS = [
    "Present Perfect qachon ishlatiladi?",
    "IELTS Writing 7.0 uchun qanday yozish kerak?",
    "Mening gapimni tekshiring: I have went to school yesterday.",
    "Speakingda javobni qanday uzaytirish mumkin?"
  ];

  const ADVICE_MAX_IMAGES = 3;
  const ADVICE_MAX_FILE_BYTES = 15 * 1024 * 1024;

  let adviceState = {
    messages: [],
    busy: false,
    started: false,
    seq: 0,
    health: null,
    attachments: [],
    draft: ''
  };

  function adviceFormat(text){
    let s = escapeHTML(text);
    s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    s = s.replace(/^\s*#{1,4}\s+/gm, '');
    s = s.replace(/^\s*[*\-]\s+/gm, '• ');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return s;
  }

  function adviceReset(){
    adviceState.seq++;
    adviceState.messages = [{ role: 'ai', text: ADVICE_WELCOME }];
    adviceState.busy = false;
    adviceState.started = false;
    adviceState.attachments = [];
    adviceState.draft = '';
    adviceRenderChat();
  }

  function adviceRenderChat(){
    const el = document.getElementById('advice-content');
    if(!el) return;

    const bubbles = adviceState.messages.map(function(m){
      const isUser = m.role === 'user';
      const pics = (Array.isArray(m.images) && m.images.length)
        ? '<div class="adv-msg-images">' + m.images.map(function(src){
            return '<img src="' + escapeHTML(src) + '" alt="Yuborilgan rasm" onclick="adviceOpenImage(this.src)">';
          }).join('') + '</div>'
        : '';
      return '<div class="adv-msg ' + (isUser ? 'user' : 'ai') + '">' +
        '<div class="adv-av">' + (isUser ? '🧑' : '🤖') + '</div>' +
        '<div class="adv-bubble' + (m.error ? ' err' : '') + '">' + adviceFormat(m.text) + pics + '</div>' +
        '</div>';
    }).join('');

    const typing = adviceState.busy
      ? '<div class="adv-msg ai"><div class="adv-av">🤖</div><div class="adv-typing"><i></i><i></i><i></i></div></div>'
      : '';

    const suggestions = !adviceState.started
      ? '<div class="adv-suggest">' + ADVICE_SUGGESTIONS.map(function(q){
          return '<button type="button" data-prompt="' + escapeHTML(q) + '" onclick="adviceSendSuggestion(this.dataset.prompt)">' + escapeHTML(q) + '</button>';
        }).join('') + '</div>'
      : '';

    const attachPreview = adviceState.attachments.length
      ? '<div class="adv-attach-preview">' + adviceState.attachments.map(function(a, i){
          return '<div class="adv-thumb">' +
            '<img src="' + escapeHTML(a.dataUrl) + '" alt="Rasm ' + (i + 1) + '" onclick="adviceOpenImage(this.src)">' +
            '<button type="button" title="Rasmni olib tashlash" aria-label="Rasmni olib tashlash" onclick="adviceRemoveAttachment(' + i + ')">×</button>' +
            '</div>';
        }).join('') + '</div>'
      : '';

    const healthBanner = (function(){
      const h = adviceState.health;
      if(!h) return '';
      if(h.ok === false){
        return '<div class="adv-status off">⚠️ <span>AI backendga ulanib bo‘lmadi. Saytni <b>Englify-AI.bat</b> yoki <b>Englify-server.bat</b> orqali oching.</span><button type="button" onclick="adviceRetryBackend()">Qayta urinish</button></div>';
      }
      if(h.ok && h.aiEnabled === false){
        return '<div class="adv-status warn">⚠️ <span>AI kaliti sozlanmagan. <b>backend/.env</b> fayliga Gemini yoki OpenAI kalitini kiriting.</span><button type="button" onclick="adviceRetryBackend()">Tekshirish</button></div>';
      }
      return '';
    })();

    el.innerHTML = `
      <div class="adv-wrap">
        ${healthBanner}
        <div class="adv-chat">
          <div class="adv-chat-top">
            <div class="adv-chat-title">
              <div class="adv-chat-icon">🤖</div>
              <div><b>Englify AI Mentor</b><span>IELTS va ingliz tili bo'yicha shaxsiy ustoz</span></div>
            </div>
            <button type="button" class="adv-new" onclick="adviceNewChat()">＋ Yangi suhbat</button>
          </div>

          <div class="adv-messages" id="advice-message-box">
            ${bubbles}${typing}
          </div>
          ${suggestions}
          ${attachPreview}

          <div class="adv-composer">
            <input type="file" id="advice-file" accept="image/*" multiple
              style="display:none" onchange="advicePickImages(this)">
            <button type="button" class="adv-attach" onclick="document.getElementById('advice-file').click()"
              title="Rasm biriktirish" aria-label="Rasm biriktirish" ${adviceState.busy ? 'disabled' : ''}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <textarea id="advice-input" class="adv-input" rows="1" maxlength="4000"
              placeholder="${adviceState.busy ? 'AI javob yozmoqda...' : 'Savolingizni yozing yoki rasm biriktiring... (Enter — yuborish)'}"
              oninput="adviceDraftInput(this)" onkeydown="adviceInputKey(event)"
              ${adviceState.busy ? 'disabled' : ''}>${escapeHTML(adviceState.draft)}</textarea>
            <button type="button" class="adv-send" id="advice-send" onclick="adviceSend()"
              title="Yuborish" ${adviceState.busy ? 'disabled' : ''}>➤</button>
          </div>
          <div class="adv-note">💡 <span><b>Rasm biriktiring:</b> topshiriq, xato yoki daftaringizni suratga olib yuboring. AI xato qilishi mumkin — muhim faktlarni tekshiring.</span></div>
        </div>
      </div>`;

    adviceScrollBottom();
    setTimeout(function(){
      adviceScrollBottom();
      const input = document.getElementById('advice-input');
      if(input && input.value) adviceAutoGrow(input);
      if(input && !input.disabled && window.innerWidth > 640){
        try { input.focus({ preventScroll: true }); } catch(e){ input.focus(); }
      }
    }, 30);
  }

  function adviceScrollBottom(){
    const box = document.getElementById('advice-message-box');
    if(box) box.scrollTop = box.scrollHeight;
  }

  function adviceAutoGrow(el){
    if(!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(122, Math.max(46, el.scrollHeight)) + 'px';
  }

  function adviceDraftInput(el){
    adviceState.draft = el ? el.value : '';
    adviceAutoGrow(el);
  }

  function adviceFileToDataURL(file){
    return new Promise(function(resolve, reject){
      const reader = new FileReader();
      reader.onload = function(){ resolve(String(reader.result || '')); };
      reader.onerror = function(){ reject(new Error('Faylni o‘qib bo‘lmadi')); };
      reader.readAsDataURL(file);
    });
  }

  function adviceLoadImage(src){
    return new Promise(function(resolve, reject){
      const img = new Image();
      img.onload = function(){ resolve(img); };
      img.onerror = function(){ reject(new Error('Rasm formati qo‘llanmaydi')); };
      img.src = src;
    });
  }

  async function advicePrepareImage(file){
    const raw = await adviceFileToDataURL(file);
    const img = await adviceLoadImage(raw);
    const w0 = img.naturalWidth || img.width;
    const h0 = img.naturalHeight || img.height;
    if(!w0 || !h0) throw new Error('Rasm o‘lchami aniqlanmadi');
    const maxSide = 1800;
    const scale = Math.min(1, maxSide / Math.max(w0, h0));
    if(scale === 1 && file.type === 'image/png' && raw.length < 1800000){
      return { dataUrl: raw, mimeType: 'image/png', name: file.name || 'rasm.png' };
    }
    const w = Math.max(1, Math.round(w0 * scale));
    const h = Math.max(1, Math.round(h0 * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if(!ctx) throw new Error('Rasmni qayta ishlash imkoni yo‘q');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    let dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    if(dataUrl.length > 2400000) dataUrl = canvas.toDataURL('image/jpeg', 0.78);
    return { dataUrl: dataUrl, mimeType: 'image/jpeg', name: file.name || 'rasm.jpg' };
  }

  async function advicePickImages(input){
    if(!input) return;
    const files = Array.from(input.files || []);
    input.value = '';
    if(!files.length || adviceState.busy) return;
    const room = ADVICE_MAX_IMAGES - adviceState.attachments.length;
    if(room <= 0){
      alert('Ko‘pi bilan ' + ADVICE_MAX_IMAGES + ' ta rasm biriktirish mumkin.');
      return;
    }
    const accepted = files.slice(0, room);
    let problem = '';
    for(const file of accepted){
      if(!/^image\//i.test(file.type || '')){
        problem = 'Faqat rasm faylini yuklang.';
        continue;
      }
      if(file.size > ADVICE_MAX_FILE_BYTES){
        problem = 'Rasm hajmi 15 MB dan oshmasin.';
        continue;
      }
      try {
        adviceState.attachments.push(await advicePrepareImage(file));
      } catch(err){
        problem = String((err && err.message) || 'Rasmni o‘qib bo‘lmadi');
      }
    }
    if(files.length > accepted.length) problem = 'Ko‘pi bilan ' + ADVICE_MAX_IMAGES + ' ta rasm biriktirish mumkin.';
    adviceRenderChat();
    if(problem) alert(problem);
  }

  function adviceRemoveAttachment(index){
    if(index < 0 || index >= adviceState.attachments.length) return;
    adviceState.attachments.splice(index, 1);
    adviceRenderChat();
  }

  function adviceOpenImage(src){
    if(!src) return;
    let box = document.getElementById('advice-lightbox');
    if(!box){
      box = document.createElement('div');
      box.id = 'advice-lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', 'Rasmni kattalashtirib ko‘rish');
      box.onclick = adviceCloseImage;
      const img = document.createElement('img');
      img.id = 'advice-lightbox-img';
      img.alt = 'Kattalashtirilgan rasm';
      box.appendChild(img);
      document.body.appendChild(box);
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape') adviceCloseImage();
      });
    }
    const img = document.getElementById('advice-lightbox-img');
    if(img) img.src = src;
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function adviceCloseImage(){
    const box = document.getElementById('advice-lightbox');
    if(box) box.classList.remove('open');
    const img = document.getElementById('advice-lightbox-img');
    if(img) img.src = '';
    document.body.style.overflow = '';
  }

  function adviceInputKey(ev){
    if(ev.key === 'Enter' && !ev.shiftKey){
      ev.preventDefault();
      adviceSend();
    }
  }

  function adviceSend(){
    const input = document.getElementById('advice-input');
    if(!input || adviceState.busy) return;
    const text = input.value.trim();
    const images = adviceState.attachments.slice();
    if(!text && !images.length) return;
    adviceAsk(text, images);
  }

  function adviceSendSuggestion(text){
    const images = adviceState.attachments.slice();
    adviceAsk(text, images);
  }

  async function adviceAsk(text, images){
    const q = String(text || '').trim();
    const pics = (Array.isArray(images) ? images : [])
      .filter(function(a){ return a && a.dataUrl && a.mimeType; })
      .slice(0, ADVICE_MAX_IMAGES);
    if(adviceState.busy || (!q && !pics.length)) return;

    const displayText = q || 'Bu rasmdagi topshiriqni tushuntirib bering.';
    adviceState.started = true;
    adviceState.draft = '';
    adviceState.attachments = [];
    adviceState.messages.push({
      role: 'user',
      text: displayText,
      images: pics.map(function(a){ return a.dataUrl; })
    });
    adviceState.busy = true;
    const seq = ++adviceState.seq;
    adviceRenderChat();

    const history = adviceState.messages.filter(function(m){ return !m.error; }).slice(-16).map(function(m){
      return { role: m.role === 'ai' ? 'assistant' : 'user', content: m.text };
    });
    const payloadImages = pics.map(function(a){
      return { mimeType: a.mimeType, data: String(a.dataUrl).split(',')[1] || '' };
    }).filter(function(a){ return a.data; });

    try {
      const data = await aiApiPost('/api/ai/advice', {
        message: displayText,
        messages: history,
        level: 'B2',
        images: payloadImages
      }, 90000);
      if(seq !== adviceState.seq) return;
      const reply = String((data && data.reply) || '').trim();
      if(!reply) throw new Error('AI bo‘sh javob qaytardi');
      adviceState.messages.push({ role: 'ai', text: reply });
    } catch(err){
      if(seq !== adviceState.seq) return;
      adviceState.messages.push({ role: 'ai', text: adviceErrorText(err), error: true });
    } finally {
      if(seq === adviceState.seq){
        adviceState.busy = false;
        adviceRenderChat();
      }
    }
  }

  function adviceErrorText(err){
    const status = Number(err && err.status) || 0;
    const detail = String((err && err.message) || '').trim();
    if(err && err.name === 'AbortError'){
      return '⏱ AI javobi juda kechikdi. Internetni tekshirib, savolni qayta yuboring.';
    }
    if(status === 429){
      return '⏳ Hozir juda ko‘p so‘rov yuborilgan. Bir daqiqadan keyin qayta urinib ko‘ring.';
    }
    if(status === 503 || status === 502){
      return '🔌 AI bilan aloqa bo‘lmadi.\n\n`Englify-AI.bat` ishga tushirilganini va `backend/.env` da Gemini kaliti borligini tekshiring.' +
        (detail ? '\n\nSabab: ' + detail : '');
    }
    if(status === 400){
      return '⚠️ So‘rov qabul qilinmadi: ' + (detail || 'savolni qisqartirib qayta yuboring.');
    }
    if(status === 413){
      return '⚠️ Rasm hajmi juda katta. Iltimos, kichikroq yoki siqilgan rasm yuboring.';
    }
    return '🔌 AI bilan aloqa bo‘lmadi. Internet va AI backendni tekshirib, qayta urinib ko‘ring.' +
      (detail ? '\n\nSabab: ' + detail : '');
  }

  async function adviceRefreshHealth(){
    const h = await aiHealthCheck(true);
    adviceState.health = h || { ok: false, aiEnabled: false };
    adviceRenderChat();
  }

  async function adviceRetryBackend(){
    adviceState.health = null;
    await adviceRefreshHealth();
  }

  function adviceNewChat(){
    if(adviceState.messages.length > 1 && !confirm("Yangi suhbat boshlansinmi? Joriy suhbat o‘chiriladi.")) return;
    adviceState.seq++;
    adviceReset();
    adviceRefreshHealth();
  }

  function openAdvice(){
    showPanel('advice', 'AI bilan maslahat');
    document.querySelectorAll('.b-nav-tab').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-tab') === 'advice');
    });
    try {
      const main = document.querySelector('#view-dashboard .main');
      if(main) main.scrollTop = 0;
      window.scrollTo(0, 0);
    } catch(e){}
    if(!adviceState.messages.length) adviceReset();
    else adviceRenderChat();
    adviceRefreshHealth();
  }

  function adviceBack(){
    switchTab('home');
  }

