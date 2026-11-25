const fs = require('fs');

let code = fs.readFileSync('scripts/build_pages.cjs', 'utf8');

// 1. Add require
if (!code.includes('croissant_article.cjs')) {
  code = code.replace(
    "const blogArticlesData = require('../content/blog/articles.json');",
    "const { getCroissantArticleContent } = require('./croissant_article.cjs');\nconst blogArticlesData = require('../content/blog/articles.json');"
  );
  console.log('1. Require added');
}

// 2. Add card in roteirosContent
const cardToInsert = `
        <!-- Roteiro Publicado: Onde comer croissant no estilo francês em Curitiba -->
        <article class="card-editorial" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 24px; background: var(--color-surface); border: 2px solid var(--color-accent); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
          <div class="card-media" style="min-height: 260px; height: 100%;">
            <a href="/roteiros/onde-comer-croissant-em-curitiba/" style="display: block; height: 100%;">
              <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/capa-croissant-curitiba-16x9.webp" alt="Onde comer croissant no estilo francês em Curitiba" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="eager">
            </a>
          </div>
          <div class="card-body" style="padding: 28px; display: flex; flex-direction: column; justify-content: center;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
              <span class="badge badge-gold">Roteiro Temático</span>
              <span class="card-tag" style="margin: 0;">Viennoiserie • 10 Lugares</span>
            </div>
            <h2 class="card-title" style="font-size: 1.6rem; margin-bottom: 12px; line-height: 1.3;">
              <a href="/roteiros/onde-comer-croissant-em-curitiba/" style="color: var(--color-primary); text-decoration: none;">Onde comer croissant no estilo francês em Curitiba</a>
            </h2>
            <p class="card-desc" style="font-size: 1rem; line-height: 1.6; margin-bottom: 20px; color: var(--color-text);">
              10 lugares para provar croissant artesanal sem recheio, da padaria de bairro à confeitaria francesa.
            </p>
            <div class="card-footer" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid var(--color-border); flex-wrap: wrap; gap: 10px;">
              <span style="font-size: 0.85rem; color: var(--color-text-muted); font-style: italic;">Curadoria CuritiPão • Fotos do Acervo</span>
              <a href="/roteiros/onde-comer-croissant-em-curitiba/" class="btn btn-primary">Abrir matéria &rarr;</a>
            </div>
          </div>
        </article>`;

if (!code.includes('/roteiros/onde-comer-croissant-em-curitiba/')) {
  const target = 'Abrir matéria completa &rarr;</a>';
  const idx = code.indexOf(target);
  if (idx !== -1) {
    const endArticleIdx = code.indexOf('</article>', idx);
    if (endArticleIdx !== -1) {
      const insertPos = endArticleIdx + '</article>'.length;
      code = code.slice(0, insertPos) + '\n' + cardToInsert + code.slice(insertPos);
      console.log('2. Card inserted in roteirosContent');
    }
  }
}

// 3. Add page generation
const pageGenCode = `
// -------------------------------------------------------------
// PAGE 5C: ROTEIRO INDIVIDUAL - ONDE COMER CROISSANT EM CURITIBA (/roteiros/onde-comer-croissant-em-curitiba/)
// -------------------------------------------------------------
ensureDir('./roteiros/onde-comer-croissant-em-curitiba');

const roteiroCroissantSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Onde comer croissant no estilo francês em Curitiba",
  "alternativeHeadline": "Onde comer croissant em Curitiba: 10 lugares no estilo francês",
  "description": "Descubra onde comer croissant em Curitiba. Veja 10 padarias, cafés e confeitarias que servem croissant artesanal no estilo francês, puro e sem recheio.",
  "image": [
    "https://curitipao.com.br/assets/photos/roteiros/onde-comer-croissant-em-curitiba/capa-croissant-curitiba-16x9.webp"
  ],
  "datePublished": "2026-11-25T12:00:00-03:00",
  "dateModified": "2026-11-25T12:00:00-03:00",
  "author": {
    "@type": "Organization",
    "name": "Curadoria CuritiPão",
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
    "@id": "https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/"
  },
  "keywords": "croissant Curitiba, onde comer croissant Curitiba, croissant francês Curitiba, viennoiserie Curitiba, padarias artesanais Curitiba"
};

const roteiroCroissantHtml = wrapPage({
  title: 'Onde comer croissant em Curitiba: 10 lugares no estilo francês',
  description: 'Descubra onde comer croissant em Curitiba. Veja 10 padarias, cafés e confeitarias que servem croissant artesanal no estilo francês, puro e sem recheio.',
  canonical: '/roteiros/onde-comer-croissant-em-curitiba/',
  activeRoute: '/roteiros/',
  ogType: 'article',
  ogImage: 'https://curitipao.com.br/assets/photos/roteiros/onde-comer-croissant-em-curitiba/capa-croissant-curitiba-16x9.webp',
  schemaJson: roteiroCroissantSchema,
  content: getCroissantArticleContent()
});
fs.writeFileSync('./roteiros/onde-comer-croissant-em-curitiba/index.html', roteiroCroissantHtml, 'utf8');
console.log('Generated roteiros/onde-comer-croissant-em-curitiba/index.html');
`;

if (!code.includes('roteiroCroissantHtml')) {
  const targetGen = "console.log('Generated roteiros/padarias-em-curitiba-por-bairro/index.html');";
  const idxGen = code.indexOf(targetGen);
  if (idxGen !== -1) {
    const insertPos = idxGen + targetGen.length;
    code = code.slice(0, insertPos) + '\n' + pageGenCode + code.slice(insertPos);
    console.log('3. Page generation code added');
  }
}

fs.writeFileSync('scripts/build_pages.cjs', code, 'utf8');
console.log('scripts/build_pages.cjs updated successfully.');
