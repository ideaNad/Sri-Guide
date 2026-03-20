"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { POPULAR_TOURS, REVIEWS } from "@/data/mock-data";
import {
    Star, MapPin, Clock, Users, ShieldCheck,
    Calendar, Info, ChevronRight, Check, Plus,
    Share2, Heart, MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";

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
}

const TourDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tour, setTour] = useState<TripDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchTour = async () => {
        try {
            const response = await apiClient.get<TripDetail>(`/trip/${id}`);
            setTour(response.data);
        } catch (error) {
            console.error("Failed to fetch tour", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (id) fetchTour();
    }, [id]);

    const handleToggleLike = async () => {
        if (!user) return; // Should ideally show login modal
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
            <div className="text-center">
                <h2 className="text-4xl font-black uppercase italic mb-4">Tour Not Found</h2>
                <Link href="/tours" className="text-primary font-bold hover:underline">Back to Tours</Link>
            </div>
        </div>
    );

    return (
        <div className="pb-24 bg-white">
            {/* Hero Section */}
            <section className="relative h-[70vh] w-full overflow-hidden">
                <img
                    src={tour.images[0]?.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${tour.images[0]}` : tour.images[0] || "https://images.unsplash.com/photo-1544013919-add52c3dffbd?q=80&w=1200&auto=format"}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                <div className="absolute bottom-12 left-0 w-full">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                Adventure
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                Cultural
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 max-w-4xl leading-tight">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/80">
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-primary" />
                                <span className="font-medium">{tour.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-primary" />
                                <span className="font-medium">Selected Duration</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-white">{tour.guideRating.toFixed(1)}</span>
                                <span className="ml-1 text-sm">({tour.guideTotalReviews} Reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-28 right-8 flex space-x-0">
                    <button 
                        onClick={handleToggleLike}
                        className={`w-14 h-14 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${tour.isLikedByCurrentUser ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white hover:text-gray-900"}`}
                    >
                        <Heart className={`w-5 h-5 ${tour.isLikedByCurrentUser ? "fill-white" : ""}`} />
                    </button>
                    <button className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 border-l-0 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <div className="container mx-auto px-4 mt-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Tabs */}
                        <div className="flex space-x-12 border-b border-gray-100 mb-10 overflow-x-auto">
                            {["overview", "itinerary", "reviews"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === "overview" && (
                                <div className="space-y-10">
                                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                                        <p>
                                            Join us for an unforgettable journey to {tour.title}. This experience is designed for those who appreciate the finer details of Sri Lankan culture and heritage.
                                            You will explore the majestic landscapes, interact with local communities, and discover why this is considered one of the pearl of the Indian Ocean&apos;s must-see attractions.
                                        </p>
                                        <p className="mt-4">
                                            Our professional local guides will accompany you, sharing insights and stories that you won&apos;t find in any guidebook.
                                            From early morning views to evening reflections, every moment is crafted to provide a deep connection with the destination.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                                                <Check className="w-5 h-5 mr-3 text-secondary" />
                                                What&apos;s Included
                                            </h4>
                                            <ul className="space-y-4">
                                                {[ "Professional Local Guide", "Private Luxury Transportation", "All Entrance Fees", "Traditional Lunch & Drinks", "High-Quality Photography Service"].map(item => (
                                                    <li key={item} className="flex items-center text-sm text-gray-600">
                                                        <Check className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                                                <Plus className="w-5 h-5 mr-3 text-highlight" />
                                                What&apos;s Excluded
                                            </h4>
                                            <ul className="space-y-4">
                                                {[ "Personal Expenses", "Travel Insurance", "Gratuities (Recommended)", "Extra Snacks"].map(item => (
                                                    <li key={item} className="flex items-center text-sm text-gray-400 font-medium">
                                                        <span className="w-2 h-2 bg-gray-300 mr-4" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "itinerary" && (
                                <div className="space-y-12">
                                    {[
                                        { time: "08:00 AM", title: "Hotel Pick-up", desc: "Our luxury vehicle will pick you up directly from your accommodation in a comfortable, air-conditioned SUV." },
                                        { time: "10:00 AM", title: "Arrival & Sightseeing", desc: "First stop at the main archaeological site. Your guide will provide a deep historical overview while avoiding the crowds." },
                                        { time: "12:30 PM", title: "Authentic Local Lunch", desc: "Enjoy a traditional Sri Lankan rice and curry spread at a hidden garden restaurant known only to locals." },
                                        { time: "03:00 PM", title: "Exploration & Relaxation", desc: "Free time to explore the surroundings, take photos, or relax by the serene water bodies." },
                                        { time: "05:30 PM", title: "Return Journey", desc: "Heading back to the hotel while enjoying the sunset views along the scenic coastal/mountain route." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-8 relative pb-12 last:pb-0">
                                            {i !== 4 && <div className="absolute left-[27px] top-8 bottom-0 w-0.5 bg-gray-100" />}
                                            <div className="flex-shrink-0 w-14 h-14 bg-white border-2 border-gray-900 flex items-center justify-center text-gray-900 font-black text-xs z-10 transition-all hover:bg-gray-900 hover:text-white group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                {i + 1}
                                            </div>
                                            <div className="pt-2">
                                                <span className="text-xs font-black text-secondary tracking-widest uppercase mb-2 block">{item.time}</span>
                                                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                                                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-12">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-gray-900">Traveler Reviews</h3>
                                        <button className="bg-gray-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all">
                                            Write a Review
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        {REVIEWS.map(review => (
                                            <div key={review.id} className="p-10 bg-white border border-gray-100 flex gap-8 shadow-sm hover:shadow-2xl transition-all">
                                                <div className="w-20 h-20 bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-100">
                                                    <img src={`https://i.pravatar.cc/150?u=${review.user}`} alt={review.user} className="grayscale hover:grayscale-0 transition-all" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{review.user}</h4>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{review.country} ΓÇó {review.date}</p>
                                                        </div>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed italic">&quot;{review.text}&quot;</p>
                                                    <div className="mt-4 flex items-center text-primary text-xs font-bold cursor-pointer hover:underline">
                                                        <MessageCircle className="w-4 h-4 mr-2" />
                                                        Reply
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Booking Widget */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-gray-900 p-10 text-white shadow-2xl relative overflow-hidden border border-white/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />

                                <div className="flex items-center justify-between mb-12">
                                    <div>
                                        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Total Likes</span>
                                        <div className="text-4xl font-black">{tour.likeCount} <span className="text-lg text-white/40 font-normal">Likes</span></div>
                                    </div>
                                    <div className="bg-white p-4 border-2 border-primary flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                                        <span className="text-[10px] font-black uppercase text-gray-900 tracking-tighter">Best Deal</span>
                                        <Check className="w-4 h-4 text-primary" />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="bg-white/5 border border-white/10 p-6">
                                        <div className="flex items-center space-x-3 text-white/30 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Select Date</span>
                                        </div>
                                        <p className="font-black text-sm text-white">MARCH 15, 2026</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-6">
                                        <div className="flex items-center space-x-3 text-white/30 mb-2">
                                            <Users className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Travelers</span>
                                        </div>
                                        <p className="font-black text-sm text-white">2 ADULTS, 1 CHILD</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full bg-white text-gray-900 hover:bg-primary hover:text-white py-6 font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center transition-all group">
                                        Book Experience
                                        <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                    <p className="text-center text-xs text-white/30 font-medium italic">No payment required yet</p>
                                </div>

                                <div className="mt-10 pt-10 border-t border-white/10 space-y-4">
                                    <div className="flex items-center text-xs text-white/60">
                                        <ShieldCheck className="w-4 h-4 mr-3 text-secondary" />
                                        <span>Free cancellation up to 48h before</span>
                                    </div>
                                    <div className="flex items-center text-xs text-white/60">
                                        <Info className="w-4 h-4 mr-3 text-highlight" />
                                        <span>No hidden service fees</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guide Profile Promo */}                            <Link href={`/profile/${tour.guideId}`} className="bg-white p-8 border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl transition-all cursor-pointer">
                                <div className="w-24 h-24 overflow-hidden shadow-xl border-4 border-white">
                                    <img 
                                        src={tour.guideImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${tour.guideImageUrl}` : `https://ui-avatars.com/api/?name=${tour.guideName}&background=FFCC00&color=000&bold=true`} 
                                        alt={tour.guideName} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Proposed Guide</p>
                                    <h4 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors tracking-tighter">{tour.guideName}</h4>
                                    <div className="flex items-center text-xs font-bold text-gray-400 mt-2">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                                        {tour.guideRating.toFixed(1)} ({tour.guideTotalReviews} reviews)
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Similar Tours */}
            <section className="mt-32 pt-24 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title="Others also explored"
                        subtitle="Complete your Sri Lankan bucket list with these experiences."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {POPULAR_TOURS.slice(0, 4).map(t => (
                            <Card key={t.id} {...t} type="tour" />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TourDetailPage;
