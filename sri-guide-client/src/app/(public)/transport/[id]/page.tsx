'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Phone, Car, Users, Luggage,
    Snowflake, Calendar, ArrowLeft, MessageCircle, Star,
    ShieldCheck, Activity, Award, CheckCircle2, ChevronRight,
    MessageSquare, Share2, Sparkles, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/services/api-client';
import Link from 'next/link';
import VehicleDiscoveryCard from '@/components/ui/VehicleDiscoveryCard';
import ProtectedContact from '@/components/ui/ProtectedContact';
import { useAuth } from '@/providers/AuthContext';
import { useToast } from '@/hooks/useToast';
import AuthModal from '@/features/auth/components/AuthModal';
import ReviewModal from '@/features/reviews/components/ReviewModal';

export default function TransportProfilePublicView() {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const [provider, setProvider] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await apiClient.get<any>(`/transport/profile/${id}`);
                setProvider(response.data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
                toast.error('Provider not found');
                router.push('/transport');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProvider();
    }, [id]);

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: `${provider?.businessName} on SriGuide Transport`,
                url: url
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mb-4" 
                />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Profile...</p>
            </div>
        );
    }

    if (!provider) return null;

    const transport = provider;

    const getImageUrl = (url?: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(transport?.businessName)}&background=0066FF&color=fff&size=512`;
        }
        if (url.startsWith('http')) return url;
        const normalizedPath = url.replace(/\\/g, '/');
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        return `${baseUrl}${cleanPath}`;
    };

    const totalReviews = transport.vehicles?.reduce((acc: number, v: any) => acc + (v.reviewCount || 0), 0) || 0;
    const avgRating = transport.vehicles?.length > 0
        ? transport.vehicles.reduce((acc: number, v: any) => acc + (v.averageRating || 0), 0) / transport.vehicles.length
        : 5.0;

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar Padding & Breadcrumb */}
            <div className="pt-[72px] md:pt-[80px]">
                <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-4 sticky top-[72px] md:top-[80px] z-[40]">
                    <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95 text-gray-500"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <nav className="hidden sm:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <Link href="/transport" className="hover:text-blue-600 transition-colors">Transport</Link>
                                <ChevronRight size={10} />
                                <span className="text-blue-600">{transport?.businessName}</span>
                            </nav>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleShare}
                                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 transition-all shadow-sm"
                            >
                                <Share2 size={20} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-20 relative z-10">
                {/* Hero Section */}
                <section className="relative h-[30vh] md:h-[40vh] overflow-hidden bg-gray-900 group">
                    <img 
                        src={getImageUrl(transport.profileImageUrl)} 
                        alt="Provider Cover" 
                        className="w-full h-full object-cover opacity-50 blur-xl scale-110 transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-12">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-4 md:border-[6px] border-white shadow-2xl relative z-20 transition-transform duration-700 hover:scale-105"
                        >
                            <img
                                src={getImageUrl(transport.profileImageUrl)}
                                alt={transport.businessName}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-[1600px] mx-auto px-6 mt-10">
                    <div className="flex flex-col items-center text-center mb-16 px-4">
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                                Transport Provider
                            </span>
                            {transport.isAvailable && (
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Now
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 italic uppercase tracking-tighter leading-none mb-6">
                            {transport.businessName}
                        </h1>
                        <div className="flex items-center gap-2 px-6 py-2 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <MapPin size={14} className="text-blue-600" />
                            {transport.district}, Sri Lanka
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-12">
                            <section className="bg-gray-50/50 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -mr-32 -mt-32" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Award className="text-blue-600" size={24} />
                                        <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight">Provider Mission</h2>
                                    </div>
                                    <div className="text-gray-600 font-medium leading-relaxed text-lg italic md:text-xl">
                                        {(() => {
                                            const desc = transport.description || "Committed to delivering safe, reliable, and premium transport experiences across the beautiful landscapes of Sri Lanka.";
                                            const isLong = desc.length > 300;
                                            const displayDesc = !isLong || isDescriptionExpanded 
                                                ? desc 
                                                : desc.substring(0, 300) + "...";

                                            return (
                                                <>
                                                    &ldquo;{displayDesc}&rdquo;
                                                    {isLong && (
                                                        <button 
                                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                                            className="block text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest mt-4 transition-all not-italic"
                                                        >
                                                            {isDescriptionExpanded ? 'Read Less Mission' : 'Read Full Mission'}
                                                        </button>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </section>

                            {/* Fleet Section */}
                            <section className="space-y-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Inventory</p>
                                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Official Fleet</h2>
                                    </div>
                                    <div className="px-5 py-2 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Car size={14} />
                                        <span>{transport.vehicles?.length || 0} Units</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {transport.vehicles?.map((v: any, idx: number) => (
                                        <VehicleDiscoveryCard
                                            key={v.id}
                                            vehicle={v}
                                            providerPhone={transport.phone}
                                            idx={idx}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* Aggregated Reviews Section */}
                            <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Fleet Feedback</p>
                                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Traveler Experiences</h2>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-4xl font-black text-gray-900 leading-none">{avgRating.toFixed(1)}</p>
                                            <div className="flex justify-center mt-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={12} className={s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {transport.vehicles?.flatMap((v: any) => (v.reviews || []).map((r: any) => ({ ...r, vehicleName: `${v.brand} ${v.model}` }))).length > 0 ? (
                                        transport.vehicles.flatMap((v: any) => (v.reviews || []).map((review: any, i: number) => (
                                            <motion.div 
                                                key={review.id}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                                            >
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shrink-0">
                                                        <img
                                                            src={review.reviewerImageUrl || `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random`}
                                                            alt={review.reviewerName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-xs uppercase tracking-tight">{review.reviewerName}</h4>
                                                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Trip in {v.brand} {v.model}</p>
                                                        <div className="flex mt-1">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} size={8} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 font-medium text-sm leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                                            </motion.div>
                                        )))
                                    ) : (
                                        <div className="col-span-full text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                                            <MessageCircle size={40} className="text-gray-200 mx-auto mb-4" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting First Review</p>
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
                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                                
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8 italic">Booking Console</h3>
                                    
                                    <div className="space-y-4 mb-10 text-left">
                                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                                                <Phone size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Line</p>
                                                <ProtectedContact type="phone" value={transport.phone || ""} />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Provider Status</p>
                                                <p className="text-xs font-black uppercase text-blue-600 italic">Available</p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 shrink-0">
                                                <Users size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Identity</p>
                                                <p className="text-xs font-black uppercase text-gray-900 italic">Verified Owner</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href={user ? `tel:${transport.phone}` : "#"}
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
                                            href={user ? `https://wa.me/${transport.whatsAppNumber?.replace(/[^0-9]/g, '')}` : "#"}
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
                                            <span>WhatsApp Chat</span>
                                        </motion.a>
                                    </div>
                                    
                                    <p className="mt-8 text-center text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                                        Secure Inquiries via SriGuide
                                    </p>
                                </div>
                            </motion.div>
                        </aside>
                    </div>
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
                targetId={transport.id}
                targetType="Transport"
                targetName={transport.businessName}
                onSuccess={() => {
                    toast.success('Thank you for your review!');
                    window.location.reload();
                }}
            />
        </div>
    );
}
