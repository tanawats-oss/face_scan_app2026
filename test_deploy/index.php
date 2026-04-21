<?php
session_start();

define('SESSION_TIMEOUT', 600); // 10 นาที

// ยังไม่ login
if (empty($_SESSION['auth_ldap'])) {
    header("Location: login.php");
    exit;
}

// หมดเวลา
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

// ต่ออายุ session ทุกครั้งที่ใช้งาน
// $_SESSION['last_activity'] = time();


/* ===== ป้องกัน Cache (สำคัญกับ Edge) ===== */
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
?>

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


<!DOCTYPE html>
<html lang="th">

<head>
  <meta charset="UTF-8">
  <meta name="author" content="นายธนวัฒน์ เสริฐสุวรรณกุล">
  <meta name="developer-email" content="tanawats@g.swu.ac.th">
  <meta name="system" content="Face Recognition Registration System">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Face Capture & Update </title>
  <link rel="stylesheet" href="../css/face_scan.css">
  <script>
    const SESSION_TIMEOUT = <?= SESSION_TIMEOUT ?>;
  </script>
</head>

<body>


  <div class="container">
      <!-- countdown -->
  <div id="session-timer"
    style="position:fixed;top:10px; right:10px;
            background:#222;color:#fff;
            padding:8px 12px;border-radius:6px;
            font-size:14px;z-index:9999">
    Session เหลือเวลา: <span id="time-left">--:--</span>
  </div>
    <?php
    session_start();
$buasri_id = $_SESSION['user_login'] ?? '';


/* ================== helper ================== */
function callApi($url)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_SSL_VERIFYPEER => false
    ]);
    $resp = curl_exec($ch);
    curl_close($ch);
    return $resp ?: false;
}
/* ================== error + redirect ================== */
function redirectToRegister($buasri_id)
{
    // ลบข้อมูล session ทั้งหมด
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION = [];

    // ทำลาย session
    session_destroy();
    echo "
    <div style='min-height:100vh;display:flex;justify-content:center;align-items:center;'>
        <div style='background:#ffffff;width:100%;max-width:420px;padding:30px;
                    border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.08);
                    text-align:center;font-size:16px;'>
            ❌ <b>{$buasri_id}</b> : ไม่พบข้อมูลผู้ใช้บริการ<br>
           กรุณาติดต่อเจ้าหน้าที่...
        </div>
    </div>
    <script>
        setTimeout(() => window.location.href = 'login.php', 2000);
    </script>";
    exit;
}


/* ================== ตรวจ session ================== */
if (!isset($_SESSION['peson_id'])) {
    redirectToRegister($buasri_id);
}

 $person_id = trim($_SESSION['peson_id']);
// $person_id = trim('701011');
//ตรวจจำนวนหลัก
$length = strlen($person_id);
echo "<p><b>รหัสผู้ใช้บริการ:</b> {$person_id}</p>";
echo "<p><b>จำนวนหลัก:</b> {$length}</p>";

/* ================== userList ================== */
$apiUrl = "https://lib.swu.ac.th/app/ci4_new/public/apidoor/userList"
  . "?person_id={$person_id}"
  . "&searchCategory=UniqueID"
  . "&groupID=0&subInclude=true&offset=0&limit=10";

$data = json_decode(callApi($apiUrl), true);

//  filter หา “คนจริง”
$userInfo = null;

if (!empty($data['users'])) {
    foreach ($data['users'] as $u) {

        //  debug (เปิดตอนทดสอบ)
        // echo "<p>API เจอ: {$u['UniqueID']}</p>";

        if (isset($u['UniqueID']) && $u['UniqueID'] === $person_id) {
            $userInfo = $u;
            break;
        }
    }
}

//  ตรวจผลลัพธ์แบบชัดเจน
if (!$userInfo) {
    echo "<p style='color:red;'>❌ ไม่พบผู้ใช้ที่ตรงกับรหัส {$person_id}</p>";
    redirectToRegister($buasri_id);
    exit;
}

//  ยืนยันความถูกต้อง 100%
if (!isset($userInfo['UniqueID']) || $userInfo['UniqueID'] !== $person_id) {
    echo "<p style='color:red;'>❌ ข้อมูลไม่ตรง</p>";
    exit;
}

// ✅ ผ่านแล้ว
echo "<p style='color:green;'>✔️ พบผู้ใช้: {$userInfo['Name']}</p>";

// 🔥 กัน undefined index
if (!isset($userInfo['ID'])) {
    echo "<p style='color:red;'>❌ ไม่มี ID ในข้อมูล</p>";
    exit;
}

$userId = $userInfo['ID'];
echo "
    <h2 style='text-align:center;'>ทดสอบ ระบบลงทะเบียนสแกนใบหน้า</h2>";



/* ================== userDetail ================== */
$detailResp = json_decode(
    callApi("https://lib.swu.ac.th/app/ci4_new/public/apidoor/userDetail/" . urlencode($userId)),
    true
);

if (!$detailResp || ($detailResp['status'] ?? '') !== 'success') {
    echo "<p>⚠️ {$userId} : ไม่พบข้อมูลผู้ใช้บริการ กรุณาติดต่อเจ้าหน้าที่</p>";
    exit;
}

$detail = $detailResp['userDetail'];
$userInfoDetail = $detail['UserInfo'];


/* ================== ตรวจสิทธิ์ใบหน้า ================== */
$authInfo = $userInfoDetail['AuthInfo'] ?? [];
$hasFacePermission = in_array(9, $authInfo, true);
?>





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
        <img src="./PDF/lib_icon.png"
          style="width:300px; height:120px; display:block; margin:0 auto;">
        <h4>หนังสือขอความยินยอมให้ สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans) ของท่านเพื่อประโยชน์ในการยืนยันตัวตนของท่านสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ</h4>

        <div style="max-height:300px; overflow:auto; font-size:14px;">
          <p>
            ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 การที่สำนักหอสมุดกลางมหาวิทยาลัยศรีนครินทรวิโรฒ จะเก็บรวบรวม และใช้ข้อมูลใบหน้า (Facial Scans) ของท่านถือว่าเป็นการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลที่อ่อนไหว ที่วิทยาลัยฯ จะต้องให้ความคุ้มครองเป็นพิเศษ ดังนั้น</p>
          <p>สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ จึงขอความยินยอมจากท่านในการให้สำนักหอสมุดกลางเก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans) ของท่านเพื่อประโยชน์ในการยืนยันตัวตนของท่านสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ ของสำนักหอสมุดกลาง</p>
          <p>ในภายหลัง ท่านมีสิทธิที่จะถอนการยินยอมในการให้สำนักหอสมุดกลาง เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans) ของท่านในครั้งนี้ โดยท่านสามารถติดต่อเจ้าหน้าที่ดูแลระบบที่ kiattisak@g.swu.ac.th</p>
          <p>โดยสำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ จะรักษาข้อมูลส่วนบุคคลดังกล่าวของท่านไว้เป็นความลับและสำนักหอสมุดกลาง รับรองว่าจะมีการดำเนินการรักษาความปลอดภัยที่มีมาตรฐาน และจัดให้มีมาตรการด้านเทคนิคและการจัดการเพื่อป้องกันการเข้าถึงข้อมูลของท่านโดยมิชอบ </p>
          <p>ให้สำนักหอสมุดกลาง มหาวิทยาลัยศรีนครินทรวิโรฒ เก็บรวบรวมและใช้ข้อมูลใบหน้า (Facial Scans) ของข้าพเจ้าเพื่อประโยชน์ในการยืนยันตัวตนของข้าพเจ้าสำหรับบันทึกการเข้า-ออกพื้นที่ต่าง ๆ ของสำนักหอสมุดกลาง</p>
        </div><br>

        <div style="text-align:right; margin-bottom:15px; margin-top:0px; ">
          <button id="pdpaDeclineBtn" class="btn btn-secondary">
            ไม่ยินยอม
          </button>
          <button id="pdpaAcceptBtn" class="btn btn-primary">
            ยินยอม
          </button>
        </div>
      </div>
    </div>

    <!-- ================== ฟอร์มข้อมูลผู้ใช้ ================== -->
    <div class="panel">
      <h4>ข้อมูลผู้ใช้บริการ</h4>
      <div class="center">
        <form id="editUserForm" autocomplete="off">
          <table class="table table-bordered">
            <tr>
              <th>ข้อมูล</th>
              <th>รายละเอียด</th>
            </tr>
            <?php
              $hiddenFields = ['Privilege', 'CreateDate', 'UsePeriodFlag', 'RegistDate', 'ExpireDate', 'Password', 'GroupCode', 'AccessGroupCode', 'UserType', 'TimezoneCode', 'BlackList', 'FPIdentify', 'FaceIdentify', 'DuressFinger', 'Partition', 'APBExcept', 'APBZone', 'WorkCode', 'MealCode', 'MoneyCode', 'MessageCode', 'VerifyLevel', 'PositionCode', 'EmployeeNum', 'LoginPW', 'LoginAllowed', 'IrisIdentify', 'VoipUse', 'VoipDoorOpen', 'VoipAutoAnswer', 'Gender', 'Mobile', 'UnavailableTime', 'Birthday', 'Phone', 'Department', 'UserCardInfo', 'UniqueID', 'ID', 'Email', 'AuthInfo'];
$readonlyFields = ['ID', 'UniqueID', 'Name'];
foreach ($userInfoDetail as $key => $value) {
    if ($key === 'Picture' || in_array($key, $hiddenFields)) {
        $val = is_array($value) ? json_encode($value) : $value;
        echo "<input type='hidden' name='{$key}' value='" . htmlspecialchars($val) . "'>";
        continue;
    }
    $attr = in_array($key, $readonlyFields) ? 'readonly' : '';
    echo "<tr><td>{$key}</td><td>";
    if (is_array($value)) {
        echo "<textarea class='form-control' name='{$key}' {$attr}>" . htmlspecialchars(implode("\n", $value)) . "</textarea>";
    } else {
        echo "<input class='form-control' type='text' name='{$key}' value='" . htmlspecialchars($value) . "' {$attr}>";
    }
    echo "</td></tr>";
}
?>
            <tr>
              <td>เปิด-ปิดการใช้สแกนใบหน้า</td>
              <td>
                <label>
                  <input type="checkbox" id="AllowFaceRegister" name="AllowFaceRegister" <?= $hasFacePermission ? 'checked' : '' ?>>
                  อนุญาตลงทะเบียนใบหน้า
                </label>
              </td>
            </tr>
            <tr>
              <td>อนุญาตเปิดกล้อง</td>
              <td>
                <button
                  type="button"
                  id="AllowCamBtn"
                  class="btn btn-primary"
                  disabled>
                  เปิดกล้องถ่ายรูป
                </button>
              </td>
            </tr>
            <tr>
              <td>เอกสารยินยอมเก็บข้อมูลใบหน้า</td>
              <td>
                <a href="./PDF/ConsentBiometric.pdf" target="_blank">
                  คลิกเปิดอ่าน</a>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>

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
        <button id="captureBtn"
          type="button"
          class="btn-update btn-large"
          disabled>
          📸 ถ่ายรูป
        </button>
      </div>

      <div style="text-align:center; margin-top:10px;">
        <div id="status" style="font-size:20px;">
          กำลังเตรียมกล้อง…
        </div>
      </div>

      <!-- RESULT -->
      <div class="panel-result">
        <div class="stage row center">
          <div class="result-container">
            <h3>Result </h3>
            <canvas id="out" width="240" height="240"></canvas>
          </div>
        </div>

        <div style="margin-top:10px;">
          <div class="row btn-row">
            <button id="retakeBtn" class="btn-muted">
              📸 ถ่ายรูปใหม่
            </button>

            <button type="button" id="updateServerBtn" class="btn-update btn-large">
              ⬆️ อัพโหลดรูป
            </button>
          </div>
        </div>

      </div>
    </div>
    <!-- Update not use face -->
    <br>
    <div class="panel" id="updatedata" name="updatedata" style="text-align:center;">
      <button type="submit" id="btn-updatedata" name="btn-updatedata" class="btn-updatedata ">แก้ไขข้อมูล</button>
    </div>
    <!-- Row Logout -->
    <br>
    <div class="panel" style="text-align:center;">
      <form action="logout.php" method="post">
        <button type="submit" class="danger" style="font: size 16px;">ออกจากระบบ</button>
      </form>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div id="loadingOverlay" class="loading-overlay">
    <div class="loader"></div>
    <div class="loading-text">กำลังบันทึกข้อมูล...</div>
  </div>



  <footer style="
    margin-top:5px;
    text-align:center;
    font-size:13px;
    color:#777;
">
    พัฒนาระบบโดย
    <b>นายธนวัฒน์ เสริฐสุวรรณกุล</b>
    <br>
    งานเทคโนโลยีวิทยทรัพยากรดิจิทัล
  </footer>


  <script src="js/main.js"></script>
  <script src="./face-api.js-master/dist/face-api.min.js"></script>
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

      function logoutAndRedirect() {
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
              remaining = SESSION_TIMEOUT;
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