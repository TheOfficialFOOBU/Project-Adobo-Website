/*
  scripts/serve-export.js
  Zero-dependency local preview of the GitHub Pages static export.

  Serves ./out mounted AT the configured base path, exactly like
  https://foobu.github.io/Project-Adobo-Website/ — so the locally served
  asset URLs (/Project-Adobo-Website/_next/...) resolve identically.

  Usage: npm run preview   (PORT env var optional, default 8080)
*/
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'out');
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '/Project-Adobo-Website';
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, status, absPath) {
  const ext = path.extname(absPath).toLowerCase();
  res.writeHead(status, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  if (res.req && res.req.method === 'HEAD') return res.end();
  fs.createReadStream(absPath).pipe(res);
}

function sendNotFound(res) {
  const nf = path.join(ROOT, '404.html');
  if (fs.existsSync(nf)) return send(res, 404, nf);
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
}

function resolveWithinRoot(rel) {
  const safe = path.normalize(rel).replace(/^(\.\.([\\/]))+/, '');
  const abs = path.join(ROOT, safe);
  return abs.startsWith(ROOT) ? abs : null;
}

const server = http.createServer((req, res) => {
  try {
    const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
    const decoded = decodeURIComponent(pathname);

    if (decoded === '/' || decoded === '') {
      res.writeHead(302, { Location: `${BASE}/` });
      return res.end();
    }

    if (decoded !== BASE && !decoded.startsWith(`${BASE}/`)) return sendNotFound(res);

    let rel = decoded.slice(BASE.length) || '/';
    if (rel.endsWith('/')) rel += 'index.html';

    let abs = resolveWithinRoot(rel);
    if (abs && fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      abs = path.join(abs, 'index.html');
    }

    // Clean-URL fallback: /members/foobu -> members/foobu.html
    // (mirrors how GitHub Pages serves exported pages without extensions).
    if ((!abs || !fs.existsSync(abs)) && !path.extname(rel)) {
      const htmlVariant = resolveWithinRoot(`${rel}.html`);
      if (htmlVariant && fs.existsSync(htmlVariant)) abs = htmlVariant;
    }

    if (abs && fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      return send(res, 200, abs);
    }

    return sendNotFound(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Preview server error: ${err && err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT}`);
  console.log(`GitHub Pages preview: http://localhost:${PORT}${BASE}/`);
});
