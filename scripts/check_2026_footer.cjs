const fs = require('fs');
const html = fs.readFileSync('festival/2026/index.html', 'utf8');
const idx = html.indexOf('<footer');
console.log('Footer index:', idx);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 800));
}
