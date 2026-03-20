"use client";

import React, { useState, useEffect } from "react";
import { 
    Users, Plus, Search, Filter, 
    Star, MapPin, ShieldCheck, Mail,
    MoreVertical, ArrowUpRight, Calendar,
    X, UserPlus, Trash2, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import apiClient from "@/services/api-client";

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
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface AvailableGuide {
    id: string;
    name: string;
    profileImageUrl: string | null;
    location: string;
}

export default function AgencyGuidesPage() {
    const router = useRouter();
    const [guides, setGuides] = useState<Guide[]>([]);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        totalPages: 1,
        totalCount: 0
    });
    const [availableGuides, setAvailableGuides] = useState<AvailableGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRecruitModal, setShowRecruitModal] = useState(false);
    const [recruiting, setRecruiting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
 
    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.split('/api')[0];
        return `${baseUrl}${url}`;
    };
 
    const fetchGuides = async (page: number = 1) => {
        setLoading(true);
        try {
            const res = await apiClient.get<PaginatedResult<Guide>>(`/agency/guides?pageNumber=${page}&pageSize=6`);
            setGuides(res.data.items);
            setPagination({
                pageNumber: res.data.pageNumber,
                totalPages: res.data.totalPages,
                totalCount: res.data.totalCount
            });
        } catch (error) {
            console.error("Error fetching guides:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableGuides = async (term: string = "") => {
        try {
            const res = await apiClient.get<AvailableGuide[]>(`/agency/guides/available?searchTerm=${term}`);
            setAvailableGuides(res.data);
        } catch (error) {
            console.error("Error fetching available guides:", error);
        }
    };

    useEffect(() => {
        fetchGuides();
    }, []);

    const handleRecruit = async (guideId: string) => {
        setRecruiting(guideId);
        try {
            await apiClient.post("/agency/guides/add", { guideId });
            await fetchGuides();
            setShowRecruitModal(false);
        } catch (error) {
            console.error("Error recruiting guide:", error);
            alert("Failed to recruit guide.");
        } finally {
            setRecruiting(null);
        }
    };

    const handleRemove = async (guideId: string) => {
        if (!confirm("Are you sure you want to remove this guide from your agency?")) return;
        try {
            await apiClient.post("/agency/guides/remove", { guideId });
            await fetchGuides();
        } catch (error) {
            console.error("Error removing guide:", error);
            alert("Failed to remove guide.");
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <Users className="text-teal-600" size={36} />
                        Guide Roster
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Your team of verified elite professionals</p>
                </div>
                <button 
                    onClick={() => {
                        fetchAvailableGuides();
                        setShowRecruitModal(true);
                    }}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus size={16} /> Recruit New Guide
                </button>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {guides.map((guide, i) => (
                    <motion.div
                        key={guide.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden"
                    >
                        <button 
                            onClick={() => handleRemove(guide.userId)}
                            className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-rose-500 transition-colors z-20"
                            title="Remove from Agency"
                        >
                            <Trash2 size={16} />
                        </button>
 
                        <div className="flex items-center gap-4 mb-5 relative z-10">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg group-hover:rotate-3 transition-transform">
                                {guide.profileImageUrl ? (
                                    <img src={getImageUrl(guide.profileImageUrl)!} alt={guide.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full bg-${i % 2 === 0 ? 'blue' : 'emerald'}-600 text-white flex items-center justify-center font-black text-xl`}>
                                        {guide.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-black text-gray-900 tracking-tight truncate">{guide.name}</h3>
                                <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest mt-0.5">{guide.role}</p>
                            </div>
                        </div>
 
                        <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Status</span>
                                <span className={`text-[10px] font-black uppercase ${
                                    guide.status === 'On Tour' ? 'text-blue-600' : 
                                    guide.status === 'Approved' ? 'text-emerald-600' : 'text-orange-600'
                                }`}>
                                    {guide.status}
                                </span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Rating</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-black text-gray-900">{guide.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
 
                        <div className="mb-6 relative z-10">
                            <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">
                                <span>{guide.location}</span>
                                <span>{guide.tripCount} Tours</span>
                            </div>
                        </div>
 
                        <div className="mt-auto pt-5 border-t border-gray-50 flex flex-col gap-2 relative z-10">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => router.push(`/profile/${guide.userId}`)}
                                    className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg shadow-gray-200"
                                >
                                    View Profile
                                </button>
                                <button 
                                    onClick={() => router.push(`/agency/tours/create?guideId=${guide.userId}`)}
                                    className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                    title="Add Tour"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
 
                {/* Invite Card */}
                <button 
                    onClick={() => {
                        fetchAvailableGuides();
                        setShowRecruitModal(true);
                    }}
                    className="bg-gray-50/50 border-3 border-dashed border-gray-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group hover:border-teal-200 transition-all"
                >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-gray-100">
                        <Plus size={24} />
                    </div>
                    <h4 className="text-sm font-black text-gray-400 group-hover:text-teal-600 uppercase italic transition-colors tracking-tight">Expand Team</h4>
                </button>
            </div>
 
            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button 
                        disabled={pagination.pageNumber <= 1}
                        onClick={() => fetchGuides(pagination.pageNumber - 1)}
                        className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-teal-600 hover:border-teal-100 disabled:opacity-30 transition-all"
                    >
                        <ArrowUpRight className="rotate-[225deg]" size={20} />
                    </button>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Page {pagination.pageNumber} of {pagination.totalPages}
                    </span>
                    <button 
                        disabled={pagination.pageNumber >= pagination.totalPages}
                        onClick={() => fetchGuides(pagination.pageNumber + 1)}
                        className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-teal-600 hover:border-teal-100 disabled:opacity-30 transition-all"
                    >
                        <ArrowUpRight className="rotate-45" size={20} />
                    </button>
                </div>
            )}

            {/* Recruit Modal */}
            <AnimatePresence>
                {showRecruitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRecruitModal(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 italic tracking-tight flex items-center gap-3">
                                        <UserPlus className="text-teal-600" size={24} />
                                        Recruit Professionals
                                    </h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Available verified guides in Sri Lanka</p>
                                </div>
                                <button 
                                    onClick={() => setShowRecruitModal(false)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-2xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="px-10 pb-6 pt-2 border-b border-gray-50">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="Search by name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            fetchAvailableGuides(e.target.value);
                                        }}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-4">
                                {availableGuides.map((guide) => (
                                    <div 
                                        key={guide.id}
                                        className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-teal-100 hover:bg-white transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                                                {guide.profileImageUrl ? (
                                                    <img src={getImageUrl(guide.profileImageUrl)!} alt={guide.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    guide.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 tracking-tight">{guide.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{guide.location}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRecruit(guide.id)}
                                            disabled={recruiting === guide.id}
                                            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all disabled:opacity-50"
                                        >
                                            {recruiting === guide.id ? "Recruiting..." : "Send Offer"}
                                        </button>
                                    </div>
                                ))}

                                {availableGuides.length === 0 && (
                                    <div className="text-center py-20 grayscale opacity-50">
                                        <Users size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No available guides found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
