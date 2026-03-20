"use client";

import React, { useState } from "react";
import { 
    Users, MapPin, Calendar, Clock, Plus, Trash2, 
    ArrowLeft, ArrowRight, Save, Image as ImageIcon,
    Type, DollarSign, Tag, Info, Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/services/api-client";
import ImageUpload from "@/components/ui/ImageUpload";

interface ItineraryStep {
    time: string;
    title: string;
    description: string;
    order: number;
    imageUrl?: string;
}
 
interface Guide {
    userId: string;
    name: string;
}
 
interface PaginatedResult<T> {
    items: T[];
}
 
export default function CreateTourPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [guides, setGuides] = useState<Guide[]>([]);
    
    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        category: "Adventure",
        price: 0,
        date: "",
        mainImageUrl: "",
        guideId: searchParams.get("guideId") || "",
        itinerary: [] as ItineraryStep[]
    });
 
    React.useEffect(() => {
        const fetchGuides = async () => {
            try {
                const res = await apiClient.get<PaginatedResult<Guide>>("/agency/guides?pageSize=100");
                setGuides(res.data.items);
            } catch (error) {
                console.error("Error fetching guides:", error);
            }
        };
        fetchGuides();
    }, []);

    const categories = ["Adventure", "Culture", "Wild Life", "Beach", "Hiking", "City Tour"];

    const addItineraryStep = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...prev.itinerary, 
                { time: "", title: "", description: "", order: prev.itinerary.length, imageUrl: "" }
            ]
        }));
    };

    const removeItineraryStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }))
        }));
    };

    const updateItineraryStep = (index: number, field: keyof ItineraryStep, value: string) => {
        setFormData(prev => {
            const newItinerary = [...prev.itinerary];
            newItinerary[index] = { ...newItinerary[index], [field]: value };
            return { ...prev, itinerary: newItinerary };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                guideId: formData.guideId || null,
                price: Number(formData.price),
                date: formData.date ? new Date(formData.date).toISOString() : null,
                itinerary: formData.itinerary.map(s => ({
                    ...s,
                    imageUrl: s.imageUrl || null
                }))
            };
            
            await apiClient.post("/agency/tours", payload);
            router.push("/agency/tours");
        } catch (error) {
            console.error("Error creating tour:", error);
            alert("Failed to create tour. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Inventory
                </button>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div 
                            key={i}
                            className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                                step >= i ? 'bg-teal-600' : 'bg-gray-100'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm"
                    >
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic flex items-center gap-3">
                                <Type className="text-teal-600" size={32} />
                                Basic Details
                            </h2>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 ml-11">Phase 1: Defining your experience</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Tour Title</label>
                                <input 
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Hidden Gems of Sigiriya"
                                    className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Assign Professional Guide</label>
                                <div className="relative">
                                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={18} />
                                    <select 
                                        value={formData.guideId}
                                        onChange={e => setFormData({ ...formData, guideId: e.target.value })}
                                        className="w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none appearance-none"
                                    >
                                        <option value="">No Guide Assigned (Optional)</option>
                                        {guides.map(g => <option key={g.userId} value={g.userId}>{g.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={18} />
                                    <input 
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City or Region"
                                        className="w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={18} />
                                    <select 
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none appearance-none"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <ImageUpload 
                                    label="Main Tour Image"
                                    value={formData.mainImageUrl}
                                    onChange={(url) => setFormData({ ...formData, mainImageUrl: url })}
                                    aspectRatio="video"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Base Price (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={18} />
                                    <input 
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full bg-gray-50 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the soul of this journey..."
                                rows={6}
                                className="w-full bg-gray-50 border-transparent rounded-[2rem] px-8 py-6 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none resize-none"
                            />
                        </div>

                        <div className="flex justify-end pt-8">
                            <button 
                                onClick={() => setStep(2)}
                                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                            >
                                Next Phase
                                <ArrowRight size={16} />
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
                        className="space-y-8 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight italic flex items-center gap-3">
                                    <Clock className="text-teal-600" size={32} />
                                    Daily Itinerary
                                </h2>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 ml-11">Phase 2: Sculpting the timeline</p>
                            </div>
                            <button 
                                onClick={addItineraryStep}
                                className="bg-teal-50 text-teal-600 px-6 py-3 rounded-xl font-bold text-xs hover:bg-teal-600 hover:text-white transition-all flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Step
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.itinerary.map((s, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative flex gap-6 bg-gray-50/50 p-8 rounded-[2.5rem] border border-transparent hover:border-teal-100 hover:bg-white transition-all group"
                                >
                                    <div className="w-24 shrink-0 space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                                        <input 
                                            type="time"
                                            value={s.time}
                                            onChange={e => updateItineraryStep(i, "time", e.target.value)}
                                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-black focus:border-teal-200 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Activity Title</label>
                                                <input 
                                                    type="text"
                                                    value={s.title}
                                                    onChange={e => updateItineraryStep(i, "title", e.target.value)}
                                                    placeholder="Breakfast at Temple View"
                                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-teal-200 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <ImageUpload 
                                                    label="Step Image (Optional)"
                                                    value={s.imageUrl}
                                                    onChange={(url) => updateItineraryStep(i, "imageUrl", url)}
                                                    aspectRatio="video"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Activity Notes</label>
                                            <textarea 
                                                value={s.description}
                                                onChange={e => updateItineraryStep(i, "description", e.target.value)}
                                                placeholder="Brief notes about this activity..."
                                                rows={2}
                                                className="w-full bg-white border border-gray-100 rounded-[1.5rem] px-6 py-4 text-xs font-medium focus:border-teal-200 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeItineraryStep(i)}
                                        className="absolute -right-2 -top-2 w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}

                            {formData.itinerary.length === 0 && (
                                <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 italic text-gray-400 font-bold">
                                    No steps added yet. Start by adding your first destination!
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between pt-8">
                            <button 
                                onClick={() => setStep(1)}
                                className="bg-gray-50 text-gray-500 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all flex items-center gap-3"
                            >
                                <ArrowLeft size={16} />
                                Go Back
                            </button>
                            <button 
                                onClick={() => setStep(3)}
                                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                            >
                                Next Phase
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm"
                    >
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic flex items-center gap-3">
                                <ImageIcon className="text-teal-600" size={32} />
                                Final Launch
                            </h2>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 ml-11">Phase 3: Review and publish</p>
                        </div>

                        <div className="bg-teal-50/50 p-10 rounded-[3rem] border border-teal-100 space-y-6">
                            <h3 className="text-xl font-black text-gray-900 italic tracking-tight">Summary Checklist</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-teal-50">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs">✓</div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title & Details</p>
                                        <p className="text-sm font-bold text-gray-900">{formData.title || "Missing Title"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-teal-50">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs">✓</div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Price</p>
                                        <p className="text-sm font-bold text-gray-900">${formData.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-teal-50">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs">✓</div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timetable</p>
                                        <p className="text-sm font-bold text-gray-900">{formData.itinerary.length} Activity Steps</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-teal-50">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs">✓</div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                        <p className="text-sm font-bold text-gray-900">{formData.location || "Multiple Cities"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                                <Info size={28} />
                            </div>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                Once published, this tour will be immediately visible on the platform discovery pages and your public agency profile. You can upload high-resolution photos in the next step.
                            </p>
                        </div>

                        <div className="flex justify-between pt-8">
                            <button 
                                onClick={() => setStep(2)}
                                className="bg-gray-50 text-gray-500 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all flex items-center gap-3"
                            >
                                <ArrowLeft size={16} />
                                Go Back
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || !formData.title}
                                className="bg-teal-600 text-white px-12 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-teal-700 transition-all shadow-2xl shadow-teal-600/30 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Publishing..." : "Launch Experience"}
                                <Save size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
