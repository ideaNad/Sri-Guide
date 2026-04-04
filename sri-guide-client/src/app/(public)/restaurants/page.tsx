'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, MapPin, Utensils, 
  Leaf, CreditCard, ChevronDown, X, Info
} from 'lucide-react';
import apiClient from '@/services/api-client';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthContext';
import AuthModal from '@/features/auth/components/AuthModal';

const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Moneragala", "Ratnapura", "Kegalle"
];

const CUISINES = [
  "Sri Lankan", "Indian", "Chinese", "Italian", "Japanese", "Western", 
  "Seafood", "Fast Food", "Vegetarian", "Vegan", "Fusion", "Desserts"
];

const PRICE_RANGES = [
  { label: "Economy ($)", value: "$" },
  { label: "Standard ($$)", value: "$$" },
  { label: "Premium ($$$)", value: "$$$" }
];

const DIETARY = [
  "Vegetarian", "Vegan", "Halal", "Gluten-Free"
];

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  coverImage?: string;
  logo?: string;
  description?: string;
  priceRange?: string;
  cuisineTypes: string[];
  rating: number;
  reviewCount: number;
}

export default function RestaurantsPage() {
  const { user, login } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    district: "",
    cuisineType: "",
    priceRange: "",
    dietaryOption: ""
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filters.district) params.append("district", filters.district);
      if (filters.cuisineType) params.append("cuisineType", filters.cuisineType);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.dietaryOption) params.append("dietaryOption", filters.dietaryOption);

      const { data } = await apiClient.get<Restaurant[]>(`/restaurants?${params.toString()}`);
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to fetch restaurants", error);
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRestaurants();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, filters, fetchRestaurants]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const clearFilters = () => {
    setFilters({
      district: "",
      cuisineType: "",
      priceRange: "",
      dietaryOption: ""
    });
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -z-10" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-primary/10 shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Culinart Adventures</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8 italic uppercase"
            >
              The Taste <br /> Of <span className="text-primary underline decoration-gray-900/10">Paradise</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed mb-10"
            >
              From beachfront seafood shacks to hidden gem bistros, discover the most authentic and vibrant 
              dining experiences across Sri Lanka. Real people, real flavors, real stories.
            </motion.p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Seafood, Kandy, Live Music..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 pl-14 pr-6 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 font-bold shadow-2xl shadow-primary/5"
                />
              </div>
              <button 
                type="submit"
                className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl shadow-gray-900/20 active:scale-95"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-10 sticky top-32 h-[calc(100vh-200px)] overflow-y-auto pr-4 scrollbar-hide">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center justify-between">
                Filters
                <button onClick={clearFilters} className="text-[10px] text-primary hover:text-primary transition-all">Reset All</button>
              </h3>
              
              <div className="space-y-8">
                {/* District */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={10} /> District
                  </label>
                  <select 
                    value={filters.district}
                    onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-gray-900 transition-all"
                  >
                    <option value="">All Regions</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Cuisine */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Utensils size={10} /> Cuisine Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {CUISINES.map(c => (
                      <button
                        key={c}
                        onClick={() => setFilters(prev => ({ ...prev, cuisineType: prev.cuisineType === c ? "" : c }))}
                        className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                          filters.cuisineType === c 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-primary/5"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={10} /> Price Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map(p => (
                      <button
                        key={p.value}
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: prev.priceRange === p.value ? "" : p.value }))}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all border ${
                          filters.priceRange === p.value 
                            ? "bg-gray-900 text-white border-gray-900" 
                            : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-primary/5"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Leaf size={10} /> Dietary Preference
                  </label>
                  <select 
                    value={filters.dietaryOption}
                    onChange={(e) => setFilters(prev => ({ ...prev, dietaryOption: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-gray-900 transition-all"
                  >
                    <option value="">Any Option</option>
                    {DIETARY.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{restaurants.length} Restaurants Found</p>
            <button 
              onClick={() => setIsFilterSidebarOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
            >
              <SlidersHorizontal size={14} /> Filter
            </button>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 hidden lg:flex">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">Culinart Selection</h2>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{restaurants.length} Destinations</span>
                </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[400px] bg-gray-50 rounded-[2.5rem]" />
                ))}
              </div>
            ) : restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {restaurants.map((rest) => (
                  <RestaurantCard key={rest.id} restaurant={rest} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-gray-100">
                  <X size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">No Restaurants Found</h3>
                <p className="text-gray-500 font-medium max-w-sm">
                  We couldn't find anything matching your exact criteria. Try broadening your search or resetting filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="mt-8 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterSidebarOpen(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[60]" 
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[70] p-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-gray-900 uppercase italic">Refine <br /> <span className="text-primary text-lg">Results</span></h2>
                <button 
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-10 pb-20">
                {/* Mobile Filters Content (Same as Desktop but in drawer) */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={10} /> District
                  </label>
                  <select 
                    value={filters.district}
                    onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none font-bold"
                  >
                    <option value="">All Regions</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Utensils size={10} /> Cuisine Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINES.map(c => (
                      <button
                        key={c}
                        onClick={() => setFilters(prev => ({ ...prev, cuisineType: prev.cuisineType === c ? "" : c }))}
                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                          filters.cuisineType === c 
                            ? "bg-primary text-white border-primary" 
                            : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={10} /> Price Range
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {PRICE_RANGES.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setFilters(prev => ({ ...prev, priceRange: prev.priceRange === p.value ? "" : p.value }))}
                            className={`px-6 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all border ${
                            filters.priceRange === p.value 
                                ? "bg-gray-900 text-white border-gray-900 shadow-xl" 
                                : "bg-gray-50 text-gray-500 border-gray-100"
                            }`}
                        >
                            {p.label}
                        </button>
                        ))}
                    </div>
                </div>

                <button 
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Public Social Call to Action */}
      <section className="bg-gray-900 py-32 mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
                Are You A <br /> <span className="text-primary">Restaurant Owner?</span>
            </h2>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto mb-12 text-lg">
                Join our premium network of destinations. List your menus, events, and reach thousands of travelers looking for authentic experiences.
            </p>
            <Link 
                href="/register?role=RestaurantOwner"
                className="inline-flex items-center gap-4 bg-white text-gray-900 px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95"
            >
                Register Your Business
            </Link>
        </div>
      </section>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => { login(userData); setIsAuthModalOpen(false); fetchRestaurants(); }}
      />
    </div>
  );
}
