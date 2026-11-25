const fs = require('fs');
const path = require('path');

function getCroissantArticleContent() {
  return `
  <section class="page-intro-header">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Trilha de navegação">
        <a href="/">Início</a>
        <span class="sep">/</span>
        <a href="/roteiros/">Roteiros</a>
        <span class="sep">/</span>
        <span aria-current="page">Onde comer croissant em Curitiba</span>
      </nav>
      <span class="badge badge-gold" style="margin-bottom: 14px;">Roteiro Temático • Viennoiserie</span>
      <h1>Onde comer croissant no estilo francês em Curitiba</h1>
      <p class="lead" style="max-width: 760px; margin: 12px 0 0; font-size: 1.15rem; color: var(--color-text-muted); line-height: 1.55;">
        10 lugares para provar croissant artesanal sem recheio, da padaria de bairro à confeitaria francesa.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container roteiro-article-container">
      <!-- Byline Strip Oficial -->
      <div class="roteiro-byline-strip">
        <span>Assinatura: <strong class="roteiro-byline-author">Curadoria CuritiPão</strong></span>
        <span>•</span>
        <span>Roteiros</span>
        <span>•</span>
        <span>Novembro de 2026</span>
        <span>•</span>
        <span>Fotos do Acervo</span>
      </div>

      <!-- Imagem de Capa Principal (16:9) -->
      <figure class="roteiro-bakery-figure roteiro-cover-figure" style="border-radius: var(--radius-lg); margin-bottom: 35px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden; position: relative;">
        <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant Bonin Bakery.jpeg" data-alt="Croissant no estilo francês em Curitiba — Foto na Bonin Bakery" data-padaria="Bonin Bakery • Capa" aria-label="Ampliar foto de capa" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
          <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/capa-croissant-curitiba-16x9.webp" alt="Seleção de croissants artesanais no estilo francês em Curitiba — Foto na Bonin Bakery" class="roteiro-bakery-img" width="960" height="540" style="aspect-ratio: 16/9; object-fit: cover; width: 100%; max-height: 480px; display: block;" loading="eager">
          <span class="demo-photo-zoom-hint" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            <span>Ampliar</span>
          </span>
        </button>
        <figcaption class="roteiro-bakery-caption">
          <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
          <span style="font-size: 0.82rem; color: var(--color-text-muted);">Croissant artesanal folhado no estilo francês (Bonin Bakery)</span>
        </figcaption>
      </figure>

      <!-- Introdução Original Integral -->
      <div class="roteiro-lead-intro">
        <p>Quando quero saber se um croissant é bom, peço o mais simples da vitrine. Gosto de partir ao meio e ouvir a casquinha quebrar, olhar o miolo e sentir o aroma de manteiga antes da primeira mordida. É o tipo de coisa que me faz querer um café e mais alguns minutos à mesa.</p>
        <p>Se você está procurando onde comer croissant em Curitiba, este roteiro é para quem gosta do croissant puro, sem recheio, no estilo das boulangeries francesas. É aquele folhado dourado, com casquinha crocante, miolo leve e sabor de manteiga. Em algumas casas, dá para pedir geleia ou manteiga à parte. Eu sempre começo pela primeira mordida pura.</p>
        <p>A seleção está em ordem alfabética.</p>
      </div>

      <!-- Índice Navegável dos 10 Lugares -->
      <nav class="roteiro-toc-card" aria-label="Índice dos estabelecimentos">
        <h2 class="roteiro-toc-title" style="margin-top: 0;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Lugares selecionados em ordem alfabética
        </h2>
        <p class="roteiro-toc-desc">Selecione uma casa para navegar direto até a apresentação, foto e informações de endereço:</p>
        <div class="roteiro-toc-grid">
          <a href="#bonin-bakery" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Centro</span>
            <span class="roteiro-toc-padaria">Bonin Bakery</span>
          </a>
          <a href="#brod-bakery" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Santo Inácio</span>
            <span class="roteiro-toc-padaria">Brød Bakery</span>
          </a>
          <a href="#felipane" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Juvevê</span>
            <span class="roteiro-toc-padaria">Felipane</span>
          </a>
          <a href="#lucca-cafes-especiais" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Batel</span>
            <span class="roteiro-toc-padaria">Lucca Cafés Especiais</span>
          </a>
          <a href="#maca-padaria-artesanal" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Alto da XV • Vila Izabel • Praça do Japão</span>
            <span class="roteiro-toc-padaria">Maçã Padaria Artesanal</span>
          </a>
          <a href="#noni-padaria" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Ahú</span>
            <span class="roteiro-toc-padaria">Noni Padaria</span>
          </a>
          <a href="#origem-padaria" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Centro</span>
            <span class="roteiro-toc-padaria">Origem Padaria</span>
          </a>
          <a href="#pao-prosa" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Cristo Rei</span>
            <span class="roteiro-toc-padaria">Pão Prosa</span>
          </a>
          <a href="#prestinaria" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">6 Unidades em Curitiba</span>
            <span class="roteiro-toc-padaria">Prestinaria</span>
          </a>
          <a href="#sphair-gourmande" class="roteiro-toc-item">
            <span class="roteiro-toc-bairro">Ahú</span>
            <span class="roteiro-toc-padaria">Sphair Gourmande</span>
          </a>
        </div>
      </nav>

      <!-- 1. BONIN BAKERY -->
      <header class="roteiro-bairro-header">
        <h2>Bonin Bakery</h2>
        <span class="roteiro-bairro-badge">Centro</span>
      </header>

      <article class="roteiro-bakery-item" id="bonin-bakery">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant Bonin Bakery.jpeg" data-alt="Croissant artesanal folhado de fermentação natural da Bonin Bakery" data-padaria="Bonin Bakery • Centro" aria-label="Ampliar foto: Croissant da Bonin Bakery" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-bonin-bakery.webp" alt="Croissant artesanal folhado de fermentação natural da Bonin Bakery" class="roteiro-bakery-img" width="960" height="1280" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Croissant de fermentação natural servido aquecido</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Bonin Bakery — Centro</h3>
          <div class="roteiro-bakery-text">
            <p>O croissant da Bonin tem uma massa leve como uma nuvem. É feito com farinha francesa e fermentação natural e chega à mesa aquecido. Dá para pedir geleia da casa ou manteiga à parte e ir alternando as mordidas com um café.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Alameda Prudente de Moraes, 995, Centro.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.instagram.com/boninbakery/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">@boninbakery &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Alameda%20Prudente%20de%20Moraes%2C%20995%2C%20Centro%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 2. BRØD BAKERY -->
      <header class="roteiro-bairro-header">
        <h2>Brød Bakery</h2>
        <span class="roteiro-bairro-badge">Santo Inácio</span>
      </header>

      <article class="roteiro-bakery-item" id="brod-bakery">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant brod bakery.jpeg" data-alt="Croissant folhado tradicional com manteiga francesa da Brød Bakery" data-padaria="Brød Bakery • Santo Inácio" aria-label="Ampliar foto: Croissant da Brød Bakery" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-brod-bakery.webp" alt="Croissant folhado tradicional com manteiga francesa da Brød Bakery" class="roteiro-bakery-img" width="604" height="785" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Folhamento em sala climatizada com manteiga francesa</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Brød Bakery — Santo Inácio</h3>
          <div class="roteiro-bakery-text">
            <p>Na Brød, o cuidado com o croissant começa na sala climatizada, onde é feito o folhamento. A casa usa manteiga e fermento franceses e uma farinha desenvolvida para esse tipo de massa. O resultado aparece nas camadas bem definidas, na leveza do miolo e naquela crocância que se repete a cada mordida. A manteiga aparece na medida.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Rua Padre Ladislau Kula, 800, Santo Inácio.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Padre%20Ladislau%20Kula%2C%20800%2C%20Santo%20In%C3%A1cio%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 3. FELIPANE -->
      <header class="roteiro-bairro-header">
        <h2>Felipane</h2>
        <span class="roteiro-bairro-badge">Juvevê</span>
      </header>

      <article class="roteiro-bakery-item" id="felipane">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant felipane.jpeg" data-alt="Croissant simples artesanal folhado da Felipane no Juvevê" data-padaria="Felipane • Juvevê" aria-label="Ampliar foto: Croissant da Felipane" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-felipane.webp" alt="Croissant simples artesanal folhado da Felipane no Juvevê" class="roteiro-bakery-img" width="822" height="791" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Croissant simples de padaria artesanal de bairro</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Felipane — Juvevê</h3>
          <div class="roteiro-bakery-text">
            <p>A Felipane é daquelas padarias pequenas de bairro que dão vontade de voltar. O Felipe, chef padeiro da casa, faz pães incríveis e trabalha os folhados com o mesmo cuidado. Se for a sua primeira visita, comece pelo croissant simples. É um bom jeito de conhecer o trabalho dele antes de explorar o restante da vitrine.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Rua Cândido Mader, 81, Juvevê.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20C%C3%A2ndido%20Mader%2C%2081%2C%20Juvev%C3%AA%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 4. LUCCA CAFÉS ESPECIAIS -->
      <header class="roteiro-bairro-header">
        <h2>Lucca Cafés Especiais</h2>
        <span class="roteiro-bairro-badge">Batel</span>
      </header>

      <article class="roteiro-bakery-item" id="lucca-cafes-especiais">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant lucca.jpeg" data-alt="Croissant folhado dourado e amanteigado do Lucca Cafés Especiais no Batel" data-padaria="Lucca Cafés Especiais • Batel" aria-label="Ampliar foto: Croissant do Lucca Cafés Especiais" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-lucca.webp" alt="Croissant folhado dourado e amanteigado do Lucca Cafés Especiais no Batel" class="roteiro-bakery-img" width="768" height="1024" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Casquinha brilhante e massa amanteigada com café especial</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Lucca Cafés Especiais — Batel</h3>
          <div class="roteiro-bakery-text">
            <p>Casquinha brilhante, massa bem amanteigada e café especial na mesma mesa. O croissant do Lucca é uma boa pedida para quem quer fazer do folhado o centro do café da manhã. Se a ideia é pegar o croissant fresquinho, vale ir cedo e perguntar pela primeira fornada.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Alameda Presidente Taunay, 40, Batel.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.instagram.com/luccacafesespeciais/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">@luccacafesespeciais &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Alameda%20Presidente%20Taunay%2C%2040%2C%20Batel%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 5. MAÇÃ PADARIA ARTESANAL BRASILEIRA -->
      <header class="roteiro-bairro-header">
        <h2>Maçã Padaria Artesanal Brasileira</h2>
        <span class="roteiro-bairro-badge">Alto da XV • Vila Izabel • Praça do Japão</span>
      </header>

      <article class="roteiro-bakery-item" id="maca-padaria-artesanal">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant maca padaria.jpeg" data-alt="Croissant clássico folhado da Maçã Padaria Artesanal Brasileira" data-padaria="Maçã Padaria Artesanal • Curitiba" aria-label="Ampliar foto: Croissant da Maçã Padaria Artesanal" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-maca-padaria.webp" alt="Croissant clássico folhado da Maçã Padaria Artesanal Brasileira" class="roteiro-bakery-img" width="782" height="801" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Croissant clássico bem executado</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Maçã Padaria Artesanal Brasileira — Alto da XV, Vila Izabel e Praça do Japão</h3>
          <div class="roteiro-bakery-text">
            <p>A Maçã gosta de brincar com os formatos do croissant, e o clássico é o que eu indicaria para começar. É um dos endereços que sempre lembro quando alguém me pergunta onde encontrar um croissant bem executado em Curitiba. Para nossa sorte, dá para encaixar a parada em três regiões da cidade.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong>
            <ul class="roteiro-address-list">
              <li>Rua Fernando Amaro, 802B, Alto da XV.</li>
              <li>Rua Professor Sebastião Paraná, 195, Vila Izabel.</li>
              <li>Avenida Sete de Setembro, 4979, Praça do Japão.</li>
            </ul>
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Fernando%20Amaro%2C%20802B%2C%20Alto%20da%20XV%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar (Alto da XV) &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Professor%20Sebasti%C3%A3o%20Paran%C3%A1%2C%20195%2C%20Vila%20Izabel%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar (Vila Izabel) &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Avenida%20Sete%20de%20Setembro%2C%204979%2C%20Batel%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar (Praça do Japão) &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 6. NONI PADARIA -->
      <header class="roteiro-bairro-header">
        <h2>Noni Padaria</h2>
        <span class="roteiro-bairro-badge">Ahú</span>
      </header>

      <article class="roteiro-bakery-item" id="noni-padaria">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant noni.jpeg" data-alt="Croissant artesanal leve e folhado em camadas da Noni Padaria no Ahú" data-padaria="Noni Padaria • Ahú" aria-label="Ampliar foto: Croissant da Noni Padaria" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-noni.webp" alt="Croissant artesanal leve e folhado em camadas da Noni Padaria no Ahú" class="roteiro-bakery-img" width="768" height="1024" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">O famoso "croi", folhado com estrutura e leveza</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Noni Padaria — Ahú</h3>
          <div class="roteiro-bakery-text">
            <p>Na Noni, o croissant ganhou até apelido, croi. É um dos carros-chefes da padaria e chama atenção pela leveza. O folhado tem estrutura, se abre em camadas e é daqueles que eu gosto de comer puro até a última mordida.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Rua Mateus Leme, 2690, loja 2, Ahú.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.instagram.com/nonipadaria/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">@nonipadaria &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Mateus%20Leme%2C%202690%2C%20loja%202%2C%20Ah%C3%BA%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 7. ORIGEM PADARIA -->
      <header class="roteiro-bairro-header">
        <h2>Origem Padaria</h2>
        <span class="roteiro-bairro-badge">Centro</span>
      </header>

      <article class="roteiro-bakery-item" id="origem-padaria">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant Origem padaria.jpeg" data-alt="Croissant tradicional francês com farinha francesa e manteiga da Origem Padaria" data-padaria="Origem Padaria • Centro" aria-label="Ampliar foto: Croissant da Origem Padaria" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-origem-padaria.webp" alt="Croissant tradicional francês com farinha francesa e manteiga da Origem Padaria" class="roteiro-bakery-img" width="624" height="803" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Massa que desmancha na boca com sabor de manteiga</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Origem Padaria — Centro</h3>
          <div class="roteiro-bakery-text">
            <p>O croissant tradicional da Origem é feito com farinha francesa e manteiga. É daqueles que desmancham na boca e deixam o sabor da manteiga depois da mordida. Se você estiver pelo Centro, vale a pausa para pedir o croissant puro com um café.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Avenida Vicente Machado, 456, Centro.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.instagram.com/origempadaria/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">@origempadaria &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Avenida%20Vicente%20Machado%2C%20456%2C%20Centro%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 8. PÃO PROSA -->
      <header class="roteiro-bairro-header">
        <h2>Pão Prosa</h2>
        <span class="roteiro-bairro-badge">Cristo Rei</span>
      </header>

      <article class="roteiro-bakery-item" id="pao-prosa">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant Pao Prosa.jpeg" data-alt="Croissant artesanal aberto à mão com camadas delicadas da Pão Prosa" data-padaria="Pão Prosa • Cristo Rei" aria-label="Ampliar foto: Croissant da Pão Prosa" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-pao-prosa.webp" alt="Croissant artesanal aberto à mão com camadas delicadas da Pão Prosa" class="roteiro-bakery-img" width="581" height="763" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Massa aberta artesanalmente com rolo e cilindro</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Pão Prosa — Cristo Rei</h3>
          <div class="roteiro-bakery-text">
            <p>Na Pão Prosa, o que me chama atenção é o jeito de fazer. São três padeiros que preparam o croissant artesanalmente, abrindo a massa com rolo e cilindro, sem usar laminadora. Vale pedir a versão sem recheio e abrir o croissant ao meio ali mesmo, à mesa, para reparar no trabalho das camadas.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Rua Coronel Pedro Scherer Sobrinho, 233, Cristo Rei.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.instagram.com/pao_prosa/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">@pao_prosa &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Coronel%20Pedro%20Scherer%20Sobrinho%2C%20233%2C%20Cristo%20Rei%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 9. PRESTINARIA -->
      <header class="roteiro-bairro-header">
        <h2>Prestinaria</h2>
        <span class="roteiro-bairro-badge">6 Unidades em Curitiba</span>
      </header>

      <article class="roteiro-bakery-item" id="prestinaria">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant prestinaria.jpeg" data-alt="Croissant tradicional folhado em camadas da Prestinaria" data-padaria="Prestinaria • Curitiba" aria-label="Ampliar foto: Croissant da Prestinaria" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-prestinaria.webp" alt="Croissant tradicional folhado em camadas da Prestinaria" class="roteiro-bakery-img" width="653" height="802" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Croissant tradicional da casa</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Prestinaria — seis unidades em Curitiba</h3>
          <div class="roteiro-bakery-text">
            <p>O croissant de amêndoas é um dos mais conhecidos da Prestinaria. Para este roteiro, o pedido é o croissant tradicional, que já fazia parte da seleção de folhados da Petit Juvevê. Como o balcão varia de uma loja para outra, vale confirmar a disponibilidade na unidade que você pretende visitar.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde encontrar:</strong>
            <ul class="roteiro-address-list">
              <li><strong>Bigorrilho:</strong> Rua Euclides da Cunha, 699.</li>
              <li><strong>São Lourenço:</strong> Rua Mateus Leme, 3440.</li>
              <li><strong>Mercado Municipal:</strong> Avenida Sete de Setembro, 1895.</li>
              <li><strong>MON:</strong> Rua Marechal Hermes, 999.</li>
              <li><strong>Petit Juvevê:</strong> Rua Moyses Marcondes, 430, loja 1.</li>
              <li><strong>Paseo República:</strong> Avenida República Argentina, 2557.</li>
            </ul>
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.instagram.com/prestinaria/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">@prestinaria &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Euclides%20da%20Cunha%2C%20699%2C%20Bigorrilho%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar (Bigorrilho) &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Mateus%20Leme%2C%203440%2C%20S%C3%A3o%20Louren%C3%A7o%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar (São Lourenço) &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- 10. SPHAIR GOURMANDE ATELIÊ DE PÃES -->
      <header class="roteiro-bairro-header">
        <h2>Sphair Gourmande Ateliê de Pães</h2>
        <span class="roteiro-bairro-badge">Ahú</span>
      </header>

      <article class="roteiro-bakery-item" id="sphair-gourmande">
        <figure class="roteiro-bakery-figure" style="position: relative;">
          <button type="button" class="demo-photo-btn roteiro-photo-zoom-btn" data-full-src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant sphair.jpeg" data-alt="Croissant artesanal receita Le Cordon Bleu do Sphair Gourmande Ateliê de Pães" data-padaria="Sphair Gourmande • Ahú" aria-label="Ampliar foto: Croissant do Sphair Gourmande" style="background: none; border: none; padding: 0; width: 100%; display: block; cursor: zoom-in; text-align: left; position: relative;">
            <img src="/assets/photos/roteiros/onde-comer-croissant-em-curitiba/croissant-sphair.webp" alt="Croissant artesanal receita Le Cordon Bleu do Sphair Gourmande Ateliê de Pães" class="roteiro-bakery-img" width="768" height="1024" loading="lazy">
            <span class="demo-photo-zoom-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Ampliar</span>
            </span>
          </button>
          <figcaption class="roteiro-bakery-caption">
            <span class="roteiro-photo-credit">Curadoria CuritiPão</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">Receita Le Cordon Bleu de Paris com farinha francesa</span>
          </figcaption>
        </figure>
        <div class="roteiro-bakery-content">
          <h3 class="roteiro-bakery-title">Sphair Gourmande Ateliê de Pães — Ahú</h3>
          <div class="roteiro-bakery-text">
            <p>O croissant do Sphair tem aquele gostinho de França que eu procuro num folhado. É feito com farinha francesa e segue uma receita da Le Cordon Bleu de Paris. Na época em que provei para o Curitidoce, a produção era limitada às sextas e aos sábados. Se for especialmente pelo croissant, vale perguntar ao ateliê em que dia sai a próxima fornada.</p>
          </div>
          <div class="roteiro-address-box">
            <strong>Onde:</strong> Rua Tomazina, 345, Ahú.
          </div>
          <div class="roteiro-bakery-actions">
            <a href="#conteudo-principal" style="font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none;">&uarr; Voltar ao índice</a>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://www.instagram.com/ateliedepaes/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.8rem;">@ateliedepaes &rarr;</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Tomazina%2C%20345%2C%20Ah%C3%BA%2C%20Curitiba%20-%20PR" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.8rem;">Como chegar &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- ENCERRAMENTO E LINK INTERNO -->
      <section class="roteiro-how-to-use" style="margin-top: 50px;">
        <h2>Seu croissant favorito em Curitiba</h2>
        <p>Já tem um croissant sem recheio favorito em Curitiba? Quero saber onde você comeu e o que te faria voltar para pedir outro. E, se quiser aproveitar a saída para levar pão para casa, veja também o <a href="/roteiros/padarias-em-curitiba-por-bairro/">roteiro de padarias em Curitiba, bairro por bairro</a>.</p>
        <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="/roteiros/padarias-em-curitiba-por-bairro/" class="btn btn-primary">Ver Roteiro de 15 Padarias por Bairro &rarr;</a>
          <a href="/contato/#indicar" class="btn btn-secondary">Indicar um novo croissant &rarr;</a>
        </div>
      </section>

      <!-- Rodapé do Artigo / Navegação de Roteiros -->
      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <a href="/roteiros/" class="btn btn-secondary">&larr; Ver todos os Roteiros</a>
        <a href="#conteudo-principal" class="btn btn-secondary">&uarr; Voltar ao Topo da Matéria</a>
      </div>
    </div>
  </section>

  <!-- 4. VISOR / LIGHTBOX PARA AMPLIAR AS FOTOS DOS DESTAQUES -->
  <div id="demo-lightbox" class="demo-lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Visor de foto ampliada" style="display: none;">
    <div class="demo-lightbox-backdrop" tabindex="-1"></div>
    <div class="demo-lightbox-container" role="document">
      <div class="demo-lightbox-header">
        <div class="demo-lightbox-info">
          <span id="demo-lightbox-title" class="demo-lightbox-title">Foto ampliada</span>
          <span id="demo-lightbox-subtitle" class="demo-lightbox-subtitle">Croissants em Curitiba</span>
        </div>
        <button type="button" id="demo-lightbox-close" class="demo-lightbox-close" aria-label="Fechar visor (Esc)" title="Fechar visor (Esc)">
          <span class="demo-lightbox-close-label">Fechar</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="demo-lightbox-body">
        <div id="demo-lightbox-loader" class="demo-lightbox-loader" aria-label="Carregando imagem em alta resolução...">
          <div class="demo-lightbox-spinner"></div>
          <span style="font-size: 0.85rem; color: var(--color-text-muted);">Carregando foto...</span>
        </div>
        <div class="demo-lightbox-image-wrap">
          <img id="demo-lightbox-img" class="demo-lightbox-img" src="" alt="" style="display: none;">
        </div>
      </div>
    </div>
  </div>
  `;
}

module.exports = { getCroissantArticleContent };
