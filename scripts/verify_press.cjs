const fs = require('fs');

const html = fs.readFileSync('festival/2026/index.html', 'utf8');
console.log('Has #imprensa:', html.includes('id="imprensa"'));

const idxGaleria = html.indexOf('id="galeria-2026"');
const idxImprensa = html.indexOf('id="imprensa"');
const idxSponsors = html.indexOf('hero-sponsors-strip footer-sponsors-strip');

console.log('Order check:');
console.log('Galeria index:', idxGaleria);
console.log('Imprensa index:', idxImprensa);
console.log('Sponsors index:', idxSponsors);
console.log('Is Galeria < Imprensa < Sponsors?:', idxGaleria < idxImprensa && idxImprensa < idxSponsors);

const cardMatches = html.match(/class="press-card"/g);
console.log('Press cards count:', cardMatches ? cardMatches.length : 0);

// Check bakeries
const bakeryCards = html.match(/<article class="card">/g);
console.log('Original 15 bakery cards count:', bakeryCards ? bakeryCards.length : 0);

// Check GA4 tracking script
console.log('Has GA4 script (G-JX6VH347DQ):', html.includes('G-JX6VH347DQ'));
