"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackModal from "@/features/feedback/components/FeedbackModal";
import { HelpDrawer } from "@/components/help/HelpDrawer";
import { 
    LayoutDashboard, User, Settings, ShieldCheck, 
    MessageSquare, Heart, Compass, LogOut, X as CloseIcon,
    AlertCircle, Trophy
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
    { label: "Island Explorer", href: "/dashboard/explorer", icon: <Trophy size={18} className="text-amber-500" /> },
    { label: "My Island Story", href: "/dashboard/story", icon: <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }}><Compass size={18} className="text-sky-500" /></motion.div> },
];

export default function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const SidebarContent = () => {
        return (
            <div className="flex flex-col h-full bg-white border-r border-gray-100 relative shadow-sm overflow-y-auto overflow-x-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 px-8 py-5 lg:py-10 border-b border-gray-50 flex items-center justify-between mb-4">
                    <Link href="/" className="relative flex items-center h-20 md:h-24 z-10 px-1">
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
                
                {/* Profile Section */}
                <div className="px-6 pt-6 pb-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100/50 shadow-sm transition-all hover:bg-gray-100/50">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 overflow-hidden shrink-0 shadow-inner">
                            {user?.profileImageUrl ? (
                                <img 
                                    src={user.profileImageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : user.profileImageUrl} 
                                    alt={user.fullName} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{user?.fullName?.charAt(0) || "U"}</span>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black text-gray-900 truncate leading-tight">{user?.fullName || "User"}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">{user?.role || "Member"}</p>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-4 space-y-1">
                    {DASHBOARD_LINKS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-primary"
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
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-primary transition-all duration-200 group"
                    >
                        <span className="text-gray-400 group-hover:text-primary transition-colors">
                            <MessageSquare size={18} />
                        </span>
                        <span className="font-bold text-sm tracking-wide">System Feedback</span>
                    </button>
                </nav>
                
                <div className="p-6 mt-auto border-t border-gray-50 bg-white space-y-2">
                    <button
                        onClick={() => setIsHelpOpen(true)}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-600 hover:bg-sky-50 transition-all font-bold text-sm group"
                    >
                        <div className="p-2 rounded-xl bg-sky-50 group-hover:bg-sky-100 transition-colors text-sky-600">
                            <AlertCircle size={18} />
                        </div>
                        <span>Help & Support</span>
                    </button>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm group"
                    >
                        <div className="p-2 rounded-xl bg-rose-50 group-hover:bg-rose-100 transition-colors text-rose-500">
                            <LogOut size={18} />
                        </div>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
            
            <HelpDrawer 
                open={isHelpOpen}
                onOpenChange={setIsHelpOpen}
                title="Dashboard Help"
                description="Need help with your account or finding tours? Check out our resources."
                items={[
                    { title: "Manage Profile", description: "Learn how to update your personal info.", category: 'tourist' },
                    { title: "Saved Tours", description: "How to save and find your favorite experiences.", category: 'tourist' },
                    { title: "Contact Support", description: "Reach out to us for any technical issues.", category: 'tourist' },
                ]}
            />
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
