const fs = require('fs');
const path = require('path');

const targetDir = './festival/2026';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

// Copy style.css from curitipao-2026
let originalCss = fs.readFileSync('../curitipao-2026/style.css', 'utf8');

// Append discrete return bar styling & gallery styling
const extraCss = `
/* ========================================================
   PORTAL RETURN BAR & 2026 ARCHIVE ENHANCEMENTS
   ======================================================== */
.portal-return-bar {
  background: #3B1F14;
  color: #FAF4EC;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 0.875rem;
  position: sticky;
  top: 0;
  z-index: 9999;
  border-bottom: 2px solid #D08942;
}

.portal-return-link {
  color: #FAF4EC;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: color 0.2s;
}

.portal-return-link:hover {
  color: #D08942;
  text-decoration: underline;
}

.portal-return-badge {
  background: #D08942;
  color: #3B1F14;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .portal-return-bar {
    flex-direction: column;
    gap: 6px;
    text-align: center;
    padding: 8px 12px;
  }
}

/* Galeria organizada por padaria */
.festival-gallery-section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.festival-gallery-header {
  text-align: center;
  margin-bottom: 40px;
}

.festival-gallery-header h2 {
  font-size: 2rem;
  color: #5D3323;
  margin-bottom: 12px;
}

.festival-gallery-header p {
  color: #666;
  max-width: 650px;
  margin: 0 auto;
  font-size: 1rem;
}

.festival-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.gallery-thumb-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(93, 51, 35, 0.08);
  border: 1px solid #E8D8C8;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.gallery-thumb-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(93, 51, 35, 0.15);
}

.gallery-thumb-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  cursor: pointer;
  background: #eee;
}

.gallery-thumb-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-thumb-media:hover img {
  transform: scale(1.05);
}

.gallery-thumb-info {
  padding: 14px 16px;
}

.gallery-thumb-bakery {
  font-size: 0.8rem;
  font-weight: 700;
  color: #D08942;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.gallery-thumb-product {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

/* ========================================================
   SEÇÃO CURITIPÃO NA IMPRENSA
   ======================================================== */
.festival-press-section {
  padding: 60px 20px 80px;
  background-color: #FAF4EC;
  border-top: 1px solid #E8D8C8;
  border-bottom: 1px solid #E8D8C8;
  margin-top: 40px;
}

.festival-press-container {
  max-width: 1200px;
  margin: 0 auto;
}

.festival-press-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 45px;
}

.press-badge {
  display: inline-block;
  background-color: #D08942;
  color: #3B1F14;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.festival-press-title {
  color: #5D3323;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.25;
}

.festival-press-intro {
  color: #6A554A;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 auto;
}

.festival-press-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.press-card {
  background: #FFFFFF;
  border: 1px solid #E8D8C8;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 16px rgba(93, 51, 35, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.press-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(93, 51, 35, 0.12);
  border-color: #D08942;
}

.press-card-body {
  margin-bottom: 20px;
}

.press-card-vehicle {
  color: #D08942;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.press-card-title {
  color: #3B1F14;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.45;
  margin-bottom: 12px;
}

.press-card-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8C7567;
  font-size: 0.82rem;
  font-weight: 500;
}

.press-card-date svg {
  color: #D08942;
  flex-shrink: 0;
}

/* Capa Horizontal da Imprensa */
.press-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  background-color: #F5EDE4;
}

.press-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.press-card:hover .press-card-media img {
  transform: scale(1.04);
}

.press-media-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(30, 21, 17, 0.88);
  color: #FAF4EC;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(208, 137, 66, 0.4);
}

.press-card-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #F0E5D9;
}

.press-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.press-card-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #5D3323;
  color: #FAF4EC;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
  width: 100%;
}

.press-card-btn-video {
  background-color: #D08942;
  color: #1E1511;
  font-weight: 700;
}

.press-card-btn-video:hover {
  background-color: #E29C58;
  color: #000000;
}

.press-card-btn:hover {
  background-color: #D08942;
  color: #3B1F14;
}

.press-card-btn svg {
  transition: transform 0.2s ease;
}

.press-card-btn:hover svg {
  transform: translate(2px, -2px);
}

/* Compatibilidade com modo escuro */
@media (prefers-color-scheme: dark) {
  .festival-press-section {
    background-color: #1E1511;
    border-color: #3A261D;
  }
  .festival-press-title {
    color: #FAF4EC;
  }
  .festival-press-intro {
    color: #CDBBB0;
  }
  .press-card {
    background: #281B15;
    border-color: #442E23;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
  .press-card:hover {
    border-color: #D08942;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  }
  .press-card-title {
    color: #FAF4EC;
  }
  .press-card-date {
    color: #B59F91;
  }
  .press-card-footer {
    border-color: #3A261D;
  }
  .press-card-btn {
    background-color: #D08942;
    color: #1E1511;
  }
  .press-card-btn:hover {
    background-color: #FAF4EC;
    color: #1E1511;
  }
}

[data-theme="dark"] .festival-press-section {
  background-color: #1E1511;
  border-color: #3A261D;
}
[data-theme="dark"] .festival-press-title {
  color: #FAF4EC;
}
[data-theme="dark"] .festival-press-intro {
  color: #CDBBB0;
}
[data-theme="dark"] .press-card {
  background: #281B15;
  border-color: #442E23;
}
[data-theme="dark"] .press-card-title {
  color: #FAF4EC;
}
[data-theme="dark"] .press-card-date {
  color: #B59F91;
}
[data-theme="dark"] .press-card-footer {
  border-color: #3A261D;
}
[data-theme="dark"] .press-card-btn {
  background-color: #D08942;
  color: #1E1511;
}
[data-theme="dark"] .press-card-btn:hover {
  background-color: #FAF4EC;
  color: #1E1511;
}

#imprensa,
.festival-press-section,
#padarias,
.cards-section,
.card,
.anchor-target-alias {
  scroll-margin-top: 90px;
}

.anchor-target-alias {
  display: block;
  position: relative;
  visibility: hidden;
  pointer-events: none;
  height: 0;
  margin: 0;
  padding: 0;
}

/* GRADE RESPONSIVA DOS 15 CARDS HISTÓRICOS */
.cards {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 1.5rem !important;
  align-items: stretch !important;
  width: 100% !important;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.5rem !important;
  }
}

@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.75rem !important;
  }
}

.card {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  min-height: auto !important;
  box-sizing: border-box !important;
}

.card .contact {
  margin-top: auto !important;
}

@media (max-width: 768px) {
  #imprensa,
  .festival-press-section,
  #padarias,
  .cards-section,
  .card,
  .anchor-target-alias {
    scroll-margin-top: 130px;
  }
}

@media (max-width: 640px) {
  .festival-press-section {
    padding: 40px 16px 60px;
  }
  .festival-press-title {
    font-size: 1.7rem;
  }
  .festival-press-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .press-card {
    padding: 18px;
  }
}
`;

fs.writeFileSync(path.join(targetDir, 'style.css'), originalCss + '\n' + extraCss, 'utf8');

// Copy main.js from curitipao-2026
let originalJs = fs.readFileSync('../curitipao-2026/main.js', 'utf8');

// Add gallery lightbox handler and anchor scroll handler to main.js
const extraJs = `
// Extra lightbox handler for gallery thumbs
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.querySelector('.lightbox');
  const lbImg = lightbox ? lightbox.querySelector('img') : null;
  if (!lightbox || !lbImg) return;

  document.querySelectorAll('.gallery-thumb-media img').forEach(img => {
    img.addEventListener('click', (e) => {
      lbImg.src = e.target.src;
      lbImg.alt = e.target.alt;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
});

// Ensure smooth and accurate scroll to hash if page loaded with an anchor
if (window.location.hash) {
  // Redirecionamento exclusivo do fragmento #imprensa para a página dedicada /imprensa/#2026
  if (window.location.hash === '#imprensa') {
    window.location.replace('/imprensa/#2026');
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    });
  }
}

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#imprensa') {
    window.location.replace('/imprensa/#2026');
  }
});
`;
fs.writeFileSync(path.join(targetDir, 'main.js'), originalJs + '\n' + extraJs, 'utf8');

// Read original index.html
let originalHtml = fs.readFileSync('../curitipao-2026/index.html', 'utf8');

// 1. Update canonical & OpenGraph URLs to new domain and route
originalHtml = originalHtml.replace(
  /<link rel="canonical" href="https:\/\/curitipao\.conexus\.press\/">/,
  '<link rel="canonical" href="https://curitipao.com.br/festival/2026/">'
);
originalHtml = originalHtml.replaceAll('https://curitipao.conexus.press/', 'https://curitipao.com.br/festival/2026/');

// Inject immediate hash redirect in <head> for #imprensa specifically
const immediateHashRedirectScript = `
  <script>
    if (window.location.hash === '#imprensa') {
      window.location.replace('/imprensa/#2026');
    }
    window.addEventListener('hashchange', function() {
      if (window.location.hash === '#imprensa') {
        window.location.replace('/imprensa/#2026');
      }
    });
  </script>
`;
originalHtml = originalHtml.replace('</head>', immediateHashRedirectScript + '\n</head>');

// 2. Adjust assets paths to root /assets/
originalHtml = originalHtml.replaceAll('srcset="assets/', 'srcset="/assets/');
originalHtml = originalHtml.replaceAll('srcset="./assets/', 'srcset="/assets/');
originalHtml = originalHtml.replaceAll('src="assets/', 'src="/assets/');
originalHtml = originalHtml.replaceAll('src="./assets/', 'src="/assets/');
originalHtml = originalHtml.replaceAll('href="assets/', 'href="/assets/');
originalHtml = originalHtml.replaceAll('href="/assets/', 'href="/assets/');
originalHtml = originalHtml.replaceAll('src="./main.js', 'src="./main.js');
originalHtml = originalHtml.replaceAll('href="./style.css', 'href="./style.css');

// 3. Insert Return to Portal Bar right after <body>
const returnBarHtml = `
  <!-- BARRA DISCRETA DE RETORNO AO PORTAL CURITIPÃO -->
  <aside class="portal-return-bar" aria-label="Navegação do Portal">
    <a href="/" class="portal-return-link" title="Voltar à página inicial do CuritiPão">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      <span>Voltar ao portal CuritiPão</span>
    </a>
    <div class="portal-return-actions" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
      <a href="/imprensa/#2026" class="portal-return-link" style="color: #FAF4EC; opacity: 0.95; font-size: 0.82rem; text-decoration: underline; display: inline-flex; align-items: center; gap: 4px;" title="Ver cobertura na imprensa">
        <span>CuritiPão na imprensa</span>
        <span aria-hidden="true">&rarr;</span>
      </a>
      <span class="portal-return-badge">Edição Encerrada • Arquivo Histórico Oficial 2026</span>
    </div>
  </aside>
`;

originalHtml = originalHtml.replace('<body>', '<body>\n' + returnBarHtml);

// 4. Build Gallery of the 15 Bakeries with Photo Credits & Disclaimers
const bakeries = JSON.parse(fs.readFileSync('./assets/data/bakeries_2026.json', 'utf8'));

let galleryCardsHtml = bakeries.map(b => {
  const photo = (b.photos && b.photos[0]) ? b.photos[0] : { src: '/assets/photos/curitipao-111.jpg', alt: b.product };
  let photoSrc = photo.src;
  if (!photoSrc.startsWith('/') && !photoSrc.startsWith('http')) photoSrc = '/' + photoSrc;
  return `
      <div class="gallery-thumb-card">
        <div class="gallery-thumb-media" title="Clique para ampliar">
          <img src="${photoSrc}" alt="${photo.alt || b.product}" loading="lazy">
        </div>
        <div class="gallery-thumb-info">
          <div class="gallery-thumb-bakery">${b.name}</div>
          <div class="gallery-thumb-product">${b.product}</div>
          <div class="gallery-photo-credit" style="font-size: 0.75rem; color: #8C7567; margin-top: 4px; font-style: italic;">Foto: Lorena Lenara Batista</div>
          <p class="gallery-creation-disclaimer" style="font-size: 0.72rem; color: #6A554A; margin-top: 4px; font-style: italic; line-height: 1.35;">Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</p>
        </div>
      </div>`;
}).join('\n');

// 5. Structure Gallery & Press Section in /festival/2026/
// The full list of external articles has been migrated to /imprensa/#2026 per approved specification.
// In /festival/2026/, we maintain the local RIC video player with presentation and playback working,
// with the button "Ver cobertura na imprensa" pointing to /imprensa/#2026.
const galleryAndPressHtml = `
  <!-- GALERIA ORGANIZADA POR PADARIA (EDIÇÃO 2026) -->
  <section class="festival-gallery-section" id="galeria-2026">
    <div class="festival-gallery-header">
      <h2>Galeria das 15 Criações do Festival 2026</h2>
      <p>Todas as fotos históricas dos pães e criações desenvolvidas com exclusividade pelas 15 padarias participantes do primeiro festival.</p>
    </div>
    <div class="festival-gallery-grid">
      ${galleryCardsHtml}
    </div>
  </section>

  <!-- SEÇÃO HISTÓRICA: VÍDEO RICTV & DIRECIONAMENTO PARA COBERTURA NA IMPRENSA -->
  <section class="festival-press-section" id="imprensa" aria-labelledby="imprensa-titulo">
    <div class="festival-press-container">
      <div class="festival-press-header">
        <span class="press-badge">Cobertura & Registro</span>
        <h2 id="imprensa-titulo" class="festival-press-title">CuritiPão na imprensa</h2>
        <p class="festival-press-intro">
          A cobertura da primeira edição do Festival CuritiPão reuniu 17 publicações externas em 12 veículos de imprensa, além de matéria exclusiva em vídeo da RICtv Record.
        </p>
      </div>

      <!-- Destaque: Vídeo Local da RICtv Record no Arquivo Histórico -->
      <div class="festival-video-featured-card" style="background: #FFFFFF; border: 1px solid #E8D8C8; border-radius: 12px; padding: 24px; max-width: 880px; margin: 0 auto; box-shadow: 0 4px 16px rgba(93, 51, 35, 0.06);">
        <div style="margin-bottom: 16px;">
          <video controls preload="metadata" poster="/assets/press/ric-noticias-manha-frame.jpg" style="width: 100%; border-radius: 8px; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: #000;">
            <source src="/assets/press/ric-noticias-manha-video.mp4" type="video/mp4">
            Seu navegador não suporta reprodução direta de vídeos em MP4.
          </video>
          <div style="font-size: 0.78rem; color: #8C7567; margin-top: 6px; font-style: italic;">
            Captura: RICtv / Record • Edição Manhã (09/10/2026)
          </div>
        </div>
        <div>
          <div style="color: #D08942; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            RICtv / Record • Reportagem em Vídeo
          </div>
          <h3 style="color: #3B1F14; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">
            CuritiPão estreia em Curitiba com receitas exclusivas de 15 padarias
          </h3>
          <p style="color: #6A554A; font-size: 0.95rem; line-height: 1.55; margin-bottom: 18px;">
            Assista à matéria do telejornal da RICtv sobre as criações exclusivas das 15 padarias de Curitiba. A lista completa com todas as 17 publicações externas e reportagens sobre a edição histórica de 2026 está disponível em nossa seção dedicada à imprensa.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
            <a href="/imprensa/#2026" class="press-card-btn press-card-btn-video" style="padding: 12px 24px; font-size: 0.95rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border-radius: 8px; background: #D08942; color: #1E1511;">
              <span>Ver cobertura na imprensa</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Aviso com link visível como alternativa sem JavaScript -->
      <noscript>
        <div style="margin-top: 24px; padding: 16px; background: #FAF4EC; border: 1px solid #D08942; border-radius: 8px; text-align: center;">
          <p style="margin-bottom: 6px; color: #3B1F14; font-weight: 600;">
            A lista completa com as 17 publicações foi migrada para nossa página de imprensa:
          </p>
          <a href="/imprensa/#2026" style="color: #D08942; font-weight: 700; text-decoration: underline;">
            Acessar cobertura completa em /imprensa/#2026 &rarr;
          </a>
        </div>
      </noscript>
    </div>
  </section>
`;

// Insert gallery and press before footer-sponsors-strip
originalHtml = originalHtml.replace(
  '<section class="hero-sponsors-strip footer-sponsors-strip">',
  galleryAndPressHtml + '\n  <section class="hero-sponsors-strip footer-sponsors-strip">'
);

// 6. Add id="padarias" to cards section and individual IDs to the 15 bakery cards
originalHtml = originalHtml.replace('<section class="cards-section">', '<section class="cards-section" id="padarias">');

const bakeryAnchorSlugs = [
  'aquarius-panificadora',
  'aqui-na-mata',
  'bonin-bakery',
  'confraria-dos-paes',
  'fabiano-marcolini-alimentari',
  'fabrika-paes',
  'felipane',
  'haiat-atelie-do-pao',
  'maca-organica-padaria',
  'padaria-america',
  'padaria-familia-farinha',
  'padaria-requinte',
  'piegel-paes',
  'saint-germain-panificadora',
  'sphair-atelie-de-paes'
];

const bakeryAnchorAliases = {
  'aquarius-panificadora': ['aquarius'],
  'aqui-na-mata': ['mata'],
  'bonin-bakery': ['bonin'],
  'confraria-dos-paes': ['confraria'],
  'fabiano-marcolini-alimentari': ['fabiano-marcolini', 'marcolini'],
  'fabrika-paes': ['fabrika'],
  'felipane': ['feli-pane'],
  'haiat-atelie-do-pao': ['haiat'],
  'maca-organica-padaria': ['maca-padaria-artesanal', 'maca-padaria', 'maca'],
  'padaria-america': ['america'],
  'padaria-familia-farinha': ['familia-farinha'],
  'padaria-requinte': ['requinte'],
  'piegel-paes': ['piegel'],
  'saint-germain-panificadora': ['saint-germain'],
  'sphair-atelie-de-paes': ['sphair', 'atelie-de-paes']
};

let cardIndex = 0;
originalHtml = originalHtml.replace(/(<!-- Card \d+: [^>]+ -->\s*)<article class="card">/g, (match, prefix) => {
  const slug = bakeryAnchorSlugs[cardIndex++];
  const aliases = (bakeryAnchorAliases[slug] || []).map(a => `<span id="${a}" class="anchor-target-alias" aria-hidden="true"></span>`).join('');
  return `${prefix}<article class="card" id="${slug}">${aliases}`;
});

// 7. Add photo credits and disclaimers to 15 bakery cards
originalHtml = originalHtml.replaceAll(
  '</div>\n        <h3>',
  '</div>\n        <div class="photo-credit-strip" style="font-size: 0.78rem; color: #8C7567; margin: 4px 0 10px; font-style: italic;">Foto: Lorena Lenara Batista</div>\n        <h3>'
);

originalHtml = originalHtml.replace(
  /(<p>Descrição: [^<]+<\/p>)/g,
  '$1\n        <p class="creation-disclaimer" style="font-size: 0.82rem; color: #7C6053; margin: 6px 0 12px; font-style: italic; line-height: 1.4;">Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</p>'
);

// Credit under closing banner photo
originalHtml = originalHtml.replace(
  'class="closing-banner-photo" width="720" height="520" loading="eager">\n      </div>',
  'class="closing-banner-photo" width="720" height="520" loading="eager">\n        <div style="font-size: 0.78rem; color: #FAF4EC; opacity: 0.85; margin-top: 6px; font-style: italic; text-align: right;">Foto: Lorena Lenara Batista</div>\n      </div>'
);

// 8. Add prominent portal return button and update privacy policy in footer
originalHtml = originalHtml.replace(
  '<p class="privacy-paragraph">\n      <a href="politica-de-privacidade.html" class="privacy-link">Política de Privacidade</a>\n    </p>',
  `<div class="footer-portal-callout" style="margin: 25px auto 15px; text-align: center;">
      <a href="/" class="btn-footer-portal" style="display: inline-flex; align-items: center; gap: 8px; background: #D08942; color: #1E1511; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s, background 0.2s;">
        <span>&larr; Conhecer o Portal Permanente CuritiPão</span>
      </a>
    </div>
    <p class="privacy-paragraph">
      <a href="/privacidade/" class="privacy-link">Política de Privacidade</a>
    </p>`
);

fs.writeFileSync(path.join(targetDir, 'index.html'), originalHtml, 'utf8');
console.log('festival/2026/index.html, style.css and main.js generated successfully!');
