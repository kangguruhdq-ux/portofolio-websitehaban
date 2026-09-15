/**
 * CELESTIAL DEEP SPACE ENGINE (THREE.JS)
 * Mahabbah Mahabban Romadhon — Clean Atmospheric Starfield & Meteors
 * Pure atmospheric background: multi-depth stars, nebula dust, and shooting meteors.
 * (Big spinning/rotating planet core removed for a clean, non-intrusive mobile & desktop experience)
 */
(function() {
  function webglReady() {
    if (typeof THREE === 'undefined') return false;
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  function setupCosmos() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !webglReady()) return;

    try {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isNarrow = window.innerWidth < 640;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 4.2;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      let contextOk = true;
      canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); contextOk = false; }, false);
      canvas.addEventListener('webglcontextrestored', () => { contextOk = true; }, false);

      // --- Multi-Depth Twinkling Starfield ---
      function createStarfield(count, spread, size, color) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
          pos[i * 3] = (Math.random() - 0.5) * spread;
          pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
          pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
          sizes[i] = size * (0.6 + Math.random() * 0.8);
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
          size: size,
          color: color,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        return new THREE.Points(geo, mat);
      }

      const starsDistant = createStarfield(isNarrow ? 350 : 750, 48, 0.024, 0xD4E4FF);
      const starsMid = createStarfield(isNarrow ? 150 : 300, 32, 0.038, 0x00F0FF);
      const nebulaDust = createStarfield(isNarrow ? 100 : 220, 24, 0.045, 0x8B5CF6);
      scene.add(starsDistant, starsMid, nebulaDust);

      // --- Shooting Stars / Meteors ---
      const meteors = [];
      function spawnMeteor() {
        if (reduceMotion || !contextOk) return;
        const count = 22;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const startX = (Math.random() - 0.4) * 14;
        const startY = 5 + Math.random() * 3;
        const startZ = -2 + (Math.random() - 0.5) * 5;
        
        for (let i = 0; i < count; i++) {
          pos[i * 3] = startX;
          pos[i * 3 + 1] = startY;
          pos[i * 3 + 2] = startZ;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        
        // Multi-color celestial meteors: Cyan, Diamond White, Amber Gold, Violet
        const palette = [0x00F0FF, 0xFFFFFF, 0xFFB800, 0xA855F7, 0x00FFA3];
        const chosenColor = palette[Math.floor(Math.random() * palette.length)];

        const mat = new THREE.PointsMaterial({
          size: 0.052,
          color: chosenColor,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending
        });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        const dir = Math.random() > 0.25 ? -1 : 1;
        meteors.push({
          points, geo, mat,
          vx: dir * (4.2 + Math.random() * 2.8),
          vy: -3.4 - Math.random() * 2.6,
          vz: -0.6,
          life: 0,
          maxLife: 0.95
        });
      }

      // Schedule frequent celestial meteors every 2.4 - 3.6 seconds
      function scheduleMeteors() {
        const delay = 2400 + Math.random() * 1400;
        setTimeout(() => {
          if (!document.hidden && contextOk) {
            spawnMeteor();
            if (Math.random() > 0.65) {
              setTimeout(spawnMeteor, 300); // Double cluster
            }
          }
          scheduleMeteors();
        }, delay);
      }
      scheduleMeteors();

      // Mouse Parallax & Scroll Depth
      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;
      let parallaxX = 0, parallaxY = 0;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX - halfW;
        mouseY = e.clientY - halfH;
      }, { passive: true });

      let scrollFactor = 0;
      let scrollTicking = false;
      window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
          const h = document.documentElement;
          scrollFactor = Math.min(h.scrollTop / (window.innerHeight * 1.2), 1);
          scrollTicking = false;
        });
      }, { passive: true });

      // Main Animation Loop
      const clock = new THREE.Clock();
      let tabVisible = !document.hidden;
      document.addEventListener('visibilitychange', () => { tabVisible = !document.hidden; });

      function animate() {
        if (!tabVisible || !contextOk) { requestAnimationFrame(animate); return; }
        const t = clock.getElapsedTime();
        const dt = 0.016;

        if (!reduceMotion) {
          // Slow serene celestial rotation
          starsDistant.rotation.y = t * 0.006;
          starsMid.rotation.y = -t * 0.009;
          nebulaDust.rotation.y = t * 0.012;
          nebulaDust.rotation.x = Math.sin(t * 0.15) * 0.04;
        }

        // Parallax damping
        targetX = mouseX * 0.0004;
        targetY = mouseY * 0.0004;
        parallaxY += 0.04 * (targetX - parallaxY);
        parallaxX += 0.04 * (targetY - parallaxX);
        camera.rotation.y = parallaxY;
        camera.rotation.x = parallaxX;

        // Subtle camera elevation with scroll
        camera.position.y = scrollFactor * -0.3;

        // Animate meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life += dt;
          const arr = m.geo.attributes.position.array;
          for (let j = 0; j < arr.length; j += 3) {
            arr[j] += m.vx * dt;
            arr[j + 1] += m.vy * dt;
            arr[j + 2] += m.vz * dt;
          }
          m.geo.attributes.position.needsUpdate = true;
          m.mat.opacity = Math.max(0, 1 - m.life / m.maxLife);
          if (m.life >= m.maxLife) {
            scene.remove(m.points);
            m.geo.dispose();
            m.mat.dispose();
            meteors.splice(i, 1);
          }
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      // Window resize debounce
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }, 120);
      });
    } catch (e) {
      if (canvas) canvas.style.display = 'none';
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', setupCosmos);
  } else {
    setupCosmos();
  }
})();
