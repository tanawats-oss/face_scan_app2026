<<<<<<< HEAD
(async function () {

  /* =======================
      GUARD: กันสคริปต์นี้ถูกโหลด/รันซ้ำมากกว่า 1 ครั้งในหน้าเดียว
      (เช่น กรณีมีทั้ง <script src> แบบตรง ๆ และตัว dynamic loader
      ที่ inject ไฟล์เดิมซ้ำอีกรอบ — จะทำให้เกิด state/listener ซ้อนกัน
      กล้องเปิด 2 stream, การถ่ายรูปสุ่มไม่ขึ้นภาพ ฯลฯ)
  ======================= */
  if (window.__mainJsInitialized) {
    console.warn('⚠️ main.js ถูกเรียกซ้ำ — ข้ามการรันรอบนี้');
    return;
  }
  window.__mainJsInitialized = true;

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
  let stableFrameCount = 0;
  const STABLE_FRAMES_REQUIRED = 6;

  const userFaceArray = [];
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
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
<<<<<<< HEAD
=======
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0

  const updateBtn = document.getElementById('updateServerBtn');
  const form = document.getElementById('editUserForm');
  const btnUpdateData = document.getElementById('btn-updatedata');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const captureBtn = document.getElementById('captureBtn');

<<<<<<< HEAD
 /* =======================
    PDPA CONTROL (แก้ไขใหม่)
======================= */
function showPdpa() { 
    if (!pdpaModal) return;
    pdpaModal.style.display = 'flex';
    pdpaModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function hidePdpa() { 
    if (!pdpaModal) return;
    pdpaModal.style.display = 'none';
    pdpaModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

=======
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
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)

  const updateBtn = document.getElementById('updateServerBtn');
  const form = document.getElementById('editUserForm');
  const btnUpdateData = document.getElementById('btn-updatedata');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const captureBtn = document.getElementById('captureBtn');

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
(async function() {

  /* =======================
      DOM
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
(async function () {

  /* =======================
      DOM
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
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
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
<<<<<<< HEAD
  let pdpaAccepted = false; 
  let stream = null;
  let cameraStarted = false;
  let allowCam = false; 
=======
  let pdpaAccepted = false;
  let stream = null;
  let cameraStarted = false;
  let allowCam = false;
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
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
=======
(async function() {

  /* =======================
<<<<<<< HEAD
     DOM
=======
      DOM
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
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
<<<<<<< HEAD
     Guard DOM
=======
      Guard DOM
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
  ======================= */
  if (!video || !overlay || !outCanvas || !updateBtn || !form || !panelResult || !captureBtn) {
    console.error('❌ DOM ไม่ครบ');
    return;
  }

  /* =======================
<<<<<<< HEAD
      Loading
=======
<<<<<<< HEAD
     Loading
=======
      Loading
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
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
  ======================= */
  let pdpaAccepted = false;
  let stream = null;
  let cameraStarted = false;
  let allowCam = false;
=======
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
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
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
<<<<<<< HEAD
    PDPA
=======
     PDPA
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> 515c0969da196d8b3d62942b6cd2f17169851a77
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
<<<<<<< HEAD
     UI CONTROL
=======
      UI CONTROL
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
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
      CAMERA
  ====================== */
=======
<<<<<<< HEAD
     CAMERA
  ======================= */
=======
      CAMERA
  ====================== */
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
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 240 }, height: { ideal: 240 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
<<<<<<< HEAD
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
=======
        video: { facingMode: "user", width: { ideal: 240 }, height: { ideal: 240 }, frameRate: { ideal: 15 } },
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
        audio: false
      });
      video.srcObject = stream;
      video.setAttribute('playsinline', true);
      await new Promise(r => video.addEventListener('loadedmetadata', r, { once: true }));
      await video.play();

<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 240;
      overlay.height = video.videoHeight || 240;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
<<<<<<< HEAD
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
=======
      overlay.width = video.videoWidth || 240;
      overlay.height = video.videoHeight || 240;
>>>>>>> fec99f40f4e2c9bd187f0b30f9081246d98f6f24
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
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
<<<<<<< HEAD
    if (animFrameId) cancelAnimationFrame(animFrameId);
=======
>>>>>>> b526410014d7415a9844022493031e415f988d72
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    if (video.srcObject) { video.srcObject = null; }
=======
 /* =======================
    PDPA CONTROL (แก้ไขใหม่)
======================= */
function showPdpa() { 
    if (!pdpaModal) return;
    pdpaModal.style.display = 'flex';
    pdpaModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function hidePdpa() { 
    if (!pdpaModal) return;
    pdpaModal.style.display = 'none';
    pdpaModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
// เมื่อกด "ยินยอม" ใน PDPA
if (pdpaAcceptBtn) {
    pdpaAcceptBtn.addEventListener('click', () => {
        pdpaAccepted = true;
        hidePdpa();
        allowCam = true;
<<<<<<< HEAD
        updateCameraPanel(); // เปิด Panel กล้องและสั่งทันที
=======
        updateCameraPanel(); // เปิด Panel กล้องและสั่ง startCamera() ทันที
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    });
}

if (pdpaDeclineBtn) {
    pdpaDeclineBtn.addEventListener('click', () => {
        pdpaAccepted = false;
        hidePdpa();
    });
}
  /* =======================
      UI CONTROL
======================= */
function updateCameraPanel() {
  if (!allowFaceCheckbox.checked) {
    panelNewphoto.style.display = 'none';
    panelResult.style.display = 'none';
    panelFaceDB.style.display = 'block';
    panelUpdateData.style.display = 'block';
    document.body.style.overflow = '';
    stopCamera();
    return;
  }

  if (!allowCam) {
    panelNewphoto.style.display = 'none';
    panelResult.style.display = 'none';
    panelFaceDB.style.display = 'block';
    panelUpdateData.style.display = 'none';
    document.body.style.overflow = '';
    stopCamera();
    return;
  }

  // เปิด Panel กล้องทับหน้าจอ
  panelNewphoto.style.display = 'block';
  panelNewphoto.scrollTop = 0; // เลื่อนกล่องถ่ายรูปไปบนสุด
  document.body.style.overflow = 'hidden'; // ล็อกไม่ให้หน้าหลังเลื่อน
  
  panelFaceDB.style.display = 'none';
  panelUpdateData.style.display = 'none';
  startCamera();
}
<<<<<<< HEAD
=======


>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
// ฟังก์ชันปิดกล้องสำหรับปุ่มกากบาท (✕)
window.closeCameraPanel = function () {
  allowCam = false;
  stopCamera();        // stopCamera() อยู่ใน IIFE เดียวกันกับ stream จะสั่งตัดไฟกล้องได้จริง 100%
  updateCameraPanel(); // ซ่อนหน้าต่างและสลับ UI กลับ
};
// กำหนดสถานะเริ่มต้น
allowCam = false;
allowCamBtn.textContent = 'เปิดกล้องถ่ายรูป';
allowCamBtn.disabled = !allowFaceCheckbox.checked;

updateCameraPanel();

allowFaceCheckbox.addEventListener('change', () => {
  allowCam = false;
  allowCamBtn.disabled = !allowFaceCheckbox.checked;
  updateCameraPanel();
});

allowCamBtn.addEventListener('click', () => {
  if (!allowFaceCheckbox.checked) {
    alert('กรุณาอนุญาตการลงทะเบียนใบหน้าก่อน');
    return;
  }
  if (!pdpaAccepted) {
    showPdpa();
    return;
  }
  
  // เปิดกล้อง (การปิดกล้องจะทำผ่านปุ่มกากบาท ✕ แทน)
  allowCam = true;
  updateCameraPanel();
});

  /* =======================
      CAMERA
  ====================== */
<<<<<<< HEAD
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

=======
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
  async function loadFaceModelOnce() {
    if (window._faceModelLoaded) return;
    await faceapi.nets.tinyFaceDetector.loadFromUri('./face-api.js-master/weights');
    window._faceModelLoaded = true;
  }

<<<<<<< HEAD
   async function startCamera() {
    if (cameraStarted) return;
    cameraStarted = true;

    try {
      status.textContent = '📷 กำลังเปิดกล้อง...';
      Perf.start('getUserMedia');

      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          // FIX: เพิ่มความละเอียดจาก 300x300 -> 480x480
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
=======
  async function startCamera() {
    if (cameraStarted) return;
    cameraStarted = true;
    try {
      status.textContent = '📷 กำลังเปิดกล้อง...';
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 300 }, height: { ideal: 300 }, frameRate: { ideal: 15 } },
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
        audio: false
      });
      video.srcObject = stream;
      video.setAttribute('playsinline', true);
      await new Promise(r => video.addEventListener('loadedmetadata', r, { once: true }));
      await video.play();

<<<<<<< HEAD
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
      stableFrameCount = 0; // reset ตัวนับความนิ่งทุกครั้งที่เปิดกล้องใหม่
      drawOverlay();

=======
      overlay.width = video.videoWidth || 300;
      overlay.height = video.videoHeight || 300;
      status.textContent = 'กำลังโหลด...';
      await loadFaceModelOnce();
      status.textContent = '✅ พร้อมตรวจจับใบหน้า';
      overlayRunning = true;
      drawOverlay();
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    } catch (e) {
      console.error(e);
      status.textContent = '❌ เปิดกล้องไม่สำเร็จ';
      cameraStarted = false;
    }
  }

  function stopCamera() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    // 1. สั่ง stop ทุก Track ใน stream หลักเพื่อดับไฟฮาร์ดแวร์
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }

    // 2. เคลียร์ Stream ค้างในแท็ก <video>
    if (video) {
      video.pause();
      if (video.srcObject) {
        const vStream = video.srcObject;
        if (typeof vStream.getTracks === 'function') {
          vStream.getTracks().forEach(t => t.stop());
        }
        video.srcObject = null;
      }
    }

<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    cameraStarted = false;
    lastFaceBox = null;
    overlayRect = null;
    overlayRunning = false;
<<<<<<< HEAD
    stableFrameCount = 0;

  
      const ctx = overlay.getContext('2d');
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    
=======
<<<<<<< HEAD
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  }

  /* =======================
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
      FACE DETECT & OVERLAY
=======
<<<<<<< HEAD
     FACE DETECT & OVERLAY
=======
      FACE DETECT & OVERLAY
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
=======

    if (overlay) {
      const ctx = overlay.getContext('2d');
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    }
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
  }

  /* =======================
      FACE DETECT & OVERLAY
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
  ======================= */
  async function detectFace() {
    if (video.readyState < 2) return null;
    try {
<<<<<<< HEAD
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
=======
      const det = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 }));
      return det ? det.box : null;
    } catch (e) { return null; }
  }

>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
  async function drawOverlay() {
    if (!overlayRunning) return;
    const now = Date.now();
    const ctx = overlay.getContext('2d');

    if (!detecting && now - lastDetectTime > 200) {
      detecting = true;
      lastDetectTime = now;
      const box = await detectFace();
      ctx.clearRect(0, 0, overlay.width, overlay.height);

<<<<<<< HEAD
      // if (box) {
      //   lastFaceBox = box;
      //   overlayRect = { x: video.videoWidth - box.x - box.width, y: box.y, w: box.width, h: box.height };
      //   ctx.strokeStyle = 'red';
      //   ctx.lineWidth = 3;
      //   ctx.strokeRect(overlayRect.x, overlayRect.y, overlayRect.w, overlayRect.h);
      //   status.textContent = '✅ พบใบหน้า';
      //   status.style.color = '#00c853';
      //   captureBtn.disabled = false;
      //   captureBtn.style.opacity = '1';
      // } 
      if(box){
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
      }
      
      else {
=======
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
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
        lastFaceBox = null;
        overlayRect = null;
        status.textContent = '❌ ไม่พบใบหน้า';
        status.style.color = '#d50000';
        captureBtn.disabled = true;
        captureBtn.style.opacity = '0.5';
      }
      detecting = false;
    }
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    animFrameId = requestAnimationFrame(drawOverlay);
  }

  /* =======================
      CAPTURE
<<<<<<< HEAD
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

=======
<<<<<<< HEAD
=======
    requestAnimationFrame(drawOverlay);
  }

  /* =======================
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
      CAPTURE
=======
<<<<<<< HEAD
     CAPTURE
=======
      CAPTURE
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

=======
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

>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, cx - size / 2, cy - size / 2, size, size, -300, 0, 300, 300);
    ctx.restore();

    const base64DataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    const base64 = base64DataUrl.split(',')[1];
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0


  let len = base64.length;
    let padding = 0;
    if (base64[len - 1] === '=') padding++;
    if (base64[len - 2] === '=') padding++;
    const actualByteSize = Math.floor((len * 0.75) - padding);
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
    const padding = (base64.endsWith('=')) ? (base64.endsWith('==') ? 2 : 1) : 0;
    const actualByteSize = (base64.length * 0.75) - padding;
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0

    userFaceArray.length = 0;
    userFaceArray.push({
      TemplateData: base64,
      TemplateSize: Math.floor(actualByteSize)
    });

    panelResult.style.display = 'block';
    videoContainer.style.display = 'none';
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
    stopCamera();
  }
  /* =======================
    BIND CAPTURE BUTTON
  ======================= */
=======
<<<<<<< HEAD
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';   
    status.style.display = 'none';      
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
<<<<<<< HEAD
    captureBtn.style.display = 'none';
    status.style.display = 'none';
=======
    captureBtn.style.display = 'none';   
    status.style.display = 'none';      
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
=======
    captureBtn.style.display = 'none';
    status.style.display = 'none';
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
    stopCamera();
  }

>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
  captureBtn.addEventListener('click', () => {
    if (!lastFaceBox) { status.textContent = '❌ ยังไม่พบใบหน้า'; return; }
    captureFace();
  });
<<<<<<< HEAD
  /* =======================
     RETAKE (ถ่ายใหม่)
  ======================= */
=======

<<<<<<< HEAD
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
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
<<<<<<< HEAD
    stableFrameCount = 0;
    updateCameraPanel();
  });
=======
    updateCameraPanel();
  });
<<<<<<< HEAD
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
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
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
<<<<<<< HEAD

  /* =========================================================
     📥 UPDATE SERVER (ปุ่มถ่ายรูปอัปเดตใบหน้า)
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
      WorkCode: "0",
      MealCode: "0",
      MoneyCode: "0",
      MessageCode: 0,
      VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
      PositionCode: Number(fd.get('PositionCode')) || 0,
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
      WorkCode: "0000",
      MealCode: "0000",
      MoneyCode: "0000",
      MessageCode: 0,
      VerifyLevel: Number(fd.get('VerifyLevel')) || 5,
<<<<<<< HEAD
      PositionCode: Number(fd.get('PositionCode')) || 9997,
=======
<<<<<<< HEAD
      PositionCode: Number(fd.get('PositionCode')) || 9997,
=======
<<<<<<< HEAD
      PositionCode: Number(fd.get('PositionCode')) || 9997,
=======
<<<<<<< HEAD
      PositionCode: Number(fd.get('PositionCode')) || 9997,
=======
<<<<<<< HEAD
      PositionCode: Number(fd.get('PositionCode')) || 9997,
=======
<<<<<<< HEAD
      PositionCode: Number(fd.get('PositionCode')) || 9997,
=======
      PositionCode: Number(fd.get('Position')) || 9997,
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
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

  /* =========================================================
<<<<<<< HEAD
     📥 UPDATE SERVER (ปุ่มถ่ายรูปอัปเดตใบหน้า - ยุบรวมแก้บั๊กซ้ำซ้อนแล้ว)
=======
     📥 UPDATE SERVER (ปุ่มถ่ายรูปอัปเดตใบหน้า)
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
    let currentUserId = rawId;
    if (rawId.length === 6) {
      currentUserId = "00" + rawId;
    }

    let cardValues = fd.getAll('CardNum[]').filter(Boolean);
    if (cardValues.length === 0) {
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId; 
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
<<<<<<< HEAD
      const singleCard = fd.get('CardNum') || rawId;
      if (singleCard) cardValues.push(singleCard);
    }
=======
      const singleCard = fd.get('CardNum') || rawId; 
      if (singleCard) cardValues.push(singleCard);
    }
<<<<<<< HEAD
    const cards = cardValues.map(c => ({ CardNum: String(c).trim(), UserID: currentUserId }));

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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0

    const cards = cardValues.map(c => {
      let cleanCard = String(c).trim();
      if (cleanCard.length === 8 && cleanCard.startsWith("00")) {
        cleanCard = cleanCard.substring(2);
      }
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
      return {
        CardNum: cleanCard,
        UserID: currentUserId
      };
    });

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
      return { 
        CardNum: cleanCard,       
        UserID: currentUserId     
      };
    });

    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้า
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    let hasFace = false;
    let faceInfo = null;

    if (allowFaceCheckbox.checked) {
      if (userFaceArray.length > 0) {
        hasFace = true;
        faceInfo = [{
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId, 
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
          UserID: currentUserId, 
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
=======
          UserID: currentUserId,
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
          TemplateType: 1,
          TemplateSize: userFaceArray[0].TemplateSize,
          TemplateData: userFaceArray[0].TemplateData
        }];
      } else if (oldFaceTemplate) {
        hasFace = true;
        faceInfo = [{
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId, 
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
<<<<<<< HEAD
          UserID: currentUserId,
=======
          UserID: currentUserId, 
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
=======
          UserID: currentUserId,
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
          TemplateType: 1,
          TemplateSize: oldFaceTemplate.TemplateSize,
          TemplateData: oldFaceTemplate.TemplateData
        }];
      }
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
    } else {
      // ❌ ถ้าไม่ติ๊ก ให้เคลียร์ก้อนนี้เป็น null ตามที่คุณไปตรวจสอบมา
      faceInfo = null;
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    } else {
      faceInfo = null;
    }

    const userInfo = buildUserInfo(fd, currentUserId, hasFace); // ✅ เรียกใช้ function
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
    } else {
      // ❌ ถ้าไม่ติ๊ก ให้เคลียร์ก้อนนี้เป็น null ตามที่คุณไปตรวจสอบมา
      faceInfo = null;
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
    }

    const userInfo = {
      ID: currentUserId, 
      UniqueID: fd.get('UniqueID'),
      Name: fd.get('Name'),
<<<<<<< HEAD
      AuthInfo: [2, (hasFace ? 9 : 0), 30, 0, 0, 0, 0, 0], 
=======
<<<<<<< HEAD
      AuthInfo: [2, (hasFace ? 9 : 0), 30, 0, 0, 0, 0, 0], // บังคับเป็น 9 เปิดระบบใบหน้า
=======
      AuthInfo: [2, (hasFace ? 9 : 0), 30, 0, 0, 0, 0, 0], 
>>>>>>> 5eb1b7f (Check Register Update Format)
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
      Privilege: Number(fd.get('Privilege')) || 2,
      GroupCode: Number(fd.get('GroupCode')) || 1000,
      AccessGroupCode: Number(fd.get('AccessGroupCode')) || 3000,
      UserType: Number(fd.get('UserType')) || 0,
      VerifyLevel: Number(fd.get('VerifyLevel')) || 0,
      FaceIdentify: hasFace ? 1 : 0,
      Email: fd.get('Email') || '',
      Department: fd.get('Department') || '',
<<<<<<< HEAD
      LoginAllowed: "0",
      Picture: ""
    };
=======
<<<<<<< HEAD
=======
      LoginAllowed: "0",
>>>>>>> 5eb1b7f (Check Register Update Format)
      Picture: ""
    };
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0

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
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
<<<<<<< HEAD
      console.log('🔍 SERVER RESPONSE (RAW):', result);

=======
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
=======
      console.log('🔍 SERVER RESPONSE (RAW):', result);

>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
      const apiResult = result?.apiResult;
      const innerResult = apiResult?.Result || apiResult?.result;
      const resultCode = innerResult?.ResultCode !== undefined ? innerResult?.ResultCode : innerResult?.resultCode;

      console.log('🔍 Detected ResultCode:', resultCode);
<<<<<<< HEAD

      if ([33558286, "33558286", 33558281, "33558281"].includes(resultCode)) {
=======
<<<<<<< HEAD
<<<<<<< HEAD

      if ([33558286, "33558286", 33558281, "33558281"].includes(resultCode)) {
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

      if (resultCode === 33558286 || String(resultCode) === "33558286" ||
        resultCode === 33558281 || String(resultCode) === "33558281") {
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======

      if ([33558286, "33558286", 33558281, "33558281"].includes(resultCode)) {
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
      }

      if (res.ok && (result.status === "success" || result.status === "SUCCESS")) {
        alert('✅ อัปเดตข้อมูลและใบหน้าสำเร็จเรียบร้อย');
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/index.php';
=======
<<<<<<< HEAD
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/index.php';
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/test_deploy/index.php';
=======
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/test_deploy/index.php';
=======
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/test_deploy/index.php';
=======
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/test_deploy/index.php';
=======
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/test_deploy/index.php';
=======
<<<<<<< HEAD
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/test_deploy/index.php';
=======
>>>>>>> 814cd42bbe7bf6f465a8ea491f31d7fa6d035538
>>>>>>> 0c10d01e96d440a150bc2101ac5b544cfc1247ee
>>>>>>> f4b7380d7d1097f926cfe05c390d330b8c631086
>>>>>>> 2c5c1bd700fe5ae6ea5970851e4efefcaa83787e
>>>>>>> 1375e768bdf85915bcf4fdf66241405e1f5294ac
>>>>>>> 9c964d47494378f89daac9bea17e84d646686554
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
        window.location.href = 'https://lib.swu.ac.th/app/face_scan/index.php';
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
  /* =========================================================
        💾 UPDATE DATA SERVER (ปุ่มบันทึกข้อมูลทั่วไปท้ายฟอร์ม)
     ========================================================= */
  btnUpdateData.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('💾 CLICK UPDATE DATA (GENERAL)');

    const fd = new FormData(form);
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    let rawId = String(fd.get('ID')).trim();
    let currentUserId = rawId;
    if (rawId.length === 6) {
      currentUserId = "00" + rawId;
>>>>>>> b526410014d7415a9844022493031e415f988d72
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    }

    let cardValues = fd.getAll('CardNum[]').filter(Boolean);
    if (cardValues.length === 0) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
      // 💡 แก้ไขบั๊กจาก trim(currentUserId) เดิม มาใช้ substring จัดการตัดหลักแทน
      const rawCard = fd.get('CardNum');
      const singleCard = rawCard
        ? String(rawCard).trim()
        : (currentUserId.startsWith("00") ? currentUserId.substring(2) : currentUserId);
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
      const singleCard = fd.get('CardNum') || rawId;
=======
>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
      // 💡 แก้ไขบั๊กจาก trim(currentUserId) เดิม มาใช้ substring จัดการตัดหลักแทน
      const rawCard = fd.get('CardNum');
      const singleCard = rawCard 
        ? String(rawCard).trim() 
        : (currentUserId.startsWith("00") ? currentUserId.substring(2) : currentUserId);
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
      if (singleCard) cardValues.push(singleCard);
    }
    const cards = cardValues.map(c => ({ CardNum: String(c).trim(), UserID: currentUserId }));

<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
=======
<<<<<<< HEAD
=======
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
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
=======
    // ⭐ ตรวจสอบการติ๊กและชุดข้อมูลใบหน้าของปุ่มเซฟทั่วไป
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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
<<<<<<< HEAD
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
    } else {
      // ❌ ถ้าไม่ติ๊ก ให้เคลียร์ก้อนนี้เป็น null เช่นเดียวกัน
      faceInfo = null;
    }

<<<<<<< HEAD
    const userInfo = buildUserInfo(fd, currentUserId, hasFace);
=======
<<<<<<< HEAD
<<<<<<< HEAD
    const userInfo = buildUserInfo(fd, currentUserId, hasFace);
=======
<<<<<<< HEAD
=======
    const userInfo = buildUserInfo(fd, currentUserId, hasFace);
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
=======
    } else {
      // ❌ ถ้าไม่ติ๊ก ให้เคลียร์ก้อนนี้เป็น null เช่นเดียวกัน
      faceInfo = null;
>>>>>>> 5eb1b7f (Check Register Update Format)
    }

>>>>>>> ce24c2c256c4d4388e87684b2d4298785c247604
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
        LoginAllowed: "0",
        Picture: ""
    };
=======
<<<<<<< HEAD
=======
        LoginAllowed: "0",
>>>>>>> 5eb1b7f (Check Register Update Format)
        Picture: ""
    };
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
=======
    const userInfo = buildUserInfo(fd, currentUserId, hasFace);
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0

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
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`, 
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
<<<<<<< HEAD
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
=======
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`, 
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
=======
        `https://lib.swu.ac.th/app/ci4_new/public/apidoor/uploadPictureJson/${encodeURIComponent(userInfo.ID)}`,
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD

      if (res.ok) {
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
        console.log(payload);
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
=======
>>>>>>> 33c3c78 (Modify page Photo and Fix size PDPA)
>>>>>>> 1e4782216a4002c59c30390c19d73243f29cfdf0
})();