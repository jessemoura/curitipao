# INSTRUÇÕES DE PUBLICAÇÃO: NOVO PORTAL CURITIPÃO (`curitipao.com.br`)

Este guia detalha o passo a passo exato para publicação do novo portal CuritiPão na Hostinger, garantindo a integridade dos arquivos, regras de servidor (.htaccess), certificados SSL e segurança dos registros de e-mail.

---

## 1. ORDEM OBRIGATÓRIA DE IMPLANTAÇÃO
> [!IMPORTANT]
> **Publique e valide o novo portal ANTES de ativar os redirecionamentos no subdomínio antigo.**  
> Isso evita que visitantes e o Googlebot encontrem páginas em branco ou erros 404 durante a transição.

---

## 2. SELEÇÃO DO DOMÍNIO NO HPANEL
1. Acesse o **hPanel da Hostinger** (https://hpanel.hostinger.com/).
2. Na barra lateral ou superior, acesse a aba **Websites** (ou **Sites**).
3. Localize o domínio **`curitipao.com.br`**:
   - **Se o domínio constar como "Parked" ou em página de estacionamento:** Clique em **Adicionar site** ou **Criar site**, selecione a hospedagem ativa e vincule `curitipao.com.br` como site independente ou domínio adicional.
   - **Se já constar na lista de sites:** Clique no botão **Gerenciar** correspondente a `curitipao.com.br`.

---

## 3. PASTA DE DESTINO E ENVIO DOS ARQUIVOS
1. No painel de gerenciamento de `curitipao.com.br`, clique em **Gerenciador de Arquivos** (File Manager &rarr; Acessar arquivos de `curitipao.com.br`).
2. Abra a pasta raiz pública:
   - **Caminho exato:** **`public_html/`**
3. **Limpeza inicial:**
   - Se houver um arquivo padrão da Hostinger chamado `default.php` ou `index.php` de estacionamento, **exclua-o**.
4. **Arquivos a Enviar (Pacote Final compilado da pasta `dist/` do projeto):**
   Envie todo o conteúdo gerado dentro da pasta local `dist/`, preservando a árvore de diretórios:
   - `index.html` (Página inicial do portal)
   - `.htaccess` (Configurações Apache/LiteSpeed com HTTPS, canônico, MIME types, cache e 404)
   - `404.html` (Página de erro 404 customizada)
   - `robots.txt` e `sitemap.xml`
   - `favicon.ico`, `favicon.png`, `apple-touch-icon.png`
   - Pasta `assets/` (com todas as subpastas `css/`, `js/`, `photos/`, `logos/`, `press/`, `data/`)
   - Pastas das páginas: `sobre/`, `padarias/`, `roteiros/`, `blog/`, `festival/`, `contato/`, `solucoes-digitais/`, `privacidade/`
   - Subpasta histórica: **`festival/2026/`** contendo:
     - `index.html` (Acervo integral com 15 padarias, galeria, 42 âncoras/IDs e seção CuritiPão na imprensa)
     - `style.css` (Folha de estilo histórica do festival)
     - `main.js` (Script histórico e player de vídeo)

> [!CAUTION]
> Certifique-se de que o arquivo oculto **`.htaccess`** foi enviado para a raiz de `public_html/`. No File Manager da Hostinger, ative a opção "Mostrar arquivos ocultos" se necessário.

---

## 4. PRESERVAÇÃO CRÍTICA DE REGISTROS DE E-MAIL
Ao configurar o domínio `curitipao.com.br` no painel DNS da Hostinger:
- **PRESERVE RIGOROSAMENTE** todos os registros de e-mail existentes:
  - Registros **MX** (servidores de correio eletrônico de `contato@curitipao.com.br`)
  - Registro **TXT (SPF)**: `v=spf1 ...`
  - Registros **CNAME/TXT (DKIM)**
  - Registro **TXT (DMARC)**: `_dmarc.curitipao.com.br`
- **NÃO** altere registros MX durante a publicação dos arquivos web.

---

## 5. ATIVAÇÃO DO CERTIFICADO SSL (HTTPS)
1. No menu do site `curitipao.com.br` no hPanel, vá em **Segurança &rarr; SSL**.
2. Verifique se o **SSL Let's Encrypt** está ativo com status "Ativo" / "Instalado".
3. Habilite a chave **Forçar HTTPS** (redirecionamento automático de HTTP para HTTPS).

---

## 6. VERIFICAÇÕES PÓS-PUBLICAÇÃO
Após o envio, teste no navegador os seguintes acessos imediatos:
1. `https://curitipao.com.br/` &rarr; Deve abrir a Home do novo portal institucional.
2. `https://curitipao.com.br/festival/2026/` &rarr; Deve abrir a página histórica da edição 2026 completa.
3. `https://curitipao.com.br/festival/2026/#imprensa` &rarr; Deve rolar suavemente até a seção de imprensa.
4. `https://curitipao.com.br/festival/2026/#padarias` &rarr; Deve rolar até a grade das 15 padarias.
5. `https://curitipao.com.br/festival/2026/#felipane` e `#marcolini` &rarr; Devem ancorar no card correto.
6. `https://curitipao.com.br/solucoes-digitais/` &rarr; Deve exibir o card CONEXUS com e-mail comercial, link para o Instagram oficial `@conexus.press` com ícone colorido e link para o site oficial.
7. `https://curitipao.com.br/sitemap.xml` &rarr; Deve retornar o XML válido com as 11 páginas oficiais.
8. `https://curitipao.com.br/pagina-inexistente` &rarr; Deve exibir a página 404 personalizada sem quebras.
