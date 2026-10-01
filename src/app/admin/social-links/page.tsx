'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Trash2, Edit3, Share2, ExternalLink, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState('GitHub');
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('github');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/admin/social-links');
      const data = await res.json();
      if (res.ok && data.links) setLinks(data.links);
    } catch {
      setMessage({ text: 'Gagal memuat link', type: 'error' });
    }
  };

  const handleStartEdit = (link: any) => {
    setEditingId(link.id);
    setPlatform(link.platform || 'GitHub');
    setUsername(link.username || '');
    setUrl(link.url || '');
    setIcon(link.icon || 'link');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setPlatform('GitHub');
    setUsername('');
    setUrl('');
    setIcon('github');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !username.trim() || !url.trim()) return;

    const payload = {
      platform: platform.trim(),
      username: username.trim(),
      url: url.trim(),
      icon: icon.trim() || 'link',
      sortOrder: editingId ? undefined : links.length + 1,
      active: true,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/social-links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.link) {
          setLinks(links.map((l) => (l.id === editingId ? data.link : l)));
          handleCancelEdit();
          setMessage({ text: '✓ Social link berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui link', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/social-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.link) {
          setLinks([...links, data.link]);
          handleCancelEdit();
          setMessage({ text: '✓ Social link berhasil disimpan!', type: 'success' });
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
    if (!confirm(`Hapus link "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/social-links?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(links.filter((l) => l.id !== id));
        if (editingId === id) handleCancelEdit();
      }
    } catch {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Kelola Social Links & Jejaring" />

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
            <span>{editingId ? 'Edit Social Link' : 'Tambah Social Link Baru'}</span>
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
            <label className="text-[11px] font-mono text-slate-400">Platform</label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value);
                setIcon(e.target.value.toLowerCase());
              }}
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">X / Twitter</option>
              <option value="YouTube">YouTube</option>
              <option value="Discord">Discord</option>
              <option value="Website">Personal Web</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Username / Handle</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. @kangguruhdq-ux"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Target URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>
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
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Link'}</span>
          </button>
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {links.map((link) => (
          <div
            key={link.id}
            className={`p-4 rounded-xl bg-[#070B12]/80 border flex items-center justify-between transition-all ${
              editingId === link.id ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-white/[0.08]'
            }`}
          >
            <div className="space-y-0.5 min-w-0">
              <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>{link.platform}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">{link.username}</div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Buka Link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleStartEdit(link)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Edit Link"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(link.id, link.platform)}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
