/**
 * ============================================================================
 * INTERACTIVE PROJECT SIMULATORS & 3D LIVE DEMO ENGINE
 * Mahabbah Mahabban Romadhon — Flagship Project Interactive Showcase
 * ============================================================================
 * 
 * Includes 4 dedicated interactive simulator engines:
 * 1. APD Detection: Real-Time Computer Vision YOLOv8 inference simulator
 * 2. OSINT Dashboard: Live cyber reconnaissance probe & vulnerability intelligence
 * 3. Edolus 3D: Planetary scale 3D Earth orbit with Three.js & telemetry hotspots
 * 4. 3D Animation: Interactive 3D model & animation mesh inspector
 */

(function () {
  'use strict';

  let activeDemo = null;
  let currentCleanup = null;
  let lastOpenedProjectData = null;

  // Global Simulator API
  window.ProjectSimulators = {
    openDemo: function (demoKey, projectData) {
      if (projectData) lastOpenedProjectData = projectData;
      const modal = document.getElementById('projectModal');
      if (!modal) return;

      const modalBox = modal.querySelector('.modal-box');
      const tabsBar = document.getElementById('modalTabsBar');
      const overviewContent = document.getElementById('modalOverviewContent');
      const demoContainer = document.getElementById('modalDemoContainer');
      const tabOverview = document.getElementById('modalTabOverview');
      const tabDemo = document.getElementById('modalTabDemo');

      if (modalBox) modalBox.classList.add('modal-demo-active');
      if (tabsBar) tabsBar.style.display = 'flex';
      if (overviewContent) overviewContent.style.display = 'none';
      if (demoContainer) {
        demoContainer.style.display = 'block';
        demoContainer.innerHTML = '';
      }

      if (tabOverview) tabOverview.classList.remove('active');
      if (tabDemo) tabDemo.classList.add('active');

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');

      // Stop previous active simulator
      if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
      }
      activeDemo = demoKey;

      // Launch corresponding simulator
      switch (demoKey) {
        case 'apd':
          currentCleanup = launchApdSimulator(demoContainer);
          break;
        case 'osint':
          currentCleanup = launchOsintSimulator(demoContainer);
          break;
        case 'globe3d':
          currentCleanup = launchGlobeSimulator(demoContainer);
          break;
        case 'mesh3d':
          currentCleanup = launchMeshSimulator(demoContainer);
          break;
        default:
          demoContainer.innerHTML = '<p class="dim" style="padding:20px;text-align:center;">Simulator sedang dipersiapkan...</p>';
      }
    },

    showOverview: function () {
      if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
      }
      activeDemo = null;

      const modal = document.getElementById('projectModal');
      if (!modal) return;
      const modalBox = modal.querySelector('.modal-box');
      const overviewContent = document.getElementById('modalOverviewContent');
      const demoContainer = document.getElementById('modalDemoContainer');
      const tabOverview = document.getElementById('modalTabOverview');
      const tabDemo = document.getElementById('modalTabDemo');

      if (modalBox) modalBox.classList.remove('modal-demo-active');
      if (overviewContent) overviewContent.style.display = 'block';
      if (demoContainer) {
        demoContainer.style.display = 'none';
        demoContainer.innerHTML = '';
      }
      if (tabOverview) tabOverview.classList.add('active');
      if (tabDemo) tabDemo.classList.remove('active');
    },

    closeDemo: function () {
      if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
      }
      activeDemo = null;
      const modal = document.getElementById('projectModal');
      if (modal) {
        const modalBox = modal.querySelector('.modal-box');
        if (modalBox) modalBox.classList.remove('modal-demo-active');
      }
    }
  };

  /* ==========================================================================
     SIMULATOR 1: REAL-TIME APD COMPUTER VISION INFERENCE SIMULATOR
     ========================================================================== */
  function launchApdSimulator(container) {
    container.innerHTML = `
      <div class="sim-container">
        <div class="sim-hud-bar">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge ok"><span class="btn-live-pulse"></span> INFERENSI: YOLOv8 CUDA</span>
            <span class="sim-badge" id="apdFpsBadge">FPS: 60.0</span>
            <span class="sim-badge" id="apdLatencyBadge">LATENCY: 3.4ms</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge" id="apdWorkerBadge">PEKERJA: 3</span>
            <span class="sim-badge alert" id="apdAlertBadge">1 PELANGGARAN K3</span>
          </div>
        </div>

        <div class="sim-canvas-wrap">
          <canvas id="apdCanvas" width="800" height="450"></canvas>
          <div class="sim-3d-tooltip" id="apdZoneNotice" style="right:14px;left:auto;border-color:rgba(255,71,87,0.5);color:#FF6B81;">
             <strong>ZONA MERAH K3</strong><br>Area Alat Berat — Akses Dibatasi
          </div>
        </div>

        <div class="sim-controls-bar">
          <div class="sim-control-group">
            <button type="button" class="sim-toggle-btn active" id="btnToggleHelmet">
              <span>[OK]</span> Deteksi Helm K3
            </button>
            <button type="button" class="sim-toggle-btn active" id="btnToggleVest">
              <span>[OK]</span> Deteksi Rompi Safety
            </button>
            <button type="button" class="sim-toggle-btn active" id="btnToggleZone">
              <span>[OK]</span> Zona Merah (Geofence)
            </button>
          </div>
          <div class="sim-control-group">
            <button type="button" class="sim-action-btn" id="btnAddWorker">
              <span>➕ Tambah Pekerja</span>
            </button>
            <button type="button" class="sim-action-btn" id="btnSimulateViolation" style="border-color:#FF4757;color:#FF4757;">
              <span> Simulasi Pelanggaran</span>
            </button>
          </div>
        </div>

        <div class="sim-log-stream" id="apdLogStream">
          <div class="log-line info">[SISTEM APD] Model bobot YOLOv8-APD.pt aktif pada resolusi 1920x1080 (TensorRT).</div>
          <div class="log-line ok">[STATUS] Pekerja #01: Helm K3 Terdeteksi (99.4%) · Rompi K3 Terdeteksi (98.9%) · Kepatuhan Terpenuhi.</div>
          <div class="log-line alert">[PERINGATAN] Pekerja #02: Helm K3 TIDAK TERDETEKSI (0.0%) · Protokol K3 Dilanggar!</div>
          <div class="log-line dim">[GEOFENCE] Garis perimeter zona merah aktif. Sensor laser virtual siap memantau.</div>
        </div>
      </div>
    `;

    const canvas = container.querySelector('#apdCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const logStream = container.querySelector('#apdLogStream');
    const fpsBadge = container.querySelector('#apdFpsBadge');
    const latencyBadge = container.querySelector('#apdLatencyBadge');
    const workerBadge = container.querySelector('#apdWorkerBadge');
    const alertBadge = container.querySelector('#apdAlertBadge');

    let detectHelmet = true;
    let detectVest = true;
    let detectZone = true;
    let animationFrameId = null;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;

    // Simulated Workers
    const workers = [
      { id: 1, x: 140, y: 190, vx: 0.8, vy: 0.3, hasHelmet: true, hasVest: true, helmetConf: 99.4, vestConf: 98.7, size: 54 },
      { id: 2, x: 420, y: 220, vx: -0.6, vy: 0.5, hasHelmet: false, hasVest: true, helmetConf: 0.0, vestConf: 97.5, size: 56 },
      { id: 3, x: 610, y: 160, vx: -0.7, vy: -0.4, hasHelmet: true, hasVest: true, helmetConf: 98.8, vestConf: 99.1, size: 52 }
    ];

    // Red Danger Zone coordinates
    const dangerZone = { x: 500, y: 120, width: 260, height: 200 };

    function addLog(msg, type) {
      if (!logStream) return;
      const d = document.createElement('div');
      d.className = `log-line ${type || 'info'}`;
      const timeStr = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(performance.now() % 1000);
      d.textContent = `[${timeStr}] ${msg}`;
      logStream.appendChild(d);
      logStream.scrollTop = logStream.scrollHeight;
    }

    // Interactive buttons
    container.querySelector('#btnToggleHelmet')?.addEventListener('click', function () {
      detectHelmet = !detectHelmet;
      this.classList.toggle('active', detectHelmet);
      addLog(`Deteksi Helm K3: ${detectHelmet ? 'AKTIF' : 'NONAKTIF'}`, detectHelmet ? 'ok' : 'dim');
    });

    container.querySelector('#btnToggleVest')?.addEventListener('click', function () {
      detectVest = !detectVest;
      this.classList.toggle('active', detectVest);
      addLog(`Deteksi Rompi Safety: ${detectVest ? 'AKTIF' : 'NONAKTIF'}`, detectVest ? 'ok' : 'dim');
    });

    container.querySelector('#btnToggleZone')?.addEventListener('click', function () {
      detectZone = !detectZone;
      this.classList.toggle('active', detectZone);
      addLog(`Pemantauan Zona Merah: ${detectZone ? 'AKTIF' : 'NONAKTIF'}`, detectZone ? 'ok' : 'dim');
    });

    container.querySelector('#btnAddWorker')?.addEventListener('click', function () {
      const id = workers.length + 1;
      const isCompliant = Math.random() > 0.4;
      workers.push({
        id: id,
        x: 80 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        hasHelmet: isCompliant,
        hasVest: true,
        helmetConf: isCompliant ? 98.5 + Math.random() * 1.4 : 0.0,
        vestConf: 97.0 + Math.random() * 2.8,
        size: 50 + Math.random() * 8
      });
      addLog(`Pekerja baru #${id} terdeteksi di area operasional.`, 'info');
    });

    container.querySelector('#btnSimulateViolation')?.addEventListener('click', function () {
      if (workers.length > 0) {
        workers[0].hasHelmet = !workers[0].hasHelmet;
        workers[0].helmetConf = workers[0].hasHelmet ? 99.2 : 0.0;
        if (!workers[0].hasHelmet) {
          addLog(`[ALARM K3] Pekerja #01 terdeteksi melepas helm pelindung di area aktif!`, 'alert');
        } else {
          addLog(`[K3 RESET] Pekerja #01 kembali mengenakan helm pelindung standar.`, 'ok');
        }
      }
    });

    // Click on canvas adds worker
    canvas.addEventListener('click', function (e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.x) * scaleX;
      const clickY = (e.clientY - rect.y) * scaleY;

      const id = workers.length + 1;
      workers.push({
        id: id,
        x: clickX,
        y: clickY,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        hasHelmet: Math.random() > 0.3,
        hasVest: true,
        helmetConf: 99.1,
        vestConf: 98.4,
        size: 52
      });
      addLog(`Pekerja #${id} diposisikan pada koordinat X:${Math.round(clickX)} Y:${Math.round(clickY)}.`, 'info');
    });

    // Main Draw Loop
    function render(now) {
      const delta = now - lastTime;
      lastTime = now;
      fpsTimer += delta;
      frameCount++;
      if (fpsTimer >= 1000) {
        const fps = (frameCount * 1000 / fpsTimer).toFixed(1);
        if (fpsBadge) fpsBadge.textContent = `FPS: ${fps}`;
        if (latencyBadge) {
          const lat = (3.1 + Math.random() * 0.7).toFixed(1);
          latencyBadge.textContent = `LATENCY: ${lat}ms`;
        }
        fpsTimer = 0;
        frameCount = 0;
      }

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // 1. Draw Factory/Construction Blueprint Floor Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // 2. Draw Danger Zone (Zona Merah)
      if (detectZone) {
        ctx.fillStyle = 'rgba(255, 71, 87, 0.09)';
        ctx.strokeStyle = 'rgba(255, 71, 87, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(dangerZone.x, dangerZone.y, dangerZone.width, dangerZone.height);
        ctx.fillRect(dangerZone.x, dangerZone.y, dangerZone.width, dangerZone.height);
        ctx.setLineDash([]);

        ctx.fillStyle = '#FF4757';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText('ZONA MERAH K3 // ALAT BERAT BERBAHAYA', dangerZone.x + 12, dangerZone.y + 24);
      }

      let totalViolations = 0;

      // 3. Update & Draw Workers
      workers.forEach(w => {
        w.x += w.vx;
        w.y += w.vy;
        if (w.x < 50) { w.x = 50; w.vx = Math.abs(w.vx); }
        if (w.x > W - 100) { w.x = W - 100; w.vx = -Math.abs(w.vx); }
        if (w.y < 70) { w.y = 70; w.vy = Math.abs(w.vy); }
        if (w.y > H - 120) { w.y = H - 120; w.vy = -Math.abs(w.vy); }

        const boxW = w.size;
        const boxH = w.size * 1.8;
        const bx = w.x;
        const by = w.y;

        const inZone = detectZone && (bx + boxW > dangerZone.x && bx < dangerZone.x + dangerZone.width &&
          by + boxH > dangerZone.y && by < dangerZone.y + dangerZone.height);

        const isViolation = (detectHelmet && !w.hasHelmet) || inZone;
        if (isViolation) totalViolations++;

        const themeColor = isViolation ? '#FF4757' : '#00FFA3';

        // Draw Worker Body Silhouette
        ctx.save();
        ctx.fillStyle = '#1A233A';
        // Head
        ctx.beginPath();
        ctx.arc(bx + boxW / 2, by + 18, 12, 0, Math.PI * 2);
        ctx.fill();

        // Helmet if worn
        if (w.hasHelmet) {
          ctx.fillStyle = '#FFD200'; // Yellow Hardhat
          ctx.beginPath();
          ctx.arc(bx + boxW / 2, by + 13, 14, Math.PI, 0);
          ctx.fill();
        }

        // Torso / Vest
        ctx.fillStyle = w.hasVest ? '#FF7A00' : '#2A3550'; // Orange Safety Vest
        ctx.fillRect(bx + 10, by + 32, boxW - 20, boxH * 0.45);
        if (w.hasVest) {
          ctx.fillStyle = '#E2F0D9';
          ctx.fillRect(bx + 10, by + 46, boxW - 20, 5);
          ctx.fillRect(bx + 10, by + 60, boxW - 20, 5);
        }

        // Legs
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(bx + 14, by + 32 + boxH * 0.45, 10, boxH * 0.4);
        ctx.fillRect(bx + boxW - 24, by + 32 + boxH * 0.45, 10, boxH * 0.4);
        ctx.restore();

        // Draw YOLO Computer Vision Bounding Box
        ctx.save();
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = isViolation ? 2.5 : 1.8;
        ctx.strokeRect(bx, by, boxW, boxH);

        // Corner bracket accents
        const cLen = 8;
        ctx.lineWidth = 3.5;
        // TL
        ctx.beginPath(); ctx.moveTo(bx, by + cLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cLen, by); ctx.stroke();
        // TR
        ctx.beginPath(); ctx.moveTo(bx + boxW - cLen, by); ctx.lineTo(bx + boxW, by); ctx.lineTo(bx + boxW, by + cLen); ctx.stroke();
        // BL
        ctx.beginPath(); ctx.moveTo(bx, by + boxH - cLen); ctx.lineTo(bx, by + boxH); ctx.lineTo(bx + cLen, by + boxH); ctx.stroke();
        // BR
        ctx.beginPath(); ctx.moveTo(bx + boxW - cLen, by + boxH); ctx.lineTo(bx + boxW, by + boxH); ctx.lineTo(bx + boxW, by + boxH - cLen); ctx.stroke();

        // Tag label HUD above box
        ctx.fillStyle = isViolation ? 'rgba(255, 71, 87, 0.92)' : 'rgba(0, 255, 163, 0.92)';
        const labelText = isViolation
          ? `[!] PEKERJA_${w.id}: ${!w.hasHelmet ? 'HELM HILANG' : 'ZONA MERAH'}`
          : `[[OK]] PEKERJA_${w.id}: HELM ${(w.helmetConf).toFixed(1)}% · ROMPI ${(w.vestConf).toFixed(1)}%`;
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(labelText).width;
        ctx.fillRect(bx, by - 20, textWidth + 14, 20);

        ctx.fillStyle = '#05060A';
        ctx.fillText(labelText, bx + 7, by - 6);
        ctx.restore();
      });

      // Update counters
      if (workerBadge) workerBadge.textContent = `PEKERJA: ${workers.length}`;
      if (alertBadge) {
        alertBadge.textContent = `${totalViolations} PELANGGARAN K3`;
        alertBadge.className = totalViolations > 0 ? 'sim-badge alert' : 'sim-badge ok';
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return function cleanup() {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }

  /* ==========================================================================
     SIMULATOR 2: LIVE OSINT RECONNAISSANCE & THREAT AUDIT PROBE
     ========================================================================== */
  function launchOsintSimulator(container) {
    container.innerHTML = `
      <div class="sim-container">
        <div class="sim-hud-bar">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge ok"><span class="btn-live-pulse"></span> PROBE: OSINT ZETA ENGINE</span>
            <span class="sim-badge">CLEARANCE: HTB CBBH</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge" id="osintStatusBadge">SIAP RECON</span>
            <span class="sim-badge ok" id="osintScoreBadge">SKOR RISIKO: --</span>
          </div>
        </div>

        <div class="sim-controls-bar" style="flex-direction:column;align-items:stretch;gap:12px;">
          <div class="osint-input-box">
            <span style="font-family:var(--font-mono);color:#00F0FF;display:flex;align-items:center;padding:0 6px;">TARGET //</span>
            <input type="text" class="osint-input" id="osintTargetInput" value="target-perimeter.cyber.id" placeholder="Ketik domain atau host target...">
            <button type="button" class="sim-action-btn" id="btnLaunchProbe" style="padding:8px 18px;">
              <span> LUNCURKAN PROBE</span>
            </button>
          </div>
          <div class="osint-progress-bar">
            <div class="osint-progress-fill" id="osintProgress"></div>
          </div>
        </div>

        <div class="sim-canvas-wrap" style="height:250px;min-height:250px;padding:16px;background:#030509;overflow-y:auto;display:flex;flex-direction:column;">
          <div id="osintConsole" style="font-family:var(--font-mono);font-size:12px;line-height:1.75;color:#94A3B8;">
            <div style="color:#00F0FF;">[+] Wanz Xploit OSINT Framework v3.4 Ready.</div>
            <div style="color:#64748B;">[i] Masukkan target dan klik "LUNCURKAN PROBE" untuk simulasi audit reconnaissance terpadu.</div>
          </div>
        </div>

        <div class="sim-controls-bar">
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);">
            MODUL AKTIF: DNS Recon · Port SYN Scan · SSL Cryptography · Subdomain Enumeration · CVE Correlation
          </div>
          <button type="button" class="sim-toggle-btn" id="btnExportOsint">
            <span> Salin Hasil Scan</span>
          </button>
        </div>
      </div>
    `;

    const input = container.querySelector('#osintTargetInput');
    const btnLaunch = container.querySelector('#btnLaunchProbe');
    const progressBar = container.querySelector('#osintProgress');
    const consoleEl = container.querySelector('#osintConsole');
    const statusBadge = container.querySelector('#osintStatusBadge');
    const scoreBadge = container.querySelector('#osintScoreBadge');
    const btnExport = container.querySelector('#btnExportOsint');

    let isScanning = false;
    let scanTimeout = null;

    function printConsole(text, color) {
      if (!consoleEl) return;
      const d = document.createElement('div');
      d.style.color = color || '#94A3B8';
      d.innerHTML = text;
      consoleEl.appendChild(d);
      consoleEl.parentElement.scrollTop = consoleEl.parentElement.scrollHeight;
    }

    function runScan() {
      if (isScanning) return;
      isScanning = true;
      const target = input.value.trim() || 'target-infrastructure.cyber.id';

      if (statusBadge) {
        statusBadge.textContent = 'PROBING IN PROGRESS...';
        statusBadge.className = 'sim-badge warn';
      }
      if (scoreBadge) scoreBadge.textContent = 'ANALISIS...';
      if (progressBar) progressBar.style.width = '0%';
      consoleEl.innerHTML = '';

      printConsole(`[+] Memulai Autonomous OSINT Reconnaissance pada target: <strong style="color:#fff;">${target}</strong>...`, '#00F0FF');

      const steps = [
        { pct: 15, delay: 300, text: `[*] Tahap 1: DNS Topology Resolving (A, AAAA, MX, NS, TXT Records)...`, color: '#64748B' },
        { pct: 30, delay: 700, text: `[[OK]] Resolusi IP: 104.28.19.14 · Autonomous System: AS13335 (Cloudflare Protected)`, color: '#00FFA3' },
        { pct: 45, delay: 1200, text: `[*] Tahap 2: Subdomain Enumeration (Wordlist Top-1000)...`, color: '#64748B' },
        { pct: 60, delay: 1700, text: `[[OK]] Subdomain ditemukan: <strong>api.${target}</strong>, <strong>vpn.${target}</strong>, <strong>auth.${target}</strong>, <strong>staging.${target}</strong>`, color: '#00FFA3' },
        { pct: 75, delay: 2200, text: `[*] Tahap 3: Deep Port SYN Stealth Audit (Port 21, 22, 80, 443, 8080, 3306)...`, color: '#64748B' },
        { pct: 85, delay: 2800, text: `[[OK]] Port 443/TCP: OPEN (TLS 1.3 Strict HTTPS) · Port 22/TCP: FILTERED (Key-Only Auth)`, color: '#00FFA3' },
        { pct: 95, delay: 3300, text: `[*] Tahap 4: Header Hardening & CVE Correlation DB...`, color: '#64748B' },
        { pct: 100, delay: 3800, text: `===============================================================<br>[[CHAMPION] HASIL AUDIT] Skor Ancaman: <strong>14/100 (LOW RISK - AMAN)</strong><br>[[OK]] Pertahanan Sistem Memenuhi Standar Hardening HTB CBBH.<br>===============================================================`, color: '#00FFA3' }
      ];

      steps.forEach(step => {
        setTimeout(() => {
          if (!isScanning) return;
          if (progressBar) progressBar.style.width = step.pct + '%';
          printConsole(step.text, step.color);
          if (step.pct === 100) {
            isScanning = false;
            if (statusBadge) {
              statusBadge.textContent = 'AUDIT SELESAI';
              statusBadge.className = 'sim-badge ok';
            }
            if (scoreBadge) {
              scoreBadge.textContent = 'SKOR RISIKO: 14/100 (LOW)';
              scoreBadge.className = 'sim-badge ok';
            }
          }
        }, step.delay);
      });
    }

    btnLaunch?.addEventListener('click', runScan);
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') runScan(); });

    btnExport?.addEventListener('click', () => {
      const text = consoleEl.innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          btnExport.innerHTML = '<span>[OK] Tersalin ke Clipboard</span>';
          setTimeout(() => { btnExport.innerHTML = '<span> Salin Hasil Scan</span>'; }, 2000);
        });
      }
    });

    scanTimeout = setTimeout(runScan, 400);

    return function cleanup() {
      isScanning = false;
      if (scanTimeout) clearTimeout(scanTimeout);
    };
  }

  /* ==========================================================================
     SIMULATOR 3: EDOLUS PLANETARY SCALE 3D EARTH ORBIT (THREE.JS)
     ========================================================================== */
  function launchGlobeSimulator(container) {
    container.innerHTML = `
      <div class="sim-container">
        <div class="sim-hud-bar">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge ok"><span class="btn-live-pulse"></span> THREE.JS WEBGL ENGINE</span>
            <span class="sim-badge">EDOLUS PLANETARY SCALE AI</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge" id="globeNodesBadge">4 GLOBAL NODES</span>
            <span class="sim-badge ok">ORBIT: STABLE</span>
          </div>
        </div>

        <div class="sim-canvas-wrap" id="globeCanvasContainer" style="aspect-ratio:16/10;cursor:grab;">
          <div class="sim-3d-tooltip" id="globeTooltip">
             <strong>YOGYAKARTA MISSION CONTROL</strong><br>
            [7.79° S, 110.36° E] · Latency: 2.1ms · 12 Nodes Online
          </div>
        </div>

        <div class="sim-controls-bar">
          <div class="sim-control-group">
            <button type="button" class="sim-toggle-btn active" id="btnGlobeAtmo">
              <span>[OK]</span> Atmosfer Glow
            </button>
            <button type="button" class="sim-toggle-btn active" id="btnGlobeSatellites">
              <span>[OK]</span> Satelit Orbit
            </button>
            <button type="button" class="sim-toggle-btn active" id="btnGlobeGrid">
              <span>[OK]</span> Grid Koordinat
            </button>
          </div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);">
            INFO: Drag untuk putar 360° · Scroll untuk zoom
          </div>
        </div>
      </div>
    `;

    const canvasContainer = container.querySelector('#globeCanvasContainer');
    if (!canvasContainer || !window.THREE) return;

    let scene, camera, renderer, globeMesh, atmoMesh, gridMesh;
    const satellites = [];
    const markerMeshes = [];
    let animId = null;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const width = canvasContainer.clientWidth || 800;
    const height = canvasContainer.clientHeight || 450;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 180;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    canvasContainer.appendChild(renderer.domElement);

    // 1. Earth Sphere with Procedural Landmass Canvas Texture
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ectx = earthCanvas.getContext('2d');

    ectx.fillStyle = '#060B18';
    ectx.fillRect(0, 0, 1024, 512);

    for (let i = 0; i < 400; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 512;
      const cr = 8 + Math.random() * 24;
      ectx.beginPath();
      ectx.arc(cx, cy, cr, 0, Math.PI * 2);
      ectx.fillStyle = `rgba(0, 240, 255, ${0.12 + Math.random() * 0.25})`;
      ectx.fill();
    }

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const globeGeo = new THREE.SphereGeometry(60, 48, 48);
    const globeMat = new THREE.MeshBasicMaterial({
      map: earthTexture,
      wireframe: false
    });
    globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // 2. Glowing Atmosphere Rim
    const atmoGeo = new THREE.SphereGeometry(63, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      transparent: true,
      opacity: 0.14,
      wireframe: false
    });
    atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);

    // 3. Cyber Longitude / Latitude Grid
    const gridGeo = new THREE.SphereGeometry(60.8, 24, 16);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    gridMesh = new THREE.Mesh(gridGeo, gridMat);
    scene.add(gridMesh);

    // 4. Orbiting Satellites
    for (let s = 0; s < 3; s++) {
      const orbitRingGeo = new THREE.RingGeometry(75 + s * 14, 75.4 + s * 14, 64);
      const orbitRingMat = new THREE.MeshBasicMaterial({
        color: s === 0 ? 0x00FFA3 : 0x00F0FF,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25
      });
      const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
      orbitRing.rotation.x = Math.PI / 2.5 + s * 0.4;
      orbitRing.rotation.y = s * 0.6;
      scene.add(orbitRing);

      const satGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
      const satMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      scene.add(satMesh);

      satellites.push({ mesh: satMesh, radius: 75 + s * 14, speed: 0.015 + s * 0.008, angle: s * 2, tiltX: orbitRing.rotation.x, tiltY: orbitRing.rotation.y });
    }

    // 5. Global Hotspots Pins
    const nodes = [
      { name: 'YOGYAKARTA HQ', lat: -7.79, lon: 110.36, info: 'Primary Hub [7.79° S, 110.36° E] · 12 Nodes Active' },
      { name: 'TOKYO CLUSTER', lat: 35.67, lon: 139.65, info: 'AI Edge GPU Cluster · 4.2ms Latency' },
      { name: 'FRANKFURT CORE', lat: 50.11, lon: 8.68, info: 'Quantum Mesh Gateway · 100% Uptime' },
      { name: 'CALIFORNIA LAB', lat: 37.77, lon: -122.41, info: 'Model Training Ingestion · 10 Gbps' }
    ];

    nodes.forEach(n => {
      const phi = (90 - n.lat) * (Math.PI / 180);
      const theta = (n.lon + 180) * (Math.PI / 180);
      const r = 61.2;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      const pGeo = new THREE.SphereGeometry(1.8, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({ color: 0x00FFA3 });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(x, y, z);
      globeMesh.add(pMesh);
      markerMeshes.push({ mesh: pMesh, data: n });
    });

    // Mouse Drag Controls
    canvasContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      canvasContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      if (canvasContainer) canvasContainer.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      targetRotY += dx * 0.006;
      targetRotX += dy * 0.006;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    canvasContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.08;
      camera.position.z = Math.max(110, Math.min(260, camera.position.z));
    }, { passive: false });

    // Touch events for mobile
    canvasContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    });
    canvasContainer.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    });
    canvasContainer.addEventListener('touchend', () => { isDragging = false; });

    // Toggles
    container.querySelector('#btnGlobeAtmo')?.addEventListener('click', function () {
      atmoMesh.visible = !atmoMesh.visible;
      this.classList.toggle('active', atmoMesh.visible);
    });
    container.querySelector('#btnGlobeSatellites')?.addEventListener('click', function () {
      satellites.forEach(s => s.mesh.visible = !s.mesh.visible);
      this.classList.toggle('active', satellites[0].mesh.visible);
    });
    container.querySelector('#btnGlobeGrid')?.addEventListener('click', function () {
      gridMesh.visible = !gridMesh.visible;
      this.classList.toggle('active', gridMesh.visible);
    });

    function animate() {
      if (!isDragging) {
        targetRotY += 0.0025;
      }
      globeMesh.rotation.y += (targetRotY - globeMesh.rotation.y) * 0.1;
      globeMesh.rotation.x += (targetRotX - globeMesh.rotation.x) * 0.1;
      gridMesh.rotation.y = globeMesh.rotation.y;
      gridMesh.rotation.x = globeMesh.rotation.x;

      satellites.forEach(s => {
        s.angle += s.speed;
        const sx = Math.cos(s.angle) * s.radius;
        const sz = Math.sin(s.angle) * s.radius;
        s.mesh.position.set(sx, sz * Math.sin(s.tiltX), sz * Math.cos(s.tiltX));
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }

  /* ==========================================================================
     SIMULATOR 4: 3D ANIMATION & MESH INSPECTOR (THREE.JS)
     ========================================================================== */
  function launchMeshSimulator(container) {
    container.innerHTML = `
      <div class="sim-container">
        <div class="sim-hud-bar">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge ok"><span class="btn-live-pulse"></span> 3D MESH INSPECTOR</span>
            <span class="sim-badge">SFM & PRISMA3D PIPELINE</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="sim-badge" id="meshPolyBadge">POLYS: 14,820</span>
            <span class="sim-badge ok" id="meshSpeedBadge">KECEPATAN: 1.0X</span>
          </div>
        </div>

        <div class="sim-canvas-wrap" id="meshCanvasContainer" style="aspect-ratio:16/10;cursor:grab;">
          <div class="sim-3d-tooltip">
             <strong>INSPEKTOR MESH & LIGHTING</strong><br>
            Orbit 360° · Uji Shading PBR, Wireframe, & Studio Clay
          </div>
        </div>

        <div class="sim-controls-bar">
          <div class="sim-control-group">
            <button type="button" class="sim-toggle-btn active" id="btnModePbr">
              <span></span> Shaded PBR
            </button>
            <button type="button" class="sim-toggle-btn" id="btnModeWire">
              <span></span> Holo Wireframe
            </button>
            <button type="button" class="sim-toggle-btn" id="btnModeClay">
              <span></span> Studio Clay
            </button>
          </div>
          <div class="sim-control-group">
            <button type="button" class="sim-action-btn" id="btnToggleAnim">
              <span> Jeda Rotasi</span>
            </button>
            <button type="button" class="sim-action-btn" id="btnSpeedUp">
              <span> Kecepatan 2X</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const canvasContainer = container.querySelector('#meshCanvasContainer');
    if (!canvasContainer || !window.THREE) return;

    let scene, camera, renderer, robotGroup, thrusterParticles;
    let eyeMesh, wings;
    let animId = null;
    let rotSpeed = 0.015;
    let isPaused = false;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const width = canvasContainer.clientWidth || 800;
    const height = canvasContainer.clientHeight || 450;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 65);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    canvasContainer.appendChild(renderer.domElement);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);
    const keyLight = new THREE.DirectionalLight(0x00F0FF, 1.8);
    keyLight.position.set(20, 40, 30);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xA855F7, 1.4);
    rimLight.position.set(-30, -20, -20);
    scene.add(rimLight);

    robotGroup = new THREE.Group();

    const coreGeo = new THREE.SphereGeometry(10, 32, 32);
    const pbrMat = new THREE.MeshStandardMaterial({
      color: 0x1A253C,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x002B47
    });
    const coreMesh = new THREE.Mesh(coreGeo, pbrMat);
    robotGroup.add(coreMesh);

    const eyeGeo = new THREE.SphereGeometry(4, 24, 24);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
    eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    eyeMesh.position.set(0, 0, 8.5);
    robotGroup.add(eyeMesh);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00FFA3,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(14, 0.7, 16, 64), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(17, 0.6, 16, 64), ringMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(20, 0.5, 16, 64), ringMat);
    robotGroup.add(ring1);
    robotGroup.add(ring2);
    robotGroup.add(ring3);

    const wingGeo = new THREE.BoxGeometry(32, 1, 6);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x2A364F, metalness: 0.7, roughness: 0.4 });
    wings = new THREE.Mesh(wingGeo, wingMat);
    robotGroup.add(wings);

    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 6;
      pPos[i + 1] = -12 - Math.random() * 20;
      pPos[i + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x00F0FF, size: 1.5, transparent: true, opacity: 0.75 });
    thrusterParticles = new THREE.Points(pGeo, pMat);
    robotGroup.add(thrusterParticles);

    scene.add(robotGroup);

    function setRenderMode(mode) {
      robotGroup.traverse((child) => {
        if (child.isMesh) {
          if (mode === 'pbr') {
            child.material.wireframe = false;
            child.material.color.setHex(child === eyeMesh ? 0x00F0FF : (child === wings ? 0x2A364F : 0x1A253C));
          } else if (mode === 'wire') {
            child.material.wireframe = true;
            child.material.color.setHex(0x00F0FF);
          } else if (mode === 'clay') {
            child.material.wireframe = false;
            child.material.color.setHex(0xCCCCCC);
          }
        }
      });
    }

    container.querySelector('#btnModePbr')?.addEventListener('click', function () {
      setRenderMode('pbr');
      container.querySelectorAll('.sim-control-group .sim-toggle-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
    container.querySelector('#btnModeWire')?.addEventListener('click', function () {
      setRenderMode('wire');
      container.querySelectorAll('.sim-control-group .sim-toggle-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
    container.querySelector('#btnModeClay')?.addEventListener('click', function () {
      setRenderMode('clay');
      container.querySelectorAll('.sim-control-group .sim-toggle-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });

    const speedBadge = container.querySelector('#meshSpeedBadge');
    container.querySelector('#btnToggleAnim')?.addEventListener('click', function () {
      isPaused = !isPaused;
      this.innerHTML = isPaused ? '<span> Lanjutkan</span>' : '<span> Jeda Rotasi</span>';
      if (speedBadge) speedBadge.textContent = isPaused ? 'DIJEDA' : `KECEPATAN: ${(rotSpeed / 0.015).toFixed(1)}X`;
    });

    container.querySelector('#btnSpeedUp')?.addEventListener('click', function () {
      rotSpeed = rotSpeed === 0.015 ? 0.03 : 0.015;
      this.innerHTML = rotSpeed === 0.03 ? '<span> Kecepatan 1X</span>' : '<span> Kecepatan 2X</span>';
      if (speedBadge) speedBadge.textContent = `KECEPATAN: ${(rotSpeed / 0.015).toFixed(1)}X`;
    });

    canvasContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      canvasContainer.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
      if (canvasContainer) canvasContainer.style.cursor = 'grab';
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      targetRotY += dx * 0.01;
      targetRotX += dy * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    canvasContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.06;
      camera.position.z = Math.max(30, Math.min(120, camera.position.z));
    }, { passive: false });

    // Touch events for mobile
    canvasContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    });
    canvasContainer.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      targetRotY += dx * 0.01;
      targetRotX += dy * 0.01;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    });
    canvasContainer.addEventListener('touchend', () => { isDragging = false; });

    function animate() {
      if (!isPaused) {
        targetRotY += rotSpeed;
        ring1.rotation.x += 0.02;
        ring1.rotation.y += 0.01;
        ring2.rotation.y += 0.025;
        ring2.rotation.z += 0.015;
        ring3.rotation.z += 0.03;

        const posAttr = thrusterParticles.geometry.attributes.position;
        for (let i = 1; i < posAttr.count * 3; i += 3) {
          posAttr.array[i] -= 0.6;
          if (posAttr.array[i] < -35) posAttr.array[i] = -12;
        }
        posAttr.needsUpdate = true;
      }

      robotGroup.rotation.y += (targetRotY - robotGroup.rotation.y) * 0.1;
      robotGroup.rotation.x += (targetRotX - robotGroup.rotation.x) * 0.1;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }

  // Bind Listeners on DOM Ready
  window.addEventListener('DOMContentLoaded', function () {
    // 1. Flagship Cards Demo Buttons
    document.querySelectorAll('.demo-trigger').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const demo = this.dataset.demo;
        const card = this.closest('.work-card');
        const projectData = card ? {
          title: card.dataset.title,
          tag: card.dataset.tag,
          desc: card.dataset.desc,
          img: card.dataset.img,
          link: card.dataset.link,
          video: card.dataset.video
        } : null;
        window.ProjectSimulators.openDemo(demo, projectData);
      });
    });

    // 2. Modal Tabs
    document.getElementById('modalTabOverview')?.addEventListener('click', function () {
      window.ProjectSimulators.showOverview();
    });

    document.getElementById('modalTabDemo')?.addEventListener('click', function () {
      if (activeDemo) {
        window.ProjectSimulators.openDemo(activeDemo, lastOpenedProjectData);
      }
    });

    // 3. Modal Launch Demo Button inside Overview
    document.getElementById('modalLaunchDemoBtn')?.addEventListener('click', function () {
      const demo = this.dataset.demo;
      if (demo) {
        window.ProjectSimulators.openDemo(demo, lastOpenedProjectData);
      }
    });

    // 4. Modal Close hook
    document.getElementById('modalClose')?.addEventListener('click', function () {
      window.ProjectSimulators.closeDemo();
    });

    // 5. Hero Cyber Terminal Trigger
    document.getElementById('heroTermTrigger')?.addEventListener('click', function () {
      const fab = document.getElementById('termFab');
      if (fab) fab.click();
    });
  });

})();
