/* ============================================================
   Englify — Dictionary
   Faqat qidiruv + bitta natija. Eski kod butunlay o'chirildi.
   ============================================================ */

let dxRequest = 0;

async function searchDictionaryAPI(){
  const field  = document.getElementById('dx-input');
  const output = document.getElementById('dx-output');
  if(!field || !output) return;

  const query = (field.value || '').trim();
  if(!query){ field.focus(); return; }

  const id = ++dxRequest; // oxirgi so'rov natijasi ko'rsatiladi

  output.innerHTML = '<div class="dx-wait"><span class="dx-spin"></span>Qidirilmoqda…</div>';

  try {
    let word = query;
    let data = await dxFetchWord(word);

    // O'zbekcha yozilsa, ichkarida inglizchaga tarjima qilib qidirish
    if(!data){
      const translated = await dxTranslate(query);
      if(translated && translated.toLowerCase() !== query.toLowerCase()){
        word = translated;
        data = await dxFetchWord(word);
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

    output.innerHTML =
      '<article class="dx-card">' +
        '<h4 class="dx-word">' + dxEscape(entry.word || word) + '</h4>' +
        (sound ? '<div class="dx-phon">' + dxEscape(sound) + '</div>' : '') +
        '<div class="dx-meaning">' + dxEscape(def.definition || 'Ma’no topilmadi') + '</div>' +
      '</article>';
  } catch(error){
    if(id !== dxRequest) return;
    console.error('Dictionary search error:', error);
    output.innerHTML = '<div class="dx-none">Qidirishda xatolik yuz berdi</div>';
  }
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

async function dxTranslate(text){
  try {
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=uz|en';
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
