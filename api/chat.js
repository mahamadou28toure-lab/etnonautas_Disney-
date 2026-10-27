/**
 * API ENDPOINT SERVERLESS: /api/chat.js
 * Compatible con Vercel Serverless Functions y el servidor local de desarrollo.
 * Gestiona de forma segura las consultas al Asistente Virtual de Paris Magic Plan usando Google Gemini.
 * La clave de API (GEMINI_API_KEY) permanece estrictamente en el entorno del servidor.
 */

import { GoogleGenAI } from '@google/genai';

// Base de conocimiento exhaustiva y verificada de Paris Magic Plan
const SYSTEM_INSTRUCTION = `
Eres el Asistente Virtual Oficial de "Paris Magic Plan" (parismagicplan.com), un servicio profesional y exclusivo especializado en la planificación, organización y diseño personalizado de viajes a Disneyland Paris.

TU IDENTIDAD Y TONO:
- Tono: Profesional, cálido, empático, elegante, transparente y acogedor. Inspirador pero 100% realista y riguroso.
- Lema: "Nosotros lo planificamos. Tú solo tienes que vivir la magia."
- Idioma principal: Español.

SERVICIOS Y CONDICIONES COMERCIALES VERIFICADAS (ESTOS SON LOS DATOS EXACTOS, NUNCA LOS ALTERES):
1. SERVICIO DE TRAVEL PLANNER PERSONALIZADO:
   - Coste: Exactamente 200 € por la planificación completa del viaje (no por persona, sino por el viaje familiar/grupo).
   - Qué incluye: Planificación integral a medida según la familia, edades, días de estancia, gustos y presupuesto. Selección del hotel ideal, vuelos, traslados, restaurantes, experiencias con personajes, espectáculos, itinerarios diarios sin colas innecesarias y asesoramiento continuo antes y durante el viaje.
2. PRECIO OFICIAL DE DISNEYLAND PARIS (CERO SOBREPRECIO):
   - El paquete de estancia (hotel Disney + entradas a los parques + plan de comidas) mantiene exactamente el precio oficial disponible en Disneyland Paris en el momento de reservar.
   - El cliente solo paga los 200 € por el servicio de asesoría y planificación; NUNCA paga un sobreprecio por el paquete de Disney.
3. RESERVA A TRAVÉS DE AGENCIA ESPECIALIZADA:
   - Las reservas se formalizan a través de una agencia de viajes asociada y especializada sin añadir gastos de gestión de agencia al paquete.
   - Proporciona respaldo formal y asistencia directa ante incidencias, modificaciones o cancelaciones según las condiciones de la reserva.
4. FACILIDAD DE PAGO ESCALONADO:
   - Confirmación del paquete de viaje desde solo 400 €.
   - El resto se abona cómodamente a plazos o como prefiera el cliente a través de la plataforma de la agencia, hasta 30 días antes de la fecha de viaje.
   - Nota: Los billetes de avión se abonan al momento de emitir su reserva por política de las aerolíneas.
5. SEGURO DE VIAJE OPCIONAL:
   - Disponible desde 25 € por persona.
   - Coberturas: asistencia médica, cobertura de cancelación en los supuestos contemplados en la póliza, equipaje y asistencia 24 horas en español.
6. SERVICIOS Y EXPERIENCIAS QUE ORGANIZAMOS:
   - Hoteles Disney (Disneyland Hotel, Disney Hotel New York - The Art of Marvel, Disney Newport Bay Club, Disney Hotel Sequoia Lodge, Disney Hotel Cheyenne, Disney Hotel Santa Fe, Disney Davy Crockett Ranch) y hoteles asociados.
   - Restaurantes y reservas: Calendario y gestión de reservas en restaurantes temáticos y comidas con personajes (Mickey, Princesas, etc.).
   - App oficial de Disneyland Paris: Explicamos paso a paso cómo vincular la reserva, usar el MagicPass y gestionar accesos.
   - Itinerarios diarios optimizados: Qué parque visitar cada día (Parque Disneyland o Walt Disney Studios / Disney Adventure World), mejores horarios para atracciones, ubicación recomendada para los espectáculos y cómo evitar colas.
   - Asesoramiento especializado para viajar con niños pequeños (Baby Switch, alquiler de carritos) y personas mayores o con movilidad reducida (accesos preferentes, ritmos tranquilos).
   - Novedades y áreas temáticas: Adventure World y la esperada zona de World of Frozen.
   - Traslados: Opciones desde los aeropuertos Charles de Gaulle, Orly o Beauvais (traslados privados, Magical Shuttle, tren TGV o RER).

REGLAS DE ORO DE VERACIDAD Y RESPUESTA (CRÍTICAS):
- NO INVENTES PRECIOS DE HOTELES O ENTRADAS: Los precios de Disneyland Paris son dinámicos y varían según la fecha exacta, temporada y disponibilidad en tiempo real. Si te preguntan cuánto cuesta viajar en una fecha concreta, explica amablemente que el paquete Disney depende de las fechas y número de personas, y anímales a pulsar el botón "Quiero planificar mi viaje" en la web para que el equipo humano les elabore una propuesta oficial personalizada y detallada sin compromiso.
- NO INVENTES DISPONIBILIDAD NI AFIRMES QUE HAS HECHO UNA RESERVA: Eres un asistente informativo. No tienes acceso a sistemas de pago ni pasarelas. Invita a usar los formularios de la web para formalizar su petición.
- SI NO SABES ALGO O REQUIERE GESTIÓN PERSONALIZADA: Explica con franqueza que para ese detalle particular o caso especial, el equipo de Paris Magic Plan resolverá su consulta personalizada pulsando en "Pregunta cualquier duda" o "Quiero planificar mi viaje".
- Respuestas claras, concisas y bien estructuradas en párrafos breves o listas con viñetas. Evita textos interminables.
`;

function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // Configuración de encabezados CORS y seguridad
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(204).end();
    }
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      error: 'Método no permitido. Solo se aceptan peticiones POST.',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  // Parsear y validar el cuerpo de la petición
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return sendJson(res, 400, {
        error: 'Cuerpo de solicitud JSON inválido.',
        code: 'INVALID_JSON',
      });
    }
  }

  const { message, history } = body || {};

  // Validaciones del mensaje del usuario
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return sendJson(res, 400, {
      error: 'El mensaje no puede estar vacío.',
      code: 'EMPTY_MESSAGE',
    });
  }

  if (message.length > 1000) {
    return sendJson(res, 400, {
      error: 'El mensaje es demasiado largo. Por favor, escribe un mensaje de menos de 1000 caracteres.',
      code: 'MESSAGE_TOO_LONG',
    });
  }

  // Comprobar presencia de la API Key en el entorno del servidor
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('[Diagnostics /api/chat]: Variable GEMINI_API_KEY no detectada en el entorno.');
    return sendJson(res, 503, {
      error:
        'La clave de API de Google Gemini (GEMINI_API_KEY) no está configurada en las variables de entorno del servidor. Configúrala en el panel de Vercel (Project Settings > Environment Variables) para activar las respuestas con IA.',
      configured: false,
      code: 'MISSING_API_KEY',
    });
  }

  // Sanitizar y limitar el historial para evitar desbordamiento de contexto (máximo 8 mensajes previos)
  const sanitizedHistory = [];
  if (Array.isArray(history)) {
    const recentHistory = history.slice(-8);
    for (const item of recentHistory) {
      if (
        item &&
        (item.role === 'user' || item.role === 'model') &&
        typeof item.text === 'string'
      ) {
        sanitizedHistory.push({
          role: item.role,
          parts: [{ text: item.text.slice(0, 1000) }],
        });
      }
    }
  }

  try {
    // Inicializar Google Gen AI SDK
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Construir la lista de contenidos con el historial y el mensaje actual
    const contents = [
      ...sanitizedHistory,
      {
        role: 'user',
        parts: [{ text: message.trim() }],
      },
    ];

    // Intentar invocar el modelo recomendado gemini-3.8-flash, con fallback a gemini-2.5-flash
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
          topP: 0.95,
        },
      });
    } catch (modelErr) {
      const errStr = modelErr?.message || '';
      if (errStr.includes('not found') || errStr.includes('NOT_FOUND') || errStr.includes('unsupported')) {
        console.warn('[Diagnostics /api/chat]: gemini-3.8-flash no disponible para esta clave, intentando gemini-2.5-flash...');
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.6,
            topP: 0.95,
          },
        });
      } else {
        throw modelErr;
      }
    }

    const replyText =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('\n') ||
      '';

    if (!replyText || replyText.trim() === '') {
      return sendJson(res, 500, {
        error: 'El asistente no generó texto en esta respuesta. Por favor, reformula tu consulta.',
        code: 'EMPTY_RESPONSE',
      });
    }

    return sendJson(res, 200, {
      reply: replyText.trim(),
      success: true,
    });
  } catch (error) {
    const errorMessage = error?.message || '';
    console.error('[Diagnostics /api/chat]: Error al invocar Google Gemini:', errorMessage);

    if (
      errorMessage.includes('API_KEY_INVALID') ||
      errorMessage.includes('invalid API key') ||
      errorMessage.includes('API key not valid')
    ) {
      return sendJson(res, 401, {
        error: 'La clave GEMINI_API_KEY proporcionada no es válida o ha caducado. Revisa la configuración en Vercel.',
        configured: false,
        code: 'INVALID_API_KEY',
      });
    }

    if (
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('429')
    ) {
      return sendJson(res, 429, {
        error: 'Se ha superado temporalmente la cuota de la API de Gemini. Por favor, espera unos instantes o consulta directamente con el equipo de Paris Magic Plan.',
        code: 'QUOTA_EXCEEDED',
      });
    }

    return sendJson(res, 500, {
      error: 'Ha ocurrido un error al conectar con el asistente inteligente. Por favor, inténtalo de nuevo en unos momentos o utiliza el formulario de contacto.',
      code: 'UPSTREAM_ERROR',
    });
  }
}
