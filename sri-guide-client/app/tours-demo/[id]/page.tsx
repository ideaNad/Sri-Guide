"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { POPULAR_TOURS, REVIEWS } from "@/data/mockData";
import {
    Star, MapPin, Clock, Users, ShieldCheck,
    Calendar, Info, ChevronRight, Check, Plus,
    Share2, Heart, MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";

const TourDetailPage = () => {
    const { id } = useParams();
    const tour = POPULAR_TOURS.find(t => t.id === Number(id)) || POPULAR_TOURS[0];
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="pb-24 bg-white">
            {/* Hero Section */}
            <section className="relative h-[70vh] w-full overflow-hidden">
                <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                <div className="absolute bottom-12 left-0 w-full">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tour.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 max-w-4xl leading-tight">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/80">
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-highlight" />
                                <span className="font-medium">{tour.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-highlight" />
                                <span className="font-medium">{tour.duration}</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-white">{tour.rating}</span>
                                <span className="ml-1 text-sm">({tour.reviews} Reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-28 right-8 flex space-x-3">
                    <button className="w-12 h-12 glass rounded-full flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-all">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 glass rounded-full flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <div className="container mx-auto px-4 mt-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Tabs */}
                        <div className="flex space-x-12 border-b border-gray-100 mb-10 overflow-x-auto">
                            {["overview", "itinerary", "reviews"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === "overview" && (
                                <div className="space-y-10">
                                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                                        <p>
                                            Join us for an unforgettable journey to {tour.title}. This experience is designed for those who appreciate the finer details of Sri Lankan culture and heritage.
                                            You will explore the majestic landscapes, interact with local communities, and discover why this is considered one of the pearl of the Indian Ocean's must-see attractions.
                                        </p>
                                        <p className="mt-4">
                                            Our professional local guides will accompany you, sharing insights and stories that you won't find in any guidebook.
                                            From early morning views to evening reflections, every moment is crafted to provide a deep connection with the destination.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                                                <Check className="w-5 h-5 mr-3 text-secondary" />
                                                What's Included
                                            </h4>
                                            <ul className="space-y-4">
                                                {["Professional Local Guide", "Private Luxury Transportation", "All Entrance Fees", "Traditional Lunch & Drinks", "High-Quality Photography Service"].map(item => (
                                                    <li key={item} className="flex items-center text-sm text-gray-600">
                                                        <Check className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                                                <Plus className="w-5 h-5 mr-3 text-highlight" />
                                                What's Excluded
                                            </h4>
                                            <ul className="space-y-4">
                                                {["Personal Expenses", "Travel Insurance", "Gratuities (Recommended)", "Extra Snacks"].map(item => (
                                                    <li key={item} className="flex items-center text-sm text-gray-400 font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-4" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "itinerary" && (
                                <div className="space-y-12">
                                    {[
                                        { time: "08:00 AM", title: "Hotel Pick-up", desc: "Our luxury vehicle will pick you up directly from your accommodation in a comfortable, air-conditioned SUV." },
                                        { time: "10:00 AM", title: "Arrival & Sightseeing", desc: "First stop at the main archaeological site. Your guide will provide a deep historical overview while avoiding the crowds." },
                                        { time: "12:30 PM", title: "Authentic Local Lunch", desc: "Enjoy a traditional Sri Lankan rice and curry spread at a hidden garden restaurant known only to locals." },
                                        { time: "03:00 PM", title: "Exploration & Relaxation", desc: "Free time to explore the surroundings, take photos, or relax by the serene water bodies." },
                                        { time: "05:30 PM", title: "Return Journey", desc: "Heading back to the hotel while enjoying the sunset views along the scenic coastal/mountain route." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-8 relative pb-12 last:pb-0">
                                            {i !== 4 && <div className="absolute left-[27px] top-8 bottom-0 w-0.5 bg-gray-100" />}
                                            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-xs z-10 transition-all hover:bg-primary hover:text-white group">
                                                {i + 1}
                                            </div>
                                            <div className="pt-2">
                                                <span className="text-xs font-black text-secondary tracking-widest uppercase mb-2 block">{item.time}</span>
                                                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                                                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-12">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-gray-900">Traveler Reviews</h3>
                                        <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                            Write a Review
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        {REVIEWS.map(review => (
                                            <div key={review.id} className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 flex gap-6">
                                                <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-inner">
                                                    <img src={`https://i.pravatar.cc/150?u=${review.user}`} alt={review.user} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{review.user}</h4>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{review.country} • {review.date}</p>
                                                        </div>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed italic">"{review.text}"</p>
                                                    <div className="mt-4 flex items-center text-primary text-xs font-bold cursor-pointer hover:underline">
                                                        <MessageCircle className="w-4 h-4 mr-2" />
                                                        Reply
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Booking Widget */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />

                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <span className="text-white/40 text-xs font-black uppercase tracking-widest block mb-2">Price</span>
                                        <div className="text-4xl font-black">${tour.price} <span className="text-lg text-white/50 font-normal">/ person</span></div>
                                    </div>
                                    <div className="bg-primary/20 border border-primary/30 p-3 rounded-2xl flex flex-col items-center">
                                        <span className="text-[10px] font-black uppercase text-primary">Best Price</span>
                                        <Check className="w-4 h-4 text-primary" />
                                    </div>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <div className="flex items-center space-x-3 text-white/40 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Select Date</span>
                                        </div>
                                        <p className="font-bold text-sm">March 15, 2026</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <div className="flex items-center space-x-3 text-white/40 mb-2">
                                            <Users className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Travelers</span>
                                        </div>
                                        <p className="font-bold text-sm">2 Adults, 1 Child</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full bg-primary hover:bg-primary/90 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center transition-all active:scale-95 group">
                                        Book Experience
                                        <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                    <p className="text-center text-xs text-white/30 font-medium italic">No payment required yet</p>
                                </div>

                                <div className="mt-10 pt-10 border-t border-white/10 space-y-4">
                                    <div className="flex items-center text-xs text-white/60">
                                        <ShieldCheck className="w-4 h-4 mr-3 text-secondary" />
                                        <span>Free cancellation up to 48h before</span>
                                    </div>
                                    <div className="flex items-center text-xs text-white/60">
                                        <Info className="w-4 h-4 mr-3 text-highlight" />
                                        <span>No hidden service fees</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guide Profile Promo */}
                            <div className="glass p-8 rounded-[40px] border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all cursor-pointer">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" alt="Sunil" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Proposed Guide</p>
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">Sunil Perera</h4>
                                    <div className="flex items-center text-xs font-bold text-gray-400 mt-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                                        4.9 (84 reviews)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Similar Tours */}
            <section className="mt-32 pt-24 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title="Others also explored"
                        subtitle="Complete your Sri Lankan bucket list with these experiences."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {POPULAR_TOURS.slice(0, 4).map(t => (
                            <Card key={t.id} {...t} type="tour" />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TourDetailPage;
