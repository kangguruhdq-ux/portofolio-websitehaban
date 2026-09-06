/**
 * CELESTIAL DEEP SPACE & COSMOS ENGINE (THREE.JS)
 * Mahabbah Mahabban Romadhon — Planetary Core, Nebula Dust & Multi-Tier Starfields
 */
(function initSpaceCosmosEngine() {
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

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      let contextOk = true;
      canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); contextOk = false; }, false);
      canvas.addEventListener('webglcontextrestored', () => { contextOk = true; }, false);

      const cosmosGroup = new THREE.Group();
      scene.add(cosmosGroup);

      // --- Tier 1: Multi-Depth Twinkling Starfield ---
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

      const starsDistant = createStarfield(isNarrow ? 400 : 850, 48, 0.024, 0xD4E4FF);
      const starsMid = createStarfield(isNarrow ? 180 : 350, 32, 0.038, 0x00F0FF);
      const nebulaDust = createStarfield(isNarrow ? 120 : 260, 24, 0.045, 0x8B5CF6);
      scene.add(starsDistant, starsMid, nebulaDust);

      // --- Tier 2: Planetary / Celestial Core ---
      const coreGroup = new THREE.Group();
      cosmosGroup.add(coreGroup);

      // Wireframe celestial spheres
      const outerCoreGeo = new THREE.IcosahedronGeometry(1.35, 1);
      const outerCoreMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, wireframe: true, transparent: true, opacity: 0.32 });
      const outerCore = new THREE.Mesh(outerCoreGeo, outerCoreMat);

      const innerCoreGeo = new THREE.IcosahedronGeometry(0.85, 1);
      const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, wireframe: true, transparent: true, opacity: 0.26 });
      const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
      coreGroup.add(outerCore, innerCore);

      // Core vertex beacon nodes
      const nodeMat = new THREE.PointsMaterial({ size: 0.048, color: 0x00F0FF, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
      const nodePoints = new THREE.Points(outerCoreGeo, nodeMat);
      coreGroup.add(nodePoints);

      // --- Tier 3: Orbital Rings & Data Satellites ---
      const ringA = new THREE.Mesh(
        new THREE.TorusGeometry(2.1, 0.006, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.25 })
      );
      ringA.rotation.x = Math.PI / 2.3;

      const ringB = new THREE.Mesh(
        new THREE.TorusGeometry(2.65, 0.005, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0x8B5CF6, transparent: true, opacity: 0.2 })
      );
      ringB.rotation.x = Math.PI / 1.7;
      ringB.rotation.y = 0.5;
      coreGroup.add(ringA, ringB);

      // Orbiting Data Nodes
      function createSatellite(color) {
        const geo = new THREE.SphereGeometry(0.04, 10, 10);
        const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.95 });
        return new THREE.Mesh(geo, mat);
      }
      const satellites = [
        { mesh: createSatellite(0x00F0FF), radius: 2.1, speed: 0.5, offset: 0, ring: ringA },
        { mesh: createSatellite(0x8B5CF6), radius: 2.1, speed: 0.5, offset: Math.PI, ring: ringA },
        { mesh: createSatellite(0x00FFA3), radius: 2.65, speed: -0.38, offset: Math.PI * 0.5, ring: ringB },
      ];
      satellites.forEach(s => coreGroup.add(s.mesh));

      // --- Tier 4: Shooting Stars / Meteors ---
      const meteors = [];
      function spawnMeteor() {
        if (reduceMotion || !contextOk) return;
        const count = 16;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const startX = (Math.random() - 0.5) * 14;
        const startY = 5 + Math.random() * 4;
        const startZ = -2 + (Math.random() - 0.5) * 6;
        
        for (let i = 0; i < count; i++) {
          pos[i * 3] = startX;
          pos[i * 3 + 1] = startY;
          pos[i * 3 + 2] = startZ;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
          size: 0.05,
          color: Math.random() > 0.4 ? 0x00F0FF : 0x8B5CF6,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending
        });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        meteors.push({
          points, geo, mat,
          vx: -4.5 - Math.random() * 2,
          vy: -3.5 - Math.random() * 2,
          vz: -1.0,
          life: 0,
          maxLife: 0.9
        });
      }

      // Schedule occasional meteors
      setInterval(() => {
        if (!document.hidden && Math.random() > 0.25) spawnMeteor();
      }, 5500);

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
          // Slow celestial rotation
          starsDistant.rotation.y = t * 0.008;
          starsMid.rotation.y = -t * 0.012;
          nebulaDust.rotation.y = t * 0.015;
          nebulaDust.rotation.x = Math.sin(t * 0.2) * 0.05;

          // Planetary core dynamics
          innerCore.rotation.y = -t * 0.22;
          outerCore.rotation.y = t * 0.14;
          const pulse = 1 + Math.sin(t * 1.5) * 0.035;
          coreGroup.scale.setScalar(pulse);

          ringA.rotation.z = t * 0.28;
          ringB.rotation.z = -t * 0.2;

          // Satellites motion along orbital rings
          satellites.forEach(s => {
            const angle = t * s.speed + s.offset;
            const localPos = new THREE.Vector3(Math.cos(angle) * s.radius, Math.sin(angle) * s.radius, 0);
            localPos.applyEuler(s.ring.rotation);
            s.mesh.position.copy(localPos);
          });
        }

        // Parallax damping
        targetX = mouseX * 0.0008;
        targetY = mouseY * 0.0008;
        parallaxY += 0.05 * (targetX - parallaxY);
        parallaxX += 0.05 * (targetY - parallaxX);
        coreGroup.rotation.y = parallaxY;
        coreGroup.rotation.x = parallaxX;

        // Recede into deep space with scroll depth
        coreGroup.position.z = -scrollFactor * 2.5;
        const fade = 1 - scrollFactor * 0.85;
        outerCoreMat.opacity = 0.32 * fade;
        innerCoreMat.opacity = 0.26 * fade;
        nodeMat.opacity = 0.9 * fade;
        ringA.material.opacity = 0.25 * fade;
        ringB.material.opacity = 0.2 * fade;
        camera.position.y = scrollFactor * -0.45;

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
