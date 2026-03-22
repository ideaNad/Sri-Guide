"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
    Star, MapPin, Heart, ArrowRight,
    Calendar, ChevronRight, Clock, Tag, Building2,
    X, ChevronLeft, ChevronRight as ChevronRightIcon, Images, ZoomIn, Map
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

interface TripDay {
    dayNumber: number;
    description: string;
    imageUrl?: string;
}

interface TripDetail {
    id: string;
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
                                    className={`w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                        idx === current
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
const AdventureSimplePage = () => {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    const { user, login } = useAuth();
    const [tour, setTour] = useState<TripDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [expandedDays, setExpandedDays] = useState<number[]>([1]);
    const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

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

    const fetchTour = async () => {
        try {
            const isTour = type === "tour";
            let response;
            if (isTour) {
                response = await apiClient.get<any>(`/Tours/${id}`);
            } else {
                try {
                    response = await apiClient.get<any>(`/trip/${id}`);
                } catch {
                    response = await apiClient.get<any>(`/Tours/${id}`);
                }
            }

            const data = response.data;
            const mappedData: TripDetail = {
                ...data,
                id: data.id || data.Id,
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
                agencyId: data.agencyId || data.AgencyId,
                agencyName: data.agencyName || data.AgencyName,
                agencyImageUrl: data.agencyImageUrl || data.AgencyImageUrl,
                likeCount: data.likeCount || data.LikeCount || 0,
                isLikedByCurrentUser: data.isLikedByCurrentUser || data.IsLikedByCurrentUser || false,
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
        } catch (error) {
            console.error("Failed to fetch adventure detail", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (id) fetchTour();
    }, [id]);

    const handleToggleLike = async () => {
        if (!user) { setIsAuthModalOpen(true); return; }
        try {
            const response = await apiClient.post<{ liked: boolean }>(`/trip/${id}/toggle-like`);
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

            <div className="pb-24 bg-white overflow-x-hidden">
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
                            {/* Like button */}
                            <button
                                onClick={handleToggleLike}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all flex-shrink-0 ${tour.isLikedByCurrentUser
                                    ? "bg-rose-50 text-rose-500 border-rose-200"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-rose-300 hover:text-rose-500"
                                    }`}
                            >
                                <Heart size={16} className={tour.isLikedByCurrentUser ? "fill-rose-500 text-rose-500" : ""} />
                                <span>{tour.likeCount}</span>
                            </button>
                        </div>

                        {/* Rating — right under title */}
                        {tour.guideRating > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={15} className={s <= Math.round(tour.guideRating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-amber-600">{tour.guideRating.toFixed(1)}</span>
                                {tour.guideTotalReviews > 0 && (
                                    <span className="text-sm text-gray-400">· {tour.guideTotalReviews} reviews</span>
                                )}
                            </div>
                        )}

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
                                                <h4 className="text-lg font-black text-gray-900 leading-tight">
                                                    {tour.guideName || tour.agencyName}
                                                </h4>
                                                <div className="flex items-center text-xs font-medium text-gray-400 mt-1">
                                                    {tour.guideTotalReviews > 0 ? (
                                                        <>
                                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                                                            {tour.guideRating?.toFixed(1)} · {tour.guideTotalReviews} reviews
                                                        </>
                                                    ) : (
                                                        "New Professional Guide"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={tour.isAgencyTour ? `/profile/${tour.agencyId}?type=agency` : `/profile/${tour.guideId}`}
                                            className="w-full bg-gray-900 text-white flex items-center justify-center py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all gap-2"
                                        >
                                            View Full Profile <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* More from this Guide */}
                            {tour.otherTrips && tour.otherTrips.length > 0 && (
                                <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-gray-50">
                                        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">More Adventures</h3>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {tour.otherTrips.map(trip => (
                                            <Link
                                                key={trip.id}
                                                href={`/adventures/${trip.id}`}
                                                className="flex gap-3 p-4 hover:bg-gray-50 transition-all group"
                                            >
                                                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                                    <img
                                                        src={getImageUrl(trip.imageUrl)}
                                                        alt={trip.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-wider mb-1">{trip.location}</p>
                                                    <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                        {trip.title}
                                                    </h4>
                                                    <div className="mt-1.5 flex items-center text-[10px] font-bold text-gray-400 group-hover:text-primary transition-colors">
                                                        View <ArrowRight size={10} className="ml-1" />
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
