'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface OnboardingStepperProps {
  steps: Step[];
  onComplete: () => void;
  onSkip?: () => void;
  isStepValid?: boolean;
}

export function OnboardingStepper({ 
  steps, 
  onComplete, 
  onSkip,
  isStepValid = true 
}: OnboardingStepperProps) {
  const { onboardingStep, setStep, nextStep, prevStep } = useOnboardingStore();
  const currentStep = steps[onboardingStep] || steps[0];
  const progress = ((onboardingStep + 1) / steps.length) * 100;

  const isLastStep = onboardingStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col min-h-[600px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {currentStep.title}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">
          {currentStep.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-4 mb-10">
        <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Step {onboardingStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* Content */}
      <div className="flex-grow px-4 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full"
          >
            {currentStep.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Sticky Nav */}
      <div className="mt-auto pt-8 pb-4 px-4 sticky bottom-0 bg-white/80 backdrop-blur-md z-10 border-t border-slate-100 sm:relative sm:bg-transparent sm:border-none">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={onboardingStep === 0}
            className={cn(
              "p-4 rounded-2xl flex items-center justify-center transition-all",
              onboardingStep === 0 
                ? "bg-slate-50 text-slate-300 opacity-50 pointer-events-none" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95"
            )}
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex flex-grow gap-3">
            {onSkip && !isLastStep && (
              <button
                onClick={onSkip}
                className="flex-shrink-0 px-6 py-4 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors"
              >
                Skip
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!isStepValid}
              className={cn(
                "flex-grow flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-black text-white transition-all shadow-lg active:scale-[0.98]",
                !isStepValid 
                  ? "bg-slate-300 shadow-none pointer-events-none" 
                  : isLastStep 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" 
                    : "bg-sky-600 hover:bg-sky-700 shadow-sky-200"
              )}
            >
              {isLastStep ? 'Complete Setup' : 'Continue'}
              {isLastStep ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
