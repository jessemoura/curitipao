/**
 * CURITIPÃO — GLOBAL CLIENT JAVASCRIPT
 * Includes: Theme switcher, accessible mobile menu, search/filters, cookies
 */

(function () {
  'use strict';

  // 1. THEME SWITCHER (Light / Dark with persistence)
  const THEME_KEY = 'curitipao_theme';
  
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateSealImages(theme) {
    const seals = document.querySelectorAll('.brand-seal, .footer-brand-seal');
    seals.forEach(img => {
      if (theme === 'dark') {
        img.src = '/assets/seals/curitipao-selo-ocre.png';
      } else {
        img.src = '/assets/seals/curitipao-selo-marrom.png';
      }
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateSealImages(theme);
    
    // Update aria-label of toggle buttons
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    });
  }

  // Initial theme application
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  document.addEventListener('DOMContentLoaded', () => {
    // Re-verify seals once DOM is ready
    updateSealImages(document.documentElement.getAttribute('data-theme') || 'light');

    // Wire theme toggle buttons
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(active);
      });
    });

    // Listen to system changes if user hasn't explicitly set preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // 2. MOBILE MENU DRAWER
    const menuToggle = document.querySelector('.menu-toggle-btn');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    const closeBtn = document.querySelector('.mobile-nav-close');

    function openMobileMenu() {
      if (!mobileDrawer || !backdrop) return;
      mobileDrawer.classList.add('open');
      backdrop.classList.add('open');
      menuToggle && menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeBtn && closeBtn.focus();
    }

    function closeMobileMenu() {
      if (!mobileDrawer || !backdrop) return;
      mobileDrawer.classList.remove('open');
      backdrop.classList.remove('open');
      menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuToggle && menuToggle.focus();
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', openMobileMenu);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileMenu);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // 3. COOKIE CONSENT
    const COOKIE_KEY = 'curitipao_cookie_consent';
    const existingConsent = localStorage.getItem(COOKIE_KEY);

    window.openCookiePreferences = function () {
      let banner = document.querySelector('.cookie-banner');
      if (banner) {
        banner.style.display = 'flex';
        return;
      }
      createCookieBanner();
    };

    function createCookieBanner() {
      const banner = document.createElement('div');
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Preferências de cookies');
      banner.innerHTML = `
        <div class="cookie-banner-title">
          <span>🍪</span>
          <span>Preferências de Cookies</span>
        </div>
        <p class="cookie-banner-desc">
          Utilizamos armazenamento local para lembrar seu tema (claro/escuro) e cookies anônimos de navegação. Saiba mais na nossa <a href="/privacidade/" style="text-decoration: underline; font-weight:600;">Política de Privacidade</a>.
        </p>
        <div class="cookie-banner-actions">
          <button class="btn btn-primary" id="btn-cookie-accept">Aceitar</button>
          <button class="btn btn-secondary" id="btn-cookie-reject">Recusar</button>
        </div>
      `;
      document.body.appendChild(banner);

      document.getElementById('btn-cookie-accept').addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        banner.remove();
      });

      document.getElementById('btn-cookie-reject').addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'rejected');
        banner.remove();
      });
    }

    if (!existingConsent) {
      createCookieBanner();
    }

    // 4. PADARIAS: LIVE SEARCH & NEIGHBORHOOD FILTER
    const bakerySearchInput = document.getElementById('bakery-search');
    const bakeryFilterButtons = document.querySelectorAll('.filter-btn[data-bairro]');
    const bakeryCards = document.querySelectorAll('.bakery-card');
    const bakeryEmptyState = document.getElementById('bakery-empty-state');
    const bakeryCountBadge = document.getElementById('bakery-count-badge');

    function removeAccents(str) {
      return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }

    function filterBakeries() {
      if (!bakeryCards.length) return;
      const query = removeAccents(bakerySearchInput ? bakerySearchInput.value : '');
      const activeBtn = document.querySelector('.filter-btn[data-bairro].active');
      const selectedBairro = activeBtn ? activeBtn.getAttribute('data-bairro') : 'all';
      const selectedBairroNorm = removeAccents(selectedBairro);

      let visibleCount = 0;

      bakeryCards.forEach(card => {
        const searchData = removeAccents(card.getAttribute('data-search') || '');
        const cardBairros = removeAccents(card.getAttribute('data-bairros') || card.getAttribute('data-bairro') || '');

        const matchesQuery = !query || searchData.includes(query);
        const matchesBairro = selectedBairro === 'all' || cardBairros.includes(selectedBairroNorm);

        if (matchesQuery && matchesBairro) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (bakeryEmptyState) {
        bakeryEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
      if (bakeryCountBadge) {
        bakeryCountBadge.textContent = visibleCount === 15 
          ? '15 padarias cadastradas' 
          : `${visibleCount} de 15 padarias encontradas`;
      }
    }

    window.curitipaoFilterBakeries = filterBakeries;

    if (bakerySearchInput) {
      bakerySearchInput.addEventListener('input', filterBakeries);
    }

    if (bakeryFilterButtons.length) {
      bakeryFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          bakeryFilterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          filterBakeries();
        });
      });
    }

    // 5. BLOG SEARCH & CATEGORY FILTER
    const blogSearchInput = document.getElementById('blog-search');
    const blogFilterButtons = document.querySelectorAll('.blog-filter-btn[data-category]');
    const blogArticles = document.querySelectorAll('.blog-card');
    const blogEmptyState = document.getElementById('blog-empty-state');

    function filterBlog() {
      if (!blogArticles.length) return;
      const query = (blogSearchInput ? blogSearchInput.value : '').toLowerCase().trim();
      const activeBtn = document.querySelector('.blog-filter-btn[data-category].active');
      const selectedCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

      let visibleCount = 0;

      blogArticles.forEach(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const summary = (card.getAttribute('data-summary') || '').toLowerCase();
        const category = (card.getAttribute('data-category') || '').toLowerCase();

        const matchesQuery = !query || title.includes(query) || summary.includes(query);
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory.toLowerCase();

        if (matchesQuery && matchesCategory) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (blogEmptyState) {
        blogEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (blogSearchInput) {
      blogSearchInput.addEventListener('input', filterBlog);
    }

    if (blogFilterButtons.length) {
      blogFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          blogFilterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          filterBlog();
        });
      });
    }

    // 6. CONTACT FORMS HANDLING & ENHANCED PHONE LOGIC
    function formatPhone(val) {
      if (!val) return '';
      const digits = val.replace(/\D/g, '').slice(0, 11);
      if (digits.length <= 2) return digits ? `(${digits}` : '';
      if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    // Attach phone masks
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
      input.addEventListener('input', () => {
        const raw = input.value;
        const formatted = formatPhone(raw);
        if (formatted !== raw && raw.length > 0) {
          input.value = formatted;
        }
      });
    });

    // Handle "O WhatsApp é o mesmo telefone" toggle
    const samePhoneToggles = [
      {
        checkbox: document.getElementById('ind-mesmo-contato'),
        tel: document.getElementById('ind-telefone'),
        wpp: document.getElementById('ind-whatsapp')
      },
      {
        checkbox: document.getElementById('cad-mesmo-contato'),
        tel: document.getElementById('cad-telefone'),
        wpp: document.getElementById('cad-whatsapp')
      }
    ];

    samePhoneToggles.forEach(item => {
      if (item.checkbox && item.tel && item.wpp) {
        const syncPhone = () => {
          if (item.checkbox.checked) {
            item.wpp.value = item.tel.value;
            item.wpp.setAttribute('readonly', 'readonly');
            item.wpp.style.opacity = '0.7';
          } else {
            item.wpp.removeAttribute('readonly');
            item.wpp.style.opacity = '1';
          }
        };

        item.checkbox.addEventListener('change', syncPhone);
        item.tel.addEventListener('input', () => {
          if (item.checkbox.checked) {
            item.wpp.value = item.tel.value;
          }
        });
      }
    });

    const forms = document.querySelectorAll('form[data-curitipao-form]');
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formType = form.getAttribute('data-curitipao-form');
        const alertBox = form.querySelector('.form-status-message');

        // Check honeypot
        const hp = form.querySelector('input[name="curitipao_hp"]');
        if (hp && hp.value.trim() !== '') {
          return;
        }

        // Validate required contact in Form B (Cadastrar/Atualizar)
        if (formType === 'cadastrar') {
          const telInput = form.querySelector('[name="telefone_padaria"]');
          const wppInput = form.querySelector('[name="whatsapp_padaria"]');
          const alertaContato = form.querySelector('#cad-contato-alerta');
          const telDigits = (telInput?.value || '').replace(/\D/g, '');
          const wppDigits = (wppInput?.value || '').replace(/\D/g, '');

          if (!telDigits && !wppDigits) {
            if (alertaContato) alertaContato.style.display = 'block';
            (telInput || wppInput)?.focus();
            if (alertBox) {
              alertBox.style.display = 'block';
              alertBox.className = 'form-status-message form-notice';
              alertBox.innerHTML = '<strong>Atenção:</strong> Por favor, informe ao menos um número de contato da padaria (telefone fixo ou WhatsApp).';
              alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return;
          } else {
            if (alertaContato) alertaContato.style.display = 'none';
          }
        }

        // Native validity check for required fields
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerText : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Processando dados...';
        }

        // Collect form data
        const formData = new FormData(form);
        const dataObj = {};
        formData.forEach((val, key) => {
          dataObj[key] = val;
        });
        dataObj.tipo_formulario = formType;
        dataObj.autoriza_tel = form.querySelector('[name="autoriza_tel"]')?.checked ? 1 : 0;
        dataObj.autoriza_wpp = form.querySelector('[name="autoriza_wpp"]')?.checked ? 1 : 0;
        dataObj.mesmo_contato = form.querySelector('[name="mesmo_contato"]')?.checked ? 1 : 0;

        try {
          const res = await fetch('/api/contato.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(dataObj)
          });

          const data = await res.json().catch(() => null);

          if (alertBox) {
            alertBox.style.display = 'block';

            if (res.ok && data && data.success) {
              alertBox.className = 'form-status-message form-success';
              if (typeof window.gtag === 'function') {
                window.gtag('event', 'form_submission_success', {
                  form_type: formType,
                  event_category: 'engagement'
                });
              }
              const protocolInfo = data && data.submission_id ? `<br><small style="opacity: 0.85; display: inline-block; margin-top: 4px;">Protocolo de registro: <code>${data.submission_id}</code></small>` : '';
              alertBox.innerHTML = `
                <strong>Solicitação recebida com sucesso!</strong><br>
                ${data.message || 'Sua mensagem foi encaminhada para a curadoria do CuritiPão. Nossa equipe revisa todas as informações antes de qualquer atualização no guia.'}${protocolInfo}
              `;
              form.reset();
            } else {
              // Se o envio e a persistência falharem, preserva os campos e avisa com clareza
              alertBox.className = 'form-status-message form-notice';
              alertBox.innerHTML = `
                <strong>Não foi possível enviar sua solicitação no momento:</strong><br>
                ${(data && data.message) ? data.message : 'Ocorreu uma instabilidade temporária no serviço.'}<br><br>
                Seus dados foram preservados no formulário acima. Se preferir, você também pode nos contatar diretamente pelo e-mail <a href="mailto:contato@curitipao.com.br" style="text-decoration: underline; font-weight:700;">contato@curitipao.com.br</a>.
              `;
            }
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } catch (err) {
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.className = 'form-status-message form-notice';
            alertBox.innerHTML = `
              <strong>Não foi possível enviar sua solicitação no momento:</strong><br>
              Houve uma falha de conexão. Seus dados foram preservados no formulário para você tentar novamente ou enviar diretamente para <a href="mailto:contato@curitipao.com.br" style="text-decoration: underline; font-weight:700;">contato@curitipao.com.br</a>.
            `;
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
          }
        }
      });
    });

    // 7. GLOBAL OUTBOUND EVENT TRACKING (Instagram, WhatsApp, Maps)
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (!anchor || !anchor.href) return;
      const href = anchor.href;

      if (href.includes('instagram.com')) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'instagram_click', {
            destination_url: href,
            link_text: anchor.innerText.trim() || 'Instagram'
          });
        }
      } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'whatsapp_click', {
            destination_url: href,
            link_text: anchor.innerText.trim() || 'WhatsApp'
          });
        }
      } else if (href.includes('google.com/maps') || href.includes('maps.google') || href.includes('goo.gl/maps')) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'maps_click', {
            destination_url: href,
            link_text: anchor.innerText.trim() || 'Como Chegar'
          });
        }
      }
    });

    // 8. VISOR / LIGHTBOX DOS CARDS DE DESTAQUE (/padarias/)
    function initDemoLightbox() {
      const lightbox = document.getElementById('demo-lightbox');
      if (!lightbox) return;

      const backdrop = lightbox.querySelector('.demo-lightbox-backdrop');
      const closeBtn = document.getElementById('demo-lightbox-close');
      const img = document.getElementById('demo-lightbox-img');
      const loader = document.getElementById('demo-lightbox-loader');
      const title = document.getElementById('demo-lightbox-title');
      const subtitle = document.getElementById('demo-lightbox-subtitle');
      const photoTriggers = document.querySelectorAll('.demo-photo-btn');

      let lastActiveTrigger = null;
      let scrollPosition = 0;

      function openLightbox(trigger) {
        lastActiveTrigger = trigger;
        const fullSrc = trigger.getAttribute('data-full-src');
        const altText = trigger.getAttribute('data-alt') || 'Foto ampliada';
        const padariaText = trigger.getAttribute('data-padaria') || 'Demonstração de Destaque';

        // Salvar posição atual da página para preservar scroll sem saltos
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Atualizar textos informativos
        if (title) title.textContent = altText;
        if (subtitle) subtitle.textContent = padariaText;

        // Exibir modal e resetar estado de carregamento da imagem
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (img) {
          img.style.display = 'none';
          img.src = '';
          img.alt = altText;
        }
        if (loader) {
          loader.style.display = 'flex';
        }

        // Carregar a versão de maior resolução sob demanda
        if (fullSrc && img) {
          const highResImg = new Image();
          highResImg.onload = function() {
            img.src = fullSrc;
            if (loader) loader.style.display = 'none';
            img.style.display = 'block';
          };
          highResImg.onerror = function() {
            if (loader) {
              loader.innerHTML = '<span style="color: #ff9999; font-size: 0.85rem;">Não foi possível carregar a imagem em alta resolução.</span>';
            }
          };
          highResImg.src = fullSrc;
        }

        // Focar no botão de fechar para controle por teclado
        if (closeBtn) {
          setTimeout(() => closeBtn.focus(), 60);
        }
      }

      function closeLightbox() {
        if (lightbox.style.display === 'none') return;

        lightbox.style.display = 'none';
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Limpar imagem para liberar memória
        if (img) {
          img.src = '';
          img.style.display = 'none';
        }

        // Restaurar e preservar a exata posição da página
        window.scrollTo(0, scrollPosition);

        // Devolver o foco à foto que abriu o visor
        if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
          lastActiveTrigger.focus();
        }
      }

      photoTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(btn);
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          closeLightbox();
        });
      }

      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          e.preventDefault();
          closeLightbox();
        });
      }

      // Suporte à tecla Esc
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          if (lightbox && lightbox.style.display !== 'none') {
            e.preventDefault();
            closeLightbox();
          }
        }
      });
    }

    initDemoLightbox();
  });
})();
