<?php
session_start();
header('Content-Type: application/json');

define('SESSION_TIMEOUT', 600);

// ยังไม่ login
if (empty($_SESSION['auth_ldap'])) {
    http_response_code(401);
    echo json_encode(['status' => 'unauthorized']);
    exit;
}

// ถ้าไม่มี last_activity ให้ถือว่าเริ่มตอน login
if (!isset($_SESSION['last_activity'])) {
    $_SESSION['last_activity'] = time();
}

// หมดเวลา
if ((time() - $_SESSION['last_activity']) > SESSION_TIMEOUT) {
    session_unset();
    session_destroy();

    http_response_code(440);
    echo json_encode(['status' => 'expired']);
    exit;
}

// ยังใช้งานได้ (ไม่ reset เวลา!)
http_response_code(200);
echo json_encode(['status' => 'ok']);
exit;
?>