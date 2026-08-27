<?php
/*
==================================================
System      : Face Recognition Registration System
Developer   : นายธนวัฒน์ เสริฐสุวรรณกุล
Position    : นักวิชาการคอมพิวเตอร์
Unit        : งานเทคโนโลยีวิทยทรัพยากรดิจิทัล
Email       : tanawats@g.swu.ac.th
Developed   : 2025 - 2026
==================================================
*/

function log_login_status($user_login, $status)
{
    if (empty(trim($user_login))) {
        return;
    }

    $url = 'https://lib.swu.ac.th/app/ci4_new/public/api/login-log';

    $payload = json_encode([
        'buasri_id' => trim($user_login),
        'status'    => $status
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json'
        ],
        CURLOPT_TIMEOUT        => 1
    ]);
    
    $response = curl_exec($ch);    
    curl_close($ch); // 👈 ปล่อยให้มันปิดการเชื่อมต่อ cURL ตามปกติ
}

session_start();

define('SESSION_TIMEOUT', 600);

/* ===== กัน login ซ้ำ ===== */
if (!empty($_SESSION['auth_ldap'])) {
    header("Location: index.php");
    exit;
}

$user_login    = trim($_POST["user_login"] ?? '');
$user_password = $_POST["user_password"] ?? '';

if ($user_login === '' || $user_password === '') {
    $login_failed = true;
    goto LOGIN_ERROR;
}

$base_dn = "dc=swu,dc=ac,dc=th";
$ldaprdn = "uid={$user_login}," . $base_dn;

/* ===== helper ===== */
function try_bind($conn, $rdn, $password)
{
    return @ldap_bind($conn, $rdn, $password);
}

function fetchPersonId($user_login)
{
    $user_login = trim($user_login);
    if ($user_login === '') return null;

    $apiUrl = "https://lib.swu.ac.th/app/ci4_new/public/apiapp/checkUserId/" . urlencode($user_login);

    // ✅ เปลี่ยนจาก file_get_contents → curl เหมือนที่ debug ผ่าน
    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 3,
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    if (!$response) return null;

    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE || empty($data)) return null;

    if (($data['status'] ?? '') === 'success' && !empty($data['person_id'])) {
        return trim((string)$data['person_id']);
    }

    return null;
}
function login_success($user_login)
{
    log_login_status($user_login, 'success');

    $my_person_id = fetchPersonId($user_login);

    // debug ชั่วคราว — ลบออกหลังทดสอบ
    error_log("person_id for {$user_login} = " . var_export($my_person_id, true));

    if (empty($my_person_id)) {
        // หา person_id ไม่เจอ → ไป register
        session_regenerate_id(true);
        $_SESSION['auth_ldap']     = true;
        $_SESSION['user_login']    = $user_login;
        $_SESSION['last_activity'] = time();
        session_write_close();
        header("Location: register.php?reason=no_person_id");
        exit;
    }

    // ✅ เจอ person_id → ไป index
    session_regenerate_id(true);
    $_SESSION['auth_ldap']     = true;
    $_SESSION['user_login']    = $user_login;
    $_SESSION['person_id']     = $my_person_id;
    $_SESSION['last_activity'] = time();
    session_write_close();
    header("Location: index.php");
    exit;
}

/* ===== ปรับแต่งการต่อ LDAP ให้ไวขึ้น ===== */
// กำหนด Server เรียงตามลำดับความสำคัญ (ถ้า 636 ผ่าน จะไม่ไป 389)
$ldap_servers = [
    'ldaps://ldap.swu.ac.th:636',
    'ldap://ldap.swu.ac.th:389'
];

foreach ($ldap_servers as $server) {
    $ldapconn = @ldap_connect($server);
    if ($ldapconn) {
        ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
        ldap_set_option($ldapconn, LDAP_OPT_NETWORK_TIMEOUT, 2); // ⚡ กันค้าง: สั่ง Timeout ภายใน 2 วินาทีพอ

        // ถ้าเป็น 389 ให้ลอง STARTTLS ก่อน
        if (strpos($server, '389') !== false) {
            @ldap_start_tls($ldapconn);
        }

        if (try_bind($ldapconn, $ldaprdn, $user_password)) {
            ldap_unbind($ldapconn);
            login_success($user_login);
        }
        ldap_unbind($ldapconn);
    }
}
// /* ===== Step 1: LDAPS 636 ===== */
// $ldapconn = @ldap_connect("ldaps://ldap.swu.ac.th", 636);
// if ($ldapconn) {
//     ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
//     ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
//     if (try_bind($ldapconn, $ldaprdn, $user_password)) {
//         ldap_unbind($ldapconn);
//         login_success($user_login);
//     }
//     ldap_unbind($ldapconn);
// }

// /* ===== Step 2: STARTTLS 389 ===== */
// $ldapconn = @ldap_connect("ldap://ldap.swu.ac.th", 389);
// if ($ldapconn) {
//     ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
//     ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
//     if (@ldap_start_tls($ldapconn)) {
//         if (try_bind($ldapconn, $ldaprdn, $user_password)) {
//             ldap_unbind($ldapconn);
//             login_success($user_login);
//         }
//     }
//     ldap_unbind($ldapconn);
// }

// /* ===== Step 3: Plain LDAP 389 ===== */
// $ldapconn = @ldap_connect("ldap://ldap.swu.ac.th", 389);
// if ($ldapconn) {
//     ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
//     ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
//     if (try_bind($ldapconn, $ldaprdn, $user_password)) {
//         ldap_unbind($ldapconn);
//         login_success($user_login);
//     }
//     ldap_unbind($ldapconn);
// }

/* ===== login failed ===== */
$login_failed = true;

LOGIN_ERROR:

if (isset($login_failed)) {
    log_login_status($user_login, 'fail'); 
    // exit;
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>เข้าสู่ระบบไม่สำเร็จ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-store">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="refresh" content="5;url=login.php">
    <style>
        body {
            font-family: "Segoe UI", Tahoma, sans-serif;
            background: #f5f7fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 15px;
        }
        .card {
            background: #ffffff;
            width: 100%;
            max-width: 420px;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
            text-align: center;
        }
        .icon  { font-size: 48px; margin-bottom: 10px; }
        .error { color: #dc3545; font-size: 18px; font-weight: 600; margin-bottom: 10px; }
        .desc  { color: #555; margin-bottom: 25px; font-size: 14px; line-height: 1.6; }
        .btn   { display: inline-block; padding: 10px 22px; background: #0d6efd; color: #fff; text-decoration: none; border-radius: 6px; font-size: 15px; }
        .btn:hover { background: #0b5ed7; }
        .note  { margin-top: 15px; font-size: 12px; color: #888; }
    </style>
</head>
<body>
<div class="card">
    <div class="icon">❌</div>
    <div class="error">เข้าสู่ระบบไม่สำเร็จ</div>
    <div class="desc">
        ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง<br>
        กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง
    </div>
    <a href="login.php" class="btn">กลับหน้า Login</a>
    <div class="note">ระบบจะพาคุณกลับไปยังหน้า Login อัตโนมัติภายใน 5 วินาที</div>
</div>
</body>
</html>