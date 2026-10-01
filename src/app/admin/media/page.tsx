'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { UploadCloud, Trash2, Copy, CheckCircle2, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (res.ok && data.media) setMediaList(data.media);
    } catch {
      setMessage({ text: 'Gagal memuat media library', type: 'error' });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isUploading) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', alt);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.media) {
        setMediaList([data.media, ...mediaList]);
        setFile(null);
        setAlt('');
        setMessage({ text: '✓ File berhasil diupload dan disimpan!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: data.error || 'Gagal upload file', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan saat upload', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus media "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) setMediaList(mediaList.filter((m) => m.id !== id));
    } catch {
      alert('Gagal menghapus media');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Media Library & Asset Management" />

      {message && (
        <div className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Upload Zone */}
      <form onSubmit={handleUpload} className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
        <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
          <UploadCloud className="w-4 h-4 text-cyan-400" />
          <span>Upload Asset Baru</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Pilih File (JPG, PNG, WEBP, SVG, PDF · Max 5MB)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-cyan-500/20 file:text-cyan-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Deskripsi Alt Text</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Screenshot Simulasi APD"
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isUploading}
            className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Mengunggah...' : 'Unggah ke Media Storage'}</span>
          </button>
        </div>
      </form>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mediaList.map((media) => {
          const isPdf = media.mimeType === 'application/pdf';
          return (
            <div
              key={media.id}
              className="p-3 rounded-xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="aspect-video w-full rounded-lg bg-black/60 border border-white/[0.05] overflow-hidden relative flex items-center justify-center">
                {isPdf ? (
                  <FileText className="w-8 h-8 text-rose-400" />
                ) : (
                  <img
                    src={media.url}
                    alt={media.alt || media.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono text-white truncate font-medium">{media.filename}</div>
                <div className="text-[10px] font-mono text-slate-500">
                  {(media.size / 1024).toFixed(1)} KB · {media.mimeType.split('/')[1]?.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => copyToClipboard(media.url)}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedUrl === media.url ? 'Tersalin!' : 'Salin URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(media.id, media.filename)}
                  className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
