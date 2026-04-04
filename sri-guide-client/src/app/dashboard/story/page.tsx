"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Milestone, 
    MapPin, 
    Calendar, 
    Award, 
    ArrowLeft, 
    Camera, 
    Star,
    Compass,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";

interface StoryEntry {
    id: string;
    questName: string;
    description: string;
    locationName: string;
    category: string;
    difficulty: string;
    photoProofUrl: string;
    earnedXP: number;
    completedAt: string;
}

export default function IslandStoryPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [stories, setStories] = useState<StoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        } else if (user) {
            fetchStory();
        }
    }, [user, authLoading]);

    const fetchStory = async () => {
        try {
            const response = await apiClient.get<StoryEntry[]>('/quests/my-history');
            setStories(response.data);
        } catch (error) {
            console.error("Failed to fetch story", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recalling your memories...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20 bg-[#FBFBFE]">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => router.back()} 
                            className="p-3 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
                        >
                            <ArrowLeft size={22} className="text-gray-900" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">My Island Story</h1>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Chronicle of Adventures</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {stories.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-16 text-center shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center max-w-lg mx-auto"
                    >
                        <div className="w-24 h-24 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
                            <Compass size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase italic">Your Story Begins Here</h2>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed text-sm">
                            Every explorer has a tale to tell. Start completing quests across Sri Lanka to see your memories appear in this live chronicle.
                        </p>
                        <button 
                            onClick={() => router.push('/dashboard/explorer')}
                            className="group flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
                        >
                            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                            Explore the Island
                            <ChevronRight size={20} />
                        </button>
                    </motion.div>
                ) : (
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-primary/5 to-transparent rounded-full" />

                        <div className="space-y-16">
                            {stories.map((story, index) => (
                                <motion.div 
                                    key={story.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-20"
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute left-[26px] top-4 w-4 h-4 bg-white border-4 border-primary rounded-full z-10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />

                                    <div className="group relative flex flex-col md:flex-row gap-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                        
                                        {/* Background Accent */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-3xl group-hover:bg-primary/5 transition-colors pointer-events-none" />

                                        {/* Photo Section */}
                                        <div className="w-full md:w-64 h-64 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg shrink-0 relative">
                                            <img 
                                                src={story.photoProofUrl.startsWith('http') ? story.photoProofUrl : `${apiClient.defaults.baseURL?.replace('/api', '')}${story.photoProofUrl}`} 
                                                alt={story.questName}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4 py-2 px-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center gap-2">
                                                <Camera size={12} className="text-white" />
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Verified Proof</span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 flex flex-col pt-2">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                    {story.category}
                                                </span>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {new Date(story.completedAt).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tight group-hover:text-primary transition-colors">
                                                {story.questName}
                                            </h3>
                                            
                                            <div className="flex items-center gap-2 text-gray-500 mb-6 font-bold text-sm">
                                                <MapPin size={16} className="text-primary/60" />
                                                {story.locationName}
                                            </div>

                                            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                                                {story.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100/50 shadow-sm">
                                                        <Award size={16} />
                                                        <span className="text-xs font-black uppercase tracking-widest">+{story.earnedXP} XP</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] animate-pulse">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                    Achieved
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
