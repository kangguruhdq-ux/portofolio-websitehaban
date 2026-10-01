import React from 'react';
import { prisma } from '@/lib/db';
import { Download, ExternalLink, FileText, CheckCircle2, Award, Briefcase, GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Curriculum Vitae & Resume Resmi',
  description: 'Download dan tinjau resume resmi Mahabbah Mahabban Romadhon — AI Practitioner & Cybersecurity Specialist.',
};

export default async function ResumePage() {
  let profile = null;
  try {
    profile = await prisma.profile.findFirst();
  } catch (e) {
    console.error('Error fetching profile for resume:', e);
  }

  const cvUrl = profile?.resumeUrl || '/CV_Mahabbah_Mahabban_Romadhon.pdf';

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header with Download Action */}
      <div className="p-8 rounded-3xl bg-[#070B12]/90 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>OFFICIAL CURRICULUM VITAE // 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Resume Mahabbah Mahabban Romadhon
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-light">
            Format PDF standar industri yang mencakup ringkasan profesional, keahlian mendalam, dan lisensi CBBH.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={cvUrl}
            download
            className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-mono text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <span>Buka di Tab Baru</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Embedded PDF Viewer with fallback iframe */}
      <div className="rounded-2xl border border-white/[0.1] bg-[#05070D] overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-[#090E17] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>DOCUMENT VIEWER // {cvUrl.replace('/', '')}</span>
          <span className="text-cyan-400">PDF RENDERER ACTIVE</span>
        </div>
        <div className="w-full h-[800px] bg-slate-950">
          <iframe
            src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title="Resume PDF Viewer"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
