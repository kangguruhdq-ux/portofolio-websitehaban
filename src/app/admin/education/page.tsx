'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Trash2, Edit3, GraduationCap, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { FileUploader } from '@/components/admin/file-uploader';

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [institution, setInstitution] = useState('');
  const [program, setProgram] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const res = await fetch('/api/admin/education');
      const data = await res.json();
      if (res.ok && data.educations) setEducations(data.educations);
    } catch {
      setMessage({ text: 'Gagal memuat pendidikan', type: 'error' });
    }
  };

  const handleStartEdit = (edu: any) => {
    setEditingId(edu.id);
    setInstitution(edu.institution || '');
    setProgram(edu.program || '');
    setStartDate(edu.startDate || '');
    setEndDate(edu.endDate || '');
    setLogo(edu.logo || '');
    setDescription(edu.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInstitution('');
    setProgram('');
    setStartDate('');
    setEndDate('');
    setLogo('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !program.trim() || !startDate.trim()) return;

    const payload = {
      institution: institution.trim(),
      program: program.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim() || null,
      logo: logo.trim() || null,
      description: description.trim(),
      sortOrder: editingId ? undefined : educations.length + 1,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/education', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.education) {
          setEducations(educations.map((e) => (e.id === editingId ? data.education : e)));
          handleCancelEdit();
          setMessage({ text: '✓ Rekam pendidikan berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.education) {
          setEducations([...educations, data.education]);
          handleCancelEdit();
          setMessage({ text: '✓ Rekam pendidikan berhasil ditambahkan!', type: 'success' });
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
    if (!confirm(`Hapus rekam pendidikan "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/education?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEducations(educations.filter((e) => e.id !== id));
        if (editingId === id) handleCancelEdit();
      }
    } catch {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Kelola Riwayat Pendidikan & Akademis" />

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
            <span>{editingId ? 'Edit Data Pendidikan' : 'Tambah Pendidikan Baru'}</span>
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
            <label className="text-[11px] font-mono text-slate-400">Institusi / Sekolah</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. SMKN 3 Yogyakarta"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Jurusan / Program</label>
            <input
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Teknik Komputer dan Jaringan"
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
              placeholder="2024"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Tahun Selesai</label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2027 (atau Sekarang)"
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <FileUploader
            label="Logo Institusi (Opsional)"
            value={logo}
            onChange={(url) => setLogo(url)}
            placeholder="/images/smkn3-logo.png"
            helpText="Upload logo sekolah atau kampus"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400">Deskripsi / Poin Kurikulum & Organisasi</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="• Pengembangan Web: ...&#10;• Infrastruktur Jaringan: ...&#10;• Organisasi: PMR & English Club"
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
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Pendidikan'}</span>
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className={`p-5 rounded-2xl bg-[#070B12]/80 border transition-all flex items-start justify-between gap-4 ${
              editingId === edu.id ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-white/[0.08]'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                <span className="text-xs font-mono text-cyan-400">({edu.startDate} – {edu.endDate || 'Sekarang'})</span>
              </div>
              <div className="text-xs font-mono text-slate-300">{edu.program}</div>
              <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{edu.description}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleStartEdit(edu)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Edit Pendidikan"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(edu.id, edu.institution)}
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
