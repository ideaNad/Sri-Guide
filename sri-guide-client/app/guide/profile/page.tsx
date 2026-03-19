"use client";

import React, { useEffect, useState } from "react";
import { 
    User, Mail, Phone, MapPin, Globe, 
    Briefcase, Save, Star, ShieldCheck, 
    X, Plus, Languages, DollarSign, Clock, 
    Camera, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    guideProfile: {
        bio: string;
        languages: string[];
        dailyRate: number;
        hourlyRate: number;
        verificationStatus: number;
        specialty: string;
    } | null;
}

const COMMON_LANGUAGES = ["English", "Sinhala", "Tamil", "German", "French", "Italian", "Japanese", "Chinese", "Russian", "Arabic"];

export default function GuideProfilePage() {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form states
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [dailyRate, setDailyRate] = useState(0);
    const [hourlyRate, setHourlyRate] = useState(0);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [newLanguage, setNewLanguage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get<ProfileData>("/profile/me");
                const data = response.data;
                setProfile(data);
                
                // Initialize form states
                setFullName(data.fullName || "");
                if (data.guideProfile) {
                    setBio(data.guideProfile.bio || "");
                    setSpecialty(data.guideProfile.specialty || "");
                    setDailyRate(data.guideProfile.dailyRate || 0);
                    setHourlyRate(data.guideProfile.hourlyRate || 0);
                    setSelectedLanguages(data.guideProfile.languages || []);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setMessage({ type: "error", text: "Failed to load profile data." });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        setMessage(null);

        try {
            // 1. Update User Profile (FullName)
            await apiClient.post("/profile/update-user", {
                userId: profile.id,
                fullName: fullName
            });

            // 2. Update Guide Profile
            await apiClient.post("/profile/update-guide", {
                userId: profile.id,
                bio: bio,
                specialty: specialty,
                dailyRate: dailyRate,
                hourlyRate: hourlyRate,
                languages: selectedLanguages
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
            
            // Update local user context if name changed
            if (user) {
                login({ ...user, fullName });
            }

            // Scroll to top to see message
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            console.error("Failed to update profile", error);
            setMessage({ type: "error", text: axiosError.response?.data?.message || "Something went wrong while saving." });
        } finally {
            setSaving(false);
        }
    };

    const addLanguage = (lang: string) => {
        if (lang && !selectedLanguages.includes(lang)) {
            setSelectedLanguages([...selectedLanguages, lang]);
            setNewLanguage("");
        }
    };

    const removeLanguage = (lang: string) => {
        setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">My Profile</h1>
                <p className="text-gray-500 font-bold mt-2">Manage your identity and professional information.</p>
            </div>

            {/* Notification */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-6 rounded-3xl border flex items-center gap-4 ${
                            message.type === "success" 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                                : "bg-rose-50 border-rose-100 text-rose-700"
                        }`}
                    >
                        {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <p className="font-black text-sm uppercase tracking-widest">{message.text}</p>
                        <button onClick={() => setMessage(null)} className="ml-auto p-2 hover:bg-black/5 rounded-full">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Image & Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center relative overflow-hidden group">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-4xl font-black text-gray-300 border-4 border-white shadow-xl">
                                {fullName.charAt(0)}
                            </div>
                            <button className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-secondary transition-all">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 className="text-xl font-black text-gray-900 leading-none">{fullName}</h2>
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-2 mb-4">Certified Local Guide</p>
                        
                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 rounded-2xl w-fit mx-auto">
                            <ShieldCheck size={14} className={profile?.isVerified ? "text-primary" : "text-gray-300"} />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${profile?.isVerified ? "text-gray-900" : "text-gray-400"}`}>
                                {profile?.isVerified ? "Verified Professional" : "Verification Pending"}
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             Platform Reputation
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/50 font-bold uppercase tracking-widest">Public Rating</span>
                                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                                    <Star size={14} className="text-primary fill-primary" />
                                    <span className="font-black text-sm italic">4.8</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/50 font-bold uppercase tracking-widest">Tours Completed</span>
                                <span className="font-black text-lg italic">24</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-900">
                                <User size={20} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 uppercase italic">Basic Information</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">Full Legal Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700"
                                    placeholder="e.g. Kasun Perera"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">Email Address (Read-only)</label>
                                <input
                                    type="email"
                                    value={profile?.email || ""}
                                    readOnly
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 font-bold text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Guiding Details */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-900">
                                <Briefcase size={20} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 uppercase italic">Professional Details</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">Primary Specialty</label>
                                <input
                                    type="text"
                                    value={specialty}
                                    onChange={e => setSpecialty(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700"
                                    placeholder="e.g. Wildlife, Ancient History, Surfing"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">Your Bio (Profile Headline)</label>
                                <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 resize-none leading-relaxed"
                                    placeholder="Tell potential tourists about your knowledge and passion..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">Daily Rate (USD)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={dailyRate}
                                            onChange={e => setDailyRate(Number(e.target.value))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block">Hourly Rate (USD)</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={hourlyRate}
                                            onChange={e => setHourlyRate(Number(e.target.value))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2 block flex items-center gap-2">
                                    <Languages size={10} /> Languages You Speak
                                </label>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedLanguages.map(lang => (
                                        <span key={lang} className="bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group">
                                            {lang}
                                            <button onClick={() => removeLanguage(lang)} className="hover:text-rose-500 transition-colors">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 outline-none font-bold text-xs"
                                        value={newLanguage}
                                        onChange={e => addLanguage(e.target.value)}
                                    >
                                        <option value="">Add a language...</option>
                                        {COMMON_LANGUAGES.filter(l => !selectedLanguages.includes(l)).map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center px-4 bg-gray-100 rounded-xl text-gray-400 text-[10px] font-black">
                                        OR ENTER
                                    </div>
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 outline-none font-bold text-xs"
                                        placeholder="e.g. Spanish"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addLanguage((e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = "";
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gray-900 text-white font-black px-12 py-5 rounded-[2rem] shadow-xl hover:bg-primary transition-all flex items-center gap-3 group active:scale-[0.98] disabled:opacity-50 uppercase text-xs tracking-[0.2em]"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Save Profile</span>
                                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
