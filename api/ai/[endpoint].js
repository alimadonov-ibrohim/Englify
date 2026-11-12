'use strict';

/*
 * Vercel serverless AI router: /api/ai/*
 * Endpointlar: chat, advice, score-writing, score-speaking, generate.
 */
const { setCors, handleApi, sendJSON } = require('../../backend/server.js');

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let url = String(req.url || '/').split('?')[0];
  if (!url.startsWith('/api/ai/')) {
    const ep = req.query && req.query.endpoint;
    const name = Array.isArray(ep) ? ep[0] : (ep || '');
    url = '/api/ai/' + name;
  }

  const handled = await handleApi(req, res, url);
  if (!handled) {
    return sendJSON(res, 404, { detail: 'API endpoint topilmadi' });
  }
};
