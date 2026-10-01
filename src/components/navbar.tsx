'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, Terminal, ArrowUpRight, Lock } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
}

export function Navbar({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setShowNavbar(true);
      return;
    }

    const handleScroll = () => {
      // Gateway is 100vh. Only show navbar once user scrolls past 280px.
      // Hide immediately when scrolling back to the top.
      const shouldShow = window.scrollY > 280;
      setShowNavbar(shouldShow);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out transform ${
        showNavbar
          ? 'translate-y-0 opacity-100 pointer-events-auto bg-[#030508]/85 backdrop-blur-md border-b border-white/[0.08] shadow-2xl py-3'
          : '-translate-y-full opacity-0 pointer-events-none py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="/"
          className="flex items-center gap-2.5 text-white hover:text-cyan-400 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#050811] border border-cyan-400/40 flex items-center justify-center p-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)] group-hover:border-cyan-300 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-all">
            <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
              <path d="M 6 8 L 16 16 L 6 24" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="18" y1="24" x2="27" y2="24" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
              MAHABBAH.DEV
            </span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SEC // AI PRACTITIONER
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#090E17]/80 border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-lg">
          <a
            href="/"
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              pathname === '/'
                ? 'text-cyan-400 bg-cyan-500/10 font-medium'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Home
          </a>
          {navItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <a
                key={item.id}
                href={item.url}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 font-medium'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
                {item.isExternal && <ArrowUpRight className="w-3 h-3 opacity-60" />}
              </a>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="/contact"
            className="px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:-translate-y-0.5"
          >
            Connect
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/[0.05] border border-white/[0.08]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#05080E]/95 border-b border-white/[0.1] px-5 py-6 mt-3 space-y-3 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <a
            href="/"
            className={`block py-2 text-sm font-mono border-b border-white/[0.05] ${
              pathname === '/' ? 'text-cyan-400' : 'text-slate-300'
            }`}
          >
            Home
          </a>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className={`block py-2 text-sm font-mono border-b border-white/[0.05] flex items-center justify-between ${
                pathname === item.url ? 'text-cyan-400' : 'text-slate-300'
              }`}
            >
              <span>{item.label}</span>
              {item.isExternal && <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="/contact"
              className="block w-full text-center py-2.5 rounded-lg text-xs font-mono font-bold bg-cyan-400 text-slate-950"
            >
              Connect
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
