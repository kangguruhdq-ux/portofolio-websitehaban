import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { ProjectForm } from '../project-form';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <AdminHeader title={`Edit Proyek: ${project.title}`} />
      <ProjectForm initialData={project} isEdit />
    </div>
  );
}
