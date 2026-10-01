import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Shield, Award, Terminal, Cpu, MapPin, Mail, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dossier & Tentang Mahabbah Romadhon',
  description: 'Profil lengkap, latar belakang teknikal, filosofi rekayasa perangkat lunak, dan kapabilitas riset Mahabbah Mahabban Romadhon.',
};

export default async function AboutPage() {
  let profile = null;
  let educations: any[] = [];
  let experiences: any[] = [];

  try {
    profile = await prisma.profile.findFirst();
  } catch (e) {
    console.error('Error loading profile:', e);
  }

  const p = profile || {
    name: 'Mahabbah Mahabban Romadhon',
    title: 'Machine Learning & Cyber Security Practitioner',
    kicker: 'SECTOR // 01 · DEEP SPACE DOSSIER',
    bio: `Halo, saya Mahabbah Mahabban Romadhon, seorang profesional teknologi multidisiplin yang memadukan keahlian dalam Kecerdasan Buatan (AI), Rekayasa Perangkat Lunak (Web/Mobile), dan Keamanan Siber. Saya memegang sertifikasi HTB Certified Bug Bounty Hunter (CBBH) dan lulusan program prestisius Deep Learning Specialization dari DeepLearning.AI.

Fokus utama saya adalah membangun ekosistem digital secara komprehensif—mulai dari melatih model Machine Learning yang presisi, merancang antarmuka pengguna yang responsif, hingga mengamankan arsitektur sistem dari potensi kerentanan. Dedikasi saya pada keamanan sistem dibuktikan melalui penemuan kerentanan (vulnerability bug) pada infrastruktur digital detikcom, yang telah diverifikasi dan diapresiasi secara resmi.

Latar belakang saya berakar dari Teknik Komputer dan Jaringan, mencakup pengalaman langsung dalam instalasi & splicing fiber optic hingga peran sebagai Visual Designer yang mengelola deployment web lokal. Ditambah pengalaman organisasi di PMR (Palang Merah Remaja) dan English Club, saya terbiasa bekerja presisi, terstruktur, dan adaptif di berbagai lini teknologi. Di sisi kreatif, saya juga menekuni animasi 3D menggunakan Source Filmmaker (SFM) dan Prisma3D, mulai dari character rigging hingga penataan gerak dan pencahayaan adegan.`,
    shortBio: 'Praktisi teknologi bersertifikat dengan fokus pada perancangan arsitektur perangkat lunak yang aman, efisien, dan berbasis kecerdasan buatan.',
    avatarUrl: '/images/profile.jpg',
    location: 'Yogyakarta, Indonesia',
    email: 'misnosusanto97@gmail.com',
    availability: 'AVAILABLE FOR SELECT ENGAGEMENTS',
    resumeUrl: '/CV_Mahabbah_Mahabban_Romadhon.pdf',
    ctaText: 'Mulai Diskusi',
    ctaLink: '/contact',
    githubUrl: 'https://github.com/kangguruhdq-ux',
    linkedinUrl: 'https://linkedin.com',
    instagramUrl: 'https://instagram.com',
  };

  try {
    educations = await prisma.education.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    experiences = await prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error loading bio tracks:', e);
  }

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Top Dossier Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#070B12]/90 border border-white/[0.08] relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar with scanner ring */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex-shrink-0 bg-black">
            <Image
              src={p.avatarUrl}
              alt={p.name}
              fill
              sizes="200px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{p.availability}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {p.name}
            </h1>
            <p className="text-sm sm:text-base font-mono text-cyan-400">
              {p.title}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{p.location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>{p.email}</span>
              </span>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={p.resumeUrl}
                download
                className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CV Resmi</span>
              </a>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>Mulai Diskusi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Biography & Engineering Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-2xl bg-[#070B12]/80 border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Biografi Teknis & Visi Rekayasa</span>
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap">
              {p.bio}
            </div>
          </div>

          {/* Core Methodologies */}
          <div className="p-8 rounded-2xl bg-[#070B12]/80 border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Prinsip Keamanan & Machine Learning</span>
            </h2>
            <ul className="space-y-3 text-xs font-mono text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Defensive Architecture by Design:</strong> Menerapkan sanitasi ketat, autentikasi berbasis signed JWT, validasi skema runtime Zod, dan proteksi IDOR di seluruh pipeline endpoint.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>High-Precision Vision Models:</strong> Rekayasa model YOLOv8 yang di-fine-tune dengan dataset custom real-world guna mencapai akurasi mAP di atas 95% pada edge inference.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Zero-Slop Craftsmanship:</strong> Antarmuka bebas dari dekorasi buatan tanpa fungsi; tipografi terstruktur, tata letak tactile, dan performa render instan.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Track Information */}
        <div className="space-y-6">
          {/* Education Track */}
          <div className="p-6 rounded-2xl bg-[#070B12]/80 border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Pendidikan Terverifikasi</span>
            </h3>
            {educations.map((edu) => (
              <div key={edu.id} className="space-y-1.5 pb-4 border-b border-white/[0.05] last:border-0 last:pb-0">
                <div className="text-xs font-bold text-white">{edu.institution}</div>
                <div className="text-xs font-mono text-cyan-300">{edu.program}</div>
                <div className="text-[10px] font-mono text-slate-400">{edu.startDate} – {edu.endDate || 'Present'}</div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">{edu.description}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="p-6 rounded-2xl bg-[#070B12]/80 border border-white/[0.08] space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Kanal Terkait
            </h3>
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors"
            >
              GitHub // @kangguruhdq-ux
            </a>
            <Link
              href="/projects"
              className="block p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Katalog Proyek Aktif →
            </Link>
            <Link
              href="/certificates"
              className="block p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sertifikasi & Lisensi CBBH →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
