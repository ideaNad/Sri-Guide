"use client";

import React, { useEffect, useState } from "react";
import { 
    Star, Languages, ShieldCheck, MapPin, 
    Calendar, MessageCircle, Compass, 
    ArrowRight, ChevronLeft, Globe, 
    Clock, DollarSign, Loader2, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface PublicProfile {
    id: string;
    fullName: string;
    bio: string;
    specialty: string;
    languages: string[];
    dailyRate: number;
    isLegit: boolean;
    verificationStatus: string;
    profileImageUrl?: string;
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
    }[];
}

export default function PublicProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [submittingRating, setSubmittingRating] = useState<string | null>(null);

    const handleRateTrip = async (tripId: string, rating: number) => {
        if (!user) {
            router.push("/auth/login"); // Redirect if not logged in
            return;
        }

        setSubmittingRating(tripId);
        try {
            await apiClient.post("/review", {
                targetId: tripId,
                targetType: "Trip",
                rating: rating,
                comment: "Tourist rating"
            });
            // Re-fetch profile to get updated trip ratings
            const response = await apiClient.get(`/profile/public/${id}`);
            setProfile(response.data as PublicProfile);
        } catch (error) {
            console.error("Failed to rate trip", error);
        } finally {
            setSubmittingRating(null);
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

        if (id) fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
                <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase italic">Profile <span className="text-primary text-stroke-primary">Not Found</span></h1>
                <p className="text-gray-500 font-bold mb-8">The guide profile you are looking for does not exist or has been removed.</p>
                <button 
                    onClick={() => router.push("/guides")}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
                >
                    Back to Guides
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-24">
            <div className="container mx-auto px-4 md:px-6">
                {/* Profile Header Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border-2 border-gray-900 p-2 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]"
                        >
                            <div className="aspect-square overflow-hidden bg-gray-100 relative">
                                <img 
                                    src={profile.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${profile.profileImageUrl}` : `https://ui-avatars.com/api/?name=${profile.fullName}&background=FFCC00&color=000&bold=true&size=512`} 
                                    alt={profile.fullName} 
                                    className="w-full h-full object-cover" 
                                />
                                {profile.isLegit && (
                                    <div className="absolute top-6 right-6 bg-white border-2 border-emerald-500 text-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl animate-bounce-slow">
                                        <ShieldCheck size={18} className="fill-emerald-500 text-white" />
                                        <span className="font-black text-[10px] uppercase tracking-widest italic">LEGIT GUIDE</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter">
                                    {profile.fullName}
                                </h1>
                            </div>
                            <p className="text-xl font-bold text-primary italic uppercase tracking-wider">{profile.specialty}</p>
                            
                            <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-50 rounded-2xl">
                                        <Star className="text-yellow-500 fill-yellow-500" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</p>
                                        <p className="font-black text-lg italic">4.9 <span className="text-xs text-gray-300 font-bold">(84 Reviews)</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-50 rounded-2xl">
                                        <DollarSign className="text-emerald-500" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Rate</p>
                                        <p className="font-black text-lg italic">${profile.dailyRate} <span className="text-xs text-gray-300 font-bold">/ Day</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-50 rounded-2xl">
                                        <Globe className="text-blue-500" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Languages</p>
                                        <p className="font-black text-xs italic uppercase tracking-tighter">{profile.languages.join(" • ")}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500 font-medium leading-[1.8] text-lg max-w-3xl pt-2">
                                {profile.bio}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-6">
                                <button className="px-12 py-5 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all flex items-center gap-4 shadow-2xl shadow-gray-900/20 active:scale-95">
                                    Book This Guide <ArrowRight size={18} />
                                </button>
                                <button className="px-12 py-5 bg-white text-gray-900 font-black text-xs uppercase tracking-[0.3em] border-2 border-gray-900 hover:bg-gray-50 transition-all flex items-center gap-4 active:scale-95">
                                    <MessageCircle size={18} /> Send Message
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-20">
                        {/* Recent Trips Section */}
                        <section id="trips" className="space-y-12">
                            <div className="flex items-end justify-between border-b-2 border-gray-900 pb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Recent <span className="text-primary text-stroke-primary">Adventures</span></h2>
                                    <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-widest italic">Shared by {profile.fullName.split(" ")[0]}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Compass size={24} className="text-primary animate-spin-slow" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-12">
                                {profile.recentTrips.length > 0 ? (
                                    profile.recentTrips.map((trip) => (
                                        <motion.div 
                                            key={trip.id}
                                            whileHover={{ y: -10 }}
                                            className="group bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all"
                                        >
                                            <div className="h-80 bg-gray-200 relative overflow-hidden">
                                                {trip.primaryImageUrl ? (
                                                    <img 
                                                        src={trip.primaryImageUrl?.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${trip.primaryImageUrl}` : trip.primaryImageUrl} 
                                                        alt={trip.title} 
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                                        <Compass size={64} />
                                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">No Photos</span>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-lg">
                                                    <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest">
                                                        <Calendar size={14} className="text-primary" />
                                                        {trip.date ? new Date(trip.date).toLocaleDateString() : "Recent"}
                                                    </div>
                                                </div>
                                                {trip.location && (
                                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-lg">
                                                        <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest">
                                                            <MapPin size={14} className="text-gray-400" />
                                                            {trip.location}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-8 md:p-12">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-3 underline decoration-primary/30 decoration-4 underline-offset-8">{trip.title}</h3>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1">
                                                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                                <span className="font-bold text-gray-900">{trip.rating?.toFixed(1) || "5.0"}</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">({trip.reviewCount || 0} Ratings)</span>
                                                        </div>
                                                    </div>
                                                    {user && user.id !== profile.id && (
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rate this trip</span>
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button 
                                                                        key={star}
                                                                        disabled={submittingRating === trip.id}
                                                                        onClick={() => handleRateTrip(trip.id, star)}
                                                                        className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-yellow-500 hover:shadow-yellow-500/20 active:scale-95 transition-all outline-none"
                                                                    >
                                                                        <Star size={16} className={submittingRating === trip.id ? "text-gray-300 animate-pulse" : "text-yellow-500"} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium leading-relaxed mb-6">{trip.description || "Explore the beauty of Sri Lanka through the lens of a local expert. This trip captures the essence of our island."}</p>
                                                
                                                {trip.images && trip.images.length > 1 && (
                                                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                                        {trip.images.slice(1).map((img, idx) => (
                                                            <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                                                                <img 
                                                                    src={img.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${img}` : img} 
                                                                    alt={`Trip photo ${idx + 2}`} 
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
                                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest italic">No adventures shared yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Sidebar Widgets */}
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white sticky top-28 shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 italic flex items-center gap-3">
                                <Zap className="text-primary animate-pulse" size={18} /> Service Highlights
                            </h3>
                            
                            <div className="space-y-12">
                                <div className="relative pl-8 border-l-2 border-primary/30">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">Expertise</p>
                                    <p className="text-xs font-bold text-white/80 leading-relaxed italic">Deep knowledge of local history and hidden gems.</p>
                                </div>
                                <div className="relative pl-8 border-l-2 border-primary/30">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">Availability</p>
                                    <p className="text-xs font-bold text-white/80 leading-relaxed italic">Fully flexible schedules for custom tour requirements.</p>
                                </div>
                                <div className="relative pl-8 border-l-2 border-primary/30">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">Transportation</p>
                                    <p className="text-xs font-bold text-white/80 leading-relaxed italic">Modern A/C vehicle included in the package.</p>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic">Professionalism</span>
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-primary fill-primary" />)}
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                                    Request Custom Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
