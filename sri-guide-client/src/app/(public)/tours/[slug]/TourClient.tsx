"use client";

import React, { useState } from "react";
import {
    MapPin, Clock, Users, ShieldCheck,
    Calendar, Info, ChevronRight, Check, Plus,
    Share2, Heart, MessageCircle, Loader2, Star
} from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReviewModal from "@/features/reviews/components/ReviewModal";
import AuthModal from "@/features/auth/components/AuthModal";

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
 
interface TripDetail {
    id: string;
    slug?: string;
    title: string;
    description: string;
    location: string;
    date?: string;
    images: string[];
    guideId: string;
    guideName: string;
    guideImageUrl?: string;
    guideSlug?: string;
    guideRating: number;
    guideTotalReviews: number;
    likeCount: number;
    rating: number;
    reviewsCount: number;
    isLikedByCurrentUser: boolean;
    itinerary?: ItineraryStep[];
}

export default function TourClient({ slug, initialData }: { slug: string, initialData?: TripDetail }) {
    const { user, login } = useAuth();
    const [tour, setTour] = useState<TripDetail | null>(() => {
        if (!initialData) return null;
        const data: any = initialData;
        return {
            ...data,
            images: data.images || [],
            guideId: data.guideId || data.agencyId || "",
            guideName: data.guideName || data.agencyName || "Sri Lankan Agency",
            guideImageUrl: data.guideImageUrl || data.agencyImageUrl,
            guideSlug: data.guideSlug || data.agencySlug || data.slug || data.Slug,
            guideRating: data.guideRating || 0,
            guideTotalReviews: data.guideTotalReviews || 0,
            itinerary: data.itinerary || []
        } as TripDetail;
    });
    const [loading, setLoading] = useState(!initialData);
    const [activeTab, setActiveTab] = useState("overview");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const fetchTour = async () => {
        if (loading && !initialData) return;
        try {
            const response = await apiClient.get<any>(`/Tours/${slug}`);
            const data = response.data;
            const mappedData: TripDetail = {
                ...data,
                images: data.images || [],
                guideId: data.guideId || data.agencyId,
                guideName: data.guideName || data.agencyName || "Sri Lankan Agency",
                guideImageUrl: data.guideImageUrl || data.agencyImageUrl,
                guideSlug: data.guideSlug || data.agencySlug || data.slug || data.Slug,
                guideRating: data.guideRating || 0,
                guideTotalReviews: data.guideTotalReviews || 0,
                rating: data.rating || 0,
                reviewsCount: data.reviewsCount || 0,
                itinerary: data.itinerary || []
            };
            setTour(mappedData);
            
            // Fetch reviews
            if (mappedData.id) {
                fetchReviews(mappedData.id);
            }
        } catch (error) {
            console.error("Failed to fetch tour", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (tourId: string) => {
        setLoadingReviews(true);
        try {
            const response = await apiClient.get<Review[]>(`/Review/Tour/${tourId}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    React.useEffect(() => {
        if (slug) fetchTour();
    }, [slug, initialData]);

    const handleToggleLike = async () => {
        if (!user) return;
        try {
            const response = await apiClient.post<{ liked: boolean }>(`/trip/${tour?.id || slug}/toggle-like`);
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
        <div className="pb-32 bg-white pt-12">
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
                            {tour.rating > 0 && (
                                <div className="flex bg-yellow-400 px-3 py-1 rounded-full items-center gap-1.5 border border-yellow-300 shadow-lg scale-110 ml-2">
                                    <Star size={12} className="fill-white text-white" />
                                    <span className="text-xs font-black text-white">{tour.rating.toFixed(1)}</span>
                                    <span className="text-[10px] text-white/80 font-bold">({tour.reviewsCount})</span>
                                </div>
                            )}
                            {tour.guideRating > 0 && (
                                <div className="flex bg-white/10 backdrop-blur-md px-3 py-1 rounded-full items-center gap-1.5 border border-white/20">
                                    <Star size={12} className="fill-highlight text-highlight" />
                                    <span className="text-xs font-bold">{tour.guideRating.toFixed(1)}</span>
                                    <span className="text-[10px] text-white/70">({tour.guideTotalReviews})</span>
                                </div>
                            )}
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
                                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                                        <p>{tour.description}</p>
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
                                <div className="space-y-16">
                                    {tour.itinerary && tour.itinerary.length > 0 ? (
                                        Array.from(new Set(tour.itinerary.map(s => s.dayNumber))).sort((a, b) => a - b).map(dayNum => {
                                            const daySteps = tour.itinerary!.filter(s => s.dayNumber === dayNum).sort((a, b) => a.order - b.order);
                                            return (
                                                <div key={dayNum} className="space-y-10 group/day">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center font-black italic shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] group-hover/day:shadow-primary/20 transition-all">
                                                            D{dayNum}
                                                        </div>
                                                        <h4 className="text-2xl font-black text-gray-900 italic uppercase">Day {dayNum} Schedule</h4>
                                                    </div>
                                                    
                                                    <div className="space-y-8 pl-8 md:pl-20 border-l border-gray-100 ml-8 md:ml-8">
                                                        {daySteps.map((item, i) => (
                                                            <div key={i} className="flex gap-8 relative pb-12 last:pb-0">
                                                                <div className="absolute -left-[33px] top-4 w-4 h-4 bg-white border-4 border-gray-900 rounded-full z-10" />
                                                                <div className="pt-2 flex-1">
                                                                    <div className="flex flex-col md:flex-row gap-8">
                                                                        <div className="flex-1">
                                                                            <span className="text-xs font-black text-secondary tracking-widest uppercase mb-2 block">{item.time || "TBD"}</span>
                                                                            <h5 className="text-xl font-bold text-gray-900 mb-3 italic uppercase tracking-tight">{item.title}</h5>
                                                                            <p className="text-gray-500 leading-relaxed font-medium">{item.description}</p>
                                                                        </div>
                                                                        {item.imageUrl && (
                                                                            <div className="w-full md:w-56 h-36 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                                                                                <img 
                                                                                    src={item.imageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${item.imageUrl}` : item.imageUrl}
                                                                                    alt={item.title}
                                                                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                                                                    onError={(e) => {
                                                                                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1544013919-add52c3dffbd?q=80&w=400&auto=format";
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-24 bg-gray-50 rounded-[3rem] italic text-gray-400 font-bold tracking-widest border-2 border-dashed border-gray-100">
                                            The itinerary for this journey is being whispered by the wind...
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-12">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-gray-900">Traveler Reviews</h3>
                                        <button 
                                            onClick={() => {
                                                if (!user) { setIsAuthModalOpen(true); return; }
                                                if (user.role !== 'Tourist') {
                                                    alert("Only Tourists can write reviews.");
                                                    return;
                                                }
                                                setIsReviewModalOpen(true);
                                            }}
                                            className="bg-gray-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all"
                                        >
                                            Write a Review
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-10">
                                        {loadingReviews ? (
                                            <div className="flex justify-center py-20">
                                                <Loader2 className="animate-spin text-primary" size={32} />
                                            </div>
                                        ) : reviews.length > 0 ? (
                                            reviews.map((review) => (
                                                <div key={review.id} className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl">
                                                    <div className="flex items-start gap-6">
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                                            <img 
                                                                src={review.reviewerImageUrl || `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random&color=fff&bold=true`} 
                                                                alt={review.reviewerName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div>
                                                                    <h4 className="font-black text-gray-900 leading-tight">{review.reviewerName}</h4>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                                        {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })}
                                                                    </p>
                                                                </div>
                                                                <div className="flex gap-0.5">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star 
                                                                            key={star} 
                                                                            size={12} 
                                                                            className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600 font-medium leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-24 bg-gray-50 rounded-[3rem] italic text-gray-400 font-bold tracking-widest border-2 border-dashed border-gray-100">
                                                Be the first to share your legendary journey...
                                            </div>
                                        )}
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
                                </div>
                                <div className="space-y-4 pt-10 border-t border-white/10">
                                    <div className="flex items-center text-xs text-white/60">
                                        <ShieldCheck className="w-4 h-4 mr-3 text-secondary" />
                                        <span>Official Agency Verified Experience</span>
                                    </div>
                                    <div className="flex items-center text-xs text-white/60">
                                        <Info className="w-4 h-4 mr-3 text-highlight" />
                                        <span>Direct communication with Expert</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guide Profile Promo */}
                            <Link href={`/profile/${tour.guideSlug || tour.guideId}`} className="bg-white p-8 border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl transition-all cursor-pointer">
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
                                    {tour.guideRating > 0 && (
                                        <div className="flex items-center gap-1 mt-1 text-highlight">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-xs font-bold text-gray-700">{tour.guideRating.toFixed(1)}</span>
                                            <span className="text-[10px] text-gray-400 font-medium lowercase">({tour.guideTotalReviews} reviews)</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
            
            {tour && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    targetId={tour.id}
                    targetType="Tour"
                    targetName={tour.title}
                    onSuccess={() => {
                        fetchTour(); // Refresh tour data to get new rating
                        if (tour.id) fetchReviews(tour.id);
                    }}
                />
            )}
            <AuthModal 
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={(userData) => { login(userData); setIsAuthModalOpen(false); }}
            />
        </div>
    );
}
