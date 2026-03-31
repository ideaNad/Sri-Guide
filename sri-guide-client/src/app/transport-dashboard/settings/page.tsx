'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthContext';
import { 
    Briefcase, 
    Save, 
    Loader2, 
    MapPin, 
    Phone, 
    Info, 
    Image as ImageIcon,
    Camera,
    UserCircle,
    MessageCircle,
    CheckCircle2,
    AlertCircle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';

const SRI_LANKA_PROVINCES = [
    "Central", "Eastern", "North Central", "Northern", 
    "North Western", "Sabaragamuwa", "Southern", "Uva", "Western"
];

const PROVINCE_DISTRICTS: Record<string, string[]> = {
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "North Western": ["Kurunegala", "Puttalam"],
    "Sabaragamuwa": ["Kegalle", "Ratnapura"],
    "Southern": ["Galle", "Hambantota", "Matara"],
    "Uva": ["Badulla", "Moneragala"],
    "Western": ["Colombo", "Gampaha", "Kalutara"]
};

export default function TransportProfileSettings() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();
    const profile = user?.transportProfile;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(!profile);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [selectedProvince, setSelectedProvince] = useState(profile?.province?.replace(" Province", "") || '');
    const [selectedDistrict, setSelectedDistrict] = useState(profile?.district || '');

    React.useEffect(() => {
        const loadProfile = async () => {
            if (!profile) setIsLoading(true);
            await refreshUser();
            setIsLoading(false);
        };
        loadProfile();
    }, []);

    React.useEffect(() => {
        if (profile) {
            setSelectedProvince(profile.province?.replace(" Province", "") || '');
            setSelectedDistrict(profile.district || '');
        }
    }, [profile]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            await apiClient.post("/profile/upload-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage({ type: "success", text: "Profile picture updated!" });
            await refreshUser();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to upload photo." });
        } finally {
            setIsUploading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        const data = {
            userId: user?.id,
            businessName: formData.get('businessName'),
            description: formData.get('description'),
            phone: formData.get('phone'),
            district: formData.get('district'),
            province: formData.get('province'),
            latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
            longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
            isAvailable: profile?.isAvailable ?? true,
            whatsAppNumber: formData.get('whatsAppNumber')
        };

        try {
            await apiClient.post('/profile/transport/update', data);
            setMessage({ type: "success", text: 'Settings updated successfully' });
            await refreshUser();
        } catch (error) {
            setMessage({ type: "error", text: 'Failed to update settings' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 size={48} className="animate-spin text-blue-600" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            {/* Custom Animated Banner */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -50, x: "-50%" }}
                        className={`fixed top-24 left-1/2 z-[100] p-5 rounded-[2rem] border shadow-2xl flex items-center gap-4 min-w-[320px] ${message.type === "success"
                                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                : "bg-rose-50 border-rose-100 text-rose-700"
                            }`}
                    >
                        {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <p className="font-black text-sm uppercase tracking-tight flex-1">{message.text}</p>
                        <button onClick={() => setMessage(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <header>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Profile Settings</h1>
                <p className="text-gray-500 mt-1 font-medium">Update your business information and public profile.</p>
            </header>

            <form 
                key={user?.id + (profile?.id || 'new')}
                onSubmit={handleSubmit} 
                className="space-y-8"
            >
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center justify-center py-4 border-b border-gray-50">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center">
                                {isUploading ? (
                                    <Loader2 size={32} className="animate-spin text-blue-600" />
                                ) : user?.profileImageUrl ? (
                                    <img 
                                        src={user.profileImageUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${user.profileImageUrl}` : user.profileImageUrl} 
                                        alt={user.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-4xl font-black text-gray-200 uppercase italic">
                                        {user?.fullName?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                id="photo-upload" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                disabled={isUploading}
                            />
                            <label 
                                htmlFor="photo-upload"
                                className="absolute -bottom-2 -right-2 p-3 bg-gray-900 text-white rounded-2xl shadow-lg border-4 border-white cursor-pointer hover:bg-blue-600 transition-all hover:scale-110 active:scale-95"
                            >
                                <Camera size={18} />
                            </label>
                        </div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Profile Image</p>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                            <Info size={18} className="text-blue-600" />
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Business Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Business Name</label>
                                <input 
                                    type="text" 
                                    name="businessName" 
                                    required 
                                    defaultValue={profile?.businessName || ''} 
                                    placeholder="e.g. Lanka Travels & Tours"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Description</label>
                                <textarea 
                                    name="description" 
                                    rows={4}
                                    defaultValue={profile?.description || ''} 
                                    placeholder="Tell potential customers about your transport service..."
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Location */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-blue-600" />
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Contact & Location</h2>
                            </div>
                            <button 
                                type="button"
                                onClick={() => {
                                    if ("geolocation" in navigator) {
                                        navigator.geolocation.getCurrentPosition((pos) => {
                                            const lat = pos.coords.latitude;
                                            const lng = pos.coords.longitude;
                                            (document.getElementsByName('latitude')[0] as HTMLInputElement).value = lat.toString();
                                            (document.getElementsByName('longitude')[0] as HTMLInputElement).value = lng.toString();
                                            toast.success("Location captured from GPS!");
                                        });
                                    }
                                }}
                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                            >
                                Get My GPS Location
                            </button>
                        </div>

                        <input type="hidden" name="latitude" defaultValue={profile?.latitude || ''} />
                        <input type="hidden" name="longitude" defaultValue={profile?.longitude || ''} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-4 text-gray-400" size={20} />
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        required 
                                        pattern="[0-9+]{10,15}"
                                        title="Please enter a valid phone number (10-15 digits)"
                                        defaultValue={profile?.phone || ''} 
                                        placeholder="+94 77 123 4567"
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">WhatsApp Number</label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-4 top-4 text-gray-400" size={20} />
                                    <input 
                                        type="tel" 
                                        name="whatsAppNumber" 
                                        pattern="[0-9+]{10,15}"
                                        title="Please enter a valid WhatsApp number (10-15 digits)"
                                        defaultValue={profile?.whatsAppNumber || ''} 
                                        placeholder="+94 7X XXX XXXX"
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Province</label>
                                <select 
                                    name="province" 
                                    required 
                                    value={selectedProvince}
                                    onChange={(e) => {
                                        setSelectedProvince(e.target.value);
                                        setSelectedDistrict(''); // Reset district when province changes
                                    }}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="" disabled>Select Province</option>
                                    {SRI_LANKA_PROVINCES.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">District</label>
                                <select 
                                    name="district" 
                                    required 
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="" disabled>Select District</option>
                                    {(selectedProvince && PROVINCE_DISTRICTS[selectedProvince] ? PROVINCE_DISTRICTS[selectedProvince] : []).map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-tight hover:bg-black transition-all shadow-xl shadow-gray-900/10 disabled:bg-gray-400 active:scale-95"
                    >
                        {isSubmitting ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
