// Englify — dictionary
  // ========== DICTIONARY API (EN + DE) ==========
  async function searchDictionaryAPI(){
    const input = document.getElementById('vocab-search-input');
    const langSel = document.getElementById('api-lang-select');
    const status = document.getElementById('api-search-status');
    const results = document.getElementById('api-results');
    if(!input || !results) return;

    const original = (input.value || '').trim();
    const lang = (langSel && langSel.value) || 'en';
    if(!original){
      if(status) status.textContent = t('searchPh');
      return;
    }

    if(status) status.textContent = t('loading');
    results.innerHTML = '';

    try {
      let queryWord = original;
      let translatedFromUz = null;

      // 1) Avval to'g'ridan-to'g'ri EN/DE lug'atdan qidirish
      let data = await fetchDictionary(lang, queryWord);

      // 2) Topilmasa — o'zbekchadan tanlangan tilga tarjima qilib qayta qidirish
      if(!data){
        if(status) status.textContent = 'O‘zbekchadan tarjima qilinmoqda...';
        const target = lang === 'de' ? 'de' : 'en';
        const translated = await translateText(original, 'uz', target);
        if(translated && translated.toLowerCase() !== original.toLowerCase()){
          translatedFromUz = translated;
          queryWord = translated;
          data = await fetchDictionary(lang, queryWord);
        }
      }

      // 3) Hali ham yo'q bo'lsa — inglizcha deb qarab, so'ng nemischaga o'tkazish (ixtiyoriy)
      if(!data && lang === 'de'){
        const enWord = await translateText(original, 'uz', 'en');
        if(enWord){
          const deWord = await translateText(enWord, 'en', 'de');
          if(deWord){
            translatedFromUz = deWord;
            queryWord = deWord;
            data = await fetchDictionary('de', queryWord);
          }
        }
      }

      if(!data){
        if(status) status.textContent = t('notFound');
        results.innerHTML = '<div class="api-result-card" style="text-align:center;color:var(--ink-soft);">' + t('notFound') + '</div>';
        return;
      }

      let statusText = data.length + ' ta natija';
      if(translatedFromUz){
        statusText = '"' + original + '" → <strong>' + queryWord + '</strong> · ' + statusText;
      }
      if(status) status.innerHTML = statusText;

      let html = '';
      if(translatedFromUz){
        html += '<div class="api-result-card" style="background:var(--blue-tint);border-color:var(--blue);">'
          + '<div style="font-size:13px;color:var(--ink-soft);margin-bottom:4px;">Tarjima</div>'
          + '<div style="font-size:18px;font-weight:700;"><span style="color:var(--ink-soft);">' + escapeHtml(original) + '</span> → <span style="color:var(--blue-deep);">' + escapeHtml(queryWord) + '</span></div>'
          + '</div>';
      }

      data.slice(0, 3).forEach(function(entry){
        const phonetic = entry.phonetic || ((entry.phonetics || []).find(function(p){ return p.text; }) || {}).text || '';
        const audioObj = (entry.phonetics || []).find(function(p){ return p.audio; }) || {};

        let meaningsHtml = '';
        (entry.meanings || []).slice(0, 3).forEach(function(m){
          meaningsHtml += '<div style="margin-bottom:12px;"><span class="api-pos">' + (m.partOfSpeech || '') + '</span>';
          (m.definitions || []).slice(0, 2).forEach(function(d){
            meaningsHtml += '<div class="api-meaning">• ' + escapeHtml(d.definition || '') + '</div>';
            if(d.example){
              meaningsHtml += '<div style="font-size:13px;color:var(--ink-soft);font-style:italic;margin:2px 0 8px 12px;">"' + escapeHtml(d.example) + '"</div>';
            }
          });
          meaningsHtml += '</div>';
        });

        const safeWord = String(entry.word || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const safePhonetic = String(phonetic || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        // Birinchi ma'no va misol — lug'atga saqlash uchun
        const firstMeaning = (entry.meanings && entry.meanings[0] && entry.meanings[0].definitions && entry.meanings[0].definitions[0]) ? entry.meanings[0].definitions[0].definition : '';
        const firstExample = (entry.meanings && entry.meanings[0] && entry.meanings[0].definitions && entry.meanings[0].definitions[0] && entry.meanings[0].definitions[0].example) ? entry.meanings[0].definitions[0].example : '';
        const safeMeaning = String(firstMeaning || escapeHtml(entry.word)).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
        const safeExample = String(firstExample || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
        // Lug'atda allaqachon bormi — tekshirish
        const alreadySaved = vocabList.some(v => v.word.toLowerCase() === String(entry.word || '').toLowerCase() && v.lang === lang);

        let audioBtn = '';
        if(audioObj.audio){
          audioBtn = '<button class="audio-btn" onclick="new Audio(\'' + audioObj.audio + '\').play()" title="Tinglash">🔊</button>';
        } else {
          audioBtn = '<button class="audio-btn" onclick="speakWord(\'' + safeWord + '\',\'' + lang + '\')" title="Tinglash">🔊</button>';
        }

        // Saqlash tugmasi
        const saveBtn = alreadySaved
          ? '<button class="dash-btn dash-btn-outline" style="padding:6px 12px;font-size:12px;color:#16a34a;border-color:#16a34a;cursor:default;" disabled>✓ Saqlangan</button>'
          : '<button class="dash-btn dash-btn-primary" style="padding:6px 12px;font-size:12px;" onclick="saveApiWordToList(\'' + safeWord + '\',\'' + lang + '\',\'' + safePhonetic + '\',\'' + safeMeaning + '\',\'' + safeExample + '\')">💾 Lug\'atga saqlash</button>';

        html += '<div class="api-result-card">'
          + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">'
          + '<div><h4>' + escapeHtml(entry.word) + '</h4><div class="api-phonetic">' + escapeHtml(phonetic) + '</div></div>'
          + '<div style="display:flex;gap:8px;align-items:center;">' + audioBtn + '</div>'
          + '</div>'
          + meaningsHtml
          + '<div style="margin-top:12px;border-top:1px dashed var(--line);padding-top:12px;display:flex;justify-content:flex-end;">' + saveBtn + '</div>'
          + '</div>';
      });
      results.innerHTML = html;
    } catch(e){
      console.error('Dictionary search error:', e);
      if(status) status.textContent = 'Xatolik yuz berdi: ' + (e.message || '');
      results.innerHTML = '<div class="api-result-card" style="text-align:center;color:#b91c1c;">⚠️ Qidirishda xatolik: ' + escapeHtml(e.message || '') + '<br><br><span style="font-size:12.5px;color:var(--ink-soft);">Eslatma: Lug\'at API internet aloqasini talab qiladi. Internetingizni tekshiring yoki keyinroq urinib ko\'ring.</span></div>';
    }
  }

  function escapeHtml(str){
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function fetchDictionary(lang, word){
    try {
      const url = 'https://api.dictionaryapi.dev/api/v2/entries/' + lang + '/' + encodeURIComponent(word);
      const res = await fetch(url);
      if(!res.ok) return null;
      const data = await res.json();
      if(!Array.isArray(data) || !data.length) return null;
      return data;
    } catch(e){
      return null;
    }
  }

  async function translateText(text, from, to){
    try {
      // MyMemory free translation API
      const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + from + '|' + to;
      const res = await fetch(url);
      if(!res.ok) return null;
      const data = await res.json();
      const translated = data && data.responseData && data.responseData.translatedText;
      if(!translated) return null;
      // Ba'zi hollarda API xato xabar qaytaradi
      if(/INVALID|QUERY LENGTH|MYMEMORY WARNING/i.test(translated)) return null;
      return translated.trim();
    } catch(e){
      console.error('translate error', e);
      return null;
    }
  }

  function saveApiWordToList(word, lang, phonetic, meaning, example){
    // Dublikat tekshirish
    if(vocabList.some(v => v.word.toLowerCase() === String(word).toLowerCase() && v.lang === lang)){
      alert('"' + word + '" allaqachon lug\'atingizda bor!');
      return;
    }
    vocabList.unshift({
      id: Date.now(),
      word: word,
      lang: lang,
      level: lang === 'de' ? 'B1' : 'B2',
      phonetic: phonetic || '',
      meaning: meaning || (lang === 'de' ? 'Deutsch Wort' : 'English word'),
      example: example || ''
    });
    renderVocabCards();
    // Sahifani "Mening lug'atim" qismiga scroll qilamiz
    const fcBox = document.getElementById('vocab-flashcard-box');
    if(fcBox) fcBox.scrollIntoView({behavior:'smooth', block:'center'});
    // Toast xabar
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#16a34a;color:#fff;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:700;box-shadow:0 10px 24px -8px rgba(22,163,74,0.5);z-index:99999;animation:fadeIn 0.3s ease;';
    toast.innerHTML = '✓ "' + escapeHtml(word) + '" lug\'atga saqlandi!';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .4s'; }, 2500);
    setTimeout(() => { if(toast.parentNode) toast.remove(); }, 3000);
  }

  // Dastlabki yuklanish
  window.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme());
    setLanguage(getLang());
    apkInitState();

    const session = getSession();
    if(session){
      applyUserToUI(session);
      // Sessiya bor — to'g'ridan-to'g'ri dashboard
      showView('dashboard');
    } else {
      // Landing o'chirilgan — loyiha ochilganda faqat Kirish bo'limi ko'rinadi
      showView('login');
    }
    updateResultsDisplay();
    renderVocabCards();
    updateCertificateAvailability();
    renderRecent();
  });


