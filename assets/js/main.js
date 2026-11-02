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

    function filterBakeries() {
      if (!bakeryCards.length) return;
      const query = (bakerySearchInput ? bakerySearchInput.value : '').toLowerCase().trim();
      const activeBtn = document.querySelector('.filter-btn[data-bairro].active');
      const selectedBairro = activeBtn ? activeBtn.getAttribute('data-bairro') : 'all';

      let visibleCount = 0;

      bakeryCards.forEach(card => {
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const bairro = (card.getAttribute('data-bairro') || '').toLowerCase();
        const specialty = (card.getAttribute('data-specialty') || '').toLowerCase();

        const matchesQuery = !query || name.includes(query) || bairro.includes(query) || specialty.includes(query);
        const matchesBairro = selectedBairro === 'all' || bairro.includes(selectedBairro.toLowerCase());

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
    }

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

    // 6. CONTACT FORMS HANDLING
    const forms = document.querySelectorAll('form[data-curitipao-form]');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const alertBox = form.querySelector('.form-status-message');
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.className = 'form-notice';
          alertBox.innerHTML = `
            <strong>Envio temporariamente indisponível pelo formulário.</strong><br>
            A infraestrutura de transporte SMTP está em configuração técnica. Por favor, envie sua mensagem ou indicação diretamente para nosso e-mail oficial:
            <a href="mailto:contato@curitipao.com.br" style="text-decoration: underline; font-weight:700;">contato@curitipao.com.br</a> ou pelo Instagram <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener" style="text-decoration: underline; font-weight:700;">@curitipao.guia</a>.
          `;
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  });
})();
