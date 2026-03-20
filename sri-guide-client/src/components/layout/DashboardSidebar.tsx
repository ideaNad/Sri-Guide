"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, User, Settings, ShieldCheck, 
    MessageSquare, Heart, Compass
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

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 overflow-y-auto w-80 relative">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-8 py-8 border-b border-gray-50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-highlight rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <ShieldCheck size={22} className="text-white" />
                    </div>
                    <div>
                        <span className="font-black text-secondary text-xl tracking-tight uppercase">Sri<span className="text-primary">Guide</span></span>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Traveler Hub</div>
                    </div>
                </Link>
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
            </nav>
            
            <div className="p-8 border-t border-gray-50 text-center">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-relaxed">
                    © 2026 SriGuide.<br/>Crafted with Passion.
                </p>
            </div>
        </div>
    );

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
