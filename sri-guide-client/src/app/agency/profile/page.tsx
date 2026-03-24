"use client";

import React, { useState, useEffect } from "react";
import { 
    Building2, Phone, MessageSquare, Globe, 
    Facebook, Instagram, Linkedin, Youtube, 
    Twitter, Save, Loader2, Info, CheckCircle2,
    ShieldCheck, Mail, Camera, User, Briefcase, 
    MapPin, Star, Languages as LangIcon, X, Plus,
    DollarSign, Clock, Zap, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Profile, AgencyProfile, GuideProfile } from "@/types";

const XIcon = ({ size }: { size?: number }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const COMMON_LANGUAGES = ["English", "Sinhala", "Tamil", "German", "French", "Italian", "Japanese", "Chinese", "Russian", "Arabic"];
const COMMON_AREAS = ["Colombo", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Mirissa", "Sigiriya", "Anuradhapura", "Polonnaruwa", "Yala", "Trincomalee", "Jaffna", "Kataragama", "Arugam Bay", "Horton Plains", "Sinharaja", "Dambulla", "Matara", "Hikkaduwa", "Bentota", "Negombo", "Kalpitiya", "Kitulgala", "Adam's Peak", "Pinnawala", "Haputale", "Udawalawe", "Wilpattu", "Pasikudah", "Nilaveli", "Batticaloa", "Mannar", "Minneriya", "Koggala", "Unawatuna", "Weligama", "Tangalle", "Dickwella", "Mihintale", "Kurunegala", "Ratnapura", "Kegalle", "Badulla", "Bandarawela"];

export default function AgencyProfilePage() {
    const { user, login } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"agency" | "owner">("agency");
    const [profile, setProfile] = useState<Profile | null>(null);
    const [success, setSuccess] = useState(false);
    const [pricingModel, setPricingModel] = useState<'hourly' | 'daily' | 'negotiable'>('daily');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiClient.get<Profile>("/profile/me");
                setProfile(res.data);
                
                if (res.data.guideProfile) {
                    let initialModel: 'hourly' | 'daily' | 'negotiable' = 'daily';
                    if (res.data.guideProfile.contactForPrice) initialModel = 'negotiable';
                    else if ((res.data.guideProfile.hourlyRate ?? 0) > 0) initialModel = 'hourly';
                    setPricingModel(initialModel);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveAgency = async () => {
        if (!profile?.agencyProfile || !user) return;
        setSaving(true);
        setSuccess(false);
        try {
            await apiClient.post("/profile/agency/update", {
                userId: user.id,
                ...profile.agencyProfile
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error updating agency profile:", error);
            toast.error("Failed to update agency profile.", "Update Failed");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveOwner = async () => {
        if (!profile || !user) return;
        setSaving(true);
        setSuccess(false);
        try {
            // Update User Full Name first if changed? Usually owner name is user name.
            await apiClient.post("/profile/update-user", {
                userId: user.id,
                fullName: profile.fullName
            });

            const guidePayload = {
                userId: user.id,
                bio: profile.guideProfile?.bio || "",
                specialties: profile.guideProfile?.specialties || [],
                operatingAreas: profile.guideProfile?.operatingAreas || [],
                hourlyRate: pricingModel === 'hourly' ? Number(profile.guideProfile?.hourlyRate || 0) : 0,
                dailyRate: pricingModel === 'daily' ? Number(profile.guideProfile?.dailyRate || 0) : 0,
                contactForPrice: pricingModel === 'negotiable',
                languages: profile.guideProfile?.languages || [],
                phoneNumber: profile.guideProfile?.phoneNumber || "",
                whatsAppNumber: profile.guideProfile?.whatsAppNumber || "",
                youTubeLink: profile.guideProfile?.youTubeLink || "",
                tikTokLink: profile.guideProfile?.tikTokLink || "",
                facebookLink: profile.guideProfile?.facebookLink || "",
                instagramLink: profile.guideProfile?.instagramLink || "",
                twitterLink: profile.guideProfile?.twitterLink || "",
                linkedinLink: profile.guideProfile?.linkedinLink || "",
                registrationNumber: profile.guideProfile?.registrationNumber || "",
                licenseExpirationDate: profile.guideProfile?.licenseExpirationDate || ""
            };

            await apiClient.post("/profile/update-guide", guidePayload);
            
            if (user) login({ ...user, fullName: profile.fullName });
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error updating owner profile:", error);
            toast.error("Failed to update owner profile.", "Update Failed");
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
            if (profile) {
                setProfile({ ...profile, profileImageUrl: response.data });
                if (user) login({ ...user, profileImageUrl: response.data });
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to upload photo", error);
            toast.error("Failed to upload photo.", "Upload Error");
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
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                            {activeTab === "agency" ? <Building2 size={24} /> : <User size={24} />}
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
                            {activeTab === "agency" ? "Agency Profile" : "Owner Profile"}
                        </h1>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
                        <button 
                            onClick={() => setActiveTab("agency")}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "agency" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            Agency
                        </button>
                        <button 
                            onClick={() => setActiveTab("owner")}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "owner" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            Owner Details
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={activeTab === "agency" ? handleSaveAgency : handleSaveOwner}
                    disabled={saving}
                    className="group bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-teal-600 transition-all shadow-2xl shadow-gray-900/20 flex items-center gap-4 active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:rotate-12 transition-transform" />}
                    {saving ? "Saving..." : "Secure Update"}
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

            <AnimatePresence mode="wait">
                {activeTab === "agency" ? (
                    <motion.div 
                        key="agency"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-10"
                    >
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center md:items-start gap-6 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 blur-3xl -z-10" />
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-gray-100 border-4 border-white shadow-xl ring-1 ring-gray-100">
                                    <img 
                                        src={profile.profileImageUrl ? `${apiClient.defaults.baseURL?.replace('/api', '')}${profile.profileImageUrl}` : `https://ui-avatars.com/api/?name=${profile.agencyProfile?.companyName}&background=F0FDFA&color=0D9488&bold=true`} 
                                        alt={profile.agencyProfile?.companyName} 
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
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Upload your official agency logo</p>
                            </div>
                        </div>

                        {/* Agency Details */}
                        <div className="space-y-8 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <Building2 size={12} className="text-teal-600" />
                                        Business Name
                                    </label>
                                    <input 
                                        type="text"
                                        value={profile.agencyProfile?.companyName || ""}
                                        onChange={e => setProfile({ ...profile, agencyProfile: { ...profile.agencyProfile!, companyName: e.target.value } })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <ShieldCheck size={12} className="text-teal-600" />
                                        Registration
                                    </label>
                                    <input 
                                        type="text"
                                        value={profile.agencyProfile?.registrationNumber || ""}
                                        disabled
                                        className={`${inputClasses} opacity-50 cursor-not-allowed`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <Mail size={12} className="text-teal-600" />
                                        Business Email
                                    </label>
                                    <input 
                                        type="email"
                                        value={profile.agencyProfile?.companyEmail || ""}
                                        disabled
                                        className={`${inputClasses} opacity-50 cursor-not-allowed`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <MapPin size={12} className="text-teal-600" />
                                        Company Address
                                    </label>
                                    <input 
                                        type="text"
                                        value={profile.agencyProfile?.companyAddress || ""}
                                        onChange={e => setProfile({ ...profile, agencyProfile: { ...profile.agencyProfile!, companyAddress: e.target.value } })}
                                        placeholder="Full business address"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <Phone size={12} className="text-teal-600" />
                                        Phone
                                    </label>
                                    <input 
                                        type="text"
                                        value={profile.agencyProfile?.phone || ""}
                                        onChange={e => setProfile({ ...profile, agencyProfile: { ...profile.agencyProfile!, phone: e.target.value } })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <MessageSquare size={12} className="text-teal-600" />
                                        WhatsApp
                                    </label>
                                    <input 
                                        type="text"
                                        value={profile.agencyProfile?.whatsApp || ""}
                                        onChange={e => setProfile({ ...profile, agencyProfile: { ...profile.agencyProfile!, whatsApp: e.target.value } })}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            {/* Expertise / Specialties */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <Star size={12} className="text-teal-600" />
                                    Agency Expertise
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(profile.agencyProfile?.specialties || []).map((s, i) => (
                                        <span key={i} className="bg-teal-50 text-teal-700 border border-teal-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                            {s}
                                            <button onClick={() => setProfile({...profile, agencyProfile: {...profile.agencyProfile!, specialties: profile.agencyProfile!.specialties?.filter((_, idx) => idx !== i)}})} className="hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Add expertise (e.g. Wildlife, Adventure) & press Enter"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            const val = e.currentTarget.value.trim();
                                            if (val && !profile.agencyProfile?.specialties?.includes(val)) {
                                                setProfile({...profile, agencyProfile: {...profile.agencyProfile!, specialties: [...(profile.agencyProfile!.specialties || []), val]}});
                                                e.currentTarget.value = "";
                                            }
                                        }
                                    }}
                                    className={inputClasses}
                                />
                            </div>

                            {/* Operating Regions */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <MapPin size={12} className="text-teal-600" />
                                    Operating Regions
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(profile.agencyProfile?.operatingRegions || []).map((region, i) => (
                                        <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                            {region}
                                            <button onClick={() => setProfile({...profile, agencyProfile: {...profile.agencyProfile!, operatingRegions: profile.agencyProfile!.operatingRegions?.filter((_, idx) => idx !== i)}})} className="hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <select 
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val && !profile.agencyProfile?.operatingRegions?.includes(val)) {
                                            setProfile({...profile, agencyProfile: {...profile.agencyProfile!, operatingRegions: [...(profile.agencyProfile!.operatingRegions || []), val]}});
                                        }
                                        e.target.value = "";
                                    }}
                                    className={inputClasses}
                                >
                                    <option value="">+ Add Region</option>
                                    {COMMON_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>

                            {/* Languages */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <Globe size={12} className="text-teal-600" />
                                    Supported Languages
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(profile.agencyProfile?.languages || []).map((lang, i) => (
                                        <span key={i} className="bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                            {lang}
                                            <button onClick={() => setProfile({...profile, agencyProfile: {...profile.agencyProfile!, languages: profile.agencyProfile!.languages?.filter((_, idx) => idx !== i)}})} className="hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <select 
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val && !profile.agencyProfile?.languages?.includes(val)) {
                                            setProfile({...profile, agencyProfile: {...profile.agencyProfile!, languages: [...(profile.agencyProfile!.languages || []), val]}});
                                        }
                                        e.target.value = "";
                                    }}
                                    className={inputClasses}
                                >
                                    <option value="">+ Add Language</option>
                                    {COMMON_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Agency Bio</label>
                                <textarea 
                                    value={profile.agencyProfile?.bio || ""}
                                    onChange={e => setProfile({ ...profile, agencyProfile: { ...profile.agencyProfile!, bio: e.target.value } })}
                                    rows={6}
                                    className={`${inputClasses} resize-none rounded-[2rem] px-8 py-6`}
                                />
                            </div>
                        </div>

                        {/* Social */}
                        <div className="bg-gray-50/50 p-12 rounded-[3.5rem] border border-dashed border-gray-200">
                            <h2 className="text-xl font-black text-gray-900 italic tracking-tight mb-8">Social Presence</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { name: 'facebookLink', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                                    { name: 'instagramLink', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                                    { name: 'linkedinLink', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                                    { name: 'youTubeLink', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
                                    { name: 'tikTokLink', label: 'TikTok', icon: MessageSquare, color: 'text-gray-900' },
                                    { name: 'twitterLink', label: 'X', icon: XIcon, color: 'text-gray-900' }
                                ].map((social) => (
                                    <div key={social.name} className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2 ${social.color}`}>
                                            <social.icon size={12} />
                                            {social.label}
                                        </label>
                                        <input 
                                            type="url"
                                            value={(profile.agencyProfile as any)?.[social.name] || ""}
                                            onChange={e => setProfile({ ...profile, agencyProfile: { ...profile.agencyProfile!, [social.name]: e.target.value } })}
                                            className={inputClasses + " bg-white shadow-sm"}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="owner"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                         {/* Owner Details Section */}
                         <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Owner Full Name</label>
                                <input 
                                    type="text"
                                    value={profile.fullName || ""}
                                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Professional Bio</label>
                                <textarea 
                                    value={profile.guideProfile?.bio || ""}
                                    onChange={e => setProfile({ ...profile, guideProfile: { ...profile.guideProfile!, bio: e.target.value } })}
                                    rows={6}
                                    placeholder="Your personal expertise and background..."
                                    className={`${inputClasses} resize-none rounded-[2rem] px-8 py-6`}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Phone</label>
                                    <input 
                                        type="text"
                                        value={profile.guideProfile?.phoneNumber || ""}
                                        onChange={e => setProfile({ ...profile, guideProfile: { ...profile.guideProfile!, phoneNumber: e.target.value } })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">WhatsApp</label>
                                    <input 
                                        type="text"
                                        value={profile.guideProfile?.whatsAppNumber || ""}
                                        onChange={e => setProfile({ ...profile, guideProfile: { ...profile.guideProfile!, whatsAppNumber: e.target.value } })}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                         </div>

                         {/* Owner Rates & Skills */}
                         <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-12">
                            <h3 className="text-xl font-black text-gray-900 italic tracking-tight">Rates & Skills</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 block ml-2">Pricing Model</label>
                                    <div className="flex flex-col gap-4">
                                        {[
                                            { id: 'hourly', label: 'Hourly', icon: Clock },
                                            { id: 'daily', label: 'Daily', icon: Zap },
                                            { id: 'negotiable', label: 'Negotiable', icon: MessageCircle }
                                        ].map((model) => (
                                            <button
                                                key={model.id}
                                                onClick={() => setPricingModel(model.id as any)}
                                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${pricingModel === model.id ? 'bg-teal-50 border-teal-600 text-teal-600' : 'bg-gray-50 border-transparent text-gray-500 hover:border-gray-200'}`}
                                            >
                                                <model.icon size={18} />
                                                <span className="text-xs font-black uppercase tracking-widest">{model.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    {pricingModel !== 'negotiable' && (
                                        <div className="text-center space-y-2 w-full">
                                            <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 block">Rate (USD)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-gray-300">$</span>
                                                <input 
                                                    type="number"
                                                    value={pricingModel === 'hourly' ? profile.guideProfile?.hourlyRate : profile.guideProfile?.dailyRate}
                                                    onChange={e => {
                                                        const val = Number(e.target.value);
                                                        if (pricingModel === 'hourly') setProfile({...profile, guideProfile: {...profile.guideProfile!, hourlyRate: val}});
                                                        else setProfile({...profile, guideProfile: {...profile.guideProfile!, dailyRate: val}});
                                                    }}
                                                    className="bg-gray-50 border border-transparent rounded-3xl py-6 px-12 text-4xl font-black text-gray-900 outline-none w-full text-center focus:bg-white focus:border-teal-100 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-50" />

                            <div className="space-y-10">
                                {/* Languages */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <Globe size={12} className="text-teal-600" />
                                        Languages Spoken
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {(profile.guideProfile?.languages || []).map((lang, i) => (
                                            <span key={i} className="bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                                {lang}
                                                <button onClick={() => setProfile({...profile, guideProfile: {...profile.guideProfile!, languages: profile.guideProfile!.languages?.filter((_, idx) => idx !== i)}})} className="hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <select 
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val && !profile.guideProfile?.languages?.includes(val)) {
                                                setProfile({...profile, guideProfile: {...profile.guideProfile!, languages: [...(profile.guideProfile!.languages || []), val]}});
                                            }
                                            e.target.value = "";
                                        }}
                                        className={inputClasses}
                                    >
                                        <option value="">+ Add Language</option>
                                        {COMMON_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>

                                {/* Specialties */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <Star size={12} className="text-teal-600" />
                                        Professional Specialties
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {(profile.guideProfile?.specialties || []).map((s, i) => (
                                            <span key={i} className="bg-teal-50 text-teal-700 border border-teal-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                                {s}
                                                <button onClick={() => setProfile({...profile, guideProfile: {...profile.guideProfile!, specialties: profile.guideProfile!.specialties?.filter((_, idx) => idx !== i)}})} className="hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Type specialty & press Enter"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val && !profile.guideProfile?.specialties?.includes(val)) {
                                                    setProfile({...profile, guideProfile: {...profile.guideProfile!, specialties: [...(profile.guideProfile!.specialties || []), val]}});
                                                    e.currentTarget.value = "";
                                                }
                                            }
                                        }}
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Operating Areas */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <MapPin size={12} className="text-teal-600" />
                                        Operating Regions
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {(profile.guideProfile?.operatingAreas || []).map((area, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                                                {area}
                                                <button onClick={() => setProfile({...profile, guideProfile: {...profile.guideProfile!, operatingAreas: profile.guideProfile!.operatingAreas?.filter((_, idx) => idx !== i)}})} className="hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <select 
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val && !profile.guideProfile?.operatingAreas?.includes(val)) {
                                                setProfile({...profile, guideProfile: {...profile.guideProfile!, operatingAreas: [...(profile.guideProfile!.operatingAreas || []), val]}});
                                            }
                                            e.target.value = "";
                                        }}
                                        className={inputClasses}
                                    >
                                        <option value="">+ Add Region</option>
                                        {COMMON_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                         </div>

                         {/* Owner Verification Details */}
                         <div className="bg-teal-50/30 p-12 rounded-[3.5rem] border border-dashed border-teal-200 space-y-8">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-teal-600" size={24} />
                                <h3 className="text-xl font-black text-gray-900 italic tracking-tight">Professional Credentials</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Registration Number</label>
                                    <input 
                                        type="text"
                                        value={profile.guideProfile?.registrationNumber || ""}
                                        onChange={e => setProfile({ ...profile, guideProfile: { ...profile.guideProfile!, registrationNumber: e.target.value } })}
                                        placeholder="SLTDA Registration #"
                                        className={inputClasses + " bg-white shadow-sm"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">License Expiry</label>
                                    <input 
                                        type="date"
                                        value={profile.guideProfile?.licenseExpirationDate ? new Date(profile.guideProfile.licenseExpirationDate).toISOString().split('T')[0] : ""}
                                        onChange={e => setProfile({ ...profile, guideProfile: { ...profile.guideProfile!, licenseExpirationDate: e.target.value } })}
                                        className={inputClasses + " bg-white shadow-sm"}
                                    />
                                </div>
                            </div>
                         </div>

                         {/* Owner Social Presence */}
                         <div className="bg-gray-50/50 p-12 rounded-[3.5rem] border border-dashed border-gray-200">
                            <h2 className="text-xl font-black text-gray-900 italic tracking-tight mb-8">Personal Social Presence</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { name: 'facebookLink', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                                    { name: 'instagramLink', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                                    { name: 'linkedinLink', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                                    { name: 'youTubeLink', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
                                    { name: 'tikTokLink', label: 'TikTok', icon: MessageCircle, color: 'text-gray-900' },
                                    { name: 'twitterLink', label: 'X', icon: XIcon, color: 'text-gray-900' }
                                ].map((social) => (
                                    <div key={social.name} className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2 ${social.color}`}>
                                            <social.icon size={12} />
                                            {social.label}
                                        </label>
                                        <input 
                                            type="url"
                                            value={(profile.guideProfile as any)?.[social.name] || ""}
                                            onChange={e => setProfile({ ...profile, guideProfile: { ...profile.guideProfile!, [social.name]: e.target.value } })}
                                            className={inputClasses + " bg-white shadow-sm"}
                                        />
                                    </div>
                                ))}
                            </div>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-10 bg-gray-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-teal-400 text-gray-900 rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl shadow-teal-400/20 rotate-3">
                    <ShieldCheck size={40} />
                </div>
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-black italic tracking-tight italic">Security & Verification</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xl">
                        {profile.agencyProfile?.isVerified 
                            ? "Your agency is fully verified. Your profile displays the verification badge and ranks higher in discovery results."
                            : "Your agency verification is currently pending. Once verified, you'll receive a badge and increased visibility."}
                    </p>
                </div>
            </div>
        </div>
    );
}
