import React from 'react';
import { prisma } from '@/lib/db';
import { Cpu, Shield, Globe, Box, Terminal, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Matriks Kemahiran & Technical Skills',
  description: 'Daftar kompetensi teknikal Mahabbah Mahabban Romadhon: Machine Learning, Computer Vision, Cyber Security CBBH, Full-Stack Web Development.',
};

export default async function SkillsPage() {
  let skills: any[] = [];
  try {
    skills = await prisma.skill.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching skills:', e);
  }

  if (skills.length === 0) {
    skills = [
      { id: 'sk_python', name: 'Python', category: 'AI & Backend', proficiency: 95 },
      { id: 'sk_pytorch', name: 'PyTorch & Deep Learning', category: 'AI & Backend', proficiency: 92 },
      { id: 'sk_yolo', name: 'YOLOv8 & Computer Vision', category: 'AI & Backend', proficiency: 90 },
      { id: 'sk_cbbh', name: 'Bug Bounty & Web Security (CBBH)', category: 'Cyber Security', proficiency: 94 },
      { id: 'sk_burp', name: 'Burp Suite & Penetration Testing', category: 'Cyber Security', proficiency: 92 },
      { id: 'sk_react', name: 'ReactJS & Next.js 14', category: 'Web Development', proficiency: 95 },
      { id: 'sk_ts', name: 'TypeScript', category: 'Web Development', proficiency: 92 },
      { id: 'sk_tailwind', name: 'Tailwind CSS', category: 'Web Development', proficiency: 96 },
      { id: 'sk_node', name: 'Node.js & Express', category: 'Web Development', proficiency: 88 },
      { id: 'sk_htmlcss', name: 'HTML5 & Modern CSS', category: 'Web Development', proficiency: 98 },
      { id: 'sk_js', name: 'JavaScript (ES6+)', category: 'Web Development', proficiency: 95 },
      { id: 'sk_supabase', name: 'Supabase & PostgreSQL', category: 'Backend & Cloud', proficiency: 90 },
      { id: 'sk_vercel', name: 'Vercel Deployment', category: 'Backend & Cloud', proficiency: 92 },
      { id: 'sk_figma', name: 'Figma UI/UX Design', category: 'Design & Creative', proficiency: 90 },
      { id: 'sk_sfm', name: 'Source Filmmaker (SFM 3D)', category: 'Design & Creative', proficiency: 88 },
      { id: 'sk_prisma3d', name: 'Prisma3D Mobile 3D Modeling', category: 'Design & Creative', proficiency: 85 },
      { id: 'sk_mikrotik', name: 'MikroTik & Splicing Fiber Optic', category: 'Network Infrastructure', proficiency: 90 },
    ];
  }

  // Group by category
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const getCategoryIcon = (cat: string) => {
    if (cat.includes('AI') || cat.includes('Machine')) return <Cpu className="w-4 h-4 text-cyan-400" />;
    if (cat.includes('Security') || cat.includes('Cyber')) return <Shield className="w-4 h-4 text-purple-400" />;
    if (cat.includes('Web') || cat.includes('Full-Stack')) return <Globe className="w-4 h-4 text-emerald-400" />;
    return <Box className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="pt-28 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          // CAPABILITIES MATRIX // {skills.length} VERIFIED STACKS
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Kompetensi & Ekosistem Teknologi
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-light">
          Evaluasi proficiency dan domain keahlian rekayasa, mulai dari arsitektur model deep learning hingga hardening infrastruktur server dan aplikasi web.
        </p>
      </div>

      {/* Categories Sections */}
      <div className="space-y-10">
        {categories.map((category) => {
          const categorySkills = skills.filter((s) => s.category === category);
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                {getCategoryIcon(category)}
                <h2 className="text-base font-mono font-bold text-white tracking-wide uppercase">
                  {category}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  ({categorySkills.length} tools)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-5 rounded-2xl bg-[#070B12]/80 border border-white/[0.08] hover:border-cyan-400/40 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {skill.proficiency}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/[0.05]">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
