<?php
/**
 * CURITIPÃO — Fallback de Redirecionamento 301 Permanente (Subdomínio Antigo)
 * Aplica-se ao subdomínio curitipao.conexus.press caso mod_rewrite não esteja ativo.
 * Mapeamento explícito de rotas históricas. Rotas desconhecidas retornam HTTP 404.
 */

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH);
$query = $_SERVER['QUERY_STRING'] ?? '';

// Mapeamento estrito de rotas conhecidas
if ($path === '/' || $path === '/index.html') {
    $target = 'https://curitipao.com.br/festival/2026/';
} elseif ($path === '/politica-de-privacidade.html') {
    $target = 'https://curitipao.com.br/privacidade/';
} elseif ($path === '/sitemap.xml') {
    $target = 'https://curitipao.com.br/sitemap.xml';
} elseif ($path === '/robots.txt') {
    $target = 'https://curitipao.com.br/robots.txt';
} elseif ($path === '/style.css') {
    $target = 'https://curitipao.com.br/festival/2026/style.css';
} elseif ($path === '/main.js') {
    $target = 'https://curitipao.com.br/festival/2026/main.js';
} elseif ($path === '/favicon.ico' || $path === '/favicon.png' || $path === '/apple-touch-icon.png') {
    $target = 'https://curitipao.com.br' . $path;
} elseif (strpos($path, '/assets/') === 0) {
    $target = 'https://curitipao.com.br' . $path;
} else {
    // Rota desconhecida: Não redirecionar indiscriminadamente. Retornar 404.
    header('HTTP/1.1 404 Not Found');
    echo '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>O recurso solicitado não existe em curitipao.conexus.press.</p></body></html>';
    exit();
}

if (!empty($query)) {
    $target .= (strpos($target, '?') === false ? '?' : '&') . $query;
}

header('HTTP/1.1 301 Moved Permanently');
header('Location: ' . $target);
header('Cache-Control: public, max-age=31536000');
exit();
