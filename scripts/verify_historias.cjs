const fs = require('fs');

const slugs = [
  '/blog/como-surgiu-o-pao/',
  '/blog/pao-islandia-calor-da-terra/',
  '/blog/lavash-pao-tradicional-armenia/'
];

slugs.forEach(slug => {
  const file = '.' + slug + 'index.html';
  console.log('=== Checking', file, '===');
  const html = fs.readFileSync(file, 'utf8');
  
  // H1 count
  const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  console.log('H1 count:', h1s.length, h1s[0]);

  // Canonical
  const canon = html.match(/<link rel="canonical" href="([^"]+)">/);
  console.log('Canonical:', canon ? canon[1] : 'MISSING');

  // Byline
  const byline = html.match(/<p class="article-byline">Por <strong>(.*?)<\/strong><\/p>/);
  console.log('Byline:', byline ? byline[1] : 'MISSING');

  // OG tags
  const ogImg = html.match(/<meta property="og:image" content="([^"]+)">/);
  const ogWidth = html.match(/<meta property="og:image:width" content="([^"]+)">/);
  const ogHeight = html.match(/<meta property="og:image:height" content="([^"]+)">/);
  const ogType = html.match(/<meta property="og:image:type" content="([^"]+)">/);
  const ogAlt = html.match(/<meta property="og:image:alt" content="([^"]+)">/);
  console.log('OG Image:', ogImg ? ogImg[1] : 'MISSING');
  console.log('OG Dims:', ogWidth ? ogWidth[1] : '', 'x', ogHeight ? ogHeight[1] : '', ogType ? ogType[1] : '');
  console.log('OG Alt:', ogAlt ? ogAlt[1] : 'MISSING');

  // Series block
  const series = html.includes('Continue na série Histórias do pão');
  console.log('Series nav present:', series);

  // Caption
  const caption = html.includes('Imagem ilustrativa');
  console.log('Caption present:', caption);

  // Schema
  const hasBreadcrumb = html.includes('"@type": "BreadcrumbList"');
  const hasBlogPosting = html.includes('"@type": "BlogPosting"');
  const hasAuthor = html.includes('"name": "Curadoria CuritiPão"');
  console.log('Schema valid:', hasBreadcrumb && hasBlogPosting && hasAuthor);
});


console.log('=== Checking blog/index.html ===');
const blogIndexHtml = fs.readFileSync('blog/index.html', 'utf8');
const countMatch = blogIndexHtml.match(/id="blog-count-badge"[^>]*>(.*?)<\/div>/);
console.log('Blog count badge:', countMatch ? countMatch[1] : 'MISSING');

const allBtnMatch = blogIndexHtml.match(/id="blog-all-filter-btn"[^>]*>(.*?)<\/button>/);
console.log('All filter button:', allBtnMatch ? allBtnMatch[1] : 'MISSING');

const seriesCards = blogIndexHtml.match(/data-category="Histórias do pão"/g);
console.log('Cards with category Histórias do pão:', seriesCards ? seriesCards.length : 0);

console.log('=== Checking sitemap.xml ===');
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
slugs.forEach(s => {
  const url = 'https://curitipao.com.br' + s;
  console.log('Sitemap contains', url, ':', sitemap.includes(url));
});
