"use client";

import React, { useEffect, useState } from "react";
import { Settings, Save, MapPin, Phone, Globe, Clock, Landmark, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";
import ImageUpload from "@/components/ui/ImageUpload";

interface RestaurantProfile {
    id: string;
    userId: string;
    name: string;
    slug: string;
    description: string;
    phone: string;
    whatsApp: string;
    email: string;
    address: string;
    district: string;
    province: string;
    mapUrl: string;
    rating: number;
    reviewCount: number;
    priceRange?: string;
    openingTime?: string;
    closingTime?: string;
    menus: any[];
    events: any[];
    logo?: string;
    coverImage?: string;
    cuisineTypes: string[];
    facilities: string[];
    dietaryOptions: string[];
    paymentMethods: string[];
    familyFriendly: boolean;
    romanticSetting: boolean;
    groupFriendly: boolean;
    facebookLink?: string;
    instagramLink?: string;
    tiktokLink?: string;
    youtubeLink?: string;
    twitterLink?: string;
    linkedinLink?: string;
    website?: string;
}

export default function RestaurantSettingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [profile, setProfile] = useState<RestaurantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await apiClient.get<RestaurantProfile>("/restaurants/my-profile");
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [toast]);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        try {
            await apiClient.put("/restaurants/profile", profile);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Save failed", error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic uppercase">
                        Restaurant Settings
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Configure your digital storefront and customer touchpoints.</p>
                </div>
                
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-rose-600 transition-all text-xs uppercase tracking-widest shadow-xl shadow-gray-900/10 disabled:opacity-50"
                >
                    {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Identity Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Landmark size={16} className="text-rose-500" /> Visual Identity
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Restaurant Logo</label>
                                    <ImageUpload 
                                        value={profile?.logo || ""} 
                                        onChange={(url) => setProfile(prev => prev ? { ...prev, logo: url } : null)} 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Cover Image</label>
                                    <ImageUpload 
                                        value={profile?.coverImage || ""} 
                                        onChange={(url) => setProfile(prev => prev ? { ...prev, coverImage: url } : null)} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <Settings size={16} className="text-rose-500" /> General Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Restaurant Name</label>
                                <input 
                                    type="text" 
                                    value={profile?.name || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all outline-none text-gray-900 font-bold" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Description</label>
                                <textarea 
                                    rows={4} 
                                    value={profile?.description || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, description: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all outline-none text-gray-900 font-medium leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Location */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={16} className="text-rose-500" /> Contact & Location
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2"><Phone size={10} /> Phone</label>
                                <input 
                                    type="text" 
                                    value={profile?.phone || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-gray-900" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2"><Globe size={10} /> WhatsApp</label>
                                <input 
                                    type="text" 
                                    value={profile?.whatsApp || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, whatsApp: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-gray-900" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2"><MapPin size={10} /> Google Maps URL</label>
                                <input 
                                    type="text" 
                                    placeholder="https://goo.gl/maps/..."
                                    value={profile?.mapUrl || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, mapUrl: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-gray-900" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2"><MapPin size={10} /> Full Address</label>
                                <input 
                                    type="text" 
                                    value={profile?.address || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-gray-900" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operational Details */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={16} className="text-rose-500" /> Operational Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Opening Time</label>
                                <input 
                                    type="time" 
                                    value={profile?.openingTime || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, openingTime: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none font-bold" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Closing Time</label>
                                <input 
                                    type="time" 
                                    value={profile?.closingTime || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, closingTime: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none font-bold" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social & Web Presence */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <Globe size={16} className="text-rose-500" /> Social & Web Presence
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Official Website</label>
                                <input 
                                    type="text" 
                                    placeholder="https://www.yourrestuarant.com"
                                    value={profile?.website || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, website: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none font-bold text-gray-900" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Facebook Link</label>
                                <input 
                                    type="text" 
                                    placeholder="https://facebook.com/..."
                                    value={profile?.facebookLink || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, facebookLink: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none font-bold text-gray-900" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Instagram Link</label>
                                <input 
                                    type="text" 
                                    placeholder="https://instagram.com/..."
                                    value={profile?.instagramLink || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, instagramLink: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none font-bold text-gray-900" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">TikTok Link</label>
                                <input 
                                    type="text" 
                                    placeholder="https://tiktok.com/@..."
                                    value={profile?.tiktokLink || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, tiktokLink: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none font-bold text-gray-900" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">YouTube Link</label>
                                <input 
                                    type="text" 
                                    placeholder="https://youtube.com/c/..."
                                    value={profile?.youtubeLink || ""} 
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, youtubeLink: e.target.value } : null)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none font-bold text-gray-900" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
