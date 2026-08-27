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

  // ⭐ NEW: นับจำนวนเฟรมที่เจอใบหน้าติดต่อกัน เพื่อรอให้กล้อง auto-exposure/focus นิ่งก่อนอนุญาตให้ถ่าย
  let stableFrameCount = 0;
  const STABLE_FRAMES_REQUIRED = 6; // ~6 เฟรม * 200ms ≈ 1.2 วินาทีที่เจอหน้านิ่ง ๆ ต่อเนื่อง

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
      // 💡 เพิ่มเติมแก้ไขจุดนี้: เคลียร์สถานะกล้องให้พร้อมเปิดใหม่เมื่อมีการติ๊กเลือก
      allowCam = false;
      allowCamBtn.disabled = false;
      allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
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
          // ⭐ FIX: เพิ่มความละเอียดจาก 300x300 -> 480x480
          // ที่ความละเอียดต่ำมาก รูปที่ครอปซ้อนอีกชั้นจะยิ่งเบลอ/แตก
          // จนบางครั้งเครื่องสแกนปฏิเสธว่า "รูปไม่ชัดเจน/ไม่ตรงมาตรฐาน"
          width: {
            ideal: 480
          },
          height: {
            ideal: 480
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

      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;

      status.textContent = 'กำลังโหลด...';
      Perf.start('load face model');
      await loadFaceModelOnce();
      Perf.end('load face model');

      status.textContent = '✅ พร้อมตรวจจับใบหน้า';
      overlayRunning = true;
      stableFrameCount = 0; // ⭐ reset ตัวนับความนิ่งทุกครั้งที่เปิดกล้องใหม่
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
    stableFrameCount = 0; // ⭐ reset

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

        // ⭐ FIX: นับความนิ่งต่อเนื่อง แทนที่จะ enable ปุ่มทันทีที่เจอครั้งแรก
        // เฟรมแรก ๆ หลังเปิดกล้องมักมืด/เบลอเพราะ auto-exposure/focus ยังไม่นิ่ง
        stableFrameCount = Math.min(stableFrameCount + 1, STABLE_FRAMES_REQUIRED);

        if (stableFrameCount >= STABLE_FRAMES_REQUIRED) {
          status.textContent = '✅ พบใบหน้า';
          status.style.color = '#00c853';
          captureBtn.disabled = false;
          captureBtn.style.opacity = '1';
        } else {
          status.textContent = `🔎 กำลังปรับกล้อง... (${stableFrameCount}/${STABLE_FRAMES_REQUIRED})`;
          status.style.color = '#f9a825';
          captureBtn.disabled = true;
          captureBtn.style.opacity = '0.5';
        }
      } else {
        lastFaceBox = null;
        overlayRect = null;
        stableFrameCount = 0; // ⭐ หลุดเฟรม -> เริ่มนับใหม่
        status.textContent = '❌ ไม่พบใบหน้า';
        status.style.color = '#d50000';

        captureBtn.disabled = true;
        captureBtn.style.opacity = '0.5';
      }

      detecting = false;
    }

    requestAnimationFrame(drawOverlay);
  }

  /* ===================================================
     [REGIS FILE] - JAVASCRIPT CODE FOR REGISTER PAGE
     =================================================== */

  /* =======================
     CAPTURE (ถ่ายรูปและคำนวณขนาดไฟล์จริง)
     ⭐ FIX: capture ตอนนี้ทำ 2 อย่างที่ต่างจากเดิม
       1) re-detect ใบหน้าสด ๆ ณ วินาทีที่กดปุ่ม แทนที่จะใช้ lastFaceBox ที่อาจเก่าไปแล้ว
          200ms+ ทำให้กรอบไม่ตรงตำแหน่งจริงถ้าผู้ใช้ขยับหัวเล็กน้อย
       2) clamp พิกัดที่จะ crop ให้อยู่ในขอบเขตของวิดีโอเสมอ กันไม่ให้เผลอ crop
          พื้นที่นอกเฟรม (กลายเป็นส่วนดำ/ว่าง) ปนเข้าไปในรูป ซึ่งเป็นสาเหตุหลักที่
          เครื่องสแกนบางครั้งฟ้อง resultCode 33558286 / 33558281 (รูปไม่ชัดเจน)
  ======================= */
  async function captureFace() {
    captureBtn.disabled = true;

    // 1) re-detect สด ๆ แทนใช้ lastFaceBox ที่อาจเก่า
    let box = await detectFace();
    if (!box) {
      // fallback: ถ้าเฟรมนี้ตรวจไม่เจอพอดี (เช่น เพิ่งกระพริบตา) ใช้ค่าล่าสุดที่มี
      box = lastFaceBox;
    }
    if (!box) {
      status.textContent = '❌ ไม่พบใบหน้า กรุณาลองใหม่';
      captureBtn.disabled = false;
      return;
    }

    const ctx = outCanvas.getContext('2d');
    outCanvas.width = 300;
    outCanvas.height = 300;

    const mirroredX = video.videoWidth - box.x - box.width;
    const cx = mirroredX + box.width / 2;
    const cy = box.y + box.height / 2;

    let size = Math.max(box.width, box.height) * 2;
    // กันไม่ให้ size ใหญ่กว่าตัววิดีโอเอง (เช่นตรวจจับ box ผิดปกติ)
    size = Math.min(size, video.videoWidth, video.videoHeight);

    // 2) clamp จุดเริ่ม crop (sx, sy) ให้อยู่ในขอบเขต [0, videoWidth/Height - size]
    let sx = cx - size / 2;
    let sy = cy - size / 2;
    sx = Math.max(0, Math.min(sx, video.videoWidth - size));
    sy = Math.max(0, Math.min(sy, video.videoHeight - size));

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, -300, 0, 300, 300);
    ctx.restore();


    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
    const padding = (base64.endsWith('=')) ? (base64.endsWith('==') ? 2 : 1) : 0;
    const actualByteSize = Math.floor((base64.length * 0.75) - padding);

    userFaceArray.length = 0;
    userFaceArray.push({
      TemplateData: base64,
      TemplateSize: Math.floor(actualByteSize)
    });

    console.log(`📸 Captured & Compressed! New Size: ${actualByteSize} Bytes`);

    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
    status.textContent = '✅ จับใบหน้าแล้ว';
    stopCamera();
  }

  /* =======================
    BIND CAPTURE BUTTON
  ======================= */
  captureBtn.addEventListener('click', async () => {
    if (!lastFaceBox) {
      status.textContent = '❌ ยังไม่พบใบหน้า';
      return;
    }
    await captureFace();
  });

  /* =======================
     RETAKE (ถ่ายใหม่)
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
    status.style.display = 'block';

    cameraStarted = false;
    stableFrameCount = 0; // ⭐ reset
    updateCameraPanel();
  });

  /* =======================
     UPDATE SERVER (ปุ่มลงทะเบียน)
  ======================= */
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log('%c--- [เริ่มการตรวจสอบข้อมูลลงทะเบียน] ---', 'font-weight: bold;');
    const fd = new FormData(form);

    let rawId = String(fd.get('ID') || "").trim();
    let userId = rawId;
    let cleanNumber = rawId.replace(/[^0-9]/g, '');
    
    if (cleanNumber.length === 11) {
        // === เงื่อนไขใหม่: ถ้ารหัสมาเป็น 11 หลัก (เช่น 57110010277) ===
		let first5 = cleanNumber.substring(0, 5); // "69102" (5 หลักแรก)
		let last3  = cleanNumber.substring(8, 11); // "277"   (3 หลักสุดท้าย)
    
    userId = first5 + last3; // ผลลัพธ์: "69102277" (8 หลัก ไม่ชนกัน)

    }else if (cleanNumber.length === 6) {
        // === เงื่อนไขเดิม: ถ้าเป็นเลข 6 หลัก ให้เติม 00 ข้างหน้า ===
        userId = "00" + cleanNumber; // ผลลัพธ์: "00xxxx" (กลายเป็น 8 หลักเช่นกัน)

    }else {
        // กรณีอื่น ๆ ที่ไม่เข้าพวก ให้ใช้ตัวเลขล้วนที่สกัดได้ไปก่อน
        userId = cleanNumber;
    }

    // 1️⃣ ตรวจสอบเงื่อนไขการกรอก: ติ๊กเปิดกล้องไว้แต่ยังไม่ได้กดถ่ายรูปใบหน้า
    if (allowFaceCheckbox.checked && allowCam && !userFaceArray.length) {
      alert('⚠️ กรุณากดถ่ายรูปใบหน้า หรือปิดกล้องก่อนบันทึกข้อมูล');
      return;
    }

    // ตรวจสอบสถานะการติ๊กและภาพที่ถ่ายจริง
    const isFaceEnabled = allowFaceCheckbox.checked;
    const hasFacePhoto = userFaceArray.length > 0;

    // ดึงค่า Base64 รูปภาพที่ถ่ายไว้ (ถ้าติ๊กและถ่ายรูปแล้ว ให้ส่งไป / ถ้าไม่ติ๊ก ให้ส่งค่าว่าง)
    const capturedBase64 = (isFaceEnabled && hasFacePhoto) ? userFaceArray[0].TemplateData : "";
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;

    const userInfo = {
      ID: userId,
      UniqueID: String(fd.get('UniqueID')),
      Name: String(fd.get('Name')),
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
      CreateDate: new Date().toISOString().replace('T', ' ').split('.')[0],
      UsePeriodFlag: 0,
      RegistDate: String(fd.get('RegistDate') || ''),
      ExpireDate: String(fd.get('ExpireDate') || ''),
      Password: "",
      GroupCode: Number(fd.get('GroupCode')) || 1000,
      AccessGroupCode: Number(fd.get('AccessGroupCode')) || 3000,
      UserType: Number(fd.get('UserType')) || 0,
      TimezoneCode: 0,
      BlackList: 0,
      FPIdentify: 0,
      FaceIdentify: isFaceActive ? 1 : 0,
      DuressFinger: null,
      Partition: 0,
      APBExcept: 0,
      APBZone: 0,
      WorkCode: "0",
      MealCode: "0",
      MoneyCode: "0",
      MessageCode: 0,
      VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
      PositionCode: Number(fd.get('Position')) || 0,
      EmployeeNum: "0",
      Email: String(fd.get('Email') || ''),
      Phone: "",
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
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
      alert('❌ ไม่พบรหัสผู้ใช้');
      return;
    }

    // 2️⃣ [จุดประสงค์หลัก] ตรวจสอบเงื่อนไข Checkbox เพื่อแยกก้อนข้อมูลส่ง
    let faceInfo = null;
    if (isFaceEnabled && hasFacePhoto) {
      // ติ๊กเลือก -> ส่งอาร์เรย์ข้อมูลใบหน้าตามโครงสร้าง API ของเครื่องสแกน
      faceInfo = [{
        UserID: userId,
        TemplateSize: userFaceArray[0].TemplateSize,
        TemplateData: capturedBase64,
        TemplateType: 1
      }];
    } else {
      // ไม่ติ๊กเลือก -> ส่งเป็น null ชัดเจน ข้อมูลใบหน้าจะไม่ถูกลงทะเบียนเข้าไปกวนฐานข้อมูล
      faceInfo = null;
    }

    const payload = {
      UserInfo: userInfo,
      UserCardInfo: cards,
      UserCarInfo: null,
      UserFPInfo: null,
      UserCustomArmyHQ: null,
      UserElevatorInfo: null,
      UserFaceWTInfo: faceInfo // ผูกตัวแปรที่ผ่านการตรวจสอบเงื่อนไขแล้ว
    };

    console.group(' REGISTER PAYLOAD');
    console.log('Object View:', payload);
    console.groupEnd();

    try {
      showLoading('กำลังอัปโหลดข้อมูลและใบหน้าไปยังเครื่องสแกน...');
      updateBtn.disabled = true;

      // ⏱ ตัดที่ 12 วินาที
      const controller = new AbortController();
      const TIMEOUT_MS = 12000;
      const timeout = setTimeout(() => {
        controller.abort();
        console.warn(`Timeout! ตัด session แล้ว (${TIMEOUT_MS}ms)`);
      }, TIMEOUT_MS);

      console.log(' Sending payload...');
      console.log(' Payload size:', JSON.stringify(payload).length, 'bytes');
      console.log(' TemplateSize:', userFaceArray[0]?.TemplateSize, 'bytes');

      let response;
      try {
        response = await fetch('https://lib.swu.ac.th/app/ci4_new/public/apidoor/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }
      const result = await response.json();
      console.log('🔍 SERVER RESPONSE (RAW):', result);
      const apiResult = result?.apiResult;
      const innerResult = apiResult?.Result || apiResult?.result;
      const resultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;
      console.log('🔍 Detected ResultCode:', resultCode, '(type:', typeof resultCode, ')');

      // ⭐ FIX: เดิมโค้ดใช้ "blacklist" คือเช็คแค่ error code ที่รู้จัก แล้วถ้าไม่ตรงกับตัวไหนเลย
      // จะตกไปเช็ค response.ok && result.status === 'success' ซึ่งเป็นแค่สถานะว่า
      // "เรียก API/relay ไปเครื่องสแกนสำเร็จ" ไม่ใช่สถานะว่า "เครื่องสแกนบันทึกข้อมูลสำเร็จจริง"
      // ผลคือถ้าเครื่องสแกนตอบ resultCode แปลก ๆ ที่ไม่อยู่ในลิสต์ที่รู้จัก หน้าเว็บจะขึ้นว่า
      // "สำเร็จ" และ redirect ออกไปทันที ทั้งที่ข้อมูลไม่ได้ถูกบันทึกจริง (บันทึกทุกรอบแต่ไม่มีข้อมูล)
      //
      // แก้เป็น "whitelist": ต้องเจอ resultCode ที่รู้จักว่าคือ "สำเร็จ" เท่านั้นถึงจะถือว่าสำเร็จ
      // ค่าอื่นที่ไม่รู้จัก (รวมถึงกรณีไม่มี resultCode เลย) จะถือว่า "ไม่ยืนยันว่าสำเร็จ" และไม่ redirect
      //
      // ⚠️ TODO: ค่า KNOWN_SUCCESS_CODES ด้านล่างเดาไว้ที่ 0 (มาตรฐานทั่วไปของ SDK เครื่องสแกน
      // ประเภทนี้ที่ 0 = สำเร็จ) กรุณายืนยันค่านี้จาก log "🔍 Detected ResultCode" ตอนที่ทราบแน่ชัดว่า
      // ลงทะเบียนสำเร็จและมีข้อมูลจริงในเครื่อง แล้วปรับ array นี้ให้ตรง ถ้าเครื่องสแกนส่ง resultCode
      // สำเร็จเป็นค่าอื่น (เช่น ไม่มี key ResultCode เลยตอนสำเร็จ) ต้องปรับ logic ตรงนี้ตาม
      const KNOWN_SUCCESS_CODES = [0, "0"];
      const KNOWN_FAIL_CODES_IMAGE = [33558286, "33558286", 33558281, "33558281"];
      const KNOWN_FAIL_CODES_DUPLICATE = [16777237, "16777237", 16777241, "16777241"];

      if (KNOWN_FAIL_CODES_IMAGE.includes(resultCode)) {
        alert('❌ อัปเดตไม่สำเร็จ: เครื่องสแกนไม่สามารถประมวลผลรูปภาพนี้ได้\n\n💡 สาเหตุ: รูปถ่ายอาจมืดเกินไป, ใบหน้าไม่ชัดเจน หรือไม่ตรงตามมาตรฐานของเครื่อง\nกรุณาลองถ่ายรูปใหม่อีกครั้งให้เห็นใบหน้าตรงและชัดเจนครับ');
        return;
      }

      if (KNOWN_FAIL_CODES_DUPLICATE.includes(resultCode)) {
        const dupInfo = apiResult?.DuplicateInfo || apiResult?.duplicateInfo;
        const dupName = dupInfo?.DuplicateName || dupInfo?.duplicateName || 'ไม่ระบุชื่อ';
        const dupId = dupInfo?.DuplicateUniqueID || dupInfo?.duplicateUniqueID || 'ไม่ระบุ ID';
        alert(`❌ อัปเดตไม่สำเร็จ: ใบหน้าหรือเลขบัตรนี้ "ซ้ำซ้อน" กับพนักงานในเครื่องสแกน\n\nพบข้อมูลซ้ำกับ: ${dupName} (ID: ${dupId})\n\n💡 วิธีแก้: กรุณาลบพนักงานคนเดิมออกจากเครื่องสแกนก่อนอัปโหลดอีกครั้ง`);
        return;
      }

      const deviceConfirmedSuccess =
        response.ok &&
        result.status === 'success' &&
        (resultCode === undefined || KNOWN_SUCCESS_CODES.includes(resultCode));

      if (deviceConfirmedSuccess) {
        console.log('%c✅ Success:', 'color: green; font-weight: bold;', result);
        alert('✅ บันทึกข้อมูลและลงทะเบียนเรียบร้อยแล้ว');
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/logout.php';
      } else if (response.ok && result.status === 'success' && resultCode !== undefined) {
        // ⭐ เจอกรณี response wrapper บอกว่า success แต่ resultCode จากเครื่องสแกน
        // เป็นค่าที่ไม่รู้จัก (ไม่ใช่ทั้ง success และ fail ที่ลิสต์ไว้) — ไม่ redirect
        // ให้ผู้ใช้/ผู้ดูแลระบบเห็น resultCode จริงเพื่อไปตรวจสอบและเพิ่มลง whitelist/blacklist ต่อไป
        console.error('%c⚠️ Unknown ResultCode (ไม่ยืนยันว่าสำเร็จ):', 'color: orange; font-weight: bold;', resultCode, result);
        alert(`⚠️ ไม่สามารถยืนยันผลการลงทะเบียนได้\n\nระบบได้รับการตอบกลับ แต่ผลลัพธ์จากเครื่องสแกน (ResultCode: ${resultCode}) ไม่ตรงกับรหัส "สำเร็จ" ที่ระบบรู้จัก\n\nกรุณาตรวจสอบข้อมูลในเครื่องสแกนก่อนยืนยันว่าลงทะเบียนสำเร็จ และแจ้งผู้ดูแลระบบพร้อม ResultCode นี้`);
      } else {
        console.error('%c❌ API Error:', 'color: red;', result);
        alert('❌ เกิดข้อผิดพลาด: ' + (result.message || 'Unknown Error'));
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว');
        // ⭐ ไม่ alert ที่ทำให้ user งง แค่แสดง status
        alert(' ระบบใช้เวลานาน\nข้อมูลอาจถูกบันทึกแล้ว กรุณาตรวจสอบในระบบอีกครั้ง');
      } else if (error.message?.includes('Connection reset') ||
        error.message?.includes('NetworkError')) {
        // ⭐ จับ error "Connection reset by peer" โดยเฉพาะ
        console.warn('🔌 Connection reset - เครื่องสแกนตัดการเชื่อมต่อ');
        alert('⚠️ เครื่องสแกนไม่ตอบสนอง\nกรุณารอสักครู่แล้วลองใหม่');
      } else {
        console.error('%c❌ Network Error:', 'color: red;', error);
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      }
    } finally {
      hideLoading();
      updateBtn.disabled = false;
    }
  });
})();
