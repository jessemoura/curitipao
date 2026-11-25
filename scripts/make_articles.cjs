const fs = require('fs');

const shokupan = fs.readFileSync('scripts/draft_shokupan.txt', 'utf8');
const cortes = fs.readFileSync('scripts/draft_cortes.txt', 'utf8');

function countWords(t) { return t.trim().split(/\s+/).filter(Boolean).length; }

console.log('Shokupan words:', countWords(shokupan));
console.log('Cortes words:', countWords(cortes));

const code = 'const shokupanBody = ' + JSON.stringify(shokupan) + ';\n' +
  'const cortesBody = ' + JSON.stringify(cortes) + ';\n\n' +
  'module.exports = { shokupanBody, cortesBody };\n';

fs.writeFileSync('scripts/two_new_articles_content.cjs', code, 'utf8');
console.log('Wrote scripts/two_new_articles_content.cjs');
