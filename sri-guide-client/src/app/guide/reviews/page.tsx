"use client";

import React, { useEffect, useState } from "react";
import { Star, MessageCircle, Clock, MapPin, User, Quote } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";

interface ReviewDto {
    id: string;
    reviewerName: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    targetType: "Guide" | "Trip";
    tripTitle: string | null;
}

export default function GuideReviewsPage() {
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"All" | "Guide" | "Trip">("All");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get<ReviewDto[]>("/review/guide-reviews");
                setReviews(response.data);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const filteredReviews = reviews.filter(r => filter === "All" || r.targetType === filter);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : "0.0";

    const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: reviews.length > 0 
            ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) 
            : 0
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                        Tourist <span className="text-primary">Reviews</span>
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">See what your guests are saying about your tours.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 text-center">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-white/70">
                                Overall Rating
                            </h3>
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-6xl font-black italic tracking-tighter">{averageRating}</span>
                                <Star size={48} className="text-primary fill-primary drop-shadow-[0_0_15px_rgba(255,204,0,0.5)]" />
                            </div>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                Based on {reviews.length} total reviews
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                            Rating Breakdown
                        </h3>
                        <div className="space-y-4">
                            {ratingCounts.map(rc => (
                                <div key={rc.star} className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 w-12 shrink-0">
                                        <span className="font-black text-sm text-gray-900">{rc.star}</span>
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${rc.percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-yellow-400 rounded-full"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 w-8 text-right">
                                        {rc.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl w-fit">
                        {["All", "Guide", "Trip"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filter === f 
                                        ? "bg-white text-gray-900 shadow-sm" 
                                        : "text-gray-400 hover:text-gray-900"
                                }`}
                            >
                                {f === "All" ? "All Reviews" : f === "Guide" ? "Profile Reviews" : "Trip Reviews"}
                            </button>
                        ))}
                    </div>

                    {filteredReviews.length === 0 ? (
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                <MessageCircle size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">No Reviews Found</h3>
                            <p className="text-sm text-gray-400 font-medium">
                                You don't have any reviews matching this filter yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews.map((review, i) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                                                {review.reviewerName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900">{review.reviewerName}</h4>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                    <Clock size={10} />
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                    
                                                    {review.targetType === "Trip" && review.tripTitle && (
                                                        <>
                                                            <span className="mx-1">•</span>
                                                            <MapPin size={10} className="text-primary" />
                                                            <span className="text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                                                                {review.tripTitle.length > 25 ? review.tripTitle.substring(0,25) + "..." : review.tripTitle}
                                                            </span>
                                                        </>
                                                    )}
                                                    {review.targetType === "Guide" && (
                                                        <>
                                                            <span className="mx-1">•</span>
                                                            <User size={10} className="text-emerald-500" />
                                                            <span className="text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-full">
                                                                Profile Rating
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100/50">
                                            <span className="font-black text-sm text-yellow-700">{review.rating}</span>
                                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </div>
                                    
                                    {review.comment && (
                                        <div className="mt-4 bg-gray-50/50 p-4 rounded-2xl relative group">
                                            <Quote size={24} className="absolute top-2 left-2 text-gray-200/50 -z-10 group-hover:text-primary/10 transition-colors" />
                                            <p className="text-gray-600 text-sm leading-relaxed font-medium pl-2">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
