"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Users, UserCheck, TrendingUp,
    ShieldCheck, LogOut, Menu, X, Compass, Bell, Settings,
    Search, Globe, LayoutGrid, Mail, MessageSquare, Calendar,
    CheckSquare, FileText, ChevronRight, Moon, Sun, Monitor
} from "lucide-react";

// Vuexy Style Sidebar Groups
const SIDEBAR_GROUPS = [
    {
        label: "Dashboards",
        items: [
            { name: "Analytics", href: "/admin", icon: <LayoutDashboard size={18} />, badge: "5" },
            { name: "eCommerce", href: "/admin/ecommerce", icon: <LayoutGrid size={18} /> },
        ]
    },
    {
        label: "Apps & Pages",
        items: [
            { name: "Email", href: "#", icon: <Mail size={18} /> },
            { name: "Chat", href: "#", icon: <MessageSquare size={18} /> },
            { name: "Calendar", href: "#", icon: <Calendar size={18} /> },
            { name: "Kanban", href: "#", icon: <CheckSquare size={18} /> },
        ]
    },
    {
        label: "Management",
        items: [
            { name: "Users", href: "/admin/users", icon: <Users size={18} /> },
            { name: "Verifications", href: "/admin/verifications", icon: <UserCheck size={18} /> },
            { name: "Upgrade Requests", href: "/admin/upgrades", icon: <TrendingUp size={18} /> },
            { name: "Roles & Permissions", href: "/admin/roles", icon: <ShieldCheck size={18} /> },
        ]
    },
    {
        label: "Settings",
        items: [
            { name: "Account", href: "/admin/settings", icon: <Settings size={18} /> },
            { name: "System Logs", href: "/admin/logs", icon: <FileText size={18} /> },
        ]
    }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== "Admin")) {
            router.replace("/");
        }

        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [user, loading, router]);

    if (loading || !user || user.role !== "Admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F7FA]">
                <div className="w-10 h-10 border-4 border-[#7367F0] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

const SidebarContent = ({ pathname, setSidebarOpen, logout }: { pathname: string, setSidebarOpen: (open: boolean) => void, logout: () => void }) => (
    <div className="flex flex-col h-full bg-white border-r border-[#DBDADE] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-6 border-b border-[#DBDADE]/50">
            <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#7367F0] to-[#9E95F5] rounded-xl flex items-center justify-center shadow-lg shadow-[#7367F0]/30">
                    <ShieldCheck size={20} className="text-white" />
                </div>
                <div>
                    <span className="font-black text-[#6F6B7D] text-lg tracking-tight uppercase">Sri<span className="text-[#7367F0]">Guide</span></span>
                    <div className="text-[9px] font-black text-[#A5A3AE] uppercase tracking-[0.2em] leading-none">Admin Panel</div>
                </div>
            </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-8">
            {SIDEBAR_GROUPS.map((group) => (
                <div key={group.label}>
                    <h3 className="px-4 text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em] mb-4">
                        {group.label}
                    </h3>
                    <div className="space-y-1">
                        {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        isActive
                                            ? "bg-[#7367F0] text-white shadow-md shadow-[#7367F0]/20"
                                            : "text-[#6F6B7D] hover:bg-[#F8F7FA] hover:text-[#7367F0]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={isActive ? "text-white" : "text-[#A5A3AE] group-hover:text-[#7367F0] transition-colors"}>
                                            {item.icon}
                                        </span>
                                        <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-white text-[#7367F0]" : "bg-rose-100 text-rose-500"}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    {!item.badge && <ChevronRight size={14} className={isActive ? "text-white/40" : "text-[#A5A3AE] opacity-0 group-hover:opacity-100 transition-all saturate-50"} />}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-[#DBDADE]/50 bg-white">
            <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
            >
                <LogOut size={18} />
                <span>Sign Out</span>
            </button>
        </div>
    </div>
);

    return (
        <div className="flex min-h-screen bg-[#F8F7FA]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-[260px] fixed inset-y-0 left-0 z-30">
                <SidebarContent pathname={pathname} setSidebarOpen={setSidebarOpen} logout={logout} />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            className="fixed inset-y-0 left-0 w-[260px] z-50 lg:hidden shadow-2xl"
                        >
                            <SidebarContent pathname={pathname} setSidebarOpen={setSidebarOpen} logout={logout} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col lg:pl-[260px]">
                {/* Admin Navbar Interface (Internal) */}
                <header className={`sticky top-0 z-20 px-6 py-4 transition-all duration-300 ${scrolled ? "pt-2 pb-2" : "pt-6 pb-2"}`}>
                    <div className="max-w-7xl mx-auto w-full bg-white/80 backdrop-blur-md rounded-2xl border border-[#DBDADE]/50 shadow-sm flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-4 flex-1">
                            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-[#6F6B7D] lg:hidden">
                                <Menu size={20} />
                            </button>
                            <div className="hidden sm:flex items-center gap-3 text-[#A5A3AE] flex-1 max-w-sm">
                                <Search size={18} />
                                <span className="text-sm font-medium">Search (Ctrl+K)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-6">
                            <div className="hidden md:flex items-center gap-4">
                                <button className="p-2 text-[#6F6B7D] hover:bg-[#F8F7FA] rounded-xl transition-all"><Globe size={20} /></button>
                                <button className="p-2 text-[#6F6B7D] hover:bg-[#F8F7FA] rounded-xl transition-all"><Moon size={20} /></button>
                                <button className="p-2 text-[#6F6B7D] hover:bg-[#F8F7FA] rounded-xl transition-all relative">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                                </button>
                            </div>
                            
                            <div className="h-8 w-px bg-[#DBDADE] mx-2 hidden sm:block"></div>

                            <div className="flex items-center gap-3 pl-2">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-black text-[#5D596C] tracking-tight">{user.fullName}</p>
                                    <p className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-widest leading-none mt-1">Administrator</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-[#7367F0]/10 flex items-center justify-center text-[#7367F0] font-black text-sm border border-[#7367F0]/20 shadow-sm overflow-hidden">
                                    {user.fullName.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    {children}
                </main>

                <footer className="p-6 text-center text-[#A5A3AE] text-[11px] font-medium tracking-tight uppercase">
                    © 2026 SriGuide Platform • Hand-crafted & Made with Passion
                </footer>
            </div>
        </div>
    );
}
