"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MapPin, Users, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";
import apiClient from "@/lib/api-client";

const DiscoveryPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const typeParam = activeFilter === "all" ? "" : `&type=${activeFilter}`;
                const response = await apiClient.get(`/discovery?query=${searchQuery}${typeParam}`);
                setProviders(response.data as any[]);
            } catch (error) {
                console.error("Error fetching discovery data:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchProviders, 300); // Debounce
        return () => clearTimeout(timer);
    }, [searchQuery, activeFilter]);

    return (
        <div className="pt-32 pb-24 bg-gray-50/50 min-h-screen">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <SectionHeader 
                    title="Discover Excellence" 
                    subtitle="Connect with certified guides and premium travel agencies across Sri Lanka."
                />

                {/* Search & Filter Bar */}
                <div className="relative z-10 -mt-8 mb-16">
                    <div className="glass p-4 rounded-[2rem] shadow-xl border border-white/40 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search by name, expertise or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/50 border border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-jakarta"
                            />
                        </div>
                        
                        <div className="flex p-1 bg-gray-100/50 rounded-2xl w-full md:w-auto">
                            {[
                                { id: "all", label: "All", icon: <Users size={16} /> },
                                { id: "guide", label: "Guides", icon: <Users size={16} /> },
                                { id: "agency", label: "Agencies", icon: <Building2 size={16} /> }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-xl transition-all ${
                                        activeFilter === f.id 
                                            ? "bg-white shadow-sm text-primary" 
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {f.icon}
                                    <span>{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-96 rounded-3xl bg-gray-200/50 animate-pulse border border-gray-100" />
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {providers.map((provider) => (
                                <motion.div
                                    key={provider.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card {...provider} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {!loading && providers.length === 0 && (
                    <div className="text-center py-24">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                            <Search size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-jakarta">No matches found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your search query or filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoveryPage;
