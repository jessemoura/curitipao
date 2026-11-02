const fs = require('fs');
const html = fs.readFileSync('festival/2026/index.html', 'utf8');
const idx = html.indexOf('class="cards"');
console.log('Cards div index:', idx);
if (idx !== -1) {
  console.log(html.slice(idx - 400, idx + 400));
}
