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

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
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
<<<<<<< HEAD
=======
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604

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
            ideal: 300
          },
          height: {
            ideal: 300
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

  /* ===================================================
     [REGIS FILE] - JAVASCRIPT CODE FOR REGISTER PAGE
     =================================================== */

  /* =======================
     CAPTURE (ถ่ายรูปและคำนวณขนาดไฟล์จริง)
  ======================= */
  function captureFace() {
    captureBtn.disabled = true;
    const box = lastFaceBox;
    if (!box) return;

    const ctx = outCanvas.getContext('2d');
<<<<<<< HEAD
=======
<<<<<<< HEAD

    // 🌟 [ปรับปรุงจุดที่ 1] ลดขนาด Canvas ลงเหลือ 200x200 หรือ 240x240 พิกเซล
    // เครื่องสแกนใบหน้าส่วนใหญ่ไม่ต้องการรูปใหญ่ครับ ยิ่งเล็กยิ่งเซฟลงเครื่องง่าย
    outCanvas.width = 300;
    outCanvas.height = 300;
=======
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
    
    // 🌟 [ปรับปรุงจุดที่ 1] ลดขนาด Canvas ลงเหลือ 200x200 หรือ 240x240 พิกเซล
    // เครื่องสแกนใบหน้าส่วนใหญ่ไม่ต้องการรูปใหญ่ครับ ยิ่งเล็กยิ่งเซฟลงเครื่องง่าย
    outCanvas.width = 240;
    outCanvas.height = 240;
<<<<<<< HEAD
=======
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604

    const mirroredX = video.videoWidth - box.x - box.width;
    const cx = mirroredX + box.width / 2;
    const cy = box.y + box.height / 2;
<<<<<<< HEAD
=======
<<<<<<< HEAD
    
    // 🌟 [ปรับปรุงจุดที่ 2] ลดขนาดการขยายขอบสี่เหลี่ยมลงมาเล็กน้อย (เดิมคูณ 2 กว้างเกินไป)
    const size = Math.max(box.width, box.height) * 1.6;

    ctx.save();
    ctx.scale(-1, 1); // กลับซ้ายขวาให้เหมือนกระจก
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

    const size = Math.max(box.width, box.height) * 2;

    ctx.save();
    ctx.scale(-1, 1); 
    ctx.drawImage(video, cx - size / 2, cy - size / 2, size, size, -300, 0, 300, 300);
<<<<<<< HEAD
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
    ctx.restore();

   
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    console.log('Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD

=======
    
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
    // 🌟 [ปรับปรุงจุดที่ 2] ลดขนาดการขยายขอบสี่เหลี่ยมลงมาเล็กน้อย (เดิมคูณ 2 กว้างเกินไป)
    const size = Math.max(box.width, box.height) * 1.6;

    ctx.save();
<<<<<<< HEAD
    ctx.scale(-1, 1); // กลับซ้ายขวาให้เหมือนกระจก
=======
<<<<<<< HEAD
    ctx.scale(-1, 1); // กลับซ้ายขวา
=======
    ctx.scale(-1, 1); // กลับซ้ายขวาให้เหมือนกระจก
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604

    ctx.drawImage(
      video,
      cx - size / 2,
      cy - size / 2,
      size,
      size,
<<<<<<< HEAD
      -240, 0, 240, 240   // ให้วาดลงตามขนาด Canvas ใหม่
=======
<<<<<<< HEAD
      -300, 0, 300, 300   // ให้วาดลงตามขนาด Canvas ใหม่
=======
<<<<<<< HEAD
      -300, 0, 300, 300   
=======
      -240, 0, 240, 240   // ให้วาดลงตามขนาด Canvas ใหม่
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
    );

    ctx.restore();

<<<<<<< HEAD
=======
<<<<<<< HEAD
    // 🌟 [ปรับปรุงจุดที่ 3] ลด Quality จาก 0.9 เหลือ 0.5 - 0.6 
    // ขั้นตอนนี้จะทำให้ขนาดไฟล์ไบต์จริง (Byte Size) ลดลงไปมากกว่า 60% แต่หน้ายังชัดอยู่
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.4);
    console.log('🖼 Preview:', base64DataUrl);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
=======
<<<<<<< HEAD
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    const base64 = base64DataUrl.split(',')[1];

    // ✅ [แก้ไขแล้ว] คำนวณขนาดไบต์จริงของไฟล์ JPEG ไม่ให้เครื่องสแกนมองว่าเป็นไฟล์เสีย
=======
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
    // 🌟 [ปรับปรุงจุดที่ 3] ลด Quality จาก 0.9 เหลือ 0.5 - 0.6 
    // ขั้นตอนนี้จะทำให้ขนาดไฟล์ไบต์จริง (Byte Size) ลดลงไปมากกว่า 60% แต่หน้ายังชัดอยู่
    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.55);
    const base64 = base64DataUrl.split(',')[1];

    // คำนวณขนาดไบต์จริงของไฟล์ JPEG ที่ถูกบีบอัดแล้ว
<<<<<<< HEAD
=======
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
    const padding = (base64.endsWith('=')) ? (base64.endsWith('==') ? 2 : 1) : 0;
    const actualByteSize = Math.floor((base64.length * 0.75) - padding);

    userFaceArray.length = 0;
    userFaceArray.push({
<<<<<<< HEAD
      TemplateData: base64,       
      TemplateSize: Math.floor(actualByteSize)
=======
<<<<<<< HEAD
      TemplateData: base64,       // ส่งภาพที่บีบอัดจนเล็กแล้ว
      TemplateSize: actualByteSize 
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
      TemplateData: base64,       
      TemplateSize: Math.floor(actualByteSize)
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
    });

    console.log(`📸 Captured & Compressed! New Size: ${actualByteSize} Bytes`);

<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';

    captureBtn.style.display = 'none';   
    status.style.display = 'none';      
=======
<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
      TemplateData: base64,       // ส่งภาพที่บีบอัดจนเล็กแล้ว
      TemplateSize: actualByteSize
    });

    console.log(`📸 Captured & Compressed! New Size: ${actualByteSize} Bytes`);
=======
<<<<<<< HEAD
      TemplateData: base64,
      TemplateSize: actualByteSize 
    });

    console.log(`📸 Captured! Size: ${actualByteSize} Bytes`);
=======
      TemplateData: base64,       // ส่งภาพที่บีบอัดจนเล็กแล้ว
      TemplateSize: actualByteSize 
    });

    console.log(`📸 Captured & Compressed! New Size: ${actualByteSize} Bytes`);
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77

    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';

<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
    captureBtn.style.display = 'none';   
    status.style.display = 'none';      
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604

>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
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
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';            
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
<<<<<<< HEAD
    status.style.display = 'block';
=======
    status.style.display = 'block';            
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72

    cameraStarted = false;
    updateCameraPanel();
  });
<<<<<<< HEAD

  /* =======================
     UPDATE SERVER (ปุ่มลงทะเบียน)
  ======================= */
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

=======
<<<<<<< HEAD

  /* =======================
     UPDATE SERVER (ปุ่มลงทะเบียน)
  ======================= */
 updateBtn.addEventListener('click', async (e) => {
    e.preventDefault(); 

>>>>>>> b526410014d7415a9844022493031e415f988d72
    console.log('%c--- [เริ่มการตรวจสอบข้อมูลลงทะเบียน] ---', 'font-weight: bold;');
    const fd = new FormData(form);

    let rawId = String(fd.get('ID') || "").trim();
    let userId = rawId;
<<<<<<< HEAD
=======
    if (rawId.length === 6) {
      userId = "00" + rawId; 
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
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554

  /* =======================
     UPDATE SERVER (ปุ่มลงทะเบียน)
  ======================= */
  updateBtn.addEventListener('click', async (e) => {
<<<<<<< HEAD
    e.preventDefault();
=======
<<<<<<< HEAD
    e.preventDefault();
=======
<<<<<<< HEAD
    e.preventDefault();
=======
<<<<<<< HEAD
    e.preventDefault();
=======
<<<<<<< HEAD
    e.preventDefault();
=======
<<<<<<< HEAD
    e.preventDefault();
=======
<<<<<<< HEAD
    e.preventDefault();
=======
<<<<<<< HEAD
    e.preventDefault();
=======
    e.preventDefault(); 
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554

    console.log('%c--- [เริ่มการตรวจสอบข้อมูลลงทะเบียน] ---', 'font-weight: bold;');
    const fd = new FormData(form);

<<<<<<< HEAD
    let rawId = String(fd.get('ID') || "").trim();
    let userId = rawId;
>>>>>>> b526410014d7415a9844022493031e415f988d72
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
<<<<<<< HEAD
=======
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
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
    let rawId = String(fd.get('ID') || "").trim();
    let userId = rawId;
    if (rawId.length === 6) {
      userId = "00" + rawId;
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
    }

    // 1️⃣ ตรวจสอบเงื่อนไขการกรอก: ติ๊กเปิดกล้องไว้แต่ยังไม่ได้กดถ่ายรูปใบหน้า
    if (allowFaceCheckbox.checked && allowCam && !userFaceArray.length) {
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
=======
<<<<<<< HEAD
=======
=======
    // ✅ [แก้ไขแล้ว] แปลง ID เติม 00 นำหน้ากรณีมี 6 หลักให้เป็น 8 หลักตั้งแต่สมัคร
=======

  /* =======================
     UPDATE SERVER (ปุ่มลงทะเบียน)
  ======================= */
 updateBtn.addEventListener('click', async (e) => {
    e.preventDefault(); 

    console.log('%c--- [เริ่มการตรวจสอบข้อมูลลงทะเบียน] ---', 'font-weight: bold;');
    const fd = new FormData(form);

>>>>>>> 5eb1b7f (Check Register Update Format)
    let rawId = String(fd.get('ID') || "").trim();
    let userId = rawId;
    if (rawId.length === 6) {
      userId = "00" + rawId; 
<<<<<<< HEAD
      console.log(`%c[ID Padding]: เปลี่ยนจาก ${rawId} -> ${userId}`, 'color: orange;');
    }

    if (allowFaceCheckbox.checked && allowCam && !userFaceArray.length) {
      console.warn('⚠️ Warning: ติ๊กเปิดกล้องไว้แต่ยังไม่ได้ถ่ายรูป');
=======
    }

    // 1️⃣ ตรวจสอบเงื่อนไขการกรอก: ติ๊กเปิดกล้องไว้แต่ยังไม่ได้กดถ่ายรูปใบหน้า
    if (allowFaceCheckbox.checked && allowCam && !userFaceArray.length) {
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
      alert('⚠️ กรุณากดถ่ายรูปใบหน้า หรือปิดกล้องก่อนบันทึกข้อมูล');
      return;
    }

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
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
    const hasFace = !!(allowFaceCheckbox.checked && userFaceArray.length > 0);
=======
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
    // ตรวจสอบสถานะการติ๊กและภาพที่ถ่ายจริง
    const isFaceEnabled = allowFaceCheckbox.checked;
    const hasFacePhoto = userFaceArray.length > 0;

    // ดึงค่า Base64 รูปภาพที่ถ่ายไว้ (ถ้าติ๊กและถ่ายรูปแล้ว ให้ส่งไป / ถ้าไม่ติ๊ก ให้ส่งค่าว่าง)
    const capturedBase64 = (isFaceEnabled && hasFacePhoto) ? userFaceArray[0].TemplateData : "";
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
    // เปลี่ยนเงื่อนไขให้รัดกุมขึ้น (ต้องติ๊กด้วย และต้องมีรูปด้วย ถึงจะเป็น 9 และ 1)
    const isFaceActive = isFaceEnabled && hasFacePhoto;
=======
<<<<<<< HEAD
=======
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72

    const userInfo = {
      ID: userId,
      UniqueID: String(fd.get('UniqueID')),
      Name: String(fd.get('Name')),
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceEnabled ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: 2, 
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (isFaceActive ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      AuthInfo: [2, (hasFacePhoto ? 9 : 0), 30, 0, 0, 0, 0, 0],
      Privilege: Number(fd.get('Privilege')) || 2,
=======
<<<<<<< HEAD
      // Index 1 เป็น 9 ถ้าใช้หน้า, เป็น 0 ถ้าปิด
      AuthInfo: [2, (allowFaceCheckbox.checked ? 9 : 0), 30, 0, 0, 0, 0, 0],
=======
      AuthInfo: [2, (isFaceEnabled ? 9 : 0), 30, 0, 0, 0, 0, 0],
>>>>>>> 5eb1b7f (Check Register Update Format)
      Privilege: 2, 
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
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
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: (isFaceEnabled && hasFacePhoto) ? 1 : 0, 
=======
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: isFaceActive ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: hasFacePhoto ? 1 : 0,
=======
<<<<<<< HEAD
      FaceIdentify: hasFace ? 1 : 0, 
=======
      FaceIdentify: (isFaceEnabled && hasFacePhoto) ? 1 : 0, 
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
      DuressFinger: null,
      Partition: 0,
      APBExcept: 0,
      APBZone: 0,
      WorkCode: "0",
      MealCode: "0",
      MoneyCode: "0",
      MessageCode: 0,
<<<<<<< HEAD
      VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
=======
<<<<<<< HEAD
      VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
=======
      VerifyLevel: Number(fd.get('VerifyLevel')) || 5,
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
      PositionCode: Number(fd.get('Position')) || 9997,
      EmployeeNum: "0",
      Email: String(fd.get('Email') || ''),
      Phone: "",
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
<<<<<<< HEAD
      Department: String(fd.get('Department') || ''),
      LoginPW: String(fd.get('LoginPW') || ''),
      LoginAllowed: Number(fd.get('LoginAllowed')) || 0,
=======
      Department: String(fd.get('Department')),
      LoginPW: "****",
<<<<<<< HEAD
      LoginAllowed: "0",
      Picture: capturedBase64, // ส่ง Base64 หรือค่าว่าง "" ตามเงื่อนไขด้านบน
=======
<<<<<<< HEAD
      LoginAllowed: 0,
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
      Picture: "",
=======
      LoginAllowed: "0",
      Picture: capturedBase64, // ส่ง Base64 หรือค่าว่าง "" ตามเงื่อนไขด้านบน
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
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
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
    // 2️⃣ [จุดประสงค์หลัก] ตรวจสอบเงื่อนไข Checkbox เพื่อแยกก้อนข้อมูลส่ง
    let faceInfo = null;
    if (isFaceEnabled && hasFacePhoto) {
      // ติ๊กเลือก -> ส่งอาร์เรย์ข้อมูลใบหน้าตามโครงสร้าง API ของเครื่องสแกน
      faceInfo = [{
<<<<<<< HEAD
=======
<<<<<<< HEAD
        UserID: userId,                      
        TemplateSize: 0,    
        TemplateData: "",   
        TemplateType: 1                      
=======
>>>>>>> b526410014d7415a9844022493031e415f988d72
        UserID: userId,
        TemplateSize: userFaceArray[0].TemplateSize,
        TemplateData: capturedBase64,
        TemplateType: 1
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
=======
=======
<<<<<<< HEAD
    let faceInfo = null;
    if (hasFace) {
      faceInfo = [{
        UserID: userId,                      
        TemplateSize: userFaceArray[0].TemplateSize, 
        TemplateData: userFaceArray[0].TemplateData, 
=======
    // 2️⃣ [จุดประสงค์หลัก] ตรวจสอบเงื่อนไข Checkbox เพื่อแยกก้อนข้อมูลส่ง
    let faceInfo = null;
    if (isFaceEnabled && hasFacePhoto) {
      // ติ๊กเลือก -> ส่งอาร์เรย์ข้อมูลใบหน้าตามโครงสร้าง API ของเครื่องสแกน
      faceInfo = [{
        UserID: userId,                      
        TemplateSize: 0,    
        TemplateData: "",   
>>>>>>> 5eb1b7f (Check Register Update Format)
        TemplateType: 1                      
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
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

<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group('📝 REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
<<<<<<< HEAD
    console.group(' REGISTER PAYLOAD');
=======
    console.group('📝 REGISTER PAYLOAD');
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
    console.log('Object View:', payload);
    console.groupEnd();

    try {
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
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
      showLoading('กำลังอัปโหลดข้อมูลและใบหน้าไปยังเครื่องสแกน...');
      updateBtn.disabled = true;

      // ⏱ ตัดที่ 5 วินาที
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
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
        console.warn('Timeout! ตัด session แล้ว');
      }, 12000);

      console.log(' Sending payload...');
      console.log(' Payload size:', JSON.stringify(payload).length, 'bytes');
      console.log(' TemplateSize:', userFaceArray[0]?.TemplateSize, 'bytes');
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
        console.warn('⏱ Timeout! ตัด session แล้ว');
      }, 12000);

      console.log('🚀 Sending payload...');
      console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
      console.log('🖼 TemplateSize:', userFaceArray[0]?.TemplateSize, 'bytes');
=======
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
      console.log('🚀 Sending payload to PHP Controller...');
      const response = await fetch('https://lib.swu.ac.th/app/ci4_new/public/apidoor/addusers', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
      });
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72

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
<<<<<<< HEAD

      // ✅ เพิ่มใหม่: เช็ค HTTP status ก่อน เพื่อแยก error "เซิร์ฟเวอร์ล่ม" ออกจาก "เครื่องสแกนปฏิเสธ"
      if (!response.ok) {
        console.error('%c❌ HTTP Error:', 'color: red;', response.status, result);
        alert(`❌ เซิร์ฟเวอร์ตอบกลับผิดปกติ (HTTP ${response.status})\n${result?.message || 'กรุณาลองใหม่อีกครั้ง'}`);
        return;
=======
      const apiResult = result?.apiResult;
      const innerResult = apiResult?.Result || apiResult?.result;
<<<<<<< HEAD
      const rawResultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;
      const resultCode = Number(rawResultCode);
      console.log('🔍 Detected ResultCode:', resultCode);

      // whitelist: 0 (ErrorNone) เท่านั้นที่ถือว่าสำเร็จจริง
      if (response.ok && result.status === 'success' && resultCode === 0) {
        console.log('%c✅ Success:', 'color: green; font-weight: bold;', result);
        alert('✅ บันทึกข้อมูลและลงทะเบียนเรียบร้อยแล้ว');
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/logout.php';
        return;
=======
      const resultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;
      console.log('🔍 Detected ResultCode:', resultCode);

      if (resultCode === 33558286 || String(resultCode) === "33558286" ||
        resultCode === 33558281 || String(resultCode) === "33558281") {
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
      if (response.ok && result.status === 'success') {
        console.log('%c✅ Success:', 'color: green; font-weight: bold;', result);
<<<<<<< HEAD
        alert('✅ บันทึกข้อมูลและลงทะเบียนเรียบร้อยแล้ว');
        window.location.href = 'login.php?timeout=1'; 
      } else {
        console.error('%c❌ API Error:', 'color: red;', result);
        alert('เกิดข้อผิดพลาดจากระบบ: ' + (result.message || 'Unknown Error'));
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
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
        alert('✅ บันทึกข้อมูลและลงทะเบียนเรียบร้อยแล้ว');
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/test_deploy/logout.php';
      } else {
        console.error('%c❌ API Error:', 'color: red;', result);
        alert('❌ เกิดข้อผิดพลาด: ' + (result.message || 'Unknown Error'));
<<<<<<< HEAD
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
      }

      const apiResult = result?.apiResult;
      const innerResult = apiResult?.Result || apiResult?.result;
      const rawResultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;
      const resultCode = Number(rawResultCode);
      console.log('🔍 Detected ResultCode:', resultCode);

      // whitelist: 0 (ErrorNone) เท่านั้นที่ถือว่าสำเร็จจริง
      if (result.status === 'success' && resultCode === 0) {
        console.log('%c✅ Success:', 'color: green; font-weight: bold;', result);
        alert('✅ บันทึกข้อมูลและลงทะเบียนเรียบร้อยแล้ว');
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/logout.php';
        return;
      }

      // ------ Error mapping (ตาม ErrorCode ของเครื่องสแกน) ------
      const ERROR_MAP = {
        // 0x02 Face capture errors
        33558281: '❌ ไม่พบใบหน้าในภาพ กรุณาถ่ายรูปใหม่',                      // ErrorFacewtNoFace
        33558282: '❌ พบใบหน้ามากกว่า 1 หน้าในภาพ',                           // ErrorFacewtMultiFace
        33558283: '❌ ใบหน้าในภาพเล็กเกินไป กรุณาเข้าใกล้กล้อง',              // ErrorFacewtSmall
        33558284: '❌ คุณภาพใบหน้าต่ำเกินไป กรุณาถ่ายในที่แสงสว่างพอ',       // ErrorFacewtLowScore
        33558285: '❌ กรุณาหันหน้าตรงเข้ากล้อง',                              // ErrorFacewtSideFace
        33558286: '❌ ภาพไม่ชัด กรุณาถ่ายรูปใหม่',                            // ErrorFacewtVague
        33558287: '❌ กรุณาเข้าใกล้กล้องมากขึ้น',                             // ErrorFacewtTooFar
        33558288: '❌ ระบบจดจำใบหน้าล้มเหลว กรุณาลองใหม่',                   // ErrorFacewtRecogFail
        33558295: '❌ กรุณาถอดหน้ากากอนามัยก่อนถ่ายรูป',                     // ErrorWearingMask
        33558296: '❌ ไฟล์ภาพเสียหาย กรุณาถ่ายรูปใหม่',                      // ErrorImageBroken

        // 0x01 Duplicate / ID errors
        16777217: '❌ รหัสผู้ใช้นี้มีอยู่ในระบบแล้ว (Duplicate ID) กรุณาตรวจสอบรหัสผู้ใช้',
        16777222: '❌ UniqueID ซ้ำกับผู้ใช้ในระบบ',
        16777223: '❌ UniqueID ซ้ำ (Not Unique)',
        16777224: '❌ ผู้ใช้นี้มีอยู่แล้วในระบบ (User Exist)',
        16777235: '❌ บัตร RF ซ้ำกับผู้ใช้อื่น',
        16777236: '❌ ใบหน้านี้คล้าย/ซ้ำกับผู้ใช้อื่นในระบบ',
        16777237: '❌ บัตรนี้คล้าย/ซ้ำกับผู้ใช้อื่นในระบบ',
      };

      if (resultCode === 16777236 || resultCode === 16777237) {
        const dupInfo = apiResult?.DuplicateInfo || apiResult?.duplicateInfo;
        const dupName = dupInfo?.DuplicateName || dupInfo?.duplicateName || 'ไม่ระบุชื่อ';
        const dupId = dupInfo?.DuplicateUniqueID || dupInfo?.duplicateUniqueID || 'ไม่ระบุ ID';
        alert(`${ERROR_MAP[resultCode]}\n\nพบข้อมูลซ้ำกับ: ${dupName} (ID: ${dupId})\n\n💡 วิธีแก้: กรุณาลบพนักงานคนเดิมออกจากเครื่องสแกนก่อนอัปโหลดอีกครั้ง`);
        return;
      }

      // ✅ แก้ NaN: เช็คด้วย Number.isNaN แทน ?? เพราะ Number(undefined) = NaN ไม่ใช่ undefined
      const codeDisplay = Number.isNaN(resultCode) ? 'ไม่ทราบ' : resultCode;
      console.error('%c❌ API Error / Unhandled ResultCode:', 'color: red;', { resultCode, result });
      alert(ERROR_MAP[resultCode] || `❌ เกิดข้อผิดพลาด (Code: ${codeDisplay})\n${result.message || 'กรุณาลองใหม่ หรือแจ้งผู้ดูแลระบบพร้อมรหัสนี้'}`);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว (5 วินาที)');
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
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว (5 วินาที)');
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
=======
<<<<<<< HEAD
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว (5 วินาที)');
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
=======
<<<<<<< HEAD
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว (5 วินาที)');
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
=======
<<<<<<< HEAD
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว (5 วินาที)');
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
=======
<<<<<<< HEAD
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว (5 วินาที)');
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
=======
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏱ ตัด request แล้ว (5 วินาที)');
        // ⭐ ไม่ alert ที่ทำให้ user งง แค่แสดง status
        alert('⏱ ระบบใช้เวลานาน\nข้อมูลอาจถูกบันทึกแล้ว กรุณาตรวจสอบในระบบอีกครั้ง');
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
=======
<<<<<<< HEAD
        alert('✅ บันทึกข้อมูลและลงทะเบียนใบหน้าเรียบร้อยแล้ว');
        // ✅ [แก้ไขแล้ว] ย้ายมาใส่ตรงนี้ สำเร็จจริงค่อยเปลี่ยนหน้า ไม่ปล่อยเบลอเด้งหนีเหมือนเดิม
=======
        alert('✅ บันทึกข้อมูลและลงทะเบียนเรียบร้อยแล้ว');
>>>>>>> 5eb1b7f (Check Register Update Format)
        window.location.href = 'login.php?timeout=1'; 
      } else {
        console.error('%c❌ API Error:', 'color: red;', result);
        alert('เกิดข้อผิดพลาดจากระบบ: ' + (result.message || 'Unknown Error'));
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
      }

      // ------ Error mapping (ตาม ErrorCode ของเครื่องสแกน) ------
      const ERROR_MAP = {
        // 0x02 Face capture errors
        33558281: '❌ ไม่พบใบหน้าในภาพ กรุณาถ่ายรูปใหม่',                      // ErrorFacewtNoFace
        33558282: '❌ พบใบหน้ามากกว่า 1 หน้าในภาพ',                           // ErrorFacewtMultiFace
        33558283: '❌ ใบหน้าในภาพเล็กเกินไป กรุณาเข้าใกล้กล้อง',              // ErrorFacewtSmall
        33558284: '❌ คุณภาพใบหน้าต่ำเกินไป กรุณาถ่ายในที่แสงสว่างพอ',       // ErrorFacewtLowScore
        33558285: '❌ กรุณาหันหน้าตรงเข้ากล้อง',                              // ErrorFacewtSideFace
        33558286: '❌ ภาพไม่ชัด กรุณาถ่ายรูปใหม่',                            // ErrorFacewtVague
        33558287: '❌ กรุณาเข้าใกล้กล้องมากขึ้น',                             // ErrorFacewtTooFar
        33558288: '❌ ระบบจดจำใบหน้าล้มเหลว กรุณาลองใหม่',                   // ErrorFacewtRecogFail
        33558295: '❌ กรุณาถอดหน้ากากอนามัยก่อนถ่ายรูป',                     // ErrorWearingMask
        33558296: '❌ ไฟล์ภาพเสียหาย กรุณาถ่ายรูปใหม่',                      // ErrorImageBroken

        // 0x01 Duplicate / ID errors
        16777217: '❌ รหัสผู้ใช้นี้มีอยู่ในระบบแล้ว (Duplicate ID) กรุณาตรวจสอบรหัสผู้ใช้',
        16777222: '❌ UniqueID ซ้ำกับผู้ใช้ในระบบ',
        16777223: '❌ UniqueID ซ้ำ (Not Unique)',
        16777224: '❌ ผู้ใช้นี้มีอยู่แล้วในระบบ (User Exist)',
        16777235: '❌ บัตร RF ซ้ำกับผู้ใช้อื่น',
        16777236: '❌ ใบหน้านี้คล้าย/ซ้ำกับผู้ใช้อื่นในระบบ',
        16777237: '❌ บัตรนี้คล้าย/ซ้ำกับผู้ใช้อื่นในระบบ',
      };

      if (resultCode === 16777236 || resultCode === 16777237) {
        const dupInfo = apiResult?.DuplicateInfo || apiResult?.duplicateInfo;
        const dupName = dupInfo?.DuplicateName || dupInfo?.duplicateName || 'ไม่ระบุชื่อ';
        const dupId = dupInfo?.DuplicateUniqueID || dupInfo?.duplicateUniqueID || 'ไม่ระบุ ID';
        alert(`${ERROR_MAP[resultCode]}\n\nพบข้อมูลซ้ำกับ: ${dupName} (ID: ${dupId})\n\n💡 วิธีแก้: กรุณาลบพนักงานคนเดิมออกจากเครื่องสแกนก่อนอัปโหลดอีกครั้ง`);
        return;
      }

      console.error('%c❌ API Error / Unhandled ResultCode:', 'color: red;', { resultCode, result });
      alert(ERROR_MAP[resultCode] || `❌ เกิดข้อผิดพลาด (Code: ${resultCode ?? 'ไม่ทราบ'})\n${result.message || 'กรุณาลองใหม่ หรือแจ้งผู้ดูแลระบบพร้อมรหัสนี้'}`);

    } catch (error) {
<<<<<<< HEAD
      if (error.name === 'AbortError') {
        console.warn(' ตัด request แล้ว (5 วินาที)');
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
=======
      console.error('%c❌ Network Error:', 'color: red;', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
<<<<<<< HEAD
=======
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
    }
  });
})();
