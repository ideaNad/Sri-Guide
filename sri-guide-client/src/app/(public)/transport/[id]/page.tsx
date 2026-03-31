'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Phone, Car, Users, Luggage,
    Snowflake, Calendar, ArrowLeft, MessageCircle, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    const router = useRouter();

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await apiClient.get(`/transport/profile/${id}`);
                setProvider(response.data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProvider();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-black uppercase tracking-tight">Profile Not Found</h1>
                <Link href="/transport" className="mt-4 text-blue-600 font-bold hover:underline">Back to Search</Link>
            </div>
        );
    }

    const transport = provider;

    const getImageUrl = (url?: string) => {
        if (!url || url.trim() === "") return `https://ui-avatars.com/api/?name=${transport?.businessName}&background=random`;
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanPath}`;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Hero */}
            <section className="bg-gray-900 text-white pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-center">
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shrink-0">
                        <img
                            src={getImageUrl(transport?.profileImageUrl)}
                            alt={transport?.businessName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-600/30">
                                Transport Provider
                            </span>
                            {transport?.isAvailable && (
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                                    Available Now
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                            {transport?.businessName}
                        </h1>
                        <p className="flex items-center gap-2 text-gray-400 font-bold mt-4 uppercase tracking-widest text-sm">
                            <MapPin size={18} className="text-blue-500" />
                            {transport?.district}, {transport?.province}
                        </p>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">About this Provider</h2>
                        <p className="text-gray-600 font-medium leading-relaxed text-lg">
                            {transport?.description || "A reliable transport provider in Sri Lanka offering high-quality transfer services."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Our Fleet</h2>
                            <div className="flex items-center gap-1 bg-primary px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <Car size={12} />
                                <span>{transport?.vehicles?.length || 0} Vehicles</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {transport?.vehicles?.map((v: any, idx: number) => (
                                <VehicleDiscoveryCard
                                    key={v.id}
                                    vehicle={v}
                                    providerPhone={transport.phone}
                                    idx={idx}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">What Travelers Say</h2>
                            {/* <button 
                                onClick={() => {
                                    if (!user) setIsAuthModalOpen(true);
                                    else if (user.role === 'Tourist') setIsReviewModalOpen(true);
                                    else toast.error('Only Tourists can leave reviews');
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                            >
                                Write Review
                            </button> */}
                        </div>

                        <div className="space-y-8">
                            {transport?.vehicles?.flatMap((v: any) => v.reviews || []).length > 0 ? (
                                transport.vehicles.flatMap((v: any) => (v.reviews || []).map((review: any) => (
                                    <div key={review.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                                <img
                                                    src={review.reviewerImageUrl || `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random`}
                                                    alt={review.reviewerName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{review.reviewerName}</h4>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reviewed {v.brand} {v.model}</p>
                                                    </div>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                size={10}
                                                                className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm font-medium italic leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                                            </div>
                                        </div>
                                    </div>
                                )))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 italic text-gray-400 font-bold text-sm">
                                    No reviews yet. Be the first to share your trip!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Contact) */}
                <aside>
                    <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 sticky top-32">
                        <h2 className="text-xl font-black mb-8 uppercase tracking-tight">Booking Info</h2>
                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Contact Number</p>
                                    <div className="mt-1">
                                        <ProtectedContact type="phone" value={transport?.phone || ""} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {transport?.phone && (
                            <a
                                href={`tel:${transport.phone}`}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                                <Phone size={20} />
                                <span>Call Provider</span>
                            </a>
                        )}

                        {transport?.whatsAppNumber && (
                            <a
                                href={`https://wa.me/${transport.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-5 mt-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                            >
                                <MessageCircle size={20} />
                                <span>WhatsApp</span>
                            </a>
                        )}

                        <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-widest mt-6">
                            Mention SriGuide for priority service
                        </p>
                    </div>
                </aside>
            </main>

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
