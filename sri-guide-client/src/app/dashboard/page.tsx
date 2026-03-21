"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Compass, Calendar, Heart, ShieldCheck, Clock } from "lucide-react";
import apiClient from "@/services/api-client";

interface DashboardStats {
    fullName: string;
    profileImageUrl: string | null;
    savedToursCount: number;
    upcomingTripsCount: number;
    recentActivities: Array<{
        type: string;
        message: string;
        timeAgo: string;
        targetName: string | null;
    }>;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (user.role === "Admin") {
                router.replace("/admin");
            } else if (user.role === "Guide") {
                router.replace("/guide");
            } else if (user.role === "TravelAgency") {
                router.replace("/agency");
            } else if (user.role === "Tourist") {
                fetchStats();
            }
        }
    }, [user, loading, router]);

    const fetchStats = async () => {
        try {
            const response = await apiClient.get<DashboardStats>("/profile/tourist-dashboard");
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setStatsLoading(false);
        }
    };

    if (loading || !user || user.role !== "Tourist") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">AYUBOWAN, {user.fullName.split(' ')[0]}!</h1>
                <p className="text-gray-500 font-medium mt-1">Ready for your next Sri Lankan adventure?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upcoming Trips hidden for MVP */}
                {/* <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{statsLoading ? "..." : stats?.upcomingTripsCount ?? 0}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Upcoming Trips</p>
                    </div>
                </div> */}

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-rose-100 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/saved')}>
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                        <Heart size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{statsLoading ? "..." : stats?.savedToursCount ?? 0}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Saved Tours</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Verified</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Account Status</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Explore Banner */}
                <div className="bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl -z-10 rounded-full" />
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Find your perfect guide</h2>
                    <p className="text-gray-600 mb-8 max-w-sm">Browse our curated list of verified local experts to make your Sri Lankan journey truly unforgettable.</p>
                    
                    <button 
                        onClick={() => router.push('/guides')}
                        className="w-fit flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                    >
                        <Compass size={18} />
                        Explore Guides
                    </button>
                </div>

                {/* Recent Activities */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        Recent Activity
                    </h2>
                    <div className="space-y-6">
                        {statsLoading ? (
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : stats?.recentActivities && stats.recentActivities.length > 0 ? (
                            stats.recentActivities
                                .filter(a => a.type !== 'Booking')
                                .map((activity, index) => (
                                <div key={index} className="flex items-start gap-4 group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                        activity.type === 'Like' ? 'bg-rose-50 text-rose-500' : 'bg-primary/10 text-primary'
                                    }`}>
                                        {activity.type === 'Like' ? <Heart size={16} /> : <Calendar size={16} />}
                                    </div>
                                    <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                                        <p className="text-sm font-bold text-gray-900 leading-snug">{activity.message}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{activity.targetName}</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {activity.timeAgo}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                                    <Compass size={24} />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">No recent activity yet. Start exploring Sri Lanka!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
