const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING TWO NEW BLOG ARTICLES ===');

const shokupanPath = path.resolve('dist/blog/shokupan-pao-japones/index.html');
const cortesPath = path.resolve('dist/blog/por-que-fazer-cortes-na-massa-do-pao/index.html');
const sitemapPath = path.resolve('dist/sitemap.xml');
const blogIndexPath = path.resolve('dist/blog/index.html');

let allPassed = true;
function check(label, condition, extra = '') {
  if (condition) {
    console.log(`[PASS] ${label} ${extra}`);
  } else {
    console.error(`[FAIL] ${label} ${extra}`);
    allPassed = false;
  }
}

// 1. Files existence
check('Shokupan HTML exists', fs.existsSync(shokupanPath));
check('Cortes HTML exists', fs.existsSync(cortesPath));

if (!fs.existsSync(shokupanPath) || !fs.existsSync(cortesPath)) {
  console.error('Cannot proceed with HTML checks: files missing');
  process.exit(1);
}

const shokupanHtml = fs.readFileSync(shokupanPath, 'utf8');
const cortesHtml = fs.readFileSync(cortesPath, 'utf8');

// 2. Head & Meta tags checks
function testArticle(name, html, expected) {
  console.log(`\n--- Checking ${name} ---`);
  
  // H1 count
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  check(`${name} has exactly 1 H1`, h1Matches.length === 1, `(count: ${h1Matches.length})`);
  if (h1Matches.length === 1) {
    check(`${name} H1 matches`, h1Matches[0].includes(expected.h1), `(found: ${h1Matches[0]})`);
  }

  // Canonical
  check(`${name} canonical`, html.includes(`<link rel="canonical" href="${expected.canonical}">`));

  // Meta description
  check(`${name} meta description`, html.includes(`<meta name="description" content="${expected.description}">`));

  // OG tags
  check(`${name} og:title`, html.includes(`property="og:title" content="${expected.ogTitle}"`));
  check(`${name} og:description`, html.includes(`property="og:description" content="${expected.description}"`));
  check(`${name} og:url`, html.includes(`property="og:url" content="${expected.canonical}"`));
  check(`${name} og:image`, html.includes(`property="og:image" content="${expected.ogImage}"`));
  check(`${name} og:image:width`, html.includes(`property="og:image:width" content="1200"`));
  check(`${name} og:image:height`, html.includes(`property="og:image:height" content="${expected.ogHeight || '630'}"`));
  check(`${name} og:type`, html.includes(`property="og:type" content="article"`));
  check(`${name} og:site_name`, html.includes(`property="og:site_name" content="CuritiPão"`));

  // Twitter tags
  check(`${name} twitter:card`, html.includes(`name="twitter:card" content="summary_large_image"`));
  check(`${name} twitter:title`, html.includes(`name="twitter:title" content="${expected.ogTitle}"`));
  check(`${name} twitter:image`, html.includes(`name="twitter:image" content="${expected.ogImage}"`));

  // Author signature
  check(`${name} author is exclusively Curadoria CuritiPão`, 
    html.includes('Por <strong>Curadoria CuritiPão</strong>') &&
    !html.includes('Bárbara') && !html.includes('Jesse') && !html.includes('Jessé')
  );

  // Caption
  check(`${name} caption is Imagem ilustrativa`, html.includes('<span>Imagem ilustrativa</span>'));
  check(`${name} no IA in caption`, !html.includes('gerada por IA'));

  // Image alt
  check(`${name} image alt`, html.includes(`alt="${expected.imageAlt}"`));

  // Word count (approximate extracted from markdown/text)
  const textContent = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Specifically check body words in the article object
  const articles = require('../content/blog/articles.json');
  const artObj = articles.find(a => a.slug_suggested === expected.slug);
  if (artObj) {
    const words = artObj.body_markdown.match(/\b[\w\u00C0-\u017F-]+\b/g) || [];
    check(`${name} body word count is 1,300-1,700`, words.length >= 1300 && words.length <= 1700, `(${words.length} words)`);
  }

  // Schema.org
  check(`${name} has schema.org BlogPosting`, html.includes('"@type":"BlogPosting"') || html.includes('"@type": "BlogPosting"'));
  check(`${name} schema author Organization CuritiPão`, html.includes('"author"') && html.includes('"CuritiPão"'));
  check(`${name} schema BreadcrumbList`, html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"'));
}

testArticle('Shokupan', shokupanHtml, {
  slug: '/blog/shokupan-pao-japones/',
  canonical: 'https://curitipao.com.br/blog/shokupan-pao-japones/',
  h1: 'Shokupan: conheça o pão japonês de miolo macio',
  ogTitle: 'Shokupan: conheça o tradicional pão japonês | CuritiPão',
  description: 'Conheça o shokupan, o tradicional pão japonês de miolo macio e delicado, sua história, características, técnicas de preparo e formas de consumo.',
  ogImage: 'https://curitipao.com.br/assets/photos/blog/historias-do-pao/shokupan.jpg',
  ogHeight: '675',
  imageAlt: 'Pão japonês shokupan com casca dourada e fatias de miolo branco e macio sobre uma tábua de madeira.'
});

testArticle('Cortes na massa', cortesHtml, {
  slug: '/blog/por-que-fazer-cortes-na-massa-do-pao/',
  canonical: 'https://curitipao.com.br/blog/por-que-fazer-cortes-na-massa-do-pao/',
  h1: 'Por que o padeiro faz cortes na massa do pão?',
  ogTitle: 'Por que o padeiro faz cortes na massa do pão? | CuritiPão',
  description: 'Descubra por que os padeiros fazem cortes na massa antes de assar e como essa técnica influencia a expansão, a crosta e a aparência dos pães artesanais.',
  ogImage: 'https://curitipao.com.br/assets/photos/blog/cortes-no-pao-share.jpg',
  imageAlt: 'Massa de pão artesanal com corte longitudinal ao lado de um pão assado com crosta dourada e uma lâmina de padeiro.'
});

// 3. Series nav check
console.log('\n--- Checking Series Navigation ---');
check('Shokupan has series nav', shokupanHtml.includes('aria-label="Série Histórias do pão"'));
check('Shokupan series nav links to other 3 articles', 
  shokupanHtml.includes('/blog/como-surgiu-o-pao/') &&
  shokupanHtml.includes('/blog/pao-islandia-calor-da-terra/') &&
  shokupanHtml.includes('/blog/lavash-pao-tradicional-armenia/')
);
check('Cortes does NOT have series nav', !cortesHtml.includes('aria-label="Série Histórias do pão"'));

// Check other series article has link to Shokupan
const comoSurgiuPath = path.resolve('dist/blog/como-surgiu-o-pao/index.html');
if (fs.existsSync(comoSurgiuPath)) {
  const comoSurgiuHtml = fs.readFileSync(comoSurgiuPath, 'utf8');
  check('Como surgiu o pão series nav includes Shokupan', comoSurgiuHtml.includes('/blog/shokupan-pao-japones/'));
}

// 4. Check sitemap
console.log('\n--- Checking Sitemap ---');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  check('Sitemap has Shokupan', sitemap.includes('https://curitipao.com.br/blog/shokupan-pao-japones/'));
  check('Sitemap has Cortes no pão', sitemap.includes('https://curitipao.com.br/blog/por-que-fazer-cortes-na-massa-do-pao/'));
}

// 5. Check images in dist
console.log('\n--- Checking Dist Images ---');
check('Shokupan jpg in dist', fs.existsSync('dist/assets/photos/blog/historias-do-pao/shokupan.jpg'));
check('Cortes webp in dist', fs.existsSync('dist/assets/photos/blog/cortes-no-pao.webp'));
check('Cortes share jpg in dist', fs.existsSync('dist/assets/photos/blog/cortes-no-pao-share.jpg'));

// 6. Check Blog Index
console.log('\n--- Checking Blog Index ---');
if (fs.existsSync(blogIndexPath)) {
  const blogIndex = fs.readFileSync(blogIndexPath, 'utf8');
  check('Blog index contains Shokupan card', blogIndex.includes('/blog/shokupan-pao-japones/'));
  check('Blog index contains Cortes card', blogIndex.includes('/blog/por-que-fazer-cortes-na-massa-do-pao/'));
}

console.log(`\n=== VERIFICATION RESULT: ${allPassed ? 'ALL PASSED' : 'SOME CHECKS FAILED'} ===`);
if (!allPassed) process.exit(1);
