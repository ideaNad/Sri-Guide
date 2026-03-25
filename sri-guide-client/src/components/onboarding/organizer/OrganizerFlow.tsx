'use client';

import * as React from 'react';
import { Building2, Globe, FileText, CheckCircle } from 'lucide-react';

interface OrganizerFlowProps {
  data: any;
  setData: (data: any) => void;
  step: number;
}

export function OrganizerFlow({ data, setData, step }: OrganizerFlowProps) {
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-200">
          <Building2 className="w-6 h-6 text-orange-600" />
          <p className="text-sm text-orange-900 font-medium">Tell us about your organization or brand.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Organization Name</label>
            <input 
              type="text" 
              placeholder="e.g. Adventure Sri Lanka" 
              value={data.organizationName || ''}
              onChange={(e) => setData({ organizationName: e.target.value })}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Website (Optional)</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="url" 
                placeholder="https://yourwebsite.com" 
                value={data.website || ''}
                onChange={(e) => setData({ website: e.target.value })}
                className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-200">
          <FileText className="w-6 h-6 text-orange-600" />
          <p className="text-sm text-orange-900 font-medium">Share your mission and what kind of events you organize.</p>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">About Your Organization</label>
          <textarea 
            placeholder="We organize the best surfing competitions and beach parties in Weligama..." 
            value={data.bio || ''}
            onChange={(e) => setData({ bio: e.target.value })}
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none min-h-[160px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center py-8">
      <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-4">
        <CheckCircle className="w-12 h-12 text-emerald-600" />
      </div>
      <h3 className="text-2xl font-black text-slate-900">Ready to Host!</h3>
      <p className="text-slate-500 max-w-sm mx-auto">
        Your organizer profile is set up. You can now start creating events and managing your community.
      </p>
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left mt-8">
        <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Profile Summary</h4>
        <div className="space-y-2">
          <p className="font-bold text-slate-900">{data.organizationName}</p>
          <p className="text-sm text-slate-500 truncate">{data.website || 'No website provided'}</p>
        </div>
      </div>
    </div>
  );
}
