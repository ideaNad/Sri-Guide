'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, MapPin, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/services/api-client';
import { useAuth } from '@/providers/AuthContext';
import { useToast } from '@/hooks/useToast';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    coverImage?: string;
    logo?: string;
    description?: string;
    priceRange?: string;
    cuisineTypes: string[];
    rating: number;
    reviewCount: number;
    isLiked?: boolean;
  };
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(restaurant.isLiked || false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to favorite restaurants");
      return;
    }

    setLikeLoading(true);
    try {
      const { data } = await apiClient.post<boolean>(`/restaurants/like/${restaurant.id}`);
      setIsLiked(data); // Returns true if liked, false if unliked
      toast.success(data ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorite");
    } finally {
      setLikeLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url || url.trim() === "") return `https://ui-avatars.com/api/?name=${restaurant.name}&background=F5F4F0&color=2563eb`;
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
      className="group bg-white border border-gray-50/80 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative rounded-3xl h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="w-28 h-28 overflow-hidden shadow-lg rounded-full border-4 border-white transform transition-all group-hover:scale-105 group-hover:rotate-2 bg-gray-50">
          <img
            src={getImageUrl(restaurant.logo)}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center bg-primary px-3 py-1.5 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5 text-sun-gold fill-sun-gold mr-1.5" />
            <span className="text-xs font-bold text-white">{(restaurant.rating || 0).toFixed(1)}</span>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
            {restaurant.priceRange || "$$"}
          </div>
          
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${
              isLiked 
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
            }`}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={likeLoading ? "animate-pulse" : ""} />
          </button>
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <Link href={`/restaurants/${restaurant.slug}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-1.5 group-hover:text-primary transition-colors tracking-tight line-clamp-1 italic uppercase">
            {restaurant.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Now
        </div>
      </div>

      <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 relative z-10 flex-1 leading-relaxed">
        {restaurant.description || "Indulge in a curated culinary journey with exceptional flavors and ambiance."}
      </p>

      {/* Cuisine Types */}
      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        {(restaurant.cuisineTypes || ["International"]).slice(0, 3).map((tag, idx) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-50"
          >
            {tag}
          </span>
        ))}
        {restaurant.cuisineTypes?.length > 3 && (
          <span className="text-[10px] font-black text-gray-300 flex items-center pr-2">
            +{restaurant.cuisineTypes.length - 3} more
          </span>
        )}
      </div>

      {/* Action Bar */}
      <div className="pt-6 border-t border-gray-50 relative z-10 mt-auto">
        <Link 
          href={`/restaurants/${restaurant.slug}`}
          className="w-full flex items-center justify-center py-4 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:shadow-xl hover:shadow-primary/20 group/btn"
        >
          Explore Profile
          <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};
