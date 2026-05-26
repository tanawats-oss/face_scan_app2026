(async function() {

  /* =======================
<<<<<<< HEAD
     DOM
=======
      DOM
>>>>>>> 5eb1b7f (Check Register Update Format)
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

  /* =======================
<<<<<<< HEAD
     Guard DOM
=======
      Guard DOM
>>>>>>> 5eb1b7f (Check Register Update Format)
  ======================= */
  if (!video || !overlay || !outCanvas || !updateBtn || !form || !panelResult || !captureBtn) {
    console.error('❌ DOM ไม่ครบ');
    return;
  }

  /* =======================
<<<<<<< HEAD
     Loading
=======
      Loading
>>>>>>> 5eb1b7f (Check Register Update Format)
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
<<<<<<< HEAD
     STATE
=======
      STATE
>>>>>>> 5eb1b7f (Check Register Update Format)
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
<<<<<<< HEAD
    PDPA
=======
     PDPA
>>>>>>> 5eb1b7f (Check Register Update Format)
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
<<<<<<< HEAD
     UI CONTROL
=======
      UI CONTROL
>>>>>>> 5eb1b7f (Check Register Update Format)
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
<<<<<<< HEAD
     CAMERA
  ======================= */
=======
      CAMERA
  ====================== */
>>>>>>> 5eb1b7f (Check Register Update Format)
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
        video: { facingMode: "user", width: { ideal: 240 }, height: { ideal: 240 }, frameRate: { ideal: 15 } },
        audio: false
      });
      video.srcObject = stream;
      video.setAttribute('playsinline', true);
      await new Promise(r => video.addEventListener('loadedmetadata', r, { once: true }));
      await video.play();

      overlay.width = video.videoWidth || 240;
      overlay.height = video.videoHeight || 240;
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
<<<<<<< HEAD
     FACE DETECT & OVERLAY
=======
      FACE DETECT & OVERLAY
>>>>>>> 5eb1b7f (Check Register Update Format)
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
    requestAnimationFrame(drawOverlay);
  }

  /* =======================
<<<<<<< HEAD
     CAPTURE
=======
      CAPTURE
>>>>>>> 5eb1b7f (Check Register Update Format)
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
    
    const padding = (base64.endsWith('=')) ? (base64.endsWith('==') ? 2 : 1) : 0;
    const actualByteSize = (base64.length * 0.75) - padding;

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

  retakeBtn?.addEventListener('click', () => {
    userFaceArray.length = 0;
    panelResult.style.display = 'none';
    videoContainer.style.display = 'block';
    captureBtn.disabled = true;
    captureBtn.style.opacity = '0.5';
    status.textContent = 'พร้อมตรวจจับใบหน้า';
    status.style.color = '#333';
    captureBtn.style.display = 'inline-block';
    status.style.display = 'block';
    updateCameraPanel();
  });

  /* =========================================================
<<<<<<< HEAD
     📥 UPDATE SERVER (ปุ่มถ่ายรูปอัปเดตใบหน้า - ยุบรวมแก้บั๊กซ้ำซ้อนแล้ว)
=======
     📥 UPDATE SERVER (ปุ่มถ่ายรูปอัปเดตใบหน้า)
>>>>>>> 5eb1b7f (Check Register Update Format)
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
<<<<<<< HEAD
=======

>>>>>>> 5eb1b7f (Check Register Update Format)
    let currentUserId = rawId;
    if (rawId.length === 6) {
      currentUserId = "00" + rawId;
    }

    let cardValues = fd.getAll('CardNum[]').filter(Boolean);
    if (cardValues.length === 0) {
      const singleCard = fd.get('CardNum') || rawId; 
      if (singleCard) cardValues.push(singleCard);
    }
<<<<<<< HEAD
    const cards = cardValues.map(c => ({ CardNum: String(c).trim(), UserID: currentUserId }));

=======

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

    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้า
>>>>>>> 5eb1b7f (Check Register Update Format)
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
<<<<<<< HEAD
=======
    } else {
      // ❌ ถ้าไม่ติ๊ก ให้เคลียร์ก้อนนี้เป็น null ตามที่คุณไปตรวจสอบมา
      faceInfo = null;
>>>>>>> 5eb1b7f (Check Register Update Format)
    }

    const userInfo = {
      ID: currentUserId, 
      UniqueID: fd.get('UniqueID'),
      Name: fd.get('Name'),
<<<<<<< HEAD
      AuthInfo: [2, (hasFace ? 9 : 0), 30, 0, 0, 0, 0, 0], // บังคับเป็น 9 เปิดระบบใบหน้า
=======
      AuthInfo: [2, (hasFace ? 9 : 0), 30, 0, 0, 0, 0, 0], 
>>>>>>> 5eb1b7f (Check Register Update Format)
      Privilege: Number(fd.get('Privilege')) || 2,
      GroupCode: Number(fd.get('GroupCode')) || 1000,
      AccessGroupCode: Number(fd.get('AccessGroupCode')) || 3000,
      UserType: Number(fd.get('UserType')) || 0,
      VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
      FaceIdentify: hasFace ? 1 : 0,
      Email: fd.get('Email') || '',
      Department: fd.get('Department') || '',
<<<<<<< HEAD
=======
      LoginAllowed: "0",
>>>>>>> 5eb1b7f (Check Register Update Format)
      Picture: ""
    };

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
<<<<<<< HEAD
      if (res.ok) {
        alert('✅ อัปเดตข้อมูลและใบหน้าสำเร็จเรียบร้อย');
        location.reload();
      } else {
        alert('❌ อัปเดตไม่สำเร็จ: ' + (result.message || 'โครงสร้างข้อมูลผิดพลาด'));
      }
    } catch (e) {
      alert('⚠️ ไม่สามารถเชื่อมต่อกับ API Server ได้');
    } finally {
      hideLoading();
      updateBtn.disabled = false;
    }
  });

=======
      console.log('🔍 SERVER RESPONSE (RAW):', result);

      const apiResult = result?.apiResult;
      const innerResult = apiResult?.Result || apiResult?.result;
      const resultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;

      console.log('🔍 Detected ResultCode:', resultCode);
      if (resultCode === 33558286 || String(resultCode) === "33558286" || resultCode === 33558281 || String(resultCode) === "33558281") {
        alert('❌ อัปเดตไม่สำเร็จ: เครื่องสแกนไม่สามารถประมวลผลรูปภาพนี้ได้\n\n💡 สาเหตุ: รูปถ่ายอาจมืดเกินไป, ใบหน้าไม่ชัดเจน หรือไม่ตรงตามมาตรฐานของเครื่อง\nกรุณาลองถ่ายรูปใหม่อีกครั้งให้เห็นใบหน้าตรงและชัดเจนครับ');
        return; 
      }
      if (resultCode === 16777237 || String(resultCode) === "16777237" || resultCode === 16777241 || String(resultCode) === "16777241") {
        const dupInfo = apiResult?.DuplicateInfo || apiResult?.duplicateInfo;
        const dupName = dupInfo?.DuplicateName || dupInfo?.duplicateName || 'ไม่ระบุชื่อ';
        const dupId = dupInfo?.DuplicateUniqueID || dupInfo?.duplicateUniqueID || 'ไม่ระบุ ID';

        alert(`❌ อัปเดตไม่สำเร็จ: ใบหน้าหรือเลขบัตรนี้ "ซ้ำซ้อน" กับพนักงานในเครื่องสแกน\n\nพบข้อมูลซ้ำกับ: ${dupName} (ID: ${dupId})\n\n💡 วิธีแก้: กรุณาลบพนักงานคนเดิมออกจากเครื่องสแกนก่อนอัปโหลดอีกครั้ง`);
        return; 
      }

      if (res.ok && (result.status === "success" || result.status === "SUCCESS")) {
        alert('✅ อัปเดตข้อมูลและใบหน้าสำเร็จเรียบร้อย');
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

>>>>>>> 5eb1b7f (Check Register Update Format)
  /* =========================================================
        💾 UPDATE DATA SERVER (ปุ่มบันทึกข้อมูลทั่วไปท้ายฟอร์ม)
     ========================================================= */
  btnUpdateData.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('💾 CLICK UPDATE DATA (GENERAL)');

    const fd = new FormData(form);
    let rawId = String(fd.get('ID')).trim();
    let currentUserId = rawId;
    if (rawId.length === 6) {
      currentUserId = "00" + rawId;
    }

    let cardValues = fd.getAll('CardNum[]').filter(Boolean);
    if (cardValues.length === 0) {
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
=======
      // 💡 แก้ไขบั๊กจาก trim(currentUserId) เดิม มาใช้ substring จัดการตัดหลักแทน
      const rawCard = fd.get('CardNum');
      const singleCard = rawCard 
        ? String(rawCard).trim() 
        : (currentUserId.startsWith("00") ? currentUserId.substring(2) : currentUserId);
>>>>>>> 5eb1b7f (Check Register Update Format)
      if (singleCard) cardValues.push(singleCard);
    }
    const cards = cardValues.map(c => ({ CardNum: String(c).trim(), UserID: currentUserId }));

<<<<<<< HEAD
=======
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
>>>>>>> 5eb1b7f (Check Register Update Format)
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
<<<<<<< HEAD
=======
    } else {
      // ❌ ถ้าไม่ติ๊ก ให้เคลียร์ก้อนนี้เป็น null เช่นเดียวกัน
      faceInfo = null;
>>>>>>> 5eb1b7f (Check Register Update Format)
    }

    const userInfo = {
        ID: currentUserId,
        UniqueID: fd.get('UniqueID'),
        Name: fd.get('Name'),
        AuthInfo: [2, (hasFace ? 9 : 0), 30, 0, 0, 0, 0, 0],
        Privilege: Number(fd.get('Privilege')) || 2,
        GroupCode: Number(fd.get('GroupCode')) || 1000,
        AccessGroupCode: Number(fd.get('AccessGroupCode')) || 3000,
        UserType: Number(fd.get('UserType')) || 0,
        VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
        FaceIdentify: hasFace ? 1 : 0, 
        Email: fd.get('Email') || '',
        Department: fd.get('Department') || '',
<<<<<<< HEAD
=======
        LoginAllowed: "0",
>>>>>>> 5eb1b7f (Check Register Update Format)
        Picture: ""
    };

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

      if (res.ok) {
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
<<<<<<< HEAD
        location.reload();
=======
        console.log(payload);
>>>>>>> 5eb1b7f (Check Register Update Format)
      } else {
        alert('❌ บันทึกไม่สำเร็จ');
      }
    } catch (e) {
      alert('⚠️ API error');
    } finally {
      hideLoading();
      btnUpdateData.disabled = false;
    }
  });

})();