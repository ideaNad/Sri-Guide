"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { User, Mail, Loader2, ArrowLeft, Save, Camera } from "lucide-react";
import apiClient from "@/services/api-client";

interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    profileImageUrl: string | null;
}

export default function EditProfilePage() {
    const { user, loading, updateUser } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else {
                fetchProfile();
            }
        }
    }, [user, loading, router]);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get<UserProfile>("/profile/me");
            setProfile(response.data);
            setFullName(response.data.fullName);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        setError(null);
        try {
            const response = await apiClient.post<string>("/profile/upload-photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (profile) {
                const updatedProfile = { ...profile, profileImageUrl: response.data };
                setProfile(updatedProfile);
                updateUser({ profileImageUrl: response.data });
            }
        } catch (err: any) {
            console.error("Failed to upload photo", err);
            setError(err.response?.data?.message || "Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await apiClient.post("/profile/update-user", {
                userId: user.id,
                fullName: fullName,
                profileImageUrl: profile?.profileImageUrl
            });
            updateUser({ fullName: fullName, profileImageUrl: profile?.profileImageUrl ?? undefined });
            setSuccess(true);
            setTimeout(() => router.push('/dashboard/profile'), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const getImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4 group font-bold text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <User className="text-primary" size={28} />
                        Edit Profile
                    </h1>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <form onSubmit={handleSubmit} className="space-y-8 relative">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl text-sm font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                            Profile updated successfully! Redirecting...
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 opacity-60">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Locked)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email"
                                        value={profile?.email}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div 
                            className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 group hover:border-primary/30 transition-all cursor-pointer relative"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white shadow-sm mb-4 relative">
                                {uploading ? (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <Loader2 size={24} className="text-primary animate-spin" />
                                    </div>
                                ) : null}
                                <img 
                                    src={getImageUrl(profile?.profileImageUrl ?? null) || `https://ui-avatars.com/api/?name=${fullName}&background=random`} 
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                {uploading ? "Uploading..." : "Click to change photo"}
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 flex justify-end">
                        <button 
                            type="submit"
                            disabled={saving || uploading}
                            className="flex items-center gap-2 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-gray-200 hover:shadow-primary/20 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
