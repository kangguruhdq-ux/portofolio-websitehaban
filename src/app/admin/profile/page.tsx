'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { FileUploader } from '@/components/admin/file-uploader';
import { Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/profile');
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
      }
    } catch {
      setMessage({ text: 'Gagal memuat profil', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !profile) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: '✓ Profil berhasil diperbarui dan disimpan ke PostgreSQL!', type: 'success' });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: data.error || 'Gagal menyimpan profil', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan saat menyimpan', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Kelola Profil Profesional" />
        <div className="p-12 text-center text-xs font-mono text-cyan-400">
          Loading profile telemetry from Neon PostgreSQL...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Kelola Profil Profesional" />

      {message && (
        <div
          className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={profile?.name || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Professional Title / Headline</label>
            <input
              type="text"
              name="title"
              value={profile?.title || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Kicker Eyebrow</label>
            <input
              type="text"
              name="kicker"
              value={profile?.kicker || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Status Availability</label>
            <input
              type="text"
              name="availability"
              value={profile?.availability || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <FileUploader
            label="Avatar Photo Profil"
            value={profile?.avatarUrl || ''}
            onChange={(url) => setProfile((prev: any) => ({ ...prev, avatarUrl: url }))}
            helpText="Foto profil utama pengunjung"
          />

          <FileUploader
            label="Hero / Robot 3D Asset Image"
            value={profile?.heroImageUrl || ''}
            onChange={(url) => setProfile((prev: any) => ({ ...prev, heroImageUrl: url }))}
            helpText="Foto scanner cybernetic"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Email Kontak</label>
            <input
              type="email"
              name="email"
              value={profile?.email || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Lokasi</label>
            <input
              type="text"
              name="location"
              value={profile?.location || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <FileUploader
            label="Dokumen Resume / CV (PDF)"
            value={profile?.resumeUrl || ''}
            accept="application/pdf,.pdf"
            placeholder="/CV_Mahabbah_Mahabban_Romadhon.pdf"
            onChange={(url) => setProfile((prev: any) => ({ ...prev, resumeUrl: url }))}
            helpText="Dokumen CV untuk unduhan publik"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={profile?.githubUrl || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Short Bio (Headline Summary)</label>
          <textarea
            name="shortBio"
            rows={2}
            value={profile?.shortBio || ''}
            onChange={handleChange}
            required
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Full Bio (Dossier Profil)</label>
          <textarea
            name="bio"
            rows={6}
            value={profile?.bio || ''}
            onChange={handleChange}
            required
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none resize-y leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan ke Database...' : 'Simpan Perubahan Profil'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
