'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Trash2, Edit3, Cpu, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('AI & Backend');
  const [proficiency, setProficiency] = useState(90);
  const [sortOrder, setSortOrder] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/skills');
      const data = await res.json();
      if (res.ok && data.skills) setSkills(data.skills);
    } catch {
      setMessage({ text: 'Gagal memuat skills', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (skill: any) => {
    setEditingId(skill.id);
    setName(skill.name || '');
    setCategory(skill.category || 'AI & Backend');
    setProficiency(Number(skill.proficiency) || 90);
    setSortOrder(Number(skill.sortOrder) || 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setCategory('AI & Backend');
    setProficiency(90);
    setSortOrder(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      category,
      proficiency: Number(proficiency),
      sortOrder: Number(sortOrder),
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.skill) {
          setSkills(skills.map((s) => (s.id === editingId ? data.skill : s)));
          handleCancelEdit();
          setMessage({ text: '✓ Skill berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui skill', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.skill) {
          setSkills([...skills, data.skill]);
          handleCancelEdit();
          setMessage({ text: '✓ Skill berhasil ditambahkan ke database!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal menambahkan skill', type: 'error' });
        }
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleDelete = async (id: string, skillName: string) => {
    if (!confirm(`Hapus skill "${skillName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
        if (editingId === id) handleCancelEdit();
      } else {
        alert('Gagal menghapus skill');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Kelola Technical Skills & Kompetensi" />

      {message && (
        <div className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add / Edit Skill Card */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
            {editingId ? <Edit3 className="w-4 h-4 text-cyan-400" /> : <PlusCircle className="w-4 h-4 text-cyan-400" />}
            <span>{editingId ? 'Edit Skill Kompetensi' : 'Tambah Skill Baru'}</span>
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
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Nama Skill / Toolset</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. YOLOv8, PyTorch, CBBH"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="AI & Backend">AI & Backend</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Web Development">Web Development</option>
              <option value="Backend & Cloud">Backend & Cloud</option>
              <option value="Design & Creative">Design & Creative</option>
              <option value="Network Infrastructure">Network Infrastructure</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Proficiency: {proficiency}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer mt-2"
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
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Skill'}</span>
          </button>
        </div>
      </form>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`p-4 rounded-xl bg-[#070B12]/80 border flex items-center justify-between transition-all ${
              editingId === skill.id ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-white/[0.08]'
            }`}
          >
            <div className="space-y-1 min-w-0">
              <div className="font-mono text-xs font-bold text-white truncate flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>{skill.name}</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-400">
                {skill.category} · {skill.proficiency}%
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleStartEdit(skill)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Edit Skill"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(skill.id, skill.name)}
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
