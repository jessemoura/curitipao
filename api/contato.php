<?php
/**
 * CURITIPÃO — BACKEND DE FORMULÁRIOS
 * Formulários: A) Indicação de Padaria | B) Cadastro / Atualização de Estabelecimento
 * Destinatário Oficial: contato@curitipao.com.br
 */

header('Content-Type: application/json; charset=utf-8');

// STATUS DO TRANSPORTE SMTP / ENVIO
// Conforme especificação do projeto: enquanto o transporte e caixa postal estiverem
// em homologação, o envio direto permanece indisponível com orientação de contato direto.
define('MAIL_TRANSPORT_ACTIVE', false);
define('OFFICIAL_RECIPIENT', 'contato@curitipao.com.br');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido.'
    ]);
    exit;
}

// Se o transporte não estiver ativo, orientar contato direto
if (!MAIL_TRANSPORT_ACTIVE) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'status' => 'pending_smtp_setup',
        'message' => 'O envio automático via formulário web está em fase de ativação técnica. Por favor, envie sua mensagem ou indicação diretamente para nosso e-mail oficial: ' . OFFICIAL_RECIPIENT . ' ou pelo Instagram @curitipao.guia.'
    ]);
    exit;
}

// Fluxo preparado para quando MAIL_TRANSPORT_ACTIVE for true:
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$formType = filter_var($input['tipo_formulario'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$name = trim(filter_var($input['nome'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);

if (!$email || empty($name)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, preencha os campos obrigatórios com um e-mail válido.'
    ]);
    exit;
}

// Sanitização dos dados
$bakeryName = filter_var($input['nome_padaria'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$neighborhood = filter_var($input['bairro'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_var($input['motivo'] ?? $input['apresentacao'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

// Montagem do e-mail seguro
$subject = ($formType === 'cadastrar') 
    ? "[CuritiPão] Cadastro/Atualização de Padaria: {$bakeryName}" 
    : "[CuritiPão] Indicação de Padaria: {$bakeryName}";

$body = "Nova submissão recebida através do portal curitipao.com.br\n";
$body .= "Data/Hora: " . date('d/m/Y H:i:s') . "\n";
$body .= "Tipo: " . ($formType === 'cadastrar' ? 'Cadastro de Padaria' : 'Indicação de Visitante') . "\n";
$body .= "Remetente: {$name} ({$email})\n";
$body .= "Padaria: {$bakeryName}\n";
$body .= "Bairro: {$neighborhood}\n\n";
$body .= "Detalhes/Mensagem:\n{$message}\n\n";
$body .= "---------------------------------------------------------\n";
$body .= "Nota: Todas as indicações e cadastros passam por revisão editorial antes de publicação.\n";

// Cabeçalhos de segurança (Reply-To seguro, nunca remetente arbitrário)
$headers = [
    'From: CuritiPão Webmaster <no-reply@curitipao.com.br>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = @mail(OFFICIAL_RECIPIENT, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Submissão recebida com sucesso! Nossa equipe editorial revisará os dados.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ocorreu um erro no processamento do e-mail. Por favor, envie diretamente para ' . OFFICIAL_RECIPIENT
    ]);
}
