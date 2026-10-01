'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function InteractiveEffects() {
  const pathname = usePathname();

  useEffect(() => {
    // Send live visitor telemetry hit to Neon PostgreSQL AuditLog
    if (typeof window !== 'undefined' && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      fetch('/api/telemetry/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    }
  }, [pathname]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // --- 1. COSMIC STARDUST CURSOR TRAIL ---
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let animationFrameId = 0;

    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isTouch) {
      canvas = document.createElement('canvas');
      canvas.id = 'stardustCanvas';
      canvas.style.cssText =
        'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
      document.body.appendChild(canvas);

      ctx = canvas.getContext('2d');
      let w = (canvas.width = window.innerWidth);
      let h = (canvas.height = window.innerHeight);

      const onResize = () => {
        if (!canvas) return;
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', onResize);

      interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        alpha: number;
        decay: number;
      }
      const particles: Particle[] = [];
      const palette = ['#00F0FF', '#FFFFFF', '#A855F7', '#00FFA3', '#FFB800'];

      const onMouseMove = (e: MouseEvent) => {
        if (particles.length < 50) {
          for (let i = 0; i < 2; i++) {
            particles.push({
              x: e.clientX + (Math.random() - 0.5) * 8,
              y: e.clientY + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 - 0.5,
              size: Math.random() * 2.5 + 1,
              color: palette[Math.floor(Math.random() * palette.length)],
              alpha: 1,
              decay: Math.random() * 0.02 + 0.02,
            });
          }
        }
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const renderStardust = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, w, h);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        animationFrameId = requestAnimationFrame(renderStardust);
      };
      animationFrameId = requestAnimationFrame(renderStardust);
    }

    // --- 2. SCROLL REVEAL OBSERVER ---
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );

    const observeAll = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
      revealElements.forEach((el) => observer.observe(el));
    };

    observeAll();
    const t1 = setTimeout(observeAll, 150);
    const t2 = setTimeout(observeAll, 600);

    // --- 3. 3D CARD TILT & GLARE EFFECT ---
    const tiltCards = document.querySelectorAll<HTMLElement>(
      '.card-tilt, .term-card, .editorial-timeline-card, .process-card'
    );

    const cleanups: (() => void)[] = [];
    if (!isTouch) {
      tiltCards.forEach((card) => {
        const handleMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(800px) rotateX(${
            -y * 8
          }deg) rotateY(${x * 8}deg) translateZ(4px)`;
        };

        const handleLeave = () => {
          card.style.transform =
            'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
          card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        };

        const handleEnter = () => {
          card.style.transition = 'none';
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        card.addEventListener('mouseenter', handleEnter);

        cleanups.push(() => {
          card.removeEventListener('mousemove', handleMove);
          card.removeEventListener('mouseleave', handleLeave);
          card.removeEventListener('mouseenter', handleEnter);
        });
      });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      cleanups.forEach((c) => c());
    };
  }, [pathname]);

  return null;
}
