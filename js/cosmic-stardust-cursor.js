/**
 * ============================================================================
 * COSMIC STARDUST CURSOR & CYBER KINETIC DYNAMICS ENGINE
 * Mahabbah Mahabban Romadhon — Features No. 1, 4, 5, 6
 * ============================================================================
 * 
 * 1. Stardust Cursor: Glowing micro-particles follow mouse with celestial trail.
 * 2. Gravitational Magnetism: Particles attract toward nearby interactive buttons.
 * 3. Button Particle Bursts: Radiates cosmic sparks on click.
 * 4. Hero 3D Holographic Cyber Core: Interactive wireframe tesseract/core.
 * 5. Active Cyber Radar Scanner: 360° sweeping sentinel radar with live packets.
 */

(function initCosmicStardustDynamics() {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  /* ==========================================================================
     1. COSMIC STARDUST CURSOR TRAIL (FEATURE NO. 1)
     ========================================================================== */
  const canvas = document.createElement('canvas');
  canvas.id = 'stardustCanvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = 65;
  const colors = ['#00F0FF', '#FFFFFF', '#FFB800', '#A855F7', '#00FFA3'];

  let mouseX = -100;
  let mouseY = -100;
  let prevMouseX = -100;
  let prevMouseY = -100;
  let isMouseMoving = false;
  let mouseTimer = null;

  window.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    isMouseMoving = true;
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => { isMouseMoving = false; }, 180);

    // Spawn 2 stardust particles per movement
    if (particles.length < maxParticles) {
      const speed = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      const spread = Math.min(speed * 0.15, 3);
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 8,
          y: mouseY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * spread * 0.8,
          vy: (Math.random() - 0.5) * spread * 0.8 - 0.2,
          radius: 1.2 + Math.random() * 2.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.9,
          decay: 0.02 + Math.random() * 0.02
        });
      }
    }
  }, { passive: true });

  /* ==========================================================================
     FEATURE NO. 6: BUTTON PARTICLE BURST ON CLICK
     ========================================================================== */
  window.emitParticleBurst = function (x, y, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 4.5;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.022 + Math.random() * 0.02
      });
    }
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .hire-btn, .work-link, .filter-btn, .util-btn');
    if (btn) {
      window.emitParticleBurst(e.clientX, e.clientY, 18);
    }
  });

  // Stardust Render Loop
  function renderStardust() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(renderStardust);
  }
  requestAnimationFrame(renderStardust);

  /* ==========================================================================
     FEATURE NO. 4: FLOATING 3D HOLOGRAPHIC CYBER CORE (IN HERO)
     ========================================================================== */
  function initHeroHoloCore() {
    const container = document.getElementById('heroHoloWidget');
    if (!container || !window.THREE) return;

    const w = container.clientWidth || 220;
    const h = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    container.appendChild(renderer.domElement);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, wireframe: true, transparent: true, opacity: 0.6 });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // Outer Wireframe Icosahedron (Tesseract node)
    const outerGeo = new THREE.IcosahedronGeometry(6.5, 1);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, wireframe: true, transparent: true, opacity: 0.45 });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Orbiting Rings
    const ringGeo = new THREE.TorusGeometry(8.5, 0.15, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00FFA3, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Parallax mouse tilt
    let rotX = 0, rotY = 0;
    let targetRotX = 0, targetRotY = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetRotY = (e.clientX - cx) * 0.0015;
      targetRotX = (e.clientY - cy) * 0.0015;
    }, { passive: true });

    container.addEventListener('click', () => {
      // Pulse spin
      rotY += 0.8;
      if (window.emitParticleBurst) {
        const rect = container.getBoundingClientRect();
        window.emitParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
      }
    });

    function animCore() {
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;

      innerCore.rotation.y += 0.02;
      innerCore.rotation.x += 0.01;
      outerMesh.rotation.y -= 0.012;
      outerMesh.rotation.z += 0.008;
      ring.rotation.z += 0.018;

      scene.rotation.x = rotX;
      scene.rotation.y = rotY;

      renderer.render(scene, camera);
      requestAnimationFrame(animCore);
    }
    requestAnimationFrame(animCore);
  }

  /* ==========================================================================
     FEATURE NO. 5: ACTIVE CYBER RADAR SCANNER WIDGET (IN SKILLS / SECURITY)
     ========================================================================== */
  function initCyberRadar() {
    const canvas = document.getElementById('cyberRadarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = 240);
    const h = (canvas.height = 240);
    const cx = w / 2;
    const cy = h / 2;
    const radius = 100;

    let angle = 0;
    const blips = [
      { r: 40, a: 0.8, life: 1, label: 'SSH:22' },
      { r: 68, a: 2.3, life: 1, label: 'YOLOv8' },
      { r: 85, a: 4.1, life: 1, label: 'TLS:443' },
      { r: 52, a: 5.2, life: 1, label: 'CBBH' }
    ];

    function renderRadar() {
      ctx.clearRect(0, 0, w, h);

      // 1. Radar circles
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1;
      [30, 60, 90, 100].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 2. Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // 3. Sweep line with gradient trail
      angle += 0.035;
      const sweepEnd = { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(0, 255, 163, 0.25)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - 0.45, angle);
      ctx.closePath();
      ctx.fill();

      // Main sweep beam
      ctx.strokeStyle = '#00FFA3';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepEnd.x, sweepEnd.y);
      ctx.stroke();

      // 4. Blips
      blips.forEach(b => {
        const bx = cx + Math.cos(b.a) * b.r;
        const by = cy + Math.sin(b.a) * b.r;

        // Angle difference to sweep
        const diff = (angle % (Math.PI * 2)) - (b.a % (Math.PI * 2));
        if (Math.abs(diff) < 0.1) b.life = 1.0;
        else b.life = Math.max(0.2, b.life - 0.008);

        ctx.fillStyle = `rgba(0, 255, 163, ${b.life})`;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();

        if (b.life > 0.6) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00F0FF';
          ctx.fillText(b.label, bx + 6, by - 4);
        }
      });

      requestAnimationFrame(renderRadar);
    }
    requestAnimationFrame(renderRadar);
  }

  // Bind on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroHoloCore();
      initCyberRadar();
    });
  } else {
    initHeroHoloCore();
    initCyberRadar();
  }
})();
