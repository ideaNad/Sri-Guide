"use client";

import React, { useState, useEffect, Suspense } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import apiClient from "@/services/api-client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Filter, Search, Loader2, Star } from "lucide-react";

interface Adventure {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    location?: string;
    type: string;
    agencyName?: string;
    price?: number;
    participantCount?: string;
    date?: string;
    duration?: string;
    mapLink?: string;
    slug?: string;
    reviews?: number;
    rating?: number;
}

const AdventuresPageContent = () => {
    const searchParams = useSearchParams();

    const [adventures, setAdventures] = useState<Adventure[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeLocation, setActiveLocation] = useState(searchParams.get("location") || "All");
    const [minRating, setMinRating] = useState(parseInt(searchParams.get("minRating") || "0"));
    const [showAllLocations, setShowAllLocations] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

    const [sortBy, setSortBy] = useState("Latest");
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const location = searchParams.get("location");
        const query = searchParams.get("query");
        const rating = searchParams.get("minRating");

        if (location !== null) setActiveLocation(location);
        if (query !== null) setSearchQuery(query);
        if (rating !== null) setMinRating(parseInt(rating));
        
        setPageNumber(1);
    }, [searchParams]);

    const fetchAdventures = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                pageNumber: pageNumber.toString(),
                pageSize: "12",
                query: searchQuery,
                location: activeLocation === "All" ? "" : activeLocation,
                minRating: minRating > 0 ? minRating.toString() : "",
                sortBy: sortBy,
            });

            const response = await apiClient.get<{ items: Adventure[], totalCount: number, totalPages: number }>("/discovery/adventures", { params });
            setAdventures(response.data.items || []);
            setTotalCount(response.data.totalCount || 0);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch adventures:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAdventures();
        }, 300);
        return () => clearTimeout(timer);
    }, [pageNumber, activeLocation, minRating, sortBy]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageNumber(1);
            fetchAdventures();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const locations = ["All", "Colombo", "Galle", "Kandy", "Ella", "Sigiriya", "Nuwara Eliya", "Arugam Bay", "Mirissa", "Jaffna", "Bentota", "Trincomalee", "Polonnaruwa", "Anuradhapura", "Yala", "Udawalawe"];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 py-12 mb-12">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        badge="Island Stories"
                        title="Real Adventures"
                        subtitle="Community-shared experiences and hidden gems across Sri Lanka."
                    />

                    {/* Quick Search Bar */}
                    <div className="mt-8 flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[300px] relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search adventures, stories, locations..."
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-full focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm shadow-md"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-1/4 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg transition-all hover:shadow-xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center text-gray-900">
                                <Filter className="w-5 h-5 mr-3 text-primary" />
                                Filters
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Location</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(showAllLocations ? locations : locations.slice(0, 6)).map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => setActiveLocation(loc)}
                                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeLocation === loc ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary"
                                                    }`}
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                    {locations.length > 6 && (
                                        <button
                                            onClick={() => setShowAllLocations(!showAllLocations)}
                                            className="mt-3 text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                                        >
                                            {showAllLocations ? "Show Less" : "See More"}
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Rating</h4>
                                    <div className="space-y-2">
                                        {[
                                            { label: "Any Rating", value: 0 },
                                            { label: "4+ Stars", value: 4 },
                                            { label: "3+ Stars", value: 3 }
                                        ].map((rating) => (
                                            <button
                                                key={rating.value}
                                                onClick={() => setMinRating(rating.value)}
                                                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold rounded-xl transition-all ${minRating === rating.value ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary"
                                                    }`}
                                            >
                                                <span>{rating.label}</span>
                                                {rating.value > 0 && <Star size={12} fill="currentColor" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-gray-500 font-medium">
                                {loading ? "Finding real stories..." : `Showing ${adventures.length} of ${totalCount} adventures`}
                            </p>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-400">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer"
                                >
                                    <option>Latest</option>
                                    <option>Most Popular</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100" />
                                ))
                            ) : adventures.length > 0 ? (
                                adventures.map((adventure) => (
                                    <motion.div
                                        key={adventure.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Card
                                            id={adventure.id}
                                            slug={adventure.slug}
                                            title={adventure.title}
                                            image={adventure.image}
                                            location={adventure.location}
                                            price={adventure.price}
                                            participantCount={adventure.participantCount}
                                            duration={adventure.duration || adventure.date}
                                            mapLink={adventure.mapLink}
                                            type="adventure"
                                            subtitle={adventure.agencyName}
                                            rating={adventure.rating}
                                            reviews={adventure.reviews}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No adventures found matching your criteria</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center space-x-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPageNumber(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm shadow-sm transition-all ${pageNumber === i + 1
                                                ? "bg-primary text-white shadow-md"
                                                : "bg-white border border-gray-100 text-gray-500 hover:border-primary hover:text-primary"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdventuresPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        }>
            <AdventuresPageContent />
        </Suspense>
    );
};

export default AdventuresPage;
