"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import {
    Download, Utensils, Star, MessageSquare,
    Calendar, LayoutDashboard, ExternalLink,
    ArrowUpRight, Users, TrendingUp, Clock, MapPin
} from "lucide-react";
import QRCode from "react-qr-code";
import apiClient from "@/services/api-client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";

interface RestaurantProfile {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    coverImage?: string;
    description?: string;
    rating: number;
    reviewCount: number;
    priceRange?: string;
    openingTime?: string;
    closingTime?: string;
    isActive: boolean;
    menus: any[];
    events: any[];
}

export default function RestaurantDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [profile, setProfile] = useState<RestaurantProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await apiClient.get<RestaurantProfile>("/restaurants/my-profile");
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch restaurant profile", error);
                toast.error("Failed to load restaurant data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [toast]);

    const getRestaurantUrl = () => {
        if (!profile?.slug) return "#";
        // Ensure this matches your public restaurant profile route
        return `${window.location.origin}/restaurants/${profile.slug}`;
    };

    const handleDownloadQrCode = () => {
        const svg = document.getElementById("restaurant-qr");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `restaurant-qr-${profile?.slug || 'code'}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const stats = [
        { label: "Total Menus", value: profile?.menus?.length || 0, icon: <Utensils size={20} />, color: "bg-orange-50 text-orange-600" },
        { label: "Active Events", value: profile?.events?.length || 0, icon: <Calendar size={20} />, color: "bg-blue-50 text-blue-600" },
        { label: "Avg Rating", value: profile?.rating?.toFixed(1) || "0.0", icon: <Star size={20} />, color: "bg-amber-50 text-amber-600" },
        { label: "Reviews", value: profile?.reviewCount || 0, icon: <MessageSquare size={20} />, color: "bg-purple-50 text-purple-600" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="italic uppercase">Ayubowan,</span> {user?.fullName?.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Empowering your culinary journey at <span className="text-rose-600 font-bold">{profile?.name}</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link
                        href={`/restaurants/${profile?.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ExternalLink size={18} />
                        View Public Profile
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
                    >
                        <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 opacity-20 blur-[100px] -mr-32 -mt-32" />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-4">Welcome to your Premium Dashboard</h2>
                            <p className="text-white/60 mb-8 max-w-lg leading-relaxed">
                                You now have full control over your restaurant's digital presence in Sri Lanka.
                                Keep your menus updated and events active to attract more tourists!
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/restaurant-dashboard/menus"
                                    className="px-8 py-4 bg-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-2 shadow-lg shadow-rose-900/40"
                                >
                                    <Utensils size={18} />
                                    Manage Menus
                                </Link>
                                {/* <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all backdrop-blur-md border border-white/10 flex items-center gap-2">
                                    <TrendingUp size={18} />
                                    View Analytics
                                </button> */}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Completion / Status */}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-gray-900 uppercase tracking-tight italic">Business Status</h3>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${profile?.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {profile?.isActive ? 'Online' : 'Offline'}
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-2xl mb-6 flex items-center justify-between group-hover:bg-primary/5 transition-all">
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase">Public Visibility</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                                        {profile?.isActive ? 'Visible in discovery feeds' : 'Hidden from all users'}
                                    </p>
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            const { data } = await apiClient.patch<boolean>("/restaurants/toggle-status");
                                            setProfile(prev => prev ? { ...prev, isActive: data } : null);
                                            toast.success(data ? "Restaurant is now LIVE" : "Restaurant is now OFFLINE");
                                        } catch {
                                            toast.error("Failed to update status");
                                        }
                                    }}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ${profile?.isActive ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200'}`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ${profile?.isActive ? 'translate-x-[1.75rem]' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Clock size={16} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Opening Hours</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">
                                            {profile?.openingTime || "Not set"} - {profile?.closingTime || "Not set"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin size={16} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Address</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5 truncate max-w-[200px]">
                                            {profile?.description || "No address provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/restaurant-dashboard/settings"
                                className="w-full mt-8 py-4 border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                            >
                                Edit Information
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        {/* Recent Reviews (Placeholder for now) */}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="font-black text-gray-900 uppercase tracking-tight italic mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {profile?.reviewCount === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-4 text-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <TrendingUp size={20} className="text-gray-300" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No reviews yet</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-4 text-center">
                                        <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Check back soon for insights!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side: QR Code Management */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm flex flex-col items-center text-center">
                        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-inner mb-6 ring-8 ring-rose-50">
                            <QRCode
                                id="restaurant-qr"
                                value={getRestaurantUrl()}
                                size={140}
                                level="H"
                            />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">Dining QR Code</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-normal mb-8 max-w-[180px]">
                            Download and place on tables for digital menu access
                        </p>
                        <button
                            onClick={handleDownloadQrCode}
                            className="w-full justify-center px-6 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-rose-600 transition-all shadow-xl shadow-gray-900/10 uppercase tracking-widest text-xs active:scale-[0.98]"
                        >
                            <Download size={18} /> Download Source
                        </button>
                    </div>

                    <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-200 opacity-40 blur-3xl rounded-full" />
                        <h4 className="font-black text-rose-900 uppercase tracking-widest text-[10px] mb-2">Need Help?</h4>
                        <p className="text-rose-700/70 text-xs font-medium leading-relaxed">
                            Our support team is available 24/7 to help you optimize your restaurant profile.
                        </p>
                        <button className="mt-4 text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            Contact Support
                            <ArrowUpRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

