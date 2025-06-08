'use client';
import { use } from 'react';
import ProjectEditForm from '@/components/project/ProjectEditForm';



export default function Page({ params }) {
  return (
    <>
      <div className="px-4 lg:px-6">
<ProjectEditForm projectId={params.id} />;
        
      </div>
    </>
  );
}


