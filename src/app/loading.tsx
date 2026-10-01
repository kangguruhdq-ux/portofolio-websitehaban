import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#030508] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-cyan-400 tracking-wider">
          INITIALIZING TELEMETRY...
        </span>
      </div>
    </div>
  );
}
