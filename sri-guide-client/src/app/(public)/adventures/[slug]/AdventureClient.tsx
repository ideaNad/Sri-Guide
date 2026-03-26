"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
    MapPin, Heart, ArrowRight,
    Calendar, ChevronRight, Clock, Tag, Building2,
    X, ChevronLeft, ChevronRight as ChevronRightIcon, Images, ZoomIn, Map, Star, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";
import AuthModal from "@/features/auth/components/AuthModal";
import { useShare } from "@/hooks/useShare";
import { Loader2 } from "lucide-react";
import ReviewModal from "@/features/reviews/components/ReviewModal";

interface Review {
    id: string;
    reviewerName: string;
    reviewerImageUrl?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

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
    slug?: string;
    title: string;
    imageUrl?: string;
    location: string;
}

interface TripDay {
    dayNumber: number;
    description: string;
    imageUrl?: string;
}

interface TripDetail {
    id: string;
    slug?: string;
    title: string;
    description: string;
    location: string;
    category?: string;
    date?: string;
    images: string[];
    guideId?: string;
    guideName?: string;
    guideImageUrl?: string;
    agencyId?: string;
    agencyName?: string;
    agencyImageUrl?: string;
    guideSlug?: string;
    agencySlug?: string;
    guideRating: number;
    guideTotalReviews: number;
    likeCount: number;
    isLikedByCurrentUser: boolean;
    rating: number;
    reviewsCount: number;
    itinerary: ItineraryStep[];
    otherTrips: OtherTrip[];
    duration?: string;
    mapLink?: string;
    price?: number;
    isAgencyTour?: boolean;
    dayDescriptions?: TripDay[];
}

// ─── Lightbox Component ────────────────────────────────────────────────────────
const Lightbox = ({
    images,
    startIndex,
    onClose,
    getImageUrl,
}: {
    images: string[];
    startIndex: number;
    onClose: () => void;
    getImageUrl: (url?: string) => string;
}) => {
    const [current, setCurrent] = useState(startIndex);
    const touchStartX = React.useRef<number | null>(null);

    const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose, prev, next]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
        touchStartX.current = null;
    };

    const thumbH = images.length > 1 ? 80 : 0;
    const topH = 52;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", display: "flex", flexDirection: "column" }}
        >
            {/* ── Top bar (fixed height 52px) ── */}
            <div style={{ height: topH, flexShrink: 0 }} className="flex items-center justify-between px-4 bg-black/70 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Images size={16} className="text-white/50" />
                    <span className="text-white/70 text-sm font-semibold">
                        {current + 1} <span className="text-white/30">/</span> {images.length}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 active:bg-white/25 flex items-center justify-center"
                >
                    <X size={20} className="text-white" />
                </button>
            </div>

            {/* ── Main image area ── */}
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: `calc(100dvh - ${topH + thumbH}px)`,
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                {/* Prev */}
                {images.length > 1 && (
                    <button
                        onClick={prev}
                        style={{ position: "absolute", left: 8, zIndex: 10 }}
                        className="w-9 h-9 rounded-full bg-black/50 active:bg-black/70 flex items-center justify-center border border-white/10"
                    >
                        <ChevronLeft size={18} className="text-white" />
                    </button>
                )}

                <AnimatePresence mode="wait">
                    <motion.img
                        key={current}
                        src={getImageUrl(images[current])}
                        alt={`Image ${current + 1}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.18 }}
                        draggable={false}
                        style={{
                            display: "block",
                            width: "auto",
                            height: "auto",
                            maxWidth: images.length > 1 ? "calc(100% - 88px)" : "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: 12,
                            flexShrink: 0,
                        }}
                    />
                </AnimatePresence>

                {/* Next */}
                {images.length > 1 && (
                    <button
                        onClick={next}
                        style={{ position: "absolute", right: 8, zIndex: 10 }}
                        className="w-9 h-9 rounded-full bg-black/50 active:bg-black/70 flex items-center justify-center border border-white/10"
                    >
                        <ChevronRightIcon size={18} className="text-white" />
                    </button>
                )}
            </div>

            {/* ── Thumbnail strip (fixed height 80px) ── */}
            {images.length > 1 && (
                <div style={{ height: thumbH, flexShrink: 0 }} className="bg-black/70 backdrop-blur-sm flex items-center">
                    <div className="overflow-x-auto py-2 px-4 w-full" style={{ WebkitOverflowScrolling: "touch" }}>
                        <div className="flex gap-2 w-max mx-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${idx === current
                                            ? "border-white opacity-100 scale-105"
                                            : "border-transparent opacity-40 hover:opacity-70"
                                        }`}
                                >
                                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// ─── Image Grid Component ──────────────────────────────────────────────────────
const ImageGrid = ({
    images,
    onOpenLightbox,
    getImageUrl,
}: {
    images: string[];
    onOpenLightbox: (idx: number) => void;
    getImageUrl: (url?: string) => string;
}) => {
    const MAX_VISIBLE = 5;
    const visible = images.slice(0, MAX_VISIBLE);
    const remaining = images.length - MAX_VISIBLE;

    if (images.length === 0) return null;

    // Single image
    if (images.length === 1) {
        return (
            <div
                className="w-full h-[300px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden cursor-pointer group relative"
                onClick={() => onOpenLightbox(0)}
            >
                <img src={getImageUrl(images[0])} alt="Tour" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                        <ZoomIn size={22} className="text-gray-800" />
                    </div>
                </div>
            </div>
        );
    }

    // 2 images
    if (images.length === 2) {
        return (
            <div className="grid grid-cols-2 gap-2 h-[300px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden">
                {visible.slice(0, 2).map((img, idx) => (
                    <div key={idx} className="relative overflow-hidden cursor-pointer group" onClick={() => onOpenLightbox(idx)}>
                        <img src={getImageUrl(img)} alt={`${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </div>
                ))}
            </div>
        );
    }

    // 3+ images — Booking.com style layout
    return (
        <div className="rounded-2xl overflow-hidden">
            {/* Mobile: stacked layout */}
            <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-1.5">
                    <div
                        className="col-span-2 h-56 relative overflow-hidden cursor-pointer group rounded-t-2xl"
                        onClick={() => onOpenLightbox(0)}
                    >
                        <img src={getImageUrl(images[0])} alt="1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                    </div>
                    {visible.slice(1, 5).map((img, idx) => {
                        const isLast = idx === 3 && remaining > 0;
                        return (
                            <div
                                key={idx}
                                className={`h-32 relative overflow-hidden cursor-pointer group ${idx === 2 ? "rounded-bl-2xl" : ""} ${idx === 3 ? "rounded-br-2xl" : ""}`}
                                onClick={() => onOpenLightbox(idx + 1)}
                            >
                                <img src={getImageUrl(img)} alt={`${idx + 2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                                {isLast && remaining > 0 && (
                                    <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1">
                                        <Images size={20} className="text-white" />
                                        <span className="text-white font-bold text-sm">+{remaining} photos</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop: Booking.com style */}
            <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 h-[480px] lg:h-[560px]">
                {/* Hero image — spans 2 cols + 2 rows */}
                <div
                    className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group rounded-l-2xl"
                    onClick={() => onOpenLightbox(0)}
                >
                    <img src={getImageUrl(images[0])} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                </div>

                {/* Top-right images */}
                {[1, 2].map((imgIdx) => (
                    images[imgIdx] ? (
                        <div
                            key={imgIdx}
                            className={`relative overflow-hidden cursor-pointer group ${imgIdx === 2 ? "rounded-tr-2xl" : ""}`}
                            onClick={() => onOpenLightbox(imgIdx)}
                        >
                            <img src={getImageUrl(images[imgIdx])} alt={`${imgIdx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                        </div>
                    ) : <div key={imgIdx} className="bg-gray-100" />
                ))}

                {/* Bottom-right images */}
                {[3, 4].map((imgIdx) => {
                    const isLast = imgIdx === 4 && remaining > 0;
                    return images[imgIdx] ? (
                        <div
                            key={imgIdx}
                            className={`relative overflow-hidden cursor-pointer group ${imgIdx === 3 ? "rounded-bl-none" : "rounded-br-2xl"}`}
                            onClick={() => onOpenLightbox(imgIdx)}
                        >
                            <img src={getImageUrl(images[imgIdx])} alt={`${imgIdx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            {isLast && (
                                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2 rounded-br-2xl">
                                    <Images size={22} className="text-white" />
                                    <span className="text-white font-bold text-base">+{remaining} photos</span>
                                </div>
                            )}
                        </div>
                    ) : <div key={imgIdx} className={`bg-gray-100 ${imgIdx === 4 ? "rounded-br-2xl" : ""}`} />;
                })}
            </div>
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdventureClient({ slug, initialData, type }: { slug: string, initialData?: TripDetail, type?: string | null }) {
    const { user, login } = useAuth();
    const { share } = useShare();
    const [tour, setTour] = useState<TripDetail | null>(() => {
        if (!initialData) return null;
        const data: any = initialData;
        const isTour = type === "tour";
        return {
            ...data,
            id: data.id || data.Id,
            slug: data.slug || data.Slug,
            title: data.title || data.Title,
            description: data.description || data.Description,
            location: data.location || data.Location,
            category: data.category || data.Category,
            price: data.price || data.Price,
            duration: data.duration || data.Duration,
            mapLink: data.mapLink || data.MapLink,
            images: data.images || data.Images || [],
            guideId: data.guideId || data.agencyId || data.AgencyId,
            guideName: data.guideName || data.agencyName || data.AgencyName || "Sri Lankan Agency",
            guideImageUrl: data.guideImageUrl || data.agencyImageUrl || data.AgencyImageUrl,
            guideRating: data.guideRating ?? data.agencyRating ?? data.AgencyRating ?? 0,
            guideTotalReviews: data.guideTotalReviews ?? data.agencyReviewsCount ?? data.AgencyReviewsCount ?? 0,
            isAgencyTour: isTour || !!data.agencyId || !!data.AgencyId,
            guideSlug: data.guideSlug || data.GuideSlug || data.guideId || data.GuideId || null,
            agencySlug: data.agencySlug || data.AgencySlug || data.agencyId || data.AgencyId || null,
            agencyId: data.agencyId || data.AgencyId,
            agencyName: data.agencyName || data.AgencyName,
            agencyImageUrl: data.agencyImageUrl || data.AgencyImageUrl,
            likeCount: data.likeCount || data.LikeCount || 0,
            isLikedByCurrentUser: data.isLikedByCurrentUser || data.IsLikedByCurrentUser || false,
            rating: data.rating || data.Rating || 0,
            reviewsCount: data.reviewsCount || data.ReviewsCount || 0,
            itinerary: (data.itinerary || data.Itinerary || []).map((s: any) => ({
                time: s.time || s.Time,
                title: s.title || s.Title,
                description: s.description || s.Description,
                imageUrl: s.imageUrl || s.ImageUrl,
                dayNumber: s.dayNumber || s.DayNumber,
                order: s.order || s.Order,
            })),
            otherTrips: (data.otherTrips || data.OtherTrips || []).map((t: any) => ({
                id: t.id || t.Id,
                slug: t.slug || t.Slug,
                title: t.title || t.Title,
                imageUrl: t.imageUrl || t.ImageUrl,
                location: t.location || t.Location,
            })),
            dayDescriptions: (data.dayDescriptions || data.DayDescriptions || []).map((d: any) => ({
                dayNumber: d.dayNumber || d.DayNumber,
                description: d.description || d.Description,
                imageUrl: d.imageUrl || d.ImageUrl,
            })),
        } as TripDetail;
    });
    const [loading, setLoading] = useState(!initialData);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [expandedDays, setExpandedDays] = useState<number[]>([1]);
    const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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

    const openLightbox = (idx: number) => {
        setLightboxIndex(idx);
        setLightboxOpen(true);
    };

    const fetchTour = async (force = false) => {
        if (initialData && !force && !tour) return;
        try {
            const isTour = type === "tour";
            let response;
            if (isTour) {
                response = await apiClient.get<any>(`/Tours/${slug}`);
            } else {
                try {
                    response = await apiClient.get<any>(`/trip/${slug}`);
                } catch {
                    response = await apiClient.get<any>(`/Tours/${slug}`);
                }
            }

            const data = response.data;
            const mappedData: TripDetail = {
                ...data,
                id: data.id || data.Id,
                slug: data.slug || data.Slug,
                title: data.title || data.Title,
                description: data.description || data.Description,
                location: data.location || data.Location,
                category: data.category || data.Category,
                price: data.price || data.Price,
                duration: data.duration || data.Duration,
                mapLink: data.mapLink || data.MapLink,
                images: data.images || data.Images || [],
                guideId: data.guideId || data.agencyId || data.AgencyId,
                guideName: data.guideName || data.agencyName || data.AgencyName || "Sri Lankan Agency",
                guideImageUrl: data.guideImageUrl || data.agencyImageUrl || data.AgencyImageUrl,
                guideRating: data.guideRating ?? data.agencyRating ?? data.AgencyRating ?? 4.8,
                guideTotalReviews: data.guideTotalReviews ?? data.agencyReviewsCount ?? data.AgencyReviewsCount ?? 0,
                isAgencyTour: isTour || !!data.agencyId || !!data.AgencyId,
                guideSlug: data.guideSlug || data.GuideSlug || data.guideId || data.GuideId || null,
                agencySlug: data.agencySlug || data.AgencySlug || data.agencyId || data.AgencyId || null,
                agencyId: data.agencyId || data.AgencyId,
                agencyName: data.agencyName || data.AgencyName,
                agencyImageUrl: data.agencyImageUrl || data.AgencyImageUrl,
                likeCount: data.likeCount || data.LikeCount || 0,
                isLikedByCurrentUser: data.isLikedByCurrentUser || data.IsLikedByCurrentUser || false,
                rating: data.rating || data.Rating || 0,
                reviewsCount: data.reviewsCount || data.ReviewsCount || 0,
                itinerary: (data.itinerary || data.Itinerary || []).map((s: any) => ({
                    time: s.time || s.Time,
                    title: s.title || s.Title,
                    description: s.description || s.Description,
                    imageUrl: s.imageUrl || s.ImageUrl,
                    dayNumber: s.dayNumber || s.DayNumber,
                    order: s.order || s.Order,
                })),
                otherTrips: (data.otherTrips || data.OtherTrips || []).map((t: any) => ({
                    id: t.id || t.Id,
                    slug: t.slug || t.Slug,
                    title: t.title || t.Title,
                    imageUrl: t.imageUrl || t.ImageUrl,
                    location: t.location || t.Location,
                })),
                dayDescriptions: (data.dayDescriptions || data.DayDescriptions || []).map((d: any) => ({
                    dayNumber: d.dayNumber || d.DayNumber,
                    description: d.description || d.Description,
                    imageUrl: d.imageUrl || d.ImageUrl,
                })),
            };

            setTour(mappedData);
            if (mappedData.id) {
                fetchReviews(mappedData.id);
            }
        } catch (error) {
            console.error("Failed to fetch adventure detail", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (tripId: string) => {
        setLoadingReviews(true);
        try {
            const targetType = type === "tour" ? "Tour" : "Trip";
            const response = await apiClient.get<Review[]>(`/Review/${targetType}/${tripId}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    // 1. Initial Data load or Tour fetching
    React.useEffect(() => {
        if (slug && !tour) {
            fetchTour();
        }
    }, [slug, tour]);

    // 2. Continuous review fetching when tour ID is available
    React.useEffect(() => {
        if (tour?.id) {
            fetchReviews(tour.id);
        }
    }, [tour?.id, type]);

    const handleToggleLike = async () => {
        if (!user) { setIsAuthModalOpen(true); return; }
        try {
            const endpoint = tour?.isAgencyTour ? 'tours' : 'trip';
            const response = await apiClient.post<{ liked: boolean }>(`/${endpoint}/${tour?.id || slug}/toggle-like`);
            if (tour) {
                setTour({
                    ...tour,
                    isLikedByCurrentUser: response.data.liked,
                    likeCount: response.data.liked ? tour.likeCount + 1 : tour.likeCount - 1,
                });
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const getImageUrl = (url?: string) => {
        if (!url) return "https://images.unsplash.com/photo-1544013919-add52c3dffbd?q=80&w=1200&auto=format";
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        const baseUrl = apiClient.defaults.baseURL?.split("/api")[0];
        return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!tour) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center p-8 border border-gray-100 shadow-2xl rounded-3xl">
                <h2 className="text-3xl font-black text-gray-900 mb-4">Adventure Not Found</h2>
                <Link href="/" className="px-8 py-3 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-primary transition-all">
                    Back to Exploration
                </Link>
            </div>
        </div>
    );

    const categories = tour.category ? tour.category.split(", ").filter(c => c) : [];

    return (
        <>
            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <Lightbox
                        images={tour.images}
                        startIndex={lightboxIndex}
                        onClose={() => setLightboxOpen(false)}
                        getImageUrl={getImageUrl}
                    />
                )}
            </AnimatePresence>

            <div className="pb-32 bg-white overflow-x-hidden pt-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Section 1: Image Grid ── */}
                    {tour.images && tour.images.length > 0 && (
                        <div className="pt-20 sm:pt-24">
                            <ImageGrid
                                images={tour.images}
                                onOpenLightbox={openLightbox}
                                getImageUrl={getImageUrl}
                            />
                            {/* View All Photos button */}
                            {tour.images.length > 1 && (
                                <div className="flex justify-end mt-3">
                                    <button
                                        onClick={() => openLightbox(0)}
                                        className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary border border-gray-200 hover:border-primary/50 px-4 py-2 rounded-full transition-all bg-white shadow-sm"
                                    >
                                        <Images size={14} />
                                        View all {tour.images.length} photos
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Section 2: Title + Meta + Actions ── */}
                    <div className="mt-8 sm:mt-10">
                        {/* Categories */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {categories.map((cat, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title row */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tighter flex-1">
                                {tour.title}
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                                {tour.rating > 0 && (
                                    <div className="flex bg-blue-400/10 text-blue-600 px-3 py-1.5 rounded-2xl items-center gap-1.5 shadow-sm border border-blue-200/50 transform -rotate-1">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={10}
                                                    fill={i < Math.floor(tour.rating) ? "currentColor" : "none"}
                                                    className={i < Math.floor(tour.rating) ? "text-yellow-500" : "text-yellow-500/30"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-black ml-0.5">{tour.rating.toFixed(1)}</span>
                                        <span className="text-[10px] text-blue-600/60 font-bold ml-0.5">({tour.reviewsCount})</span>
                                    </div>
                                )}
                                {/* {tour.guideRating > 0 && (
                                    <div className="flex bg-white text-gray-900 px-3 py-1.5 rounded-2xl items-center gap-1.5 shadow-sm border border-gray-100 transform rotate-1">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-black">{tour.guideRating.toFixed(1)}</span>
                                        <span className="text-[10px] opacity-40 font-bold">({tour.guideTotalReviews})</span>
                                    </div>
                                )} */}
                                {/* Like button moved here for proximity to rating */}
                                <button
                                    onClick={handleToggleLike}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all flex-shrink-0 ${tour.isLikedByCurrentUser
                                        ? "bg-rose-50 text-rose-500 border-rose-200"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-rose-300 hover:text-rose-500"
                                        }`}
                                >
                                    <Heart size={16} className={tour.isLikedByCurrentUser ? "fill-rose-500 text-rose-500" : ""} />
                                    {tour.likeCount > 0 && <span>{tour.likeCount}</span>}
                                </button>

                                <button 
                                    onClick={() => share({
                                        title: tour.title,
                                        text: tour.description,
                                        url: window.location.href
                                    })}
                                    className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                                    title="Share Adventure"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>



                        {/* Meta pills */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
                                <MapPin size={14} className="text-primary" />
                                {tour.location}
                            </div>
                            {tour.duration && (
                                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
                                    <Clock size={14} className="text-primary" />
                                    {tour.duration}
                                </div>
                            )}
                            {tour.date && (
                                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
                                    <Calendar size={14} className="text-primary" />
                                    {new Date(tour.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </div>
                            )}
                            {/* View on Map — always shown, falls back to Google Maps search */}
                            <a
                                href={tour.mapLink || `https://www.google.com/maps/search/${encodeURIComponent(tour.location + ", Sri Lanka")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all"
                            >
                                <Map size={14} />
                                View on Map
                            </a>
                        </div>
                    </div>

                    {/* ── Section 3: Body — Description + Itinerary + Sidebar ── */}
                    <div className="mt-10 flex flex-col lg:flex-row gap-10 xl:gap-16">

                        {/* Left / Main Column */}
                        <div className="flex-1 min-w-0">

                            {/* Price Block — before description */}
                            {tour.price && (
                                <div className="flex items-end gap-2 mb-6 p-5 bg-primary/5 border border-primary/15 rounded-2xl">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-3xl font-black text-gray-900">${tour.price.toLocaleString()}</span>
                                            <span className="text-sm font-semibold text-gray-400">/per person</span>
                                        </div>
                                    </div>
                                    <Tag size={20} className="text-primary mb-1 ml-3" />
                                </div>
                            )}

                            {/* Description — rich text from editor */}
                            <div
                                className="mb-10 border-l-4 border-primary/30 pl-6 richtextbody"
                                dangerouslySetInnerHTML={{ __html: tour.description }}
                            />
                            <style>{`
                                .richtextbody { color: #374151; line-height: 1.75; font-size: 0.95rem; word-break: break-word; overflow-wrap: break-word; }
                                .richtextbody h1,.richtextbody h2,.richtextbody h3,.richtextbody h4 { font-weight: 800; color: #111827; margin: 1.25em 0 0.5em; line-height: 1.3; }
                                .richtextbody h1 { font-size: 1.6rem; } .richtextbody h2 { font-size: 1.3rem; } .richtextbody h3 { font-size: 1.1rem; }
                                .richtextbody p { margin: 0.75em 0; }
                                .richtextbody ul,.richtextbody ol { padding-left: 1.4em; margin: 0.75em 0; }
                                .richtextbody ul { list-style-type: disc; } .richtextbody ol { list-style-type: decimal; }
                                .richtextbody li { margin: 0.3em 0; }
                                .richtextbody strong,.richtextbody b { font-weight: 700; color: #111827; }
                                .richtextbody em,.richtextbody i { font-style: italic; }
                                .richtextbody a { color: var(--color-primary, #059669); text-decoration: underline; }
                                .richtextbody blockquote { border-left: 3px solid #d1fae5; padding-left: 1em; color: #6b7280; font-style: italic; margin: 1em 0; }
                                .richtextbody img { max-width: 100%; border-radius: 8px; margin: 0.75em 0; }
                                .richtextbody table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.85rem; }
                                .richtextbody td,.richtextbody th { border: 1px solid #e5e7eb; padding: 0.5em 0.75em; text-align: left; }
                                .richtextbody th { background: #f9fafb; font-weight: 700; }
                            `}</style>

                            {/* ── Itinerary ── */}
                            {((tour.itinerary && tour.itinerary.length > 0) || (tour.dayDescriptions && tour.dayDescriptions.length > 0)) && (
                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-0.5 bg-primary" />
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.25em]">
                                            {tour.itinerary && tour.itinerary.length > 0 ? "Journey Schedule & Activities" : "Journey Schedule"}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {Array.from(new Set([
                                            ...(tour.itinerary?.map(s => s.dayNumber) || []),
                                            ...(tour.dayDescriptions?.map(d => d.dayNumber) || []),
                                        ])).sort((a, b) => a - b).map(dayNum => {
                                            const daySteps = (tour.itinerary || []).filter(s => s.dayNumber === dayNum).sort((a, b) => a.order - b.order);
                                            const isDayExpanded = expandedDays.includes(dayNum);
                                            const dayDesc = tour.dayDescriptions?.find(d => d.dayNumber === dayNum);

                                            return (
                                                <div key={dayNum} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                                    {/* Day header */}
                                                    <button
                                                        onClick={() => toggleDay(dayNum)}
                                                        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                                                                D{dayNum}
                                                            </div>
                                                            <div className="text-left">
                                                                <h4 className="text-base font-black text-gray-900">Day {dayNum}</h4>
                                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                                                    {daySteps.length > 0 ? `${daySteps.length} activities` : "Overview"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight
                                                            size={18}
                                                            className={`text-gray-400 transform transition-transform duration-300 ${isDayExpanded ? "rotate-90 text-primary" : ""}`}
                                                        />
                                                    </button>

                                                    {/* Day body */}
                                                    <AnimatePresence>
                                                        {isDayExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-5 pb-5 pt-4 space-y-3 bg-white">
                                                                    {/* Day description + optional image */}
                                                                    {dayDesc?.description && (
                                                                        <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                                                                            <p className="text-sm text-gray-600 leading-relaxed flex-1 italic">
                                                                                "{dayDesc.description}"
                                                                            </p>
                                                                            {dayDesc.imageUrl && (
                                                                                <div className="w-full sm:w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                                                                                    <img src={getImageUrl(dayDesc.imageUrl)} alt={`Day ${dayNum}`} className="w-full h-full object-cover" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Steps */}
                                                                    {daySteps.map((step, idx) => {
                                                                        const stepId = `${dayNum}-${idx}`;
                                                                        const isStepExpanded = expandedSteps.includes(stepId);

                                                                        return (
                                                                            <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                                                                                <button
                                                                                    onClick={() => toggleStep(stepId)}
                                                                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                                                                >
                                                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                                        {step.time && (
                                                                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-full flex-shrink-0">
                                                                                                {step.time}
                                                                                            </span>
                                                                                        )}
                                                                                        <h5 className="text-sm font-bold text-gray-800 truncate">{step.title}</h5>
                                                                                    </div>
                                                                                    <ChevronRight
                                                                                        size={14}
                                                                                        className={`text-gray-300 flex-shrink-0 ml-2 transform transition-transform ${isStepExpanded ? "rotate-90 text-primary" : ""}`}
                                                                                    />
                                                                                </button>

                                                                                <AnimatePresence>
                                                                                    {isStepExpanded && (
                                                                                        <motion.div
                                                                                            initial={{ opacity: 0, height: 0 }}
                                                                                            animate={{ opacity: 1, height: "auto" }}
                                                                                            exit={{ opacity: 0, height: 0 }}
                                                                                            transition={{ duration: 0.2 }}
                                                                                            className="overflow-hidden"
                                                                                        >
                                                                                            <div className="px-4 pb-4 pt-1 flex flex-col sm:flex-row gap-4">
                                                                                                {step.imageUrl && (
                                                                                                    <div className="w-full sm:w-28 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                                                                                                        <img src={getImageUrl(step.imageUrl)} alt={step.title} className="w-full h-full object-cover" />
                                                                                                    </div>
                                                                                                )}
                                                                                                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                                                                                            </div>
                                                                                        </motion.div>
                                                                                    )}
                                                                                </AnimatePresence>
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

                            {/* ── Reviews Section ── */}
                            <div className="mt-20">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-0.5 bg-primary" />
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.25em]">Traveler Stories</h3>
                                        </div>
                                        <h4 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter">Shared Experiences</h4>
                                    </div>
                                    {(!user || user.role === "Tourist") && (
                                        <button
                                            onClick={() => {
                                                if (!user) { setIsAuthModalOpen(true); return; }
                                                setIsReviewModalOpen(true);
                                            }}
                                            className="bg-gray-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all rounded-xl"
                                        >
                                            Share My Story
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-8">
                                    {loadingReviews ? (
                                        <div className="flex justify-center py-20">
                                            <Loader2 className="animate-spin text-primary" size={32} />
                                        </div>
                                    ) : reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div key={review.id} className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                                        <img
                                                            src={review.reviewerImageUrl ? getImageUrl(review.reviewerImageUrl) : `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random&color=fff&bold=true`}
                                                            alt={review.reviewerName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <h4 className="font-black text-gray-900 leading-tight">{review.reviewerName}</h4>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                                    {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={10}
                                                                        className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 font-medium leading-relaxed italic text-sm">&ldquo;{review.comment}&rdquo;</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] italic text-gray-400 font-bold tracking-widest border-2 border-dashed border-gray-100">
                                            No travelers have shared their journey yet...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Right Sidebar ── */}
                        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6">
                            {/* Guide / Agency Card */}
                            {(tour.guideId || tour.agencyId) && (
                                <div className="border border-gray-100 rounded-2xl shadow-md overflow-hidden">
                                    <div className="p-6">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                            {tour.isAgencyTour ? "Official Agency" : "Your Guide"}
                                        </p>
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                {tour.guideImageUrl || tour.agencyImageUrl ? (
                                                    <img
                                                        src={getImageUrl(tour.guideImageUrl || tour.agencyImageUrl)}
                                                        alt={tour.guideName || tour.agencyName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Building2 size={24} className="text-gray-300" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 leading-tight mb-1">{tour.guideName || tour.agencyName}</h4>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Verified</span>
                                                    {tour.guideRating > 0 && (
                                                        <div className="flex items-center gap-1 ml-2 text-yellow-500">
                                                            <Star size={10} fill="currentColor" />
                                                            <span className="text-[10px] font-black">{tour.guideRating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/profile/${tour.guideSlug || tour.agencySlug || tour.guideId || tour.agencyId}${tour.isAgencyTour ? "?type=agency" : ""}`}
                                            className="w-full block text-center py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-md active:scale-[0.98]"
                                        >
                                            View Full Profile
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Suggestions / Other Trips */}
                            {tour.otherTrips && tour.otherTrips.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">You might also like</h4>
                                    <div className="space-y-3">
                                        {tour.otherTrips.map(ot => (
                                            <Link
                                                key={ot.id}
                                                href={`/adventures/${ot.slug || ot.id}`}
                                                className="group flex gap-3 p-2 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all"
                                            >
                                                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                                    <img src={getImageUrl(ot.imageUrl)} alt={ot.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                </div>
                                                <div className="flex flex-col justify-center min-w-0">
                                                    <h5 className="text-xs font-bold text-gray-900 truncate mb-1">{ot.title}</h5>
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase">
                                                        <MapPin size={10} />
                                                        {ot.location}
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
                onSuccess={(userData) => {
                    login(userData);
                    setIsAuthModalOpen(false);
                }}
                redirectOnSuccess={false}
            />

            {tour && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    targetId={tour.id}
                    targetType={type === "tour" ? "Tour" : "Trip"}
                    targetName={tour.title}
                    onSuccess={() => {
                        fetchTour(true);
                        if (tour?.id) fetchReviews(tour.id);
                    }}
                />
            )}
        </>
    );
}
