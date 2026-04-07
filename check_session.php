<?php
session_start();
define('SESSION_TIMEOUT', 600);

header('Content-Type: application/json');

if (
    empty($_SESSION['auth_ldap']) ||
    empty($_SESSION['last_activity']) ||
    (time() - $_SESSION['last_activity']) > SESSION_TIMEOUT
) {
    session_unset();
    session_destroy();
    echo json_encode(['status' => 'expired']);
    exit;
}

echo json_encode(['status' => 'active']);