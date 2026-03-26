'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Car, Settings, LogOut, Menu, X, HelpCircle, 
    AlertCircle, MessageSquare, Briefcase, User
} from "lucide-react";
import apiClient from "@/services/api-client";

const TRANSPORT_NAV = [
    { name: "Dashboard Home", href: "/transport-dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Vehicles", href: "/transport-dashboard/vehicles", icon: <Car size={20} /> },
    { name: "Reviews", href: "/transport-dashboard/reviews", icon: <MessageSquare size={20} /> },
    { name: "Profile Settings", href: "/transport-dashboard/settings", icon: <Settings size={20} /> },
];

export default function TransportLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== "TransportProvider") {
                router.replace("/");
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== "TransportProvider") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 relative overflow-y-auto overflow-x-hidden">
            <div className="sticky top-0 bg-white z-10 px-8 py-5 lg:py-10 border-b border-gray-50 flex items-center justify-between mb-4">
                <Link href="/" className="relative flex items-center h-20 md:h-24 z-10 px-1" onClick={() => setSidebarOpen(false)}>
                    <img
                        src="/logo.svg"
                        alt="Sri Guide Logo"
                        className="absolute left-0 h-40 md:h-44 w-auto transition-all duration-500 object-contain max-w-none"
                    />
                </Link>
                <button 
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-xl"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="px-6 pb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50 shadow-sm transition-all hover:bg-blue-50">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold border border-blue-500/20 overflow-hidden shrink-0 shadow-inner">
                        {user?.profileImageUrl ? (
                            <img 
                                src={user.profileImageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : user.profileImageUrl} 
                                alt={user.fullName} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span>{user?.fullName?.charAt(0) || "T"}</span>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-black text-gray-900 truncate leading-tight uppercase tracking-tight">{user?.fullName || "Provider"}</p>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mt-1">Transport Provider</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] px-4 mb-4">Main Navigation</p>
                {TRANSPORT_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                                isActive
                                    ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20"
                                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-700 font-bold"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={isActive ? "text-blue-400" : "text-gray-400 group-hover:text-blue-600 transition-colors"}>
                                    {item.icon}
                                </span>
                                <span className="text-sm tracking-wide">{item.name}</span>
                            </div>
                            {isActive && <motion.div layoutId="activeInd" className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto border-t border-gray-50 bg-white space-y-2">
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

    return (
        <div className="flex min-h-screen bg-white">
            <aside className="hidden lg:block w-80 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

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
                            <SidebarContent />
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

                <main className="flex-1 pt-20 pb-6 px-6 lg:p-12 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
