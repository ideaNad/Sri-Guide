'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, X, ChevronRight } from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { cn } from '@/lib/utils';

export function TranslateBanner() {
  const { translateDismissed, setTranslateDismissed } = useOnboardingStore();

  if (translateDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 inset-x-0 z-[100] p-4 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden flex items-center p-3 sm:p-4 gap-4">
            <div className="flex-shrink-0 bg-white/10 p-2 rounded-xl">
              <Languages className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium leading-tight">
                <span className="hidden sm:inline">We detected your language as English. </span>
                Would you like to translate the site?
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap"
                onClick={() => {
                  // Handle translation logic here
                }}
              >
                Translate
              </button>
              <button
                onClick={() => setTranslateDismissed(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
