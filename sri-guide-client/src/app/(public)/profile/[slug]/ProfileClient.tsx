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
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";

import AuthModal from "@/features/auth/components/AuthModal";
import Card from "@/components/ui/Card";

interface Review {
    id: string;
    reviewerName: string;
    reviewerImageUrl: string | null;
    rating: number;
    comment: string;
    createdAt: string;
    targetType: string;
    tripTitle?: string;
}

export interface PublicProfile {
    id: string;
    fullName: string;
    slug?: string;
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
        slug?: string;
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
        slug?: string;
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
        slug?: string;
        role: string;
        profileImageUrl?: string;
        rating: number;
        location: string;
        status: string;
        tripCount: number;
    }[];
    legacyGuideProfile?: {
        bio: string;
        rating: number;
        reviewCount: number;
        specialties: string[];
        operatingAreas: string[];
        reviews: {
            id: string;
            reviewerName: string;
            reviewerImageUrl: string | null;
            rating: number;
            comment: string;
            createdAt: string;
            targetType: string;
        }[];
    };
    agencyProfileImageUrl?: string;
}

import { useShare } from "@/hooks/useShare";

export default function ProfileClient({ slug, initialData }: { slug: string, initialData?: PublicProfile }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, login } = useAuth();
    const { toast } = useToast();
    const { share } = useShare();
    const [profile, setProfile] = useState<PublicProfile | null>(initialData || null);


    const isAgencyPath = searchParams.get('type') === 'agency';
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(!initialData);
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    // Tab State for Agency Owners with Legacy Guide Profiles
    const showGuideTab = isAgencyPath && profile?.legacyGuideProfile && user?.id === profile.id && searchParams.get('full') === 'true';
    const [activeTab, setActiveTab] = useState<'agency' | 'guide'>('agency');

    const handleToggleLike = async (id: string, type: string) => {
        if (!user) { setIsAuthModalOpen(true); return; }
        try {
            const endpoint = type === 'tour' ? `/tours/${id}/toggle-like` : `/trip/${id}/toggle-like`;
            const response = await apiClient.post<{ liked: boolean }>(endpoint);
            const { liked } = response.data;
            if (profile) {
                setProfile({
                    ...profile,
                    agencyTours: profile.agencyTours?.map(t =>
                        t.id === id ? { ...t, isLiked: liked } : t
                    ) || [],
                    recentTrips: profile.recentTrips?.map(t =>
                        t.id === id ? { ...t, isLiked: liked } : t
                    ) || []
                });
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const fetchReviews = async () => {
        if (!profile?.id) return;
        try {
            const type = searchParams.get('type') || 'guide';
            const response = await apiClient.get<Review[]>(`/review/guide/${profile.id}?type=${type}`);
            setReviews(response.data || []);
        } catch (error) {
            console.error("Failed to fetch public reviews", error);
        }
    };


    useEffect(() => {
        const fetchProfile = async () => {
            if (initialData) return;
            try {
                const requestedType = searchParams.get('type');
                const response = await apiClient.get(`/profile/public/${slug}${requestedType ? `?type=${requestedType}` : ''}`);
                setProfile(response.data as PublicProfile);
            } catch (error) {
                console.error("Failed to fetch public profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug && !initialData) {
            fetchProfile();
        }
    }, [slug, initialData]);

    useEffect(() => {
        if (profile?.id) {
            fetchReviews();
        }
    }, [profile?.id]);

    const getImageUrl = (url?: string) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const baseUrl = apiClient.defaults.baseURL?.split('/api')[0];
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

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
        <div className="bg-white min-h-screen font-sans text-secondary pb-32 overflow-x-hidden pt-12">

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
                                    {isAgencyPath && (
                                        <div className="inline-flex items-center text-xs font-bold px-4 py-1.5 rounded-full shadow-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            <ShieldCheck size={16} className="mr-2" />
                                            Travel Agency
                                        </div>
                                    )}
                                    {!isAgencyPath && profile.isLegit && profile.verificationStatus !== 'Pending' && (
                                        <div className="inline-flex items-center text-xs font-bold px-4 py-1.5 rounded-full shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <ShieldCheck size={16} className="mr-2" />
                                            Licensed Guide
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                                    {profile.fullName}
                                </h1>

                                {profile.totalReviews > 0 && (
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
                                            {profile.totalReviews} {isAgencyPath ? 'TOTAL' : 'TRAVELER'} REVIEWS
                                        </span>
                                        <button 
                                            onClick={() => share({
                                                title: `Check out ${profile.fullName} on SriGuide`,
                                                text: profile.bio,
                                                url: window.location.href
                                            })}
                                            className="ml-auto p-2.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                                            title="Share Profile"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="max-w-xl mx-auto lg:mx-0 mb-8 text-left bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 text-center lg:text-left">{isAgencyPath ? 'Our Story' : 'About Me'}</h3>
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
                                            <div className="sm:col-span-2 lg:col-span-2 mt-4 sm:mt-0 lg:mt-4 space-y-8" id="contact-section">
                                                {/* Contact Information */}
                                                <div>
                                                    <h3 className="text-[11px] font-black tracking-widest text-primary uppercase mb-4 opacity-50">Contact Information</h3>
                                                    <div className="flex flex-wrap gap-2.5">
                                                        {profile.phoneNumber && (
                                                            <a href={`tel:${profile.phoneNumber}`} className="flex items-center gap-2.5 group bg-blue-50/50 hover:bg-blue-600 px-4 py-2.5 rounded-xl transition-all border border-blue-100/50 hover:border-blue-600 shadow-sm">
                                                                <Phone size={14} className="text-blue-600 group-hover:text-white transition-colors" />
                                                                <span className="font-bold text-[11px] uppercase tracking-wider text-blue-700 group-hover:text-white transition-colors">Call {profile.phoneNumber}</span>
                                                            </a>
                                                        )}
                                                        {profile.whatsAppNumber && (
                                                            <a href={`https://wa.me/${profile.whatsAppNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group bg-emerald-50/50 hover:bg-[#25D366] px-4 py-2.5 rounded-xl transition-all border border-emerald-100/50 hover:border-[#25D366] shadow-sm">
                                                                <svg className="w-4 h-4 fill-current text-[#25D366] group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                                                </svg>
                                                                <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 group-hover:text-white transition-colors">WhatsApp</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Social Media */}
                                                {(profile.linkedinLink || profile.tikTokLink || profile.instagramLink || profile.youTubeLink || profile.facebookLink || profile.twitterLink) && (
                                                    <div>
                                                        <h3 className="text-[11px] font-black tracking-widest text-primary uppercase mb-4 opacity-50">Social Media</h3>
                                                        <div className="flex flex-wrap gap-2.5">
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
                                                )}
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
                                    {!isAgencyPath && (
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
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 mx-auto lg:mx-0">
                                {/* Contact buttons hidden for now */}
                            </div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-[320px] lg:max-w-[400px] shrink-0 mx-auto lg:mx-0"
                        >
                            <div className="w-full aspect-[4/5] overflow-hidden shadow-2xl rounded-[3rem] border-8 border-white group relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-highlight/5 rounded-full" />
                                <img
                                    src={getImageUrl(profile.agencyProfileImageUrl || profile.profileImageUrl) || `https://ui-avatars.com/api/?name=${profile.fullName}&size=200&background=F0FDFA&color=0D9488&bold=true`}
                                    alt={profile.fullName}
                                    className="w-full h-full object-cover relative z-10"
                                />
                            </div>


                        </motion.div>
                    </div>
                </div>
            </div>

            {/* TAB SWITCHER (For Agency Owners) */}
            {showGuideTab && (
                <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex justify-center -mb-px">
                            <button
                                onClick={() => setActiveTab('agency')}
                                className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'agency' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-secondary'}`}
                            >
                                Agency Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('guide')}
                                className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'guide' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-secondary'}`}
                            >
                                My Guide Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 pt-20">


                 {/* 3. PORTFOLIO: SIGNATURE TOURS (AGENCY ONLY OR Agency Tab) */}
                {isAgencyPath && activeTab === 'agency' && (
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
                                            slug={trip.slug}
                                            title={trip.title}
                                            image={trip.primaryImageUrl || ""}
                                            location={trip.location}
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

                {/* GUIDE SPECIFIC DETAILS (Guide Tab Only) */}
                {activeTab === 'guide' && profile.legacyGuideProfile && (
                    <div className="mb-24 space-y-24">
                        {/* Guide About */}
                        <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-100">
                            <div className="max-w-3xl">
                                <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-6">About the Guide</h3>
                                <div className="text-xl text-gray-700 leading-relaxed font-medium mb-12 italic">
                                    "{profile.legacyGuideProfile.bio}"
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Guide Specialties</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.legacyGuideProfile.specialties.map((s, i) => (
                                                <span key={i} className="bg-white px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-secondary shadow-sm">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Primary Regions</h4>
                                        <div className="space-y-2">
                                            {profile.legacyGuideProfile.operatingAreas.map((loc, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-secondary">
                                                    <MapPin size={16} className="text-primary" />
                                                    {loc}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guide Rating Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center bg-primary text-white p-12 rounded-[3rem] shadow-xl shadow-primary/20">
                            <div className="lg:col-span-1 text-center lg:text-left">
                                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Guide Rating</h3>
                                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                                    <span className="text-6xl font-black">{profile.legacyGuideProfile.rating.toFixed(1)}</span>
                                    <span className="text-xl font-bold opacity-40">/5</span>
                                </div>
                            </div>
                            <div className="lg:col-span-2 flex justify-center lg:justify-start">
                                <div className="flex gap-1.5 text-highlight">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={24} className={s <= Math.round(profile.legacyGuideProfile!.rating) ? 'fill-current' : 'opacity-20'} />
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-1 text-center lg:text-right">
                                <p className="text-sm font-bold uppercase tracking-widest">{profile.legacyGuideProfile.reviewCount} Reviews</p>
                                <p className="text-[10px] opacity-60 uppercase font-black tracking-tighter">Verified Guide History</p>
                            </div>
                        </div>

                        {/* Guide Reviews */}
                        <div>
                            <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-100">
                                <h2 className="text-3xl font-bold text-gray-900">Guide Feedback</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {profile.legacyGuideProfile.reviews.map(review => (
                                    <div key={review.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                        <div className="flex text-highlight gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={14} className={s <= review.rating ? 'fill-current' : 'opacity-20'} />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 font-medium italic mb-6 leading-relaxed">"{review.comment}"</p>
                                        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-primary overflow-hidden">
                                                {review.reviewerImageUrl ? <img src={review.reviewerImageUrl} className="w-full h-full object-cover" /> : review.reviewerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{review.reviewerName}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. RECENT ADVENTURES (BOTH) */}
                <div className="mb-24">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Gallery</h3>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{isAgencyPath ? 'Team Adventures' : 'Recent Trips'}</h2>
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
                                        slug={trip.slug}
                                        title={trip.title}
                                        image={trip.primaryImageUrl || ""}
                                        location={trip.location}
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
                {isAgencyPath && profile.guides && profile.guides.length > 0 && (
                    <div className="mb-24">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 pb-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Professional Team</h3>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Experts</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {profile.guides.map(guide => (
                                <Link href={`/profile/${guide.slug || guide.id}?type=guide`} key={guide.id} className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-gray-50 group-hover:border-primary/20 transition-colors">
                                        <img 
                                            src={guide.profileImageUrl ? getImageUrl(guide.profileImageUrl) || '' : `https://ui-avatars.com/api/?name=${guide.name}&background=F5F4F0&color=2563eb`} 
                                            alt={guide.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{guide.name}</h4>
                                    {guide.rating > 0 && (
                                        <div className="flex items-center justify-center gap-1.5 mt-2">
                                            <Star size={12} className="fill-highlight text-highlight" />
                                            <span className="text-xs font-bold text-gray-700">{guide.rating}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 mt-3 text-gray-500">
                                        <MapPin size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{guide.location}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. RECENT FEEDBACK (Agency Tab Only) */}
                {activeTab === 'agency' && (
                    <div className="bg-primary/5 p-8 md:p-16 mb-24 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-highlight" />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
                            {/* Rating Summary */}
                        {profile?.totalReviews > 0 && (
                            <div className="lg:col-span-1">
                                <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Social Proof</h3>
                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">Traveler<br />Feedback</h2>

                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="font-black text-gray-900 text-6xl md:text-7xl leading-none tracking-tighter">{(profile?.averageRating || 0).toFixed(1)}</span>
                                    <span className="text-gray-400 font-bold text-xl md:text-2xl">/5</span>
                                </div>
                                <div className="flex text-highlight gap-1.5 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={28} className={star <= Math.round(profile?.averageRating || 0) ? "fill-current" : "opacity-30"} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest max-w-[200px]">
                                    Based on {profile?.totalReviews || 0} verified reviews
                                </p>
                            </div>
                        )}

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
                                            toast.warning("Only Tourists can write reviews.", "Action Restricted");
                                            return;
                                        }

                                        setReviewFormOpen(!reviewFormOpen);
                                    }}
                                    className="mt-4 sm:mt-0 px-6 py-2.5 bg-secondary text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary transition-all shadow-sm"
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
                                                        targetId: profile?.id,
                                                        targetType: isAgencyPath ? 'Agency' : 'Guide',
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
                                                        {review.reviewerImageUrl ? (
                                                            <img 
                                                                src={review.reviewerImageUrl.startsWith('http') ? review.reviewerImageUrl : `${apiClient.defaults.baseURL?.replace('/api', '')}${review.reviewerImageUrl}`} 
                                                                alt={review.reviewerName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span>{review.reviewerName.charAt(0).toUpperCase()}</span>
                                                        )}
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
                )}


            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={(userData) => {
                    login(userData);
                    setIsAuthModalOpen(false);
                }}
                redirectOnSuccess={false}
            />
        </div>
    );
}
