/**
 * AVATAR CYBERNETIC LASER SCANNER ENGINE
 * Mahabbah Mahabban Romadhon — Interactive Profile Reveal
 * Smooth touch gesture tracking for mobile & responsive mouse dragging for desktop
 */
(function() {
  function initAvatarScannerEngine() {
    const viewport = document.getElementById('avatarScannerViewport');
    const cyberLayer = document.getElementById('avatarCyberLayer');
    const laserLine = document.getElementById('scannerLaserLine');
    const humanValEl = document.getElementById('telemetryHumanVal');
    const cyberValEl = document.getElementById('telemetryCyberVal');
    const statusEl = document.getElementById('telemetryStatus');
    if (!viewport || !cyberLayer || !laserLine) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  let targetPercent = 0.5;
  let currentPercent = 0.5;
  let isInteracting = false;
  let isDragging = false;
  let lastInteractionTime = Date.now();
  let autoScanAngle = 0;

  function updatePercentFromClientX(clientX) {
    const rect = viewport.getBoundingClientRect();
    if (rect.width <= 0) return;
    const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    targetPercent = clampedX / rect.width;
    lastInteractionTime = Date.now();
  }

  // --- Render Loop with Spring Physics ---
  function renderLoop() {
    // Auto-scan ambient wave when idle for 3.5s (unless reduced motion)
    if (!isInteracting && !reduceMotion) {
      const idleDuration = Date.now() - lastInteractionTime;
      if (idleDuration > 3500) {
        autoScanAngle += 0.024;
        targetPercent = 0.5 + Math.sin(autoScanAngle) * 0.38;
      }
    }

    const ease = reduceMotion ? 1 : (isDragging ? 0.28 : 0.14);
    currentPercent += (targetPercent - currentPercent) * ease;

    const pct = Math.max(0, Math.min(1, currentPercent));
    const pct100 = (pct * 100).toFixed(2);

    // Apply polygon clip-path to cybernetic layer
    cyberLayer.style.clipPath = `polygon(${pct100}% 0%, 100% 0%, 100% 100%, ${pct100}% 100%)`;
    
    // Position laser scan line precisely along the dividing boundary
    laserLine.style.left = `${pct100}%`;

    // Real-time telemetry numerical readout
    const humanPct = Math.round((pct) * 100);
    const cyberPct = Math.round((1 - pct) * 100);

    if (humanValEl) humanValEl.textContent = `${humanPct}%`;
    if (cyberValEl) cyberValEl.textContent = `${cyberPct}%`;
    if (statusEl) {
      if (humanPct > 80) statusEl.textContent = 'BIO-PRIMARY';
      else if (cyberPct > 80) statusEl.textContent = 'CYBER-ACTIVE';
      else statusEl.textContent = 'HYBRID-SYNC';
    }

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  // --- Desktop Mouse Interactions ---
  viewport.addEventListener('mouseenter', (e) => {
    isInteracting = true;
    updatePercentFromClientX(e.clientX);
    if (window.CosmicAudio && typeof window.CosmicAudio.playLaserHum === 'function') {
      window.CosmicAudio.playLaserHum(targetPercent);
    }
  });

  viewport.addEventListener('mousemove', (e) => {
    isInteracting = true;
    updatePercentFromClientX(e.clientX);
  });

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    isInteracting = true;
    updatePercentFromClientX(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  viewport.addEventListener('mouseleave', () => {
    isInteracting = false;
    isDragging = false;
    lastInteractionTime = Date.now();
  });

  // --- Mobile Touch Gestures ---
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      isInteracting = true;
      isDragging = true;
      updatePercentFromClientX(e.touches[0].clientX);
      if (window.CosmicAudio && typeof window.CosmicAudio.playLaserHum === 'function') {
        window.CosmicAudio.playLaserHum(targetPercent);
      }
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      isInteracting = true;
      updatePercentFromClientX(e.touches[0].clientX);
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    isDragging = false;
    isInteracting = false;
    lastInteractionTime = Date.now();
  }, { passive: true });

  viewport.addEventListener('touchcancel', () => {
    isDragging = false;
    isInteracting = false;
    lastInteractionTime = Date.now();
  }, { passive: true });

    // Expose for external controls or testing
    window.AvatarScanner = {
      setTarget: (p) => { targetPercent = Math.max(0, Math.min(1, p)); lastInteractionTime = Date.now(); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAvatarScannerEngine);
  } else {
    initAvatarScannerEngine();
  }
})();
