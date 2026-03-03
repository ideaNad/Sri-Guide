"use client";

import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { UPCOMING_EVENTS } from "@/data/mockData";
import { Calendar, MapPin, Ticket, Clock, Share2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const EventsPage = () => {
    return (
        <div className="pt-24 pb-24 bg-white">
            <div className="container mx-auto px-4">
                <SectionHeader
                    badge="Cultural Calendar"
                    title="Upcoming Events & Festivals"
                    subtitle="Experience the vibrant traditions, music, and arts of Sri Lanka."
                />

                <div className="space-y-12">
                    {UPCOMING_EVENTS.concat(UPCOMING_EVENTS).map((event, idx) => (
                        <motion.div
                            key={`${event.id}-${idx}`}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group flex flex-col lg:flex-row bg-white overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-700 hover:border-gray-900"
                        >
                            <div className="lg:w-1/3 h-[400px] relative overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-8 left-8 bg-white p-6 text-center border-2 border-gray-900 shadow-xl min-w-[100px]">
                                    <span className="block text-3xl font-black text-gray-900 leading-none">{event.date.split(" ")[1].replace(",", "")}</span>
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">{event.date.split(" ")[0]}</span>
                                </div>
                            </div>

                            <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center">
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <span className="px-4 py-1.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-[0.2em] border border-gray-900">
                                        {event.category}
                                    </span>
                                    <div className="flex items-center text-sm text-gray-400 font-bold">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {event.location}
                                    </div>
                                </div>

                                <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 group-hover:text-primary transition-colors leading-tight">{event.title}</h3>

                                <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10 max-w-2xl">
                                    Immerse yourself in one of Sri Lanka's most iconic celebrations. This event showcases the rich heritage and spiritual depth of the island through dance, music, and light.
                                </p>

                                <div className="flex flex-wrap items-center gap-6">
                                    <button className="bg-gray-900 text-white px-10 py-5 font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all flex items-center group/btn">
                                        Book Tickets
                                        <Ticket className="ml-3 w-5 h-5 transition-transform group-hover/btn:rotate-12" />
                                    </button>
                                    <button className="flex items-center text-gray-400 font-black text-sm uppercase tracking-widest hover:text-primary transition-colors">
                                        Learn More
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </button>
                                    <div className="flex-1" />
                                    <button className="w-16 h-16 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Calendar View CTA */}
                <div className="mt-24 p-20 bg-gray-900 text-white text-center relative overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-primary/20 opacity-30 -z-10 bg-[radial-gradient(circle_at_center,_white,_transparent)]" />
                    <Calendar className="w-16 h-16 text-primary mx-auto mb-10 opacity-30" />
                    <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">Don't Miss Any Ritual</h3>
                    <p className="text-white/40 text-lg font-medium max-w-2xl mx-auto mb-12 italic">Download our seasonal festival calendar or integrate it directly into your Google Calendar.</p>
                    <button className="bg-white text-gray-900 px-12 py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-2xl">
                        Get Seasonal Calendar
                    </button>
                </div>
            </div>
        </div >
    );
};

export default EventsPage;
