"use client";

import React, { useEffect, useState } from "react";
import {
    Star, ShieldCheck, MapPin,
    MessageCircle, Globe, Share2, AtSign,
    Instagram, Youtube, Link as LinkIcon, Phone,
    Facebook, Twitter, Linkedin
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";
import AuthModal from "@/features/auth/components/AuthModal";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

interface Review {
    id: string;
    reviewerName: string;
    rating: number;
    comment: string;
    createdAt: string;
    targetType: string;
    tripTitle?: string;
}

interface PublicProfile {
    id: string;
    fullName: string;
    bio: string;
    specialties: string[];
    operatingAreas: string[];
    languages: string[];
    dailyRate: number;
    hourlyRate: number;
    contactForPrice: boolean;
    isLegit: boolean;
    verificationStatus: string;
    averageRating: number;
    totalReviews: number;
    role?: string;
    profileImageUrl?: string;
    phoneNumber?: string;
    whatsAppNumber?: string;
    youTubeLink?: string;
    tikTokLink?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    linkedinLink?: string;
    agencyTours: {
        id: string;
        title: string;
        primaryImageUrl: string;
        date?: string;
        description?: string;
        location?: string;
        rating?: number;
        reviewCount?: number;
        images?: string[];
        isLiked?: boolean;
    }[];
    recentTrips: {
        id: string;
        title: string;
        primaryImageUrl: string;
        date?: string;
        description?: string;
        location?: string;
        rating?: number;
        reviewCount?: number;
        images?: string[];
        isLiked?: boolean;
    }[];
    guides?: {
        id: string;
        name: string;
        role: string;
        rating: number;
        location: string;
        status: string;
        tripCount: number;
    }[];
}

export default function PublicProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, login } = useAuth();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleToggleLike = async (tripId: string) => {
        if (!user) { setIsAuthModalOpen(true); return; }
        try {
            const response = await apiClient.post<{ liked: boolean }>(`/trip/${tripId}/toggle-like`);
            const { liked } = response.data;
            if (profile) {
                setProfile({
                    ...profile,
                    agencyTours: profile.agencyTours?.map(t =>
                        t.id === tripId ? { ...t, isLiked: liked } : t
                    ) || [],
                    recentTrips: profile.recentTrips?.map(t =>
                        t.id === tripId ? { ...t, isLiked: liked } : t
                    ) || []
                });
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await apiClient.get<Review[]>(`/review/guide/${id}`);
            setReviews(response.data || []);
        } catch (error) {
            console.error("Failed to fetch public reviews", error);
        }
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get(`/profile/public/${id}`);
                setProfile(response.data as PublicProfile);
            } catch (error) {
                console.error("Failed to fetch public profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
            fetchReviews();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Loading Profile</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-3xl rounded-full -z-10 animate-pulse" />
                <h1 className="text-5xl lg:text-7xl font-black text-secondary mb-4 tracking-tighter uppercase">Profile <span className="text-primary">Not Found</span></h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">This guide profile may have been removed, or the link is incorrect.</p>
                <button
                    onClick={() => router.push("/guides")}
                    className="bg-primary text-white px-10 py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all"
                >
                    Return to Guides
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-secondary pb-32 overflow-x-hidden">

            {/* HERO SECTION */}
            <div className="bg-primary/5 pt-32 pb-24 relative overflow-hidden border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-3xl -z-10 animate-pulse" />

                <div className="container mx-auto px-4">
                    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 max-w-6xl mx-auto">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 text-center lg:text-left space-y-8"
                        >
                            <div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {profile.role === 'Agency' && (
                                        <div className="inline-flex items-center text-xs font-bold px-4 py-1.5 rounded-full shadow-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            <ShieldCheck size={16} className="mr-2" />
                                            Travel Agency
                                        </div>
                                    )}
                                    {profile.isLegit && (
                                        <div className="inline-flex items-center text-xs font-bold px-4 py-1.5 rounded-full shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <ShieldCheck size={16} className="mr-2" />
                                            Licensed Guide
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                                    {profile.fullName}
                                </h1>

                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <div className="flex bg-primary px-4 py-1.5 rounded-full shadow-md shadow-primary/20">
                                        <div className="flex items-center">
                                            <Star size={16} className="fill-highlight text-highlight mr-2" />
                                            <span className="font-bold text-white text-sm">
                                                {profile.averageRating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-bold tracking-wide">
                                        {profile.totalReviews} {profile.role === 'Agency' ? 'TOTAL' : 'TRAVELER'} REVIEWS
                                    </span>
                                </div>
                            </div>

                            <div className="max-w-xl mx-auto lg:mx-0 mb-8 text-left bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 text-center lg:text-left">{profile.role === 'Agency' ? 'Our Story' : 'About Me'}</h3>
                                <div className="text-base text-gray-600 leading-relaxed font-medium">
                                    {(profile.bio || "No bio available.").split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                                    ))}
                                </div>
                            </div>

                            {/* STATS & INFO BAR (Moved to Hero) */}
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xl shadow-gray-200/50 w-full mb-8 text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
                                    {/* Expertise */}
                                    <div>
                                        <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-3">Expertise</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.specialties && profile.specialties.length > 0 ? profile.specialties.map((spec, i) => (
                                                <span key={i} className="bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                                                    {spec.trim()}
                                                </span>
                                            )) : <span className="bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">General</span>}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div>
                                        <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-3">Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.languages && profile.languages.length > 0 ? (
                                                profile.languages.map((lang, i) => (
                                                    <span key={i} className="bg-gray-50 text-secondary text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-100">
                                                        {lang.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-secondary text-sm font-semibold">English</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Regions */}
                                    <div className="sm:col-span-2 lg:col-span-1 border-t border-gray-100 pt-4 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-6">
                                        <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-3">Operating Regions</h3>
                                        <ul className="space-y-2">
                                            {profile.operatingAreas && profile.operatingAreas.length > 0 ? (
                                                profile.operatingAreas.slice(0, 4).map((loc, i) => (
                                                    <li key={i} className="flex items-center text-sm font-semibold text-secondary gap-2">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        <span className="truncate">{loc.trim()}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="flex items-center text-sm font-semibold text-secondary gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" /> Sri Lanka
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Social Connect */}
                                    {user ? (
                                        <div className="sm:col-span-2 lg:col-span-2 mt-4 sm:mt-0 lg:mt-4" id="contact-section">
                                            <h3 className="text-[11px] font-black tracking-widest text-primary uppercase mb-4 opacity-50">Social & Contact</h3>
                                            <div className="flex flex-wrap gap-2.5">
                                                {profile.phoneNumber && (
                                                    <a href={`tel:${profile.phoneNumber}`} className="flex items-center gap-2.5 group bg-blue-50/50 hover:bg-blue-600 px-4 py-2.5 rounded-xl transition-all border border-blue-100/50 hover:border-blue-600 shadow-sm">
                                                        <Phone size={14} className="text-blue-600 group-hover:text-white transition-colors" />
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-blue-700 group-hover:text-white transition-colors">Call {profile.phoneNumber}</span>
                                                    </a>
                                                )}
                                                {profile.whatsAppNumber && (
                                                    <a href={`https://wa.me/${profile.whatsAppNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-emerald-50/50 hover:bg-[#25D366] px-4 py-2.5 rounded-xl transition-all border border-emerald-100/50 hover:border-[#25D366] shadow-sm">
                                                        <MessageCircle size={14} className="text-emerald-600 group-hover:text-white transition-colors" />
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 group-hover:text-white transition-colors">WhatsApp</span>
                                                    </a>
                                                )}
                                                {profile.linkedinLink && (
                                                    <a href={profile.linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-[#0A66C2]/5 hover:bg-[#0A66C2] px-4 py-2.5 rounded-xl transition-all border border-[#0A66C2]/10 hover:border-[#0A66C2] shadow-sm">
                                                        <Linkedin size={14} className="text-[#0A66C2] group-hover:text-white transition-colors" />
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-[#0A66C2] group-hover:text-white transition-colors">LinkedIn</span>
                                                    </a>
                                                )}
                                                {profile.tikTokLink && (
                                                    <a href={profile.tikTokLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-black/5 hover:bg-black px-4 py-2.5 rounded-xl transition-all border border-black/10 hover:border-black shadow-sm">
                                                        <svg className="w-3.5 h-3.5 fill-current text-black group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.776 8.776 0 0 1-1.87-1.41c-.02 2.14-.01 4.29-.02 6.43-.02 2.22-.46 4.55-2.02 6.2-.24.25-.5.48-.77.71a8.487 8.487 0 0 1-5.71 2.16c-1.54-.02-3.07-.44-4.39-1.21-2-1.14-3.51-3.1-4.12-5.3-.67-2.4-.47-5.05.74-7.31 1.05-1.95 2.91-3.48 5.1-4.11a8.172 8.172 0 0 1 6.18.52v4.13c-1.25-.7-2.73-.92-4.14-.61-1.42.3-2.69 1.14-3.52 2.32-.83 1.16-1.2 2.61-1.04 4.03.16 1.42.88 2.73 2.02 3.59 1.15.86 2.63 1.25 4.07 1.09 1.44-.16 2.72-.94 3.53-2.14.81-1.2 1.13-2.69 1.01-4.13-.01-5.03 0-10.06-.01-15.08z"/>
                                                        </svg>
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-black group-hover:text-white transition-colors">TikTok</span>
                                                    </a>
                                                )}
                                                {profile.instagramLink && (
                                                    <a href={profile.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-[#E1306C]/5 hover:bg-[#E1306C] px-4 py-2.5 rounded-xl transition-all border border-[#E1306C]/10 hover:border-[#E1306C] shadow-sm">
                                                        <Instagram size={14} className="text-[#E1306C] group-hover:text-white transition-colors" />
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-[#E1306C] group-hover:text-white transition-colors">Instagram</span>
                                                    </a>
                                                )}
                                                {profile.youTubeLink && (
                                                    <a href={profile.youTubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-[#FF0000]/5 hover:bg-[#FF0000] px-4 py-2.5 rounded-xl transition-all border border-[#FF0000]/10 hover:border-[#FF0000] shadow-sm">
                                                        <Youtube size={14} className="text-[#FF0000] group-hover:text-white transition-colors" />
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-[#FF0000] group-hover:text-white transition-colors">YouTube</span>
                                                    </a>
                                                )}
                                                {profile.facebookLink && (
                                                    <a href={profile.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-[#1877F2]/5 hover:bg-[#1877F2] px-4 py-2.5 rounded-xl transition-all border border-[#1877F2]/10 hover:border-[#1877F2] shadow-sm">
                                                        <Facebook size={14} className="text-[#1877F2] group-hover:text-white transition-colors" />
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-[#1877F2] group-hover:text-white transition-colors">Facebook</span>
                                                    </a>
                                                )}
                                                {profile.twitterLink && (
                                                    <a href={profile.twitterLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-black/5 hover:bg-black px-4 py-2.5 rounded-xl transition-all border border-black/10 hover:border-black shadow-sm">
                                                        <svg className="w-3.5 h-3.5 fill-current text-black group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                        </svg>
                                                        <span className="font-bold text-[11px] uppercase tracking-wider text-black group-hover:text-white transition-colors">X</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="sm:col-span-2 lg:col-span-2 mt-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 mb-1">Want to contact {(profile.fullName || "this guide").split(' ')[0]}?</h3>
                                                <p className="text-xs text-gray-500 font-medium">Log in to view social media links and phone numbers.</p>
                                            </div>
                                            <button onClick={() => setIsAuthModalOpen(true)} className="bg-primary text-white font-bold text-[10px] tracking-widest uppercase px-6 py-3 rounded-xl hover:bg-secondary hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20 whitespace-nowrap">
                                                Log In
                                            </button>
                                        </div>
                                    )}

                                    {/* Investment */}
                                    <div className="sm:col-span-2 lg:col-span-1 border-t border-gray-100 pt-4 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-6 sm:mt-4 flex flex-col justify-center">
                                        <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-2">Investment</h3>
                                        <div className="flex flex-col gap-4">
                                            {profile.contactForPrice ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase text-primary mb-0.5">Custom Quote</span>
                                                    <span className="text-xl font-black text-secondary uppercase tracking-tight">Contact for Pricing</span>
                                                </div>
                                            ) : (
                                                <div className={`grid ${profile.dailyRate > 0 && profile.hourlyRate > 0 ? 'grid-cols-1 sm:grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
                                                    {profile.dailyRate > 0 && (
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Daily Base Rate</span>
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-3xl font-black text-secondary">${profile.dailyRate}</span>
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">/day</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {profile.hourlyRate > 0 && (
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Hourly Rate</span>
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-xl font-black text-secondary">${profile.hourlyRate}</span>
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">/hr</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {profile.dailyRate === 0 && profile.hourlyRate === 0 && (
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold uppercase text-primary mb-0.5">Custom Quote</span>
                                                            <span className="text-xl font-black text-secondary uppercase tracking-tight">Contact for Pricing</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 mx-auto lg:mx-0">
                                {/* Contact buttons hidden for now
                                {user ? (
                                    <button 
                                        onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="flex-1 sm:flex-none flex items-center justify-center bg-primary text-white text-center px-8 py-4 font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary hover:-translate-y-0.5 transition-all"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Contact Guide
                                    </button>
                                ) : (
                                    <button onClick={() => setIsAuthModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center bg-gray-900 text-white text-center px-8 py-4 font-bold text-sm rounded-xl shadow-lg shadow-gray-900/20 hover:bg-secondary hover:-translate-y-0.5 transition-all">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Log In to Contact
                                    </button>
                                )}
                                */}
                            </div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-[320px] lg:max-w-[400px] shrink-0 mx-auto lg:mx-0"
                        >
                            <div className="w-full aspect-[4/5] overflow-hidden shadow-2xl rounded-[3rem] border-8 border-white group relative">
                                <img
                                    src={profile.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${profile.profileImageUrl}` : `https://ui-avatars.com/api/?name=${profile.fullName}&background=F5F4F0&color=2563eb`}
                                    alt={profile.fullName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Actions Box */}
                            {user && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white p-3 rounded-2xl border border-gray-100 shadow-xl flex gap-3 z-10 w-max">
                                    <a 
                                        href={profile.youTubeLink || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${profile.youTubeLink ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`}
                                        title="YouTube Portfolio"
                                    >
                                        <Youtube size={18} />
                                    </a>
                                    <a 
                                        href={profile.linkedinLink || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${profile.linkedinLink ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`}
                                        title="LinkedIn Profile"
                                    >
                                        <Linkedin size={18} />
                                    </a>
                                    <a 
                                        href={profile.whatsAppNumber ? `https://wa.me/${profile.whatsAppNumber.replace(/[^0-9]/g, '')}` : "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${profile.whatsAppNumber ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`}
                                        title="WhatsApp Contact"
                                    >
                                        <MessageCircle size={18} />
                                    </a>
                                </div>
                            )}

                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pt-20">


                {/* 3. PORTFOLIO: SIGNATURE TOURS (AGENCY ONLY) */}
                {profile.role === 'Agency' && (
                    <div className="mb-24">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 pb-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Professional Offerings</h3>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Official Tours</h2>
                            </div>
                            <Link href="/tours" className="text-sm font-bold text-gray-600 hover:text-primary flex items-center gap-2 group transition-colors px-6 py-3 rounded-full border border-gray-200 hover:border-primary shadow-sm">
                                Explore All Tours <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                            </Link>
                        </div>
                        {profile.agencyTours && profile.agencyTours.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {profile.agencyTours.map(trip => (
                                    <motion.div key={trip.id} whileHover={{ y: -5 }}>
                                        <Card 
                                            id={trip.id}
                                            title={trip.title}
                                            image={trip.primaryImageUrl || ""}
                                            location={trip.location}
                                            rating={trip.rating || 5.0}
                                            reviews={trip.reviewCount || 0}
                                            type="tour"
                                            likeCount={trip.reviewCount || 0}
                                            isLiked={trip.isLiked}
                                            onToggleLike={handleToggleLike}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase italic tracking-tighter">No official tours yet</h3>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Check back soon for curated experiences by {profile.fullName}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 4. RECENT ADVENTURES (BOTH) */}
                <div className="mb-24">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Gallery</h3>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{profile.role === 'Agency' ? 'Team Adventures' : 'Recent Trips'}</h2>
                        </div>
                        <Link href="/adventures" className="text-sm font-bold text-gray-600 hover:text-primary flex items-center gap-2 group transition-colors px-6 py-3 rounded-full border border-gray-200 hover:border-primary shadow-sm">
                            View All Stories <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                        </Link>
                    </div>
                    {profile.recentTrips && profile.recentTrips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {profile.recentTrips.map(trip => (
                                <motion.div key={trip.id} whileHover={{ y: -5 }}>
                                    <Card 
                                        id={trip.id}
                                        title={trip.title}
                                        image={trip.primaryImageUrl || ""}
                                        location={trip.location}
                                        rating={trip.rating || 5.0}
                                        reviews={trip.reviewCount || 0}
                                        type="adventure"
                                        likeCount={trip.reviewCount || 0}
                                        isLiked={trip.isLiked}
                                        onToggleLike={handleToggleLike}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase italic tracking-tighter">No recent adventures</h3>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Follow for upcoming journey updates</p>
                        </div>
                    )}
                </div>

                {/* AGENCY GUIDES SECTION */}
                {profile.role === 'Agency' && profile.guides && profile.guides.length > 0 && (
                    <div className="mb-24">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 pb-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Professional Team</h3>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Experts</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {profile.guides.map(guide => (
                                <Link href={`/profile/${guide.id}`} key={guide.id} className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-gray-50 group-hover:border-primary/20 transition-colors">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${guide.name}&background=F5F4F0&color=2563eb`} 
                                            alt={guide.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{guide.name}</h4>
                                    <div className="flex items-center justify-center gap-1.5 mt-2">
                                        <Star size={12} className="fill-highlight text-highlight" />
                                        <span className="text-xs font-bold text-gray-700">{guide.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3 text-gray-500">
                                        <MapPin size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{guide.location}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. RECENT FEEDBACK */}
                <div className="bg-primary/5 p-8 md:p-16 mb-24 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-highlight" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
                        {/* Rating Summary */}
                        <div className="lg:col-span-1">
                            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Social Proof</h3>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">Traveler<br />Feedback</h2>

                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="font-black text-gray-900 text-6xl md:text-7xl leading-none tracking-tighter">{profile.averageRating.toFixed(1)}</span>
                                <span className="text-gray-400 font-bold text-xl md:text-2xl">/5</span>
                            </div>
                            <div className="flex text-highlight gap-1.5 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={28} className={star <= Math.round(profile.averageRating) ? "fill-current" : "opacity-30"} />
                                ))}
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest max-w-[200px]">
                                Based on {profile.totalReviews} verified reviews
                            </p>
                        </div>

                        {/* Testimonials */}
                        <div className="lg:col-span-2">
                            {/* Write Review Action - Only for Tourists */}
                            <div className="flex flex-col items-center sm:flex-row justify-between mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative z-10">
                                <div>
                                    <h4 className="font-bold text-gray-900">Had a great trip with {(profile.fullName || "this guide").split(' ')[0]}?</h4>
                                    <p className="text-xs text-gray-500">Share your experience with other travelers.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            setIsAuthModalOpen(true);
                                            return;
                                        }
                                        if (user.role !== 'Tourist') {
                                            alert("Only Tourists can write reviews.");
                                            return;
                                        }
                                        setReviewFormOpen(!reviewFormOpen);
                                    }}
                                    className={`mt-4 sm:mt-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${user?.role !== 'Tourist' && user ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-secondary text-white hover:bg-primary"}`}
                                >
                                    Write a Review
                                </button>
                            </div>

                            {reviewFormOpen && user && user.role === 'Tourist' && (
                                <div className="bg-white p-8 rounded-3xl border border-primary/20 shadow-xl mb-8 relative z-10">
                                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-6">Write your review</h4>
                                    <div className="flex text-highlight gap-2 mb-6 cursor-pointer">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={24}
                                                className={star <= reviewRating ? "fill-current" : "opacity-30"}
                                                onClick={() => setReviewRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium mb-6 min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Share the details of your experience..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                    />
                                    <div className="flex gap-4 justify-end">
                                        <button
                                            onClick={() => setReviewFormOpen(false)}
                                            className="px-6 py-3 font-bold text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={submittingReview || !reviewComment.trim()}
                                            onClick={async () => {
                                                setSubmittingReview(true);
                                                try {
                                                    await apiClient.post('/review', {
                                                        targetId: id as string,
                                                        targetType: 'Guide',
                                                        rating: reviewRating,
                                                        comment: reviewComment
                                                    });
                                                    setReviewComment("");
                                                    setReviewRating(5);
                                                    setReviewFormOpen(false);
                                                    fetchReviews();
                                                } catch (error) {
                                                    console.error("Failed to post review", error);
                                                } finally {
                                                    setSubmittingReview(false);
                                                }
                                            }}
                                            className="bg-primary text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:hover:translate-y-0"
                                        >
                                            {submittingReview ? "Submitting..." : "Submit Review"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Carousel Container */}
                            <div className="relative">
                                <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                                    {reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div 
                                                key={review.id} 
                                                className="min-w-[280px] md:min-w-[400px] h-full bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between snap-center"
                                            >
                                                <div className="flex text-highlight gap-1 mb-6">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} size={16} className={star <= review.rating ? "fill-current" : "opacity-30"} />
                                                    ))}
                                                </div>
                                                <p className="text-gray-700 text-base md:text-lg font-medium mb-8 leading-relaxed italic line-clamp-4">
                                                    "{review.comment}"
                                                </p>
                                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50 uppercase tracking-tighter">
                                                    <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm bg-primary/5 flex items-center justify-center text-primary font-black text-xs">
                                                        {review.reviewerName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs font-black text-gray-900">{review.reviewerName}</p>
                                                            {review.targetType === 'Trip' && review.tripTitle && (
                                                                <span className="text-[8px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                                    Review for {review.tripTitle}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full py-12 text-center bg-white/50 border border-dashed border-gray-200 rounded-[2rem]">
                                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No reviews yet</p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Fade Effects */}
                                <div className="absolute left-0 top-0 bottom-8 w-12 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none hidden md:block" />
                                <div className="absolute right-0 top-0 bottom-8 w-12 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none hidden md:block" />
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={(userData) => {
                    login(userData);
                    setIsAuthModalOpen(false);
                }}
            />
        </div>
    );
}

