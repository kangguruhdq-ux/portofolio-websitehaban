import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CosmicBackground } from '@/components/cosmic-background';
import { InteractiveEffects } from '@/components/interactive-effects';
import { CyberTerminalModal } from '@/components/cyber-terminal-modal';
import { prisma } from '@/lib/db';

export const revalidate = 60; // ISR revalidate every 60s for public pages

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let navItems: any[] = [];
  try {
    navItems = await prisma.navigation.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch {
    navItems = [
      { id: '1', label: 'Projects', url: '/projects', isExternal: false },
      { id: '2', label: 'Skills', url: '/skills', isExternal: false },
      { id: '3', label: 'Experience', url: '/experience', isExternal: false },
      { id: '4', label: 'Education', url: '/education', isExternal: false },
      { id: '5', label: 'Certificates', url: '/certificates', isExternal: false },
      { id: '6', label: 'About', url: '/about', isExternal: false },
      { id: '7', label: 'Contact', url: '/contact', isExternal: false },
      { id: '8', label: 'Resume', url: '/resume', isExternal: false },
    ];
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-[#05060A] text-slate-100 overflow-x-hidden">
      <CosmicBackground />
      <InteractiveEffects />
      <Navbar navItems={navItems} />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <CyberTerminalModal />
    </div>
  );
}
