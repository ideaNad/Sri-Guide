"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative h-screen min-h-[600px] w-full bg-black overflow-hidden flex flex-col justify-between pt-24 pb-12 md:pb-20 px-6 md:px-12 lg:px-24">
            {/* Background Image with Immersive Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-0.png"
                    alt="Sigiriya Rock Fortress"
                    className="w-full h-full object-cover transition-transform duration-[10s] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            </div>

            {/* Centered Huge Typography */}
<div className="relative z-10 flex-1 flex items-center justify-center">
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className="text-center -mt-1 sm:-mt-15 lg:mt-0"
  >
<h1 className="text-[29vw] lg:text-[18rem] font-black text-white leading-none tracking-tighter opacity-50 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] whitespace-normal sm:whitespace-nowrap">
  SRI LANKA
</h1>
  </motion.div>
</div>

            {/* Bottom Row: Stats & CTA (Responsive Container) */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto mt-auto">
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10 text-center lg:text-left">

                    {/* Stats Grid - Single Line on All Devices */}
                    <div className="grid grid-cols-3 gap-4 md:gap-16 lg:gap-20 w-full lg:w-auto">
                        <div className="space-y-1">
                            <h3 className="text-xl md:text-4xl font-black text-white tracking-tight">10k+</h3>
                            <p className="text-white/60 text-[8px] md:text-xs uppercase tracking-[0.15em] font-bold">Travelers</p>
                        </div>
                        <div className="space-y-1 border-x border-white/10 px-4 md:px-0 md:border-none">
                            <h3 className="text-xl md:text-4xl font-black text-white tracking-tight">500+</h3>
                            <p className="text-white/60 text-[8px] md:text-xs uppercase tracking-[0.15em] font-bold">Tours</p>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl md:text-4xl font-black text-white tracking-tight">5k+</h3>
                            <p className="text-white/60 text-[8px] md:text-xs uppercase tracking-[0.15em] font-bold">Hotels</p>
                        </div>
                    </div>

                    {/* CTA & Description */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-xl">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-4 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all"
                            >
                                <span className="text-black font-bold text-sm md:text-base">Book Now</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-2xl"
                            >
                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
                            </motion.button>
                        </div>
                        <p className="text-white/70 text-[10px] md:text-sm lg:text-base md:text-left leading-relaxed font-medium max-w-[200px] md:max-w-xs">
                            Journey across continents, cultures, and landscapes — because every path leads to new discoveries.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
