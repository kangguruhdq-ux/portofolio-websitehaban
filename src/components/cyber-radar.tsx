'use client';

import React, { useEffect, useRef } from 'react';

export function CyberRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = 240);
    const h = (canvas.height = 240);
    const cx = w / 2;
    const cy = h / 2;
    const radius = 100;
    let angle = 0;
    let frameId = 0;

    const blips = [
      { r: 35, a: 0.8, life: 1, label: 'CV:YOLO' },
      { r: 68, a: 2.3, life: 1, label: 'PPE_OK' },
      { r: 85, a: 4.1, life: 1, label: 'TLS:443' },
      { r: 52, a: 5.2, life: 1, label: 'CBBH_SEC' },
    ];

    function renderRadar() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // 1. Radar circles
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1;
      [30, 60, 90, 100].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 2. Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // 3. Sweep line with gradient trail
      angle += 0.035;
      const sweepEnd = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      };

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
      blips.forEach((b) => {
        const bx = cx + Math.cos(b.a) * b.r;
        const by = cy + Math.sin(b.a) * b.r;

        const diff = (angle % (Math.PI * 2)) - (b.a % (Math.PI * 2));
        if (Math.abs(diff) < 0.1) b.life = 1.0;
        else b.life = Math.max(0.2, b.life - 0.008);

        ctx.fillStyle = `rgba(0, 255, 163, ${b.life})`;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();

        if (b.life > 0.6) {
          ctx.font = '9px monospace';
          ctx.fillStyle = '#00F0FF';
          ctx.fillText(b.label, bx + 6, by - 4);
        }
      });

      if (isVisible) {
        frameId = requestAnimationFrame(renderRadar);
      }
    }

    let isVisible = true;
    let observer: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== 'undefined' && canvas) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              cancelAnimationFrame(frameId);
              frameId = requestAnimationFrame(renderRadar);
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    } else {
      frameId = requestAnimationFrame(renderRadar);
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full rounded-2xl bg-[#070B12]/90 border border-white/[0.08] p-5 flex flex-col items-center gap-4 shadow-xl">
      <div className="w-full flex items-center justify-between font-mono text-[11px] pb-3 border-b border-white/[0.06]">
        <span className="text-cyan-400 font-bold">SENTINEL // 360° CYBER RADAR</span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>HARDENED</span>
        </span>
      </div>

      <div className="relative w-[240px] h-[240px] flex items-center justify-center">
        <canvas ref={canvasRef} width={240} height={240} className="w-[240px] h-[240px]" />
      </div>

      <div className="w-full pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center font-mono text-[10.5px]">
        <div>
          <span className="text-slate-400 block text-[9.5px]">PERIMETER:</span>
          <strong className="text-white">HTB CBBH</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[9.5px]">TRAFFIC:</span>
          <strong className="text-cyan-400">1,842 PKT/S</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[9.5px]">THREATS:</span>
          <strong className="text-emerald-400">0 ALERTS [A+]</strong>
        </div>
      </div>
    </div>
  );
}
