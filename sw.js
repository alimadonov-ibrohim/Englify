/* ============================================================
   Englify — Service Worker (PWA / offline / iPhone)
   ------------------------------------------------------------
   Bu fayl saytni telefon va kompyuterga "ilova" sifatida
   o'rnatilgandan keyin internetsiz ishlashini ta'minlaydi.

   Muhim: statik fayllar (HTML/CSS/JS/ikonka) o'zgarganda
   quyidagi VERSION qiymatini oshiring — aks holda eski nusxa
   keshdan olinadi.
   ============================================================ */

'use strict';

const VERSION = 'englify-pwa-v3';
const CORE_CACHE = VERSION + '-core';
const RUNTIME_CACHE = VERSION + '-runtime';

const SCOPE = self.registration.scope;

function abs(p) {
  return new URL(p, SCOPE).href;
}

/* Ilova qobig'i — birinchi o'rnatishda keshlanadi */
const PRECACHE = [
  './',
  'Englify.html',
  'manifest.json',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
  'assets/css/base.css',
  'assets/css/home.css',
  'assets/css/dashboard.css',
  'assets/css/admin-ai.css',
  'assets/css/results.css',
  'assets/css/profile.css',
  'assets/css/create-test.css',
  'assets/css/writing.css',
  'assets/css/daily.css',
  'assets/css/listening.css',
  'assets/css/reading.css',
  'assets/css/speaking.css',
  'assets/css/battle.css',
  'assets/css/full-exam.css',
  'assets/css/nav.css',
  'assets/css/videos.css',
  'assets/css/advice.css',
  'assets/css/ios-pwa.css',
  'assets/js/vendor/qrcode.js',
  'assets/js/core.js',
  'assets/js/pwa.js',
  'assets/js/profile.js',
  'assets/js/navigation.js',
  'assets/js/results.js',
  'assets/js/writing.js',
  'assets/js/listening.js',
  'assets/js/reading.js',
  'assets/js/speaking.js',
  'assets/js/advice.js',
  'assets/js/battle-setup.js',
  'assets/js/videos.js',
  'assets/js/full-exam.js',
  'assets/js/battle.js',
  'assets/js/daily.js',
  'assets/js/courses.js',
  'assets/js/vocab.js',
  'assets/js/certificates.js',
  'assets/js/create-test.js',
  'assets/js/home-recent.js',
  'assets/js/theme-language.js',
  'assets/js/dictionary.js',
  'assets/js/admin.js'
].map(abs);

const OFFLINE_HTML = '<!DOCTYPE html><html lang="uz"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Englify — offline</title></head>' +
  '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
  'background:#000;color:#e8eef7;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:24px;">' +
  '<div><div style="font-size:44px;margin-bottom:12px;">📶</div>' +
  '<h1 style="font-size:20px;margin:0 0 8px;">Internet aloqasi yo‘q</h1>' +
  '<p style="font-size:14px;color:#9aadc2;margin:0 0 18px;line-height:1.6;">' +
  'Englify’ni kamida bir marta onlayn ochib, so‘ng bosh ekranga qo‘shing — keyin offline ishlaydi.</p>' +
  '<button onclick="location.reload()" style="border:0;border-radius:12px;padding:11px 20px;' +
  'background:#2563eb;color:#fff;font-size:14px;font-weight:700;">Qayta urinish</button></div></body></html>';

/* ---------- INSTALL ---------- */
self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    const cache = await caches.open(CORE_CACHE);
    // Har bir faylni alohida yuklaymiz: bittasi topilmasa, qolganlari keshlanadi.
    await Promise.all(PRECACHE.map(function (url) {
      return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
    }));
    await self.skipWaiting();
  })());
});

/* ---------- ACTIVATE ---------- */
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.map(function (key) {
      if (key !== CORE_CACHE && key !== RUNTIME_CACHE) return caches.delete(key);
      return null;
    }));
    await self.clients.claim();
  })());
});

/* ---------- FETCH ---------- */
self.addEventListener('fetch', function (event) {
  const req = event.request;

  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Boshqa domenlar (Google Fonts, QR API va h.k.) — to'g'ridan-to'g'ri tarmoqdan.
  if (url.origin !== self.location.origin) return;

  // API javoblari hech qachon keshlanmaydi.
  if (url.pathname.indexOf('/api/') === 0) return;

  // Katta fayl / audio-video bo'laklari va APK keshlanmaydi.
  if (req.headers.has('range')) return;
  if (/\.apk$/i.test(url.pathname)) return;

  // Navigatsiya (sahifani ochish): avval internet, xato bo'lsa kesh.
  if (req.mode === 'navigate') {
    event.respondWith((async function () {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CORE_CACHE);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (e) {
        const cache = await caches.open(CORE_CACHE);
        return (await cache.match(req)) ||
          (await cache.match(abs('Englify.html'))) ||
          new Response(OFFLINE_HTML, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
      }
    })());
    return;
  }

  // Statik fayllar: avval internet — yangi dizayn darhol ko'rinadi,
  // internet bo'lmasa keshdan (offline) qaytaramiz.
  event.respondWith((async function () {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok && fresh.type === 'basic') {
        cache.put(req, fresh.clone()).catch(function () {});
      }
      return fresh;
    } catch (e) {
      const cached = (await caches.match(req)) || (await cache.match(req));
      if (cached) return cached;
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
