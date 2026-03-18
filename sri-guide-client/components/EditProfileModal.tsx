"use client";

import React, { useState, useEffect } from "react";
import { X, Save, User, Globe, DollarSign, Award, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/api-client";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    profile: any;
    onSuccess: () => void;
}

const EditProfileModal = ({ isOpen, onClose, user, profile, onSuccess }: EditProfileModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        bio: profile?.bio || "",
        languages: profile?.languages?.join(", ") || "English, Sinhala",
        dailyRate: profile?.dailyRate || 0,
        specialty: profile?.specialty || ""
    });

    useEffect(() => {
        if (user && profile) {
            setFormData({
                fullName: user.fullName,
                bio: profile.bio || "",
                languages: profile.languages?.join(", ") || "English, Sinhala",
                dailyRate: profile.dailyRate || 0,
                specialty: profile.specialty || ""
            });
        }
    }, [user, profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Update User Basic Info
            await apiClient.post("/profiles/update-user", {
                userId: user.id,
                fullName: formData.fullName
            });

            // 2. Update Guide Profile if applicable
            if (user.role === "Guide") {
                await apiClient.post("/profiles/update-guide", {
                    userId: user.id,
                    bio: formData.bio,
                    languages: formData.languages.split(",").map((lang: string) => lang.trim()),
                    dailyRate: formData.dailyRate,
                    specialty: formData.specialty
                });
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
                    >
                        <div className="p-8 md:p-12">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Edit <span className="text-primary">Profile</span></h2>
                                    <p className="text-gray-500 font-medium text-sm">Update your public professional appearance.</p>
                                </div>
                                <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <User size={10} /> Full Name
                                        </label>
                                        <input 
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <Award size={10} /> Specialty
                                        </label>
                                        <input 
                                            type="text"
                                            value={formData.specialty}
                                            onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                            placeholder="e.g. Wildlife Expert"
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                        <Type size={10} /> Biography
                                    </label>
                                    <textarea 
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all resize-none"
                                        placeholder="Tell travelers about your experience..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <Globe size={10} /> Languages (Comma separated)
                                        </label>
                                        <input 
                                            type="text"
                                            value={formData.languages}
                                            onChange={(e) => setFormData({...formData, languages: e.target.value})}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                                            <DollarSign size={10} /> Daily Rate ($)
                                        </label>
                                        <input 
                                            type="number"
                                            value={formData.dailyRate}
                                            onChange={(e) => setFormData({...formData, dailyRate: parseInt(e.target.value)})}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    <span>{loading ? "Saving Changes..." : "Update Profile Now"}</span>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
