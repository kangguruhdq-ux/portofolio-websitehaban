import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalProjects,
      publishedProjects,
      featuredProjects,
      totalSkills,
      totalCertificates,
      totalExperiences,
      totalEducations,
      totalLogs,
      totalMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.skill.count(),
      prisma.certificate.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.visitorLog.count(),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        publishedProjects,
        featuredProjects,
        totalSkills,
        totalCertificates,
        totalExperiences,
        totalEducations,
        totalLogs,
        totalMessages,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
