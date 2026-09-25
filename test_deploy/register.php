<?php
session_start();

/* ================== CONFIG ================== */
define('SESSION_TIMEOUT', 600); // วินาที

/* ================== AUTH CHECK ================== */
if (empty($_SESSION['auth_ldap'])) {
    header("Location: login.php");
    exit;
}

/* ================== EXPIRE ================== */
if (
    isset($_SESSION['last_activity']) &&
    (time() - $_SESSION['last_activity']) > SESSION_TIMEOUT
) {
    session_unset();
    session_destroy();

    // ❗ ไม่ redirect ตรง ๆ เพื่อให้ JS จัดการ
    echo "<script>
        alert('Session หมดเวลา กรุณาเข้าสู่ระบบใหม่');
        window.location.href = 'login.php?timeout=1';
    </script>";
    exit;
}

/* ================== NO CACHE ================== */
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

/* ================== SESSION DATA ================== */
$buasri_id      = $_SESSION['user_login'] ?? null;
$person_id_session  = $_SESSION['person_id'] ?? null;

/* ================== HELPER ================== */
function callApi(string $url)
{
    $ch = curl_init($url);
    curl_setopt_array(
        $ch,
        [CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false, CURLOPT_TIMEOUT => 10,]
    );
    $resp = curl_exec($ch);
    curl_close($ch);
    return $resp ?: false;
}

/* ================== CALL API ================== */
$apiUrl = "https://lib.swu.ac.th/app/ci4_new/public/apiapp/checkUserId/{$buasri_id}";
$response = callApi($apiUrl);
$data = json_decode($response, true);

/* ================== VALIDATE API ================== */
if (empty($data) || ($data['status'] ?? '') !== 'success' || empty($data['user']['peson_id'])) {
    echo "<p>{$buasri_id} ไม่มีสิทธิ์เข้าใช้ระบบ</p><br>
<a href='https://lib.swu.ac.th/app/face_scan/login.php'><button >กลับหน้า Login</button>";
    exit;
}

/* ================== USER DATA ================== */
$userId = $data['user']['peson_id'];
$userMail = $data['user']['gafe_mail'] ?? null;
$userName = $data['user']['name_th'] ?? null;
$userLname = $data['user']['lname_th'] ?? null;
$userType = $data['user']['type'] ?? null;
$fullName = trim(($userName ?? '') . ' ' . ($userLname ?? ''));
$departMent = $data['user']['department_th'] ?? null;
$faculty = $data['user']['faculty_th'] ?? null;
$faculty_num = $data['user']['faculty_num'] ?? null;

/* ================== SYNC SESSION ================== */
$_SESSION['person_id'] = $userId;

?>

<!DOCTYPE html>
<html lang="th">

<head>
<<<<<<< HEAD

    <meta charset="UTF-8">
    <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register Face</title>
    <link rel="stylesheet" href="./css/face_scan.css">

</head>

<body>
    <div style="padding: 10px; background: #eee; font-size: 12px; text-align: center;">ID ผู้ใช้งานระบบ: <?php echo htmlspecialchars($userId); ?></div>
    <div class="container">
        <!-- countdown -->
=======
<<<<<<< HEAD
<<<<<<< HEAD

    <meta charset="UTF-8">
    <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
=======
<<<<<<< HEAD
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C48T4MMF9L"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-C48T4MMF9L');
    </script>
     <!-- Google Tag Manager -->
    <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W8ZD4T59');
    </script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register Face</title>
    <link rel="stylesheet" href="./css/face_scan.css">
   
    <script>
=======
<<<<<<< HEAD
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C48T4MMF9L"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-C48T4MMF9L');
    </script>
     <!-- Google Tag Manager -->
    <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W8ZD4T59');
    </script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register Face</title>
    <link rel="stylesheet" href="./css/face_scan.css">
   
    <script>
=======
<<<<<<< HEAD
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C48T4MMF9L"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-C48T4MMF9L');
    </script>
     <!-- Google Tag Manager -->
    <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W8ZD4T59');
    </script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register Face</title>
    <link rel="stylesheet" href="./css/face_scan.css">
   
    <script>
=======
    <meta charset="UTF-8">
    <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
>>>>>>> b526410014d7415a9844022493031e415f988d72
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register Face</title>
    <link rel="stylesheet" href="./css/face_scan.css">
   
    <script>
<<<<<<< HEAD
=======
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======

    <meta charset="UTF-8">
    <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register Face</title>
    <link rel="stylesheet" href="./css/face_scan.css">
   
    <script>
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
        const SESSION_TIMEOUT = <?= SESSION_TIMEOUT ?>;
    </script>
</head>

<body>
<<<<<<< HEAD
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
        <!-- Google Tag Manager (noscript) -->
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W8ZD4T59"height="0" width="0" style="display:none;visibility:hidden">
            </iframe>
        </noscript>
        <!-- End Google Tag Manager (noscript) -->
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======

>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
    <div style="padding: 10px; background: #eee; font-size: 12px; text-align: center;">ID ผู้ใช้งานระบบ: <?php echo htmlspecialchars($userId); ?></div>

    <div class="container">
<!-- countdown -->
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
        <div id="session-timer"
            style="position:fixed;top:10px;right:10px;background:#222;color:#fff;padding:8px 12px;border-radius:6px;font-size:14px;z-index:9999">
            Session เหลือเวลา: <span id="time-left">--:--</span>
        </div>
        <form id="editUserForm" action="" method="post">

            <div class="panel" id="facePanel">
                <p style="text-align: center;">ยังไม่ได้เปิดใช้งานใบหน้า</p> 
            </div>

            <div class="container center">
                <div class="panel col-md-12">
                    <h4 class="mt-5">ข้อมูลผู้ใช้งาน</h4>
                    
                    <input type="hidden" name="ID" value="<?= htmlspecialchars($userId) ?>">
                    <input type="hidden" name="UniqueID" value="<?= htmlspecialchars($userId) ?>">

                    <div class="userInfo">
                        <div class="col-md-8 mx-auto mb-3">
                            <label>ชื่อผู้ใช้:</label>
                            <input class="form-control" name="Name" value="<?= htmlspecialchars($fullName) ?>" readonly>
                        </div>

                        <div class="col-md-8 mx-auto mb-3">
                            <label>คณะ/สังกัดหน่วยงาน:</label>
                            <input class="form-control" name="Faculty" value="<?= htmlspecialchars($faculty) ?>" readonly>
                            <input type="hidden" name="Position" value="<?= htmlspecialchars($faculty_num) ?>">
                        </div>

                        <div class="col-md-8 mx-auto mb-3">
                            <label>สาขา/ส่วนงาน:</label>
                            <input class="form-control" name="Department" value="<?= htmlspecialchars($departMent) ?>" readonly>
                        </div>

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
                        <div class="col-md-8 mx-auto mb-3">
                            <label>ตำแหน่ง:</label>
                            <input class="form-control" value="<?php
                                if ($userType == 'student' || $userType == '1000') {
                                    echo 'นิสิต';
                                } elseif ($userType == 'staff' || $userType == '3000') {
                                    if ($userType == '3000' && ($fullName == 'testap008 api008' || $fullName == 'testap007 api007')) {
                                        echo 'ทดสอบระบบ';
                                    } else {
                                        echo 'บุคลากร';
                                    }
                                } elseif ($userType == 'testlib007' || $userType == 'testlib008') {
                                    echo 'ทดสอบระบบ';
                                } else {
                                    echo htmlspecialchars($userType);
                                }
<<<<<<< HEAD
								?>" readonly>
                        </div>
                        <input type="hidden" name="AccessGroupCode" value="<?= ($userType == 'student' || $userType == '1000' ? '1000' : '3000') ?>">
=======
<<<<<<< HEAD
?>" readonly>
                        </div>
                        <input type="hidden" name="AccessGroupCode" value="<?= ($userType == 'student' || $userType == '1000' ? '1000' : '3000') ?>">
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
        <div class="col-md-8 mx-auto mb-3" >
            <label>ตำแหน่ง:</label>
            <input class="form-control" value="<?php 
                if ($userType == 'student' || $userType == '1000') {
                    echo 'นิสิต';
                } elseif ($userType == 'staff' || $userType == '3000') {
                   
                    if ($userType == '3000' && ($fullName == 'testap008 api008' || $fullName == 'testap007 api007')) {
                        echo 'ทดสอบระบบ';
                    } else {
                        echo 'บุคลากร';
                    }
                } elseif ($userType == 'testlib007' || $userType == 'testlib008') {
                    echo 'ทดสอบระบบ';
                } else {
                    echo htmlspecialchars($userType);
                }
            ?>" readonly>
        </div>
        <input type="hidden" name="AccessGroupCode" value="<?= ($userType == 'student' || $userType == '1000' ? '1000' : '3000') ?>">
<<<<<<< HEAD
=======
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
								?>" readonly>
                        </div>
                        <input type="hidden" name="AccessGroupCode" value="<?= ($userType == 'student' || $userType == '1000' ? '1000' : '3000') ?>">
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0

                        <div class="col-md-8 mx-auto mb-3">
                            <label>รหัสผู้ใช้งาน:</label>
                            <input class="form-control" name="CardNum[]" value="<?= htmlspecialchars($userId) ?>" readonly>
                        </div>
                    </div>

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
                    <h4 class="mt-5">สิทธิ์การใช้งานสแกนใบหน้า</h4>
                    <div class="col-md-8 mx-auto mb-3">
                        <table class="table table-sm" id="tableAuth">
                            <tr>
<<<<<<< HEAD
                                <td>เปิด-ปิดการใช้สแกนใบหน้า</td>
                                <td>
                                    <label class="checkbox-container" >
                                        <input type="checkbox" id="AllowFaceRegister" name="AllowFaceRegister" <?= !empty($hasFacePermission) ? 'checked' : '' ?>>
                                        อนุญาตลงทะเบียนใบหน้า
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
                                <td>เปิด-ปิดการใช้สแกนใบหน้า</td>
                                <td>
                                    <label class="checkbox-container" >
                                        <input type="checkbox" id="AllowFaceRegister" name="AllowFaceRegister" <?= $hasFacePermission ? 'checked' : '' ?>>
                                        อนุญาตลงทะเบียนใบหน้า
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
                                <td>อนุญาตลงทะเบียนใบหน้า</td>
                                <td>
                                    <label>
                                        <input type="checkbox" id="AllowFaceRegister" name="AllowFaceRegister" <?= $hasFacePermission ? 'checked' : '' ?>>
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>อนุญาตเปิดกล้อง</td>
                                <td>
                                    <button type="button" id="AllowCamBtn" class="btn btn-primary" disabled>
                                        เปิดกล้องถ่ายรูป
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                                                   
                    <input type="hidden" name="Email" value="<?= htmlspecialchars($userMail) ?>">
                    <input type="hidden" name="Phone" value="">
                    <input type="hidden" name="Privilege" value="<?= ($userId == '708967') ? '1' : '2' ?>">
                    <input type="hidden" name="RegistDate" value="<?= date('Y-m-d H:i:s') ?>">
                    <input type="hidden" name="ExpireDate" value="<?= date('Y-m-d H:i:s', strtotime('+1 year')) ?>">
                    <input type="hidden" name="Blacklist" value="0">
                    <input type="hidden" name="GroupCode" value="0">
                    <input type="hidden" name="VerifyLevel" value="0">
                    <input type="hidden" name="EmployeeNo" value="">
                    <input type="hidden" name="LoginAllowed" value="<?= ($userId == '708967') ? '1' : '0' ?>">
                    <input type="hidden" name="LoginPW" value="<?= ($userId == '708967') ? '708967' : '' ?>">
<<<<<<< HEAD
                </div>
            </div>

=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======

     <h4 class="mt-5 ">สิทธิ์การใช้งานสแกนใบหน้า</h4>
        <div class="col-md-8 mx-auto mb-3">
            <table class="table table-sm" id="tableAuth">
                <tr>
                    <td>อนุญาตลงทะเบียนใบหน้า</td>
                    <td>
                        <label>
                            <input type="checkbox" id="AllowFaceRegister" name="AllowFaceRegister" <?= $hasFacePermission ? 'checked' : '' ?>>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>อนุญาตเปิดกล้อง</td>
                    <td>
                        <button type="button" id="AllowCamBtn" class="btn btn-primary" disabled>
                            เปิดกล้องถ่ายรูป
                        </button>
                    </td>
                </tr>
            </table>
        </div>
                           
                        <input  type="hidden" name="Email" value="<?= htmlspecialchars($userMail) ?>" readonly>
                        <input  type="hidden" name="Phone" value="" readonly>
                        <input type="hidden" name="Privilege" value="<?= ($userId == '708967') ? '1' : '2' ?>">
                        <input  type="hidden" name="RegistDate" value="<?= date('Y-m-d H:i:s') ?>" readonly>
                        <input  type="hidden" name="ExpireDate" value="<?= date('Y-m-d H:i:s', strtotime('+1 year')) ?>" readonly>
                        <input  type="hidden" name="Blacklist" value="0" readonly>
                        <input type="hidden" name="GroupCode" value="0">
                        <input type="hidden" name="VerifyLevel" value="0">
                        <input type="hidden"  name="EmployeeNo" value="">
                        <input type="hidden"  name="LoginAllowed" value="<?= ($userId == '708967') ? '1' : '0' ?>">
                        <input type="hidden"  name="LoginPW" value="<?= ($userId == '708967') ? '708967' : '' ?>">

        
    </div>
</div>
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
        <!-- ================== Camera & Capture ================== -->
        <div class="panel" id="Newtakephoto" style="display:none">
            <!-- ปุ่มปิดหน้าถ่ายรูป -->
            <button type="button" onclick="closeCameraPanel()"
                style="position: absolute; top: 15px; right: 15px; z-index: 9999; cursor: pointer;background: red;color: white;"><strong>✕</strong></button>
            <br>
            <h2>ถ่ายรูป อัพเดทรูปใหม่</h2>
            <div class="stage row center">
                <div class="video-container" id="videoContainer">
                    <h3>Live Camera</h3>
                    <video id="video" autoplay playsinline muted></video>
                    <canvas id="overlay"></canvas>
<<<<<<< HEAD
                    <p style="margin-top:8px;font-size:0.9rem;color:#555;">กรุณาจัดใบหน้าให้อยู่ในกรอบ</p>
                </div>
            </div>
            <div style="text-align:center;margin-top:15px;">
                <button id="captureBtn" type="button" class="btn-update btn-large" disabled>📸 ถ่ายรูป</button>
            </div>
            <div style="text-align:center;margin-top:10px;">
                <div id="status" style="font-size:20px;">กำลังเตรียมกล้อง…</div>
            </div>
            <div class="panel-result">
                <div class="stage row center">
                    <div class="result-container">
                        <h3>Result</h3>
                        <canvas id="out" width="250" height="250"></canvas>
                    </div>
                </div>
                <div style="margin-top:10px;">
                    <div class="row btn-row">
                        <button id="retakeBtn" class="btn-muted">📸 ถ่ายรูปใหม่</button>
                        <button type="button" id="updateServerBtn" class="btn-update btn-large">⬆️ อัพโหลดรูป</button>
                    </div>
                </div>
            </div>
        </div>

=======

                    <p style="margin-top:8px; font-size:0.9rem; color:#555;">
                        กรุณาจัดใบหน้าให้อยู่ในกรอบ
                    </p>
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
                </div>
            </div>

            <div class="panel" id="Newtakephoto" name="Newtakephoto" style="display:none">
<<<<<<< HEAD
=======
			 <!-- ปุ่มปิดหน้าถ่ายรูป -->
            <button type="button" onclick="closeCameraPanel()"
                style="position: absolute; top: 15px; right: 15px; z-index: 9999; cursor: pointer;background: red;color: white;"><strong>✕</strong></button>
            <br>
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
                <h2>ถ่ายรูป</h2>
                <div class="stage row center">
                    <div class="video-container" id="videoContainer">
                        <h3>Live Camera</h3>
                        <video id="video" autoplay playsinline muted></video>
                        <canvas id="overlay"></canvas>
                        <p style="margin-top:8px; font-size:0.9rem; color:#555;">
                            กรุณาจัดใบหน้าให้อยู่ในกรอบ
                        </p>
                    </div>
                </div>

                <div style="text-align:center; margin-top:15px;">
                    <button id="captureBtn" type="button" class="btn-update btn-large" disabled>
                        📸 ถ่ายรูป
                    </button>
                </div>

                <div style="text-align:center; margin-top:10px;">
                    <div id="status" style="font-size:20px;">
                        กำลังเตรียมกล้อง…
                    </div>
                </div>

                <div class="panel-result" style="display:none;">
                    <div class="stage row center">
                        <div class="result-container">
                            <h3>Result</h3>
                            <canvas id="out" width="300" height="300"></canvas>
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <div class="row btn-row">
                            <button id="retakeBtn" type="button" class="btn-muted">
                                🔁 ถ่ายรูปใหม่
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="action-bar" style="display: flex; gap: 16px; margin-top: 20px; justify-content: center;">
                <div class="panel" style="text-align:center;">
                    <button type="button" id="updateServerBtn" class="btn-update btn-large">
                        บันทึกข้อมูล
                    </button>
                </div>
            </div>
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
        </form> <div class="panel" style="text-align:center; margin-top: 10px;">
            <form action="logout.php" method="post">
                <button type="submit" class="btn-update btn-large-danger">ออกจากระบบ</button>
            </form>
        </div>
    </div>


<<<<<<< HEAD
    <!-- =============== PDPA Modal =================== -->
        <div id="pdpaModal">
=======
<<<<<<< HEAD
    <div id="pdpaModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999;">
        <div style="max-width:600px; margin:10vh auto; background:#fff; padding:20px; border-radius:8px;">
            <img src="./PDF/lib_icon.png" style="width:300px; height:120px; display:block; margin:0 auto;">
            <h4>📄 หนังสือขอความยินยอมให้ สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans)...</h4>
            <div style="max-height:300px; overflow:auto; font-size:14px;">
                <p>ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 การที่สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ จะเก็บรวบรวม และใช้ข้อมูลใบหน้า (Facial Scans) ของท่านถือว่าเป็นการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลที่อ่อนไหว ที่วิทยาลัยฯ จะต้องให้ความคุ้มครองเป็นพิเศษ ดังนั้น</p>
                <p>สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ จึงขอความยินยอมจากท่านในการให้สำนักหอสมุดกลางเก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans) ของท่านเพื่อประโยชน์ในการยืนยันตัวตนของท่านสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ ของสำนักหอสมุดกลาง</p>
                <p>ในภายหลัง ท่านมีสิทธิที่จะถอนการยินยอมในการให้สำนักหอสมุดกลาง เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans) ของท่านในครั้งนี้ โดยท่านสามารถติดต่อเจ้าหน้าที่ดูแลระบบที่ kiattisak@g.swu.ac.th</p>
                <p>โดยสำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ จะรักษาข้อมูลส่วนบุคคลดังกล่าวของท่านไว้เป็นความลับและสำนักหอสมุดกลาง รับรองว่าจะมีการดำเนินการรักษาความปลอดภัยที่มีมาตรฐาน และจัดให้มีมาตรการด้านเทคนิคและการจัดการเพื่อป้องกันการเข้าถึงข้อมูลของท่านโดยมิชอบ </p>
                <p>ให้สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans) ของข้าพเจ้าเพื่อประโยชน์ในการยืนยันตัวตนของข้าพเจ้าสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ ของสำนักหอสมุดกลาง</p>
            </div><br>
            <div style="text-align:right; margin-top:15px;">
                <button id="pdpaDeclineBtn" type="button" class="btn btn-secondary">ไม่ยินยอม</button>
                <button id="pdpaAcceptBtn" type="button" class="btn btn-primary">ยินยอม</button>
=======
   <div id="pdpaModal">
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
            <div>
                <!-- ส่วน Header -->
                <div style="text-align: center; flex-shrink: 0;">
                    <img src="./PDF/lib_icon.png"
                        style="max-width: 220px; height: auto; display: block; margin: 0 auto 10px;">
                    <h4 style="font-size: 15px; margin: 0 0 10px 0; line-height: 1.4;">
                        หนังสือขอความยินยอมให้ สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ เก็บรวบรวมและใช้ข้อมูลใบหน้า
                        (Facial Scans) ของท่านเพื่อประโยชน์ในการยืนยันตัวตนของท่านสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ
                    </h4>
                </div>

                <!-- ส่วนข้อความที่เปิดให้เลื่อนอ่าน (Scroll Content) -->
                <div id="pdpaScrollBox">
                    <p>ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                        การที่สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ จะเก็บรวบรวม และใช้ข้อมูลใบหน้า (Facial Scans)
                        ของท่านถือว่าเป็นการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลที่อ่อนไหว ที่วิทยาลัยฯ
                        จะต้องให้ความคุ้มครองเป็นพิเศษ ดังนั้น</p>
                    <p>สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ
                        จึงขอความยินยอมจากท่านในการให้สำนักหอสมุดกลางเก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans)
                        ของท่านเพื่อประโยชน์ในการยืนยันตัวตนของท่านสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ
                        ของสำนักหอสมุดกลาง</p>
                    <p>ในภายหลัง ท่านมีสิทธิที่จะถอนการยินยอมในการให้สำนักหอสมุดกลาง เก็บรวบรวมและใช้ข้อมูลใบหน้า
                        (Facial Scans) ของท่านในครั้งนี้ โดยท่านสามารถติดต่อเจ้าหน้าที่ดูแลระบบที่ kiattisak@g.swu.ac.th
                    </p>
                    <p>โดยสำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ
                        จะรักษาข้อมูลส่วนบุคคลดังกล่าวของท่านไว้เป็นความลับและสำนักหอสมุดกลาง
                        รับรองว่าจะมีการดำเนินการรักษาความปลอดภัยที่มีมาตรฐาน
                        และจัดให้มีมาตรการด้านเทคนิคและการจัดการเพื่อป้องกันการเข้าถึงข้อมูลของท่านโดยมิชอบ</p>
                    <p style="margin-bottom: 0;">ให้สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ
                        เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans)
                        ของข้าพเจ้าเพื่อประโยชน์ในการยืนยันตัวตนของข้าพเจ้าสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ
                        ของสำนักหอสมุดกลาง</p>
                </div>

                <!-- ส่วน Footer และปุ่มกด -->
                <div style="flex-shrink: 0; margin-top: 10px;">
                    <!-- ลบข้อความแจ้งเตือนสีแดงออกได้เลย หรือซ่อนไว้ -->
                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" id="pdpaDeclineBtn" class="btn btn-secondary">ไม่ยินยอม</button>
                        <!-- ถอด disabled ออก เพื่อให้กดได้ทันที -->
                        <button type="button" id="pdpaAcceptBtn" class="btn btn-primary">ยินยอม</button>
                    </div>
                </div>
<<<<<<< HEAD
            </div>
        </div>

  

  <script src="./face-api.js-master/dist/face-api.min.js"></script>

<script>
(function () {
  var VERSION_URL = './js/version_register.json';       
  var SCRIPT_URL  = './js/register-face_new.js';         
  var STORAGE_KEY = 'registerJsVersion';

  function loadScript(url) {
    var s = document.createElement('script');
    s.src = url;
    s.async = false; // รักษาลำดับการรันให้เหมือน <script> ปกติ
    document.head.appendChild(s);
  }

  function fallbackLoad() {
    // เผื่อกรณี fetch version.json ล้มเหลว (เช่น ยังไม่ได้สร้างไฟล์ หรือ network พลาด)
    // ยังโหลด register.js ให้ได้ตามปกติ โดยแปะ timestamp กันไว้เป็นเซฟตี้เน็ต
    loadScript(SCRIPT_URL + '?v=' + Date.now());
  }

  async function clearOldCachesIfNeeded() {
    try {
      // ล้าง Cache Storage API (เผื่อมี Service Worker เก็บไฟล์นี้ไว้)
      if (window.caches && caches.keys) {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      }
      // ยกเลิก Service Worker ทั้งหมดของหน้านี้ (ถ้ามี)
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        var regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(function (r) { return r.unregister(); }));
      }
    } catch (e) {
      console.warn('clearOldCachesIfNeeded:', e);
    }
  }

  async function boot() {
    try {
      // cache: 'no-store' บังคับให้เบราว์เซอร์ยิง network จริงเสมอ
      // ไม่ใช้ค่าจาก HTTP cache เลย ไม่ว่า server จะตั้ง header ไว้อย่างไร
      var res = await fetch(VERSION_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('version.json fetch failed: ' + res.status);

      var data = await res.json();          // คาดหวังรูปแบบ { "version": "2026-08-28-01" }
      var latestVersion = String(data.version || Date.now());
      var storedVersion = localStorage.getItem(STORAGE_KEY);

    console.log('%c📄 Version ใน version_register.json (บนเซิร์ฟเวอร์):', 'color:#2196F3;', latestVersion);
    console.log('%c💾 Version ที่เครื่องนี้เคยจำไว้ (localStorage):', 'color:#2196F3;', storedVersion || '(ยังไม่เคยโหลด)');

      if (storedVersion !== latestVersion) {
        console.log('🔄 พบเวอร์ชันใหม่ (' + storedVersion + ' -> ' + latestVersion + ') กำลังล้างแคชและโหลดไฟล์ใหม่');
        await clearOldCachesIfNeeded();
        localStorage.setItem(STORAGE_KEY, latestVersion);
        loadScript(SCRIPT_URL + '?v=' + encodeURIComponent(latestVersion));
      } else {
        // เวอร์ชันเดิม ให้เบราว์เซอร์ใช้ cache ปกติได้ (เร็วกว่า ไม่ต้องยิงใหม่ทุกครั้ง)
        console.log('✔️ Version ตรงกับที่เครื่องนี้เคยโหลดไว้แล้ว ใช้ไฟล์เดิม (cache ปกติ)');
        loadScript(SCRIPT_URL + '?v=' + encodeURIComponent(latestVersion));
      }
    } catch (e) {
      console.warn('⚠️ ตรวจสอบเวอร์ชันไม่สำเร็จ ใช้ fallback:', e);
      fallbackLoad();
    }
  }

  boot();
})();
</script>
    <script>
        const SESSION_TIMEOUT = <?= SESSION_TIMEOUT ?>;
      (function () {
            const CHECK_INTERVAL = 30000;
            let remaining = SESSION_TIMEOUT;

            const display = document.getElementById('time-left');
            if (!display) return;

            function format(sec) {
                const m = Math.floor(sec / 60);
                const s = sec % 60;
                return `${m}:${String(s).padStart(2, '0')}`;
            }

            function logoutAndRedirect() {
                fetch('logout.php', {
                        method: 'POST',
                        credentials: 'same-origin'
                    })
                    .finally(() => {
                        window.location.href = 'login.php?timeout=1';
                    });
            }

            function tick() {
                remaining--;
                if (remaining <= 0) {
                    display.textContent = '0:00';
                    logoutAndRedirect();
                    return;
                }
                display.textContent = format(remaining);
            }

            function checkSession() {
                fetch('check_session.php', {
                        credentials: 'same-origin'
                    })
                    .then(res => {
                        if (res.status === 401 || res.status === 440) {
                            logoutAndRedirect();
                            return null;
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (!data) return;
                        if (data.status === 'expired') logoutAndRedirect();
                        if (data.status === 'ok') remaining = SESSION_TIMEOUT;
                    })
                    .catch(err => console.error('Session check error:', err));
            }

            display.textContent = format(remaining);
            setInterval(tick, 1000);
            setInterval(checkSession, CHECK_INTERVAL);
        })();


        /* ==========================================
           2. ระบบควบคุม PDPA Modal
           ========================================== */
        document.addEventListener('DOMContentLoaded', () => {
            const pdpaModal = document.getElementById('pdpaModal');
            const acceptBtn = document.getElementById('pdpaAcceptBtn');
            const declineBtn = document.getElementById('pdpaDeclineBtn');
            const scrollNotice = document.getElementById('scrollNotice');

            // ปล่อยปุ่มให้กดได้ทันที + ซ่อนข้อความแจ้งเตือนสีแดง
            if (acceptBtn) acceptBtn.disabled = false;
            if (scrollNotice) scrollNotice.style.display = 'none';

            window.openPdpaModal = function () {
                if (!pdpaModal) return;
                pdpaModal.classList.add('active');
                document.body.classList.add('modal-open');
            };

            window.closePdpaModal = function () {
                if (!pdpaModal) return;
                pdpaModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            };

            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    window.pdpaAccepted = true;
                    window.closePdpaModal();

                    if (typeof allowCam !== 'undefined') {
                        allowCam = true;
                        const allowCamBtn = document.getElementById('AllowCamBtn');
                        if (allowCamBtn) allowCamBtn.textContent = 'ปิดกล้อง';
                        if (typeof updateCameraPanel === 'function') {
                            updateCameraPanel();
                        }
                    }
                });
            }

            if (declineBtn) {
                declineBtn.addEventListener('click', () => {
                    window.pdpaAccepted = false;
                    window.closePdpaModal();
                });
            }
        });
    </script>


=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
            </div>
        </div>

<<<<<<< HEAD
    <div id="session-timer" style="position:fixed;bottom:10px;right:10px; background:#222;color:#fff; padding:8px 12px;border-radius:6px; font-size:14px;z-index:9999">
        เหลือเวลา: <span id="time-left">--:--</span>
    </div>

    <script src="./face-api.js-master/dist/face-api.min.js"></script>
    <script src="./js/register-face_new.js"></script>
    <script>
    (function() {
        const CHECK_INTERVAL = 30000;
        let remaining = SESSION_TIMEOUT;
        const display = document.getElementById('time-left');
        if (!display) return;
=======
  

    <script src="./face-api.js-master/dist/face-api.min.js"></script>
   <script src="./js/register-face_new.js"></script> 

    <script>
(function () {
  var VERSION_URL = './js/version_register.json';       
  var SCRIPT_URL  = './js/register-face_new.js';         
  var STORAGE_KEY = 'registerJsVersion';

  function loadScript(url) {
    var s = document.createElement('script');
    s.src = url;
    s.async = false; // รักษาลำดับการรันให้เหมือน <script> ปกติ
    document.head.appendChild(s);
  }

  function fallbackLoad() {
    // เผื่อกรณี fetch version.json ล้มเหลว (เช่น ยังไม่ได้สร้างไฟล์ หรือ network พลาด)
    // ยังโหลด register.js ให้ได้ตามปกติ โดยแปะ timestamp กันไว้เป็นเซฟตี้เน็ต
    loadScript(SCRIPT_URL + '?v=' + Date.now());
  }
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)

  async function clearOldCachesIfNeeded() {
    try {
      // ล้าง Cache Storage API (เผื่อมี Service Worker เก็บไฟล์นี้ไว้)
      if (window.caches && caches.keys) {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      }
      // ยกเลิก Service Worker ทั้งหมดของหน้านี้ (ถ้ามี)
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        var regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(function (r) { return r.unregister(); }));
      }
    } catch (e) {
      console.warn('clearOldCachesIfNeeded:', e);
    }
  }

<<<<<<< HEAD
        let isLoggingOut = false;
        function logoutAndRedirect() {
            if (isLoggingOut) return;
            isLoggingOut = true;
            alert('กรุณาเข้าสู่ระบบใหม่');
            fetch('logout.php', {
                method: 'POST',
                credentials: 'same-origin'
            }).finally(() => {
                window.location.href = 'login.php?timeout=1';
            });
        }

        function tick() {
            remaining--;
            if (remaining <= 0) {
                display.textContent = '0:00';
                logoutAndRedirect();
                return;
=======
  async function boot() {
    try {
      // cache: 'no-store' บังคับให้เบราว์เซอร์ยิง network จริงเสมอ
      // ไม่ใช้ค่าจาก HTTP cache เลย ไม่ว่า server จะตั้ง header ไว้อย่างไร
      var res = await fetch(VERSION_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('version.json fetch failed: ' + res.status);

      var data = await res.json();          // คาดหวังรูปแบบ { "version": "2026-08-28-01" }
      var latestVersion = String(data.version || Date.now());
      var storedVersion = localStorage.getItem(STORAGE_KEY);

      if (storedVersion !== latestVersion) {
        console.log('🔄 พบเวอร์ชันใหม่ (' + storedVersion + ' -> ' + latestVersion + ') กำลังล้างแคชและโหลดไฟล์ใหม่');
        await clearOldCachesIfNeeded();
        localStorage.setItem(STORAGE_KEY, latestVersion);
        loadScript(SCRIPT_URL + '?v=' + encodeURIComponent(latestVersion));
      } else {
        // เวอร์ชันเดิม ให้เบราว์เซอร์ใช้ cache ปกติได้ (เร็วกว่า ไม่ต้องยิงใหม่ทุกครั้ง)
        loadScript(SCRIPT_URL + '?v=' + encodeURIComponent(latestVersion));
      }
    } catch (e) {
      console.warn('⚠️ ตรวจสอบเวอร์ชันไม่สำเร็จ ใช้ fallback:', e);
      fallbackLoad();
    }
  }

  boot();
})();
</script>
    <script>
      (function () {
            const CHECK_INTERVAL = 30000;
            let remaining = SESSION_TIMEOUT;

            const display = document.getElementById('time-left');
            if (!display) return;

            function format(sec) {
                const m = Math.floor(sec / 60);
                const s = sec % 60;
                return `${m}:${String(s).padStart(2, '0')}`;
            }

            function logoutAndRedirect() {
                fetch('logout.php', {
                        method: 'POST',
                        credentials: 'same-origin'
                    })
                    .finally(() => {
                        window.location.href = 'login.php?timeout=1';
                    });
            }

            function tick() {
                remaining--;
                if (remaining <= 0) {
                    display.textContent = '0:00';
                    logoutAndRedirect();
                    return;
                }
                display.textContent = format(remaining);
            }

            function checkSession() {
                fetch('check_session.php', {
                        credentials: 'same-origin'
                    })
                    .then(res => {
                        if (res.status === 401 || res.status === 440) {
                            logoutAndRedirect();
                            return null;
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (!data) return;
                        if (data.status === 'expired') logoutAndRedirect();
                        if (data.status === 'ok') remaining = SESSION_TIMEOUT;
                    })
                    .catch(err => console.error('Session check error:', err));
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
            }
            display.textContent = format(remaining);
            setInterval(tick, 1000);
            setInterval(checkSession, CHECK_INTERVAL);
        })();

<<<<<<< HEAD
        function checkSession() {
            fetch('check_session.php', { credentials: 'same-origin' })
                .then(res => {
                    if (res.status === 401 || res.status === 440) {
                        logoutAndRedirect();
                        return null;
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data) return;
                    if (data.status === 'expired') logoutAndRedirect();
                })
                .catch(err => { console.error('Session check error:', err); });
        }

        display.textContent = format(remaining);
        setInterval(tick, 1000);
        setInterval(checkSession, CHECK_INTERVAL);
    })();
=======

        /* ==========================================
           2. ระบบควบคุม PDPA Modal
           ========================================== */
        document.addEventListener('DOMContentLoaded', () => {
            const pdpaModal = document.getElementById('pdpaModal');
            const acceptBtn = document.getElementById('pdpaAcceptBtn');
            const declineBtn = document.getElementById('pdpaDeclineBtn');
            const scrollNotice = document.getElementById('scrollNotice');

            // ปล่อยปุ่มให้กดได้ทันที + ซ่อนข้อความแจ้งเตือนสีแดง
            if (acceptBtn) acceptBtn.disabled = false;
            if (scrollNotice) scrollNotice.style.display = 'none';

            window.openPdpaModal = function () {
                if (!pdpaModal) return;
                pdpaModal.classList.add('active');
                document.body.classList.add('modal-open');
            };

            window.closePdpaModal = function () {
                if (!pdpaModal) return;
                pdpaModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            };

            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    window.pdpaAccepted = true;
                    window.closePdpaModal();

                    if (typeof allowCam !== 'undefined') {
                        allowCam = true;
                        const allowCamBtn = document.getElementById('AllowCamBtn');
                        if (allowCamBtn) allowCamBtn.textContent = 'ปิดกล้อง';
                        if (typeof updateCameraPanel === 'function') {
                            updateCameraPanel();
                        }
                    }
                });
            }

            if (declineBtn) {
                declineBtn.addEventListener('click', () => {
                    window.pdpaAccepted = false;
                    window.closePdpaModal();
                });
            }
        });
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
    </script>
<<<<<<< HEAD


<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
</body>

</html>