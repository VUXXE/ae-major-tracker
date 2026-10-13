import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import worker from './worker/index.js';

const execFileAsync = promisify(execFile);

async function callLocalApiAnything(op, args = {}) {
  const cliArgs = ['call', 'hltv', op];
  for (const [k, v] of Object.entries(args)) {
    if (v !== undefined && v !== null) {
      cliArgs.push(`${k}=${v}`);
    }
  }
  const { stdout } = await execFileAsync('api-anything', cliArgs, { timeout: 25000 });
  const parsed = JSON.parse(stdout.trim());
  if (!parsed || !parsed.ok) {
    throw new Error(parsed?.reason || `api-anything ${op} failed`);
  }
  return parsed;
}

function cloudflareWorkerApiPlugin() {
  const middleware = async (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api/')) {
      return next();
    }
    try {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host || 'localhost:5173';
      const fullUrl = `${protocol}://${host}${req.url}`;
      const webReq = new Request(fullUrl, {
        method: req.method || 'GET',
        headers: req.headers
      });
      const env = { LOCAL_API_ANYTHING: callLocalApiAnything };
      const webRes = await worker.fetch(webReq, env, { waitUntil: (p) => Promise.resolve(p).catch(() => {}) });
      res.statusCode = webRes.status;
      webRes.headers.forEach((val, key) => {
        res.setHeader(key, val);
      });
      const buf = Buffer.from(await webRes.arrayBuffer());
      res.end(buf);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  };
  return {
    name: 'cloudflare-worker-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

export default defineConfig({
  plugins: [tailwindcss(), cloudflareWorkerApiPlugin()],
});
