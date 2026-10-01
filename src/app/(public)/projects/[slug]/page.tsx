import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Play,
  Cpu,
  Shield,
  Layers,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import type { Metadata } from 'next';
import { ProjectDetailInteractive } from './project-detail-interactive';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return {
      title: 'Proyek Tidak Ditemukan',
    };
  }

  return {
    title: `${project.title} | Mahabbah Romadhon`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project || !project.published) {
    notFound();
  }

  const specs = (project.specifications as Record<string, any>) || {};

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back Link */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Proyek</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            {project.category}
          </span>
          {project.projectDate && (
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{project.projectDate}</span>
            </span>
          )}
          {project.featured && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">
              FEATURED MILESTONE
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
          {project.description}
        </p>
      </div>

      {/* Main Thumbnail with Simulator Trigger */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/[0.1] bg-black/60 shadow-2xl">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1000px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Action Bar on Thumbnail */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                <span>Live Deploy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] border border-white/[0.15] text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}
          </div>

          {/* Interactive Simulator Client Trigger */}
          {project.simulatorKey && (
            <ProjectDetailInteractive simulatorKey={project.simulatorKey} />
          )}
        </div>
      </div>

      {/* Specifications & Telemetry Table */}
      {Object.keys(specs).length > 0 && (
        <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>Spesifikasi Teknis & Benchmarks</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(specs).map(([key, val]) => (
              <div
                key={key}
                className="p-3 rounded-xl bg-[#030508] border border-white/[0.06] flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase">{key}</span>
                <span className="text-xs font-mono text-white font-bold mt-1 truncate">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep Technical Overview */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-6">
        <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>Arsitektur & Implementasi Mendalam</span>
        </h2>
        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
          {project.longDescription}
        </div>
      </div>

      {/* Technologies Stack */}
      <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
        <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
          Stack Teknologi Terintegrasi
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((t: string) => (
            <span
              key={t}
              className="px-3 py-1 rounded-lg bg-[#030508] border border-white/[0.1] text-xs font-mono text-slate-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Tangkapan Layar & Dokumentasi Visual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((img: string, i: number) => (
              <div
                key={i}
                className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black/40"
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
