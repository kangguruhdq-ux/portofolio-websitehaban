import React from 'react';
import { prisma } from '@/lib/db';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Pengalaman Profesional & Karier',
  description: 'Riwayat pengalaman kerja, kepemimpinan, dan kontribusi riset teknikal Mahabbah Mahabban Romadhon.',
};

export default async function ExperiencePage() {
  let experiences: any[] = [];
  try {
    experiences = await prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching experiences:', e);
  }

  if (experiences.length === 0) {
    experiences = [
      {
        id: 'exp_imersa',
        role: 'Visual Designer',
        company: 'PT Imersa Solusi Teknologi',
        startDate: '2026',
        endDate: '2027',
        current: true,
        location: 'Yogyakarta, Indonesia',
        description: `• Mengembangkan arah visual untuk berbagai kebutuhan branding, promosi, dan kampanye kreatif.
• Membimbing tim desain dalam menghasilkan karya yang sesuai dengan identitas dan tujuan merek.
• Mengonfigurasi dan mengelola server lokal (Localhost/Web Server) untuk kebutuhan deployment sistem web dan penayangan iklan digital perusahaan.
• Melakukan pemantauan sistem, pengujian konektivitas, serta troubleshooting dari sisi software untuk memastikan web lokal dapat diakses tanpa kendala.`,
      },
      {
        id: 'exp_fiber',
        role: 'Teknisi Instalasi & Splicing Jaringan Fiber Optic',
        company: 'Jaringan & Infrastruktur Internet Pelanggan',
        startDate: '2025',
        endDate: '2026',
        current: false,
        location: 'Indonesia',
        description: `• Melakukan instalasi dan penarikan kabel jaringan (Tembaga dan Fiber Optic) untuk kebutuhan infrastruktur internet pelanggan.
• Melaksanakan penyambungan inti kabel serat optik (splicing) dengan tingkat ketelitian tinggi untuk meminimalisir redaman (loss).
• Menguji dan memastikan kualitas konektivitas jaringan pada seluruh instalasi menggunakan alat ukur seperti OPM dan LAN Tester.`,
      },
    ];
  }

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          // CAREER TIMELINE // TRACK RECORD
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Pengalaman Kerja & Kepemimpinan Teknis
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-light">
          Jejak kontribusi dalam pengembangan sistem, riset machine learning, dan audit keamanan siber di berbagai inisiatif rekayasa.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-white/[0.1] space-y-12">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#030508] border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,240,255,0.6)]" />

            <div className="p-6 sm:p-8 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {exp.role}
                  </h2>
                  <div className="text-sm font-mono text-cyan-400">
                    {exp.company}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}</span>
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {exp.description}
              </p>

              {exp.current && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PERAN AKTIF SAAT INI</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
