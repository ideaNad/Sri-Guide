"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Star, Languages, ShieldCheck, MessageCircle, Calendar, Compass, Search, UserCircle, Loader2, Filter, X } from "lucide-react";
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

const GuidesPage = () => {
    const [guides, setGuides] = useState<DiscoveryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter states
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    const COMMON_LANGUAGES = ["English", "Sinhala", "Tamil", "German", "French", "Italian", "Japanese", "Chinese", "Russian", "Arabic"];
    const COMMON_AREAS = ["Colombo", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Mirissa", "Sigiriya", "Anuradhapura", "Polonnaruwa", "Yala", "Trincomalee", "Jaffna"];
    const COMMON_SPECIALTIES = ["Wildlife", "History", "Culture", "Photography", "Adventure", "Culinary"];

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", searchQuery);
        params.append("type", "guide");
        selectedLanguages.forEach(l => params.append("languages", l));
        selectedSpecialties.forEach(s => params.append("specialties", s));
        selectedAreas.forEach(a => params.append("areas", a));
        return params.toString();
    };

    const fetchGuides = async () => {
        setLoading(true);
        try {
            const qs = buildQueryString();
            const response = await apiClient.get<DiscoveryItem[]>(`/discovery?${qs}`);
            setGuides(response.data);
        } catch (error) {
            console.error("Failed to fetch guides", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuides();
    }, [selectedLanguages, selectedSpecialties, selectedAreas]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGuides();
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
                        <button 
                            type="button" 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-4 md:py-0 border-l border-gray-100 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${showFilters || selectedLanguages.length > 0 || selectedSpecialties.length > 0 || selectedAreas.length > 0 ? 'text-primary bg-primary/5' : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <Filter size={18} /> Filters
                            {(selectedLanguages.length + selectedSpecialties.length + selectedAreas.length) > 0 && (
                                <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                    {selectedLanguages.length + selectedSpecialties.length + selectedAreas.length}
                               </span>
                            )}
                        </button>
                        <button type="submit" className="bg-primary text-white px-10 py-5 font-bold text-sm hover:bg-secondary transition-all">Search</button>
                    </form>

                    {/* Advanced Filters Block */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="max-w-4xl mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden"
                            >
                                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Languages */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                            <Languages size={14} /> Languages
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {COMMON_LANGUAGES.map(lang => {
                                                const isSelected = selectedLanguages.includes(lang);
                                                return (
                                                    <button
                                                        key={lang}
                                                        type="button"
                                                        onClick={() => setSelectedLanguages(prev => isSelected ? prev.filter(l => l !== lang) : [...prev, lang])}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-primary/5'}`}
                                                    >
                                                        {lang}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {/* Specialties */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                            <Star size={14} /> Specialties
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {COMMON_SPECIALTIES.map(spec => {
                                                const isSelected = selectedSpecialties.includes(spec);
                                                return (
                                                    <button
                                                        key={spec}
                                                        type="button"
                                                        onClick={() => setSelectedSpecialties(prev => isSelected ? prev.filter(s => s !== spec) : [...prev, spec])}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'}`}
                                                    >
                                                        {spec}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {/* Areas */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                            <Compass size={14} /> Regions
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {COMMON_AREAS.slice(0, 8).map(area => {
                                                const isSelected = selectedAreas.includes(area);
                                                return (
                                                    <button
                                                        key={area}
                                                        type="button"
                                                        onClick={() => setSelectedAreas(prev => isSelected ? prev.filter(a => a !== area) : [...prev, area])}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-500/50 hover:bg-emerald-50'}`}
                                                    >
                                                        {area}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <button 
                                        onClick={() => {
                                            setSelectedLanguages([]);
                                            setSelectedSpecialties([]);
                                            setSelectedAreas([]);
                                        }}
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
                                    <div className="flex flex-wrap gap-2 mt-3 mb-1">
                                        {guide.type === 'agency' && (
                                            <span className="text-blue-600 font-semibold text-xs flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded">
                                                <ShieldCheck className="w-4 h-4 text-blue-500" /> Travel Agency
                                            </span>
                                        )}
                                        {guide.isLegit && (
                                            <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Licensed Guide <Star size={10} className="fill-emerald-500 text-emerald-500" />
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 relative z-10">
                                    <Link 
                                        href={`/profile/${guide.id}`}
                                        className="w-full flex items-center justify-center py-4 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:shadow-xl hover:shadow-primary/20"
                                    >
                                        <UserCircle className="w-4 h-4 mr-2" />
                                        View Profile
                                    </Link>
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
