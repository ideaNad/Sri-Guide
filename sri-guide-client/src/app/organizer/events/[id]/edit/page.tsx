'use client';

import * as React from 'react';
import EventForm from '@/components/forms/EventForm';
import { useParams } from 'next/navigation';

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 italic uppercase tracking-tight">Edit Event</h1>
        <p className="text-slate-500 font-medium">Update your event details and refine the experience.</p>
      </div>
      
      <EventForm eventId={id} />
    </div>
  );
}
