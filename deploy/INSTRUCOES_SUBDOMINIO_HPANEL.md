# INSTRUÇÕES DE IMPLANTAÇÃO: SUBDOMÍNIO ANTIGO (`curitipao.conexus.press`)

Este documento orienta a aplicação das regras de redirecionamento HTTP 301 permanente para o subdomínio histórico `curitipao.conexus.press`, preservando acessos, backlinks da imprensa e tráfego de eventuais materiais impressos.

---

## 1. ONDE APLICAR (REGRA CRÍTICA DE ESCOPO)
> [!WARNING]
> **NUNCA substitua o `.htaccess` principal de `conexus.press`.**  
> As regras antigas devem atuar **EXCLUSIVAMENTE** na pasta raiz do subdomínio `curitipao.conexus.press`.  
> Substituir o arquivo da raiz de `conexus.press` tiraria do ar o site institucional da CONEXUS Digital Solutions.

### Localização no hPanel da Hostinger:
1. Acesse o **hPanel da Hostinger** &rarr; Conta onde está hospedado o domínio **`conexus.press`**.
2. Vá em **Websites** &rarr; Selecione `conexus.press` (ou o subdomínio `curitipao.conexus.press`, caso configurado como site à parte).
3. Abra o **Gerenciador de Arquivos** (File Manager).
4. Localize a pasta do subdomínio:
   - Geralmente: **`public_html/curitipao/`** ou **`domains/curitipao.conexus.press/public_html/`**.
   - Confirme na aba **Subdomínios** do hPanel qual é a pasta apontada para `curitipao.conexus.press`.

---

## 2. ARQUIVOS A ENVIAR PARA A PASTA DO SUBDOMÍNIO
Copie os arquivos preparados em `deploy/servidor_antigo_subdominio_conexus/` diretamente para a pasta do subdomínio:
1. **`.htaccess`** (Obrigatório em servidores Apache/LiteSpeed):
   - Mapeamento explícito de `/` e `/index.html` para `https://curitipao.com.br/festival/2026/` com preservação de query strings (`QSA`) e âncoras.
   - Mapeamento de `/politica-de-privacidade.html` para `https://curitipao.com.br/privacidade/`.
   - Mapeamento de `/sitemap.xml` e `/robots.txt`.
   - Mapeamento de arquivos estáticos `/style.css`, `/main.js`, favicons e `/assets/(.*)`.
   - **Sem redirecionamento indiscriminado:** Rotas desconhecidas retornam **HTTP 404** explícito.
2. **`index.php`** (Fallback obrigatório para ambientes PHP onde mod_rewrite não atue).
3. **`robots.txt`** (Permite o rastreamento do Googlebot para absorção do 301).

---

## 3. SITUAÇÃO REAL DO QR CODE ANTIGO E SEGURANÇA
- **Diagnóstico do QR Code:** O QR Code físico original distribuído nos materiais impressos (displays de mesa, panfletos, totens) **ainda não foi localizado nem decodificado**.
- **Esclarecimento:** A URL textual `curitipao.conexus.press` exibida na reportagem de TV e em peças gráficas identifica o subdomínio do festival, mas não comprova o conteúdo exato gravado na matriz óptica do QR Code (que pode conter parâmetros UTM de campanha ou âncoras de seção).
- **Diretriz Adotada:**
  - **NÃO** foi criado nenhum QR Code substituto fictício para substituir o material já impresso e distribuído.
  - A infraestrutura de redirecionamento está configurada para acolher qualquer requisição ao subdomínio antigo, repassando os parâmetros (`QSA`) e preservando âncoras para o acervo 2026.
  - Assim que a matriz original ou uma foto de alta resolução legível do material físico for fornecida, a ferramenta `scripts/scan_curitipao_qr.py` efetuará a decodificação imediata.

---

## 4. PRESERVAÇÃO DE DNS E CERTIFICADO HTTPS
1. **Registro DNS Tipo A:** O subdomínio `curitipao.conexus.press` deve permanecer ativo apontando para o IP do servidor web da Hostinger.
2. **Certificado SSL (HTTPS):** O certificado Let's Encrypt / Hostinger SSL do subdomínio deve permanecer ativo e com renovação automática ligada.  
   *Se o HTTPS do subdomínio for removido, qualquer leitura de QR Code em smartphones exibirá tela vermelha de alerta de segurança antes de permitir o redirecionamento.*

---

## 5. ROTEIRO DE VERIFICAÇÃO PÓS-IMPLANTAÇÃO
Execute as verificações abaixo no navegador ou terminal:
1. `curl -I https://curitipao.conexus.press/`  
   &rarr; Deve retornar `HTTP/1.1 301 Moved Permanently` | `Location: https://curitipao.com.br/festival/2026/`.
2. `curl -I https://curitipao.conexus.press/?utm_source=qrcode&utm_campaign=festival`  
   &rarr; Deve retornar `HTTP/1.1 301 Moved Permanently` | `Location: https://curitipao.com.br/festival/2026/?utm_source=qrcode&utm_campaign=festival`.
3. `curl -I https://curitipao.conexus.press/politica-de-privacidade.html`  
   &rarr; Deve retornar `HTTP/1.1 301 Moved Permanently` | `Location: https://curitipao.com.br/privacidade/`.
4. `curl -I https://curitipao.conexus.press/assets/photos/curitipao-111.jpg`  
   &rarr; Deve retornar `HTTP/1.1 301 Moved Permanently` | `Location: https://curitipao.com.br/assets/photos/curitipao-111.jpg`.
5. `curl -I https://curitipao.conexus.press/rota-desconhecida`  
   &rarr; Deve retornar `HTTP/1.1 404 Not Found` (comprovando que não há redirecionamento cego para a home).
