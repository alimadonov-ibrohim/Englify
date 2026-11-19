# Englify — Ingliz tili markazi

Englify - ingliz tilini o'rganish uchun sayt: testlar, video diktantlar, listening/reading/speaking/writing mocklar, Battle Mode, lug'at va admin panel. Sayt HTML qobig'i va bo'limlar bo'yicha ajratilgan CSS/JS fayllardan iborat — internet orqali ishlaydi, o'rnatish shart emas.

## Live

- Sayt: https://englify-eta.vercel.app
- GitHub: https://github.com/alimadonov-ibrohim/Englify
- APK yuklab olish: https://englify-eta.vercel.app/Englify.apk

> Vercel'da AI `/api/ai/*` serverless funksiyalari orqali ishlaydi. API kaliti Vercel Environment Variables'da saqlanadi va repo'ga tushmaydi.

## Fayllar

| Fayl | Vazifasi |
| --- | --- |
| `Englify.html` | Sayt qobig'i: sahifa tuzilishi, bo'limlar konteynerlari va modallar |
| `assets/css/` | Har bir bo'lim uchun alohida stillar (`base.css`, `home.css`, `writing.css`, `listening.css`, `reading.css`, `speaking.css`, `admin-ai.css`, `battle.css`, `full-exam.css`, `daily.css`, `videos.css`, `advice.css` va boshqalar) |
| `assets/js/` | Har bir bo'lim logikasi alohida faylda (`core.js`, `navigation.js`, `writing.js`, `listening.js`, `reading.js`, `speaking.js`, `battle.js`, `full-exam.js`, `daily.js`, `videos.js`, `advice.js` va boshqalar) |
| `assets/js/vendor/qrcode.js` | QR kod generatori (tashqi kutubxona) |
| `Englify-server.bat` | Windows: mahalliy serverni **bir marta bosish** bilan ishga tushiradi |
| `englify-server.ps1` | Yuqoridagi .bat ochadigan server skripti (PowerShell) |
| `Englify-AI.bat` | AI backendni (OpenAI/Gemini) ishga tushirib, saytni ochadi |
| `backend/server.js` | AI backend + statik server + auth/natijalar API (`http://localhost:8000`) |
| `backend/.env.example` | API kalitlar uchun namuna — `backend/.env` deb nusxalanadi |
| `icon-180.png`, `icon-192.png`, `icon-512.png` | Sayt ikonkalari (iPhone bosh ekrani, brauzer yorlig'i) |
| `splash/` | iPhone / iPad uchun ochilish (splash) ekranlari |
| `sw.js` | Service Worker — ilova offline ishlashi uchun kesh |
| `englify-logo.png` | Englify logotipi |
| `manifest.json` | Telefon asosiy ekraniga qo'shish (PWA) uchun |
| `assets/css/ios-pwa.css` | iOS: notch/home-indicator (`safe-area`) va input zoom tuzatishlari |
| `android-apk/` | Android APK loyihasi va yig'ish skripti |

## iPhone / iPad (PWA)

iPhone'ga **App Store'siz** ilova sifatida o'rnatish mumkin — Safari orqali "Bosh ekranga qo'shish" yetarli. Shundan keyin sayt to'liq ekranda, o'z ikonkasi va splash ekrani bilan ochiladi hamda **internetsiz ishlaydi**.

1. `https://englify-eta.vercel.app` manzilini **Safari**'da oching (Telegram/Instagram ichidagi brauzerda emas).
2. Pastdagi **Ulashish** (⬆️) tugmasini bosing.
3. **"Bosh ekranga qo'shish"** / **"Add to Home Screen"** ni tanlang.
4. **"Qo'shish"** tugmasini bosing — bosh ekranda **Englify** ikonkasi paydo bo'ladi.

Sayt ichida ham yo'riqnoma bor: profil → **"Ilovani yuklab olish"** → **🍏 iPhone** (iPhone'da bu bo'lim avtomatik ochiladi).

Texnik jihatlar:

- `manifest.json` — nom, ikonkalar, `display: "standalone"`, `theme_color`.
- `icon-180.png` — iOS uchun `apple-touch-icon`.
- `splash/*.png` — asosiy iPhone modellari uchun `apple-touch-startup-image`.
- `sw.js` — offline kesh (HTML/CSS/JS). **Muhim:** statik fayllar o'zgarganda `sw.js` ichidagi `VERSION` qiymatini oshiring, aks holda eski kesh ishlatiladi.
- `assets/css/ios-pwa.css` — status bar/notch uchun xavfsiz hudud, pastdagi home-indicator joyi va iOS input zoom tuzatishi.

> Eslatma: App Store uchun `.ipa` ilova yaratish macOS + Xcode + Apple Developer akkaunt talab qiladi. iPhone'da veb-ilovani o'rnatish uchun yuqoridagi PWA usuli to'liq yetarli.

## APK (Android)

Telefonga o'rnatiladigan APK tayyor:

- `Englify.apk` (loyiha ildizida) yoki `android-apk/dist/Englify.apk`
- Ichida sayt to'liq, asosiy bo'limlar internet shart emas.
- Listening Mock va Full Exam ovozlari native Android TTS bilan tiniq chiqadi.
- O'rnatish va qayta yig'ish bo'yicha batafsil: `android-apk/README.md`
- Qayta yig'ish: `android-apk/build-apk.bat` ni ikki marta bosing.

### Fayl tuzilishi

```text
Englify.html
assets/
  css/
    base.css
    home.css
    dashboard.css
    results.css
    profile.css
    create-test.css
    writing.css
    daily.css
    listening.css
    reading.css
    speaking.css
    admin-ai.css
    battle.css
    full-exam.css
    nav.css
    videos.css
    advice.css
  js/
    vendor/qrcode.js
    core.js
    pwa.js
    profile.js
    navigation.js
    results.js
    writing.js
    listening.js
    reading.js
    speaking.js
    advice.js
    battle-setup.js
    videos.js
    full-exam.js
    battle.js
    daily.js
    courses.js
    vocab.js
    certificates.js
    create-test.js
    home-recent.js
    theme-language.js
    dictionary.js
    admin.js
backend/
  server.js
  .env.example
```

`Englify.html` dagi `<link>` va `<script>` tartibi muhim: bo'lim fayllari asl ishlash tartibida yuklanadi, shuning uchun ularni alohida-alohida ko'chirishda tartibni o'zgartirmang.

## Qanday ochish

### 1-usul — oddiy (videolarsiz tez ko'rish)
`Englify.html` faylini ikki marta bosing — brauzerda ochiladi.

### 2-usul — to'liq (videolar sayt ichida o'ynaydi) — tavsiya etiladi
YouTube videolarni sayt ichida ko'rish uchun sayt `file://` orqali emas, server orqali ochilishi kerak (brauzer xavfsizligi tufayli):

1. `Englify.html`, `assets/` papkasi va boshqa fayllar **bir joyda** turishini tekshiring.
2. **`Englify-server.bat`** faylini ikki marta bosing.
3. Brauzer avtomatik ochiladi: `http://localhost:8138/Englify.html`

Serverni to'xtatish: pastdagi qora "Englify Server" oynasini yoping.

> Telefon yoki boshqa qurilmadan ochish uchun papkani hostingga (masalan Netlify, Vercel, yoki o'z serveringizga) yuklang — videolar u yerda ham sayt ichida o'ynaydi.

## AI backend (OpenAI / Gemini)

Barcha test bo'limlari (Daily, Listening, Reading, Writing, Speaking, Full Exam) va **AI bilan maslahat** haqiqiy AI bilan ishlashi uchun kichik backend bor. API kalit **faqat backendda** saqlanadi - brauzerga yoki HTML faylga yozilmaydi.

### Sozlash (bir marta)

1. [Node.js](https://nodejs.org) 18 yoki undan yuqorisini o'rnating.
2. `backend\.env.example` faylini **`backend\.env`** deb nusxalang.
3. `backend\.env` ichida bitta kalitni to'ldiring:

   ```env
   # OpenAI (tavsiya)
   OPENAI_API_KEY=sk-...

   # YOKI Google Gemini
   # GEMINI_API_KEY=...
   ```

4. **`Englify-AI.bat`** faylini ikki marta bosing.
5. Brauzer ochiladi: `http://localhost:8000/Englify.html`

`Englify-server.bat` (8138-port) bilan ham ishlatish mumkin — u AI uchun avtomatik `http://127.0.0.1:8000` backendga murojaat qiladi. Ikkala serverni birga qoldirsangiz bo'ladi.

### Qanday ishlaydi

- **Daily Test** — har kuni AI 15 ta yangi savol yaratadi va shu kun davomida saqlanadi; ertaga avtomatik yangilanadi.
- **Listening Mock** — har kirishda AI yangi audio matni va aynan 10 ta savol yaratadi.
- **Reading Mock** — har kirishda AI yangi matn va 10 ta savol yaratadi; oddiy rejimda 5 tasi tasodifiy tanlanadi.
- **Speaking Mock** — har kirishda AI yangi Part 2 cue card yaratadi; javobingiz Gemini tomonidan IELTS mezonlarida baholanadi.
- **Writing Mock (Avto)** — har safar AI yangi Task 2 mavzusi beradi va esse 4 ta IELTS mezoni bo'yicha baholanadi.
- **Full Exam** — har kirishda AI butun imtihon variantini (Listening 10 + Reading 10 + Use of English 10 + 4 Writing mavzusi) yaratadi; Writing qismi ham Gemini bilan baholanadi.
- **Listening audio** — matn `/api/ai/tts` orqali Gemini TTS'da haqiqiy, tabiiy ovozga aylantiriladi (WAV). Backend ishlamasa brauzerning eng yaxshi ingliz ovozi ishlatiladi.
- **AI Admin** — admin panelning yangi bo'limi: foydalanuvchilar soni, ismlari, bugungi ro'yxat, kurslar, testlar, natijalar, lug'at, bildirishnomalar va loglar haqida savol berish mumkin. Oddiy savollarga aniq (lokal) javob beriladi, murakkablari Gemini'ga yuboriladi. AI **faqat admin panel ma'lumotlari** asosida javob beradi; parollar hech qachon ko'rsatilmaydi.
- **Admin panel bo'limlari** — Dashboard, AI Admin, Foydalanuvchilar, Kurslar, Testlar, Natijalar, **Statistika**, Lug'at, Bildirishnomalar, **Sertifikatlar** (sertifikat berish, kod nusxalash, o'chirish), **Adminlar** (yangi admin qo'shish/olib tashlash), **Zaxira nusxa** (JSON eksport/import, CSV eksport) va **Sozlamalar** (sayt nomi, qo'llab-quvvatlash email, standart daraja, daily savollar soni, e'lon, texnik xizmat rejimi va xavfli zona). Sozlamalar shu brauzerdagi `localStorage`da saqlanadi.
- **Foydalanuvchilar bo'limi** — email bilan ro'yxatdan o'tgan barcha hisoblar serverdan avtomatik yuklanadi va lokal hisoblar bilan birlashtiriladi: qidiruv, rol/holat filtrlari, statistika, CSV eksport, yangi foydalanuvchi qo'shish, bloklash/blokdan chiqarish, admin qilish/olib tashlash va o'chirish. Hisob boshqa qurilmada yaratilgan bo'lsa ham ko'rinadi (backend ishlab turgan bo'lsa).
- **Natijalar bo'limi** — test topshirilganda natija avtomatik yoziladi (`sb_admin_results` + server `/api/results`); o'quvchi, email, test turi, foiz, band va sana ko'rsatiladi.
- **AI bilan maslahat** — Gemini mentor bilan erkin suhbat: grammatika, lug'at, talaffuz, IELTS strategiyalari, o'qish rejasi va tushunmagan mavzular bo'yicha savol berish mumkin. Savol tiliga qarab o'zbek yoki ingliz tilida javob beradi; xatolarni tuzatib, misollar bilan tushuntiradi. Bundan tashqari, topshiriq, daftar yoki xatoni **rasmga olib biriktirish** mumkin — AI rasmni o'qib, o'sha topshiriq bo'yicha yordam beradi (1-3 ta JPG/PNG/WEBP rasm).
- **Battle Mode** — bo'limga kirilishi bilan tasodifiy raqib avtomatik qidiriladi. Ikki foydalanuvchi bir vaqtda kirsa, ular haqiqiy 1v1 raqib bo'ladi (savollar umumiy, javoblar real vaqtda sinxron). Onlayn raqib topilmasa, 6 soniyadan keyin tasodifiy o'yinchi bilan jang avtomatik boshlanadi — qidiruvda qotib qolmaydi. Do'st bilan kod orqali o'ynash ham mavjud.
- Kalit yo'q, kvota tugagan yoki backend o'chirilgan bo'lsa, sayt avtomatik **lokal rejimga** qaytadi — hech narsa buzilmaydi.
- AI holatini tekshirish: `http://127.0.0.1:8000/api/health`

### API endpointlar

| Endpoint | Vazifasi |
| --- | --- |
| `GET /api/health` | Backend, AI va auth holati, mavjud endpointlar ro'yxati |
| `POST /api/auth/register` | Email + parol bilan ro'yxatdan o'tish (parol scrypt bilan xeshlanadi) |
| `POST /api/auth/login` | Kirish; bloklangan hisobga `403` qaytaradi |
| `GET /api/auth/config` | Google Client ID va Google kirish yoqilganligi (ommaviy ma'lumot) |
| `POST /api/auth/google` | Google ID tokenini serverda tekshirib, kirish/ro'yxatdan o'tkazish |
| `GET /api/auth/me` | Token bo'yicha joriy foydalanuvchi |
| `GET /api/auth/users` | **Admin only** — barcha foydalanuvchilar ro'yxati (parolsiz) |
| `PATCH /api/auth/users` | **Admin only** — rol, holat (active/blocked), ism, telefon yoki parolni yangilash |
| `DELETE /api/auth/users` | **Admin only** — foydalanuvchini va uning natijalarini o'chirish |
| `GET /api/results` | Natijalar (admin — hammasi, o'quvchi — faqat o'ziniki) |
| `POST /api/results` | Natijani saqlash/yangilash (kunlik test turi bo'yicha) |
| `POST /api/ai/generate` | Test/audio matni va savollar generatsiyasi (listening, reading, writing, daily, full-exam) |
| `POST /api/ai/chat` | AI bilan erkin suhbat (maslahat, rasm bilan) |
| `POST /api/ai/advice` | Mentor maslahati |
| `POST /api/ai/score-writing` | Writing natijasini IELTS mezonlarida baholash |
| `POST /api/ai/score-speaking` | Speaking javobini baholash |
| `POST /api/ai/admin` | Admin panel ma'lumotlari bo'yicha AI javob (faqat yuborilgan kontekst asosida) |
| `POST /api/ai/tts` | Matnni Gemini neural ovoziga (WAV, base64) aylantirish |

> Gemini bepul tarifida so'rovlar soni cheklangan. Asosiy model band yoki kvota tugagan bo'lsa, backend `GEMINI_FALLBACK_MODEL` (gemini-3.1-flash-lite) ga avtomatik o'tadi; u ham ishlamasa sayt lokal bankka qaytadi.

> ⚠️ `backend\.env` faylini hech kimga yubormang va GitHubga yuklamang. Kalitni almashtirish kerak bo'lsa, provayder panelidan eski kalitni o'chiring.

## Videolar bo'limi

- 8 ta tayyor video bor (Zootopia, Kung Fu Panda, Puss in Boots va boshqalar).
- **➕ YouTube link qo'shish** tugmasi orqali o'z linkingizni qo'shasiz — video sayt ichida o'ynaydi.
  - Qo'llanadigan linklar: `https://www.youtube.com/watch?v=...`, `https://youtu.be/...`, `https://www.youtube.com/shorts/...` yoki shunchaki 11 belgili video ID.
- Diktant rejimi: video har 10 sekundda to'xtaydi — eshitganingizni yozasiz, to'g'ri bo'lsa video davom etadi.
- Qo'shilgan videolar brauzer xotirasida (localStorage) saqlanadi.

## Foydalanuvchilar bazasi (shared store)

Ro'yxatdan o'tgan foydalanuvchilar va test natijalari endi **backendda** saqlanadi — shu tufayli admin panel ularni boshqa brauzer/qurilmadan ham ko'radi.

| Muhit | Saqlash joyi |
| --- | --- |
| Lokal (`node backend/server.js`) | `backend/data/store.json` (gitga tushmaydi) |
| Vercel | `/tmp/englify-data/store.json` — faqat shu serverless instance ichida |
| Vercel + Upstash/Vercel KV (tavsiya) | Redis — barcha instance'lar uchun doimiy va umumiy |

### Muhim sozlamalar (`backend/.env` yoki Vercel Environment Variables)

```env
# Admin huquqiga ega emaillar (vergul bilan). Standart:
# alimardonovio11@gmail.com,admin@englify.uz
ADMIN_EMAILS=

# Token imzosi uchun maxfiy kalit (bo'sh bo'lsa avtomatik yaratiladi)
AUTH_SECRET=

# Doimiy umumiy baza (ixtiyoriy, Vercel uchun tavsiya etiladi)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
# yoki Vercel KV nomlari:
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
```

> Vercel'da Upstash/KV sozlanmasa, `/tmp` har bir sovuq instance'da yangilanadi — foydalanuvchilar barcha qurilmalarda ko'rinmasligi mumkin. Doimiy baza uchun Upstash bepul tarifi yetarli.

### Qanday ishlaydi

- Ro'yxatdan o'tishda parol serverda **scrypt** bilan xeshlanadi; API parolni hech qachon qaytarmaydi.
- Kirishda server token beradi (`Authorization: Bearer ...`), admin panel shu token bilan barcha foydalanuvchilarni oladi.
- Backend o'chirilgan bo'lsa, sayt avvalgidek `localStorage` rejimida ishlaydi — lekin o'sha brauzerdagi hisoblargina ko'rinadi.
- Lokal (eski) admin hisobi bilan kirilganda, serverda avtomatik shu nomdagi admin hisob yaratiladi — panel barcha qurilmalardagi foydalanuvchilarni ko'radi.
- Admin panelda qo'shilgan adminlar `sb_admin_emails` (localStorage) va serverdagi rol orqali saqlanadi. Doimiy adminlar: `alimardonovio11@gmail.com`, `admin@englify.uz`.

## Google bilan kirish (haqiqiy OAuth)

Saytdagi **"Google bilan kirish"** tugmasi haqiqiy Google OAuth orqali ishlaydi:

1. Brauzer Google Identity Services orqali Google hisobini tanlatadi va ID token oladi.
2. Token `POST /api/auth/google` ga yuboriladi.
3. Server token imzosini Google'ning ochiq kalitlari (JWKS) bilan tekshiradi, `aud` (Client ID), `iss`, `exp` va `email_verified` ni tekshiradi.
4. Shundan keyingina foydalanuvchi hisobi yaratiladi yoki mavjud hisobga kiradi.

### Bir marta sozlash

1. [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) ga kiring.
2. **Create credentials → OAuth client ID → Web application** ni tanlang.
3. **Authorized JavaScript origins** ga quyidagilarni qo'shing:
   - `http://localhost:8000`
   - `http://127.0.0.1:8000`
   - `https://englify-eta.vercel.app` (yoki o'z domeningiz)
4. Olingan **Client ID** ni kiriting.

Lokal server uchun `backend/.env`:

```env
GOOGLE_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
```

Vercel uchun:

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel --prod
```

> `GOOGLE_CLIENT_ID` — maxfiy kalit emas (u brauzerga ochiq yuboriladi). Maxfiy kalit (Client Secret) bu usulda **kerak emas**.
>
> Agar `GOOGLE_CLIENT_ID` sozlanmagan bo'lsa, tugma soxta kirish qilmaydi — foydalanuvchiga sozlash kerakligi haqida xabar ko'rsatadi.

## Hisoblar

- Ro'yxatdan o'tish bepul — ism, email va parol kifoya.
- Admin panel quyidagi emaillardan biriga ro'yxatdan o'tgan hisobga ochiladi: `alimardonovio11@gmail.com`, `admin@englify.uz`. Qo'shimcha adminlarni **Adminlar** bo'limidan qo'shish mumkin. Boshqa emaillar oddiy o'quvchi sifatida kiradi.
- Hisoblar serverda saqlanadi; backend ishlamasa `localStorage` zaxira rejimi ishlatiladi.
