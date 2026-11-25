const fs = require('fs');

const html = fs.readFileSync('dist/roteiros/onde-comer-croissant-em-curitiba/index.html', 'utf8');

console.log('--- VERIFICAÇÃO FINAL DA MATÉRIA PUBLICADA ---');
console.log('1. Título e Metas:');
console.log('Title match:', html.includes('Onde comer croissant em Curitiba: 10 lugares no estilo francês'));
console.log('Canonical:', html.includes('canonical" href="https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/"'));
console.log('Schema Organization:', html.includes('"@type": "Organization"') && html.includes('Curadoria CuritiPão'));

console.log('2. Assinatura e Byline:');
console.log('Curadoria CuritiPão:', html.includes('Curadoria CuritiPão'));
console.log('Sem assinatura pessoal indevida (Ledinara):', !html.includes('Ledinara'));

console.log('3. Correção do Lucca:');
console.log('fresquinho presente:', html.includes('fresquinho'));
console.log('fresquinhinho ausente:', !html.includes('fresquinhinho'));

console.log('4. Capa 16:9:');
console.log('Capa WebP presente:', html.includes('capa-croissant-curitiba-16x9.webp'));

console.log('5. Visor Lightbox:');
console.log('demo-lightbox modal presente:', html.includes('id="demo-lightbox"'));
console.log('demo-photo-btn count:', (html.match(/demo-photo-btn/g) || []).length);

console.log('6. Noni Padaria (Conteúdo Oficial):');
console.log('Noni presente:', html.includes('id="noni-padaria"') || html.includes('id="noni"'));
console.log('Noni texto oficial ("croi"):', html.includes('croi') && html.includes('Rua Mateus Leme, 2690, loja 2, Ahú'));
console.log('Instagram Noni:', html.includes('@nonipadaria'));
console.log('Placeholders de rascunho ausentes:', !html.includes('roteiro-editorial-draft-notice') && !html.includes('Aguardando texto da Noni') && !html.includes('Prévia Editorial'));

console.log('7. Maçã Padaria Artesanal:');
console.log('Maçã presente:', html.includes('id="maca-padaria-artesanal"'));
console.log('Praça do Japão endereço:', html.includes('Avenida Sete de Setembro, 4979, Praça do Japão'));
console.log('Rota Praça do Japão:', html.includes('Como chegar (Praça do Japão)'));

console.log('8. 10 Lugares no índice e corpo:');
const places = [
  'bonin-bakery',
  'brod-bakery',
  'felipane',
  'lucca-cafes-especiais',
  'maca-padaria-artesanal',
  'noni-padaria',
  'origem-padaria',
  'pao-prosa',
  'prestinaria',
  'sphair-gourmande'
];
places.forEach(p => {
  console.log('Lugar ' + p + ':', html.includes('id="' + p + '"') || html.includes('href="#' + p + '"'));
});

console.log('9. Sitemap.xml:');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
console.log('Sitemap contém a URL do croissant:', sitemap.includes('https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/'));
console.log('Sitemap contém 15 padarias:', sitemap.includes('https://curitipao.com.br/roteiros/padarias-em-curitiba-por-bairro/'));

console.log('10. Card em dist/roteiros/index.html:');
const roteirosIndex = fs.readFileSync('dist/roteiros/index.html', 'utf8');
console.log('Card presente em roteiros/index.html:', roteirosIndex.includes('/roteiros/onde-comer-croissant-em-curitiba/'));
