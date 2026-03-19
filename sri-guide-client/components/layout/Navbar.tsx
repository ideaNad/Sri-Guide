"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isHomePage = pathname === "/";
    const { user, login, logout } = useAuth();

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
        { name: "Tours", href: "/tours" },
        { name: "Guides", href: "/guides" },
        { name: "Contact", href: "#" },
    ];

    // Navbar background and text color based on scroll
    const navBackground = isScrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
        : isHomePage
            ? "bg-transparent py-8"
            : "bg-white/80 backdrop-blur-md py-6";

    const textColor = isScrolled || !isHomePage ? "text-black" : "text-white";
    const logoColor = isScrolled || !isHomePage ? "text-primary" : "text-white";

const NavItems = ({ mobile = false, textColor, navLinks, setIsMobileMenuOpen }: { mobile?: boolean, textColor: string, navLinks: any[], setIsMobileMenuOpen: (open: boolean) => void }) => (
    <>
        {navLinks.map((link) => (
            <Link
                key={link.name}
                href={link.href}
                className={mobile
                    ? "text-3xl font-black text-black hover:text-primary transition-colors uppercase tracking-tight"
                    : `px-6 py-2.5 text-[13px] font-bold ${textColor} hover:bg-black/5 rounded-full transition-all flex items-center`
                }
                onClick={() => mobile && setIsMobileMenuOpen(false)}
            >
                {link.name}
            </Link>
        ))}
    </>
);

    const getDashboardHref = () => {
        if (!user) return "/";
        if (user.role === "Admin") return "/admin";
        if (user.role === "Guide") return "/guide";
        if (user.role === "TravelAgency") return "/agency";
        return "/dashboard";
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBackground}`}>
            <div className="container mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="relative transition-all duration-500 flex items-center h-8 md:h-10 z-10">
                    <img
                        src="/logo.svg"
                        alt="SRIGuide Logo"
                        className={`absolute left-0 h-40 md:h-40 w-auto transition-all duration-500 object-contain max-w-none ${!isScrolled && isHomePage ? "brightness-0 invert" : ""} ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                            }`}
                    />
                </Link>

                {/* Desktop Menu */}
                {/* Floating rounded menu only on home page & top */}
                {!isScrolled && isHomePage ? (
                    <div className="hidden lg:flex items-center space-x-1 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-500">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-6 py-2.5 text-[13px] font-bold text-white hover:bg-black/5 rounded-full transition-all flex items-center"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="hidden lg:flex items-center space-x-1">
                        <NavItems textColor={textColor} navLinks={navLinks} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    </div>
                )}

                {/* Auth & CTA */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href={getDashboardHref()}
                                className={`flex items-center gap-2 text-[13px] font-bold ${textColor} hover:text-primary transition-colors`}
                            >
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            {user.role === "Admin" && (
                                <Link
                                    href="/admin/users"
                                    className={`flex items-center gap-2 text-[13px] font-bold ${textColor} hover:text-primary transition-colors`}
                                >
                                    <ShieldCheck size={18} className="text-secondary" />
                                    <span>Manage Platform</span>
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-[13px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                {user.fullName.charAt(0)}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className={`px-8 py-3 bg-primary hover:bg-secondary text-white rounded-full text-[13px] font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95`}
                        >
                            <User size={16} />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className={`lg:hidden ${textColor}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-0 left-0 w-full h-screen bg-white lg:hidden py-12 px-6 flex flex-col items-center justify-center space-y-10 z-[60]"
                    >
                        {/* Logo inside Mobile Menu */}
                        <Link href="/" className="absolute top-8 left-6" onClick={() => setIsMobileMenuOpen(false)}>
                            <img
                                src="/logo.svg"
                                alt="SRIGuide Logo"
                                className="h-40 w-auto object-contain"
                            />
                        </Link>

                        <button
                            className="absolute top-8 right-8 text-black p-2 bg-gray-100 rounded-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex flex-col items-center space-y-8">
                            <NavItems mobile textColor={textColor} navLinks={navLinks} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        </div>

                        <div className="w-full max-w-xs space-y-4">
                            {user ? (
                                <>
                                    <Link
                                        href={getDashboardHref()}
                                        className="w-full block text-center py-5 bg-gray-100 text-black rounded-full text-lg font-black uppercase tracking-widest"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    {user.role === "Admin" && (
                                        <Link
                                            href="/admin/users"
                                            className="w-full block text-center py-5 bg-secondary/10 text-secondary rounded-full text-lg font-black uppercase tracking-widest"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="w-full py-5 bg-rose-50 text-rose-500 rounded-full text-lg font-black uppercase tracking-widest"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                                    className="w-full py-5 bg-primary text-white rounded-full text-lg font-black uppercase tracking-widest shadow-xl"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={(userData) => {
                    login(userData);
                    setIsAuthModalOpen(false);
                    if (userData.role === "Admin") router.push("/admin");
                    else if (userData.role === "Guide") router.push("/guide");
                    else if (userData.role === "TravelAgency") router.push("/agency");
                    else router.push("/dashboard");
                }}
            />
        </nav>
    );
};

export default Navbar;
