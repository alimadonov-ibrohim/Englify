// Englify — vocab

  let vocabList = [
    {id:1, word:'Ubiquitous', lang:'en', level:'C1', phonetic:'/juːˈbɪk.wɪ.təs/', meaning:'Hamma joyda mavjud, keng tarqalgan', example:'Smartphones are ubiquitous in modern life.'},
    {id:2, word:'Pragmatic', lang:'en', level:'B2', phonetic:'/præɡˈmæt.ɪk/', meaning:'Amaliy, realistik yondashuvchi', example:'We need a pragmatic solution.'},
    {id:3, word:'Die Gemütlichkeit', lang:'de', level:'B1', phonetic:'[ɡəˈmyːtlɪçkaɪt]', meaning:'Shinamlik, yoqimli muhit', example:'Die Gemütlichkeit dieses Cafés ist wunderbar.'},
    {id:4, word:'Das Fernweh', lang:'de', level:'B2', phonetic:'[ˈfɛʁnveː]', meaning:'Sayohat qilishga kuchli ishtiyoq', example:'Im Winter packt mich immer das Fernweh.'}
  ];
  let currentFlashcardIdx = 0, flashcardFlipped = false, activeVocabLang = 'all';

  function renderVocabCards(){
    const container = document.getElementById('vocab-cards-grid');
    if(!container) return;
    // Eslatma: vocab-search-input endi faqat API qidiruv uchun ishlatiladi
    // Mening lug'im filtri esa filter pills bilan boshqariladi
    const filtered = vocabList.filter(item => {
      const matchLang = activeVocabLang === 'all' || item.lang === activeVocabLang;
      return matchLang;
    });

    if(document.getElementById('count-all')) document.getElementById('count-all').textContent = vocabList.length;
    if(document.getElementById('count-en')) document.getElementById('count-en').textContent = vocabList.filter(v=>v.lang==='en').length;
    if(document.getElementById('count-de')) document.getElementById('count-de').textContent = vocabList.filter(v=>v.lang==='de').length;

    if(!filtered.length){
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:36px 20px;color:var(--ink-soft);background:var(--card);border:1px dashed var(--line);border-radius:14px;">
        <div style="font-size:36px;margin-bottom:10px;opacity:.5;">📖</div>
        <div style="font-size:14.5px;font-weight:700;margin-bottom:4px;">Lug'atingiz bo'sh</div>
        <div style="font-size:13px;">Yuqoridagi qidiruv orqali so'z qidiring va "Saqlash" tugmasi bilan lug'atingizga qo'shing.<br>Yoki "Yangi so'z qo'shish" tugmasi bilan qo'lda so'z kiriting.</div>
      </div>`;
      // Flashcard box ni yashiramiz
      const fcBox = document.getElementById('vocab-flashcard-box');
      if(fcBox) fcBox.style.display = 'none';
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="vocab-item">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="res-tag" style="background:${item.lang==='en'?'#e0f2fe':'#fef3c7'};color:${item.lang==='en'?'#0369a1':'#b45309'};">${item.lang==='en'?'🇬🇧 IELTS':'🇩🇪 Goethe'} • ${item.level}</span>
          <button class="audio-btn" onclick="speakWord('${item.word.replace(/'/g,"\\'")}','${item.lang}')" title="Talaffuzini eshitish">🔊</button>
        </div>
        <h4 style="font-size:18px;font-family:'Fraunces',serif;margin:8px 0 2px;">${item.word}</h4>
        <div style="font-size:13px;color:var(--ink-soft);margin-bottom:4px;">${item.phonetic || '—'}</div>
        <div style="font-size:14px;color:var(--blue-deep);font-weight:600;margin-bottom:6px;">${item.meaning}</div>
        ${item.example ? `<div style="font-size:12.5px;color:var(--ink-soft);font-style:italic;line-height:1.5;">"${item.example}"</div>` : ''}
        <div style="display:flex;gap:8px;margin-top:10px;border-top:1px dashed var(--line);padding-top:10px;">
          <button class="dash-btn dash-btn-outline" style="flex:1;padding:6px 10px;font-size:11.5px;" onclick="editVocabWord(${item.id})">✏️ Tahrirlash</button>
          <button class="dash-btn dash-btn-outline" style="padding:6px 10px;font-size:11.5px;color:#dc2626;border-color:rgba(220,38,38,0.3);" onclick="deleteVocabWord(${item.id})">🗑 O'chirish</button>
        </div>
      </div>
    `).join('');
    updateFlashcardUI();
  }

  // Yangi so'zni tahrirlash
  function editVocabWord(id){
    const item = vocabList.find(v => v.id === id);
    if(!item) return;
    const newWord = prompt('So\'zni tahrirlang:', item.word);
    if(newWord === null) return;
    const newMeaning = prompt('Ma\'nosini tahrirlang:', item.meaning);
    if(newMeaning === null) return;
    const newExample = prompt('Misol gapni tahrirlang (ixtiyoriy):', item.example || '');
    if(newExample === null) return;
    item.word = newWord.trim() || item.word;
    item.meaning = newMeaning.trim() || item.meaning;
    item.example = newExample.trim();
    renderVocabCards();
    alert('So\'z yangilandi!');
  }

  // So'zni o'chirish
  function deleteVocabWord(id){
    if(!confirm('Bu so\'zni o\'chirmoqchimisiz?')) return;
    vocabList = vocabList.filter(v => v.id !== id);
    if(currentFlashcardIdx >= vocabList.length) currentFlashcardIdx = 0;
    renderVocabCards();
  }

  function filterVocabLang(l, el){
    activeVocabLang = l;
    document.querySelectorAll('#vocab .filter-pill').forEach(p=>p.classList.remove('active'));
    if(el) el.classList.add('active');
    renderVocabCards();
  }
  function filterVocabList(){ renderVocabCards(); }
  function flipFlashcard(){
    flashcardFlipped = !flashcardFlipped;
    const fm = document.getElementById('fc-meaning');
    if(fm) fm.style.display = flashcardFlipped ? 'block' : 'none';
  }
  function updateFlashcardUI(){
    const fcBox = document.getElementById('vocab-flashcard-box');
    if(!vocabList.length){
      if(fcBox) fcBox.style.display = 'none';
      return;
    }
    if(fcBox) fcBox.style.display = 'block';
    if(currentFlashcardIdx >= vocabList.length) currentFlashcardIdx = 0;
    const item = vocabList[currentFlashcardIdx % vocabList.length];
    flashcardFlipped = false;
    const fw = document.getElementById('fc-word');
    const fp = document.getElementById('fc-phonetic');
    const fm = document.getElementById('fc-meaning');
    if(fw) fw.textContent = item.word;
    if(fp) fp.textContent = item.phonetic || '—';
    if(fm){
      fm.style.display = 'none';
      fm.innerHTML = '<strong>Tarjimasi:</strong> ' + escapeHtml(item.meaning) + (item.example ? '<br><em>"' + escapeHtml(item.example) + '"</em>' : '');
    }
  }
  function nextFlashcard(){
    if(!vocabList.length) return;
    currentFlashcardIdx = (currentFlashcardIdx + 1) % vocabList.length;
    updateFlashcardUI();
  }
  function speakWord(w, lang){
    if('speechSynthesis' in window){
      try {
        try { sbTtsStop(); } catch(e){} 
        const cleanWord = (w || '').replace(/^(Der|Die|Das)\s+/i, '');
        const u = new SpeechSynthesisUtterance(cleanWord);
        u.lang = lang === 'de' ? 'de-DE' : 'en-US';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
      } catch(e){
        console.warn('speakWord error', e);
      }
    }
  }
  function speakCurrentWord(){
    if(!vocabList.length) return;
    const item = vocabList[currentFlashcardIdx % vocabList.length];
    speakWord(item.word, item.lang);
  }
  function openAddWordModal(){ 
    const m = document.getElementById('modal-add-word');
    if(m) m.style.display = 'flex';
  }
  function submitNewWord(e){
    e.preventDefault();
    const w = document.getElementById('new-word-text').value.trim();
    const l = document.getElementById('new-word-lang').value;
    const m = document.getElementById('new-word-meaning').value.trim();
    const ex = document.getElementById('new-word-example').value.trim() || '';
    if(w && m){
      vocabList.unshift({ id: Date.now(), word: w, lang: l, level: 'B2', phonetic: '', meaning: m, example: ex });
      closeModal('modal-add-word');
      renderVocabCards();
      alert('"' + w + '" so\'zi lug\'atga qo\'shildi!');
      // Formani tozalash
      document.getElementById('new-word-text').value = '';
      document.getElementById('new-word-meaning').value = '';
      document.getElementById('new-word-example').value = '';
    } else {
      alert('So\'z va ma\'nosi maydonlarini to\'ldiring!');
    }
  }

