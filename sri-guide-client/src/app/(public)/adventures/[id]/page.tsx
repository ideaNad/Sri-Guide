"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
    Star, MapPin, Share2, Heart, ArrowRight,
    MessageCircle, Calendar, ChevronRight, Clock, Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";
import AuthModal from "@/features/auth/components/AuthModal";

interface ItineraryStep {
    time: string;
    title: string;
    description: string;
    imageUrl?: string;
    dayNumber: number;
    order: number;
}

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
    category?: string;
    date?: string;
    images: string[];
    guideId: string;
    guideName: string;
    guideImageUrl?: string;
    guideRating: number;
    guideTotalReviews: number;
    likeCount: number;
    isLikedByCurrentUser: boolean;
    itinerary: ItineraryStep[];
    otherTrips: OtherTrip[];
    duration?: string;
    mapLink?: string;
    price?: number;
    isAgencyTour?: boolean;
}

const AdventureSimplePage = () => {
    const { id } = useParams();
    const { user, login } = useAuth();
    const [tour, setTour] = useState<TripDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [expandedDays, setExpandedDays] = useState<number[]>([1]);
    const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

    const toggleDay = (day: number) => {
        setExpandedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const toggleStep = (stepId: string) => {
        setExpandedSteps(prev =>
            prev.includes(stepId) ? prev.filter(s => s !== stepId) : [...prev, stepId]
        );
    };

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

    const categories = tour.category ? tour.category.split(", ").filter(c => c) : [];

    return (
        <>
        <div className="pb-24 bg-white">
            {/* Streamlined Header with Main Image */}
            <div className="container mx-auto px-4 mt-8">
                <div className="bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm">
                    <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-1/2 p-12 flex flex-col justify-center">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {categories.map((cat, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tighter italic uppercase">
                                {tour.title}
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-100">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operating Location</span>
                                    <div className="flex items-center text-gray-900 font-black italic uppercase text-lg">
                                        <MapPin size={18} className="mr-3 text-primary" />
                                        {tour.location}
                                    </div>
                                </div>
                                {tour.duration && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adventure Duration</span>
                                        <div className="flex items-center text-gray-900 font-black italic uppercase text-lg">
                                            <Clock size={18} className="mr-3 text-primary" />
                                            {tour.duration}
                                        </div>
                                    </div>
                                )}
                                {tour.price && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Experience Price</span>
                                        <div className="flex items-center text-secondary font-black italic uppercase text-lg">
                                            <Tag size={18} className="mr-3 text-primary" />
                                            From ${tour.price}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2 h-[400px]">
                            <img 
                                src={getImageUrl(tour.images[0])} 
                                alt={tour.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Content */}
                    <div className="lg:w-2/3">
                        <div 
                            className="prose prose-2xl max-w-none text-gray-900 leading-snug font-black italic border-l-8 border-primary pl-12 py-4 mb-20 drop-shadow-sm"
                            dangerouslySetInnerHTML={{ __html: tour.description }}
                        />

                        {/* Itinerary / Experience Timeline */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <div className="mb-20">
                                <h3 className="text-sm font-black text-secondary uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                                    <div className="w-12 h-[2px] bg-primary" />
                                    The Journey Schedule
                                </h3>
                                
                                <div className="flex flex-col gap-8">
                                    {Array.from(new Set(tour.itinerary.map(s => s.dayNumber))).sort((a, b) => a - b).map(dayNum => {
                                        const daySteps = tour.itinerary.filter(s => s.dayNumber === dayNum).sort((a, b) => a.order - b.order);
                                        const isDayExpanded = expandedDays.includes(dayNum);
                                        
                                        return (
                                            <div key={dayNum} className="relative">
                                                <button 
                                                    onClick={() => toggleDay(dayNum)}
                                                    className="w-full flex items-center justify-between py-6 group/day border-b border-gray-100"
                                                >
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black italic shadow-xl">
                                                            D{dayNum}
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">Day {dayNum}</h4>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{daySteps.length} Scheduled Points</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className={`transform transition-transform duration-300 text-gray-300 ${isDayExpanded ? 'rotate-90 text-primary' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isDayExpanded && (
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-8 pb-12 space-y-4 pl-8 md:pl-20 border-l-2 border-gray-100 ml-8 md:ml-20 mt-4">
                                                                {daySteps.map((step, idx) => {
                                                                    const stepId = `${dayNum}-${idx}`;
                                                                    const isStepExpanded = expandedSteps.includes(stepId);
                                                                    
                                                                    return (
                                                                        <div key={idx} className="relative">
                                                                            <button 
                                                                                onClick={() => toggleStep(stepId)}
                                                                                className="w-full text-left bg-white border border-gray-50 rounded-2xl p-6 hover:shadow-md transition-all group"
                                                                            >
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-4">
                                                                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                                                                                            {step.time || "TBD"}
                                                                                        </span>
                                                                                        <h5 className="text-sm font-black text-gray-900 uppercase italic group-hover:text-primary transition-colors">{step.title}</h5>
                                                                                    </div>
                                                                                    <ChevronRight size={14} className={`text-gray-300 transform transition-transform ${isStepExpanded ? 'rotate-90 text-primary' : ''}`} />
                                                                                </div>

                                                                                <AnimatePresence>
                                                                                    {isStepExpanded && (
                                                                                        <motion.div 
                                                                                            initial={{ opacity: 0, height: 0 }}
                                                                                            animate={{ opacity: 1, height: "auto" }}
                                                                                            exit={{ opacity: 0, height: 0 }}
                                                                                            className="pt-6"
                                                                                        >
                                                                                            <div className="flex flex-col md:flex-row gap-6">
                                                                                                {step.imageUrl && (
                                                                                                    <div className="md:w-32 h-32 shrink-0 rounded-xl overflow-hidden shadow-sm">
                                                                                                        <img src={getImageUrl(step.imageUrl)} alt={step.title} className="w-full h-full object-cover" />
                                                                                                    </div>
                                                                                                )}
                                                                                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.description}</p>
                                                                                            </div>
                                                                                        </motion.div>
                                                                                    )}
                                                                                </AnimatePresence>
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-6 mt-16 pt-12 border-t border-gray-50">
                             <button 
                                onClick={handleToggleLike}
                                className={`px-8 py-4 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest transition-all rounded-xl ${tour.isLikedByCurrentUser ? "bg-primary text-black" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                            >
                                <Heart className={tour.isLikedByCurrentUser ? "fill-black" : ""} size={14} />
                                {tour.isLikedByCurrentUser ? "Liked" : "Like Adventure"}
                            </button>
                        </div>
                    </div>

                    {/* Simple Sidebar */}
                    <aside className="lg:w-1/3 space-y-12">
                        {/* Essential Guide Card */}
                        {tour.guideId && (
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
                                            {tour.guideTotalReviews > 0 ? (
                                                <>
                                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                                                    {tour.guideRating?.toFixed(1)} ({tour.guideTotalReviews} reviews)
                                                </>
                                            ) : (
                                                "New Professional Guide"
                                            )}
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
                        )}

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

            {/* Removed Gallery per request */}
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
