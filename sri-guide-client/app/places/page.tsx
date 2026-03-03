"use client";

import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { POPULAR_PLACES } from "@/data/mockData";
import { MapPin, Compass, ArrowRight, Camera, Mountain, Waves } from "lucide-react";
import { motion } from "framer-motion";

const PlacesPage = () => {
    return (
        <div className="pt-24 pb-24 bg-gray-50/30">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <SectionHeader
                        centered
                        badge="Topography"
                        title="Enchanting Locations"
                        subtitle="From misty hill stations to golden coasts, explore the diverse landscapes of Sri Lanka."
                    />

                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { icon: Mountain, name: "Hill Country" },
                            { icon: Waves, name: "Coastline" },
                            { icon: Camera, name: "Ancient Cities" },
                            { icon: Compass, name: "Wild Life Safaris" }
                        ].map((cat) => (
                            <button key={cat.name} className="flex items-center space-x-3 bg-white border border-gray-900 px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:bg-gray-900 hover:text-white transition-all group">
                                <cat.icon className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {POPULAR_PLACES.concat(POPULAR_PLACES).map((place, idx) => (
                        <motion.div
                            key={`${place.id}-${idx}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={place.image}
                                    alt={place.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-900 border border-white">
                                    <MapPin className="w-3 h-3 inline mr-2" />
                                    {place.region}
                                </div>
                            </div>
                            <div className="p-10 relative">
                                <div className="absolute -top-12 right-10 w-24 h-24 bg-gray-900 flex items-center justify-center text-white border-[10px] border-white shadow-2xl transform transition-transform group-hover:scale-110">
                                    <Compass className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-4">{place.name}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                                    Experience the unique charm of {place.name}. Located in the heart of {place.region}, this destination offers breathtaking views and deep cultural significance.
                                </p>
                                <button className="flex items-center text-primary font-black text-sm uppercase tracking-widest hover:text-highlight transition-colors group">
                                    Explore Details
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlacesPage;
