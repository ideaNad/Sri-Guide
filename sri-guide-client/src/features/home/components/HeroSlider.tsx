"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/providers/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";
import Link from "next/link";
import HeroAnimation from "./HeroAnimation";

const images = [
    "/hero-ella.png",
    "/hero-nine-arch.png",
    "/hero-mirissa.png",
    "/hero-0.png",
];

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user, login } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Refs for Hero Animation
    const kesbewaRef = useRef<HTMLDivElement>(null);
    const travelersRef = useRef<HTMLDivElement>(null);
    const toursRef = useRef<HTMLDivElement>(null);
    const hotelsRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen min-h-[600px] w-full bg-black overflow-hidden flex flex-col justify-between pt-24 pb-12 md:pb-20 px-6 md:px-12 lg:px-24">
            {/* Mascot Animation Layer */}
            <HeroAnimation
                kesbewaRef={kesbewaRef}
                travelersRef={travelersRef}
                toursRef={toursRef}
                hotelsRef={hotelsRef}
                buttonRef={buttonRef}
            />

            {/* Background Image with Immersive Overlay */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt="Sri Lanka Destination"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1.05 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            </div>

            {/* Centered Huge Typography */}
            <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center -mt-1 sm:-mt-15 lg:mt-0"
                >
                    <h1 className="text-[29vw] lg:text-[18rem] font-black text-white leading-none tracking-tighter opacity-50 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] whitespace-normal sm:whitespace-nowrap flex items-baseline">
                        <span id="letter-0" className="inline-block transition-all duration-300">S</span>
                        <span id="letter-1" className="inline-block transition-all duration-300">R</span>
                        <span id="letter-2" className="inline-block transition-all duration-300">I</span>
                        <span id="letter-3" className="inline-block">&nbsp;</span>
                        <span id="letter-4" className="inline-block transition-all duration-300">L</span>
                        <span id="letter-5" className="inline-block transition-all duration-300">A</span>
                        <span id="letter-6" className="inline-block transition-all duration-300">N</span>
                        <span id="letter-7" className="inline-block transition-all duration-300">K</span>
                        <span id="letter-8" className="inline-block transition-all duration-300">A</span>
                    </h1>
                </motion.div>
            </div>

            {/* Bottom Row: Stats & CTA (Responsive Container) */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto mt-auto">
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10 text-center lg:text-left">

                    {/* Stats Grid - Single Line on All Devices */}
                    <div className="grid grid-cols-3 gap-4 md:gap-16 lg:gap-20 w-full lg:w-auto">
                        <div ref={travelersRef} className="space-y-1">
                            <h3 className="text-xl md:text-4xl font-black text-white tracking-tight">10k+</h3>
                            <p className="text-white/60 text-[8px] md:text-xs uppercase tracking-[0.15em] font-bold">Travelers</p>
                        </div>
                        <div ref={toursRef} className="space-y-1 border-x border-white/10 px-4 md:px-0 md:border-none">
                            <h3 className="text-xl md:text-4xl font-black text-white tracking-tight">500+</h3>
                            <p className="text-white/60 text-[8px] md:text-xs uppercase tracking-[0.15em] font-bold">Tours</p>
                        </div>
                        <div ref={hotelsRef} className="space-y-1">
                            <h3 className="text-xl md:text-4xl font-black text-white tracking-tight">5k+</h3>
                            <p className="text-white/60 text-[8px] md:text-xs uppercase tracking-[0.15em] font-bold">Hotels</p>
                        </div>
                    </div>

                    {/* CTA & Description */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-2xl">
                        {!user ? (
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <motion.button
                                    ref={buttonRef}
                                    onClick={() => setIsAuthModalOpen(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-10 py-5 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl transition-all font-black text-sm uppercase tracking-widest hover:bg-secondary"
                                >
                                    <span>Get Started</span>
                                </motion.button>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl"
                                >
                                    <Sparkles className="w-6 h-6 text-white" />
                                </motion.div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <Link
                                    ref={buttonRef as any}
                                    href="/guides"
                                    className="px-10 py-5 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transition-all font-black text-sm uppercase tracking-widest hover:bg-gray-100"
                                >
                                    <span>Find a Guide</span>
                                </Link>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl"
                                >
                                    <ArrowRight className="w-6 h-6 text-white" />
                                </motion.div>
                            </div>
                        )}
                        <p className="text-white/70 text-[10px] md:text-sm lg:text-base md:text-left leading-relaxed font-medium max-w-[200px] md:max-w-xs">
                            Experience the magic of the teardrop isle with certified local experts by your side.
                        </p>
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onSuccess={(userData) => login(userData)}
                defaultIsLogin={false}
            />
        </section>
    );
};

export default HeroSection;

