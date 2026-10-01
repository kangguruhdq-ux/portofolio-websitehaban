'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Trash2, Edit3, Compass, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';

export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('/');
  const [sortOrder, setSortOrder] = useState(0);
  const [isExternal, setIsExternal] = useState(false);
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/navigation');
      const data = await res.json();
      if (res.ok && data.navItems) setNavItems(data.navItems);
    } catch {
      setMessage({ text: 'Gagal memuat item navigasi', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setLabel(item.label || '');
    setUrl(item.url || '/');
    setSortOrder(Number(item.sortOrder) || 0);
    setIsExternal(Boolean(item.isExternal));
    setVisible(Boolean(item.visible));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setLabel('');
    setUrl('/');
    setSortOrder(0);
    setIsExternal(false);
    setVisible(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;

    const payload = {
      label: label.trim(),
      url: url.trim(),
      sortOrder: Number(sortOrder),
      isExternal,
      visible,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setNavItems(navItems.map((n) => (n.id === editingId ? data.item : n)).sort((a, b) => a.sortOrder - b.sortOrder));
          handleCancelEdit();
          setMessage({ text: '✓ Menu navigasi berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui menu', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setNavItems([...navItems, data.item].sort((a, b) => a.sortOrder - b.sortOrder));
          handleCancelEdit();
          setMessage({ text: '✓ Menu navigasi berhasil ditambahkan!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal menambahkan menu', type: 'error' });
        }
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleDelete = async (id: string, itemLabel: string) => {
    if (!confirm(`Hapus menu navigasi "${itemLabel}"?`)) return;

    try {
      const res = await fetch(`/api/admin/navigation?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNavItems(navItems.filter((i) => i.id !== id));
        if (editingId === id) handleCancelEdit();
      } else {
        alert('Gagal menghapus item');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    }
  };

  const handleToggleVisible = async (item: any) => {
    try {
      const nextVisible = !item.visible;
      const res = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          visible: nextVisible,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setNavItems(navItems.map((n) => (n.id === item.id ? { ...n, visible: nextVisible } : n)));
        setMessage({
          text: `Status visibilitas "${item.label}" berhasil diubah menjadi ${nextVisible ? 'VISIBLE' : 'HIDDEN'}`,
          type: 'success',
        });
      } else {
        setMessage({
          text: 'Gagal mengubah status visibilitas: ' + (data.error || 'Server error'),
          type: 'error',
        });
      }
    } catch {
      setMessage({ text: 'Gagal mengubah status visibilitas (terjadi kesalahan jaringan)', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Kelola Struktur Navigasi Portal" />

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
            <span>{editingId ? 'Edit Link Navigasi' : 'Tambah Link Navigasi Baru'}</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Label Navigasi</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Projects, About, CV"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-mono text-slate-400">Target URL / Route</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. /projects, /contact, or https://..."
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isExternal}
                onChange={(e) => setIsExternal(e.target.checked)}
                className="rounded bg-[#030508] border-white/20 text-cyan-400 focus:ring-0"
              />
              <span>Buka di tab baru (External)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="rounded bg-[#030508] border-white/20 text-cyan-400 focus:ring-0"
              />
              <span>Tampilkan di Header</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
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
              <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Menu'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Nav Items Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#070B12]/90 overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0A0F1A] border-b border-white/[0.08] text-slate-400">
            <tr>
              <th className="py-3 px-4 font-semibold uppercase">Urutan</th>
              <th className="py-3 px-4 font-semibold uppercase">Label</th>
              <th className="py-3 px-4 font-semibold uppercase">URL</th>
              <th className="py-3 px-4 font-semibold uppercase">Tipe</th>
              <th className="py-3 px-4 font-semibold uppercase">Status</th>
              <th className="py-3 px-4 font-semibold uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-slate-300">
            {navItems.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02]">
                <td className="py-3 px-4 font-bold text-cyan-400">#{item.sortOrder}</td>
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.label}</span>
                </td>
                <td className="py-3 px-4 text-slate-400 truncate max-w-[200px]">{item.url}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-[10px]">
                    {item.isExternal ? 'External' : 'Internal'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleVisible(item)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.visible
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                    }`}
                  >
                    {item.visible ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                      title="Edit Menu"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.label)}
                      className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
