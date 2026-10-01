import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Award, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sertifikasi & Lisensi Resmi',
  description: 'Daftar sertifikat terverifikasi: Certified Bug Bounty Hunter (CBBH), Deep Learning, dan kompetensi keamanan siber Mahabbah Mahabban Romadhon.',
};

export default async function CertificatesPage() {
  let certificates: any[] = [];
  try {
    certificates = await prisma.certificate.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching certificates:', e);
  }

  if (certificates.length === 0) {
    certificates = [
      {
        id: 'cert_cbbh',
        title: 'CBBH — Certified Bug Bounty Hunter',
        issuer: 'Hack The Box',
        issueDate: 'Valid: Hingga April 2026',
        credentialId: 'HTB-CBBH-7795',
        credentialUrl: 'https://academy.hackthebox.com/',
        image: '/images/cert-cbbh.jpg',
        description: 'Kredensial profesional tingkat lanjut di bidang keamanan siber praktis, mengesahkan kemampuan dalam melakukan identifikasi, eksploitasi, dan pelaporan celah keamanan sistem informasi. Disahkan oleh Charalampos Pyarinos (CEO).',
        skills: ['Penetration Testing', 'Bug Bounty', 'Web Security', 'Burp Suite'],
      },
      {
        id: 'cert_deeplearning',
        title: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI (Coursera)',
        issueDate: 'Diterbitkan: Juni 2026',
        credentialId: 'COURSERA-DL-SPEC',
        credentialUrl: 'https://coursera.org',
        image: '/images/cert-deeplearning.jpg',
        description: 'Program spesialisasi intensif di bawah bimbingan Andrew Ng. Menguasai arsitektur Neural Networks, Hyperparameter Tuning, implementasi CNNs (Visual Data), dan Sequence Models (NLP/Audio).',
        skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'Computer Vision'],
      },
      {
        id: 'cert_detikcom',
        title: 'Penghargaan Pelaporan Kerentanan Sistem',
        issuer: 'detikcom IT Security Division',
        issueDate: 'Diterbitkan: Juni 2026',
        credentialId: 'DETIKCOM-HOF-2026',
        credentialUrl: 'https://detik.com',
        image: '/images/cert-detikcom.jpg',
        description: 'Sertifikat apresiasi resmi (Hall of Fame) yang diterbitkan oleh Bagus Setiawan (Direktur IT detikcom) atas dedikasi dan tanggung jawab dalam menemukan serta melaporkan celah keamanan krusial pada platform detikcom.',
        skills: ['Responsible Disclosure', 'Vulnerability Assessment', 'Security Hardening'],
      },
      {
        id: 'cert_gcp_mle',
        title: 'Professional Machine Learning Engineer',
        issuer: 'Google Cloud',
        issueDate: '21 Apr 2026 – 27 Mar 2028',
        credentialId: 'J8M0K',
        credentialUrl: 'https://cloud.google.com/certification',
        image: '/images/cert-gcp-mle.jpg',
        description: 'Sertifikasi profesional industri yang mengesahkan keahlian tingkat lanjut dalam merancang, membangun, dan memproduksi (production-izing) model Machine Learning di atas infrastruktur Google Cloud. Ditandatangani oleh Thomas Kurian (CEO Google Cloud).',
        skills: ['Google Cloud', 'MLOps', 'Model Deployment', 'BigQuery'],
      },
      {
        id: 'cert_nn_deeplearning',
        title: 'Neural Networks and Deep Learning',
        issuer: 'DeepLearning.AI (Coursera)',
        issueDate: 'Diterbitkan: 25 Des 2025',
        credentialId: 'KL349UPMCLWW',
        credentialUrl: 'https://coursera.org/verify/KL349UPMCLWW',
        image: '/images/cert-nn-deeplearning.jpg',
        description: 'Sertifikat penyelesaian kursus yang berfokus pada konsep dasar jaringan saraf tiruan (neural networks) dan deep learning. Ditandatangani oleh Andrew Ng. Kode Verifikasi Coursera: KL349UPMCLWW.',
        skills: ['Neural Networks', 'Forward/Backprop', 'Vectorization'],
      },
      {
        id: 'cert_hvac_thermo',
        title: 'Thermodynamics of Refrigeration',
        issuer: 'The Training Center (Terakreditasi EPA)',
        issueDate: 'Diterbitkan: 10 Jan 2025',
        credentialId: 'EPA-HVAC-ROY',
        credentialUrl: '',
        image: '/images/cert-hvac-thermo.jpg',
        description: 'Sertifikasi teknis yang menguji dan memvalidasi pemahaman mendalam terkait siklus refrigerasi, mekanika termodinamika sistem, serta kepatuhan standar lingkungan EPA dalam penanganan sistem pendingin.',
        skills: ['Thermodynamics', 'EPA Standards', 'HVAC Systems', 'Thermal Physics'],
      },
    ];
  }

  return (
    <div className="pt-28 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          // VERIFIED CREDENTIALS // {certificates.length} AWARDS & LICENSES
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Sertifikasi & Lisensi Resmi
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-light">
          Bukti verifikasi kompetensi profesional di bidang penetrasi siber, rekayasa model AI, dan metodologi software development terstandarisasi.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl"
          >
            {/* Image Preview */}
            <div className="relative aspect-[16/10] w-full bg-black/60 overflow-hidden border-b border-white/[0.06]">
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-transparent to-black/30" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 border border-white/[0.1] text-[10px] font-mono text-cyan-300">
                {cert.issuer}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{cert.issueDate}</span>
                  </span>
                  {cert.credentialId && (
                    <span className="truncate max-w-[120px] text-purple-400">
                      ID: {cert.credentialId}
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {cert.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Validation Link */}
                {cert.credentialUrl && (
                  <div className="pt-1">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Validasi Kredensial Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
