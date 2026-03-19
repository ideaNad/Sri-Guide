"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { Bell, Search, Command, ChevronRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50/30">
            <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-80`}>
                <DashboardTopbar onMenuClick={() => setIsSidebarOpen(true)} />
                
                <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
