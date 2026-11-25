const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const artifactDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

async function runVisualTests() {
  console.log('=== RUNNING LOCAL BROWSER RESPONSIVE & VISUAL TESTS ===\n');

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
    const fileUrl = 'file:///' + path.resolve(`dist/blog/${target.slug}/index.html`).replace(/\\/g, '/');
    console.log(`Testing ${target.slug}...`);

    // 1. Desktop 1280px (Light & Dark)
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        colorScheme: theme
      });
      const page = await context.newPage();
      await page.goto(fileUrl, { waitUntil: 'load' });

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      const imgStatus = await page.evaluate(() => {
        const img = document.querySelector('.roteiro-bakery-img');
        return img ? { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight } : null;
      });

      console.log(`  [Desktop 1280px - ${theme}] Overflow: ${overflow} | Image: ${JSON.stringify(imgStatus)}`);
      if (overflow) hasOverflow = true;

      const shotPath = path.join(artifactDir, `local-${target.name}-desktop-${theme}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      await context.close();
    }

    // 2. Mobile 375px (Light & Dark)
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        colorScheme: theme
      });
      const page = await context.newPage();
      await page.goto(fileUrl, { waitUntil: 'load' });

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      console.log(`  [Mobile 375px - ${theme}] Overflow: ${overflow}`);
      if (overflow) hasOverflow = true;

      const shotPath = path.join(artifactDir, `local-${target.name}-mobile-375-${theme}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      await context.close();
    }

    // 3. Mobile 320px (Light)
    const context320 = await browser.newContext({
      viewport: { width: 320, height: 568 },
      colorScheme: 'light'
    });
    const page320 = await context320.newPage();
    await page320.goto(fileUrl, { waitUntil: 'load' });

    const overflow320 = await page320.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(`  [Mobile 320px - light] Overflow: ${overflow320}`);
    if (overflow320) hasOverflow = true;

    await context320.close();
  }

  // 4. Blog Index Desktop
  const blogUrl = 'file:///' + path.resolve('dist/blog/index.html').replace(/\\/g, '/');
  const contextBlog = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pageBlog = await contextBlog.newPage();
  await pageBlog.goto(blogUrl, { waitUntil: 'load' });
  const shotBlog = path.join(artifactDir, 'local-blog-index-with-3-new-articles.png');
  await pageBlog.screenshot({ path: shotBlog, fullPage: false });
  console.log(`  Saved screenshot: local-blog-index-with-3-new-articles.png`);
  await contextBlog.close();

  await browser.close();

  console.log(`\n=== OVERFLOW TEST RESULT: ${hasOverflow ? 'FAILED (found overflow)' : 'PASSED (no overflow)'} ===`);
  if (hasOverflow) process.exit(1);
}

runVisualTests().catch(err => {
  console.error('Visual test failed:', err);
  process.exit(1);
});
