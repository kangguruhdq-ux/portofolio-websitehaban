'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RefreshCw, Shield, AlertTriangle, CheckCircle, Terminal, Activity } from 'lucide-react';

export function ProjectSimulatorModal({
  simulatorKey,
  onClose,
}: {
  simulatorKey: string;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'simulator' | 'specs'>('simulator');
  const [isRunning, setIsRunning] = useState(true);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#070B12] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#0A0F1A]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider uppercase">
              {simulatorKey === 'apd' && 'YOLOv8 Real-Time APD Safety Detection Engine'}
              {simulatorKey === 'osint' && 'OSINT Cyber Threat Intelligence Probe'}
              {simulatorKey === 'globe3d' && 'Orbital Geosynchronous Earth 3D Simulation'}
              {simulatorKey === 'mesh3d' && '3D Character Rigging & Animation Inspector'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {simulatorKey === 'apd' && <ApdSimulator isRunning={isRunning} />}
          {simulatorKey === 'osint' && <OsintSimulator isRunning={isRunning} />}
          {simulatorKey === 'globe3d' && <GlobeSimulator />}
          {simulatorKey === 'mesh3d' && <MeshSimulator />}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#0A0F1A] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>HARDWARE ACCELERATION // ACTIVE</span>
          </div>
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 transition-colors flex items-center gap-1.5"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 1. APD Detection Simulator
function ApdSimulator({ isRunning }: { isRunning: boolean }) {
  const [detections, setDetections] = useState([
    { label: 'Safety Helmet', conf: 0.94, status: 'PASSED', color: 'border-emerald-400 text-emerald-400' },
    { label: 'Vest K3', conf: 0.96, status: 'PASSED', color: 'border-emerald-400 text-emerald-400' },
    { label: 'Safety Boots', conf: 0.89, status: 'PASSED', color: 'border-emerald-400 text-emerald-400' },
    { label: 'Zone Protocol', conf: 0.98, status: 'SECURED', color: 'border-cyan-400 text-cyan-400' },
  ]);

  const [fps, setFps] = useState(28);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setFps(27 + Math.floor(Math.random() * 4));
    }, 1500);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-4">
      {/* Video Stream Simulation Canvas */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/[0.1] bg-slate-950 flex items-center justify-center">
        <img
          src="/images/project-apd.jpg"
          alt="CCTV APD Stream"
          className="w-full h-full object-cover"
        />

        {/* Real-time Bounding Box Overlays */}
        <div className="absolute top-[18%] left-[22%] w-[18%] h-[24%] border-2 border-emerald-400 rounded bg-emerald-500/10 flex flex-col justify-between p-1">
          <span className="text-[10px] font-mono bg-emerald-500 text-black px-1 font-bold rounded-sm self-start">
            Helmet 0.94
          </span>
        </div>

        <div className="absolute top-[38%] left-[20%] w-[26%] h-[40%] border-2 border-emerald-400 rounded bg-emerald-500/10 flex flex-col justify-between p-1">
          <span className="text-[10px] font-mono bg-emerald-500 text-black px-1 font-bold rounded-sm self-start">
            Vest K3 0.96
          </span>
        </div>

        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/80 border border-white/[0.1] font-mono text-xs text-white space-y-0.5">
          <div className="text-cyan-400 font-bold">RTSP: CAM_01_CONSTRUCTION_WEST</div>
          <div className="text-[11px] text-slate-400">FPS: {fps} · Latency: 18ms · Model: YOLOv8-Custom</div>
        </div>
      </div>

      {/* Real-time Detection Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {detections.map((d) => (
          <div
            key={d.label}
            className="p-3 rounded-xl bg-[#0D131F] border border-white/[0.08] font-mono space-y-1"
          >
            <div className="text-[10px] text-slate-400 uppercase">{d.label}</div>
            <div className="text-sm font-bold text-white flex items-center justify-between">
              <span>{Math.round(d.conf * 100)}%</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${d.color}`}>
                {d.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. OSINT Threat Intelligence Simulator
function OsintSimulator({ isRunning }: { isRunning: boolean }) {
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Establishing secure socket to OSINT correlation engine...',
    '[DNS] Resolving target ASN infrastructure & reverse WHOIS records...',
    '[PORT] Scanning ports 80, 443, 8080, 8443, 9000 across perimeter...',
    '[CERT] Analyzing Certificate Transparency (CT) logs: 14 hostnames discovered.',
    '[VULN] Testing SSL/TLS cipher suites: TLS 1.3 enforced, no weak ciphers.',
    '[SHODAN] Correlating public telemetry: 0 open database ports detected.',
    '[DETIKCOM_AUDIT] Verified responsible disclosure finding mitigations active.',
  ]);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-black border border-white/[0.1] font-mono text-xs space-y-2 max-h-[320px] overflow-y-auto">
        <div className="text-cyan-400 font-bold pb-2 border-b border-white/[0.08] flex items-center justify-between">
          <span>TARGET AUDIT // PERIMETER TELEMETRY</span>
          <span className="text-[10px] text-emerald-400">SCANNER ACTIVE</span>
        </div>
        {logs.map((log, i) => (
          <div key={i} className="text-slate-300 leading-relaxed">
            <span className="text-cyan-500 mr-2">&gt;</span>
            {log}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#0D131F] border border-white/[0.08]">
          <div className="text-slate-400 text-[10px]">RISK SCORE</div>
          <div className="text-emerald-400 text-lg font-bold">LOW // SECURE</div>
        </div>
        <div className="p-3 rounded-xl bg-[#0D131F] border border-white/[0.08]">
          <div className="text-slate-400 text-[10px]">HOSTS MAPPED</div>
          <div className="text-white text-lg font-bold">14 ASSETS</div>
        </div>
        <div className="p-3 rounded-xl bg-[#0D131F] border border-white/[0.08]">
          <div className="text-slate-400 text-[10px]">REPORT STATUS</div>
          <div className="text-cyan-400 text-lg font-bold">VERIFIED</div>
        </div>
      </div>
    </div>
  );
}

// 3. Globe 3D Simulation
function GlobeSimulator() {
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/[0.1] bg-black relative flex items-center justify-center">
      <img
        src="/images/project-web3d.jpg"
        alt="Earth 3D Simulation"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping mb-3" />
        <h4 className="text-white text-lg font-bold mb-1">Geosynchronous Orbit 3D Telemetry</h4>
        <p className="text-xs text-slate-300 max-w-md">
          Three.js procedural atmosphere, normal bump terrain displacement, and real-time cloud rotation shaders.
        </p>
      </div>
    </div>
  );
}

// 4. Mesh 3D Simulator
function MeshSimulator() {
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/[0.1] bg-black relative flex items-center justify-center">
      <img
        src="/images/project-anim3d.jpg"
        alt="3D Character Rigging"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center font-mono">
        <h4 className="text-white text-lg font-bold mb-1">Source Filmmaker & Prisma3D Rigging</h4>
        <p className="text-xs text-slate-300 max-w-md">
          Dual IK/FK kinematics, bone weight painting, cinematic three-point keyframe lighting.
        </p>
      </div>
    </div>
  );
}
