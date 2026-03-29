"use client";

import React from "react";
import { useAuth } from "@/providers/AuthContext";
import { UserMinus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImpersonationBanner = () => {
  const { user, logout } = useAuth();

  if (!user?.isImpersonated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-secondary text-white py-2 px-4 shadow-lg flex items-center justify-center gap-4"
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-white animate-pulse" />
          <p className="text-sm font-bold">
            ADMIN VIEW: You are currently impersonating <span className="underline">{user.fullName}</span> ({user.role})
          </p>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-1.5 bg-white text-secondary px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-sm active:scale-95"
        >
          <UserMinus size={14} />
          <span>Stop Impersonating</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImpersonationBanner;
