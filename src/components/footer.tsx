import React from 'react';
import { Terminal, Shield, ArrowUpRight, Github, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#030508]/90 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-white font-mono text-sm font-bold tracking-wider">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>MAHABBAH MAHABBAN ROMADHON</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Machine Learning (Computer Vision) · CBBH Cyber Security · Full-Stack Web Development.
          </p>
        </div>

        {/* Telemetry pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>POSTGRESQL // ORM PRODUCTION [OK]</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <a
            href="https://github.com/kangguruhdq-ux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.04] text-center text-[11px] font-mono text-slate-500">
        © {new Date().getFullYear()} Mahabbah Mahabban Romadhon — Engineered with craftsmanship & anti-slop principles.
      </div>
    </footer>
  );
}
