import http from 'node:http';
import { generateMermaid } from './src/index.mjs';
import { detectLanguage } from './src/language-detect.mjs';

const PORT = process.env.AST2M_PORT ? Number(process.env.AST2M_PORT) : 3400;

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'POST' && req.url === '/convert') {
    try {
      const body = await readJson(req);
      const code = String(body.code || '');
      const language = String(body.language || 'js');
      if (!code.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'code is required' }));
        return;
      }
      
      const mermaid = await generateMermaid({ code, language });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mermaid }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: err?.message || String(err) }));
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/detect') {
    try {
      const body = await readJson(req);
      const code = String(body.code || '');
      const language = detectLanguage(code);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ language }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: err?.message || String(err) }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`ast-to-mermaid service listening on http://localhost:${PORT}`);
});


