"use client";

import React, { useState } from "react";
import { Lock, Phone, Mail, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

interface ProtectedContactProps {
  type: "phone" | "email" | "whatsapp";
  value: string;
  label?: string;
}

const ProtectedContact: React.FC<ProtectedContactProps> = ({ type, value, label }) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const icons = {
    phone: <Phone size={16} />,
    email: <Mail size={16} />,
    whatsapp: <MessageSquare size={16} />,
  };

  const getMaskedValue = () => {
    if (type === "email") return "••••••••@••••.com";
    if (type === "phone" || type === "whatsapp") return "+94 •• ••• ••••";
    return "••••••••";
  };

  if (user) {
    return (
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <span className="text-primary">{icons[type]}</span>
        <span>{value}</span>
      </div>
    );
  }

  return (
    <>
      <div 
        onClick={() => setIsAuthModalOpen(true)}
        className="group relative flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 cursor-pointer transition-all overflow-hidden"
      >
        <span className="text-gray-400 group-hover:text-primary transition-colors">{icons[type]}</span>
        <span className="text-gray-400 blur-[3px] select-none group-hover:blur-[2px] transition-all">
          {getMaskedValue()}
        </span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-[2px]">
          <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-white shadow-sm border border-primary/20 rounded-full px-2 py-1 uppercase tracking-tighter">
             <Lock size={10} />
             <span>Sign in to view</span>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {}} // Success is handled by AuthContext
      />
    </>
  );
};

export default ProtectedContact;
