"use client";

import React from "react";
import HeroSlider from "@/components/HeroSlider";
import DiscoverSection from "@/components/DiscoverSection";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import {
  POPULAR_TOURS,
  TOP_GUIDES,
  UPCOMING_EVENTS,
  POPULAR_PLACES,
  BEST_RESTAURANTS,
  VEHICLE_RENTALS
} from "@/data/mockData";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Compass, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
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

      {/* Top Local Guides - Profile Cards */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            badge="Expert Minds"
            title="Our Top Local Guides"
            subtitle="Connect with certified professionals who bring stories to life."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TOP_GUIDES.map((guide) => (
              <motion.div
                key={guide.id}
                whileHover={{ y: -10 }}
                className="bg-white p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="w-40 h-40 overflow-hidden mb-6 border-8 border-white shadow-xl">
                  <img src={guide.image} alt={guide.name} className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.name}</h3>
                <p className="text-primary font-bold text-sm mb-4">{guide.specialty}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {guide.languages.map(lang => (
                    <span key={lang} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-gray-100 text-gray-400">{lang}</span>
                  ))}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                  <Compass className="w-4 h-4 text-secondary" />
                  <span>Verified Professional</span>
                </div>
                <button className="w-full py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all">
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
