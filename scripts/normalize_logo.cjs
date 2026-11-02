const fs = require('fs');
const path = require('path');

const srcLogo = path.resolve('assets/logos/curitipao-logo.png.png');

console.log('--- NORMALIZING CURITIPAO LOGO ---');
if (!fs.existsSync(srcLogo)) {
  console.error('Source logo not found:', srcLogo);
  process.exit(1);
}

const stats = fs.statSync(srcLogo);
console.log(`Source logo: ${srcLogo} (${stats.size} bytes)`);

// 1. Overwrite assets/logos/curitipao-logo.png
const dest1 = path.resolve('assets/logos/curitipao-logo.png');
fs.copyFileSync(srcLogo, dest1);
console.log(`Copied to ${dest1} (${fs.statSync(dest1).size} bytes)`);

// 2. Overwrite assets/curitipao-logo.png
const dest2 = path.resolve('assets/curitipao-logo.png');
fs.copyFileSync(srcLogo, dest2);
console.log(`Copied to ${dest2} (${fs.statSync(dest2).size} bytes)`);

// 3. Check with sharp if installed to get dimensions
try {
  const sharp = require('sharp');
  sharp(srcLogo).metadata().then(meta => {
    console.log(`Logo metadata: ${meta.width}x${meta.height}, format: ${meta.format}, hasAlpha: ${meta.hasAlpha}`);
  });
} catch(e) {
  console.log('Sharp not used for metadata check.');
}
