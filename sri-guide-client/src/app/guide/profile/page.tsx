"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";
import { 
    User, Briefcase, Globe, DollarSign, 
    Save, AlertCircle, CheckCircle2,
    ShieldCheck, Award, MapPin, Camera,
    ChevronDown, ChevronUp, Plus, Instagram, 
    Twitter, Linkedin, Star, Clock, Languages,
    X, Phone, MessageCircle, Youtube, Facebook,
    UserCircle, Settings, HelpCircle,
    Zap, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Profile } from "@/types";

// --- Dummy Data ---
const DUMMY_FEEDBACK: { id: string; user: string; date: string; text: string; rating: number }[] = [];



const COMMON_LANGUAGES = ["English", "Sinhala", "Tamil", "German", "French", "Italian", "Japanese", "Chinese", "Russian", "Arabic"];
const COMMON_AREAS = ["Colombo", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Mirissa", "Sigiriya", "Anuradhapura", "Polonnaruwa", "Yala", "Trincomalee", "Jaffna"];

// --- Helper Components ---

interface SectionCardProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SectionCard = ({ icon: Icon, title, children }: SectionCardProps) => (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm shadow-gray-200/50">
        <div className="flex items-center gap-4 p-8 border-b border-gray-50 bg-gray-50/30">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{title}</h3>
        </div>
        <div className="p-8">
            {children}
        </div>
    </div>
);

// --- Main Page Component ---

export default function GuideProfilePage() {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [dashboardData, setDashboardData] = useState<{ averageRating: number; totalBookings: number } | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        specialties: [] as string[],
        dailyRate: 0,
        hourlyRate: 0,
        contactForPrice: false,
        languages: [] as string[],
        operatingAreas: [] as string[], 
        phoneNumber: "",
        whatsAppNumber: "",
        youTubeLink: "",
        tikTokLink: "",
        facebookLink: "",
        instagramLink: "",
        twitterLink: "",
        linkedinLink: "",
        registrationNumber: "",
        licenseExpirationDate: "",
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiClient.get<Profile>("/profile/me");
                const data = response.data;
                setProfile(data);

                try {
                    const dashboardRes = await apiClient.get<{ averageRating: number; totalBookings: number }>("/profile/guide-dashboard");
                    setDashboardData(dashboardRes.data);
                } catch (e) {
                    console.error("Failed to fetch dashboard stats", e);
                }
                
                // Initialize form states
                setFormData(prev => ({
                    ...prev,
                    fullName: data.fullName || "",
                    bio: data.guideProfile?.bio || "",
                    specialties: data.guideProfile?.specialties || [],
                    dailyRate: data.guideProfile?.dailyRate || 0,
                    hourlyRate: data.guideProfile?.hourlyRate || 0,
                    contactForPrice: data.guideProfile?.contactForPrice || false,
                    languages: data.guideProfile?.languages || [],
                    operatingAreas: data.guideProfile?.operatingAreas || [],
                    phoneNumber: data.guideProfile?.phoneNumber || "",
                    whatsAppNumber: data.guideProfile?.whatsAppNumber || "",
                    youTubeLink: data.guideProfile?.youTubeLink || "",
                    tikTokLink: data.guideProfile?.tikTokLink || "",
                    facebookLink: data.guideProfile?.facebookLink || "",
                    instagramLink: data.guideProfile?.instagramLink || "",
                    twitterLink: data.guideProfile?.twitterLink || "",
                    linkedinLink: data.guideProfile?.linkedinLink || "",
                    registrationNumber: data.guideProfile?.registrationNumber || "",
                    licenseExpirationDate: data.guideProfile?.licenseExpirationDate 
                        ? new Date(data.guideProfile.licenseExpirationDate).toISOString().split('T')[0] 
                        : "",
                }));
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    useEffect(() => {
        if (!loading && window.location.hash === '#verification') {
            setTimeout(() => {
                const element = document.getElementById('verification');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    }, [loading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        setMessage(null);

        // Validation for URLs and Phones
        const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
            setMessage({ type: "error", text: "Invalid Phone Number format. Use +CountryCode format." });
            setSaving(false);
            return;
        }
        if (formData.whatsAppNumber && !phoneRegex.test(formData.whatsAppNumber)) {
            setMessage({ type: "error", text: "Invalid WhatsApp Number format. Use +CountryCode format." });
            setSaving(false);
            return;
        }

        const socialFields = ['youTubeLink', 'tikTokLink', 'facebookLink', 'instagramLink', 'twitterLink', 'linkedinLink'] as const;
        for (const field of socialFields) {
            const val = formData[field];
            if (val && !urlRegex.test(val)) {
                setMessage({ type: "error", text: `Invalid URL format for ${field.replace('Link', '')}. Please include https://` });
                setSaving(false);
                return;
            }
        }

        try {
            // 1. Update User Profile
            await apiClient.post("/profile/update-user", { 
                userId: profile.id,
                fullName: formData.fullName 
            });

            // 2. Update Guide Profile
            const updatePayload = {
                userId: profile.id,
                bio: formData.bio,
                specialties: formData.specialties,
                operatingAreas: formData.operatingAreas,
                hourlyRate: Number(formData.hourlyRate),
                dailyRate: Number(formData.dailyRate),
                contactForPrice: formData.contactForPrice,
                languages: formData.languages,
                phoneNumber: formData.phoneNumber,
                whatsAppNumber: formData.whatsAppNumber,
                youTubeLink: formData.youTubeLink,
                tikTokLink: formData.tikTokLink,
                facebookLink: formData.facebookLink,
                instagramLink: formData.instagramLink,
                twitterLink: formData.twitterLink,
                linkedinLink: formData.linkedinLink
            };
            
            await apiClient.post("/profile/update-guide", updatePayload);

            setMessage({ type: "success", text: "Profile updated successfully!" });
            
            if (user) {
                login({ ...user, fullName: formData.fullName });
            }
            
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
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
            if (user) login({ ...user, profileImageUrl: response.data });
            setMessage({ type: "success", text: "Profile picture updated!" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to upload photo." });
        } finally {
            setSaving(false);
        }
    };

    const handleRequestVerification = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await apiClient.post("/profile/request-verification", {
                registrationNumber: formData.registrationNumber,
                licenseExpirationDate: formData.licenseExpirationDate
            });
            setMessage({ type: "success", text: "Verification request submitted! Admin will review it soon." });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Failed to submit verification", error);
            setMessage({ type: "error", text: "Failed to submit verification request. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-32">
            {/* --- TOP Banner --- */}

        <div className="max-w-[1000px] mx-auto space-y-12">
            {/* Guide Identity Section */}
            <SectionCard icon={User} title="Guide Identity">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="relative group mx-auto md:mx-0">
                                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden bg-gray-100 border-4 border-white shadow-xl">
                                        <img 
                                            src={profile?.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${profile.profileImageUrl}` : `https://ui-avatars.com/api/?name=${formData.fullName}&background=random`} 
                                            alt={formData.fullName} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <input type="file" id="photo-upload" className="hidden" onChange={handlePhotoUpload} />
                                    <label 
                                        htmlFor="photo-upload"
                                        className="absolute bottom-2 right-2 p-3 bg-gray-900 text-white rounded-2xl shadow-lg border-4 border-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary cursor-pointer"
                                    >
                                        <Camera size={18} />
                                    </label>
                                </div>
                                <div className="flex-1 space-y-6 w-full">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Alex Rivers"
                                            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">Professional Bio</label>
                                        <textarea 
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tell potential tourists about your knowledge and passion..."
                                            className="w-full bg-gray-50 border border-transparent rounded-[2rem] p-6 font-medium text-gray-700 outline-none focus:bg-white focus:border-primary/20 transition-all text-sm resize-none leading-relaxed"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">Mobile (+94...)</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input 
                                                    type="tel" 
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleChange}
                                                    placeholder="+94 77 123 4567"
                                                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">WhatsApp (+94...)</label>
                                            <div className="relative group">
                                                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input 
                                                    type="tel" 
                                                    name="whatsAppNumber"
                                                    value={formData.whatsAppNumber}
                                                    onChange={handleChange}
                                                    placeholder="+94 77 123 4567"
                                                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
            </SectionCard>

            {/* Professional Details Section */}
            <SectionCard icon={Briefcase} title="Professional Details">
                            <div className="space-y-8">
                                {/* Languages */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-4 block flex items-center gap-2">
                                        <Globe size={12} className="text-primary" /> Languages
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {formData.languages.map(lang => (
                                            <span key={lang} className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                                {lang}
                                                <button 
                                                    onClick={() => setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }))}
                                                    className="text-gray-400 hover:text-rose-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        <select 
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val && !formData.languages.includes(val)) {
                                                    setFormData(prev => ({ ...prev, languages: [...prev.languages, val] }));
                                                }
                                            }}
                                            className="bg-gray-50 border border-dashed border-gray-300 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 outline-none cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <option value="">+ Add Language</option>
                                            {COMMON_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Operating Areas */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-4 block flex items-center gap-2">
                                        <MapPin size={12} className="text-primary" /> Operating Areas
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.operatingAreas.map(area => (
                                            <span key={area} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                                {area}
                                                <button 
                                                    onClick={() => setFormData(prev => ({ ...prev, operatingAreas: prev.operatingAreas.filter(a => a !== area) }))}
                                                    className="text-emerald-400 hover:text-emerald-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        <select 
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val && !formData.operatingAreas.includes(val)) {
                                                    setFormData(prev => ({ ...prev, operatingAreas: [...prev.operatingAreas, val] }));
                                                }
                                                e.target.value = ''; // reset after selection
                                            }}
                                            className="bg-gray-50 border border-dashed border-gray-300 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 outline-none cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <option value="">+ Add Area</option>
                                            {COMMON_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Specialties */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-4 block flex items-center gap-2">
                                        <Star size={12} className="text-primary" /> Specialties
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.specialties.map((s, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                                {s}
                                                <button 
                                                    onClick={() => setFormData(prev => ({ ...prev, specialties: prev.specialties.filter((_, idx) => idx !== i) }))}
                                                    className="text-blue-400 hover:text-blue-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        <input 
                                            placeholder="Type Specialty & Press Enter"
                                            className="bg-gray-50 border border-dashed border-gray-300 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 outline-none hover:border-primary transition-colors flex-1 min-w-[200px]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val && !formData.specialties.includes(val)) {
                                                        setFormData(prev => ({ ...prev, specialties: [...prev.specialties, val] }));
                                                    }
                                                    e.currentTarget.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
            </SectionCard>

            {/* Service Rates Section */}
            <SectionCard icon={DollarSign} title="Service Rates">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">Pricing Model</label>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { id: 'hourly', label: 'Hourly Rate', icon: Clock },
                                            { id: 'daily', label: 'Daily Rate', icon: Zap },
                                            { id: 'negotiable', label: 'Contact for Rates', icon: MessageCircle }
                                        ].map((model) => (
                                            <label 
                                                key={model.id}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                                    (model.id === 'negotiable' && formData.contactForPrice) || 
                                                    (model.id !== 'negotiable' && !formData.contactForPrice && (model.id === 'hourly' ? formData.hourlyRate > 0 : formData.dailyRate > 0))
                                                    ? 'bg-blue-50/50 border-primary text-primary' 
                                                    : 'bg-gray-50/50 border-transparent text-gray-500 hover:border-gray-200'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="pricing" 
                                                    className="hidden"
                                                    checked={model.id === 'negotiable' ? formData.contactForPrice : !formData.contactForPrice}
                                                    onChange={() => setFormData(prev => ({ ...prev, contactForPrice: model.id === 'negotiable' }))}
                                                />
                                                <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                                                    {((model.id === 'negotiable' && formData.contactForPrice) || 
                                                    (model.id !== 'negotiable' && !formData.contactForPrice && (model.id === 'hourly' ? formData.hourlyRate > 0 : formData.dailyRate > 0))) && 
                                                    <div className="w-2.5 h-2.5 bg-current rounded-full" />}
                                                </div>
                                                <model.icon size={18} />
                                                <span className="text-xs font-black uppercase tracking-widest">{model.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">Daily Rate (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">$</span>
                                            <input 
                                                type="number" 
                                                name="dailyRate"
                                                value={formData.dailyRate}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-transparent rounded-3xl py-6 px-12 text-3xl font-black text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">Hourly Rate (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">$</span>
                                            <input 
                                                type="number" 
                                                name="hourlyRate"
                                                value={formData.hourlyRate}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-transparent rounded-3xl py-6 px-12 text-3xl font-black text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-medium text-gray-400 leading-relaxed px-2">
                                        These rates will be displayed on your public profile. Select &quot;Contact for Rates&quot; if you prefer to negotiate.
                                    </p>
                                </div>
                            </div>
            </SectionCard>

            {/* Verification Section */}
            <div id="verification">
                <SectionCard icon={ShieldCheck} title="Verification (Licensed Guide Badge)">
                            <div className="space-y-6">
                                <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                                    Provide your official registration details to receive the <span className="text-emerald-600 font-bold">LICENSED GUIDE</span> badge.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">Registration Number</label>
                                        <input
                                            type="text"
                                            name="registrationNumber"
                                            value={formData.registrationNumber}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all text-sm"
                                            placeholder="SLTDA/G/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-1 mb-2 block">License Expiry Date</label>
                                        <input
                                            type="date"
                                            name="licenseExpirationDate"
                                            value={formData.licenseExpirationDate}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:bg-white focus:border-primary/20 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequestVerification}
                                    disabled={saving || !formData.registrationNumber || !formData.licenseExpirationDate}
                                    className="w-full bg-emerald-50 text-emerald-700 border border-emerald-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {saving ? "Processing..." : "Submit for Verification"}
                                </button>
                            </div>
                </SectionCard>
            </div>

            {/* Social Presence Section */}
            <SectionCard icon={Instagram} title="Social Presence">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { name: 'instagramLink', label: 'Instagram Profile URL', icon: Instagram, hex: '#E1306C' },
                                    { name: 'twitterLink', label: 'Twitter / X Profile URL', icon: Twitter, hex: '#1DA1F2' },
                                    { name: 'linkedinLink', label: 'LinkedIn Profile URL', icon: Linkedin, hex: '#0A66C2' },
                                    { name: 'youTubeLink', label: 'YouTube Channel URL', icon: Youtube, hex: '#FF0000' },
                                    { name: 'facebookLink', label: 'Facebook Page URL', icon: Facebook, hex: '#1877F2' },
                                    { name: 'tikTokLink', label: 'TikTok Profile URL', icon: MessageCircle, hex: '#000000' }
                                ].map((social) => {
                                    return (
                                        <div key={social.name}>
                                            <div className="relative group">
                                                <div 
                                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all"
                                                    style={{ backgroundColor: `${social.hex}15`, color: social.hex }}
                                                >
                                                    <social.icon size={16} />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    name={social.name}
                                                    value={formData[social.name as keyof typeof formData] as string}
                                                    onChange={handleChange}
                                                    placeholder={social.label}
                                                    className="w-full bg-gray-50 border rounded-2xl py-4 pl-16 pr-6 font-bold text-gray-900 outline-none focus:bg-white transition-all text-sm border-transparent"
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = social.hex;
                                                        e.currentTarget.style.backgroundColor = 'white';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = 'transparent';
                                                        e.currentTarget.style.backgroundColor = '';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
            </SectionCard>


                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`p-5 rounded-3xl border flex items-center gap-4 ${
                                message.type === "success" 
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                                    : "bg-rose-50 border-rose-100 text-rose-700"
                            }`}
                        >
                            {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            <p className="font-bold text-sm">{message.text}</p>
                            <button onClick={() => setMessage(null)} className="ml-auto p-2 hover:bg-black/5 rounded-full">
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center md:text-left">
                        © 2026 SriGuide • Premium Global Travel
                    </p>
                    <div className="flex items-center gap-6">
                        <button className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-rose-500 transition-colors">Discard</button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                            <span>Save Profile Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
