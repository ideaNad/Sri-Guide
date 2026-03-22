'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, DollarSign, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgencyFlowProps {
  data: any;
  setData: (data: any) => void;
  step: number;
}

export function AgencyFlow({ data, setData, step }: AgencyFlowProps) {
  if (step === 0) {
    return (
      <div className="space-y-6">
        <h4 className="font-bold text-lg mb-4">Business Information</h4>
        <div className="grid grid-cols-1 gap-4">
          <input type="text" placeholder="Agency Name" className="w-full p-4 rounded-xl border border-slate-200" />
          <input type="text" placeholder="Registration Number" className="w-full p-4 rounded-xl border border-slate-200" />
          <select className="w-full p-4 rounded-xl border border-slate-200 bg-white">
            <option value="">Select Business Type</option>
            <option value="tour-operator">Tour Operator</option>
            <option value="travel-agency">Travel Agency</option>
            <option value="transport-provider">Transport Provider</option>
          </select>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="p-8 border-2 border-dashed border-sky-200 rounded-3xl bg-sky-50 flex flex-col items-center gap-4 text-center">
          <Plus className="w-12 h-12 text-sky-600" />
          <div>
            <h4 className="font-bold text-lg">Add Your First Listing</h4>
            <p className="text-sm text-sky-700">Set up your profile and start adding your tour packages.</p>
          </div>
          <button className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl">Create Tour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-sky-300 transition-all cursor-pointer group">
          <Wallet className="w-8 h-8 text-sky-600 mb-4" />
          <h4 className="font-bold text-lg">Subscription</h4>
          <p className="text-sm text-slate-500">Pay a monthly fee and keep 100% of your earnings.</p>
        </div>
        <div className="p-6 rounded-2xl border-2 border-sky-400 bg-sky-50 shadow-sm cursor-pointer">
          <DollarSign className="w-8 h-8 text-sky-600 mb-4" />
          <h4 className="font-bold text-lg">Commission Based</h4>
          <p className="text-sm text-sky-900">List for free and pay only when you get a booking.</p>
        </div>
      </div>
    </div>
  );
}
