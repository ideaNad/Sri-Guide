"use client";

import React, { useEffect, useState } from "react";
import { 
    Users, Star, MapPin, Calendar, 
    ArrowUpRight, AlertCircle, CheckCircle2,
    Briefcase, MessageCircle, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

export default function GuideDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        averageRating: 0,
        totalReviews: 0,
        profileCompleteness: 0,
        pendingUpgrades: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await apiClient.get("/profile/me");
                const data = response.data;
                // Mocking some stats if not in the real API yet
                setStats({
                    totalBookings: 12,
                    averageRating: 4.8,
                    totalReviews: 8,
                    profileCompleteness: 85,
                    pendingUpgrades: 0
                });
            } catch (error) {
                console.error("Dashboard fetch failed", error);
                // Fallback to mock data for demo
                setStats({
                    totalBookings: 12,
                    averageRating: 4.8,
                    totalReviews: 8,
                    profileCompleteness: 85,
                    pendingUpgrades: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { label: "Bookings", value: stats.totalBookings, icon: <Calendar className="text-blue-500" />, trend: "+20% this month" },
        { label: "Avg. Rating", value: stats.averageRating, icon: <Star className="text-yellow-500 fill-yellow-500" />, trend: "Excellent" },
        { label: "Reviews", value: stats.totalReviews, icon: <MessageCircle className="text-teal-500" />, trend: "2 new this week" },
        { label: "Pending Tasks", value: 3, icon: <AlertCircle className="text-rose-500" />, trend: "Action required" },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome */}
            <header>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                    Ayubowan, <span className="text-primary">{user?.fullName?.split(" ")[0]}</span>
                </h1>
                <p className="text-gray-500 font-bold mt-2">Here&apos;s what&apos;s happening with your guiding business today.</p>
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

                            <button className="mt-10 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                                Update Bio & Photos
                            </button>
                        </div>
                        {/* Abstract background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                    </div>

                    {/* Pending Bookings List */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 uppercase italic">Recent Activity</h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400">
                                        JD
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-gray-900">New Review received from <span className="text-primary italic">Juliet D.</span></p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">2 hours ago • South Coast Tour</p>
                                    </div>
                                    <ArrowUpRight size={18} className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Quick Actions</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { label: "Change Availability", icon: <Calendar size={18} />, color: "bg-blue-50 text-blue-600" },
                                { label: "Update Daily Rate", icon: <TrendingUp size={18} />, color: "bg-emerald-50 text-emerald-600" },
                                { label: "Check Messages", icon: <MessageCircle size={18} />, color: "bg-purple-50 text-purple-600" },
                            ].map((action) => (
                                <button key={action.label} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all text-left">
                                    <div className={`p-2.5 rounded-xl ${action.color}`}>
                                        {action.icon}
                                    </div>
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Announcement */}
                    <div className="bg-gradient-to-br from-primary to-orange-400 rounded-3xl p-6 text-white shadow-lg shadow-primary/20">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp size={24} />
                            <h4 className="font-black text-sm uppercase tracking-widest leading-none">Global Reach</h4>
                        </div>
                        <p className="text-[11px] font-bold text-white/90 leading-relaxed mb-4">
                            Join our premium partner program to get promoted to European and US agencies this tourist season.
                        </p>
                        <button className="w-full py-3 bg-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
