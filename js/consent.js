/**
 * FlexiCredit — Bannière de consentement RGPD
 * Consent Mode v2 — simulation conforme
 */

(function() {
  const CONSENT_KEY = 'fc_consent_choice';

  function hasConsented() {
    return localStorage.getItem(CONSENT_KEY) !== null;
  }

  function renderBanner() {
    if (hasConsented()) return;

    trackConsentDisplayed();

    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.innerHTML = `
      <div class="consent-inner">
        <div class="consent-text">
          <strong>🍪 Cookies & données analytiques</strong>
          <p>Nous utilisons des cookies pour mesurer la performance de notre service et améliorer votre expérience. Aucune donnée n'est transmise à des tiers à des fins publicitaires.</p>
        </div>
        <div class="consent-actions">
          <button class="btn btn-outline" id="consent-refuse">Refuser</button>
          <button class="btn btn-primary" id="consent-accept">Accepter</button>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #consent-banner {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 999;
        background: #fff; border-top: 1px solid #D8E3EC;
        box-shadow: 0 -4px 24px rgba(10,31,60,.12);
        padding: 16px 0;
        animation: slideUp .3s ease both;
      }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      .consent-inner {
        max-width: 1100px; margin: 0 auto; padding: 0 24px;
        display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
      }
      .consent-text { flex: 1; min-width: 260px; }
      .consent-text strong { font-size: .9rem; color: #0A1F3C; }
      .consent-text p { font-size: .8rem; color: #7A8899; margin-top: 4px; }
      .consent-actions { display: flex; gap: 10px; flex-shrink: 0; }
      .consent-actions .btn { padding: 10px 20px; font-size: .875rem; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById('consent-accept').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      trackConsentAccepted();
      banner.style.animation = 'slideUp .25s ease reverse both';
      setTimeout(() => banner.remove(), 250);
    });

    document.getElementById('consent-refuse').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'refused');
      trackConsentRefused();
      banner.style.animation = 'slideUp .25s ease reverse both';
      setTimeout(() => banner.remove(), 250);
    });
  }

  // Déclenche après 800ms pour laisser le temps à la page de charger
  window.addEventListener('load', () => setTimeout(renderBanner, 800));
})();
