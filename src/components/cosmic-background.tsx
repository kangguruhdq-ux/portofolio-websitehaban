'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isNarrow = window.innerWidth < 640;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let contextOk = true;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.2;

    // Starfields
    function createStarfield(count: number, spread: number, size: number, color: number) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Points(geo, mat);
    }

    const starsDistant = createStarfield(isNarrow ? 350 : 800, 48, 0.024, 0xd4e4ff);
    const starsMid = createStarfield(isNarrow ? 150 : 350, 32, 0.038, 0x00f0ff);
    const nebulaDust = createStarfield(isNarrow ? 100 : 250, 24, 0.045, 0x8b5cf6);
    scene.add(starsDistant, starsMid, nebulaDust);

    // Shooting Stars / Meteors
    interface Meteor {
      points: THREE.Points;
      geo: THREE.BufferGeometry;
      mat: THREE.PointsMaterial;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
    }
    const meteors: Meteor[] = [];

    function spawnMeteor() {
      if (prefersReducedMotion || !contextOk) return;
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

      const palette = [0x00f0ff, 0xffffff, 0xffb800, 0xa855f7, 0x00ffa3];
      const chosenColor = palette[Math.floor(Math.random() * palette.length)];

      const mat = new THREE.PointsMaterial({
        size: 0.052,
        color: chosenColor,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const dir = Math.random() > 0.25 ? -1 : 1;
      meteors.push({
        points,
        geo,
        mat,
        vx: dir * (4.2 + Math.random() * 2.8),
        vy: -3.4 - Math.random() * 2.6,
        vz: -0.6,
        life: 0,
        maxLife: 0.95,
      });
    }

    let meteorTimeout: NodeJS.Timeout;
    function scheduleMeteors() {
      const delay = 2400 + Math.random() * 1400;
      meteorTimeout = setTimeout(() => {
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

    // Mouse Parallax
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - halfW) * 0.0003;
      mouseY = (e.clientY - halfH) * 0.0003;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize
    const handleResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
      const dt = clock.getDelta();

      if (!prefersReducedMotion) {
        starsDistant.rotation.y += 0.0002;
        starsMid.rotation.y += 0.0004;
        nebulaDust.rotation.y -= 0.0003;

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        camera.position.x = targetX;
        camera.position.y = -targetY;

        // Update Meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life += dt;
          const pos = m.geo.attributes.position.array as Float32Array;

          for (let p = pos.length - 3; p >= 3; p -= 3) {
            pos[p] = pos[p - 3];
            pos[p + 1] = pos[p - 2];
            pos[p + 2] = pos[p - 1];
          }

          pos[0] += m.vx * dt;
          pos[1] += m.vy * dt;
          pos[2] += m.vz * dt;
          m.geo.attributes.position.needsUpdate = true;

          const progress = m.life / m.maxLife;
          m.mat.opacity = Math.max(0, 1 - progress);

          if (m.life >= m.maxLife) {
            scene.remove(m.points);
            m.geo.dispose();
            m.mat.dispose();
            meteors.splice(i, 1);
          }
        }
      }

      if (renderer) renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(meteorTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      meteors.forEach((m) => {
        scene.remove(m.points);
        m.geo.dispose();
        m.mat.dispose();
      });
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-75"
      aria-hidden="true"
    />
  );
}
