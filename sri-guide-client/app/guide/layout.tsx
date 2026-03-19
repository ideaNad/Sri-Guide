"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, User, Star, TrendingUp,
    ChevronRight, LogOut, Menu, X, Compass, Bell, ShieldCheck
} from "lucide-react";

const GUIDE_NAV = [
    { name: "Overview", href: "/guide", icon: <LayoutDashboard size={20} /> },
    { name: "My Profile", href: "/guide/profile", icon: <User size={20} /> },
    { name: "Reviews", href: "/guide/reviews", icon: <Star size={20} /> },
    { name: "Upgrade to Agency", href: "/guide/upgrade", icon: <TrendingUp size={20} /> },
];

export default function GuideLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== "Guide")) {
            router.replace("/");
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== "Guide") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

const SidebarContent = ({ pathname, setSidebarOpen, logout, user }: { pathname: string, setSidebarOpen: (open: boolean) => void, logout: () => void, user: any }) => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
        <div className="p-8 border-b border-gray-50 mb-4">
            <Link href="/" className="flex items-center gap-3 mb-6" onClick={() => setSidebarOpen(false)}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <ShieldCheck size={20} />
                </div>
                <span className="font-black text-gray-900 text-xl tracking-tight uppercase">Sri<span className="text-primary">Guide</span></span>
            </Link>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.fullName?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-black text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Local Guide</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
            {GUIDE_NAV.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all group ${
                            isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                        <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-primary"}>
                            {link.icon}
                        </span>
                        <span className="font-bold text-sm">{link.name}</span>
                    </Link>
                );
            })}
        </nav>

        <div className="p-4 border-t border-gray-50">
            <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </div>
    </div>
);

    return (
        <div className="flex min-h-screen bg-gray-50/50">
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
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
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
                <header className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <Menu size={24} />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Compass size={18} className="text-white" />
                        </div>
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                        {user.fullName.charAt(0)}
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
