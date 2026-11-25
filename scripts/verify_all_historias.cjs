const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING HISTORIAS DO PAO IMAGES INTEGRATION ===\n');

const histDir = path.resolve('assets/photos/blog/historias-do-pao');
const distHistDir = path.resolve('dist/assets/photos/blog/historias-do-pao');

let allOk = true;
function check(label, condition) {
  if (condition) {
    console.log(`[PASS] ${label}`);
  } else {
    console.error(`[FAIL] ${label}`);
    allOk = false;
  }
}

// 1. Check exactly 8 JPG files in assets/photos/blog/historias-do-pao/
const expectedFiles = [
  'cortes-no-pao.jpg',
  'historia-da-baguete-francesa.jpg',
  'historia-do-panetone.jpg',
  'lavash-armenia.jpg',
  'origem-do-pao.jpg',
  'pao-alemao-pumpernickel.jpg',
  'pao-islandia.jpg',
  'shokupan.jpg'
];

const actualSourceFiles = fs.readdirSync(histDir).sort();
check('Source folder has exactly 8 files', actualSourceFiles.length === 8);
check('Source folder files match expected JPGs', JSON.stringify(actualSourceFiles) === JSON.stringify(expectedFiles.sort()));

const actualDistFiles = fs.readdirSync(distHistDir).sort();
check('Dist folder has exactly 8 files', actualDistFiles.length === 8);
check('Dist folder files match expected JPGs', JSON.stringify(actualDistFiles) === JSON.stringify(expectedFiles.sort()));

// 2. Check each article in dist
const articles = [
  { slug: 'como-surgiu-o-pao', file: 'origem-do-pao.jpg' },
  { slug: 'pao-islandia-calor-da-terra', file: 'pao-islandia.jpg' },
  { slug: 'lavash-pao-tradicional-armenia', file: 'lavash-armenia.jpg' },
  { slug: 'shokupan-pao-japones', file: 'shokupan.jpg' }
];

for (const art of articles) {
  const p = path.resolve(`dist/blog/${art.slug}/index.html`);
  check(`Article ${art.slug} exists`, fs.existsSync(p));
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    check(`${art.slug} uses JPG in img src`, html.includes(`/assets/photos/blog/historias-do-pao/${art.file}`));
    check(`${art.slug} uses JPG in og:image`, html.includes(`property="og:image" content="https://curitipao.com.br/assets/photos/blog/historias-do-pao/${art.file}"`));
    check(`${art.slug} uses JPG in twitter:image`, html.includes(`name="twitter:image" content="https://curitipao.com.br/assets/photos/blog/historias-do-pao/${art.file}"`));
    check(`${art.slug} does NOT have any webp reference for cover`, !html.includes(`historias-do-pao/${art.slug}.webp`) && !html.includes(`historias-do-pao/${art.file.replace('.jpg', '.webp')}`));
  }
}

// 3. Check blog index cards
const blogIndexSrcPath = path.resolve('blog/index.html');
const blogIndexSrcHtml = fs.readFileSync(blogIndexSrcPath, 'utf8');
const blogIndexDistPath = path.resolve('dist/blog/index.html');
const blogIndexDistHtml = fs.readFileSync(blogIndexDistPath, 'utf8');

for (const art of articles) {
  check(`Blog index source card for ${art.slug} uses JPG path`, blogIndexSrcHtml.includes(`/assets/photos/blog/historias-do-pao/${art.file}`));
  const base = art.file.replace('.jpg', '');
  const distRegex = new RegExp(`/assets/${base}(-[\\w-]+)?\\.jpg`);
  check(`Blog index dist card for ${art.slug} references compiled JPG`, distRegex.test(blogIndexDistHtml));
}

// 4. Check backup zip exists
const zipPath = path.resolve('backups/historias-do-pao-originais.zip');
check('Backup zip exists outside public folder', fs.existsSync(zipPath));
if (fs.existsSync(zipPath)) {
  const stat = fs.statSync(zipPath);
  check('Backup zip has content (> 10MB)', stat.size > 10 * 1024 * 1024);
}

// 5. Ensure zip is not in dist
check('Backup zip NOT in dist', !fs.existsSync('dist/historias-do-pao-originais.zip') && !fs.existsSync('dist/backups'));

console.log(`\n=== RESULT: ${allOk ? 'ALL PASS (100%)' : 'SOME CHECKS FAILED'} ===`);
if (!allOk) process.exit(1);
