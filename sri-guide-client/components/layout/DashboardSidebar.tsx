"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, User, Settings, ShieldCheck, 
    TrendingUp, MapPin, Calendar, MessageSquare, 
    LogOut, HelpCircle, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

interface MenuItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    roles?: string[];
}

interface MenuSection {
    title: string;
    roles?: string[];
    items: MenuItem[];
}

const DashboardSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const sections: MenuSection[] = [
        {
            title: "Dashboards",
            items: [
                { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
            ]
        },
        {
            title: "Applications",
            items: [
                { name: "My Profile", href: "/dashboard/profile", icon: <User size={20} /> },
                { name: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={20} /> },
                { name: "Bookings", href: "/dashboard/bookings", icon: <Calendar size={20} /> },
            ]
        },
        {
            title: "Management",
            roles: ["Guide", "TravelAgency", "Transport"],
            items: [
                { name: "My Tours", href: "/dashboard/tours", icon: <MapPin size={20} /> },
                { name: "Upgrade", href: "/dashboard/upgrade", icon: <TrendingUp size={20} />, roles: ["Guide"] },
            ]
        },
        {
            title: "Administration",
            roles: ["Admin"],
            items: [
                { name: "Verifications", href: "/admin/verifications", icon: <ShieldCheck size={20} /> },
                { name: "Upgrade Requests", href: "/admin/upgrades", icon: <TrendingUp size={20} /> },
                { name: "User Directory", href: "/admin/users", icon: <HelpCircle size={20} /> },
            ]
        },
        {
            title: "System",
            items: [
                { name: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
            ]
        }
    ];

    const filteredSections = sections.filter(section => 
        !section.roles || (user && section.roles.includes(user.role))
    ).map(section => ({
        ...section,
        items: section.items.filter(item => !item.roles || (user && item.roles.includes(user.role)))
    })).filter(section => section.items.length > 0);

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[90] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside 
                initial={false}
                animate={{ 
                    x: typeof window !== 'undefined' && window.innerWidth < 1024 
                        ? (isOpen ? 0 : -320) 
                        : 0 
                }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className={`w-80 h-screen bg-white flex flex-col fixed left-0 top-0 z-[100] border-r border-gray-100 shadow-xl lg:shadow-none overflow-hidden`}
            >
                {/* Logo Section */}
                <div className="p-8 pb-10 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shadow-lg shadow-primary/10 group-hover:rotate-12 transition-transform border border-primary/20 p-1.5">
                            <img src="/sidebarlogo.png" alt="" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Sri<span className="text-primary">Guide</span></span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
                    {filteredSections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{section.title}</p>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link 
                                            key={item.href} 
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`group flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 ${
                                                isActive 
                                                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`${isActive ? "text-white" : "group-hover:text-primary transition-colors text-gray-400"}`}>
                                                    {item.icon}
                                                </span>
                                                <span className="text-xs font-bold tracking-tight uppercase">{item.name}</span>
                                            </div>
                                            {!isActive && (
                                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-300" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Section: Branding */}
                <div className="p-6 mt-auto border-t border-gray-50">
                    <div className="bg-gray-50 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Premium Plan</p>
                        <h4 className="text-sm font-black text-gray-900 mb-4 relative z-10">Enterprise Account</h4>
                        <button className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary transition-all relative z-10">
                            View Billing
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default DashboardSidebar;
