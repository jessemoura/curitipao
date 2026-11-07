<?php
/**
 * CURITIPÃO — BACKEND DE FORMULÁRIOS
 * Formulários: A) Indicação de Padaria | B) Cadastro / Atualização de Estabelecimento
 * Destinatário Oficial: contato@curitipao.com.br
 *
 * POLÍTICA DE SEGURANÇA E PRIVACIDADE:
 * - Todos os envios são recebidos como PENDENTES DE REVISÃO EDITORIAL.
 * - Nenhuma ficha pública é criada ou alterada automaticamente.
 * - Dados pessoais dos responsáveis são para uso estritamente interno da curadoria.
 * - Autorizações de exibição pública de telefone e WhatsApp são registradas separadamente.
 * - Senhas e credenciais SMTP NUNCA devem ser salvas no Git ou exibidas publicamente.
 */

header('Content-Type: application/json; charset=utf-8');

define('OFFICIAL_RECIPIENT', 'contato@curitipao.com.br');

// 1. Carregar configuração privada de SMTP se existir no servidor (smtp_config.php)
$smtpConfigFile = __DIR__ . '/smtp_config.php';
$smtpConfig = null;
if (file_exists($smtpConfigFile)) {
    $smtpConfig = include $smtpConfigFile;
}

$isSmtpActive = (is_array($smtpConfig) && !empty($smtpConfig['active']) && !empty($smtpConfig['password']));

// Função de envio SMTP direto via socket SSL (TLS/SSL nativo do PHP)
function sendSmtpMail($host, $port, $username, $password, $to, $from, $fromName, $subject, $body, $replyTo = null, $replyToName = null, $submissionId = null) {
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $remote = ($port == 465 ? 'ssl://' : '') . $host . ':' . $port;
    $socket = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return ['success' => false, 'error' => "Falha ao conectar no servidor SMTP: $errstr ($errno)"];
    }

    $read = function() use ($socket) {
        $server_response = '';
        while ($str = fgets($socket, 515)) {
            $server_response .= $str;
            if (substr($str, 3, 1) == " ") break;
        }
        return $server_response;
    };

    $send = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $res = $read();
    if (substr($res, 0, 3) != '220') {
        fclose($socket);
        return ['success' => false, 'error' => 'Servidor SMTP não respondeu código 220: ' . trim($res)];
    }

    $send("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'curitipao.com.br'));
    $res = $read();

    if ($port == 587) {
        $send("STARTTLS");
        $res = $read();
        $cryptoMethod = defined('STREAM_CRYPTO_METHOD_TLS_CLIENT') ? STREAM_CRYPTO_METHOD_TLS_CLIENT : STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
        stream_socket_enable_crypto($socket, true, $cryptoMethod);
        $send("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'curitipao.com.br'));
        $res = $read();
    }

    $send("AUTH LOGIN");
    $res = $read();
    if (substr($res, 0, 3) != '334') {
        fclose($socket);
        return ['success' => false, 'error' => 'AUTH LOGIN rejeitado: ' . trim($res)];
    }

    $send(base64_encode($username));
    $res = $read();
    if (substr($res, 0, 3) != '334') {
        fclose($socket);
        return ['success' => false, 'error' => 'Usuário SMTP rejeitado: ' . trim($res)];
    }

    $send(base64_encode($password));
    $res = $read();
    if (substr($res, 0, 3) != '235') {
        fclose($socket);
        return ['success' => false, 'error' => 'Autenticação SMTP falhou: ' . trim($res)];
    }

    $send("MAIL FROM: <$from>");
    $res = $read();

    $send("RCPT TO: <$to>");
    $res = $read();

    $send("DATA");
    $res = $read();
    if (substr($res, 0, 3) != '354') {
        fclose($socket);
        return ['success' => false, 'error' => 'DATA rejeitado: ' . trim($res)];
    }

    $headers = [];
    $headers[] = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$from>";
    $headers[] = "To: <$to>";
    if ($replyTo) {
        $replyName = $replyToName ?: $replyTo;
        $headers[] = "Reply-To: =?UTF-8?B?" . base64_encode($replyName) . "?= <$replyTo>";
    }
    $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "Content-Transfer-Encoding: 8bit";
    $headers[] = "Date: " . date('r');
    $headers[] = "X-Mailer: CuritiPao-Mailer/1.0";
    if ($submissionId) {
        $headers[] = "X-CuritiPao-Submission-ID: {$submissionId}";
    }

    $messageData = implode("\r\n", $headers) . "\r\n\r\n" . $body . "\r\n.\r\n";
    $send($messageData);
    $res = $read();

    $send("QUIT");
    fclose($socket);

    if (substr($res, 0, 3) == '250') {
        return ['success' => true];
    } else {
        return ['success' => false, 'error' => 'Falha no envio da mensagem: ' . trim($res)];
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido.'
    ]);
    exit;
}

// 2. Leitura de dados (JSON ou form-data)
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
    $input = $_POST;
}

// 3. Proteção Anti-Spam (Honeypot)
if (!empty($input['curitipao_hp'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Envio inválido detectado.'
    ]);
    exit;
}

$formType = filter_var($input['tipo_formulario'] ?? 'indicar', FILTER_SANITIZE_SPECIAL_CHARS);

// 4. Validação e Sanitização por Formulário
$cleanTel = preg_replace('/\D/', '', $input['telefone_padaria'] ?? '');
$cleanWpp = preg_replace('/\D/', '', $input['whatsapp_padaria'] ?? '');
$samePhone = !empty($input['mesmo_contato']) ? true : false;
if ($samePhone && !empty($cleanTel) && empty($cleanWpp)) {
    $cleanWpp = $cleanTel;
}

// Validação de formato de telefone (aceita com ou sem formatação, fixo ou móvel: 8 a 15 dígitos)
$validaTelefone = function($digits) {
    if (empty($digits)) return true;
    $len = strlen($digits);
    return ($len >= 8 && $len <= 15);
};

if (!empty($cleanTel) && !$validaTelefone($cleanTel)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'O telefone informado da padaria é inválido. Aceita telefone fixo ou celular com DDD (8 a 15 dígitos).'
    ]);
    exit;
}

if (!empty($cleanWpp) && !$validaTelefone($cleanWpp)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'O WhatsApp informado da padaria é inválido. Aceita celular ou fixo com DDD (8 a 15 dígitos).'
    ]);
    exit;
}

// Autorizações de exibição pública
$autorizaTel = !empty($input['autoriza_tel']) ? 'SIM (Autorizado para exibição pública na ficha do guia)' : 'NÃO (Manter apenas para contato interno da curadoria)';
$autorizaWpp = !empty($input['autoriza_wpp']) ? 'SIM (Autorizado para exibição pública na ficha do guia)' : 'NÃO (Manter apenas para contato interno da curadoria)';

$submissionId = uniqid('sub_');
$subject = '';
$body = '';
$senderName = '';
$senderEmail = '';
$neighborhood = '';

if ($formType === 'cadastrar') {
    // FORMULÁRIO B: CADASTRO OU ATUALIZAÇÃO
    $solicitacaoTipo = filter_var($input['tipo'] ?? 'novo', FILTER_SANITIZE_SPECIAL_CHARS);
    $senderName = trim(filter_var($input['responsavel'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $senderRole = trim(filter_var($input['cargo_responsavel'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $senderEmail = filter_var($input['email_retorno'] ?? '', FILTER_VALIDATE_EMAIL);
    $senderDirectPhone = trim(filter_var($input['tel_responsavel'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));

    $bakeryName = trim(filter_var($input['nome_padaria'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $neighborhood = trim(filter_var($input['bairro'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $address = trim(filter_var($input['endereco'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $hours = trim(filter_var($input['horarios'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $instaSite = trim(filter_var($input['instagram_site'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $specialties = trim(filter_var($input['especialidades'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $attendance = trim(filter_var($input['atendimento'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $presentation = trim(filter_var($input['apresentacao'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));

    // Validações obrigatórias
    if (!$senderEmail || empty($senderName) || empty($bakeryName) || empty($address) || empty($hours) || empty($specialties) || empty($attendance) || empty($presentation)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, preencha todos os campos obrigatórios do formulário de cadastro/atualização.'
        ]);
        exit;
    }

    // Regra mandatória: Pelo menos um contato da padaria (telefone ou WhatsApp)
    if (empty($cleanTel) && empty($cleanWpp)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, informe ao menos um contato da padaria: telefone fixo ou WhatsApp.'
        ]);
        exit;
    }

    $tipoLabel = ($solicitacaoTipo === 'atualizacao') ? 'ATUALIZAÇÃO DE DADOS' : 'NOVO CADASTRO';
    $subject = "[CuritiPão] {$tipoLabel} (PENDENTE DE REVISÃO): {$bakeryName} [{$submissionId}]";

    $body = "=========================================================\n";
    $body .= "CURITIPÃO — SOLICITAÇÃO DE {$tipoLabel}\n";
    $body .= "Status: PENDENTE DE REVISÃO EDITORIAL (Não publicado automaticamente)\n";
    $body .= "ID da Submissão: {$submissionId}\n";
    $body .= "Data/Hora: " . date('d/m/Y H:i:s') . "\n";
    $body .= "=========================================================\n\n";

    $body .= "1. DADOS DO RESPONSÁVEL (ESTRITAMENTE INTERNO - NÃO DIVULGAR):\n";
    $body .= "Nome: {$senderName}\n";
    $body .= "Cargo/Relação: {$senderRole}\n";
    $body .= "E-mail de Retorno: {$senderEmail}\n";
    $body .= "Telefone Direto do Responsável: " . ($senderDirectPhone ?: 'Não informado') . "\n\n";

    $body .= "2. DADOS INSTITUCIONAIS DA PADARIA:\n";
    $body .= "Nome Fantasia: {$bakeryName}\n";
    $body .= "Endereço Completo e Bairro: {$address}\n";
    $body .= "Horários de Funcionamento: {$hours}\n";
    $body .= "Telefone Fixo da Padaria: " . ($input['telefone_padaria'] ?? 'Não informado') . "\n";
    $body .= "WhatsApp da Padaria: " . ($input['whatsapp_padaria'] ?? 'Não informado') . "\n";
    $body .= "WhatsApp é o mesmo número: " . ($samePhone ? 'Sim' : 'Não') . "\n";
    $body .= "Instagram e Site Oficial: " . ($instaSite ?: 'Não informado') . "\n\n";

    $body .= "3. AUTORIZAÇÕES DE EXIBIÇÃO PÚBLICA NO GUIA:\n";
    $body .= "- Exibir Telefone publicamente na ficha: {$autorizaTel}\n";
    $body .= "- Exibir WhatsApp publicamente na ficha: {$autorizaWpp}\n\n";

    $body .= "4. CONTEÚDO EDITORIAL:\n";
    $body .= "Especialidades/Pães: {$specialties}\n";
    $body .= "Modalidades de Atendimento: {$attendance}\n";
    $body .= "Apresentação da Padaria:\n{$presentation}\n\n";

    $body .= "---------------------------------------------------------\n";
    $body .= "IMPORTANTE: Todo cadastro ou atualização passa por triagem editorial antes de entrar no ar. Nas atualizações, a ficha atual permanece inalterada até a validação das mudanças.\n";

} else {
    // FORMULÁRIO A: INDICAÇÃO DE PADARIA
    $senderName = trim(filter_var($input['nome'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $senderEmail = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $bakeryName = trim(filter_var($input['nome_padaria'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $neighborhood = trim(filter_var($input['bairro'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $neighborhood = trim(filter_var($input['bairro'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $instaSite = trim(filter_var($input['instagram'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $reason = trim(filter_var($input['motivo'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));

    if (!$senderEmail || empty($senderName) || empty($bakeryName) || empty($neighborhood) || empty($reason)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, preencha todos os campos obrigatórios da indicação.'
        ]);
        exit;
    }

    $subject = "[CuritiPão] INDICAÇÃO DE PADARIA (PENDENTE DE REVISÃO): {$bakeryName} [{$submissionId}]";

    $body = "=========================================================\n";
    $body .= "CURITIPÃO — INDICAÇÃO DE VISITANTE\n";
    $body .= "Status: PENDENTE DE REVISÃO EDITORIAL (Não publicado automaticamente)\n";
    $body .= "ID da Submissão: {$submissionId}\n";
    $body .= "Data/Hora: " . date('d/m/Y H:i:s') . "\n";
    $body .= "=========================================================\n\n";

    $body .= "1. DADOS DE QUEM INDICOU (ESTRITAMENTE INTERNO - NÃO DIVULGAR):\n";
    $body .= "Nome: {$senderName}\n";
    $body .= "E-mail: {$senderEmail}\n\n";

    $body .= "2. DADOS DA PADARIA INDICADA:\n";
    $body .= "Nome da Padaria: {$bakeryName}\n";
    $body .= "Bairro: {$neighborhood}\n";
    $body .= "Telefone da Padaria: " . ($input['telefone_padaria'] ?? 'Não informado (opcional)') . "\n";
    $body .= "WhatsApp da Padaria: " . ($input['whatsapp_padaria'] ?? 'Não informado (opcional)') . "\n";
    $body .= "WhatsApp é o mesmo número: " . ($samePhone ? 'Sim' : 'Não') . "\n";
    $body .= "Instagram/Site: " . ($instaSite ?: 'Não informado') . "\n\n";

    $body .= "3. AUTORIZAÇÃO DE EXIBIÇÃO PÚBLICA:\n";
    $body .= "- Exibir Telefone no guia se apurado: {$autorizaTel}\n";
    $body .= "- Exibir WhatsApp no guia se apurado: {$autorizaWpp}\n\n";

    $body .= "4. MOTIVO DA INDICAÇÃO:\n{$reason}\n\n";

    $body .= "---------------------------------------------------------\n";
    $body .= "IMPORTANTE: Todas as indicações passam por apuração da curadoria antes da criação de fichas no guia.\n";
}

// 5. Registro seguro e verificável em armazenamento persistente
$logEntry = "[" . date('Y-m-d H:i:s') . "] [ID: {$submissionId}] Tipo: {$formType} | Remetente: {$senderName} ({$senderEmail}) | Padaria: {$bakeryName}\n" . $body . "\n\n";
$logSaved = @file_put_contents(__DIR__ . '/submissoes_pendentes_revisao.log', $logEntry, FILE_APPEND | LOCK_EX);

// Também registra em JSON estruturado para auditoria da curadoria
$jsonFile = __DIR__ . '/submissoes_pendentes.json';
$existingSubmissions = [];
if (file_exists($jsonFile)) {
    $existingSubmissions = json_decode(@file_get_contents($jsonFile), true) ?: [];
}
$existingSubmissions[] = [
    'id' => $submissionId,
    'data' => date('Y-m-d H:i:s'),
    'tipo' => $formType,
    'remetente_nome' => $senderName,
    'remetente_email' => $senderEmail,
    'padaria_nome' => $bakeryName,
    'bairro' => $neighborhood,
    'status' => 'pendente_revisao_editorial',
    'dados' => $input
];
$jsonSaved = @file_put_contents($jsonFile, json_encode($existingSubmissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

$isPersisted = ($logSaved !== false || $jsonSaved !== false);

// 6. Envio Real via SMTP (se configurado)
$emailSent = false;
if ($isSmtpActive) {
    $smtpRes = sendSmtpMail(
        $smtpConfig['host'] ?? 'smtp.hostinger.com',
        $smtpConfig['port'] ?? 465,
        $smtpConfig['username'] ?? OFFICIAL_RECIPIENT,
        $smtpConfig['password'],
        OFFICIAL_RECIPIENT,
        $smtpConfig['from_email'] ?? OFFICIAL_RECIPIENT,
        $smtpConfig['from_name'] ?? 'CuritiPão',
        $subject,
        $body,
        $senderEmail,
        $senderName,
        $submissionId
    );

    if ($smtpRes['success']) {
        $emailSent = true;
    } else {
        error_log("[CuritiPão SMTP Error] " . ($smtpRes['error'] ?? 'Desconhecido'));
    }
}

// 7. Retorno de Status: Sucesso somente se e-mail enviado OU registro persistente verificado
if ($emailSent || $isPersisted) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'submission_id' => $submissionId,
        'email_sent' => $emailSent,
        'persisted' => $isPersisted,
        'message' => 'Sua solicitação foi recebida com sucesso e encaminhada para a curadoria do CuritiPão. Nossa equipe revisa todas as informações antes de qualquer atualização no guia.'
    ]);
    exit;
}

// Se ambos falharem (sem SMTP e sem conseguir gravar no disco), retorna falha para preservar os campos no navegador
http_response_code(500);
echo json_encode([
    'success' => false,
    'message' => 'Não foi possível registrar ou enviar sua solicitação no momento devido a uma instabilidade temporária. Por favor, tente novamente mais tarde ou envie diretamente para ' . OFFICIAL_RECIPIENT . '.'
]);
exit;
