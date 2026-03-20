"use client";

import React, { useState } from "react";
import { 
    Building2, MapPin, Globe, Mail, Phone,
    ShieldCheck, Edit3, Camera, Save, X, Building
} from "lucide-react";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";

export default function AgencyProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) return null;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="flex items-end justify-between border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <Building2 className="text-teal-600" size={36} />
                        Agency Profile
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Manage your agency identity and public information</p>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                        isEditing ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-teal-600 text-white hover:bg-teal-700 shadow-xl shadow-teal-600/20"
                    }`}
                >
                    {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Profile</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Branding Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 blur-3xl rounded-full -mr-16 -mt-16" />
                        
                        <div className="relative mb-8">
                            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
                                <img 
                                    src={user.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}&backgroundColor=0d9488`} 
                                    alt={user.fullName}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                />
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-xl">
                                <ShieldCheck size={20} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 tracking-tight italic mb-1">{user.fullName}</h3>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] mb-6">Verified Sri Lankan Agency</p>
                        
                        <div className="w-full pt-6 border-t border-gray-50 space-y-4">
                            <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer justify-center">
                                <Globe size={16} className="text-teal-600" />
                                <span className="text-xs font-bold font-mono">www.sri-guide.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer justify-center">
                                <Mail size={16} className="text-teal-600" />
                                <span className="text-xs font-bold">{user.email || 'contact@agency.com'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/20 blur-3xl -ml-16 -mb-16" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div>
                                <p className="text-3xl font-black italic">4.9</p>
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">Average Rating</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black italic">156</p>
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">Total Travelers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-10">
                            <Building size={20} className="text-teal-600" />
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Agency Credentials</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Agency Name</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditing}
                                    defaultValue={user.fullName}
                                    className={`w-full px-6 py-4 rounded-2xl text-sm font-bold border transition-all ${
                                        isEditing ? "bg-white border-teal-200 focus:ring-4 focus:ring-teal-50 focus:border-teal-500" : "bg-gray-50 border-transparent text-gray-500 cursor-default"
                                    }`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Registration #</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditing}
                                    defaultValue="SLTDA/AG/2024/0042"
                                    className={`w-full px-6 py-4 rounded-2xl text-sm font-bold border transition-all ${
                                        isEditing ? "bg-white border-teal-200 focus:ring-4 focus:ring-teal-50 focus:border-teal-500" : "bg-gray-50 border-transparent text-gray-500 cursor-default"
                                    }`}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Official Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        readOnly={!isEditing}
                                        defaultValue="Level 15, West Tower, World Trade Center, Colombo 01"
                                        className={`w-full pl-14 pr-6 py-4 rounded-2xl text-sm font-bold border transition-all ${
                                            isEditing ? "bg-white border-teal-200 focus:ring-4 focus:ring-teal-50 focus:border-teal-500" : "bg-gray-50 border-transparent text-gray-500 cursor-default"
                                        }`}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Biography / About</label>
                                <textarea 
                                    readOnly={!isEditing}
                                    rows={4}
                                    defaultValue="Leading the way in premium Sri Lankan expeditions. We specialize in luxury multi-day journeys that connect curious travelers with the authentic heart of our island nation. Verified since 2024."
                                    className={`w-full px-6 py-4 rounded-2xl text-sm font-bold border transition-all resize-none ${
                                        isEditing ? "bg-white border-teal-200 focus:ring-4 focus:ring-teal-50 focus:border-teal-500" : "bg-gray-50 border-transparent text-gray-500 cursor-default"
                                    }`}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
                                <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-teal-600 transition-all shadow-xl shadow-gray-200 flex items-center gap-3">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
