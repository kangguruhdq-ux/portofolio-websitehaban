'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, X } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  helpText?: string;
}

export function FileUploader({
  label,
  value,
  onChange,
  accept = 'image/*',
  placeholder = '/images/...',
  helpText,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', file.name);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Gagal mengupload file.');
      }
    } catch {
      setError('Kesalahan jaringan saat mengupload file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isImage = value && (
    value.endsWith('.jpg') ||
    value.endsWith('.jpeg') ||
    value.endsWith('.png') ||
    value.endsWith('.webp') ||
    value.endsWith('.svg') ||
    value.includes('/uploads/') ||
    value.startsWith('data:image/')
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">
          {label}
        </label>
        {helpText && <span className="text-[10px] font-mono text-slate-400">{helpText}</span>}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Preview thumbnail if image */}
        {value && isImage ? (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/[0.15] bg-black/60 flex-shrink-0 group">
            {value.startsWith('data:image/') || value.endsWith('.svg') ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Image
                src={value}
                alt="Preview"
                fill
                sizes="56px"
                className="object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
              title="Hapus / Reset"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        {/* Text Input for URL */}
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#030508] border border-white/[0.12] focus:border-cyan-400 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none"
          />

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-1.5 whitespace-nowrap transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload File</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
