# CURITIPÃO — PLANEJAMENTO DE MIGRAÇÃO E REDIRECIONAMENTOS

> **Status:** Documento técnico preparatório. Nenhuma alteração foi realizada em servidores de produção, DNS ou domínios publicados nesta etapa.

---

## 1. OBJETIVO DA MIGRAÇÃO
Garantir que todos os acessos históricos, QR Codes impressos, links em redes sociais e matérias de imprensa que apontavam para o domínio temporário do festival (`curitipao.conexus.press`) sejam preservados sem perda de tráfego, encaminhando diretamente para o arquivo oficial:
**`https://curitipao.com.br/festival/2026/`**

---

## 2. MAPEAMENTO DE ROTAS (301 PERMANENT REDIRECT)

| URL de Origem (`curitipao.conexus.press`) | URL de Destino no Novo Portal | Observações |
|---|---|---|
| `https://curitipao.conexus.press/` | `https://curitipao.com.br/festival/2026/` | Preserva acesso da home antiga para o arquivo integral 2026 |
| `https://curitipao.conexus.press/#encerramento` | `https://curitipao.com.br/festival/2026/#encerramento` | Preserva âncora do aviso de encerramento |
| `https://curitipao.conexus.press/#padarias` | `https://curitipao.com.br/festival/2026/#padarias` | Preserva link para a seção de padarias do festival |
| `https://curitipao.conexus.press/politica-de-privacidade.html` | `https://curitipao.com.br/privacidade/` | Redireciona para a nova política unificada |
| `https://curitipao.conexus.press/assets/*` | `https://curitipao.com.br/assets/*` | Mantém acesso direto a arquivos de mídia antigos |

---

## 3. CONFIGURAÇÕES TÉCNICAS RECOMENDADAS PARA A HOSPEDAGEM (APACHE / NGINX)

### Apache (`.htaccess` na raiz de `curitipao.conexus.press`):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTP_HOST} ^curitipao\.conexus\.press$ [NC]
    RewriteRule ^$ https://curitipao.com.br/festival/2026/ [R=301,L]
    RewriteRule ^politica-de-privacidade\.html$ https://curitipao.com.br/privacidade/ [R=301,L]
    RewriteRule ^(.*)$ https://curitipao.com.br/festival/2026/$1 [R=301,L]
</IfModule>
```

### Nginx (Bloco de servidor para `curitipao.conexus.press`):
```nginx
server {
    server_name curitipao.conexus.press;
    return 301 https://curitipao.com.br/festival/2026$request_uri;
}
```
