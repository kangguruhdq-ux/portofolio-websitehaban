'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function GalaxyGateway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [shiftY, setShiftY] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let progress = 0;
    let targetProgress = 0;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 600);
    const root = new THREE.Group();
    root.rotation.set(1.02, 0, -0.38);
    scene.add(root);

    const uniforms = {
      uTime: { value: 0 },
      uSpread: { value: 0 },
      uOpacity: { value: 1 },
      uPixelScale: { value: 1 },
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
        vec3 flowing = position;
        if (aPath.w > 0.0) {
          float path = aPath.x + sin(uTime * aSpeed + aPhase) * aPath.w;
          float radius = 5.0 + 29.0 * path;
          float angle = aPath.y + 2.35 * log(radius / 5.0);
          float lane = aPath.z * (0.28 + radius * 0.023);
          flowing.x = cos(angle) * (radius + lane);
          flowing.z = sin(angle) * (radius + lane);
        }
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
        float glow = exp(-d * d * 4.2) * (1.0 - smoothstep(0.65, 1.0, d));
        gl_FragColor = vec4(vColor, glow * vTwinkle * uOpacity);
      }
    `;

    let seed = 73129;
    function random() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    function gaussian() {
      return Math.sqrt(-2 * Math.log(Math.max(random(), 0.00001))) * Math.cos(random() * Math.PI * 2);
    }

    function particleLayer(count: number, kind: string) {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const paths = new Float32Array(count * 4);
      const scatters = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const phases = new Float32Array(count);
      const speeds = new Float32Array(count);
      const warm = new THREE.Color('#ffd699');
      const blue = new THREE.Color('#9fc7ff');
      const white = new THREE.Color('#ffffff');
      const pink = new THREE.Color('#ffaec6');
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
          positions[j] = Math.max(-7, Math.min(7, gaussian() * 2.8));
          positions[j + 1] = gaussian() * 0.32;
          positions[j + 2] = gaussian() * 0.85;
          sizes[i] = 0.065 + random() * 0.18;
          tint = warm.clone().lerp(white, random() * 0.65);
        } else {
          const t = 0.025 + random() * 0.95;
          const r = 5 + 29 * t;
          const branch = i % 10;
          const arm = branch < 4 ? 0 : branch < 8 ? Math.PI : branch === 8 ? 0.82 : Math.PI + 0.82;
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
            paths[i * 4 + 3] = kind === 'nebula' ? 0.004 : 0.012;
          }
          sizes[i] = haze ? 2.4 + random() * 3.5 : kind === 'nebula' ? 0.6 + random() * 1.7 : 0.06 + Math.pow(random(), 5) * 0.35;
          tint = kind === 'nebula' ? pink : random() < 0.12 ? warm : blue.clone().lerp(white, random() * 0.5);
          if (diffuse) tint = blue.clone().multiplyScalar(0.4);
        }
        colors[j] = tint.r;
        colors[j + 1] = tint.g;
        colors[j + 2] = tint.b;

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

      const layerUniforms = { ...uniforms, uOpacity: { value: kind === 'mist' ? 0.12 : 0.98 } };
      const material = new THREE.ShaderMaterial({
        uniforms: layerUniforms,
        vertexShader,
        fragmentShader,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      (kind === 'background' ? scene : root).add(points);
      return material;
    }

    const isMobile = width < 640;
    const isCompact = width < 768;
    const dust = particleLayer(isMobile ? 4500 : isCompact ? 9000 : 36000, 'dust');
    const mist = particleLayer(isMobile ? 250 : isCompact ? 450 : 1800, 'mist');
    const bulge = particleLayer(isMobile ? 600 : isCompact ? 1200 : 3600, 'bulge');
    const nebula = particleLayer(isMobile ? 60 : isCompact ? 120 : 360, 'nebula');
    const background = particleLayer(isMobile ? 180 : isCompact ? 350 : 1000, 'background');

    // Central core texture
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureCanvas.height = 128;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.1, '#fff5e6');
      gradient.addColorStop(0.25, '#ffe2b899');
      gradient.addColorStop(0.55, '#a6cdff40');
      gradient.addColorStop(1, '#88baff00');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const coreMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.CanvasTexture(textureCanvas),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.96,
    });
    const core = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), coreMaterial);
    core.rotation.x = -Math.PI / 2;
    core.scale.set(22, 8, 1);
    root.add(core);

    // Interactive Drag to Rotate & Tilt Controls
    let dragId: number | null = null;
    let previousX = 0;
    let previousY = 0;
    let turn = 0;
    let tilt = 1.02;
    let currentTurn = 0;
    let autoTurn = 0;
    let distance = 90;

    const onPointerDown = (e: PointerEvent) => {
      if (prefersReducedMotion || !e.isPrimary) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragId = e.pointerId;
      previousX = e.clientX;
      previousY = e.clientY;
      try {
        canvas.setPointerCapture(dragId);
      } catch (_) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== dragId) return;
      turn += (e.clientX - previousX) * 0.005;
      tilt = Math.max(0.65, Math.min(1.25, tilt + (e.clientY - previousY) * 0.003));
      previousX = e.clientX;
      previousY = e.clientY;
    };

    const endDrag = (e?: PointerEvent) => {
      if (dragId !== null && e && canvas.hasPointerCapture(dragId)) {
        try {
          canvas.releasePointerCapture(dragId);
        } catch (_) {}
      }
      dragId = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('lostpointercapture', endDrag);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);

    // Resize & Responsive Camera Setup
    function resize() {
      if (!renderer || !canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      const isMobile = width < 768;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.75);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;

      if (isMobile) {
        distance = Math.min(100, Math.max(86, 36 / (Math.tan((camera.fov * Math.PI) / 360) * Math.max(camera.aspect, 0.72))));
      } else {
        distance = Math.max(86, 41 / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect));
      }
      camera.far = distance + 500;
      camera.updateProjectionMatrix();

      const mobileBoost = isMobile ? 1.5 : 1.0;
      uniforms.uPixelScale.value = (height * pixelRatio) / (2 * Math.tan((camera.fov * Math.PI) / 360)) * mobileBoost;
    }

    // Scroll Tracking to Drive Gateway Warp & Camera Fly-Through
    const updateScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      targetProgress = Math.max(0, Math.min(1, -rect.top / height));
      if (targetProgress < 0.002) targetProgress = 0;

      const fade = Math.max(0, 1 - targetProgress * 1.8);
      const shift = targetProgress * 50;
      setFadeOpacity(fade);
      setShiftY(shift);
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    resize();
    updateScroll();

    // Render Animation Loop with IntersectionObserver Liveness
    let isVisible = true;
    let observer: IntersectionObserver | null = null;

    function animate(now: number) {
      if (!renderer || !isVisible) return;
      if (progress >= 0.98 && targetProgress >= 0.98) {
        frameId = requestAnimationFrame(animate);
        return;
      }
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;

      const ease = prefersReducedMotion ? 1 : 1 - Math.exp(-7 * dt);
      progress += (targetProgress - progress) * ease;
      if (Math.abs(targetProgress - progress) < 0.0001) progress = targetProgress;
      if (targetProgress === 0 && progress < 0.02) progress = 0;

      if (!prefersReducedMotion && dragId === null) {
        elapsed += dt;
        autoTurn = (autoTurn + dt * 0.014) % (Math.PI * 2);
      }

      const turnEase = prefersReducedMotion ? 1 : 1 - Math.exp(-5 * dt);
      currentTurn += (turn - currentTurn) * turnEase;
      root.rotation.y = autoTurn + currentTurn;
      root.rotation.x += (tilt - root.rotation.x) * turnEase;

      const spread = prefersReducedMotion ? 0 : progress * progress;
      uniforms.uTime.value = elapsed;
      uniforms.uSpread.value = spread;

      dust.uniforms.uOpacity.value = 0.98 * (1 - progress);
      mist.uniforms.uOpacity.value = 0.12 * (1 - progress);
      bulge.uniforms.uOpacity.value = 0.88 * (1 - progress);
      nebula.uniforms.uOpacity.value = 0.70 * (1 - progress);
      background.uniforms.uOpacity.value = 0.85 * (1 - progress * 0.7);
      coreMaterial.opacity = (width < 768 ? 1.0 : 0.96) * Math.max(0, 1 - progress * 1.5);

      const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(elapsed * 0.7) * 0.025;
      const coreX = (width < 768 ? 32 : 22) * pulse;
      const coreY = (width < 768 ? 13 : 8) * pulse;
      core.scale.set(coreX, coreY, 1);

      const camY = distance * (width < 768 ? 0.28 : 0.24);
      camera.position.set(0, camY, distance * (1 - spread * 0.08));
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    if (typeof IntersectionObserver !== 'undefined' && container) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              lastTime = performance.now();
              cancelAnimationFrame(frameId);
              frameId = requestAnimationFrame(animate);
            }
          });
        },
        { threshold: 0.02 }
      );
      observer.observe(container);
    } else {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', endDrag);
      canvas.removeEventListener('pointercancel', endDrag);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      if (renderer) renderer.dispose();
    };
  }, []);

  const handleScrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    const hero = document.getElementById('heroSection');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      ref={containerRef}
      id="galaxyGateway"
      className="relative w-full h-[100vh] min-h-[580px] overflow-hidden bg-[#05060A] text-[#edf3ff] select-none flex items-center justify-center isolate"
    >
      {/* 3D WebGL Galaxy Canvas with Grab Cursor & Full Touch/Pointer Support */}
      <canvas
        ref={canvasRef}
        id="galaxy-canvas"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0 touch-none"
        style={{ touchAction: 'none' }}
        aria-label="Simulasi galaksi kosmik 3D interaktif"
      />

      {/* Atmospheric Radial Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-1 bg-[radial-gradient(ellipse_at_48%_48%,rgba(24,40,68,0.35)_0%,transparent_55%),radial-gradient(ellipse_at_65%_40%,rgba(85,53,121,0.2)_0%,transparent_45%)]"
        aria-hidden="true"
      />

      {/* Galaxy HUD Overlay Layer (pointer-events-none so drags pass to canvas, interactive buttons have pointer-events-auto) */}
      <div
        style={{ opacity: fadeOpacity }}
        className="absolute inset-0 z-[3] w-full h-full pointer-events-none select-none transition-opacity duration-200"
      >
        {/* Top Eyebrow Coordinates */}
        <div className="absolute top-[8%] sm:top-[7%] w-full px-6 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#a8b8d0] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#afd7f7] shadow-[0_0_10px_#9ac9ff]" />
            <span>ASTRA // COSMIC GATEWAY 3.0 · [7.7956° S, 110.3695° E]</span>
          </div>
        </div>

        {/* Edge Titles: HABAN on left, PORTOFOLIO on right */}
        <div
          className="absolute top-[48%] -translate-y-1/2 left-0 w-full flex items-center justify-between px-6 sm:px-12 md:px-20 lg:px-28 pointer-events-none"
        >
          <a
            href="#heroSection"
            onClick={handleScrollToHero}
            style={{
              transform: `translateX(-${shiftY * 0.8}px)`,
            }}
            className="pointer-events-auto text-[32px] sm:text-[54px] md:text-[68px] lg:text-[84px] font-medium tracking-[-0.045em] text-[#edf3ff] hover:text-white transition-all duration-300 drop-shadow-[0_2px_28px_#030813] hover:drop-shadow-[0_0_24px_rgba(168,207,255,0.6)] cursor-pointer"
            aria-label="Haban — Jelajahi Portofolio"
          >
            HABAN
          </a>

          {/* Central subtle singularity point */}
          <div className="w-1 h-1 rounded-full bg-cyan-400/30 blur-[1px] pointer-events-none" aria-hidden="true" />

          <a
            href="#heroSection"
            onClick={handleScrollToHero}
            style={{
              transform: `translateX(${shiftY * 0.8}px)`,
            }}
            className="pointer-events-auto text-[32px] sm:text-[54px] md:text-[68px] lg:text-[84px] font-medium tracking-[-0.045em] text-[#edf3ff] hover:text-white transition-all duration-300 drop-shadow-[0_2px_28px_#030813] hover:drop-shadow-[0_0_24px_rgba(168,207,255,0.6)] cursor-pointer"
            aria-label="Portofolio — Jelajahi Portofolio"
          >
            PORTOFOLIO
          </a>
        </div>

        {/* Sub-caption below Galaxy */}
        <div className="absolute bottom-[20%] sm:bottom-[21%] left-1/2 -translate-x-1/2 w-[90%] max-w-[720px] text-center pointer-events-none">
          <div className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] text-[#b0bfd5] uppercase font-light leading-relaxed">
            MACHINE LEARNING · FULL-STACK WEB & APP · CYBER SECURITY
          </div>
        </div>

        {/* Scroll Cue Pill Button */}
        <div className="absolute bottom-[8%] sm:bottom-[9%] left-1/2 -translate-x-1/2 pointer-events-auto">
          <a
            href="#heroSection"
            onClick={handleScrollToHero}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#aecfff]/25 hover:border-[#aecfff]/60 bg-[#101a2b]/60 hover:bg-[#1d304b]/80 backdrop-blur-md text-[#edf3ff] font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.18em] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)] group cursor-pointer"
          >
            <span>JELAJAHI PORTOFOLIO</span>
            <svg
              className="w-3.5 h-3.5 text-[#afd7f7] group-hover:translate-y-1 transition-transform animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        {/* Bottom Interaction Hint */}
        <div className="absolute bottom-[2%] sm:bottom-[2.5%] w-full text-center pointer-events-none">
          <span className="font-mono text-[8px] sm:text-[8.5px] tracking-[0.2em] text-[#718099] uppercase">
            DRAG UNTUK MEMUTAR · SCROLL UNTUK MASUK
          </span>
        </div>


      </div>
    </div>
  );
}
