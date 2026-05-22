(async function () {

  /* =======================
     DOM
  ======================= */
  const video = document.getElementById('video');
  const overlay = document.getElementById('overlay');
  const outCanvas = document.getElementById('out');
  const status = document.getElementById('status');
  const videoContainer = document.getElementById('videoContainer');
  const panelResult = document.querySelector('.panel-result');
  const retakeBtn = document.getElementById('retakeBtn');

  const allowFaceCheckbox = document.querySelector("input[name='AllowFaceRegister']");
  const allowCamBtn = document.getElementById('AllowCamBtn');

  const panelNewphoto = document.getElementById('Newtakephoto');
  const panelFaceDB = document.getElementById('facePanel');
  // const panelUpdateData = document.getElementById('updatedata');


  const updateBtn = document.getElementById('updateServerBtn');
  const form = document.getElementById('editUserForm');
  const btnUpdateData = document.getElementById('btn-updatedata');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const captureBtn = document.getElementById('captureBtn');


  const pdpaModal = document.getElementById('pdpaModal');
  const pdpaAcceptBtn = document.getElementById('pdpaAcceptBtn');
  const pdpaDeclineBtn = document.getElementById('pdpaDeclineBtn');

  /* =======================
     Guard DOM
  ======================= */
  if (!video || !overlay || !outCanvas || !updateBtn || !form || !panelResult || !captureBtn) {
    console.error('❌ DOM ไม่ครบ');
    return;
  }

  /* =======================
     Loading
  ======================= */
  function showLoading(text = 'กำลังประมวลผล...') {
    if (!loadingOverlay) return;
    loadingOverlay.querySelector('.loading-text').textContent = text;
    loadingOverlay.style.display = 'flex';
  }

  function hideLoading() {
    if (!loadingOverlay) return;
    loadingOverlay.style.display = 'none';
  }

  /* =======================
     STATE
  ======================= */
  let pdpaAccepted = false; // ⭐ สถานะยินยอม PDPA

  let stream = null;
  let cameraStarted = false;
  let allowCam = false;

  let overlayRunning = false;

  let lastFaceBox = null;
  let overlayRect = null;

  let detecting = false;
  let lastDetectTime = 0;
  let oldFaceTemplate = window.oldFaceTemplate || null;

  const userFaceArray = [];
  function getAuthInfoValue() { return (allowFaceCheckbox && allowFaceCheckbox.checked) ? [2, 9, 30, 0, 0, 0, 0, 0] : [2, 0, 30, 0, 0, 0, 0, 0]; }

  /* =======================
    PDPA
  ======================= */

  function showPdpa() {
    pdpaModal.style.display = 'block';
  }

  function hidePdpa() {
    pdpaModal.style.display = 'none';
  }

  pdpaAcceptBtn.addEventListener('click', () => {
    pdpaAccepted = true;
    hidePdpa();

    allowCam = true;
    allowCamBtn.textContent = 'ปิดกล้อง';
    updateCameraPanel();
  });

  pdpaDeclineBtn.addEventListener('click', () => {
    pdpaAccepted = false;
    hidePdpa();
  });

  /* =======================
     UI CONTROL
  ======================= */
  function updateCameraPanel() {

    // ❌ ยังไม่อนุญาตใบหน้า
    if (!allowFaceCheckbox.checked) {
      panelNewphoto.style.display = 'none';
      panelResult.style.display = 'none';
      panelFaceDB.style.display = 'block';
      // panelUpdateData.style.display = 'block';
      stopCamera();
      return;
    }

    // ❌ ยังไม่กดเปิดกล้อง
    if (!allowCam) {
      panelNewphoto.style.display = 'none';
      panelResult.style.display = 'none';
      panelFaceDB.style.display = 'block';
      // panelUpdateData.style.display = 'none';
      stopCamera();
      return;
    }

    // ✅ พร้อมถ่าย
    panelNewphoto.style.display = 'block';
    panelFaceDB.style.display = 'none';
    // panelUpdateData.style.display = 'none';

    startCamera();
  }
  /* ====== initial state from backend ====== */
  if (allowFaceCheckbox.checked) {
    allowCamBtn.disabled = false;
  } else {
    allowCamBtn.disabled = true;
  }

  allowCam = false;
  allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';

  // กันการแสดงกล้องตอนโหลด
  updateCameraPanel();

  /* ====== อนุญาตใบหน้า ====== */
  allowFaceCheckbox.addEventListener('change', () => {
    if (!allowFaceCheckbox.checked) {
      allowCam = false;
      allowCamBtn.disabled = true;
      allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
    } else {
      allowCamBtn.disabled = false;
    }

    updateCameraPanel();
  });



  /* ====== ปุ่มเปิดกล้อง ====== */
  allowCamBtn.addEventListener('click', () => {

    // 🔹 ถ้ากล้องเปิดอยู่ → ปิดได้ทันที (ไม่เช็ค PDPA)
    if (allowCam) {
      allowCam = false;
      allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
      updateCameraPanel();
      return;
    }

    // 🔹 กรณีกำลังจะ "เปิดกล้อง"

    // 1️⃣ ยังไม่เลือกใช้ใบหน้า
    if (!allowFaceCheckbox.checked) {
      alert('กรุณาอนุญาตการลงทะเบียนใบหน้าก่อน');
      return;
    }

    // 2️⃣ ยังไม่ยินยอม PDPA
    if (!pdpaAccepted) {
      showPdpa();
      return;
    }

    // 3️⃣ ผ่านครบ → เปิดกล้อง
    allowCam = true;
    allowCamBtn.textContent = 'ปิดกล้อง';
    updateCameraPanel();
  });



  /* =======================
     CAMERA
  ======================= */

  const Perf = {
    marks: {},
    start(label) {
      this.marks[label] = performance.now();
    },
    end(label) {
      if (!this.marks[label]) return null;
      const t = performance.now() - this.marks[label];
      console.log(`⏱ ${label}: ${t.toFixed(1)} ms`);
      return t;
    }
  };




  async function loadFaceModelOnce() {
    if (window._faceModelLoaded) return;

    await faceapi.nets.tinyFaceDetector.loadFromUri(
      './face-api.js-master/weights'
    );

    window._faceModelLoaded = true;
  }


  async function startCamera() {
    if (cameraStarted) return;
    cameraStarted = true;

    try {
      status.textContent = '📷 กำลังเปิดกล้อง...';
      Perf.start('getUserMedia');

      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: {
            ideal: 240
          },
          height: {
            ideal: 240
          },
          frameRate: {
            ideal: 15
          }
        },
        audio: false
      });

      Perf.end('getUserMedia');

      video.srcObject = stream;
      video.setAttribute('playsinline', true);

      Perf.start('video metadata');
      await new Promise(r =>
        video.addEventListener('loadedmetadata', r, {
          once: true
        })
      );
      Perf.end('video metadata');

      await video.play();

      overlay.width = video.videoWidth || 240;
      overlay.height = video.videoHeight || 240;

      status.textContent = 'กำลังโหลด...';
      Perf.start('load face model');
      await loadFaceModelOnce();
      Perf.end('load face model');

      status.textContent = '✅ พร้อมตรวจจับใบหน้า';
      overlayRunning = true;
      drawOverlay();

    } catch (e) {
      console.error(e);
      status.textContent = '❌ เปิดกล้องไม่สำเร็จ';
      cameraStarted = false;
    }
  }


  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    if (video.srcObject) {
      video.srcObject = null; // ⭐ เพิ่ม
    }
    cameraStarted = false;
    lastFaceBox = null;
    overlayRect = null;
    overlayRunning = false;

    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  }



  /* =======================
     FACE DETECT
  ======================= */
  async function detectFace() {
    if (video.readyState < 2) return null;
    try {
      const det = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 160,
          scoreThreshold: 0.5
        })
      );
      return det ? det.box : null;
    } catch (e) {
      console.error('Face detect error', e);
      return null;
    }
  }


  /* =======================
     OVERLAY LOOP (≈5 FPS)
  ======================= */
  async function drawOverlay() {
    if (!overlayRunning) return;

    const now = Date.now();
    const ctx = overlay.getContext('2d');

    if (!detecting && now - lastDetectTime > 200) {
      detecting = true;
      lastDetectTime = now;

      const box = await detectFace();
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (box) {
        lastFaceBox = box;
        overlayRect = {
          x: video.videoWidth - box.x - box.width,
          y: box.y,
          w: box.width,
          h: box.height
        };

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          overlayRect.x,
          overlayRect.y,
          overlayRect.w,
          overlayRect.h
        );
        status.textContent = '✅ พบใบหน้า';
        status.style.color = '#00c853';

        captureBtn.disabled = false;
        captureBtn.style.opacity = '1';
      } else {
        lastFaceBox = null;
        overlayRect = null;
        status.textContent = '❌ ไม่พบใบหน้า';
        status.style.color = '#d50000';

        captureBtn.disabled = true;
        captureBtn.style.opacity = '0.5';
      }

      detecting = false;
    }

    requestAnimationFrame(drawOverlay);
  }

  /* =======================
     CAPTURE
  ======================= */
  function captureFace() {
    captureBtn.disabled = true;

    const box = lastFaceBox;
    if (!box) return;

    const ctx = outCanvas.getContext('2d');
    outCanvas.width = 300;
    outCanvas.height = 300;

    const mirroredX = video.videoWidth - box.x - box.width;

    const cx = mirroredX + box.width / 2;
    const cy = box.y + box.height / 2;
    const size = Math.max(box.width, box.height) * 2;

    ctx.save();
    ctx.scale(-1, 1);   // กลับซ้ายขวา

    ctx.drawImage(
      video,
      cx - size / 2,
      cy - size / 2,
      size,
      size,
      -300, 0, 300, 300   // ค่า X ต้องติดลบ
    );

    ctx.restore();

    const base64 = outCanvas
      .toDataURL('image/jpeg', 0.9)
      .split(',')[1];

    userFaceArray.length = 0;
    userFaceArray.push({
      TemplateData: base64,
      TemplateSize: base64.length
    });

    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';

    captureBtn.style.display = 'none';   //  ซ่อนปุ่มถ่ายรูป
    status.style.display = 'none';       //  ซ่อนข้อความพบใบหน้า

    status.textContent = '✅ จับใบหน้าแล้ว';
    stopCamera();
  }
  /* =======================
    BIND CAPTURE BUTTON
  ======================= */
  captureBtn.addEventListener('click', () => {
    if (!lastFaceBox) {
      status.textContent = '❌ ยังไม่พบใบหน้า';
      return;
    }
    captureFace();
  });
  /* =======================
     RETAKE
  ======================= */
  retakeBtn?.addEventListener('click', (e) => {
    if (e) e.preventDefault();
    userFaceArray.length = 0;

    allowCam = true;
    if (allowFaceCheckbox) {
      allowFaceCheckbox.checked = true;
    }

    panelResult.style.display = 'none';
    videoContainer.style.display = 'block';

    captureBtn.disabled = true;
    captureBtn.style.opacity = '0.5';
    captureBtn.style.display = 'inline-block';

    status.textContent = 'พร้อมตรวจจับใบหน้า';
    status.style.color = '#333';
    captureBtn.style.display = 'inline-block'; //  แสดงปุ่มกลับ
    status.style.display = 'block';            //  แสดงข้อความกลับ

    cameraStarted = false;
    updateCameraPanel();
  });
  /* =======================
     UPDATE SERVER
  ======================= */
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // กัน submit form

    console.log('%c--- [เริ่มการตรวจสอบข้อมูลก่อนส่ง] ---', 'font-weight: bold;');
    const fd = new FormData(form);
    // --- ส่วนตรวจเช็คจำนวนหลัก (6 หลักเติม 00) ---
    let rawId = String(fd.get('ID') || "").trim();
    let userId = rawId;
    if (rawId.length === 6) {
      userId = "00" + rawId; // เติม 00 นำหน้าเฉพาะกรณีมี 6 หลัก
      console.log(`%c[ID Padding]: เปลี่ยนจาก ${rawId} -> ${userId}`);
    } else {
      console.log(`%c[ID No Padding]: ใช้ค่าเดิม ${rawId} (เนื่องจากไม่ใช่ 6 หลัก)`);
    }
    // DATA Face Scan
    if (allowFaceCheckbox.checked && allowCam && !userFaceArray.length && !oldFaceTemplate) {
      console.warn('⚠️ Warning: ติ๊กเปิดกล้องไว้แต่ยังไม่ได้ถ่ายรูป');
      alert('⚠️ กรุณากดถ่ายรูปใบหน้า หรือปิดกล้องก่อนบันทึกข้อมูล');
      return;
    }
    //UserInfo เหมือนเดิม
    const userInfo = {
      ID: userId,
      UniqueID: String(fd.get('UniqueID')),
      Name: String(fd.get('Name')),
      // Index 1 เป็น 9 ถ้าเปิดใช้หน้า, เป็น 0 ถ้าปิด
      AuthInfo: [2, (allowFaceCheckbox.checked ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: 2, // integer 2 is user 1 is admin
      CreateDate: new Date().toISOString().replace('T', ' ').split('.')[0],
      UsePeriodFlag: 0,
      RegistDate: String(fd.get('RegistDate')),
      ExpireDate: String(fd.get('ExpireDate')),
      Password: "",
      GroupCode: 1000,
      AccessGroupCode: parseInt(fd.get('AccessGroupCode')) || 3000,
      UserType: parseInt(fd.get('UserType')) || 0,
      TimezoneCode: 0,
      BlackList: 0,
      FPIdentify: 0,
      FaceIdentify: (allowFaceCheckbox.checked && userFaceArray.length) ? 1 : 0,
      DuressFinger: null,
      Partition: 0,
      APBExcept: 0,
      APBZone: 0,
      WorkCode: "0000",
      MealCode: "0000",
      MoneyCode: "0000",
      MessageCode: 0,
      VerifyLevel: 5,
      PositionCode: parseInt(fd.get('Position')) || 1,
      EmployeeNum: "0",
      Email: String(fd.get('Email')),
      Phone: "",
      Department: String(fd.get('Department')),
      LoginPW: "****",
      LoginAllowed: parseInt(0),
      Picture: "",
      IrisIdentify: 0,
      VoipUse: 0,
      VoipDoorOpen: 0,
      VoipAutoAnswer: 0,
      Gender: 0,
      Mobile: "",
      UnavailableTime: "",
      Birthday: ""
    };

    const cards = [{
      "CardNum": rawId,
      "UserID": userId
    }];


    if (!userInfo.ID) {
      alert('❌ ไม่พบรหัสผู้ใช้ (ตรวจสอบ name="ID" ใน HTML)');
      return;
    }



    let faceInfo = null;
    if (allowFaceCheckbox.checked && userFaceArray.length > 0) {
      faceInfo = [{
        UserID: userId,                      // string
        TemplateSize: userFaceArray[0].TemplateSize, // integer
        TemplateData: userFaceArray[0].TemplateData, // string (Base64)
        TemplateType: 1                      // integer (1: Image)
      }];
    }

    const payload = {
      UserInfo: userInfo,
      UserCardInfo: cards,
      UserCarInfo: null,
      UserFPInfo: null,
      UserCustomArmyHQ: null,
      UserElevatorInfo: null,
      UserFaceWTInfo: faceInfo
    };



    // showLoading('กำลังอัปโหลดข้อมูล...');

    // --- Log Output ---
    // --- 🟢 FIX LOG OUTPUT (แก้ไขตรงนี้) ---
    console.group('📝 REGISTER PAYLOAD (Format Match)');

    // แสดงแบบ Object เพื่อให้กดขยายดูได้ใน Console
    console.log('Object View:', payload);

    // แสดงแบบ JSON String (ก๊อปปี้ไปใช้งานได้ทันที เหมือนต้นแบบ)
    console.log('%cJSON String Ready for API:');
    console.log(JSON.stringify(payload, null, 2));

    console.groupEnd();


    // 2. ส่งข้อมูลไปยัง PHP Controller (ส่วนที่เพิ่มใหม่)
    try {
      // แสดง loading (ถ้ามี)
      // showLoading(true); 

      console.log('🚀 Sending payload to PHP Controller...');

      const response = await fetch('https://lib.swu.ac.th/app/ci4_new/public/apidoor/addusers', { // เรียกตาม Route ที่ตั้งไว้
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // หากใช้ CodeIgniter CSRF อาจต้องส่ง X-Requested-With
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        console.log('%c✅ Success:', 'color: green; font-weight: bold;', result);
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง');

        // อาจจะสั่ง window.location.reload() หรือล้างฟอร์มที่นี่
      } else {
        console.error('%c❌ API Error:', 'color: red;', result);
        alert('เกิดข้อผิดพลาด: ' + (result.message || 'Unknown Error'));
      }

    } catch (error) {
      console.error('%c❌ Network Error:', 'color: red;', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      // ปิด loading
      // showLoading(false);
      window.location.href = 'login.php?timeout=1';
    }
  });






})();
