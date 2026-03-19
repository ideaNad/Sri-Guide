"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Star, Languages, ShieldCheck, MessageCircle, Calendar, Compass, Search, UserCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import apiClient from "@/lib/api-client";

interface DiscoveryItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    location: string;
    rating: number;
    reviews: number;
    type: string;
    tags: string[];
}

const GuidesPage = () => {
    const [guides, setGuides] = useState<DiscoveryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchGuides = async (query = "") => {
        setLoading(true);
        try {
            const response = await apiClient.get<DiscoveryItem[]>(`/discovery?type=guide&query=${query}`);
            setGuides(response.data);
        } catch (error) {
            console.error("Failed to fetch guides", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuides();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGuides(searchQuery);
    };
    return (
        <div className="pt-24 pb-24 min-h-screen bg-white">
            {/* Header */}
            <div className="bg-primary/5 py-20 mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl -z-10 animate-pulse" />
                <div className="container mx-auto px-4">
                    <SectionHeader
                        badge="Local Wisdom"
                        title="Professional Guides"
                        subtitle="The best way to see Sri Lanka is through the eyes of someone who calls it home."
                    />

                    <form onSubmit={handleSearch} className="max-w-xl flex flex-col md:flex-row items-stretch bg-white mt-8 border-2 border-gray-900 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center flex-1 px-4 py-4 md:py-0 border-b md:border-b-0 md:border-r border-gray-100">
                            <Search className="w-5 h-5 text-gray-400 mr-4 font-black" />
                            <input 
                                type="text" 
                                placeholder="Search by name, language..." 
                                className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest px-0" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-gray-900 text-white px-10 py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all">Search</button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                ) : guides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {guides.map((guide, idx) => (
                            <motion.div
                                key={guide.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-28 h-28 overflow-hidden shadow-xl border-[10px] border-white transform transition-all group-hover:scale-105 group-hover:rotate-2">
                                        <img 
                                            src={guide.image?.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${guide.image}` : guide.image} 
                                            alt={guide.title} 
                                            className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-all duration-500" 
                                        />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center bg-gray-900 px-3 py-1 border border-gray-900">
                                            <Star className="w-3 h-3 text-highlight fill-highlight mr-1" />
                                            <span className="text-xs font-black text-white">{guide.rating || 5.0}</span>
                                        </div>
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-3">{guide.reviews || 0} REVIEWS</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">{guide.title}</h3>
                                    <p className="text-primary font-bold text-sm tracking-tight">{guide.subtitle || "Local Guide"}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center text-sm text-gray-500 font-medium">
                                        <Languages className="w-4 h-4 mr-3 text-secondary" />
                                        {guide.tags?.join(", ") || "English, Sinhala"}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 font-medium">
                                        <ShieldCheck className="w-4 h-4 mr-3 text-emerald-500 fill-emerald-500/10" />
                                        <span className="text-emerald-700 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-1">
                                            Certified Professional <Star size={8} className="fill-emerald-500 text-emerald-500" />
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-0 border border-gray-100">
                                    <button className="flex items-center justify-center p-5 bg-white hover:bg-gray-900 hover:text-white transition-all text-gray-900 border-r border-gray-100">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
                                    </button>
                                    <Link 
                                        href={`/profile/${guide.id}`}
                                        className="flex items-center justify-center p-5 bg-white hover:bg-gray-900 hover:text-white transition-all text-gray-900 border-r border-gray-100"
                                    >
                                        <UserCircle className="w-5 h-5 mr-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                                    </Link>
                                    <button className="flex items-center justify-center p-5 bg-gray-900 text-white hover:bg-primary transition-all">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Book</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                        <Compass className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-gray-900 uppercase italic mb-2">No guides found</h3>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuidesPage;
