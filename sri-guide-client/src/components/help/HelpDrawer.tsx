'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, HelpCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpItem {
  title: string;
  description: string;
  action?: () => void;
}

interface HelpDrawerProps {
  title: string;
  description: string;
  items: HelpItem[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HelpDrawer({ 
  title, 
  description, 
  items, 
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: HelpDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>
          {trigger}
        </DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal forceMount>
        <AnimatePresence>
          {open && (
            <>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[20px] bg-white p-6 shadow-xl outline-none focus:ring-0 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-auto sm:w-[380px] sm:rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <DialogPrimitive.Title className="text-xl font-bold text-slate-900">
                      {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                      <X className="h-5 w-5 text-slate-500" />
                    </DialogPrimitive.Close>
                  </div>
                  
                  <DialogPrimitive.Description className="mb-6 text-sm text-slate-500">
                    {description}
                  </DialogPrimitive.Description>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-4 text-left transition-all hover:bg-slate-50 active:scale-[0.98]"
                      >
                        <div>
                          <h4 className="font-semibold text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-3 rounded-2xl bg-sky-50 p-4">
                    <div className="rounded-full bg-sky-100 p-2">
                      <HelpCircle className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-sky-900">Need more help?</h4>
                      <p className="text-xs text-sky-700">Chat with our 24/7 support team.</p>
                    </div>
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
