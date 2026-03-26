"use client";

import React, { useEffect, useState } from "react";
import { 
    Plus, Search, Map as MapIcon, 
    Loader2, ChevronLeft, ArrowUpRight,
    Star, Trash2, Edit3, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { useToast } from "@/hooks/useToast";


interface Tour {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    imageUrl?: string;
    status: string;
    isActive: boolean;
    guideName: string;
    date?: string;
    rating?: number;
    reviews?: number;
    slug?: string;
}

export default function AgencyToursPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { confirm } = useConfirm();
    const { toast } = useToast();
    const [tours, setTours] = useState<Tour[]>([]);

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');

    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const baseUrl = apiClient.defaults.baseURL?.split('/api')[0];
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        if (user?.id) fetchTours();
    }, [user]);

    const fetchTours = async () => {
        try {
            const response = await apiClient.get('/Agency/tours');
            setTours(response.data as Tour[]);
        } catch (error) {
            console.error("Failed to fetch tours", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTour = async (id: string) => {
        const confirmed = await confirm({
            title: "Delete Tour",
            message: "Are you sure you want to delete this tour package? This action cannot be undone.",
            variant: "danger"
        });
        if (!confirmed) return;
        
        try {
            await apiClient.delete(`/Agency/tours/${id}`);
            setTours(prev => prev.filter(t => t.id !== id));
            toast.success("Tour package deleted successfully.");
        } catch (error) {
            console.error("Failed to delete tour", error);
            toast.error("Failed to delete tour package. Please try again.");
        }
    };


    const handleToggleActive = async (id: string) => {
        try {
            await apiClient.patch(`/Agency/tours/${id}/toggle-active`);
            setTours(prev => prev.map(t => 
                t.id === id ? { ...t, isActive: !t.isActive } : t
            ));
        } catch (error) {
            console.error("Failed to toggle tour status", error);
        }
    };

    const filteredTours = tours.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              t.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
                              (statusFilter === 'active' ? t.isActive : !t.isActive);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#FDFDFF] p-6 lg:p-12">
            {/* Header Section */}
            <div className="max-w-[1400px] mx-auto mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center text-[#2E7D32] shrink-0">
                            <MapIcon size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[#1A1F2C] tracking-tight mb-1">Tour Inventory</h1>
                            <p className="text-gray-500 font-medium">Manage and monitor your curated Sri Lankan experiences</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => router.push("/agency/tours/create")}
                        className="bg-[#3061E3] hover:bg-[#2549B0] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(48,97,227,0.2)] flex items-center gap-3 w-fit"
                    >
                        <Plus size={18} /> Create New Package
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3061E3] transition-colors">
                            <Search size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search tours..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-[2rem] pl-16 pr-8 py-6 text-gray-700 font-bold focus:outline-none focus:ring-4 focus:ring-[#3061E3]/5 focus:border-[#3061E3] transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm shrink-0">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'active', label: 'Active' },
                            { id: 'hidden', label: 'Hidden' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id as any)}
                                className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === tab.id 
                                        ? 'bg-[#1A1F2C] text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-center flex-col gap-4 text-gray-400">
                            <Loader2 className="animate-spin" size={48} />
                            <p className="font-bold uppercase tracking-widest text-xs">Loading Inventory...</p>
                        </div>
                    ) : (
                        <>
                            {filteredTours.map((tour) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={tour.id}
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#3061E3]/10 transition-all duration-500"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-56 w-full overflow-hidden">
                                    <img 
                                        src={getImageUrl(tour.imageUrl) || "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop"} 
                                        alt={tour.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <button 
                                                onClick={() => handleToggleActive(tour.id)}
                                                className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    tour.isActive ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/20 shadow-lg shadow-emerald-500/10' : 'bg-gray-100/90 backdrop-blur-md text-gray-500 border border-gray-200 shadow-lg'
                                                }`}
                                            >
                                                {tour.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                        </div>
                                        
                                        {/* Quick Actions */}
                                        <div className="absolute top-6 right-6 flex flex-col gap-2 transition-opacity">
                                            <button 
                                                onClick={() => router.push(`/agency/tours/edit/${tour.slug || tour.id}`)}
                                                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-700 hover:bg-[#3061E3] hover:text-white transition-all shadow-lg"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTour(tour.id)}
                                                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em]">
                                                {tour.date || "Mar 21"}
                                            </div>
                                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                                                {tour.reviews ? `${tour.reviews} Reviews` : "No Reviews"}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-[#1A1F2C] mb-1 group-hover:text-[#3061E3] transition-colors">{tour.title}</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">GUIDE: {tour.guideName || "UNKNOWN"}</p>

                                        <div className="flex items-end justify-between border-t border-gray-50 pt-6">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Base Price</p>
                                                <p className="text-3xl font-black text-[#1A1F2C] tracking-tighter">${tour.price}</p>
                                            </div>
                                            <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#3061E3] hover:text-white transition-all">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* New Package Placeholder */}
                            <motion.div 
                                onClick={() => router.push("/agency/tours/create")}
                                className="group cursor-pointer border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:border-[#3061E3] hover:bg-[#3061E3]/[0.02] transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-[#3061E3]/10 group-hover:text-[#3061E3] transition-all mb-6">
                                    <Plus size={32} />
                                </div>
                                <h3 className="text-xl font-black text-[#1A1F2C] mb-2 uppercase tracking-tight">New Package</h3>
                                <p className="text-center text-gray-400 font-medium text-sm">Expand your inventory with a<br />new destination</p>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
