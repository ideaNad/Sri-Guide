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
        <div className="space-y-8 animate-in fade-in duration-500 pt-12 md:pt-0">
            {/* Welcome */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-6 text-left">
                    <div className="relative w-24 h-24 shrink-0">
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
                            AYUBOWAN, <span className="text-primary">{user?.fullName?.split(" ")[0]}</span>
                        </h1>
                        <p className="text-gray-500 font-bold mt-2">Here&apos;s what&apos;s happening with your guiding business today.</p>
                    </div>
                </div>
                {stats.isLegit && (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
                        <ShieldCheck size={20} className="fill-emerald-500 text-white" />
                        <span className="font-black text-xs uppercase tracking-widest italic">Licensed Guide</span>
                    </div>
                )}
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-primary/20 transition-all cursor-default group"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {stat.icon}
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none mb-1">{stat.value}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                            <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mt-2 inline-block italic">{stat.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content: Immersive Banners (Long Cards) */}
            <div className="space-y-12">
                {stats.profileCompleteness < 100 && (
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="relative z-10 flex-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Profile Perfection</span>
                            <h3 className="text-3xl md:text-4xl font-black mb-6 italic uppercase leading-none">Complete Your Profile</h3>
                            <p className="text-white/60 text-sm md:text-base mb-10 max-w-xl font-medium leading-relaxed">
                                Profiles with 100% completeness are <span className="text-primary font-bold">5x more likely</span> to get booked by international tourists this season. Stand out from the crowd!
                            </p>
                            
                            <button 
                                onClick={() => router.push("/guide/profile")}
                                className="bg-primary text-gray-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/10"
                            >
                                Update Bio & Photos
                            </button>
                        </div>

                        <div className="relative z-10 w-full md:w-64 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Current Progress</span>
                                <span className="text-2xl font-black italic text-primary">{stats.profileCompleteness}%</span>
                            </div>
                            <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.profileCompleteness}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(255,204,0,0.6)]" 
                                />
                            </div>
                        </div>

                        {/* Abstract background element */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
                    </div>
                )}

                {/* Verification & Grid Section */}
                <div className="space-y-8">
                    {!stats.isLegit && (
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                                    <ShieldCheck size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase italic">Get Licensed</h3>
                                <p className="text-white/80 text-sm md:text-base mb-8 font-medium leading-relaxed">
                                    Upload your SLTDA or SLSports registration to unlock the badge and reach premium global travel agencies.
                                </p>
                                <button 
                                    onClick={() => router.push("/guide/profile#verification")}
                                    className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95"
                                >
                                    {stats.verificationStatus === "Pending" ? "Check Status" : "Verify Identity"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Manage Your Business (Shortcuts) */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col h-full">
                            <div className="flex flex-col mb-10">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Shortcuts</h4>
                                <h3 className="text-2xl font-black text-gray-900 italic uppercase">Manage Your Business</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 mt-auto">
                                {[
                                    { label: "My Trips", icon: <MapPin size={20} />, color: "bg-blue-50 text-blue-600", action: () => router.push("/guide/trips"), sub: "View active schedules" },
                                    { label: "Check Reviews", icon: <Star size={20} />, color: "bg-yellow-50 text-yellow-600", action: () => router.push("/guide/reviews"), sub: "What tourists are saying" },
                                    { label: "Direct Messages", icon: <MessageCircle size={20} />, color: "bg-primary/10 text-primary", action: () => router.push("/dashboard/messages"), sub: "Chat with potential clients" },
                                ].map((action) => (
                                    <button 
                                        key={action.label} 
                                        onClick={action.action}
                                        className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50/50 border border-transparent hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all text-left group"
                                    >
                                        <div className={`p-4 rounded-2xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest block mb-1">{action.label}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{action.sub}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className="flex flex-col mb-10">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Live Feed</h4>
                                <h2 className="text-2xl font-black text-gray-900 italic uppercase flex items-center gap-2">
                                    Recent Activity
                                </h2>
                            </div>
                            <div className="space-y-6">
                                {stats.recentActivities && stats.recentActivities.length > 0 ? (
                                    stats.recentActivities.slice(0, 4).map((activity, index) => (
                                        <div key={index} className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <Clock size={16} className="text-gray-400 group-hover:text-primary" />
                                            </div>
                                            <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                                                <p className="text-[13px] font-bold text-gray-900 leading-snug">{activity.message}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[9px] uppercase font-black text-primary tracking-widest uppercase italic">{activity.type}</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">
                                                        {activity.timeAgo}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-40">
                                        <MessageCircle size={40} className="mx-auto mb-4 text-gray-300" />
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">No activity yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scale Up / Become an Agency (Bottom Banner) */}
                <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-xl relative overflow-hidden group text-white">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Business Expansion</span>
                            <h3 className="text-3xl font-black mb-4 uppercase italic leading-none">Ready to scale up?</h3>
                            <p className="text-white/60 text-sm md:text-base mb-0 font-medium leading-relaxed">
                                Join the network of top travel agencies. Invite other guides, manage team schedules, and handle larger group bookings with an <span className="text-white font-black italic underline decoration-primary decoration-2 underline-offset-4">Agency Profile</span>.
                            </p>
                        </div>
                        <button 
                            onClick={() => router.push("/agency/apply")}
                            className="shrink-0 px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all active:scale-95 shadow-xl shadow-black/20"
                        >
                            Become an Agency
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
