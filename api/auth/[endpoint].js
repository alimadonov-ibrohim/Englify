'use strict';

/*
 * Vercel serverless auth router: /api/auth/*
 * Barcha auth so'rovlari backend/server.js dagi handleAuth ga yuboriladi.
 * (AI uchun alohida router bo'lgani kabi, auth uchun ham alohida router kerak —
 *  catch-all [...path].js Vercel'da ichki /api/auth/* yo'llarini ishonchli
 *  qamrab olmaydi.)
 */
const { setCors, handleApi, sendJSON } = require('../../backend/server.js');

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let url = String(req.url || '/').split('?')[0];
  if (!url.startsWith('/api/auth/')) {
    const raw = req.query && req.query.endpoint;
    const parts = Array.isArray(raw) ? raw : (raw ? [raw] : []);
    url = '/api/auth/' + parts.join('/');
  }

  const handled = await handleApi(req, res, url);
  if (!handled) {
    return sendJSON(res, 404, { detail: 'Auth endpoint topilmadi' });
  }
};
