const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = './dist/screenshots_evidence';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome' // uses installed Chrome or Edge
  }).catch(async () => {
    return await chromium.launch({
      headless: true,
      channel: 'msedge'
    });
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  console.log('Testing Home Header & Footer (Light & Dark)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Accept cookies to dismiss banner
  try {
    await page.evaluate(() => localStorage.setItem('curitipao_cookie_consent', 'accepted'));
    const acceptBtn = await page.$('.cookie-banner button:has-text("Aceitar"), button:has-text("Aceitar")');
    if (acceptBtn) await acceptBtn.click();
    await page.waitForTimeout(300);
  } catch (e) {}

  // 1. Desktop Header Light
  await page.screenshot({ path: path.join(outDir, '01_desktop_header_light.png'), clip: { x: 0, y: 0, width: 1280, height: 160 } });

  // 2. Desktop Header Dark
  await page.click('.btn-theme-toggle');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '02_desktop_header_dark.png'), clip: { x: 0, y: 0, width: 1280, height: 160 } });

  // 3. Desktop Footer Dark
  const footer = await page.$('.site-footer');
  if (footer) {
    await footer.screenshot({ path: path.join(outDir, '03_desktop_footer_dark.png') });
  }

  // 4. Desktop Footer Light
  await page.click('.btn-theme-toggle');
  await page.waitForTimeout(300);
  if (footer) {
    await footer.screenshot({ path: path.join(outDir, '04_desktop_footer_light.png') });
  }

  // 5. Mobile Drawer with Logo & Instagram
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('.menu-toggle-btn');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, '05_mobile_drawer.png') });

  // 6. Soluções Digitais - Bloco CONEXUS & Prévias de E-mail
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('http://localhost:5173/solucoes-digitais/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const b = document.querySelector('.cookie-banner');
    if (b) b.remove();
  });
  const contactCard = await page.$('.conexus-contact-card');
  if (contactCard) {
    await contactCard.screenshot({ path: path.join(outDir, '06_conexus_contacts_and_email_previews.png') });
  }

  // 7. Blog - Foto com Legenda da Autora
  await page.goto('http://localhost:5173/blog/o-curitipao-continua/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const b = document.querySelector('.cookie-banner');
    if (b) b.remove();
  });
  const blogFigure = await page.$('figure');
  if (blogFigure) {
    await blogFigure.screenshot({ path: path.join(outDir, '07_blog_photo_credit_lorena.png') });
  }

  // 8. Festival 2026 - Capas da Imprensa & RIC Frame
  await page.goto('http://localhost:5173/festival/2026/#imprensa', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const b = document.querySelector('.cookie-banner, #cookie-banner, [id*="cookie"]');
    if (b) b.remove();
  });
  await page.waitForTimeout(500);
  const pressSection = await page.$('#imprensa');
  if (pressSection) {
    await pressSection.screenshot({ path: path.join(outDir, '08_press_cards_horizontal_covers.png') });
  }

  await browser.close();
  console.log('ALL SCREENSHOTS SUCCESSFULLY CAPTURED in ' + outDir);
}

run().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
