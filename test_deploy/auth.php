<?php
/*
==================================================
System      : Face Recognition Registration System
Developer   : นายธนวัฒน์ เสริฐสุวรรณกุล
Position    : นักวิชาการคอมพิวเตอร์
Unit        : งานเทคโนโลยีวิทยทรัพยากรดิจิทัล
Email       : tanawats@g.swu.ac.th
Developed   : 2025
==================================================
*/
?>
<?php
function log_login_status($user_login, $status)
{
    $url = 'https://lib.swu.ac.th/app/ci4_new/public/api/login-log';

    $payload = json_encode([
        'buasri_id' => $user_login,
        'status'    => $status
    ]);

    $opts = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\n",
            'content' => $payload,
            'timeout' => 2
        ]
    ];

    // fire-and-forget
    @file_get_contents($url, false, stream_context_create($opts));
}

session_start();

define('SESSION_TIMEOUT', 600); // 10 นาที

/* ===== เช็ค session ก่อน (กัน login ซ้ำ) ===== */
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

/* ===== helper functions ===== */
function try_bind($conn, $rdn, $password)
{
    return @ldap_bind($conn, $rdn, $password);
}

function fetchPesonId($user_login)
{
    $apiUrl = "https://lib.swu.ac.th/app/ci4_new/public/apiapp/checkUserId/" . urlencode($user_login);
    $response = @file_get_contents($apiUrl);
    if ($response === false) {
        return null;
    }

    $data = json_decode($response, true);
    return ($data['status'] ?? '') === 'success'
        ? ($data['user']['peson_id'] ?? null)
        : null;
}

/* ===== success handler ===== */
function login_success($user_login)
{
    log_login_status($user_login, 'success');
    // 🔐 ป้องกัน session fixation
    session_regenerate_id(true);

    $_SESSION['auth_ldap']    = true;
    $_SESSION['user_login']   = $user_login;
    $_SESSION['peson_id']     = fetchPesonId($user_login);

    // ⭐ เพิ่มบรรทัดนี้
    $_SESSION['last_activity'] = time(); // เวลาเริ่มใช้งาน

    // 🔒 บังคับเขียน session ก่อน redirect
    session_write_close();

    header("Location: index.php");
    exit;
}


/* ===== Step 1: LDAPS 636 ===== */
$ldapconn = @ldap_connect("ldaps://ldap.swu.ac.th", 636);
if ($ldapconn) {
    ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
    ldap_set_option($ldapconn, LDAP_OPT_NETWORK_TIMEOUT, 3);
    ldap_set_option($ldapconn, LDAP_OPT_TIMELIMIT, 3);

    if (try_bind($ldapconn, $ldaprdn, $user_password)) {
        ldap_unbind($ldapconn);
        login_success($user_login);
    }
    ldap_unbind($ldapconn);
}

/* ===== Step 2: STARTTLS 389 ===== */
$ldapconn = @ldap_connect("ldap://ldap.swu.ac.th", 389);
if ($ldapconn) {
    ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
    ldap_set_option($ldapconn, LDAP_OPT_NETWORK_TIMEOUT, 3);
    ldap_set_option($ldapconn, LDAP_OPT_TIMELIMIT, 3);

    if (@ldap_start_tls($ldapconn)) {
        if (try_bind($ldapconn, $ldaprdn, $user_password)) {
            ldap_unbind($ldapconn);
            login_success($user_login);
        }
    }
    ldap_unbind($ldapconn);
}

/* ===== Step 3: Plain LDAP 389 ===== */
$ldapconn = @ldap_connect("ldap://ldap.swu.ac.th", 389);
if ($ldapconn) {
    ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
    ldap_set_option($ldapconn, LDAP_OPT_NETWORK_TIMEOUT, 3);
    ldap_set_option($ldapconn, LDAP_OPT_TIMELIMIT, 3);
    
    if (try_bind($ldapconn, $ldaprdn, $user_password)) {
        ldap_unbind($ldapconn);
        login_success($user_login);
    }
    ldap_unbind($ldapconn);
}

/* ===== login failed ===== */
$login_failed = true;
// ❌ log login ไม่ผ่าน
log_login_status($user_login, 'fail');
LOGIN_ERROR:
if (!isset($login_failed)) {
    exit;
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
        .icon { font-size: 48px; margin-bottom: 10px; }
        .error {
            color: #dc3545;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .desc {
            color: #555;
            margin-bottom: 25px;
            font-size: 14px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 10px 22px;
            background: #0d6efd;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 15px;
        }
        .btn:hover { background: #0b5ed7; }
        .note {
            margin-top: 15px;
            font-size: 12px;
            color: #888;
        }
        @media (max-width: 480px) {
            .card { padding: 25px 20px; }
            .icon { font-size: 42px; }
            .error { font-size: 17px; }
        }
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

    <a href="login.php" class="btn" autofocus>
        กลับหน้า Login
    </a>

    <div class="note">
        ระบบจะพาคุณกลับไปยังหน้า Login อัตโนมัติภายใน 5 วินาที
    </div>
</div>

</body>
</html>
