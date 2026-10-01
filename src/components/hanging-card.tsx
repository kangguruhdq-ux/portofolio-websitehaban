'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, Award, Cpu } from 'lucide-react';

export function HangingCard({
  profile,
}: {
  profile: {
    name: string;
    title: string;
    avatarUrl: string;
    availability: string;
    location: string;
  };
}) {
  const [offset, setOffset] = useState({ x: 0, y: -240, rotate: -10 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number | null>(null);
  const stateRef = useRef({
    x: 0,
    y: -240,
    rotate: -10,
    vx: 0,
    vy: 14,
    vrot: 0,
  });

  // Smooth damped spring animation when released
  const startSpringReturn = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const spring = () => {
      const k = 0.08; // spring tension
      const damping = 0.82; // friction damping

      const fx = -k * stateRef.current.x;
      const fy = -k * stateRef.current.y;
      const frot = -k * stateRef.current.rotate;

      stateRef.current.vx = (stateRef.current.vx + fx) * damping;
      stateRef.current.vy = (stateRef.current.vy + fy) * damping;
      stateRef.current.vrot = (stateRef.current.vrot + frot) * damping;

      stateRef.current.x += stateRef.current.vx;
      stateRef.current.y += stateRef.current.vy;
      stateRef.current.rotate += stateRef.current.vrot;

      setOffset({
        x: stateRef.current.x,
        y: stateRef.current.y,
        rotate: stateRef.current.rotate,
      });

      if (
        Math.abs(stateRef.current.x) > 0.1 ||
        Math.abs(stateRef.current.y) > 0.1 ||
        Math.abs(stateRef.current.vx) > 0.1 ||
        Math.abs(stateRef.current.vy) > 0.1
      ) {
        animRef.current = requestAnimationFrame(spring);
      } else {
        stateRef.current.x = 0;
        stateRef.current.y = 0;
        stateRef.current.rotate = 0;
        setOffset({ x: 0, y: 0, rotate: 0 });
      }
    };

    animRef.current = requestAnimationFrame(spring);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - stateRef.current.x,
      y: e.clientY - stateRef.current.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;

    const clampedX = Math.max(-100, Math.min(100, rawX));
    const clampedY = Math.max(-20, Math.min(90, rawY));
    const rot = clampedX * 0.14;

    stateRef.current.vx = clampedX - stateRef.current.x;
    stateRef.current.vy = clampedY - stateRef.current.y;
    stateRef.current.vrot = rot - stateRef.current.rotate;

    stateRef.current.x = clampedX;
    stateRef.current.y = clampedY;
    stateRef.current.rotate = rot;

    setOffset({ x: clampedX, y: clampedY, rotate: rot });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    startSpringReturn();
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dropped = false;
    const el = containerRef.current;
    if (!el) return;

    // Trigger physical top drop entrance when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !dropped) {
            dropped = true;
            startSpringReturn();
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px 0px 0px 0px' }
    );

    observer.observe(el);

    // Fallback in case observer doesn't fire
    const fallbackTimer = setTimeout(() => {
      if (!dropped) {
        dropped = true;
        startSpringReturn();
      }
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto select-none pt-24 pb-4"
    >
      {/* Upward Lanyard Suspension Cord (Matches reference media_1790837641416.png) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-24 bg-gradient-to-b from-transparent via-[#00F0FF]/40 to-[#00F0FF] border-l-2 border-dashed border-[#00F0FF]/60 pointer-events-none z-10" />

      {/* Top Anchor Pin / Glowing Cyan Eyelet Grommet */}
      <div className="flex flex-col items-center relative z-20">
        <div className="w-5 h-5 rounded-full border-2 border-[#00F0FF] bg-[#050811] shadow-[0_0_16px_rgba(0,240,255,0.9)] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]/40" />
        </div>

        {/* Dynamic Vector Lanyard Line */}
        <svg
          className="w-12 h-10 overflow-visible -mt-0.5 pointer-events-none"
          viewBox="0 0 48 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="24"
            y1="0"
            x2={24 + offset.x * 0.75}
            y2={40 + offset.y}
            stroke="url(#hangingLanyardGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="0"
            x2={24 + offset.x * 0.75}
            y2={40 + offset.y}
            stroke="rgba(0, 240, 255, 0.45)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="hangingLanyardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="50%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hanging Badge Card Assembly */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0px) rotate(${offset.rotate}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        className="relative -mt-2 rounded-[28px] bg-[#070B14]/95 border border-cyan-500/25 p-6 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(0,240,255,0.08)] backdrop-blur-2xl transition-shadow duration-300 hover:border-cyan-400/50 hover:shadow-[0_28px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(0,240,255,0.18)]"
      >
        {/* Clip Badge Slot Punch */}
        <div className="w-14 h-3.5 rounded-full bg-[#03060C] border border-white/[0.12] mx-auto mb-5 shadow-inner" />

        {/* Ambient Top Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Avatar with Glowing Trilinear Gradient Ring */}
        <div className="relative w-32 h-32 mx-auto rounded-full p-[3px] bg-gradient-to-tr from-[#00F0FF] via-[#A855F7] to-[#00FFA3] mb-5 shadow-[0_0_30px_rgba(0,240,255,0.35)]">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-950">
            <Image
              src={profile.avatarUrl || '/images/profile.jpg'}
              alt={profile.name}
              fill
              sizes="130px"
              className="object-cover"
              priority
            />
          </div>
          {/* Cyber Shield Badge */}
          <div className="absolute bottom-0.5 right-0.5 p-1.5 rounded-full bg-[#040812] border-2 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.5)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Identity Details */}
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight leading-snug">
            {profile.name}
          </h3>
          <p className="text-xs sm:text-[13px] font-mono font-bold text-[#00F0FF] tracking-wider uppercase">
            AI ENGINEER · CYBER SEC · FULL-STACK
          </p>
          <div className="pt-1 flex items-center justify-center gap-2 text-[11px] font-mono font-semibold text-[#00FFA3]">
            <span className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3] animate-pulse" />
            <span>ACTIVE // SECURITY CLEARANCE 01</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-white/[0.08]" />

        {/* Credentials Pill List */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="py-2.5 px-3 rounded-xl bg-[#04060C] border border-white/[0.08] hover:border-cyan-500/30 transition-colors flex items-center justify-center gap-2 font-mono text-[11px] font-bold text-white shadow-inner">
            <Award className="w-4 h-4 text-[#00F0FF] flex-shrink-0" />
            <span className="truncate">CBBH CERTIFIED</span>
          </div>
          <div className="py-2.5 px-3 rounded-xl bg-[#04060C] border border-white/[0.08] hover:border-purple-500/30 transition-colors flex items-center justify-center gap-2 font-mono text-[11px] font-bold text-white shadow-inner">
            <Cpu className="w-4 h-4 text-[#A855F7] flex-shrink-0" />
            <span className="truncate">DEEP LEARNING</span>
          </div>
        </div>

        {/* Bottom Tactile Drag Hint */}
        <div className="mt-5 text-center text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">
          [TARIK / GESER KARTU INTERAKTIF]
        </div>
      </div>
    </div>
  );
}
