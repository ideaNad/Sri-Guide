"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, HelpCircle, X } from "lucide-react";
import { useConfirmStore } from "@/store/useConfirmStore";

export const ConfirmBottomSheet = () => {
    const { isOpen, options, onConfirm, onCancel } = useConfirmStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center p-0 sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
                    >
                        {/* Drag Handle (Mobile) */}
                        <div className="flex justify-center py-4 sm:hidden">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full" />
                        </div>

                        <div className="p-10 md:p-12">
                            <button 
                                onClick={onCancel}
                                className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center
                                    ${options.variant === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-primary/10 text-primary'}
                                `}>
                                    {options.variant === 'danger' ? <AlertCircle size={24} /> : <HelpCircle size={24} />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight leading-none">{options.title}</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Please confirm your action</p>
                                </div>
                            </div>

                            <p className="text-gray-500 font-bold mb-10 leading-relaxed">
                                {options.message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all border border-gray-100"
                                >
                                    {options.cancelText || 'Cancel'}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`
                                        flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]
                                        ${options.variant === 'danger' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-gray-900 text-white shadow-gray-200'}
                                    `}
                                >
                                    {options.confirmText || 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
