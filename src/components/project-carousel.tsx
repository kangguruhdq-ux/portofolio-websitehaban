'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ExternalLink, Play, Github, ShieldAlert, Cpu, Eye } from 'lucide-react';
import { ProjectSimulatorModal } from './project-simulator-modal';

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  kicker: string | null;
  description: string;
  longDescription: string;
  thumbnail: string;
  category: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  simulatorKey: string | null;
  specifications: any;
  featured: boolean;
}

export function ProjectCarousel({ projects }: { projects: ProjectData[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [activeSimulator, setActiveSimulator] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = ['Semua', 'AI & ML', 'Keamanan', 'Web', 'Kreatif'];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'Semua') return true;
    return p.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth * 0.85;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full relative">
      {/* Category Pills & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-[#090E17]/80 text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous Project"
            className="w-9 h-9 rounded-full bg-[#0D131F]/90 border border-white/[0.1] flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next Project"
            className="w-9 h-9 rounded-full bg-[#0D131F]/90 border border-white/[0.1] flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swipeable Floating Cards Track */}
      <div
        ref={scrollRef}
        className="floating-card-carousel"
      >
        {filteredProjects.map((project, index) => {
          const specs = project.specifications || {};
          return (
            <div
              key={project.id}
              className="floating-card-item"
            >
              <div className="h-full bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 rounded-2xl p-5 sm:p-7 backdrop-blur-xl flex flex-col lg:flex-row gap-6 sm:gap-8 transition-all duration-300 relative group overflow-hidden">
                {/* Background soft ambient gradient */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />

                {/* Left: Thumbnail with camera / telemetry aspect */}
                <div className="w-full lg:w-[48%] relative rounded-xl overflow-hidden border border-white/[0.08] bg-black/60 flex-shrink-0 min-h-[220px] sm:min-h-[280px]">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Corner telemetry tag */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 border border-white/[0.1] text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>REC // FEED ACTIVE</span>
                  </div>

                  {/* Quick simulator launcher button on image */}
                  {project.simulatorKey && (
                    <button
                      type="button"
                      onClick={() => setActiveSimulator(project.simulatorKey)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-cyan-300 hover:scale-105 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Live Simulator</span>
                    </button>
                  )}
                </div>

                {/* Right: Project Content & Specs */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider">
                        {project.kicker || `FEATURED // 0${index + 1}`}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">·</span>
                      <span className="text-[11px] font-mono text-slate-300 uppercase">
                        {project.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-cyan-300 transition-colors">
                      <a href={`/projects/${project.slug}`}>
                        {project.title}
                      </a>
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Specification Box (Matching the screenshot provided by user!) */}
                    {Object.keys(specs).length > 0 && (
                      <div className="bg-[#04060A]/80 border border-white/[0.08] rounded-xl p-3 sm:p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                        {Object.entries(specs).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-slate-400 uppercase">{key}:</span>
                            <span className="text-white font-medium truncate">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Detail Link */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
                    <a
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 group/link"
                    >
                      <span>Lihat Detail Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </a>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.simulatorKey && (
                        <button
                          type="button"
                          onClick={() => setActiveSimulator(project.simulatorKey)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Interactive Simulator</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Simulator Modal */}
      {activeSimulator && (
        <ProjectSimulatorModal
          simulatorKey={activeSimulator}
          onClose={() => setActiveSimulator(null)}
        />
      )}
    </div>
  );
}
