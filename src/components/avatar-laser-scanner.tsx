'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export function AvatarLaserScanner({
  humanPhoto = '/images/profile.jpg',
  robotPhoto = '/images/avatar-robot.jpg',
}: {
  humanPhoto?: string;
  robotPhoto?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0.5);
  const [isInteracting, setIsInteracting] = useState(false);
  const [status, setStatus] = useState('HYBRID-SYNC');
  const [shockwaveActive, setShockwaveActive] = useState(false);

  const targetPercentRef = useRef(0.5);
  const currentPercentRef = useRef(0.5);
  const lastInteractionRef = useRef(Date.now());
  const autoAngleRef = useRef(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    let frameId = 0;
    let isVisible = true;
    let observer: IntersectionObserver | null = null;

    const renderLoop = () => {
      const now = Date.now();
      if (!isDraggingRef.current && now - lastInteractionRef.current > 3000) {
        autoAngleRef.current += 0.024;
        targetPercentRef.current = 0.5 + Math.sin(autoAngleRef.current) * 0.35;
      }

      const ease = isDraggingRef.current ? 0.28 : 0.12;
      currentPercentRef.current += (targetPercentRef.current - currentPercentRef.current) * ease;
      const pct = Math.max(0, Math.min(1, currentPercentRef.current));
      setPercent(pct);

      const humanPct = Math.round(pct * 100);
      if (humanPct > 80) setStatus('BIO-PRIMARY');
      else if (humanPct < 20) setStatus('CYBER-ACTIVE');
      else setStatus('HYBRID-SYNC');

      if (isVisible) {
        frameId = requestAnimationFrame(renderLoop);
      }
    };

    if (typeof IntersectionObserver !== 'undefined' && viewportRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              cancelAnimationFrame(frameId);
              frameId = requestAnimationFrame(renderLoop);
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(viewportRef.current);
    } else {
      frameId = requestAnimationFrame(renderLoop);
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (observer) observer.disconnect();
    };
  }, []);

  const updateFromClientX = (clientX: number) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    targetPercentRef.current = clampedX / rect.width;
    lastInteractionRef.current = Date.now();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    updateFromClientX(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsInteracting(false);
    lastInteractionRef.current = Date.now();
  };

  const triggerShockwave = () => {
    setShockwaveActive(true);
    setTimeout(() => setShockwaveActive(false), 800);
  };

  const pct100 = (percent * 100).toFixed(1);
  const humanScore = Math.round(percent * 100);
  const cyberScore = Math.round((1 - percent) * 100);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[340px] mx-auto select-none">
      {/* Laser Scanner Cyber HUD Enclosure */}
      <div className="relative w-full rounded-3xl bg-[#090D17]/90 border border-cyan-500/25 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(0,240,255,0.08)] backdrop-blur-xl">
        {/* Corner HUD Markers */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br" />

        {/* Top Header Readout */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08] font-mono text-[10px] text-slate-400 tracking-wider">
          <span>SPEC // NEURAL-OPTICAL</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{status}</span>
          </span>
        </div>

        {/* Circular Dual-Layer Scanner Viewport */}
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.8)] cursor-ew-resize touch-none group"
        >
          {/* Base Layer: Human Portrait */}
          <div className="absolute inset-0 w-full h-full bg-slate-950">
            <Image
              src={humanPhoto}
              alt="Human Portrait"
              fill
              sizes="240px"
              priority
              className="object-cover"
            />
          </div>

          {/* Top Layer: Cybernetic Robot (Polygon Clipped) */}
          <div
            style={{
              clipPath: `polygon(${pct100}% 0%, 100% 0%, 100% 100%, ${pct100}% 100%)`,
            }}
            className="absolute inset-0 w-full h-full bg-slate-950 transition-none"
          >
            <Image
              src={robotPhoto}
              alt="Cybernetic Avatar"
              fill
              sizes="240px"
              priority
              className="object-cover"
            />
          </div>

          {/* High Energy Glowing Laser Dividing Line */}
          <div
            style={{ left: `${pct100}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_15px_#00f0ff,0_0_30px_#a855f7] pointer-events-none transition-none z-10 -translate-x-1/2 flex items-center justify-center"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#00f0ff] backdrop-blur-sm">
              <span className="text-[8px] font-mono text-cyan-300 font-bold">⇄</span>
            </div>
          </div>
        </div>

        {/* Real-Time Bio / Neural Telemetry Readout */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
          <div>
            <span className="text-slate-400 block">BIO-HUMAN</span>
            <span className="text-white font-bold">{humanScore}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">FREQ</span>
            <span className="text-cyan-400 font-bold">1420MHz</span>
          </div>
          <div>
            <span className="text-slate-400 block">NEURAL-CYBER</span>
            <span className="text-purple-400 font-bold">{cyberScore}%</span>
          </div>
        </div>

        {/* Drag Hint */}
        <div className="mt-3 text-center text-[9px] font-mono text-slate-400 tracking-wider">
          ◄ USAP / TARIK UNTUK CYBER SCAN ►
        </div>
      </div>

      {/* 3D Holographic Cyber Core Module */}
      <div
        onClick={triggerShockwave}
        className="w-full rounded-2xl bg-[#070B12]/80 border border-white/[0.08] hover:border-cyan-400/40 p-3.5 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
      >
        {shockwaveActive && (
          <div className="absolute inset-0 bg-cyan-400/20 animate-ping rounded-2xl pointer-events-none" />
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:rotate-45 transition-transform duration-500">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              QUANTUM CORE // 3D HARMONIC NODE
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              KLIK CORE UNTUK GELOMBANG KEJUT
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
          ONLINE
        </span>
      </div>
    </div>
  );
}
