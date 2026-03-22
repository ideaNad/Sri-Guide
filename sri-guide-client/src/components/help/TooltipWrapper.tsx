'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TooltipWrapperProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function TooltipWrapper({ 
  content, 
  children, 
  className,
  showIcon = false 
}: TooltipWrapperProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button 
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-sm",
              className
            )}
          >
            {children}
            {showIcon && <HelpCircle className="w-4 h-4 text-slate-400" />}
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={5}
            className="z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[250px]"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-slate-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
