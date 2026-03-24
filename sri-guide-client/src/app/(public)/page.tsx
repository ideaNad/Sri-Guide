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
import { ArrowRight, CheckCircle2, Mail, Compass, ShieldCheck, Zap, Heart, MapPin, Loader2, Star } from "lucide-react";
import Link from "next/link";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";
import GuideDiscoveryCard from "@/components/ui/GuideDiscoveryCard";

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
  slug?: string;
}

interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
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
  price?: number;
  slug?: string;
  rating?: number;
  reviewsCount?: number;
}

interface PopularPlace {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  viewCount: number;
  slug?: string;
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
  const [popularPlaces, setPopularPlaces] = useState<PopularPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopGuides = async () => {
      try {
        const response = await apiClient.get<PaginatedResult<DiscoveryItem>>("/discovery?type=guide");
        setGuides((response.data.items || []).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch top guides", error);
      } finally {
        setLoadingGuides(false);
      }
    };

    const fetchTopAgencies = async () => {
      try {
        const response = await apiClient.get<PaginatedResult<DiscoveryItem>>("/discovery?type=agency");
        setAgencies((response.data.items || []).slice(0, 3));
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

    const fetchPopularPlaces = async () => {
      try {
        const response = await apiClient.get<PopularPlace[]>("/places");
        setPopularPlaces(response.data);
      } catch (error) {
        console.error("Failed to fetch popular places", error);
      } finally {
        setLoadingPlaces(false);
      }
    };

    fetchTopGuides();
    fetchTopAgencies();
    fetchRecentTrips();
    fetchPopularTours();
    fetchPopularPlaces();
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url || url.trim() === "") return "https://placehold.co/600x400?text=No+Image+Available";
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    const baseUrl = apiClient.defaults.baseURL?.split('/api')[0];
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  };

  const handleToggleLike = async (id: string, type: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const endpoint = type === 'tour' ? `/tours/${id}/toggle-like` : `/trip/${id}/toggle-like`;
      const response = await apiClient.post<{ liked: boolean }>(endpoint);
      const { liked } = response.data;

      setTrips(prev => prev.map(t => t.id === id ? { ...t, isLiked: liked, likeCount: liked ? t.likeCount + 1 : t.likeCount - 1 } : t));
      setPopularTours(prev => prev.map(t => t.id === id ? { ...t, isLiked: liked, likeCount: liked ? t.likeCount + 1 : t.likeCount - 1 } : t));
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
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {loadingPopular ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-3xl" />
                ))
              ) : popularTours.length > 0 ? (
                popularTours.map((tour) => (
                  <motion.div
                    key={tour.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                  >
                    <Card
                      id={tour.id}
                      slug={tour.slug}
                      title={tour.title}
                      image={tour.imageUrl || ""}
                      location={tour.location}
                      type="tour"
                      price={tour.price}
                      badge="Agency"
                      likeCount={tour.likeCount}
                      isLiked={tour.isLiked}
                      duration={tour.duration}
                      mapLink={tour.mapLink}
                      rating={tour.rating}
                      reviews={tour.reviewsCount}
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
              {loadingPlaces ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-full bg-gray-100 animate-pulse rounded-3xl" />
                ))
              ) : popularPlaces.length > 0 ? (
                popularPlaces.slice(0, 4).map((place, idx) => (
                  <Link
                    href={`/places/${place.slug || place.id}`}
                    key={place.id}
                    className={`relative overflow-hidden rounded-3xl group shadow-lg ${idx === 0 ? "md:col-span-2 md:row-span-2" :
                      idx === 1 ? "md:col-span-2 md:row-span-1" :
                        "md:col-span-1 md:row-span-1"
                      }`}
                  >
                    <motion.div
                      whileHover={{ scale: 0.99 }}
                      className="w-full h-full"
                    >
                      <img
                        src={place.imageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${place.imageUrl}` : place.imageUrl}
                        alt={place.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-6 left-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 italic">Destination</p>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{place.title}</h3>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="col-span-4 text-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No featured places yet</p>
                </div>
              )}
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
              ) : trips.length > 0 ? (
                trips.map((trip) => (
                  <motion.div
                    key={trip.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                  >
                    <Card
                      id={trip.id}
                      slug={trip.slug}
                      title={trip.title}
                      image={trip.imageUrl || ""}
                      location={trip.location}
                      type={trip.isAgencyTour ? "tour" : "adventure"}
                      price={trip.price}
                      badge={trip.isAgencyTour ? "Agency" : "Guide"}
                      subtitle={trip.guideName}
                      likeCount={trip.likeCount}
                      isLiked={trip.isLiked}
                      duration={trip.duration}
                      mapLink={trip.mapLink}
                      rating={trip.rating}
                      reviews={trip.reviewsCount}
                      onToggleLike={handleToggleLike}
                    />
                  </motion.div>
                ))
              ) : (
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
                {guides.map((guide, idx) => (
                  <GuideDiscoveryCard key={guide.id} guide={guide} idx={idx} />
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
                  <Card
                    key={agency.id}
                    id={agency.id}
                    slug={agency.slug}
                    title={agency.title}
                    image={agency.image || ""}
                    rating={agency.rating}
                    reviews={agency.reviews}
                    type="agency"
                    subtitle="Official Travel Agency"
                  />
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
