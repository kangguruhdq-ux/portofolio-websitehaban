'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { MessageSquare, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, X, Eye, EyeOff, Send } from 'lucide-react';

interface VisitorLogItem {
  id: string;
  author: string;
  role: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [logs, setLogs] = useState<VisitorLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states (Create or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('VISITOR');
  const [logMessage, setLogMessage] = useState('');
  const [isApproved, setIsApproved] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/comments');
      const data = await res.json();
      if (res.ok && data.logs) {
        setLogs(data.logs);
      }
    } catch {
      setMessage({ text: 'Gagal memuat log ulasan', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setAuthor('');
    setRole('VISITOR');
    setLogMessage('');
    setIsApproved(true);
    setIsFormOpen(false);
  };

  const handleStartEdit = (log: VisitorLogItem) => {
    setEditingId(log.id);
    setAuthor(log.author);
    setRole(log.role);
    setLogMessage(log.message);
    setIsApproved(log.isApproved);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !logMessage.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const isEditing = Boolean(editingId);
      const url = '/api/admin/comments';
      const method = isEditing ? 'PUT' : 'POST';
      const payload = isEditing
        ? { id: editingId, author, role, message: logMessage, isApproved }
        : { author, role, message: logMessage, isApproved };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          text: isEditing ? '✓ Ulasan berhasil diperbarui!' : '✓ Ulasan baru berhasil ditambahkan!',
          type: 'success',
        });
        resetForm();
        fetchLogs();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: data.error || 'Gagal menyimpan ulasan', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    if (!confirm(`Hapus ulasan dari "${authorName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLogs(logs.filter((l) => l.id !== id));
        setMessage({ text: '✓ Ulasan berhasil dihapus', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: 'Gagal menghapus ulasan', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleToggleApproval = async (log: VisitorLogItem) => {
    try {
      const nextStatus = !log.isApproved;
      const res = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: log.id, isApproved: nextStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setLogs(logs.map((l) => (l.id === log.id ? { ...l, isApproved: nextStatus } : l)));
        setMessage({
          text: `Status ulasan "${log.author}" berhasil diubah menjadi ${nextStatus ? 'TAMPIL' : 'DISEMBUNYIKAN'}`,
          type: 'success',
        });
      } else {
        setMessage({
          text: 'Gagal mengubah status visibilitas: ' + (data.error || 'Server error'),
          type: 'error',
        });
      }
    } catch {
      setMessage({ text: 'Gagal mengubah status visibilitas (kesalahan jaringan)', type: 'error' });
    }
  };

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

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Ulasan & Visitor Transmission Logs"
        action={
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Ulasan</span>
          </button>
        }
      />

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

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <div className="p-6 rounded-2xl bg-[#070B12] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{editingId ? 'Edit Ulasan / Log Pengunjung' : 'Tambah Ulasan Baru'}</span>
            </h4>
            <button
              onClick={resetForm}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.05]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Pengirim / Nama / Alias *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama pengirim ulasan..."
                  required
                  className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Role / Peran</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="RECRUITER">RECRUITER</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="SECURITY">CYBER SEC</option>
                  <option value="CLIENT">CLIENT / PARTNER</option>
                  <option value="VISITOR">VISITOR</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Isi Pesan / Ulasan *</label>
              <textarea
                rows={3}
                value={logMessage}
                onChange={(e) => setLogMessage(e.target.value)}
                placeholder="Tulis ulasan atau tanggapan..."
                required
                className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/40 text-cyan-400 focus:ring-cyan-400"
                />
                <span>Tampilkan ke Publik (Approved)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white font-mono text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Kirim Ulasan'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logs Table / List */}
      <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <span className="text-xs font-mono font-bold text-white uppercase">
            Semua Log Ulasan ({logs.length})
          </span>
          <span className="text-[11px] font-mono text-emerald-400">REAL-TIME DB SYNC</span>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">Memuat ulasan...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">Belum ada ulasan yang tersimpan.</div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {logs.map((log) => (
              <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold text-white font-mono">{log.author}</span>
                    <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded border ${getRoleBadge(log.role)}`}>
                      // {log.role}
                    </span>
                    <span
                      className={`text-[9.5px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                        log.isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {log.isApproved ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                      <span>{log.isApproved ? 'TAMPIL' : 'DISEMBUNYIKAN'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(log.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed break-words whitespace-pre-wrap">
                    {log.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start flex-shrink-0">
                  <button
                    onClick={() => handleToggleApproval(log)}
                    title={log.isApproved ? 'Sembunyikan dari publik' : 'Tampilkan ke publik'}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                  >
                    {log.isApproved ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleStartEdit(log)}
                    title="Edit ulasan"
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(log.id, log.author)}
                    title="Hapus ulasan"
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
