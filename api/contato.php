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
 */

header('Content-Type: application/json; charset=utf-8');

// Configuração do status de transporte SMTP
// Em homologação na hospedagem Hostinger: se false, exibe aviso verdadeiro e orienta e-mail direto.
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

// 1. Leitura de dados (JSON ou form-data)
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
    $input = $_POST;
}

// 2. Proteção Anti-Spam (Honeypot)
if (!empty($input['curitipao_hp'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Envio inválido detectado.'
    ]);
    exit;
}

$formType = filter_var($input['tipo_formulario'] ?? 'indicar', FILTER_SANITIZE_SPECIAL_CHARS);

// 3. Validação e Sanitização por Formulário
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

$subject = '';
$body = '';
$senderName = '';
$senderEmail = '';

if ($formType === 'cadastrar') {
    // FORMULÁRIO B: CADASTRO OU ATUALIZAÇÃO
    $solicitacaoTipo = filter_var($input['tipo'] ?? 'novo', FILTER_SANITIZE_SPECIAL_CHARS);
    $senderName = trim(filter_var($input['responsavel'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $senderRole = trim(filter_var($input['cargo_responsavel'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
    $senderEmail = filter_var($input['email_retorno'] ?? '', FILTER_VALIDATE_EMAIL);
    $senderDirectPhone = trim(filter_var($input['tel_responsavel'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));

    $bakeryName = trim(filter_var($input['nome_padaria'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
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
    $subject = "[CuritiPão] {$tipoLabel} (PENDENTE DE REVISÃO): {$bakeryName}";

    $body = "=========================================================\n";
    $body .= "CURITIPÃO — SOLICITAÇÃO DE {$tipoLabel}\n";
    $body .= "Status: PENDENTE DE REVISÃO EDITORIAL (Não publicado automaticamente)\n";
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

    $subject = "[CuritiPão] INDICAÇÃO DE PADARIA (PENDENTE DE REVISÃO): {$bakeryName}";

    $body = "=========================================================\n";
    $body .= "CURITIPÃO — INDICAÇÃO DE VISITANTE\n";
    $body .= "Status: PENDENTE DE REVISÃO EDITORIAL (Não publicado automaticamente)\n";
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

// 4. Verificação de Transporte SMTP
// Se o transporte não estiver ativo, orientar contato direto com aviso verdadeiro
if (!MAIL_TRANSPORT_ACTIVE) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'status' => 'pending_smtp_setup',
        'message' => 'As informações foram validadas com sucesso pelo sistema. Contudo, o transporte direto via formulário web ainda está aguardando a ativação técnica de infraestrutura SMTP na hospedagem. Para que sua submissão chegue imediatamente à nossa equipe editorial, encaminhe os dados para ' . OFFICIAL_RECIPIENT . ' ou pelo direct do Instagram @curitipao.guia.',
        'data_validated' => true,
        'summary' => [
            'tipo' => $formType,
            'padaria' => $bakeryName,
            'remetente' => $senderName,
            'revisao_pendente' => true
        ]
    ]);
    exit;
}

// 5. Envio real via PHP mail() quando MAIL_TRANSPORT_ACTIVE for true
$headers = [
    'From: CuritiPão Webmaster <no-reply@curitipao.com.br>',
    'Reply-To: ' . $senderName . ' <' . $senderEmail . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = @mail(OFFICIAL_RECIPIENT, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Submissão recebida com sucesso! As informações foram arquivadas como pendentes de revisão pela equipe editorial CuritiPão. Nenhuma alteração pública foi realizada automaticamente.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ocorreu um erro no processamento do e-mail no servidor. Por favor, envie os dados diretamente para ' . OFFICIAL_RECIPIENT
    ]);
}
