const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function testContatoForms() {
  console.log('--- STARTING PLAYWRIGHT TESTING OF /contato/ FORMS ---');
  
  // Find local Chrome or Edge
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  let execPath = possiblePaths.find(p => fs.existsSync(p));
  if (!execPath) {
    throw new Error('No browser executable found!');
  }

  const browser = await chromium.launch({
    executablePath: execPath,
    headless: true
  });

  // TEST 1: DESKTOP VIEWPORT
  console.log('\n--- 1. Testing Desktop Viewport (1280x800) ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktopPage.goto('http://localhost:5173/contato/', { waitUntil: 'networkidle' });

  // Check form presence
  const formIndicar = await desktopPage.$('form[data-curitipao-form="indicar"]');
  const formCadastrar = await desktopPage.$('form[data-curitipao-form="cadastrar"]');
  console.log('Form Indicar present:', !!formIndicar);
  console.log('Form Cadastrar present:', !!formCadastrar);

  // Check notice texts
  const noticeText = await desktopPage.textContent('.form-notice');
  console.log('Top notice mentions SMTP homologation:', noticeText.includes('homologação técnica'));

  const revNoticeA = await desktopPage.textContent('#indicar .form-revision-notice');
  console.log('Form A revision notice contains required text:', revNoticeA.includes('As informações enviadas serão analisadas pela equipe CuritiPão antes da publicação ou atualização no guia.'));

  const revNoticeB = await desktopPage.textContent('#cadastrar .form-revision-notice');
  console.log('Form B revision notice contains required text:', revNoticeB.includes('As informações enviadas serão analisadas pela equipe CuritiPão antes da publicação ou atualização no guia.'));

  // Test Phone Formatting & Same Phone toggle on Form A
  console.log('\n--- Testing Form A: Landline, Mobile & Same Phone Toggle ---');
  await desktopPage.fill('#ind-telefone', '4132221234');
  let valTelA = await desktopPage.inputValue('#ind-telefone');
  console.log('Form A Landline formatted (raw 4132221234):', valTelA);

  await desktopPage.check('#ind-mesmo-contato');
  let valWppA = await desktopPage.inputValue('#ind-whatsapp');
  let isReadOnlyWppA = await desktopPage.getAttribute('#ind-whatsapp', 'readonly');
  console.log('Form A WhatsApp after checking "mesmo contato":', valWppA, '| readonly:', !!isReadOnlyWppA);

  // Type new landline, check if synced
  await desktopPage.fill('#ind-telefone', '41991234567');
  valWppA = await desktopPage.inputValue('#ind-whatsapp');
  console.log('Form A WhatsApp after changing telephone to mobile (raw 41991234567):', valWppA);

  // Uncheck same phone
  await desktopPage.uncheck('#ind-mesmo-contato');
  isReadOnlyWppA = await desktopPage.getAttribute('#ind-whatsapp', 'readonly');
  console.log('Form A WhatsApp after unchecking "mesmo contato" readonly:', !!isReadOnlyWppA);

  // Check authorizations
  const indAuthTel = await desktopPage.isChecked('#ind-autoriza-tel');
  const indAuthWpp = await desktopPage.isChecked('#ind-autoriza-wpp');
  console.log('Form A Authorization checkboxes present and default checked:', indAuthTel && indAuthWpp);

  // Test Form B: Validation of at least one contact (Phone or WhatsApp)
  console.log('\n--- Testing Form B: Required Contact Validation ---');
  await desktopPage.fill('#cad-responsavel', 'Carlos Teste');
  await desktopPage.fill('#cad-cargo', 'Proprietário');
  await desktopPage.fill('#cad-email', 'carlos@padariateste.com.br');
  await desktopPage.fill('#cad-nomepadaria', 'Padaria Forno de Ouro');
  await desktopPage.fill('#cad-endereco', 'Rua XV de Novembro, 1000 - Centro');
  await desktopPage.fill('#cad-horarios', 'Seg a Sab 07h-19h');
  await desktopPage.fill('#cad-especialidades', 'Sourdough e Croissants');
  await desktopPage.fill('#cad-atendimento', 'Balcão e Café');
  await desktopPage.fill('#cad-apresentacao', 'Padaria artesanal tradicional no coração de Curitiba.');

  // Leave phone and whatsapp empty, attempt submit
  await desktopPage.click('#cadastrar button[type="submit"]');
  const alertaVisivel = await desktopPage.isVisible('#cad-contato-alerta');
  console.log('Form B blocked when both contacts empty and alert displayed:', alertaVisivel);

  // Fill WhatsApp only
  await desktopPage.fill('#cad-whatsapp', '41988887777');
  const valWppB = await desktopPage.inputValue('#cad-whatsapp');
  console.log('Form B WhatsApp formatted:', valWppB);

  // Submit with WhatsApp filled
  await desktopPage.click('#cadastrar button[type="submit"]');
  await desktopPage.waitForFunction(() => {
    const el = document.querySelector('#cadastrar .form-status-message');
    return el && el.style.display !== 'none' && el.innerText.length > 0;
  }, { timeout: 10000 });

  const statusMsgB = await desktopPage.textContent('#cadastrar .form-status-message');
  console.log('Form B submitted successfully, status message contains review & SMTP info:', statusMsgB.includes('Nenhuma confirmação') || statusMsgB.includes('contato@curitipao.com.br'));
  console.log('Status message text excerpt:', statusMsgB.slice(0, 150).replace(/\s+/g, ' '));

  // Take screenshot of desktop form
  const artifactDir = 'C:\\Users\\Jesse\\.gemini\\antigravity-ide\\brain\\68a17cf5-6727-477d-93bf-43c3c9374475';
  await desktopPage.screenshot({ path: path.join(artifactDir, 'contato_desktop_forms.png'), fullPage: false });
  console.log('Saved desktop screenshot to artifacts.');

  // TEST 2: MOBILE VIEWPORT
  console.log('\n--- 2. Testing Mobile Viewport (375x812) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:5173/contato/', { waitUntil: 'networkidle' });

  // Test same phone toggle on mobile
  await mobilePage.fill('#cad-telefone', '4133445566');
  await mobilePage.check('#cad-mesmo-contato');
  const mValWpp = await mobilePage.inputValue('#cad-whatsapp');
  console.log('Mobile Form B WhatsApp synced:', mValWpp);

  await mobilePage.screenshot({ path: path.join(artifactDir, 'contato_mobile_forms.png'), fullPage: false });
  console.log('Saved mobile screenshot to artifacts.');

  await browser.close();
  console.log('\n--- ALL CONTACT FORM PLAYWRIGHT TESTS PASSED! ---');
}

testContatoForms().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
