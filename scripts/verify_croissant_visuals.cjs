const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

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
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function dismissCookies(page) {
  try {
    const btn = await page.$('.cookie-consent-actions button, #cookie-accept-btn, button:has-text("Aceitar")');
    if (btn) {
      await btn.click();
      await page.waitForTimeout(200);
    }
  } catch (e) {}
}

async function run() {
  const distDir = path.resolve('dist');
  const port = 3458;
  const server = await startServer(distDir, port);

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true
    });

    const capturesDir = path.resolve('capturas');
    const artifactDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

    // 1. Desktop Test (1280px)
    const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const pageDesktop = await contextDesktop.newPage();
    const url = `http://127.0.0.1:${port}/roteiros/onde-comer-croissant-em-curitiba/`;
    await pageDesktop.goto(url, { waitUntil: 'networkidle' });
    await dismissCookies(pageDesktop);

    const desktopMeasurements = await pageDesktop.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.roteiro-bakery-item'));
      return items.map(item => {
        const id = item.id;
        const fig = item.querySelector('.roteiro-internal-figure');
        const img = item.querySelector('.roteiro-internal-img');
        if (!fig || !img) return null;
        const fRect = fig.getBoundingClientRect();
        const iRect = img.getBoundingClientRect();
        return {
          id,
          figureWidth: Math.round(fRect.width),
          figureHeight: Math.round(fRect.height),
          imageWidth: Math.round(iRect.width),
          imageHeight: Math.round(iRect.height)
        };
      }).filter(Boolean);
    });

    console.log('--- Desktop Measurements (Target: <= 560px w, <= 440px h) ---');
    console.table(desktopMeasurements);

    // Screenshots Desktop
    const macaDesktop = await pageDesktop.$('#maca-padaria-artesanal');
    if (macaDesktop) {
      const f = path.join(capturesDir, 'croissant-maca-desktop.png');
      await macaDesktop.screenshot({ path: f });
      fs.copyFileSync(f, path.join(artifactDir, 'croissant-maca-desktop.png'));
    }

    const origemDesktop = await pageDesktop.$('#origem-padaria');
    if (origemDesktop) {
      const f = path.join(capturesDir, 'croissant-origem-desktop.png');
      await origemDesktop.screenshot({ path: f });
      fs.copyFileSync(f, path.join(artifactDir, 'croissant-origem-desktop.png'));
    }

    const boninDesktop = await pageDesktop.$('#bonin-bakery');
    if (boninDesktop) {
      const f = path.join(capturesDir, 'croissant-bonin-desktop.png');
      await boninDesktop.screenshot({ path: f });
      fs.copyFileSync(f, path.join(artifactDir, 'croissant-bonin-desktop.png'));
    }

    // Lightbox Test
    const firstZoomBtn = await pageDesktop.$('.roteiro-internal-zoom-btn');
    if (firstZoomBtn) {
      await firstZoomBtn.click();
      await pageDesktop.waitForTimeout(400);
      const isLbActive = await pageDesktop.evaluate(() => {
        const lb = document.getElementById('demo-lightbox');
        return lb && lb.style.display !== 'none';
      });
      console.log('Lightbox active on click:', isLbActive);
      const f = path.join(capturesDir, 'croissant-lightbox.png');
      await pageDesktop.screenshot({ path: f });
      fs.copyFileSync(f, path.join(artifactDir, 'croissant-lightbox.png'));
      await pageDesktop.keyboard.press('Escape');
      await pageDesktop.waitForTimeout(200);
    }

    // 2. Mobile Test (375px)
    const contextMobile = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(url, { waitUntil: 'networkidle' });
    await dismissCookies(pageMobile);

    const mobileMeasurements = await pageMobile.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.roteiro-bakery-item'));
      return items.map(item => {
        const id = item.id;
        const fig = item.querySelector('.roteiro-internal-figure');
        const img = item.querySelector('.roteiro-internal-img');
        if (!fig || !img) return null;
        const fRect = fig.getBoundingClientRect();
        const iRect = img.getBoundingClientRect();
        return {
          id,
          figureWidth: Math.round(fRect.width),
          figureHeight: Math.round(fRect.height),
          imageWidth: Math.round(iRect.width),
          imageHeight: Math.round(iRect.height)
        };
      }).filter(Boolean);
    });

    console.log('--- Mobile Measurements 375px (Target: <= 380px h, fit card width) ---');
    console.table(mobileMeasurements);

    const overflowMobile = await pageMobile.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });
    console.log('Mobile overflow check:', overflowMobile.scrollWidth <= overflowMobile.clientWidth ? 'OK (No overflow)' : 'FAIL');

    // Screenshots Mobile
    const macaMobile = await pageMobile.$('#maca-padaria-artesanal');
    if (macaMobile) {
      const f = path.join(capturesDir, 'croissant-maca-mobile.png');
      await macaMobile.screenshot({ path: f });
      fs.copyFileSync(f, path.join(artifactDir, 'croissant-maca-mobile.png'));
    }

    const origemMobile = await pageMobile.$('#origem-padaria');
    if (origemMobile) {
      const f = path.join(capturesDir, 'croissant-origem-mobile.png');
      await origemMobile.screenshot({ path: f });
      fs.copyFileSync(f, path.join(artifactDir, 'croissant-origem-mobile.png'));
    }

    await browser.close();
    console.log('All visual verification steps finished successfully!');
  } finally {
    server.close();
  }
}

run().catch(console.error);
