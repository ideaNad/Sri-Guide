"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
    Star, MapPin, Share2, Heart, ArrowRight,
    MessageCircle, Calendar, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import AuthModal from "@/features/auth/components/AuthModal";

interface OtherTrip {
    id: string;
    title: string;
    imageUrl?: string;
    location: string;
}

interface TripDetail {
    id: string;
    title: string;
    description: string;
    location: string;
    date?: string;
    images: string[];
    guideId: string;
    guideName: string;
    guideImageUrl?: string;
    guideRating: number;
    guideTotalReviews: number;
    likeCount: number;
    isLikedByCurrentUser: boolean;
    otherTrips: OtherTrip[];
}

const AdventureSimplePage = () => {
    const { id } = useParams();
    const { user, login } = useAuth();
    const [tour, setTour] = useState<TripDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const fetchTour = async () => {
        try {
            const response = await apiClient.get<TripDetail>(`/trip/${id}`);
            setTour(response.data);
        } catch (error) {
            console.error("Failed to fetch adventure", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (id) fetchTour();
    }, [id]);

    const handleToggleLike = async () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        try {
            const response = await apiClient.post<{ liked: boolean }>(`/trip/${id}/toggle-like`);
            if (tour) {
                setTour({
                    ...tour,
                    isLikedByCurrentUser: response.data.liked,
                    likeCount: response.data.liked ? tour.likeCount + 1 : tour.likeCount - 1
                });
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!tour) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center p-8 border border-gray-100 shadow-2xl">
                <h2 className="text-4xl font-black uppercase italic mb-4">Adventure Not Found</h2>
                <Link href="/" className="px-8 py-3 bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all">
                    Back to Exploration
                </Link>
            </div>
        </div>
    );

    const getImageUrl = (url?: string) => {
        if (!url) return "https://images.unsplash.com/photo-1544013919-add52c3dffbd?q=80&w=1200&auto=format";
        return url.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${url}` : url;
    };

    return (
        <>
        <div className="pb-24 bg-white">
            {/* Minimal Hero / Title Section */}
            <div className="container mx-auto px-4 pt-32 pb-12">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-primary text-black text-[9px] font-black uppercase tracking-widest">
                            Story
                        </span>
                        {tour.date && (
                            <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                <Calendar size={12} className="mr-2" />
                                {new Date(tour.date).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tighter italic uppercase">
                        {tour.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-8 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                        <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-primary" />
                            {tour.location}
                        </div>
                        <div className="flex items-center">
                            <Heart size={14} className={`mr-2 ${tour.isLikedByCurrentUser ? "fill-primary text-primary" : ""}`} />
                            {tour.likeCount} Likes
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Picture Gallery (Simple) */}
            <div className="container mx-auto px-4 mb-20">
                <div className={`grid gap-6 h-[80vh] ${tour.images.length >= 3 ? "grid-cols-1 md:grid-cols-12" : tour.images.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                    <div className={`${tour.images.length >= 3 ? "md:col-span-8" : ""} h-full`}>
                        <img 
                            src={getImageUrl(tour.images[0])} 
                            alt={tour.title}
                            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 shadow-2xl"
                        />
                    </div>
                    {tour.images.length >= 2 && (
                        <div className={`${tour.images.length >= 3 ? "md:col-span-4 grid grid-rows-2 gap-6" : ""} h-full`}>
                            {tour.images[1] && (
                                <img 
                                    src={getImageUrl(tour.images[1])} 
                                    alt={tour.title}
                                    className="w-full h-full object-cover shadow-xl"
                                />
                            )}
                            {tour.images[2] && (
                                <img 
                                    src={getImageUrl(tour.images[2])} 
                                    alt={tour.title}
                                    className="w-full h-full object-cover shadow-xl"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Simplified Content */}
                    <div className="lg:w-2/3">
                        <div className="prose prose-2xl max-w-none text-gray-600 leading-relaxed font-medium italic border-l-8 border-primary pl-12 py-4 mb-20">
                            {tour.description}
                        </div>

                        {/* Pictures placeholder if no more images */}
                        {tour.images.length > 3 && (
                            <div className="grid grid-cols-2 gap-6 mb-20">
                                {tour.images.slice(3).map((img, i) => (
                                    <img key={i} src={getImageUrl(img)} alt={`Gallery ${i}`} className="w-full h-64 object-cover" />
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-8 mt-20 pt-20 border-t border-gray-100">
                             <button 
                                onClick={handleToggleLike}
                                className={`px-10 py-5 flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 ${tour.isLikedByCurrentUser ? "bg-primary text-black" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                            >
                                <Heart className={tour.isLikedByCurrentUser ? "fill-black" : ""} size={16} />
                                {tour.isLikedByCurrentUser ? "Liked" : "Like Adventure"}
                            </button>
                            <button className="px-10 py-5 bg-gray-900 text-white flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-black">
                                <Share2 size={16} />
                                Share Story
                            </button>
                        </div>
                    </div>

                    {/* Simple Sidebar */}
                    <aside className="lg:w-1/3 space-y-12">
                        {/* Essential Guide Card */}
                        <div className="bg-white p-10 border border-gray-100 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 -mr-12 -mt-12 rounded-full transition-all group-hover:scale-[3]" />
                            
                            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-8 relative">The Storyteller</p>
                            
                            <div className="flex items-center gap-6 mb-8 relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    <img 
                                        src={tour.guideImageUrl ? (tour.guideImageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${tour.guideImageUrl}` : tour.guideImageUrl) : `https://ui-avatars.com/api/?name=${tour.guideName}&background=FFCC00&color=000&bold=true`} 
                                        alt={tour.guideName} 
                                        className="w-full h-full object-cover transition-all grayscale group-hover:grayscale-0 duration-700" 
                                    />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">{tour.guideName}</h4>
                                    <div className="flex items-center text-xs font-bold text-gray-400 mt-2">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                                        {tour.guideRating.toFixed(1)} ({tour.guideTotalReviews} reviews)
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href={`/profile/${tour.guideId}`}
                                className="w-full bg-gray-900 text-white flex items-center justify-center py-5 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all relative"
                            >
                                View Full Profile <ChevronRight size={14} className="ml-2" />
                            </Link>
                        </div>

                        {/* Guides Other Trips */}
                        {tour.otherTrips && tour.otherTrips.length > 0 && (
                            <div className="pt-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 px-4">More from this Guide</h3>
                                <div className="space-y-6">
                                    {tour.otherTrips.map(trip => (
                                        <Link 
                                            key={trip.id} 
                                            href={`/adventures/${trip.id}`}
                                            className="flex gap-4 p-4 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100">
                                                <img 
                                                    src={getImageUrl(trip.imageUrl)} 
                                                    alt={trip.title} 
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0" 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-2 truncate">{trip.location}</p>
                                                <h4 className="text-sm font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors tracking-tight italic">{trip.title}</h4>
                                                <div className="mt-2 flex items-center text-[9px] font-bold text-primary group-hover:underline">
                                                    Read More <ArrowRight size={10} className="ml-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={(userData) => { login(userData); setIsAuthModalOpen(false); }}
        />
        </>
    );
};

export default AdventureSimplePage;
