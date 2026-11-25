const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

async function waitForImage(page, selector) {
  const el = await page.$(selector);
  if (!el) return null;
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.waitForFunction((sel) => {
    const card = document.querySelector(sel);
    if (!card) return false;
    const img = card.querySelector('img');
    return img && img.complete && img.naturalWidth > 0;
  }, selector);
  await page.waitForTimeout(200);
  return el;
}

async function captureLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const capturesDir = path.resolve('capturas');
  const artifactDir = 'C:\\Users\\Jesse\\.gemini\\antigravity\\brain\\faeb36a3-aba3-4c94-a8cf-e202e9054597';

  // Desktop
  const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/', { waitUntil: 'networkidle' });
  
  try {
    const btn = await pageDesktop.$('.cookie-consent-actions button, #cookie-accept-btn, button:has-text("Aceitar")');
    if (btn) await btn.click();
    await pageDesktop.waitForTimeout(300);
  } catch (e) {}

  // 1. Live Maçã Desktop
  const macaDesktop = await waitForImage(pageDesktop, '#maca-padaria-artesanal');
  if (macaDesktop) {
    const file = path.join(capturesDir, 'live-croissant-maca-desktop.png');
    await macaDesktop.screenshot({ path: file });
    fs.copyFileSync(file, path.join(artifactDir, 'live-croissant-maca-desktop.png'));
    console.log('Saved live-croissant-maca-desktop.png');
  }

  // 2. Live Origem Desktop
  const origemDesktop = await waitForImage(pageDesktop, '#origem-padaria');
  if (origemDesktop) {
    const file = path.join(capturesDir, 'live-croissant-origem-desktop.png');
    await origemDesktop.screenshot({ path: file });
    fs.copyFileSync(file, path.join(artifactDir, 'live-croissant-origem-desktop.png'));
    console.log('Saved live-croissant-origem-desktop.png');
  }

  // 3. Live Bonin Desktop
  const boninDesktop = await waitForImage(pageDesktop, '#bonin-bakery');
  if (boninDesktop) {
    const file = path.join(capturesDir, 'live-croissant-bonin-desktop.png');
    await boninDesktop.screenshot({ path: file });
    fs.copyFileSync(file, path.join(artifactDir, 'live-croissant-bonin-desktop.png'));
    console.log('Saved live-croissant-bonin-desktop.png');
  }

  // Mobile 375px
  const contextMobile = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/', { waitUntil: 'networkidle' });
  try {
    const btn = await pageMobile.$('.cookie-consent-actions button, #cookie-accept-btn, button:has-text("Aceitar")');
    if (btn) await btn.click();
    await pageMobile.waitForTimeout(300);
  } catch (e) {}

  // Prevent sticky header from clipping scrolled elements in screenshot
  await pageMobile.evaluate(() => {
    const header = document.querySelector('.site-header');
    if (header) header.style.position = 'static';
  });

  // 4. Live Maçã Mobile
  const macaMobile = await waitForImage(pageMobile, '#maca-padaria-artesanal');
  if (macaMobile) {
    const file = path.join(capturesDir, 'live-croissant-maca-mobile.png');
    await macaMobile.screenshot({ path: file });
    fs.copyFileSync(file, path.join(artifactDir, 'live-croissant-maca-mobile.png'));
    console.log('Saved live-croissant-maca-mobile.png');
  }

  // 5. Live Origem Mobile
  const origemMobile = await waitForImage(pageMobile, '#origem-padaria');
  if (origemMobile) {
    const file = path.join(capturesDir, 'live-croissant-origem-mobile.png');
    await origemMobile.screenshot({ path: file });
    fs.copyFileSync(file, path.join(artifactDir, 'live-croissant-origem-mobile.png'));
    console.log('Saved live-croissant-origem-mobile.png');
  }

  await browser.close();
  console.log('Live captures successfully updated!');
}

captureLive().catch(console.error);
