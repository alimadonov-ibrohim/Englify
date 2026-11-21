/* ============================================================
   Englify — Kontent himoyasi
   - o'ng tugma menyusi, nusxa/kesish/joylashtirish, matn tanlash
   - rasm va havolalarni sudrab saqlash
   - sahifani saqlash, chop etish, kodni ko'rish (DevTools)
   - PrintScreen / boshqa ilovaga o'tganda parda

   ISTISNO: input, textarea, select va contenteditable maydonlari.
   Ular ishlamasa, testlar, lug'at, yozish va AI chat buziladi.
   ============================================================ */
(function(){
  'use strict';

  var noticeTimer = null;
  var lastNotice = 0;

  /* Kichik, chalg'itmaydigan xabar (har 1.6s da bir marta) */
  function notice(msg){
    var now = Date.now();
    if(now - lastNotice < 1600) return;
    lastNotice = now;
    var el = document.getElementById('englify-protect-toast');
    if(!el){
      if(!document.body) return;
      el = document.createElement('div');
      el.id = 'englify-protect-toast';
      el.className = 'englify-protect-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg || '\uD83D\uDD12 Bu amal himoyalangan';
    el.classList.add('show');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(function(){ el.classList.remove('show'); }, 1500);
  }

  /* Element matn kiritish maydoni ekanligini tekshiradi (format tugmalari
     bilan ishlash uchun yuqoriga qarab ham qaraymiz). */
  function isEditable(node){
    var el = node;
    while(el && el.nodeType === 1){
      var tag = String(el.nodeName || '').toLowerCase();
      if(tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if(el.isContentEditable === true) return true;
      var ce = el.getAttribute ? el.getAttribute('contenteditable') : null;
      if(ce === 'true' || ce === '' || ce === 'plaintext-only') return true;
      el = el.parentElement;
    }
    return false;
  }

  function block(e, msg){
    e.preventDefault();
    notice(msg);
    return false;
  }

  var OPT = { passive: false, capture: true };

  /* 1. O'ng tugma / uzoq bosish kontekst menyusi (rasmni saqlash, tekshirish...) */
  document.addEventListener('contextmenu', function(e){
    return block(e, '\uD83D\uDD12 Menyu o\'chirilgan');
  }, OPT);

  /* 2. Nusxa olish / kesish / joylashtirish / matn tanlash.
        Faqat matn maydonlarida ruxsat beramiz. */
  ['copy', 'cut', 'paste', 'selectstart'].forEach(function(type){
    document.addEventListener(type, function(e){
      if(isEditable(e.target)) return;
      return block(e, '\uD83D\uDD12 Nusxa olish himoyalangan');
    }, OPT);
  });

  /* 3. Rasm, SVG va havolalarni oynadan sudrab chiqarish */
  document.addEventListener('dragstart', function(e){
    return block(e, '\uD83D\uDD12 Sudrash himoyalangan');
  }, OPT);

  /* 4. Chop etish (Ctrl+P va brauzer menyusi orqali) */
  document.addEventListener('beforeprint', function(e){
    return block(e, '\uD83D\uDD12 Chop etish o\'chirilgan');
  }, OPT);
  try {
    window.print = function(){ notice('\uD83D\uDD12 Chop etish o\'chirilgan'); };
  } catch(e){}

  /* 5. Klaviatura kombinatsiyalari */
  document.addEventListener('keydown', function(e){
    if(e.defaultPrevented) return;

    var key = String(e.key || '').toLowerCase();
    var kc = e.keyCode || e.which || 0;
    var ctrl = e.ctrlKey || e.metaKey;
    var shift = e.shiftKey;
    var editable = isEditable(e.target);

    // Ekran surati (OS darajasidagi suratni brauzer to'xtata olmaydi)
    if(key === 'printscreen' || key === 'snapshot' || kc === 44){
      e.preventDefault();
      notice('\uD83D\uDFE0 Screenshot himoyalangan');
      return;
    }

    // DevTools: F12, Ctrl+Shift+I / J / C / M / K
    if(key === 'f12'){
      e.preventDefault();
      notice('\uD83D\uDD12 DevTools o\'chirilgan');
      return;
    }
    if(ctrl && shift && ['i','j','c','m','k'].indexOf(key) >= 0){
      e.preventDefault();
      notice('\uD83D\uDD12 DevTools o\'chirilgan');
      return;
    }

    // Sahifani saqlash, chop etish, manba kodini ko'rish
    if(ctrl && ['s','p','u'].indexOf(key) >= 0){
      e.preventDefault();
      notice('\uD83D\uDD12 Saqlash/chop etish o\'chirilgan');
      return;
    }

    // Matn maydonlarida oddiy ish — ruxsat
    if(editable) return;

    // Nusxa / kesish / joylashtirish / hammasini tanlash / qidirish
    if(ctrl && ['c','x','v','a','f'].indexOf(key) >= 0){
      e.preventDefault();
      notice('\uD83D\uDD12 Nusxa olish himoyalangan');
      return;
    }

    // Shift + o'q bilan matn tanlash
    if(shift && ['arrowleft','arrowright','arrowup','arrowdown','home','end','pageup','pagedown'].indexOf(key) >= 0){
      e.preventDefault();
      return;
    }
  }, OPT);

  /* 6. Boshqa tab/ilovaga o'tganda ekranni yashiruvchi parda */
  function veil(on){
    var el = document.getElementById('englify-protect-veil');
    if(el) el.classList.toggle('on', !!on);
  }
  function ensureVeil(){
    if(document.getElementById('englify-protect-veil')) return;
    var v = document.createElement('div');
    v.id = 'englify-protect-veil';
    v.innerHTML = '<span>\uD83D\uDD12 Himoyalangan kontent</span>';
    (document.body || document.documentElement).appendChild(v);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureVeil);
  else ensureVeil();

  document.addEventListener('visibilitychange', function(){ veil(document.hidden); });
  window.addEventListener('blur', function(){ veil(true); });
  window.addEventListener('focus', function(){ veil(false); });
  window.addEventListener('pageshow', function(){ veil(false); });
})();
