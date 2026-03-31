'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { 
    Car, Loader2, ArrowLeft, Check,
    Users, Luggage, Snowflake, Calendar,
    Info, Save, Image as ImageIcon, Camera,
    Shield, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export default function EditVehiclePage() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const [vehicle, setVehicle] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [vehicleImageUrl, setVehicleImageUrl] = useState<string | null>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

    const [passengerCapacity, setPassengerCapacity] = useState(4);
    const [luggageCapacity, setLuggageCapacity] = useState(2);

    const getImageUrl = (url?: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "") {
            return null;
        }
        if (url.startsWith('http')) return url;
        const normalizedPath = url.replace(/\\/g, '/');
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || '';
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        return `${baseUrl}${cleanPath}`;
    };

    const getInitials = (brand: string, model: string) => {
        if (!brand && !model) return "VC";
        const b = brand?.charAt(0).toUpperCase() || "";
        const m = model?.charAt(0).toUpperCase() || "";
        return `${b}${m}` || "VC";
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Set local preview immediately
        const localUrl = URL.createObjectURL(file);
        setLocalPreviewUrl(localUrl);

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            const response = await apiClient.post<{ url: string }>(`/transport/vehicles/${id}/upload-photo`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setVehicleImageUrl(response.data.url);
            toast.success("Vehicle photo updated!");
            await refreshUser();
        } catch (error) {
            toast.error("Failed to upload vehicle photo.");
            setLocalPreviewUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                // Find vehicle in user object if already loaded
                const existing = user?.transportProfile?.vehicles?.find((v: any) => v.id === id);
                if (existing) {
                    setVehicle(existing);
                    setVehicleImageUrl(existing.vehicleImageUrl || null);
                    setPassengerCapacity(existing.passengerCapacity || 4);
                    setLuggageCapacity(existing.luggageCapacity || 2);
                } else {
                    // Fallback to API if not in context
                    const response = await apiClient.get<any>(`/transport/vehicles/${id}`);
                    setVehicle(response.data);
                    setVehicleImageUrl(response.data.vehicleImageUrl || null);
                    setPassengerCapacity(response.data.passengerCapacity || 4);
                    setLuggageCapacity(response.data.luggageCapacity || 2);
                }
            } catch (error) {
                toast.error('Failed to load vehicle details');
                router.push('/transport-dashboard/vehicles');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchVehicle();
        }
    }, [id, user, router, toast]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        const data = {
            vehicleType: formData.get('vehicleType'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            year: parseInt(formData.get('year') as string),
            passengerCapacity: passengerCapacity,
            luggageCapacity: luggageCapacity,
            hasAc: formData.get('hasAc') === 'on',
            isAvailable: formData.get('isAvailable') === 'on',
            driverIncluded: formData.get('driverIncluded') === 'on',
            vehicleImageUrl: vehicleImageUrl
        };

        try {
            await apiClient.put(`/transport/vehicles/${id}`, data);
            toast.success('Vehicle updated successfully');
            await refreshUser();
            router.push('/transport-dashboard/vehicles');
        } catch (error) {
            toast.error('Failed to update vehicle');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-900 font-black uppercase tracking-[0.3em] text-xs">
                        Fetching Logistics
                    </p>
                    <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-full h-full bg-blue-600"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="p-8 bg-red-50 rounded-full mb-6">
                    <Car size={64} className="text-red-200" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Vehicle Missing</h1>
                <p className="text-gray-500 mb-8 max-w-xs font-medium">We couldn't locate the vehicle you're looking for. It may have been decommissioned.</p>
                <Link 
                    href="/transport-dashboard/vehicles" 
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl hover:scale-105 active:scale-95"
                >
                    Return to Fleet
                </Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-6 lg:px-8 py-4 sm:py-8"
        >
            <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between px-2 sm:px-0">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link 
                        href="/transport-dashboard/vehicles"
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm hover:shadow-md active:scale-95 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tight">Edit Vehicle</h1>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-medium">Update specification for your {vehicle.brand} {vehicle.model}.</p>
                    </div>
                </div>
            </motion.header>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-20">
                <motion.div variants={itemVariants} className="bg-white p-4 sm:p-6 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 sm:space-y-12">
                    {/* Vehicle Photo Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <ImageIcon size={18} className="text-blue-600" />
                                </div>
                                <h2 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Vehicle Photo</h2>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-4 sm:p-8 border-2 border-dashed border-gray-200 rounded-[1.5rem] sm:rounded-[2rem] bg-gray-50/50 group hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300">
                            <div className="relative w-full flex flex-col items-center">
                                <motion.div 
                                    whileHover={{ scale: 1.01 }}
                                    className="w-full max-w-lg aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-white border-4 sm:border-8 border-white shadow-2xl flex items-center justify-center"
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative">
                                                <Loader2 size={32} className="sm:size-12 animate-spin text-blue-600" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                                </div>
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Updating media...</span>
                                        </div>
                                    ) : (localPreviewUrl || vehicleImageUrl) ? (
                                        <img 
                                            src={localPreviewUrl || getImageUrl(vehicleImageUrl || undefined)!} 
                                            alt="Vehicle preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-blue-600/30 flex flex-col items-center gap-4">
                                            <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 text-4xl font-black tracking-tighter">
                                                {getInitials(
                                                    (document.getElementsByName('brand')[0] as HTMLInputElement)?.value || vehicle.brand || "",
                                                    (document.getElementsByName('model')[0] as HTMLInputElement)?.value || vehicle.model || ""
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Preview Initials</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                                <input 
                                    type="file" 
                                    id="vehicle-photo" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    disabled={isUploading}
                                />
                                <label 
                                    htmlFor="vehicle-photo"
                                    className="mt-4 sm:absolute sm:-bottom-4 sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-xl shadow-xl border-4 border-white cursor-pointer hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 group"
                                >
                                    <Camera size={16} className="sm:size-18 group-hover:rotate-12 transition-transform" />
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                        Update Vehicle Photo
                                    </span>
                                </label>
                            </div>
                            <p className="mt-6 sm:mt-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center max-w-sm px-4">
                                Clear photos help customers choose your vehicle.
                            </p>
                        </div>
                    </div>

                    {/* Specifications Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Info size={18} className="text-indigo-600" />
                            </div>
                            <h2 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Vehicle Specifications</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="space-y-2 sm:space-y-3">
                                <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">
                                    <Car size={12} />
                                    Vehicle Type
                                </label>
                                <select 
                                    name="vehicleType" 
                                    required
                                    defaultValue={vehicle.vehicleType}
                                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none hover:bg-white text-sm"
                                >
                                    <option value="car">Luxury Sedan / Car</option>
                                    <option value="van">Passenger Van</option>
                                    <option value="bus">Tourist Bus</option>
                                    <option value="tuk">Tuk Tuk</option>
                                    <option value="jeep">4x4 Jeep / SUV</option>
                                    <option value="bike">Motorbike / Scooter</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2 sm:space-y-3">
                                <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">
                                    <Calendar size={12} />
                                    Manufacture Year
                                </label>
                                <input 
                                    type="number" 
                                    name="year" 
                                    required 
                                    min={2000}
                                    max={new Date().getFullYear() + 1}
                                    defaultValue={vehicle.year} 
                                    placeholder="2024"
                                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none hover:bg-white text-sm"
                                />
                            </div>

                            <div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
                                <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">
                                    <Shield size={12} />
                                    Brand
                                </label>
                                <input 
                                    type="text" 
                                    name="brand" 
                                    required 
                                    defaultValue={vehicle.brand}
                                    placeholder="e.g. Toyota"
                                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none hover:bg-white text-sm"
                                />
                            </div>

                            <div className="space-y-2 sm:space-y-3 sm:col-span-2">
                                <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">
                                    <Zap size={12} />
                                    Model Name
                                </label>
                                <input 
                                    type="text" 
                                    name="model" 
                                    required 
                                    defaultValue={vehicle.model}
                                    placeholder="e.g. Land Cruiser Prado"
                                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none hover:bg-white text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capacity Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Users size={18} className="text-emerald-600" />
                            </div>
                            <h2 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Capacity Details</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                            <div className="space-y-2 sm:space-y-3">
                                <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">
                                    <Users size={12} />
                                    Passenger Slots
                                </label>
                                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all group">
                                    <button 
                                        type="button"
                                        onClick={() => setPassengerCapacity(prev => Math.max(1, prev - 1))}
                                        className="p-4 sm:p-5 hover:bg-gray-100 text-gray-500 transition-colors active:scale-95"
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center font-bold text-lg select-none">−</div>
                                    </button>
                                    <input 
                                        type="number" 
                                        name="passengerCapacity" 
                                        required 
                                        min={1}
                                        max={60}
                                        value={passengerCapacity} 
                                        onChange={(e) => setPassengerCapacity(parseInt(e.target.value) || 1)}
                                        className="flex-1 w-full bg-transparent text-center font-bold outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setPassengerCapacity(prev => Math.min(60, prev + 1))}
                                        className="p-4 sm:p-5 hover:bg-gray-100 text-gray-500 transition-colors active:scale-95"
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center font-bold text-lg select-none">+</div>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">
                                    <Luggage size={12} />
                                    Luggage Capacity (Bags)
                                </label>
                                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all group">
                                    <button 
                                        type="button"
                                        onClick={() => setLuggageCapacity(prev => Math.max(0, prev - 1))}
                                        className="p-4 sm:p-5 hover:bg-gray-100 text-gray-500 transition-colors active:scale-95"
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center font-bold text-lg select-none">−</div>
                                    </button>
                                    <input 
                                        type="number" 
                                        name="luggageCapacity" 
                                        required 
                                        min={0}
                                        max={20}
                                        value={luggageCapacity} 
                                        onChange={(e) => setLuggageCapacity(parseInt(e.target.value) || 0)}
                                        className="flex-1 w-full bg-transparent text-center font-bold outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setLuggageCapacity(prev => Math.min(20, prev + 1))}
                                        className="p-4 sm:p-5 hover:bg-gray-100 text-gray-500 transition-colors active:scale-95"
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center font-bold text-lg select-none">+</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4">
                            <div className="relative group p-4 sm:p-6 bg-blue-50/30 rounded-2xl sm:rounded-[2rem] border-2 border-blue-100/30 hover:border-blue-400 hover:bg-white transition-all duration-300">
                                <label className="flex items-center gap-3 sm:gap-4 cursor-pointer select-none">
                                    <div className="relative">
                                        <input type="checkbox" name="hasAc" defaultChecked={vehicle.hasAc} className="sr-only peer" />
                                        <div className="w-10 sm:w-12 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] sm:peer-checked:after:translate-x-[24px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] sm:after:top-[3px] after:left-[2.5px] sm:after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[15px] sm:after:h-[18px] after:w-[15px] sm:after:w-[18px] after:transition-all peer-checked:bg-blue-600 transition-all"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] sm:text-[11px] font-black text-gray-900 uppercase tracking-tight leading-tight">Air Condition</span>
                                        <span className="text-[8px] sm:text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-tight">Premium Comfort</span>
                                    </div>
                                </label>
                            </div>

                            <div className="relative group p-4 sm:p-6 bg-emerald-50/30 rounded-2xl sm:rounded-[2rem] border-2 border-emerald-100/30 hover:border-emerald-400 hover:bg-white transition-all duration-300">
                                <label className="flex items-center gap-3 sm:gap-4 cursor-pointer select-none">
                                    <div className="relative">
                                        <input type="checkbox" name="isAvailable" defaultChecked={vehicle.isAvailable} className="sr-only peer" />
                                        <div className="w-10 sm:w-12 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] sm:peer-checked:after:translate-x-[24px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] sm:after:top-[3px] after:left-[2.5px] sm:after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[15px] sm:after:h-[18px] after:w-[15px] sm:after:w-[18px] after:transition-all peer-checked:bg-emerald-600 transition-all"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] sm:text-[11px] font-black text-gray-900 uppercase tracking-tight leading-tight">Active Ready</span>
                                        <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-tight">Instant Booking</span>
                                    </div>
                                </label>
                            </div>

                            <div className="relative group p-4 sm:p-6 bg-purple-50/30 rounded-2xl sm:rounded-[2rem] border-2 border-purple-100/30 hover:border-purple-400 hover:bg-white transition-all duration-300">
                                <label className="flex items-center gap-3 sm:gap-4 cursor-pointer select-none">
                                    <div className="relative">
                                        <input type="checkbox" name="driverIncluded" defaultChecked={vehicle.driverIncluded} className="sr-only peer" />
                                        <div className="w-10 sm:w-12 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] sm:peer-checked:after:translate-x-[24px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] sm:after:top-[3px] after:left-[2.5px] sm:after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[15px] sm:after:h-[18px] after:w-[15px] sm:after:w-[18px] after:transition-all peer-checked:bg-purple-600 transition-all"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] sm:text-[11px] font-black text-gray-900 uppercase tracking-tight leading-tight">Driver Incl.</span>
                                        <span className="text-[8px] sm:text-[9px] font-bold text-purple-600 uppercase tracking-widest leading-tight">Full Service</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0">
                    <Link 
                        href="/transport-dashboard/vehicles"
                        className="flex-1 py-4 sm:py-5 bg-white border border-gray-100 text-gray-400 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] text-center hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm hover:shadow-md order-2 sm:order-1"
                    >
                        Discard Changes
                    </Link>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-[2] py-4 sm:py-5 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 disabled:bg-gray-400 disabled:shadow-none active:scale-95 group order-1 sm:order-2"
                    >
                        {isSubmitting ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <Save size={20} className="group-hover:scale-110 transition-transform" />
                                <span>Save Vehicle Changes</span>
                            </>
                        )}
                    </button>
                </motion.div>
            </form>
        </motion.div>
    );
}
