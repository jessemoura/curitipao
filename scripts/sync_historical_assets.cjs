const fs = require('fs');
const path = require('path');

const originalAssets = path.resolve('../curitipao-2026/assets');
const targetAssets = path.resolve('./assets');

const filesToCopy = [
  'apple-touch-icon.png',
  'curitipao-logo.png',
  'curitipao-logo.png.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-curitipao.png',
  'favicon.ico',
  'hero.png'
];

filesToCopy.forEach(file => {
  const src = path.join(originalAssets, file);
  const dest = path.join(targetAssets, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied historical asset:', file);
  } else {
    console.log('Original asset not found:', src);
  }
});

// Also check logos/curitipao-logo.png.png
const subLogos = path.join(originalAssets, 'logos/curitipao-logo.png.png');
if (fs.existsSync(subLogos)) {
  const destSub = path.join(targetAssets, 'logos/curitipao-logo.png.png');
  fs.copyFileSync(subLogos, destSub);
  console.log('Copied historical asset: logos/curitipao-logo.png.png');
}
