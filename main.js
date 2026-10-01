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

  // 2. BOTÃO "COMO CHEGAR"
  // Botões gerais em cards de unidade única
  document.querySelectorAll('.card').forEach((card) => {
    const btn = card.querySelector('.map-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        // Encontra o texto de endereço no card
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

  // Botões específicos de cada unidade em cards multi-unidade
  document.querySelectorAll('.unit-map-btn').forEach((unitBtn) => {
    unitBtn.addEventListener('click', () => {
      if (unitBtn.disabled || unitBtn.classList.contains('is-disabled')) {
        return;
      }
      const address = unitBtn.getAttribute('data-address');
      if (address) {
        const query = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
      }
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
