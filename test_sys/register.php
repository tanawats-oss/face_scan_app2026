<?php
session_start();

/* ================== CONFIG ================== */
define('SESSION_TIMEOUT', 5000); // วินาที

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
<a href='https://lib.swu.ac.th/app/face_scan/test_sys/login.php'><button >กลับหน้า Login</button>";
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Face Capture & Update Template</title>
    <link rel="stylesheet" href="../css/face_scan.css">
    <script>
    const SESSION_TIMEOUT = <?= SESSION_TIMEOUT ?>;
    </script>
</head>

<body>
    <?php echo $userId; ?>

    <div class="container">
        <form id="editUserForm" action="" method="post">

            <!-- ================== Face Template ================== -->
            <div class="panel" id="facePanel">
                <h4>Face Template</h4>
                <?php if (!$hasFacePermission): ?>
                <div class="center">
                    <img src="./no_face.png" style="max-width:200px;opacity:.6">
                    <p>ยังไม่ได้เปิดใช้งานใบหน้า</p>
                </div>
                <?php else: ?>
                <?php
          $faceResp = json_decode(
              callApi("https://lib.swu.ac.th/app/ci4_new/public/apidoor/showFaceTemplate/" . urlencode($userId)),
              true
          );
                    ?>
                <?php if (!empty($faceResp['template'])): ?>
                <div class="center">
                    <img src="data:image/jpeg;base64,<?= $faceResp['template'] ?>" style="max-width:200px">
                </div>
                <div class="center">
                    <p>ขนาดรูป: <?= $faceResp['size'] ?? 0 ?> bytes</p>
                </div>
                <?php else: ?>
                <div class="center">
                    <img src="./no_face.png" style="max-width:100px">
                </div>
                <div class="center">
                    <p>⚠️ ยังไม่มีข้อมูลใบหน้า</p>
                </div>
                <?php endif; ?>
                <?php endif; ?>
            </div>

            <!-- ================== USER INFO ================== -->
            <div class="col-md-6 mb-3">
                <label>ID</label>
                <input class="form-control" name="ID" value="<?= htmlspecialchars($userId) ?>" readonly>
            </div>
            <div class="col-md-6 mb-3">
                <label>Unique ID</label>
                <input class="form-control" name="UniqueID" value="<?= htmlspecialchars($userId) ?>" readonly>
            </div>

            <div class="col-md-6 mb-3">
                <label>ชื่อผู้ใช้</label>
                <input class="form-control" name="Name" value="<?= htmlspecialchars($fullName) ?>" readonly>
            </div>
            <div class="col-md-6 mb-3">
                <label>Employee Number</label>
                <input class="form-control" name="EmployeeNo" value="">
            </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
                <label>คณะ/สังกัดหน่วยงาน</label>
                <input class="form-control" name="Faculty" value="<?= htmlspecialchars($faculty_th) ?>" readonly>
                <input type="hidden" name="Position" value="<?= htmlspecialchars($faculty_num) ?>">
            </div>
            <div class="col-md-6 mb-3">
                <label>สาขา/ส่วนงาน</label>
                <input class="form-control" name="Department" value="<?= htmlspecialchars($departMent) ?>" readonly>
            </div>
            <div class="col-md-6 mb-3">
                <label>ตำแหน่ง (AccessGroupCode)</label>
                <select class="form-control" name="UserType">
                    <option value="">----------กรุณาเลือก----------</option>
                    <option value="3000" <?= $userType == 'student' ? 'selected' : '' ?>>นิสิต (3000)</option>
                    <option value="1000" <?= $userType == 'staff' ? 'selected' : '' ?>>บุคลากร (1000)</option>
                    <option value="9999" <?= ($userType == 'testlib007' || $userType == 'testlib008') ? 'selected' : '' ?>>ทดสอบระบบ</option>
                </select>
                <input type="hidden" name="AccessGroupCode" value="<?= ($userType == 'student' ? '3000' : '1000') ?>">
            </div>
        </div>

        <div class="row">
            <div class="col-md-4 mb-3">
                <label>Email</label>
                <input class="form-control" name="Email" value="<?= htmlspecialchars($userMail) ?>" readonly>
            </div>
            <div class="col-md-4 mb-3">
                <label>Phone</label>
                <input class="form-control" name="Phone" value="" readonly>
            </div>
            <div class="col-md-4 mb-3">
                <label>Privilege</label>
                <input class="form-control" name="Privilege" value="0" readonly> </div>
        </div>

        <div class="row">
            <div class="col-md-4 mb-3">
                <label>Regist Date</label>
                <input class="form-control" name="RegistDate" value="<?= date('Y-m-d H:i:s') ?>" readonly>
            </div>
            <div class="col-md-4 mb-3">
                <label>Expire Date</label>
                <input class="form-control" name="ExpireDate" value="<?= date('Y-m-d H:i:s', strtotime('+1 year')) ?>" readonly>
            </div>
            <div class="col-md-4 mb-3">
                <label>Blacklist</label>
                <input class="form-control" name="Blacklist" value="0" readonly>
            </div>
        </div>

        <input type="hidden" name="GroupCode" value="0">
        <input type="hidden" name="VerifyLevel" value="0">

        <br>
        <h4 class="mt-4">ข้อมูลบัตร (UserCardInfo)</h4>
        <p><b>Card Number:</b> 
            <input class="form-control" name="CardNum[]" value="<?= htmlspecialchars($userId) ?>">
        </p>

        <br>
        <h4 class="mt-5">สิทธิ์การใช้งาน (AuthInfo)</h4>
        <table class="table table-sm">
            <tr>
                <td>เปิด-ปิดการใช้สแกนใบหน้า</td>
                <td>
                    <label>
                        <input type="checkbox" id="AllowFaceRegister" name="AllowFaceRegister"
                            <?= $hasFacePermission ? 'checked' : '' ?>>
                        อนุญาตลงทะเบียนใบหน้า
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
        <br>

        <!-- ================== Camera & Capture ================== -->
        <div class="panel" id="Newtakephoto" name="Newtakephoto" style="display:none">

            <h2>ถ่ายรูป อัพเดทรูปใหม่</h2>

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

            <!-- ปุ่มถ่ายรูปหลัก -->
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

            <!-- RESULT -->
            <div class="panel-result" style="display:none;">
                <div class="stage row center">
                    <div class="result-container">
                        <h3>Result (300×300)</h3>
                        <canvas id="out" width="300" height="300"></canvas>
                    </div>
                </div>

                <div style="margin-top:10px;">
                    <div class="row btn-row">
                        <button id="retakeBtn" class="btn-muted">
                            🔁 ถ่ายรูปใหม่
                        </button>


                    </div>
                </div>
            </div>

        </div>
        <!-- Regis button -->
        <div class="panel" style="text-align:center;">
            <!-- <button type="submit" class="register">บันทึกข้อมูล</button> -->
            <button type="button" id="updateServerBtn" class="btn-update btn-large">
                บันทึกข้อมูล
            </button>
        </div>
        </form>

        <!-- Logout button -->
        <div class="panel" style="text-align:center;">
            <form action="logout.php" method="post">
                <button type="submit" class="danger">ออกจากระบบ</button>
            </form>
        </div>
    </div>


    <!-- ===============     PDPA        =================== -->
    <div id="pdpaModal" style="
  display:none;
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.6);
  z-index:9999;
">
        <div style="
    max-width:600px;
    margin:10vh auto;
    background:#fff;
    padding:20px;
    border-radius:8px;
  ">
            <img src="./PDF/lib_icon.png" style="width:300px; height:120px; display:block; margin:0 auto;">
            <h4>📄 หนังสือขอความยินยอมให้ สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial
                Scans) ของท่านเพื่อประโยชน์ในการยืนยันตัวตนของท่านสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ</h4>

            <div style="max-height:300px; overflow:auto; font-size:14px;">
                <p>
                    ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 การที่สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ
                    จะเก็บรวบรวม และใช้ข้อมูลใบหน้า (Facial Scans)
                    ของท่านถือว่าเป็นการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลที่อ่อนไหว ที่วิทยาลัยฯ
                    จะต้องให้ความคุ้มครองเป็นพิเศษ ดังนั้น</p>
                <p>สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ
                    จึงขอความยินยอมจากท่านในการให้สำนักหอสมุดกลางเก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans)
                    ของท่านเพื่อประโยชน์ในการยืนยันตัวตนของท่านสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ ของสำนักหอสมุดกลาง
                </p>
                <p>ในภายหลัง ท่านมีสิทธิที่จะถอนการยินยอมในการให้สำนักหอสมุดกลาง เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial
                    Scans) ของท่านในครั้งนี้ โดยท่านสามารถติดต่อเจ้าหน้าที่ดูแลระบบที่ kiattisak@g.swu.ac.th</p>
                <p>โดยสำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ
                    จะรักษาข้อมูลส่วนบุคคลดังกล่าวของท่านไว้เป็นความลับและสำนักหอสมุดกลาง
                    รับรองว่าจะมีการดำเนินการรักษาความปลอดภัยที่มีมาตรฐาน
                    และจัดให้มีมาตรการด้านเทคนิคและการจัดการเพื่อป้องกันการเข้าถึงข้อมูลของท่านโดยมิชอบ </p>
                <p>ให้สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans)
                    ของข้าพเจ้าเพื่อประโยชน์ในการยืนยันตัวตนของข้าพเจ้าสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ
                    ของสำนักหอสมุดกลาง</p>
            </div><br>

            <div style="text-align:right; margin-top:15px;">
                <button id="pdpaDeclineBtn" class="btn btn-secondary">
                    ไม่ยินยอม
                </button>
                <button id="pdpaAcceptBtn" class="btn btn-primary">
                    ยินยอม
                </button>
            </div>
        </div>
    </div>



    <!-- Session box -->
    <div id="session-timer" style="position:fixed;bottom:10px;right:10px;
            background:#222;color:#fff;
            padding:8px 12px;border-radius:6px;
            font-size:14px;z-index:9999">
        เหลือเวลา: <span id="time-left">--:--</span>
    </div>

    <!-- java script -->
    <script src="./face-api.js-master/dist/face-api.min.js"></script>
    <script src="./js/register.js"></script>
    <script>
    (function() {

        const CHECK_INTERVAL = 30000;
        let remaining = SESSION_TIMEOUT;

        const display = document.getElementById('time-left');
        if (!display) return;

        function format(sec) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `${m}:${String(s).padStart(2, '0')}`;
        }

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

                    if (data.status === 'expired') {
                        logoutAndRedirect();
                    }

                    if (data.status === 'ok') {
                        // reset เวลาใหม่ให้ตรง server
                        // remaining = SESSION_TIMEOUT;
                    }
                })
                .catch(err => {
                    console.error('Session check error:', err);
                });
        }

        // เริ่มต้นแสดงเวลา
        display.textContent = format(remaining);

        setInterval(tick, 1000);
        setInterval(checkSession, CHECK_INTERVAL);

    })();
    </script>

</body>

</html>