'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030508] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#070B12] border border-white/[0.08] text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <Terminal className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest">
            ERROR 404 // ORBITAL TARGET NOT FOUND
          </div>
          <h1 className="text-2xl font-bold text-white">Rute Tidak Ditemukan</h1>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            Halaman atau entitas yang Anda minta tidak berada dalam koordinat sistem portofolio ini.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Gateway Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
