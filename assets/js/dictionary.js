// Englify — dictionary
  // ========== DICTIONARY API (EN): FAQAT QIDIRUV + NATIJA ==========
  async function searchDictionaryAPI(){
    const input = document.getElementById('vocab-search-input');
    const results = document.getElementById('api-results');
    if(!input || !results) return;

    const original = (input.value || '').trim();
    if(!original){ input.focus(); return; }

    results.innerHTML = '<div class="dict-loading"><span class="dict-spinner"></span></div>';

    try {
      let word = original;
      let data = await fetchDictionary('en', word);

      // O'zbekcha yozilsa, ichkarida inglizchaga tarjima qilib qidirish
      if(!data){
        const translated = await translateText(original, 'uz', 'en');
        if(translated && translated.toLowerCase() !== original.toLowerCase()){
          word = translated;
          data = await fetchDictionary('en', word);
        }
      }

      if(!data){
        results.innerHTML = '<div class="dict-empty">So‘z topilmadi</div>';
        return;
      }

      const entry = data[0] || {};
      const phonetic = entry.phonetic || ((entry.phonetics || []).find(function(p){ return p.text; }) || {}).text || '';
      const first = (entry.meanings || []).find(function(m){ return m.definitions && m.definitions.length; }) || {};
      const def = (first.definitions || [])[0] || {};

      results.innerHTML = '<div class="dict-card">'
        + '<h4>' + escapeHtml(entry.word) + '</h4>'
        + (phonetic ? '<div class="dict-phon">' + escapeHtml(phonetic) + '</div>' : '')
        + '<div class="dict-def">' + escapeHtml(def.definition || 'Ma’no topilmadi') + '</div>'
        + '</div>';
    } catch(e){
      console.error('Dictionary search error:', e);
      results.innerHTML = '<div class="dict-empty">Qidirishda xatolik</div>';
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
      const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + from + '|' + to;
      const res = await fetch(url);
      if(!res.ok) return null;
      const data = await res.json();
      const translated = data && data.responseData && data.responseData.translatedText;
      if(!translated) return null;
      if(/INVALID|QUERY LENGTH|MYMEMORY WARNING/i.test(translated)) return null;
      return translated.trim();
    } catch(e){
      return null;
    }
  }
