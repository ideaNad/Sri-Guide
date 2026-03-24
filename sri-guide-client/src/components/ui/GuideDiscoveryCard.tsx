"use client";

import React from "react";
import { Star, Languages, ShieldCheck, UserCircle, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import apiClient from "@/services/api-client";

interface DiscoveryItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    location: string;
    rating: number;
    reviews: number;
    type: string;
    isLegit?: boolean;
    verificationStatus?: string;
    tags: string[];
    agencyName?: string;
    slug?: string;
}

interface GuideDiscoveryCardProps {
    guide: DiscoveryItem;
    idx?: number;
}

const GuideDiscoveryCard: React.FC<GuideDiscoveryCardProps> = ({ guide, idx = 0 }) => {
    const getImageUrl = (url?: string) => {
        if (!url || url.trim() === "") return `https://ui-avatars.com/api/?name=${guide.title}&background=F5F4F0&color=2563eb`;
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanPath}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white border border-gray-50/80 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative rounded-3xl h-full flex flex-col"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-28 h-28 overflow-hidden shadow-lg rounded-full border-4 border-white transform transition-all group-hover:scale-105 group-hover:rotate-2">
                    <img
                        src={getImageUrl(guide.image)}
                        alt={guide.title}
                        className="w-full h-full object-cover transition-all duration-500"
                    />
                </div>
                <div className="flex flex-col items-end">
                    {guide.rating > 0 && (
                        <>
                            <div className="flex items-center bg-primary px-3 py-1.5 rounded-full shadow-sm">
                                <Star className="w-3.5 h-3.5 text-highlight fill-highlight mr-1.5" />
                                <span className="text-xs font-bold text-white">{guide.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">{guide.reviews || 0} REVIEWS</span>
                        </>
                    )}
                </div>
            </div>

            <div className="mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-secondary mb-1.5 group-hover:text-primary transition-colors">{guide.title}</h3>
                <p className="text-primary font-medium text-sm">{guide.subtitle || "Local Guide"}</p>
            </div>

            <div className="space-y-3 mb-8 relative z-10 flex-1">
                <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Languages className="w-4 h-4 mr-3 text-secondary/60" />
                    {guide.tags?.join(", ") || "English, Sinhala"}
                </div>
                <div className="flex flex-wrap gap-2 mt-3 mb-1">
                    {guide.type === 'agency' && (
                        <span className="text-blue-600 font-semibold text-xs flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Travel Agency
                        </span>
                    )}
                    {guide.isLegit && guide.verificationStatus !== 'Pending' && (
                        <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Licensed Guide <Star size={10} className="fill-emerald-500 text-emerald-500" />
                        </span>
                    )}
                    {guide.agencyName && (
                        <span className="text-blue-600 font-semibold text-xs flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded">
                            <Building2 className="w-4 h-4 text-blue-500" /> {guide.agencyName}
                        </span>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-50 relative z-10 mt-auto">
                <Link
                    href={`/profile/${guide.slug || guide.id}`}
                    className="w-full flex items-center justify-center py-4 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:shadow-xl hover:shadow-primary/20"
                >
                    <UserCircle className="w-4 h-4 mr-2" />
                    View Profile
                </Link>
            </div>
        </motion.div>
    );
};

export default GuideDiscoveryCard;
