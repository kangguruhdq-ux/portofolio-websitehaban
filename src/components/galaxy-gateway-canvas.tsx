'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function GalaxyGatewayCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId: number = 0;
    let lastTime = 0;
    let elapsed = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

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
        float glow = exp(-d * d * 5.5) * (1.0 - smoothstep(0.55, 1.0, d));
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

      const layerUniforms = { ...uniforms, uOpacity: { value: kind === 'mist' ? 0.055 : 0.85 } };
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

    const isCompact = width < 768;
    particleLayer(isCompact ? 16000 : 32000, 'dust');
    particleLayer(isCompact ? 800 : 1600, 'mist');
    particleLayer(isCompact ? 1600 : 3200, 'bulge');
    particleLayer(isCompact ? 160 : 320, 'nebula');
    particleLayer(isCompact ? 400 : 800, 'background');

    // Central luminous core
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureCanvas.height = 128;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, '#fffaf2');
      gradient.addColorStop(0.08, '#fff0dbe6');
      gradient.addColorStop(0.22, '#ffd1a066');
      gradient.addColorStop(0.5, '#88baff18');
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
      opacity: 0.9,
    });
    const core = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), coreMaterial);
    core.rotation.x = -Math.PI / 2;
    core.scale.set(isCompact ? 32 : 22, isCompact ? 13 : 8, 1);
    root.add(core);

    let distance = 95;
    function resize() {
      if (!renderer || !canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const isMobile = width < 768;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);
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

      const mobileBoost = isMobile ? 1.45 : 1.0;
      uniforms.uPixelScale.value = (height * pixelRatio) / (2 * Math.tan((camera.fov * Math.PI) / 360)) * mobileBoost;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let autoTurn = 0;
    function animate(now: number) {
      if (!renderer) return;
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;

      if (!prefersReducedMotion) {
        elapsed += dt;
        autoTurn = (autoTurn + dt * 0.014) % (Math.PI * 2);
        root.rotation.y = autoTurn;
        const pulse = 1 + Math.sin(elapsed * 0.7) * 0.025;
        const isMobile = width < 768;
        core.scale.set((isMobile ? 32 : 22) * pulse, (isMobile ? 13 : 8) * pulse, 1);
      }

      uniforms.uTime.value = elapsed;
      const camY = distance * (width < 768 ? 0.28 : 0.24);
      camera.position.set(0, camY, distance);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
