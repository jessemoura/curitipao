const fs = require('fs');
const path = require('path');

const targetDir = './festival/2026';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

// Read bakers list for proper-case names and gallery generation
const bakeries = JSON.parse(fs.readFileSync('./assets/data/bakeries_2026.json', 'utf8'));

// Copy style.css from curitipao-2026 and switch default typography to Plus Jakarta Sans
let originalCss = fs.readFileSync('../curitipao-2026/style.css', 'utf8');
originalCss = originalCss.replace(
  /@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:[^']+'\);/,
  "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');"
);
originalCss = originalCss.replaceAll(
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
);
// Scope raw prefers-color-scheme dark block so explicit [data-theme="light"] toggle works cleanly
originalCss = originalCss.replace(
  /\/\* MODO ESCURO \(PREFERS-COLOR-SCHEME\) \*\/[\s\S]*?\n\}/,
  '/* Dark mode rules managed cleanly via [data-theme="dark"] and OS fallback below */'
);

const darkDeclarations = `
  html, body, .site-header {
    background-color: #140F0D;
    color: #F6EDE3;
  }
  .top-bar {
    background: #140F0D;
    border-bottom-color: #2F241F;
    color: #F6EDE3;
  }
  .top-bar a {
    color: #F6EDE3;
  }
  .top-bar a:hover {
    color: #F4C491;
  }
  .closing-banner {
    background: linear-gradient(135deg, #1E1612 0%, #2A1D16 50%, #1A1310 100%);
    border-bottom-color: rgba(208, 137, 66, 0.3);
  }
  .closing-banner::before {
    background: radial-gradient(circle at 15% 30%, rgba(208, 137, 66, 0.15) 0%, transparent 60%);
  }
  .closing-banner-logo {
    filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.6)) brightness(1.05);
  }
  .closing-badge {
    background: #8F3E10 !important;
    color: #FFFFFF !important;
  }
  .closing-title {
    color: #F6EDE3 !important;
  }
  .closing-desc,
  .closing-invite {
    color: #E8D8C8 !important;
  }
  .closing-highlight {
    color: #F4C491 !important;
  }
  .closing-portal-btn,
  .closing-btn {
    background: #E5A059 !important;
    color: #140F0D !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }
  .closing-portal-btn:hover,
  .closing-btn:hover {
    background: #F4C491 !important;
    color: #140F0D !important;
  }
  .closing-action-group {
    border-top-color: rgba(232, 216, 200, 0.15);
  }
  .closing-banner-photo {
    border-color: #38281F;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }
  .hero-sponsors-strip {
    background-color: #140F0D;
    border-color: #2F241F;
  }
  .hero-sponsor-logos-row {
    background: #FAF4EC;
    border-radius: 10px;
    padding: 12px 18px;
  }
  .hero-sponsor-heading .heading-title {
    color: #F4C491 !important;
  }
  .intro h2,
  .how-it-works h2,
  .step-title,
  .celebration-title,
  .video-title,
  .festival-gallery-header h2,
  .festival-press-title,
  .video-feature-heading {
    color: #F4C491 !important;
  }
  .intro p,
  .step-desc,
  .celebration-desc,
  .video-desc,
  .archive-disclaimer-text {
    color: #E8D8C8 !important;
  }
  .archive-disclaimer {
    background-color: rgba(208, 137, 66, 0.12);
    border-color: rgba(208, 137, 66, 0.4);
    border-left-color: #E5A059;
  }
  .step-card,
  .celebration-box,
  .video-card,
  .card,
  .gallery-thumb-card,
  .press-card,
  .festival-video-featured-card {
    background: #261E1A !important;
    border-color: #42342C !important;
    color: #F6EDE3 !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  }
  .step-number {
    background: #1F1815;
    color: #F4C491 !important;
    border-color: #E5A059 !important;
  }
  .video-kicker,
  .gallery-thumb-bakery,
  .press-card-vehicle,
  .video-feature-kicker {
    color: #F4C491 !important;
  }
  .video-action-bar {
    background: #1F1815;
    border-top-color: #42342C;
  }
  .video-cta-btn {
    background: #E5A059 !important;
    color: #140F0D !important;
  }
  .video-cta-btn:hover {
    background: #F4C491 !important;
    color: #140F0D !important;
  }
  .card h3,
  .gallery-thumb-product,
  .press-card-title {
    color: #F6EDE3 !important;
  }
  .card p,
  .card p.product-name,
  .card p.price {
    color: #E8D8C8 !important;
  }
  .card .contact {
    background: #1F1815 !important;
    border-top-color: #42342C !important;
  }
  .card .contact a.insta-link {
    color: #F6EDE3 !important;
  }
  .card .contact a.insta-link:hover {
    color: #F4C491 !important;
  }
  .map-btn,
  .unit-map-btn {
    background: #E5A059 !important;
    color: #140F0D !important;
  }
  .map-btn:hover,
  .unit-map-btn:hover {
    background: #F4C491 !important;
    color: #140F0D !important;
  }
  .units-common-schedule,
  .unit-item {
    background: #1F1815 !important;
    border-color: #42342C !important;
    color: #E8D8C8 !important;
  }
  .units-common-schedule strong,
  .unit-schedule strong {
    color: #F4C491 !important;
  }
  .unit-badge {
    background: rgba(244, 196, 145, 0.2) !important;
    color: #FDEBD6 !important;
  }
  .unit-address,
  .unit-schedule,
  .photo-credit-strip,
  .gallery-photo-credit,
  .gallery-creation-disclaimer,
  .creation-disclaimer,
  .festival-gallery-header p,
  .festival-press-intro,
  .press-card-date,
  .closing-photo-credit,
  .video-capture-credit,
  .video-feature-desc {
    color: #C0B0A5 !important;
  }
  .festival-press-section {
    background-color: #1F1815 !important;
    border-color: #42342C !important;
  }
  .press-card-footer {
    border-top-color: #42342C !important;
  }
  .press-card-btn {
    background-color: #E5A059 !important;
    color: #140F0D !important;
  }
  .press-card-btn:hover {
    background-color: #F4C491 !important;
    color: #140F0D !important;
  }
  .site-footer {
    background: #120D0B !important;
    border-top: 1px solid #42342C;
  }
  .privacy-link {
    color: #F4C491 !important;
  }
  .noscript-press-box {
    background: #261E1A;
    border-color: #E5A059;
  }
  .noscript-press-title {
    color: #F6EDE3;
  }
  .noscript-press-link {
    color: #F4C491;
  }
`;

function prefixCssSelectors(cssBlock, prefix) {
  return cssBlock.replace(/([^{}]+)\{([^{}]+)\}/g, (_, selectors, body) => {
    const prefixed = selectors
      .split(',')
      .map((s) => `${prefix} ${s.trim()}`)
      .join(',\n  ');
    return `${prefixed} {\n${body}\n  }`;
  });
}

// Append discrete return bar styling, gallery styling, typography standardization, AA contrast & Dark theme
const extraCss = `
/* ========================================================
   PORTAL RETURN BAR & 2026 ARCHIVE ENHANCEMENTS
   ======================================================== */
html,
body,
.portal-return-bar {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
  white-space: normal !important;
  overflow-wrap: break-word;
}

h1,
.closing-title {
  font-weight: 700 !important;
}

h2, h3, h4, h5, h6,
.step-title,
.celebration-title,
.video-title,
.card h3,
.festival-press-title,
.press-card-title,
.gallery-thumb-product,
.video-feature-heading {
  font-weight: 600 !important;
}

p,
.intro p,
.step-desc,
.celebration-desc,
.video-desc,
.archive-disclaimer-text,
.closing-desc,
.closing-highlight,
.closing-invite,
.card p,
.card p.product-name,
.card p.price,
.unit-address,
.unit-schedule,
.gallery-creation-disclaimer,
.creation-disclaimer,
.festival-press-intro,
.video-feature-desc,
.privacy-paragraph {
  font-weight: 400 !important;
  line-height: 1.6 !important;
  opacity: 1 !important;
}

.closing-badge,
.hero-sponsor-heading .heading-title,
.celebration-title,
.video-kicker,
.card h3,
.unit-badge,
.portal-return-badge,
.gallery-thumb-bakery,
.press-badge,
.press-card-vehicle,
.video-feature-kicker {
  text-transform: none !important;
  letter-spacing: 0.02em !important;
  white-space: normal;
  overflow-wrap: break-word;
}

button, input, select, textarea, .cookie-btn {
  font-family: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.portal-return-bar {
  background: #3B1F14;
  color: #FAF4EC;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  color: #F4C491;
  text-decoration: underline;
}

.portal-return-link-sub {
  color: #FAF4EC;
  font-size: 0.85rem;
  text-decoration: underline;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.portal-return-badge {
  background: #E5A059 !important;
  color: #140F0D !important;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

@media (max-width: 600px) {
  .portal-return-bar {
    flex-direction: column;
    gap: 8px;
    text-align: center;
    padding: 10px 12px;
  }
  .portal-return-actions {
    justify-content: center;
  }
}

/* Light Mode WCAG AA Fixes */
.closing-badge {
  background: #8F3E10 !important;
  color: #FFFFFF !important;
}

.closing-highlight {
  color: #8F3E10 !important;
}

.closing-portal-btn,
.closing-btn {
  background: #8F3E10 !important;
  color: #FFFFFF !important;
}

.closing-portal-btn:hover,
.closing-btn:hover {
  background: #73300A !important;
  color: #FFFFFF !important;
}

.closing-banner-media {
  flex-direction: column;
}

.closing-photo-credit {
  font-size: 0.8rem;
  color: #5E514A;
  margin-top: 8px;
  font-style: italic;
  text-align: right;
  max-width: 480px;
  width: 100%;
}

.hero-sponsor-heading .heading-title,
.step-number,
.video-kicker,
.gallery-thumb-bakery,
.press-card-vehicle,
.video-feature-kicker {
  color: #85490F !important;
}

.step-number {
  border-color: #85490F !important;
}

.video-cta-btn {
  background: #5D3323 !important;
  color: #FFFFFF !important;
}

.video-cta-btn:hover {
  background: #3F2216 !important;
  color: #FFFFFF !important;
}

.cookie-btn-accept {
  background: #E5A059 !important;
  color: #140F0D !important;
}

.cookie-text a {
  color: #F4C491 !important;
}

.photo-credit-strip {
  font-size: 0.8rem;
  color: #5E514A;
  margin: 6px 1.25rem 8px;
  font-style: italic;
}

.creation-disclaimer {
  font-size: 0.84rem;
  color: #5E514A;
  margin: 6px 1.25rem 12px;
  font-style: italic;
}

.gallery-photo-credit {
  font-size: 0.8rem;
  color: #5E514A;
  margin-top: 6px;
  font-style: italic;
}

.gallery-creation-disclaimer {
  font-size: 0.82rem;
  color: #5E514A;
  margin-top: 6px;
  font-style: italic;
}

.unit-address,
.unit-schedule {
  color: #4A382E !important;
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
  color: #5E514A;
  max-width: 650px;
  margin: 0 auto;
  font-size: 1rem;
}

.festival-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
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
  min-width: 0;
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
  font-size: 0.84rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.gallery-thumb-product {
  font-size: 0.98rem;
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
  background-color: #E5A059;
  color: #140F0D;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.festival-press-title {
  color: #5D3323;
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.25;
}

.festival-press-intro {
  color: #5E514A;
  font-size: 1.05rem;
  margin: 0 auto;
}

.festival-press-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 24px;
}

.festival-video-featured-card {
  background: #FFFFFF;
  border: 1px solid #E8D8C8;
  border-radius: 12px;
  padding: clamp(16px, 3vw, 24px);
  max-width: 880px;
  margin: 0 auto;
  box-shadow: 0 4px 16px rgba(93, 51, 35, 0.06);
}

.video-capture-credit {
  font-size: 0.8rem;
  color: #5E514A;
  margin-top: 6px;
  font-style: italic;
}

.video-feature-kicker {
  font-size: 0.84rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.video-feature-heading {
  color: #3B1F14;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.video-feature-desc {
  color: #5E514A;
  font-size: 0.95rem;
  margin-bottom: 18px;
}

.noscript-press-box {
  margin-top: 24px;
  padding: 16px;
  background: #FAF4EC;
  border: 1px solid #85490F;
  border-radius: 8px;
  text-align: center;
}

.noscript-press-title {
  margin-bottom: 6px;
  color: #3B1F14;
}

.noscript-press-link {
  color: #85490F;
  font-weight: 700;
  text-decoration: underline;
}

.btn-footer-portal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #E5A059;
  color: #140F0D;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, background 0.2s;
}

.btn-footer-portal:hover {
  background: #F4C491;
  color: #140F0D;
  transform: translateY(-1px);
}

.press-card {
  background: #FFFFFF;
  border: 1px solid #E8D8C8;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
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
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.press-card-title {
  color: #3B1F14;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.45;
  margin-bottom: 12px;
}

.press-card-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5E514A;
  font-size: 0.82rem;
  font-weight: 500;
}

.press-card-date svg {
  color: #85490F;
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
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
  width: 100%;
}

.press-card-btn-video {
  background-color: #E5A059;
  color: #140F0D;
  font-weight: 700;
}

.press-card-btn-video:hover {
  background-color: #F4C491;
  color: #140F0D;
}

.press-card-btn:hover {
  background-color: #3F2216;
  color: #FFFFFF;
}

.press-card-btn svg {
  transition: transform 0.2s ease;
}

.press-card-btn:hover svg {
  transform: translate(2px, -2px);
}

/* Dark Theme via Portal Toggle ([data-theme="dark"]) and OS Fallback */
${prefixCssSelectors(darkDeclarations, '[data-theme="dark"]')}

@media (prefers-color-scheme: dark) {
${prefixCssSelectors(darkDeclarations, ':root:not([data-theme="light"])')}
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
  min-width: 0;
  box-sizing: border-box !important;
}

.card .contact {
  margin-top: auto !important;
}

.unit-item-header {
  flex-wrap: wrap;
}

.footer-conexus {
  flex-wrap: wrap;
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
  body p {
    font-size: max(1rem, 16px) !important;
    line-height: 1.6 !important;
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

@media (max-width: 480px) {
  .card .contact {
    flex-wrap: wrap;
  }
  .btn-footer-portal {
    max-width: 100%;
    justify-content: center;
  }
  .conexus-logo {
    max-width: 155px;
  }
}
`;

fs.writeFileSync(path.join(targetDir, 'style.css'), originalCss + '\n' + extraCss, 'utf8');

// Copy main.js from curitipao-2026 and adapt slug lookup + privacy policy URL
let originalJs = fs.readFileSync('../curitipao-2026/main.js', 'utf8');
originalJs = originalJs.replace(
  'const id = BAKERY_SLUG_MAP[name]',
  'const id = BAKERY_SLUG_MAP[name] || BAKERY_SLUG_MAP[name.toUpperCase()]'
);
originalJs = originalJs.replaceAll('politica-de-privacidade.html', '/privacidade/');

// Add gallery lightbox handler, anchor scroll handler, and theme preference listener
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

// Sync live if user has not explicitly picked a portal theme
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try {
      if (!localStorage.getItem('curitipao_theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    } catch {}
  });
}

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

// Replace literal ALL CAPS strings while preserving proper nouns, acronyms, and accents
originalHtml = originalHtml.replaceAll('EDIÇÃO 2026 ENCERRADA', 'Edição 2026 encerrada');
originalHtml = originalHtml.replaceAll('>APOIO<', '>Apoio<');
originalHtml = originalHtml.replaceAll('>REALIZAÇÃO<', '>Realização<');
originalHtml = originalHtml.replaceAll('>VÍDEO DE ABERTURA<', '>Vídeo de abertura<');
for (const b of bakeries) {
  originalHtml = originalHtml.replaceAll(b.name.toUpperCase(), b.name);
}

// Inject theme sync + immediate hash redirect in <head> for #imprensa specifically
const immediateHeadScript = `
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('curitipao_theme');
        var theme = (saved === 'dark' || saved === 'light')
          ? saved
          : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
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
originalHtml = originalHtml.replace('</head>', immediateHeadScript + '\n</head>');

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
      <a href="/imprensa/#2026" class="portal-return-link portal-return-link-sub" title="Ver cobertura na imprensa">
        <span>CuritiPão na imprensa</span>
        <span aria-hidden="true">&rarr;</span>
      </a>
      <span class="portal-return-badge">Edição Encerrada • Arquivo Histórico Oficial 2026</span>
    </div>
  </aside>
`;

originalHtml = originalHtml.replace('<body>', '<body>\n' + returnBarHtml);

// 4. Build Gallery of the 15 Bakeries with Photo Credits & Disclaimers
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
          <div class="gallery-photo-credit">Foto: Lorena Lenara Batista</div>
          <p class="gallery-creation-disclaimer">Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</p>
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
      <div class="festival-video-featured-card">
        <div style="margin-bottom: 16px;">
          <video controls preload="metadata" poster="/assets/press/ric-noticias-manha-frame.jpg" style="width: 100%; border-radius: 8px; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: #000;">
            <source src="/assets/press/ric-noticias-manha-video.mp4" type="video/mp4">
            Seu navegador não suporta reprodução direta de vídeos em MP4.
          </video>
          <div class="video-capture-credit">
            Captura: RICtv / Record • Edição Manhã (09/10/2026)
          </div>
        </div>
        <div>
          <div class="video-feature-kicker">
            RICtv / Record • Reportagem em Vídeo
          </div>
          <h3 class="video-feature-heading">
            CuritiPão estreia em Curitiba com receitas exclusivas de 15 padarias
          </h3>
          <p class="video-feature-desc">
            Assista à matéria do telejornal da RICtv sobre as criações exclusivas das 15 padarias de Curitiba. A lista completa com todas as 17 publicações externas e reportagens sobre a edição histórica de 2026 está disponível em nossa seção dedicada à imprensa.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
            <a href="/imprensa/#2026" class="press-card-btn press-card-btn-video">
              <span>Ver cobertura na imprensa</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Aviso com link visível como alternativa sem JavaScript -->
      <noscript>
        <div class="noscript-press-box">
          <p class="noscript-press-title">
            A lista completa com as 17 publicações foi migrada para nossa página de imprensa:
          </p>
          <a href="/imprensa/#2026" class="noscript-press-link">
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
originalHtml = originalHtml.replace(
  /<\/div>\r?\n\s*<h3>/g,
  '</div>\n        <div class="photo-credit-strip">Foto: Lorena Lenara Batista</div>\n        <h3>'
);

originalHtml = originalHtml.replace(
  /(<p>Descrição: [^<]+<\/p>)/g,
  '$1\n        <p class="creation-disclaimer">Criação apresentada no Festival CuritiPão 2026. Consulte a padaria sobre a disponibilidade atual.</p>'
);

// Credit under closing banner photo
originalHtml = originalHtml.replace(
  /class="closing-banner-photo" width="720" height="520" loading="eager">\r?\n\s*<\/div>/,
  'class="closing-banner-photo" width="720" height="520" loading="eager">\n        <div class="closing-photo-credit">Foto: Lorena Lenara Batista</div>\n      </div>'
);

// 8. Add prominent portal return button and update privacy policy in footer
originalHtml = originalHtml.replace(
  /<p class="privacy-paragraph">\r?\n\s*<a href="politica-de-privacidade\.html" class="privacy-link">Política de Privacidade<\/a>\r?\n\s*<\/p>/,
  `<div class="footer-portal-callout" style="margin: 25px auto 15px; text-align: center;">
      <a href="/" class="btn-footer-portal">
        <span>&larr; Conhecer o Portal Permanente CuritiPão</span>
      </a>
    </div>
    <p class="privacy-paragraph">
      <a href="/privacidade/" class="privacy-link">Política de Privacidade</a>
    </p>`
);

fs.writeFileSync(path.join(targetDir, 'index.html'), originalHtml, 'utf8');
console.log('festival/2026/index.html, style.css and main.js generated successfully!');
