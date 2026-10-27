/**
 * API ENDPOINT SERVERLESS: /api/plan.js
 * Compatible con Vercel Serverless Functions y el servidor local de desarrollo.
 * Recibe, valida y procesa el Formulario Oficial de Planificación de Viajes de Paris Magic Plan.
 * Aplica principios de minimización de datos y seguridad.
 */

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      error: 'Método no permitido. Solo se aceptan solicitudes POST.',
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

  const {
    // Paso 1: Contacto
    fullName,
    phone,
    email,
    // Paso 1: Viaje
    travelDatesOption,
    travelDatesDetail,
    adultsCount,
    childrenCount,
    babiesCount,
    disneyDays,
    departureCity,
    // Paso 2: Preferencias y Necesidades
    budgetOption,
    stageOption,
    concerns,
    flightsOption,
    transfersOption,
    visitedBefore,
    specialNotes,
    // Consentimiento
    privacyConsent,
  } = body || {};

  // Validaciones del Paso 1 en el servidor
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return sendJson(res, 400, {
      error: 'El nombre y apellidos son obligatorios.',
      field: 'fullName',
    });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    return sendJson(res, 400, {
      error: 'El teléfono / WhatsApp es obligatorio.',
      field: 'phone',
    });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return sendJson(res, 400, {
      error: 'Por favor, proporciona un correo electrónico válido.',
      field: 'email',
    });
  }

  if (!travelDatesOption || typeof travelDatesOption !== 'string') {
    return sendJson(res, 400, {
      error: 'Por favor, indica cuándo os gustaría viajar.',
      field: 'travelDatesOption',
    });
  }

  const parsedAdults = parseInt(adultsCount, 10);
  if (isNaN(parsedAdults) || parsedAdults < 1) {
    return sendJson(res, 400, {
      error: 'Debe haber al menos 1 adulto en el grupo de viaje.',
      field: 'adultsCount',
    });
  }

  if (!disneyDays || typeof disneyDays !== 'string') {
    return sendJson(res, 400, {
      error: 'Por favor, selecciona cuántos días queréis dedicar a Disneyland Paris.',
      field: 'disneyDays',
    });
  }

  // Validaciones del Paso 2 en el servidor
  if (!budgetOption || typeof budgetOption !== 'string') {
    return sendJson(res, 400, {
      error: 'Por favor, selecciona un presupuesto orientativo aproximado.',
      field: 'budgetOption',
    });
  }

  if (!stageOption || typeof stageOption !== 'string') {
    return sendJson(res, 400, {
      error: 'Por favor, indica en qué punto estáis con vuestro viaje.',
      field: 'stageOption',
    });
  }

  if (!flightsOption || typeof flightsOption !== 'string') {
    return sendJson(res, 400, {
      error: 'Por favor, indica si queréis que os gestionemos los vuelos.',
      field: 'flightsOption',
    });
  }

  if (!transfersOption || typeof transfersOption !== 'string') {
    return sendJson(res, 400, {
      error: 'Por favor, indica si queréis que os gestionemos los traslados.',
      field: 'transfersOption',
    });
  }

  if (!visitedBefore || typeof visitedBefore !== 'string') {
    return sendJson(res, 400, {
      error: 'Por favor, indica si habéis visitado Disneyland Paris anteriormente.',
      field: 'visitedBefore',
    });
  }

  if (privacyConsent !== true && privacyConsent !== 'true') {
    return sendJson(res, 400, {
      error: 'Debes aceptar la política de privacidad para autorizar el contacto.',
      field: 'privacyConsent',
    });
  }

  // Sanitización de datos
  const sanitizedPlan = {
    submittedAt: new Date().toISOString(),
    fullName: fullName.trim().slice(0, 150),
    phone: phone.trim().slice(0, 50),
    email: email.trim().toLowerCase().slice(0, 150),
    travelDatesOption: travelDatesOption.slice(0, 100),
    travelDatesDetail: travelDatesDetail ? travelDatesDetail.trim().slice(0, 200) : '',
    adultsCount: parsedAdults,
    childrenCount: Math.max(0, parseInt(childrenCount, 10) || 0),
    babiesCount: Math.max(0, parseInt(babiesCount, 10) || 0),
    disneyDays: disneyDays.slice(0, 100),
    departureCity: departureCity ? departureCity.trim().slice(0, 120) : '',
    budgetOption: budgetOption.slice(0, 100),
    stageOption: stageOption.slice(0, 150),
    concerns: Array.isArray(concerns) ? concerns.slice(0, 10).map((c) => String(c).slice(0, 120)) : [],
    flightsOption: flightsOption.slice(0, 100),
    transfersOption: transfersOption.slice(0, 100),
    visitedBefore: visitedBefore.slice(0, 80),
    specialNotes: specialNotes ? specialNotes.trim().slice(0, 1500) : '',
    privacyConsent: true,
  };

  // Diagnóstico seguro en servidor (sin registrar contraseñas ni información médica)
  console.log(
    `[Paris Magic Plan /api/plan]: Solicitud válida recibida para ${sanitizedPlan.fullName} (${sanitizedPlan.email}) - Viajeros: ${sanitizedPlan.adultsCount} ad, ${sanitizedPlan.childrenCount} ch, ${sanitizedPlan.babiesCount} bb`
  );

  // Integración opcional de envío con webhook externo o servicio de email en Vercel
  const notificationWebhookUrl = process.env.PLAN_WEBHOOK_URL;
  if (notificationWebhookUrl) {
    try {
      await fetch(notificationWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedPlan),
      });
      console.log('[Paris Magic Plan /api/plan]: Notificación enviada al webhook configurado.');
    } catch (webhookErr) {
      console.error('[Paris Magic Plan /api/plan]: Error al enviar al webhook externo:', webhookErr);
      // No bloqueamos la confirmación al cliente si el webhook falló temporalmente
    }
  }

  return sendJson(res, 200, {
    success: true,
    message: 'Solicitud de planificación recibida y validada correctamente por Paris Magic Plan.',
    data: {
      fullName: sanitizedPlan.fullName,
      email: sanitizedPlan.email,
      submittedAt: sanitizedPlan.submittedAt,
    },
  });
}
