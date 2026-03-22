'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Compass, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const locationOptions = [
  { id: 'central', label: 'Central Highlands', description: 'Kandy, Ella, Nuwara Eliya', icon: <Compass className="w-5 h-5" /> },
  { id: 'south', label: 'Southern Coast', description: 'Galle, Mirissa, Unawatuna', icon: <Navigation className="w-5 h-5" /> },
  { id: 'north', label: 'Northern Region', description: 'Jaffna, Mannar', icon: <Globe className="w-5 h-5" /> },
  { id: 'east', label: 'Eastern Coast', description: 'Trincomalee, Arugam Bay', icon: <MapPin className="w-5 h-5" /> },
];

interface LocationFormProps {
  selectedLocation: string;
  onChange: (location: string) => void;
}

export function LocationForm({ selectedLocation, onChange }: LocationFormProps) {
  return (
    <div className="space-y-3">
      {locationOptions.map((option) => {
        const isSelected = selectedLocation === option.id;
        return (
          <motion.button
            key={option.id}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex w-full items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              isSelected 
                ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm" 
                : "bg-white border-slate-50 text-slate-500 hover:border-slate-100"
            )}
          >
            <div className={cn(
              "p-2.5 rounded-lg transition-colors",
              isSelected ? "bg-sky-100" : "bg-slate-100"
            )}>
              {option.icon}
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight">{option.label}</h4>
              <p className="text-xs opacity-60 font-medium">{option.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
