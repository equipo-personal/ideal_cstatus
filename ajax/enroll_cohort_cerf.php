<?php

require_once('../../../config.php');
require_login();

require_once($CFG->dirroot . '/cohort/lib.php');

global $DB;

// Leer JSON recibido
$data = json_decode(file_get_contents('php://input'));

$userid = intval($data->userid ?? 0);
$cohortid = intval($data->cohort_id ?? 0);

header('Content-Type: application/json');

// Validar parámetros
if (!$userid || !$cohortid) {
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

// Validar que el usuario existe
if (!$DB->record_exists('user', ['id' => $userid])) {
    echo json_encode(['error' => 'User does not exist']);
    exit;
}

// Validar que el cohort existe
if (!$DB->record_exists('cohort', ['id' => $cohortid])) {
    echo json_encode(['error' => 'Cohort does not exist']);
    exit;
}

// Validar si ya está dentro
if (cohort_is_member($cohortid, $userid)) {
    echo json_encode(['error' => 'User already in cohort']);
    exit;
}

try {
    // Iniciar transacción protegida
    $transaction = $DB->start_delegated_transaction();

    // Añadir miembro
    cohort_add_member($cohortid, $userid);

    // Confirmar transacción
    $transaction->allow_commit();

    echo json_encode(['success' => true]);
    exit;

} catch (Exception $e) {

    // Si algo falla, no se guarda nada
    if (!empty($transaction)) {
        $transaction->rollback($e);
    }

    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
