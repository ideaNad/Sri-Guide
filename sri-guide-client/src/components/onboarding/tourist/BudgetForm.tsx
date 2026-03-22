'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, Coins, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const budgetOptions = [
  { id: 'economy', label: 'Economy', description: 'Budget-friendly options', icon: <Coins className="w-6 h-6" />, range: '$0 - $1000' },
  { id: 'standard', label: 'Standard', description: 'Comfortable balance', icon: <CircleDollarSign className="w-6 h-6" />, range: '$1000 - $3000' },
  { id: 'luxury', label: 'Luxury', description: 'Premium experiences', icon: <Landmark className="w-6 h-6" />, range: '$3000+' },
];

interface BudgetFormProps {
  selectedBudget: string;
  onChange: (budget: string) => void;
}

export function BudgetForm({ selectedBudget, onChange }: BudgetFormProps) {
  return (
    <div className="space-y-4">
      {budgetOptions.map((option) => {
        const isSelected = selectedBudget === option.id;
        return (
          <motion.button
            key={option.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex w-full items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
              isSelected 
                ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm" 
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
            )}
          >
            <div className={cn(
              "p-3 rounded-xl transition-colors",
              isSelected ? "bg-sky-100" : "bg-slate-50"
            )}>
              {option.icon}
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-lg leading-tight">{option.label}</h4>
              <p className="text-sm opacity-60 font-medium">{option.description}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase text-sky-600/50 bg-sky-50 px-2 py-1 rounded-lg">
                {option.range}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
