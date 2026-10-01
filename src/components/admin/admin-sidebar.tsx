'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Image as ImageIcon,
  Share2,
  MessageSquare,
  Compass,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  Terminal,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Audit & Cyber Logs', href: '/admin/audit-logs', icon: ShieldAlert },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Tech Stack (Tooling)', href: '/admin/techstack', icon: ImageIcon },
  { label: 'Skills & Radar', href: '/admin/skills', icon: Cpu },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Terminal CLI', href: '/admin/terminal', icon: Terminal },
  { label: 'Ulasan / Logs', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Social Links', href: '/admin/social-links', icon: Share2 },
  { label: 'Navigation', href: '/admin/navigation', icon: Compass },
  { label: 'SEO Settings', href: '/admin/seo', icon: Search },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <aside className="w-64 bg-[#05080E] border-r border-white/[0.08] flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-40">
      <div className="p-5 flex flex-col h-full overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-2.5 pb-6 mb-4 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-[#050811] border border-cyan-400/40 flex items-center justify-center p-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
              <path d="M 6 8 L 16 16 L 6 24" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="18" y1="24" x2="27" y2="24" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="font-mono text-xs font-bold text-white tracking-wider">MAHABBAH CMS</h1>
            <p className="text-[10px] font-mono text-cyan-400">ADMIN CONTROL CORE</p>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/[0.08] space-y-2 mt-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] text-emerald-400">LIVE</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
