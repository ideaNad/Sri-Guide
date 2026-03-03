"use client";

import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { VEHICLE_RENTALS } from "@/data/mockData";
import { Bike, Car, Truck, ShieldCheck, Gauge, Zap, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const VehicleRentalPage = () => {
    const categories = [
        { icon: Bike, name: "Bikes & Scooters", desc: "Best for coastal cruising and solo adventures." },
        { icon: Truck, name: "Classic Tuk-Tuks", desc: "The quintessential Sri Lankan experience." },
        { icon: Car, name: "Cars & SUVs", desc: "Premium comfort for family trips and long hauls." }
    ];

    return (
        <div className="pt-24 pb-24 bg-white">
            <div className="container mx-auto px-4">
                <SectionHeader
                    badge="Island Mobility"
                    title="Rent Your Adventure"
                    subtitle="Explore the island at your own pace with our range of reliable vehicles."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white p-12 border border-gray-100 shadow-sm hover:shadow-2xl transition-all hover:bg-primary/5 cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-primary/10 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-primary/20">
                                <cat.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-primary transition-colors">{cat.name}</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">{cat.desc}</p>
                            <div className="w-12 h-12 bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {VEHICLE_RENTALS.concat(VEHICLE_RENTALS).map((vehicle, idx) => (
                        <motion.div
                            key={`${vehicle.id}-${idx}`}
                            whileHover={{ y: -10 }}
                            className="group bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="h-64 relative overflow-hidden bg-gray-100">
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-md px-4 py-2 text-[10px] font-black text-white border border-white/20 uppercase tracking-widest">
                                    ${vehicle.pricePerDay} / day
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">{vehicle.type}</span>
                                    <div className="flex text-yellow-400">
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-primary transition-colors">{vehicle.name}</h3>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center text-xs text-gray-400 font-bold">
                                        <Gauge className="w-4 h-4 mr-2 text-secondary" />
                                        Unlimited Km
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400 font-bold">
                                        <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                                        Full Insurance
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400 font-bold">
                                        <Zap className="w-4 h-4 mr-2 text-highlight" />
                                        24/7 Support
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl">
                                    Check Availability
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Requirements Info */}
                <div className="mt-32 bg-gray-900 p-12 md:p-24 border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl -z-10" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-white">
                            <SectionHeader
                                badge="Mobility Protocol"
                                title="Requirements to drive"
                                subtitle="Safety first. Ensure you have the right documentation before hitting the road."
                            />
                        </div>
                        <div className="space-y-6">
                            {[
                                "International Driving Permit (IDP)",
                                "Local Verification of your License (We can help!)",
                                "Minimum age of 21 years",
                                "Valid Travel Insurance",
                                "A sense of adventure & patience"
                            ].map((step, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-white font-black text-xs mr-6 flex-shrink-0 bg-white/5 shadow-xl">
                                        {i + 1}
                                    </div>
                                    <p className="text-white/60 font-medium pt-2">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleRentalPage;
