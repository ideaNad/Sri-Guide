"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    MapPin, Calendar, Eye, ArrowLeft, Loader2, Compass, Share2
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";

interface PopularPlace {
    id: string;
    slug?: string;
    title: string;
    description: string;
    imageUrl: string;
    mapLink?: string;
    viewCount: number;
    createdAt: string;
}

import { useShare } from "@/hooks/useShare";

export default function PlaceClient({ slug, initialData }: { slug: string, initialData?: PopularPlace }) {
    const router = useRouter();
    const { share } = useShare();
    const [place, setPlace] = useState<PopularPlace | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        const fetchPlace = async () => {
            if (initialData) return;
            try {
                const response = await apiClient.get<PopularPlace>(`/places/${slug}`);
                setPlace(response.data);
            } catch (error) {
                console.error("Error fetching place:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPlace();
    }, [slug, initialData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!place) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Compass size={64} className="text-gray-200" />
                <h1 className="text-2xl font-black text-gray-400 uppercase tracking-widest italic">Place not found</h1>
                <button 
                    onClick={() => router.push("/")}
                    className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-12 pb-32">
            {/* Hero Section */}
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
                <img 
                    src={place.imageUrl.startsWith('/') ? `${apiClient.defaults.baseURL?.replace('/api', '')}${place.imageUrl}` : place.imageUrl}
                    alt={place.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
                    <button 
                        onClick={() => router.back()}
                        className="p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl text-white hover:bg-white hover:text-black transition-all border border-white/20"
                    >
                        <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="absolute bottom-8 sm:bottom-12 left-0 w-full z-10">
                    <div className="container mx-auto px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-primary text-gray-900 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 sm:mb-6 italic shadow-xl shadow-primary/20">
                                Featured Destination
                            </span>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-4 sm:mb-6">
                                {place.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/80 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-primary sm:w-4 sm:h-4" />
                                    <span>Sri Lanka</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={14} className="text-primary sm:w-4 sm:h-4" />
                                    <span>{place.viewCount} Views</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-primary sm:w-4 sm:h-4" />
                                    <span>{new Date(place.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-12 sm:py-24 relative">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        <div className="lg:col-span-8">
                            <style>{`
                                .richtextbody { color: #4b5563; line-height: 1.8; font-size: 1rem; word-break: break-word; overflow-wrap: break-word; }
                                .richtextbody h1,.richtextbody h2,.richtextbody h3,.richtextbody h4 { font-weight: 800; color: #111827; margin: 1.5em 0 0.5em; line-height: 1.3; }
                                .richtextbody h1 { font-size: 2rem; } .richtextbody h2 { font-size: 1.75rem; } .richtextbody h3 { font-size: 1.5rem; }
                                .richtextbody p { margin: 1em 0; }
                                .richtextbody ul,.richtextbody ol { padding-left: 1.5em; margin: 1em 0; }
                                .richtextbody ul { list-style-type: disc; } .richtextbody ol { list-style-type: decimal; }
                                .richtextbody li { margin: 0.5em 0; }
                                .richtextbody strong,.richtextbody b { font-weight: 700; color: #111827; }
                                .richtextbody em,.richtextbody i { font-style: italic; }
                                .richtextbody a { color: #059669; text-decoration: underline; }
                                .richtextbody blockquote { border-left: 4px solid #10b981; padding-left: 1.5em; color: #6b7280; font-style: italic; margin: 1.5em 0; }
                                .richtextbody img { max-width: 100%; height: auto; border-radius: 1rem; margin: 2em 0; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
                                .richtextbody table { width: 100%; border-collapse: collapse; margin: 2em 0; font-size: 0.9rem; display: block; overflow-x: auto; }
                                .richtextbody td,.richtextbody th { border: 1px solid #e5e7eb; padding: 0.75em 1em; text-align: left; }
                                .richtextbody th { background: #f9fafb; font-weight: 700; }
                                @media (max-width: 640px) {
                                    .richtextbody { font-size: 0.95rem; }
                                    .richtextbody h1 { font-size: 1.75rem; }
                                    .richtextbody h2 { font-size: 1.5rem; }
                                    .richtextbody h3 { font-size: 1.25rem; }
                                }
                            `}</style>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="max-w-none"
                            >
                                <div 
                                    className="richtextbody"
                                    dangerouslySetInnerHTML={{ __html: place.description }}
                                />
                            </motion.div>
                        </div>

                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-gray-50 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 sticky top-24">
                                <h3 className="text-xl font-black text-gray-900 italic uppercase mb-6">Explore This Region</h3>
                                <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed">
                                    Ready to experience {place.title}? Connect with our local guides to plan an authentic journey to this destination.
                                </p>
                                
                                <button 
                                    onClick={() => router.push(`/tours?query=${encodeURIComponent(place.title)}`)}
                                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-gray-200 mb-4"
                                >
                                    Find Tours Here
                                </button>

                                <button 
                                    onClick={() => share({
                                        title: place.title,
                                        text: place.description,
                                        url: window.location.href
                                    })}
                                    className="w-full py-5 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3"
                                >
                                    <Share2 size={16} /> Share Destination
                                </button>

                                {place.mapLink && (
                                    <a 
                                        href={place.mapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-5 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-100 transition-all flex items-center justify-center gap-3 mt-4 animate-pulse"
                                    >
                                        <MapPin size={16} /> Open in Google Maps
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
            </section>
        </div>
    );
}
