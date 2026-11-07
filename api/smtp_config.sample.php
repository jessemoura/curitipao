<?php
/**
 * CURITIPÃO — CONFIGURAÇÃO PRIVADA DE TRANSPORTE SMTP
 * 
 * GUIA DE ATIVAÇÃO NO HPANEL DA HOSTINGER:
 * 1. Acesse o painel da Hostinger (hPanel) > Gerenciador de Arquivos (File Manager).
 * 2. Navegue até o diretório: public_html/api/
 * 3. Crie um novo arquivo chamado exatamente: smtp_config.php
 *    (ou copie este smtp_config.sample.php renomeando-o para smtp_config.php).
 * 4. Preencha o arquivo com o código abaixo, inserindo a senha da caixa contato@curitipao.com.br
 *    no campo 'password' e alterando 'active' para true:
 * 
 *    <?php
 *    return [
 *        'active'     => true,
 *        'host'       => 'smtp.hostinger.com',
 *        'port'       => 465, // SSL (recomendado) ou 587 (TLS)
 *        'username'   => 'contato@curitipao.com.br',
 *        'password'   => 'SENHA_DA_SUA_CAIXA_POSTAL',
 *        'from_email' => 'contato@curitipao.com.br',
 *        'from_name'  => 'CuritiPão'
 *    ];
 * 
 * SEGURANÇA E PRESERVAÇÃO:
 * - O arquivo smtp_config.php NUNCA deve ser commitado no Git.
 * - O arquivo está protegido no .htaccess (retorna 403 Forbidden para visitantes).
 * - O arquivo está no .gitignore para nunca ser sobrescrito por deploys automáticos.
 */

return [
    'active'     => false, // Mantenha false até inserir a senha diretamente no servidor
    'host'       => 'smtp.hostinger.com',
    'port'       => 465, // 465 para SSL nativo ou 587 para TLS/STARTTLS
    'username'   => 'contato@curitipao.com.br',
    'password'   => '', // Deixe vazio aqui; insira exclusivamente no arquivo do servidor
    'from_email' => 'contato@curitipao.com.br',
    'from_name'  => 'CuritiPão'
];
