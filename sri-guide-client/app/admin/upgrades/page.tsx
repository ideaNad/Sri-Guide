"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
    CheckCircle2, XCircle, Clock, Search, 
    Filter, LayoutDashboard, Building2, User 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/api-client";

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
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [upgrades, setUpgrades] = useState<PendingUpgrade[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "Admin")) {
            router.push("/");
            return;
        }

        fetchUpgrades();
    }, [user, authLoading, router]);

    const fetchUpgrades = async () => {
        try {
            const response = await apiClient.get("/admin/pending-upgrades");
            setUpgrades(response.data as PendingUpgrade[]);
        } catch (error) {
            console.error("Error fetching upgrades:", error);
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
            alert(`Failed to ${action} the request.`);
        } finally {
            setActionLoading(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 bg-gray-50/50 min-h-screen">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                            <LayoutDashboard size={14} />
                            <span>Admin Portal</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                            Agency <span className="text-primary">Approvals</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Review and verify travel agency registration requests.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {upgrades.length === 0 ? (
                        <div className="glass p-12 rounded-[2.5rem] text-center border border-white">
                            <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Requests</h3>
                            <p className="text-gray-500">Everything is up to date. New requests will appear here.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {upgrades.map((upgrade, i) => (
                                <motion.div
                                    key={upgrade.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8"
                                >
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <User size={10} /> Applicant
                                            </p>
                                            <p className="font-bold text-gray-900">{upgrade.userName}</p>
                                            <p className="text-xs text-gray-500">User ID: ...{upgrade.userId.slice(-8)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <Building2 size={10} /> Company
                                            </p>
                                            <p className="font-bold text-gray-900">{upgrade.companyName}</p>
                                            <p className="text-xs text-secondary font-medium">{upgrade.registrationNumber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                Contact Info
                                            </p>
                                            <p className="font-bold text-gray-900 text-sm">{upgrade.companyEmail}</p>
                                            <p className="text-xs text-gray-500">{upgrade.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                Submitted
                                            </p>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {new Date(upgrade.createdAt).toLocaleDateString(undefined, { 
                                                    day: 'numeric', 
                                                    month: 'long', 
                                                    year: 'numeric' 
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(upgrade.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            disabled={!!actionLoading}
                                            onClick={() => handleAction(upgrade.id, "reject")}
                                            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center gap-2 group"
                                        >
                                            <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                                            <span>Reject</span>
                                        </button>
                                        <button
                                            disabled={!!actionLoading}
                                            onClick={() => handleAction(upgrade.id, "approve")}
                                            className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-primary transition-all flex items-center gap-2 group shadow-lg shadow-gray-200"
                                        >
                                            <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                                            <span>{actionLoading === upgrade.id ? "Processing..." : "Approve Now"}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUpgradesPage;
