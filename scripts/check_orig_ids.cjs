const fs = require('fs');
const html = fs.readFileSync('C:/Documentos/Projetos Web/Websites/curitipao-2026/index.html', 'utf8');
const ids = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('IDs in original curitipao-2026/index.html:\n', ids);
