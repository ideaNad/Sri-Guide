"use client";

import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { BEST_RESTAURANTS } from "@/data/mockData";
import { Star, MapPin, UtensilsCrossed, Clock, ChevronRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

const RestaurantsPage = () => {
    return (
        <div className="pt-24 pb-24 bg-white font-sans">
            <div className="container mx-auto px-4">
                <SectionHeader
                    badge="Gastronomy"
                    title="Culinary Wonders"
                    subtitle="Discover the rich and spicy flavors of authentic Sri Lankan cuisine at the best local spots."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {BEST_RESTAURANTS.map((res, idx) => (
                        <motion.div
                            key={res.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group flex flex-col md:flex-row bg-white border border-gray-100 p-6 gap-8 hover:shadow-2xl transition-all duration-700 hover:border-gray-900"
                        >
                            <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden bg-gray-100">
                                <img
                                    src={res.image}
                                    alt={res.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase text-gray-900 border border-white">
                                    {res.cuisine}
                                </div>
                                <button className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-all border border-white">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="md:w-1/2 flex flex-col justify-center py-4">
                                <div className="flex items-center space-x-2 text-yellow-400 mb-4">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="text-gray-900 font-black text-lg">{res.rating}</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors">{res.name}</h3>
                                <div className="flex items-center text-gray-400 font-bold mb-6">
                                    <MapPin className="w-4 h-4 mr-2 text-secondary" />
                                    {res.location}
                                </div>

                                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                                    A masterpiece of culinary art. {res.name} offers a unique blend of traditional spices and modern presentation, making it a must-visit for every food lover in {res.location}.
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center text-xs text-gray-400 font-bold">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Open until 11:00 PM
                                    </div>
                                    <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center group/btn">
                                        Reserve Table
                                        <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Featured Food Items / Menu Highlights */}
                <div className="mt-32">
                    <SectionHeader
                        badge="Menu Highlights"
                        title="Must-Try Local Dishes"
                        subtitle="You haven't truly visited Sri Lanka until you've tasted these."
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[
                            "Egg Hoppers", "Pol Sambol", "Kottu Roti", "Sour Fish Curry", "Watalappam", "Curd & Treacle"
                        ].map((food, i) => (
                            <div key={i} className="bg-white border border-gray-100 p-8 text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
                                    <UtensilsCrossed className="w-8 h-8" />
                                </div>
                                <h4 className="font-black text-gray-900 text-xs uppercase tracking-tighter">{food}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default RestaurantsPage;
