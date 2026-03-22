"use client";

import React from "react";
import { 
    Users, Map, Briefcase, TrendingUp, 
    ArrowUpRight, AlertCircle, Plus, Calendar,
    Building2, Globe, Clock, ArrowRight, ShieldCheck,
    Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";

interface DashboardStats {
    totalActiveTours: number;
    totalHiddenTours: number;
    totalGuides: number;
    totalBookings: number;
    totalRevenue: number;
    recentActivities: any[];
    recentTours: any[];
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
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const baseUrl = apiClient.defaults.baseURL?.split('/api')[0];
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
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
        { label: "Active Tours", value: stats?.totalActiveTours.toString() ?? "0", icon: <Map size={20} />, color: "bg-emerald-50 text-emerald-600" },
        { label: "Hidden Tours", value: stats?.totalHiddenTours.toString() ?? "0", icon: <AlertCircle size={20} />, color: "bg-orange-50 text-orange-600" },
        { label: "Elite Guides", value: stats?.totalGuides.toString() ?? "0", icon: <Users size={20} />, color: "bg-blue-50 text-blue-600" },
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
                        onClick={() => router.push("/agency/trips")}
                        className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
                    >
                        <ImageIcon size={16} /> Manage Gallery
                    </button>
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

            {/* Recent Tours Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight underline decoration-teal-600/30 decoration-4 underline-offset-8">Recent Tour Packages</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Latest additions to your travel inventory</p>
                    </div>
                    <button 
                        onClick={() => router.push("/agency/tours")}
                        className="bg-teal-50 text-teal-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center gap-2 group/btn shadow-sm"
                    >
                        Full Inventory <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats?.recentTours.map((tour: any, i: number) => (
                        <motion.div
                            key={tour.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => router.push(`/agency/tours/edit/${tour.slug || tour.id}`)}
                            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer relative"
                        >
                            <div className="h-48 relative overflow-hidden">
                                <img 
                                    src={getImageUrl(tour.imageUrl) || "https://images.unsplash.com/photo-1544013919-add52c3dffbd?q=80&w=1200&auto=format"} 
                                    alt={tour.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-teal-600 border border-white shadow-xl">
                                    {tour.status}
                                </div>
                                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-teal-600 px-4 py-2 rounded-xl shadow-lg">Manage Tour</span>
                                </div>
                            </div>
                            <div className="p-8">
                                {tour.date && (
                                    <span className="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] mb-3 block">{tour.date}</span>
                                )}
                                <h4 className="text-lg font-black text-gray-900 uppercase italic truncate mb-4 group-hover:text-teal-600 transition-colors">{tour.title}</h4>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Base Price</span>
                                        <span className="text-xl font-black text-gray-900 italic leading-none">${tour.price}</span>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-teal-600 group-hover:text-white transition-all">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {(!stats?.recentTours || stats.recentTours.length === 0) && (
                        <div className="col-span-full py-16 border-4 border-dashed border-gray-50 rounded-[3rem] text-center flex flex-col items-center group hover:bg-teal-50/50 transition-colors">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-6 group-hover:bg-teal-100 group-hover:text-teal-600 transition-all">
                                <Plus size={32} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] max-w-[200px] leading-loose">
                                No inventory found. Click &quot;New Tour&quot; to begin.
                            </p>
                        </div>
                    )}
                </div>
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
