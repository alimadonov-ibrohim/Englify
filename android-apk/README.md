# Englify APK

## Tayyor APK

- `dist/Englify.apk` — telefonga o'rnatish uchun tayyor fayl.
- Qulaylik uchun nusxalari:
  - `C:\Users\user\Desktop\Englify\Englify.apk`
  - `C:\Users\user\Desktop\Englify.apk`

APK ichida sayt to'liq (HTML, CSS, JS, rasmlar) bor. Ilova internetga ulanmasa ham asosiy bo'limlar ishlaydi.

## Telefonga o'rnatish

1. `Englify.apk` faylini telefonga ko'chiring (USB, Telegram, Google Drive va h.k.).
2. Telefonda faylni oching.
3. So'ralganda **"Noma'lum manbalardan o'rnatish"**ga ruxsat bering.
4. **"O'rnatish"** tugmasini bosing.
5. O'rnatilgach, **Englify** ilovasini oching.

## Nima ishlaydi

- Testlar, Reading Mock (10 savol), Daily, Vocabulary, Listening, Writing, Full Exam va boshqa lokal bo'limlar.
- Listening Mock, Full Exam va AI Speaking ovozlari native Android TTS bilan tiniq chiqadi.
- Natijalar va sozlamalar telefonda `localStorage`da saqlanadi.
- Internet shart emas. Faqat tashqi Google Fonts va QR kod xizmati internetni talab qilishi mumkin.

## Ovoz (TTS)

- Ilova telefonning mavjud ingliz ovozlaridan eng sifatlisini avtomatik tanlaydi (lokal ovozlar afzal ko'riladi).
- Ovoz chiqmasa: telefon sozlamalarida **Google Text-to-Speech** yoqilganini va ingliz tili o'rnatilganini tekshiring.
- Brauzerda ham eng yaxshi mavjud ovoz (Microsoft Natural / Google) avtomatik tanlanadi.

## AI funksiyalari haqida

- "Maslahat", AI Speaking va AI Writing kabi funksiyalar kompyuterdagi AI backend'ga (`http://127.0.0.1:8000`) murojaat qiladi.
- APK ichida Node.js yoki Gemini backend yo'q. Shuning uchun telefonda bu bo'limlar AI javobisiz qolishi va ogohlantirish ko'rsatishi mumkin.
- AI'ni telefonda ishlatish uchun backend kompyuterda ishga tushirilib, telefon va kompyuter bitta Wi-Fi tarmog'iga ulanishi kerak. Buni keyingi bosqichda sozlash mumkin.

## Qayta yig'ish

Eng oson usul — `build-apk.bat` faylini ikki marta bosish.

Yoki PowerShell'da:

```powershell
powershell -ExecutionPolicy Bypass -File android-apk\build-apk.ps1
```

Talablar:

- JDK 17+ (hozir PyCharm ichidagi JBR 21 ishlatilgan)
- Android SDK:
  - `platform-tools`
  - `platforms;android-35`
  - `build-tools;35.0.0`

Natija: `android-apk\dist\Englify.apk`

## Imzolash kaliti

- `englify.keystore` — keyingi versiyalarni yangilash uchun saqlab qo'ying.
- Alias: `englify`
- Parol: lokal `keystore.properties` faylida yoki `ENGLIFY_KEYSTORE_PASS` muhit o'zgaruvchisida saqlanadi (repo'ga qo'yilmaydi).
- Kalit yo'qolsa, ilovani yangilab bo'lmaydi; avval eskisini o'chirib, keyin yangisini o'rnatishga to'g'ri keladi.
