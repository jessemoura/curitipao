const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function cleanMarkdown(str) {
  if (!str) return '';
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--color-primary); font-weight: 600; text-decoration: underline;">$1</a>');
}

function parseGuiaMarkdown(markdownContent) {
  const lines = markdownContent.split('\n');
  let introLines = [];
  let bairros = [];
  let currentBairro = null;
  let currentBakery = null;
  let inIntro = true;
  let closingParagraph = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) continue;

    // Skip top title and subtitle lines in intro parsing
    if (trimmed.startsWith('# ') || trimmed.startsWith('*Um guia') || trimmed === 'Curadoria CuritiPão') {
      continue;
    }

    // Check for concluding paragraph
    if (trimmed.startsWith('Qual é a padaria do seu bairro que merece entrar neste guia?')) {
      closingParagraph = trimmed;
      currentBakery = null;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      inIntro = false;
      const bairroName = trimmed.replace(/^##\s+/, '').trim();
      currentBairro = {
        name: bairroName,
        id: slugify(bairroName),
        bakeries: []
      };
      bairros.push(currentBairro);
      currentBakery = null;
      continue;
    }

    if (trimmed.startsWith('### ') && currentBairro) {
      const bakeryName = trimmed.replace(/^###\s+/, '').trim();
      currentBakery = {
        name: bakeryName,
        id: slugify(bakeryName),
        bairro: currentBairro.name,
        paragraphs: [],
        addresses: []
      };
      currentBairro.bakeries.push(currentBakery);
      continue;
    }

    if (inIntro) {
      introLines.push(trimmed);
    } else if (currentBakery) {
      // Address parsing
      if (trimmed.startsWith('**Onde**') || trimmed.startsWith('**Onde:')) {
        let addrText = trimmed.replace(/^\*\*Onde\*\*\s*[—:]\s*/i, '').replace(/^\*\*Onde\*\*/i, '').trim();
        if (addrText) {
          // Check for Sphair special case with two addresses separated by ", e "
          if (addrText.includes(', e Rua ')) {
            const parts = addrText.split(', e ');
            currentBakery.addresses.push({
              label: 'Unidade Ahú',
              fullText: parts[0].trim(),
              cleanAddress: parts[0].replace(/,\s*Ahú\.?$/i, '').replace(/\.\s*$/, '').trim()
            });
            currentBakery.addresses.push({
              label: 'Unidade Bigorrilho',
              fullText: parts[1].trim(),
              cleanAddress: parts[1].replace(/,\s*Bigorrilho\.?$/i, '').replace(/\.\s*$/, '').trim()
            });
          } else {
            currentBakery.addresses.push({
              label: '',
              fullText: addrText,
              cleanAddress: addrText.replace(/\.\s*$/, '').trim()
            });
          }
        }
      } else if (trimmed.startsWith('- **') && currentBakery) {
        // Bulleted address with unit name, e.g.: - **Batel** — Avenida Visconde de Guarapuava, 4882.
        const unitMatch = trimmed.match(/^- \*\*(.*?)\*\*\s*[—:]\s*(.*)$/);
        if (unitMatch) {
          const unitName = unitMatch[1].trim();
          const unitAddr = unitMatch[2].trim().replace(/\.\s*$/, '');
          currentBakery.addresses.push({
            label: unitName,
            fullText: `${unitName} — ${unitAddr}`,
            cleanAddress: unitAddr
          });
        }
      } else {
        currentBakery.paragraphs.push(trimmed);
      }
    }
  }

  return { introLines, bairros, closingParagraph };
}

function renderGuiaPadariasHtml(markdownContent) {
  const { introLines, bairros, closingParagraph } = parseGuiaMarkdown(markdownContent);
  
  // Count total bakeries
  let totalBakeries = 0;
  bairros.forEach(b => {
    totalBakeries += b.bakeries.length;
  });

  // TOC Items (by Neighborhood)
  const tocItemsHtml = bairros.map(b => `
    <a href="#bairro-${b.id}" class="roteiro-toc-item" style="display: flex; flex-direction: column; padding: 12px 16px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-decoration: none; transition: transform 0.15s ease, border-color 0.15s ease;">
      <span class="roteiro-toc-bairro" style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary);">${b.name}</span>
      <span class="roteiro-toc-padaria" style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 4px;">${b.bakeries.length} ${b.bakeries.length === 1 ? 'padaria' : 'padarias'}</span>
    </a>
  `).join('\n');

  // Lead intro paragraphs
  const introHtml = introLines.map(p => {
    let clean = cleanMarkdown(p);
    // Ensure Festival CuritiPão 2026 links correctly to /festival/2026/
    clean = clean.replace(/href="\/festival\/"/g, 'href="/festival/2026/"');
    return `<p style="margin-bottom: 16px;">${clean}</p>`;
  }).join('\n');

  // Render Neighborhoods and Bakeries
  const bairrosHtml = bairros.map(b => {
    const bakeriesHtml = b.bakeries.map(bakery => {
      const descHtml = bakery.paragraphs.map(p => `<p style="margin-bottom: 14px;">${cleanMarkdown(p)}</p>`).join('\n');
      
      const addressesHtml = bakery.addresses.map(addrObj => {
        // Strip trailing period and normalize query
        let queryAddr = addrObj.cleanAddress.replace(/\.\s*$/, '');
        // If queryAddr doesn't already specify bairro or Curitiba, append Curitiba, PR
        let mapsQuery = encodeURIComponent(`${queryAddr}, Curitiba - PR`);
        
        return `
          <div class="roteiro-address-item" style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px;">
            <div style="font-size: 0.95rem; color: var(--color-text); line-height: 1.5;">
              ${addrObj.label ? `<span class="badge badge-brown" style="font-size: 0.75rem; padding: 2px 8px; margin-right: 6px; vertical-align: middle;">${addrObj.label}</span>` : ''}
              <strong>Onde:</strong> ${addrObj.fullText}
            </div>
            <div>
              <a href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 14px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>Como chegar &rarr;</span>
              </a>
            </div>
          </div>
        `;
      }).join('\n');

      return `
        <article class="roteiro-bakery-item" id="${bakery.id}" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 26px; margin-bottom: 26px; box-shadow: var(--shadow-xs);">
          <div class="roteiro-bakery-content" style="max-width: 100%;">
            <h3 class="roteiro-bakery-title" style="font-size: 1.4rem; color: var(--color-primary); margin: 0 0 14px; line-height: 1.3;">${bakery.name}</h3>
            <div class="roteiro-bakery-text" style="font-size: 1rem; line-height: 1.7; color: var(--color-text); margin-bottom: 20px;">
              ${descHtml}
            </div>
            ${addressesHtml ? `
            <div class="roteiro-address-box" style="background: var(--color-bg); padding: 16px 20px; border-radius: var(--radius-md); border-left: 4px solid var(--color-accent); margin-bottom: 16px;">
              ${addressesHtml}
            </div>
            ` : ''}
            <div class="roteiro-bakery-actions" style="display: flex; justify-content: flex-end; align-items: center; padding-top: 12px; border-top: 1px solid var(--color-border); font-size: 0.85rem;">
              <a href="#conteudo-principal" style="color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao sumário</a>
            </div>
          </div>
        </article>
      `;
    }).join('\n');

    return `
      <section class="roteiro-bairro-section" id="bairro-${b.id}" style="margin-bottom: 45px; scroll-margin-top: 80px;">
        <header class="roteiro-bairro-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--color-border); padding-bottom: 12px; margin-bottom: 24px; flex-wrap: wrap; gap: 8px;">
          <h2 style="font-size: 1.65rem; color: var(--color-primary); margin: 0;">${b.name}</h2>
          <span class="roteiro-bairro-badge" style="background: var(--color-surface-elevated); color: var(--color-accent-text, var(--color-primary)); font-size: 0.82rem; font-weight: 600; padding: 4px 12px; border-radius: 999px; border: 1px solid var(--color-border);">${b.bakeries.length} ${b.bakeries.length === 1 ? 'padaria' : 'padarias'}</span>
        </header>
        <div class="roteiro-bairro-bakeries">
          ${bakeriesHtml}
        </div>
      </section>
    `;
  }).join('\n');

  const closingHtml = closingParagraph ? `
    <div class="roteiro-closing-quote" style="background: var(--color-surface); border: 2px solid var(--color-accent); border-radius: var(--radius-lg); padding: 28px; margin: 40px 0; box-shadow: var(--shadow-sm);">
      <p style="font-size: 1.05rem; line-height: 1.7; color: var(--color-text); margin: 0;">
        ${cleanMarkdown(closingParagraph)}
      </p>
    </div>
  ` : '';

  return `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <a href="/roteiros/">Roteiros</a>
        <span class="sep">/</span>
        <span aria-current="page">30 padarias em Curitiba por bairro</span>
      </nav>
      <span class="badge badge-gold" style="margin-bottom: 14px;">Guia Completo • Curadoria CuritiPão</span>
      <h1>30 padarias em Curitiba para conhecer, bairro por bairro</h1>
      <p class="lead" style="max-width: 760px; margin: 12px 0 0; font-size: 1.15rem; color: var(--color-text-muted); line-height: 1.55;">
        Um guia com endereços e dicas do que pedir, do pão de fermentação natural ao croissant e ao buffet de café da manhã.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container roteiro-article-container" id="conteudo-principal">
      <!-- Byline Strip Oficial -->
      <div class="roteiro-byline-strip" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid var(--color-border);">
        <span>Assinatura: <strong class="roteiro-byline-author" style="color: var(--color-primary); font-weight: 600;">Curadoria CuritiPão</strong></span>
        <span>•</span>
        <span>Roteiros</span>
        <span>•</span>
        <span>Novembro de 2026</span>
        <span>•</span>
        <span>30 Padarias</span>
      </div>

      <!-- Imagem de Capa Principal (16:9) Única -->
      <figure class="roteiro-bakery-figure roteiro-cover-figure" style="border-radius: var(--radius-lg); margin-bottom: 35px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden; position: relative;">
        <img src="/assets/photos/roteiros/guia-padarias-curitiba-por-bairro/capa-guia-padarias-16x9.webp" alt="Seleção de pães artesanais de fermentação natural variados, incluindo pães de campo, baguetes e pães rústicos" class="roteiro-bakery-img" width="960" height="540" style="aspect-ratio: 16/9; object-fit: cover; width: 100%; max-height: 480px; display: block;" loading="eager">
        <figcaption class="roteiro-bakery-caption" style="padding: 10px 16px; background: var(--color-surface); font-size: 0.82rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); text-align: right;">
          <span style="font-style: italic;">Imagem ilustrativa</span>
        </figcaption>
      </figure>

      <!-- Introdução Editorial Integral -->
      <div class="roteiro-lead-intro" style="font-size: 1.05rem; line-height: 1.7; color: var(--color-text); margin-bottom: 35px;">
        ${introHtml}
      </div>

      <!-- Sumário Navegável por Bairros -->
      <nav class="roteiro-toc-card" aria-label="Sumário por bairros" style="background: var(--color-surface); border: 2px solid var(--color-accent); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 45px; box-shadow: var(--shadow-sm);">
        <h2 class="roteiro-toc-title" style="margin: 0 0 8px; font-size: 1.25rem; color: var(--color-primary); display: flex; align-items: center; gap: 8px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Sumário por Bairros (${bairros.length} regiões mapeadas)
        </h2>
        <p class="roteiro-toc-desc" style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 18px;">
          Navegue pelas opções da cidade de acordo com o seu bairro de interesse:
        </p>
        <div class="roteiro-toc-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: 12px;">
          ${tocItemsHtml}
        </div>
      </nav>

      <!-- Conteúdo Editorial por Bairros e Padarias -->
      <div class="roteiro-bairros-container">
        ${bairrosHtml}
      </div>

      <!-- Conclusão Editorial -->
      ${closingHtml}

      <!-- Bloco de Conclusão e Links Internos Cruzados -->
      <div class="roteiro-related-box" style="margin-top: 50px; padding: 28px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 1.25rem; color: var(--color-primary); margin: 0 0 12px;">Continue explorando a panificação de Curitiba</h3>
        <p style="font-size: 0.95rem; color: var(--color-text); line-height: 1.6; margin-bottom: 20px;">
          CuritiPão é o guia permanente de pães e padarias artesanais de Curitiba. Conheça também nossos outros roteiros e conteúdos especiais:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 16px;">
          <a href="/roteiros/onde-comer-croissant-em-curitiba/" style="display: block; padding: 16px; background: var(--color-bg); border-radius: var(--radius-md); text-decoration: none; border: 1px solid var(--color-border);">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-accent-text, #92400e); text-transform: uppercase;">Viennoiserie Artesanal</span>
            <h4 style="font-size: 1rem; color: var(--color-primary); margin: 6px 0;">Onde comer croissant &rarr;</h4>
            <p style="font-size: 0.84rem; color: var(--color-text-muted); margin: 0;">10 lugares no estilo francês para saborear o clássico folhado sem recheio.</p>
          </a>
          <a href="/roteiros/padarias-em-curitiba-por-bairro/" style="display: block; padding: 16px; background: var(--color-bg); border-radius: var(--radius-md); text-decoration: none; border: 1px solid var(--color-border);">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-accent-text, #92400e); text-transform: uppercase;">Festival CuritiPão 2026</span>
            <h4 style="font-size: 1rem; color: var(--color-primary); margin: 6px 0;">15 padarias do Festival &rarr;</h4>
            <p style="font-size: 0.84rem; color: var(--color-text-muted); margin: 0;">A seleção e memórias da curadora Ledinara com as participantes da primeira edição.</p>
          </a>
          <a href="/festival/2026/" style="display: block; padding: 16px; background: var(--color-bg); border-radius: var(--radius-md); text-decoration: none; border: 1px solid var(--color-border);">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-accent-text, #92400e); text-transform: uppercase;">Memória e História</span>
            <h4 style="font-size: 1rem; color: var(--color-primary); margin: 6px 0;">Arquivo do Festival 2026 &rarr;</h4>
            <p style="font-size: 0.84rem; color: var(--color-text-muted); margin: 0;">As criações e os detalhes que marcaram o primeiro grande festival da cidade.</p>
          </a>
        </div>
      </div>
    </div>
  </section>
  `;
}

module.exports = {
  renderGuiaPadariasHtml,
  parseGuiaMarkdown
};
