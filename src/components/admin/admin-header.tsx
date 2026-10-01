'use client';

import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';

export function AdminHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#070B12]/80 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-mono uppercase">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {action}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>ADMIN AUTHENTICATED</span>
        </div>
      </div>
    </header>
  );
}
