"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    Star, MapPin, Globe, Clock, ShieldCheck, 
    MessageSquare, Mail, Phone, Calendar, 
    ArrowLeft, Award, Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";
import ProtectedContact from "@/components/ProtectedContact";
import SectionHeader from "@/components/SectionHeader";

interface Profile {
    userId: string;
    fullName: string;
    email: string;
    profileImageUrl?: string;
    role: string;
    bio?: string;
    languages?: string[];
    specialty?: string;
    dailyRate?: number;
    companyName?: string;
    registrationNumber?: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
}

const ProfilePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get(`/profiles/${id}`);
                setProfile(response.data as Profile);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // router.push("/discover");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfile();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 flex-col gap-4">
                <h2 className="text-2xl font-bold">Profile not found</h2>
                <button onClick={() => router.back()} className="text-primary font-bold">Go Back</button>
            </div>
        );
    }

    const isAgency = profile.role === "TravelAgency";

    return (
        <div className="pt-24 pb-24 bg-gray-50/30 min-h-screen">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-12 font-bold text-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Discovery</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Profile Info Card */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-8 rounded-[3rem] sticky top-32 border border-white/40 shadow-xl"
                        >
                            <div className="relative mb-8 group">
                                <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden border-8 border-white shadow-lg">
                                    <img 
                                        src={profile.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.userId}`} 
                                        alt={profile.fullName} 
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                {profile.isVerified && (
                                    <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-full shadow-xl border-4 border-white">
                                        <ShieldCheck size={24} />
                                    </div>
                                )}
                            </div>

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">
                                    {isAgency ? profile.companyName : profile.fullName}
                                </h1>
                                <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
                                    {isAgency ? "Verified Travel Agency" : profile.specialty || "Certified Tourist Guide"}
                                </p>
                                
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex items-center gap-1 text-highlight font-black">
                                        <Star size={18} fill="currentColor" />
                                        <span>{profile.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500 font-bold text-sm">{profile.reviewCount} Reviews</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-100">
                                <ProtectedContact type="phone" value="+94 77 123 4567" />
                                <ProtectedContact type="email" value={profile.email} />
                                <ProtectedContact type="whatsapp" value="+94 77 123 4567" />
                            </div>

                            <button className="w-full hero-gradient text-white font-black py-5 rounded-3xl shadow-lg shadow-primary/20 hover:shadow-xl hover:opacity-95 mt-10 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Calendar size={20} />
                                <span>Check Availability</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Detailed Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Bio Section */}
                        <motion.section 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/50 backdrop-blur-sm rounded-[3rem] p-10 md:p-14 border border-white"
                        >
                            <div className="flex items-center gap-3 mb-8 text-secondary">
                                <Award size={28} />
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">About Professional</h2>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium mb-10">
                                {profile.bio || "No biography provided yet. This professional is dedicated to providing the best travel experience in Sri Lanka."}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Languages Spoken</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(profile.languages || ["English", "Sinhala"]).map(lang => (
                                            <span key={lang} className="px-4 py-2 bg-gray-100/50 rounded-xl text-sm font-bold text-gray-600 border border-gray-100">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Service Area</h4>
                                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                                        <MapPin size={18} className="text-primary" />
                                        <span>Island Wide Service</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Stats & Perks */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Daily Rate", value: `$${profile.dailyRate || 45}`, icon: <Sparkles className="text-highlight" /> },
                                { label: "Experience", value: "5+ Years", icon: <Clock className="text-blue-500" /> },
                                { label: "Spoken", value: `${profile.languages?.length || 2} Langs`, icon: <Globe className="text-green-500" /> }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="bg-white rounded-[2rem] p-8 border border-gray-100 text-center shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        {stat.icon}
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Reviews Placeholder */}
                        <motion.section 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-primary/5 rounded-[3rem] p-10 md:p-14 border border-primary/10"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Traveler Feedback</h2>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-primary">{profile.rating.toFixed(1)}</p>
                                    <p className="text-xs font-black text-primary/60 uppercase tracking-tighter">Global Rating</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl p-8 shadow-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-100" />
                                            <div>
                                                <p className="font-bold text-gray-900">Verified Traveler</p>
                                                <p className="text-xs text-gray-400">October 2023</p>
                                            </div>
                                            <div className="ml-auto flex text-highlight">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 font-medium">
                                            "An incredible experience! Very professional and knowledgeable about the hidden gems of Sri Lanka. Highly recommended for any traveler."
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
