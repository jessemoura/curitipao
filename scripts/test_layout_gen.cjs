const fs = require('fs');

const testHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste de Layout Fotos Internas</title>
  <style>
    body { background: #F8F5F0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; }
    .container { max-width: 760px; margin: 0 auto; }
    
    .roteiro-bakery-item {
      background: #FFFFFF;
      border: 1px solid #E5DFD7;
      border-radius: 16px;
      margin-bottom: 30px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .roteiro-internal-photo-stage {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px 20px 0;
      width: 100%;
      box-sizing: border-box;
    }

    .roteiro-internal-figure {
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #E5DFD7;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
    }

    .roteiro-internal-zoom-btn {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      cursor: zoom-in;
      position: relative;
      line-height: 0;
      text-align: center;
    }

    .roteiro-internal-img {
      display: block;
      width: 100%;
      height: auto;
      max-height: 440px;
      object-fit: contain;
      margin: 0 auto;
    }

    .demo-photo-zoom-hint {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(26, 23, 21, 0.85);
      color: #fff;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 5px;
      pointer-events: none;
      line-height: 1;
    }

    .roteiro-internal-caption {
      width: 100%;
      padding: 8px 12px;
      background: #FDFBF7;
      border-top: 1px solid #E5DFD7;
      font-size: 0.8rem;
      color: #6E6259;
      box-sizing: border-box;
      text-align: center;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    @media (max-width: 640px) {
      .roteiro-internal-photo-stage {
        padding: 16px 14px 0;
      }
      .roteiro-internal-figure {
        max-width: 100% !important;
      }
      .roteiro-internal-img {
        max-height: 380px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Maçã (782x801)</h2>
    <article class="roteiro-bakery-item">
      <div class="roteiro-internal-photo-stage">
        <figure class="roteiro-internal-figure" style="max-width: min(100%, 430px);">
          <button type="button" class="roteiro-internal-zoom-btn">
            <img src="../assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-maca-padaria.webp" alt="Maçã" class="roteiro-internal-img" width="782" height="801">
            <span class="demo-photo-zoom-hint">Ampliar</span>
          </button>
          <figcaption class="roteiro-internal-caption">
            <span style="font-style: italic;">Curadoria CuritiPão</span>
            <span>Croissant clássico bem executado</span>
          </figcaption>
        </figure>
      </div>
      <div style="padding: 24px;">
        <h3>Maçã Padaria Artesanal</h3>
        <p>Texto da Maçã...</p>
      </div>
    </article>

    <h2>Origem (624x803)</h2>
    <article class="roteiro-bakery-item">
      <div class="roteiro-internal-photo-stage">
        <figure class="roteiro-internal-figure" style="max-width: min(100%, 342px);">
          <button type="button" class="roteiro-internal-zoom-btn">
            <img src="../assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-origem-padaria.webp" alt="Origem" class="roteiro-internal-img" width="624" height="803">
            <span class="demo-photo-zoom-hint">Ampliar</span>
          </button>
          <figcaption class="roteiro-internal-caption">
            <span style="font-style: italic;">Curadoria CuritiPão</span>
            <span>Massa que desmancha na boca com sabor de manteiga</span>
          </figcaption>
        </figure>
      </div>
      <div style="padding: 24px;">
        <h3>Origem Padaria</h3>
        <p>Texto da Origem...</p>
      </div>
    </article>
  </div>
</body>
</html>`;

fs.writeFileSync('scripts/test_layout.html', testHtml, 'utf8');
console.log('Updated scripts/test_layout.html');
