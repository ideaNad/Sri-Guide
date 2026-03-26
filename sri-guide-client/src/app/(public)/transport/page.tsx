'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search, MapPin, Car, Users, Luggage, 
    Navigation, Filter, X, Loader2, ArrowRight,
    Map as MapIcon, Snowflake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/services/api-client';
import VehicleDiscoveryCard from '@/components/ui/VehicleDiscoveryCard';
import { useAuth } from '@/providers/AuthContext';
import Link from 'next/link';

export default function TransportSearchPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [driverIncluded, setDriverIncluded] = useState<boolean | null>(null);
    const [hasAc, setHasAc] = useState<boolean | null>(null);
    const [isSearchingNearby, setIsSearchingNearby] = useState(false);
    const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, [page, vehicleType, capacity, driverIncluded, hasAc, userCoords]);

    const fetchVehicles = async () => {
        setIsLoading(true);
        try {
            const lat = userCoords?.lat || 6.9271;
            const lng = userCoords?.lng || 79.8612;
            const radius = userCoords ? 50 : 500;

            let url = `/transport/nearby?lat=${lat}&lng=${lng}&radius=${radius}&page=${page}&pageSize=${pageSize}`;
            
            if (vehicleType) url += `&vehicleType=${vehicleType}`;
            if (capacity) url += `&minCapacity=${capacity}`;
            if (driverIncluded !== null) url += `&driverIncluded=${driverIncluded}`;
            if (hasAc !== null) url += `&hasAc=${hasAc}`;

            const response = await apiClient.get(url);
            const data = response.data as { vehicles: any[], totalCount: number };
            setVehicles(data.vehicles);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error('Failed to fetch transport vehicles', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNearbySearch = () => {
        setIsSearchingNearby(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setPage(1);
                    setIsSearchingNearby(false);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setIsSearchingNearby(false);
                    alert("Could not get your location. Please check browser permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setIsSearchingNearby(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    const filteredVehicles = vehicles.filter(v => {
        const matchesLocation = !location || 
            v.district?.toLowerCase().includes(location.toLowerCase()) || 
            v.province?.toLowerCase().includes(location.toLowerCase());
            
        return matchesLocation;
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white pt-24 md:pt-32 pb-16 md:pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full -mr-48 -mt-48" />
                <div className="max-w-[1600px] mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl text-center md:text-left mx-auto md:mx-0"
                    >
                        <span className="px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-600/30">
                            Transport & Transfers
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mt-6 leading-tight uppercase tracking-tight">
                            Find the Perfect <br className="hidden md:block" />
                            <span className="text-blue-500">Ride</span> in Sri Lanka
                        </h1>
                        <p className="text-gray-400 mt-4 md:mt-6 text-sm md:text-lg font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                            Book reliable transport providers for your next adventure. From coastal cruises in a Jeep to family trips in a luxury Van.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Bar */}
            <div className="max-w-[1600px] mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative group">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Where are you? (e.g. Galle, Kandy)" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-3xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>
                    
                    <div className="flex w-full md:w-auto gap-3">
                        <button 
                            onClick={handleNearbySearch}
                            disabled={isSearchingNearby}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-5 bg-blue-50 text-blue-600 rounded-3xl font-black uppercase tracking-tight hover:bg-blue-100 transition-all disabled:opacity-50 group"
                        >
                            {isSearchingNearby ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} className="group-hover:rotate-12 transition-transform" />}
                            <span className="hidden sm:inline">Find Nearby</span>
                            <span className="sm:hidden">Nearby</span>
                        </button>
                        
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 md:px-10 py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-tight hover:bg-black transition-all shadow-lg shadow-gray-900/10">
                            <Search size={20} />
                            <span>Search</span>
                        </button>

                        <button 
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden flex items-center justify-center w-16 bg-white border border-gray-100 rounded-3xl text-gray-900 hover:bg-gray-50 transition-all"
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {/* Desktop Sidebar Filters */}
            <main className="max-w-[1600px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10">
                <aside className="hidden lg:block space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-32">
                        <FilterContent 
                            vehicleType={vehicleType}
                            setVehicleType={setVehicleType}
                            capacity={capacity}
                            setCapacity={setCapacity}
                            driverIncluded={driverIncluded}
                            setDriverIncluded={setDriverIncluded}
                            hasAc={hasAc}
                            setHasAc={setHasAc}
                            setPage={setPage}
                        />
                    </div>
                </aside>

                {/* Mobile Filter Drawer */}
                <AnimatePresence>
                    {showMobileFilters && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowMobileFilters(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                            />
                            <motion.div 
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-[101] shadow-2xl lg:hidden overflow-y-auto"
                            >
                                <div className="p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Filters</h2>
                                        <button 
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    
                                    <FilterContent 
                                        vehicleType={vehicleType}
                                        setVehicleType={setVehicleType}
                                        capacity={capacity}
                                        setCapacity={setCapacity}
                                        driverIncluded={driverIncluded}
                                        setDriverIncluded={setDriverIncluded}
                                        hasAc={hasAc}
                                        setHasAc={setHasAc}
                                        setPage={setPage}
                                    />

                                    <button 
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all mt-10"
                                    >
                                        Show Results
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Listing Area */}
                <div className="lg:col-span-4 space-y-8 min-h-[60vh]">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="bg-white rounded-[2.5rem] h-[360px] animate-pulse border border-gray-100" />
                            ))}
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] py-24 flex flex-col items-center justify-center text-center px-6">
                            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-8">
                                <Car size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Oops! No rides found</h2>
                            <p className="text-gray-500 mt-3 max-w-sm font-medium">Try adjusting your filters or location to see more options.</p>
                        </div>
                    ) : (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredVehicles.map((vehicle: any, idx: number) => (
                                <VehicleDiscoveryCard 
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    providerPhone={vehicle.phone}
                                    idx={idx}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-10">
                                <button 
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                                                page === i + 1 
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                                    : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

// Reusable Filter Content Component
function FilterContent({ 
    vehicleType, setVehicleType, 
    capacity, setCapacity, 
    driverIncluded, setDriverIncluded, 
    hasAc, setHasAc, 
    setPage 
}: any) {
    const hasActiveFilters = (vehicleType || capacity || driverIncluded !== null || hasAc !== null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                 <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                     <Filter size={16} className="text-blue-600" />
                     Filters
                 </h2>
                 {hasActiveFilters && (
                    <button 
                        onClick={() => { 
                            setVehicleType(''); 
                            setCapacity(''); 
                            setDriverIncluded(null);
                            setHasAc(null);
                            setPage(1);
                        }}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                    >
                        Reset
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                <div className="grid grid-cols-2 gap-2">
                    {['car', 'van', 'bus', 'tuk', 'jeep'].map((type) => (
                        <button 
                            key={type}
                            onClick={() => { setVehicleType(vehicleType === type ? '' : type); setPage(1); }}
                            className={`py-3 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-tight transition-all border ${
                                vehicleType === type 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min. Passengers</label>
                <select 
                    className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-4 text-xs font-black uppercase tracking-tight focus:ring-2 focus:ring-blue-500/10 outline-none"
                    value={capacity}
                    onChange={(e) => { setCapacity(e.target.value); setPage(1); }}
                >
                    <option value="">Any Capacity</option>
                    <option value="2">2+ Persons</option>
                    <option value="4">4+ Persons</option>
                    <option value="8">8+ Persons</option>
                    <option value="15">15+ Persons</option>
                </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Driver Included</label>
                    <button 
                        onClick={() => { setDriverIncluded(driverIncluded === true ? null : true); setPage(1); }}
                        className={`w-10 h-6 rounded-full transition-colors relative ${driverIncluded === true ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${driverIncluded === true ? 'left-5' : 'left-1'}`} />
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">A/C Available</label>
                    <button 
                        onClick={() => { setHasAc(hasAc === true ? null : true); setPage(1); }}
                        className={`w-10 h-6 rounded-full transition-colors relative ${hasAc === true ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasAc === true ? 'left-5' : 'left-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
