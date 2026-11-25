const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

// Simple static server for dist/
function startServer(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.webp': 'image/webp',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) {
      reqPath += 'index.html';
    }
    const filePath = path.join(distDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Static server running on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function run() {
  const distDir = path.resolve('dist');
  const port = 3456;
  const server = await startServer(distDir, port);

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true
    });

    const capturesDir = path.resolve('capturas');
    if (!fs.existsSync(capturesDir)) {
      fs.mkdirSync(capturesDir, { recursive: true });
    }

    // 1. Desktop Test (1280px)
    const contextDesktop = await browser.newContext({
      viewport: { width: 1280, height: 900 }
    });
    const pageDesktop = await contextDesktop.newPage();
    const url = `http://127.0.0.1:${port}/roteiros/onde-comer-croissant-em-curitiba/`;
    await pageDesktop.goto(url, { waitUntil: 'networkidle' });

    // Capture desktop cover & header
    await pageDesktop.screenshot({
      path: path.join(capturesDir, 'preview-desktop-capa.png'),
      clip: { x: 0, y: 0, width: 1280, height: 850 }
    });
    console.log('Saved preview-desktop-capa.png');

    // Capture Noni pending notice
    const noni = await pageDesktop.$('#noni');
    if (noni) {
      await noni.screenshot({
        path: path.join(capturesDir, 'preview-noni-draft.png')
      });
      console.log('Saved preview-noni-draft.png');
    }

    // Test Lightbox on Bonin Bakery button
    const firstZoomBtn = await pageDesktop.$('.demo-photo-btn');
    if (firstZoomBtn) {
      await firstZoomBtn.click();
      await pageDesktop.waitForTimeout(500);
      const isLightboxVisible = await pageDesktop.evaluate(() => {
        const lb = document.getElementById('demo-lightbox');
        return lb && (lb.style.display !== 'none' || lb.classList.contains('active') || lb.getAttribute('aria-hidden') === 'false');
      });
      console.log('Lightbox opened on click:', isLightboxVisible);
      await pageDesktop.screenshot({
        path: path.join(capturesDir, 'preview-lightbox-active.png')
      });
      console.log('Saved preview-lightbox-active.png');
      // Close lightbox with Esc
      await pageDesktop.keyboard.press('Escape');
      await pageDesktop.waitForTimeout(300);
    }

    // 2. Mobile Test (375px)
    const contextMobile = await browser.newContext({
      viewport: { width: 375, height: 667 },
      isMobile: true
    });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(url, { waitUntil: 'networkidle' });

    // Check overflow on mobile
    const overflowCheck = await pageMobile.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const elements = document.querySelectorAll('*');
      const offenders = [];
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1.5 || rect.width > docWidth + 1.5) {
          offenders.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: rect.right,
            width: rect.width
          });
        }
      }
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: docWidth,
        offendersCount: offenders.length,
        offenders: offenders.slice(0, 5)
      };
    });

    console.log('Mobile Check 375px:');
    console.log('  scrollWidth:', overflowCheck.scrollWidth);
    console.log('  clientWidth:', overflowCheck.clientWidth);
    console.log('  Overflow detected:', overflowCheck.scrollWidth > overflowCheck.clientWidth);
    console.log('  Offenders count:', overflowCheck.offendersCount);
    if (overflowCheck.offendersCount > 0) {
      console.log('  Offenders details:', JSON.stringify(overflowCheck.offenders));
    }

    // Capture mobile cover
    await pageMobile.screenshot({
      path: path.join(capturesDir, 'preview-mobile-capa.png'),
      clip: { x: 0, y: 0, width: 375, height: 750 }
    });
    console.log('Saved preview-mobile-capa.png');

    // 3. Ultra small mobile (320px)
    const context320 = await browser.newContext({
      viewport: { width: 320, height: 568 },
      isMobile: true
    });
    const page320 = await context320.newPage();
    await page320.goto(url, { waitUntil: 'networkidle' });
    const overflow320 = await page320.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });
    console.log('Mobile Check 320px:');
    console.log('  scrollWidth:', overflow320.scrollWidth);
    console.log('  clientWidth:', overflow320.clientWidth);
    console.log('  Overflow detected:', overflow320.scrollWidth > overflow320.clientWidth);

    // 4. Card in Roteiros Index
    const pageRoteiros = await contextDesktop.newPage();
    await pageRoteiros.goto(`http://127.0.0.1:${port}/roteiros/`, { waitUntil: 'networkidle' });
    const cardEl = await pageRoteiros.$('article.card-editorial');
    if (cardEl) {
      await cardEl.screenshot({
        path: path.join(capturesDir, 'preview-roteiros-card.png')
      });
      console.log('Saved preview-roteiros-card.png');
    }

    await browser.close();
  } finally {
    server.close();
    console.log('Server closed. Testing complete!');
  }
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
