const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeBlogPhotos() {
  const srcDir = path.resolve('curitipao-20-artigos/fotos');
  const outDir = path.resolve('assets/photos/blog');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  if (!fs.existsSync(srcDir)) {
    console.warn('[optimizeBlogPhotos] Source dir curitipao-20-artigos/fotos not found');
    return;
  }

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg') && !f.startsWith('.'));
  console.log(`[optimizeBlogPhotos] Processing ${files.length} blog source photos...`);

  for (const f of files) {
    const base = path.parse(f).name;
    const inputPath = path.join(srcDir, f);
    const webpPath = path.join(outDir, `${base}.webp`);
    const jpgPath = path.join(outDir, `${base}.jpg`);

    // Check if already generated to avoid re-compressing unnecessarily
    if (!fs.existsSync(webpPath) || !fs.existsSync(jpgPath)) {
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(webpPath);

      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(jpgPath);

      console.log(`  Optimized: ${base} -> WebP & JPG`);
    }
  }
  console.log('[optimizeBlogPhotos] All blog photos are optimized and ready!');
}

if (require.main === module) {
  optimizeBlogPhotos().catch(err => {
    console.error('Error optimizing blog photos:', err);
    process.exit(1);
  });
}

module.exports = { optimizeBlogPhotos };
