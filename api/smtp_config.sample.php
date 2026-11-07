<?php
/**
 * CURITIPÃO — CONFIGURAÇÃO PRIVADA DE TRANSPORTE SMTP
 * 
 * GUIA DE ATIVAÇÃO NO HPANEL DA HOSTINGER:
 * 
 * LOCALIZAÇÃO RECOMENDADA (À PROVA DE QUALQUER DEPLOY/RESTAURAÇÃO DO GIT):
 * 1. Acesse o painel da Hostinger (hPanel) > Gerenciador de Arquivos (File Manager).
 * 2. Navegue até a pasta pai da public_html:
 *    domains/curitipao.com.br/
 * 3. Crie ali um novo arquivo chamado: smtp_config.php
 *    (Por estar fora da public_html, este arquivo NUNCA é tocado por deploys do Git
 *     e é fisicamente inacessível a qualquer visitante pela web).
 * 
 * LOCALIZAÇÃO ALTERNATIVA (DENTRO DA API):
 *    public_html/api/smtp_config.php
 *    (Protegido no .htaccess e listado no .gitignore).
 * 
 * CONTEÚDO DO ARQUIVO:
 * Preencha com o código abaixo, inserindo a senha da caixa contato@curitipao.com.br
 * no campo 'password' e alterando 'active' para true:
 * 
 * <?php
 * return [
 *     'active'     => true,
 *     'host'       => 'smtp.hostinger.com',
 *     'port'       => 465, // SSL (recomendado) ou 587 (TLS/STARTTLS)
 *     'username'   => 'contato@curitipao.com.br',
 *     'password'   => 'SENHA_DA_SUA_CAIXA_POSTAL',
 *     'from_email' => 'contato@curitipao.com.br',
 *     'from_name'  => 'CuritiPão'
 * ];
 * 
 * SEGURANÇA E PRESERVAÇÃO:
 * - A credencial NUNCA deve ser commitada no Git, compartilhada em prompts ou salva em logs.
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
