/** Barred spiral galaxy with bounded particle flow evaluated on the GPU. */
(function () {
  'use strict';

  function initGalaxyGateway() {
    const gateway = document.getElementById('galaxyGateway');
    const canvas = document.getElementById('galaxy-canvas');
    const hero = document.getElementById('heroSection');
    if (!gateway || !canvas || gateway.dataset.initialized) return;
    // Wait before installing listeners; a slow CDN must not create duplicate loops.
    if (typeof THREE === 'undefined') {
      if (initGalaxyGateway.retries++ < 12) window.setTimeout(initGalaxyGateway, 900);
      return;
    }
    gateway.dataset.initialized = 'true';

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let visible = true;
    let contextActive = true;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let progress = 0;
    let targetProgress = 0;
    let width = gateway.clientWidth;
    let height = gateway.clientHeight;
    let entrance = null;

    function updateScroll() {
      const rect = gateway.getBoundingClientRect();
      targetProgress = Math.max(0, Math.min(1, -rect.top / height));
      // When returning to the top, remove any leftover dispersion immediately.
      // This prevents the last off-screen frame from being shown as a stretched cloud.
      if (targetProgress < 0.002) targetProgress = 0;
      const atGateway = rect.bottom > Math.min(height * 0.18, 120);
      if (entrance !== atGateway) {
        entrance = atGateway;
        document.body.classList.toggle('at-galaxy-gateway', atGateway);
        document.body.classList.toggle('in-portfolio', !atGateway);
      }
      requestRender();
    }
    // Native anchor links still work if WebGL or Three.js cannot load.
    gateway.querySelectorAll('a[href="#heroSection"]').forEach(link => {
      link.addEventListener('click', event => {
        if (!hero || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        hero.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
        hero.focus({ preventScroll: true });
      });
    });
    if (hero) hero.setAttribute('tabindex', '-1');

    let renderer, scene, camera;
    let draw = () => {};
    function requestRender() {
      if (!renderer || frame || !visible || !contextActive || document.hidden) return;
      frame = requestAnimationFrame(animate);
    }
    function animate(now) {
      frame = 0;
      if (!visible || !contextActive || document.hidden) { lastTime = 0; return; }
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;
      const ease = reducedMotion ? 1 : 1 - Math.exp(-7 * dt);
      progress += (targetProgress - progress) * ease;
      if (Math.abs(targetProgress - progress) < 0.0001) progress = targetProgress;
      if (targetProgress === 0 && progress < 0.02) progress = 0;
      if (!reducedMotion) elapsed += dt;
      gateway.style.setProperty('--galaxy-fade', Math.max(0, 1 - progress * 2).toFixed(4));
      gateway.style.setProperty('--galaxy-shift', (reducedMotion ? 0 : progress * 40) + 'px');
      draw(dt);
      renderer.render(scene, camera);
      if (!reducedMotion || progress !== targetProgress) requestRender();
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    const compact = width < 768 || (navigator.hardwareConcurrency || 8) <= 4;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch (_) { return; }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 600);
    const root = new THREE.Group();
    root.rotation.set(1.02, 0, -0.38);
    scene.add(root);
    const uniforms = {
      uTime: { value: 0 },
      uSpread: { value: 0 },
      uOpacity: { value: 1 },
      uPixelScale: { value: 1 }
    };
    const vertexShader = `
      attribute float aSize;
      attribute float aPhase;
      attribute vec4 aPath;
      attribute vec3 aScatter;
      attribute float aSpeed;
      uniform float uTime;
      uniform float uSpread;
      uniform float uPixelScale;
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vColor = color;
        vTwinkle = 0.86 + 0.14 * sin(uTime * 0.65 + aPhase);
        // Oscillate ALONG a fixed logarithmic arm. Independent angular speeds
        // accumulated over time would shear the arms into a featureless disc.
        vec3 flowing = position;
        if (aPath.w > 0.0) {
          float path = aPath.x + sin(uTime * aSpeed + aPhase) * aPath.w;
          float radius = 5.0 + 29.0 * path;
          float angle = aPath.y + 2.35 * log(radius / 5.0);
          float lane = aPath.z * (0.28 + radius * 0.023);
          flowing.x = cos(angle) * (radius + lane);
          flowing.z = sin(angle) * (radius + lane);
        }
        // Scroll changes the whole formation uniformly, never individual orbits.
        // Fixed per-star vectors create a controlled shatter on scroll.
        // Returning uSpread to zero restores the exact spiral coordinates.
        vec3 p = flowing + aScatter * uSpread;
        vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = clamp(aSize * uPixelScale / max(1.0, -viewPosition.z), 1.0, 96.0);
      }
    `;
    const fragmentShader = `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        float glow = exp(-d * d * 5.5) * (1.0 - smoothstep(0.55, 1.0, d));
        gl_FragColor = vec4(vColor, glow * vTwinkle * uOpacity);
      }
    `;
    // Stable sampling keeps the same visual composition after a reload.
    let seed = 73129;
    function random() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    function gaussian() {
      return Math.sqrt(-2 * Math.log(Math.max(random(), 0.00001))) * Math.cos(random() * Math.PI * 2);
    }
    function particleLayer(count, kind) {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const paths = new Float32Array(count * 4);
      const scatters = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const phases = new Float32Array(count);
      const speeds = new Float32Array(count);
      const warm = new THREE.Color('#efc38b');
      const blue = new THREE.Color('#8eb4df');
      const white = new THREE.Color('#fff0cf');
      const pink = new THREE.Color('#f28ba9');
      const haze = kind === 'mist';
      for (let i = 0; i < count; i++) {
        const j = i * 3;
        let tint = blue;
        if (kind === 'background') {
          positions[j] = (random() - 0.5) * 340;
          positions[j + 1] = (random() - 0.5) * 240;
          positions[j + 2] = -90 - random() * 180;
          sizes[i] = 0.24 + random() * 0.5;
        } else if (kind === 'bulge') {
          // A warm elongated bar, in the same plane as the arms.
          positions[j] = Math.max(-7, Math.min(7, gaussian() * 2.8));
          positions[j + 1] = gaussian() * 0.32;
          positions[j + 2] = gaussian() * 0.85;
          sizes[i] = 0.065 + random() * 0.18;
          tint = warm.clone().lerp(white, random() * 0.65);
        } else {
          const t = 0.025 + random() * 0.95;
          const r = 5 + 29 * t;
          // Two main arms start at opposite ends of the bar; two fainter
          // branches and a diffuse disc create the layered reference silhouette.
          const branch = i % 10;
          const arm = branch < 4 ? 0 : branch < 8 ? Math.PI : (branch === 8 ? 0.82 : Math.PI + 0.82);
          const angle = arm + 2.35 * Math.log(r / 5);
          const lane = gaussian() * (haze ? 1.8 : 1);
          const diffuse = kind === 'dust' && random() < 0.12;
          const actualAngle = diffuse ? random() * Math.PI * 2 : angle;
          positions[j] = Math.cos(actualAngle) * r;
          positions[j + 1] = gaussian() * (haze ? 0.25 : 0.12);
          positions[j + 2] = Math.sin(actualAngle) * r;
          if (!diffuse) {
            paths[i * 4] = t;
            paths[i * 4 + 1] = arm;
            paths[i * 4 + 2] = lane;
            // Bounded travel stays within the arm at every possible time.
            paths[i * 4 + 3] = kind === 'nebula' ? 0.004 : 0.012;
          }
          sizes[i] = haze ? 2.4 + random() * 3.5 : kind === 'nebula' ? 0.6 + random() * 1.7 : 0.06 + Math.pow(random(), 5) * 0.35;
          tint = kind === 'nebula' ? pink : random() < 0.12 ? warm : blue.clone().lerp(white, random() * 0.5);
          if (diffuse) tint = blue.clone().multiplyScalar(0.4);
        }
        colors[j] = tint.r; colors[j + 1] = tint.g; colors[j + 2] = tint.b;
        // Deterministic explosion directions: radial, with a small vertical
        // lift, so the formation reads as a cinematic warp rather than noise.
        const scatterRadius = kind === 'background' ? 0 : 12 + random() * 28;
        const scatterAngle = Math.atan2(positions[j + 2], positions[j]) + (random() - 0.5) * 0.35;
        scatters[j] = Math.cos(scatterAngle) * scatterRadius;
        scatters[j + 1] = (random() - 0.5) * (8 + scatterRadius * 0.45);
        scatters[j + 2] = Math.sin(scatterAngle) * scatterRadius + 10 + random() * 18;
        phases[i] = random() * Math.PI * 2;
        speeds[i] = 0.09 + random() * 0.12;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('aPath', new THREE.BufferAttribute(paths, 4));
      geometry.setAttribute('aScatter', new THREE.BufferAttribute(scatters, 3));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
      const layerUniforms = { ...uniforms, uOpacity: { value: kind === 'mist' ? 0.055 : 0.85 } };
      const material = new THREE.ShaderMaterial({
        uniforms: layerUniforms, vertexShader, fragmentShader, vertexColors: true,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geometry, material);
      // GPU displacement can move stars outside the original bounding sphere.
      points.frustumCulled = false;
      (kind === 'background' ? scene : root).add(points);
      return material;
    }
    const dust = particleLayer(compact ? 18000 : 36000, 'dust');
    const mist = particleLayer(compact ? 900 : 1800, 'mist');
    const bulge = particleLayer(compact ? 1800 : 3600, 'bulge');
    const nebula = particleLayer(compact ? 180 : 360, 'nebula');
    const background = particleLayer(compact ? 450 : 1000, 'background');

    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureCanvas.height = 128;
    const ctx = textureCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, '#fffaf2');
    gradient.addColorStop(0.08, '#fff0dbe6');
    gradient.addColorStop(0.22, '#ffd1a066');
    gradient.addColorStop(0.5, '#88baff18');
    gradient.addColorStop(1, '#88baff00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const coreMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.CanvasTexture(textureCanvas), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.85 });
    const core = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), coreMaterial);
    core.rotation.x = -Math.PI / 2;
    core.scale.set(22, 8, 1);
    root.add(core);

    let dragId = null;
    let previousX = 0;
    let previousY = 0;
    let turn = 0;
    let tilt = 1.02;
    let currentTurn = 0;
    let autoTurn = 0;
    let distance = 90;
    canvas.addEventListener('pointerdown', event => {
      if (reducedMotion || !event.isPrimary || event.button !== 0) return;
      dragId = event.pointerId;
      previousX = event.clientX; previousY = event.clientY;
      canvas.setPointerCapture(dragId);
    });
    canvas.addEventListener('pointermove', event => {
      if (event.pointerId !== dragId) return;
      turn += (event.clientX - previousX) * 0.004;
      if (event.pointerType === 'mouse') tilt = Math.max(0.65, Math.min(1.25, tilt + (event.clientY - previousY) * 0.002));
      previousX = event.clientX; previousY = event.clientY;
    });
    function endDrag() { dragId = null; }
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('lostpointercapture', endDrag);

    function resize() {
      width = gateway.clientWidth; height = gateway.clientHeight;
      if (!width || !height) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.25 : 1.75);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Fit the full diameter on narrow screens, with room around both spiral arms.
      distance = Math.max(86, 41 / (Math.tan(camera.fov * Math.PI / 360) * camera.aspect));
      camera.far = distance + 500;
      camera.updateProjectionMatrix();
      uniforms.uPixelScale.value = height * pixelRatio / (2 * Math.tan(camera.fov * Math.PI / 360));
      updateScroll();
    }
    draw = dt => {
      if (!reducedMotion && dragId === null) autoTurn = (autoTurn + dt * 0.012) % (Math.PI * 2);
      const ease = reducedMotion ? 1 : 1 - Math.exp(-5 * dt);
      currentTurn += (turn - currentTurn) * ease;
      root.rotation.y = autoTurn + currentTurn;
      root.rotation.x += (tilt - root.rotation.x) * ease;
      const spread = reducedMotion ? 0 : progress * progress;
      uniforms.uTime.value = elapsed;
      uniforms.uSpread.value = spread;
      dust.uniforms.uOpacity.value = 0.85 * (1 - progress);
      mist.uniforms.uOpacity.value = 0.085 * (1 - progress);
      bulge.uniforms.uOpacity.value = 0.6 * (1 - progress);
      nebula.uniforms.uOpacity.value = 0.45 * (1 - progress);
      background.uniforms.uOpacity.value = 0.65 * (1 - progress * 0.7);
      coreMaterial.opacity = 0.85 * Math.max(0, 1 - progress * 1.5);
      const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * 0.7) * 0.025;
      core.scale.set(22 * pulse, 8 * pulse, 1);
      camera.position.set(0, distance * 0.24, distance * (1 - spread * 0.08));
      camera.lookAt(0, 0, 0);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      else { updateScroll(); requestRender(); }
    });
    observer.observe(gateway);
    new ResizeObserver(resize).observe(gateway);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      else requestRender();
    });
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault(); contextActive = false;
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
      gateway.classList.remove('galaxy-ready');
    });
    canvas.addEventListener('webglcontextrestored', () => {
      contextActive = true; resize(); gateway.classList.add('galaxy-ready'); requestRender();
    });
    motionQuery.addEventListener('change', event => {
      reducedMotion = event.matches; endDrag(); lastTime = 0; requestRender();
    });
    resize();
    gateway.classList.add('galaxy-ready');
    requestRender();
  }
  initGalaxyGateway.retries = 0;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGalaxyGateway, { once: true });
  else initGalaxyGateway();
})();
