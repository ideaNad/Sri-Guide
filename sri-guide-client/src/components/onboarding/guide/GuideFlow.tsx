'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, DollarSign, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuideFlowProps {
  data: any;
  setData: (data: any) => void;
  step: number;
}

export function GuideFlow({ data, setData, step }: GuideFlowProps) {
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-6 p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white hover:border-sky-300 transition-colors cursor-pointer group">
          <div className="p-4 bg-slate-50 rounded-full group-hover:bg-sky-50 transition-colors">
            <User className="w-12 h-12 text-slate-400 group-hover:text-sky-600" />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-lg mb-1">Upload Profile Photo</h4>
            <p className="text-sm text-slate-500">Guides with photos get 3x more bookings.</p>
          </div>
          <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm">
            Select Image
          </button>
        </div>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Your full name" 
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <textarea 
            placeholder="Tell us about yourself..." 
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none min-h-[120px]"
          />
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-200">
          <MapPin className="w-6 h-6 text-amber-600" />
          <p className="text-sm text-amber-900 font-medium">Add your first trip to start earning.</p>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Trip Title (e.g. Ella Nine Arches Sunset)" className="w-full p-4 rounded-xl border border-slate-200" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Location" className="w-full p-4 rounded-xl border border-slate-200" />
            <input type="text" placeholder="Duration (hours)" className="w-full p-4 rounded-xl border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
        <DollarSign className="w-6 h-6 text-emerald-600" />
        <p className="text-sm text-emerald-900 font-medium">Set your daily or hourly rate.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-grow">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="number" placeholder="0.00" className="w-full p-4 pl-12 rounded-xl border border-slate-200 text-2xl font-black" />
        </div>
        <select className="p-4 rounded-xl border border-slate-200 font-bold bg-white">
          <option>per Hour</option>
          <option>per Day</option>
          <option>per Trip</option>
        </select>
      </div>
    </div>
  );
}
