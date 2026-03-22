"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Briefcase, Map, Users,
    Building2, LogOut, Menu, X, Compass, Bell, Plus,
    X as CloseIcon, HelpCircle, AlertCircle
} from "lucide-react";
import apiClient from "@/services/api-client";
import FeedbackModal from "@/features/feedback/components/FeedbackModal";
import { MessageSquare } from "lucide-react";
import { HelpDrawer } from "@/components/help/HelpDrawer";

const AGENCY_NAV = [
    { name: "Overview", href: "/agency", icon: <LayoutDashboard size={20} /> },
    { name: "Manage Tours", href: "/agency/tours", icon: <Map size={20} /> },
    { name: "Manage Trips", href: "/agency/trips", icon: <Compass size={20} /> },
    { name: "Guide Roster", href: "/agency/guides", icon: <Users size={20} /> },
    { name: "My Profile", href: "/agency/profile", icon: <Building2 size={20} /> },
];

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== "TravelAgency") {
                router.replace("/");
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== "TravelAgency") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

const SidebarContent = ({ pathname, setSidebarOpen, logout, user }: { pathname: string, setSidebarOpen: (open: boolean) => void, logout: () => void, user: any }) => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 blur-3xl rounded-full -mr-16 -mt-16 -z-10" />
            
                <div className="sticky top-0 bg-white z-10 px-8 py-10 border-b border-gray-50 flex items-center justify-between mb-4">
                    <Link href="/" className="relative flex items-center h-20 md:h-24 z-10 px-1" onClick={() => setSidebarOpen(false)}>
                        <img
                            src="/logo.svg"
                            alt="Sri Guide Logo"
                            className="h-20 md:h-24 w-auto transition-all duration-500 object-contain"
                        />
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-xl"
                    >
                        <CloseIcon size={20} />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="px-6 pb-6">
                    <div className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-2xl border border-teal-100/50 shadow-sm transition-all hover:bg-teal-50">
                        <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 font-bold border border-teal-500/20 overflow-hidden shrink-0 shadow-inner">
                            {user?.profileImageUrl ? (
                                <img 
                                    src={user.profileImageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : user.profileImageUrl} 
                                    alt={user.fullName} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{user?.fullName?.charAt(0) || "A"}</span>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black text-gray-900 truncate leading-tight uppercase tracking-tight">{user?.fullName || "Agency"}</p>
                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mt-1">Travel Agency</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] px-4 mb-4">Main Navigation</p>
                {AGENCY_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                                isActive
                                    ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20"
                                    : "text-gray-500 hover:bg-teal-50 hover:text-teal-700 font-bold"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={isActive ? "text-teal-400" : "text-gray-400 group-hover:text-teal-600 transition-colors"}>
                                    {item.icon}
                                </span>
                                <span className="text-sm tracking-wide">{item.name}</span>
                            </div>
                            {isActive && <motion.div layoutId="activeInd" className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                        </Link>
                    );
                })}

                <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-gray-500 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300 group font-bold"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 group-hover:text-teal-600 transition-colors">
                            <MessageSquare size={20} />
                        </span>
                        <span className="text-sm tracking-wide">Feedback</span>
                    </div>
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

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
            
            <HelpDrawer 
                open={isHelpOpen}
                onOpenChange={setIsHelpOpen}
                title="Agency Help Center"
                description="Manage your tours and guides effectively. Explore our documentation for agencies."
                items={[
                    { title: "Tour Management", description: "How to maximize your visibility with great tours." },
                    { title: "Guide Roster", description: "Learn how to manage and recruit guides." },
                    { title: "Dashboard Analytics", description: "Understand your performance metrics." },
                ]}
            />
        </div>
    );
};

    return (
        <div className="flex min-h-screen bg-white">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 fixed inset-y-0 left-0 z-30">
                <SidebarContent pathname={pathname} setSidebarOpen={setSidebarOpen} logout={logout} user={user} />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
                        >
                            <SidebarContent pathname={pathname} setSidebarOpen={setSidebarOpen} logout={logout} user={user} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col lg:pl-80">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-[45] p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 text-gray-500 hover:text-primary transition-all active:scale-95"
                >
                    <Menu size={24} />
                </button>

                <main className="flex-1 p-6 lg:p-12 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
