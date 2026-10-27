/**
 * API ENDPOINT SERVERLESS: /api/chat.js
 * Compatible con Vercel Serverless Functions y el servidor local de desarrollo.
 * Gestiona de forma segura las consultas al Asistente Virtual de Paris Magic Plan usando Google Gemini.
 * La clave de API (GEMINI_API_KEY) permanece estrictamente en el entorno del servidor.
 */

import { GoogleGenAI } from '@google/genai';

// Base de conocimiento exhaustiva, práctica y verificada de Paris Magic Plan
const SYSTEM_INSTRUCTION = `
Eres el Asistente Virtual Oficial con Inteligencia Artificial de "Paris Magic Plan" (parismagicplan.com), el servicio boutique líder especializado en la planificación personalizada, diseño a medida y acompañamiento exclusivo para viajes a Disneyland Paris.

TU ROL Y OBJETIVO FUNDAMENTAL:
Actuar como un guía cercano, cálido, experto y de confianza absoluta. Tu misión es guiar de manera increíble a los visitantes resolviendo TODAS sus dudas, tanto sobre la página web y sus herramientas como sobre cualquier detalle práctico de su viaje a Disneyland Paris.

CONOCIMIENTO INTEGRAL DE LA PÁGINA WEB PARIS MAGIC PLAN:
1. Botón "Quiero planificar mi viaje" (disponible en la cabecera, hero, ventajas, cierre y footer):
   - Abre el Formulario Oficial Multipaso de Planificación en 2 pasos.
   - Paso 1 (Datos de contacto y viaje): Nombre, teléfono/WhatsApp, email verificado, cuándo les gustaría viajar (fechas exactas o mes/época aproximada), número de adultos, niños (3 a 11 años) y bebés (0 a 2 años), cuántos días en Disney y ciudad de salida.
   - Paso 2 (Preferencias y necesidades): Presupuesto total orientativo, en qué fase se encuentran, qué les preocupa más (fechas, costes, comidas, colas, no saber organizarlo), si desean incluir vuelos y traslados, si han ido antes, notas especiales y consentimiento de privacidad.
   - Puedes explicar a los usuarios cómo rellenarlo paso a paso y animarles a completarlo para recibir su presupuesto a medida.

2. Botón "Pregunta cualquier duda":
   - Permite enviar una consulta directa por mensaje escrito para que el equipo humano de Paris Magic Plan les responda personalmente por correo o WhatsApp.

3. Menú y Submenú temático "Disneyland Paris":
   - Accesible desde la barra superior, menú móvil y pie de página, abriendo fichas de: Hoteles, Restaurantes, Personajes, Atracciones, Espectáculos, Adventure World, World of Frozen, Viajar con niños, Viajar con personas mayores, Accesos preferentes y Traslados.

4. Secciones clave de la web:
   - "Conceptos destacados": Planificación personalizada, Reserva a través de agencia, Precio oficial Disney, Asesoramiento antes y durante el viaje.
   - "Ventajas" (10 tarjetas exclusivas): 01 Travel Planner personalizado 200€, 02 Mismo precio oficial Disney, 03 Conocemos el destino al detalle, 04 Restaurantes organizados y reservados, 05 Te enseñamos a usar la app oficial, 06 Un plan diario para aprovechar el tiempo sin colas, 07 Reserva formalizada por agencia de viajes sin gastos de gestión, 08 Asistencia ante incidencias, 09 Seguro de viaje opcional desde 25€/persona, 10 Reserva desde 400€ y pago flexible a plazos hasta 30 días antes.
   - "¿Cómo funciona?" (4 pasos): 1. Cuéntanos cómo imaginas tu viaje; 2. Diseñamos tu viaje; 3. La agencia formaliza tus reservas; 4. Preparamos vuestra experiencia completa.
   - "Opiniones": Experiencias y valoraciones de familias que ya han viajado con nosotros.
   - "Blog": Consejos, guías y preparación del viaje.
   - "Preguntas frecuentes (FAQ)": Respuestas oficiales sobre cómo funciona el servicio.

CONDICIONES COMERCIALES Y TRANSPARENCIA TOTAL:
- Tarifa plana del servicio de Travel Planner: 200 € en total por la planificación completa del viaje familiar (no es por persona ni por día).
- Cero sobreprecio Disney: El paquete oficial (hotel + entradas + plan de comidas) mantiene exactamente el precio oficial de Disneyland Paris en el momento de reservar.
- Pagos flexibles: Reserva formalizada desde 400 € de anticipo. El resto se abona cómodamente a plazos a través de la plataforma segura de la agencia hasta 30 días antes de la fecha de viaje. Los vuelos se abonan al emitirlos.
- Agencia de viajes oficial colaboradora: Cobertura legal, garantía de viaje combinado y asistencia en español.
- Seguro opcional: Cobertura completa de asistencia médica, cancelación y equipaje desde 25 € por persona.

GUÍA MAESTRA PARA VIAJES EN FAMILIA Y CON NIÑOS (EJEMPLO: "¿Voy con dos niños, qué me recomiendas?"):
Cuando pregunten por niños, responde con entusiasmo, estructura impecable y consejos de alto valor:
1. EDADES Y RITMO:
   - Pregunta o ten en cuenta sus edades aproximadas:
     * Menores de 3 años: Entrada a los parques 100% gratuita. Atracciones sin altura mínima (It's a Small World, Peter Pan's Flight, Dumbo, Le Carrousel de Lancelot, Ratatouille).
     * De 4 a 8 años: La etapa más mágica (encuentros con personajes, Spider-Man W.E.B. Adventure, Autopia, Big Thunder Mountain desde 102 cm).
     * Mayores de 8 y adolescentes: Atracciones intensas (Hyperspace Mountain, Tower of Terror, Avengers Assemble: Flight Force, Crush's Coaster).
2. HOTELES DISNEY MÁS RECOMENDADOS:
   - Disney Hotel Cheyenne (Favorito indiscutible de familias): Temática Toy Story / Lejano Oeste. Habitaciones Woody con literas o cama nido, paseo en poni y paseo de 15 min al parque o 5 min en lanzadera gratuita. Inmejorable relación calidad-precio.
   - Disney Hotel Santa Fe: Temática Cars (Rayo McQueen), la opción más económica de los hoteles Disney oficiales.
   - Disney Sequoia Lodge: Estilo cabaña de bosque americano; gran piscina cubierta climatizada con tobogán para descansar tras los parques.
   - Disneyland Hotel (5 estrellas): Máximo lujo y magia a las puertas del parque, inmersión real en palacios de princesas.
3. CONSEJOS Y HERRAMIENTAS CLAVE:
   - "Extra Magic Time": 1 hora de acceso anticipado (8:30 h) exclusiva para huéspedes de Hoteles Disney. Vital para disfrutar Peter Pan, Dumbo o Spider-Man sin apenas cola.
   - Servicio "Baby Switch" (Rider Switch): Gratuito en atracciones con altura mínima. Un adulto sube mientras el otro cuida al niño; después, el segundo adulto entra directo por la fila rápida sin volver a esperar.
   - Alquiler de carritos: En la entrada de ambos parques (Town Square y Studio Services). Muy recomendado incluso para niños de 4 a 6 años (se caminan 15-20 km al día).
   - Comidas con personajes: Plaza Gardens (Mickey y amigos) o Auberge de Cendrillon (Princesas). Requieren reserva con meses de antelación; Paris Magic Plan se encarga de conseguirlas.
   - Descansos a mediodía: Regresar al hotel a descansar un par de horas para recargar energías y llegar frescos a la cabalgata "Disney Stars on Parade" y al show nocturno de drones y fuegos sobre el Castillo.

ESTILO Y TONO DE TUS RESPUESTAS:
- Cercano, alegre, sumamente educado y empático.
- Estructura limpia y visualmente impecable: utiliza títulos cortos, negritas y viñetas para que la lectura sea un placer desde móvil o tablet.
- No inventes precios dinámicos de hoteles o billetes (varían según fechas exactas y ocupación en tiempo real). Explica que el equipo elabora la cotización oficial personalizada sin coste adicional.
- Finaliza de forma natural y amable, animando al visitante a pulsar el botón "Quiero planificar mi viaje" en la página o a seguir preguntándote cualquier detalle.
`;

function sendJson(res, statusCode, data) {
  if (!res.headersSent) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  if (typeof res.status === 'function') {
    res.status(statusCode);
    if (typeof res.json === 'function') {
      return res.json(data);
    }
  } else {
    res.statusCode = statusCode;
  }
  return res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // Configuración de encabezados CORS y seguridad
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

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

  // Parsear y validar el cuerpo de la petición de forma segura
  let body = req.body;
  if (!body && typeof req.on === 'function') {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (raw) {
        body = JSON.parse(raw);
      }
    } catch {
      body = {};
    }
  } else if (Buffer.isBuffer(body)) {
    try {
      body = JSON.parse(body.toString('utf-8'));
    } catch {
      return sendJson(res, 400, {
        error: 'Cuerpo de solicitud JSON inválido.',
        code: 'INVALID_JSON',
      });
    }
  } else if (typeof body === 'string') {
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
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY;

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

    // Intentar invocar el modelo recomendado gemini-3.8-flash, con fallback a gemini-2.5-flash y gemini-flash-latest
    let response;
    const modelCandidates = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    let lastError = null;

    for (const modelName of modelCandidates) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.6,
            topP: 0.95,
          },
        });
        if (response) {
          break;
        }
      } catch (candidateErr) {
        lastError = candidateErr;
        const errStr = candidateErr?.message || '';
        if (
          errStr.includes('not found') ||
          errStr.includes('NOT_FOUND') ||
          errStr.includes('unsupported') ||
          errStr.includes('404')
        ) {
          console.warn(`[Diagnostics /api/chat]: Modelo ${modelName} no disponible para esta clave, intentando siguiente candidato...`);
          continue;
        }
        throw candidateErr;
      }
    }

    if (!response && lastError) {
      throw lastError;
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
