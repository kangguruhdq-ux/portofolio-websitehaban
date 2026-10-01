'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Terminal, Github, Linkedin, Shield } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          text: '✓ Pesan transmisi berhasil dikirim ke database! Terima kasih telah menghubungi.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          text: data.error || 'Gagal mengirim pesan kontak.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        text: 'Terjadi kesalahan jaringan. Silakan coba kembali nanti.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          // SECURE DISPATCH // CONTACT TRANSMISSION
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Inisiasi Komunikasi & Kolaborasi
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-light">
          Buka saluran komunikasi untuk peluang kerja, konsultasi keamanan siber, atau implementasi model deep learning custom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-5">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Saluran Komunikasi Langsung</span>
            </h2>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#030508] border border-white/[0.06]">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Email Resmi</span>
                  <a href="mailto:misnosusanto97@gmail.com" className="text-white hover:text-cyan-400 transition-colors">
                    misnosusanto97@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#030508] border border-white/[0.06]">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Lokasi Geografis</span>
                  <span className="text-white">Yogyakarta, Indonesia</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#030508] border border-white/[0.06]">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase block">WhatsApp / Kontak Langsung</span>
                  <a
                    href="https://wa.me/6287897305696"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    +62 878-9730-5696
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-slate-300 uppercase">Jaringan Sosial & Kode</h3>
            <a
              href="https://github.com/kangguruhdq-ux"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4 text-cyan-400" />
              <span>github.com/kangguruhdq-ux</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4 text-cyan-400" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4"
          >
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Formulir Pesan Terenkripsi</span>
            </h2>

            {status && (
              <div
                className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2 ${
                  status.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{status.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. name@company.com"
                  className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">Subjek Pesan</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Diskusi Proyek Machine Learning / Rekrutmen"
                className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">Pesan / Brief Proyek</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Jelaskan kebutuhan, ruang lingkup proyek, atau tawaran kolaborasi Anda..."
                className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none resize-y"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 flex items-center gap-2"
              >
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
