'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TechItem {
  id: string;
  name: string;
  logo: string;
  category: string;
}

const TECH_ITEMS: TechItem[] = [
  { id: 'html', name: 'HTML', logo: '/images/tech/html.svg', category: 'Frontend' },
  { id: 'css', name: 'CSS', logo: '/images/tech/css.svg', category: 'Frontend' },
  { id: 'javascript', name: 'JavaScript', logo: '/images/tech/javascript.svg', category: 'Language' },
  { id: 'tailwind', name: 'Tailwind CSS', logo: '/images/tech/tailwind.svg', category: 'Styling' },
  { id: 'react', name: 'ReactJS', logo: '/images/tech/reactjs.svg', category: 'Frontend' },
  { id: 'vite', name: 'Vite', logo: '/images/tech/vite.svg', category: 'Tooling' },
  { id: 'node', name: 'Node JS', logo: '/images/tech/nodejs.svg', category: 'Backend' },
  { id: 'bootstrap', name: 'Bootstrap', logo: '/images/tech/bootstrap.svg', category: 'Styling' },
  { id: 'supabase', name: 'Supabase', logo: '/images/tech/supabase.svg', category: 'Backend' },
  { id: 'mui', name: 'Material UI', logo: '/images/tech/MUI.svg', category: 'UI Kit' },
  { id: 'vercel', name: 'Vercel', logo: '/images/tech/vercel.svg', category: 'Cloud' },
  { id: 'figma', name: 'Figma', logo: '/images/tech/figma.svg', category: 'Design' },
  { id: 'python', name: 'Python', logo: '/images/tech/python.svg', category: 'AI/Backend' },
  { id: 'sfm', name: 'Source Filmmaker', logo: '/images/tech/sfm.svg', category: '3D/VFX' },
  { id: 'prisma3d', name: 'Prisma3D', logo: '/images/tech/prisma3d.svg', category: 'Mobile 3D' },
];

export function TechStackFilter({
  items,
  onSelectTech,
}: {
  items?: TechItem[];
  onSelectTech?: (techId: string) => void;
}) {
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const displayItems = items && items.length > 0 ? items : TECH_ITEMS;

  const handleClick = (tech: TechItem) => {
    const next = activeTech === tech.id ? null : tech.id;
    setActiveTech(next);
    if (onSelectTech) onSelectTech(next || '');
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-3 sm:gap-4">
        {displayItems.map((item) => {
          const isActive = activeTech === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-2.5 text-center group relative overflow-hidden cursor-pointer select-none ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.35)] scale-105'
                  : 'bg-[#070B12]/80 border-white/[0.08] hover:border-cyan-400/40 text-slate-300 hover:text-white hover:bg-[#0D131F] hover:-translate-y-1'
              }`}
            >
              <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center">
                <Image
                  src={item.logo}
                  alt=""
                  aria-hidden="true"
                  width={36}
                  height={36}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-[11px] sm:text-xs font-bold leading-tight truncate">
                  {item.name}
                </span>
                <span className="text-[9px] font-mono text-slate-500 hidden sm:block">
                  {item.category}
                </span>
              </div>

              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              )}
            </button>
          );
        })}
      </div>

      {activeTech && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 font-mono text-xs text-cyan-300">
          <span>Filter aktif: <strong>{TECH_ITEMS.find((t) => t.id === activeTech)?.name}</strong></span>
          <button
            onClick={() => setActiveTech(null)}
            className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
