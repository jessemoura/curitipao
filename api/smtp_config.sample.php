<?php
/**
 * CURITIPÃO — CONFIGURAÇÃO PRIVADA DE TRANSPORTE SMTP
 * 
 * INSTRUÇÕES DE SEGURANÇA:
 * 1. Renomeie ou copie este arquivo para smtp_config.php no servidor Hostinger (em public_html/api/).
 * 2. Preencha a senha da caixa contato@curitipao.com.br criada no painel Hostinger > E-mails.
 * 3. O arquivo smtp_config.php está explicitamente no .gitignore e NUNCA será enviado ao GitHub.
 */

return [
    'active'    => false, // Altere para true após preencher a senha no servidor
    'host'      => 'smtp.hostinger.com',
    'port'      => 465, // SSL (ou 587 para TLS)
    'username'  => 'contato@curitipao.com.br',
    'password'  => '', // Preencher diretamente no servidor
    'from_email'=> 'contato@curitipao.com.br',
    'from_name' => 'CuritiPão Webmaster'
];
