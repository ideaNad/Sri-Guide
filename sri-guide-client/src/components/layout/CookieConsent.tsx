"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, ShieldCheck } from "lucide-react";
import Link from "next/link";

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100] pointer-events-none"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-6 md:p-8 overflow-hidden relative pointer-events-auto">
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                        
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 transition-all hover:scale-110">
                                <Cookie size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-black uppercase tracking-tight mb-2 flex items-center gap-2">
                                    Cookie Policy
                                    <ShieldCheck size={16} className="text-secondary" />
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    We use cookies to enhance your experience, analyze site traffic, and serve personalized content. By clicking "Accept", you agree to our use of cookies as described in our <Link href="/privacy-policy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAccept}
                                className="flex-1 px-8 py-3.5 bg-primary hover:bg-secondary text-white rounded-full text-[13px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/25 active:scale-95"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleDecline}
                                className="flex-1 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-[13px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                                Essential Only
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
