"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api-client";
import { 
    User as UserIcon, Briefcase, Globe, DollarSign, 
    Save, AlertCircle, CheckCircle2,
    ShieldCheck, Award, MapPin, Camera
} from "lucide-react";
import { motion } from "framer-motion";
import { Profile } from "@/types";

const GuideProfileManagement = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [profile, setProfile] = useState<Profile | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        languages: [] as string[],
        specialty: "",
        dailyRate: 0,
        yearsOfExperience: 0,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get("/profile/me");
                const p = response.data as Profile;
                setProfile(p);
                setFormData({
                    fullName: p.fullName || "",
                    bio: p.guideProfile?.bio || "",
                    languages: p.guideProfile?.languages || [],
                    specialty: p.guideProfile?.specialty || "",
                    dailyRate: p.guideProfile?.dailyRate || 0,
                    yearsOfExperience: p.guideProfile?.yearsOfExperience || 0,
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLanguageChange = (lang: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            // Update User Info
            await apiClient.post("/profile/update-user", { fullName: formData.fullName });
            
            // Update Guide Info
            await apiClient.post("/profile/update-guide", {
                bio: formData.bio,
                languages: formData.languages,
                specialty: formData.specialty,
                dailyRate: Number(formData.dailyRate),
                yearsOfExperience: Number(formData.yearsOfExperience)
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">My Professional Profile</h2>
                    <p className="text-gray-500 font-medium italic">Manage how you appear to potential travelers.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                </button>
            </div>

            {message.text && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${
                        message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-rose-50 text-rose-500 border border-rose-100"
                    }`}
                >
                    {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span>{message.text}</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                {/* Visual/Stats Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center relative overflow-hidden group">
                        <div className="relative w-40 h-40 mx-auto mb-6">
                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-100 border-4 border-white shadow-xl">
                                <img 
                                    src={profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`} 
                                    alt={user?.fullName} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 p-3 bg-gray-900 text-white rounded-2xl shadow-lg border-4 border-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{formData.fullName}</h3>
                        <p className="text-primary font-bold text-xs uppercase tracking-widest mb-6">{formData.specialty || "Guide"}</p>
                        
                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-xs uppercase">
                                    <ShieldCheck size={12} />
                                    <span>Verified</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                                <p className="text-gray-900 font-black text-xs uppercase tracking-widest">4.9 (42 Reviews)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-900/10 relative overflow-hidden">
                        <Award className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-primary" />
                            <span>Trust & Safety</span>
                        </h4>
                        <div className="space-y-6 relative z-10">
                            {[
                                { label: "Government License", status: "Verified" },
                                { label: "First Aid Certified", status: "Verified" },
                                { label: "Identity Document", status: "Verified" }
                            ].map(doc => (
                                <div key={doc.label} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/60">{doc.label}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">{doc.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Fields Section */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info Panel */}
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm relative">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-gray-50 rounded-2xl text-primary"><UserIcon size={24} /></div>
                            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Public Name</label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Main Specialty</label>
                                <input 
                                    type="text" 
                                    name="specialty"
                                    placeholder="e.g. Hiking & Wildlife"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Bio */}
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm">
                         <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-gray-50 rounded-2xl text-primary"><Briefcase size={24} /></div>
                            <h3 className="text-xl font-bold text-gray-900">Professional Bio</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 px-1">Describe your expertise and what makes you unique</label>
                            <textarea 
                                name="bio"
                                rows={6}
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell travelers about your experience, your passion for Sri Lanka, and the hidden gems you can show them..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-8 font-medium text-gray-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none leading-relaxed italic"
                            />
                        </div>
                    </div>

                    {/* Pricing & Languages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                         <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gray-50 rounded-2xl text-primary"><DollarSign size={20} /></div>
                                <h3 className="text-lg font-bold text-gray-900">Pricing & Experience</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Daily Rate (USD)</label>
                                    <input 
                                        type="number" 
                                        name="dailyRate"
                                        value={formData.dailyRate}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-black text-gray-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Years of Experience</label>
                                    <input 
                                        type="number" 
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-black text-gray-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8 text-primary">
                                <div className="p-3 bg-gray-50 rounded-2xl"><Globe size={20} /></div>
                                <h3 className="text-lg font-bold text-gray-900">Languages</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["English", "Sinhala", "Tamil", "French", "German", "Chinese", "Russian", "Japanese"].map(lang => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                                            formData.languages.includes(lang)
                                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideProfileManagement;
