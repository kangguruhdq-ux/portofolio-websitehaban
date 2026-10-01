'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FileUploader } from '@/components/admin/file-uploader';

interface ProjectFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit }: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    kicker: initialData?.kicker || '',
    category: initialData?.category || 'AI & ML',
    description: initialData?.description || '',
    longDescription: initialData?.longDescription || '',
    thumbnail: initialData?.thumbnail || '/images/project-apd.jpg',
    gallery: initialData?.gallery?.join(', ') || initialData?.thumbnail || '',
    technologies: initialData?.technologies?.join(', ') || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    simulatorKey: initialData?.simulatorKey || '',
    specModel: initialData?.specifications?.MODEL || '',
    specAccel: initialData?.specifications?.ACCEL || '',
    specStream: initialData?.specifications?.STREAM || '',
    specInference: initialData?.specifications?.INFERENCE || '',
    featured: initialData?.featured ?? false,
    published: initialData?.published ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
    projectDate: initialData?.projectDate || '2026',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEdit && !prev.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const techArray = formData.technologies
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    const galleryArray = formData.gallery
      .split(',')
      .map((g: string) => g.trim())
      .filter(Boolean);

    const specifications: Record<string, string> = {};
    if (formData.specModel) specifications['MODEL'] = formData.specModel;
    if (formData.specAccel) specifications['ACCEL'] = formData.specAccel;
    if (formData.specStream) specifications['STREAM'] = formData.specStream;
    if (formData.specInference) specifications['INFERENCE'] = formData.specInference;

    const payload = {
      title: formData.title,
      slug: formData.slug.toLowerCase().trim(),
      kicker: formData.kicker || null,
      category: formData.category,
      description: formData.description,
      longDescription: formData.longDescription,
      thumbnail: formData.thumbnail,
      gallery: galleryArray.length ? galleryArray : [formData.thumbnail],
      technologies: techArray.length ? techArray : ['General'],
      githubUrl: formData.githubUrl || null,
      liveUrl: formData.liveUrl || null,
      simulatorKey: formData.simulatorKey || null,
      specifications: Object.keys(specifications).length ? specifications : null,
      featured: Boolean(formData.featured),
      published: Boolean(formData.published),
      sortOrder: Number(formData.sortOrder) || 0,
      projectDate: formData.projectDate,
    };

    try {
      const url = isEdit ? `/api/admin/projects/${initialData.id}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        setError(data.error || 'Gagal menyimpan proyek.');
      }
    } catch {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <a
          href="/admin/projects"
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Proyek</span>
        </a>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="rounded bg-black border-white/20 text-cyan-400 focus:ring-0"
            />
            <span>Published</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-mono text-cyan-400 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="rounded bg-black border-white/20 text-cyan-400 focus:ring-0"
            />
            <span>Featured (Slider Utama)</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Judul Proyek</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            placeholder="Real-Time APD Safety Detection System"
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">URL Slug (Unik, Lowercase)</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="apd-safety-detection"
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Kicker Header Tag</label>
          <input
            type="text"
            name="kicker"
            value={formData.kicker}
            onChange={handleChange}
            placeholder="FEATURED // 01 · ARTIFICIAL INTELLIGENCE"
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Kategori</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none cursor-pointer"
          >
            <option value="AI & ML">AI & ML</option>
            <option value="Keamanan">Keamanan</option>
            <option value="Web">Web</option>
            <option value="Kreatif">Kreatif</option>
          </select>
        </div>

        <FileUploader
          label="Thumbnail Foto Proyek"
          value={formData.thumbnail}
          onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
          helpText="Upload cover gambar proyek"
        />

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Teknologi Digunakan (Pisahkan Koma)</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            required
            placeholder="YOLOv8, PyTorch, Python, CUDA, TensorRT"
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Interactive Simulator Engine</label>
          <select
            name="simulatorKey"
            value={formData.simulatorKey}
            onChange={handleChange}
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none cursor-pointer"
          >
            <option value="">None (Standard Specs)</option>
            <option value="apd">APD YOLOv8 Safety Detector</option>
            <option value="osint">OSINT Threat Intelligence Probe</option>
            <option value="globe3d">Earth 3D Geosynchronous Orbit</option>
            <option value="mesh3d">3D Character Rigging & Animation</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Urutan Tampil (Sort Order)</label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">GitHub Repository URL</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Live Demo URL</label>
          <input
            type="url"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-3">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          Technical Specifications Grid (Ditampilkan di Kartu)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <input
            type="text"
            name="specModel"
            value={formData.specModel}
            onChange={handleChange}
            placeholder="MODEL: YOLO & PyTorch"
            className="bg-[#070B12] border border-white/[0.1] rounded px-3 py-1.5 text-white outline-none"
          />
          <input
            type="text"
            name="specAccel"
            value={formData.specAccel}
            onChange={handleChange}
            placeholder="ACCEL: NVIDIA CUDA / TensorRT"
            className="bg-[#070B12] border border-white/[0.1] rounded px-3 py-1.5 text-white outline-none"
          />
          <input
            type="text"
            name="specStream"
            value={formData.specStream}
            onChange={handleChange}
            placeholder="STREAM: RTSP & FFmpeg"
            className="bg-[#070B12] border border-white/[0.1] rounded px-3 py-1.5 text-white outline-none"
          />
          <input
            type="text"
            name="specInference"
            value={formData.specInference}
            onChange={handleChange}
            placeholder="INFERENCE: Python, C++"
            className="bg-[#070B12] border border-white/[0.1] rounded px-3 py-1.5 text-white outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Ringkasan Singkat (Short Description)</label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">Dossier / Deskripsi Lengkap Proyek (Long Description)</label>
        <textarea
          name="longDescription"
          rows={6}
          value={formData.longDescription}
          onChange={handleChange}
          required
          className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none resize-y leading-relaxed"
        />
      </div>

      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
        <a
          href="/admin/projects"
          className="px-5 py-2.5 rounded-lg border border-white/[0.1] text-xs font-mono text-slate-300 hover:text-white"
        >
          Batal
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan ke PostgreSQL...' : isEdit ? 'Simpan Perubahan' : 'Buat Proyek Baru'}</span>
        </button>
      </div>
    </form>
  );
}
