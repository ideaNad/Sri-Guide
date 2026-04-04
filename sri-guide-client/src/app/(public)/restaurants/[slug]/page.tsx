"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";
import { Calendar, CheckCircle2, Clock, MapPin, Phone, Star, Utensils, Heart, Share2, Info, ArrowLeft, ExternalLink, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube, MoreHorizontal, ChevronDown } from "lucide-react";
import ProtectedContact from "@/components/ui/ProtectedContact";
import { useAuth } from "@/providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function RestaurantDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");
  const [isLiked, setIsLiked] = useState(false);
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await apiClient.get<any>(`/restaurants/${slug}`);
        setRestaurant(data);
        if (data.menus && data.menus.length > 0) {
            setExpandedMenuId(data.menus[0].id);
        }
      } catch (error) {
        toast.error("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchRestaurant();
  }, [slug, toast]);

  const handleLike = async () => {
    if (!user) {
        toast.error("Please login to like this restaurant");
        return;
    }
    try {
        const { data } = await apiClient.post<boolean>(`/restaurants/like/${restaurant.id}`);
        setIsLiked(data);
        toast.success(data ? "Added to favorites!" : "Removed from favorites");
    } catch {
        toast.error("Action failed");
    }
  }

  const getImageUrl = (url?: string, type: 'cover' | 'logo' | 'item' = 'cover') => {
    if (!url || url.trim() === "") {
        if (type === 'cover') return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200";
        if (type === 'logo') return `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant?.name || 'R')}&background=2563eb&color=fff&size=128&bold=true`;
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
    }
    if (url.startsWith('http')) return url;
    const baseUrl = apiClient.defaults.baseURL?.split('/api')[0] || 'http://localhost:5070';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath.replace(/\\/g, '/')}`;
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Curating culinary excellence...</p>
    </div>
  );
  
  if (!restaurant) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Utensils size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">CULINARY DESTINATION NOT FOUND</h2>
        <p className="text-slate-500 mb-6">The restaurant profile you are looking for does not exist or has been relocated.</p>
        <Link href="/restaurants" className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            Browse Restaurants
        </Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-jakarta overflow-x-hidden">
      
      {/* Premium Hero Section with Dual Identity */}
      <section className="relative h-[70vh] md:h-[75vh] w-full">
        {/* Cover Photo */}
        <motion.img 
          initial={{ scale: 1.1, filter: 'blur(10px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5 }}
          src={getImageUrl(restaurant.coverImage, 'cover')} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-30">
            <Link href="/restaurants" className="w-12 h-12 glass-dark rounded-2xl flex items-center justify-center text-white hover:bg-primary transition-all shadow-2xl">
                <ArrowLeft size={20} />
            </Link>
            <div className="flex gap-3">
                <button className="w-12 h-12 glass-dark rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all shadow-2xl">
                    <Share2 size={20} />
                </button>
                <button 
                  onClick={handleLike} 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-2xl ${isLiked ? 'bg-primary text-white' : 'glass-dark text-white hover:bg-primary'}`}
                >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
            </div>
        </div>

        {/* Identity & Core Info */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-10">
            
            {/* Overlapping Logo - Increased negative margin for better overlap without clipping */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative -mb-10 md:-mb-28 z-40"
            >
                <div className="w-32 h-32 md:w-56 md:h-56 glass rounded-[2.5rem] p-3 shadow-2xl relative">
                    <img 
                        src={getImageUrl(restaurant.logo, 'logo')} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover rounded-[2rem] shadow-inner font-black bg-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-highlight w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                        <CheckCircle2 size={16} className="text-white" />
                    </div>
                </div>
            </motion.div>

            <div className="text-center md:text-left flex-1 pb-4">
              <div className="flex gap-2 mb-4 justify-center md:justify-start flex-wrap">
                <div className="flex items-center bg-highlight px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-3.5 h-3.5 text-white fill-white mr-1.5" />
                    <span className="text-xs font-black text-white">{(restaurant.rating || 0).toFixed(1)}</span>
                </div>
                {restaurant.cuisineTypes?.slice(0, 3).map((c: string) => (
                  <span key={c} className="px-4 py-1.5 glass-dark rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-white/10">{c}</span>
                ))}
              </div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-7xl font-black text-white mb-4 italic uppercase tracking-tighter"
              >
                  {restaurant.name}
              </motion.h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/70 font-bold text-sm tracking-wide">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> {restaurant.district || "Discovery Destination"}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> Open until {restaurant.closingTime || 'Closing Time'}</span>
                <span className="px-2 py-0.5 border border-white/20 rounded bg-white/5 text-[10px] font-black uppercase">{restaurant.priceRange || '$$'} Choice</span>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-3 pb-8">
                <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-[0.2em] bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Verified Active
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-40 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          
          <div className="lg:col-span-8 space-y-16">
            
            {/* About / Description */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 italic">Chef's Narrative</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    {restaurant.description || `Welcome to ${restaurant.name}. We are dedicated to providing an exceptional culinary experience with the finest ingredients and a passion for hospitality. Visit us to explore our unique flavors and warm atmosphere.`}
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                    {restaurant.facilities?.map((feat: string) => (
                        <div key={feat} className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
                            <CheckCircle2 size={12} /> {feat}
                        </div>
                    ))}
                </div>
            </section>

            {/* Performance Tabs (Menus / Events) */}
            <section className="space-y-8">
                <div className="flex gap-4 border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('menu')}
                        className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'menu' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Master Menus
                        {activeTab === 'menu' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(37,99,235,0.3)]" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('events')}
                        className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'events' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Grand Events
                        {activeTab === 'events' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(37,99,235,0.3)]" />}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'menu' && (
                        <motion.div 
                            key="menu"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            {restaurant.menus?.length > 0 ? (
                                restaurant.menus.map((menu: any) => {
                                    const isExpanded = expandedMenuId === menu.id;
                                    return (
                                        <div key={menu.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-md">
                                            {/* Accordion Header */}
                                            <button 
                                                onClick={() => setExpandedMenuId(isExpanded ? null : menu.id)}
                                                className={`w-full flex items-center justify-between p-8 text-left transition-all ${isExpanded ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex flex-col">
                                                    <h3 className={`text-2xl font-black italic uppercase tracking-tight transition-colors ${isExpanded ? 'text-primary' : 'text-slate-900'}`}>
                                                        {menu.name}
                                                    </h3>
                                                    {menu.description && (
                                                        <p className="text-slate-500 font-medium text-xs mt-1 italic">{menu.description}</p>
                                                    )}
                                                </div>
                                                <motion.div 
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExpanded ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400'}`}
                                                >
                                                    <ChevronDown size={20} />
                                                </motion.div>
                                            </button>
                                            
                                            {/* Expanding Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                    >
                                                        <div className="p-8 pt-0">
                                                            <div className="h-px bg-slate-100 mb-8" />
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {menu.items?.map((item: any) => (
                                                                    <div key={item.id} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex gap-5 overflow-hidden">
                                                                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-md flex-shrink-0 relative">
                                                                            <img 
                                                                                src={getImageUrl(item.image, 'item')} 
                                                                                className="w-full h-full object-cover transition-all group-hover:scale-110 bg-slate-50" 
                                                                                alt={item.name} 
                                                                            />
                                                                            {item.isFeatured && (
                                                                                <div className="absolute top-2 left-2 bg-highlight text-white p-1 rounded-lg">
                                                                                    <Star size={12} fill="currentColor" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 flex flex-col justify-between">
                                                                            <div>
                                                                                <div className="flex justify-between items-start mb-1">
                                                                                    <h4 className="font-black text-slate-900 uppercase italic tracking-tight">{item.name}</h4>
                                                                                </div>
                                                                                {item.description && <p className="text-xs text-slate-500 font-medium line-clamp-2 italic">{item.description}</p>}
                                                                            </div>
                                                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                                                <span className="font-black text-sm text-primary uppercase tracking-tighter">
                                                                                    {item.price ? `${item.currency || 'LKR'} ${item.price.toLocaleString()}` : 'Exclusive'}
                                                                                </span>
                                                                                <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                                                    <MoreHorizontal size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                                    <Utensils size={40} className="text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menus are being curated</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'events' && (
                        <motion.div 
                            key="events"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {restaurant.events?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {restaurant.events.map((e: any) => (
                                        <div key={e.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                                            <div className="h-56 relative overflow-hidden">
                                                <img 
                                                    src={getImageUrl(e.image, 'cover')} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-slate-50" 
                                                    alt={e.title} 
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                                                        {e.eventType || 'Experience'}
                                                    </span>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center gap-2 text-highlight font-black text-[10px] uppercase mb-4 tracking-widest">
                                                    <Calendar size={12}/> {e.startDateTime ? new Date(e.startDateTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Join us soon'}
                                                </div>
                                                <h4 className="font-black text-2xl text-slate-950 mb-3 italic uppercase tracking-tighter">{e.title}</h4>
                                                {e.description && <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 italic">{e.description}</p>}
                                                <button className="w-full flex items-center justify-center py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-xl hover:shadow-primary/30 transition-all">
                                                    Request Reservation
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                                    <Calendar size={40} className="text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Stay tuned for future events</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
          </div>

          {/* Premium Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Location & Times Sidebar Card */}
            <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 z-0" />
                <div className="relative z-10">
                    <h3 className="text-xl font-black mb-6 italic uppercase border-b border-slate-50 pb-4 flex items-center gap-2">
                        <Info size={18} className="text-primary"/> Access Info
                    </h3>
                    
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-1">Address</h4>
                                <p className="text-sm font-bold text-slate-700 leading-snug">{restaurant.address || "Location provided upon inquiry"}</p>
                                {restaurant.district && <p className="text-xs text-slate-400 font-bold mt-1 uppercase italic tracking-tighter">{restaurant.district}</p>}
                                {restaurant.mapUrl && (
                                    <a href={restaurant.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary text-[10px] font-black uppercase mt-3 hover:gap-2 transition-all">
                                        Open Directions <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-1">Business Hours</h4>
                                {restaurant.openingTime ? (
                                    <p className="text-sm font-black text-slate-900 tracking-tight italic">{restaurant.openingTime} — {restaurant.closingTime || 'Late'}</p>
                                ) : (
                                    <p className="text-sm font-medium text-slate-400">Hours not specified</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <ProtectedContact type="phone" value={restaurant.phone || restaurant.whatsapp} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Social & Digital Presence */}
            {(restaurant.facebookLink || restaurant.instagramLink || restaurant.website) && (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-4">Social Hub</h3>
                    <div className="flex flex-wrap gap-4">
                        {restaurant.facebookLink && (
                            <a href={restaurant.facebookLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all">
                                <Facebook size={20} />
                            </a>
                        )}
                        {restaurant.instagramLink && (
                            <a href={restaurant.instagramLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all">
                                <Instagram size={20} />
                            </a>
                        )}
                        {restaurant.twitterLink && (
                            <a href={restaurant.twitterLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all">
                                <Twitter size={20} />
                            </a>
                        )}
                        {restaurant.website && (
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all">
                                <Globe size={20} />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Amenities Grid */}
            {restaurant.facilities?.length > 0 && (
                <div className="bg-primary p-1 rounded-[2.5rem]">
                    <div className="bg-white rounded-[2.4rem] p-8">
                        <h3 className="text-sm font-black uppercase text-primary mb-6 tracking-widest flex items-center gap-2">
                            <Utensils size={14} /> Refined Amenities
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {[...(restaurant.facilities || []), ...(restaurant.dietaryOptions || [])].map((item: string) => (
                                <div key={item} className="flex gap-2 text-[10px] items-center font-black text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest shadow-sm">
                                    <CheckCircle2 size={12} className="text-primary"/> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Section - Dynamic Placeholder or Content */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200">
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Guest Feedback</h3>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star 
                                    key={s} 
                                    size={16} 
                                    fill={s <= (restaurant.rating || 0) ? "currentColor" : "none"} 
                                    className={s <= (restaurant.rating || 0) ? "text-highlight" : "text-slate-200"} 
                                />
                            ))}
                        </div>
                        <p className="text-slate-500 italic font-medium text-sm">
                            {restaurant.reviewCount > 0 
                                ? `${restaurant.name} has received ${restaurant.reviewCount} review${restaurant.reviewCount === 1 ? '' : 's'}. Visit our review section for more insights.`
                                : "No reviews have been shared yet. Be the first to share your experience."
                            }
                        </p>
                    </div>
                </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
