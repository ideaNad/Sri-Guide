"use client";

import React, { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    targetType: string;
    targetName: string;
    onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, targetId, targetType, targetName, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await apiClient.post("/Review", {
                targetId,
                targetType,
                rating,
                comment,
                userId: "00000000-0000-0000-0000-000000000000" // Backend will override this with current user ID
            });
            onSuccess();
            onClose();
            setComment("");
            setRating(5);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>

                    <div className="p-8 md:p-12">
                        <div className="text-center mb-10">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block">Share Your Experience</span>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter">Review {targetName}</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Star Rating */}
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your Rating</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="transition-all hover:scale-110 active:scale-95"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <Star
                                                size={40}
                                                className={`transition-colors ${
                                                    (hover || rating) >= star 
                                                    ? "fill-yellow-400 text-yellow-400" 
                                                    : "text-gray-200"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs font-black text-yellow-500 uppercase italic">
                                    {rating === 5 ? "Incredible!" : rating === 4 ? "Great Experience" : rating === 3 ? "It was okay" : rating === 2 ? "Could be better" : "Poor Experience"}
                                </p>
                            </div>

                            {/* Comment */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Your Review</label>
                                <textarea
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the highlights, the guide, and your overall journey..."
                                    className="w-full h-40 bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 text-gray-900 placeholder:text-gray-300 focus:border-primary focus:bg-white transition-all outline-none resize-none font-medium"
                                />
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-rose-500 text-center bg-rose-50 p-4 rounded-2xl border border-rose-100 animat-shake">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Submit Review</span>
                                        <Star size={18} className="group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
