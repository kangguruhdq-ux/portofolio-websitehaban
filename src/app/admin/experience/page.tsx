'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Trash2, Edit3, Briefcase, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { FileUploader } from '@/components/admin/file-uploader';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/admin/experience');
      const data = await res.json();
      if (res.ok && data.experiences) setExperiences(data.experiences);
    } catch {
      setMessage({ text: 'Gagal memuat pengalaman', type: 'error' });
    }
  };

  const handleStartEdit = (exp: any) => {
    setEditingId(exp.id);
    setCompany(exp.company || '');
    setRole(exp.role || '');
    setStartDate(exp.startDate || '');
    setEndDate(exp.endDate || '');
    setCurrent(Boolean(exp.current));
    setDescription(exp.description || '');
    setLocation(exp.location || '');
    setLogo(exp.logo || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCompany('');
    setRole('');
    setStartDate('');
    setEndDate('');
    setCurrent(false);
    setDescription('');
    setLocation('');
    setLogo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate.trim() || !description.trim()) return;

    const payload = {
      company: company.trim(),
      role: role.trim(),
      startDate: startDate.trim(),
      endDate: current ? null : endDate.trim() || null,
      current,
      description: description.trim(),
      location: location.trim() || null,
      logo: logo.trim() || null,
      verified: true,
      sortOrder: editingId ? undefined : experiences.length + 1,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/experience', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.experience) {
          setExperiences(experiences.map((e) => (e.id === editingId ? data.experience : e)));
          handleCancelEdit();
          setMessage({ text: '✓ Pengalaman berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.experience) {
          setExperiences([...experiences, data.experience]);
          handleCancelEdit();
          setMessage({ text: '✓ Pengalaman kerja berhasil disimpan!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal menyimpan', type: 'error' });
        }
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus pengalaman di "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id));
        if (editingId === id) handleCancelEdit();
      }
    } catch {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Kelola Pengalaman Lapangan & Industri" />

      {message && (
        <div className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
            {editingId ? <Edit3 className="w-4 h-4 text-cyan-400" /> : <PlusCircle className="w-4 h-4 text-cyan-400" />}
            <span>{editingId ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Baru'}</span>
          </h4>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Perusahaan / Instansi</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. PT Imersa Solusi Teknologi"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Posisi / Jabatan</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Visual Designer / Network Tech"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Tahun Mulai</label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="2026"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Tahun Selesai</label>
            <input
              type="text"
              value={endDate}
              disabled={current}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2027"
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400 disabled:opacity-40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Lokasi Penempatan</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Yogyakarta, Indonesia"
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="currentJob"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              className="w-4 h-4 rounded bg-[#030508] border-white/[0.2] text-cyan-400 focus:ring-cyan-400"
            />
            <label htmlFor="currentJob" className="text-xs font-mono text-slate-300 cursor-pointer">
              Peran Aktif Saat Ini (Masih Bekerja)
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <FileUploader
            label="Logo Perusahaan (Opsional)"
            value={logo}
            onChange={(url) => setLogo(url)}
            placeholder="/images/company-logo.png"
            helpText="Upload logo institusi / perusahaan"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400">Deskripsi Pekerjaan & Tanggung Jawab (Poin-Poin)</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="• Mengembangkan arah visual untuk berbagai kebutuhan branding...&#10;• Mengonfigurasi dan mengelola server lokal..."
            required
            className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400 whitespace-pre-wrap"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-mono text-xs"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            {editingId ? <Save className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Pengalaman'}</span>
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className={`p-5 rounded-2xl bg-[#070B12]/80 border transition-all flex items-start justify-between gap-4 ${
              editingId === exp.id ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-white/[0.08]'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                <span className="text-xs font-mono text-cyan-400">@ {exp.company}</span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate} {exp.location && `· ${exp.location}`}
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleStartEdit(exp)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Edit Pengalaman"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id, exp.role)}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
