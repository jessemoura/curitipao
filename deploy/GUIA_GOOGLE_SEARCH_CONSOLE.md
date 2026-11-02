# GUIA ESTRATÉGICO: GOOGLE SEARCH CONSOLE NA MIGRAÇÃO CURITIPÃO

Orientações para consolidação de indexação, transferência de relevância de SEO e monitoramento da migração entre `curitipao.conexus.press` e `curitipao.com.br`.

---

## 1. MECANISMO REAL DE TRANSFERÊNCIA DE SINAIS (SEO)
Ao contrário do que frequentemente se presume, a migração técnica de autoridade no Google **não depende obrigatoriamente da ferramenta "Mudança de endereço"** do Search Console.

Os fatores primordiais que o Googlebot utiliza para transferir ranqueamento e histórico são:
1. **Redirecionamentos HTTP 301 permanentes** implementados no servidor (ao nível de URL);
2. **Tags Canônicas (`rel="canonical"`)** apontando explicitamente para os destinos definitivos no novo domínio;
3. **Submissão do `sitemap.xml` atualizado** na nova propriedade;
4. **Atualização de links internos e backlinks externos**.

---

## 2. ANÁLISE DE ELEGIBILIDADE DA FERRAMENTA "MUDANÇA DE ENDEREÇO"
A ferramenta *Change of Address* do Google Search Console possui critérios estritos de funcionamento:
- **Finalidade:** Projetada para migrações 1-para-1 de domínios inteiros (exemplo: `siteantigo.com` &rarr; `sitenovo.com`).
- **Limitação no Cenário CuritiPão:** Como o subdomínio antigo `curitipao.conexus.press` redireciona sua página inicial para um subdiretório do novo domínio (`https://curitipao.com.br/festival/2026/`) — preservando a raiz `curitipao.com.br/` para o novo portal permanente —, o assistente do Search Console pode classificar a movimentação como parcial ou não elegível para a ferramenta automática.
- **Diretriz Prática:**
  - Tente acionar a ferramenta no painel (Configurações &rarr; Mudança de endereço), caso ambas as propriedades estejam verificadas.
  - Se o Search Console aceitar, ótimo (acelera o aviso prévio ao índice).
  - Se o console recusar devido ao destino ser um subdiretório, **fique tranquilo**: o Googlebot processará normalmente a migração por meio dos cabeçalhos 301 retornados pelo servidor em cada rastreamento.

---

## 3. PASSO A PASSO RECOMENDADO NO SEARCH CONSOLE

### Etapa 1: Cadastrar e Verificar as Propriedades
1. Acesse o **Google Search Console** (https://search.google.com/search-console).
2. **Propriedade do Novo Portal:**
   - Adicione `curitipao.com.br` como **Propriedade do Domínio** (verificação via registro DNS TXT na Hostinger) ou como **Prefixo do URL** (`https://curitipao.com.br/`).
3. **Propriedade do Subdomínio Antigo:**
   - Verifique `https://curitipao.conexus.press/` (ou garanta acesso via domínio pai `conexus.press`).

### Etapa 2: Submeter o Novo Sitemap
1. Selecione a propriedade **`https://curitipao.com.br/`**.
2. No menu lateral esquerdo, clique em **Sitemaps**.
3. No campo "Adicionar novo sitemap", digite:
   **`sitemap.xml`** (URL completa: `https://curitipao.com.br/sitemap.xml`).
4. Clique em **Enviar**.
5. O console iniciará a leitura das 11 URLs públicas oficiais.

### Etapa 3: Solicitar Indexação Prioritária das Páginas-Chave
Na barra de inspeção de URL do Search Console (topo da tela), insira e clique em **Solicitar indexação** para:
- `https://curitipao.com.br/` (Home permanente)
- `https://curitipao.com.br/festival/2026/` (Acervo do Festival)
- `https://curitipao.com.br/padarias/` (Catálogo de padarias)

### Etapa 4: Monitorar o Relatório de Cobertura / Páginas
1. Verifique se o Googlebot passa a registrar as URLs antigas com status *"Página com redirecionamento"* (comportamento correto).
2. Verifique se as novas URLs passam para o status *"Indexadas"*.
3. As páginas modelo/rascunho (`/padarias/modelo/` e `/roteiros/modelo/`) possuem `<meta name="robots" content="noindex, follow">` e devem ser excluídas da indexação, conforme planejado.
