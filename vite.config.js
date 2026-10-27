import 'dotenv/config';
import { defineConfig } from 'vite';
import chatHandler from './api/chat.js';
import planHandler from './api/plan.js';

function createApiMiddleware(route, handler) {
  return async (req, res, next) => {
    if (!req.url.startsWith(route)) {
      return next();
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch {
          req.body = {};
        }

        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        try {
          await handler(req, res);
        } catch (err) {
          console.error(`Error en ${route} local:`, err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Error interno en el servidor.' }));
          }
        }
      });
    } else if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.statusCode = 204;
      res.end();
    } else {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Método no permitido. Solo se acepta POST.' }));
    }
  };
}

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  plugins: [
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(createApiMiddleware('/api/chat', chatHandler));
        server.middlewares.use(createApiMiddleware('/api/plan', planHandler));
      },
    },
  ],
});
