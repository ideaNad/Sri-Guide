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
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full">
            {isProfile && id && (
                <Link href={profileLink} className="absolute inset-0 z-10" />
            )}
            
            {/* Legit Badge */}
            {type === "guide" && isLegit && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-20 text-xs font-bold">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Verified</span>
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

                        {rating && type !== "guide" && (
                            <div className="flex items-center text-sm font-bold text-gray-900">
                                <Star className="w-4 h-4 text-yellow-400 mr-1.5 fill-yellow-400" />
                                {rating} <span className="font-medium text-gray-400 ml-1">({reviews})</span>
                            </div>
                        )}
                    </div>
                </div>

                {(type === "guide" || type === "agency") && (phone || email || whatsapp) && (
                    <div className="mt-5 pt-5 border-t border-gray-50 space-y-2.5 relative z-20">
                        {phone && <ProtectedContact type="phone" value={phone} />}
                        {email && <ProtectedContact type="email" value={email} />}
                        {whatsapp && <ProtectedContact type="whatsapp" value={whatsapp} />}
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
