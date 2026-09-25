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
  const panelUpdateData = document.getElementById('updatedata');

  const updateBtn = document.getElementById('updateServerBtn');
  const form = document.getElementById('editUserForm');
  const btnUpdateData = document.getElementById('btn-updatedata');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const captureBtn = document.getElementById('captureBtn');

  const pdpaModal = document.getElementById('pdpaModal');
  const pdpaAcceptBtn = document.getElementById('pdpaAcceptBtn');
  const pdpaDeclineBtn = document.getElementById('pdpaDeclineBtn');
  let animFrameId = null;

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
  let pdpaAccepted = false;
  let stream = null;
  let cameraStarted = false;
  let allowCam = false;
  let overlayRunning = false;
  let lastFaceBox = null;
  let overlayRect = null;
  let detecting = false;
  let lastDetectTime = 0;
  let oldFaceTemplate = window.oldFaceTemplate || null;

  // ⭐ FIX: นับจำนวนเฟรมที่เจอใบหน้าติดต่อกัน เพื่อรอให้กล้อง auto-exposure/focus
  // นิ่งก่อนอนุญาตให้ถ่าย (ก่อนหน้านี้เจอใบหน้าครั้งแรกก็ enable ปุ่มถ่ายทันที ทำให้
  // รูปแรก ๆ หลังเปิดกล้องมักมืด/เบลอ เพราะกล้องยังปรับค่าไม่เสร็จ)
  let stableFrameCount = 0;
  const STABLE_FRAMES_REQUIRED = 6; // ~6 เฟรม * 200ms ≈ 1.2 วินาที

  const userFaceArray = [];

  /* =======================
     PDPA
  ======================= */
  function showPdpa() { pdpaModal.style.display = 'block'; }
  function hidePdpa() { pdpaModal.style.display = 'none'; }

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
    if (!allowFaceCheckbox.checked) {
      panelNewphoto.style.display = 'none';
      panelResult.style.display = 'none';
      panelFaceDB.style.display = 'block';
      panelUpdateData.style.display = 'block';
      stopCamera();
      return;
    }

    if (!allowCam) {
      panelNewphoto.style.display = 'none';
      panelResult.style.display = 'none';
      panelFaceDB.style.display = 'block';
      panelUpdateData.style.display = 'none';
      stopCamera();
      return;
    }

    panelNewphoto.style.display = 'block';
    panelFaceDB.style.display = 'none';
    panelUpdateData.style.display = 'none';
    startCamera();
  }

  if (allowFaceCheckbox.checked) {
    allowCamBtn.disabled = false;
  } else {
    allowCamBtn.disabled = true;
  }

  allowCam = false;
  allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
  updateCameraPanel();

  allowFaceCheckbox.addEventListener('change', () => {
    if (!allowFaceCheckbox.checked) {
      allowCam = false;
      allowCamBtn.disabled = true;
      allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
    } else {
      allowCam = false;
      allowCamBtn.disabled = false;
      allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
    }
    updateCameraPanel();
  });

  allowCamBtn.addEventListener('click', () => {
    if (allowCam) {
      allowCam = false;
      allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
      updateCameraPanel();
      return;
    }
    if (!allowFaceCheckbox.checked) {
      alert('กรุณาอนุญาตการลงทะเบียนใบหน้าก่อน');
      return;
    }
    if (!pdpaAccepted) {
      showPdpa();
      return;
    }
    allowCam = true;
    allowCamBtn.textContent = 'ปิดกล้อง';
    updateCameraPanel();
  });

  /* =======================
      CAMERA
  ====================== */
  async function loadFaceModelOnce() {
    if (window._faceModelLoaded) return;
    await faceapi.nets.tinyFaceDetector.loadFromUri('./face-api.js-master/weights');
    window._faceModelLoaded = true;
  }

  async function startCamera() {
    if (cameraStarted) return;
    cameraStarted = true;
    try {
      status.textContent = '📷 กำลังเปิดกล้อง...';
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          // ⭐ FIX: เพิ่มความละเอียดจาก 300x300 -> 480x480 ลดปัญหารูปแตก/เบลอ
          // หลังจากถูก crop ซ้อนอีกชั้นตอน capture
          width: { ideal: 480 },
          height: { ideal: 480 },
          frameRate: { ideal: 15 }
        },
        audio: false
      });
      video.srcObject = stream;
      video.setAttribute('playsinline', true);
      await new Promise(r => video.addEventListener('loadedmetadata', r, { once: true }));
      await video.play();

      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
      status.textContent = 'กำลังโหลด...';
      await loadFaceModelOnce();
      status.textContent = '✅ พร้อมตรวจจับใบหน้า';
      overlayRunning = true;
      stableFrameCount = 0; // ⭐ reset ทุกครั้งที่เปิดกล้องใหม่
      drawOverlay();
    } catch (e) {
      console.error(e);
      status.textContent = '❌ เปิดกล้องไม่สำเร็จ';
      cameraStarted = false;
    }
  }

  function stopCamera() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    if (video.srcObject) { video.srcObject = null; }
    cameraStarted = false;
    lastFaceBox = null;
    overlayRect = null;
    overlayRunning = false;
    stableFrameCount = 0; // ⭐ reset
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  }

  /* =======================
      FACE DETECT & OVERLAY
  ======================= */
  async function detectFace() {
    if (video.readyState < 2) return null;
    try {
      const det = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 }));
      return det ? det.box : null;
    } catch (e) { return null; }
  }

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
        overlayRect = { x: video.videoWidth - box.x - box.width, y: box.y, w: box.width, h: box.height };
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.strokeRect(overlayRect.x, overlayRect.y, overlayRect.w, overlayRect.h);

        // ⭐ FIX: นับความนิ่งต่อเนื่องก่อน enable ปุ่มถ่าย แทนที่จะ enable ทันทีที่เจอครั้งแรก
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
        stableFrameCount = 0; // ⭐ หลุดเฟรม เริ่มนับใหม่
        status.textContent = '❌ ไม่พบใบหน้า';
        status.style.color = '#d50000';
        captureBtn.disabled = true;
        captureBtn.style.opacity = '0.5';
      }
      detecting = false;
    }
    animFrameId = requestAnimationFrame(drawOverlay);
  }

  /* =======================
      CAPTURE
      ⭐ FIX: re-detect ใบหน้าสด ๆ ตอนกดปุ่ม (แทนใช้ lastFaceBox ที่อาจเก่าไปแล้ว
      200ms+) และ clamp พิกัด crop ให้อยู่ในขอบเขตวิดีโอเสมอ กันไม่ให้ครอปพื้นที่
      นอกเฟรม (ว่าง/ดำ) ปนเข้าไปในรูป ซึ่งเป็นสาเหตุหลักที่เครื่องสแกนบางครั้งฟ้อง
      ว่ารูปไม่ชัดเจน/ไม่ตรงมาตรฐาน (resultCode 33558286 / 33558281)
  ======================= */
  async function captureFace() {
    captureBtn.disabled = true;

    let box = await detectFace();
    if (!box) box = lastFaceBox; // fallback ถ้าเฟรมนี้ตรวจไม่เจอพอดี
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
    size = Math.min(size, video.videoWidth, video.videoHeight);

    let sx = cx - size / 2;
    let sy = cy - size / 2;
    sx = Math.max(0, Math.min(sx, video.videoWidth - size));
    sy = Math.max(0, Math.min(sy, video.videoHeight - size));

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, -300, 0, 300, 300);
    ctx.restore();

    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    const base64 = base64DataUrl.split(',')[1];

    let len = base64.length;
    let padding = 0;
    if (base64[len - 1] === '=') padding++;
    if (base64[len - 2] === '=') padding++;
    const actualByteSize = Math.floor((len * 0.75) - padding);

    userFaceArray.length = 0;
    userFaceArray.push({
      TemplateData: base64,
      TemplateSize: Math.floor(actualByteSize)
    });

    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
    stopCamera();
  }

  captureBtn.addEventListener('click', async () => {
    if (!lastFaceBox) { status.textContent = '❌ ยังไม่พบใบหน้า'; return; }
    await captureFace();
  });

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
  /*==============================================================
    Function Bulid Userinfo
  ===============================================================*/
  function buildUserInfo(fd, currentUserId, hasFace) {
    return {
      ID: currentUserId,
      UniqueID: String(fd.get('UniqueID')),
      Name: String(fd.get('Name')),
      AuthInfo: [2, (hasFace ? 9 : 0), 30, 0, 0, 0, 0, 0],
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
      FaceIdentify: hasFace ? 1 : 0,
      DuressFinger: null,
      Partition: 0,
      APBExcept: 0,
      APBZone: 0,
      WorkCode: "0",
      MealCode: "0",
      MoneyCode: "0",
      MessageCode: 0,
      VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
      PositionCode: Number(fd.get('PositionCode')) || 0,
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
  }

  /* =======================================================
     ⭐ FIX: whitelist ผลลัพธ์จาก API แบบใช้ร่วมกันทั้ง 2 ปุ่ม
     เดิมทั้ง 2 handler เช็คแค่ error code ที่รู้จัก (blacklist) แล้วถ้าไม่ตรง
     ก็ถือว่าสำเร็จทันทีจาก res.ok + result.status === 'success' เท่านั้น
     ซึ่งเป็นแค่สถานะว่า "เรียก API ผ่าน" ไม่ใช่ "เครื่องสแกนบันทึกสำเร็จจริง"
     ผลคือบางครั้งขึ้นว่าสำเร็จทั้งที่ข้อมูลไม่ถูกบันทึกจริงในเครื่อง

     ⚠️ TODO: ค่า KNOWN_SUCCESS_CODES ด้านล่างเดาไว้ที่ 0 (มาตรฐานทั่วไปของ SDK
     เครื่องสแกนกลุ่มนี้) กรุณายืนยันจาก log "Detected ResultCode" เทียบกับผลจริง
     ในเครื่องสแกนก่อนใช้งานจริง แล้วปรับ array นี้ให้ตรงตามที่พบ
  ======================================================= */
  const KNOWN_SUCCESS_CODES = [0, "0"];
  const KNOWN_FAIL_CODES_IMAGE = [33558286, "33558286", 33558281, "33558281"];
  const KNOWN_FAIL_CODES_DUPLICATE = [16777237, "16777237", 16777241, "16777241"];

  // คืนค่า: 'success' | 'fail_image' | 'fail_duplicate' | 'unknown'
  function classifyResult(result) {
    const apiResult = result?.apiResult;
    const innerResult = apiResult?.Result || apiResult?.result;
    const resultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;

    if (KNOWN_FAIL_CODES_IMAGE.includes(resultCode)) return { verdict: 'fail_image', resultCode, apiResult };
    if (KNOWN_FAIL_CODES_DUPLICATE.includes(resultCode)) return { verdict: 'fail_duplicate', resultCode, apiResult };

    const wrapperSaysSuccess = result?.status === 'success' || result?.status === 'SUCCESS';
    if (wrapperSaysSuccess && (resultCode === undefined || KNOWN_SUCCESS_CODES.includes(resultCode))) {
      return { verdict: 'success', resultCode, apiResult };
    }
    if (wrapperSaysSuccess && resultCode !== undefined) {
      // wrapper บอกสำเร็จ แต่ resultCode จากเครื่องสแกนไม่รู้จัก -> ไม่ยืนยันว่าสำเร็จ
      return { verdict: 'unknown', resultCode, apiResult };
    }
    return { verdict: 'fail_other', resultCode, apiResult };
  }

  /* =========================================================
     📥 UPDATE SERVER (ปุ่มถ่ายรูปอัปเดตใบหน้า)
     ========================================================= */
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('📤 CLICK UPLOAD (WITH PHOTO)');

    if (allowFaceCheckbox.checked && !userFaceArray.length && !oldFaceTemplate) {
      alert('⚠️ ยังไม่ได้ถ่ายรูปใบหน้า หรือปิดกล้องก่อนบันทึกข้อมูล');
      return;
    }

    const fd = new FormData(form);
    let rawId = String(fd.get('ID')).trim();
    let cleanNumber = rawId.replace(/[^0-9]/g, '');
    let currentUserId = rawId;


    if (cleanNumber.length === 8) {
        currentUserId = cleanNumber;
    }
    if (cleanNumber.length === 11) {
        // === เงื่อนไขใหม่: ถ้ารหัสมาเป็น 11 หลัก (เช่น 57110010277) ===
        let first5 = cleanNumber.substring(0, 5); // "69102" (5 หลักแรก)
		    let last3  = cleanNumber.substring(8, 11); // "277"   (3 หลักสุดท้าย)

        currentUserId = first5 + last3; // ผลลัพธ์: "57100277" (8 หลักพอดี ไม่ซ้ำคนอื่น)
    } else if (cleanNumber.length === 6) {
        // === เงื่อนไขเดิม: ถ้าเป็นเลข 6 หลัก ให้เติม 00 ข้างหน้า ===
        currentUserId = "00" + cleanNumber; // ผลลัพธ์: "00xxxx" (กลายเป็น 8 หลักเช่นกัน)
    }else {
        // กรณีอื่น ๆ ที่ไม่เข้าพวก ให้ใช้ตัวเลขล้วนที่สกัดได้ไปก่อน
        currentUserId = cleanNumber;
    }


    let cardValues = fd.getAll('CardNum[]').filter(Boolean);
    if (cardValues.length === 0) {
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }

    const cards = cardValues.map(c => {
      let cleanCard = String(c).trim();
      if (cleanCard.length === 8 && cleanCard.startsWith("00")) {
        cleanCard = cleanCard.substring(2);
      }
      return {
        CardNum: cleanCard,
        UserID: currentUserId
      };
    });

    let hasFace = false;
    let faceInfo = null;

    if (allowFaceCheckbox.checked) {
      if (userFaceArray.length > 0) {
        hasFace = true;
        faceInfo = [{
          UserID: currentUserId,
          TemplateType: 1,
          TemplateSize: userFaceArray[0].TemplateSize,
          TemplateData: userFaceArray[0].TemplateData
        }];
      } else if (oldFaceTemplate) {
        hasFace = true;
        faceInfo = [{
          UserID: currentUserId,
          TemplateType: 1,
          TemplateSize: oldFaceTemplate.TemplateSize,
          TemplateData: oldFaceTemplate.TemplateData
        }];
      }
    } else {
      faceInfo = null;
    }

    const userInfo = buildUserInfo(fd, currentUserId, hasFace); // ✅ เรียกใช้ function

    const payload = {
      UserInfo: userInfo,
      UserCardInfo: cards,
      UserCarInfo: null,
      UserFPInfo: null,
      UserCustomArmyHQ: null,
      UserElevatorInfo: null,
      UserFaceWTInfo: faceInfo
    };

    showLoading('กำลังอัปโหลดข้อมูลและใบหน้าไปยังเครื่องสแกน...');
    updateBtn.disabled = true;

    try {
      const res = await fetch(
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const result = await res.json();
      console.log('🔍 SERVER RESPONSE (RAW):', result);

      const { verdict, resultCode } = classifyResult(result);
      console.log('🔍 Detected ResultCode:', resultCode, '| verdict:', verdict);

      if (verdict === 'fail_image') {
        alert('❌ อัปเดตไม่สำเร็จ: เครื่องสแกนไม่สามารถประมวลผลรูปภาพนี้ได้\n\n💡 สาเหตุ: รูปถ่ายอาจมืดเกินไป, ใบหน้าไม่ชัดเจน หรือไม่ตรงตามมาตรฐานของเครื่อง\nกรุณาลองถ่ายรูปใหม่อีกครั้งให้เห็นใบหน้าตรงและชัดเจนครับ');
        return;
      }

      if (verdict === 'fail_duplicate') {
        const apiResult = result?.apiResult;
        const dupInfo = apiResult?.DuplicateInfo || apiResult?.duplicateInfo;
        const dupName = dupInfo?.DuplicateName || dupInfo?.duplicateName || 'ไม่ระบุชื่อ';
        const dupId = dupInfo?.DuplicateUniqueID || dupInfo?.duplicateUniqueID || 'ไม่ระบุ ID';
        alert(`❌ อัปเดตไม่สำเร็จ: ใบหน้าหรือเลขบัตรนี้ "ซ้ำซ้อน" กับพนักงานในเครื่องสแกน\n\nพบข้อมูลซ้ำกับ: ${dupName} (ID: ${dupId})\n\n💡 วิธีแก้: กรุณาลบพนักงานคนเดิมออกจากเครื่องสแกนก่อนอัปโหลดอีกครั้ง`);
        return;
      }

      if (verdict === 'success') {
        alert('✅ อัปเดตข้อมูลและใบหน้าสำเร็จเรียบร้อย');
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/index.php';
        console.log('Payload Logged:', JSON.stringify(payload, null, 2));
      } else if (verdict === 'unknown') {
        // ⭐ wrapper บอกสำเร็จ แต่ resultCode จากเครื่องสแกนไม่รู้จัก -> ไม่ redirect
        console.error('%c⚠️ Unknown ResultCode (ไม่ยืนยันว่าสำเร็จ):', 'color: orange; font-weight: bold;', resultCode, result);
        alert(`⚠️ ไม่สามารถยืนยันผลการอัปเดตได้\n\nระบบได้รับการตอบกลับ แต่ผลลัพธ์จากเครื่องสแกน (ResultCode: ${resultCode}) ไม่ตรงกับรหัส "สำเร็จ" ที่ระบบรู้จัก\n\nกรุณาตรวจสอบข้อมูลในเครื่องสแกนก่อนยืนยันว่าอัปเดตสำเร็จ และแจ้งผู้ดูแลระบบพร้อม ResultCode นี้`);
      } else {
        alert('❌ อัปเดตไม่สำเร็จ: ' + (result.message || `โครงสร้างข้อมูลผิดพลาด (ResultCode: ${resultCode})`));
      }

    } catch (e) {
      console.error('⚠️ Fetch Error:', e);
      alert('⚠️ ไม่สามารถเชื่อมต่อกับ API Server ได้');
    } finally {
      hideLoading();
      updateBtn.disabled = false;
    }
  });

  /* =========================================================
        💾 UPDATE DATA SERVER (ปุ่มบันทึกข้อมูลทั่วไปท้ายฟอร์ม)
     ========================================================= */
  btnUpdateData.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('💾 CLICK UPDATE DATA (GENERAL)');

    const fd = new FormData(form);
  let rawId = String(fd.get('ID')).trim();
    let cleanNumber = rawId.replace(/[^0-9]/g, '');
    let currentUserId = rawId;

    if (cleanNumber.length === 11) {
        // === เงื่อนไขใหม่: ถ้ารหัสมาเป็น 11 หลัก (เช่น 57110010277) ===
        let year         = cleanNumber.substring(0, 2);  // ได้ "57"
        let facultyGroup = cleanNumber.substring(2, 3) + cleanNumber.substring(5, 6); // ตำแหน่งที่ 3 กับ 6 -> "1" + "0" = "10"
        let sequence     = cleanNumber.substring(7, 11); // 4 หลักสุดท้าย -> "0277"

        currentUserId = year + facultyGroup + sequence; // ผลลัพธ์: "57100277" (8 หลักพอดี ไม่ซ้ำคนอื่น)
    } else if (cleanNumber.length === 6) {
        // === เงื่อนไขเดิม: ถ้าเป็นเลข 6 หลัก ให้เติม 00 ข้างหน้า ===
        currentUserId = "00" + cleanNumber; // ผลลัพธ์: "00xxxx" (กลายเป็น 8 หลักเช่นกัน)
    }else {
        // กรณีอื่น ๆ ที่ไม่เข้าพวก ให้ใช้ตัวเลขล้วนที่สกัดได้ไปก่อน
        currentUserId = cleanNumber;
    }

    let cardValues = fd.getAll('CardNum[]').filter(Boolean);
    if (cardValues.length === 0) {
      // 💡 แก้ไขบั๊กจาก trim(currentUserId) เดิม มาใช้ substring จัดการตัดหลักแทน
      const rawCard = fd.get('CardNum');
      const singleCard = rawCard
        ? String(rawCard).trim()
        : (currentUserId.startsWith("00") ? currentUserId.substring(2) : currentUserId);
      if (singleCard) cardValues.push(singleCard);
    }
    const cards = cardValues.map(c => ({ CardNum: String(c).trim(), UserID: currentUserId }));

    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
    let hasFace = false;
    let faceInfo = null;

    if (allowFaceCheckbox.checked) {
      if (userFaceArray.length > 0) {
        hasFace = true;
        faceInfo = [{
          UserID: currentUserId,
          TemplateType: 1,
          TemplateSize: userFaceArray[0].TemplateSize,
          TemplateData: userFaceArray[0].TemplateData
        }];
      } else if (oldFaceTemplate) {
        hasFace = true;
        faceInfo = [{
          UserID: currentUserId,
          TemplateType: 1,
          TemplateSize: oldFaceTemplate.TemplateSize,
          TemplateData: oldFaceTemplate.TemplateData
        }];
      }
    } else {
      // ❌ ถ้าไม่ติ๊ก ให้เคลียร์ก้อนนี้เป็น null เช่นเดียวกัน
      faceInfo = null;
    }

    const userInfo = buildUserInfo(fd, currentUserId, hasFace);

    const payload = {
      UserInfo: userInfo,
      UserCardInfo: cards,
      UserCarInfo: null,
      UserFPInfo: null,
      UserCustomArmyHQ: null,
      UserElevatorInfo: null,
      UserFaceWTInfo: faceInfo
    };

    showLoading('กำลังบันทึกข้อมูลทั่วไป...');
    btnUpdateData.disabled = true;

    try {
      const res = await fetch(
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const result = await res.json();
      console.log('🔍 SERVER RESPONSE (RAW):', result);

      // ⭐ FIX: ใช้ classifyResult ตัวเดียวกันกับปุ่มด้านบน แทนการเช็ค
      // res.ok + result.status === 'success' อย่างเดียวโดยไม่ดู resultCode จากเครื่องสแกนเลย
      const { verdict, resultCode } = classifyResult(result);
      console.log('🔍 Detected ResultCode:', resultCode, '| verdict:', verdict);

      if (verdict === 'fail_image') {
        alert('❌ บันทึกไม่สำเร็จ: เครื่องสแกนไม่สามารถประมวลผลรูปภาพนี้ได้\n\nกรุณาลองถ่ายรูปใหม่ให้เห็นใบหน้าตรงและชัดเจน');
        return;
      }

      if (verdict === 'fail_duplicate') {
        const apiResult = result?.apiResult;
        const dupInfo = apiResult?.DuplicateInfo || apiResult?.duplicateInfo;
        const dupName = dupInfo?.DuplicateName || dupInfo?.duplicateName || 'ไม่ระบุชื่อ';
        const dupId = dupInfo?.DuplicateUniqueID || dupInfo?.duplicateUniqueID || 'ไม่ระบุ ID';
        alert(`❌ บันทึกไม่สำเร็จ: ข้อมูลนี้ "ซ้ำซ้อน" กับพนักงานในเครื่องสแกน\n\nพบข้อมูลซ้ำกับ: ${dupName} (ID: ${dupId})`);
        return;
      }

      if (verdict === 'success') {
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
      } else if (verdict === 'unknown') {
        console.error('%c⚠️ Unknown ResultCode (ไม่ยืนยันว่าสำเร็จ):', 'color: orange; font-weight: bold;', resultCode, result);
        alert(`⚠️ ไม่สามารถยืนยันผลการบันทึกได้\n\nResultCode: ${resultCode} ไม่ตรงกับรหัส "สำเร็จ" ที่ระบบรู้จัก\nกรุณาตรวจสอบข้อมูลในเครื่องสแกนก่อนยืนยัน และแจ้งผู้ดูแลระบบพร้อม ResultCode นี้`);
      } else {
        alert('❌ บันทึกไม่สำเร็จ: ' + (result.message || `ResultCode: ${resultCode}`));
      }
    } catch (e) {
      alert('⚠️ API error');
    } finally {
      hideLoading();
      btnUpdateData.disabled = false;
    }
  });

})();
