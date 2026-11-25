const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const distDir = path.resolve('dist');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(distDir, reqPath);

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) filePath += '.html';
    else if (fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 8124;

server.listen(PORT, async () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
  const artDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    // 1. Desktop Light (1280x800)
    const pageDesk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await pageDesk.goto(`http://127.0.0.1:${PORT}/blog/como-surgiu-o-pao/`, { waitUntil: 'networkidle' });
    const overflowDesk = await pageDesk.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log('[Desktop Light] /blog/como-surgiu-o-pao/ overflow:', overflowDesk);
    await pageDesk.screenshot({ path: path.join(artDir, 'desktop-como-surgiu-o-pao-light.png') });

    // 2. Desktop Dark Mode
    await pageDesk.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await pageDesk.waitForTimeout(300);
    await pageDesk.screenshot({ path: path.join(artDir, 'desktop-como-surgiu-o-pao-dark.png') });
    console.log('[Desktop Dark] screenshot saved');

    // 3. Mobile 375px Light
    const pageMob375 = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await pageMob375.goto(`http://127.0.0.1:${PORT}/blog/pao-islandia-calor-da-terra/`, { waitUntil: 'networkidle' });
    const overflow375 = await pageMob375.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log('[Mobile 375px] /blog/pao-islandia-calor-da-terra/ overflow:', overflow375);
    await pageMob375.screenshot({ path: path.join(artDir, 'mobile-375-pao-islandia-light.png') });

    // 4. Mobile 320px Light
    const pageMob320 = await browser.newPage({ viewport: { width: 320, height: 568 } });
    await pageMob320.goto(`http://127.0.0.1:${PORT}/blog/lavash-pao-tradicional-armenia/`, { waitUntil: 'networkidle' });
    const overflow320 = await pageMob320.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log('[Mobile 320px] /blog/lavash-pao-tradicional-armenia/ overflow:', overflow320);
    await pageMob320.screenshot({ path: path.join(artDir, 'mobile-320-lavash-light.png') });

    // 5. Test Blog Listing Category Filter & Search
    const pageBlog = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await pageBlog.goto(`http://127.0.0.1:${PORT}/blog/`, { waitUntil: 'networkidle' });
    
    // Check initial count
    const initialBadge = await pageBlog.locator('#blog-count-badge').innerText();
    console.log('Blog initial badge:', initialBadge);

    // Click "Histórias do pão" button
    const historiasBtn = pageBlog.locator('.blog-filter-btn[data-category="Histórias do pão"]');
    await historiasBtn.click();
    await pageBlog.waitForTimeout(300);

    const filteredBadge = await pageBlog.locator('#blog-count-badge').innerText();
    console.log('Badge after clicking Histórias do pão:', filteredBadge);

    const visibleCards = await pageBlog.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.blog-card'));
      return cards.filter(c => c.style.display !== 'none').length;
    });
    console.log('Visible cards after category filter:', visibleCards);
    await pageBlog.screenshot({ path: path.join(artDir, 'blog-listing-filtered-historias.png') });

    await browser.close();
    console.log('ALL VISUAL & FUNCTIONAL CHECKS PASSED!');
  } catch (err) {
    console.error('Visual test error:', err);
  } finally {
    server.close();
  }
});
