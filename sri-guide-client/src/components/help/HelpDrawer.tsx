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

type Category = 'all' | 'tourist' | 'guide' | 'agency' | 'restaurant' | 'organizer';

const WhatsAppIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.4 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.7 2.8-3.3 3.7-5.7 5.5-9.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

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
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Organizer', value: 'organizer' },
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
                              <WhatsAppIcon size={18} />
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

