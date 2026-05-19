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