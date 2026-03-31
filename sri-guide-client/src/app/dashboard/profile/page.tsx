"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldCheck, MapPin, Calendar, Edit3, Loader2, Compass, Camera } from "lucide-react";
import apiClient from "@/services/api-client";

interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    profileImageUrl: string | null;
    createdAt: string;
}

export default function ProfilePage() {
    const { user, loading, updateUser } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

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
        try {
            const response = await apiClient.post<string>("/profile/upload-photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // Update local profile state and auth user image
            if (profile) {
                setProfile({ ...profile, profileImageUrl: response.data });
            }
            updateUser({ profileImageUrl: response.data });
        } catch (error) {
            console.error("Failed to upload photo", error);
        } finally {
            setUploading(false);
        }
    };

    const getImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const initials = getInitials(user.fullName);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <User className="text-primary" size={28} />
                    My Profile
                </h1>
                <p className="text-gray-500 font-medium mt-1">Manage your account information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 border border-gray-100 bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center">
                    <div className="relative group cursor-pointer">
                        <input 
                            type="file" 
                            className="hidden" 
                            id="profile-upload" 
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <label htmlFor="profile-upload" className="cursor-pointer block">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-primary/5 shadow-inner mb-6 relative group-hover:border-primary/20 transition-all flex items-center justify-center bg-gray-50">
                                {profile?.profileImageUrl ? (
                                    <img 
                                        src={getImageUrl(profile.profileImageUrl)!} 
                                        alt={user.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-black text-primary/40 tracking-tighter">{initials}</span>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 flex items-center justify-center transition-all">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>
                        </label>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-1">{user.fullName}</h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">{user.role}</p>
                    
                    <div className="w-full space-y-3 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-3 rounded-2xl overflow-hidden">
                            <Mail size={16} className="text-primary/70 shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </div>
                    </div>

                    <button 
                        className="w-full mt-8 flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-gray-200"
                        onClick={() => router.push('/dashboard/profile/edit')}
                    >
                        <Edit3 size={18} />
                        Edit Profile
                    </button>
                </div>

                {/* Account Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                        
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            Account Overview
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                                <p className="text-gray-900 font-bold">{user.fullName}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                <p className="text-gray-900 font-bold">{user.email}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</p>
                                <p className="text-gray-900 font-bold flex items-center gap-2">
                                    <Calendar size={14} className="text-primary" />
                                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2026"}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Role</p>
                                <p className="text-gray-900 font-bold flex items-center gap-2">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
