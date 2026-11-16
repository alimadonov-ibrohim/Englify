// Englify — profile
// Profil bo'limidagi barcha kichik bo'limlar: tahrirlash, bildirishnomalar,
// til, qo'llanma, yordam, maxfiylik, reyting, mening testlarim va sertifikatlar.

const PROF_NOTIF_KEY = 'sb_admin_notif';
const PROF_NOTIF_READ_KEY = 'sb_notif_read_at';

/* ===================== UMUMIY YORDAMCHILAR ===================== */
function profEsc(str){
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function profFmtDate(iso){
  if(!iso) return '';
  try{
    const d = new Date(iso);
    if(isNaN(d.getTime())) return String(iso);
    return d.toLocaleString('uz-UZ', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }catch(e){ return String(iso); }
}

function profModalOpen(id, title, bodyHtml, footerHtml){
  const old = document.getElementById(id);
  if(old) old.remove();
  const modal = document.createElement('div');
  modal.id = id;
  modal.className = 'prof-modal';
  modal.setAttribute('onclick', "if(event.target===this) profModalClose('" + id + "')");
  modal.innerHTML =
    '<div class="prof-modal-box">' +
      '<button class="prof-modal-close" onclick="profModalClose(\'' + id + '\')" aria-label="Yopish">&times;</button>' +
      '<h3 class="prof-modal-title">' + title + '</h3>' +
      '<div class="prof-modal-body">' + bodyHtml + '</div>' +
      (footerHtml ? '<div class="prof-modal-foot">' + footerHtml + '</div>' : '') +
    '</div>';
  document.body.appendChild(modal);
  return modal;
}

function profModalClose(id){
  const m = document.getElementById(id);
  if(m) m.remove();
}

function profToast(msg, type){
  const old = document.getElementById('prof-toast');
  if(old) old.remove();
  const el = document.createElement('div');
  el.id = 'prof-toast';
  el.className = 'prof-toast ' + (type || 'ok');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function(){ el.classList.add('show'); }, 10);
  setTimeout(function(){
    el.classList.remove('show');
    setTimeout(function(){ if(el.parentNode) el.remove(); }, 250);
  }, 2600);
}

/* ===================== PROFILNI TAHRIRLASH ===================== */
function openProfileEditModal(){
  const session = getSession();
  if(!session){ showView('login'); return; }
  const users = getUsers();
  const u = users[session.email] || {};
  const name = u.name || session.name || '';
  const email = session.email || u.email || '';
  const phone = u.phone || session.phone || '';

  const body =
    '<div class="prof-field">' +
      '<label for="pe-name">Ism-familiya</label>' +
      '<input id="pe-name" class="prof-input" type="text" value="' + profEsc(name) + '" placeholder="Ism va familiya" autocomplete="name">' +
    '</div>' +
    '<div class="prof-field">' +
      '<label for="pe-email">Email</label>' +
      '<input id="pe-email" class="prof-input" type="email" value="' + profEsc(email) + '" placeholder="ism@gmail.com" autocomplete="email">' +
    '</div>' +
    '<div class="prof-field">' +
      '<label for="pe-phone">Telefon (ixtiyoriy)</label>' +
      '<input id="pe-phone" class="prof-input" type="tel" value="' + profEsc(phone) + '" placeholder="+998 90 123 45 67" autocomplete="tel">' +
    '</div>' +
    '<div class="prof-field">' +
      '<label for="pe-pass">Yangi parol (ixtiyoriy)</label>' +
      '<input id="pe-pass" class="prof-input" type="password" value="" placeholder="Bo\'sh qoldirsangiz o\'zgarmaydi" autocomplete="new-password">' +
      '<small class="prof-hint">Parol kamida 6 ta belgidan iborat bo\'lishi kerak.</small>' +
    '</div>' +
    '<div id="pe-error" class="prof-error" style="display:none;"></div>';

  const footer =
    '<button class="dash-btn dash-btn-outline" onclick="profModalClose(\'prof-edit-modal\')">Bekor qilish</button>' +
    '<button class="dash-btn dash-btn-primary" onclick="profSaveProfile()">Saqlash</button>';

  profModalOpen('prof-edit-modal', 'Profilni tahrirlash', body, footer);
  setTimeout(function(){ const el = document.getElementById('pe-name'); if(el) el.focus(); }, 60);
}

function profSaveProfile(){
  const session = getSession();
  if(!session){ showView('login'); return; }
  const errEl = document.getElementById('pe-error');
  function fail(msg){
    if(errEl){ errEl.textContent = msg; errEl.style.display = 'block'; }
    else profToast(msg, 'err');
  }
  if(errEl) errEl.style.display = 'none';

  const nameEl = document.getElementById('pe-name');
  const emailEl = document.getElementById('pe-email');
  const phoneEl = document.getElementById('pe-phone');
  const passEl = document.getElementById('pe-pass');

  const name = (nameEl && nameEl.value || '').trim();
  const newEmail = (emailEl && emailEl.value || '').trim().toLowerCase();
  const phone = (phoneEl && phoneEl.value || '').trim();
  const password = (passEl && passEl.value) || '';
  const oldEmail = (session.email || '').toLowerCase();

  if(!name) return fail('Ism-familiya bo\'sh bo\'lishi mumkin emas.');
  if(!newEmail || !isValidEmail(newEmail)) return fail('To\'g\'ri email manzilini kiriting (masalan: ism@gmail.com).');
  if(password && password.length < 6) return fail('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak.');

  const users = getUsers();
  if(newEmail !== oldEmail && users[newEmail]) return fail('Bu email allaqachon ro\'yxatdan o\'tgan.');

  const existing = users[oldEmail] || {};
  const updatedRecord = Object.assign({}, existing, {
    name: name,
    email: newEmail,
    phone: phone
  });
  if(password) updatedRecord.password = password;
  if(!updatedRecord.createdAt) updatedRecord.createdAt = new Date().toISOString();

  if(newEmail !== oldEmail){
    delete users[oldEmail];
    users[newEmail] = updatedRecord;
    // Progress kalitini yangi emailga ko'chirish
    try{
      const oldKey = 'sb_progress_' + oldEmail;
      const newKey = 'sb_progress_' + newEmail;
      const data = localStorage.getItem(oldKey);
      if(data){
        localStorage.setItem(newKey, data);
        localStorage.removeItem(oldKey);
      }
    }catch(e){}
  } else {
    users[newEmail] = updatedRecord;
  }
  saveUsers(users);

  const updatedSession = withRole(Object.assign({}, session, {
    email: newEmail,
    name: name,
    phone: phone
  }));
  setSession(updatedSession);
  applyUserToUI(updatedSession);

  profModalClose('prof-edit-modal');
  profToast('Profil muvaffaqiyatli yangilandi!', 'ok');
}

/* ===================== BILDIRISHNOMALAR ===================== */
function profGetNotifications(){
  try{
    const list = JSON.parse(localStorage.getItem(PROF_NOTIF_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  }catch(e){ return []; }
}

function profUnreadCount(){
  const list = profGetNotifications();
  const readAt = localStorage.getItem(PROF_NOTIF_READ_KEY);
  if(!readAt) return list.length;
  const t = new Date(readAt).getTime();
  return list.filter(function(n){
    if(!n || !n.at) return false;
    const nt = new Date(n.at).getTime();
    return !isNaN(nt) && nt > t;
  }).length;
}

function updateNotifBadge(){
  const dot = document.getElementById('prof-notif-dot');
  const sub = document.getElementById('prof-notif-sub');
  const unread = profUnreadCount();
  const total = profGetNotifications().length;
  if(dot) dot.style.display = unread > 0 ? 'inline-block' : 'none';
  if(sub){
    if(unread > 0) sub.textContent = unread + ' ta yangi bildirishnoma';
    else if(total > 0) sub.textContent = 'Barcha bildirishnomalar o\'qilgan';
    else sub.textContent = 'Hozircha bildirishnoma yo\'q';
  }
}

function openNotifications(){
  const list = profGetNotifications();
  let body;
  if(!list.length){
    body = '<div class="prof-empty">' +
      '<div class="prof-empty-icon">🔔</div>' +
      '<div class="prof-empty-title">Hozircha bildirishnoma yo\'q</div>' +
      '<div class="prof-empty-sub">Yangi xabarlar shu yerda paydo bo\'ladi.</div>' +
    '</div>';
  } else {
    body = '<div class="prof-notif-list">' + list.map(function(n){
      const title = profEsc(n.title || 'Bildirishnoma');
      const message = profEsc(n.message || '');
      const when = profFmtDate(n.at);
      return '<div class="prof-notif-item">' +
        '<div class="prof-notif-icon">📣</div>' +
        '<div class="prof-notif-main">' +
          '<div class="prof-notif-title">' + title + '</div>' +
          '<div class="prof-notif-msg">' + message + '</div>' +
          (when ? '<div class="prof-notif-date">' + profEsc(when) + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  const footer =
    '<button class="dash-btn dash-btn-outline" onclick="openNotifications()">Yangilash</button>' +
    '<button class="dash-btn dash-btn-primary" onclick="profModalClose(\'prof-notif-modal\')">Yopish</button>';

  profModalOpen('prof-notif-modal', 'Bildirishnomalar', body, footer);

  // Ochiq paytda barchasini o'qilgan deb belgilaymiz
  try{ localStorage.setItem(PROF_NOTIF_READ_KEY, new Date().toISOString()); }catch(e){}
  updateNotifBadge();
}

/* ===================== TIL ===================== */
function openLanguageModal(){
  const langs = [
    { code:'uz', label:"O'zbek tili", flag:'🇺🇿' },
    { code:'en', label:'English', flag:'🇬🇧' },
    { code:'de', label:'Deutsch', flag:'🇩🇪' }
  ];
  const current = (typeof getLang === 'function' ? getLang() : 'uz');
  const body = '<div class="prof-lang-list">' + langs.map(function(l){
    return '<button class="prof-lang-opt' + (l.code === current ? ' active' : '') + '" onclick="profPickLanguage(\'' + l.code + '\')">' +
      '<span class="prof-lang-flag">' + l.flag + '</span>' +
      '<span class="prof-lang-name">' + l.label + '</span>' +
      (l.code === current ? '<span class="prof-lang-check">✓</span>' : '') +
    '</button>';
  }).join('') + '</div>';

  profModalOpen('prof-lang-modal', 'Tilni tanlang', body,
    '<button class="dash-btn dash-btn-outline" onclick="profModalClose(\'prof-lang-modal\')">Yopish</button>');
}

function profPickLanguage(code){
  if(typeof setLanguage === 'function') setLanguage(code);
  const lab = document.getElementById('prof-lang-label');
  if(lab) lab.textContent = code === 'en' ? 'English' : (code === 'de' ? 'Deutsch' : "O'zbek tili");
  profModalClose('prof-lang-modal');
  profToast('Til o\'zgartirildi', 'ok');
}

/* ===================== QO'LLANMA / YORDAM / MAXFIYLIK ===================== */
function openGuideModal(){
  const body =
    '<div class="prof-doc">' +
      '<p>Englify — IELTS va nemis tilini onlayn mashq qilish platformasi. Quyidagi qadamlar bilan boshlang:</p>' +
      '<ol class="prof-doc-list">' +
        '<li><b>Test tanlang.</b> Asosiy sahifada Listening, Reading, Writing, Speaking, Daily yoki Full Exam bo\'limlarini oching.</li>' +
        '<li><b>Topshiring.</b> Har bir test yakunida natija va taxminiy Band ball avtomatik hisoblanadi.</li>' +
        '<li><b>Natijalarni kuzating.</b> «Natijalar» bo\'limida barcha testlar bo\'yicha progressni ko\'ring.</li>' +
        '<li><b>Sertifikat oling.</b> Yetarli natijaga erishgach, Profil → Sertifikat bo\'limida sertifikat olishingiz mumkin.</li>' +
        '<li><b>Offline foydalaning.</b> Profil → ILOVA bo\'limidan APK yuklab oling yoki QR kod orqali telefonda oching.</li>' +
      '</ol>' +
      '<div class="prof-tip">💡 Maslahat: har kuni kamida bitta Daily test va bitta ko\'nikma mashqini bajaring.</div>' +
    '</div>';
  profModalOpen('prof-guide-modal', 'Qo\'llanma', body,
    '<button class="dash-btn dash-btn-primary" onclick="profModalClose(\'prof-guide-modal\')">Tushundim</button>');
}

function profSupportEmail(){
  try{
    const st = JSON.parse(localStorage.getItem('sb_admin_settings') || '{}');
    if(st && st.supportEmail) return String(st.supportEmail);
  }catch(e){}
  return 'support@englify.uz';
}

function openHelpModal(){
  const email = profSupportEmail();
  const body =
    '<div class="prof-doc">' +
      '<p>Savolingiz yoki muammoingiz bo\'lsa, biz bilan bog\'laning. Odatda 24 soat ichida javob beramiz.</p>' +
      '<div class="prof-contact-list">' +
        '<a class="prof-contact" href="mailto:' + profEsc(email) + '">' +
          '<span class="prof-contact-ic">✉️</span><span><b>Email</b><small>' + profEsc(email) + '</small></span>' +
        '</a>' +
        '<a class="prof-contact" href="https://t.me/yuksalishhelp" target="_blank" rel="noopener">' +
          '<span class="prof-contact-ic">💬</span><span><b>Telegram</b><small>@yuksalishhelp</small></span>' +
        '</a>' +
      '</div>' +
      '<div class="prof-doc-sub">Ko\'p so\'raladigan savollar</div>' +
      '<div class="prof-faq"><b>Test natijasi saqlanmayapti?</b><p>Brauzeringizda localStorage o\'chirilmaganiga ishonch hosil qiling. Profilga kirib qayta urinib ko\'ring.</p></div>' +
      '<div class="prof-faq"><b>APK yuklanmayapti?</b><p>Profil → ILOVA → «Boshqa qurilmada ochish» orqali QR kodni skanerlab ko\'ring.</p></div>' +
      '<div class="prof-faq"><b>Parolni unutdim?</b><p>Profilda email manzilingizni o\'zgartirmasdan yangi parol o\'rnatishingiz mumkin.</p></div>' +
    '</div>';
  profModalOpen('prof-help-modal', 'Yordam', body,
    '<button class="dash-btn dash-btn-primary" onclick="profModalClose(\'prof-help-modal\')">Yopish</button>');
}

function openPrivacyModal(){
  const body =
    '<div class="prof-doc">' +
      '<p>Englify sizning maxfiyligingizni qadrlaydi. Ushbu siyosat qanday ma\'lumotlar saqlanishini tushuntiradi.</p>' +
      '<div class="prof-doc-sub">Saqlanadigan ma\'lumotlar</div>' +
      '<ul class="prof-doc-list">' +
        '<li>Ism, email va telefon raqami — profilingizni ko\'rsatish uchun.</li>' +
        '<li>Test natijalari va progress — natijalarni saqlash uchun.</li>' +
        '<li>Interfeys tili va sozlamalar — qulaylik uchun.</li>' +
      '</ul>' +
      '<div class="prof-doc-sub">Qayerda saqlanadi?</div>' +
      '<p>Ma\'lumotlarning asosiy qismi <b>faqat brauzeringizda</b> (localStorage) saqlanadi. Parollar hech qachon uchinchi tomonga yuborilmaydi.</p>' +
      '<div class="prof-doc-sub">Sizning huquqlaringiz</div>' +
      '<p>Istalgan vaqtda profilingizni tahrirlashingiz yoki hisobdan chiqib, ma\'lumotlarni brauzer sozlamalaridan o\'chirishingiz mumkin.</p>' +
      '<div class="prof-tip">🔒 Savollar bo\'lsa: ' + profEsc(profSupportEmail()) + '</div>' +
    '</div>';
  profModalOpen('prof-privacy-modal', 'Maxfiylik siyosati', body,
    '<button class="dash-btn dash-btn-primary" onclick="profModalClose(\'prof-privacy-modal\')">Yopish</button>');
}

/* ===================== REYTING ===================== */
function profBandRows(){
  const tp = (typeof testProgress !== 'undefined') ? testProgress : {};
  const meta = [
    { key:'listening', name:'Listening', color:'#4f46e5' },
    { key:'reading', name:'Reading', color:'#0d9488' },
    { key:'writing', name:'Writing', color:'#16a34a' },
    { key:'speaking', name:'Speaking', color:'#dc2626' },
    { key:'daily', name:'Daily Tests', color:'#f97316' },
    { key:'fullexam', name:'Full Exam', color:'#2563eb' }
  ];
  return meta.map(function(m){
    const t = tp[m.key] || {};
    return {
      key: m.key,
      name: m.name,
      color: m.color,
      completed: !!t.completed,
      band: Number(t.band) || 0,
      pct: Number(t.pct) || 0
    };
  });
}

function openRatingModal(){
  const rows = profBandRows();
  const done = rows.filter(function(r){ return r.completed; });
  const avg = done.length ? (done.reduce(function(a, r){ return a + r.band; }, 0) / done.length) : 0;
  const best = done.length ? Math.max.apply(null, done.map(function(r){ return r.band; })) : 0;

  const body =
    '<div class="prof-rating-top">' +
      '<div class="prof-rating-avg">' + (done.length ? avg.toFixed(1) : '—') + '</div>' +
      '<div class="prof-rating-meta">' +
        '<div class="prof-rating-label">Umumiy o\'rtacha Band</div>' +
        '<div class="prof-rating-sub">' + done.length + ' ta test yakunlangan · Eng yaxshi: ' + (done.length ? best.toFixed(1) : '—') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="prof-rating-list">' + rows.map(function(r){
      const status = r.completed
        ? '<span class="prof-rating-band">Band ' + r.band.toFixed(1) + '</span>'
        : '<span class="prof-rating-lock">Topshirilmagan</span>';
      const bar = r.completed
        ? '<div class="prof-rating-bar"><span style="width:' + Math.max(0, Math.min(100, r.pct || (r.band / 9 * 100))) + '%;background:' + r.color + ';"></span></div>'
        : '<div class="prof-rating-bar"><span style="width:0%;"></span></div>';
      return '<div class="prof-rating-row">' +
        '<div class="prof-rating-name"><span class="prof-rating-dot" style="background:' + r.color + ';"></span>' + r.name + '</div>' +
        status +
        bar +
      '</div>';
    }).join('') + '</div>' +
    (done.length ? '' : '<div class="prof-empty-sub" style="margin-top:14px;text-align:center;">Hali test topshirmagansiz. Natijalar shu yerda ko\'rinadi.</div>');

  const footer =
    '<button class="dash-btn dash-btn-outline" onclick="profModalClose(\'prof-rating-modal\'); switchTab(\'results\');">Natijalarga o\'tish</button>' +
    '<button class="dash-btn dash-btn-primary" onclick="profModalClose(\'prof-rating-modal\')">Yopish</button>';

  profModalOpen('prof-rating-modal', 'Reyting', body, footer);
}

/* ===================== MENING TESTLARIM ===================== */
function openMyTests(){
  if(typeof switchTab === 'function') switchTab('home');
  setTimeout(function(){
    if(typeof openCreate === 'function') openCreate();
    else profToast('Test yaratish bo\'limi topilmadi', 'err');
  }, 60);
}

/* ===================== SERTIFIKATLAR ===================== */
function openProfileCertSection(){
  const sec = document.getElementById('profile-cert-section');
  if(!sec){ profToast('Sertifikat bo\'limi topilmadi', 'err'); return; }
  sec.style.display = 'block';
  if(typeof renderCertificates === 'function') renderCertificates();
  if(typeof updateCertificateAvailability === 'function') updateCertificateAvailability();
  setTimeout(function(){
    try{ sec.scrollIntoView({ behavior:'smooth', block:'start' }); }catch(e){ sec.scrollIntoView(); }
  }, 60);
}

/* ===================== ISHGA TUSHIRISH ===================== */
document.addEventListener('DOMContentLoaded', function(){
  updateNotifBadge();
});
