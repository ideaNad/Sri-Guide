"use client";

import React, { useState, useEffect } from "react";
import {
    Clock, MapPin, DollarSign, Image as ImageIcon, Plus, Trash2,
    ArrowRight, Map as MapIcon, Tag, Info, Camera, Send, ChevronRight, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import ImageUpload from "@/components/ui/ImageUpload";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";


// SRI LANKA DISTRICTS
const DISTRICTS = [
    "Island-wide", "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna",
    "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu",
    "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

// TOUR CATEGORIES
const CATEGORIES = [
    "Adventure", "Culture", "Wild Life", "Beach", "Hiking", "Spiritual", "Culinary", "Luxury", "Photography", "Surfing", "Wellness"
];

const CreateTourPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: [] as string[],
        category: [] as string[],
        price: 0,
        date: "",
        duration: "",
        participantCount: "",
        mapLink: "",
        mainImageUrl: "",
        additionalImages: [] as string[],
        guideId: null as string | null,
        itinerary: [] as any[],
        dayDescriptions: [
            { dayNumber: 1, description: "", imageUrl: "" }
        ],
        isActive: true
    });

    const [locationSearch, setLocationSearch] = useState("");
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const toggleLocation = (loc: string) => {
        if (loc === "Island-wide") {
            setFormData(prev => ({ ...prev, location: ["Island-wide"] }));
            return;
        }
        setFormData(prev => {
            const current = prev.location.filter(l => l !== "Island-wide");
            if (current.includes(loc)) {
                return { ...prev, location: current.filter(l => l !== loc) };
            }
            return { ...prev, location: [...current, loc] };
        });
    };

    const toggleCategory = (cat: string) => {
        setFormData(prev => {
            if (prev.category.includes(cat)) {
                return { ...prev, category: prev.category.filter(c => c !== cat) };
            }
            return { ...prev, category: [...prev.category, cat] };
        });
    };

    const handleAddActivity = (dayNumber: number) => {
        const dayActivities = formData.itinerary.filter(i => i.dayNumber === dayNumber);
        const newOrder = dayActivities.length + 1;
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, {
                time: "", title: "", description: "", imageUrl: "", dayNumber, order: newOrder
            }]
        });
    };
    const handleAddDay = () => {
        const maxDay = formData.dayDescriptions.length > 0 ? Math.max(...formData.dayDescriptions.map(d => d.dayNumber)) : 0;
        const newDay = maxDay + 1;
        setFormData({
            ...formData,
            dayDescriptions: [...formData.dayDescriptions, { dayNumber: newDay, description: "", imageUrl: "" }]
        });
    };

    const handleRemoveDay = (dayNumber: number) => {
        setFormData(prev => {
            const newItinerary = prev.itinerary
                .filter(i => i.dayNumber !== dayNumber)
                .map(i => {
                    if (i.dayNumber > dayNumber) {
                        return { ...i, dayNumber: i.dayNumber - 1 };
                    }
                    return i;
                });
            const newDayDescriptions = prev.dayDescriptions
                .filter(d => d.dayNumber !== dayNumber)
                .map(d => {
                    if (d.dayNumber > dayNumber) {
                        return { ...d, dayNumber: d.dayNumber - 1 };
                    }
                    return d;
                });
            return { ...prev, itinerary: newItinerary, dayDescriptions: newDayDescriptions };
        });
    };

    const handleSubmit = async () => {
        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.title) newErrors.title = "A compelling title is required";
        if (!formData.description) newErrors.description = "Please share the soul of the journey";
        if (formData.location.length === 0) newErrors.location = "Select at least one operating area";
        if (formData.category.length === 0) newErrors.category = "Select at least one category";
        if (formData.price < 0) newErrors.price = "Enter a valid base price";
        if (!formData.duration) newErrors.duration = "Specify the duration (e.g. 3 Days)";
        if (!formData.mainImageUrl) newErrors.mainImageUrl = "A main cover image is mandatory";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please complete all required fields and try again!", "Validation Error");
            setStep(1); // Jump back to narratives if errors there
            return;
        }


        setLoading(true);
        setErrors({});
        try {
            const payload = {
                ...formData,
                location: formData.location.join(", "),
                category: formData.category.join(", "),
                date: formData.date && formData.date.trim() !== "" ? new Date(formData.date).toISOString() : null,
                price: Math.max(0, Number(formData.price)),
                itinerary: formData.itinerary.map(s => ({
                    ...s,
                    imageUrl: s.imageUrl || null
                })),
                dayDescriptions: formData.dayDescriptions
            };
            await apiClient.post("/Agency/tours", payload);
            router.push("/agency/tours");
        } catch (error: any) {
            console.error("Failed to create tour", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            toast.error("Failed to publish adventure. Please check the highlights and try again!", "Publish Error");
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${apiClient.defaults.baseURL?.replace("/api", "")}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const filteredDistricts = DISTRICTS.filter(d => d.toLowerCase().includes(locationSearch.toLowerCase()));
    const filteredCategories = CATEGORIES.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Modern Progress Stepper */}
                <div className="flex items-center gap-6 mb-12 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm w-fit mx-auto">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${step === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400'}`}>
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-black text-[10px]">1</div>
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Core Narrative</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-200" />
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${step === 2 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400'}`}>
                        <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center font-black text-[10px]">2</div>
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Daily Itinerary</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Single Unified Form Card */}
                            <div className="bg-white p-8 md:p-16 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 space-y-16">

                                {/* 1. Identity Section */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic uppercase">Tour Identity</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Essential logistics of your experience</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Experience Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="The Ultimate Ella Trekking Adventure"
                                                className={`w-full bg-gray-50 border-transparent rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none ${errors.title ? 'border-rose-300 bg-rose-50/20' : ''}`}
                                            />
                                            {errors.title && <p className="text-[9px] font-bold text-rose-500 mt-2 ml-2 uppercase tracking-widest">{errors.title}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Base Price (USD)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={18} />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={formData.price}
                                                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                                        className={`w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none ${errors.price ? 'border-rose-300 bg-rose-50/20' : ''}`}
                                                    />
                                                    {errors.price && <p className="text-[9px] font-bold text-rose-500 mt-2 ml-2 uppercase tracking-widest">{errors.price}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Participant Count</label>
                                                <div className="flex items-center justify-between bg-gray-50 rounded-2xl py-3 px-6 h-[60px]">
                                                    <div className="flex items-center gap-3">
                                                        <Users className="text-teal-600 flex-shrink-0" size={18} />
                                                        <span className="text-sm font-bold text-gray-500"></span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, participantCount: Math.max(1, (Number(prev.participantCount) || 1) - 1).toString() }))}
                                                            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-teal-200 hover:text-teal-600 transition-all font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-lg font-black text-gray-900 w-4 text-center">{formData.participantCount || "1"}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, participantCount: ((Number(prev.participantCount) || 1) + 1).toString() }))}
                                                            className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white hover:bg-teal-700 transition-all font-bold shadow-sm shadow-teal-500/20"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Searchable Location Dropdown */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Operating Areas</label>
                                            <div className="relative">
                                                <div
                                                    className="w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus-within:bg-white focus-within:border-teal-200 transition-all cursor-pointer flex items-center justify-between"
                                                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                                                >
                                                    <MapPin className="absolute left-6 text-teal-600" size={18} />
                                                    <span className={formData.location.length === 0 ? "text-gray-400" : "text-gray-900"}>
                                                        {formData.location.length === 0 ? "Select Locations" : formData.location.join(", ").length > 30 ? `${formData.location.length} selected` : formData.location.join(", ")}
                                                    </span>
                                                    <ArrowRight className={`text-gray-400 transition-transform duration-300 ${isLocationDropdownOpen ? 'rotate-90' : ''}`} size={16} />
                                                </div>
                                                {errors.location && <p className="text-[9px] font-bold text-rose-500 mt-2 ml-2 uppercase tracking-widest">{errors.location}</p>}

                                                <AnimatePresence>
                                                    {isLocationDropdownOpen && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setIsLocationDropdownOpen(false)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl z-20 overflow-hidden"
                                                            >
                                                                <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search districts..."
                                                                        value={locationSearch}
                                                                        onChange={e => setLocationSearch(e.target.value)}
                                                                        className="w-full bg-white border-transparent rounded-2xl px-6 py-3 text-xs font-bold focus:border-teal-200 transition-all outline-none"
                                                                        onClick={e => e.stopPropagation()}
                                                                    />
                                                                </div>
                                                                <div className="max-h-[300px] overflow-y-auto p-5 custom-scrollbar grid grid-cols-2 gap-2">
                                                                    {filteredDistricts.map(loc => (
                                                                        <button
                                                                            key={loc}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleLocation(loc);
                                                                            }}
                                                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-[10px] font-black uppercase tracking-wider transition-all ${formData.location.includes(loc)
                                                                                ? 'bg-teal-50 text-teal-600'
                                                                                : 'hover:bg-gray-50 text-gray-500'
                                                                                }`}
                                                                        >
                                                                            <div className={`w-4 h-4 rounded-lg border flex items-center justify-center transition-colors ${formData.location.includes(loc) ? 'bg-teal-600 border-teal-600 shadow-lg shadow-teal-600/20' : 'border-gray-200 bg-white'
                                                                                }`}>
                                                                                {formData.location.includes(loc) && <span className="text-white text-[8px]">✓</span>}
                                                                            </div>
                                                                            {loc}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-4 px-2">
                                                {formData.location.map(loc => (
                                                    <span key={loc} className="bg-teal-50 text-teal-600 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-100 flex items-center gap-3 group">
                                                        {loc}
                                                        <button onClick={() => toggleLocation(loc)} className="hover:text-rose-500 text-gray-300 transition-colors">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Searchable Category Dropdown */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Experience Categories</label>
                                            <div className="relative">
                                                <div
                                                    className={`w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus-within:bg-white focus-within:border-teal-200 transition-all cursor-pointer flex items-center justify-between ${errors.category ? 'border-rose-300 bg-rose-50/20' : ''}`}
                                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                                >
                                                    <Tag className="absolute left-6 text-teal-600" size={18} />
                                                    <span className={formData.category.length === 0 ? "text-gray-400" : "text-gray-900"}>
                                                        {formData.category.length === 0 ? "Select Categories" : formData.category.join(", ").length > 30 ? `${formData.category.length} selected` : formData.category.join(", ")}
                                                    </span>
                                                    <ArrowRight className={`text-gray-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-90' : ''}`} size={16} />
                                                </div>
                                                {errors.category && <p className="text-[9px] font-bold text-rose-500 mt-2 ml-2 uppercase tracking-widest">{errors.category}</p>}

                                                <AnimatePresence>
                                                    {isCategoryDropdownOpen && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl z-20 overflow-hidden"
                                                            >
                                                                <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search categories..."
                                                                        value={categorySearch}
                                                                        onChange={e => setCategorySearch(e.target.value)}
                                                                        className="w-full bg-white border-transparent rounded-2xl px-6 py-3 text-xs font-bold focus:border-teal-200 transition-all outline-none"
                                                                        onClick={e => e.stopPropagation()}
                                                                    />
                                                                </div>
                                                                <div className="max-h-[300px] overflow-y-auto p-5 custom-scrollbar grid grid-cols-2 gap-2">
                                                                    {filteredCategories.map(cat => (
                                                                        <button
                                                                            key={cat}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleCategory(cat);
                                                                            }}
                                                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-[10px] font-black uppercase tracking-wider transition-all ${formData.category.includes(cat)
                                                                                ? 'bg-emerald-50 text-emerald-600'
                                                                                : 'hover:bg-gray-50 text-gray-500'
                                                                                }`}
                                                                        >
                                                                            <div className={`w-4 h-4 rounded-lg border flex items-center justify-center transition-colors ${formData.category.includes(cat) ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-600/20' : 'border-gray-200 bg-white'
                                                                                }`}>
                                                                                {formData.category.includes(cat) && <span className="text-white text-[8px]">✓</span>}
                                                                            </div>
                                                                            {cat}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-4 px-2">
                                                {formData.category.map(cat => (
                                                    <span key={cat} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-3 group">
                                                        {cat}
                                                        <button onClick={() => toggleCategory(cat)} className="hover:text-rose-500 text-gray-300 transition-colors">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Duration</label>
                                            <div className="relative">
                                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.duration}
                                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                                    placeholder="e.g. 3 Days"
                                                    className={`w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none ${errors.duration ? 'border-rose-300 bg-rose-50/20' : ''}`}
                                                />
                                                {errors.duration && <p className="text-[9px] font-bold text-rose-500 mt-2 ml-2 uppercase tracking-widest">{errors.duration}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-50" />

                                {/* 2. Narrative & Map Link Section */}
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                                <Send size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic uppercase">Narrative & Context</h2>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Share the soul of the journey</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <MapIcon size={18} className="text-teal-600" />
                                                <input
                                                    type="url"
                                                    value={formData.mapLink}
                                                    onChange={e => setFormData({ ...formData, mapLink: e.target.value })}
                                                    placeholder="Google Map Link"
                                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none w-48"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`rich-text-container bg-gray-50 rounded-[3rem] border border-transparent focus-within:bg-white focus-within:border-teal-200 transition-all overflow-hidden p-6 ${errors.description ? 'border-rose-300 bg-rose-50/20' : ''}`}>
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.description}
                                                onChange={val => setFormData({ ...formData, description: val })}
                                                className="quill-editor h-80"
                                                placeholder="Describe the adventure in rich detail..."
                                            />
                                        </div>
                                        {errors.description && <p className="text-[9px] font-bold text-rose-500 mt-2 ml-2 uppercase tracking-widest">{errors.description}</p>}
                                    </div>
                                </div>

                                <hr className="border-gray-50" />

                                {/* 3. Media Gallery Card */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                                            <Camera size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic uppercase">Visual Showcase</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">A journey is best seen, then lived</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                        <div className="lg:col-span-12 space-y-8">
                                            <label className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] ml-2">Main Cover Image</label>
                                            <div className="max-w-2xl mx-auto">
                                                <ImageUpload
                                                    value={formData.mainImageUrl}
                                                    onChange={(url) => setFormData({ ...formData, mainImageUrl: url })}
                                                    aspectRatio="video"
                                                    className={`shadow-2xl shadow-gray-200/50 ${errors.mainImageUrl ? 'border-2 border-rose-300 ring-4 ring-rose-50' : ''}`}
                                                />
                                                {errors.mainImageUrl && <p className="text-[9px] font-bold text-rose-500 mt-4 text-center uppercase tracking-widest">{errors.mainImageUrl}</p>}
                                            </div>
                                        </div>

                                        <div className="lg:col-span-12 space-y-8">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Tour Gallery</label>
                                                <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-4 py-2 rounded-full uppercase tracking-widest italic">Experience Gallery</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                                {formData.additionalImages.map((img, idx) => (
                                                    <div key={idx} className="relative group aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50 transform transition-all duration-500 hover:scale-[1.02]">
                                                        <img src={getImageUrl(img)} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, additionalImages: prev.additionalImages.filter((_, i) => i !== idx) }))}
                                                                className="bg-white/90 text-rose-500 p-4 rounded-2xl transform hover:scale-110 transition-all border border-rose-100"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {formData.additionalImages.length < 5 && (
                                                    <div className="aspect-video">
                                                        <ImageUpload
                                                            value=""
                                                            multiple={true}
                                                            maxCount={5}
                                                            currentCount={formData.additionalImages.length}
                                                            onChange={(url) => setFormData(prev => ({ ...prev, additionalImages: [...prev.additionalImages, url] }))}
                                                            onMultipleChange={(urls) => setFormData(prev => ({ ...prev, additionalImages: [...prev.additionalImages, ...urls].slice(0, 5) }))}
                                                            aspectRatio="video"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex justify-end pt-8">
                                <button
                                    onClick={() => {
                                        if (!formData.title || !formData.mainImageUrl) {
                                            toast.warning("Please add at least a title and a cover image!", "Missing Information");
                                            return;
                                        }
                                        setStep(2);
                                    }}

                                    className="bg-primary hover:bg-secondary text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 flex items-center gap-4 group"
                                >
                                    Next Phase
                                    <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform duration-300" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic uppercase text-left">Daily Itinerary</h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Map out the moments of the journey</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddDay}
                                    className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl transition-all shadow-lg shadow-teal-600/20"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="space-y-16 mt-10">
                                {formData.dayDescriptions.sort((a, b) => a.dayNumber - b.dayNumber).map(day => {
                                    const dayNum = day.dayNumber;
                                    return (
                                        <div key={dayNum} className="space-y-8 p-10 bg-gray-50/50 rounded-[3rem] border border-gray-100/50 relative group/day">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-teal-600/20">
                                                        D{dayNum}
                                                    </div>
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight italic uppercase">Day {dayNum} Experience</h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleAddActivity(dayNum)}
                                                        className="flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-teal-100 hover:bg-teal-50 transition-all shadow-sm"
                                                    >
                                                        <Plus size={14} />
                                                        Add Activity
                                                    </button>
                                                    {dayNum > 1 && (
                                                        <button
                                                            onClick={() => handleRemoveDay(dayNum)}
                                                            className="bg-white text-rose-500 p-2 rounded-xl border border-rose-100 hover:bg-rose-50 transition-all shadow-sm"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4 px-2 mb-8">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Day Overview</label>
                                                <textarea
                                                    rows={2}
                                                    value={formData.dayDescriptions.find(d => d.dayNumber === dayNum)?.description || ""}
                                                    onChange={e => {
                                                        const newDays = [...formData.dayDescriptions];
                                                        const dayIdx = newDays.findIndex(d => d.dayNumber === dayNum);
                                                        if (dayIdx > -1) {
                                                            newDays[dayIdx].description = e.target.value;
                                                            setFormData({ ...formData, dayDescriptions: newDays });
                                                        }
                                                    }}
                                                    placeholder="What makes this day special? (Optional)"
                                                    className="w-full bg-white border-transparent rounded-[1.5rem] px-8 py-5 text-sm font-medium text-gray-700 focus:border-teal-200 transition-all outline-none resize-none leading-relaxed shadow-sm italic text-left"
                                                />
                                            </div>

                                            <div className="space-y-4 px-2 mb-8">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Day Image</label>
                                                <div className="max-w-xs transition-all duration-500 ease-in-out">
                                                    <ImageUpload
                                                        value={formData.dayDescriptions.find(d => d.dayNumber === dayNum)?.imageUrl || ""}
                                                        onChange={url => {
                                                            const newDays = [...formData.dayDescriptions];
                                                            const dayIdx = newDays.findIndex(d => d.dayNumber === dayNum);
                                                            if (dayIdx > -1) {
                                                                newDays[dayIdx].imageUrl = url;
                                                                setFormData({ ...formData, dayDescriptions: newDays });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-8 mt-10">
                                                {formData.itinerary.filter(i => i.dayNumber === dayNum).length > 0 ? (
                                                    formData.itinerary.filter(i => i.dayNumber === dayNum).sort((a, b) => a.order - b.order).map((item, idx) => {
                                                        const globalIndex = formData.itinerary.findIndex(it => it === item);
                                                        return (
                                                            <motion.div
                                                                key={idx}
                                                                layout
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="relative bg-gray-50/50 rounded-[2.5rem] p-10 border border-gray-100 hover:border-teal-100 transition-all group"
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        const newItinerary = [...formData.itinerary];
                                                                        newItinerary.splice(globalIndex, 1);
                                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                                    }}
                                                                    className="absolute -top-3 -right-3 p-3 bg-white text-rose-500 rounded-2xl shadow-xl border border-rose-50 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                                                                    <div className="space-y-8">
                                                                        <div className="flex gap-4">
                                                                            <div className="flex-1 space-y-3">
                                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Title</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.title}
                                                                                    onChange={e => {
                                                                                        const newItinerary = [...formData.itinerary];
                                                                                        newItinerary[globalIndex].title = e.target.value;
                                                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                                                    }}
                                                                                    placeholder="Activity Title"
                                                                                    className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:border-teal-200 transition-all outline-none"
                                                                                />
                                                                            </div>
                                                                            <div className="w-32 space-y-3">
                                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Time</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.time}
                                                                                    onChange={e => {
                                                                                        const newItinerary = [...formData.itinerary];
                                                                                        newItinerary[globalIndex].time = e.target.value;
                                                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                                                    }}
                                                                                    placeholder="Time"
                                                                                    className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:border-teal-200 transition-all outline-none"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-3">
                                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Highlights</label>
                                                                            <textarea
                                                                                rows={3}
                                                                                value={item.description}
                                                                                onChange={e => {
                                                                                    const newItinerary = [...formData.itinerary];
                                                                                    newItinerary[globalIndex].description = e.target.value;
                                                                                    setFormData({ ...formData, itinerary: newItinerary });
                                                                                }}
                                                                                placeholder="Brief description"
                                                                                className="w-full bg-white border-transparent rounded-[1.5rem] px-8 py-5 text-sm font-medium text-gray-700 focus:border-teal-200 transition-all outline-none resize-none"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Point Visual</label>
                                                                        <ImageUpload
                                                                            value={item.imageUrl}
                                                                            onChange={url => {
                                                                                const newItinerary = [...formData.itinerary];
                                                                                newItinerary[globalIndex].imageUrl = url;
                                                                                setFormData({ ...formData, itinerary: newItinerary });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="py-12 border-2 border-dashed border-gray-100 rounded-[3rem] text-center">
                                                        <Info className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose max-w-xs mx-auto">
                                                            No activities scheduled for this day. Added activities will appear here.
                                                        </p>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => handleAddActivity(dayNum)}
                                                    className="w-full py-6 rounded-[2rem] border-2 border-dashed border-teal-100 text-teal-600 font-black text-[10px] uppercase tracking-widest hover:bg-teal-50/50 hover:border-teal-300 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={16} /> Add Activity for Day {dayNum}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <button
                                    onClick={handleAddDay}
                                    className="w-full py-8 border-2 border-dashed border-gray-200 rounded-[3rem] text-gray-400 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50/30 transition-all flex flex-col items-center gap-3 group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Add New Adventure Day</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-12 border-t border-gray-50">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    Back to Narratives
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-emerald-600/30 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Publishing..." : "Launch Adventure"}
                                    <ImageIcon size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Global Styled Scrollbar for Quill & Custom Lists */}
            <style jsx global>{`
                .quill-editor .ql-toolbar {
                    border: none !important;
                    background: #f8fafc !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    padding: 1.5rem !important;
                    border-radius: 2rem 2rem 0 0 !important;
                }
                .quill-editor .ql-container {
                    border: none !important;
                    font-family: inherit !important;
                    font-size: 0.875rem !important;
                }
                .quill-editor .ql-editor {
                    padding: 2.5rem !important;
                    min-height: 250px !important;
                    font-weight: 500 !important;
                    color: #1e293b !important;
                    line-height: 1.8 !important;
                }
                .quill-editor .ql-editor.ql-blank::before {
                    color: #94a3b8 !important;
                    font-weight: 700 !important;
                    font-style: italic !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f8fafc;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default CreateTourPage;
