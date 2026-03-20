"use client";

import React from "react";
import { 
    Map, Plus, Search, Filter, 
    MoreVertical, Eye, Edit3, Trash2,
    Calendar, MapPin, Users, Star, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";

interface Tour {
    id: string;
    title: string;
    location: string;
    price: number;
    status: string;
    reviews: number;
    rating: number;
    date: string;
    imageUrl: string | null;
    guideName: string;
}

export default function AgencyToursPage() {
    const [tours, setTours] = React.useState<Tour[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await apiClient.get<Tour[]>("/agency/trips");
                setTours(res.data);
            } catch (error) {
                console.error("Error fetching tours:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <Map className="text-teal-600" size={36} />
                        Tour Inventory
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Manage and monitor your curated Sri Lankan experiences</p>
                </div>
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                    <Plus size={16} /> Create New Package
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tours..." 
                        className="w-full bg-gray-50 border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Tour Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {tours.map((tour, i) => (
                    <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img 
                                src={tour.imageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${tour.imageUrl}` : "https://images.unsplash.com/photo-1544013919-add52c3dffbd?q=80&w=1200&auto=format"} 
                                alt={tour.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                <div className="flex gap-4">
                                     <button className="p-3 bg-white text-gray-900 rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl">
                                         <Edit3 size={18} />
                                     </button>
                                     <button className="p-3 bg-white text-gray-900 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-xl">
                                         <Trash2 size={18} />
                                     </button>
                                </div>
                            </div>
                            <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-xl ${
                                tour.status === 'Active' ? 'bg-white text-emerald-600 border-white' : 'bg-white text-orange-600 border-white'
                            }`}>
                                {tour.status}
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{tour.date}</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-black text-gray-900">{tour.rating > 0 ? tour.rating : 'New'}</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight italic mb-2 hover:text-teal-600 transition-colors cursor-pointer">{tour.title}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Guide: {tour.guideName}</p>
                            
                            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Base Price</span>
                                    <span className="text-2xl font-black text-gray-900 italic">${tour.price}</span>
                                </div>
                                <button className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-teal-600 hover:text-white transition-all">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Create Card */}
                <button className="border-4 border-dashed border-gray-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center group hover:border-teal-200 transition-all hover:bg-teal-50/30">
                    <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                        <Plus size={32} />
                    </div>
                    <h4 className="text-lg font-black text-gray-400 group-hover:text-teal-600 uppercase italic transition-colors">New Package</h4>
                    <p className="text-xs font-bold text-gray-300 mt-2 max-w-[180px]">Expand your inventory with a new destination</p>
                </button>
            </div>
        </div>
    );
}
