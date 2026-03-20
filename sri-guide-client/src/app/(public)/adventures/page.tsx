"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import {
    Star, MapPin, Heart, Search, Loader2, Compass,
    Calendar, ArrowRight, Filter, X, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";

interface Trip {
    id: string;
    title: string;
    description: string;
    location: string;
    date?: string;
    imageUrl?: string;
    guideName: string;
    guideImageUrl?: string;
    guideUserId: string;
    likeCount: number;
    isLiked?: boolean;
}

const COMMON_LOCATIONS = [
    "Colombo", "Kandy", "Galle", "Ella", "Nuwara Eliya",
    "Mirissa", "Sigiriya", "Anuradhapura", "Yala", "Trincomalee"
];

export default function AdventuresPage() {
    const { user, login } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("query", searchQuery);
            selectedLocations.forEach(l => params.append("locations", l));
            const response = await apiClient.get<Trip[]>(`/discovery/recent-trips?${params.toString()}`);
            setTrips(response.data);
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, [selectedLocations]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTrips();
    };

    const handleToggleLike = async (tripId: string) => {
        if (!user) { setIsAuthModalOpen(true); return; }
        try {
            const response = await apiClient.post<{ liked: boolean }>(`/trip/${tripId}/toggle-like`);
            const { liked } = response.data;
            setTrips(prev => prev.map(t =>
                t.id === tripId ? { ...t, isLiked: liked, likeCount: liked ? t.likeCount + 1 : t.likeCount - 1 } : t
            ));
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const getImageUrl = (url?: string) => {
        if (!url) return "https://images.unsplash.com/photo-1588267240364-706d8848db9a?q=80&w=800&auto=format&fit=crop";
        return url.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${url}` : url;
    };

    return (
        <>
        <div className="pt-24 pb-24 min-h-screen bg-white">

            {/* Hero Header */}
            <div className="bg-primary/5 py-20 mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl -z-10 animate-pulse" />
                <div className="container mx-auto px-4">
                    <SectionHeader
                        badge="Explore Sri Lanka"
                        title="Adventures & Stories"
                        subtitle="Immersive journeys curated by local guides who know every hidden path and secret viewpoint."
                    />

                    <form onSubmit={handleSearch} className="max-w-xl flex flex-col md:flex-row items-stretch bg-white mt-8 border border-gray-100 shadow-xl rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center flex-1 px-6 py-4 md:py-0">
                            <Search className="w-5 h-5 text-gray-400 mr-4 font-bold" />
                            <input
                                type="text"
                                placeholder="Search adventures, locations..."
                                className="flex-1 outline-none text-sm font-semibold text-gray-700 placeholder:font-medium placeholder:tracking-normal px-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-4 md:py-0 border-l border-gray-100 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${showFilters || selectedLocations.length > 0 ? 'text-primary bg-primary/5' : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <Filter size={18} /> Filters
                            {selectedLocations.length > 0 && (
                                <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                    {selectedLocations.length}
                                </span>
                            )}
                        </button>
                        <button type="submit" className="bg-primary text-white px-10 py-5 font-bold text-sm hover:bg-secondary transition-all">
                            Search
                        </button>
                    </form>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="max-w-4xl mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden"
                            >
                                <div className="p-8">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                        <MapPin size={14} /> Filter by Region
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {COMMON_LOCATIONS.map(loc => {
                                            const isSelected = selectedLocations.includes(loc);
                                            return (
                                                <button
                                                    key={loc}
                                                    type="button"
                                                    onClick={() => setSelectedLocations(prev => isSelected ? prev.filter(l => l !== loc) : [...prev, loc])}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-primary/5'}`}
                                                >
                                                    {loc}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setSelectedLocations([])}
                                        className="text-xs font-bold text-gray-500 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center gap-2"
                                    >
                                        <X size={14} /> Clear all filters
                                    </button>
                                    <div className="text-xs font-bold text-gray-400 tracking-wider">
                                        Filters are applied instantly
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Trip Grid */}
            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                ) : trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip, idx) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={getImageUrl(trip.imageUrl)}
                                        alt={trip.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm text-secondary">
                                        <MapPin size={10} className="text-primary" />
                                        {trip.location}
                                    </div>
                                    <button
                                        onClick={() => handleToggleLike(trip.id)}
                                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${trip.isLiked ? 'bg-rose-500 text-white' : 'bg-white/90 text-gray-400 hover:text-rose-500'}`}
                                    >
                                        <Heart size={14} fill={trip.isLiked ? "currentColor" : "none"} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    {/* Guide row */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md bg-primary flex items-center justify-center text-white text-xs font-bold">
                                            {trip.guideImageUrl ? (
                                                <img src={getImageUrl(trip.guideImageUrl)} className="w-full h-full object-cover" alt={trip.guideName} />
                                            ) : (
                                                <User size={14} />
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-900">{trip.guideName}</span>
                                            {trip.date && (
                                                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                                    <Calendar size={9} />
                                                    {new Date(trip.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            )}
                                        </div>
                                        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                                            <Heart size={10} fill="currentColor" />
                                            {trip.likeCount}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {trip.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 mb-6 flex-1">
                                        {trip.description || "A breathtaking journey curated specifically for an unforgettable experience."}
                                    </p>

                                    <Link
                                        href={`/adventures/${trip.id}`}
                                        className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 text-xs font-bold text-primary group-hover:gap-3 gap-2 transition-all"
                                    >
                                        <span>Read the Story</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm">
                        <Compass className="w-16 h-16 text-primary/20 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-secondary mb-2">No adventures found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or clearing filters</p>
                    </div>
                )}
            </div>

        </div>

        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={(userData) => { login(userData); setIsAuthModalOpen(false); }}
        />
        </>
    );
}
