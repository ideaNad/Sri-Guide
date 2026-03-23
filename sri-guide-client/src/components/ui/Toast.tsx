"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CheckCircle2, AlertCircle, Info, AlertTriangle, X 
} from "lucide-react";
import { useToastStore, Toast as ToastType } from "@/store/useToastStore";

const icons = {
    success: <CheckCircle2 className="text-green-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
};

const colors = {
    success: "border-green-100 bg-white shadow-green-500/10",
    error: "border-rose-100 bg-white shadow-rose-500/10",
    info: "border-blue-100 bg-white shadow-blue-500/10",
    warning: "border-amber-100 bg-white shadow-amber-500/10",
};

export const Toast = ({ id, type, title, message }: ToastType) => {
    const removeToast = useToastStore((state) => state.removeToast);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
                flex items-start gap-4 p-5 rounded-[2rem] border shadow-2xl min-w-[320px] max-w-md
                ${colors[type]}
            `}
        >
            <div className={`
                w-10 h-10 rounded-2xl flex items-center justify-center shrink-0
                ${type === 'success' ? 'bg-green-50' : type === 'error' ? 'bg-rose-50' : type === 'info' ? 'bg-blue-50' : 'bg-amber-50'}
            `}>
                {icons[type]}
            </div>
            
            <div className="flex-1 pt-1">
                {title && <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight italic mb-1">{title}</h4>}
                <p className="text-gray-500 text-xs font-bold leading-relaxed">{message}</p>
            </div>

            <button 
                onClick={() => removeToast(id)}
                className="p-2 text-gray-300 hover:text-gray-900 transition-colors bg-gray-50 rounded-xl"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const ToastContainer = () => {
    const toasts = useToastStore((state) => state.toasts);

    return (
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast {...toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
