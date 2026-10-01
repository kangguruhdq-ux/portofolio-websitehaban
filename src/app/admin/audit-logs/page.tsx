'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Globe2,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Copy,
  Check,
  Eye,
  X,
  Radio,
} from 'lucide-react';

interface AuditLogItem {
  id: string;
  action: string;
  category: string;
  status: string;
  ip: string;
  userAgent: string | null;
  path: string | null;
  method: string | null;
  actor: string | null;
  details: string | null;
  createdAt: string;
}

interface AuditStats {
  totalVisitors: number;
  uniqueVisitorIps: number;
  securityThreatsBlocked: number;
  adminActionsRecorded: number;
  totalEvents: number;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLog, setActiveLog] = useState<AuditLogItem | null>(null);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [categoryFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('limit', '100');

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setLogs(data.logs || []);
        setStats(data.stats || null);
      } else {
        setMessage({ text: data.error || 'Gagal memuat log audit', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleDeleteSingle = async (id: string) => {
    if (!confirm('Hapus entri audit log ini?')) return;
    try {
      const res = await fetch(`/api/admin/audit-logs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLogs(logs.filter((l) => l.id !== id));
        setMessage({ text: 'Log berhasil dihapus', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Gagal menghapus log', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    }
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      const res = await fetch('/api/admin/audit-logs?all=true', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLogs([]);
        setShowConfirmModal(false);
        setMessage({ text: data.message || 'Seluruh audit log berhasil dihapus', type: 'success' });
        fetchLogs();
      } else {
        setMessage({ text: data.error || 'Gagal menghapus seluruh audit log', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BLOCKED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'WARNING':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'FAILED':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'SUCCESS':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'SECURITY':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
      case 'VISITOR':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20';
      case 'AUTH':
        return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
      case 'CRUD':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      default:
        return 'text-slate-400 border-white/[0.1] bg-white/[0.04]';
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Audit Logs & Cyber Security Sentinel"
        action={
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={logs.length === 0}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All Audits</span>
          </button>
        }
      />

      {message && (
        <div
          className={`p-4 rounded-xl font-mono text-xs flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Realtime Live Database Metrics Banner (Zero Mock / All Live From DB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-cyan-500/25 space-y-2 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase">Total Real Visitors</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats ? stats.totalVisitors : '...'}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>DATA ASLI NEON DB (NO SIMULATION)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-emerald-500/25 space-y-2 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase">Unique Visitor IPs</span>
            <Globe2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats ? stats.uniqueVisitorIps : '...'}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ALAMAT IP ASLI TERVERIFIKASI</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-rose-500/25 space-y-2 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase">Attacks Blocked (WAF)</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {stats ? stats.securityThreatsBlocked : '...'}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>SQLi, XSS, SCANNERS BLOCKED</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070B12]/90 border border-purple-500/25 space-y-2 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase">Admin Operations</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats ? stats.adminActionsRecorded : '...'}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>MUTASI DATA TERVERIFIKASI</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-4 rounded-2xl bg-[#070B12]/90 border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'SEMUA' },
            { id: 'VISITOR', label: 'PENGUNJUNG WEB' },
            { id: 'SECURITY', label: 'KEAMANAN SIBER' },
            { id: 'AUTH', label: 'AUTENTIKASI' },
            { id: 'CRUD', label: 'ADMIN CRUD' },
            { id: 'SYSTEM', label: 'SISTEM' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari IP, aksi, path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050811] border border-white/[0.1] rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer"
            title="Refresh / Cari"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#070B12]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="data-table-wrap">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A0F1A] border-b border-white/[0.08] text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold uppercase">Waktu (WIB)</th>
                <th className="py-3.5 px-4 font-semibold uppercase">IP Pengunjung</th>
                <th className="py-3.5 px-4 font-semibold uppercase">Aksi / Event</th>
                <th className="py-3.5 px-4 font-semibold uppercase">Kategori</th>
                <th className="py-3.5 px-4 font-semibold uppercase">Status</th>
                <th className="py-3.5 px-4 font-semibold uppercase">Target Path</th>
                <th className="py-3.5 px-4 font-semibold uppercase text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Memuat rekaman audit dari database Neon...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada rekaman audit yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(log.createdAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    {/* IP Address with Copy button */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#050811] border border-cyan-500/20 text-cyan-300 font-bold text-[11px]">
                        <span>{log.ip}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyIp(log.ip)}
                          className="text-slate-500 hover:text-cyan-300 transition-colors p-0.5"
                          title="Salin IP"
                        >
                          {copiedIp === log.ip ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {log.action}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getCategoryBadge(log.category)}`}>
                        {log.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>

                    {/* Path */}
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate text-[11px]">
                      {log.path || '-'}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveLog(log)}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors"
                          title="Lihat Detail Log"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSingle(log.id)}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Hapus Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#070B14] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#090F1C] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-bold text-white uppercase">Telemetri Audit Log: {activeLog.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveLog(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-slate-300">
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-[#04060C] border border-white/[0.06] space-y-1">
                  <span className="text-slate-500 uppercase">IP Pengunjung:</span>
                  <div className="text-cyan-300 font-bold text-xs">{activeLog.ip}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#04060C] border border-white/[0.06] space-y-1">
                  <span className="text-slate-500 uppercase">Aktor:</span>
                  <div className="text-white font-bold">{activeLog.actor || 'GUEST'}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#04060C] border border-white/[0.06] space-y-1">
                  <span className="text-slate-500 uppercase">Metode & Path:</span>
                  <div className="text-emerald-400 font-bold">{activeLog.method} {activeLog.path || '/'}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#04060C] border border-white/[0.06] space-y-1">
                  <span className="text-slate-500 uppercase">Status & Kategori:</span>
                  <div className="font-bold text-white">{activeLog.status} // {activeLog.category}</div>
                </div>
              </div>

              {/* User Agent */}
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] uppercase">User-Agent Header:</span>
                <div className="p-3 rounded-xl bg-[#04060C] border border-white/[0.06] text-[11px] text-slate-300 break-all leading-relaxed">
                  {activeLog.userAgent || 'Tidak tersedia (Direct / Server hit)'}
                </div>
              </div>

              {/* Details / Payload */}
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] uppercase">Rincian / Data Payload:</span>
                <pre className="p-3.5 rounded-xl bg-[#04060C] border border-white/[0.06] text-[11px] text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                  {activeLog.details || 'Tidak ada data rincian tambahan.'}
                </pre>
              </div>

              <div className="text-right text-[10px] text-slate-500">
                Dicatat pada: {new Date(activeLog.createdAt).toISOString()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#090F1C] border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLog(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-mono text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0A0D17] border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Konfirmasi Hapus Seluruh Audit Log</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tindakan ini akan <strong>menghapus seluruh rekaman audit log</strong> secara permanen dari database PostgreSQL.
              Semua riwayat kunjungan dan deteksi serangan sebelumnya akan dibersihkan.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeletingAll}
                className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={isDeletingAll}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingAll ? 'Menghapus...' : 'Ya, Hapus Semua'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
