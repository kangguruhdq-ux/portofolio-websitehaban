import React from 'react';
import { prisma } from '@/lib/db';
import { AdminHeader } from '@/components/admin/admin-header';
import { PlusCircle, Edit, Trash2, ExternalLink, Play } from 'lucide-react';
import { DeleteProjectButton } from './delete-button';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminHeader title="Kelola Portfolio Proyek" />
        <a
          href="/admin/projects/new"
          className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </a>
      </div>

      <div className="data-table-wrap rounded-2xl border border-white/[0.08] bg-[#070B12]/90 backdrop-blur-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0A0F1A] border-b border-white/[0.08] text-slate-400">
            <tr>
              <th className="py-3.5 px-4 font-semibold uppercase">Urutan</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Judul & Slug</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Kategori</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Status</th>
              <th className="py-3.5 px-4 font-semibold uppercase">Simulator</th>
              <th className="py-3.5 px-4 font-semibold uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-slate-300">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4 text-cyan-400 font-bold">{p.sortOrder}</td>
                <td className="py-4 px-4 max-w-xs">
                  <div className="font-bold text-white truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">/{p.slug}</div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-[10px]">
                    {p.category}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.published ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                    <span>{p.published ? 'Published' : 'Draft'}</span>
                    {p.featured && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        FEATURED
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {p.simulatorKey ? (
                    <span className="text-[10px] text-cyan-300 flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current text-cyan-400" />
                      <span>{p.simulatorKey}</span>
                    </span>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Lihat Halaman Publik"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={`/admin/projects/${p.id}`}
                      title="Edit Proyek"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
                    >
                      <Edit className="w-4 h-4" />
                    </a>
                    <DeleteProjectButton id={p.id} title={p.title} />
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
