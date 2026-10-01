'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minus, Sparkles, Send, CornerDownLeft } from 'lucide-react';

interface TerminalCommandItem {
  id: string;
  command: string;
  description: string | null;
  response: string;
  category: string;
}

interface HistoryItem {
  type: 'cmd' | 'output' | 'error' | 'system';
  text: string;
}

export function CyberTerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'system', text: 'ASTRA CYBER OS v3.2 [Interactive Termux Terminal]' },
    { type: 'system', text: 'Ketik "help" untuk melihat perintah yang tersedia, atau klik tombol cepat di bawah.' },
  ]);
  const [customCommands, setCustomCommands] = useState<TerminalCommandItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCustomCommands();
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-terminal', handleOpen);
    return () => window.removeEventListener('open-terminal', handleOpen);
  }, []);

  const fetchCustomCommands = async () => {
    try {
      const res = await fetch('/api/terminal');
      const data = await res.json();
      if (res.ok && data.commands) {
        setCustomCommands(data.commands);
      }
    } catch {
      // Fallback silently if offline
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [isOpen, history]);

  const executeCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    const newHistory: HistoryItem[] = [...history, { type: 'cmd', text: `$ ${cmd}` }];
    const lower = cmd.toLowerCase();

    // Check custom commands from DB first
    const matchedCustom = customCommands.find((c) => c.command.toLowerCase() === lower);

    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (matchedCustom) {
      newHistory.push({ type: 'output', text: matchedCustom.response });
    } else if (lower === 'whoami') {
      newHistory.push({
        type: 'output',
        text: 'Mahabbah Mahabban Romadhon\nDomain: Machine Learning Practitioner · Full-Stack Web/App · Cyber Security Analyst\nSertifikasi: HTB Certified Bug Bounty Hunter (CBBH) & Deep Learning Specialization\nStatus: SECURITY CLEARANCE LEVEL 01 · ACTIVE',
      });
    } else if (lower === 'skills') {
      newHistory.push({
        type: 'output',
        text: 'CORE COMPETENCIES:\n• AI / ML: PyTorch, YOLOv8, CNNs, CUDA, TensorRT, OpenCV\n• Web & App: Next.js 14, React, TypeScript, PHP/Laravel, Tailwind CSS\n• Cyber Security: Web App Pentesting, Bug Bounty (CBBH), OSINT Threat Recon\n• Jaringan: Splicing Fiber Optik, MikroTik, Cisco Packet Tracer\n• 3D & Creative: Three.js, Source Filmmaker (SFM), Prisma3D',
      });
    } else if (lower === 'projects') {
      newHistory.push({
        type: 'output',
        text: 'PROYEK UTAMA TERPUBLIKASI:\n1. Real-Time APD Safety Detection (YOLOv8 + CUDA)\n2. OSINT Cyber Threat Intelligence Dashboard (Python + Shodan)\n3. Photobooth Event Automation (Webcam + Thermal Print)\n4. Web-Based Pacman Game Engine (Vanilla JS Canvas)\n5. Earth 3D Simulation (Three.js WebGL)\nKetik "goto work" untuk menuju bagian portofolio.',
      });
    } else if (lower === 'contact') {
      newHistory.push({
        type: 'output',
        text: 'KONTAK RESMI:\n• Email: misnosusanto97@gmail.com\n• GitHub: https://github.com/kangguruhdq-ux\n• Lokasi: Yogyakarta, Indonesia [7.7956° S, 110.3695° E]',
      });
    } else if (lower === 'sudo hire-me' || lower === 'hire' || lower === 'hire-me') {
      newHistory.push({
        type: 'system',
        text: '[sudo] mengautentikasi izin tamu...\n[OK] CLEARANCE GRANTED // Mengalihkan ke formulir komunikasi...',
      });
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    } else if (lower === 'goto work' || lower === 'work') {
      newHistory.push({ type: 'system', text: 'Navigasi ke Sector 05 (Portofolio Proyek)...' });
      setTimeout(() => {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else if (lower === 'help') {
      const dbCmdNames = customCommands.map((c) => c.command);
      const allCmds = Array.from(
        new Set(['whoami', 'skills', 'projects', 'contact', 'sudo hire-me', 'goto work', 'clear', 'help', ...dbCmdNames])
      );
      newHistory.push({
        type: 'output',
        text: `DAFTAR PERINTAH TERSEDIA:\n${allCmds.map((c) => `  · ${c}`).join('\n')}\n\nTips: Klik salah satu tombol cepat di bawah untuk mengeksekusi langsung.`,
      });
    } else {
      newHistory.push({
        type: 'error',
        text: `command not found: "${cmd}" — ketik "help" untuk melihat perintah yang tersedia.`,
      });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  return (
    <>
      {/* Floating Cyber Terminal Launcher Button (Matches media_1790839770851.png) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Buka Termux Cyber Terminal"
          title="Buka Interactive CLI Terminal"
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#080E1B]/90 border border-cyan-400/60 hover:border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.65)] backdrop-blur-xl flex items-center justify-center font-mono font-bold hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
        >
          <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 select-none group-hover:scale-110 transition-transform">
            &gt;_
          </span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3] animate-pulse" />
        </button>
      )}

      {/* Cyber Terminal Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          {/* Modal Container */}
          <div className="relative z-10 w-full sm:max-w-xl h-[520px] max-h-[85vh] bg-[#050811]/95 border-t sm:border border-cyan-500/40 sm:rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,240,255,0.2)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Header bar */}
            <div className="bg-[#080D1A] border-b border-cyan-500/20 px-4 py-2.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>terminal@mahabbah-linux:~$</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 font-semibold hidden sm:inline-block">
                  ● PORT:443 ONLINE
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Output screen */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-xs leading-relaxed selection:bg-cyan-500/30 select-text"
            >
              {history.map((item, idx) => {
                if (item.type === 'cmd') {
                  return (
                    <div key={idx} className="text-cyan-300 font-bold flex items-center gap-1">
                      <span>{item.text}</span>
                    </div>
                  );
                }
                if (item.type === 'system') {
                  return (
                    <div key={idx} className="text-slate-400 text-[11px] italic">
                      {item.text}
                    </div>
                  );
                }
                if (item.type === 'error') {
                  return (
                    <div key={idx} className="text-rose-400">
                      {item.text}
                    </div>
                  );
                }
                return (
                  <div key={idx} className="text-emerald-300 whitespace-pre-wrap">
                    {item.text}
                  </div>
                );
              })}
            </div>

            {/* Quick Command Suggestions Pill Row */}
            <div className="px-3 py-2 bg-[#060914] border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] font-mono">
              <span className="text-slate-500 text-[10px] uppercase font-bold pr-1">Aksi:</span>
              {['whoami', 'skills', 'projects', 'contact', 'sudo hire-me', 'clear', 'help'].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  className="px-2.5 py-1 rounded bg-white/[0.05] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Command Input Prompt Bar */}
            <div className="bg-[#03060C] border-t border-cyan-500/30 p-3 flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 font-bold flex-shrink-0">
                guest@mahabbah:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ketik perintah (misal: whoami)..."
                className="flex-1 bg-transparent border-none text-xs font-mono text-white outline-none focus:ring-0 placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => executeCommand(inputVal)}
                className="p-1.5 rounded-lg bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all font-mono text-xs flex items-center justify-center"
                title="Kirim Perintah"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
