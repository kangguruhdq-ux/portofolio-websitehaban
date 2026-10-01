'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { FileUploader } from '@/components/admin/file-uploader';
import { PlusCircle, Trash2, Edit3, CheckCircle2, AlertCircle, X, Save, Sparkles, Layers } from 'lucide-react';
import Image from 'next/image';

const DEFAULT_TECH = [
  { name: 'HTML', category: 'Frontend', logo: '/images/tech/html.svg', sortOrder: 1 },
  { name: 'CSS', category: 'Frontend', logo: '/images/tech/css.svg', sortOrder: 2 },
  { name: 'JavaScript', category: 'Language', logo: '/images/tech/javascript.svg', sortOrder: 3 },
  { name: 'Tailwind CSS', category: 'Styling', logo: '/images/tech/tailwind.svg', sortOrder: 4 },
  { name: 'ReactJS', category: 'Frontend', logo: '/images/tech/reactjs.svg', sortOrder: 5 },
  { name: 'Vite', category: 'Tooling', logo: '/images/tech/vite.svg', sortOrder: 6 },
  { name: 'Node JS', category: 'Backend', logo: '/images/tech/nodejs.svg', sortOrder: 7 },
  { name: 'Bootstrap', category: 'Styling', logo: '/images/tech/bootstrap.svg', sortOrder: 8 },
  { name: 'Supabase', category: 'Backend', logo: '/images/tech/supabase.svg', sortOrder: 9 },
  { name: 'Material UI', category: 'UI Kit', logo: '/images/tech/MUI.svg', sortOrder: 10 },
  { name: 'Vercel', category: 'Cloud', logo: '/images/tech/vercel.svg', sortOrder: 11 },
  { name: 'Figma', category: 'Design', logo: '/images/tech/figma.svg', sortOrder: 12 },
  { name: 'Python', category: 'AI/Backend', logo: '/images/tech/python.svg', sortOrder: 13 },
  { name: 'Source Filmmaker', category: '3D/VFX', logo: '/images/tech/sfm.svg', sortOrder: 14 },
  { name: 'Prisma3D', category: 'Mobile 3D', logo: '/images/tech/prisma3d.svg', sortOrder: 15 },
];

export default function AdminTechStackPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [logo, setLogo] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/techstack');
      const data = await res.json();
      if (res.ok && data.items) setItems(data.items);
    } catch {
      setMessage({ text: 'Gagal memuat tech stack', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name || '');
    setCategory(item.category || 'Frontend');
    setLogo(item.logo || '');
    setSortOrder(Number(item.sortOrder) || 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setCategory('Frontend');
    setLogo('');
    setSortOrder(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !logo.trim()) {
      setMessage({ text: 'Nama dan Logo/Gambar wajib diisi', type: 'error' });
      return;
    }

    const payload = {
      name: name.trim(),
      category: category.trim(),
      logo: logo.trim(),
      sortOrder: Number(sortOrder) || items.length + 1,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/techstack', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setItems(items.map((i) => (i.id === editingId ? data.item : i)));
          handleCancelEdit();
          setMessage({ text: '✓ Tech stack berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/techstack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setItems([...items, data.item]);
          handleCancelEdit();
          setMessage({ text: '✓ Tech stack baru berhasil ditambahkan!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal menambahkan', type: 'error' });
        }
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!confirm(`Hapus tech stack "${itemName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/techstack?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        if (editingId === id) handleCancelEdit();
      }
    } catch {
      alert('Gagal menghapus');
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Populasi 15 software default (HTML, React, Python, SFM, dll) ke database?')) return;
    setIsLoading(true);
    try {
      for (const item of DEFAULT_TECH) {
        await fetch('/api/admin/techstack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      await fetchItems();
      setMessage({ text: '✓ 15 Tech Stack default berhasil dimuat ke database!', type: 'success' });
    } catch {
      setMessage({ text: 'Gagal memuat default', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminHeader title="Kelola Tech Stack & Software Tooling" />
        {items.length === 0 && (
          <button
            type="button"
            onClick={handleSeedDefaults}
            className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Muat 15 Tech Default</span>
          </button>
        )}
      </div>

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

      {/* Form: Add or Edit Tech Stack */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-5 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{editingId ? 'Edit Tech Stack' : 'Tambah Tech Stack Baru'}</span>
          </h3>
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
            <label className="text-[11px] font-mono text-slate-400">Nama Teknologi / Software</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next.js / Python / Docker"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Language">Language</option>
              <option value="Styling">Styling</option>
              <option value="Tooling">Tooling</option>
              <option value="Cloud">Cloud</option>
              <option value="Design">Design</option>
              <option value="AI/Backend">AI/Backend</option>
              <option value="3D/VFX">3D/VFX</option>
              <option value="Mobile 3D">Mobile 3D</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Urutan Tampil (Sort Order)</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="1"
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* File Uploader for Logo / Image */}
        <div className="space-y-1">
          <FileUploader
            label="Logo / Icon Teknologi (SVG, PNG, WebP)"
            value={logo}
            onChange={(url) => setLogo(url)}
            placeholder="/images/tech/reactjs.svg"
            helpText="Upload logo SVG atau gambar ikon software"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2"
          >
            {editingId ? <Save className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Tech Stack'}</span>
          </button>
        </div>
      </form>

      {/* Table List of Tech Stack Items */}
      <div className="data-table-wrap rounded-2xl border border-white/[0.08] bg-[#070B12]/90 backdrop-blur-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0A0F1A] border-b border-white/[0.08] text-slate-400">
            <tr>
              <th className="py-3.5 px-4 font-semibold uppercase">Logo</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Nama</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Kategori</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Urutan</th>
              <th className="py-3.5 px-4 font-semibold uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-slate-300">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  Memuat daftar tech stack...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  Belum ada tech stack di database. Klik tombol "Muat 15 Tech Default" di atas.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center p-1.5 overflow-hidden">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.name}
                          width={24}
                          height={24}
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <Layers className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{item.sortOrder}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-md hover:bg-white/[0.05] text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Edit Tech Stack & Gambar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
