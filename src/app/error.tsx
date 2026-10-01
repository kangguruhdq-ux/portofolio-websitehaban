'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030508] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#070B12] border border-rose-500/30 text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest">
            ERROR 500 // RUNTIME EXCEPTION DETECTED
          </div>
          <h1 className="text-2xl font-bold text-white">Terjadi Kendala Sistem</h1>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            {error.message || 'Sistem mendeteksi anomali pada siklus render.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Ulang</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-mono text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
