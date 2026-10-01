import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ArrowRight, ExternalLink, Github, Terminal, Cpu, Play } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Katalog Proyek & Sistem Produksi',
  description: 'Daftar lengkap proyek AI Computer Vision, Cyber Security Tools, dan Full-Stack Systems yang dibangun oleh Mahabbah Mahabban Romadhon.',
};

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching projects:', e);
  }

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          // ARCHIVE DIRECTORY // {projects.length} REPOSITORIES
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Katalog Proyek Rekayasa & Riset
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-light">
          Kumpulan implementasi perangkat lunak open-source dan sistem terdistribusi, mencakup inferensi Computer Vision (YOLOv8), audit keamanan web, dan sistem automasi.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)]"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full bg-black/60 overflow-hidden border-b border-white/[0.06]">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-transparent to-black/30" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 border border-white/[0.1] text-[10px] font-mono text-cyan-300 backdrop-blur-sm">
                {project.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-cyan-400">
                  {project.kicker || 'PRODUCTION READY'}
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  <Link href={`/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="space-y-4 pt-3 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-cyan-400">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Footer Link */}
                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Detail & Dokumentasi</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
                        title="Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
