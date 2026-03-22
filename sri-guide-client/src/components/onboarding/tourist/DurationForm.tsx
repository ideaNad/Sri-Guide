'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const durationOptions = [
  { id: 'short', label: 'Short Trip', description: '1 - 3 days', icon: <Sun className="w-6 h-6" /> },
  { id: 'medium', label: 'Week Long', description: '4 - 7 days', icon: <Calendar className="w-6 h-6" /> },
  { id: 'long', label: 'Explorer', description: '8 - 14 days', icon: <Clock className="w-6 h-6" /> },
  { id: 'extended', label: 'Deep Dive', description: '15+ days', icon: <Moon className="w-6 h-6" /> },
];

interface DurationFormProps {
  selectedDuration: string;
  onChange: (duration: string) => void;
}

export function DurationForm({ selectedDuration, onChange }: DurationFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {durationOptions.map((option) => {
        const isSelected = selectedDuration === option.id;
        return (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
              isSelected 
                ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm" 
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
            )}
          >
            <div className={cn(
              "p-3 rounded-xl transition-colors",
              isSelected ? "bg-emerald-100" : "bg-slate-50"
            )}>
              {option.icon}
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">{option.label}</h4>
              <p className="text-sm opacity-60 font-medium">{option.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
