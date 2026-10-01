import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { prisma } from '@/lib/db';
import { HangingCard } from '@/components/hanging-card';
import { TechStackFilter } from '@/components/tech-stack-filter';
import { ProjectCarousel } from '@/components/project-carousel';
import { VisitorLogsSection } from '@/components/visitor-logs-section';

const GalaxyGateway = dynamic(
  () => import('@/components/galaxy-gateway').then((mod) => mod.GalaxyGateway),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-[100dvh] min-h-[540px] md:h-screen bg-[#05060A] text-[#edf3ff] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_48%_48%,rgba(24,40,68,0.35)_0%,transparent_55%)]" />
        <div className="absolute top-[8%] sm:top-[7%] w-full px-6 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#a8b8d0] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#afd7f7] shadow-[0_0_10px_#9ac9ff]" />
            <span>ASTRA // COSMIC GATEWAY 3.0 · [7.7956° S, 110.3695° E]</span>
          </div>
        </div>
        <div className="absolute top-[48%] -translate-y-1/2 left-0 right-0 w-full px-6 sm:px-12 md:px-20 lg:px-28 flex items-center justify-between pointer-events-none">
          <span className="text-[32px] sm:text-[54px] md:text-[68px] lg:text-[84px] font-medium tracking-[-0.045em] text-[#edf3ff]">HABAN</span>
          <span className="text-[32px] sm:text-[54px] md:text-[68px] lg:text-[84px] font-medium tracking-[-0.045em] text-[#edf3ff]">PORTOFOLIO</span>
        </div>
      </div>
    ),
  }
);

const AvatarLaserScanner = dynamic(
  () => import('@/components/avatar-laser-scanner').then((mod) => mod.AvatarLaserScanner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-[340px] h-[480px] mx-auto rounded-3xl bg-[#090D17]/90 border border-cyan-500/25 animate-pulse" />
    ),
  }
);

const CyberRadar = dynamic(
  () => import('@/components/cyber-radar').then((mod) => mod.CyberRadar),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] rounded-2xl bg-[#070B12]/90 border border-white/[0.08] animate-pulse" />
    ),
  }
);
import {
  Download,
  Mail,
  Send,
  ExternalLink,
  Shield,
  Cpu,
  Terminal,
  Award,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  // Query live data from Neon PostgreSQL
  let profile: any = null;
  let projects: any[] = [];
  let visitorLogs: any[] = [];
  let educations: any[] = [];
  let experiences: any[] = [];
  let certificates: any[] = [];

  try {
    profile = await prisma.profile.findFirst();
  } catch (e) {
    console.error('Error fetching profile:', e);
  }

  try {
    projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching projects:', e);
  }

  try {
    visitorLogs = await prisma.visitorLog.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });
  } catch (e) {
    console.error('Error fetching visitor logs:', e);
  }

  try {
    educations = await prisma.education.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching educations:', e);
  }

  try {
    experiences = await prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching experiences:', e);
  }

  try {
    certificates = await prisma.certificate.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching certificates:', e);
  }

  let techStacks: any[] = [];
  try {
    techStacks = await prisma.techStack.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching tech stacks:', e);
  }

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* =========================================================================
          TOP ASTRA GALAXY 3D CINEMATIC GATEWAY (100vh WITH DRAG & SCROLL WARP)
          ========================================================================= */}
      <GalaxyGateway />

      {/* =========================================================================
          TOP COSMIC STATUS RIBBON
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 reveal">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090E17]/80 border border-white/[0.08] backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-slate-400 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">LOC //</span>
            <span className="text-white">YOGYAKARTA, ID [7.7956° S, 110.3695° E]</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR SELECT ENGAGEMENTS</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">CLEARANCE //</span>
            <span className="text-white">HTB CBBH · DEEPLEARNING.AI</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HERO SECTION (#heroSection)
          ========================================================================= */}
      <section
        id="heroSection"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center reveal"
      >
        {/* Left Column: Hero Typography & Terminal Prompt */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            <span>{profile?.kicker || 'Machine Learning & Cyber Security Practitioner'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            {profile?.name ? (
              <>
                {profile.name.split(' ')[0]} <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                  {profile.name.split(' ').slice(1).join(' ')}
                </span>
              </>
            ) : (
              <>
                Mahabbah <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                  Mahabban Romadhon
                </span>
              </>
            )}
          </h1>

          {/* Typewriter Terminal Shell */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#030508] border border-cyan-500/30 font-mono text-xs text-cyan-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.15)] max-w-lg mx-auto lg:mx-0">
            <span className="text-emerald-400 font-bold">&gt;</span>
            <span className="text-slate-200">python train.py --architecture resnet50</span>
            <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
          </div>

          {/* Role Pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
              Spesialis Machine Learning
            </span>
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
              Full-Stack Web Dev
            </span>
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
              Mobile App Dev
            </span>
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
              Cyber Security Analyst
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl font-light leading-relaxed">
            {profile?.shortBio || 'Praktisi teknologi bersertifikat dengan fokus pada perancangan arsitektur perangkat lunak yang aman, efisien, dan berbasis kecerdasan buatan.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href={profile?.resumeUrl || '/CV_Mahabbah_Mahabban_Romadhon.pdf'}
              download
              className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all shadow-[0_0_25px_rgba(0,240,255,0.35)] flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Unduh CV</span>
              <Download className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white font-mono text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Mulai Diskusi</span>
              <Send className="w-3.5 h-3.5 text-cyan-400" />
            </a>

            <a
              href="#work"
              className="px-4 py-3 text-cyan-400 hover:text-cyan-300 font-mono text-xs transition-colors flex items-center gap-1"
            >
              <span>Jelajahi Proyek</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Column: Dual-State Avatar Cyber Laser Scanner + 3D Quantum Core */}
        <div className="lg:col-span-5 flex justify-center">
          <AvatarLaserScanner
            humanPhoto={profile?.avatarUrl || '/images/profile.jpg'}
            robotPhoto={profile?.heroImageUrl || '/images/avatar-robot.jpg'}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTOR 01: PROFIL PROFESIONAL & HANGING CARD (#about)
          ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 01 · DEEP SPACE DOSSIER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Profil Profesional</h2>
        </div>

        {/* Hanging Identity Card */}
        <div className="flex justify-center py-4 reveal">
          <HangingCard
            profile={{
              name: profile?.name || 'Mahabbah Mahabban Romadhon',
              title: profile?.title || 'AI ENGINEER · CYBER SEC · FULL-STACK',
              avatarUrl: profile?.avatarUrl || '/images/profile.jpg',
              availability: profile?.availability || 'ACTIVE // SECURITY CLEARANCE 01',
              location: profile?.location || 'Yogyakarta, Indonesia',
            }}
          />
        </div>

        {/* Editorial Text & Telemetry Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] text-sm text-slate-300 leading-relaxed space-y-4 font-sans reveal">
            {profile?.bio && profile.bio.trim() !== '' ? (
              profile.bio.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="whitespace-pre-line">{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  Halo, saya <strong className="text-white font-semibold">Mahabbah Mahabban Romadhon</strong>, seorang profesional teknologi multidisiplin yang memadukan keahlian dalam <strong className="text-cyan-300">Kecerdasan Buatan (AI), Rekayasa Perangkat Lunak (Web/Mobile),</strong> dan <strong className="text-purple-300">Keamanan Siber</strong>. Saya memegang sertifikasi <strong className="text-cyan-400 font-mono">HTB Certified Bug Bounty Hunter (CBBH)</strong> dan lulusan program prestisius <strong className="text-emerald-400">Deep Learning Specialization</strong> dari DeepLearning.AI.
                </p>
                <p>
                  Fokus utama saya adalah membangun ekosistem digital secara komprehensif—mulai dari melatih model Machine Learning yang presisi, merancang antarmuka pengguna yang responsif, hingga mengamankan arsitektur sistem dari potensi kerentanan. Dedikasi saya pada keamanan sistem dibuktikan melalui penemuan kerentanan (vulnerability bug) pada infrastruktur digital <strong className="text-white">detikcom</strong>, yang telah diverifikasi dan diapresiasi secara resmi.
                </p>
                <p>
                  Latar belakang saya berakar dari <strong className="text-white">Teknik Komputer dan Jaringan</strong>, mencakup pengalaman langsung dalam instalasi &amp; splicing fiber optic hingga peran sebagai Visual Designer yang mengelola deployment web lokal. Ditambah pengalaman organisasi di PMR (Palang Merah Remaja) dan English Club, saya terbiasa bekerja presisi, terstruktur, dan adaptif di berbagai lini teknologi. Di sisi kreatif, saya juga menekuni animasi 3D menggunakan <strong className="text-cyan-300">Source Filmmaker (SFM)</strong> dan <strong className="text-purple-300">Prisma3D</strong>, mulai dari character rigging hingga penataan gerak dan pencahayaan adegan.
                </p>
              </>
            )}
          </div>

          {/* Telemetry Metrics Column */}
          <div className="lg:col-span-4 space-y-3 reveal-stagger">
            <div className="p-4 rounded-xl bg-[#070B12]/80 border border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Proyek Industri Terpublikasi</span>
              <span className="text-xl font-bold font-mono text-cyan-400">6</span>
            </div>
            <div className="p-4 rounded-xl bg-[#070B12]/80 border border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Sertifikasi &amp; Penghargaan</span>
              <span className="text-xl font-bold font-mono text-purple-400">6</span>
            </div>
            <div className="p-4 rounded-xl bg-[#070B12]/80 border border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Domain Keahlian Utama</span>
              <span className="text-xl font-bold font-mono text-emerald-400">4 (AI, Web, App, Sec)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#070B12]/80 border border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>GitHub Publik</span>
              </span>
              <a
                href="https://github.com/kangguruhdq-ux"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-cyan-400 hover:underline"
              >
                @kangguruhdq-ux ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTOR 02: PENDIDIKAN & PENGALAMAN (#education)
          ========================================================================= */}
      <section id="education" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 02 · ORBITAL TRACK RECORD</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Pendidikan &amp; Pengalaman</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Fondasi akademis Teknik Komputer dan Jaringan yang diperkuat dengan pengalaman lapangan di industri IT dan jaringan infrastruktur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-stagger">
          {/* Academic Track */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Fondasi Akademis</span>
            </h3>

            {educations && educations.length > 0 ? (
              educations.map((edu: any) => (
                <div key={edu.id} className="p-6 sm:p-7 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-3">
                    {edu.logo && (
                      <div className="relative w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={edu.logo}
                          alt={edu.institution}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white">{edu.institution}</h3>
                      <div className="text-xs font-mono text-cyan-400">
                        {edu.program} | {edu.startDate} &ndash; {edu.endDate || 'Sekarang'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {edu.description}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 sm:p-7 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Image
                      src="/images/smkn3-logo.png"
                      alt="Logo SMKN 3 Yogyakarta"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">SMKN 3 Yogyakarta</h3>
                    <div className="text-xs font-mono text-cyan-400">
                      Teknik Komputer dan Jaringan | 2024 &ndash; 2027
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span><strong className="text-white">Pengembangan Web:</strong> Kompeten dalam pengembangan aplikasi web full-stack menggunakan ekosistem HTML, CSS, JavaScript, PHP, dan Laravel, disertai keahlian dalam merancang dan mengelola basis data relasional MySQL.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span><strong className="text-white">Infrastruktur Jaringan:</strong> Berpengalaman dalam administrasi dan konfigurasi infrastruktur jaringan (LAN/WAN) skala dasar, memanfaatkan perangkat keras MikroTik dan simulasi tingkat lanjut dengan Cisco Packet Tracer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span><strong className="text-white">Perawatan Sistem:</strong> Memiliki keahlian teknis yang solid dalam perakitan, troubleshooting, dan pemeliharaan perangkat keras komputasi guna memastikan reliabilitas operasional sistem secara optimal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span><strong className="text-white">Organisasi &amp; Ekstrakurikuler:</strong> Aktif mengikuti kegiatan ekstrakurikuler PMR (Palang Merah Remaja) dan English Club, yang mengasah kemampuan kerja sama tim, kepedulian sosial, serta komunikasi dalam bahasa Inggris.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Professional Experience Track */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Pengalaman Lapangan</span>
            </h3>

            {experiences && experiences.length > 0 ? (
              experiences.map((exp: any) => (
                <div key={exp.id} className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{exp.role}</h3>
                      <div className="text-xs font-mono text-cyan-400">
                        {exp.company} | {exp.startDate} &ndash; {exp.endDate || (exp.current ? 'Sekarang' : '')}
                      </div>
                    </div>
                    {exp.logo && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/[0.1] bg-white/[0.04] flex-shrink-0">
                        <Image src={exp.logo} alt={exp.company} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {exp.description}
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Job 1: PT Imersa Solusi Teknologi */}
                <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Visual Designer</h3>
                    <div className="text-xs font-mono text-cyan-400">
                      PT Imersa Solusi Teknologi | 2026 &ndash; 2027
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                    <li>• Mengembangkan arah visual untuk berbagai kebutuhan branding, promosi, dan kampanye kreatif.</li>
                    <li>• Membimbing tim desain dalam menghasilkan karya yang sesuai dengan identitas dan tujuan merek.</li>
                    <li>• Mengonfigurasi dan mengelola server lokal (Localhost/Web Server) untuk kebutuhan deployment sistem web dan penayangan iklan digital perusahaan.</li>
                    <li>• Melakukan pemantauan sistem, pengujian konektivitas, serta troubleshooting software.</li>
                  </ul>
                </div>

                {/* Job 2: Teknisi Fiber Optic */}
                <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Teknisi Instalasi &amp; Splicing Jaringan Fiber Optic
                    </h3>
                    <div className="text-xs font-mono text-cyan-400">
                      Jaringan &amp; Infrastruktur Internet Pelanggan
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                    <li>• Melakukan instalasi dan penarikan kabel jaringan (Tembaga dan Fiber Optic) untuk kebutuhan internet pelanggan.</li>
                    <li>• Melaksanakan penyambungan inti kabel serat optik (splicing) dengan tingkat ketelitian tinggi untuk meminimalisir redaman (loss).</li>
                    <li>• Menguji kualitas konektivitas menggunakan alat ukur OPM dan LAN Tester.</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTOR 03: KOMPETENSI UTAMA & RADAR (#skills)
          ========================================================================= */}
      <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 03 · NEURAL CORE PAYLOADS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Kompetensi Utama</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Simulasi lingkungan teknis dan command terminal dari setiap domain keahlian yang dikuasai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 5 Terminal Cards */}
          <div className="lg:col-span-8 space-y-4 reveal-stagger">
            {/* Terminal 1: ai_engineer.py */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-bold text-white">ai_engineer.py</span>
                </div>
                <span className="text-[10px] text-cyan-400">[CV &amp; YOLO]</span>
              </div>
              <div className="text-slate-300">
                <span className="text-emerald-400 font-bold">$</span> python train.py --architecture resnet50
              </div>
              <div className="text-cyan-400 text-[11px]">
                epoch 12/50 · loss 0.032 · validation_acc 98.7% [OK]
              </div>
              <p className="text-xs font-sans text-slate-300 pt-1">
                <strong className="text-white">Machine Learning:</strong> Merancang, melatih, dan mengimplementasikan model Deep Learning tingkat lanjut untuk klasifikasi data, prediksi analitik, dan Computer Vision.
              </p>
            </div>

            {/* Terminal 2: fullstack-dev */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-bold text-white">fullstack-dev</span>
                </div>
                <span className="text-[10px] text-cyan-400">[NEXT.JS 14]</span>
              </div>
              <div className="text-slate-300">
                <span className="text-emerald-400 font-bold">$</span> npm run build --production
              </div>
              <div className="text-cyan-400 text-[11px]">
                Compiled successfully in 4.2s (Optimized) [OK]
              </div>
              <p className="text-xs font-sans text-slate-300 pt-1">
                <strong className="text-white">Web Development:</strong> Membangun aplikasi web full-stack dengan performa tinggi, responsif, dan arsitektur yang scalable untuk kebutuhan bisnis modern.
              </p>
            </div>

            {/* Terminal 3: mobile-engineer */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-bold text-white">mobile-engineer</span>
                </div>
                <span className="text-[10px] text-cyan-400">[CROSS-PLATFORM]</span>
              </div>
              <div className="text-slate-300">
                <span className="text-emerald-400 font-bold">$</span> flutter build apk --release --obfuscate
              </div>
              <div className="text-cyan-400 text-[11px]">
                Built app-release.apk (18.4MB) [OK]
              </div>
              <p className="text-xs font-sans text-slate-300 pt-1">
                <strong className="text-white">App Development:</strong> Mengembangkan aplikasi cross-platform (Android/iOS) dengan fokus pada optimasi performa dan User Experience (UX) yang intuitif.
              </p>
            </div>

            {/* Terminal 4: security_audit */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-bold text-white">security_audit</span>
                </div>
                <span className="text-[10px] text-purple-400">[HTB CBBH]</span>
              </div>
              <div className="text-slate-300">
                <span className="text-emerald-400 font-bold">$</span> burpsuite --scan target.internal --active
              </div>
              <div className="text-purple-300 text-[11px]">
                [!] Vulnerability detected &amp; verified. Report generated.
              </div>
              <p className="text-xs font-sans text-slate-300 pt-1">
                <strong className="text-white">Cyber Security:</strong> Berpengalaman dalam Bug Bounty Hunting, Penetration Testing menggunakan Burp Suite, dan audit keamanan untuk memperkuat postur keamanan sistem (Hardening).
              </p>
            </div>

            {/* Terminal 5: network_tech.sh */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-bold text-white">network_tech.sh</span>
                </div>
                <span className="text-[10px] text-emerald-400">[FIBER SPLICING]</span>
              </div>
              <div className="text-slate-300">
                <span className="text-emerald-400 font-bold">$</span> fusion-splicer --align-core --check-loss
              </div>
              <div className="text-emerald-300 text-[11px]">
                splice_loss: 0.02dB · OPM: -21.4dBm · LINK OK
              </div>
              <p className="text-xs font-sans text-slate-300 pt-1">
                <strong className="text-white">Jaringan &amp; Infrastruktur:</strong> Instalasi dan splicing kabel tembaga &amp; fiber optic, konfigurasi jaringan LAN dan server lokal, serta perakitan dan troubleshooting hardware PC dengan ketelitian tinggi.
              </p>
            </div>
          </div>

          {/* Active Cyber Radar Sentinel Widget */}
          <div className="lg:col-span-4 sticky top-24 reveal">
            <CyberRadar />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTOR 04: TECH STACK & SOFTWARE TOOLING (#techstack)
          ========================================================================= */}
      <section id="techstack" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 04 · INTERSTELLAR TOOLING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Tech Stack &amp; Software</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Klik salah satu teknologi di bawah untuk memfilter proyek yang dibangun menggunakan teknologi tersebut.
          </p>
        </div>

        <div className="reveal">
          <TechStackFilter
            items={
              techStacks.length > 0
                ? techStacks.map((t) => ({
                    id: t.id,
                    name: t.name,
                    logo: t.logo,
                    category: t.category,
                  }))
                : undefined
            }
          />
        </div>
      </section>

      {/* =========================================================================
          SECTOR 05: PORTOFOLIO PROYEK & LAB INTERAKTIF (#work)
          ========================================================================= */}
      <section id="work" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 05 · FLAGSHIP MISSIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Portofolio Proyek</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Koleksi implementasi sistem industri, riset keamanan, web 3D imersif, dan animasi digital.
          </p>
        </div>

        {/* Flagship Projects Horizontal Carousel Slider */}
        <div className="space-y-4 reveal">
          <div className="font-mono text-xs text-cyan-400 uppercase tracking-wider font-bold">
            IMPLEMENTASI INDUSTRI (SERIUS)
          </div>
          <ProjectCarousel projects={projects} />
        </div>

        {/* Creative Lab Projects Grid */}
        <div className="space-y-6 pt-8">
          <div className="font-mono text-xs text-purple-400 uppercase tracking-wider font-bold reveal">
            EKSPLORASI INTERAKTIF (KREATIF)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
            {/* Lab 1: Pacman Engine */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                  <Image
                    src="/images/project-pacman.jpg"
                    alt="Game Pacman"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                  PENGEMBANGAN GIM · ALGORITMA
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Web-Based Pacman Engine
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  Rekreasi gim klasik Pacman menggunakan Vanilla JavaScript murni. Proyek ini mendemonstrasikan pemahaman mendalam terkait manipulasi Canvas, collision detection, dan logika pergerakan entitas.
                </p>
              </div>

              <a
                href="https://habanpacman.surge.sh/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 pt-2"
              >
                <span>Tinjau Aplikasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Lab 2: Photo Booth */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                  <Image
                    src="/images/project-photobooth.jpg"
                    alt="Virtual Photo Booth"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                  WEB APP · MEDIA API
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Virtual Photo Booth
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  Aplikasi web interaktif yang memanfaatkan WebRTC API untuk mengakses kamera pengguna secara aman, mengaplikasikan filter, dan menangkap gambar langsung dari browser.
                </p>
              </div>

              <a
                href="https://candid-cactus-ddff7a.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 pt-2"
              >
                <span>Tinjau Aplikasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Lab 3: Earth 3D Simulation */}
            <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                  <Image
                    src="/images/project-bmi3d.jpg"
                    alt="Earth 3D Simulation"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                  3D RENDERING · THREE.JS
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Earth 3D Simulation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  Simulasi model planet Bumi 3D interaktif yang di-render secara real-time di web. Sebuah eksperimen optimalisasi mesh dan pencahayaan dinamis pada lingkungan WebGL.
                </p>
              </div>

              <a
                href="https://neiooooo.surge.sh/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 pt-2"
              >
                <span>Tinjau Aplikasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTOR 06: LISENSI & SERTIFIKASI (#certifications)
          ========================================================================= */}
      <section id="certifications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 06 · ACCREDITATIONS &amp; CLEARANCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Lisensi &amp; Sertifikasi</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Verifikasi resmi kompetensi profesional dari lembaga internasional terkemuka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
          {certificates && certificates.length > 0 ? (
            certificates.map((cert: any, idx: number) => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                    <Image
                      src={cert.image || '/images/cert-cbbh.jpg'}
                      alt={`Sertifikat ${cert.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CERT // 0{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cert.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Otoritas: {cert.issuer}</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {cert.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>{cert.issueDate}</span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Verifikasi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Cert 1: CBBH */}
              <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                    <Image src="/images/cert-cbbh.jpg" alt="Sertifikat CBBH" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CERT // 01</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">VERIFIED</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    CBBH — Certified Bug Bounty Hunter
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Otoritas: Hack The Box</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    Kredensial profesional tingkat lanjut di bidang keamanan siber praktis, mengesahkan kemampuan dalam melakukan identifikasi, eksploitasi, dan pelaporan celah keamanan sistem informasi. Disahkan oleh Charalampos Pyarinos (CEO).
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
                  Valid: Hingga April 2026
                </div>
              </div>

              {/* Cert 2: Deep Learning Specialization */}
              <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                    <Image src="/images/cert-deeplearning.jpg" alt="Sertifikat Deep Learning" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CERT // 02</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">VERIFIED</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Deep Learning Specialization
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Otoritas: DeepLearning.AI (Coursera)</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    Program spesialisasi intensif di bawah bimbingan Andrew Ng. Menguasai arsitektur Neural Networks, Hyperparameter Tuning, implementasi CNNs (Visual Data), dan Sequence Models (NLP/Audio).
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
                  Diterbitkan: Juni 2026
                </div>
              </div>

              {/* Cert 3: Detikcom Hall of Fame */}
              <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                    <Image src="/images/cert-detikcom.jpg" alt="Sertifikat detikcom" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CERT // 03</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 font-bold text-purple-300">HALL OF FAME</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Penghargaan Pelaporan Kerentanan Sistem
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Otoritas: detikcom IT Security Division</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    Sertifikat apresiasi resmi (Hall of Fame) yang diterbitkan oleh Bagus Setiawan (Direktur IT detikcom) atas dedikasi dan tanggung jawab dalam menemukan serta melaporkan celah keamanan krusial pada platform detikcom.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
                  Diterbitkan: Juni 2026
                </div>
              </div>

              {/* Cert 4: Google Cloud MLE */}
              <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                    <Image src="/images/cert-gcp-mle.jpg" alt="Sertifikat GCP MLE" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CERT // 04</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">CLOUD CERTIFIED</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Professional Machine Learning Engineer
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Otoritas: Google Cloud · ID: J8M0K</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    Sertifikasi profesional industri yang mengesahkan keahlian tingkat lanjut dalam merancang, membangun, dan memproduksi model Machine Learning di atas infrastruktur Google Cloud.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
                  21 Apr 2026 – 27 Mar 2028
                </div>
              </div>

              {/* Cert 5: Neural Networks & Deep Learning */}
              <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                    <Image src="/images/cert-nn-deeplearning.jpg" alt="Sertifikat Neural Networks" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CERT // 05</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">COURSE COMPLETE</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Neural Networks and Deep Learning
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Otoritas: DeepLearning.AI (Coursera) · ID: KL349UPMCLWW</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    Sertifikat penyelesaian kursus yang berfokus pada konsep dasar jaringan saraf tiruan (neural networks) dan deep learning. Ditandatangani oleh Andrew Ng.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
                  Diterbitkan: 25 Des 2025
                </div>
              </div>

              {/* Cert 6: Thermodynamics of Refrigeration */}
              <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/[0.06]">
                    <Image src="/images/cert-hvac-thermo.jpg" alt="Sertifikat HVAC Thermo" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CERT // 06</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">TECHNICAL TRAINING</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Thermodynamics of Refrigeration
                  </h3>
                  <div className="text-xs font-mono text-slate-400">Otoritas: The Training Center (EPA)</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    Sertifikat penyelesaian pelatihan teknik yang mengonfirmasi pemahaman tentang teori dasar perpindahan panas dan siklus pendinginan untuk industri HVAC. Ditandatangani oleh Rob Roy.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
                  Diterbitkan: 10 Jan 2025
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTOR 07: ALUR KERJA (PROCESS / FLIGHT METHODOLOGY) (#process)
          ========================================================================= */}
      <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 07 · FLIGHT METHODOLOGY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Alur Kerja</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Pendekatan terstruktur dari tahap konseptual hingga deployment sistem produksi yang aman dan teruji.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
            <span className="text-[10.5px] font-mono text-cyan-400 font-bold">STAGE // 01</span>
            <h3 className="text-base font-bold text-white">01 · Discovery &amp; Riset</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Memahami kebutuhan, target pengguna, dan batasan teknis proyek secara mendalam sebelum satu baris kode pun ditulis — memastikan solusi yang dibangun benar-benar tepat sasaran.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
            <span className="text-[10.5px] font-mono text-purple-400 font-bold">STAGE // 02</span>
            <h3 className="text-base font-bold text-white">02 · Desain &amp; Arsitektur</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Merancang arsitektur sistem, alur data, dan struktur antarmuka yang skalabel — termasuk pertimbangan keamanan sejak tahap perencanaan (security by design).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
            <span className="text-[10.5px] font-mono text-emerald-400 font-bold">STAGE // 03</span>
            <h3 className="text-base font-bold text-white">03 · Development &amp; Testing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Implementasi iteratif dengan pengujian berkelanjutan — mencakup unit testing, penetration testing dasar, dan optimasi performa di setiap tahap.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-3">
            <span className="text-[10.5px] font-mono text-amber-400 font-bold">STAGE // 04</span>
            <h3 className="text-base font-bold text-white">04 · Deploy &amp; Dukungan</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Peluncuran ke lingkungan produksi, monitoring pasca-rilis, dan dukungan berkelanjutan untuk perbaikan maupun pengembangan fitur lanjutan.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTOR 08: KONTAK TRANSMISI DEEP SPACE (#contact)
          ========================================================================= */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 08 · DEEP SPACE TRANSMISSION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Siap Mengakselerasi Visi Digital Anda?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Saya senantiasa terbuka untuk peluang kolaborasi, konsultasi teknis, pengerjaan proyek freelance, maupun tawaran posisi strategis (Full-Time) di industri teknologi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center reveal">
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-6">
            <a
              href="mailto:misnosusanto97@gmail.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95"
            >
              <span>Hubungi Saya Sekarang</span>
              <Send className="w-4 h-4" />
            </a>

            <div className="pt-4 border-t border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="text-[11px] text-cyan-400 uppercase font-bold">// Temukan Saya</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://github.com/kangguruhdq-ux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#030508] border border-white/[0.08] hover:border-cyan-400/40 text-slate-300 hover:text-white transition-all flex flex-col gap-1"
                >
                  <strong className="text-white">GitHub</strong>
                  <span className="text-[11px] text-cyan-400">@kangguruhdq-ux</span>
                </a>

                <a
                  href="https://wa.me/6287897305696"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#030508] border border-white/[0.08] hover:border-emerald-400/40 text-slate-300 hover:text-white transition-all flex flex-col gap-1"
                >
                  <strong className="text-white">WhatsApp</strong>
                  <span className="text-[11px] text-emerald-400">+62 878-9730-5696</span>
                </a>

                <div className="p-3.5 rounded-xl bg-[#030508] border border-white/[0.08] flex flex-col gap-1">
                  <strong className="text-white">Email</strong>
                  <span className="text-[11px] text-purple-400 truncate">misnosusanto97@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 rounded-xl bg-white">
              <Image
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fmahabbahmahabbanromadhon.netlify.app%2F"
                alt="QR Code Portofolio"
                width={140}
                height={140}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="font-mono text-[10.5px] text-slate-400">
              Scan untuk membuka portofolio ini di perangkat lain
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTOR 09: BUKU TAMU PENGUNJUNG (VISITOR LOGS / KOMENTAR) (#commentsSection)
          ========================================================================= */}
      <section id="commentsSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 scroll-mt-20">
        <div className="border-b border-white/[0.08] pb-4 text-center reveal">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SECTOR // 09 · CELESTIAL VISITOR LOG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Komentar &amp; Masukan</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-lg mx-auto">
            Punya masukan tentang portofolio ini? Tinggalkan komentar di bawah — cukup isi nama, tanpa perlu login.
          </p>
        </div>

        {/* Live Visitor Logs Section with Real-time DB Sync */}
        <div className="reveal">
          <VisitorLogsSection initialLogs={visitorLogs} />
        </div>
      </section>
    </div>
  );
}
