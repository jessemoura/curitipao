const fs = require('fs');
const html = fs.readFileSync('festival/2026/index.html', 'utf8');

const regex = /<article class="card-padaria[^>]*>([\s\S]*?)<\/article>/g;
let m;
let count = 0;
while ((m = regex.exec(html)) !== null) {
  count++;
  const cardSnippet = m[0].slice(0, 150).replace(/\n/g, ' ');
  console.log(`Card ${count}:`, cardSnippet);
}
console.log('Total bakery cards:', count);

// Also check <section class="padarias" or id="padarias"
const padariaSec = html.match(/<section[^>]*class="[^"]*padarias[^"]*"[^>]*>/i);
console.log('Padaria section match:', padariaSec ? padariaSec[0] : 'None');
