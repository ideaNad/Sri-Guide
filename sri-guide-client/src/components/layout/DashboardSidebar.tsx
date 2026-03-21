"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackModal from "@/features/feedback/components/FeedbackModal";
import { 
    LayoutDashboard, User, Settings, ShieldCheck, 
    MessageSquare, Heart, Compass, LogOut, X as CloseIcon,
    AlertCircle
} from "lucide-react";

interface DashboardSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const DASHBOARD_LINKS = [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "My Profile", href: "/dashboard/profile", icon: <User size={18} /> },
    { label: "Saved Tours", href: "/dashboard/saved", icon: <Heart size={18} /> },
    { label: "Find Guides", href: "/guides", icon: <Compass size={18} /> },
];

export default function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const SidebarContent = () => {
        const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

        return (
            <div className="flex flex-col h-full bg-white border-r border-gray-100 overflow-y-auto w-80 relative">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 px-8 py-8 border-b border-gray-50 flex items-center justify-between">
                    <Link href="/" className="relative flex flex-col items-start h-8 md:h-10 z-10 px-1">
                        <img
                            src="/logo.svg"
                            alt="Sri Guide Logo"
                            className="absolute left-0 h-40 md:h-44 w-auto transition-all duration-500 object-contain max-w-none"
                        />
                    </Link>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-xl"
                    >
                        <CloseIcon size={20} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-6 py-8 space-y-2">
                    <h3 className="px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                        Menu
                    </h3>
                    {DASHBOARD_LINKS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group flex-shrink-0 ${
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-gray-500 hover:bg-primary/5 hover:text-primary"
                                }`}
                            >
                                <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-primary transition-colors"}>
                                    {item.icon}
                                </span>
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={() => { setIsFeedbackOpen(true); setIsOpen(false); }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-primary/5 hover:text-primary transition-all duration-200 group flex-shrink-0"
                    >
                        <span className="text-gray-400 group-hover:text-primary transition-colors">
                            <MessageSquare size={18} />
                        </span>
                        <span className="font-bold text-sm tracking-wide">System Feedback</span>
                    </button>
                </nav>
                
                <div className="p-6 mt-auto border-t border-gray-50 bg-white">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

                <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
            </div>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 shadow-sm border-r border-gray-100 w-80">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
