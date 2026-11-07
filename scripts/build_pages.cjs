const fs = require('fs');
const path = require('path');
const { renderBlogCards, writeBlogArticles, blogUrls, invitation, invitationArticle } = require('./blog_articles.cjs');

// Helper to create directories
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Read bakeries data
const bakeries = JSON.parse(fs.readFileSync('./assets/data/bakeries_2026.json', 'utf8'));

// Official Vector Icons
const OFFICIAL_INSTAGRAM_SVG = (size = 24, id = 'ig-grad') => `
<svg class="icon-social-official icon-instagram-official" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}" cx="20%" cy="115%" r="130%">
      <stop offset="0%" stop-color="#FFDD55"/>
      <stop offset="10%" stop-color="#FFDD55"/>
      <stop offset="50%" stop-color="#FF543E"/>
      <stop offset="70%" stop-color="#C837AB"/>
      <stop offset="100%" stop-color="#4B589A"/>
    </radialGradient>
  </defs>
  <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="url(#${id})"/>
  <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" ry="3.5" fill="none" stroke="#FFFFFF" stroke-width="1.6"/>
  <circle cx="12" cy="12" r="3.2" fill="none" stroke="#FFFFFF" stroke-width="1.6"/>
  <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF"/>
</svg>`;

const OFFICIAL_WHATSAPP_SVG = (size = 24) => `
<svg class="icon-social-official icon-whatsapp-official" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="11" fill="#25D366"/>
  <path fill="#FFFFFF" d="M17.5 14.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.2 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.6-.4z"/>
</svg>`;

// Common Header HTML
function getHeader(activeRoute = '/') {
  const routes = [
    { href: '/', label: 'Início' },
    { href: '/padarias/', label: 'Padarias' },
    { href: '/festival/', label: 'Festival' },
    { href: '/roteiros/', label: 'Roteiros' },
    { href: '/blog/', label: 'Blog' },
    { href: '/imprensa/', label: 'Imprensa' },
    { href: '/contato/', label: 'Contato', isButton: true }
  ];

  const desktopLinks = routes.map(r => {
    const isActive = activeRoute === r.href;
    const btnClass = r.isButton ? 'nav-link-btn' : '';
    return `<a href="${r.href}" class="nav-link ${btnClass} ${isActive ? 'active' : ''}">${r.label}</a>`;
  }).join('\n          ');

  const mobileLinks = routes.map(r => {
    const isActive = activeRoute === r.href;
    const btnClass = r.isButton ? 'mobile-nav-btn' : '';
    return `<a href="${r.href}" class="mobile-nav-link ${btnClass} ${isActive ? 'active' : ''}">${r.label}</a>`;
  }).join('\n        ');

  return `
  <a href="#conteudo-principal" class="skip-link">Pular para o conteúdo principal</a>

  <!-- CABEÇALHO OFICIAL CURITIPÃO -->
  <header class="site-header">
    <div class="container header-container">
      <!-- Marca: Logo Oficial CuritiPão -->
      <a href="/" class="brand-link" aria-label="CuritiPão — Página Inicial">
        <img src="/assets/logos/curitipao-logo.png" alt="CuritiPão" class="brand-logo-img" width="50" height="50">
        <div class="brand-text-wrap">
          <span class="brand-name">CuritiPão</span>
          <span class="brand-tagline">Padarias & Histórias</span>
        </div>
      </a>

      <!-- Navegação Desktop -->
      <nav class="nav-desktop" aria-label="Navegação Principal">
        ${desktopLinks}
      </nav>

      <!-- Ações do Cabeçalho -->
      <div class="header-actions">
        <!-- Alternador de Tema (Claro / Escuro) -->
        <button type="button" class="btn-icon-tool btn-theme-toggle" aria-label="Alternar tema claro/escuro" title="Alternar tema">
          <svg class="theme-icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg class="theme-icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>

        <!-- Instagram Oficial -->
        <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="btn-icon-tool btn-social-instagram" aria-label="Instagram @curitipao.guia" title="Siga @curitipao.guia no Instagram">
          ${OFFICIAL_INSTAGRAM_SVG(24, 'ig-header')}
        </a>

        <!-- Botão Menu Mobile -->
        <button type="button" class="menu-toggle-btn" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="mobile-nav-drawer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- DRAWER MOBILE -->
  <div class="mobile-nav-backdrop"></div>
  <nav class="mobile-nav-drawer" id="mobile-nav-drawer" aria-label="Menu móvel">
    <div class="mobile-nav-header">
      <a href="/" class="brand-link">
        <img src="/assets/logos/curitipao-logo.png" alt="CuritiPão" class="brand-logo-img" width="42" height="42">
        <span class="brand-name" style="font-size: 1.3rem;">CuritiPão</span>
      </a>
      <button type="button" class="btn-icon-tool mobile-nav-close" aria-label="Fechar menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="mobile-nav-links">
      ${mobileLinks}
    </div>
    <div class="mobile-nav-footer">
      <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
        ${OFFICIAL_INSTAGRAM_SVG(22, 'ig-drawer')}
        <span>@curitipao.guia</span>
      </a>
      <a href="mailto:contato@curitipao.com.br" class="btn btn-primary" style="width: 100%;">
        <span>contato@curitipao.com.br</span>
      </a>
    </div>
  </nav>
  `;
}

// Common Footer HTML
function getFooter() {
  return `
  <!-- RODAPÉ INSTITUCIONAL CURITIPÃO -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Coluna 1: Marca & Apresentação -->
        <div class="footer-col-brand">
          <a href="/" class="brand-link" style="margin-bottom: 4px;">
            <img src="/assets/logos/curitipao-logo.png" alt="CuritiPão" class="footer-brand-logo" width="52" height="52">
            <div class="brand-text-wrap">
              <span class="brand-name">CuritiPão</span>
              <span class="brand-tagline">Guia Permanente de Curitiba</span>
            </div>
          </a>
          <p class="footer-desc">
            Um guia para descobrir as padarias, os pães e as histórias de Curitiba. Nascido no Curitidoce, consagrado em festival e agora permanente na cidade.
          </p>
          <div style="display: flex; gap: 12px; margin-top: 6px; align-items: center;">
            <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="btn-icon-tool btn-social-instagram" aria-label="Instagram CuritiPão" title="@curitipao.guia">
              ${OFFICIAL_INSTAGRAM_SVG(24, 'ig-footer')}
            </a>
            <a href="mailto:contato@curitipao.com.br" class="btn-icon-tool" aria-label="E-mail de Contato" title="contato@curitipao.com.br">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </div>

        <!-- Coluna 2: Navegação -->
        <div>
          <h4 class="footer-heading">Navegação</h4>
          <ul class="footer-links">
            <li><a href="/" class="footer-link">Início</a></li>
            <li><a href="/sobre/" class="footer-link">Sobre o Projeto</a></li>
            <li><a href="/padarias/" class="footer-link">Guia de Padarias</a></li>
            <li><a href="/roteiros/" class="footer-link">Roteiros</a></li>
            <li><a href="/blog/" class="footer-link">Blog & Histórias</a></li>
            <li><a href="/festival/" class="footer-link">Festival CuritiPão</a></li>
            <li><a href="/imprensa/" class="footer-link">Imprensa</a></li>
          </ul>
        </div>

        <!-- Coluna 3: Participação & Memória -->
        <div>
          <h4 class="footer-heading">Conexões</h4>
          <ul class="footer-links">
            <li><a href="/contato/#indicar" class="footer-link">Indicar uma Padaria</a></li>
            <li><a href="/contato/#cadastrar" class="footer-link">Cadastrar seu Forno</a></li>
            <li><a href="/festival/2026/" class="footer-link">Arquivo Festival 2026</a></li>
            <li><a href="/imprensa/#2026" class="footer-link">CuritiPão na Imprensa</a></li>
            <li>
              <a href="https://www.instagram.com/curitidoce/" target="_blank" rel="noopener noreferrer" class="footer-link footer-link-with-icon">
                ${OFFICIAL_INSTAGRAM_SVG(16, 'ig-curitidoce')}
                <span>Curitidoce</span>
              </a>
            </li>
            <li><a href="/solucoes-digitais/" class="footer-link">Soluções Digitais</a></li>
          </ul>
        </div>

        <!-- Coluna 4: Contato & Informações -->
        <div>
          <h4 class="footer-heading">Contato Oficial</h4>
          <p class="footer-desc" style="margin-bottom: 12px;">
            Dúvidas, sugestões editoriais ou propostas de parcerias:
          </p>
          <p style="margin-bottom: 10px;">
            <a href="mailto:contato@curitipao.com.br" class="footer-link" style="font-weight: 600; color: var(--color-primary);">
              contato@curitipao.com.br
            </a>
          </p>
          <p>
            <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="footer-link footer-link-with-icon">
              ${OFFICIAL_INSTAGRAM_SVG(16, 'ig-footer-link')}
              <span>@curitipao.guia</span>
            </a>
          </p>
        </div>
      </div>

      <!-- Barra Inferior de Créditos & Legal -->
      <div class="footer-bottom">
        <div>
          &copy; ${new Date().getFullYear()} CuritiPão. Todos os direitos reservados.
          <span style="margin: 0 8px;">•</span>
          <a href="/privacidade/" class="footer-link" style="display:inline;">Política de Privacidade</a>
          <span style="margin: 0 8px;">•</span>
          <button type="button" onclick="window.openCookiePreferences()" style="display:inline; text-decoration: underline; font-size:inherit; color:inherit;">Preferências de Cookies</button>
        </div>
        <div class="dev-credits">
          <a href="https://www.conexus.press/" target="_blank" rel="noopener noreferrer" class="conexus-signature" aria-label="CONEXUS Digital Solutions — abrir site em nova aba">
            <span class="conexus-prefix">Desenvolvido por</span>
            <picture>
              <source srcset="/assets/logos/conexus-logo-oficial.webp" type="image/webp">
              <img src="/assets/logos/conexus-logo-oficial.png" alt="CONEXUS Digital Solutions" class="conexus-logo" width="118" height="39" loading="lazy" decoding="async">
            </picture>
            <span class="conexus-suffix">
              <span>DIGITAL</span>
              <span>SOLUTIONS</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </footer>

  <script type="module" src="/assets/js/main.js"></script>
  `;
}

// Base HTML Page Wrapper
function wrapPage({ title, description, canonical, activeRoute, content, schemaJson, extraHead = '', ogImage = 'https://curitipao.com.br/assets/photos/curitipao-111.jpg', ogType = 'website' }) {
  const jsonLd = schemaJson ? `<script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n</script>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Google Analytics 4 (CuritiPão Oficial) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JX6VH347DQ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-JX6VH347DQ');
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | CuritiPão</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://curitipao.com.br${canonical}">

  <!-- Favicons Oficiais -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">

  <!-- Open Graph / Redes Sociais -->
  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${title} | CuritiPão">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://curitipao.com.br${canonical}">
  <meta property="og:site_name" content="CuritiPão">
  <meta property="og:image" content="${ogImage}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} | CuritiPão">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">

  ${jsonLd}

  <link rel="stylesheet" href="/assets/css/style.css">
  ${extraHead}
</head>
<body>
  ${getHeader(activeRoute)}

  <main id="conteudo-principal">
    ${content}
  </main>

  ${getFooter()}
</body>
</html>`;
}

// -------------------------------------------------------------
// PAGE 1: HOME (/)
// -------------------------------------------------------------
const homeContent = `
  <!-- HERO PRINCIPAL -->
  <section class="home-hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <span class="badge badge-gold hero-pill">Guia Permanente & Festival</span>
        <h1 class="hero-title">Um guia para descobrir as padarias, os pães e as histórias de Curitiba.</h1>
        <p class="hero-lead">
          O CuritiPão reúne informações, roteiros, novidades e histórias sobre a panificação de Curitiba. Encontre padarias por bairro, descubra produtos, conheça quem está por trás dos fornos e acompanhe o Festival CuritiPão.
        </p>
        <div class="hero-buttons">
          <a href="/padarias/" class="btn btn-primary">Encontrar padarias</a>
          <a href="/roteiros/" class="btn btn-secondary">Explorar roteiros</a>
          <a href="/festival/" class="btn btn-outline-gold">Conhecer o festival</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-image-frame">
          <img src="/assets/photos/curitipao-111.jpg" alt="Pães artesanais de fermentação natural de Curitiba" width="800" height="600" loading="eager">
          <div class="hero-caption">
            <strong>Panificação Artesanal Curitibana</strong> • Acervo Oficial CuritiPão
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BANNER DESTAQUE: CONTINUIDADE DO PROJETO -->
  <section class="section" style="padding-top: 0;">
    <div class="container">
      <div class="continuity-banner">
        <div class="continuity-content">
          <span class="badge badge-gold" style="margin-bottom: 12px;">Transição & Expansão</span>
          <h2 class="continuity-title">O festival acabou. O CuritiPão está só começando.</h2>
          <p class="continuity-text">
            O CuritiPão nasceu como roteiro do Curitidoce, ganhou sua primeira edição como festival em 2026 e agora será um projeto permanente sobre padarias, pães e histórias de Curitiba. O que vivemos nas 15 padarias participantes provou que a panificação da nossa cidade merece celebração e cobertura o ano inteiro.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <a href="/sobre/" class="btn btn-primary">Conhecer a história do projeto</a>
            <a href="/festival/2026/" class="btn btn-secondary">Acessar o arquivo do Festival 2026</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- APRESENTAÇÃO DO GUIA PERMANENTE -->
  <section class="section section-alt">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Curadoria de Estabelecimentos</span>
        <h2 class="section-title">Padarias de Curitiba em destaque</h2>
        <p class="section-subtitle">
          De pães de fermentação natural a viennoiseries impecáveis, conheça quem faz a farinha ganhar vida em cada canto da cidade.
        </p>
      </div>

      <div class="card-grid">
        <!-- Card 1 -->
        <article class="card-editorial">
          <div class="card-media">
            <img src="/assets/photos/Babka de Nutella e Pistache - FELIPANE 5.jpg" alt="Babka de Nutella e Pistache da Felipane" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Juvevê</span>
            <h3 class="card-title">Felipane</h3>
            <p class="card-desc">
              Padaria artesanal focada em fermentação natural lenta e clássicos da panificação contemporânea no Juvevê.
            </p>
            <div class="card-footer">
              <span class="badge badge-gold">Festival 2026</span>
              <a href="/padarias/" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">Ver no guia</a>
            </div>
          </div>
        </article>

        <!-- Card 2 -->
        <article class="card-editorial">
          <div class="card-media">
            <img src="/assets/photos/baguete veneza - integral - Confraria 1.jpg" alt="Baguete Veneza Integral da Confraria dos Pães" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Alto da XV</span>
            <h3 class="card-title">Confraria dos Pães</h3>
            <p class="card-desc">
              Pães rústicos, baguetes de tradição e fornadas diárias que celebram a cultura do pão bem feito.
            </p>
            <div class="card-footer">
              <span class="badge badge-gold">Festival 2026</span>
              <a href="/padarias/" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">Ver no guia</a>
            </div>
          </div>
        </article>

        <!-- Card 3 -->
        <article class="card-editorial">
          <div class="card-media">
            <img src="/assets/photos/bonin-inteiro.jpg" alt="Pão do Bosque da Bonin Bakery" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Centro</span>
            <h3 class="card-title">Bonin Bakery</h3>
            <p class="card-desc">
              Referência em folhados finos, viennoiserie refinada e pães rústicos na charmosa Alameda Prudente de Moraes.
            </p>
            <div class="card-footer">
              <span class="badge badge-gold">Festival 2026</span>
              <a href="/padarias/" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">Ver no guia</a>
            </div>
          </div>
        </article>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="/padarias/" class="btn btn-primary">Explorar todas as padarias no guia completo</a>
      </div>
    </div>
  </section>

  <!-- ESPAÇO PARA ROTEIROS -->
  <section class="section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Passeios Gastronômicos</span>
        <h2 class="section-title">Explore Curitiba através dos seus pães</h2>
        <p class="section-subtitle">
          Roteiros temáticos pensados para quem gosta de caminhar pelos bairros, provar fornadas frescas e entender a identidade de cada padaria.
        </p>
      </div>

      <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <!-- Roteiro Publicado em Destaque -->
        <article class="card-editorial" style="border: 2px solid var(--color-accent); box-shadow: var(--shadow-sm);">
          <div class="card-media">
            <img src="/assets/photos/curitipao-111.jpg" alt="15 padarias em Curitiba para conhecer, bairro por bairro" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Roteiro Completo • Por Ledinara</span>
            <h3 class="card-title">
              <a href="/roteiros/padarias-em-curitiba-por-bairro/">15 padarias em Curitiba para conhecer, bairro por bairro</a>
            </h3>
            <p class="card-desc">
              Conheça 15 padarias em Curitiba, organizadas por bairro, com dicas de pães, viennoiseries, cafés e especialidades de cada casa.
            </p>
            <div class="card-footer">
              <span class="badge badge-gold">Publicado</span>
              <a href="/roteiros/padarias-em-curitiba-por-bairro/" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.82rem;">Ler roteiro &rarr;</a>
            </div>
          </div>
        </article>

        <div class="form-card" style="margin-bottom: 0;">
          <span class="badge badge-brown" style="margin-bottom: 12px;">Em Curadoria</span>
          <h3 style="margin-bottom: 10px;">Roteiro Fermentação Natural</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 16px;">
            Uma travessia entre o Centro, Batel e Bigorrilho mapeando os pioneiros do sourdough e fornos de alta hidratação.
          </p>
          <a href="/roteiros/" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">Conhecer a proposta</a>
        </div>

        <div class="form-card" style="margin-bottom: 0;">
          <span class="badge badge-brown" style="margin-bottom: 12px;">Em Curadoria</span>
          <h3 style="margin-bottom: 10px;">Cafés & Padarias de Bairro</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 16px;">
            Descubra o charme do Juvevê, Cabral e Bacacheri unindo pão quentinho, café especial e atendimento de vizinhança.
          </p>
          <a href="/roteiros/" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">Conhecer a proposta</a>
        </div>
      </div>
    </div>
  </section>

  <!-- MATÉRIAS RECENTES DO BLOG -->
  <section class="section section-alt">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Editorial & Novidades</span>
        <h2 class="section-title">Últimas do Blog CuritiPão</h2>
        <p class="section-subtitle">
          Reportagens, bastidores dos fornos e novidades sobre o universo da panificação curitibana.
        </p>
      </div>

      <div style="max-width: 800px; margin: 0 auto;">
        <article class="card-editorial" style="flex-direction: row; flex-wrap: wrap;">
          <div class="card-media" style="flex: 1 1 300px; min-height: 240px;">
            <img src="/assets/photos/curitipao-108 (1).jpg" alt="Fornos e pães artesanais em Curitiba" loading="lazy">
          </div>
          <div class="card-body" style="flex: 1 1 320px;">
            <span class="card-tag">Novidades e festival</span>
            <h3 class="card-title">
              <a href="/blog/o-curitipao-continua/">O CuritiPão continua: do roteiro ao festival, agora um guia permanente</a>
            </h3>
            <p class="card-desc">
              O projeto que reuniu 15 padarias de Curitiba em 2026 agora se transforma em uma plataforma permanente sobre a cultura do pão e as histórias de quem assa na capital paranaense.
            </p>
            <div class="card-footer">
              <span style="color: var(--color-text-light);">Por Curadoria CuritiPão</span>
              <a href="/blog/o-curitipao-continua/" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">Ler matéria completa</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- CHAMADA PARA O ARQUIVO FESTIVAL 2026 -->
  <section class="section">
    <div class="container">
      <div style="background: var(--color-surface); border: 2px dashed var(--color-border); border-radius: var(--radius-lg); padding: 40px 30px; text-align: center; max-width: 900px; margin: 0 auto;">
        <span class="badge badge-gold" style="margin-bottom: 12px;">Memória Histórica</span>
        <h2 style="margin-bottom: 12px; color: var(--color-primary);">Arquivo Oficial do Festival 2026</h2>
        <p style="color: var(--color-text-muted); max-width: 650px; margin: 0 auto 24px; line-height: 1.6;">
          Revisite a primeira edição do Festival CuritiPão: as 15 padarias participantes, as criações exclusivas, os preços históricos e toda a repercussão da edição de estreia.
        </p>
        <a href="/festival/2026/" class="btn btn-primary">Acessar página integral do Festival 2026</a>
      </div>
    </div>
  </section>

  <!-- CONVITE PARA PARTICIPAÇÃO & CONEXUS -->
  <section class="section section-alt">
    <div class="container">
      <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        <!-- Card Participação -->
        <div class="form-card" style="margin-bottom: 0;">
          <h3 style="margin-bottom: 12px;">Indique uma padaria favorita</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 20px;">
            Conhece uma padaria no seu bairro que faz um pão inesquecível? Ajude nossa curadoria a mapear os melhores fornos de Curitiba.
          </p>
          <a href="/contato/#indicar" class="btn btn-secondary">Fazer uma indicação</a>
        </div>

        <!-- Card Instagram -->
        <div class="form-card" style="margin-bottom: 0;">
          <h3 style="margin-bottom: 12px;">Acompanhe no Instagram</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 20px;">
            Siga <strong>@curitipao.guia</strong> para vídeos de fornadas, avisos sobre novos roteiros e novidades do próximo festival.
          </p>
          <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold">Seguir @curitipao.guia</a>
        </div>

        <!-- Bloco Discreto CONEXUS -->
        <div class="form-card" style="margin-bottom: 0;">
          <span class="badge badge-brown" style="margin-bottom: 10px;">Tecnologia & Gastronomia</span>
          <h3 style="margin-bottom: 12px;">Soluções digitais para padarias</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 20px;">
            O CuritiPão também conecta padarias a serviços digitais desenvolvidos pela CONEXUS, como criação de sites, cardápios digitais e Perfil da Empresa no Google.
          </p>
          <a href="/solucoes-digitais/" class="btn btn-secondary">Saiba mais</a>
        </div>
      </div>
    </div>
  </section>
`;

const homeHtml = wrapPage({
  title: 'Guia de Padarias, Pães e Histórias de Curitiba',
  description: 'O CuritiPão reúne informações, roteiros, novidades e histórias sobre a panificação de Curitiba. Encontre padarias por bairro e acompanhe o festival.',
  canonical: '/',
  activeRoute: '/',
  content: homeContent,
  schemaJson: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CuritiPão",
    "url": "https://curitipao.com.br/",
    "description": "Um guia para descobrir as padarias, os pães e as histórias de Curitiba."
  }
});
fs.writeFileSync('./index.html', homeHtml, 'utf8');
console.log('Generated index.html (Home)');

// -------------------------------------------------------------
// PAGE 2: SOBRE (/sobre/)
// -------------------------------------------------------------
ensureDir('./sobre');
const sobreContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Sobre</span>
      </nav>
      <h1>Sobre o CuritiPão</h1>
      <p class="lead">
        A história do projeto que transformou um roteiro em festival e agora se consolida como guia permanente da panificação curitibana.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 900px;">
      <div style="margin-bottom: 40px; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
        <img src="/assets/photos/curitipao-111.jpg" alt="Acervo oficial CuritiPão — pães de fermentação natural" style="width: 100%; height: auto; max-height: 460px; object-fit: cover;">
      </div>

      <article style="font-size: 1.12rem; line-height: 1.8; color: var(--color-text);">
        <p style="font-weight: 500; font-size: 1.25rem; color: var(--color-primary); margin-bottom: 1.6rem;">
          O CuritiPão nasceu como um roteiro do Curitidoce e, em 2026, ganhou sua primeira edição como festival, reunindo 15 padarias de Curitiba em torno de criações desenvolvidas especialmente para o evento.
        </p>

        <p>
          A experiência mostrou que havia muito mais para contar. Por isso, o CuritiPão passa a existir durante todo o ano como um guia de padarias, pães e histórias da cidade. O projeto combina informação de serviço, curadoria editorial, roteiros, notícias e conteúdo sobre quem faz a panificação curitibana acontecer.
        </p>

        <p>
          O Festival CuritiPão permanece como o principal encontro anual da marca.
        </p>

        <hr style="border: 0; border-top: 1px solid var(--color-border); margin: 40px 0;">

        <h2 style="margin-bottom: 20px;">A Ligação com o Curitidoce</h2>
        <p>
          A história do CuritiPão tem raiz direta no trabalho pioneiro do <a href="https://www.instagram.com/curitidoce/" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); font-weight: 600; text-decoration: underline;">Curitidoce</a>, a plataforma de experiências e passeios gastronômicos que há anos valoriza a doçaria e a confeitaria de Curitiba.
        </p>
        <p>
          Com a expansão da cultura do pão artesanal na capital, a demanda por um olhar especializado para a panificação deu origem primeiro aos roteiros e, em seguida, ao festival. A continuidade do portal é o desdobramento natural dessa paixão pela cidade e pelos seus artesãos da farinha e do fermento.
        </p>

        <h2 style="margin-top: 40px; margin-bottom: 20px;">Nossos Compromissos</h2>
        <ul style="list-style: disc; padding-left: 24px; margin-bottom: 30px;">
          <li style="margin-bottom: 10px;"><strong>Curadoria Independente:</strong> Informação de serviço apurada com rigor, horários verificados e respeito à identidade de cada estabelecimento.</li>
          <li style="margin-bottom: 10px;"><strong>Valorização dos Padeiros:</strong> Reconhecimento do trabalho artesanal de quem acorda antes do amanhecer para alimentar a cidade.</li>
          <li style="margin-bottom: 10px;"><strong>Fotografia Real:</strong> Uso exclusivo de fotos autênticas dos produtos e fornos de Curitiba, sem ilustrações genéricas ou fotos de banco de imagem.</li>
        </ul>

        <div style="background: var(--color-bg-alt); padding: 30px; border-radius: var(--radius-md); border-left: 4px solid var(--color-accent); margin-top: 40px;">
          <h3 style="margin-bottom: 10px; font-size: 1.2rem;">Quer fazer parte dessa história?</h3>
          <p style="font-size: 0.95rem; margin-bottom: 16px;">
            Seja indicando sua padaria de bairro ou cadastrando seu estabelecimento, a construção deste guia é coletiva.
          </p>
          <a href="/contato/" class="btn btn-primary" style="font-size: 0.9rem;">Entrar em contato</a>
        </div>
      </article>
    </div>
  </section>
`;

const sobreHtml = wrapPage({
  title: 'Sobre o Projeto CuritiPão',
  description: 'Conheça a história do CuritiPão: nascido no Curitidoce, consagrado no festival de 2026 e agora um guia permanente da panificação de Curitiba.',
  canonical: '/sobre/',
  activeRoute: '/sobre/',
  content: sobreContent
});
fs.writeFileSync('./sobre/index.html', sobreHtml, 'utf8');
console.log('Generated sobre/index.html');

// -------------------------------------------------------------
// PAGE 3: PADARIAS (/padarias/)
// -------------------------------------------------------------
ensureDir('./padarias');

// Helper function to slugify names for anchor matching
function slugify(text) {
  return text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function removeAccents(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Bairro color theme mapping:
// Terracota para Bacacheri, Verde Sálvia para Juvevê, Ocre para Centro
// Reutiliza a mesma paleta e mantém consistência para o mesmo bairro
function getBairroTheme(bairro) {
  const norm = removeAccents(bairro || '');
  if (norm.includes('bacacheri') || norm.includes('alto da xv') || norm.includes('cabral') || norm.includes('vila izabel')) {
    return 'terracota';
  }
  if (norm.includes('juveve') || norm.includes('batel') || norm.includes('jardim social') || norm.includes('ahu')) {
    return 'salvia';
  }
  if (norm.includes('centro') || norm.includes('sao francisco') || norm.includes('bigorrilho')) {
    return 'ocre';
  }
  return 'terracota';
}

const iconPinSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bakery-meta-icon" style="margin-top: 3px;" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

const iconClockSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bakery-meta-icon" style="margin-top: 3px;" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;

// Extract unique neighborhoods from bakeries for filter buttons
const filterBairros = [
  'Ahú',
  'Alto da XV',
  'Bacacheri',
  'Batel',
  'Bigorrilho',
  'Cabral',
  'Centro',
  'Jardim Social',
  'Juvevê',
  'São Francisco',
  'Vila Izabel'
];

// Sort bakeries alphabetically by name
const sortedBakeries = [...bakeries].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

const bakeryCardsHtml = sortedBakeries.map(b => {
  const slug = slugify(b.name);
  const bairrosList = b.allBairros && b.allBairros.length ? b.allBairros : [b.neighborhood];
  const bairrosStr = bairrosList.join(', ');
  const searchCorpus = `${b.name} ${bairrosStr} ${b.city || 'Curitiba'} ${b.address || ''} ${b.description || ''}`;
  const normalizedSearch = removeAccents(searchCorpus);
  const cardTheme = getBairroTheme(b.neighborhood);

  let addressAndScheduleHtml = '';
  let footerMapBtnHtml = '';

  if (b.units && b.units.length > 0) {
    // Multi-unit rendering
    addressAndScheduleHtml = `
      <div class="bakery-units-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
        ${b.units.map(u => {
          const unitTheme = getBairroTheme(u.bairro);
          return `
          <div class="bakery-unit-item theme-${unitTheme}" style="background: var(--color-bg); padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); border-left: 3px solid var(--card-bairro-color); font-size: 0.86rem; line-height: 1.45;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="color: var(--card-bairro-color); font-size: 0.88rem;">Unidade ${u.bairro}</strong>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.mapsQuery || u.address)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-como-chegar" style="font-size: 0.78rem; padding: 4px 10px;">
                Como chegar &rarr;
              </a>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
              ${iconPinSvg}
              <span style="color: var(--color-text);">${u.address}</span>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
              ${iconClockSvg}
              <span style="color: var(--color-text-muted);">${u.hours}</span>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
    footerMapBtnHtml = '';
  } else {
    // Single unit rendering
    addressAndScheduleHtml = `
      <div class="bakery-info-box" style="background: var(--color-bg); padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 14px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.88rem; line-height: 1.45;">
          ${iconPinSvg}
          <div>
            <strong style="color: var(--color-text-muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.03em; display: block; margin-bottom: 1px;">Endereço</strong>
            <span style="color: var(--color-text);">${b.address}</span>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.88rem; line-height: 1.45;">
          ${iconClockSvg}
          <div>
            <strong style="color: var(--color-text-muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.03em; display: block; margin-bottom: 1px;">Horário confirmado</strong>
            <span style="color: var(--color-text-muted);">${b.hours}</span>
          </div>
        </div>
      </div>
    `;
    footerMapBtnHtml = `
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapsQuery || b.address)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-como-chegar" style="font-size: 0.82rem; font-weight: 600; padding: 6px 14px;">
        Como chegar &rarr;
      </a>
    `;
  }

  return `
    <article class="card-editorial bakery-card bakery-free-card theme-${cardTheme}" id="${slug}" data-name="${b.name}" data-bairro="${b.neighborhood}" data-bairros="${bairrosList.join(',')}" data-cidade="${b.city || 'Curitiba'}" data-search="${normalizedSearch}" style="border: 1px solid var(--color-border); border-top: 4px solid var(--card-bairro-color); border-radius: var(--radius-md); background: var(--color-surface); box-shadow: var(--shadow-sm); overflow: hidden;">
      <div class="card-body" style="padding: 22px; display: flex; flex-direction: column; height: 100%;">
        <!-- Começa pelo nome -->
        <h3 class="card-title bakery-name" style="margin: 0 0 8px 0; font-size: 1.3rem; color: var(--color-primary); line-height: 1.25;">
          ${b.name}
        </h3>

        <!-- Bairro e Cidade -->
        <div style="margin-bottom: 12px;">
          <span class="card-tag bakery-bairro-tag" style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; background: var(--card-bairro-bg); color: var(--card-bairro-color); border: 1px solid var(--card-bairro-border); padding: 4px 10px; border-radius: 999px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: var(--card-bairro-color);" aria-hidden="true"></span>
            ${b.neighborhood} • ${b.city || 'Curitiba'}
          </span>
        </div>

        <!-- Breve descrição -->
        <p class="card-desc bakery-desc" style="font-size: 0.92rem; color: var(--color-text); margin-bottom: 14px; line-height: 1.5; flex-grow: 1;">
          ${b.description}
        </p>

        <!-- Endereço e Horários confirmados com ícones discretos -->
        ${addressAndScheduleHtml}

        <!-- Rodapé do Card: Botão Como chegar e Link Festival 2026 -->
        <div class="card-footer" style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--color-border); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px;">
          ${footerMapBtnHtml}
          <a href="/festival/2026/#${slug}" class="footer-link" style="font-size: 0.8rem; color: var(--color-text-muted); text-decoration: underline;">
            Edição Festival 2026 &rarr;
          </a>
        </div>
      </div>
    </article>
  `;
}).join('\n');

const padariasContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Padarias</span>
      </nav>
      <h1>Guia de Padarias de Curitiba e Região Metropolitana</h1>
      <p class="lead" style="margin-bottom: 20px;">
        Encontre padarias artesanais, panificadoras tradicionais e ateliês de fermentação natural em Curitiba, com horários e endereços confirmados.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 10px;">
        <a href="/contato/#cadastrar" class="btn btn-primary btn-sm" style="font-size: 0.85rem; padding: 7px 16px;">Cadastre sua padaria gratuitamente</a>
        <a href="/blog/indicar-cadastrar-padaria-curitipao/" class="btn btn-secondary btn-sm" style="font-size: 0.85rem; padding: 7px 16px;">Como funciona o cadastro?</a>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top: 30px;">
    <div class="container">

      <!-- 1. TOPO: 3 CARDS PATROCINADOS FICTÍCIOS E VERTICAIS (EXEMPLO DE DESTAQUE) -->
      <section class="destaque-exemplo-container" aria-label="Demonstração de destaques patrocinados" style="margin-bottom: 40px;">
        <div style="background: var(--color-surface); border: 2px dashed var(--color-primary); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--color-border); padding-bottom: 14px;">
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
              <span class="badge badge-gold" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.82rem; padding: 4px 10px;">Exemplo de destaque</span>
              <span style="font-size: 0.86rem; color: var(--color-text-muted); font-style: italic;">3 modelos ilustrativos verticais (demonstração fora da contagem e dos filtros do guia)</span>
            </div>
            <a href="/contato/#cadastrar" class="btn btn-secondary btn-sm" style="font-size: 0.82rem; padding: 6px 14px; font-weight: 600;">Anuncie sua padaria &rarr;</a>
          </div>

          <!-- Grade dos 3 cards verticais: lado a lado no desktop, empilhados no celular -->
          <div class="destaque-cards-grid">
            
            <!-- CARD 1: Ateliê do Trigo (Demonstração - Juvevê) -->
            <article class="demo-vertical-card" style="display: flex; flex-direction: column; height: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="badge badge-gold" style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em; padding: 3px 8px;">Exemplo de destaque</span>
                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-style: italic;">Demonstração</span>
              </div>

              <!-- Foto de Capa 1 -->
              <div style="margin-bottom: 8px;">
                <button type="button" class="demo-photo-btn demo-photo-cover" data-full-src="/assets/photos/curitipao-111.jpg" data-alt="Pães artesanais de fermentação natural - Ateliê do Trigo" data-padaria="Ateliê do Trigo • Juvevê" aria-label="Ampliar foto: Pães artesanais de fermentação natural - Ateliê do Trigo" style="border-radius: var(--radius-sm); overflow: hidden; aspect-ratio: 16/10; box-shadow: var(--shadow-sm);">
                  <img src="/assets/photos/curitipao-111.webp" alt="Pães artesanais de fermentação natural - Ateliê do Trigo" class="demo-card-cover-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Ampliar</span>
                  </span>
                </button>
              </div>

              <!-- Mini-Galeria 1 -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px;">
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/piegel-cortado.jpg" data-alt="Fornos artesanais - Ateliê do Trigo" data-padaria="Ateliê do Trigo • Juvevê" aria-label="Ampliar foto: Fornos artesanais - Ateliê do Trigo" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/piegel-cortado.webp" alt="Fornos artesanais" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/aquarius-cortado.jpg" data-alt="Pão fatiado miolo - Ateliê do Trigo" data-padaria="Ateliê do Trigo • Juvevê" aria-label="Ampliar foto: Pão fatiado miolo - Ateliê do Trigo" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/aquarius-cortado.webp" alt="Pão fatiado miolo" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/bonin-cortado.jpg" data-alt="Viennoiserie artesanal - Ateliê do Trigo" data-padaria="Ateliê do Trigo • Juvevê" aria-label="Ampliar foto: Viennoiserie artesanal - Ateliê do Trigo" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/bonin-cortado.webp" alt="Viennoiserie artesanal" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
              </div>

              <!-- Bairro e Título -->
              <div style="margin-bottom: 6px;">
                <span class="card-tag" style="background: rgba(53, 101, 83, 0.12); color: #356553; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.76rem;">Juvevê • Curitiba</span>
              </div>
              <h3 style="font-size: 1.25rem; margin: 0 0 6px 0; color: var(--color-primary); line-height: 1.25;">Ateliê do Trigo</h3>
              <p style="font-size: 0.88rem; color: var(--color-text); margin-bottom: 12px; line-height: 1.45; flex-grow: 1;">
                Modelo com foco em fermentação natural de alta hidratação, pães rústicos de casca crocante e fornadas matinais frescas.
              </p>

              <!-- Endereço e Horários -->
              <div style="background: var(--color-surface); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 12px; font-size: 0.82rem; line-height: 1.4;">
                <p style="margin: 0 0 4px 0; color: var(--color-text);"><strong>📍 Endereço:</strong> Rua das Fornadas, 120 — Juvevê</p>
                <p style="margin: 0; color: var(--color-text-muted);"><strong>🕒 Horário:</strong> Ter a Sáb: 7h às 19h • Dom: 8h às 13h</p>
              </div>

              <!-- Botões Ilustrativos -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--color-border);">
                <button type="button" class="btn btn-primary btn-sm" onclick="alert('Demonstração ilustrativa: este botão abre o trajeto no Google Maps até a padaria.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  Como chegar
                </button>
                <a href="#cardapio-1" class="btn btn-secondary btn-sm" onclick="event.preventDefault(); alert('Demonstração ilustrativa: abre o cardápio oficial em PDF fornecido pela padaria.'); return false;" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  📄 Cardápio PDF
                </a>
                <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Demonstração ilustrativa: inicia conversa no WhatsApp oficial da padaria.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  💬 WhatsApp
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Demonstração ilustrativa: abre o perfil verificado da padaria no Instagram.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  📸 Instagram
                </button>
              </div>
            </article>

            <!-- CARD 2: Panifício Imperial (Demonstração - Batel) -->
            <article class="demo-vertical-card" style="display: flex; flex-direction: column; height: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="badge badge-gold" style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em; padding: 3px 8px;">Exemplo de destaque</span>
                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-style: italic;">Demonstração</span>
              </div>

              <!-- Foto de Capa 2 -->
              <div style="margin-bottom: 8px;">
                <button type="button" class="demo-photo-btn demo-photo-cover" data-full-src="/assets/photos/curitipao-108 (1).jpg" data-alt="Confeitaria e pães italianos - Panifício Imperial" data-padaria="Panifício Imperial • Batel" aria-label="Ampliar foto: Confeitaria e pães italianos - Panifício Imperial" style="border-radius: var(--radius-sm); overflow: hidden; aspect-ratio: 16/10; box-shadow: var(--shadow-sm);">
                  <img src="/assets/photos/curitipao-108 (1).webp" alt="Confeitaria e pães italianos - Panifício Imperial" class="demo-card-cover-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Ampliar</span>
                  </span>
                </button>
              </div>

              <!-- Mini-Galeria 2 -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px;">
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/maca-organica-cortado.jpg" data-alt="Doces artesanais - Panifício Imperial" data-padaria="Panifício Imperial • Batel" aria-label="Ampliar foto: Doces artesanais - Panifício Imperial" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/maca-organica-cortado.webp" alt="Doces artesanais" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/familia-farinha-cortado.jpg" data-alt="Pão integral corte - Panifício Imperial" data-padaria="Panifício Imperial • Batel" aria-label="Ampliar foto: Pão integral corte - Panifício Imperial" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/familia-farinha-cortado.webp" alt="Pão integral corte" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/requinte-cortado.jpg" data-alt="Confeitaria fina - Panifício Imperial" data-padaria="Panifício Imperial • Batel" aria-label="Ampliar foto: Confeitaria fina - Panifício Imperial" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/requinte-cortado.webp" alt="Confeitaria fina" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
              </div>

              <!-- Bairro e Título -->
              <div style="margin-bottom: 6px;">
                <span class="card-tag" style="background: rgba(184, 83, 44, 0.12); color: #B8532C; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.76rem;">Batel • Curitiba</span>
              </div>
              <h3 style="font-size: 1.25rem; margin: 0 0 6px 0; color: var(--color-primary); line-height: 1.25;">Panifício Imperial</h3>
              <p style="font-size: 0.88rem; color: var(--color-text); margin-bottom: 12px; line-height: 1.45; flex-grow: 1;">
                Modelo com confeitaria clássica, ciabattas italianas, sanduíches artesanais e ambiente acolhedor para café colonial.
              </p>

              <!-- Endereço e Horários -->
              <div style="background: var(--color-surface); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 12px; font-size: 0.82rem; line-height: 1.4;">
                <p style="margin: 0 0 4px 0; color: var(--color-text);"><strong>📍 Endereço:</strong> Alameda dos Pães, 450 — Batel</p>
                <p style="margin: 0; color: var(--color-text-muted);"><strong>🕒 Horário:</strong> Seg a Sáb: 6h30 às 20h • Dom: 7h às 19h</p>
              </div>

              <!-- Botões Ilustrativos -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--color-border);">
                <button type="button" class="btn btn-primary btn-sm" onclick="alert('Demonstração ilustrativa: este botão abre o trajeto no Google Maps até a padaria.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  Como chegar
                </button>
                <a href="#cardapio-2" class="btn btn-secondary btn-sm" onclick="event.preventDefault(); alert('Demonstração ilustrativa: abre o cardápio oficial em PDF fornecido pela padaria.'); return false;" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  📄 Cardápio PDF
                </a>
                <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Demonstração ilustrativa: inicia conversa no WhatsApp oficial da padaria.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  💬 WhatsApp
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Demonstração ilustrativa: abre o perfil verificado da padaria no Instagram.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  📸 Instagram
                </button>
              </div>
            </article>

            <!-- CARD 3: Fornada Central (Demonstração - Centro) -->
            <article class="demo-vertical-card" style="display: flex; flex-direction: column; height: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="badge badge-gold" style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em; padding: 3px 8px;">Exemplo de destaque</span>
                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-style: italic;">Demonstração</span>
              </div>

              <!-- Foto de Capa 3 -->
              <div style="margin-bottom: 8px;">
                <button type="button" class="demo-photo-btn demo-photo-cover" data-full-src="/assets/photos/bonin-inteiro.jpg" data-alt="Pães tradicionais e broas - Fornada Central" data-padaria="Fornada Central • Centro" aria-label="Ampliar foto: Pães tradicionais e broas - Fornada Central" style="border-radius: var(--radius-sm); overflow: hidden; aspect-ratio: 16/10; box-shadow: var(--shadow-sm);">
                  <img src="/assets/photos/bonin-inteiro.webp" alt="Pães tradicionais e broas - Fornada Central" class="demo-card-cover-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Ampliar</span>
                  </span>
                </button>
              </div>

              <!-- Mini-Galeria 3 -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px;">
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/aquarius-inteiro.jpg" data-alt="Pão rústico inteiro - Fornada Central" data-padaria="Fornada Central • Centro" aria-label="Ampliar foto: Pão rústico inteiro - Fornada Central" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/aquarius-inteiro.webp" alt="Pão rústico inteiro" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/requinte-inteiro.jpg" data-alt="Pães artesanais - Fornada Central" data-padaria="Fornada Central • Centro" aria-label="Ampliar foto: Pães artesanais - Fornada Central" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/requinte-inteiro.webp" alt="Pães artesanais" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
                <button type="button" class="demo-photo-btn demo-photo-thumb" data-full-src="/assets/photos/familia-farinha-inteiro.jpg" data-alt="Pão de centeio - Fornada Central" data-padaria="Fornada Central • Centro" aria-label="Ampliar foto: Pão de centeio - Fornada Central" style="border-radius: 4px; overflow: hidden; aspect-ratio: 1/1;">
                  <img src="/assets/photos/familia-farinha-inteiro.webp" alt="Pão de centeio" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                  <span class="demo-photo-zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </span>
                </button>
              </div>

              <!-- Bairro e Título -->
              <div style="margin-bottom: 6px;">
                <span class="card-tag" style="background: rgba(160, 98, 30, 0.12); color: #A0621E; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.76rem;">Centro • Curitiba</span>
              </div>
              <h3 style="font-size: 1.25rem; margin: 0 0 6px 0; color: var(--color-primary); line-height: 1.25;">Fornada Central</h3>
              <p style="font-size: 0.88rem; color: var(--color-text); margin-bottom: 12px; line-height: 1.45; flex-grow: 1;">
                Exemplo de padaria urbana prática e autêntica, famosa pelas broas de centeio, pães multigrãos e cafés para viagem.
              </p>

              <!-- Endereço e Horários -->
              <div style="background: var(--color-surface); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 12px; font-size: 0.82rem; line-height: 1.4;">
                <p style="margin: 0 0 4px 0; color: var(--color-text);"><strong>📍 Endereço:</strong> Rua das Flores, 88 — Centro</p>
                <p style="margin: 0; color: var(--color-text-muted);"><strong>🕒 Horário:</strong> Seg a Sex: 7h às 19h30 • Sáb: 8h às 14h</p>
              </div>

              <!-- Botões Ilustrativos -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--color-border);">
                <button type="button" class="btn btn-primary btn-sm" onclick="alert('Demonstração ilustrativa: este botão abre o trajeto no Google Maps até a padaria.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  Como chegar
                </button>
                <a href="#cardapio-3" class="btn btn-secondary btn-sm" onclick="event.preventDefault(); alert('Demonstração ilustrativa: abre o cardápio oficial em PDF fornecido pela padaria.'); return false;" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  📄 Cardápio PDF
                </a>
                <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Demonstração ilustrativa: inicia conversa no WhatsApp oficial da padaria.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  💬 WhatsApp
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Demonstração ilustrativa: abre o perfil verificado da padaria no Instagram.');" style="font-size: 0.78rem; padding: 6px 8px; justify-content: center;">
                  📸 Instagram
                </button>
              </div>
            </article>

          </div>
        </div>
      </section>

      <!-- 2. ABAIXO: BARRA DE BUSCA E FILTROS -->
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 14px;">
        <h2 style="font-size: 1.5rem; margin: 0; color: var(--color-text);">Padarias Cadastradas em Curitiba</h2>
        <span id="bakery-count-badge" style="font-size: 0.88rem; color: var(--color-text-muted); font-weight: 600;">15 padarias cadastradas</span>
      </div>

      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 30px; box-shadow: var(--shadow-sm);">
        <div style="margin-bottom: 16px;">
          <label for="bakery-search" class="form-label" style="font-size: 0.95rem; font-weight: 700;">Busque por padaria, bairro ou cidade:</label>
          <input type="text" id="bakery-search" class="form-input" placeholder="Digite o nome da padaria, bairro ou cidade (ex: Felipane, Juvevê, Curitiba)...">
        </div>

        <div>
          <span style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); display: block; margin-bottom: 8px;">
            Filtrar por Bairro:
          </span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <button type="button" class="btn btn-secondary filter-btn active" data-bairro="all" style="padding: 5px 12px; font-size: 0.8rem;">Todos os Bairros</button>
            ${filterBairros.map(b => `<button type="button" class="btn btn-secondary filter-btn" data-bairro="${b}" style="padding: 5px 12px; font-size: 0.8rem;">${b}</button>`).join('\n            ')}
          </div>
        </div>
      </div>

      <!-- 3. GRID COM AS 15 FICHAS GRATUITAS (ORDEM ALFABÉTICA) -->
      <div class="card-grid" id="bakery-cards-container">
        ${bakeryCardsHtml}
      </div>

      <!-- ESTADO VAZIO -->
      <div id="bakery-empty-state" style="display: none; text-align: center; padding: 60px 20px; background: var(--color-surface); border-radius: var(--radius-md); border: 1px dashed var(--color-border); margin-top: 20px;">
        <h3>Nenhuma padaria encontrada</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 20px;">Não encontramos nenhum estabelecimento com os termos pesquisados.</p>
        <button type="button" class="btn btn-primary" onclick="document.getElementById('bakery-search').value=''; document.querySelectorAll('.filter-btn[data-bairro]').forEach(b=>b.classList.remove('active')); document.querySelector('.filter-btn[data-bairro=all]').classList.add('active'); if(window.curitipaoFilterBakeries) window.curitipaoFilterBakeries();">Limpar busca e filtros</button>
      </div>

      <!-- BANNER DE CONVITE PARA CADASTRO -->
      <div style="margin-top: 60px; background: var(--color-bg-alt); border-radius: var(--radius-lg); padding: 40px; border: 1px solid var(--color-border); text-align: center;">
        <h2 style="font-size: 1.8rem; margin-bottom: 12px;">Sua padaria ainda não está no guia?</h2>
        <p style="max-width: 680px; margin: 0 auto 24px; color: var(--color-text-muted);">
          O guia permanente do CuritiPão está aberto para estabelecimentos de todos os bairros de Curitiba que prezam pela boa panificação artesanal.
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;">
          <a href="/contato/#cadastrar" class="btn btn-primary">Cadastrar minha padaria gratuitamente</a>
          <a href="/festival/2026/#padarias" class="btn btn-secondary">Ver 15 padarias do Festival 2026</a>
        </div>
      </div>

      <!-- 4. VISOR / LIGHTBOX PARA AMPLIAR AS FOTOS DOS DESTAQUES -->
      <div id="demo-lightbox" class="demo-lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Visor de foto ampliada" style="display: none;">
        <div class="demo-lightbox-backdrop" tabindex="-1"></div>
        <div class="demo-lightbox-container" role="document">
          <div class="demo-lightbox-header">
            <div class="demo-lightbox-info">
              <span id="demo-lightbox-title" class="demo-lightbox-title">Foto ampliada</span>
              <span id="demo-lightbox-subtitle" class="demo-lightbox-subtitle">Demonstração de Destaque</span>
            </div>
            <button type="button" id="demo-lightbox-close" class="demo-lightbox-close" aria-label="Fechar visor (Esc)" title="Fechar visor (Esc)">
              <span class="demo-lightbox-close-label">Fechar</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="demo-lightbox-body">
            <div id="demo-lightbox-loader" class="demo-lightbox-loader" aria-label="Carregando imagem em alta resolução...">
              <div class="demo-lightbox-spinner"></div>
              <span>Carregando foto em alta resolução...</span>
            </div>
            <div class="demo-lightbox-image-wrap">
              <img id="demo-lightbox-img" class="demo-lightbox-img" src="" alt="" style="display: none;">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const padariasHtml = wrapPage({
  title: 'Guia de Padarias de Curitiba e Região Metropolitana — CuritiPão',
  description: 'Conheça 15 padarias artesanais e tradicionais de Curitiba e Região Metropolitana com horários, endereços e informações confirmadas.',
  canonical: '/padarias/',
  activeRoute: '/padarias/',
  content: padariasContent
});
fs.writeFileSync('./padarias/index.html', padariasHtml, 'utf8');
console.log('Generated padarias/index.html');

// PAGE 4: MODELO DE FICHA DE PADARIA (/padarias/modelo/)
// -------------------------------------------------------------
ensureDir('./padarias/modelo');
const modeloPadariaContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <a href="/padarias/">Padarias</a>
        <span class="sep">/</span>
        <span aria-current="page">Modelo de Ficha</span>
      </nav>
      <span class="badge badge-gold" style="margin-bottom: 12px;">Estrutura do Guia Permanente</span>
      <h1>Modelo de Ficha de Padaria</h1>
      <p class="lead">
        Esta é a estrutura padrão que cada padaria cadastrada no guia permanente do CuritiPão receberá após a revisão editorial e confirmação de dados.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 960px;">
      <div class="form-card" style="padding: 40px; margin-bottom: 40px;">
        <!-- Topo da Ficha -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 20px; border-bottom: 1px solid var(--color-border); padding-bottom: 24px; margin-bottom: 24px;">
          <div>
            <span class="badge badge-gold" style="margin-bottom: 8px;">Juvevê • Curitiba</span>
            <h2 style="font-size: 2.2rem; color: var(--color-primary); margin-bottom: 6px;">Padaria Exemplo Artesanal</h2>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">Fermentação natural, viennoiserie e cafés especiais</p>
          </div>
          <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold" style="font-size: 0.85rem;">
            @padariaexemplo
          </a>
        </div>

        <!-- Mídia / Galeria da Ficha -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 30px;">
          <div style="border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 4/3;">
            <img src="/assets/photos/curitipao-111.jpg" alt="Pães de fermentação natural" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 4/3;">
            <img src="/assets/photos/curitipao-108 (1).jpg" alt="Interior e forno da padaria" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>

        <!-- Apresentação Editorial -->
        <div style="margin-bottom: 35px;">
          <h3 style="margin-bottom: 12px;">Sobre a Casa</h3>
          <p style="line-height: 1.7; color: var(--color-text); margin-bottom: 14px;">
            Fundada com a proposta de resgatar o ritmo calmo da panificação clássica, a casa trabalha com farinhas selecionadas e fermentação que ultrapassa as 24 horas. Além do pão rústico de casca crocante e miolo aerado, as fornadas matinais trazem croissants amanteigados e especialidades sazonais.
          </p>
        </div>

        <!-- Dados de Serviço -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; background: var(--color-bg); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 35px;">
          <div>
            <h4 style="font-size: 0.88rem; text-transform: uppercase; color: var(--color-accent); margin-bottom: 8px;">Endereço</h4>
            <p style="font-size: 0.92rem; margin-bottom: 8px;">Rua Exemplo Ilustrativo, 100 — Juvevê, Curitiba - PR</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); font-weight: 600; font-size: 0.85rem; text-decoration: underline;">Como Chegar no Google Maps &rarr;</a>
          </div>

          <div>
            <h4 style="font-size: 0.88rem; text-transform: uppercase; color: var(--color-accent); margin-bottom: 8px;">Horários</h4>
            <p style="font-size: 0.92rem; margin-bottom: 4px;">Terça a Sexta: 07h30 às 19h00</p>
            <p style="font-size: 0.92rem; margin-bottom: 4px;">Sábados: 08h00 às 17h00</p>
            <p style="font-size: 0.92rem; color: var(--color-text-light);">Domingos e segundas: fechado</p>
          </div>

          <div>
            <h4 style="font-size: 0.88rem; text-transform: uppercase; color: var(--color-accent); margin-bottom: 8px;">Atendimento & Pedidos</h4>
            <p style="font-size: 0.92rem; margin-bottom: 4px;">✓ Consumo no local / Balcão</p>
            <p style="font-size: 0.92rem; margin-bottom: 4px;">✓ Retirada no balcão</p>
            <p style="font-size: 0.92rem; color: var(--color-text-muted);">✓ Delivery sob consulta</p>
          </div>
        </div>

        <!-- Especialidades -->
        <div style="margin-bottom: 30px;">
          <h3 style="margin-bottom: 12px;">Especialidades do Forno</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <span class="badge badge-brown">Pão Campanha Sourdough</span>
            <span class="badge badge-brown">Baguete Tradicional</span>
            <span class="badge badge-brown">Croissant Francês</span>
            <span class="badge badge-brown">Ciabatta de Azeitonas</span>
            <span class="badge badge-brown">Focaccia de Alecrim</span>
          </div>
        </div>

        <!-- CTA Atualização -->
        <div style="border-top: 1px solid var(--color-border); padding-top: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px;">
          <span style="font-size: 0.88rem; color: var(--color-text-muted);">
            É o responsável por esta padaria ou quer sugerir correções?
          </span>
          <a href="/contato/#cadastrar" class="btn btn-secondary" style="font-size: 0.85rem;">
            Atualizar dados desta ficha
          </a>
        </div>
      </div>
    </div>
  </section>
`;

const modeloPadariaHtml = wrapPage({
  title: 'Modelo de Ficha de Padaria',
  description: 'Veja como funciona a estrutura de ficha detalhada para padarias cadastradas no guia permanente do CuritiPão.',
  canonical: '/padarias/modelo/',
  activeRoute: '/padarias/',
  extraHead: '<meta name="robots" content="noindex, follow">',
  content: modeloPadariaContent
});
fs.writeFileSync('./padarias/modelo/index.html', modeloPadariaHtml, 'utf8');
console.log('Generated padarias/modelo/index.html');

// -------------------------------------------------------------
// PAGE 5: ROTEIROS (/roteiros/)
// -------------------------------------------------------------
ensureDir('./roteiros');
const roteirosContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Roteiros</span>
      </nav>
      <h1>Roteiros de Padarias por Curitiba</h1>
      <p class="lead">
        Maneiras saborosas de caminhar pelos bairros de Curitiba e descobrir padarias artesanais, fornos históricos e especialidades imperdíveis.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="form-notice" style="margin-bottom: 40px;">
        <strong>Curadoria editorial:</strong>
        Roteiros temáticos e percursos organizados por bairro para você planejar suas visitas pelas padarias de Curitiba.
      </div>

      <div class="card-grid">
        <!-- Roteiro Destaque Publicado: 15 Padarias por Bairro -->
        <article class="card-editorial" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; background: var(--color-surface); border: 2px solid var(--color-accent); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
          <div class="card-media" style="min-height: 260px; height: 100%;">
            <a href="/roteiros/padarias-em-curitiba-por-bairro/" style="display: block; height: 100%;">
              <img src="/assets/photos/curitipao-111.jpg" alt="15 padarias em Curitiba para conhecer, bairro por bairro" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="eager">
            </a>
          </div>
          <div class="card-body" style="padding: 28px; display: flex; flex-direction: column; justify-content: center;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
              <span class="badge badge-gold">Roteiro Completo</span>
              <span class="card-tag" style="margin: 0;">10 Bairros • 15 Casas</span>
            </div>
            <h2 class="card-title" style="font-size: 1.6rem; margin-bottom: 12px; line-height: 1.3;">
              <a href="/roteiros/padarias-em-curitiba-por-bairro/" style="color: var(--color-primary); text-decoration: none;">15 padarias em Curitiba para conhecer, bairro por bairro</a>
            </h2>
            <p class="card-desc" style="font-size: 1rem; line-height: 1.6; margin-bottom: 20px; color: var(--color-text);">
              Conheça 15 padarias em Curitiba, organizadas por bairro, com dicas de pães, viennoiseries, cafés e especialidades de cada casa.
            </p>
            <div class="card-footer" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid var(--color-border); flex-wrap: wrap; gap: 10px;">
              <span style="font-size: 0.85rem; color: var(--color-text-muted); font-style: italic;">Por Ledinara • Fotos: Lorena Lenara Batista</span>
              <a href="/roteiros/padarias-em-curitiba-por-bairro/" class="btn btn-primary">Abrir matéria completa &rarr;</a>
            </div>
          </div>
        </article>

        <!-- Roteiro 1 -->
        <article class="card-editorial">
          <div class="card-media">
            <img src="/assets/photos/curitipao-111.jpg" alt="Pães de fermentação natural" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Centro • Batel • Bigorrilho</span>
            <h3 class="card-title">Roteiro Fermentação Natural</h3>
            <p class="card-desc">
              Uma jornada pelos fornos que trabalham sourdough de longa maturação, cascas caramelizadas e farinhas artesanais na região central e oeste.
            </p>
            <div class="card-footer">
              <span class="badge badge-gold">Em estruturação</span>
              <a href="/contato/#sugerir" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">Sugerir parada</a>
            </div>
          </div>
        </article>

        <!-- Roteiro 2 -->
        <article class="card-editorial">
          <div class="card-media">
            <img src="/assets/photos/Babka de Nutella e Pistache - FELIPANE 2.jpg" alt="Cafés e padarias de bairro" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Juvevê • Cabral • Bacacheri</span>
            <h3 class="card-title">Cafés & Padarias de Bairro</h3>
            <p class="card-desc">
              O charme das ruas arborizadas da zona norte: cafeterias com fornadas próprias, empórios de vizinhança e balcões aconchegantes.
            </p>
            <div class="card-footer">
              <span class="badge badge-gold">Em estruturação</span>
              <a href="/contato/#sugerir" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">Sugerir parada</a>
            </div>
          </div>
        </article>

        <!-- Roteiro 3 -->
        <article class="card-editorial">
          <div class="card-media">
            <img src="/assets/photos/maca-organica-inteiro.jpg" alt="Sonhos e pães doces" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Várias Regiões</span>
            <h3 class="card-title">Pães Doces, Sonhos & Viennoiserie</h3>
            <p class="card-desc">
              Para quem busca o lado doce da panificação: folhados laminados com manteiga pura, sonhos tradicionais e babkas recheadas.
            </p>
            <div class="card-footer">
              <span class="badge badge-gold">Em estruturação</span>
              <a href="/contato/#sugerir" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">Sugerir parada</a>
            </div>
          </div>
        </article>
      </div>

      <!-- Convite Sugestão de Roteiro -->
      <div style="margin-top: 50px; background: var(--color-bg-alt); padding: 40px; border-radius: var(--radius-lg); border: 1px solid var(--color-border); text-align: center;">
        <h3 style="margin-bottom: 10px;">Tem uma sugestão de trajeto ou padaria imperdível?</h3>
        <p style="color: var(--color-text-muted); max-width: 600px; margin: 0 auto 20px;">
          Compartilhe com a gente o roteiro de padarias que você costuma fazer no seu fim de semana por Curitiba.
        </p>
        <a href="/contato/#indicar" class="btn btn-primary">Sugerir roteiro ou padaria</a>
      </div>
    </div>
  </section>
`;

const roteirosHtml = wrapPage({
  title: 'Roteiros de Padarias por Curitiba',
  description: 'Descubra roteiros gastronômicos de pães e padarias artesanais pelos bairros de Curitiba.',
  canonical: '/roteiros/',
  activeRoute: '/roteiros/',
  content: roteirosContent
});
fs.writeFileSync('./roteiros/index.html', roteirosHtml, 'utf8');
console.log('Generated roteiros/index.html');

// -------------------------------------------------------------
// PAGE 5B: ROTEIRO INDIVIDUAL - 15 PADARIAS POR BAIRRO (/roteiros/padarias-em-curitiba-por-bairro/)
// -------------------------------------------------------------
ensureDir('./roteiros/padarias-em-curitiba-por-bairro');

const roteiro15PadariasSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "15 padarias em Curitiba para conhecer, bairro por bairro",
  "alternativeHeadline": "Padarias em Curitiba: 15 lugares para conhecer por bairro",
  "description": "Conheça 15 padarias em Curitiba, organizadas por bairro, com dicas de pães, viennoiseries, cafés e especialidades de cada casa.",
  "image": [
    "https://curitipao.com.br/assets/photos/curitipao-111.jpg"
  ],
  "datePublished": "2026-11-04T12:00:00-03:00",
  "dateModified": "2026-11-04T12:00:00-03:00",
  "author": {
    "@type": "Person",
    "name": "Ledinara",
    "jobTitle": "Curadora Gastronômica e Criadora do Curitidoce",
    "url": "https://curitipao.com.br/sobre/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "CuritiPão",
    "url": "https://curitipao.com.br",
    "logo": {
      "@type": "ImageObject",
      "url": "https://curitipao.com.br/assets/logos/curitipao-logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://curitipao.com.br/roteiros/padarias-em-curitiba-por-bairro/"
  },
  "keywords": "padarias em Curitiba, panificação artesanal Curitiba, roteiro padarias Curitiba, Festival CuritiPão"
};

const roteiro15PadariasContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <a href="/roteiros/">Roteiros</a>
        <span class="sep">/</span>
        <span aria-current="page">15 padarias em Curitiba por bairro</span>
      </nav>
      <span class="badge badge-gold" style="margin-bottom: 14px;">Roteiro Gastronômico • Curadoria Oficial</span>
      <h1>15 padarias em Curitiba para conhecer, bairro por bairro</h1>
    </div>
  </section>

  <section class="section">
    <div class="container roteiro-article-container">
      <!-- Byline Strip Oficial -->
      <div class="roteiro-byline-strip">
        <span>Por <strong class="roteiro-byline-author">Ledinara</strong></span>
        <span>•</span>
        <span>Curadoria Oficial CuritiPão</span>
        <span>•</span>
        <span>Novembro de 2026</span>
        <span>•</span>
        <span>Fotografias por <em>Lorena Lenara Batista</em></span>
      </div>

      <!-- Imagem de Destaque / Abertura -->
      <figure class="roteiro-bakery-figure" style="border-radius: var(--radius-lg); margin-bottom: 35px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
        <img src="/assets/photos/curitipao-111.jpg" alt="Pães artesanais de fermentação natural de Curitiba" class="roteiro-bakery-img" style="max-height: 440px;" loading="eager">
        <figcaption class="roteiro-bakery-caption">
          <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          <span style="font-size: 0.82rem; color: var(--color-text-muted);">Pães artesanais de fermentação natural de Curitiba</span>
        </figcaption>
      </figure>

      <!-- Introdução Original Integral -->
      <div class="roteiro-lead-intro">
        <p>Curitiba tem padarias centenárias, pequenos ateliês escondidos em ruas tranquilas, casas especializadas em fermentação natural e panificadoras onde ainda é possível encontrar aqueles clássicos que fazem parte da memória da cidade. Algumas são perfeitas para comprar o pão do dia; outras convidam a sentar, pedir um café e acompanhar o movimento das fornadas.</p>
        <p>A primeira edição do Festival CuritiPão reuniu 15 dessas padarias e ajudou a mostrar a diversidade da panificação curitibana. Agora, elas também formam o ponto de partida do guia permanente do CuritiPão, criado para apresentar os pães, as histórias e as pessoas que movimentam os fornos da cidade durante o ano inteiro.</p>
        <p>Este roteiro não é um ranking. É uma seleção construída a partir das padarias que participaram da primeira edição do festival, acrescida das minhas percepções e experiências em cada endereço. Organizei as casas por bairros para facilitar a escolha e ajudar você a descobrir novos lugares.</p>
      </div>

      <!-- Índice Navegável por Bairros e Padarias -->
      <nav class="roteiro-toc-card" aria-label="Índice do roteiro">
        <h2 class="roteiro-toc-title" style="margin-top: 0;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Índice do Roteiro (10 Bairros & 15 Padarias)
        </h2>
        <p class="roteiro-toc-desc">Selecione uma padaria para navegar direto até a apresentação e informações de endereço:</p>
        <div class="roteiro-toc-grid">
          <a href="#aquarius-panificadora" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Bacacheri</span>
            <span class="roteiro-toc-padaria">Aquarius Panificadora</span>
          </a>
          <a href="#piegel-paes" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Cabral</span>
            <span class="roteiro-toc-padaria">Piegel Pães</span>
          </a>
          <a href="#padaria-requinte" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Cabral • Bigorrilho</span>
            <span class="roteiro-toc-padaria">Padaria Requinte</span>
          </a>
          <a href="#sphair-atelie-de-paes" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Ahú • Bigorrilho</span>
            <span class="roteiro-toc-padaria">Sphair Ateliê de Pães</span>
          </a>
          <a href="#aqui-na-mata" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Juvevê</span>
            <span class="roteiro-toc-padaria">Aqui na Mata</span>
          </a>
          <a href="#felipane" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Juvevê</span>
            <span class="roteiro-toc-padaria">Felipane</span>
          </a>
          <a href="#haiat-atelie-do-pao" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Juvevê</span>
            <span class="roteiro-toc-padaria">Haiat Ateliê do Pão</span>
          </a>
          <a href="#confraria-dos-paes" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Alto da XV</span>
            <span class="roteiro-toc-padaria">Confraria dos Pães</span>
          </a>
          <a href="#fabrika-paes" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Alto da XV</span>
            <span class="roteiro-toc-padaria">Fábrika Pães</span>
          </a>
          <a href="#maca-organica-padaria" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Alto da XV • Água Verde • Vila Izabel</span>
            <span class="roteiro-toc-padaria">Maçã Orgânica Padaria</span>
          </a>
          <a href="#bonin-bakery" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Centro</span>
            <span class="roteiro-toc-padaria">Bonin Bakery</span>
          </a>
          <a href="#padaria-america" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">São Francisco</span>
            <span class="roteiro-toc-padaria">Padaria América</span>
          </a>
          <a href="#fabiano-marcolini-alimentari" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Batel</span>
            <span class="roteiro-toc-padaria">Fabiano Marcolini Alimentari</span>
          </a>
          <a href="#saint-germain-panificadora" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Batel • Ecoville</span>
            <span class="roteiro-toc-padaria">Saint Germain Panificadora</span>
          </a>
          <a href="#padaria-familia-farinha" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Jardim Social</span>
            <span class="roteiro-toc-padaria">Padaria Família Farinha</span>
          </a>
        </div>
        <div style="margin-top: 14px; text-align: right;">
          <a href="#como-usar-o-guia" style="font-size: 0.88rem; color: var(--color-primary); font-weight: 600;">Ir para: Como usar o Guia CuritiPão &darr;</a>
        </div>
      </nav>

      <!-- 1. BACACHERI -->
      <header class="roteiro-bairro-header">
        <h2>Bacacheri</h2>
        <span class="roteiro-bairro-badge">Zona Norte</span>
      </header>

      <article class="roteiro-bakery-item" id="aquarius-panificadora">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/aquarius-inteiro.jpg" alt="Pão Floresta Negra da Aquarius Panificadora" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Aquarius Panificadora</h3>
          <div class="roteiro-bakery-text">
            <p>A Aquarius mantém atendimento 24 horas, algo raro entre as panificadoras de Curitiba. É aquele endereço para encontrar pão fresco, doces, salgados e produtos de confeitaria a qualquer hora do dia, inclusive quando a vontade aparece fora dos horários convencionais.</p>
            <p>Na primeira edição do Festival CuritiPão, a Aquarius apresentou o Pão Floresta Negra, que uniu fermentação natural, cacau, chocolate, cereja desidratada e castanha-do-pará. A criação faz parte do arquivo histórico do festival e mostrou como uma panificadora tradicional também pode explorar combinações autorais.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Avenida Prefeito Erasto Gaertner, 363 – Bacacheri.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#aquarius-panificadora" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 2. CABRAL -->
      <header class="roteiro-bairro-header">
        <h2>Cabral</h2>
        <span class="roteiro-bairro-badge">Zona Norte</span>
      </header>

      <article class="roteiro-bakery-item" id="piegel-paes">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/piegel-inteiro.jpg" alt="Pão Doce de Laranja da Piegel Pães" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Piegel Pães</h3>
          <div class="roteiro-bakery-text">
            <p>O pão francês fresquinho e crocante está entre os produtos mais conhecidos da Piegel, mas vale olhar o balcão com atenção. Entre os mais vendidos também aparecem o pão de ovos, a broa de castanhas, o pão de azeitonas e queijos e a broa fit, preparada sem gordura e sem açúcar.</p>
            <p>É uma padaria para quem gosta de variedade e ainda valoriza aqueles pães que fazem parte da rotina, seja para o café da manhã, seja para levar para casa no fim do dia.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Avenida Anita Garibaldi, 590 – Cabral.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#piegel-paes" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <article class="roteiro-bakery-item" id="padaria-requinte">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/requinte-inteiro.jpg" alt="Pão de Chocolate com Café da Padaria Requinte" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Padaria Requinte</h3>
          <div class="roteiro-bakery-text">
            <p>Fundada em 1984, a Padaria Requinte faz parte da história da panificação de Curitiba há mais de quatro décadas. Com unidades no Cabral e no Bigorrilho, na região do Champagnat, a marca construiu sua reputação unindo uma produção tradicional a um cardápio que acompanhou as mudanças da cidade.</p>
            <p>Entre as especialidades, os minissonhos merecem atenção. Pequenos, delicados e difíceis de provar apenas uma vez, eles se transformaram em verdadeiros tesouros da confeitaria da casa.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereços:</strong>
            <ul class="roteiro-address-list">
              <li>Cabral: Rua Recife, 34;</li>
              <li>Bigorrilho: Rua Francisco Rocha, 1809.</li>
            </ul>
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#padaria-requinte" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 3. AHÚ E BIGORRILHO -->
      <header class="roteiro-bairro-header">
        <h2>Ahú e Bigorrilho</h2>
        <span class="roteiro-bairro-badge">Norte & Oeste</span>
      </header>

      <article class="roteiro-bakery-item" id="sphair-atelie-de-paes">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/Bagel - Sphair 4.jpg" alt="Bagel de Cebola e Provolone do Sphair Ateliê de Pães" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Sphair Ateliê de Pães</h3>
          <div class="roteiro-bakery-text">
            <p>Com duas lojas em Curitiba, a Sphair apresenta um repertório interessante de pães de longa fermentação, recheados, doces e salgados. É uma casa para quem gosta de observar a massa, a textura e as combinações usadas em cada receita.</p>
            <p>Na primeira edição do CuritiPão, a padaria criou um bagel de cebola e provolone, preparado com fermentação natural, cebola crocante, queijo e gergelim. A proposta representou bem essa mistura entre técnica e sabores marcantes encontrada no balcão da Sphair.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereços:</strong>
            <ul class="roteiro-address-list">
              <li>Ahú: Rua Tomazina, 345, Loja 7;</li>
              <li>Bigorrilho: Rua Professor Fernando Moreira, 951.</li>
            </ul>
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#sphair-atelie-de-paes" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 4. JUVEVÊ -->
      <header class="roteiro-bairro-header">
        <h2>Juvevê</h2>
        <span class="roteiro-bairro-badge">Polo Gastronômico</span>
      </header>

      <article class="roteiro-bakery-item" id="aqui-na-mata">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/Rolinho Tiramisu - Aqui na Mata 12.jpg" alt="Rolinho Tiramisu da Aqui na Mata" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Aqui na Mata</h3>
          <div class="roteiro-bakery-text">
            <p>A Aqui na Mata é uma pequena padaria vegana capaz de conquistar mesmo quem não segue uma alimentação exclusivamente vegetal. O cuidado com as massas e os recheios aparece em produtos saborosos e delicados, preparados sem ingredientes de origem animal.</p>
            <p>O Rolinho Tiramisu apresentado no Festival CuritiPão foi uma das criações mais curiosas da edição, mas a focaccia da casa também está entre as minhas escolhas. É um lugar que prova que a panificação vegana pode ser criativa, bonita e, principalmente, muito gostosa.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Rua Alberto Folloni, 220, Loja 1 – Juvevê.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#aqui-na-mata" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <article class="roteiro-bakery-item" id="felipane">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/Babka de Nutella e Pistache - FELIPANE 5.jpg" alt="Babka de Nutella e Pistache da Felipane" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Felipane</h3>
          <div class="roteiro-bakery-text">
            <p>Instalada em uma casa charmosa com jardim, a Felipane parece feita para um café da manhã tranquilo aos sábados ou para uma pausa durante a tarde nos dias de semana.</p>
            <p>A produção reúne pães, brioches e viennoiseries, com uma variedade que muda conforme as fornadas. É bom chegar cedo ou acompanhar os horários divulgados pela casa, porque alguns dos produtos mais disputados podem esgotar rapidamente.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Rua Cândido Mader, 81 – Juvevê.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#felipane" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <article class="roteiro-bakery-item" id="haiat-atelie-do-pao">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/Fougasse de primavera - Haiat 1.jpg" alt="Fougasse de Primavera do Haiat Ateliê do Pão" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Haiat Ateliê do Pão</h3>
          <div class="roteiro-bakery-text">
            <p>Inaugurada em janeiro de 2023, a Haiat parece saída de um livro. A padaria é pequena, cercada de verde e instalada em um endereço charmoso do Juvevê.</p>
            <p>As fornadas diárias costumam acabar rápido, o que já diz bastante sobre a relação que a casa construiu com o bairro. Além de comprar pães para levar, vale aproveitar o ambiente para um café da tarde sem pressa.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Rua Constantino Marochi, 658 – Juvevê.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#haiat-atelie-do-pao" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 5. ALTO DA XV -->
      <header class="roteiro-bairro-header">
        <h2>Alto da XV</h2>
        <span class="roteiro-bairro-badge">Tradição & Autoria</span>
      </header>

      <article class="roteiro-bakery-item" id="confraria-dos-paes">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/baguete veneza - integral - Confraria 1.jpg" alt="Baguete Veneza Integral da Confraria dos Pães" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Confraria dos Pães</h3>
          <div class="roteiro-bakery-text">
            <p>A Confraria dos Pães é comandada pelo padeiro Andrea, um legítimo italiano de Veneza que leva diferentes referências europeias para suas receitas.</p>
            <p>Além dos pães, a casa trabalha com charcutaria e prepara sanduíches que justificam novas visitas. Como fica em uma rua tranquila do Alto da XV, também é um endereço agradável para sentar e aproveitar o café da tarde.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Rua Atílio Bório, 1307 – Alto da XV.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#confraria-dos-paes" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <article class="roteiro-bakery-item" id="fabrika-paes">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/PÃ£o de Campanha - Fabrika PÃ£es - 01.jpg" alt="Pão de Campanha com abóbora da Fábrika Pães" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Fábrika Pães</h3>
          <div class="roteiro-bakery-text">
            <p>A Fábrika se apresenta como pioneira da fermentação natural em Curitiba e ajudou a aproximar esse tipo de panificação do público da cidade.</p>
            <p>Atualmente, a produção é limitada e distribuída ao longo do dia. A casa reúne pães premiados e receitas que valorizam fermentações mais longas, sabor pronunciado e textura. Para encontrar uma fornada específica, vale consultar antecipadamente a programação da padaria.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Rua Schiller, 1341 – Alto da XV.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#fabrika-paes" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 6. ALTO DA XV, ÁGUA VERDE E VILA IZABEL -->
      <header class="roteiro-bairro-header">
        <h2>Alto da XV, Água Verde e Vila Izabel</h2>
        <span class="roteiro-bairro-badge">Três Unidades</span>
      </header>

      <article class="roteiro-bakery-item" id="maca-organica-padaria">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/maca-organica-inteiro.jpg" alt="Sonho artesanal da Maçã Orgânica Padaria" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Maçã Orgânica Padaria</h3>
          <div class="roteiro-bakery-text">
            <p>A Maçã está entre as pioneiras dos pães de longa fermentação em Curitiba e atualmente possui três lojas na cidade. Também ficou conhecida como a “padaria dos sonhos” — literalmente — pela variedade e pela apresentação desse clássico.</p>
            <p>Os sonhos merecem fama, mas os croissants e os pães da casa também precisam entrar no radar. Outro destaque é o pão de queijo com cúrcuma, que já recebeu o reconhecimento de melhor da cidade.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereços:</strong>
            <ul class="roteiro-address-list">
              <li>Alto da XV: Rua Fernando Amaro, 802-B;</li>
              <li>Água Verde, próximo à Praça do Japão: Avenida Sete de Setembro, 4979;</li>
              <li>Vila Izabel: Rua Professor Sebastião Paraná, 195.</li>
            </ul>
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#maca-organica-padaria" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 7. CENTRO -->
      <header class="roteiro-bairro-header">
        <h2>Centro</h2>
        <span class="roteiro-bairro-badge">Região Central</span>
      </header>

      <article class="roteiro-bakery-item" id="bonin-bakery">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/bonin-inteiro.jpg" alt="Pão do Bosque da Bonin Bakery" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Bonin Bakery</h3>
          <div class="roteiro-bakery-text">
            <p>A Bonin é uma padaria boutique com atmosfera parisiense e uma vitrine capaz de mudar o ritmo de qualquer caminhada pelo Centro.</p>
            <p>A casa é especializada em pães de fermentação natural, viennoiseries, doces refinados e cafés especiais. Existe cuidado tanto no preparo quanto na apresentação das receitas. E faço aqui uma indicação pessoal: o croissant da Bonin está entre os meus preferidos em Curitiba.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Alameda Prudente de Moraes, 995 – Centro.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#bonin-bakery" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 8. SÃO FRANCISCO -->
      <header class="roteiro-bairro-header">
        <h2>São Francisco</h2>
        <span class="roteiro-bairro-badge">Centro Histórico</span>
      </header>

      <article class="roteiro-bakery-item" id="padaria-america">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/Padaria AmÃ©rica â€” BroaBrie 01.jpg" alt="BroaBrie da Padaria América" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Padaria América</h3>
          <div class="roteiro-bakery-text">
            <p>Fundada em 1913, a Padaria América é um dos estabelecimentos mais antigos e tradicionais de Curitiba. Entrar na casa é também entrar em contato com uma parte da história da cidade.</p>
            <p>A broa de centeio é o grande carro-chefe e atravessa gerações de clientes. Durante o Festival CuritiPão, essa tradição deu origem à BroaBrie, uma versão com damasco, nozes e queijo brie. Mesmo fora do período do festival, a broa tradicional continua sendo uma prova obrigatória para quem visita a padaria.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Rua Presidente Carlos Cavalcanti, 942 – São Francisco.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#padaria-america" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 9. BATEL -->
      <header class="roteiro-bairro-header">
        <h2>Batel</h2>
        <span class="roteiro-bairro-badge">Gastronomia & Confeitaria</span>
      </header>

      <article class="roteiro-bakery-item" id="fabiano-marcolini-alimentari">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/Ciabatta recheado - Marcolini 4.jpg" alt="Ciabatta recheada do chef Fabiano Marcolini" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Fabiano Marcolini Alimentari</h3>
          <div class="roteiro-bakery-text">
            <p>Desde 1996, o chef Fabiano Marcolini, ao lado da esposa, Alaide, constrói uma trajetória que transita entre restaurante, confeitaria e panificação. Apesar das diferentes frentes, os pães ocupam um lugar essencial na identidade da casa.</p>
            <p>Há uma boa variedade de pães frescos diariamente. No Natal, o panettone de Fabiano Marcolini é praticamente obrigatório; durante o restante do ano, a broinha de fubá é uma daquelas receitas aparentemente simples que roubam a cena.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Alameda Dr. Carlos de Carvalho, 1181 – Batel.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#fabiano-marcolini-alimentari" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <article class="roteiro-bakery-item" id="saint-germain-panificadora">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/CIABATTA C_ CALABRESA - SAINT GERMAIN 1.jpg" alt="Ciabatta de Calabresa da Saint Germain Panificadora" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Saint Germain Panificadora</h3>
          <div class="roteiro-bakery-text">
            <p>A Saint Germain possui unidades no Batel e no Ecoville. Além da produção de panificação e confeitaria, as duas lojas oferecem café colonial.</p>
            <p>A unidade do Ecoville também conta com um grande empório, no qual os produtos da casa dividem espaço com diferentes itens para levar. É um bom endereço para encontrar chineques, sonhos e pães tradicionais, além de sentar para um café com bastante variedade.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereços:</strong>
            <ul class="roteiro-address-list">
              <li>Batel: Avenida Visconde de Guarapuava, 4882;</li>
              <li>Ecoville: Rua Professor Pedro Viriato Parigot de Souza, 2748.</li>
            </ul>
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#saint-germain-panificadora" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 10. JARDIM SOCIAL -->
      <header class="roteiro-bairro-header">
        <h2>Jardim Social</h2>
        <span class="roteiro-bairro-badge">Tradição Familiar</span>
      </header>

      <article class="roteiro-bakery-item" id="padaria-familia-farinha">
        <figure class="roteiro-bakery-figure">
          <img src="/assets/photos/familia-farinha-inteiro.jpg" alt="Pão de Trigo 100% Integral da Padaria Família Farinha" class="roteiro-bakery-img" loading="lazy">
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Foto: Lorena Lenara Batista</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Padaria Família Farinha</h3>
          <div class="roteiro-bakery-text">
            <p>A história da Família Farinha começou em 1956, no interior de São Paulo, quando o negócio ainda funcionava como um empório. A transformação em padaria aconteceu na década de 1970, e a marca criou raízes em Curitiba em 1992.</p>
            <p>Administrada pela mesma família há quase sete décadas, a padaria reúne tradição, cuidado e um balcão que convida a levar mais de um produto para casa. No endereço atual, o espaço mais amplo também permite aproveitar o café da tarde com tranquilidade.</p>
          </div>
          <div class="roteiro-creation-disclaimer">
            <span class="disclaimer-bullet" aria-hidden="true">&#9432;</span>
            <span>Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</span>
          </div>
          <div class="roteiro-address-box">
            <strong>Endereço:</strong> Avenida Nossa Senhora da Luz, 2315 – Jardim Social.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/festival/2026/#padaria-familia-farinha" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">Ver no Arquivo 2026 &rarr;</a>
              <a href="/padarias/" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Consultar no Guia &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- COMO USAR O GUIA CURITIPÃO -->
      <section class="roteiro-how-to-use" id="como-usar-o-guia">
        <h2>Como usar o Guia CuritiPão</h2>
        <p>Os produtos criados especialmente para o Festival CuritiPão 2026 pertencem ao arquivo histórico da primeira edição e não necessariamente continuam disponíveis no cardápio. As padarias, porém, permanecem no guia com suas especialidades, histórias e informações de atendimento.</p>
        <p>Antes de sair, consulte o <a href="https://curitipao.com.br/padarias/">Guia de Padarias do CuritiPão</a>. Nele você poderá conferir os horários de funcionamento, perfis no Instagram e mapas para chegar a cada estabelecimento.</p>
        <p>Você pode começar pelo próprio bairro, montar um roteiro com endereços próximos ou escolher uma padaria pela especialidade que mais desperta sua curiosidade. O importante é continuar descobrindo os pães e as histórias produzidos diariamente em Curitiba.</p>
        <div style="margin-top: 24px;">
          <a href="/padarias/" class="btn btn-primary" style="display: inline-block;">Acessar o Guia de Padarias Oficial &rarr;</a>
        </div>
      </section>

      ${invitation(invitationArticle, 'Tem uma padaria em Curitiba e quer apresentá-la ao CuritiPão? Veja como enviar as informações da sua casa.')}

      <!-- Rodapé do Artigo / Navegação de Roteiros -->
      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <a href="/roteiros/" class="btn btn-secondary">&larr; Ver todos os Roteiros</a>
        <a href="#conteudo-principal" class="btn btn-secondary">&uarr; Voltar ao Topo da Matéria</a>
      </div>
    </div>
  </section>
`;

const roteiro15PadariasHtml = wrapPage({
  title: 'Padarias em Curitiba: 15 lugares para conhecer por bairro',
  description: 'Conheça 15 padarias em Curitiba, organizadas por bairro, com dicas de pães, viennoiseries, cafés e especialidades de cada casa.',
  canonical: '/roteiros/padarias-em-curitiba-por-bairro/',
  activeRoute: '/roteiros/',
  ogType: 'article',
  ogImage: 'https://curitipao.com.br/assets/photos/curitipao-111.jpg',
  schemaJson: roteiro15PadariasSchema,
  content: roteiro15PadariasContent
});
fs.writeFileSync('./roteiros/padarias-em-curitiba-por-bairro/index.html', roteiro15PadariasHtml, 'utf8');
console.log('Generated roteiros/padarias-em-curitiba-por-bairro/index.html');

// -------------------------------------------------------------
// PAGE 6: MODELO DE ROTEIRO INDIVIDUAL (/roteiros/modelo/)
// -------------------------------------------------------------
ensureDir('./roteiros/modelo');
const modeloRoteiroContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <a href="/roteiros/">Roteiros</a>
        <span class="sep">/</span>
        <span aria-current="page">Modelo de Roteiro</span>
      </nav>
      <span class="badge badge-gold" style="margin-bottom: 12px;">Estrutura Editorial</span>
      <h1>Modelo de Roteiro Gastronômico</h1>
      <p class="lead">
        Estrutura de apresentação de um percurso temático por padarias de Curitiba, combinando contexto do trajeto, paradas recomendadas e mapa.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 900px;">
      <article class="form-card" style="padding: 40px;">
        <div style="margin-bottom: 24px; border-bottom: 1px solid var(--color-border); padding-bottom: 20px;">
          <span class="badge badge-brown" style="margin-bottom: 8px;">Tempo sugerido: 3 horas • A pé ou de bicicleta</span>
          <h2 style="font-size: 2rem; color: var(--color-primary); margin-bottom: 8px;">Roteiro de Pães Artesanais: Centro & Juvevê</h2>
          <p style="color: var(--color-text-muted);">Uma caminhada deliciosa entre cafés, fornos a lenha e pães de fermentação lenta.</p>
        </div>

        <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 30px;">
          Este modelo exemplifica como os roteiros aprovados serão apresentados aos leitores do CuritiPão: com distância, paradas sugeridas em ordem lógica de visitação, dicas sobre os melhores horários de fornadas e recomendações de produtos de cada balcão.
        </p>

        <h3 style="margin-bottom: 16px;">Paradas do Trajeto</h3>

        <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 35px;">
          <!-- Parada 1 -->
          <div style="display: flex; gap: 20px; align-items: flex-start; background: var(--color-bg); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="background: var(--color-primary); color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">1</div>
            <div>
              <h4 style="font-size: 1.15rem; margin-bottom: 6px;">Ponto de Partida: Café & Croissant</h4>
              <p style="font-size: 0.92rem; color: var(--color-text-muted); margin-bottom: 8px;">
                Comece o dia com uma xícara de café coado e um folhado recém-saído do forno para abrir o apetite.
              </p>
              <span class="badge badge-gold" style="font-size: 0.75rem;">Horário recomendado: 08h30</span>
            </div>
          </div>

          <!-- Parada 2 -->
          <div style="display: flex; gap: 20px; align-items: flex-start; background: var(--color-bg); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="background: var(--color-primary); color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">2</div>
            <div>
              <h4 style="font-size: 1.15rem; margin-bottom: 6px;">O Forno Rústico: Pão de Campanha</h4>
              <p style="font-size: 0.92rem; color: var(--color-text-muted); margin-bottom: 8px;">
                Segunda parada para garantir aquele pão de casca dura para levar para casa. Observe a vitrine de sourdough.
              </p>
              <span class="badge badge-gold" style="font-size: 0.75rem;">Horário recomendado: 10h00</span>
            </div>
          </div>
        </div>

        <div style="background: var(--color-bg-alt); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--color-border); text-align: center;">
          <h4 style="margin-bottom: 8px;">Tem uma sugestão de rota?</h4>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 16px;">
            Ajude a equipe a criar os próximos roteiros publicados no portal.
          </p>
          <a href="/contato/#indicar" class="btn btn-primary" style="font-size: 0.85rem;">Enviar sugestão</a>
        </div>
      </article>
    </div>
  </section>
`;

const modeloRoteiroHtml = wrapPage({
  title: 'Modelo de Roteiro Gastronômico',
  description: 'Conheça o formato editorial dos roteiros de padarias de Curitiba no CuritiPão.',
  canonical: '/roteiros/modelo/',
  activeRoute: '/roteiros/',
  extraHead: '<meta name="robots" content="noindex, follow">',
  content: modeloRoteiroContent
});
fs.writeFileSync('./roteiros/modelo/index.html', modeloRoteiroHtml, 'utf8');
console.log('Generated roteiros/modelo/index.html');

// -------------------------------------------------------------
// PAGE 7: BLOG (/blog/)
// -------------------------------------------------------------
ensureDir('./blog');
const blogContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Blog</span>
      </nav>
      <h1>Pães, padarias e histórias de Curitiba</h1>
      <p class="lead">
        Conteúdo editorial sobre os fornos da cidade, as técnicas artesanais, as novidades e a trajetória de quem faz a panificação curitibana acontecer.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <!-- BARRA DE BUSCA E CATEGORIAS OFICIAIS -->
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 24px; margin-bottom: 40px; box-shadow: var(--shadow-sm);">
        <div style="margin-bottom: 20px;">
          <label for="blog-search" class="form-label">Buscar artigos:</label>
          <input type="text" id="blog-search" class="form-input" placeholder="Pesquisar por título ou tema...">
        </div>

        <div>
          <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); display: block; margin-bottom: 10px;">
            Categorias Editoriais:
          </span>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button type="button" class="btn btn-secondary blog-filter-btn active" data-category="all" style="padding: 6px 14px; font-size: 0.82rem;">Todas as Categorias</button>
            <button type="button" class="btn btn-secondary blog-filter-btn" data-category="Novidades e festival" style="padding: 6px 14px; font-size: 0.82rem;">Novidades e festival</button>
            <button type="button" class="btn btn-secondary blog-filter-btn" data-category="Padarias e pessoas" style="padding: 6px 14px; font-size: 0.82rem;">Padarias e pessoas</button>
            <button type="button" class="btn btn-secondary blog-filter-btn" data-category="Receitas" style="padding: 6px 14px; font-size: 0.82rem;">Receitas</button>
            <button type="button" class="btn btn-secondary blog-filter-btn" data-category="Roteiros" style="padding: 6px 14px; font-size: 0.82rem;">Roteiros</button>
            <button type="button" class="btn btn-secondary blog-filter-btn" data-category="Pães e sabores" style="padding: 6px 14px; font-size: 0.82rem;">Pães e sabores</button>
          </div>
        </div>
      </div>

      <!-- LISTAGEM DE ARTIGOS -->
      <div class="card-grid blog-grid">
        <!-- Artigo 1 Publicado -->
        <article class="card-editorial blog-card" data-title="O CuritiPão continua: do roteiro ao festival, agora um guia permanente" data-summary="O projeto que reuniu 15 padarias de Curitiba em 2026 agora se transforma em uma plataforma permanente sobre a cultura do pão." data-category="Novidades e festival">
          <div class="card-media">
            <img src="/assets/photos/curitipao-108 (1).jpg" alt="Pães e fornos de Curitiba" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-tag">Novidades e festival</span>
            <h3 class="card-title">
              <a href="/blog/o-curitipao-continua/">O CuritiPão continua: do roteiro ao festival, agora um guia permanente</a>
            </h3>
            <p class="card-desc">
              O projeto que reuniu 15 padarias de Curitiba em 2026 agora se transforma em uma plataforma permanente sobre a cultura do pão e as histórias de quem assa na capital paranaense.
            </p>
            <div class="card-footer">
              <span style="color: var(--color-text-light); font-size: 0.8rem;">Curadoria CuritiPão</span>
              <a href="/blog/o-curitipao-continua/" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">Ler artigo &rarr;</a>
            </div>
          </div>
        </article>
${renderBlogCards()}
      </div>

      <!-- ESTADO VAZIO DO BLOG -->
      <div id="blog-empty-state" style="display: none; text-align: center; padding: 60px 20px; background: var(--color-surface); border-radius: var(--radius-md); border: 1px dashed var(--color-border); margin-top: 20px;">
        <h3>Nenhum artigo encontrado</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 20px;">Nenhuma publicação corresponde à sua busca ou filtro selecionado.</p>
        <button type="button" class="btn btn-primary" onclick="document.getElementById('blog-search').value=''; document.querySelector('.blog-filter-btn[data-category=all]').click();">Ver todos os artigos</button>
      </div>

      <!-- AVISO DE NOVAS PAUTAS EM PRODUÇÃO -->
      <div style="margin-top: 60px; background: var(--color-bg-alt); padding: 35px; border-radius: var(--radius-md); border: 1px solid var(--color-border); text-align: center;">
        <h3 style="margin-bottom: 10px;">Novas reportagens em produção</h3>
        <p style="color: var(--color-text-muted); max-width: 640px; margin: 0 auto;">
          Nossa equipe está em contato com padeiros, mestres de fermentação e pesquisadores de Curitiba apurando as próximas matérias exclusivas.
        </p>
      </div>
    </div>
  </section>
`;

const blogHtml = wrapPage({
  title: 'Blog • Pães, padarias e histórias de Curitiba',
  description: 'Leia artigos, reportagens e histórias sobre a panificação de Curitiba no Blog oficial do CuritiPão.',
  canonical: '/blog/',
  activeRoute: '/blog/',
  content: blogContent
});
fs.writeFileSync('./blog/index.html', blogHtml, 'utf8');
console.log('Generated blog/index.html');

// -------------------------------------------------------------
// PAGE 8: ARTIGO INAUGURAL (/blog/o-curitipao-continua/)
// -------------------------------------------------------------
ensureDir('./blog/o-curitipao-continua');
const artigoContent = `
  <section class="page-intro-header">
    <div class="container" style="max-width: 860px;">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <a href="/blog/">Blog</a>
        <span class="sep">/</span>
        <span aria-current="page">O CuritiPão Continua</span>
      </nav>
      <span class="badge badge-gold" style="margin-bottom: 12px;">Novidades e festival</span>
      <h1 style="font-size: clamp(2rem, 4vw, 2.8rem); margin-bottom: 16px;">
        O CuritiPão continua: do roteiro ao festival, agora um guia permanente
      </h1>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 14px; font-size: 0.9rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 14px;">
        <span>Por <strong>Curadoria CuritiPão</strong></span>
        <span>•</span>
        <time datetime="2026-11-01">Novembro de 2026</time>
        <span>•</span>
        <span>Leitura: 3 min</span>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 860px;">
      <!-- Capa com Fotografia Real -->
      <figure style="margin-bottom: 40px; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
        <img src="/assets/photos/curitipao-108 (1).jpg" alt="Fornos e pães artesanais do acervo CuritiPão" style="width: 100%; height: auto; max-height: 480px; object-fit: cover;">
        <figcaption class="photo-credit">
          <em>Foto: Lorena Lenara Batista</em>
        </figcaption>
      </figure>

      <!-- Corpo do Artigo -->
      <article style="font-size: 1.15rem; line-height: 1.85; color: var(--color-text);">
        <p style="font-size: 1.25rem; font-weight: 500; color: var(--color-primary); margin-bottom: 1.8rem;">
          Quando o CuritiPão foi concebido, a meta era dar voz aos aromas e às texturas das melhores padarias da capital paranaense. Nascido a partir dos roteiros do Curitidoce, o projeto ganhou em 2026 sua primeira edição no formato de festival.
        </p>

        <p>
          Durante o festival, 15 padarias de Curitiba aceitaram o desafio de criar receitas especiais, valorizando ingredientes regionais, processos de fermentação natural e técnicas de alta confeitaria e panificação. O público respondeu lotando os balcões, compartilhando descobertas e provando que Curitiba tem uma cultura de panificação sólida, criativa e em plena expansão.
        </p>

        <h2 style="font-size: 1.6rem; margin-top: 40px; margin-bottom: 18px; color: var(--color-primary);">
          A Necessidade de um Guia Permanente
        </h2>

        <p>
          Com o encerramento da temporada 2026 do festival, ficou evidente que a conversa sobre pão não poderia se restringir a apenas dez dias no ano. Os curitibanos compram pão todos os dias; os padeiros alimentam seus fermentos de madrugada; e novos fornos artesanais continuam surgindo em bairros como Juvevê, Batel, Alto da XV, Centro e Cabral.
        </p>

        <p>
          Por essa razão, o CuritiPão agora amplia sua atuação para ser uma plataforma anual e permanente. O portal reunirá:
        </p>

        <ul style="list-style: disc; padding-left: 24px; margin-bottom: 26px;">
          <li style="margin-bottom: 8px;"><strong>Guia de Padarias:</strong> Informações confiáveis de atendimento, bairros e especialidades de cada casa;</li>
          <li style="margin-bottom: 8px;"><strong>Roteiros Temáticos:</strong> Sugestões de passeios a pé ou de bicicleta para descobrir pães por regiões da cidade;</li>
          <li style="margin-bottom: 8px;"><strong>Cobertura Editorial:</strong> Reportagens sobre técnicas, ingredientes e o perfil dos mestres padeiros;</li>
          <li style="margin-bottom: 8px;"><strong>Arquivo Histórico:</strong> Preservação de todas as criações da edição pioneira do festival de 2026.</li>
        </ul>

        <p>
          O Festival CuritiPão continuará acontecendo como o grande encontro anual da panificação curitibana, mas a celebração do pão bem feito agora faz parte do dia a dia da cidade.
        </p>

        <div style="margin-top: 50px; padding: 26px; background: var(--color-bg-alt); border-radius: var(--radius-md); border-left: 4px solid var(--color-accent);">
          <h3 style="font-size: 1.15rem; margin-bottom: 8px;">Explore o novo portal</h3>
          <p style="font-size: 0.95rem; margin-bottom: 16px;">
            Conheça as 15 participantes da edição de estreia e acompanhe a evolução do guia permanente de padarias de Curitiba.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <a href="/padarias/" class="btn btn-primary" style="font-size: 0.85rem;">Acessar Guia de Padarias</a>
            <a href="/festival/2026/" class="btn btn-secondary" style="font-size: 0.85rem;">Ver Arquivo do Festival 2026</a>
          </div>
        </div>
      </article>
    </div>
  </section>
`;

const artigoHtml = wrapPage({
  title: 'O CuritiPão continua: do roteiro ao festival, agora um guia permanente',
  description: 'Conheça a história e a nova fase do CuritiPão, agora estabelecido como guia permanente da panificação curitibana durante o ano todo.',
  canonical: '/blog/o-curitipao-continua/',
  activeRoute: '/blog/',
  ogImage: 'https://curitipao.com.br/assets/photos/curitipao-108%20(1).jpg',
  content: artigoContent,
  schemaJson: {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "O CuritiPão continua: do roteiro ao festival, agora um guia permanente",
    "image": "https://curitipao.com.br/assets/photos/curitipao-108 (1).jpg",
    "datePublished": "2026-11-01",
    "author": {
      "@type": "Organization",
      "name": "Curadoria CuritiPão"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CuritiPão",
      "logo": {
        "@type": "ImageObject",
        "url": "https://curitipao.com.br/assets/logos/curitipao-logo.png"
      }
    }
  }
});
fs.writeFileSync('./blog/o-curitipao-continua/index.html', artigoHtml, 'utf8');
console.log('Generated blog/o-curitipao-continua/index.html');
writeBlogArticles(wrapPage);

// -------------------------------------------------------------
// PAGE 9: FESTIVAL HUB (/festival/)
// -------------------------------------------------------------
ensureDir('./festival');
const festivalHubContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Festival</span>
      </nav>
      <h1>O Festival CuritiPão</h1>
      <p class="lead">
        O principal encontro anual da panificação curitibana, reunindo padarias artesanais, criações exclusivas e os apreciadores do pão bem feito.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 900px;">
      <!-- Card da Edição 2026 em Destaque de Honra -->
      <div class="continuity-banner" style="margin-bottom: 50px;">
        <div class="continuity-content">
          <span class="badge badge-gold" style="margin-bottom: 12px;">Edição Histórica • 2026</span>
          <h2 class="continuity-title">A Primeira Edição do Festival CuritiPão</h2>
          <p class="continuity-text">
            De 20 a 30 de outubro de 2026, 15 padarias de Curitiba participaram do primeiro festival de pães da cidade, apresentando receitas exclusivas criadas especialmente para o evento. Todas as informações históricas, fotos dos produtos e dados da edição estão integralmente preservados.
          </p>
          <div class="continuity-actions" style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 24px; align-items: center;">
            <a href="/festival/2026/" class="btn btn-primary" style="background-color: var(--color-accent); color: #140F0D; font-weight: 700; padding: 12px 24px; font-size: 0.95rem; border-radius: var(--radius-sm); text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
              <span>Acessar o arquivo completo do Festival 2026</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
            <a href="/festival/2026/#imprensa" class="btn btn-secondary" style="background-color: #FAF4EC; color: #5D3323; font-weight: 700; padding: 12px 24px; font-size: 0.95rem; border: 2.5px solid #D08942; border-radius: var(--radius-sm); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
              <span>Ver repercussão na imprensa</span>
            </a>
          </div>
        </div>
      </div>

      <!-- CARD DESTAQUE DEDICADO: REPERCUSSÃO NA IMPRENSA -->
      <div class="press-hub-callout" style="background: var(--color-surface); border: 1.5px solid var(--color-border); border-left: 5px solid var(--color-accent); border-radius: var(--radius-md); padding: 26px 30px; margin-bottom: 50px; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div style="max-width: 580px;">
          <span class="badge badge-gold" style="margin-bottom: 10px;">Cobertura Jornalística Oficial</span>
          <h3 style="font-size: 1.4rem; color: var(--color-primary); margin-bottom: 8px;">CuritiPão na Imprensa</h3>
          <p style="color: var(--color-text-muted); font-size: 0.98rem; margin: 0; line-height: 1.6;">
            Confira as 9 reportagens e publicações confirmadas em veículos como RIC, TOPVIEW, Bem Paraná, Folha de Curitiba e mais, cobrindo o lançamento, as receitas exclusivas e as 15 padarias do Festival 2026.
          </p>
        </div>
        <div>
          <a href="/festival/2026/#imprensa" class="btn btn-primary" style="font-weight: 700; padding: 12px 24px; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <span>Ver repercussão na imprensa</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <div style="font-size: 1.1rem; line-height: 1.8; color: var(--color-text);">
        <h2 style="margin-bottom: 18px; color: var(--color-primary);">A Origem e a Filosofia do Festival</h2>
        <p>
          O Festival CuritiPão foi concebido para celebrar a cultura da panificação de Curitiba. O evento estimula as padarias locais a exercerem sua criatividade máxima em receitas autorais, enquanto convida a população a explorar novos bairros e valorizar o trabalho artesanal de quem assa diariamente.
        </p>

        <p>
          A cada edição, os estabelecimentos participantes desenvolvem pães ou produtos de fermentação lenta que colocam em destaque técnicas tradicionais, ingredientes de excelência e o diálogo com a história curitibana.
        </p>

        <!-- Acompanhe no Instagram -->
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 30px; margin-top: 40px; text-align: center;">
          <h3 style="margin-bottom: 10px;">Fique por dentro das novidades</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width: 600px; margin: 0 auto 20px;">
            Acompanhe a cobertura editorial e fique sabendo em primeira mão sobre os preparativos e avisos da próxima edição através do nosso canal oficial no Instagram.
          </p>
          <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold">
            Seguir @curitipao.guia no Instagram
          </a>
        </div>
      </div>
    </div>
  </section>
`;

const festivalHubHtml = wrapPage({
  title: 'Festival CuritiPão • O Encontro Anual da Panificação',
  description: 'Conheça o Festival CuritiPão, o principal encontro anual de padarias de Curitiba, e acesse o arquivo completo da edição inaugural de 2026.',
  canonical: '/festival/',
  activeRoute: '/festival/',
  content: festivalHubContent
});
fs.writeFileSync('./festival/index.html', festivalHubHtml, 'utf8');
console.log('Generated festival/index.html');

// -------------------------------------------------------------
// PAGE 10: CONTATO E PARTICIPAÇÃO (/contato/)
// -------------------------------------------------------------
ensureDir('./contato');
const contatoContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Contato</span>
      </nav>
      <h1>Contato & Participação</h1>
      <p class="lead">
        Indique uma padaria imperdível de Curitiba, cadastre ou atualize as informações do seu estabelecimento ou fale com a nossa equipe editorial.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 900px;">
      <!-- CANAIS DIRETOS OFICIAIS -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 40px;">
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 24px; text-align: center;">
          <span style="font-size: 1.8rem; display: block; margin-bottom: 8px;">✉️</span>
          <h3 style="font-size: 1.1rem; margin-bottom: 6px;">E-mail Oficial</h3>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 12px;">Para dúvidas, imprensa e parcerias</p>
          <a href="mailto:contato@curitipao.com.br" class="btn btn-secondary" style="font-size: 0.85rem;">contato@curitipao.com.br</a>
        </div>

        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 24px; text-align: center;">
          <span style="font-size: 1.8rem; display: block; margin-bottom: 8px;">📷</span>
          <h3 style="font-size: 1.1rem; margin-bottom: 6px;">Instagram Oficial</h3>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 12px;">Novidades diárias e mensagens diretas</p>
          <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.85rem;">@curitipao.guia</a>
        </div>
      </div>

      <!-- AVISO DE ATIVAÇÃO TÉCNICA DO TRANSPORTE DE E-MAIL -->
      <div class="form-notice">
        <strong>Aviso sobre os formulários do site:</strong><br>
        O envio direto via formulário web está em fase de homologação técnica de infraestrutura SMTP na hospedagem. Todas as informações preenchidas são validadas pelo sistema para conferência. Para atendimento imediato da curadoria, você também pode enviar suas informações diretamente para <a href="mailto:contato@curitipao.com.br" style="text-decoration: underline; font-weight:700;">contato@curitipao.com.br</a> ou pelo direct do Instagram <a href="https://www.instagram.com/curitipao.guia/" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight:700;">@curitipao.guia</a>.
      </div>

      <!-- FORMULÁRIO A: INDIQUE UMA PADARIA -->
      <section class="form-card" id="indicar">
        <h2 style="font-size: 1.6rem; margin-bottom: 8px; color: var(--color-primary);">A) Indique uma Padaria</h2>
        <p style="color: var(--color-text-muted); font-size: 0.92rem; margin-bottom: 24px;">
          Conhece uma padaria artesanal especial em Curitiba que merece ser mapeada pelo guia? Conte para a nossa curadoria editorial.
        </p>

        <form data-curitipao-form="indicar" novalidate>
          <div class="form-status-message" style="display: none;"></div>

          <!-- Honeypot anti-spam -->
          <div style="display: none;" aria-hidden="true">
            <input type="text" name="curitipao_hp" tabindex="-1" autocomplete="off">
          </div>

          <!-- Bloco 1: Quem está indicando -->
          <div class="form-section-title">
            <span>👤</span> 1. Seus Dados de Identificação
          </div>
          <p class="form-section-subtitle">
            Para que nossa equipe possa confirmar informações e agradecer pela sugestão. Seus dados pessoais não serão publicados.
          </p>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="ind-nome" class="form-label">Seu Nome <span class="required">*</span></label>
              <input type="text" id="ind-nome" name="nome" class="form-input" required placeholder="Como podemos te chamar?">
            </div>

            <div class="form-group">
              <label for="ind-email" class="form-label">Seu E-mail <span class="required">*</span></label>
              <input type="email" id="ind-email" name="email" class="form-input" required placeholder="exemplo@email.com">
            </div>
          </div>

          <hr class="form-section-divider">

          <!-- Bloco 2: Dados da Padaria Indicada -->
          <div class="form-section-title">
            <span>🥖</span> 2. Dados da Padaria Indicada
          </div>
          <p class="form-section-subtitle">
            Informe o que souber sobre o estabelecimento. Os contatos da padaria são opcionais aqui, pois quem indica pode não conhecê-los.
          </p>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="ind-padaria" class="form-label">Nome da Padaria <span class="required">*</span></label>
              <input type="text" id="ind-padaria" name="nome_padaria" class="form-input" required placeholder="Nome do estabelecimento">
            </div>

            <div class="form-group">
              <label for="ind-bairro" class="form-label">Bairro da Padaria <span class="required">*</span></label>
              <input type="text" id="ind-bairro" name="bairro" class="form-input" required placeholder="Ex: Juvevê, Centro, Batel, Cabral...">
            </div>
          </div>

          <!-- Contatos da Padaria (Opcionais) -->
          <div class="form-contacts-block">
            <label class="form-label" style="margin-bottom: 4px;">Contatos da Padaria <span class="form-badge-optional">(opcional para indicação)</span></label>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 14px;">
              Aceita números com ou sem formatação, incluindo telefone fixo e celular/WhatsApp.
            </p>

            <div class="form-grid-2">
              <div class="form-group" style="margin-bottom: 12px;">
                <label for="ind-telefone" class="form-label" style="font-weight: 500; font-size: 0.88rem;">Telefone de contato da padaria (com DDD)</label>
                <input type="tel" id="ind-telefone" name="telefone_padaria" class="form-input" placeholder="(41) 3333-0000" inputmode="tel" autocomplete="tel">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label for="ind-whatsapp" class="form-label" style="font-weight: 500; font-size: 0.88rem;">WhatsApp da padaria (com DDD)</label>
                <input type="tel" id="ind-whatsapp" name="whatsapp_padaria" class="form-input" placeholder="(41) 99999-0000" inputmode="tel">
              </div>
            </div>

            <div style="margin: 6px 0 14px;">
              <label class="form-checkbox-label">
                <input type="checkbox" id="ind-mesmo-contato" name="mesmo_contato" class="form-checkbox">
                <span>O WhatsApp é o mesmo telefone</span>
              </label>
            </div>

            <div class="form-group-autorizacao">
              <span class="form-label" style="font-size: 0.88rem; margin-bottom: 8px;">Autorização de exibição pública:</span>
              <label class="form-checkbox-label">
                <input type="checkbox" id="ind-autoriza-tel" name="autoriza_tel" class="form-checkbox" checked>
                <span>Autorizo exibir o telefone publicamente no guia</span>
              </label>
              <label class="form-checkbox-label">
                <input type="checkbox" id="ind-autoriza-wpp" name="autoriza_wpp" class="form-checkbox" checked>
                <span>Autorizo exibir o WhatsApp publicamente no guia</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="ind-insta" class="form-label">Instagram ou Site Oficial da Padaria <span class="form-badge-optional">(opcional)</span></label>
            <input type="text" id="ind-insta" name="instagram" class="form-input" placeholder="@padaria ou link do site">
          </div>

          <div class="form-group">
            <label for="ind-motivo" class="form-label">Por que você indica esta padaria? <span class="required">*</span></label>
            <textarea id="ind-motivo" name="motivo" rows="4" class="form-textarea" required placeholder="Conte-nos sobre o pão favorito, o atendimento, a receita ou o diferencial que torna este lugar imperdível..."></textarea>
          </div>

          <!-- AVISO DE REVISÃO ANTES DA PUBLICAÇÃO -->
          <div class="form-revision-notice">
            <strong>Revisão Editorial:</strong> As informações enviadas serão analisadas pela equipe CuritiPão antes da publicação ou atualização no guia.
            <p style="margin: 6px 0 0; font-size: 0.84rem; color: var(--color-text-muted);">
              Nenhuma indicação cria uma ficha automaticamente. Seus dados pessoais não serão expostos publicamente.
            </p>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Enviar Indicação de Padaria</button>
        </form>
      </section>

      <!-- FORMULÁRIO B: CADASTRO OU ATUALIZAÇÃO DE PADARIA -->
      <section class="form-card" id="cadastrar">
        <h2 style="font-size: 1.6rem; margin-bottom: 8px; color: var(--color-primary);">B) Cadastre ou Atualize sua Padaria</h2>
        <p style="color: var(--color-text-muted); font-size: 0.92rem; margin-bottom: 24px;">
          Espaço exclusivo para proprietários, padeiros e responsáveis por padarias em Curitiba.
        </p>

        <form data-curitipao-form="cadastrar" novalidate>
          <div class="form-status-message" style="display: none;"></div>

          <!-- Honeypot anti-spam -->
          <div style="display: none;" aria-hidden="true">
            <input type="text" name="curitipao_hp" tabindex="-1" autocomplete="off">
          </div>

          <div class="form-group">
            <label for="cad-tipo" class="form-label">Tipo de Solicitação <span class="required">*</span></label>
            <select id="cad-tipo" name="tipo" class="form-select" required>
              <option value="novo">Novo cadastro de padaria no guia</option>
              <option value="atualizacao">Atualização de dados de padaria já listada</option>
            </select>
          </div>

          <!-- Bloco 1: Responsável pelo Envio -->
          <div class="form-section-title">
            <span>👤</span> 1. Dados do Responsável pelo Envio
          </div>
          <p class="form-section-subtitle">
            Diferenciados dos dados institucionais da padaria. Os dados pessoais do responsável são estritamente para validação interna e triagem da equipe CuritiPão; eles <strong>nunca</strong> serão publicados publicamente.
          </p>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="cad-responsavel" class="form-label">Nome do Responsável <span class="required">*</span></label>
              <input type="text" id="cad-responsavel" name="responsavel" class="form-input" required placeholder="Seu nome completo">
            </div>

            <div class="form-group">
              <label for="cad-cargo" class="form-label">Cargo ou Relação com a Padaria <span class="required">*</span></label>
              <input type="text" id="cad-cargo" name="cargo_responsavel" class="form-input" required placeholder="Ex: Proprietário(a), Mestre Padeiro(a), Gerente">
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="cad-email" class="form-label">E-mail para Retorno <span class="required">*</span></label>
              <input type="email" id="cad-email" name="email_retorno" class="form-input" required placeholder="contato@suapadaria.com.br">
            </div>

            <div class="form-group">
              <label for="cad-tel-resp" class="form-label">Telefone Direto do Responsável <span class="form-badge-optional">(opcional)</span></label>
              <input type="tel" id="cad-tel-resp" name="tel_responsavel" class="form-input" placeholder="(41) 99999-0000" inputmode="tel">
            </div>
          </div>

          <hr class="form-section-divider">

          <!-- Bloco 2: Dados da Padaria -->
          <div class="form-section-title">
            <span>🥖</span> 2. Dados Institucionais da Padaria
          </div>
          <p class="form-section-subtitle">
            Estes dados comporão a ficha da padaria no guia após a aprovação da curadoria.
          </p>

          <div class="form-group">
            <label for="cad-nomepadaria" class="form-label">Nome da Padaria <span class="required">*</span></label>
            <input type="text" id="cad-nomepadaria" name="nome_padaria" class="form-input" required placeholder="Nome fantasia do estabelecimento">
          </div>

          <div class="form-group">
            <label for="cad-endereco" class="form-label">Bairro e Endereço Completo <span class="required">*</span></label>
            <input type="text" id="cad-endereco" name="endereco" class="form-input" required placeholder="Rua, número, complemento e bairro em Curitiba">
          </div>

          <div class="form-group">
            <label for="cad-horarios" class="form-label">Horários de Funcionamento <span class="required">*</span></label>
            <input type="text" id="cad-horarios" name="horarios" class="form-input" required placeholder="Ex: Terça a sexta: 07h às 19h; Sábado: 08h às 17h; Domingo: 08h às 13h">
          </div>

          <!-- Bloco de Contatos da Padaria (Obrigatório ao menos 1) -->
          <div class="form-contacts-block">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; margin-bottom: 4px;">
              <label class="form-label" style="margin-bottom: 0;">Contatos da Padaria <span class="required">*</span></label>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-accent);">Solicite pelo menos um contato: Telefone ou WhatsApp</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 14px;">
              Informe com ou sem formatação (DDD + número). Aceita telefone fixo e celular.
            </p>

            <div class="form-grid-2">
              <div class="form-group" style="margin-bottom: 12px;">
                <label for="cad-telefone" class="form-label" style="font-weight: 500; font-size: 0.88rem;">Telefone de contato da padaria (com DDD)</label>
                <input type="tel" id="cad-telefone" name="telefone_padaria" class="form-input" placeholder="(41) 3333-0000" inputmode="tel" autocomplete="tel">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label for="cad-whatsapp" class="form-label" style="font-weight: 500; font-size: 0.88rem;">WhatsApp da padaria (com DDD)</label>
                <input type="tel" id="cad-whatsapp" name="whatsapp_padaria" class="form-input" placeholder="(41) 99999-0000" inputmode="tel">
              </div>
            </div>

            <div style="margin: 6px 0 14px;">
              <label class="form-checkbox-label">
                <input type="checkbox" id="cad-mesmo-contato" name="mesmo_contato" class="form-checkbox">
                <span>O WhatsApp é o mesmo telefone</span>
              </label>
            </div>

            <div id="cad-contato-alerta" class="form-error-inline" style="display: none; margin-bottom: 12px;">
              ⚠️ Por favor, informe ao menos um número de contato da padaria (telefone fixo ou WhatsApp).
            </div>

            <!-- Autorização de Exibição Pública Separada -->
            <div class="form-group-autorizacao">
              <span class="form-label" style="font-size: 0.88rem; margin-bottom: 8px;">Autorização para exibição pública no guia:</span>
              <label class="form-checkbox-label">
                <input type="checkbox" id="cad-autoriza-tel" name="autoriza_tel" class="form-checkbox" checked>
                <span>Permitir exibir o telefone publicamente na ficha do guia</span>
              </label>
              <label class="form-checkbox-label">
                <input type="checkbox" id="cad-autoriza-wpp" name="autoriza_wpp" class="form-checkbox" checked>
                <span>Permitir exibir o WhatsApp publicamente na ficha do guia</span>
              </label>
              <span class="form-help">Você pode escolher exibir apenas um dos canais ou ambos. Se desmarcar, o canal será mantido apenas para contato interno da curadoria.</span>
            </div>
          </div>

          <div class="form-group">
            <label for="cad-insta" class="form-label">Instagram e Site Oficial <span class="form-badge-optional">(opcional)</span></label>
            <input type="text" id="cad-insta" name="instagram_site" class="form-input" placeholder="@instagram e site institucional">
          </div>

          <div class="form-group">
            <label for="cad-especialidades" class="form-label">Especialidades e Tipos de Pães <span class="required">*</span></label>
            <input type="text" id="cad-especialidades" name="especialidades" class="form-input" required placeholder="Ex: Sourdough de fermentação natural, baguetes tradicionais, croissants, centeio alemão, brioches...">
          </div>

          <div class="form-group">
            <label for="cad-atendimento" class="form-label">Modalidades de Atendimento <span class="required">*</span></label>
            <input type="text" id="cad-atendimento" name="atendimento" class="form-input" required placeholder="Ex: Balcão e café no local, retirada programada, delivery próprio e apps">
          </div>

          <div class="form-group">
            <label for="cad-apresentacao" class="form-label">Breve Apresentação da Casa <span class="required">*</span></label>
            <textarea id="cad-apresentacao" name="apresentacao" rows="4" class="form-textarea" required placeholder="Conte a história do forno, quem são os padeiros e o que torna sua padaria especial..."></textarea>
          </div>

          <!-- AVISO DE REVISÃO ANTES DA PUBLICAÇÃO -->
          <div class="form-revision-notice">
            <strong>Revisão Editorial Obrigatória:</strong> As informações enviadas serão analisadas pela equipe CuritiPão antes da publicação ou atualização no guia.
            <p style="margin: 6px 0 0; font-size: 0.85rem; color: var(--color-text-muted);">
              Nenhum envio cria ou altera uma ficha pública automaticamente. Nas solicitações de atualização, a ficha atual no guia é mantida até a validação e publicação das alterações. Dados pessoais do responsável não são divulgados.
            </p>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Submeter Cadastro para Revisão Editorial</button>
        </form>
      </section>
    </div>
  </section>
`;

const contatoHtml = wrapPage({
  title: 'Contato & Participação',
  description: 'Fale com a equipe do CuritiPão, indique uma padaria artesanal de Curitiba ou cadastre seu estabelecimento no guia permanente.',
  canonical: '/contato/',
  activeRoute: '/contato/',
  content: contatoContent
});
fs.writeFileSync('./contato/index.html', contatoHtml, 'utf8');
console.log('Generated contato/index.html');

// -------------------------------------------------------------
// PAGE 11: SOLUÇÕES DIGITAIS CONEXUS (/solucoes-digitais/)
// -------------------------------------------------------------
ensureDir('./solucoes-digitais');
const solucoesContent = `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Soluções Digitais</span>
      </nav>
      <span class="badge badge-gold" style="margin-bottom: 12px;">Parceria Tecnológica</span>
      <h1>Soluções digitais para padarias</h1>
      <p class="lead">
        O CuritiPão também conecta padarias a serviços digitais desenvolvidos pela CONEXUS, como criação de sites, cardápios digitais e organização do Perfil da Empresa no Google.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 900px;">
      <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); margin-bottom: 45px;">
        <div class="form-card" style="margin-bottom: 0;">
          <h3 style="font-size: 1.25rem; color: var(--color-primary); margin-bottom: 10px;">Websites Institucionais</h3>
          <p style="font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.6;">
            Sites elegantes, rápidos e responsivos projetados para destacar a história, os produtos e a localização do seu estabelecimento.
          </p>
        </div>

        <div class="form-card" style="margin-bottom: 0;">
          <h3 style="font-size: 1.25rem; color: var(--color-primary); margin-bottom: 10px;">Cardápios Digitais</h3>
          <p style="font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.6;">
            Cardápios digitais interativos via QR Code, leves e fáceis de atualizar para balcão, café e encomendas especiais.
          </p>
        </div>

        <div class="form-card" style="margin-bottom: 0;">
          <h3 style="font-size: 1.25rem; color: var(--color-primary); margin-bottom: 10px;">Perfil no Google</h3>
          <p style="font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.6;">
            Otimização e organização do Google Perfil de Empresa para que sua padaria apareça com destaque no Google Maps e nas buscas locais.
          </p>
        </div>
      </div>

      <!-- BLOCO OFICIAL DE CONTATOS DA CONEXUS DIGITAL SOLUTIONS -->
      <div class="conexus-contact-card">
        <div class="conexus-contact-header">
          <div>
            <span class="badge badge-gold" style="margin-bottom: 8px;">Parceira Tecnológica</span>
            <h2 class="conexus-contact-title">Canais de Atendimento • CONEXUS Digital Solutions</h2>
          </div>
          <picture>
            <source srcset="/assets/logos/conexus-logo-oficial.webp" type="image/webp">
            <img src="/assets/logos/conexus-logo-oficial.png" alt="CONEXUS Digital Solutions" style="height: 32px; width: auto;" loading="lazy">
          </picture>
        </div>

        <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
          Para padarias, confeitarias e estabelecimentos gastronômicos interessados em novos projetos de websites, cardápios interativos via QR Code ou consultoria de presença digital:
        </p>

        <div class="conexus-contact-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
          <!-- E-mail Comercial (Ícone Azul Adotado) -->
          <div class="conexus-channel-item">
            <div class="conexus-channel-icon-wrap icon-wrap-azul">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1A73E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div class="conexus-channel-info">
              <h4>E-mail Comercial</h4>
              <p style="margin-bottom: 6px;">Propostas, projetos e orçamentos:</p>
              <a href="mailto:comercial@conexus.press" style="font-weight: 700; color: #1A73E8; font-size: 0.95rem;">
                comercial@conexus.press
              </a>
            </div>
          </div>

          <!-- Instagram Oficial CONEXUS (Confirmado) -->
          <div class="conexus-channel-item">
            <div class="conexus-channel-icon-wrap icon-wrap-instagram">
              ${OFFICIAL_INSTAGRAM_SVG(24, 'ig-conexus-oficial')}
            </div>
            <div class="conexus-channel-info">
              <h4>Instagram</h4>
              <p style="margin-bottom: 6px;">Acompanhe cases e novidades:</p>
              <a href="https://www.instagram.com/conexus.press/" target="_blank" rel="noopener noreferrer" style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem;">
                @conexus.press &rarr;
              </a>
            </div>
          </div>

          <!-- Website Oficial -->
          <div class="conexus-channel-item">
            <div class="conexus-channel-icon-wrap icon-wrap-web">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div class="conexus-channel-info">
              <h4>Website Institucional</h4>
              <p style="margin-bottom: 6px;">Portfólio e soluções digitais completas:</p>
              <a href="https://www.conexus.press/" target="_blank" rel="noopener noreferrer" style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem;">
                www.conexus.press &rarr;
              </a>
            </div>
          </div>
        </div>

        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--color-border); font-size: 0.88rem; color: var(--color-text-muted);">
          <span>Para dúvidas editoriais ou informações sobre o festival e o guia, contate o CuritiPão: </span>
          <a href="mailto:contato@curitipao.com.br" style="color: var(--color-primary); font-weight: 600; text-decoration: underline;">contato@curitipao.com.br</a>.
        </div>
      </div>
    </div>
  </section>
`;

const solucoesHtml = wrapPage({
  title: 'Soluções Digitais para Padarias',
  description: 'O CuritiPão conecta padarias a serviços digitais da CONEXUS: websites, cardápios digitais e Perfil de Empresa no Google.',
  canonical: '/solucoes-digitais/',
  activeRoute: '/solucoes-digitais/',
  content: solucoesContent
});
fs.writeFileSync('./solucoes-digitais/index.html', solucoesHtml, 'utf8');
console.log('Generated solucoes-digitais/index.html');

// -------------------------------------------------------------
// PAGE 12: IMPRENSA (/imprensa/)
// -------------------------------------------------------------
ensureDir('./imprensa');

const pressPublications2026 = [
  {
    vehicle: 'CBN Curitiba',
    title: 'Festival CuritiPão vai até sexta (30) em 15 padarias de Curitiba; OUÇA A COLUNA',
    date: '29/10/2026',
    format: 'Coluna em áudio',
    formatBadge: 'Coluna em Áudio',
    buttonText: 'Ler matéria',
    url: 'https://cbncuritiba.com.br/materias/festival-curitipao-vai-ate-sexta-30-em-15-padarias-de-curitiba-ouca-a-coluna/',
    cover: '/assets/photos/curitipao-111.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Curitiba Honesta',
    title: 'Festival CuritiPão entra na reta final com criações exclusivas em 15 padarias de Curitiba',
    date: '28/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://curitibahonesta.com.br/festival-curitipao-entra-na-reta-final-com-criacoes-exclusivas-em-15-padarias-de-curitiba/',
    cover: '/assets/photos/familia-farinha-cortado.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Bem Paraná • Comer e Curtir',
    title: 'Festival CuritiPão reúne criações exclusivas em 15 padarias até sexta-feira',
    date: '27/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/festival-curitipao-reune-criacoes-exclusivas-em-15-padarias-ate-sexta-feira/',
    cover: '/assets/photos/Babka de Nutella e Pistache - FELIPANE 2.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Notícias de Curitiba',
    title: 'Festival CuritiPão reúne 15 padarias de Curitiba com receitas exclusivas; veja como participar',
    date: '23/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://www.noticiasdecuritiba.com.br/materia/festival-curitipao-2026-curitiba-15-padarias-receitas-exclusivas',
    cover: '/assets/photos/requinte-cortado.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Curitiba Honesta',
    title: 'Final de Semana Chegou. E que tem para fazer em Curitiba??',
    date: '23/10/2026',
    format: 'Menção em agenda',
    formatBadge: 'Menção em Agenda',
    buttonText: 'Ler matéria',
    url: 'https://curitibahonesta.com.br/final-de-semana-chegou-e-que-tem-para-fazer/',
    cover: '/assets/photos/bonin-inteiro.jpg',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Band',
    title: 'Festival Curitipão destaca pães artesanais em Curitiba',
    date: '21/10/2026',
    format: 'Reportagem',
    formatBadge: 'Reportagem',
    buttonText: 'Ler matéria',
    url: 'https://www.band.com.br/nacional/pr/festival-curitipao-destaca-paes-artesanais-em-curitiba',
    cover: '/assets/photos/curitipao-108 (1).webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Folha de Curitiba',
    title: 'Festival CuritiPão começa nesta terça com criações exclusivas em 15 padarias de Curitiba',
    date: '20/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://folhadecuritiba.com.br/festival-curitipao-comeca-nesta-terca-com-criacoes-exclusivas-em-15-padarias-de-curitiba/',
    cover: '/assets/photos/bonin-cortado.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Bem Paraná • Comer e Curtir',
    title: 'Festival CuritiPão reúne criações exclusivas em 15 padarias de Curitiba',
    date: '20/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/festival-curitipao-reune-criacoes-exclusivas-em-15-padarias-de-curitiba/',
    cover: '/assets/photos/Ciabatta recheado - Marcolini 3.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Bem Paraná • Mesa Dividida',
    title: 'Curitiba celebra a arte de fazer pão com o Festival CuritiPão!',
    date: '19/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://www.bemparana.com.br/publicacao/blogs/mesadividida/curitiba-celebra-a-arte-de-fazer-pao-com-o-festival-curitipao/',
    cover: '/assets/photos/aquarius-cortado.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'O Que Fazer Curitiba',
    title: 'Curitiba vai ficar com cheiro de pão quentinho: vem aí o Festival CuritiPão',
    date: '14/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://oquefazercuritiba.com.br/curitiba-vai-ficar-com-cheiro-de-pao-quentinho-vem-ai-o-festival-curitipao/',
    cover: '/assets/photos/curitipao-111.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'RIC • Coluna Simone Bello',
    title: 'CuritiPão estreia em Curitiba com receitas exclusivas de 15 padarias',
    date: '09/10/2026',
    format: 'Reportagem TV & Coluna',
    formatBadge: 'Reportagem & Coluna',
    buttonText: 'Ler matéria',
    url: 'https://ric.com.br/estilo-de-vida/gastronomia/curitipao-estreia-em-curitiba-com-receitas-exclusivas-de-15-padarias/',
    cover: '/assets/press/ric-noticias-manha-frame.jpg',
    photoCredit: 'Captura: RICtv / Record'
  },
  {
    vehicle: 'TOPVIEW • Grands',
    title: '1° CuritiPão reúne 15 padarias de Curitiba com receitas exclusivas; festival quer mostrar a diversidade da panificação curitibana',
    date: '06/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://topview.com.br/grands/1-curitipao-reune-15-padarias-de-curitiba-com-receitas-exclusivas-festival-quer-mostrar-a-diversidade-da-panificacao-curitibana/',
    cover: '/assets/photos/curitipao-111.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Sabores de Curitiba',
    title: 'Festival CuritiPão reúne 15 padarias de Curitiba com receitas exclusivas',
    date: '06/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://saboresdecuritiba.com.br/festival-curitipao-reune-15-padarias-de-curitiba-com-receitas-exclusivas/',
    cover: '/assets/photos/requinte-cortado.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Bem Paraná • Comer e Curtir',
    title: 'CuritiPão reúne 15 padarias com criações exclusivas em Curitiba',
    date: '05/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/curitipao-reune-15-padarias-com-criacoes-exclusivas-em-curitiba/',
    cover: '/assets/photos/baguete veneza - integral - Confraria 1.jpg',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Bem Paraná • Mesa Dividida',
    title: 'Curitiba celebra a panificação autoral',
    date: '05/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://www.bemparana.com.br/publicacao/blogs/mesadividida/curitiba-celebra-a-panificacao-autoral/',
    cover: '/assets/photos/curitipao-108 (1).webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Where Curitiba',
    title: 'Festival CuritiPão reúne 15 padarias com criações exclusivas',
    date: '05/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://www.wherecuritiba.com.br/festival-curitipao-reune-15-padarias-com-criacoes-exclusivas/',
    cover: '/assets/photos/bonin-cortado.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  },
  {
    vehicle: 'Júlio Zaruch',
    title: 'Festival de Padarias, de 20 a 30 de outubro',
    date: '05/10/2026',
    format: 'Matéria',
    formatBadge: 'Matéria',
    buttonText: 'Ler matéria',
    url: 'https://juliozaruch.com.br/gastronomia/festival-de-padarias-de-20-a-30-de-outubro/',
    cover: '/assets/photos/aquarius-cortado.webp',
    photoCredit: 'Foto: Lorena Lenara Batista'
  }
];

const pressCardsGridHtml = pressPublications2026.map(item => {
  const isoDate = item.date ? item.date.split('/').reverse().join('-') : '';
  const dateTag = item.date ? `<time datetime="${isoDate}">${item.date}</time>` : `<span>Data não informada</span>`;

  return `
        <article class="press-card">
          <div class="press-card-media">
            <img src="${item.cover}" alt="Capa ilustrativa: ${item.title}" loading="lazy">
            <span class="press-format-badge">${item.formatBadge}</span>
          </div>
          <div class="press-card-body">
            <div class="press-card-vehicle">${item.vehicle}</div>
            <h3 class="press-card-title">${item.title}</h3>
            <div class="press-card-meta">
              <span class="press-meta-date">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${dateTag}
              </span>
              <span class="press-meta-sep">•</span>
              <span class="press-meta-format">${item.format}</span>
            </div>
            <div class="press-photo-credit"><em>${item.photoCredit}</em></div>
          </div>
          <div class="press-card-footer">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary press-btn" aria-label="${item.buttonText} em ${item.vehicle}: ${item.title}">
              <span>${item.buttonText}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </article>`;
}).join('\n');

const imprensaContent = `
  <!-- HERO DA IMPRENSA -->
  <section class="page-intro-header">
    <div class="container" style="max-width: 960px;">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Imprensa</span>
      </nav>
      <h1>CuritiPão na imprensa</h1>
      <p class="lead">
        Acompanhe a cobertura jornalística, matérias, reportagens e colunas dedicadas ao Festival CuritiPão nos principais veículos de imprensa de Curitiba e do Paraná, organizadas por edição.
      </p>
    </div>
  </section>

  <!-- EDIÇÃO 2026 (#2026) -->
  <section class="section press-edition-section" id="2026" aria-labelledby="edicao-2026-titulo">
    <div class="container">
      <div class="section-header press-edition-header">
        <span class="badge badge-gold">Cobertura Oficial</span>
        <h2 id="edicao-2026-titulo" class="section-title">Edição 2026 • 1º Festival CuritiPão</h2>
        <p class="section-subtitle">
          A primeira edição reuniu 15 padarias de Curitiba com criações exclusivas e teve ampla repercussão: 17 publicações externas em 12 veículos de imprensa, além da cobertura em vídeo veiculada pela RICtv Record.
        </p>
      </div>

      <!-- DESTAQUE EM VÍDEO LOCAL: RICTV RECORD -->
      <div class="press-video-feature-card">
        <div class="press-video-player-wrap">
          <video controls preload="metadata" poster="/assets/press/ric-noticias-manha-frame.jpg" style="width: 100%; border-radius: var(--radius-md); display: block; background: #000;">
            <source src="/assets/press/ric-noticias-manha-video.mp4" type="video/mp4">
            Seu navegador não suporta reprodução direta deste vídeo.
          </video>
          <div class="press-photo-credit" style="margin-top: 6px; text-align: left;">
            <em>Captura: RICtv / Record • Exibição no RIC Notícias Manhã (09/10/2026)</em>
          </div>
        </div>
        <div class="press-video-content-wrap">
          <span class="press-format-badge" style="position: static; display: inline-block; margin-bottom: 10px;">Reportagem em Vídeo</span>
          <div class="press-card-vehicle" style="color: var(--color-primary); font-weight: 700;">RICtv / Record • RIC Notícias Manhã</div>
          <h3 style="font-size: 1.35rem; color: var(--color-primary-dark); margin: 6px 0 12px; line-height: 1.35;">
            CuritiPão estreia em Curitiba com receitas exclusivas de 15 padarias
          </h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">
            A reportagem do telejornal matinal da RICtv acompanhou a abertura do festival, visitou fornos artesanais e mostrou a diversidade dos pães especiais criados pelos padeiros de Curitiba.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
            <a href="/assets/press/ric-noticias-manha-video.mp4" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.9rem; padding: 10px 20px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Assistir reportagem</span>
            </a>
            <a href="https://ric.com.br/estilo-de-vida/gastronomia/curitipao-estreia-em-curitiba-com-receitas-exclusivas-de-15-padarias/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.9rem; padding: 10px 20px;">
              <span>Ler coluna no portal RIC</span>
            </a>
          </div>
        </div>
      </div>

      <!-- GRID COM AS 17 MATÉRIAS EXTERNAS -->
      <div class="press-grid">
        ${pressCardsGridHtml}
      </div>

      <!-- ESTRUTURA PARA FUTURAS EDIÇÕES (SEM ABAS VAZIAS OU PROMESSAS ARTIFICIAIS) -->
      <div style="margin-top: 50px; padding: 24px 30px; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-md); text-align: center;">
        <span class="badge badge-brown" style="margin-bottom: 8px;">Organização Editorial</span>
        <h4 style="margin-bottom: 8px; color: var(--color-primary);">Próximas Edições</h4>
        <p style="color: var(--color-text-muted); font-size: 0.92rem; max-width: 680px; margin: 0 auto; line-height: 1.5;">
          A cobertura do CuritiPão é catalogada permanentemente por edição. Quando novas edições do festival forem realizadas e cobertas pelos veículos de comunicação, os registros jornalísticos confirmados serão incorporados a esta página.
        </p>
      </div>
    </div>
  </section>

  <!-- CANAIS PRÓPRIOS & INSTITUCIONAIS (SEPARADOS DA COBERTURA EXTERNA) -->
  <section class="section section-alt">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Institucional</span>
        <h2 class="section-title">Canais Próprios & Realização</h2>
        <p class="section-subtitle">
          Publicações, registros históricos e canais oficiais dos realizadores do CuritiPão.
        </p>
      </div>

      <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        <!-- Curitidoce -->
        <article class="form-card" style="margin-bottom: 0;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            ${OFFICIAL_INSTAGRAM_SVG(26, 'ig-imprensa-curitidoce')}
            <h3 style="margin-bottom: 0;">Curitidoce</h3>
          </div>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 18px; line-height: 1.5;">
            Canal idealizador e realizador do Festival CuritiPão. Acompanhe a cobertura gastronômica de confeitarias, docerias e padarias de Curitiba.
          </p>
          <a href="https://www.instagram.com/curitidoce/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            Visitar @curitidoce no Instagram
          </a>
        </article>

        <!-- CONEXUS Digital Solutions -->
        <article class="form-card" style="margin-bottom: 0;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <h3 style="margin-bottom: 0;">CONEXUS Digital Solutions</h3>
          </div>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 18px; line-height: 1.5;">
            Desenvolvimento de tecnologia, arquitetura digital do portal e soluções para estabelecimentos gastronômicos.
          </p>
          <a href="https://www.conexus.press/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            Conhecer a conexus.press
          </a>
        </article>
      </div>

      <!-- BLOCO DE ASSESSORIA DE IMPRENSA -->
      <div style="margin-top: 40px; padding: 30px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); text-align: center; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h3 style="margin-bottom: 10px; color: var(--color-primary);">Assessoria de Imprensa & Informações Editoriais</h3>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">
          Jornalistas e comunicadores interessados em pautas, entrevistas com organizadores ou padarias do catálogo, dados históricos ou fotografias em alta resolução do acervo podem contatar a equipe editorial:
        </p>
        <a href="mailto:contato@curitipao.com.br" class="btn btn-primary" style="font-weight: 600;">
          contato@curitipao.com.br
        </a>
      </div>
    </div>
  </section>
`;

const imprensaHtml = wrapPage({
  title: 'CuritiPão na imprensa — Cobertura Editorial por Edição',
  description: 'Confira as reportagens, matérias e colunas sobre o Festival CuritiPão nos principais veículos de imprensa de Curitiba e do Paraná.',
  canonical: '/imprensa/',
  activeRoute: '/imprensa/',
  content: imprensaContent,
  schemaJson: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CuritiPão na imprensa",
    "url": "https://curitipao.com.br/imprensa/",
    "description": "Cobertura editorial e reportagens sobre o Festival CuritiPão nos principais veículos de imprensa de Curitiba e do Paraná.",
    "publisher": {
      "@type": "Organization",
      "name": "CuritiPão",
      "url": "https://curitipao.com.br/"
    }
  }
});
fs.writeFileSync('./imprensa/index.html', imprensaHtml, 'utf8');
console.log('Generated imprensa/index.html');

// -------------------------------------------------------------
// PAGE 13: PRIVACIDADE (/privacidade/)
// -------------------------------------------------------------
ensureDir('./privacidade');
const privacidadeContent = `
  <section class="page-intro-header">
    <div class="container" style="max-width: 860px;">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <span aria-current="page">Privacidade</span>
      </nav>
      <h1>Política de Privacidade</h1>
      <p class="lead">
        Transparência no tratamento de dados pessoais, cookies e segurança em conformidade com a Lei Geral de Proteção de Dados (LGPD).
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width: 860px;">
      <article style="font-size: 1.05rem; line-height: 1.8; color: var(--color-text);">
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 24px;">
          Última atualização: Novembro de 2026 • CuritiPão (curitipao.com.br)
        </p>

        <h2 style="font-size: 1.4rem; margin-top: 30px; margin-bottom: 12px; color: var(--color-primary);">1. Informações Gerais</h2>
        <p>
          O CuritiPão valoriza a privacidade e a segurança dos dados de seus usuários, leitores e parceiros. Esta política descreve como tratamos as informações coletadas durante a navegação em nosso portal (https://curitipao.com.br).
        </p>

        <h2 style="font-size: 1.4rem; margin-top: 30px; margin-bottom: 12px; color: var(--color-primary);">2. Dados Coletados nos Formulários</h2>
        <p>
          Coletamos dados estritamente necessários quando você opta por nos enviar uma indicação de padaria ou cadastrar/atualizar seu estabelecimento comercial:
        </p>
        <ul style="list-style: disc; padding-left: 24px; margin-bottom: 18px;">
          <li><strong>Indicação de Padaria:</strong> Nome, e-mail para confirmação e dados públicos da padaria sugerida.</li>
          <li><strong>Cadastro de Estabelecimento:</strong> Nome do responsável, e-mail para contato institucional, dados de funcionamento comercial (endereço, horários, especialidades).</li>
        </ul>
        <p>
          Esses dados são utilizados exclusivamente para curadoria editorial e comunicação institucional referente ao catálogo do CuritiPão. Não comercializamos nem compartilhamos seus dados com terceiros para fins publicitários.
        </p>

        <h2 style="font-size: 1.4rem; margin-top: 30px; margin-bottom: 12px; color: var(--color-primary);">3. Armazenamento Local e Cookies</h2>
        <p>
          Utilizamos recursos de armazenamento local (localStorage) no seu navegador para registrar sua preferência de tema visual (modo claro ou escuro) e seu consentimento quanto aos cookies.
        </p>
        <p>
          Para medição de audiência e navegação, utilizamos o Google Analytics 4 (GA4 ID: G-JX6VH347DQ). Os dados analíticos são processados de forma agregada e anônima, sem registro de informações de identificação pessoal (PII).
        </p>

        <div style="background: var(--color-bg-alt); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin: 30px 0;">
          <h3 style="font-size: 1.1rem; margin-bottom: 8px;">Gerenciar Preferências</h3>
          <p style="font-size: 0.92rem; color: var(--color-text-muted); margin-bottom: 14px;">
            Você pode alterar suas preferências de cookies a qualquer momento clicando no botão abaixo:
          </p>
          <button type="button" class="btn btn-secondary" onclick="window.openCookiePreferences()">Abrir Gerenciador de Cookies</button>
        </div>

        <h2 style="font-size: 1.4rem; margin-top: 30px; margin-bottom: 12px; color: var(--color-primary);">4. Seus Direitos (LGPD)</h2>
        <p>
          Em conformidade com a LGPD (Lei nº 13.709/2018), você tem o direito de solicitar a confirmação, o acesso, a retificação ou a exclusão de seus dados pessoais mantidos em nossos registros. Para exercer esses direitos, basta enviar uma mensagem para nosso canal oficial:
          <a href="mailto:contato@curitipao.com.br" style="color: var(--color-primary); font-weight: 600; text-decoration: underline;">contato@curitipao.com.br</a>.
        </p>
      </article>
    </div>
  </section>
`;

const privacidadeHtml = wrapPage({
  title: 'Política de Privacidade',
  description: 'Saiba como o CuritiPão protege sua privacidade, gerencia cookies e trata os dados dos formulários em conformidade com a LGPD.',
  canonical: '/privacidade/',
  activeRoute: '/privacidade/',
  content: privacidadeContent
});
fs.writeFileSync('./privacidade/index.html', privacidadeHtml, 'utf8');
console.log('Generated privacidade/index.html');

// -------------------------------------------------------------
// PAGE 14: 404 (404.html)
// -------------------------------------------------------------
const notFoundContent = `
  <section class="section" style="padding: 100px 0 120px; text-align: center;">
    <div class="container" style="max-width: 640px;">
      <span style="font-size: 4rem; display: block; margin-bottom: 16px;">🥖</span>
      <span class="badge badge-gold" style="margin-bottom: 12px;">Erro 404</span>
      <h1 style="font-size: 2.4rem; margin-bottom: 16px;">Esta fatia não foi encontrada</h1>
      <p style="color: var(--color-text-muted); font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
        A página que você tentou acessar não existe, mudou de fornada ou o link está incorreto.
      </p>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;">
        <a href="/" class="btn btn-primary">Voltar à Página Inicial</a>
        <a href="/padarias/" class="btn btn-secondary">Explorar Guia de Padarias</a>
        <a href="/festival/2026/" class="btn btn-outline-gold">Arquivo do Festival 2026</a>
      </div>
    </div>
  </section>
`;

const notFoundHtml = wrapPage({
  title: 'Página Não Encontrada (404)',
  description: 'A página solicitada não foi encontrada no portal CuritiPão.',
  canonical: '/404.html',
  activeRoute: '',
  content: notFoundContent
});
fs.writeFileSync('./404.html', notFoundHtml, 'utf8');
console.log('Generated 404.html');

// -------------------------------------------------------------
// SITEMAP & ROBOTS
// -------------------------------------------------------------
const publicUrls = [
  'https://curitipao.com.br/',
  'https://curitipao.com.br/sobre/',
  'https://curitipao.com.br/padarias/',
  'https://curitipao.com.br/roteiros/',
  'https://curitipao.com.br/roteiros/padarias-em-curitiba-por-bairro/',
  'https://curitipao.com.br/blog/',
  'https://curitipao.com.br/blog/o-curitipao-continua/',
  ...blogUrls,
  'https://curitipao.com.br/festival/',
  'https://curitipao.com.br/festival/2026/',
  'https://curitipao.com.br/imprensa/',
  'https://curitipao.com.br/contato/',
  'https://curitipao.com.br/solucoes-digitais/',
  'https://curitipao.com.br/privacidade/'
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicUrls.map(url => `  <url>
    <loc>${url}</loc>${blogUrls.includes(url) ? '' : '\n    <lastmod>2026-11-04</lastmod>'}
    <changefreq>weekly</changefreq>
    <priority>${url.endsWith('.br/') ? '1.0' : (url.includes('/padarias-em-curitiba-por-bairro/') ? '0.9' : '0.8')}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync('./sitemap.xml', sitemapXml, 'utf8');
console.log('Generated sitemap.xml with ' + publicUrls.length + ' public pages.');

const robotsTxt = `# CuritiPão — robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /docs/

Sitemap: https://curitipao.com.br/sitemap.xml
`;
fs.writeFileSync('./robots.txt', robotsTxt, 'utf8');
console.log('Generated robots.txt');

console.log('ALL PAGES SUCCESSFULLY GENERATED!');
