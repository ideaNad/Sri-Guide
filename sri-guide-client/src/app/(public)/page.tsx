"use client";

import React, { useEffect, useState } from "react";
import HeroSlider from "@/features/home/components/HeroSlider";
import DiscoverSection from "@/features/home/components/DiscoverSection";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import {
  POPULAR_TOURS,
  UPCOMING_EVENTS,
  POPULAR_PLACES,
  BEST_RESTAURANTS,
  VEHICLE_RENTALS
} from "@/data/mock-data";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Compass, ShieldCheck, Zap, Heart, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";

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
    tags: string[];
    agencyName?: string;
}

interface RecentTrip {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    imageUrl: string;
    guideName: string;
    guideImageUrl: string;
    guideUserId: string;
    likeCount: number;
    isLiked?: boolean;
    duration?: string;
    mapLink?: string;
    isAgencyTour?: boolean;
}

export default function Home() {
  const { user, login } = useAuth();
  const [guides, setGuides] = useState<DiscoveryItem[]>([]);
  const [agencies, setAgencies] = useState<DiscoveryItem[]>([]);
  const [trips, setTrips] = useState<RecentTrip[]>([]);
  const [popularTours, setPopularTours] = useState<RecentTrip[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopGuides = async () => {
      try {
        const response = await apiClient.get<DiscoveryItem[]>("/discovery?type=guide");
        setGuides(response.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch top guides", error);
      } finally {
        setLoadingGuides(false);
      }
    };

    const fetchTopAgencies = async () => {
      try {
        const response = await apiClient.get<DiscoveryItem[]>("/discovery?type=agency");
        setAgencies(response.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch top agencies", error);
      } finally {
        setLoadingAgencies(false);
      }
    };

    const fetchRecentTrips = async () => {
        try {
            const response = await apiClient.get<RecentTrip[]>("/discovery/recent-trips");
            setTrips(response.data);
        } catch (error) {
            console.error("Failed to fetch recent trips", error);
        } finally {
            setLoadingTrips(false);
        }
    };

    const fetchPopularTours = async () => {
        try {
            const response = await apiClient.get<RecentTrip[]>("/discovery/popular-tours");
            setPopularTours(response.data);
        } catch (error) {
            console.error("Failed to fetch popular tours", error);
        } finally {
            setLoadingPopular(false);
        }
    };

    fetchTopGuides();
    fetchTopAgencies();
    fetchRecentTrips();
    fetchPopularTours();
  }, []);

  const handleToggleLike = async (tripId: string) => {
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }
    try {
        const response = await apiClient.post<{ liked: boolean }>(`/trip/${tripId}/toggle-like`);
        const { liked } = response.data;
        
        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, isLiked: liked, likeCount: liked ? t.likeCount + 1 : t.likeCount - 1 } : t));
        setPopularTours(prev => prev.map(t => t.id === tripId ? { ...t, isLiked: liked, likeCount: liked ? t.likeCount + 1 : t.likeCount - 1 } : t));
    } catch (error) {
        console.error("Failed to toggle like", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlider />

      {/* Discover Section */}
      <DiscoverSection />

      {/* Popular Tours - Horizontal Scroll with Visual Interest */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeader
              badge="Top Picks"
              title="Our Most Popular Tours"
              subtitle="From ancient wonders to tropical surfing, find your next adventure."
            />
            
            <Link href="/tours" className="mb-12 bg-gray-900 text-white px-8 py-3 font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-md">
              View All Tours
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {loadingPopular ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-3xl" />
                ))
            ) : popularTours.length > 0 ? (
                popularTours.map((tour) => (
                    <motion.div key={tour.id} variants={itemVariants}>
                        <Card 
                            id={tour.id}
                            title={tour.title}
                            image={tour.imageUrl || ""}
                            location={tour.location}
                            rating={4.8} 
                            reviews={tour.likeCount}
                            type="tour"
                            price={250} 
                            badge="Agency"
                            likeCount={tour.likeCount}
                            isLiked={tour.isLiked}
                            duration={tour.duration}
                            mapLink={tour.mapLink}
                            onToggleLike={handleToggleLike}
                        />
                    </motion.div>
                ))
            ) : (
                <div className="col-span-4 text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        No official tours featured yet
                    </p>
                </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Places - Unique Mosaic Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            centered
            badge="Top Destinations"
            title="Popular Places in Sri Lanka"
            subtitle="Explore the diversity of the pearl of the Indian Ocean."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
            {POPULAR_PLACES.map((place, idx) => (
              <motion.div
                key={place.id}
                whileHover={{ scale: 0.99 }}
                className={`relative overflow-hidden rounded-3xl group shadow-lg ${idx === 0 ? "md:col-span-2 md:row-span-2" :
                  idx === 1 ? "md:col-span-2 md:row-span-1" :
                    "md:col-span-1 md:row-span-1"
                  }`}
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{place.region}</p>
                  <h3 className="text-2xl font-bold">{place.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Adventures - Guide Shared Content */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <SectionHeader
              badge="Island Stories"
              title="Recent Adventures"
              subtitle="Real experiences shared by our certified guides across the island."
            />
            <Link href="/guides" className="mb-12 text-sm font-bold text-primary flex items-center gap-2 group hover:text-secondary transition-colors">
              Meet All Guides <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingTrips ? (
               Array(3).fill(0).map((_, i) => (
                   <div key={i} className="h-[500px] bg-gray-100 animate-pulse rounded-3xl" />
               ))
            ) : trips.length > 0 ? trips.map((trip) => (
              <motion.div
                key={trip.id}
                variants={itemVariants}
              >
                <Card 
                    id={trip.id}
                    title={trip.title}
                    image={trip.imageUrl || ""}
                    location={trip.location}
                    rating={5.0}
                    reviews={trip.likeCount}
                    type={trip.isAgencyTour ? "tour" : "adventure"}
                    badge={trip.isAgencyTour ? "Agency" : "Guide"}
                    subtitle={trip.guideName}
                    likeCount={trip.likeCount}
                    isLiked={trip.isLiked}
                    duration={trip.duration}
                    mapLink={trip.mapLink}
                    onToggleLike={handleToggleLike}
                />
              </motion.div>
            )) : (
                <div className="col-span-3 text-center py-20 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                    No recent adventures shared yet
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Local Guides - Profile Cards */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            badge="Expert Minds"
            title="Our Top Local Guides"
            subtitle="Connect with certified professionals who bring stories to life."
          />

          {loadingGuides ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <motion.div
                  key={guide.id}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md">
                    <img 
                      src={guide.image ? (guide.image.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${guide.image}` : guide.image) : `https://ui-avatars.com/api/?name=${guide.title}&background=FFCC00&color=000&bold=true`} 
                      alt={guide.title} 
                      className="w-full h-full object-cover transition-all duration-700" 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.title}</h3>
                  <p className="text-primary font-medium text-sm mb-4">{guide.subtitle || "Local Guide"}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {guide.isLegit && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                            Verified <ShieldCheck size={10} />
                        </span>
                    )}
                    {guide.agencyName && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                            {guide.agencyName}
                        </span>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {guide.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-gray-50 rounded-full text-secondary">{tag}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    {guide.type === 'agency' && (
                        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Travel Agency
                        </span>
                    )}
                    {guide.isLegit && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Licensed Guide
                        </span>
                    )}
                  </div>
                  <Link 
                    href={`/profile/${guide.id}`}
                    className="w-full py-3.5 bg-primary/10 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-white transition-colors text-center"
                  >
                    View Profile
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 uppercase text-[10px] font-black tracking-widest">
              No top guides available currently
            </div>
          )}
        </div>
      </section>

      {/* Top Agencies Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <SectionHeader
            badge="Business Partners"
            title="Our Top Travel Agencies"
            subtitle="Explore certified tour companies providing premium travel experiences."
          />

          {loadingAgencies ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
          ) : agencies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {agencies.map((agency) => (
                <motion.div
                  key={agency.id}
                  whileHover={{ y: -8 }}
                  className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="w-24 h-24 rounded-3xl overflow-hidden mb-8 shadow-xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform">
                    <img 
                      src={agency.image ? (agency.image.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${agency.image}` : agency.image) : `https://ui-avatars.com/api/?name=${agency.title}&background=000&color=fff&bold=true`} 
                      alt={agency.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 truncate max-w-full">{agency.title}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        Official Agency
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                    Connecting you to authentic Sri Lankan adventures with professional excellence.
                  </p>
                  <Link 
                    href={`/profile/${agency.id}`}
                    className="w-full py-4 bg-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200"
                  >
                    View Agency Profile
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 uppercase text-[10px] font-black tracking-widest">
              No top agencies available currently
            </div>
          )}
        </div>
      </section>
    </div>
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      onSuccess={(userData) => { login(userData); setIsAuthModalOpen(false); }}
    />
  </>
  );
}
