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

                    <form onSubmit={handleSearch} className="max-w-xl flex flex-col md:flex-row items-stretch bg-white mt-8 border border-gray-100 shadow-xl rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center flex-1 px-6 py-4 md:py-0">
                            <Search className="w-5 h-5 text-gray-400 mr-4 font-bold" />
                            <input 
                                type="text" 
                                placeholder="Search by name, language..." 
                                className="flex-1 outline-none text-sm font-semibold text-gray-700 placeholder:font-medium placeholder:tracking-normal px-0" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-primary text-white px-10 py-5 font-bold text-sm hover:bg-secondary transition-all">Search</button>
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
                                className="group bg-white border border-gray-50/80 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative rounded-3xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="w-28 h-28 overflow-hidden shadow-lg rounded-full border-4 border-white transform transition-all group-hover:scale-105 group-hover:rotate-2">
                                        <img 
                                            src={guide.image?.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${guide.image}` : guide.image} 
                                            alt={guide.title} 
                                            className="w-full h-full object-cover transition-all duration-500" 
                                        />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center bg-primary px-3 py-1.5 rounded-full shadow-sm">
                                            <Star className="w-3.5 h-3.5 text-highlight fill-highlight mr-1.5" />
                                            <span className="text-xs font-bold text-white">{guide.rating || 5.0}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">{guide.reviews || 0} REVIEWS</span>
                                    </div>
                                </div>

                                <div className="mb-6 relative z-10">
                                    <h3 className="text-2xl font-bold text-secondary mb-1.5 group-hover:text-primary transition-colors">{guide.title}</h3>
                                    <p className="text-primary font-medium text-sm">{guide.subtitle || "Local Guide"}</p>
                                </div>

                                <div className="space-y-3 mb-8 relative z-10">
                                    <div className="flex items-center text-sm text-gray-500 font-medium">
                                        <Languages className="w-4 h-4 mr-3 text-secondary/60" />
                                        {guide.tags?.join(", ") || "English, Sinhala"}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 font-medium">
                                        <ShieldCheck className="w-4 h-4 mr-3 text-emerald-500" />
                                        <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1.5">
                                            Certified Professional <Star size={10} className="fill-emerald-500 text-emerald-500" />
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50 relative z-10">
                                    <button className="flex-1 flex items-center justify-center py-3.5 rounded-xl bg-gray-50 hover:bg-primary/5 hover:text-primary transition-all text-secondary font-bold text-xs">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Chat
                                    </button>
                                    <Link 
                                        href={`/profile/${guide.id}`}
                                        className="flex-1 flex items-center justify-center py-3.5 rounded-xl bg-gray-50 hover:bg-primary/5 hover:text-primary transition-all text-secondary font-bold text-xs"
                                    >
                                        <UserCircle className="w-4 h-4 mr-2" />
                                        Profile
                                    </Link>
                                    <button className="flex-1 flex items-center justify-center py-3.5 rounded-xl bg-primary text-white hover:bg-secondary transition-all font-bold text-xs shadow-md shadow-primary/20">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Book
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm">
                        <Compass className="w-16 h-16 text-primary/20 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-secondary mb-2">No guides found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuidesPage;
