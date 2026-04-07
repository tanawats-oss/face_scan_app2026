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
<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Face Capture 300×300</title>
<style>
/* CSS เหมือนเดิมของคุณ */
:root { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial; }
body { margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#222; color:white; gap:18px; }
.stage { display:flex; flex-direction:column; gap:10px; align-items:center; }
.video-container { position:relative; width:360px; height:360px; }
video { width:100%; height:100%; object-fit:cover; border-radius:8px; transform:scaleX(-1); position:absolute; top:0; left:0; }
#overlay { width:100%; height:100%; position:absolute; top:0; left:0; pointer-events:none; border-radius:8px; }
canvas { width:200px; height:200px; border:1px solid #ccc; image-rendering:pixelated; border-radius:6px; }
button { padding:8px 12px; border-radius:6px; cursor:pointer; background:#444; color:white; border:none; }
.controls { display:flex; gap:8px; }
#status { font-size:0.9rem; text-align:center; }
.video-container {
  position: relative;
  width: 360px;
  height: 360px;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transform: scaleX(-1);
  position: absolute;
  top: 0;
  left: 0;
}
#overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  border-radius: 8px;
}
#face-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;   /* กรอบ guide */
  height: 200px;
  border: 2px dashed #0f0;
  transform: translate(-50%, -50%);
  pointer-events: none;
  border-radius: 8px;
  box-sizing: border-box;
}
</style>
<script src="./face-api.js-master/dist/face-api.js"></script>
</head>
<body>

<div class="stage">
  <h3>Live camera</h3>
  <div class="video-container">
    <video id="video" autoplay playsinline muted></video>
    <canvas id="overlay"></canvas>
    <!-- กรอบ guide -->
    <div id="face-frame"></div>
  </div>
  <div class="controls">
    <button id="captureBtn" disabled>Capture 300×300</button>
    <button id="downloadBtn" disabled>Download PNG</button>
  </div>
  <div id="status">Preparing camera…</div>
</div>

<div class="stage result">
  <h3>Result (300×300)</h3>
  <canvas id="out" width="300" height="300"></canvas>
  <a id="downloadLink" style="display:none">download</a>
</div>

<script>
(async function(){
  const video = document.getElementById('video');
  const overlay = document.getElementById('overlay');
  const overlayCtx = overlay.getContext('2d');
  const outCanvas = document.getElementById('out');
  const outCtx = outCanvas.getContext('2d');
  const captureBtn = document.getElementById('captureBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const status = document.getElementById('status');
  const downloadLink = document.getElementById('downloadLink');

  let stream, captured=false;

  // start camera
  try {
    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}, audio:false});
    video.srcObject = stream;
  } catch(err){
    status.textContent = 'Cannot access camera: ' + err.message;
    return;
  }

  await new Promise(res=>{
    if(video.readyState>=1) return res();
    video.addEventListener('loadedmetadata', res, {once:true});
  });

  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;

  // โหลด model จาก folder local "weight"
  status.textContent = 'Loading model...';
  // โหลดจาก folder local ที่อยู่บนเว็บ server
  await faceapi.nets.tinyFaceDetector.loadFromUri('./face-api.js-master/weights/');
  status.textContent = 'Model loaded. Ready to capture.';
  captureBtn.disabled = false;

  // detect face
  async function detectFace(){
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());
    return detection ? detection.box : null;
  }

  // capture function
  async function captureFace(bbox=null){
    const vw = video.videoWidth, vh = video.videoHeight;
    let sx, sy, sSize;

    if(!bbox) bbox = await detectFace();

    if(bbox){
      const cx = bbox.x + bbox.width/2;
      const cy = bbox.y + bbox.height/2;
      const faceMax = Math.max(bbox.width, bbox.height);
      const scaleFactor = 2.0;
      sSize = Math.min(vw, vh, faceMax*scaleFactor);
      sx = Math.round(Math.max(0, Math.min(vw-sSize, cx-sSize/2)));
      sy = Math.round(Math.max(0, Math.min(vh-sSize, cy-sSize/2)));
      status.textContent = 'Face detected — captured';
    } else {
      sSize = Math.min(vw, vh);
      sx = Math.round((vw-sSize)/2);
      sy = Math.round((vh-sSize)/2);
      status.textContent = 'No face detected — capturing center';
    }

    outCtx.save();
    outCtx.clearRect(0,0,outCanvas.width,outCanvas.height);
    outCtx.translate(outCanvas.width,0);
    outCtx.scale(-1,1);
    outCtx.drawImage(video, sx, sy, sSize, sSize, 0, 0, outCanvas.width, outCanvas.height);
    outCtx.restore();

    const dataUrl = outCanvas.toDataURL('image/png');
    downloadLink.href = dataUrl;
    downloadLink.download = 'face-300x300.png';
    downloadBtn.disabled = false;
    downloadBtn.onclick = ()=> downloadLink.click();
  }

  // overlay + auto-capture once
 async function drawOverlay() {
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
  const bbox = await detectFace();

  if (bbox) {
    // วาดกล่องรอบหน้า
    const mirroredX = video.videoWidth - bbox.x - bbox.width;
    overlayCtx.strokeStyle = 'red';
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(mirroredX, bbox.y, bbox.width, bbox.height);

    // เปิดปุ่ม capture เมื่อเจอหน้า
    captureBtn.disabled = false;

    // auto-capture ครั้งแรก
    if (!captured) {
      captured = true;
      await captureFace(bbox);
    }
  } else {
    // ปิดปุ่ม capture เมื่อไม่เจอหน้า
    captureBtn.disabled = true;
  }

  requestAnimationFrame(drawOverlay);
}


  // button
  captureBtn.addEventListener('click', async ()=>{
    status.textContent = 'Detecting face...';
    const bbox = await detectFace();
    await captureFace(bbox);
  });

  window.addEventListener('beforeunload', ()=>{ if(stream) stream.getTracks().forEach(t=>t.stop()); });

})();
</script>

</body>
</html>
