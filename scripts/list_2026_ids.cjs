const fs = require('fs');
const html = fs.readFileSync('festival/2026/index.html', 'utf8');
const ids = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Total IDs:', ids.length);
console.log('IDs:\n', JSON.stringify(ids, null, 2));
