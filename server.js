import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chatHandler from './api/chat.js';
import planHandler from './api/plan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear cuerpos JSON y formularios
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas API del asistente y formulario de planificación
app.all(['/api/chat', '/api/chat/', '/api/chat.js'], async (req, res) => {
  try {
    await chatHandler(req, res);
  } catch (err) {
    console.error('Error en /api/chat:', err);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(500).json({ error: 'Error interno en el servidor.', code: 'INTERNAL_ERROR' });
    }
  }
});

app.all(['/api/plan', '/api/plan/', '/api/plan.js'], async (req, res) => {
  try {
    await planHandler(req, res);
  } catch (err) {
    console.error('Error en /api/plan:', err);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(500).json({ error: 'Error interno en el servidor.', code: 'INTERNAL_ERROR' });
    }
  }
});

// Servir archivos estáticos del sitio web (HTML, CSS puro, JS, assets)
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html'
}));

// Fallback a index.html para navegación directa
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor en el puerto 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Paris Magic Plan server listening on http://0.0.0.0:${PORT}`);
});
