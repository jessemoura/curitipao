const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function inspect() {
  const dir = 'assets/photos/roteiros/onde-comer-croissant-em-curitiba';
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.webp')) {
      const meta = await sharp(full).metadata();
      const sz = fs.statSync(full).size;
      console.log(file.padEnd(38) + (meta.width + 'x' + meta.height).padEnd(14) + meta.format.padEnd(8) + Math.round(sz / 1024) + ' KB');
    }
  }
}

inspect().catch(console.error);
