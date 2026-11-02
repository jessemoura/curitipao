const fs = require('fs');
const html = fs.readFileSync('festival/2026/index.html', 'utf8');

let pos = 0;
while (true) {
  const found = html.indexOf('AQUARIUS', pos);
  if (found === -1) break;
  console.log('Found AQUARIUS at', found);
  console.log(html.slice(found - 100, found + 150));
  pos = found + 1;
}
