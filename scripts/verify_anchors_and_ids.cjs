const fs = require('fs');
const path = require('path');

const festivalHtmlPath = path.resolve('festival/2026/index.html');
const html = fs.readFileSync(festivalHtmlPath, 'utf8');

const idRegex = /id=["']([^"']+)["']/g;
let m;
const allIds = [];
while ((m = idRegex.exec(html)) !== null) {
  allIds.push(m[1]);
}
console.log('Total IDs found in festival/2026/index.html:', allIds.length);
console.log(allIds);
