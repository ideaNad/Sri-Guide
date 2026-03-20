"use client";

import React, { useEffect, useState } from "react";
import { 
    Users, Star, MapPin, Calendar, 
    ArrowUpRight, AlertCircle, CheckCircle2,
    Briefcase, MessageCircle, TrendingUp, ShieldCheck, Clock, X
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";

interface DashboardStats {
    totalBookings: number;
    averageRating: number;
    totalReviews: number;
    profileCompleteness: number;
    isLegit: boolean;
    verificationStatus: string;
    fullName: string;
    profileImageUrl?: string;
    recentActivities: any[];
    recentTrips: any[];
}

export default function GuideDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        averageRating: 0,
        totalReviews: 0,
        profileCompleteness: 0,
        isLegit: false,
        verificationStatus: "Pending",
        fullName: "",
        profileImageUrl: "",
        recentActivities: [],
        recentTrips: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await apiClient.get("/profile/guide-dashboard");
                setStats(response.data as DashboardStats);
            } catch (error) {
                console.error("Dashboard fetch failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { label: "Bookings", value: stats.totalBookings, icon: <Calendar className="text-blue-500" />, trend: "Total confirmed" },
        { label: "Avg. Rating", value: stats.averageRating.toFixed(1), icon: <Star className="text-yellow-500 fill-yellow-500" />, trend: `${stats.totalReviews} reviews` },
        { label: "License Status", value: stats.isLegit ? "Verified" : "Unverified", icon: <ShieldCheck className={stats.isLegit ? "text-emerald-500" : "text-gray-400"} />, trend: stats.verificationStatus },
        { label: "Profile", value: `${stats.profileCompleteness}%`, icon: <Users className="text-primary" />, trend: "Completeness" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Welcome */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                        {stats.profileImageUrl ? (
                            <img 
                                src={`${apiClient.defaults.baseURL?.replace('/api', '')}${stats.profileImageUrl}`} 
                                alt={stats.fullName}
                                className="w-full h-full rounded-[2rem] object-cover border-4 border-white shadow-xl shadow-primary/10"
                            />
                        ) : (
                            <div className="w-full h-full rounded-[2rem] bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-300 border-4 border-white shadow-xl">
                                {user?.fullName?.charAt(0)}
                            </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-xl shadow-lg border border-gray-50">
                            <Briefcase size={14} className="text-primary" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                            Ayubowan, <span className="text-primary">{user?.fullName?.split(" ")[0]}</span>
                        </h1>
                        <p className="text-gray-500 font-bold mt-2">Here&apos;s what&apos;s happening with your guiding business today.</p>
                    </div>
                </div>
                {stats.isLegit && (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm animate-pulse-slow">
                        <ShieldCheck size={20} className="fill-emerald-500 text-white" />
                        <span className="font-black text-xs uppercase tracking-widest italic">Licensed Guide</span>
                    </div>
                )}
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gray-50 rounded-2xl">
                                {stat.icon}
                            </div>
                            <ArrowUpRight size={16} className="text-gray-300" />
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-1 tracking-tighter italic">{stat.value}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Profile Progress */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-1 italic uppercase underline decoration-primary decoration-4 underline-offset-8">Complete Your Profile</h3>
                            <p className="text-white/60 text-sm mt-6 mb-8 max-w-md font-medium leading-relaxed">
                                Profiles with 100% completeness are <span className="text-primary font-bold">5x more likely</span> to get booked by international tourists.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest">Progress</span>
                                    <span className="text-lg font-black italic">{stats.profileCompleteness}%</span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden p-1">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.profileCompleteness}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(255,204,0,0.5)]" 
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={() => router.push("/guide/profile")}
                                className="mt-10 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all"
                            >
                                Update Bio & Photos
                            </button>
                        </div>
                        {/* Abstract background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                    </div>

                    {/* Recent Activity List (Hidden) */}
                    {/* Verification & Global Reach Combined */}
                    {!stats.isLegit && (
                        <div className="bg-gradient-to-br from-primary to-orange-400 rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <ShieldCheck size={28} className="text-white drop-shadow-md" />
                                <h3 className="text-2xl font-black text-white uppercase italic">Global Reach & Verification</h3>
                            </div>
                            <p className="text-white/90 text-sm mb-8 font-medium leading-relaxed max-w-lg relative z-10">
                                Verified guides get promoted to European and US agencies this tourist season. Upload your SLSports or SLTDA registration details to get your <span className="text-white font-black italic">LICENSED GUIDE</span> badge.
                            </p>
                            <div className="flex items-center gap-4 relative z-10">
                                <button 
                                    onClick={() => router.push("/guide/profile#verification")}
                                    className="px-8 py-3 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-gray-50 transition-colors"
                                >
                                    Verify Now
                                </button>
                                {stats.verificationStatus === "Pending" && (
                                    <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80 bg-black/20 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                                        <Clock size={16} /> Under Review
                                    </span>
                                )}
                                {stats.verificationStatus === "Approved" && (
                                    <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-4 py-2.5 rounded-xl">
                                        <ShieldCheck size={16} /> Approved
                                    </span>
                                )}
                                {stats.verificationStatus === "Rejected" && (
                                    <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-700 bg-rose-100 px-4 py-2.5 rounded-xl">
                                        <X size={16} /> Rejected
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Quick Actions</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { label: "My Trips", icon: <MapPin size={18} />, color: "bg-blue-50 text-blue-600", action: () => router.push("/guide/trips") },
                                { label: "Update Bio/Rates", icon: <TrendingUp size={18} />, color: "bg-emerald-50 text-emerald-600", action: () => router.push("/guide/profile") },
                                { label: "Check Reviews", icon: <Star size={18} />, color: "bg-yellow-50 text-yellow-600", action: () => router.push("/guide/reviews") },
                            ].map((action) => (
                                <button 
                                    key={action.label} 
                                    onClick={action.action}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all text-left group"
                                >
                                    <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
