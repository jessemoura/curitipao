const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING THREE NEW BLOG ARTICLES ===\n');

let allOk = true;
function check(label, condition, extra = '') {
  if (condition) {
    console.log(`[PASS] ${label} ${extra}`);
  } else {
    console.error(`[FAIL] ${label} ${extra}`);
    allOk = false;
  }
}

const articlesData = require('../content/blog/articles.json');
const { countWords } = require('./prepare_three_historias.cjs');

const targets = [
  {
    slug: '/blog/origem-do-panetone/',
    h1: 'Qual é a origem do panetone? História, tradição e lendas',
    seoTitle: 'Origem do panetone: história e tradição | CuritiPão',
    description: 'Conheça a origem do panetone em Milão, as lendas sobre sua criação e as mudanças no preparo que fizeram desse pão uma tradição de Natal.',
    imageFile: 'historia-do-panetone.jpg',
    imageAlt: 'Panetone com uvas-passas e frutas cristalizadas, acompanhado de uma fatia sobre uma mesa de madeira.'
  },
  {
    slug: '/blog/historia-da-baguete-francesa/',
    h1: 'Baguete francesa: a história do pão que virou símbolo da França',
    seoTitle: 'Baguete francesa: história e tradição | CuritiPão',
    description: 'Conheça a história da baguete francesa, os saberes reconhecidos pela UNESCO e o trabalho por trás de seus ingredientes, formato e crosta.',
    imageFile: 'historia-da-baguete-francesa.jpg',
    imageAlt: 'Baguetes de crosta dourada e cortes diagonais, com um pedaço aberto mostrando o miolo.'
  },
  {
    slug: '/blog/pumpernickel-pao-alemao/',
    h1: 'Pumpernickel: conheça o pão alemão de preparo prolongado',
    seoTitle: 'Pumpernickel: conheça o pão alemão de centeio | CuritiPão',
    description: 'Descubra o que é Pumpernickel, o pão alemão de centeio ligado à Vestfália, e como o preparo prolongado define sua textura e sabor.',
    imageFile: 'pao-alemao-pumpernickel.jpg',
    imageAlt: 'Pão de centeio Pumpernickel escuro e compacto, com fatias finas sobre tecido e tábua de madeira.'
  }
];

// 1. Check each of the 3 articles
for (const target of targets) {
  console.log(`--- Checking ${target.slug} ---`);
  const htmlPath = path.resolve(`dist${target.slug}index.html`);
  check(`${target.slug} HTML exists in dist`, fs.existsSync(htmlPath));
  if (!fs.existsSync(htmlPath)) continue;

  const html = fs.readFileSync(htmlPath, 'utf8');

  // Single H1
  const h1s = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  check(`${target.slug} has exactly 1 H1`, h1s.length === 1, `(found: ${h1s.length})`);
  if (h1s.length === 1) {
    check(`${target.slug} H1 matches`, h1s[0].includes(target.h1));
  }

  // Title tag
  check(`${target.slug} SEO title tag`, html.includes(`<title>${target.seoTitle}</title>`));

  // Canonical
  const canonical = `https://curitipao.com.br${target.slug}`;
  check(`${target.slug} canonical`, html.includes(`<link rel="canonical" href="${canonical}">`));

  // Meta description
  check(`${target.slug} meta description`, html.includes(`<meta name="description" content="${target.description}">`));

  // Open Graph
  const ogImage = `https://curitipao.com.br/assets/photos/blog/historias-do-pao/${target.imageFile}`;
  check(`${target.slug} og:title`, html.includes(`property="og:title" content="${target.seoTitle}"`));
  check(`${target.slug} og:description`, html.includes(`property="og:description" content="${target.description}"`));
  check(`${target.slug} og:url`, html.includes(`property="og:url" content="${canonical}"`));
  check(`${target.slug} og:image`, html.includes(`property="og:image" content="${ogImage}"`));
  check(`${target.slug} og:image:width`, html.includes(`property="og:image:width" content="1200"`));
  check(`${target.slug} og:image:height`, html.includes(`property="og:image:height" content="675"`));
  check(`${target.slug} og:image:type`, html.includes(`property="og:image:type" content="image/jpeg"`));
  check(`${target.slug} og:type`, html.includes(`property="og:type" content="article"`));
  check(`${target.slug} og:site_name`, html.includes(`property="og:site_name" content="CuritiPão"`));

  // Twitter Card
  check(`${target.slug} twitter:card`, html.includes(`name="twitter:card" content="summary_large_image"`));
  check(`${target.slug} twitter:title`, html.includes(`name="twitter:title" content="${target.seoTitle}"`));
  check(`${target.slug} twitter:image`, html.includes(`name="twitter:image" content="${ogImage}"`));

  // Author signature
  check(`${target.slug} author is exclusively Curadoria CuritiPão`,
    html.includes('Por <strong>Curadoria CuritiPão</strong>') &&
    !html.includes('Bárbara') && !html.includes('Jesse') && !html.includes('Jessé')
  );

  // Caption
  check(`${target.slug} caption is Imagem ilustrativa`, html.includes('<span>Imagem ilustrativa</span>'));
  check(`${target.slug} no IA in caption`, !html.includes('gerada por IA'));

  // Image alt
  check(`${target.slug} image alt`, html.includes(`alt="${target.imageAlt}"`));

  // Schema.org
  check(`${target.slug} Schema BlogPosting`, html.includes('"@type":"BlogPosting"') || html.includes('"@type": "BlogPosting"'));
  check(`${target.slug} Schema BreadcrumbList`, html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"'));
  check(`${target.slug} Schema Organization CuritiPão`, html.includes('"author"') && html.includes('"CuritiPão"'));

  // Word count (> 800 words)
  const artData = articlesData.find(a => a.slug_suggested === target.slug);
  if (artData) {
    const wc = countWords(artData.body_markdown);
    check(`${target.slug} editorial word count > 800`, wc > 800, `(${wc} words)`);
  }

  // Series nav exists
  check(`${target.slug} has series nav`, html.includes('aria-label="Série Histórias do pão"'));
}

// 2. Check all 7 series articles have series nav with the other 6 members
console.log('\n--- Checking Series Navigation on All 7 Members ---');
const allSeriesSlugs = [
  '/blog/como-surgiu-o-pao/',
  '/blog/pao-islandia-calor-da-terra/',
  '/blog/lavash-pao-tradicional-armenia/',
  '/blog/shokupan-pao-japones/',
  '/blog/origem-do-panetone/',
  '/blog/historia-da-baguete-francesa/',
  '/blog/pumpernickel-pao-alemao/'
];

for (const s of allSeriesSlugs) {
  const p = path.resolve(`dist${s}index.html`);
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const otherMembers = allSeriesSlugs.filter(x => x !== s);
    const hasAllOthers = otherMembers.every(m => html.includes(`href="${m}"`));
    check(`Series nav in ${s} contains all other 6 members`, hasAllOthers);
  } else {
    check(`Series article ${s} exists`, false);
  }
}

// 3. Check Sitemap contains the 3 new URLs
console.log('\n--- Checking Sitemap.xml ---');
const sitemap = fs.readFileSync(path.resolve('dist/sitemap.xml'), 'utf8');
for (const target of targets) {
  check(`Sitemap has ${target.slug}`, sitemap.includes(`https://curitipao.com.br${target.slug}`));
}

// 4. Check Blog Index
console.log('\n--- Checking Blog Index Cards ---');
const blogIndexHtml = fs.readFileSync(path.resolve('dist/blog/index.html'), 'utf8');
for (const target of targets) {
  check(`Blog index contains link to ${target.slug}`, blogIndexHtml.includes(`href="${target.slug}"`));
}

// 5. Check exactly 8 JPG files in assets/photos/blog/historias-do-pao/
console.log('\n--- Checking Assets Folder ---');
const histDir = path.resolve('assets/photos/blog/historias-do-pao');
const actualFiles = fs.readdirSync(histDir).sort();
check('Exactly 8 files in historias-do-pao/', actualFiles.length === 8, `(found: ${actualFiles.length})`);
check('All files are .jpg', actualFiles.every(f => f.endsWith('.jpg')));

// 6. Check backup zip intact
console.log('\n--- Checking Backup Zip ---');
const zipPath = path.resolve('backups/historias-do-pao-originais.zip');
check('Backup zip exists and intact', fs.existsSync(zipPath) && fs.statSync(zipPath).size > 15 * 1024 * 1024);

console.log(`\n=== VERIFICATION RESULT: ${allOk ? 'ALL PASS (100%)' : 'SOME CHECKS FAILED'} ===`);
if (!allOk) process.exit(1);
