"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Briefcase, Map, Users,
    Building2, LogOut, Menu, X, Compass, Bell, Plus
} from "lucide-react";
import apiClient from "@/services/api-client";

const AGENCY_NAV = [
    { name: "Overview", href: "/agency", icon: <LayoutDashboard size={20} /> },
    { name: "Manage Tours", href: "/agency/tours", icon: <Map size={20} /> },
    { name: "Guide Roster", href: "/agency/guides", icon: <Users size={20} /> },
    { name: "Bookings", href: "/agency/bookings", icon: <Briefcase size={20} /> },
];

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== "TravelAgency")) {
            router.replace("/");
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== "TravelAgency") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

const SidebarContent = ({ pathname, setSidebarOpen, logout, user }: { pathname: string, setSidebarOpen: (open: boolean) => void, logout: () => void, user: any }) => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 blur-3xl rounded-full -mr-16 -mt-16 -z-10" />
        
        <div className="p-8 mb-6">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:scale-110 transition-transform">
                    <Building2 size={20} className="text-white" />
                </div>
                <div>
                    <span className="font-black text-gray-900 text-xl tracking-tighter uppercase italic block leading-none">Sri<span className="text-teal-600">Guide</span></span>
                    <span className="text-[9px] font-black text-teal-600 uppercase tracking-[0.3em] mt-1 block">Travel Agency</span>
                </div>
            </Link>
        </div>

        <nav className="flex-1 px-6 space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Main Navigation</p>
            {AGENCY_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-6 py-4 rounded-[1.25rem] transition-all duration-300 group ${
                            isActive
                                ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20"
                                : "text-gray-500 hover:bg-teal-50 hover:text-teal-700"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={isActive ? "text-teal-400" : "text-gray-400 group-hover:text-teal-600 transition-colors"}>
                                {item.icon}
                            </span>
                            <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
                        </div>
                        {isActive && <motion.div layoutId="activeInd" className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                    </Link>
                );
            })}
        </nav>

        <div className="p-6 mt-auto">
            <div className="bg-gray-50 rounded-3xl p-6 mb-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                        <img 
                            src={user.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} 
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-black text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Agency Owner</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-rose-500 hover:bg-rose-50 transition-all font-black text-[10px] uppercase tracking-widest border border-rose-100 shadow-sm"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    </div>
);

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
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="hidden lg:flex items-center gap-2 text-gray-400">
                            <Compass size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sri Lanka Operations</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-teal-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-gray-100" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-gray-900 uppercase leading-none">{user.fullName}</p>
                                <p className="text-[9px] font-bold text-teal-600/70 uppercase tracking-tighter mt-1 italic">Verified Agency</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-teal-50 shadow-sm">
                                <img 
                                    src={user.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} 
                                    alt={user.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-12 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
