"use client";

import React from "react";
import Image from "next/image";
import { Star, MapPin, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";

interface CardProps {
    title: string;
    image: string;
    location?: string;
    price?: number;
    rating?: number;
    reviews?: number;
    duration?: string;
    tags?: string[];
    type?: "tour" | "guide" | "place" | "restaurant" | "vehicle" | "agency";
    subtitle?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    id?: string | number;
    isLegit?: boolean;
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
    isLegit
}) => {
    const isProfile = type === "guide" || type === "agency";
    const profileLink = id ? `/profile/${id}` : "#";

    const displayImage = image?.startsWith("/") && !image?.startsWith("http") 
        ? `${apiClient.defaults.baseURL?.replace('/api', '')}${image}` 
        : image;

    return (
        <div className="group bg-white rounded-none overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative">
            {isProfile && id && (
                <Link href={profileLink} className="absolute inset-0 z-10" />
            )}
            
            {/* Legit Badge */}
            {type === "guide" && isLegit && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-20 scale-75 origin-top-right">
                    <ShieldCheck size={14} className="fill-emerald-500 text-white" />
                    <span className="font-black text-[8px] uppercase tracking-widest italic tracking-wider">LEGIT</span>
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
                    <div className="absolute top-0 left-0 bg-primary px-4 py-2 text-sm font-black text-white">
                        ${price} <span className="text-[10px] font-normal opacity-80 uppercase tracking-widest">/ p.p</span>
                    </div>
                )}
                {type === "guide" && (
                    <div className="absolute bottom-0 left-0 bg-gray-900 px-4 py-2 text-xs font-black text-white flex items-center">
                        <Star className="w-3 h-3 text-highlight mr-2 fill-highlight" />
                        {rating}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {tags && (
                    <div className="flex gap-2 mb-4">
                        {tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[9px] uppercase tracking-[2px] font-black text-gray-400 border border-gray-100 px-2 py-0.5">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                    {title}
                </h3>

                {subtitle && <p className="text-sm text-gray-500 mb-2 truncate">{subtitle}</p>}

                <div className="space-y-2">
                    {location && (
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1 text-primary opacity-70" />
                            <span className="truncate">{location}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        {duration && (
                            <div className="flex items-center text-xs text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {duration}
                            </div>
                        )}

                        {rating && type !== "guide" && (
                            <div className="flex items-center text-xs font-bold text-gray-700">
                                <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                                {rating} <span className="font-normal text-gray-400 ml-1">({reviews})</span>
                            </div>
                        )}
                    </div>
                </div>

                {(type === "guide" || type === "agency") && (phone || email || whatsapp) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 relative z-20">
                        {phone && <ProtectedContact type="phone" value={phone} />}
                        {email && <ProtectedContact type="email" value={email} />}
                        {whatsapp && <ProtectedContact type="whatsapp" value={whatsapp} />}
                    </div>
                )}
                
                {isProfile && (
                    <div className="mt-6">
                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                            <span>View Full Profile</span>
                            <ArrowRight size={14} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
