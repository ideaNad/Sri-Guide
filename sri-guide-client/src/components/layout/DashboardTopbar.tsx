"use client";

import React, { useState } from "react";
import { 
    Search, Bell, Moon, Sun, Globe, 
    Grid, User, LogOut, Settings, MessageSquare, 
    ChevronDown, Menu
} from "lucide-react";
import { useAuth } from "@/providers/AuthContext";
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
                </div>
            </div>
        </header>
    );
};

export default DashboardTopbar;
