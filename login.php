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
    <title>ระบบลงทะเบียนใบหน้า</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        /* CSS จัดหน้า Login (บังคับแนวตั้ง เพื่อไม่ให้เลย์เอาต์ซ้อน) */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f5f7fa;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 15px;
        }

        .login-card {
            background: #ffffff;
            width: 100%;
            max-width: 380px;
            padding: 30px 35px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
            z-index: 1;
        }

        .login-card h2 {
            text-align: center;
            color: #0d6efd;
            margin-top: 0;
        }

        .form-group {
            margin-bottom: 15px;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            box-sizing: border-box;
        }

        .btn-login {
            width: 100%;
            padding: 12px;
            background: #0d6efd;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }

        /* Loading Overlay */
        .loading-overlay {
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.9);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e0e0e0;
            border-top: 4px solid #0d6efd;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>

<body>

    <script>
        (function() {
            const ua = navigator.userAgent;
            const isLine = /Line/i.test(ua);
            const isAndroid = /Android/i.test(ua);

            // 🟢 LOGIC ใหม่: 
            // ถ้า "ไม่ใช่ LINE" หรือ "ไม่ใช่ Android" (แปลว่าเป็น iOS หรือ PC) 
            // ให้ return ออกไปเลย (เพื่อไปแสดงหน้า Login ด้านล่าง)
            if (!isLine || !isAndroid) return;

            // -----------------------------------------------------------
            // ส่วนด้านล่างนี้จะทำงานเฉพาะ "Android ที่เปิดผ่าน LINE" เท่านั้น
            // -----------------------------------------------------------

            const domainPath = "lib.swu.ac.th/app/face_scan/login.php";
            const fullUrl = "https://" + domainPath;

            document.documentElement.innerHTML = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>กรุณาเปิดผ่าน Browser</title>
  <style>
    body {
        margin:0; padding:20px; display:flex; flex-direction:column;
        justify-content:center; align-items:center; min-height:100vh;
        background:#f0f2f5; font-family:sans-serif; text-align:center;
    }
    .box {
        background:#fff; padding:40px 30px; border-radius:16px;
        box-shadow:0 10px 30px rgba(0,0,0,0.1); width:100%; max-width:320px;
    }
    .icon-warn { font-size:60px; margin-bottom:15px; }
    h2 { color:#333; margin:0 0 10px 0; font-size:22px; }
    p { color:#666; font-size:16px; line-height:1.6; margin-bottom:30px; }
    
    .btn-main {
        display:block; width:100%; padding:14px; border-radius:12px;
        background: #06c755; color: white; text-decoration: none;
        font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(6, 199, 85, 0.3);
        box-sizing: border-box; margin-bottom: 15px;
    }
    .btn-copy {
        background: #f1f5f9; border: 1px solid #cbd5e1;
        color: #475569; padding: 12px 20px; border-radius: 12px; 
        font-size: 15px; cursor: pointer; width: 100%; font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="icon-warn">⚠️</div>
    <h2>Android โปรดทราบ</h2>
    <p>เพื่อการใช้งานกล้องที่สมบูรณ์<br>กรุณาเปิดผ่าน Browser หลัก</p>

    <a href="intent://${domainPath}#Intent;scheme=https;end" class="btn-main">
       🚀 แตะเพื่อเปิด Browser
    </a>

    <button onclick="navigator.clipboard.writeText('${fullUrl}'); alert('คัดลอกแล้ว');" class="btn-copy">
       📋 คัดลอกลิงก์
    </button>
  </div>
</body>
</html>
  `;
        })();
    </script>


     <div class="login-card">
        <img src="SWU_Central_Library_EN_Color.png" class="center" alt="Lib_Logo" width="500 px" height="150 px"
        style="display: block;
            margin-left: auto;
            margin-right: auto;
            width: 100%;">
        <h2>Selfie to Scan<br>ระบบลงทะเบียนใบหน้าอัตโนมัติ<br>(LIBSWU Automated Face Registration System)</h2><br>
        <form method="post" action="auth.php" onsubmit="return showLoading()">
            <div class="form-group">
                <label for="user_login">รหัสบัวศรี (Buasri ID)</label>
                <input type="text" id="user_login" name="user_login" required placeholder="รหัสบัวศรี (Buasri ID)">
            </div>
            <div class="form-group">
                <label for="user_password">รหัสผ่าน (Password)</label>
                <input type="password" id="user_password" name="user_password" required placeholder="รหัสผ่าน (Password)">
            </div>
            <button type="submit" class="btn-login">เข้าสู่ระบบ</button>
        </form>
    </div>

    <div class="loading-overlay" id="loadingOverlay">
        <div class="spinner"></div>
    </div>
<footer style="
    margin-top:40px;
    text-align:center;
    font-size:13px;
    color:#777;
">
    พัฒนาระบบโดย  
    <b>นายธนวัฒน์ เสริฐสุวรรณกุล</b>  
    <br>
    งานเทคโนโลยีวิทยทรัพยากรดิจิทัล  
</footer>

    <script>
        function showLoading() {
            document.getElementById('loadingOverlay').style.display = 'flex';
        }

        function handleLoginSubmit() {
            showLoading();

            const buasriId = document.getElementById('user_login').value;

            // ✅ log แค่ว่า "พยายาม login"
            fetch('/app/ci4_new/public/api/login-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    buasri_id: buasriId,
                    status: 'attempt'
                })
            }).catch(() => {});

            return true; // ให้ auth.php ทำงานต่อ
        }
    </script>

</body>

</html>