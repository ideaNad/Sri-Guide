"use client";

import React, { useEffect, useState } from "react";
import { 
    Calendar, Plus, Edit2, Trash2, Clock, 
    Music, Star, X, Check, Loader2, Image as ImageIcon,
    MapPin, Info
} from "lucide-react";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";
import ImageUpload from "@/components/ui/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface RestaurantEvent {
    id: string;
    restaurantProfileId: string;
    title: string;
    description?: string;
    eventType?: string;
    startDateTime?: string;
    image?: string;
}

interface RestaurantProfile {
    id: string;
    events: RestaurantEvent[];
}

const EVENT_TYPES = [
    "Live Music", "DJ Night", "Cultural Show", 
    "Special Dinner", "Happy Hour", "Holiday Special"
];

export default function RestaurantEventsPage() {
    const { toast } = useToast();
    const [profile, setProfile] = useState<RestaurantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<RestaurantEvent> | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [toast]);

    const fetchProfile = async () => {
        try {
            const { data } = await apiClient.get<RestaurantProfile>("/restaurants/my-profile");
            setProfile(data);
        } catch (error) {
            console.error("Failed to load events", error);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentEvent?.title || !profile) return;
        setSubmitting(true);
        try {
            if (currentEvent.id) {
                await apiClient.put("/restaurants/events", currentEvent);
                toast.success("Event updated");
            } else {
                await apiClient.post("/restaurants/events", { 
                    ...currentEvent, 
                    restaurantProfileId: profile.id 
                });
                toast.success("Event scheduled");
            }
            await fetchProfile();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this event?")) return;
        try {
            await apiClient.delete(`/restaurants/events/${id}`);
            toast.success("Event removed");
            fetchProfile();
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">Live Events & Vibrance</h1>
                    <p className="text-gray-500 font-medium mt-1">Attract more travelers with live entertainment and specials.</p>
                </div>
                <button 
                    onClick={() => { setCurrentEvent({ title: "", eventType: "Live Music" }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-rose-600 transition-all text-xs uppercase tracking-widest shadow-xl shadow-gray-900/10"
                >
                    <Plus size={18} /> Schedule Event
                </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile?.events.map(event => (
                    <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col"
                    >
                        <div className="h-48 bg-gray-50 relative overflow-hidden shrink-0">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-200">
                                    <Music size={48} />
                                    <span className="text-[10px] uppercase font-black tracking-widest mt-2">{event.eventType}</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => { setCurrentEvent(event); setIsModalOpen(true); }} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-700 hover:text-rose-600 shadow-lg">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(event.id)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-rose-500 hover:bg-rose-50 shadow-lg">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
                                    {event.eventType}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic mb-2 line-clamp-1">{event.title}</h3>
                            <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-6 flex-1">
                                {event.description || "No description provided for this event."}
                            </p>
                            
                            <div className="flex items-center gap-4 text-gray-400 border-t border-gray-50 pt-4 mt-auto">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-rose-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                        {event.startDateTime ? format(new Date(event.startDateTime), "MMM dd, yyyy") : "TBA"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                        {event.startDateTime ? format(new Date(event.startDateTime), "hh:mm a") : "TBA"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {profile?.events.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 bg-gray-50/50 border border-dashed border-gray-200 rounded-[3rem] p-20 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Star className="text-amber-300 animate-pulse" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic mb-2">No Active Events</h2>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium mb-8">
                            Hosting a live band or a themed night? Schedule it here to show up on the discovery map!
                        </p>
                        <button 
                            onClick={() => { setCurrentEvent({ title: "", eventType: "Live Music" }); setIsModalOpen(true); }}
                            className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl shadow-gray-900/10"
                        >
                            Schedule Your First Event
                        </button>
                    </div>
                )}
            </div>

            {/* Event Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row"
                        >
                            <div className="w-full md:w-2/5 p-10 bg-gray-50 border-r border-gray-100">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Event Poster</h4>
                                <ImageUpload
                                    value={currentEvent?.image || ""}
                                    onChange={(url) => setCurrentEvent(prev => ({ ...prev, image: url }))}
                                />
                                <div className="mt-10 p-5 bg-rose-50 rounded-2xl border border-rose-100">
                                    <div className="flex gap-3 text-rose-600 mb-2">
                                        <Info size={18} className="shrink-0" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Promotion Tip</p>
                                    </div>
                                    <p className="text-[10px] text-rose-700/70 font-medium leading-relaxed italic">
                                        High-quality imagery increases profile interest by 40% for evening events.
                                    </p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="flex-1 p-10 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">{currentEvent?.id ? "Edit Event" : "Setup Event"}</h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="e.g. Acoustic Jazz Night"
                                            value={currentEvent?.title || ""} 
                                            onChange={(e) => setCurrentEvent(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                                            <select 
                                                value={currentEvent?.eventType || "Live Music"}
                                                onChange={(e) => setCurrentEvent(prev => ({ ...prev, eventType: e.target.value }))}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-sm"
                                            >
                                                {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date & Time</label>
                                            <input 
                                                type="datetime-local" 
                                                value={currentEvent?.startDateTime ? new Date(currentEvent.startDateTime).toISOString().slice(0, 16) : ""} 
                                                onChange={(e) => setCurrentEvent(prev => ({ ...prev, startDateTime: e.target.value }))}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea 
                                            value={currentEvent?.description || ""} 
                                            onChange={(e) => setCurrentEvent(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-medium h-24"
                                            placeholder="What's happening? Who is performing?"
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={submitting}
                                    className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-900/10 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? "Scheduling..." : <><Check size={18} /> {currentEvent?.id ? "Update Event" : "Confirm Event"}</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
