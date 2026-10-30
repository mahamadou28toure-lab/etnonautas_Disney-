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

  // Base de conocimiento exhaustiva de Paris Magic Plan como respaldo fiable
  const getFallbackResponse = (rawMsg) => {
    const q = (rawMsg || '').toLowerCase();

    if (q.includes('niñ') || q.includes('hijo') || q.includes('hija') || q.includes('bebé') || q.includes('peque') || q.includes('familia')) {
      return `¡Viajar a Disneyland Paris con niños es una experiencia verdaderamente mágica! ✨

Estas son nuestras recomendaciones clave para aprovechar el viaje al máximo con ellos:

1. **Alojamiento temático y cómodo**: Te aconsejamos alojaros en un hotel oficial como **Disney Hotel Cheyenne** (ambientado en el Lejano Oeste con personajes de Toy Story) o **Disney Newport Bay Club** (junto al lago Disney y a solo 10-15 minutos a pie de los parques).
2. **Entrada anticipada (Extra Magic Time)**: Al dormir en un hotel Disney tenéis acceso exclusivo 1 hora antes de la apertura oficial. Es el mejor momento del día para subir a Peter Pan's Flight, Dumbo o las atracciones de Fantasyland prácticamente sin colas.
3. **Servicio Rider Switch (Baby Switch)**: Si vuestros peques no tienen la estatura mínima para ciertas atracciones (como Big Thunder Mountain o Space Mountain), este servicio permite a un adulto hacer la cola y que el otro disfrute después sin volver a esperar.
4. **Plan de Comidas y Reservas tempranas**: La **Pensión Completa Plus** os garantiza tranquilidad. Es fundamental reservar con semanas de antelación comidas con Personajes Disney (como en *Plaza Gardens* o *Auberge de Cendrillon*) desde la app oficial de Disneyland Paris.
5. **Espectáculos imprescindibles**: No os perdáis *Together: a Pixar Musical Adventure* y el espectáculo nocturno de drones y fuegos en el Castillo.

En **Paris Magic Plan** os organizamos el viaje completo y adaptamos cada día a vuestros hijos por solo 200 €. Pulsa en **"Quiero planificar mi viaje"** para que lo preparemos juntos.`;
    }

    if (q.includes('presupuesto') || q.includes('precio') || q.includes('coste') || q.includes('cuesta') || q.includes('200') || q.includes('tarifa')) {
      return `En **Paris Magic Plan** trabajamos con absoluta claridad y sin sorpresas:

- **Servicio de Travel Planner (200 €)**: Diseñamos vuestro viaje integral a medida: fechas ideales, hotel oficial, planes de comidas, vuelos, traslados, reserva de restaurantes y guía parque a parque día a día.
- **Precio oficial Disneyland Paris**: Vuestro paquete de hotel + entradas mantiene exactamente el precio oficial disponible en Disneyland Paris en el momento de reservar a través de la agencia colaboradora oficial, sin recargos.
- **Reserva flexible**: Puedes confirmar vuestro viaje desde 400 € y abonar el resto a plazos con total flexibilidad hasta 30 días antes de viajar.

Pulsa en **"Quiero planificar mi viaje"** para que preparemos vuestra propuesta personalizada.`;
    }

    if (q.includes('hotel') || q.includes('alojamiento') || q.includes('dormir') || q.includes('cheyenne') || q.includes('newport') || q.includes('santa fe') || q.includes('sequoia')) {
      return `Disneyland Paris cuenta con varios hoteles oficiales tematizados a pocos minutos de los parques:

- **Disney Hotel Cheyenne (3★)**: Inspirado en el Lejano Oeste y Woody de Toy Story. Muy familiar, confortable y con excelente relación calidad-precio.
- **Disney Newport Bay Club (4★)**: Estilo náutico a orillas del lago Disney, a 15 min a pie o en bus gratuito.
- **Disney Sequoia Lodge (3★)**: Inspiración en los parques nacionales norteamericanos, rodeado de pinos y con piscina climatizada.
- **Disney Hotel Santa Fe (2★)**: Ambientado en Cars y la Ruta 66, la opción oficial más económica.
- **Disney Hotel New York - The Art of Marvel (4★)**: Elegante galería de arte de superhéroes Marvel.
- **Disneyland Hotel (5★)**: El castillo de lujo a las puertas mismas del Parque Disneyland.

Al estar en un hotel oficial disfrutáis de **Extra Magic Time** (entrada 1 hora antes) y transporte gratuito continuo. ¿Quieres que te recomendemos el ideal para tus fechas? Pulsa en **"Quiero planificar mi viaje"**.`;
    }

    if (q.includes('restaurante') || q.includes('comer') || q.includes('comida') || q.includes('cena') || q.includes('desayuno') || q.includes('personaje')) {
      return `La experiencia gastronómica en Disneyland Paris es muy variada y conviene organizarla con antelación:

- **Comidas con Personajes**: *Plaza Gardens Restaurant* (buffet con Mickey y sus amigos) y *Auberge de Cendrillon* (comida de alta cocina francesa con Princesas Disney).
- **Restaurantes temáticos**: *Bistrot Chez Rémy* (donde te sientes del tamaño de una ratita de Ratatouille) o *Captain Jack's* (ubicado dentro de la atracción Piratas del Caribe).
- **Planes de Comidas**: Puedes incluir desayuno, media pensión o pensión completa en tu paquete oficial.

Las reservas de mesa se agotan rápido en la app oficial; con nuestro servicio de 200 € nos ocupamos de conseguir y gestionar vuestras reservas para que solo os preocupéis de disfrutar.`;
    }

    if (q.includes('vuelo') || q.includes('traslado') || q.includes('aeropuerto') || q.includes('transporte') || q.includes('llegar')) {
      return `Para viajar a Disneyland Paris desde España:

- **Aeropuertos principales**: París-Charles de Gaulle (CDG) y París-Orly (ORY). Desde CDG existe un tren de alta velocidad TGV directo que os deja en Disneyland Paris en solo 10 minutos.
- **Traslados privados o autobús Magic Shuttle**: Gestionamos vuestros traslados puerta a puerta con sillas homologadas para niños si viajáis en familia.
- **Vuelos**: A través de nuestra agencia colaboradora podemos incluir los vuelos que mejor se ajusten a vuestros horarios.

Todo queda coordinado para que vuestra llegada al hotel sea cómoda y sin complicaciones.`;
    }

    return `¡Hola! Soy el asistente virtual de **Paris Magic Plan** ✨

Estoy aquí para guiarte y responder todas las dudas que tengas sobre la web o tu viaje a Disneyland Paris:
- ¿Qué hotel Disney elegir según tu presupuesto?
- Consejos y recomendaciones para viajar con niños
- Selección y reserva de restaurantes y comidas con personajes
- Organización de días, atracciones y espectáculos sin colas innecesarias

Además, nuestro equipo planifica todo vuestro viaje a medida por solo **200 €**. ¿Qué te gustaría consultar?`;
  };

  // Comprobar presencia de la API Key en el entorno del servidor
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('[Diagnostics /api/chat]: Variable GEMINI_API_KEY no detectada en el entorno.');
    return sendJson(res, 200, {
      configured: false,
      code: 'MISSING_API_KEY',
      reply: getFallbackResponse(message),
      note: 'Respuesta generada con la base de conocimiento oficial de Paris Magic Plan. Configura GEMINI_API_KEY en Vercel para activar Google Gemini en tiempo real.',
      success: true,
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

    // Intentar invocar el modelo recomendado gemini-3.8-flash, con fallback a gemini-flash-latest y gemini-3.1-flash-lite
    let response;
    const modelCandidates = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError = null;

    for (const modelName of modelCandidates) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
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
      return sendJson(res, 200, {
        reply: getFallbackResponse(message),
        configured: true,
        success: true,
      });
    }

    return sendJson(res, 200, {
      reply: replyText.trim(),
      configured: true,
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
      return sendJson(res, 200, {
        configured: false,
        code: 'INVALID_API_KEY',
        reply: getFallbackResponse(message),
        error: 'La clave GEMINI_API_KEY no es válida o ha caducado en el servidor.',
        success: true,
      });
    }

    if (
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('429')
    ) {
      return sendJson(res, 200, {
        configured: true,
        code: 'QUOTA_EXCEEDED',
        reply: getFallbackResponse(message),
        error: 'Límite de cuota alcanzado temporalmente en Gemini.',
        success: true,
      });
    }

    return sendJson(res, 200, {
      reply: getFallbackResponse(message),
      configured: true,
      code: 'FALLBACK_GENERATED',
      error: 'Respuesta generada por la base de conocimiento oficial.',
      success: true,
    });
  }
}
