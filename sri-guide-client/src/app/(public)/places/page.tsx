"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import apiClient from "@/services/api-client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, Loader2, Compass } from "lucide-react";

interface PopularPlace {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  viewCount: number;
  slug?: string;
}

const PlacesPage = () => {
    const [places, setPlaces] = useState<PopularPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPlaces = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<PopularPlace[]>("/places");
            setPlaces(response.data);
        } catch (error) {
            console.error("Failed to fetch popular places:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const filteredPlaces = places.filter(place => 
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getImageUrl = (url?: string) => {
        if (!url || url.trim() === "") return "https://placehold.co/600x400?text=No+Image+Available";
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.split('/api')[0];
        return `${baseUrl}${url}`;
    };

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <SectionHeader
                        centered
                        badge="Destinations"
                        title="Popular Places in Sri Lanka"
                        subtitle="From golden beaches to misty mountains, discover the magic of the island."
                    />

                    {/* Search Bar */}
                    <div className="mt-10 max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-focus-within:bg-primary/10 transition-all duration-500" />
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search destinations (e.g. Ella, Sigiriya, Mirissa)..."
                                className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-full focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-sm shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] h-[450px] animate-pulse border border-gray-50" />
                        ))}
                    </div>
                ) : filteredPlaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredPlaces.map((place, idx) => (
                            <motion.div
                                key={place.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link 
                                    href={`/places/${place.slug || place.id}`}
                                    className="group block bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col"
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={getImageUrl(place.imageUrl)}
                                            alt={place.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                                Discover Space <Compass size={12} className="animate-spin-slow" />
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MapPin size={14} className="text-primary" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sri Lanka</p>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-primary transition-colors tracking-tight italic uppercase">
                                            {place.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                                            {place.description.replace(/<[^>]*>/g, '')}
                                        </p>
                                        
                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                                    <Compass size={14} className="text-gray-400" />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Explore Now</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-primary/30">
                                                <Compass size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Compass className="mx-auto text-gray-100 mb-6 animate-pulse" size={80} />
                        <h3 className="text-2xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">No destinations found</h3>
                        <p className="text-gray-400 font-bold text-sm">We couldn't find any places matching your search criteria.</p>
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95"
                        >
                            Reset Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacesPage;
