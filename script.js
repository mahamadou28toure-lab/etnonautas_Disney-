/**
 * PARIS MAGIC PLAN — JAVASCRIPT PURO (VANILLA JS)
 * Gestión de navegación, submenú desplegable, menú móvil, acordeones FAQ,
 * modales interactivos, validación de formularios y animaciones al hacer scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. HEADER SCROLL & NAVEGACIÓN DESKTOP / MÓVIL
     ========================================================================== */
  const siteHeader = document.getElementById('site-header');
  const navDropdown = document.getElementById('nav-dropdown-disneyland');
  const navDropdownTrigger = document.getElementById('nav-dropdown-trigger');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileSubTrigger = document.getElementById('mobile-sub-trigger');
  const mobileSubmenu = document.getElementById('mobile-submenu');
  const iconMenuOpen = document.getElementById('icon-menu-open');
  const iconMenuClose = document.getElementById('icon-menu-close');

  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 16) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Submenú Desktop Disneyland Paris
  const setDesktopDropdown = (open) => {
    if (!navDropdown || !navDropdownTrigger) return;
    navDropdown.classList.toggle('is-open', open);
    navDropdownTrigger.setAttribute('aria-expanded', String(open));
  };

  if (navDropdown && navDropdownTrigger) {
    navDropdown.addEventListener('mouseenter', () => setDesktopDropdown(true));
    navDropdown.addEventListener('mouseleave', () => setDesktopDropdown(false));
    navDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.contains('is-open');
      setDesktopDropdown(!isOpen);
    });
  }

  // Menú Móvil / Tablet
  const setMobileMenu = (open) => {
    if (!mobileDrawer || !mobileMenuBtn) return;
    mobileDrawer.classList.toggle('is-open', open);
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (iconMenuOpen && iconMenuClose) {
      iconMenuOpen.style.display = open ? 'none' : 'block';
      iconMenuClose.style.display = open ? 'block' : 'none';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('is-open');
      setMobileMenu(!isOpen);
    });
  }

  if (mobileSubTrigger && mobileSubmenu) {
    mobileSubTrigger.addEventListener('click', () => {
      const isOpen = mobileSubmenu.classList.contains('is-open');
      mobileSubmenu.classList.toggle('is-open', !isOpen);
      mobileSubTrigger.setAttribute('aria-expanded', String(!isOpen));
      const chevron = mobileSubTrigger.querySelector('.nav-dropdown__icon');
      if (chevron) {
        chevron.style.transform = !isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  }

  // Cerrar menú móvil al hacer clic en enlaces de ancla internos
  document.querySelectorAll('[data-close-mobile]').forEach((link) => {
    link.addEventListener('click', () => {
      setMobileMenu(false);
      setDesktopDropdown(false);
    });
  });

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('mousedown', (e) => {
    if (navDropdown && !navDropdown.contains(e.target)) {
      setDesktopDropdown(false);
    }
  });

  /* ==========================================================================
     2. ACORDEONES DE PREGUNTAS FRECUENTES (FAQ)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isCurrentlyOpen = item.classList.contains('is-open');

      // Cerrar otros acordeones y alternar el actual
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        const otherTrigger = otherItem.querySelector('.faq-item__trigger');
        if (otherTrigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (!isCurrentlyOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     3. MODALES INTERACTIVOS (PLANIFICACIÓN / CONTACTO, SUBMENÚ E INFO)
     ========================================================================== */
  const modalPlanning = document.getElementById('modal-planning');
  const modalPlanningTitle = document.getElementById('modal-planning-title');
  const tabBtnPlan = document.getElementById('tab-btn-plan');
  const tabBtnQuestion = document.getElementById('tab-btn-question');

  const planModeContainer = document.getElementById('plan-mode-container');
  const questionModeContainer = document.getElementById('question-mode-container');
  const planningSuccess = document.getElementById('modal-planning-success');
  const successUserName = document.getElementById('success-user-name');
  const successUserEmail = document.getElementById('success-user-email');

  // Elementos del formulario oficial multipaso
  const officialPlanForm = document.getElementById('pmp-official-plan-form');
  const planStep1 = document.getElementById('plan-step-1');
  const planStep2 = document.getElementById('plan-step-2');
  const planStepIndicator = document.getElementById('plan-step-indicator');
  const planStepPercent = document.getElementById('plan-step-percent');
  const planProgressBar = document.getElementById('plan-progress-bar');
  const planFormError = document.getElementById('plan-form-error');
  const btnPlanNextStep = document.getElementById('btn-plan-next-step');
  const btnPlanPrevStep = document.getElementById('btn-plan-prev-step');
  const btnPlanSubmit = document.getElementById('btn-plan-submit');
  const planSubmitLabel = document.getElementById('plan-submit-label');

  // Campos del Paso 1
  const planFullName = document.getElementById('plan-fullName');
  const planPhone = document.getElementById('plan-phone');
  const planEmail = document.getElementById('plan-email');
  const planFieldDatesDetail = document.getElementById('plan-field-dates-detail');
  const planTravelDatesDetail = document.getElementById('plan-travelDatesDetail');
  const planAdultsCount = document.getElementById('plan-adultsCount');
  const planChildrenCount = document.getElementById('plan-childrenCount');
  const planBabiesCount = document.getElementById('plan-babiesCount');
  const planDepartureCity = document.getElementById('plan-departureCity');

  // Campos del Paso 2
  const planSpecialNotes = document.getElementById('plan-specialNotes');
  const planPrivacyConsent = document.getElementById('plan-privacyConsent');

  // Formulario secundario de preguntas / dudas
  const questionForm = document.getElementById('pmp-question-form');
  const questionFormError = document.getElementById('question-form-error');
  const questionName = document.getElementById('question-name');
  const questionEmail = document.getElementById('question-email');
  const questionPhone = document.getElementById('question-phone');
  const questionMessage = document.getElementById('question-message');
  const btnQuestionSubmit = document.getElementById('btn-question-submit');
  const questionSubmitLabel = document.getElementById('question-submit-label');

  const modalSubmenu = document.getElementById('modal-submenu');
  const submenuModalTitle = document.getElementById('submenu-modal-title');
  const submenuModalStrong = document.getElementById('submenu-modal-strong');
  const submenuBtnQuestion = document.getElementById('submenu-btn-question');
  const submenuBtnPlan = document.getElementById('submenu-btn-plan');

  const modalInfo = document.getElementById('modal-info');
  const infoModalSubtitle = document.getElementById('info-modal-subtitle');
  const infoModalTitle = document.getElementById('info-modal-title');
  const infoModalBody = document.getElementById('info-modal-body');
  const infoBtnPlan = document.getElementById('info-btn-plan');

  let currentMode = 'plan'; // 'plan' | 'question'
  let currentStep = 1;
  let currentSubmenuTopic = '';

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const closeAllModals = () => {
    [modalPlanning, modalSubmenu, modalInfo].forEach((m) => {
      if (m) m.classList.remove('is-open');
    });
  };

  const showPlanError = (msg, targetInput) => {
    if (!planFormError) return;
    planFormError.textContent = msg;
    planFormError.classList.add('is-visible');
    const modalBody = modalPlanning ? modalPlanning.querySelector('.modal-body') : null;
    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (targetInput && typeof targetInput.focus === 'function') {
      targetInput.focus();
    }
  };

  const clearPlanError = () => {
    if (planFormError) {
      planFormError.textContent = '';
      planFormError.classList.remove('is-visible');
    }
  };

  const goToPlanStep = (step) => {
    currentStep = step;
    clearPlanError();

    if (step === 1) {
      if (planStep1) planStep1.classList.add('is-active');
      if (planStep2) planStep2.classList.remove('is-active');
      if (planProgressBar) planProgressBar.style.width = '50%';
      if (planStepIndicator) planStepIndicator.textContent = 'Paso 1 de 2: Datos de contacto y viaje';
      if (planStepPercent) planStepPercent.textContent = 'Paso 1 de 2';
    } else {
      if (planStep2) planStep2.classList.add('is-active');
      if (planStep1) planStep1.classList.remove('is-active');
      if (planProgressBar) planProgressBar.style.width = '100%';
      if (planStepIndicator) planStepIndicator.textContent = 'Paso 2 de 2: Preferencias y necesidades';
      if (planStepPercent) planStepPercent.textContent = 'Paso 2 de 2';
    }

    const modalBody = modalPlanning ? modalPlanning.querySelector('.modal-body') : null;
    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setPlanningMode = (mode, preselectedTopic = '') => {
    currentMode = mode;
    clearPlanError();
    if (questionFormError) {
      questionFormError.textContent = '';
      questionFormError.classList.remove('is-visible');
    }

    if (planningSuccess) planningSuccess.style.display = 'none';

    const isPlan = mode === 'plan';

    if (modalPlanningTitle) {
      modalPlanningTitle.textContent = isPlan
        ? 'Quiero planificar mi viaje'
        : 'Pregunta cualquier duda';
    }

    if (tabBtnPlan && tabBtnQuestion) {
      tabBtnPlan.classList.toggle('is-active', isPlan);
      tabBtnQuestion.classList.toggle('is-active', !isPlan);
    }

    if (planModeContainer && questionModeContainer) {
      planModeContainer.style.display = isPlan ? 'block' : 'none';
      questionModeContainer.style.display = isPlan ? 'none' : 'block';
    }

    if (isPlan) {
      // Al abrir modo planificación, mostrar el paso actual conservando datos
      goToPlanStep(currentStep || 1);
    } else if (preselectedTopic && questionMessage) {
      questionMessage.value = `Consulta relacionada con: ${preselectedTopic}\n`;
    }
  };

  const openPlanningModal = (mode = 'plan', preselectedTopic = '') => {
    closeAllModals();
    setMobileMenu(false);
    setDesktopDropdown(false);
    setPlanningMode(mode, preselectedTopic);
    if (modalPlanning) {
      modalPlanning.classList.add('is-open');
    }
  };

  const openSubmenuModal = (topicLabel) => {
    closeAllModals();
    setMobileMenu(false);
    setDesktopDropdown(false);
    currentSubmenuTopic = topicLabel;
    if (submenuModalTitle) submenuModalTitle.textContent = topicLabel;
    if (submenuModalStrong) submenuModalStrong.textContent = `“${topicLabel}”`;
    if (modalSubmenu) {
      modalSubmenu.classList.add('is-open');
    }
  };

  const openInfoModal = (title, subtitle, body) => {
    closeAllModals();
    setMobileMenu(false);
    setDesktopDropdown(false);
    if (infoModalTitle) infoModalTitle.textContent = title;
    if (infoModalSubtitle) infoModalSubtitle.textContent = subtitle || '';
    if (infoModalBody) infoModalBody.textContent = body;
    if (modalInfo) {
      modalInfo.classList.add('is-open');
    }
  };

  // Botones que abren el modal de Planificación o Dudas
  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = trigger.getAttribute('data-open-modal') || 'plan';
      openPlanningModal(mode);
    });
  });

  // Pestañas dentro del modal de Planificación / Dudas
  if (tabBtnPlan) {
    tabBtnPlan.addEventListener('click', () => setPlanningMode('plan'));
  }
  if (tabBtnQuestion) {
    tabBtnQuestion.addEventListener('click', () => setPlanningMode('question'));
  }

  // Enlaces del submenú Disneyland Paris (Header, Móvil y Footer)
  document.querySelectorAll('[data-submenu-topic]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = item.getAttribute('data-submenu-topic') || '';
      openSubmenuModal(topic);
    });
  });

  if (submenuBtnQuestion) {
    submenuBtnQuestion.addEventListener('click', () => {
      openPlanningModal('question', currentSubmenuTopic);
    });
  }

  if (submenuBtnPlan) {
    submenuBtnPlan.addEventListener('click', () => {
      openPlanningModal('plan', currentSubmenuTopic);
    });
  }

  // Artículos del Blog
  document.querySelectorAll('[data-blog-article]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-blog-title') || '';
      const meta = btn.getAttribute('data-blog-meta') || '';
      const excerpt = btn.getAttribute('data-blog-excerpt') || '';
      openInfoModal(
        title,
        meta,
        `${excerpt} [Vista previa del artículo del blog preparada para conectarse con el CMS de Paris Magic Plan.]`
      );
    });
  });

  // Enlaces Legales del Footer y Casilla de Consentimiento
  document.querySelectorAll('[data-legal-link]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const legalId = btn.getAttribute('data-legal-id') || '';
      const label = btn.getAttribute('data-legal-label') || '';
      openInfoModal(
        label,
        'Información legal · Paris Magic Plan',
        `[Espacio reservado para el documento oficial de "${label}" (${legalId}). Pendiente de incorporar los textos legales definitivos proporcionados por el cliente o la URL oficial correspondiente.]`
      );
    });
  });

  if (infoBtnPlan) {
    infoBtnPlan.addEventListener('click', () => {
      openPlanningModal('plan');
    });
  }

  // Cerrar modales con botón X, botón Cancelar o clic en el fondo oscuro
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeAllModals());
  });

  [modalPlanning, modalSubmenu, modalInfo].forEach((backdrop) => {
    if (!backdrop) return;
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      setDesktopDropdown(false);
      setMobileMenu(false);
    }
  });

  /* ==========================================================================
     4. CONTROL DINÁMICO, VALIDACIÓN Y ENVÍO DEL FORMULARIO MULTIPASO
     ========================================================================== */

  // Campo condicional: Fecha o época en mente
  if (officialPlanForm) {
    const datesRadios = officialPlanForm.querySelectorAll('input[name="travelDatesOption"]');
    datesRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (!planFieldDatesDetail) return;
        const val = radio.value;
        if (
          val === 'Tenemos fechas concretas.' ||
          val === 'Tenemos un mes o época aproximada.'
        ) {
          planFieldDatesDetail.style.display = 'block';
        } else {
          planFieldDatesDetail.style.display = 'none';
          if (planTravelDatesDetail) planTravelDatesDetail.value = '';
        }
      });
    });
  }

  // Botón Continuar (Paso 1 -> Paso 2) con validación estricta
  if (btnPlanNextStep && officialPlanForm) {
    btnPlanNextStep.addEventListener('click', () => {
      clearPlanError();

      const fullNameVal = planFullName ? planFullName.value.trim() : '';
      const phoneVal = planPhone ? planPhone.value.trim() : '';
      const emailVal = planEmail ? planEmail.value.trim() : '';

      if (!fullNameVal) {
        showPlanError('Por favor, indica tu nombre y apellidos.', planFullName);
        return;
      }

      if (!phoneVal) {
        showPlanError('Por favor, introduce tu teléfono o WhatsApp.', planPhone);
        return;
      }

      if (!emailVal || !validateEmail(emailVal)) {
        showPlanError('Por favor, introduce un correo electrónico válido.', planEmail);
        return;
      }

      const selectedDateOption = officialPlanForm.querySelector('input[name="travelDatesOption"]:checked');
      if (!selectedDateOption) {
        showPlanError('Por favor, indica cuándo os gustaría viajar (Pregunta 4).');
        return;
      }

      const adultsVal = planAdultsCount ? parseInt(planAdultsCount.value, 10) : 0;
      if (isNaN(adultsVal) || adultsVal < 1) {
        showPlanError('Debe haber al menos 1 adulto en el viaje.', planAdultsCount);
        return;
      }

      const selectedDays = officialPlanForm.querySelector('input[name="disneyDays"]:checked');
      if (!selectedDays) {
        showPlanError('Por favor, selecciona cuántos días queréis dedicar a Disneyland Paris (Pregunta 7).');
        return;
      }

      // Si todo el Paso 1 es correcto, avanzamos al Paso 2 conservando todos los datos
      goToPlanStep(2);
    });
  }

  // Botón Volver (Paso 2 -> Paso 1)
  if (btnPlanPrevStep) {
    btnPlanPrevStep.addEventListener('click', () => {
      goToPlanStep(1);
    });
  }

  // Envío del Formulario Oficial de Planificación (Paso 2)
  if (officialPlanForm) {
    officialPlanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearPlanError();

      // Validaciones del Paso 2
      const selectedBudget = officialPlanForm.querySelector('input[name="budgetOption"]:checked');
      if (!selectedBudget) {
        showPlanError('Por favor, selecciona un presupuesto aproximado para el viaje completo (Pregunta 9).');
        return;
      }

      const selectedStage = officialPlanForm.querySelector('input[name="stageOption"]:checked');
      if (!selectedStage) {
        showPlanError('Por favor, indica en qué punto estáis con vuestro viaje a Disneyland Paris (Pregunta 10).');
        return;
      }

      const selectedFlights = officialPlanForm.querySelector('input[name="flightsOption"]:checked');
      if (!selectedFlights) {
        showPlanError('Por favor, indica si queréis que os gestionemos los vuelos (Pregunta 12).');
        return;
      }

      const selectedTransfers = officialPlanForm.querySelector('input[name="transfersOption"]:checked');
      if (!selectedTransfers) {
        showPlanError('Por favor, indica si queréis que os gestionemos los traslados (Pregunta 13).');
        return;
      }

      const selectedVisited = officialPlanForm.querySelector('input[name="visitedBefore"]:checked');
      if (!selectedVisited) {
        showPlanError('Por favor, indica si habéis visitado Disneyland Paris anteriormente (Pregunta 14).');
        return;
      }

      if (!planPrivacyConsent || !planPrivacyConsent.checked) {
        showPlanError('Debes aceptar la política de privacidad para autorizar el contacto y enviar tu solicitud.', planPrivacyConsent);
        return;
      }

      // Recopilar selección múltiple de preocupaciones
      const checkedConcerns = Array.from(
        officialPlanForm.querySelectorAll('input[name="concerns"]:checked')
      ).map((chk) => chk.value);

      const payload = {
        fullName: planFullName ? planFullName.value.trim() : '',
        phone: planPhone ? planPhone.value.trim() : '',
        email: planEmail ? planEmail.value.trim() : '',
        travelDatesOption: officialPlanForm.querySelector('input[name="travelDatesOption"]:checked')?.value || '',
        travelDatesDetail: planTravelDatesDetail ? planTravelDatesDetail.value.trim() : '',
        adultsCount: planAdultsCount ? planAdultsCount.value : '2',
        childrenCount: planChildrenCount ? planChildrenCount.value : '0',
        babiesCount: planBabiesCount ? planBabiesCount.value : '0',
        disneyDays: officialPlanForm.querySelector('input[name="disneyDays"]:checked')?.value || '',
        departureCity: planDepartureCity ? planDepartureCity.value.trim() : '',
        budgetOption: selectedBudget.value,
        stageOption: selectedStage.value,
        concerns: checkedConcerns,
        flightsOption: selectedFlights.value,
        transfersOption: selectedTransfers.value,
        visitedBefore: selectedVisited.value,
        specialNotes: planSpecialNotes ? planSpecialNotes.value.trim() : '',
        privacyConsent: true,
      };

      // Estado de envío en botón para evitar envíos duplicados
      if (btnPlanSubmit) btnPlanSubmit.disabled = true;
      if (planSubmitLabel) planSubmitLabel.textContent = 'Enviando solicitud...';

      try {
        let planEndpoint = '/api/plan';
        let response = await fetch(planEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        let rawText = '';
        try {
          rawText = await response.text();
        } catch (e) {
          console.warn('Error leyendo respuesta de /api/plan:', e);
        }

        let data = {};
        let isJson = false;
        if (rawText && rawText.trim()) {
          try {
            data = JSON.parse(rawText);
            isJson = true;
          } catch {
            isJson = false;
          }
        }

        // Si /api/plan devuelve 404 o 405 (o no-JSON), probar fallback a /api/plan.js
        if (!isJson && (response.status === 404 || response.status === 405)) {
          try {
            const fallbackResp = await fetch('/api/plan.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify(payload),
            });
            const fallbackText = await fallbackResp.text();
            try {
              data = JSON.parse(fallbackText);
              response = fallbackResp;
              isJson = true;
            } catch {}
          } catch {}
        }

        if (!response.ok || !data.success) {
          const errText = data.error || (isJson ? 'No se pudo registrar la solicitud.' : `Error del servidor (${response.status}). Por favor, contáctanos.`);
          showPlanError(`Error: ${errText}`);
          return;
        }

        // Mostrar confirmación de éxito
        if (successUserName) successUserName.textContent = payload.fullName;
        if (successUserEmail) successUserEmail.textContent = payload.email;

        if (planModeContainer) planModeContainer.style.display = 'none';
        if (planningSuccess) planningSuccess.style.display = 'block';

        const modalBody = modalPlanning ? modalPlanning.querySelector('.modal-body') : null;
        if (modalBody) {
          modalBody.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Reiniciar estado del formulario para próximas aperturas
        officialPlanForm.reset();
        if (planFieldDatesDetail) planFieldDatesDetail.style.display = 'none';
        currentStep = 1;
      } catch (err) {
        console.error('Error de red al enviar formulario a /api/plan:', err);
        showPlanError(
          'No se pudo conectar con el servidor de Paris Magic Plan. Por favor, comprueba tu conexión a internet o contáctanos por WhatsApp.'
        );
      } finally {
        if (btnPlanSubmit) btnPlanSubmit.disabled = false;
        if (planSubmitLabel) planSubmitLabel.textContent = 'Enviar solicitud';
      }
    });
  }

  // Formulario secundario para preguntas y dudas
  if (questionForm) {
    questionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (questionFormError) {
        questionFormError.classList.remove('is-visible');
        questionFormError.textContent = '';
      }

      const qNameVal = questionName ? questionName.value.trim() : '';
      const qEmailVal = questionEmail ? questionEmail.value.trim() : '';
      const qPhoneVal = questionPhone ? questionPhone.value.trim() : '';
      const qMsgVal = questionMessage ? questionMessage.value.trim() : '';

      if (!qNameVal) {
        if (questionFormError) {
          questionFormError.textContent = 'Por favor, introduce tu nombre y apellidos.';
          questionFormError.classList.add('is-visible');
        }
        return;
      }

      if (!qEmailVal || !validateEmail(qEmailVal)) {
        if (questionFormError) {
          questionFormError.textContent = 'Por favor, introduce un correo electrónico válido.';
          questionFormError.classList.add('is-visible');
        }
        return;
      }

      if (!qMsgVal) {
        if (questionFormError) {
          questionFormError.textContent = 'Por favor, escribe tu duda o consulta.';
          questionFormError.classList.add('is-visible');
        }
        return;
      }

      if (btnQuestionSubmit) btnQuestionSubmit.disabled = true;
      if (questionSubmitLabel) questionSubmitLabel.textContent = 'Enviando...';

      try {
        const payload = {
          fullName: qNameVal,
          phone: qPhoneVal || 'No facilitado',
          email: qEmailVal,
          travelDatesOption: 'Consulta de dudas',
          travelDatesDetail: '',
          adultsCount: 1,
          childrenCount: 0,
          babiesCount: 0,
          disneyDays: 'Consulta puntual',
          departureCity: '',
          budgetOption: 'Consulta previa',
          stageOption: 'Consulta de información',
          concerns: [],
          flightsOption: 'No aplica',
          transfersOption: 'No aplica',
          visitedBefore: 'No aplica',
          specialNotes: qMsgVal,
          privacyConsent: true,
        };

        const response = await fetch('/api/plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          if (questionFormError) {
            questionFormError.textContent = data.error || 'No se pudo enviar la consulta. Inténtalo de nuevo.';
            questionFormError.classList.add('is-visible');
          }
          return;
        }

        if (successUserName) successUserName.textContent = qNameVal;
        if (successUserEmail) successUserEmail.textContent = qEmailVal;

        if (questionModeContainer) questionModeContainer.style.display = 'none';
        if (planningSuccess) planningSuccess.style.display = 'block';

        questionForm.reset();
      } catch (err) {
        console.error('Error al enviar consulta:', err);
        if (questionFormError) {
          questionFormError.textContent = 'Error de conexión. Inténtalo de nuevo o contáctanos directamente.';
          questionFormError.classList.add('is-visible');
        }
      } finally {
        if (btnQuestionSubmit) btnQuestionSubmit.disabled = false;
        if (questionSubmitLabel) questionSubmitLabel.textContent = 'Enviar consulta';
      }
    });
  }

  /* ==========================================================================
     5. ANIMACIONES SUAVES AL HACER SCROLL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     6. ASISTENTE VIRTUAL IA (CHAT FLOTANTE PARIS MAGIC PLAN)
     ========================================================================== */
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatResetBtn = document.getElementById('chat-reset-btn');
  const chatCloseBtn = document.getElementById('chat-close-btn');

  if (chatResetBtn) {
    chatResetBtn.addEventListener('click', () => {
      chatHistory.length = 0;
      if (chatAlertBanner) chatAlertBanner.style.display = 'none';
      if (chatMessages) {
        chatMessages.innerHTML = `
          <div class="chat-msg chat-msg--assistant">
            <div class="chat-msg__avatar">
              <img src="assets/images/marca-grafica-pmp-simbolo-01.svg" alt="" aria-hidden="true" />
            </div>
            <div class="chat-msg__bubble">
              <p>¡Hola! ✨ Te doy la bienvenida a <strong>Paris Magic Plan</strong>.</p>
              <p>Estoy aquí para guiarte y responder todas las dudas que tengas sobre la web o tu viaje a Disneyland Paris. ¿En qué puedo ayudarte hoy?</p>
            </div>
          </div>
        `;
      }
      if (chatInput) {
        chatInput.value = '';
        chatInput.style.height = 'auto';
        chatInput.focus();
      }
      if (chatCharCounter) {
        chatCharCounter.textContent = '0/1000';
      }
    });
  }
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatTyping = document.getElementById('chat-typing-indicator');
  const chatAlertBanner = document.getElementById('chat-alert-banner');
  const chatAlertMessage = document.getElementById('chat-alert-message');
  const chatSuggestions = document.getElementById('chat-suggestions');
  const chatCharCounter = document.getElementById('chat-char-counter');
  const iconChatOpen = document.querySelector('.chat-toggle-btn__icon--open');
  const iconChatClose = document.querySelector('.chat-toggle-btn__icon--close');

  // Historial seguro en memoria de la sesión
  const chatHistory = [];
  let isChatBusy = false;

  const scrollChatToBottom = () => {
    if (!chatMessages) return;
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  };

  const setChatWindowOpen = (open) => {
    if (!chatWindow || !chatToggleBtn) return;
    chatWindow.classList.toggle('is-open', open);
    chatToggleBtn.setAttribute('aria-expanded', String(open));
    chatToggleBtn.setAttribute(
      'aria-label',
      open ? 'Cerrar asistente virtual' : 'Abrir asistente virtual de Paris Magic Plan'
    );

    if (iconChatOpen && iconChatClose) {
      iconChatOpen.style.display = open ? 'none' : 'block';
      iconChatClose.style.display = open ? 'block' : 'none';
    }

    if (open) {
      scrollChatToBottom();
      if (chatInput && window.innerWidth > 640) {
        setTimeout(() => chatInput.focus(), 200);
      }
    }
  };

  if (chatToggleBtn) {
    chatToggleBtn.addEventListener('click', () => {
      const isOpen = chatWindow && chatWindow.classList.contains('is-open');
      setChatWindowOpen(!isOpen);
    });
  }

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      setChatWindowOpen(false);
    });
  }

  // Enlazar todos los botones con data-open-chat (Hero, menú móvil/tablet, etc.)
  document.querySelectorAll('[data-open-chat]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setChatWindowOpen(true);
    });
  });

  // Sanitizador y formateador ligero de Markdown seguro
  const escapeHTML = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const formatBotMarkdown = (markdown) => {
    let clean = escapeHTML(markdown);

    // Negritas: **texto**
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Cursivas: *texto* o _texto_
    clean = clean.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');

    const lines = clean.split('\n');
    let inUl = false;
    let inOl = false;
    let html = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const bulletMatch = line.match(/^[\*\-]\s+(.*)$/);
      const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
      const headerMatch = line.match(/^#{1,4}\s+(.*)$/);

      if (headerMatch) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        html += `<h4 class="chat-msg__heading" style="margin: 10px 0 4px; font-size: 0.95rem; font-weight: 700; color: #1e1b4b;">${headerMatch[1]}</h4>`;
      } else if (bulletMatch) {
        if (inOl) { html += '</ol>'; inOl = false; }
        if (!inUl) { html += '<ul>'; inUl = true; }
        html += `<li>${bulletMatch[1]}</li>`;
      } else if (numberMatch) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (!inOl) { html += '<ol style="padding-left: 20px; margin: 6px 0;">'; inOl = true; }
        html += `<li style="margin-bottom: 4px;">${numberMatch[2]}</li>`;
      } else {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        if (line.length > 0) {
          html += `<p>${line}</p>`;
        }
      }
    }
    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';

    // Detección de botones de acción recomendados
    const lower = markdown.toLowerCase();
    let actionButtons = '';
    if (lower.includes('planificar') || lower.includes('presupuesto') || lower.includes('propuesta')) {
      actionButtons += `<button type="button" class="chat-msg__action-btn" data-chat-modal="plan">Quiero planificar mi viaje</button> `;
    }
    if (lower.includes('duda') || lower.includes('contacto') || lower.includes('equipo')) {
      actionButtons += `<button type="button" class="chat-msg__action-btn" data-chat-modal="question">Pregunta cualquier duda</button>`;
    }

    if (actionButtons) {
      html += `<div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px;">${actionButtons}</div>`;
    }

    return html || `<p>${clean}</p>`;
  };

  const appendChatMessage = (role, rawText) => {
    if (!chatMessages) return;

    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg chat-msg--${role}`;

    if (role === 'assistant') {
      msgEl.innerHTML = `
        <div class="chat-msg__avatar">
          <img src="assets/images/marca-grafica-pmp-simbolo-01.svg" alt="" aria-hidden="true" />
        </div>
        <div class="chat-msg__bubble">
          ${formatBotMarkdown(rawText)}
        </div>
      `;

      // Enlazar los botones de acción rápida dentro de la burbuja
      msgEl.querySelectorAll('[data-chat-modal]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const mode = btn.getAttribute('data-chat-modal') || 'plan';
          setChatWindowOpen(false);
          openPlanningModal(mode);
        });
      });
    } else {
      msgEl.innerHTML = `
        <div class="chat-msg__bubble">
          <p>${escapeHTML(rawText)}</p>
        </div>
      `;
    }

    chatMessages.appendChild(msgEl);
    scrollChatToBottom();
  };

  const sendChatMessage = async (userMessage) => {
    const text = (userMessage || '').trim();
    if (!text || isChatBusy) return;

    // Validación de longitud
    if (text.length > 1000) {
      if (chatAlertBanner && chatAlertMessage) {
        chatAlertMessage.textContent = 'El mensaje no puede superar los 1000 caracteres.';
        chatAlertBanner.style.display = 'flex';
      }
      return;
    }

    // Ocultar alertas previas
    if (chatAlertBanner) {
      chatAlertBanner.style.display = 'none';
    }

    // Limpiar campo de texto y reiniciar altura
    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }
    if (chatCharCounter) {
      chatCharCounter.textContent = '0/1000';
    }

    // Añadir mensaje del usuario en la interfaz y en el historial
    appendChatMessage('user', text);
    chatHistory.push({ role: 'user', text });

    // Estado ocupado y mostrar indicador de escribiendo
    isChatBusy = true;
    if (chatSendBtn) chatSendBtn.disabled = true;
    if (chatTyping) chatTyping.style.display = 'flex';
    scrollChatToBottom();

    try {
      const payload = JSON.stringify({
        message: text,
        history: chatHistory.slice(-8), // Enviar máximo los últimos 8 mensajes
      });

      // Intento principal: /api/chat
      let endpointUsed = '/api/chat';
      let response = await fetch(endpointUsed, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: payload,
      });

      let rawText = '';
      try {
        rawText = await response.text();
      } catch (readErr) {
        console.warn('No se pudo leer la respuesta de', endpointUsed, readErr);
      }

      let data = {};
      let isJson = false;
      if (rawText && rawText.trim()) {
        try {
          data = JSON.parse(rawText);
          isJson = true;
        } catch {
          isJson = false;
        }
      }

      // Si /api/chat devolvió 404 o 405 (o contenido HTML no JSON), probar fallback a /api/chat.js
      if ((!isJson || response.status === 404 || response.status === 405) && endpointUsed === '/api/chat') {
        console.warn(`[Chat] ${endpointUsed} devolvió status ${response.status} (no JSON). Probando fallback a /api/chat.js...`);
        try {
          const fallbackResponse = await fetch('/api/chat.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: payload,
          });

          const fallbackText = await fallbackResponse.text();
          try {
            const fallbackData = JSON.parse(fallbackText);
            response = fallbackResponse;
            data = fallbackData;
            rawText = fallbackText;
            isJson = true;
            endpointUsed = '/api/chat.js';
          } catch {
            // El fallback tampoco devolvió JSON
          }
        } catch (fallbackErr) {
          console.warn('[Chat] Fallback a /api/chat.js falló:', fallbackErr);
        }
      }

      // Si la respuesta definitiva sigue sin ser JSON
      if (!isJson) {
        console.error(`[Chat Error] El endpoint ${endpointUsed} devolvió status ${response.status} sin formato JSON:`, rawText.slice(0, 200));

        let diagnosticDetail = '';
        if (response.status === 405) {
          diagnosticDetail = 'Error 405 (Método no permitido): La ruta fue interceptada por el servidor estático en lugar de ejecutar la función serverless de Vercel. Despliega con el nuevo vercel.json sin reescrituras estáticas.';
        } else if (response.status === 404) {
          diagnosticDetail = 'Error 404 (No encontrado): La función de servidor no fue encontrada en /api/chat en Vercel.';
        } else if (response.status === 504 || response.status === 502) {
          diagnosticDetail = `Error ${response.status}: Tiempo de espera agotado en la función serverless de Vercel.`;
        } else {
          diagnosticDetail = `El servidor devolvió una respuesta HTTP ${response.status} con formato no compatible.`;
        }

        if (chatAlertBanner && chatAlertMessage) {
          chatAlertMessage.textContent = diagnosticDetail;
          chatAlertBanner.style.display = 'flex';
        }

        appendChatMessage(
          'assistant',
          `⚠️ **Error de comunicación con el servidor**: ${diagnosticDetail}\n\nRevisa la configuración de Vercel y asegúrate de que la variable \`GEMINI_API_KEY\` esté configurada en \`Project Settings > Environment Variables\`.`
        );
        return;
      }

      if (!response.ok) {
        // Manejar caso específico de API Key no configurada o error del backend
        if (data.configured === false || data.code === 'MISSING_API_KEY') {
          if (chatAlertBanner && chatAlertMessage) {
            chatAlertMessage.textContent = 'Clave GEMINI_API_KEY pendiente de configurar en Vercel.';
            chatAlertBanner.style.display = 'flex';
          }
          appendChatMessage(
            'assistant',
            '⚠️ **Aviso de configuración**: La variable de entorno `GEMINI_API_KEY` aún no está configurada en el servidor de Vercel.\n\nPara activar las respuestas automáticas de Google Gemini en tiempo real, añade tu clave en el panel de **Vercel** (`Settings > Environment Variables`).\n\nMientras tanto, puedes consultar las opciones oficiales directamente o solicitar tu presupuesto personalizado con nuestros Travel Planners:'
          );
          return;
        }

        if (response.status === 401 || data.code === 'INVALID_API_KEY') {
          if (chatAlertBanner && chatAlertMessage) {
            chatAlertMessage.textContent = 'Clave GEMINI_API_KEY no válida o caducada.';
            chatAlertBanner.style.display = 'flex';
          }
          appendChatMessage(
            'assistant',
            '🔑 **Clave no válida**: La clave `GEMINI_API_KEY` configurada en el servidor no es válida o ha caducado. Por favor, actualízala en el panel de Vercel (`Settings > Environment Variables`).'
          );
          return;
        }

        if (response.status === 429 || data.code === 'QUOTA_EXCEEDED') {
          appendChatMessage(
            'assistant',
            '⏳ **Límite temporal alcanzado**: Se ha alcanzado temporalmente la cuota de consultas de la API de Gemini. Por favor, espera unos instantes o consulta directamente con el equipo de Paris Magic Plan.'
          );
          return;
        }

        const errorMsg = data.error || 'No se pudo obtener respuesta del asistente en este momento.';
        appendChatMessage('assistant', `Disculpa, ha ocurrido un problema al consultar: ${errorMsg}\n\nPuedes pulsar en **"Pregunta cualquier duda"** para que nuestro equipo te atienda directamente.`);
        return;
      }

      if (data.reply && data.reply.trim()) {
        appendChatMessage('assistant', data.reply);
        chatHistory.push({ role: 'model', text: data.reply });
      } else {
        appendChatMessage(
          'assistant',
          'Disculpa, el asistente no ha generado una respuesta de texto. Por favor, formula tu pregunta de nuevo o consulta con nuestro equipo.'
        );
      }
    } catch (err) {
      console.error('Error de red al conectar con /api/chat:', err);
      appendChatMessage(
        'assistant',
        'No se ha podido conectar con el servidor del asistente. Por favor, comprueba tu conexión a internet o utiliza el formulario de contacto de la página.'
      );
    } finally {
      isChatBusy = false;
      if (chatSendBtn) chatSendBtn.disabled = false;
      if (chatTyping) chatTyping.style.display = 'none';
      scrollChatToBottom();
    }
  };

  // Manejo del formulario de envío
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (chatInput) {
        sendChatMessage(chatInput.value);
      }
    });
  }

  // Enviar con Enter (y salto de línea con Shift+Enter)
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage(chatInput.value);
      }
    });

    chatInput.addEventListener('input', () => {
      // Ajuste automático de altura
      chatInput.style.height = 'auto';
      chatInput.style.height = `${Math.min(chatInput.scrollHeight, 90)}px`;

      // Contador de caracteres
      if (chatCharCounter) {
        const count = chatInput.value.length;
        chatCharCounter.textContent = `${count}/1000`;
        chatCharCounter.style.color = count > 950 ? '#dc2626' : 'rgba(35, 57, 117, 0.6)';
      }
    });
  }

  // Manejo de chips de preguntas frecuentes sugeridas (con delegación de eventos)
  if (chatMessages) {
    chatMessages.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip');
      if (chip) {
        e.preventDefault();
        const question = chip.getAttribute('data-question') || chip.textContent.trim();
        sendChatMessage(question);
      }
    });
  }

  document.querySelectorAll('.chat-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const question = chip.getAttribute('data-question') || chip.textContent.trim();
      sendChatMessage(question);
    });
  });
});

