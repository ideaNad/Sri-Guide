"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { 
    CheckCircle2, XCircle, Clock, Search, 
    Filter, LayoutDashboard, Building2, User, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";

interface PendingUpgrade {
    id: string;
    userId: string;
    userName: string;
    companyName: string;
    companyEmail: string;
    registrationNumber: string;
    phone: string;
    whatsApp: string;
    createdAt: string;
}

const AdminUpgradesPage = () => {
    const { user } = useAuth();
    const [upgrades, setUpgrades] = useState<PendingUpgrade[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchUpgrades();
    }, []);

    const fetchUpgrades = async () => {
        try {
            const response = await apiClient.get("/admin/pending-upgrades");
            setUpgrades(response.data as PendingUpgrade[]);
        } catch (error) {
            console.error("Error fetching upgrades:", error);
            // Fallback for mock if API fails
            setUpgrades([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setActionLoading(id);
        try {
            await apiClient.post(`/admin/${action}-agency/${id}`);
            setUpgrades(upgrades.filter(u => u.id !== id));
        } catch (error) {
            console.error(`Error during ${action}:`, error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                        Upgrade <span className="text-primary">Requests</span>
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Guide to Travel Agency Professional Upgrades</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : upgrades.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                        <Clock className="mx-auto text-gray-200 mb-6" size={48} />
                        <h3 className="text-xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">Everything Current</h3>
                        <p className="text-sm text-gray-400 font-medium">No pending agency upgrade requests at the moment.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {upgrades.map((upgrade, i) => (
                            <motion.div
                                key={upgrade.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group"
                            >
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            Applicant
                                        </p>
                                        <p className="font-black text-gray-900 text-sm tracking-tight">{upgrade.userName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">UID: {upgrade.userId.slice(-8)}</p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Building2 size={10} className="text-primary" />
                                            Proposed Agency
                                        </p>
                                        <p className="font-black text-gray-900 text-sm tracking-tight">{upgrade.companyName}</p>
                                        <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{upgrade.registrationNumber}</p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Channel</p>
                                        <p className="font-bold text-gray-900 text-xs">{upgrade.companyEmail}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{upgrade.phone}</p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wait Time</p>
                                        <p className="font-black text-gray-900 text-xs">
                                            {new Date(upgrade.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => router.push(`/profile/${upgrade.userId}`)}
                                        className="p-3 rounded-2xl border border-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 hover:border-primary/10 transition-all opacity-0 group-hover:opacity-100"
                                        title="View Profile"
                                    >
                                        <Eye size={22} />
                                    </button>
                                    <button
                                        disabled={!!actionLoading}
                                        onClick={() => handleAction(upgrade.id, "reject")}
                                        className="p-3 rounded-2xl border border-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <XCircle size={22} />
                                    </button>
                                    <button
                                        disabled={!!actionLoading}
                                        onClick={() => handleAction(upgrade.id, "approve")}
                                        className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95"
                                    >
                                        {actionLoading === upgrade.id ? "Working..." : "Confirm Upgrade"}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default AdminUpgradesPage;
