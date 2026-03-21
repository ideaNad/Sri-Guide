"use client";

import React from "react";
import Image from "next/image";
import { Star, MapPin, Clock, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import apiClient from "@/services/api-client";

interface CardProps {
    title: string;
    image: string;
    location?: string;
    price?: number;
    rating?: number;
    reviews?: number;
    duration?: string;
    tags?: string[];
    type?: "tour" | "adventure" | "guide" | "place" | "restaurant" | "vehicle" | "agency";
    subtitle?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    id?: string | number;
    isLegit?: boolean;
    badge?: string;
    likeCount?: number;
    isLiked?: boolean;
    mapLink?: string;
    onToggleLike?: (id: string) => void;
}

import ProtectedContact from "./ProtectedContact";

const Card: React.FC<CardProps> = ({
    title,
    image,
    location,
    price,
    rating,
    reviews,
    duration,
    tags,
    type = "tour",
    subtitle,
    phone,
    email,
    whatsapp,
    id,
    isLegit,
    badge,
    likeCount,
    isLiked,
    mapLink,
    onToggleLike
}) => {
    const isProfile = type === "guide" || type === "agency";
    const profileLink = (type === "tour" || type === "adventure") ? `/adventures/${id}` : (id ? `/profile/${id}` : "#");

    const displayImage = image?.startsWith("/") && !image?.startsWith("http") 
        ? `${apiClient.defaults.baseURL?.replace('/api', '')}${image}` 
        : image;

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full">
            {(isProfile || type === "tour" || type === "adventure") && id && (
                <Link href={profileLink} className="absolute inset-0 z-10" />
            )}
            
            {/* Legit Badge */}
            {type === "guide" && isLegit && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-20 text-xs font-bold">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Verified</span>
                </div>
            )}

            {badge && (
                <div className="absolute top-4 right-4 bg-primary/95 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-20 text-[10px] font-black uppercase tracking-widest">
                    {badge}
                </div>
            )}

            {/* Image Container */}
            <div className="relative h-56 w-full overflow-hidden">
                <img
                    src={displayImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {price && (
                    <div className="absolute top-0 left-0 bg-primary/95 backdrop-blur-sm px-4 py-2 rounded-br-2xl text-sm font-bold text-white shadow-sm">
                        ${price} <span className="text-xs font-medium opacity-90">/p.p</span>
                    </div>
                )}
                {type === "guide" && (
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 flex items-center shadow-sm">
                        <Star className="w-3 h-3 text-highlight mr-1.5 fill-highlight" />
                        {rating}
                    </div>
                )}
                {onToggleLike && id && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleLike(id.toString());
                        }}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm z-30 ${isLiked ? 'bg-rose-500 text-white' : 'bg-white/90 text-gray-400 hover:text-rose-500'}`}
                    >
                        <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                {tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] font-bold text-secondary bg-gray-50 px-2.5 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-2 leading-snug">
                    {title}
                </h3>

                {subtitle && <p className="text-sm font-medium text-gray-500 mb-3 truncate">{subtitle}</p>}

                <div className="space-y-2">
                    {location && (
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1 text-primary opacity-70" />
                            <span className="truncate">{location}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 mt-auto">
                        {duration && (
                            <div className="flex items-center text-sm font-medium text-gray-500">
                                <Clock className="w-4 h-4 mr-1.5 text-primary/70" />
                                {duration}
                            </div>
                        )}

                        {rating && rating > 0 && type !== "guide" && (
                            <div className="flex items-center text-sm font-bold text-gray-900">
                                <Star className="w-4 h-4 text-highlight mr-1.5 fill-highlight" />
                                {rating.toFixed(1)} <span className="font-medium text-gray-400 ml-1">({reviews})</span>
                            </div>
                        )}

                         {likeCount !== undefined && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                                <Heart size={10} fill="currentColor" />
                                {likeCount}
                            </div>
                        )}
                    </div>

                    {mapLink && (
                        <div className="pt-2">
                            <a 
                                href={mapLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-700 transition-colors bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 relative z-20"
                            >
                                <MapPin size={10} />
                                View on Map
                            </a>
                        </div>
                    )}
                </div>

                {(type === "guide" || type === "agency") && (phone || email) && (
                    <div className="mt-5 pt-5 border-t border-gray-50 space-y-2.5 relative z-20">
                        {phone && <ProtectedContact type="phone" value={phone} />}
                        {email && <ProtectedContact type="email" value={email} />}
                    </div>
                )}
                
                {isProfile && (
                    <div className="mt-6 pt-5 border-t border-gray-50">
                        <div className="flex items-center text-sm font-bold text-primary group-hover:gap-3 gap-2 transition-all">
                            <span>View Full Profile</span>
                            <ArrowRight size={16} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
