"use client";

import React from "react";
import { 
    Users, Map, Briefcase, TrendingUp, 
    ArrowUpRight, AlertCircle, Plus, Calendar,
    Building2, Globe, Clock, ArrowRight, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";

interface DashboardStats {
    totalTours: number;
    totalGuides: number;
    totalBookings: number;
    totalRevenue: number;
    recentActivities: any[];
}

interface Guide {
    id: string;
    userId: string;
    name: string;
    role: string;
    rating: number;
    location: string;
    status: string;
    tripCount: number;
    profileImageUrl?: string;
}

interface PaginatedResult<T> {
    items: T[];
    totalCount?: number;
    pageNumber?: number;
    pageSize?: number;
    totalPages?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
}

export default function AgencyDashboardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [stats, setStats] = React.useState<DashboardStats | null>(null);
    const [guides, setGuides] = React.useState<Guide[]>([]);
    const [loading, setLoading] = React.useState(true);
 
    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.split('/api')[0];
        return `${baseUrl}${url}`;
    };
 
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, guidesRes] = await Promise.all([
                    apiClient.get<DashboardStats>("/agency/dashboard"),
                    apiClient.get<PaginatedResult<Guide>>("/agency/guides?pageSize=5")
                ]);
                setStats(statsRes.data);
                setGuides(guidesRes.data.items);
            } catch (error) {
                console.error("Error fetching agency data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const statCards = [
        { label: "Active Tours", value: stats?.totalTours.toString() ?? "0", icon: <Map size={20} />, color: "bg-teal-50 text-teal-600" },
        { label: "Elite Guides", value: stats?.totalGuides.toString() ?? "0", icon: <Users size={20} />, color: "bg-blue-50 text-blue-600" },
        { label: "Total Bookings", value: stats?.totalBookings.toString() ?? "0", icon: <Calendar size={20} />, color: "bg-primary/10 text-primary" },
        { label: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: <TrendingUp size={20} />, color: "bg-emerald-50 text-emerald-600" },
    ];

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section with welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        AYUBOWAN, <span className="text-teal-600">{user?.fullName?.split(" ")[0]}</span>
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">Overseeing first-class Sri Lankan experiences for your agency.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => router.push("/agency/tours")}
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                    >
                        <Plus size={16} /> New Tour
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className={`p-4 rounded-2xl ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                        
                        <div className="relative z-10">
                            <p className="text-4xl font-black text-gray-900 mb-2 tracking-tighter leading-none italic">{stat.value}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Active Roster */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/30 blur-[100px] rounded-full -mr-32 -mt-32" />
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Active Guide Roster</h3>
                            <p className="text-xs text-gray-400 font-bold mt-1">Real-time status of your verified professionals</p>
                        </div>
                        <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-teal-600 transition-all hover:bg-teal-50 border border-gray-100">
                             <TrendingUp size={18} />
                        </button>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        {guides.map((guide, i) => (
                            <div 
                                key={guide.id} 
                                onClick={() => router.push(`/profile/${guide.userId}`)}
                                className="flex items-center gap-6 p-5 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                    {guide.profileImageUrl ? (
                                        <img src={getImageUrl(guide.profileImageUrl)!} alt={guide.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full bg-${i % 2 === 0 ? 'blue' : 'emerald'}-600 text-white flex items-center justify-center font-black text-xl`}>
                                            {guide.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-gray-900 tracking-tight group-hover:text-teal-600 transition-colors">{guide.name}</p>
                                    <div className="flex items-center gap-6 mt-1.5">
                                        <div className="flex items-center gap-2">
                                            <Globe size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{guide.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Map size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{guide.tripCount} Trips</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        guide.status === 'On Tour' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                        guide.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                    }`}>
                                        {guide.status}
                                    </span>
                                    <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </div>
                            </div>
                        ))}
                        {guides.length === 0 && <p className="text-center py-10 text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">No guides assigned yet</p>}
                    </div>
                </div>

                {/* Operations & Tips */}
                <div className="space-y-8">
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-8 border-b border-white/5 pb-4">Actions</h4>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group/btn">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                                        <Plus size={18} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">New Package</span>
                                </div>
                                <ArrowUpRight size={16} className="text-white/20 group-hover/btn:text-white transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group/btn">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <Users size={18} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Invite Guide</span>
                                </div>
                                <ArrowUpRight size={16} className="text-white/20 group-hover/btn:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-teal-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 blur-[60px] rounded-full" />
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                            <ShieldCheck size={32} />
                        </div>
                        <h4 className="font-black text-xl mb-3 tracking-tight">Verified Status</h4>
                        <p className="text-xs font-bold text-teal-50/80 leading-relaxed italic mb-8">
                            Your agency is currently verified. This gives your tours a <span className="text-white font-black underline">40% visibility boost</span> in global searches.
                        </p>
                        <button className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-teal-600 px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
