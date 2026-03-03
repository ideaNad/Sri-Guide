"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import { POPULAR_TOURS } from "@/data/mockData";
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
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for tours, activities..."
                                className="w-full pl-12 pr-4 py-5 bg-white border-2 border-gray-900 focus:border-primary outline-none transition-all font-black uppercase text-xs tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]"
                            />
                        </div>
                        <button className="bg-gray-900 text-white p-5 hover:bg-primary transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                            <SlidersHorizontal className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-1/4 space-y-8">
                        <div className="bg-white p-10 border border-gray-100 shadow-sm transition-all hover:shadow-2xl">
                            <h3 className="text-xl font-black mb-8 flex items-center uppercase tracking-tighter italic">
                                <Filter className="w-5 h-5 mr-3 text-primary" />
                                Filters
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-gray-900 text-white" : "bg-white border border-gray-100 text-gray-400 hover:border-gray-900"
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
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Duration</h4>
                                    <div className="space-y-2">
                                        {["1-3 Hours", "Full Day", "Multi-day"].map((item) => (
                                            <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Promo */}
                        <div className="bg-primary p-10 text-white relative overflow-hidden group shadow-2xl">
                            <Compass className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 group-hover:rotate-45 transition-transform duration-700" />
                            <h3 className="text-xl font-black mb-4 uppercase italic">Professional Help?</h3>
                            <p className="text-white/70 text-sm mb-10 leading-relaxed font-medium">Let our travel experts plan your perfect itinerary tailored to your needs.</p>
                            <button className="bg-white text-gray-900 px-8 py-4 font-black text-xs uppercase tracking-widest w-full hover:bg-gray-900 hover:text-white transition-all">
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
                        <div className="mt-16 flex justify-center space-x-3">
                            <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all font-black text-xs">1</button>
                            <button className="w-12 h-12 flex items-center justify-center bg-gray-900 text-white font-black text-xs">2</button>
                            <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all font-black text-xs">3</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Compass } from "lucide-react";
export default ToursPage;
