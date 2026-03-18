"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
    User, Settings, ShieldCheck, TrendingUp, 
    MapPin, Calendar, MessageSquare, Plus,
    ArrowUpRight, Building2, Star
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";
import EditProfileModal from "@/components/EditProfileModal";

const DashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await apiClient.get("/profile/me");
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProfile();
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const isGuide = user?.role === "Guide";
    const isAgency = user?.role === "TravelAgency";

    return (
        <div className="pt-32 pb-24 bg-gray-50/50 min-h-screen">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">
                            Welcome back, <span className="text-primary">{user?.fullName.split(' ')[0]}</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Manage your {user?.role.toLowerCase()} account and activities.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
                            <Settings size={18} />
                            <span>Settings</span>
                        </button>
                        {isGuide && (
                            <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                <Plus size={18} />
                                <span>Create Tour</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Profile */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Total Bookings", value: "24", icon: <Calendar className="text-blue-500" />, trend: "+12%" },
                                { label: "Total Earnings", value: "$4,250", icon: <TrendingUp className="text-green-500" />, trend: "+8%" },
                                { label: "Avg Rating", value: "4.9", icon: <Star className="text-highlight fill-highlight" />, trend: "Excellent" }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass p-6 rounded-3xl border border-white/40 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gray-50 rounded-2xl">{stat.icon}</div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${i === 2 ? 'bg-highlight/10 text-highlight' : 'bg-green-50 text-green-600'}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
                                <button className="text-primary text-sm font-bold hover:underline">View All</button>
                            </div>
                            <div className="space-y-6">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Nuwara Eliya Discovery Tour</p>
                                                <p className="text-xs text-gray-500">24 Oct, 2023 • 4 Travelers</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900">$240.00</p>
                                            <p className="text-[10px] font-bold text-green-500 uppercase tracking-tight">Completed</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Notifications */}
                    <div className="space-y-8">
                        {/* Profile Completion */}
                        <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Complete Profile</h3>
                                <p className="text-white/70 text-sm mb-6">Boost your visibility and trust by completing your profile details.</p>
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-black mb-2">
                                        <span>Current Status</span>
                                        <span>75%</span>
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-3/4 rounded-full" />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full bg-white text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Continue Setup</span>
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                        </div>
                        
                        <EditProfileModal 
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            user={user}
                            profile={profile}
                            onSuccess={() => {
                                // Refetch profile
                                apiClient.get("/profile/me").then(res => setProfile(res.data));
                            }}
                        />

                        {/* Upgrade Path */}
                        {isGuide && (
                            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4 text-secondary">
                                    <Building2 size={24} />
                                    <h3 className="text-xl font-bold text-gray-900">Become an Agency</h3>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                    Scale your business! Travel agencies can manage multiple guides and list larger tour packages.
                                </p>
                                <button 
                                    onClick={() => router.push("/dashboard/upgrade")}
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                                >
                                    Start Upgrade Flow
                                </button>
                            </div>
                        )}

                        {/* Quick Tips */}
                        <div className="bg-secondary/5 rounded-[2.5rem] p-8 border border-secondary/10">
                            <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                                <ShieldCheck size={20} />
                                <span>Security Tip</span>
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Always verify your travelers' identity before the tour starts for a safer experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
