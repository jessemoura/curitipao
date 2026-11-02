const fs = require('fs');
const path = require('path');

const originalDir = path.resolve('../curitipao-2026');
console.log('Original Dir:', originalDir);

if (!fs.existsSync(originalDir)) {
  console.log('Original dir does not exist!');
  process.exit(1);
}

// 1. List all files in original dir
function listFiles(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(listFiles(full, rel));
    } else {
      results.push({ rel: rel.replace(/\\/g, '/'), size: fs.statSync(full).size });
    }
  }
  return results;
}

const originalFiles = listFiles(originalDir);
console.log('\n--- Original Files in curitipao-2026 (' + originalFiles.length + ' files) ---');
originalFiles.forEach(f => console.log(f.rel + ' (' + f.size + ' bytes)'));

// 2. Inspect original index.html for IDs and anchors
const originalHtml = fs.readFileSync(path.join(originalDir, 'index.html'), 'utf8');

// Find all id="..." in original
const idRegex = /id=["']([^"']+)["']/g;
let match;
const originalIds = [];
while ((match = idRegex.exec(originalHtml)) !== null) {
  originalIds.push(match[1]);
}
console.log('\n--- Original IDs in index.html ---');
console.log(originalIds);

// Find all href="..." in original
const hrefRegex = /href=["']([^"']+)["']/g;
const originalHrefs = new Set();
while ((match = hrefRegex.exec(originalHtml)) !== null) {
  originalHrefs.add(match[1]);
}
console.log('\n--- Original HREFs in index.html ---');
console.log(Array.from(originalHrefs));

// 3. Inspect politica-de-privacidade.html if exists
if (fs.existsSync(path.join(originalDir, 'politica-de-privacidade.html'))) {
  console.log('\npolitica-de-privacidade.html exists in original.');
}

// 4. Compare assets with curitipao/assets
const currentAssetsDir = path.resolve('./assets');
const currentAssets = listFiles(currentAssetsDir).map(f => f.rel);

console.log('\n--- Asset comparison (Original vs Current curitipao/assets) ---');
const missingInCurrent = [];
originalFiles.filter(f => f.rel.startsWith('assets/')).forEach(f => {
  const assetSub = f.rel.replace(/^assets\//, '');
  if (!fs.existsSync(path.join(currentAssetsDir, assetSub))) {
    missingInCurrent.push({ original: f.rel, sub: assetSub });
  }
});
console.log('Missing in current curitipao/assets:', missingInCurrent);
