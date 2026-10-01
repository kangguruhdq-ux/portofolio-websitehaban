import React from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { ProjectForm } from '../project-form';

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Tambah Proyek Baru" />
      <ProjectForm />
    </div>
  );
}
