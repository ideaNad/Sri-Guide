"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Briefcase, Map, Users,
    Building2, LogOut, Menu, X, Compass, Bell, Plus
} from "lucide-react";

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

const SidebarContent = ({ pathname, setSidebarOpen, logout }: { pathname: string, setSidebarOpen: (open: boolean) => void, logout: () => void }) => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm">
        <div className="p-8 border-b border-gray-50 mb-4">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <Building2 size={18} className="text-white" />
                </div>
                <span className="font-black text-gray-900 text-lg tracking-tighter italic uppercase">Sri<span className="text-teal-600">Guide</span></span>
            </Link>
            <div className="mt-2 text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">Travel Agency</div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
            {AGENCY_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                            isActive
                                ? "bg-teal-600 text-white shadow-xl shadow-teal-600/20"
                                : "text-gray-500 hover:bg-teal-50 hover:text-teal-700"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-teal-600 transition-colors"}>
                                {item.icon}
                            </span>
                            <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
                        </div>
                    </Link>
                );
            })}
        </nav>

        <div className="p-6 border-t border-gray-50 mt-auto">
            <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black text-xs uppercase tracking-widest"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    </div>
);

    return (
        <div className="flex min-h-screen bg-gray-50/30">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 fixed inset-y-0 left-0 z-30">
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
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
                        >
                            <SidebarContent pathname={pathname} setSidebarOpen={setSidebarOpen} logout={logout} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col lg:pl-80">
                <header className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <Menu size={24} />
                    </button>
                    <Building2 size={24} className="text-teal-600" />
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xs border border-teal-100">
                        {user.fullName.charAt(0)}
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Agency Dashboard</h2>
                            <p className="text-gray-500 text-sm">Managing tours for {user.fullName}</p>
                        </div>
                        <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                            <Plus size={16} />
                            Create Tour
                        </button>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
