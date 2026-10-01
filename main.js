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

  // 2. MODAL DE ESCOLHA DE UNIDADES & BOTÃO "COMO CHEGAR"
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'unit-modal-overlay';
  modalOverlay.innerHTML = `
    <div class="unit-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="unit-modal-title">
      <div class="unit-modal-header">
        <div class="unit-modal-titles">
          <span class="unit-modal-bakery-tag" id="unit-modal-bakery">Padaria</span>
          <h3 class="unit-modal-title" id="unit-modal-title">Escolha a unidade</h3>
        </div>
        <button class="unit-modal-close" type="button" aria-label="Fechar menu de unidades">✕</button>
      </div>
      <div class="unit-modal-body" id="unit-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const modalBakeryTag = modalOverlay.querySelector('#unit-modal-bakery');
  const modalBody = modalOverlay.querySelector('#unit-modal-body');
  const modalCloseBtn = modalOverlay.querySelector('.unit-modal-close');

  const openUnitModal = (bakeryName, units) => {
    modalBakeryTag.textContent = bakeryName || 'Padaria';
    modalBody.innerHTML = '';

    units.forEach((unit) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'unit-option-btn';
      option.innerHTML = `
        <div class="unit-option-content">
          <span class="unit-option-name">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            ${unit.name}
          </span>
          <span class="unit-option-address">${unit.address}</span>
        </div>
        <span class="unit-option-arrow" aria-hidden="true">→</span>
      `;

      option.addEventListener('click', () => {
        const query = encodeURIComponent(unit.query || (unit.address + ', Curitiba - PR'));
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
        closeUnitModal();
      });

      modalBody.appendChild(option);
    });

    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeUnitModal = () => {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  modalCloseBtn.addEventListener('click', closeUnitModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeUnitModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
      closeUnitModal();
    }
  });

  // Configuração dos cliques dos botões "Como chegar" em todos os cards
  document.querySelectorAll('.card').forEach((card) => {
    const btn = card.querySelector('.map-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        // Se for um card com múltiplas unidades (possui data-units)
        const unitsData = btn.getAttribute('data-units');
        if (unitsData) {
          try {
            const units = JSON.parse(unitsData);
            const bakeryName = btn.getAttribute('data-bakery') || card.querySelector('h3')?.textContent || 'Padaria';
            openUnitModal(bakeryName, units);
            return;
          } catch (err) {
            console.error('Erro ao processar unidades:', err);
          }
        }

        // Card padrão de unidade única
        const paragraphs = Array.from(card.querySelectorAll('p'));
        const addressP = paragraphs.find((p) => p.textContent.includes('Endereço:'));
        let address = '';
        if (addressP) {
          address = addressP.textContent.replace('Endereço:', '').trim();
          const firstAddr = address.split('/')[0].trim();
          const query = encodeURIComponent(firstAddr + ', Curitiba - PR');
          window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
        }
      });
    }
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
