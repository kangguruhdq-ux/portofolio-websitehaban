'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { ProjectSimulatorModal } from '@/components/project-simulator-modal';

export function ProjectDetailInteractive({ simulatorKey }: { simulatorKey: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Jalankan Live Simulator</span>
      </button>

      {isOpen && (
        <ProjectSimulatorModal
          simulatorKey={simulatorKey}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
