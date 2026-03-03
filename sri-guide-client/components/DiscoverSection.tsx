"use client";

import React from "react";
import { motion } from "framer-motion";

const DiscoverSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-secondary text-[11px] font-black uppercase tracking-[0.3em] mb-4 block">
                            Timeless History
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-foreground leading-[1] mb-8 tracking-tighter">
                            Discover <br />
                            Sri Lanka <br />
                            with Us
                        </h2>
                        <p className="text-foreground/60 text-lg leading-relaxed max-w-md font-medium">
                            Journey across continents, cultures, and landscapes—because every path leads to new discoveries.
                        </p>
                    </motion.div>

                    {/* Right Side: Large Rounded Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[16/10] bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img
                                src="/hero-1.jpg"
                                alt="Sri Lanka Tea Plantation"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DiscoverSection;
