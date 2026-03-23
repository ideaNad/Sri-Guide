'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, HelpCircle, ChevronRight, Search, ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpItem, CONTACT_INFO } from '@/constants/HelpData';

interface HelpDrawerProps {
  title: string;
  description: string;
  items: HelpItem[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type Category = 'all' | 'tourist' | 'guide' | 'agency';

export function HelpDrawer({ 
  title, 
  description, 
  items, 
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: HelpDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<Category>('all');
  const [selectedItem, setSelectedItem] = React.useState<HelpItem | null>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: { label: string; value: Category }[] = [
    { label: 'All', value: 'all' },
    { label: 'Tourist', value: 'tourist' },
    { label: 'Guide', value: 'guide' },
    { label: 'Agency', value: 'agency' },
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => {
      setOpen(o);
      if (!o) {
        setSelectedItem(null);
        setSearchQuery('');
        setSelectedCategory('all');
      }
    }}>
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
                  className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 z-[101] flex w-full flex-col bg-white p-6 shadow-2xl outline-none focus:ring-0 sm:w-[420px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    {selectedItem ? (
                      <button 
                        onClick={() => setSelectedItem(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Back</span>
                      </button>
                    ) : (
                      <DialogPrimitive.Title className="text-2xl font-black text-slate-900 italic tracking-tight">
                        {title}
                      </DialogPrimitive.Title>
                    )}
                    <DialogPrimitive.Close className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                      <X className="h-5 w-5 text-slate-500" />
                    </DialogPrimitive.Close>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!selectedItem ? (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col h-full overflow-hidden"
                      >
                        <DialogPrimitive.Description className="mb-6 text-sm text-slate-500 leading-relaxed italic">
                          {description}
                        </DialogPrimitive.Description>

                        {/* Search */}
                        <div className="relative mb-6 group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <input 
                            type="text"
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                          />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                          {categories.map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => setSelectedCategory(cat.value)}
                              className={cn(
                                "whitespace-nowrap rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-all",
                                selectedCategory === cat.value 
                                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                              )}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mt-4 custom-scrollbar">
                          {filteredItems.length > 0 ? (
                            <motion.div
                              initial="hidden"
                              animate="show"
                              variants={{
                                hidden: { opacity: 0 },
                                show: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.05
                                  }
                                }
                              }}
                              className="space-y-3"
                            >
                              {filteredItems.map((item, index) => (
                                <motion.button
                                  key={index}
                                  variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    show: { opacity: 1, y: 0 }
                                  }}
                                  onClick={() => setSelectedItem(item)}
                                  className="flex w-full items-center justify-between rounded-2xl border border-slate-50 p-5 text-left transition-all hover:bg-slate-50 group hover:border-primary/10 shadow-sm hover:shadow-md"
                                >
                                  <div>
                                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-2 italic">{item.description}</p>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </motion.button>
                              ))}
                            </motion.div>
                          ) : (
                            <div className="py-12 text-center">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-6 w-6 text-slate-300" />
                              </div>
                              <p className="text-slate-500 text-sm font-medium">No results found for "{searchQuery}"</p>
                            </div>
                          )}
                        </div>

                        {/* Support Options */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Direct Support</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <a 
                              href={`mailto:${CONTACT_INFO.email}`}
                              className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                            >
                              <Mail size={18} />
                              <span className="text-xs font-black uppercase">Email</span>
                            </a>
                            <a 
                              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                              target="_blank"
                              className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <MessageCircle size={18} />
                              <span className="text-xs font-black uppercase">WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col h-full"
                      >
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                          <div className="mb-6">
                            <h3 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tight">{selectedItem.title}</h3>
                            <p className="text-slate-500 italic leading-relaxed">{selectedItem.description}</p>
                          </div>
                          
                          <div className="prose prose-slate max-w-none">
                            <div className="rounded-3xl bg-slate-50 p-8 text-slate-700 leading-relaxed font-medium italic whitespace-pre-line border border-slate-100 shadow-sm">
                              {selectedItem.content}
                            </div>
                          </div>

                          <div className="mt-12 bg-gray-900 text-white p-8 rounded-[2rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl" />
                            <h4 className="text-xl font-black mb-3 italic tracking-tight uppercase">Still confused?</h4>
                            <p className="text-gray-400 text-sm font-medium mb-6 italic leading-relaxed">Our team is available 24/7 to help you with anything you need.</p>
                            <a 
                              href="/contact"
                              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-xl shadow-primary/20"
                            >
                              Contact Official Support
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

