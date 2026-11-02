const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 }
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const outDir = path.join(__dirname, '../capturas');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Capture Header Desktop (Light mode)
  const header = await page.$('.site-header');
  if (header) {
    await header.screenshot({ path: path.join(outDir, 'cabecalho_desktop.png') });
    console.log('Captured cabecalho_desktop.png');
  }

  // Dismiss cookie banner first so it doesn't obstruct the footer credit
  const cookieAccept = await page.$('#btn-cookie-accept');
  if (cookieAccept) {
    await cookieAccept.click();
    await page.waitForTimeout(300);
  }

  // 2. Capture Footer Desktop (Light mode)
  const footer = await page.$('.site-footer');
  if (footer) {
    await footer.screenshot({ path: path.join(outDir, 'rodape_desktop_claro.png') });
    console.log('Captured rodape_desktop_claro.png');
  }

  // 3. Switch to Dark Mode and capture Footer
  await page.click('.btn-theme-toggle');
  await page.waitForTimeout(300);
  if (footer) {
    await footer.screenshot({ path: path.join(outDir, 'rodape_desktop_escuro.png') });
    console.log('Captured rodape_desktop_escuro.png');
  }

  // 4. Capture Mobile Header and Drawer
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  
  // Click mobile toggle to open drawer
  await page.click('.menu-toggle-btn');
  await page.waitForTimeout(400);

  const drawer = await page.$('.mobile-nav-drawer');
  if (drawer) {
    await drawer.screenshot({ path: path.join(outDir, 'menu_mobile_aberto.png') });
    console.log('Captured menu_mobile_aberto.png');
  }

  // Dismiss cookie banner on mobile if present
  const mobileCookie = await page.$('#btn-cookie-accept');
  if (mobileCookie) {
    await mobileCookie.click();
    await page.waitForTimeout(300);
  }

  // Also capture Mobile Footer
  const mobileFooter = await page.$('.site-footer');
  if (mobileFooter) {
    await mobileFooter.screenshot({ path: path.join(outDir, 'rodape_mobile.png') });
    console.log('Captured rodape_mobile.png');
  }

  await browser.close();
  console.log('All screenshots captured in ./capturas!');
}

capture().catch(console.error);
