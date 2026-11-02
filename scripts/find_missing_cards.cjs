const fs = require('fs');
const html = fs.readFileSync('festival/2026/index.html', 'utf8');

const regex = /(<!-- Card (\d+): ([^>]+) -->\s*)<article class="card([^>]*)>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(`Card ${m[2]}:`, m[3].trim(), 'existing class/id:', m[4]);
}
