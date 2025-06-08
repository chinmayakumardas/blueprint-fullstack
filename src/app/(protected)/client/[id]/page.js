'use client';

import  ClientDetails from '@/components/clients/ClientDetails';

export default function Page({ params }) {
  return (
    
    <>
      <div className="px-4 lg:px-6">
    <ClientDetails clientId={params.id} />
      
      </div>
    </>
  );
}
