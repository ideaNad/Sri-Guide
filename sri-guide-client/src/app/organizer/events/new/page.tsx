'use client';

import * as React from 'react';
import EventForm from '@/components/forms/EventForm';

export default function NewEventPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Create New Event</h1>
        <p className="text-slate-500 font-medium">Set up your event details and host your next experience.</p>
      </div>
      
      <EventForm />
    </div>
  );
}
