import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT) || 4173;

const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(body);
}

if (!existsSync(root)) {
  console.error('dist/ not found. Run "npm run build" before "npm start".');
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  let filePath = path.resolve(root, `.${requested}`);

  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    send(res, 403, 'Forbidden');
    return;
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    if (path.extname(requested)) {
      send(res, 404, 'Not found');
      return;
    }
    filePath = path.join(root, 'index.html');
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      send(res, 404, 'Not found');
      return;
    }
  } catch {
    send(res, 404, 'Not found');
    return;
  }

  res.writeHead(200, {
    'Content-Type': mime[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': filePath.includes(`${path.sep}assets${path.sep}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving dist on http://0.0.0.0:${port}`);
});
