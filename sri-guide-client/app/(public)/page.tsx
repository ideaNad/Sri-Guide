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
} from "@/data/mockData";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Compass, ShieldCheck, Zap, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";

interface DiscoveryItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    location: string;
    rating: number;
    reviews: number;
    type: string;
    tags: string[];
}

export default function Home() {
  const [guides, setGuides] = useState<DiscoveryItem[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(true);

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
    fetchTopGuides();
  }, []);

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
              badge="Hot Deals"
              title="Our Most Popular Tours"
              subtitle="From ancient wonders to tropical surfing, find your next adventure."
            />
            <Link href="/tours" className="mb-12 bg-gray-900 text-white px-8 py-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl">
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
            {POPULAR_TOURS.map((tour) => (
              <motion.div key={tour.id} variants={itemVariants}>
                <Card {...tour} type="tour" />
              </motion.div>
            ))}
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
                className={`relative overflow-hidden group border-2 border-white shadow-2xl ${idx === 0 ? "md:col-span-2 md:row-span-2" :
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
                  <p className="text-xs font-bold uppercase tracking-widest text-highlight mb-1">{place.region}</p>
                  <h3 className="text-2xl font-black">{place.name}</h3>
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
            <Link href="/guides" className="mb-12 text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] flex items-center gap-2 group">
              Meet All Guides <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm"
              >
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1588598133416-2da21976a210' : i === 2 ? '1544216717-3bbf52512659' : '1568430462989-44163eb1752f'}?q=80&w=800&auto=format&fit=crop`}
                    alt="Adventure"
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/50">
                    <MapPin size={12} className="text-primary" />
                    {i === 1 ? 'Sigiriya' : i === 2 ? 'Ella' : 'Mirissa'}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-[10px]">
                      {i === 1 ? 'S' : i === 2 ? 'K' : 'I'}
                    </div>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      {i === 1 ? 'Sunil Perera' : i === 2 ? 'Kasun J.' : 'Isuru F.'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase italic mb-4 leading-tight group-hover:text-primary transition-colors">
                    {i === 1 ? 'Hidden Caves of Sigiriya' : i === 2 ? 'Mist Over Ella Gap' : 'Morning with the Whales'}
                  </h3>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                    A breathtaking perspective of Sri Lanka&apos;s most iconic landmarks, shared directly from the field.
                  </p>
                  <Link href="/guides" className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Read the Story <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
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
                  className="bg-white p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-2xl transition-all"
                >
                  <div className="w-40 h-40 overflow-hidden mb-6 border-8 border-white shadow-xl">
                    <img 
                      src={guide.image?.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${guide.image}` : guide.image} 
                      alt={guide.title} 
                      className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700" 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.title}</h3>
                  <p className="text-primary font-bold text-sm mb-4">{guide.subtitle || "Local Guide"}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {guide.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-gray-100 text-gray-400">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 italic">
                      Legit Partner
                    </span>
                  </div>
                  <Link 
                    href={`/profile/${guide.id}`}
                    className="w-full py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all text-center"
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
    </div>
  );
}
