"use client";

import React from "react";
import { 
    Users, Plus, Search, Filter, 
    Star, MapPin, ShieldCheck, Mail,
    MoreVertical, ArrowUpRight, Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";

interface Guide {
    id: string;
    name: string;
    role: string;
    rating: number;
    location: string;
    status: string;
    tripCount: number;
}

export default function AgencyGuidesPage() {
    const [guides, setGuides] = React.useState<Guide[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchGuides = async () => {
            try {
                const res = await apiClient.get<Guide[]>("/agency/guides");
                setGuides(res.data);
            } catch (error) {
                console.error("Error fetching guides:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuides();
    }, []);

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
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                    <Plus size={16} /> Recruit New Guide
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or language..." 
                        className="w-full bg-gray-50 border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {guides.map((guide, i) => (
                    <motion.div
                        key={guide.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                        
                        <div className="flex items-center gap-6 mb-8 relative z-10">
                            <div className={`w-20 h-20 rounded-[2rem] bg-${i % 2 === 0 ? 'blue' : 'emerald'}-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform`}>
                                {guide.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight italic">{guide.name}</h3>
                                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-1">{guide.role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                                <span className="text-xs font-black text-emerald-600 uppercase">{guide.status}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Rating</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-black text-gray-900">{guide.rating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                                <span>Base: {guide.location}</span>
                                <span>{guide.tripCount} Tours Guided</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-teal-600 h-full w-[85%] rounded-full shadow-sm" />
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-50 flex gap-4 relative z-10">
                            <button className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-gray-200">
                                View Profile
                            </button>
                             <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                                <Calendar size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Invite Card */}
                <button className="bg-gray-50/50 border-4 border-dashed border-gray-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center group hover:border-teal-200 transition-all">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-gray-100">
                        <Plus size={32} />
                    </div>
                    <h4 className="text-lg font-black text-gray-400 group-hover:text-teal-600 uppercase italic transition-colors tracking-tight">Expand Team</h4>
                    <p className="text-xs font-bold text-gray-300 mt-2 max-w-[180px]">Invite more verified professionals to your agency</p>
                </button>
            </div>
        </div>
    );
}
