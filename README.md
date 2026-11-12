# Englify — Ingliz va Nemis tili markazi

Englify — ingliz va nemis tilini o'rganish uchun sayt: testlar, video diktantlar, listening/reading/speaking/writing mocklar, AI Speaking, Battle Mode, lug'at va admin panel. Sayt HTML qobig'i va bo'limlar bo'yicha ajratilgan CSS/JS fayllardan iborat — internet orqali ishlaydi, o'rnatish shart emas.

## Live

- Sayt: https://englify-eta.vercel.app
- GitHub: https://github.com/alimadonov-ibrohim/Englify
- APK yuklab olish: https://englify-eta.vercel.app/Englify.apk

> Vercel'da AI `/api/ai/*` serverless funksiyalari orqali ishlaydi. API kaliti Vercel Environment Variables'da saqlanadi va repo'ga tushmaydi.

## Fayllar

| Fayl | Vazifasi |
| --- | --- |
| `Englify.html` | Sayt qobig'i: sahifa tuzilishi, bo'limlar konteynerlari va modallar |
| `assets/css/` | Har bir bo'lim uchun alohida stillar (`base.css`, `home.css`, `writing.css`, `listening.css`, `reading.css`, `speaking.css`, `ai-speaking.css`, `battle.css`, `full-exam.css`, `daily.css`, `videos.css`, `advice.css` va boshqalar) |
| `assets/js/` | Har bir bo'lim logikasi alohida faylda (`core.js`, `navigation.js`, `writing.js`, `listening.js`, `reading.js`, `speaking.js`, `ai-speaking.js`, `battle.js`, `full-exam.js`, `daily.js`, `videos.js`, `advice.js` va boshqalar) |
| `assets/js/vendor/qrcode.js` | QR kod generatori (tashqi kutubxona) |
| `Englify-server.bat` | Windows: mahalliy serverni **bir marta bosish** bilan ishga tushiradi |
| `englify-server.ps1` | Yuqoridagi .bat ochadigan server skripti (PowerShell) |
| `Englify-AI.bat` | AI backendni (OpenAI/Gemini) ishga tushirib, saytni ochadi |
| `backend/server.js` | AI backend + statik server (`http://localhost:8000`) |
| `backend/.env.example` | API kalitlar uchun namuna — `backend/.env` deb nusxalanadi |
| `icon-192.png`, `icon-512.png` | Sayt ikonkalari (brauzer yorlig'i, telefon uchun) |
| `englify-logo.png` | Englify logotipi |
| `manifest.json` | Telefon asosiy ekraniga qo'shish (PWA) uchun |
| `android-apk/` | Android APK loyihasi va yig'ish skripti |

## APK (Android)

Telefonga o'rnatiladigan APK tayyor:

- `Englify.apk` (loyiha ildizida) yoki `android-apk/dist/Englify.apk`
- Ichida sayt to'liq, asosiy bo'limlar internet shart emas.
- Listening Mock, Full Exam va AI Speaking ovozlari native Android TTS bilan tiniq chiqadi.
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
    ai-speaking.css
    battle.css
    full-exam.css
    nav.css
    videos.css
    advice.css
  js/
    vendor/qrcode.js
    core.js
    pwa.js
    navigation.js
    results.js
    writing.js
    listening.js
    reading.js
    speaking.js
    ai-speaking.js
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

Barcha test bo'limlari (Daily, Listening, Reading, Writing, Speaking, Full Exam), AI Speaking va **AI bilan maslahat** haqiqiy AI bilan ishlashi uchun kichik backend bor. API kalit **faqat backendda** saqlanadi — brauzerga yoki HTML faylga yozilmaydi.

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
- **AI Speaking** — har bir javobingiz AI'ga yuboriladi; AI fikr-mulohaza beradi va keyingi savolni beradi. Mikrofon uzluksiz rejimda ishlaydi.
- **AI bilan maslahat** — Gemini mentor bilan erkin suhbat: grammatika, lug'at, talaffuz, IELTS strategiyalari, o'qish rejasi va tushunmagan mavzular bo'yicha savol berish mumkin. Savol tiliga qarab o'zbek yoki ingliz tilida javob beradi; xatolarni tuzatib, misollar bilan tushuntiradi. Bundan tashqari, topshiriq, daftar yoki xatoni **rasmga olib biriktirish** mumkin — AI rasmni o'qib, o'sha topshiriq bo'yicha yordam beradi (1-3 ta JPG/PNG/WEBP rasm).
- **Battle Mode** — haqiqiy foydalanuvchilar bilan 1v1 real vaqt jangi (savollar lokal bankdan, javoblar avtomatik tekshiriladi).
- Kalit yo'q, kvota tugagan yoki backend o'chirilgan bo'lsa, sayt avtomatik **lokal rejimga** qaytadi — hech narsa buzilmaydi.
- AI holatini tekshirish: `http://127.0.0.1:8000/api/health`

> Gemini bepul tarifida so'rovlar soni cheklangan. Asosiy model band yoki kvota tugagan bo'lsa, backend `GEMINI_FALLBACK_MODEL` (gemini-3.1-flash-lite) ga avtomatik o'tadi; u ham ishlamasa sayt lokal bankka qaytadi.

> ⚠️ `backend\.env` faylini hech kimga yubormang va GitHubga yuklamang. Kalitni almashtirish kerak bo'lsa, provayder panelidan eski kalitni o'chiring.

## Videolar bo'limi

- 8 ta tayyor video bor (Zootopia, Kung Fu Panda, Puss in Boots va boshqalar).
- **➕ YouTube link qo'shish** tugmasi orqali o'z linkingizni qo'shasiz — video sayt ichida o'ynaydi.
  - Qo'llanadigan linklar: `https://www.youtube.com/watch?v=...`, `https://youtu.be/...`, `https://www.youtube.com/shorts/...` yoki shunchaki 11 belgili video ID.
- Diktant rejimi: video har 10 sekundda to'xtaydi — eshitganingizni yozasiz, to'g'ri bo'lsa video davom etadi.
- Qo'shilgan videolar brauzer xotirasida (localStorage) saqlanadi.

## Hisoblar

- Ro'yxatdan o'tish bepul — ism, email va parol kifoya.
- Admin panel quyidagi emaillardan biriga ro'yxatdan o'tgan hisobga ochiladi: `alimardonovio11@gmail.com`, `admin@englify.uz`. Boshqa emaillar oddiy o'quvchi sifatida kiradi.
- Ma'lumotlar brauzer xotirasida (localStorage) saqlanadi — boshqa qurilmada ko'rinmaydi.
