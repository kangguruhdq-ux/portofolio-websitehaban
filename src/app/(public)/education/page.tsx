import React from 'react';
import { prisma } from '@/lib/db';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Riwayat Pendidikan & Akademik',
  description: 'Latar belakang pendidikan formal dan sertifikasi kurikulum Mahabbah Mahabban Romadhon.',
};

export default async function EducationPage() {
  let educations: any[] = [];
  try {
    educations = await prisma.education.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching education:', e);
  }

  if (educations.length === 0) {
    educations = [
      {
        id: 'edu_smkn3',
        institution: 'SMKN 3 Yogyakarta',
        program: 'Teknik Komputer dan Jaringan',
        startDate: '2024',
        endDate: '2027',
        description: `• Pengembangan Web: Kompeten dalam pengembangan aplikasi web full-stack menggunakan ekosistem HTML, CSS, JavaScript, PHP, dan Laravel, disertai keahlian dalam merancang dan mengelola basis data relasional MySQL.
• Infrastruktur Jaringan: Berpengalaman dalam administrasi dan konfigurasi infrastruktur jaringan (LAN/WAN) skala dasar, memanfaatkan perangkat keras MikroTik dan simulasi tingkat lanjut dengan Cisco Packet Tracer.
• Perawatan Sistem: Memiliki keahlian teknis yang solid dalam perakitan, troubleshooting, dan pemeliharaan perangkat keras komputasi guna memastikan reliabilitas operasional sistem secara optimal.
• Organisasi & Ekstrakurikuler: Aktif mengikuti kegiatan ekstrakurikuler PMR (Palang Merah Remaja) dan English Club, yang mengasah kemampuan kerja sama tim, kepedulian sosial, serta komunikasi dalam bahasa Inggris.`,
      },
    ];
  }

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          // ACADEMIC DOSSIER // FORMAL EDUCATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Pendidikan & Pembelajaran Akademik
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-light">
          Pondasi formal dalam ilmu komputer, rekayasa perangkat lunak, dan riset analitik.
        </p>
      </div>

      {/* Education List */}
      <div className="space-y-6">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {edu.institution}
                  </h2>
                  <div className="text-sm font-mono text-cyan-400">
                    {edu.program}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 self-start sm:self-auto">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pl-0 sm:pl-13">
              {edu.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
