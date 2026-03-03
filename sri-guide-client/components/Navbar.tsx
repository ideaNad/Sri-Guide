"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Globe, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll(); // Initial check
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Destination", href: "/tours" },
        { name: "Review", href: "#" },
        { name: "Contact", href: "#" },
    ];

    // Determine navbar style based on scroll position and current page
    const navBackground = isScrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
        : (isHomePage ? "bg-transparent py-8" : "bg-white/80 backdrop-blur-md border-b border-gray-100 py-6");

    const textColor = (isScrolled || !isHomePage) ? "text-black" : "text-white";
    const logoColor = (isScrolled || !isHomePage) ? "text-primary" : "text-white";
    const menuBg = (isScrolled || !isHomePage) ? "bg-gray-100/50" : "bg-white/10";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBackground}`}
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className={`text-2xl font-black tracking-tighter ${logoColor} transition-colors duration-500 font-jakarta antialiased`}>
                    SRI GUIDE
                </Link>

                {/* Desktop Menu - Floating Glass */}
                <div className={`hidden lg:flex items-center space-x-1 p-1 ${menuBg} backdrop-blur-md rounded-full border border-white/20 transition-colors duration-500`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`px-6 py-2.5 text-[13px] font-bold ${textColor} hover:bg-black/5 rounded-full transition-all flex items-center`}
                        >
                            {link.name}
                            {link.name === "Destination" && <ChevronDown className="ml-1 w-3.5 h-3.5 opacity-50" />}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden lg:block">
                    <button className="px-8 py-3 bg-primary hover:bg-secondary text-white rounded-full text-[13px] font-bold transition-all shadow-lg shadow-primary/20">
                        Book Now
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`lg:hidden ${textColor}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay - Now White with Dark Text */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-0 left-0 w-full h-screen bg-white/98 backdrop-blur-xl lg:hidden py-12 px-6 flex flex-col items-center justify-center space-y-10 z-50"
                    >
                        {/* Close Button in Overlay */}
                        <button
                            className="absolute top-8 right-8 text-black p-2 bg-gray-100 rounded-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex flex-col items-center space-y-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-3xl font-black text-black hover:text-primary transition-colors uppercase tracking-tight"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <button className="w-full max-w-xs py-5 bg-primary text-white rounded-full text-lg font-black uppercase tracking-widest shadow-xl">
                            Book Now
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
