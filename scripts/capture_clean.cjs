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
    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function dismissCookies(page) {
  try {
    const btn = await page.$('.cookie-consent-actions button, #cookie-accept-btn, button:has-text("Aceitar")');
    if (btn) {
      await btn.click();
      await page.waitForTimeout(300);
    }
  } catch (e) {}
}

async function run() {
  const distDir = path.resolve('dist');
  const port = 3457;
  const server = await startServer(distDir, port);

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true
    });

    const capturesDir = path.resolve('capturas');
    const artifactDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

    // 1. Desktop Test (1280px)
    const contextDesktop = await browser.newContext({
      viewport: { width: 1280, height: 900 }
    });
    const pageDesktop = await contextDesktop.newPage();
    const url = `http://127.0.0.1:${port}/roteiros/onde-comer-croissant-em-curitiba/`;
    await pageDesktop.goto(url, { waitUntil: 'networkidle' });
    await dismissCookies(pageDesktop);

    // Capture desktop cover figure specifically
    const coverFigure = await pageDesktop.$('.roteiro-cover-figure');
    if (coverFigure) {
      const file = path.join(capturesDir, 'preview-cover-figure-16x9.png');
      await coverFigure.screenshot({ path: file });
      fs.copyFileSync(file, path.join(artifactDir, 'preview-cover-figure-16x9.png'));
      console.log('Saved preview-cover-figure-16x9.png');
    }

    // Capture desktop header & cover in context
    const fileDesktop = path.join(capturesDir, 'preview-desktop-capa.png');
    await pageDesktop.screenshot({
      path: fileDesktop,
      clip: { x: 0, y: 0, width: 1280, height: 950 }
    });
    fs.copyFileSync(fileDesktop, path.join(artifactDir, 'preview-desktop-capa.png'));
    console.log('Saved preview-desktop-capa.png');

    // Capture Noni pending notice
    const noni = await pageDesktop.$('#noni');
    if (noni) {
      const fileNoni = path.join(capturesDir, 'preview-noni-draft.png');
      await noni.screenshot({ path: fileNoni });
      fs.copyFileSync(fileNoni, path.join(artifactDir, 'preview-noni-draft.png'));
      console.log('Saved preview-noni-draft.png');
    }

    // 2. Mobile Test (375px)
    const contextMobile = await browser.newContext({
      viewport: { width: 375, height: 667 },
      isMobile: true
    });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(url, { waitUntil: 'networkidle' });
    await dismissCookies(pageMobile);

    const fileMobile = path.join(capturesDir, 'preview-mobile-capa.png');
    await pageMobile.screenshot({
      path: fileMobile,
      clip: { x: 0, y: 0, width: 375, height: 750 }
    });
    fs.copyFileSync(fileMobile, path.join(artifactDir, 'preview-mobile-capa.png'));
    console.log('Saved preview-mobile-capa.png');

    // 3. Card in Roteiros Index (Select croissant card specifically)
    const pageRoteiros = await contextDesktop.newPage();
    await pageRoteiros.goto(`http://127.0.0.1:${port}/roteiros/`, { waitUntil: 'networkidle' });
    await dismissCookies(pageRoteiros);

    const croissantCard = await pageRoteiros.$('a[href="/roteiros/onde-comer-croissant-em-curitiba/"]');
    if (croissantCard) {
      const cardContainer = await pageRoteiros.evaluateHandle(el => el.closest('article.card-editorial'), croissantCard);
      if (cardContainer) {
        const fileCard = path.join(capturesDir, 'preview-roteiros-card.png');
        await cardContainer.screenshot({ path: fileCard });
        fs.copyFileSync(fileCard, path.join(artifactDir, 'preview-roteiros-card.png'));
        console.log('Saved preview-roteiros-card.png');
      }
    }

    await browser.close();
  } finally {
    server.close();
    console.log('Done!');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
