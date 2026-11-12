'use strict';

/*
 * Vercel serverless API router.
 * Barcha /api/* so'rovlari shu funksiyaga tushadi.
 * AI logikasi backend/server.js ichida — lokal server ham, Vercel ham bir xil kodni ishlatadi.
 */
const { setCors, handleApi, sendJSON } = require('../backend/server.js');

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let url = String(req.url || '/').split('?')[0];
  if (!url.startsWith('/api/')) {
    const raw = req.query && req.query.path;
    const parts = Array.isArray(raw) ? raw : (raw ? [raw] : []);
    url = '/api/' + parts.join('/');
  }

  const handled = await handleApi(req, res, url);
  if (!handled) {
    return sendJSON(res, 404, { detail: 'API endpoint topilmadi' });
  }
};
