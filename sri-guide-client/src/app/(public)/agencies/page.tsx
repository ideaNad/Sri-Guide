"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Star, ShieldCheck, Compass, Search, Loader2, Filter, X, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import apiClient from "@/services/api-client";

interface DiscoveryItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    location: string;
    rating: number;
    reviews: number;
    type: string;
    isLegit?: boolean;
    tags: string[];
}

interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

const AgenciesPage = () => {
    const [agencies, setAgencies] = useState<DiscoveryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const COMMON_AREAS = ["Colombo", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Mirissa", "Sigiriya", "Anuradhapura", "Polonnaruwa", "Yala", "Trincomalee", "Jaffna"];

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", searchQuery);
        params.append("type", "agency");
        params.append("pageNumber", pageNumber.toString());
        params.append("pageSize", "12");
        selectedAreas.forEach(a => params.append("areas", a));
        return params.toString();
    };

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            const qs = buildQueryString();
            const response = await apiClient.get<PaginatedResult<DiscoveryItem>>(`/discovery?${qs}`);
            setAgencies(response.data.items || []);
            setTotalCount(response.data.totalCount || 0);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch agencies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageNumber(1);
        fetchAgencies();
    }, [selectedAreas]);

    useEffect(() => {
        fetchAgencies();
    }, [pageNumber]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAgencies();
    };

    return (
        <div className="pt-24 pb-24 min-h-screen bg-white">
            {/* Header */}
            <div className="bg-blue-50/30 py-20 mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 blur-3xl -z-10 animate-pulse" />
                <div className="container mx-auto px-4">
                    <SectionHeader
                        badge="Business Partners"
                        title="Travel Agencies"
                        subtitle="Discover professional companies organizing the most memorable experiences in Sri Lanka."
                    />

                    <form onSubmit={handleSearch} className="max-w-xl flex flex-col md:flex-row items-stretch bg-white mt-8 border border-gray-100 shadow-xl rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center flex-1 px-6 py-4 md:py-0">
                            <Search className="w-5 h-5 text-gray-400 mr-4 font-bold" />
                            <input
                                type="text"
                                placeholder="Search agency name, location..."
                                className="flex-1 outline-none text-sm font-semibold text-gray-700 placeholder:font-medium placeholder:tracking-normal px-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-4 md:py-0 border-l border-gray-100 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${showFilters || selectedAreas.length > 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <Filter size={18} /> Filters
                            {selectedAreas.length > 0 && (
                                <span className="bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                    {selectedAreas.length}
                                </span>
                            )}
                        </button>
                        <button type="submit" className="bg-gray-900 text-white px-10 py-5 font-bold text-sm hover:bg-blue-600 transition-all">Search</button>
                    </form>

                    {/* Advanced Filters Block */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="max-w-xl mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden"
                            >
                                <div className="p-8">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                                        <Compass size={14} /> Operating Regions
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {COMMON_AREAS.map(area => {
                                            const isSelected = selectedAreas.includes(area);
                                            return (
                                                <button
                                                    key={area}
                                                    type="button"
                                                    onClick={() => setSelectedAreas(prev => isSelected ? prev.filter(a => a !== area) : [...prev, area])}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'}`}
                                                >
                                                    {area}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setSelectedAreas([])}
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

            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                ) : agencies.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {agencies.map((agency, idx) => (
                                <motion.div
                                    key={agency.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-white border border-gray-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[3rem] text-center flex flex-col items-center"
                                >
                                    <div className="w-24 h-24 rounded-3xl overflow-hidden mb-8 shadow-xl border-4 border-white rotate-3 group-hover:rotate-0 transition-all duration-500 shrink-0">
                                        <img
                                            src={agency.image ? (agency.image.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${agency.image}` : agency.image) : `https://ui-avatars.com/api/?name=${agency.title}&background=000&color=fff&bold=true`}
                                            alt={agency.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 mb-2 truncate max-w-full">{agency.title}</h3>

                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                            Travel Agency
                                        </span>
                                        <div className="flex items-center bg-gray-900 px-2.5 py-1 rounded-full text-white text-[10px] font-bold">
                                            <Star size={10} className="text-yellow-400 fill-yellow-400 mr-1" />
                                            {agency.rating || 5.0}
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed h-10">
                                        {agency.subtitle || "Professional Sri Lankan travel management and tour operator."}
                                    </p>

                                    <div className="w-full pt-6 border-t border-gray-50">
                                        <Link
                                            href={`/profile/${agency.id}?type=agency`}
                                            className="w-full flex items-center justify-center py-4 bg-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200"
                                        >
                                            <Building2 className="w-4 h-4 mr-2" />
                                            View Agency Profile
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center space-x-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPageNumber(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm shadow-sm transition-all ${
                                            pageNumber === i + 1 
                                            ? "bg-gray-900 text-white shadow-md shadow-gray-400" 
                                            : "bg-white border border-gray-100 text-gray-500 hover:border-blue-600 hover:text-blue-600"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-24 text-center bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm">
                        <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-secondary mb-2 uppercase italic tracking-tighter">No Agencies found</h3>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgenciesPage;
