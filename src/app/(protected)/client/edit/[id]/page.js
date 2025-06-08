'use client';

import UpdateClient from '@/components/clients/UpdateClient';

export default function EditPage({ params }) {
  return (
      <>
          <div className="px-4 lg:px-6">
          <UpdateClient clientId={params.id} />
          
          </div>
        </>
  );
}
