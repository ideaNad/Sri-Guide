"use client";

import React, { useState } from "react";
import { 
    Search, Bell, Moon, Sun, Globe, 
    Grid, User, LogOut, Settings, MessageSquare, 
    ChevronDown, Menu
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DashboardTopbarProps {
    onMenuClick: () => void;
}

const DashboardTopbar = ({ onMenuClick }: DashboardTopbarProps) => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-[80] flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div className="relative group max-w-md w-full hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search [CTRL + K]" 
                        className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-3 pl-12 pr-4 outline-none transition-all font-jakarta text-sm"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Language Switcher */}
                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all hidden sm:flex">
                    <Globe size={18} />
                </button>

                {/* Theme Toggle */}
                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all hidden sm:flex">
                    <Sun size={18} />
                </button>

                {/* Apps Grid */}
                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all hidden sm:flex">
                    <Grid size={18} />
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all relative"
                    >
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </button>
                    {/* Placeholder for Notifications Dropdown */}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1 pl-3 pr-2 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100"
                    >
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-gray-900 leading-tight">{user?.fullName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm">
                            {user?.fullName.charAt(0)}
                        </div>
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-4 z-20"
                                >
                                    <div className="px-6 py-4 mb-2 border-b border-gray-50">
                                        <p className="text-sm font-black text-gray-900 mb-0.5">{user?.fullName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role}</p>
                                    </div>
                                    
                                    <div className="px-2">
                                        {[
                                            { icon: <User size={16} />, label: "Profile", href: "/dashboard/profile" },
                                            { icon: <Settings size={16} />, label: "Settings", href: "/dashboard/settings" },
                                            { icon: <MessageSquare size={16} />, label: "Chat", href: "/dashboard/messages" },
                                        ].map(item => (
                                            <Link 
                                                key={item.label}
                                                href={item.href}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-2xl transition-all"
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                        
                                        <div className="h-px bg-gray-50 my-2 mx-4" />
                                        
                                        <button 
                                            onClick={() => { logout(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default DashboardTopbar;
