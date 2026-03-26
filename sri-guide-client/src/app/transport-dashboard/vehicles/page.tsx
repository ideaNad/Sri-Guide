'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthContext';
import {
    Car, Plus, Trash2, Edit3, Loader2, X, Check,
    Smartphone, Users, Luggage, Snowflake, Calendar,
    ToggleLeft, ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';

export default function VehicleManagement() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<any[]>(user?.transportProfile?.vehicles || []);

    useEffect(() => {
        if (user?.transportProfile?.vehicles) {
            setVehicles(user.transportProfile.vehicles);
        }
    }, [user]);

    const handleToggleAvailability = async (id: string) => {
        try {
            await apiClient.post(`/transport/vehicles/${id}/toggle-availability`);
            toast.success('Availability updated');
            await refreshUser();
        } catch (error) {
            toast.error('Failed to update availability');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            await apiClient.delete(`/transport/vehicles/${id}`);
            toast.success('Vehicle deleted successfully');
            await refreshUser();
        } catch (error) {
            toast.error('Failed to delete vehicle');
        }
    };

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

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">My Vehicles</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your fleet and vehicle details.</p>
                </div>
                <Link
                    href="/transport-dashboard/vehicles/add"
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-tight hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm"
                >
                    <Plus size={20} />
                    <span>Add New Vehicle</span>
                </Link>
            </header>

            {vehicles.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-6">
                        <Car size={40} />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">No vehicles yet</h2>
                    <p className="text-gray-500 mt-2 max-w-sm font-medium">Add your first vehicle to start receiving booking inquiries.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <motion.div
                            layout
                            key={vehicle.id}
                            className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden flex items-center justify-center">
                                {getImageUrl(vehicle.vehicleImageUrl) ? (
                                    <img
                                        src={getImageUrl(vehicle.vehicleImageUrl)!}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-blue-600/30">
                                        <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl font-black tracking-tighter shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                            {getInitials(vehicle.brand, vehicle.model)}
                                        </div>
                                    </div>
                                )}
                                {/* Status Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/20 ${vehicle.isAvailable
                                            ? 'bg-green-500/90 text-white'
                                            : 'bg-orange-500/90 text-white'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-white`} />
                                        {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>

                                {/* Availability Toggle */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleToggleAvailability(vehicle.id);
                                    }}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 text-gray-900 transition-all active:scale-90 hover:bg-blue-600 hover:text-white group/toggle"
                                    title={vehicle.isAvailable ? "Set as unavailable" : "Set as available"}
                                >
                                    {vehicle.isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-xl font-black text-gray-900 leading-tight uppercase tracking-tight truncate">
                                            {vehicle.brand} {vehicle.model}
                                        </h3>
                                        <p className="text-gray-400 font-bold flex items-center gap-1.5 text-sm uppercase tracking-wide">
                                            <Calendar size={14} />
                                            {vehicle.year}
                                            <span className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${vehicle.driverIncluded
                                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                                    : "bg-orange-100 text-orange-700 border border-orange-200"
                                                }`}>
                                                {vehicle.driverIncluded ? "Driver Included" : "Vehicle Only"}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Link
                                            href={`/transport-dashboard/vehicles/edit/${vehicle.id}`}
                                            className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit3 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(vehicle.id)}
                                            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <Users size={18} className="text-blue-600 mb-1" />
                                        <span className="text-xs font-black text-gray-900">{vehicle.passengerCapacity}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Pax</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <Luggage size={18} className="text-blue-600 mb-1" />
                                        <span className="text-xs font-black text-gray-900">{vehicle.luggageCapacity}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Bags</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <Snowflake size={18} className={vehicle.hasAc ? 'text-blue-600' : 'text-gray-300'} />
                                        <span className="text-xs font-black text-gray-900">{vehicle.hasAc ? 'YES' : 'NO'}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">A/C</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
