'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { Globe, Save, CheckCircle2, AlertCircle, Share2, Tag, Search } from 'lucide-react';
import { FileUploader } from '@/components/admin/file-uploader';

export default function AdminSeoPage() {
  const [formData, setFormData] = useState({
    siteTitle: '',
    metaDescription: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    favicon: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      if (res.ok && data.seo) {
        setFormData({
          siteTitle: data.seo.siteTitle || '',
          metaDescription: data.seo.metaDescription || '',
          keywords: data.seo.keywords || '',
          ogTitle: data.seo.ogTitle || '',
          ogDescription: data.seo.ogDescription || '',
          ogImage: data.seo.ogImage || '',
          favicon: data.seo.favicon || '',
        });
      }
    } catch {
      setMessage({ text: 'Gagal memuat konfigurasi SEO', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: '✓ Konfigurasi SEO & Social Meta tersimpan ke Database!', type: 'success' });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: data.error || 'Gagal menyimpan SEO', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Konfigurasi Meta SEO & Open Graph" />

      {message && (
        <div
          className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Engine Optimization */}
          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
            <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search Engine Listing (SERP)</span>
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Site Title (Browser Tab & SERP)</label>
              <input
                type="text"
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                required
                className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Meta Description</label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                required
                className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Keywords (Pisahkan dengan koma)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                required
                className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <FileUploader
                label="Favicon Icon"
                value={formData.favicon}
                onChange={(url) => setFormData({ ...formData, favicon: url })}
                accept="image/*"
                placeholder="/favicon.svg"
                helpText="Ikon tab browser (mendukung SVG, PNG, ICO, Data URL)"
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, favicon: '/favicon.svg' })}
                  className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>&gt;_ Set Logo Termux (/favicon.svg)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Open Graph / Social Sharing */}
          <div className="p-6 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-4">
            <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Social Media Previews (Open Graph / Twitter)</span>
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">OG Card Title</label>
              <input
                type="text"
                value={formData.ogTitle}
                onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                required
                className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">OG Card Description</label>
              <textarea
                rows={3}
                value={formData.ogDescription}
                onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                required
                className="w-full bg-[#030508] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <FileUploader
                label="OG Banner Image (1200x630)"
                value={formData.ogImage}
                onChange={(url) => setFormData({ ...formData, ogImage: url })}
                accept="image/*"
              />
            </div>

            {/* Google SERP Preview */}
            <div className="mt-4 p-4 rounded-xl bg-[#030508] border border-white/[0.08] space-y-1 font-sans">
              <p className="text-[10px] font-mono text-slate-400">PREVIEW GOOGLE SEARCH:</p>
              <p className="text-cyan-400 text-sm font-medium hover:underline truncate">
                {formData.siteTitle || 'Mahabbah Romadhon | Portfolio'}
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">https://mahabbah.dev</p>
              <p className="text-xs text-slate-400 line-clamp-2">
                {formData.metaDescription || 'AI Engineer & Cybersecurity Specialist'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi SEO'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
