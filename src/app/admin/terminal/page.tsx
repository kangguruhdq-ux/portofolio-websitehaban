'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Trash2, Edit3, CheckCircle2, AlertCircle, X, Save, Terminal, Sparkles } from 'lucide-react';

const DEFAULT_COMMANDS = [
  {
    command: 'whoami',
    description: 'Menampilkan identitas & spesialisasi',
    response: 'Mahabbah Mahabban Romadhon\nSpesialisasi: Machine Learning · Full-Stack Web/App · Cyber Security Analyst (CBBH)\nClearance: SECURITY CLEARANCE LEVEL 01 · HTB CBBH · DEEPLEARNING.AI',
    category: 'IDENTITY',
    sortOrder: 1,
  },
  {
    command: 'skills',
    description: 'Menampilkan rangkuman keahlian teknis',
    response: 'CORE COMPETENCIES:\n- AI / ML: PyTorch, YOLOv8, CNNs, Transformers, CUDA, TensorRT\n- Web & App: Next.js 14, React, TypeScript, PHP/Laravel, Tailwind CSS\n- Cyber Security: Web App Pentesting, Bug Bounty (CBBH), Recon OSINT\n- 3D & Creative: Three.js, WebGL, Source Filmmaker (SFM), Prisma3D',
    category: 'SKILLS',
    sortOrder: 2,
  },
  {
    command: 'projects',
    description: 'Menampilkan ringkasan proyek industri',
    response: 'DAFTAR PROYEK UTAMA:\n1. Real-Time APD Safety Detection (YOLOv8 + CUDA)\n2. OSINT Cyber Threat Intelligence Dashboard (Python + Shodan)\n3. Photobooth Event Automation (Webcam + Thermal Print)\n4. Web-Based Pacman Game Engine (Vanilla JS Canvas)\n5. Earth 3D Simulation (Three.js WebGL)\nKetik "goto work" untuk lompat ke portofolio proyek.',
    category: 'PROJECTS',
    sortOrder: 3,
  },
  {
    command: 'contact',
    description: 'Menampilkan detail kontak resmi',
    response: 'INFORMASI KONTAK:\n- Email: misnosusanto97@gmail.com\n- GitHub: https://github.com/kangguruhdq-ux\n- Lokasi: Yogyakarta, Indonesia [7.7956° S, 110.3695° E]\n- Status: AVAILABLE FOR SELECT ENGAGEMENTS',
    category: 'CONTACT',
    sortOrder: 4,
  },
  {
    command: 'sudo hire-me',
    description: 'Perintah otorisasi kerja / kolaborasi',
    response: '[sudo] authenticating guest user...\n[OK] ACCESS GRANTED // Redirecting to communication channel...',
    category: 'ACTION',
    sortOrder: 5,
  },
  {
    command: 'education',
    description: 'Menampilkan riwayat akademis',
    response: 'FONDASI AKADEMIS:\nSMKN 3 Yogyakarta — Teknik Komputer dan Jaringan (2024 - 2027)\nFokus: Web Full-Stack, Jaringan MikroTik/Cisco, Hardware Troubleshooting, PMR, English Club',
    category: 'INFO',
    sortOrder: 6,
  },
];

export default function AdminTerminalPage() {
  const [commands, setCommands] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [command, setCommand] = useState('');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState('');
  const [category, setCategory] = useState('CUSTOM');
  const [sortOrder, setSortOrder] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/terminal');
      const data = await res.json();
      if (res.ok && data.commands) setCommands(data.commands);
    } catch {
      setMessage({ text: 'Gagal memuat perintah terminal', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (cmd: any) => {
    setEditingId(cmd.id);
    setCommand(cmd.command || '');
    setDescription(cmd.description || '');
    setResponse(cmd.response || '');
    setCategory(cmd.category || 'CUSTOM');
    setSortOrder(Number(cmd.sortOrder) || 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCommand('');
    setDescription('');
    setResponse('');
    setCategory('CUSTOM');
    setSortOrder(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !response.trim()) {
      setMessage({ text: 'Perintah dan Output Response wajib diisi', type: 'error' });
      return;
    }

    const payload = {
      command: command.trim().toLowerCase(),
      description: description.trim() || null,
      response: response.trim(),
      category: category.trim(),
      sortOrder: Number(sortOrder) || commands.length + 1,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/terminal', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.command) {
          setCommands(commands.map((c) => (c.id === editingId ? data.command : c)));
          handleCancelEdit();
          setMessage({ text: '✓ Perintah terminal berhasil diperbarui!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal memperbarui', type: 'error' });
        }
      } else {
        const res = await fetch('/api/admin/terminal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.command) {
          setCommands([...commands, data.command]);
          handleCancelEdit();
          setMessage({ text: '✓ Perintah terminal baru berhasil ditambahkan!', type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ text: data.error || 'Gagal menambahkan', type: 'error' });
        }
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleDelete = async (id: string, cmdName: string) => {
    if (!confirm(`Hapus perintah terminal "${cmdName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/terminal?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCommands(commands.filter((c) => c.id !== id));
        if (editingId === id) handleCancelEdit();
      }
    } catch {
      alert('Gagal menghapus');
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Muat konfigurasi perintah terminal default (whoami, skills, projects, contact, dll)?')) return;
    setIsLoading(true);
    try {
      for (const cmd of DEFAULT_COMMANDS) {
        await fetch('/api/admin/terminal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cmd),
        });
      }
      await fetchCommands();
      setMessage({ text: '✓ Perintah terminal default berhasil dimuat ke database!', type: 'success' });
    } catch {
      setMessage({ text: 'Gagal memuat default', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminHeader title="Kelola Perintah Termux CLI & Terminal" />
        {commands.length === 0 && (
          <button
            type="button"
            onClick={handleSeedDefaults}
            className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Muat Perintah Default</span>
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

      {/* Form: Add or Edit Terminal Command */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-5 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{editingId ? 'Edit Perintah Terminal' : 'Tambah Perintah Baru'}</span>
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
            <label className="text-[11px] font-mono text-slate-400">Kata Kunci Perintah (Command)</label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="e.g. whoami, resume, secret, cat"
              required
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Kategori</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="INFO / CUSTOM / ACTION"
              className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
            />
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

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400">Deskripsi Singkat (Tampil di menu bantuan)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Menampilkan informasi profil lengkap"
            className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400">Output Response Terminal (Bisa Multi-baris)</label>
          <textarea
            rows={5}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Tuliskan respon yang akan ditampilkan di layar terminal saat perintah ini dieksekusi..."
            required
            className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs font-mono text-emerald-400 outline-none focus:border-cyan-400 whitespace-pre-wrap leading-relaxed"
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
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Perintah'}</span>
          </button>
        </div>
      </form>

      {/* Table of Terminal Commands */}
      <div className="data-table-wrap rounded-2xl border border-white/[0.08] bg-[#070B12]/90 backdrop-blur-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0A0F1A] border-b border-white/[0.08] text-slate-400">
            <tr>
              <th className="py-3.5 px-4 font-semibold uppercase">Command</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Kategori</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Deskripsi</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Preview Response</th>
              <th className="py-3.5 px-4 font-semibold uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-slate-300">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  Memuat perintah terminal...
                </td>
              </tr>
            ) : commands.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  Belum ada perintah kustom. Klik "Muat Perintah Default" di atas.
                </td>
              </tr>
            ) : (
              commands.map((cmd) => (
                <tr key={cmd.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-emerald-400">${cmd.command}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-[10px] text-cyan-300">
                      {cmd.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{cmd.description || '-'}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-sm truncate font-mono text-[11px]">
                    {cmd.response}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cmd)}
                        className="p-1.5 rounded-md hover:bg-white/[0.05] text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Edit Perintah"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cmd.id, cmd.command)}
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
