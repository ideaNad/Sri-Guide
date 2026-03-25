"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Mail, Lock, User, ShieldCheck,
    Compass, Briefcase, Building2, Car,
    CheckCircle2, ArrowRight
} from "lucide-react";
import apiClient from "@/services/api-client";

import { User as UserType } from "@/types";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: UserType & { token: string }) => void;
    defaultIsLogin?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, defaultIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const [role, setRole] = useState("Tourist");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (isOpen) {
            setIsLogin(defaultIsLogin);
        }
    }, [isOpen, defaultIsLogin]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const roles = [
        { id: "Tourist", label: "Tourist", icon: <Compass size={20} />, description: "Find and book authentic experiences." },
        { id: "Guide", label: "Guide", icon: <Briefcase size={20} />, description: "Showcase your expertise to the world." },
        { id: "EventOrganizer", label: "Organizer", icon: <CheckCircle2 size={20} />, description: "Create and manage events for the community." },
        // { id: "TravelAgency", label: "Agency", icon: <Building2 size={20} />, description: "Manage guides and large scale tours." },
        // { id: "VehicleOwner", label: "Transport", icon: <Car size={20} />, description: "Provide premium vehicle rentals." }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const password = formData.password.trim();
            if (!isLogin) {
                if (password.length < 8) {
                    setError("Password must be at least 8 characters long.");
                    setLoading(false);
                    return;
                }
                if (password !== formData.confirmPassword) {
                    setError("Passwords do not match.");
                    setLoading(false);
                    return;
                }
            }

            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { ...formData, role: role };

            const response = await apiClient.post(endpoint, payload);
            const userData = response.data as UserType & { token: string };

            localStorage.setItem("token", userData.token);
            localStorage.setItem("user", JSON.stringify(userData));

            onSuccess(userData);
            onClose();
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string, errors?: string[] } } };
            setError(axiosError.response?.data?.message || axiosError.response?.data?.errors?.[0] || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Left Side: Branding/Visual */}
                        <div className="hidden md:flex md:w-2/5 bg-gray-900 p-12 flex-col justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <img src="/logo.svg" alt="SRIGuide" className="h-12 w-auto brightness-0 invert mb-12" />
                                <h2 className="text-4xl font-black text-white leading-tight mb-6 tracking-tighter italic uppercase">
                                    {isLogin ? "Welcome Back to Paradise" : "Join the Premium Network"}
                                </h2>
                                <p className="text-white/60 font-medium leading-relaxed">
                                    Discover hidden gems and authentic experiences curated by locals.
                                </p>
                            </div>

                            <div className="relative z-10 space-y-4">
                                {[
                                    "Verified Local Experts",
                                    "Secure Dynamic Payments",
                                    "24/7 Premium Support"
                                ].map(feature => (
                                    <div key={feature} className="flex items-center gap-3 text-white/80 text-sm font-bold">
                                        <CheckCircle2 size={18} className="text-primary" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32" />
                        </div>

                        {/* Right Side: Form */}
                        <div className="w-full md:w-3/5 p-8 md:p-14 bg-white max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-400 z-20"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-10 mt-4">
                                <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase italic">
                                    {isLogin ? "Sign In" : "Get Started"}
                                </h3>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500 font-medium">
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    </span>
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-primary font-black uppercase tracking-widest hover:underline"
                                    >
                                        {isLogin ? "Create One" : "Login Now"}
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                                <User size={10} /> Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="John Doe"
                                                required={!isLogin}
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                                <ShieldCheck size={10} /> Choose Your Role
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {roles.map((r) => (
                                                    <button
                                                        key={r.id}
                                                        type="button"
                                                        onClick={() => setRole(r.id)}
                                                        className={`p-4 rounded-2xl border-2 text-left transition-all relative group ${role === r.id
                                                            ? "bg-primary/5 border-primary shadow-lg shadow-primary/5"
                                                            : "bg-white border-gray-100 hover:border-gray-200"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className={`p-2 rounded-xl transition-colors ${role === r.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
                                                                {r.icon}
                                                            </div>
                                                            <span className={`text-sm font-black uppercase tracking-widest ${role === r.id ? "text-primary" : "text-gray-900"}`}>
                                                                {r.label}
                                                            </span>
                                                        </div>
                                                        <p className={`text-[10px] font-medium leading-tight ${role === r.id ? "text-primary/70" : "text-gray-400"}`}>
                                                            {r.description}
                                                        </p>

                                                        {role === r.id && (
                                                            <motion.div
                                                                layoutId="activeRole"
                                                                className="absolute top-3 right-3 text-primary"
                                                            >
                                                                <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                        <Mail size={10} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="hello@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                        <Lock size={10} /> {isLogin ? "Password" : "Create Password"}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder={isLogin ? "••••••••" : "Min. 8 characters"}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full bg-gray-50 border ${!isLogin && formData.password && formData.password.length < 8 ? 'border-rose-300 ring-rose-300' : 'border-gray-100'} rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700`}
                                    />
                                    {!isLogin && (
                                        <p className={`text-[10px] ml-4 font-medium ${formData.password && formData.password.length < 8 ? 'text-rose-500' : 'text-gray-400'}`}>
                                            Password must be at least 8 characters long.
                                        </p>
                                    )}
                                </div>

                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <Lock size={10} /> Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Retype password"
                                            required={!isLogin}
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full bg-gray-50 border ${formData.confirmPassword && formData.confirmPassword !== formData.password ? 'border-rose-300 ring-rose-300' : 'border-gray-100'} rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700`}
                                        />
                                        {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                            <p className="text-[10px] ml-4 font-medium text-rose-500">
                                                Passwords do not match.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {isLogin && (
                                    <div className="flex justify-end pr-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                window.location.href = "/forgot-password";
                                            }}
                                            className="text-[11px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-black uppercase tracking-tighter text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 mt-8 active:scale-[0.98] disabled:opacity-50 group uppercase text-xs tracking-[0.2em]"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>{isLogin ? "Sign In Now" : "Create Account"}</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-gray-400 text-[10px] text-center mt-10 font-medium leading-relaxed">
                                By proceeding, you agree to SRIGuide&apos;s <span className="text-primary hover:underline cursor-pointer font-bold">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer font-bold">Privacy Policy</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
