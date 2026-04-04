'use client';

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Loader2, Filter, TrendingUp, User } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";

interface RestaurantReview {
    id: string;
    userId: string;
    userName: string;
    userProfileImageUrl?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function RestaurantReviewsPage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<RestaurantReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [stats, setStats] = useState({ rating: 0, count: 0 });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // First get the profile to get the restaurant ID
            const { data: profile } = await apiClient.get<any>("/restaurants/my-profile");
            if (profile) {
                setStats({ rating: profile.rating, count: profile.reviewCount });
                const { data: reviewsData } = await apiClient.get<RestaurantReview[]>(`/restaurants/${profile.id}/reviews`);
                setReviews(reviewsData);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const filteredReviews = reviews.filter(rev => {
        if (filter === "all") return true;
        if (filter === "positive") return rev.rating >= 4;
        if (filter === "negative") return rev.rating <= 2;
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 border border-rose-100 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        Traveler Sentiment
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase italic"
                    >
                        Customer <br /> <span className="text-rose-600 underline decoration-gray-900/10">Feedback</span>
                    </motion.h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-w-[160px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 relative z-10">Total Feed</p>
                        <p className="text-4xl font-black text-gray-900 relative z-10">{stats.count}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-w-[160px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 relative z-10">Avg. Rating</p>
                        <div className="flex items-center gap-2 relative z-10">
                            <p className="text-4xl font-black text-gray-900">{stats.rating.toFixed(1)}</p>
                            <Star size={24} className="fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100 max-w-fit">
                {[
                    { id: "all", label: "All Stories" },
                    { id: "positive", label: "Gems (4-5★)" },
                    { id: "negative", label: "Insights (1-2★)" }
                ].map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setFilter(opt.id)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === opt.id 
                            ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/20 active:scale-95" 
                            : "text-gray-500 hover:bg-white hover:text-gray-900"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Reviews Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
                    <p className="text-gray-400 font-bold italic tracking-widest uppercase text-xs animate-pulse">Filtering shared experiences...</p>
                </div>
            ) : filteredReviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                    {filteredReviews.map((review, i) => (
                        <motion.div 
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500"
                        >
                            <div className="flex flex-col md:flex-row gap-10 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-4 border-gray-50 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                            <img 
                                                src={review.userProfileImageUrl || `https://ui-avatars.com/api/?name=${review.userName}&background=random&color=fff&bold=true`} 
                                                alt={review.userName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900 leading-tight uppercase italic tracking-tight">{review.userName}</h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex gap-1">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star 
                                                            key={s} 
                                                            size={14} 
                                                            className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-100"} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <MessageSquare className="absolute -left-8 -top-4 w-12 h-12 text-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-gray-600 font-medium leading-relaxed italic text-xl relative z-10 pr-8">
                                            &ldquo;{review.comment}&rdquo;
                                        </p>
                                    </div>
                                </div>

                                <div className="md:w-72 flex-shrink-0 flex flex-col gap-4">
                                    <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 group-hover:bg-rose-50/30 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sentiment Score</p>
                                            <TrendingUp size={14} className="text-emerald-500" />
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(review.rating / 5) * 100}%` }}
                                                className={`h-full rounded-full ${review.rating >= 4 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                            />
                                        </div>
                                        <p className="text-xs font-bold text-gray-900">
                                            {review.rating >= 4 ? "Exceptional Host" : "Needs Attention"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-gray-200">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <MessageSquare className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">No Traveler Stories Yet</h3>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Your guests haven't shared their experiences yet. Keep providing amazing service to start collecting feedback!
                    </p>
                </div>
            )}
        </div>
    );
}
