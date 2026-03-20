"use client";

import React, { useState, useEffect } from "react";
import { 
    Building2, Phone, MessageSquare, Globe, 
    Facebook, Instagram, Linkedin, Youtube, 
    Twitter, Save, Loader2, Info, CheckCircle2,
    ShieldCheck, Mail, Hash, Camera
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";

interface AgencyProfile {
    id: string;
    companyName: string;
    companyEmail: string;
    registrationNumber: string;
    phone: string;
    whatsApp: string;
    bio: string;
    facebookLink: string;
    instagramLink: string;
    linkedinLink: string;
    tikTokLink: string;
    twitterLink: string;
    youTubeLink: string;
    isVerified: boolean;
    profileImageUrl?: string;
}

export default function AgencyProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<AgencyProfile | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiClient.get<AgencyProfile>("/profile/agency");
                setProfile(res.data);
            } catch (error) {
                console.error("Error fetching agency profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!profile || !user) return;
        setSaving(true);
        setSuccess(false);
        try {
            await apiClient.post("/profile/agency/update", {
                userId: user.id,
                ...profile
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataFile = new FormData();
        formDataFile.append("file", file);

        setSaving(true);
        try {
            const response = await apiClient.post<string>("/profile/upload-photo", formDataFile, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (profile) setProfile({ ...profile, profileImageUrl: response.data });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to upload photo", error);
            alert("Failed to upload photo.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600" />
            </div>
        );
    }

    if (!profile) return <div>Profile not found.</div>;

    const inputClasses = "w-full bg-gray-50 border border-transparent focus:border-teal-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all focus:bg-white";

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                            <Building2 size={24} />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Agency Profile</h1>
                    </div>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] ml-1">Manage your identity and reach</p>
                </div>
                
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="group bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-teal-600 transition-all shadow-2xl shadow-gray-900/20 flex items-center gap-4 active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:rotate-12 transition-transform" />}
                    {saving ? "Saving Changes..." : "Secure Update"}
                </button>
            </div>

            {success && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4 text-emerald-700 shadow-sm"
                >
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest">Profile updated successfully!</p>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Profile Image Section */}
                <div className="md:col-span-12 flex flex-col items-center md:items-start gap-6 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 blur-3xl -z-10" />
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-gray-100 border-4 border-white shadow-xl ring-1 ring-gray-100">
                            <img 
                                src={profile.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${profile.profileImageUrl}` : `https://ui-avatars.com/api/?name=${profile.companyName}&background=F0FDFA&color=0D9488&bold=true`} 
                                alt={profile.companyName} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <input type="file" id="agency-photo-upload" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                        <label 
                            htmlFor="agency-photo-upload"
                            className="absolute -bottom-2 -right-2 p-3 bg-gray-900 text-white rounded-2xl shadow-lg border-4 border-white cursor-pointer hover:bg-teal-600 transition-all active:scale-95 group-hover:scale-110"
                        >
                            <Camera size={18} />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 italic tracking-tight mb-1">Brand Identity</h3>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Upload your official agency logo or a professional photo</p>
                    </div>
                </div>

                {/* Left Column: Essential Info */}
                <div className="md:col-span-12 space-y-8 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Building2 size={12} className="text-teal-600" />
                                Registered Business Name
                            </label>
                            <input 
                                type="text"
                                value={profile.companyName || ""}
                                onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <ShieldCheck size={12} className="text-teal-600" />
                                Registration Number
                            </label>
                            <input 
                                type="text"
                                value={profile.registrationNumber || ""}
                                disabled
                                className={`${inputClasses} opacity-50 cursor-not-allowed`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Mail size={12} className="text-teal-600" />
                                Official Business Email
                            </label>
                            <input 
                                type="email"
                                value={profile.companyEmail || ""}
                                disabled
                                className={`${inputClasses} opacity-50 cursor-not-allowed`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Phone size={12} className="text-teal-600" />
                                Contact Number
                            </label>
                            <input 
                                type="text"
                                value={profile.phone || ""}
                                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Agency Bio</label>
                        <textarea 
                            value={profile.bio || ""}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            rows={6}
                            placeholder="Tell the world about your agency's mission and history..."
                            className={`${inputClasses} resize-none rounded-[2rem] px-8 py-6`}
                        />
                    </div>
                </div>

                {/* Social & Messaging */}
                <div className="md:col-span-12 space-y-8 bg-gray-50/50 p-12 rounded-[3.5rem] border border-dashed border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                            <Globe size={18} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 italic tracking-tight">Social Presence</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <MessageSquare size={12} className="text-teal-600" />
                                WhatsApp Number
                            </label>
                            <input 
                                type="text"
                                value={profile.whatsApp || ""}
                                onChange={e => setProfile({ ...profile, whatsApp: e.target.value })}
                                placeholder="+94 7X XXX XXXX"
                                className={inputClasses + " bg-white shadow-sm"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Facebook size={12} />
                                Facebook Page
                            </label>
                            <input 
                                type="url"
                                value={profile.facebookLink || ""}
                                onChange={e => setProfile({ ...profile, facebookLink: e.target.value })}
                                placeholder="https://facebook.com/your-agency"
                                className={inputClasses + " bg-white shadow-sm"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Instagram size={12} />
                                Instagram Profile
                            </label>
                            <input 
                                type="url"
                                value={profile.instagramLink || ""}
                                onChange={e => setProfile({ ...profile, instagramLink: e.target.value })}
                                placeholder="https://instagram.com/your-agency"
                                className={inputClasses + " bg-white shadow-sm"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Linkedin size={12} />
                                LinkedIn Company
                            </label>
                            <input 
                                type="url"
                                value={profile.linkedinLink || ""}
                                onChange={e => setProfile({ ...profile, linkedinLink: e.target.value })}
                                placeholder="https://linkedin.com/company/your-agency"
                                className={inputClasses + " bg-white shadow-sm"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Youtube size={12} />
                                YouTube Channel
                            </label>
                            <input 
                                type="url"
                                value={profile.youTubeLink || ""}
                                onChange={e => setProfile({ ...profile, youTubeLink: e.target.value })}
                                placeholder="https://youtube.com/c/your-agency"
                                className={inputClasses + " bg-white shadow-sm"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Twitter size={12} />
                                Twitter / X
                            </label>
                            <input 
                                type="url"
                                value={profile.twitterLink || ""}
                                onChange={e => setProfile({ ...profile, twitterLink: e.target.value })}
                                placeholder="https://twitter.com/your-agency"
                                className={inputClasses + " bg-white shadow-sm"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 bg-gray-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-teal-400 text-gray-900 rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl shadow-teal-400/20 rotate-3">
                    <ShieldCheck size={40} />
                </div>
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-black italic tracking-tight">Security & Verification</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xl">
                        {profile.isVerified 
                            ? "Your agency is fully verified. Your profile displays the verification badge and ranks higher in discovery results."
                            : "Your agency verification is currently pending. Once verified, you'll receive a badge and increased visibility."}
                    </p>
                </div>
            </div>
        </div>
    );
}
