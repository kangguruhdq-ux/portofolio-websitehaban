'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || 'Kredensial login tidak valid.');
      }
    } catch {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-[#070B12]/95 border border-white/[0.1] p-7 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        {/* Top ambient glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-wider text-white">
            ADMIN CMS AUTHENTICATION
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Protected Terminal Session · Production Portal
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Username / Email</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username atau Email"
              required
              autoFocus
              className="w-full bg-[#030508] border border-white/[0.15] focus:border-cyan-400 rounded-lg px-4 py-2.5 text-xs font-mono text-white outline-none transition-all focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Password Session</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#030508] border border-white/[0.15] focus:border-cyan-400 rounded-lg px-4 py-2.5 text-xs font-mono text-white outline-none transition-all focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Enter CMS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security watermark */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] text-center text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>HTTPONLY COOKIE · RATE-LIMITED ACCESS</span>
        </div>
      </div>
    </div>
  );
}
