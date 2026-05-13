/**
 * FlexiCredit — DataLayer & Tracking
 * Simule une implémentation GTM/GA4 professionnelle
 * Tous les événements sont documentés dans le plan de taggage
 */

window.dataLayer = window.dataLayer || [];

// ── Utilitaires ──────────────────────────────────────────────────
const FC = {

  // Push un événement dans le dataLayer (capturé par GTM)
  push(event, params = {}) {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      ...params
    };
    window.dataLayer.push(payload);
    // Console log coloré pour la démo / DebugView simulé
    console.log('%c[DataLayer]', 'color:#00843D;font-weight:bold', event, payload);
  },

  // Lit le device type
  getDevice() {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  },

  // Lit les paramètres de simulation stockés en session
  getSimulation() {
    try {
      return JSON.parse(sessionStorage.getItem('fc_simulation') || '{}');
    } catch { return {}; }
  },

  // Sauvegarde les paramètres de simulation
  saveSimulation(data) {
    sessionStorage.setItem('fc_simulation', JSON.stringify(data));
  }
};

// ── Events communs ───────────────────────────────────────────────

// 1. PAGE VIEW — déclenché au chargement de chaque page
function trackPageView(stepName, stepNumber) {
  const sim = FC.getSimulation();
  FC.push('page_view', {
    page_step: stepName,
    step_number: stepNumber,
    device_type: FC.getDevice(),
    loan_amount: sim.amount || null,
    loan_duration: sim.duration || null,
    page_location: window.location.href,
    page_title: document.title
  });
}

// 2. CTA CLICK — clic sur un bouton d'appel à l'action
function trackCtaClick(label, destination) {
  FC.push('cta_click', {
    event_category: 'engagement',
    cta_label: label,
    cta_destination: destination,
    page_step: document.body.dataset.step || 'unknown',
    device_type: FC.getDevice()
  });
}

// 3. SCROLL DEPTH — profondeur de lecture
function initScrollTracking(stepName) {
  const milestones = [25, 50, 75, 90];
  const fired = new Set();
  window.addEventListener('scroll', () => {
    const scrolled = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    milestones.forEach(m => {
      if (scrolled >= m && !fired.has(m)) {
        fired.add(m);
        FC.push('scroll_depth', {
          event_category: 'engagement',
          scroll_percent: m,
          page_step: stepName,
          device_type: FC.getDevice()
        });
      }
    });
  }, { passive: true });
}

// 4. FUNNEL EXIT — tentative de quitter la page en cours de funnel
function initExitTracking(stepName, stepNumber) {
  // Seulement sur les étapes intermédiaires (pas landing, pas confirmation)
  if (stepNumber < 2 || stepNumber >= 5) return;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const sim = FC.getSimulation();
      FC.push('funnel_exit', {
        event_category: 'abandonment',
        exit_step: stepName,
        exit_step_number: stepNumber,
        loan_amount: sim.amount || null,
        loan_duration: sim.duration || null,
        device_type: FC.getDevice()
      });
    }
  });
}

// 5. SIMULATION CHANGED — utilisateur modifie les sliders
function trackSimulationChange(amount, duration) {
  FC.push('simulation_changed', {
    event_category: 'engagement',
    loan_amount: amount,
    loan_duration: duration,
    device_type: FC.getDevice()
  });
  FC.saveSimulation({ amount, duration });
}

// 6. FORM FIELD FOCUS
function trackFieldFocus(fieldName) {
  FC.push('form_field_focus', {
    event_category: 'form_interaction',
    field_name: fieldName,
    page_step: 'formulaire'
  });
}

// 7. FORM FIELD ERROR
function trackFieldError(fieldName, errorType) {
  FC.push('form_field_error', {
    event_category: 'form_interaction',
    field_name: fieldName,
    error_type: errorType,
    page_step: 'formulaire',
    device_type: FC.getDevice()
  });
}

// 8. FORM FIELD COMPLETE
function trackFieldComplete(fieldName) {
  FC.push('form_field_complete', {
    event_category: 'form_interaction',
    field_name: fieldName,
    page_step: 'formulaire'
  });
}

// 9. FORM SUBMIT ATTEMPT
function trackFormSubmitAttempt() {
  const sim = FC.getSimulation();
  FC.push('form_submit_attempt', {
    event_category: 'conversion',
    loan_amount: sim.amount || null,
    loan_duration: sim.duration || null,
    device_type: FC.getDevice()
  });
}

// 10. FORM SUBMIT SUCCESS — LA CONVERSION
function trackFormSubmitSuccess(formData) {
  const sim = FC.getSimulation();
  FC.push('form_submit_success', {
    event_category: 'conversion',
    event_label: 'demande_credit_complete',
    loan_amount: sim.amount || null,
    loan_duration: sim.duration || null,
    device_type: FC.getDevice(),
    // On ne push JAMAIS de données personnelles dans le dataLayer
  });
}

// 11. CONSENT EVENTS
function trackConsentDisplayed() {
  FC.push('consent_banner_displayed', {
    event_category: 'privacy'
  });
}
function trackConsentAccepted() {
  FC.push('consent_accepted', {
    event_category: 'privacy',
    consent_analytics: 'granted',
    consent_ads: 'denied'
  });
  // Consent Mode v2 — mise à jour des états Google
  FC.push('consent', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
}
function trackConsentRefused() {
  FC.push('consent_refused', {
    event_category: 'privacy',
    consent_analytics: 'denied'
  });
  FC.push('consent', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
}
