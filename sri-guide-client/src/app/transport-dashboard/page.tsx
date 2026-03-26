'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthContext';
import { 
    Car, 
    CheckCircle2, 
    AlertTriangle, 
    TrendingUp, 
    MapPin, 
    Phone, 
    Globe,
    ToggleLeft,
    ToggleRight,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';

export default function TransportDashboardHome() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();
    const profile = user?.transportProfile;
    const [isAvailable, setIsAvailable] = useState(profile?.isAvailable ?? false);
    const [isUpdating, setIsUpdating] = useState(false);

    const getImageUrl = (url?: string) => {
        if (!url || url.trim() === "") return `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random`;
        if (url.startsWith('http')) return url;
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanPath}`;
    };

    const vehicleCount = profile?.vehicles?.length || 0;
    
    // Calculate profile completeness
    const profileFields = [
        profile?.businessName,
        profile?.description,
        profile?.phone,
        profile?.district,
        profile?.province,
        profile?.profileImageUrl,
    ];
    const completedFields = profileFields.filter(f => !!f).length;
    const completeness = Math.round((completedFields / profileFields.length) * 100);

    useEffect(() => {
        const init = async () => {
            await refreshUser();
        };
        init();
    }, []);

    useEffect(() => {
        if (profile) {
            setIsAvailable(profile.isAvailable);
        }
    }, [profile]);

    const toggleAvailability = async () => {
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            const response = await apiClient.post('/transport/toggle-availability');
            const newStatus = (response.data as { isAvailable: boolean }).isAvailable;
            setIsAvailable(newStatus);
            toast.success(`You are now ${newStatus ? 'discoverable' : 'offline'}`);
            await refreshUser();
        } catch (error) {
            toast.error('Failed to update availability');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            {/* Welcome Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6 text-left">
                    <div className="relative w-24 h-24 shrink-0">
                        {user?.profileImageUrl ? (
                            <img 
                                src={getImageUrl(user.profileImageUrl)} 
                                alt={user.fullName}
                                className="w-full h-full rounded-[2rem] object-cover border-4 border-white shadow-xl shadow-blue-600/10"
                            />
                        ) : (
                            <div className="w-full h-full rounded-[2rem] bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-300 border-4 border-white shadow-xl">
                                {user?.fullName?.charAt(0)}
                            </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-xl shadow-lg border border-gray-50 text-blue-600">
                            <Car size={14} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                            AYUBOWAN, <span className="text-blue-600">{user?.fullName?.split(" ")[0]}</span>
                        </h1>
                        <p className="text-gray-500 font-bold mt-2">Manage your transport business and vehicle availability.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm self-start md:self-auto">
                    <span className={`text-[10px] font-black uppercase tracking-widest ml-3 ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                        {isAvailable ? 'Discoverable' : 'Offline'}
                    </span>
                    <button 
                        onClick={toggleAvailability}
                        disabled={isUpdating}
                        className={`p-1 rounded-xl transition-all ${isAvailable ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        {isAvailable ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                </div>
            </header>

            {/* Alert Banners */}
            <div className="space-y-6">
                {vehicleCount === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-600 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-600/20"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <Car size={32} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase italic leading-none">Add Your Fleet</h3>
                                    <p className="text-white/80 text-sm mt-2 font-medium">Your profile is hidden from tourists until you add at least one vehicle.</p>
                                </div>
                            </div>
                            <Link 
                                href="/transport-dashboard/vehicles/add"
                                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95 whitespace-nowrap"
                            >
                                Add Your First Vehicle
                            </Link>
                        </div>
                    </motion.div>
                )}

                {completeness < 100 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl"
                    >
                        <div className="relative z-10 flex-1">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 block">Profile Perfection</span>
                            <h3 className="text-3xl font-black mb-6 italic uppercase leading-none">Stand Out to Tourists</h3>
                            <p className="text-white/60 text-sm mb-8 max-w-xl font-medium leading-relaxed">
                                Transport providers with complete profiles and high-quality photos get <span className="text-blue-400 font-bold italic">3x more inquiries</span>.
                            </p>
                            <Link 
                                href="/transport-dashboard/settings"
                                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20"
                            >
                                Complete Business Info
                            </Link>
                        </div>

                        <div className="relative z-10 w-full md:w-64 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Completeness</span>
                                <span className="text-2xl font-black italic text-blue-400">{completeness}%</span>
                            </div>
                            <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completeness}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)]" 
                                />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                            <Car size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">Total Vehicles</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900">{vehicleCount}</span>
                        <span className="text-gray-400 font-bold text-sm uppercase">Active</span>
                    </div>
                </motion.div>

                {/* Profile Completeness */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">Profile Progress</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900">{completeness}%</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                                style={{ width: `${completeness}%` }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Status Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-2xl ${isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {isAvailable ? <TrendingUp size={24} /> : <AlertTriangle size={24} />}
                        </div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">Service Status</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-black uppercase ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {isAvailable ? 'Discoverable' : 'Hidden'}
                        </span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link 
                            href="/transport-dashboard/vehicles"
                            className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all group"
                        >
                            <div className="p-3 bg-white rounded-xl text-gray-400 group-hover:text-blue-600 shadow-sm w-fit mb-4">
                                <Car size={24} />
                            </div>
                            <span className="font-bold text-gray-900 tracking-tight">Manage Vehicles</span>
                        </Link>
                        <Link 
                            href="/transport-dashboard/settings"
                            className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-orange-50 hover:border-orange-100 transition-all group"
                        >
                            <div className="p-3 bg-white rounded-xl text-gray-400 group-hover:text-orange-600 shadow-sm w-fit mb-4">
                                <Settings size={24} />
                            </div>
                            <span className="font-bold text-gray-900 tracking-tight">Edit Profile</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full -mr-32 -mt-32" />
                    <h2 className="text-xl font-black mb-6 uppercase tracking-tight relative z-10">Business Summary</h2>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <MapPin size={18} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Location</p>
                                <p className="font-bold">{profile?.district ? `${profile.district}, ${profile.province}` : 'Not set'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Phone size={18} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Contact</p>
                                <p className="font-bold">{profile?.phone || 'Not set'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
