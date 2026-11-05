const fs = require('fs');
const path = require('path');

const distDir = path.resolve('dist');

console.log('--- EXECUTING POST-BUILD PACKAGING & CLEANUP ---');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist! Run vite build first.');
  process.exit(1);
}

// 1. Files to copy directly to dist root
const filesToRoot = [
  '.htaccess',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
  'favicon.png',
  'apple-touch-icon.png'
];

filesToRoot.forEach(file => {
  const src = path.resolve(file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Copied to dist root] ${file} (${fs.statSync(dest).size} bytes)`);
  } else {
    console.warn(`[Warning] Root file ${file} not found.`);
  }
});

// 2. Ensure complete assets tree is copied to dist/assets/ and dist/festival/2026/assets/
const srcAssets = path.resolve('assets');
if (fs.existsSync(srcAssets)) {
  fs.cpSync(srcAssets, path.join(distDir, 'assets'), { recursive: true });
  console.log('[Copied complete assets tree to dist/assets/]');
}

// Copy api/ backend directory
const srcApi = path.resolve('api');
if (fs.existsSync(srcApi)) {
  fs.cpSync(srcApi, path.join(distDir, 'api'), { recursive: true });
  console.log('[Copied api/ backend directory to dist/api/]');
}

const festival2026Dist = path.join(distDir, 'festival', '2026');
if (fs.existsSync(festival2026Dist)) {
  ['style.css', 'main.js'].forEach(file => {
    const src = path.resolve('festival', '2026', file);
    const dest = path.join(festival2026Dist, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[Copied to dist/festival/2026/] ${file} (${fs.statSync(dest).size} bytes)`);
    }
  });
  // Also provide relative assets path for festival 2026
  fs.cpSync(srcAssets, path.join(festival2026Dist, 'assets'), { recursive: true });
  console.log('[Copied relative assets tree to dist/festival/2026/assets/]');
}

// 3. Remove screenshots_evidence, backups, and temporary files from dist/ (NEVER delete .git)
const forbiddenInDist = [
  'screenshots_evidence',
  'capturas',
  '.tempmediaStorage'
];

forbiddenInDist.forEach(dirName => {
  const target = path.join(distDir, dirName);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`[Removed from dist] ${dirName}`);
  }
});

// Remove any .zip, .tmp, or log files from dist (preserving .git and essential dotfiles)
const distFiles = fs.readdirSync(distDir);
distFiles.forEach(file => {
  if (file.endsWith('.zip') || file.endsWith('.tmp') || file.endsWith('.log')) {
    fs.rmSync(path.join(distDir, file), { force: true });
    console.log(`[Removed unwanted file from dist] ${file}`);
  }
});

// 4. Verify essential files exist in dist
const essentialFiles = [
  'index.html',
  '.htaccess',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
  '404.html',
  'festival/2026/index.html',
  'festival/2026/style.css',
  'festival/2026/main.js',
  'imprensa/index.html',
  'solucoes-digitais/index.html',
  'padarias/index.html',
  'sobre/index.html',
  'privacidade/index.html',
  'contato/index.html',
  'roteiros/index.html',
  'roteiros/padarias-em-curitiba-por-bairro/index.html',
  'blog/index.html',
  'api/contato.php'
];

let allOk = true;
console.log('\n--- VERIFYING ESSENTIAL PRODUCTION ARTIFACTS IN DIST ---');
essentialFiles.forEach(rel => {
  const full = path.join(distDir, rel);
  if (fs.existsSync(full)) {
    const sz = fs.statSync(full).size;
    console.log(`[OK] ${rel} (${sz} bytes)`);
  } else {
    console.error(`[FAIL] Missing file in dist: ${rel}`);
    allOk = false;
  }
});

if (!allOk) {
  console.error('Post-build verification FAILED!');
  process.exit(1);
}

console.log('\nPOST-BUILD PACKAGING COMPLETED SUCCESSFULLY! Package is 100% production-ready.');
