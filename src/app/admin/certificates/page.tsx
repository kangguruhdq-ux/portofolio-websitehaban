'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Trash2, Edit3, Award, ExternalLink, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { FileUploader } from '@/components/admin/file-uploader';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [image, setImage] = useState('/images/cert-cbbh.jpg');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/admin/certificates');
      const data = await res.json();
      if (res.ok && data.certificates) setCertificates(data.certificates);
    } catch {
      setMessage({ text: 'Gagal memuat sertifikat', type: 'error' });
    }
  };

  const handleStartEdit = (cert: any) => {
    setEditingId(cert.id);
    setTitle(cert.title || '');
    setIssuer(cert.issuer || '');
    setIssueDate(cert.issueDate || '');
    setCredentialId(cert.credentialId || '');
    setCredentialUrl(cert.credentialUrl || '');
    setImage(cert.image || '/images/cert-cbbh.jpg');
    setDescription(cert.description || '');
    setSkills(Array.isArray(cert.skills) ? cert.skills.join(', ') : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setIssueDate('');
    setCredentialId('');
    setCredentialUrl('');
    setImage('/images/cert-cbbh.jpg');
    setDescription('');
    setSkills('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim() || !issueDate.trim() || !image.trim() || !description.trim()) return;

    const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim(),
      credentialId: credentialId.trim() || null,
      credentialUrl: credentialUrl.trim() || null,
      image: image.trim(),
      description: description.trim(),
      skills: skillsArray,
      sortOrder: editingId ? undefined : certificates.length + 1,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/certificates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.certificate) {
          setCertificates(certificates.map((c) => (c.id === editingId ? data.certificate : c)));
          handleCancelEdit();
          setMessage({ text: '✓ Sertifikasi berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.certificate) {
          setCertificates([...certificates, data.certificate]);
          handleCancelEdit();
          setMessage({ text: '✓ Sertifikasi berhasil ditambahkan!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal menambahkan', type: 'error' });
        }
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus sertifikat "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCertificates(certificates.filter((c) => c.id !== id));
        if (editingId === id) handleCancelEdit();
      }
    } catch {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Kelola Sertifikasi Profesional & Penghargaan" />

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
            <span>{editingId ? 'Edit Sertifikasi Terdaftar' : 'Tambah Sertifikasi Baru'}</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Nama Sertifikasi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HTB Certified Bug Bounty Hunter (CBBH)"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Penerbit / Organisasi</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. Hack The Box"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Tanggal / Masa Berlaku</label>
            <input
              type="text"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              placeholder="2025"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Credential ID</label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="HTB-CBBH-VERIFIED"
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Verifikasi URL</label>
            <input
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="sm:col-span-1">
            <FileUploader
              label="Foto / Sertifikat"
              value={image}
              onChange={(url) => setImage(url)}
              helpText="Upload scan sertifikat"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400">Skill yang Tervalidasi (Pisahkan Koma)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Penetration Testing, Bug Bounty, Web Security, Burp Suite"
            className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400">Deskripsi & Akreditasi</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kredensial tingkat lanjut yang memvalidasi kompetensi praktis..."
            required
            className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
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
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Sertifikat'}</span>
          </button>
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className={`p-5 rounded-2xl bg-[#070B12]/80 border transition-all flex flex-col justify-between space-y-3 ${
              editingId === cert.id ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-white/[0.08]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{cert.title}</span>
                  </h4>
                  <div className="text-xs font-mono text-cyan-400 mt-0.5">
                    {cert.issuer} · {cert.issueDate}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(cert)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Edit Sertifikat"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id, cert.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">{cert.description}</p>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{cert.credentialId ? `ID: ${cert.credentialId}` : 'No ID'}</span>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Verifikasi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
