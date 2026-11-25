const fs = require('fs');

const establishments = [
  {
    key: 'bonin-bakery',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant Bonin Bakery.jpeg',
    alt: 'Croissant artesanal folhado de fermentação natural da Bonin Bakery',
    padaria: 'Bonin Bakery • Centro',
    ariaLabel: 'Ampliar foto: Croissant da Bonin Bakery',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-bonin-bakery.webp',
    width: 960,
    height: 1280,
    maxWidth: 330,
    caption: 'Croissant de fermentação natural servido aquecido'
  },
  {
    key: 'brod-bakery',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant brod bakery.jpeg',
    alt: 'Croissant folhado tradicional com manteiga francesa da Brød Bakery',
    padaria: 'Brød Bakery • Santo Inácio',
    ariaLabel: 'Ampliar foto: Croissant da Brød Bakery',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-brod-bakery.webp',
    width: 604,
    height: 785,
    maxWidth: 338,
    caption: 'Folhamento em sala climatizada com manteiga francesa'
  },
  {
    key: 'felipane',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant felipane.jpeg',
    alt: 'Croissant simples artesanal folhado da Felipane no Juvevê',
    padaria: 'Felipane • Juvevê',
    ariaLabel: 'Ampliar foto: Croissant da Felipane',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-felipane.webp',
    width: 822,
    height: 791,
    maxWidth: 457,
    caption: 'Croissant simples de padaria artesanal de bairro'
  },
  {
    key: 'lucca-cafes-especiais',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant lucca.jpeg',
    alt: 'Croissant folhado dourado e amanteigado do Lucca Cafés Especiais no Batel',
    padaria: 'Lucca Cafés Especiais • Batel',
    ariaLabel: 'Ampliar foto: Croissant do Lucca Cafés Especiais',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-lucca.webp',
    width: 768,
    height: 1024,
    maxWidth: 330,
    caption: 'Casquinha brilhante e massa amanteigada com café especial'
  },
  {
    key: 'maca-padaria-artesanal',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant maca padaria.jpeg',
    alt: 'Croissant clássico folhado da Maçã Padaria Artesanal Brasileira',
    padaria: 'Maçã Padaria Artesanal • Curitiba',
    ariaLabel: 'Ampliar foto: Croissant da Maçã Padaria Artesanal',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-maca-padaria.webp',
    width: 782,
    height: 801,
    maxWidth: 430,
    caption: 'Croissant clássico bem executado'
  },
  {
    key: 'noni-padaria',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant noni.jpeg',
    alt: 'Croissant artesanal leve e folhado em camadas da Noni Padaria no Ahú',
    padaria: 'Noni Padaria • Ahú',
    ariaLabel: 'Ampliar foto: Croissant da Noni Padaria',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-noni.webp',
    width: 768,
    height: 1024,
    maxWidth: 330,
    caption: 'O famoso "croi", folhado com estrutura e leveza'
  },
  {
    key: 'origem-padaria',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant Origem padaria.jpeg',
    alt: 'Croissant tradicional francês com farinha francesa e manteiga da Origem Padaria',
    padaria: 'Origem Padaria • Centro',
    ariaLabel: 'Ampliar foto: Croissant da Origem Padaria',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-origem-padaria.webp',
    width: 624,
    height: 803,
    maxWidth: 342,
    caption: 'Massa que desmancha na boca com sabor de manteiga'
  },
  {
    key: 'pao-prosa',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant Pao Prosa.jpeg',
    alt: 'Croissant artesanal aberto à mão com camadas delicadas da Pão Prosa',
    padaria: 'Pão Prosa • Cristo Rei',
    ariaLabel: 'Ampliar foto: Croissant da Pão Prosa',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-pao-prosa.webp',
    width: 581,
    height: 763,
    maxWidth: 335,
    caption: 'Massa aberta artesanalmente com rolo e cilindro'
  },
  {
    key: 'prestinaria',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant prestinaria.jpeg',
    alt: 'Croissant tradicional folhado em camadas da Prestinaria',
    padaria: 'Prestinaria • Curitiba',
    ariaLabel: 'Ampliar foto: Croissant da Prestinaria',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-prestinaria.webp',
    width: 653,
    height: 802,
    maxWidth: 358,
    caption: 'Croissant tradicional da casa'
  },
  {
    key: 'sphair-gourmande',
    fullSrc: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant sphair.jpeg',
    alt: 'Croissant artesanal receita Le Cordon Bleu do Sphair Gourmande Ateliê de Pães',
    padaria: 'Sphair Gourmande • Ahú',
    ariaLabel: 'Ampliar foto: Croissant do Sphair Gourmande',
    webp: '/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-sphair.webp',
    width: 768,
    height: 1024,
    maxWidth: 330,
    caption: 'Receita Le Cordon Bleu de Paris com farinha francesa'
  }
];

let content = fs.readFileSync('scripts/croissant_article.cjs', 'utf8');

establishments.forEach(est => {
  // Regex to match the old figure block inside this article item
  // Matches from `<article class="roteiro-bakery-item" id="${est.key}">\s*<figure class="roteiro-bakery-figure"[^>]*>[\s\S]*?</figure>`
  const pattern = new RegExp(
    `(<article class="roteiro-bakery-item" id="${est.key}">\\s*)<figure class="roteiro-bakery-figure"[^>]*>[\\s\\S]*?<\\/figure>`,
    'g'
  );

  const newFigureHtml = `$1<div class="roteiro-internal-photo-stage">
          <figure class="roteiro-internal-figure" style="max-width: min(100%, ${est.maxWidth}px);">
            <button type="button" class="demo-photo-btn roteiro-internal-zoom-btn" data-full-src="${est.fullSrc}" data-alt="${est.alt}" data-padaria="${est.padaria}" aria-label="${est.ariaLabel}">
              <img src="${est.webp}" alt="${est.alt}" class="roteiro-internal-img" width="${est.width}" height="${est.height}" loading="lazy">
              <span class="demo-photo-zoom-hint" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                <span>Ampliar</span>
              </span>
            </button>
            <figcaption class="roteiro-internal-caption">
              <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
              <span>${est.caption}</span>
            </figcaption>
          </figure>
        </div>`;

  if (!pattern.test(content)) {
    console.error(`Pattern not found for establishment: ${est.key}`);
    process.exit(1);
  }
  content = content.replace(pattern, newFigureHtml);
});

fs.writeFileSync('scripts/croissant_article.cjs', content, 'utf8');
console.log('Successfully updated all 10 establishment photos in scripts/croissant_article.cjs');
