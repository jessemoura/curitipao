document.addEventListener('DOMContentLoaded', () => {
  // 1. LIGHTBOX
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  const img = document.createElement('img');
  lightbox.appendChild(img);
  document.body.appendChild(lightbox);

  document.querySelectorAll('.photos img').forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
      img.src = e.target.src;
      img.alt = e.target.alt;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };

  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });

  // ----------------------------------------------------
  // RASTREAMENTO GA4 (CURITIPÃO 2026)
  // ----------------------------------------------------
  const BAKERY_SLUG_MAP = {
    'AQUARIUS PANIFICADORA': 'aquarius',
    'AQUI NA MATA': 'aqui-na-mata',
    'BONIN BAKERY': 'bonin-bakery',
    'CONFRARIA DOS PÃES': 'confraria-dos-paes',
    'FABIANO MARCOLINI ALIMENTARI': 'fabiano-marcolini',
    'FÁBRIKA PÃES': 'fabrika-paes',
    'FELIPANE': 'felipane',
    'HAIAT ATELIÊ DO PÃO': 'haiat-atelie',
    'MAÇÃ ORGÂNICA PADARIA': 'maca-organica',
    'PADARIA AMÉRICA': 'padaria-america',
    'PADARIA FAMÍLIA FARINHA': 'padaria-familia-farinha',
    'PADARIA REQUINTE': 'padaria-requinte',
    'PIEGEL PÃES': 'piegel-paes',
    'SAINT GERMAIN PANIFICADORA': 'saint-germain',
    'SPHAIR ATELIÊ DE PÃES': 'sphair-atelie'
  };

  const isDebugMode = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has('debug_mode') || params.has('debug') || localStorage.getItem('ga_debug') === 'true';
    } catch {
      return false;
    }
  })();

  function trackEvent(eventName, params) {
    const payload = { ...params };
    if (isDebugMode) {
      payload.debug_mode = true;
      console.log(`[GA4 Event] ${eventName}:`, payload);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(['event', eventName, payload]);
    }
  }

  function getBakeryInfo(card) {
    if (!card) return { id: 'desconhecido', name: 'Desconhecida' };
    const h3 = card.querySelector('h3');
    const name = h3 ? h3.textContent.trim() : 'Desconhecida';
    const id = BAKERY_SLUG_MAP[name] || name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return { id, name };
  }

  // 2. BOTÕES "COMO CHEGAR" E INSTAGRAM
  // 2.1 Mini-cards de unidades individuais (Maçã, Requinte, Saint Germain, Sphair)
  document.querySelectorAll('.unit-map-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const address = btn.getAttribute('data-address');
      if (address) {
        const card = btn.closest('.card');
        const bakery = getBakeryInfo(card);
        const unitItem = btn.closest('.unit-item');
        const unitBadge = unitItem ? unitItem.querySelector('.unit-badge') : null;
        const unitName = unitBadge ? unitBadge.textContent.trim() : 'Unidade';
        const query = encodeURIComponent(address);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

        trackEvent('bakery_maps_click', {
          bakery_id: bakery.id,
          bakery_name: bakery.name,
          unit_name: unitName,
          destination_url: mapUrl
        });

        window.open(mapUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // 2.2 Cards de unidade única (botão no rodapé do card)
  document.querySelectorAll('.card .map-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.card');
      if (!card) return;
      const paragraphs = Array.from(card.querySelectorAll('p'));
      const addressP = paragraphs.find((p) => p.textContent.includes('Endereço:'));
      if (addressP) {
        const address = addressP.textContent.replace('Endereço:', '').trim();
        const firstAddr = address.split('/')[0].trim();
        const query = encodeURIComponent(firstAddr + ', Curitiba - PR');
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

        const bakery = getBakeryInfo(card);

        trackEvent('bakery_maps_click', {
          bakery_id: bakery.id,
          bakery_name: bakery.name,
          unit_name: 'Única',
          destination_url: mapUrl
        });

        window.open(mapUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // 2.3 Links de Instagram nos cards das 15 padarias
  document.querySelectorAll('.card a.insta-link').forEach((link) => {
    link.addEventListener('click', () => {
      const card = link.closest('.card');
      const bakery = getBakeryInfo(card);
      const destinationUrl = link.href;

      trackEvent('bakery_instagram_click', {
        bakery_id: bakery.id,
        bakery_name: bakery.name,
        destination_url: destinationUrl
      });
    });
  });

  // 3. BANNER DE COOKIES
  const COOKIE_CONSENT_KEY = 'curitipao_cookies_consent';
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);

  if (!consent) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <span class="cookie-icon" role="img" aria-label="Bolachinhas / Cookies">🍪</span>
        <div class="cookie-text">
          <strong>Cookies:</strong> Utilizamos armazenamento local no navegador para salvar suas preferências e garantir o bom funcionamento do guia. Saiba mais na nossa <a href="politica-de-privacidade.html">Política de Privacidade</a>.
        </div>
      </div>
      <div class="cookie-buttons">
        <button class="cookie-btn cookie-btn-accept" id="accept-cookies">Aceitar</button>
        <button class="cookie-btn cookie-btn-reject" id="reject-cookies">Recusar</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('accept-cookies').addEventListener('click', () => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
      banner.remove();
    });

    document.getElementById('reject-cookies').addEventListener('click', () => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
      banner.remove();
    });
  }
});
