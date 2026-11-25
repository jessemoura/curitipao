const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('capturas');
const destDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

const files = [
  'preview-desktop-capa.png',
  'preview-mobile-capa.png',
  'preview-roteiros-card.png',
  'preview-noni-draft.png',
  'preview-lightbox-active.png'
];

files.forEach(f => {
  const src = path.join(srcDir, f);
  const dest = path.join(destDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${f} to artifact dir (${fs.statSync(dest).size} bytes)`);
  }
});
