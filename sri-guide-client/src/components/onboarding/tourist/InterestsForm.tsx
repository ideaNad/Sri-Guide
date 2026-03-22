'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Compass, Camera, Utensils, Waves, Mountain, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const interestCategories = [
  { id: 'nature', label: 'Nature', icon: <Mountain className="w-5 h-5" /> },
  { id: 'culture', label: 'Culture', icon: <Landmark className="w-5 h-5" /> },
  { id: 'beach', label: 'Beach', icon: <Waves className="w-5 h-5" /> },
  { id: 'food', label: 'Food', icon: <Utensils className="w-5 h-5" /> },
  { id: 'adventure', label: 'Adventure', icon: <Compass className="w-5 h-5" /> },
  { id: 'photography', label: 'Photography', icon: <Camera className="w-5 h-5" /> },
];

interface InterestsFormProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
}

export function InterestsForm({ selectedInterests, onChange }: InterestsFormProps) {
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      onChange(selectedInterests.filter((i) => i !== id));
    } else {
      onChange([...selectedInterests, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {interestCategories.map((item) => {
        const isSelected = selectedInterests.includes(item.id);
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleInterest(item.id)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all",
              isSelected 
                ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm" 
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
            )}
          >
            <div className={cn(
              "p-3 rounded-xl transition-colors",
              isSelected ? "bg-sky-100" : "bg-slate-50"
            )}>
              {item.icon}
            </div>
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
