'use client';

import React, { useState } from 'react';
import { Send, Shield, Terminal, CheckCircle2, User, Clock } from 'lucide-react';

interface VisitorLogItem {
  id: string;
  author: string;
  role: string;
  message: string;
  createdAt: string | Date;
}

export function VisitorLogsSection({ initialLogs }: { initialLogs: VisitorLogItem[] }) {
  const [logs, setLogs] = useState<VisitorLogItem[]>(initialLogs);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('VISITOR');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusHint, setStatusHint] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchLatestLogs = async () => {
      try {
        const res = await fetch('/api/comments', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      } catch {
        // keep initialLogs
      }
    };
    fetchLatestLogs();
  }, []);

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'SECURITY':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'DEVELOPER':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'RECRUITER':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CLIENT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setStatusHint(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author.trim(), role, message: message.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLogs([data.log, ...logs]);
        setAuthor('');
        setMessage('');
        setStatusHint('✓ Transmisi log berhasil disimpan ke PostgreSQL!');
        setTimeout(() => setStatusHint(null), 4000);
      } else {
        setStatusHint(data.error || 'Gagal mengirim pesan log.');
      }
    } catch {
      setStatusHint('Terjadi kesalahan jaringan saat mengirim transmisi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#070B12]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="px-5 py-3.5 bg-[#090E17] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 font-mono text-xs text-slate-400">
            guest@mahabbah:~$ ./visitor_transmission.sh --stream
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{logs.length} TRANSMISSIONS ACTIVE</span>
        </div>
      </div>

      {/* Submission Form */}
      <div className="p-5 sm:p-7 border-b border-white/[0.08] bg-[#05070D]/60">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="logAuthor" className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                Pengirim // Nama / Alias
              </label>
              <input
                id="logAuthor"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama Anda (contoh: Alex / Recruiter)..."
                required
                maxLength={40}
                className="w-full bg-[#030508] border border-cyan-500/25 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none transition-all focus:ring-1 focus:ring-cyan-400/50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="logRole" className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                Role / Peran
              </label>
              <select
                id="logRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#030508] border border-cyan-500/25 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none cursor-pointer"
              >
                <option value="RECRUITER">RECRUITER</option>
                <option value="DEVELOPER">DEVELOPER</option>
                <option value="SECURITY">CYBER SEC</option>
                <option value="CLIENT">CLIENT / PARTNER</option>
                <option value="VISITOR">VISITOR</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="logMessage" className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
              Log Pesan // Masukan Portofolio
            </label>
            <textarea
              id="logMessage"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ulasan, diskusi proyek, atau feedback untuk Mahabbah..."
              required
              maxLength={500}
              className="w-full bg-[#030508] border border-cyan-500/25 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none resize-y transition-all focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] font-mono text-slate-400">
              {statusHint || 'Ketik pesan dan kirim langsung tanpa perlu login.'}
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 self-end sm:self-auto"
            >
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan Log'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Stream List (Clean, Scrollable, No Clipping) */}
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08] text-[11px] font-mono text-slate-400">
          <span>TRANSMISSION STREAM // LOG PENGUNJUNG TERVERIFIKASI</span>
          <span className="text-cyan-400">PERSISTENT DB [OK]</span>
        </div>

        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {logs.map((item) => {
            const initials = item.author.slice(0, 2).toUpperCase();
            const dateText =
              typeof item.createdAt === 'string'
                ? item.createdAt
                : new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#090D17] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col gap-2.5 flex-shrink-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">{item.author}</span>
                      <span
                        className={`text-[9.5px] font-mono px-2 py-0.5 rounded border self-start mt-0.5 ${getRoleBadge(
                          item.role
                        )}`}
                      >
                        // {item.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap pt-1">
                    {dateText}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-wrap pl-11">
                  {item.message}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Scroll Hint */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="text-cyan-400 flex items-center gap-1">
            <span>↓</span> GULIR KE BAWAH UNTUK MELIHAT SEMUA LOG
          </span>
          <span>BUFFER STREAM ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
