import React from 'react';
import { prisma } from '@/lib/db';
import { AdminHeader } from '@/components/admin/admin-header';
import {
  FolderGit2,
  Cpu,
  Award,
  Briefcase,
  MessageSquare,
  Mail,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    featuredProjects,
    totalSkills,
    totalCertificates,
    totalExperiences,
    totalVisitorLogs,
    visitorLogs,
    contactMessages,
    profile,
    realVisitorsCount,
    uniqueVisitorIps,
    securityThreatsBlocked,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.skill.count(),
    prisma.certificate.count(),
    prisma.experience.count(),
    prisma.visitorLog.count(),
    prisma.visitorLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.profile.findUnique({ where: { id: 'profile_default' } }),
    prisma.auditLog.count({ where: { category: 'VISITOR' } }),
    prisma.auditLog.findMany({
      where: { category: 'VISITOR' },
      select: { ip: true },
      distinct: ['ip'],
    }),
    prisma.auditLog.count({ where: { category: 'SECURITY' } }),
  ]);

  const statCards = [
    { label: 'Real Visitors (Live DB)', value: realVisitorsCount, sub: `${uniqueVisitorIps.length} IP pengunjung unik`, icon: ShieldCheck, href: '/admin/audit-logs' },
    { label: 'Attacks Blocked (WAF)', value: securityThreatsBlocked, sub: 'SQLi, XSS, Scanners', icon: ShieldCheck, href: '/admin/audit-logs' },
    { label: 'Total Projects', value: totalProjects, sub: `${publishedProjects} published · ${featuredProjects} featured`, icon: FolderGit2, href: '/admin/projects' },
    { label: 'Technical Skills', value: totalSkills, sub: 'AI, Cyber, Web, 3D', icon: Cpu, href: '/admin/skills' },
    { label: 'Certifications', value: totalCertificates, sub: 'CBBH, DeepLearning.AI, Detikcom', icon: Award, href: '/admin/certificates' },
    { label: 'Experiences', value: totalExperiences, sub: 'Field & Security research', icon: Briefcase, href: '/admin/experience' },
    { label: 'Visitor Logs', value: totalVisitorLogs, sub: 'Verified transmissions', icon: MessageSquare, href: '/admin/reviews' },
    { label: 'Contact Inquiries', value: contactMessages.length, sub: 'Direct messages', icon: Mail, href: '/admin/settings' },
  ];

  return (
    <div className="space-y-8">
      <AdminHeader title="Executive Telemetry & CMS Overview" />

      {/* Quick Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 font-bold">DATABASE CONNECTED: NEON POSTGRESQL</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Selamat datang, {profile?.name || 'Administrator'}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Seluruh konten yang diedit di CMS ini tersimpan secara persisten ke database PostgreSQL di cloud Neon. Perubahan langsung tercermin di public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/projects/new"
            className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Proyek</span>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-mono text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/[0.1]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Website</span>
          </a>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.label}
              href={card.href}
              className="p-5 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] hover:border-cyan-400/40 transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{card.label}</span>
                <div className="p-2 rounded-lg bg-white/[0.04] text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {card.value}
              </div>
              <div className="text-xs text-slate-400 font-mono">{card.sub}</div>
            </a>
          );
        })}
      </div>

      {/* Two-Column Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visitor Logs */}
        <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h4 className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>TRANSMISI KOMENTAR TERBARU</span>
            </h4>
            <a href="/admin/reviews" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline">
              KELOLA SEMUA ({totalVisitorLogs}) &rarr;
            </a>
          </div>

          <div className="space-y-3">
            {visitorLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-[#0A0E18] border border-white/[0.05] space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{log.author}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {log.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{log.message}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  {new Date(log.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h4 className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>PESAN KONTAK MASUK</span>
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">SECURE INBOX</span>
          </div>

          <div className="space-y-3">
            {contactMessages.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-400">
                Belum ada pesan kontak masuk.
              </div>
            ) : (
              contactMessages.map((msg) => (
                <div key={msg.id} className="p-3.5 rounded-xl bg-[#0A0E18] border border-white/[0.05] space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{msg.name}</span>
                    <span className="text-slate-400 text-[10px]">{msg.email}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
