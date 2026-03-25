'use client';

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Calendar, Eye, Search, Filter, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";

interface EventReview {
    id: string;
    eventId: string;
    eventTitle: string;
    userFullName: string;
    userProfileImageUrl?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function MyReviewsPage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<EventReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get<EventReview[]>("/events/my-reviews");
            setReviews(data);
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

    const averageRating = reviews.length > 0 
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
        : 0;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-widest mb-4"
                    >
                        Community Feedback
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tighter"
                    >
                        My <span className="text-orange-600">Reviews</span>
                    </motion.h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-3xl font-black text-slate-900">{reviews.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Rating</p>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-black text-slate-900">{averageRating.toFixed(1)}</p>
                            <Star size={20} className="fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                {[
                    { id: "all", label: "All Reviews" },
                    { id: "positive", label: "Positive (4-5★)" },
                    { id: "negative", label: "Needs Work (1-2★)" }
                ].map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setFilter(opt.id)}
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                            filter === opt.id 
                            ? "bg-gray-900 text-white shadow-xl shadow-gray-900/10" 
                            : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Reviews Grid/List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                    <p className="text-slate-400 font-bold italic tracking-widest uppercase text-xs">Loading traveler stories...</p>
                </div>
            ) : filteredReviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filteredReviews.map((review, i) => (
                        <motion.div 
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Reviewer & Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm">
                                            <img 
                                                src={review.userProfileImageUrl || `https://ui-avatars.com/api/?name=${review.userFullName}&background=random&color=fff&bold=true`} 
                                                alt={review.userFullName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 leading-tight">{review.userFullName}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <div className="flex gap-0.5">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star 
                                                            key={s} 
                                                            size={12} 
                                                            className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-100"} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed italic text-lg mb-0">&ldquo;{review.comment}&rdquo;</p>
                                </div>

                                {/* Event Context & Actions */}
                                <div className="md:w-64 flex-shrink-0 flex flex-col gap-4">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Event</p>
                                        <h5 className="text-sm font-black text-slate-900 line-clamp-2 leading-snug mb-3">{review.eventTitle}</h5>
                                        <Link 
                                            href={`/events/${review.eventId}`}
                                            className="inline-flex items-center gap-2 text-xs font-black text-orange-600 hover:text-orange-700 transition-colors"
                                        >
                                            <Eye size={14} />
                                            View Event
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Reviews Yet</h3>
                    <p className="text-slate-500 font-medium italic">Shared experiences from your attendees will appear here.</p>
                </div>
            )}
        </div>
    );
}
