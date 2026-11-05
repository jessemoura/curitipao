const fs = require('fs');

const file = 'dist/roteiros/padarias-em-curitiba-por-bairro/index.html';
if (!fs.existsSync(file)) {
  console.error('File not found:', file);
  process.exit(1);
}

const html = fs.readFileSync(file, 'utf8');

const checks = [
  ['H1 check', html.includes('<h1>15 padarias em Curitiba para conhecer, bairro por bairro</h1>')],
  ['SEO Title check', html.includes('<title>Padarias em Curitiba: 15 lugares para conhecer por bairro | CuritiPão</title>')],
  ['Canonical check', html.includes('<link rel="canonical" href="https://curitipao.com.br/roteiros/padarias-em-curitiba-por-bairro/">')],
  ['OG Type check', html.includes('<meta property="og:type" content="article">')],
  ['Schema Article check', html.includes('"@type": "Article"') && html.includes('"name": "Ledinara"')],
  ['Intro Paragraph 1', html.includes('Curitiba tem padarias centenárias, pequenos ateliês escondidos em ruas tranquilas')],
  ['Intro Paragraph 2', html.includes('A primeira edição do Festival CuritiPão reuniu 15 dessas padarias')],
  ['Intro Paragraph 3', html.includes('Este roteiro não é um ranking. É uma seleção construída a partir das padarias')],
  ['TOC present', html.includes('class="roteiro-toc-card"')],
  ['Closing Section present', html.includes('id="como-usar-o-guia"') && html.includes('Guia de Padarias do CuritiPão')],
  ['Closing Section Link', html.includes('href="https://curitipao.com.br/padarias/"') || html.includes('href="/padarias/"')]
];

const neighborhoods = [
  'Bacacheri', 'Cabral', 'Ahú e Bigorrilho', 'Juvevê', 'Alto da XV',
  'Alto da XV, Água Verde e Vila Izabel', 'Centro', 'São Francisco',
  'Batel', 'Jardim Social'
];

neighborhoods.forEach(n => {
  checks.push(['Bairro H2: ' + n, html.includes('<h2>' + n + '</h2>')]);
});

const bakeries = [
  'Aquarius Panificadora', 'Piegel Pães', 'Padaria Requinte',
  'Sphair Ateliê de Pães', 'Aqui na Mata', 'Felipane',
  'Haiat Ateliê do Pão', 'Confraria dos Pães', 'Fábrika Pães',
  'Maçã Orgânica Padaria', 'Bonin Bakery', 'Padaria América',
  'Fabiano Marcolini Alimentari', 'Saint Germain Panificadora',
  'Padaria Família Farinha'
];

bakeries.forEach(b => {
  checks.push(['Bakery H3: ' + b, html.includes(b)]);
});

const photoCreditsCount = (html.match(/Foto: Lorena Lenara Batista/g) || []).length;
checks.push([`Photo Credits Count (${photoCreditsCount} >= 16)`, photoCreditsCount >= 16]); // 15 bakeries + 1 hero

const disclaimersCount = (html.match(/Criação apresentada no Festival CuritiPão 2026/g) || []).length;
checks.push([`Disclaimers Count (${disclaimersCount} == 15)`, disclaimersCount === 15]);

// Check Roteiros page card
const roteirosHtml = fs.readFileSync('dist/roteiros/index.html', 'utf8');
checks.push(['Card in /roteiros/', roteirosHtml.includes('/roteiros/padarias-em-curitiba-por-bairro/')]);

// Check Blog page does not have copy
const blogHtml = fs.readFileSync('dist/blog/index.html', 'utf8');
checks.push(['No full copy in /blog/', !blogHtml.includes('id="aquarius-panificadora"')]);

// Check Sitemap
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
checks.push(['In sitemap.xml', sitemap.includes('https://curitipao.com.br/roteiros/padarias-em-curitiba-por-bairro/')]);

console.log('--- TEST RESULTS ---');
let allPassed = true;
checks.forEach(([name, pass]) => {
  console.log((pass ? '[PASS]' : '[FAIL]') + ' ' + name);
  if (!pass) allPassed = false;
});

if (!allPassed) {
  console.error('Some checks failed.');
  process.exit(1);
}
console.log('\nALL VERIFICATION CHECKS PASSED PERFECTLY!');
