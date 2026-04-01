'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Phone, Car, Users, Luggage,
    Snowflake, Calendar, ArrowLeft, Star,
    Heart, Share2, MessageSquare, CheckCircle2,
    ShieldCheck, Activity, Award, MessageCircle,
    ChevronRight, Shield, Zap, Sparkles,
    Maximize2, ExternalLink
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
    const [isFullscreenImage, setIsFullscreenImage] = useState(false);

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
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mb-4" 
                />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Initializing Showroom...</p>
            </div>
        );
    }

    if (!data) return null;

    const { vehicle, provider, otherVehicles } = data;

    return (
        <div className="min-h-screen bg-white pt-[72px] md:pt-[80px]">
            {/* Animated Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Breadcrumb Action Bar */}
            <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-4 sticky top-[72px] md:top-[80px] z-[40]">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95 text-gray-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="hidden sm:block">
                            <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <Link href="/transport" className="hover:text-blue-600 transition-colors">Transport</Link>
                                <ChevronRight size={10} />
                                <Link href={`/transport?type=${vehicle.vehicleType}`} className="hover:text-blue-600 transition-colors">{vehicle.vehicleType}</Link>
                                <ChevronRight size={10} />
                                <span className="text-blue-600">{vehicle.brand} {vehicle.model}</span>
                            </nav>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLike}
                            className={`p-2.5 rounded-xl border transition-all ${
                                hasLiked ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-gray-200 text-gray-400 hover:text-rose-500'
                            }`}
                        >
                            <Heart size={20} className={hasLiked ? 'fill-current' : ''} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleShare}
                            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 transition-all"
                        >
                            <Share2 size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="pt-10 pb-20 relative z-10">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-10">
                            
                            {/* Premium Gallery Section */}
                            <section className="relative group">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl shadow-gray-200/50"
                                >
                                    {/* Background Blur Layer for smaller images */}
                                    {getImageUrl(vehicle.vehicleImageUrl) && (
                                        <div 
                                            className="absolute inset-0 scale-110 blur-3xl opacity-30"
                                            style={{ 
                                                backgroundImage: `url(${getImageUrl(vehicle.vehicleImageUrl)})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                    )}

                                    {getImageUrl(vehicle.vehicleImageUrl) ? (
                                        <img
                                            src={getImageUrl(vehicle.vehicleImageUrl)!}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/10 relative z-10">
                                            <div className="w-40 h-40 rounded-[3rem] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-7xl font-black tracking-tighter">
                                                {getInitials(vehicle.brand, vehicle.model)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Overlay Info */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30">
                                                {vehicle.vehicleType}
                                            </span>
                                            {vehicle.hasAc && (
                                                <span className="px-5 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 flex items-center gap-2">
                                                    <Snowflake size={14} className="text-blue-400" /> A/C
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-4 group-hover:tracking-tight transition-all duration-700">
                                            {vehicle.brand} <span className="text-blue-500">{vehicle.model}</span>
                                        </h1>
                                    </div>

                                    {/* Action Buttons */}
                                    <button 
                                        onClick={() => setIsFullscreenImage(true)}
                                        className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black z-30"
                                    >
                                        <Maximize2 size={20} />
                                    </button>
                                </motion.div>
                            </section>

                            {/* Key Stats Bar */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { icon: Users, label: 'Capacity', value: `${vehicle.passengerCapacity} Seats`, color: 'blue' },
                                    { icon: Luggage, label: 'Luggage', value: `${vehicle.luggageCapacity} Large Bags`, color: 'emerald' },
                                    { icon: Award, label: 'Service', value: vehicle.driverIncluded ? 'Chauffeur' : 'Self-Drive', color: 'purple' },
                                    { icon: Zap, label: 'Edition', value: `${vehicle.year} Model`, color: 'orange' }
                                ].map((stat, i) => (
                                    <motion.div 
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                                            <stat.icon size={28} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                        <p className="font-black text-gray-900 uppercase italic tracking-tight">{stat.value}</p>
                                    </motion.div>
                                ))}
                            </div>


                            {/* Reviews Section */}
                            <section className="bg-gray-50/50 p-8 md:p-12 rounded-[3.5rem] border border-gray-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Community Rating</p>
                                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Traveler Reviews</h2>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-4xl font-black text-gray-900 leading-none">{vehicle.averageRating.toFixed(1)}</p>
                                            <div className="flex justify-center mt-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={12} className={s <= Math.round(vehicle.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!user) setIsAuthModalOpen(true);
                                                else if (user.role === 'Tourist') setIsReviewModalOpen(true);
                                                else toast.error('Only Tourists can leave reviews');
                                            }}
                                            className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-xl hover:border-blue-600 transition-all active:scale-95"
                                        >
                                            Post Experience
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vehicle.reviews?.length > 0 ? (
                                        vehicle.reviews.map((review: any, i: number) => (
                                            <motion.div 
                                                key={review.id}
                                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                                            >
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-indigo-500/20 shadow-lg shrink-0">
                                                        <img
                                                            src={review.reviewerImageUrl || `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random`}
                                                            alt={review.reviewerName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-xs uppercase tracking-tight">{review.reviewerName}</h4>
                                                        <div className="flex mt-1">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} size={8} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 font-medium text-sm leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                                                <p className="mt-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                                            <MessageCircle size={40} className="text-gray-200 mx-auto mb-4" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial feedback pending</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Premium Sticky Sidebar */}
                        <aside className="lg:col-span-4 h-fit sticky top-32">
                            <motion.div 
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative"
                            >
                                {/* Glassmorphism Background Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16" />
                                
                                <div className="relative z-10">
                                    <div className="flex flex-col items-center text-center mb-10">
                                        <Link href={`/transport/${provider.id}`} className="block relative group">
                                            <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl mb-4 group-hover:scale-110 transition-transform duration-700">
                                                <img
                                                    src={getImageUrl(provider.profileImageUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.businessName)}&background=0066FF&color=fff`}
                                                    alt={provider.businessName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                                                <Activity size={14} />
                                            </div>
                                        </Link>
                                        <h2 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">
                                            {provider.businessName}
                                        </h2>
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            <MapPin size={10} className="text-blue-600" /> {provider.district}, Sri Lanka
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        <div className="p-6 bg-gray-50/80 rounded-3xl border border-gray-100 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                                <Phone size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Contact</p>
                                                <ProtectedContact type="phone" value={provider.phone || ""} />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                                                <p className="text-xs font-black uppercase text-blue-600 italic">Available</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href={user ? `tel:${provider.phone}` : "#"}
                                            onClick={(e) => {
                                                if (!user) {
                                                    e.preventDefault();
                                                    setIsAuthModalOpen(true);
                                                }
                                            }}
                                            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all shadow-xl ${
                                                user 
                                                ? "bg-gray-900 text-white hover:bg-black shadow-gray-900/20" 
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            <Phone size={18} />
                                            Call To Book
                                        </motion.a>

                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href={user ? `https://wa.me/${provider.whatsAppNumber?.replace(/[^0-9]/g, '')}` : "#"}
                                            target={user ? "_blank" : undefined}
                                            rel={user ? "noopener noreferrer" : undefined}
                                            onClick={(e) => {
                                                if (!user) {
                                                    e.preventDefault();
                                                    setIsAuthModalOpen(true);
                                                }
                                            }}
                                            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all shadow-xl ${
                                                user 
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20" 
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.432 2.503 1.157 3.473L6.5 18l2.674-.875c.826.541 1.8.847 2.857.847 3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.767-5.768-5.767zm3.391 8.221c-.142.405-.831.746-1.144.773-.314.027-.643.045-1.011-.051-.233-.059-.519-.145-.91-.312-1.631-.7-2.613-2.316-2.695-2.427-.082-.111-.663-.884-.663-1.685s.43-.881.564-1.04c.134-.159.294-.199.392-.199.1-.001.2-.001.286.002.087.004.204.01.319.266s.443.918.483 1.002c.041.084.068.181.012.301s-.11.231-.191.332c-.082.102-.17.185-.245.281-.082.088-.17.184-.078.337s.484.793 1.037 1.281c.71.626 1.309.82 1.493.911s.31.066.427-.047c.117-.114.503-.541.636-.726s.262-.155.422-.095c.161.06 1.02.476 1.226.579s.344.154.394.24c.05.086.05.45-.141.854zM12.036 3c-4.971 0-9 4.029-9 9 0 1.587.411 3.078 1.134 4.375L3 21l4.733-1.552A8.966 8.966 0 0012.036 21c4.971 0 9-4.029 9-9s-4.029-9-9-9zm0 16.5c-1.463 0-2.836-.395-4.016-1.08l-.288-.168-2.98.977.994-3.255-.184-.303a7.464 7.464 0 01-1.026-3.771c0-4.136 3.364-7.5 7.5-7.5s7.5 3.364 7.5 7.5-3.364 7.5-7.5 7.5z"/>
                                            </svg>
                                            <span>WhatsApp Request</span>
                                        </motion.a>

                                        <Link 
                                            href={`/transport/${provider.id}`}
                                            className="w-full py-5 border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-600 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all"
                                        >
                                            <span>Explore Fleet</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                    
                                    <p className="mt-8 text-center text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                                        Secure Booking via SriGuide
                                    </p>
                                </div>
                            </motion.div>
                        </aside>
                    </div>

                    {/* Discovery Footer (Other Vehicles) */}
                    {otherVehicles?.length > 0 && (
                        <section className="mt-32">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Extended Fleet</p>
                                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Recommended Alternatives</h2>
                                </div>
                                <Link 
                                    href={`/transport/${provider.id}`}
                                    className="p-4 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all group"
                                >
                                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {otherVehicles.slice(0, 4).map((v: any, idx: number) => (
                                    <motion.div 
                                        key={v.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <VehicleDiscoveryCard
                                            vehicle={v}
                                            providerPhone={provider.phone}
                                            idx={idx}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Modals & Overlays */}
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

            {/* Fullscreen Image Overlay */}
            <AnimatePresence>
                {isFullscreenImage && getImageUrl(vehicle.vehicleImageUrl) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFullscreenImage(false)}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-zoom-out"
                    >
                        <motion.img 
                            layoutId="hero-image"
                            src={getImageUrl(vehicle.vehicleImageUrl)!} 
                            alt="Vehicle Fullscreen"
                            className="max-w-full max-h-full object-contain rounded-3xl"
                        />
                        <button className="absolute top-10 right-10 p-4 text-white hover:bg-white/10 rounded-full transition-colors">
                            <Maximize2 size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
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
