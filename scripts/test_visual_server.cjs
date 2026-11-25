const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const distDir = path.resolve('dist');
const artifactDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function startServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      let filePath = path.join(distDir, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, () => resolve(server));
  });
}

async function runTests() {
  const port = 3456;
  const server = await startServer(port);
  console.log(`Local test server running at http://localhost:${port}/`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const targets = [
    { slug: 'origem-do-panetone', name: 'panetone' },
    { slug: 'historia-da-baguete-francesa', name: 'baguete' },
    { slug: 'pumpernickel-pao-alemao', name: 'pumpernickel' }
  ];

  let hasOverflow = false;

  for (const target of targets) {
    const url = `http://localhost:${port}/blog/${target.slug}/`;
    console.log(`\nTesting ${target.slug} (${url})...`);

    // Desktop 1280px (Light & Dark)
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      const imgStatus = await page.evaluate(() => {
        const img = document.querySelector('.roteiro-bakery-img');
        return img ? { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight } : null;
      });

      console.log(`  [Desktop 1280px - ${theme}] Overflow: ${overflow} | Image: ${JSON.stringify(imgStatus)}`);
      if (overflow) hasOverflow = true;

      const shot = path.join(artifactDir, `local-${target.name}-desktop-${theme}.png`);
      await page.screenshot({ path: shot, fullPage: false });
      await ctx.close();
    }

    // Mobile 375px (Light & Dark)
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, colorScheme: theme });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      console.log(`  [Mobile 375px - ${theme}] Overflow: ${overflow}`);
      if (overflow) hasOverflow = true;

      const shot = path.join(artifactDir, `local-${target.name}-mobile-375-${theme}.png`);
      await page.screenshot({ path: shot, fullPage: false });
      await ctx.close();
    }

    // Mobile 320px (Light)
    const ctx320 = await browser.newContext({ viewport: { width: 320, height: 568 }, colorScheme: 'light' });
    const page320 = await ctx320.newPage();
    await page320.goto(url, { waitUntil: 'networkidle' });

    const overflow320 = await page320.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(`  [Mobile 320px - light] Overflow: ${overflow320}`);
    if (overflow320) {
      const culprit = await page320.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        return Array.from(document.querySelectorAll('*'))
          .filter(el => el.getBoundingClientRect().right > docW + 1)
          .map(el => ({ tag: el.tagName, class: el.className, text: el.innerText ? el.innerText.slice(0, 40) : '' }));
      });
      console.log('  Culprit:', culprit);
      hasOverflow = true;
    }
    await ctx320.close();
  }

  await browser.close();
  server.close();

  console.log(`\n=== OVERFLOW TEST RESULT: ${hasOverflow ? 'FAILED' : 'PASSED (100% CLEAN)'} ===`);
  if (hasOverflow) process.exit(1);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
