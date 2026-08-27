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
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
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
    animFrameId = requestAnimationFrame(drawOverlay);
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
    ctx.scale(-1, 1);
    ctx.drawImage(video, cx - size / 2, cy - size / 2, size, size, -300, 0, 300, 300);
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

  captureBtn.addEventListener('click', () => {
    if (!lastFaceBox) { status.textContent = '❌ ยังไม่พบใบหน้า'; return; }
    captureFace();
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

      const apiResult = result?.apiResult;
      const innerResult = apiResult?.Result || apiResult?.result;
      const resultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;

      console.log('🔍 Detected ResultCode:', resultCode);

      if ([33558286, "33558286", 33558281, "33558281"].includes(resultCode)) {
        alert('❌ อัปเดตไม่สำเร็จ: เครื่องสแกนไม่สามารถประมวลผลรูปภาพนี้ได้\n\n💡 สาเหตุ: รูปถ่ายอาจมืดเกินไป, ใบหน้าไม่ชัดเจน หรือไม่ตรงตามมาตรฐานของเครื่อง\nกรุณาลองถ่ายรูปใหม่อีกครั้งให้เห็นใบหน้าตรงและชัดเจนครับ');
        return;
      }

      if (resultCode === 16777237 || String(resultCode) === "16777237" ||
        resultCode === 16777241 || String(resultCode) === "16777241") {
        const dupInfo = apiResult?.DuplicateInfo || apiResult?.duplicateInfo;
        const dupName = dupInfo?.DuplicateName || dupInfo?.duplicateName || 'ไม่ระบุชื่อ';
        const dupId = dupInfo?.DuplicateUniqueID || dupInfo?.duplicateUniqueID || 'ไม่ระบุ ID';
        alert(`❌ อัปเดตไม่สำเร็จ: ใบหน้าหรือเลขบัตรนี้ "ซ้ำซ้อน" กับพนักงานในเครื่องสแกน\n\nพบข้อมูลซ้ำกับ: ${dupName} (ID: ${dupId})\n\n💡 วิธีแก้: กรุณาลบพนักงานคนเดิมออกจากเครื่องสแกนก่อนอัปโหลดอีกครั้ง`);
        return;
      }

      if (res.ok && (result.status === "success" || result.status === "SUCCESS")) {
        alert('✅ อัปเดตข้อมูลและใบหน้าสำเร็จเรียบร้อย');
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/index.php';
        console.log('Payload Logged:', JSON.stringify(payload, null, 2));
      } else {
        alert('❌ อัปเดตไม่สำเร็จ: ' + (result.message || 'โครงสร้างข้อมูลผิดพลาด'));
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
      // พิ่ม ResultCode check 
      const result = await res.json();
      const apiResult = result?.apiResult;
      const innerResult = apiResult?.Result || apiResult?.result;
      const resultCode = innerResult?.ResultCode ?? innerResult?.resultCode;
      if (res.ok && (result.status === "success" || result.status === "SUCCESS")) {
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
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