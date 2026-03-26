"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ShieldCheck, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";
import { getDashboardHref } from "@/lib/auth-utils";
import { HelpDrawer } from "@/components/help/HelpDrawer";
import { HELP_ITEMS } from "@/constants/HelpData";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
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
        { name: "Events", href: "/events" },
        { name: "Agencies", href: "/agencies" },
        { name: "Guides", href: "/guides" },
        { name: "Transport", href: "/transport" },
        // { name: "Privacy", href: "/privacy-policy" },
        { name: "Contact", href: "/contact" },
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
                        ? "text-xl font-bold text-black hover:text-primary transition-colors uppercase tracking-tight"
                        : `px-6 py-2.5 text-[13px] font-bold ${textColor} hover:bg-black/5 rounded-full transition-all flex items-center`
                    }
                    onClick={() => mobile && setIsMobileMenuOpen(false)}
                >
                    {link.name}
                </Link>
            ))}
        </>
    );

    const getDashboardUrl = () => {
        return getDashboardHref(user?.role);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBackground}`}>
                <div className="container mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="relative transition-all duration-500 flex items-center h-8 md:h-10 z-10">
                        <img
                            id="navbar-logo"
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
                        <button
                            onClick={() => setIsHelpOpen(true)}
                            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${!isScrolled && isHomePage
                                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            title="Help Center"
                        >
                            <HelpCircle size={20} />
                        </button>

                        {user ? (
                            <div className={`flex items-center gap-6 ${!isScrolled && isHomePage ? 'bg-white/10 backdrop-blur-md px-5 py-1 rounded-full border border-white/20 shadow-sm' : ''}`}>
                                <Link
                                    href={getDashboardUrl()}
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
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 overflow-hidden">
                                    {user.profileImageUrl ? (
                                        <img
                                            src={user.profileImageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : user.profileImageUrl}
                                            alt={user.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.fullName.charAt(0)
                                    )}
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
                            className="fixed top-0 left-0 w-full h-screen bg-white lg:hidden pt-28 pb-12 px-8 flex flex-col items-center justify-start space-y-8 z-[60] overflow-y-auto"
                        >
                            {/* Logo inside Mobile Menu */}
                            <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-20">
                                <Link href="/" className="relative h-10 w-40 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    <img
                                        id="navbar-logo-mobile"
                                        src="/logo.svg"
                                        alt="SRIGuide Logo"
                                        className="absolute left-0 h-40 w-auto transition-all duration-500 object-contain max-w-none opacity-100 top-1/2 -translate-y-1/2"
                                    />
                                </Link>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { setIsHelpOpen(true); setIsMobileMenuOpen(false); }}
                                        className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                                        title="Help Center"
                                    >
                                        <HelpCircle size={22} />
                                    </button>
                                    <button
                                        className="text-black p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shadow-sm"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <X size={22} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-6 py-4">
                                <NavItems mobile textColor={textColor} navLinks={navLinks} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                            </div>

                            <div className="w-full max-w-xs space-y-4">
                                {user ? (
                                    <>
                                        <div className="flex flex-col items-center gap-4 mb-6">
                                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-4 border-primary/20 overflow-hidden text-3xl shadow-xl">
                                                {user.profileImageUrl ? (
                                                    <img
                                                        src={user.profileImageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : user.profileImageUrl}
                                                        alt={user.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    user.fullName.charAt(0)
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-2xl font-black text-black uppercase tracking-tight">{user.fullName}</h3>
                                                <p className="text-sm font-bold text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={getDashboardUrl()}
                                            className="w-full block text-center py-4 bg-gray-100 text-black rounded-full text-base font-black uppercase tracking-widest shadow-sm hover:bg-gray-200 transition-all"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        {user.role === "Admin" && (
                                            <Link
                                                href="/admin/users"
                                                className="w-full block text-center py-4 bg-secondary/10 text-secondary rounded-full text-base font-black uppercase tracking-widest hover:bg-secondary/20 transition-all"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                            className="w-full py-4 bg-rose-50 text-rose-500 rounded-full text-base font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
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

            </nav>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={(userData) => {
                    login(userData);
                    setIsAuthModalOpen(false);
                }}
            />

            {/* Global Help Drawer */}
            <HelpDrawer
                open={isHelpOpen}
                onOpenChange={setIsHelpOpen}
                title="SriGuide Help Center"
                description="How can we help you today? Explore our guides or contact support."
                items={HELP_ITEMS}
            />
        </>
    );
};

export default Navbar;
