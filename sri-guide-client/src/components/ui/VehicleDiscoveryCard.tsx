"use client";

import React, { useState } from "react";
import { Star, Car, Users, Luggage, Snowflake, Heart, Phone, Info, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";
import ProtectedContact from "@/components/ui/ProtectedContact";
import ReviewModal from "@/features/reviews/components/ReviewModal";

interface VehicleDto {
    id: string;
    vehicleType: string;
    brand: string;
    model: string;
    year: number;
    passengerCapacity: number;
    luggageCapacity: number;
    hasAc: boolean;
    driverIncluded: boolean;
    vehicleImageUrl?: string;
    averageRating: number;
    reviewCount: number;
    likeCount: number;
    isLiked: boolean;
}

interface VehicleDiscoveryCardProps {
    vehicle: VehicleDto;
    providerPhone?: string;
    idx?: number;
}

const VehicleDiscoveryCard: React.FC<VehicleDiscoveryCardProps> = ({ vehicle, providerPhone, idx = 0 }) => {
    const { user } = useAuth();
    const [hasLiked, setHasLiked] = useState(vehicle.isLiked);
    const [likeCount, setLikeCount] = useState(vehicle.likeCount);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const getImageUrl = (url?: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") {
            return null;
        }
        
        if (url.startsWith('http')) return url;
        
        // Normalize slashes (especially for Windows backends)
        const normalizedPath = url.replace(/\\/g, '/');
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        
        return `${baseUrl}${cleanPath}`;
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        if (user.role !== 'Tourist') return;

        try {
            const response = await apiClient.post<boolean>(`/transport/vehicles/${vehicle.id}/like`);
            const isLikedNow = response.data; 
            setHasLiked(isLikedNow);
            setLikeCount(prev => isLikedNow ? prev + 1 : prev - 1);
        } catch (error) {
            console.error("Failed to like vehicle", error);
        }
    };

    // Use provided URL or check for fallbacks in the vehicle object
    const actualImageUrl = vehicle.vehicleImageUrl || (vehicle as any).image || (vehicle as any).imageUrl;
    const resolvedImageUrl = getImageUrl(actualImageUrl);

    const getInitials = (brand: string, model: string) => {
        if (!brand && !model) return "VC";
        const b = brand?.charAt(0).toUpperCase() || "";
        const m = model?.charAt(0).toUpperCase() || "";
        return `${b}${m}` || "VC";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full relative"
        >
            <Link href={`/transport/vehicle/${vehicle.id}`} className="absolute inset-0 z-0" />
            
            {/* Image Section */}
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                {resolvedImageUrl ? (
                    <img 
                        src={resolvedImageUrl} 
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-primary/40">
                        <div className="w-20 h-20 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl font-black tracking-tighter shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            {getInitials(vehicle.brand, vehicle.model)}
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating Badge */}
                <div className="absolute top-6 left-6 flex gap-2 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {vehicle.vehicleType}
                    </span>
                    {vehicle.hasAc && (
                        <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                            <Snowflake size={10} /> A/C
                        </span>
                    )}
                    {vehicle.driverIncluded && (
                        <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                            <Users size={10} /> Driver Included
                        </span>
                    )}
                </div>

                {/* Like Button */}
                <button 
                    onClick={handleLike}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
                        hasLiked ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/90 backdrop-blur-md text-gray-400 hover:text-rose-500 hover:scale-110'
                    }`}
                >
                    <Heart size={16} className={hasLiked ? 'fill-current' : ''} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10 pointer-events-none">
                <div className="flex justify-between items-start mb-3">
                    <div className="pointer-events-auto">
                        <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                            {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">{vehicle.year}</p>
                    </div>
                    {vehicle.averageRating > 0 && (
                        <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100 group-hover:bg-blue-100/50 transition-colors">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={10}
                                        fill={i < Math.floor(vehicle.averageRating) ? "currentColor" : "none"}
                                        className={i < Math.floor(vehicle.averageRating) ? "text-yellow-500" : "text-yellow-200"}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-blue-700 ml-0.5">{vehicle.averageRating.toFixed(1)}</span>
                        </div>
                    )}
                    {(!user || user.role === 'Tourist') && (
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!user) setIsAuthModalOpen(true); else setIsReviewModalOpen(true); }}
                            className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-colors pointer-events-auto"
                            title="Add Review"
                        >
                            <MessageSquare size={16} />
                        </button>
                    )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                            <Users size={12} className="text-primary" />
                        </div>
                        <span className="text-[11px] font-bold">{vehicle.passengerCapacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                            <Luggage size={12} className="text-primary" />
                        </div>
                        <span className="text-[11px] font-bold">{vehicle.luggageCapacity} Bags</span>
                    </div>
                </div>

                {/* Engagement Footer */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                        <span>{likeCount} Likes</span>
                        <span>{vehicle.reviewCount} Reviews</span>
                    </div>
                    {providerPhone && (
                        <div className="pointer-events-auto">
                            <ProtectedContact type="phone" value={providerPhone} />
                        </div>
                    )}
                </div>
            </div>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onSuccess={() => {}} 
            />

            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                targetId={vehicle.id}
                targetType="Vehicle"
                targetName={`${vehicle.brand} ${vehicle.model}`}
                onSuccess={() => {
                    // Manual refresh might be needed or handled by parent
                    window.location.reload(); 
                }}
            />
        </motion.div>
    );
};

export default VehicleDiscoveryCard;
