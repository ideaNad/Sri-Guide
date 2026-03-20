"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import { POPULAR_TOURS } from "@/data/mock-data";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Search, MapPin, Calendar, Users } from "lucide-react";

const ToursPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");

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
                                    <input type="range" className="w-full accent-primary" />
                                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                                        <span>$10</span>
                                        <span>$500+</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Duration</h4>
                                    <div className="space-y-3">
                                        {["1-3 Hours", "Full Day", "Multi-day"].map((item) => (
                                            <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" />
                                                <span className="text-sm text-gray-600 font-medium group-hover:text-primary transition-colors">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Promo */}
                        <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl text-white relative overflow-hidden group shadow-xl">
                            <Compass className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:rotate-45 transition-transform duration-700" />
                            <h3 className="text-xl font-bold mb-3 relative z-10">Professional Help?</h3>
                            <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium relative z-10">Let our travel experts plan your perfect itinerary tailored to your needs.</p>
                            <button className="bg-white text-primary px-6 py-3 font-bold text-sm rounded-xl w-full hover:bg-gray-50 hover:shadow-md transition-all relative z-10">
                                Talk to an Expert
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-gray-500 font-medium">Showing <span className="text-gray-900 font-bold">12</span> tours across Sri Lanka</p>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-400">Sort by:</span>
                                <select className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer">
                                    <option>Most Popular</option>
                                    <option>Price: Low to High</option>
                                    <option>Top Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {POPULAR_TOURS.map((tour) => (
                                <motion.div
                                    key={tour.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <Card {...tour} type="tour" />
                                </motion.div>
                            ))}
                            {/* Repeat mock data for demonstration */}
                            {POPULAR_TOURS.map((tour) => (
                                <motion.div
                                    key={`${tour.id}-copy`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <Card {...tour} type="tour" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination UI */}
                        <div className="mt-16 flex justify-center space-x-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:border-primary hover:text-primary transition-all font-bold text-sm shadow-sm">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-md">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:border-primary hover:text-primary transition-all font-bold text-sm shadow-sm">3</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Compass } from "lucide-react";
export default ToursPage;
