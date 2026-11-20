/* ============================================================
   Englify — Dictionary
   Qidiruv ikki tomonlama: O'zbekcha <-> Inglizcha.
   Faqat qidiruv + bitta natija.
   ============================================================ */

let dxRequest = 0;

async function searchDictionaryAPI(){
  const field  = document.getElementById('dx-input');
  const output = document.getElementById('dx-output');
  if(!field || !output) return;

  const query = (field.value || '').trim();
  if(!query){ field.focus(); return; }

  const id = ++dxRequest; // faqat oxirgi so'rov natijasi ko'rsatiladi

  output.innerHTML = '<div class="dx-wait"><span class="dx-spin"></span>Qidirilmoqda…</div>';

  try {
    let word = query;
    let data = null;

    // Kirill yozuvida yozilgan bo'lsa — avval inglizchaga tarjima qilamiz
    if(dxIsUzbek(query)){
      const translated = await dxTranslate(query, 'uz', 'en');
      if(translated){ word = translated; data = await dxFetchWord(word); }
    } else {
      data = await dxFetchWord(word);
      // Lotin yozuvidagi o'zbekcha so'z bo'lsa (masalan: erkinlik)
      if(!data){
        const translated = await dxTranslate(query, 'uz', 'en');
        if(translated && translated.toLowerCase() !== query.toLowerCase()){
          word = translated;
          data = await dxFetchWord(word);
        }
      }
    }

    if(id !== dxRequest) return; // eski so'rov — e'tiborsiz

    if(!data){
      output.innerHTML = '<div class="dx-none">So‘z topilmadi</div>';
      return;
    }

    const entry   = data[0] || {};
    const sound   = entry.phonetic || ((entry.phonetics || []).find(p => p && p.text) || {}).text || '';
    const meaning = ((entry.meanings || []).find(m => m && m.definitions && m.definitions.length) || {});
    const def     = (meaning.definitions || [])[0] || {};
    const enWord  = entry.word || word;

    // Inglizcha so'zning o'zbekcha tarjimasi
    let uz = await dxTranslate(enWord, 'en', 'uz');
    if(id !== dxRequest) return;
    if(uz && uz.toLowerCase() === String(enWord).toLowerCase()) uz = '';

    output.innerHTML =
      '<article class="dx-card">' +
        '<h4 class="dx-word">' + dxEscape(enWord) + '</h4>' +
        (sound ? '<div class="dx-phon">' + dxEscape(sound) + '</div>' : '') +
        '<div class="dx-meaning">' +
          (uz ? '<div class="dx-uz">' + dxEscape(uz) + '</div>' : '') +
          '<div class="dx-en">' + dxEscape(def.definition || 'Ma’no topilmadi') + '</div>' +
        '</div>' +
      '</article>';
  } catch(error){
    if(id !== dxRequest) return;
    console.error('Dictionary search error:', error);
    output.innerHTML = '<div class="dx-none">Qidirishda xatolik yuz berdi</div>';
  }
}

function dxIsUzbek(text){
  return /[\u0400-\u04FF]/.test(text);
}

function dxEscape(value){
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function dxFetchWord(word){
  try {
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word);
    const res = await fetch(url);
    if(!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : null;
  } catch(error){
    return null;
  }
}

async function dxTranslate(text, from, to){
  try {
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + from + '|' + to;
    const res = await fetch(url);
    if(!res.ok) return null;
    const data = await res.json();
    const value = data && data.responseData && data.responseData.translatedText;
    if(!value || /INVALID|QUERY LENGTH|MYMEMORY WARNING/i.test(value)) return null;
    return String(value).trim();
  } catch(error){
    return null;
  }
}
