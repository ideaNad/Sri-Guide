"use client";

import React, { useState, useEffect, Suspense } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import apiClient from "@/services/api-client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, Search, MapPin, Calendar, Users, Loader2, Compass } from "lucide-react";

interface Tour {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    location?: string;
    type: string;
    agencyName?: string;
    price?: number;
    date?: string;
    duration?: string;
    mapLink?: string;
    slug?: string;
    reviews?: number;
    rating?: number;
}
const ToursPageContent = () => {
    const searchParams = useSearchParams();
    
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
    const [priceRange, setPriceRange] = useState(500);

    const [sortBy, setSortBy] = useState("Most Popular");
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const query = searchParams.get("query");
        if (query) {
            setSearchQuery(query);
            setPageNumber(1);
        }
    }, [searchParams]);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                type: "tour",
                pageNumber: pageNumber.toString(),
                pageSize: "12",
                query: searchQuery,
                category: activeCategory === "All" ? "" : activeCategory,
                maxPrice: priceRange.toString(),
                sortBy: sortBy,
            });
            


            const response = await apiClient.get<{ items: Tour[], totalCount: number, totalPages: number }>("/discovery", { params });
            setTours(response.data.items || []);
            setTotalCount(response.data.totalCount || 0);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch tours:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTours();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [pageNumber, activeCategory, priceRange, sortBy]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageNumber(1); // Reset to first page on search
            fetchTours();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const categories = ["All", "Adventure", "Culture", "Wild Life", "Beach", "Hiking"];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 py-12 mb-12">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        badge="Explore"
                        title="Extraordinary Tours"
                        subtitle="Curated experiences that show you the soul of Sri Lanka."
                    />

                    {/* Quick Search Bar */}
                    <div className="mt-8 flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[300px] relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for tours, activities..."
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-full focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm shadow-md"
                            />
                        </div>
                        <button className="bg-primary text-white p-4 rounded-full hover:bg-secondary transition-all shadow-md">
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
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
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeCategory === cat ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Price Range</h4>
                                    <input 
                                        type="range" 
                                        min="10"
                                        max="2000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="w-full accent-primary" 
                                    />
                                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                                        <span>$10</span>
                                        <span>${priceRange}</span>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Support Promo */}
                        <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl text-white relative overflow-hidden group shadow-xl">
                            <Compass className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:rotate-45 transition-transform duration-700" />
                            <h3 className="text-xl font-bold mb-3 relative z-10">Professional Help?</h3>
                            <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium relative z-10">Let our travel experts plan your perfect itinerary tailored to your needs.</p>
                            <Link href="/contact" className="block">
                                <button className="bg-white text-primary px-6 py-3 font-bold text-sm rounded-xl w-full hover:bg-gray-50 hover:shadow-md transition-all relative z-10">
                                    Talk to an Expert
                                </button>
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-gray-500 font-medium">
                                {loading ? "Finding curated experiences..." : `Showing ${tours.length} of ${totalCount} tours`}
                            </p>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-400">Sort by:</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer"
                                >
                                    <option>Most Popular</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100" />
                                ))
                            ) : tours.length > 0 ? (
                                tours.map((tour) => (
                                    <motion.div
                                        key={tour.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Card 
                                            id={tour.id}
                                            slug={tour.slug}
                                            title={tour.title}
                                            image={tour.image}
                                            location={tour.location}
                                            price={tour.price}
                                            duration={tour.duration || tour.date}
                                            mapLink={tour.mapLink}
                                            type="tour"
                                            subtitle={tour.agencyName}
                                            rating={tour.rating}
                                            reviews={tour.reviews}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No tours found matching your criteria</p>
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
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm shadow-sm transition-all ${
                                            pageNumber === i + 1 
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

const ToursPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        }>
            <ToursPageContent />
        </Suspense>
    );
};

export default ToursPage;
