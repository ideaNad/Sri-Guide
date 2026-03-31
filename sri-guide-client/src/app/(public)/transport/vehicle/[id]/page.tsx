'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Phone, Car, Users, Luggage,
    Snowflake, Calendar, ArrowLeft, Star,
    Heart, Share2, MessageSquare, CheckCircle2,
    ShieldCheck, Activity, Award, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/services/api-client';
import { useAuth } from '@/providers/AuthContext';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';
import VehicleDiscoveryCard from '@/components/ui/VehicleDiscoveryCard';
import ProtectedContact from '@/components/ui/ProtectedContact';
import ReviewModal from '@/features/reviews/components/ReviewModal';
import AuthModal from '@/features/auth/components/AuthModal';

interface VehicleDetailResponse {
    vehicle: any;
    provider: any;
    otherVehicles: any[];
}

export default function VehicleDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await apiClient.get<VehicleDetailResponse>(`/transport/vehicles/${id}`);
                setData(response.data);
                setHasLiked(response.data.vehicle.hasLiked);
                setLikeCount(response.data.vehicle.likeCount);
            } catch (error) {
                console.error('Failed to fetch vehicle detail', error);
                toast.error('Vehicle not found');
                router.push('/transport');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        if (user.role !== 'Tourist') return;

        try {
            const response = await apiClient.post<boolean>(`/transport/vehicles/${id}/like`);
            const isLikedNow = response.data;
            setHasLiked(isLikedNow);
            setLikeCount(prev => isLikedNow ? prev + 1 : prev - 1);
            toast.success(isLikedNow ? 'Added to favorites' : 'Removed from favorites');
        } catch (error) {
            toast.error('Failed to update like');
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: `${data?.vehicle.brand} ${data?.vehicle.model} on SriGuide`,
                url: url
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    const getImageUrl = (url?: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") {
            return null;
        }
        if (url.startsWith('http')) return url;
        const normalizedPath = url.replace(/\\/g, '/');
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        return `${baseUrl}${cleanPath}`;
    };

    const getInitials = (brand: string, model: string) => {
        if (!brand && !model) return "VC";
        const b = brand?.charAt(0).toUpperCase() || "";
        const m = model?.charAt(0).toUpperCase() || "";
        return `${b}${m}` || "VC";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Vehicle Profile...</p>
            </div>
        );
    }

    if (!data) return null;

    const { vehicle, provider, otherVehicles } = data;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">

            <div className="pt-24 px-6 relative">
                {/* Back button and floating actions for mobile/desktop */}
                <div className="max-w-[1600px] mx-auto mb-8 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 hover:text-gray-900 transition-all active:scale-95 flex items-center gap-2 group shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Back to Fleet</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLike}
                            className={`p-3 rounded-2xl border transition-all active:scale-95 flex items-center gap-2 shadow-sm ${hasLiked
                                ? 'bg-rose-50 border-rose-200 text-rose-500'
                                : 'bg-white border-gray-200 text-gray-400 hover:text-rose-500'
                                }`}
                        >
                            <Heart size={20} className={hasLiked ? 'fill-current text-rose-500' : ''} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
                                {likeCount > 0 ? `${likeCount} Likes` : 'Like'}
                            </span>
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-blue-600 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                        >
                            <Share2 size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Share</span>
                        </button>
                    </div>
                </div>
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Vehicle Hero */}
                            <section className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/20 group">
                                <div className="aspect-[21/9] relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                                    {getImageUrl(vehicle.vehicleImageUrl) ? (
                                        <img
                                            src={getImageUrl(vehicle.vehicleImageUrl)!}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-white/10">
                                            <div className="w-40 h-40 rounded-[3rem] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-7xl font-black tracking-tighter shadow-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-1000">
                                                {getInitials(vehicle.brand, vehicle.model)}
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute bottom-10 left-10 text-white">
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/30">
                                                {vehicle.vehicleType}
                                            </span>
                                            {vehicle.hasAc && (
                                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30 flex items-center gap-1.5">
                                                    <Snowflake size={12} /> Full A/C
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
                                            {vehicle.brand} <span className="text-blue-500">{vehicle.model}</span>
                                        </h1>
                                        <div className="flex items-center gap-4 text-white/60 font-black uppercase tracking-widest text-xs">
                                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-400" /> {vehicle.year} Model</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                            {vehicle.driverIncluded ? (
                                                <span className="text-purple-400">Driver Included</span>
                                            ) : (
                                                <span className="text-orange-400">Vehicle Only</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                        <Users size={24} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Capacity</p>
                                    <p className="font-black text-gray-900">{vehicle.passengerCapacity} Seats</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                        <Luggage size={24} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Storage</p>
                                    <p className="font-black text-gray-900">{vehicle.luggageCapacity} Large Bags</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                                        <Award size={24} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Experience</p>
                                    <p className="font-black text-gray-900">{vehicle.driverIncluded ? 'Chauffeur' : 'Self-Drive'}</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                        <Snowflake size={24} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Climate</p>
                                    <p className="font-black text-gray-900">{vehicle.hasAc ? 'Premium A/C' : 'Natural Air'}</p>
                                </div>
                            </div>

                            {/* Verification Banner */}
                            {/* <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                <div className="relative z-10 flex items-center gap-8">
                                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center border border-white/20 shrink-0 backdrop-blur-md">
                                        <ShieldCheck size={40} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tight leading-none mb-2">SriGuide Verified</h3>
                                        <p className="text-white/70 text-sm font-medium">This vehicle and provider have been manually verified by our team for safety, quality, and reliability.</p>
                                    </div>
                                </div>
                            </div> */}

                            {/* Reviews Section */}
                            <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Guest Experiences</p>
                                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Traveler Feedback</h2>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-black text-gray-900">{vehicle.averageRating.toFixed(1)}</span>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= Math.round(vehicle.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!user) setIsAuthModalOpen(true);
                                                else if (user.role === 'Tourist') setIsReviewModalOpen(true);
                                                else toast.error('Only Tourists can leave reviews');
                                            }}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                        >
                                            Write Review
                                        </button>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Based on {vehicle.reviewCount} reviews</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {vehicle.reviews?.length > 0 ? (
                                        vehicle.reviews.map((review: any) => (
                                            <div key={review.id} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                                <div className="flex items-start gap-5">
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white shrink-0">
                                                        <img
                                                            src={review.reviewerImageUrl || `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random`}
                                                            alt={review.reviewerName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div>
                                                                <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{review.reviewerName}</h4>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Traveler · {new Date(review.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="flex bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={10}
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
                                        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                            <MessageSquare size={48} className="text-gray-200 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic outline-none">No reviews for this vehicle yet.</p>
                                            <button
                                                onClick={() => {
                                                    if (!user) setIsAuthModalOpen(true);
                                                    else if (user.role === 'Tourist') setIsReviewModalOpen(true);
                                                    else toast.error('Only Tourists can leave reviews');
                                                }}
                                                className="mt-6 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                            >
                                                Be the first to review
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-8">
                            {/* Provider Card */}
                            <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden sticky top-32">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />

                                <div className="relative z-10 flex flex-col items-center text-center mb-10">
                                    <Link href={`/transport/${provider.id}`} className="block relative group">
                                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-xl mb-4 group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={getImageUrl(provider.profileImageUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.businessName)}&background=random&color=fff`}
                                                alt={provider.businessName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center border-4 border-gray-900">
                                            <Activity size={12} />
                                        </div>
                                    </Link>
                                    <h2 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                                        {provider.businessName}
                                    </h2>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 justify-center">
                                        <MapPin size={10} /> {provider.district}, {provider.province}
                                    </p>
                                </div>

                                <div className="space-y-6 mb-10 relative z-10 border-y border-white/5 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                                            <Phone size={20} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Direct Booking</p>
                                            <ProtectedContact type="phone" value={provider.phone || ""} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                                            <p className="font-black uppercase tracking-widest italic text-xs text-emerald-400">Available Today</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {provider.phone && (
                                        <a
                                            href={`tel:${provider.phone}`}
                                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                        >
                                            <Phone size={20} />
                                            <span>Call Now</span>
                                        </a>
                                    )}
                                    {provider.whatsAppNumber && (
                                        <a
                                            href={`https://wa.me/${provider.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                                        >
                                            <MessageCircle size={20} />
                                            <span>WhatsApp</span>
                                        </a>
                                    )}
                                    <Link
                                        href={`/transport/${provider.id}`}
                                        className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        <span>View Full Fleet</span>
                                    </Link>
                                </div>
                                <p className="text-center text-white/20 text-[10px] font-black uppercase tracking-widest mt-8 relative z-10 italic">
                                    Powered by SriGuide Transport Network
                                </p>
                            </div>
                        </aside>
                    </div>

                    {/* Other Vehicles by Provider */}
                    {otherVehicles?.length > 0 && (
                        <section className="mt-20">
                            <div className="flex items-center justify-between mb-10 px-4">
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Fleet Options</p>
                                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">More from this Provider</h2>
                                </div>
                                <Link
                                    href={`/transport/${provider.id}`}
                                    className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors group"
                                >
                                    <span>View All</span>
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {otherVehicles.slice(0, 4).map((v: any, idx: number) => (
                                    <VehicleDiscoveryCard
                                        key={v.id}
                                        vehicle={v}
                                        providerPhone={provider.phone}
                                        idx={idx}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => { }}
            />

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                targetId={vehicle.id}
                targetType="Vehicle"
                targetName={`${vehicle.brand} ${vehicle.model}`}
                onSuccess={() => {
                    toast.success('Thank you for your review!');
                    window.location.reload();
                }}
            />
        </div>
    );
}

function ArrowRight({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    )
}
