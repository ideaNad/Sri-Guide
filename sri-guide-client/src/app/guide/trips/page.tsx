"use client";

import React, { useEffect, useState } from "react";
import { 
    Plus, MapPin, Calendar, Trash2, 
    Image as ImageIcon, Loader2, Compass,
    ChevronLeft, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";

interface Trip {
    id: string;
    title: string;
    primaryImageUrl?: string;
    date?: string;
    description?: string;
    location?: string;
    images?: string[];
}

export default function GuideTripsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newTrip, setNewTrip] = useState({
        title: "",
        description: "",
        location: "",
        date: ""
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [viewingTrip, setViewingTrip] = useState<Trip | null>(null);
    const [editingTripId, setEditingTripId] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchTrips();
        }
    }, [user]);

    const fetchTrips = async () => {
        try {
            const response = await apiClient.get(`/trip/guide/${user?.id}`);
            setTrips(response.data as Trip[]);
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check image limit
        const totalImages = existingImages.length + selectedFiles.length;
        if (totalImages > 5) {
            alert("Maximum 5 photos allowed per adventure.");
            return;
        }

        setSubmitting(true);
        try {
            let tripId = editingTripId;
            if (editingTripId) {
                await apiClient.put(`/trip/${editingTripId}`, { ...newTrip, tripId: editingTripId });
            } else {
                const response = await apiClient.post("/trip", newTrip);
                tripId = response.data as string; // The returned Guid
            }

            // Upload photos if any
            if (selectedFiles.length > 0 && tripId) {
                for (const file of selectedFiles) {
                    const formData = new FormData();
                    formData.append("file", file);
                    await apiClient.post(`/trip/${tripId}/upload-photo`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                }
            }

            setIsAdding(false);
            setEditingTripId(null);
            setNewTrip({ title: "", description: "", location: "", date: "" });
            setSelectedFiles([]);
            fetchTrips();
        } catch (error) {
            console.error("Failed to create trip", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageUpload = async (tripId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setSubmitting(true); // Can reuse submitting state to show loading maybe? Or just await silently.
        
        try {
            // Check current images count
            const currentTrip = trips.find(t => t.id === tripId);
            const currentCount = currentTrip?.images?.length || 0;
            
            if (currentCount + files.length > 5) {
                alert(`You can only upload ${5 - currentCount} more photo(s). Total limit is 5.`);
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);

                await apiClient.post(`/trip/${tripId}/upload-photo`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            fetchTrips();
        } catch (error) {
            console.error("Failed to upload trip photos", error);
        } finally {
            // Reset the input so the same files can be selected again if needed
            event.target.value = '';
            setSubmitting(false);
        }
    };

    const handleRemoveExistingImage = async (imageUrl: string) => {
        if (!editingTripId || !confirm("Remove this photo from your trip?")) return;
        try {
            await apiClient.delete(`/trip/${editingTripId}/photo?imageUrl=${encodeURIComponent(imageUrl)}`);
            setExistingImages(prev => prev.filter(img => img !== imageUrl));
            fetchTrips(); // Refresh the overarching list to get the updated primaryImageUrl if needed
        } catch (error) {
            console.error("Failed to delete trip photo", error);
        }
    };

    const handleDeleteTrip = async (tripId: string) => {
        if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
        try {
            await apiClient.delete(`/trip/${tripId}`);
            fetchTrips();
        } catch (error) {
            console.error("Failed to delete trip", error);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <button 
                        onClick={() => router.push("/guide")}
                        className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors mb-4"
                    >
                        <ChevronLeft size={14} /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                        My <span className="text-primary text-stroke-primary">Trips</span>
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">Document your latest adventures and share them with the world.</p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => {
                            setEditingTripId(null);
                            setNewTrip({ title: "", description: "", location: "", date: "" });
                            setIsAdding(true);
                        }}
                        className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-900/10"
                    >
                        <Plus size={18} /> Add New Trip
                    </button>
                )}
            </header>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-xl max-w-2xl mx-auto"
                    >
                        <form onSubmit={handleCreateTrip} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Trip Title</label>
                                <input 
                                    required
                                    placeholder="e.g. Sunset at Sigiriya"
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={newTrip.title}
                                    onChange={(e) => setNewTrip({...newTrip, title: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            required
                                            placeholder="Location"
                                            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            value={newTrip.location}
                                            onChange={(e) => setNewTrip({...newTrip, location: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Trip Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            type="date"
                                            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            value={newTrip.date}
                                            onChange={(e) => setNewTrip({...newTrip, date: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Description</label>
                                <textarea 
                                    required
                                    rows={4}
                                    placeholder="Tell the story of this trip..."
                                    className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    value={newTrip.description}
                                    onChange={(e) => setNewTrip({...newTrip, description: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Upload Trip Photos (Optional)</label>
                                <div className="relative w-full border-2 border-dashed border-gray-200 rounded-[1.5rem] px-6 py-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors bg-gray-50/50">
                                    <ImageIcon className="text-gray-300" size={32} />
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-gray-900 mb-1">Drag and drop or click to upload</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const newFiles = Array.from(e.target.files);
                                                if (existingImages.length + newFiles.length > 5) {
                                                    alert("Total photos cannot exceed 5. Please select fewer files.");
                                                    e.target.value = "";
                                                    return;
                                                }
                                                setSelectedFiles(newFiles);
                                            }
                                        }}
                                    />
                                    {existingImages.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center w-full">
                                            {existingImages.map((imgUrl, i) => (
                                                <div key={`existing-${i}`} className="h-20 w-20 rounded-xl overflow-hidden shadow-sm relative group z-10">
                                                    <img 
                                                        src={imgUrl.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${imgUrl}` : imgUrl} 
                                                        alt="Existing trip photo" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveExistingImage(imgUrl)}
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                            {selectedFiles.map((f, i) => (
                                                <div key={i} className="px-3 py-1 bg-white rounded-lg shadow-sm text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 border border-gray-100 relative z-10">
                                                    <span className="truncate max-w-[100px]">{f.name}</span>
                                                    <button type="button" onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))} className="text-rose-500 hover:text-rose-600">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsAdding(false);
                                        setEditingTripId(null);
                                        setExistingImages([]);
                                        setSelectedFiles([]);
                                    }}
                                    className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={submitting}
                                    type="submit"
                                    className="flex-3 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingTripId ? "Update Trip" : "Publish Trip")}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {loading ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
                                <Loader2 className="animate-spin text-primary" size={48} />
                                <p className="font-black text-gray-400 uppercase text-xs tracking-[0.3em]">Loading Adventures...</p>
                            </div>
                        ) : trips.length > 0 ? (
                            trips.map((trip, i) => (
                                <motion.div
                                    key={trip.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setViewingTrip(trip)}
                                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
                                >
                                    <div className="h-48 bg-gray-100 relative group/image">
                                        {trip.primaryImageUrl ? (
                                            <img 
                                                src={trip.primaryImageUrl?.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${trip.primaryImageUrl}` : trip.primaryImageUrl} 
                                                alt={trip.title} 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                                <ImageIcon size={32} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">No Photos Added</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                            <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                                                <Plus size={14} /> Upload Photo
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    multiple
                                                    className="hidden" 
                                                    onChange={(e) => handleImageUpload(trip.id, e)} 
                                                />
                                            </label>
                                        </div>
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNewTrip({
                                                        title: trip.title,
                                                        description: trip.description || "",
                                                        location: trip.location || "",
                                                        date: trip.date ? new Date(trip.date).toISOString().split('T')[0] : ""
                                                    });
                                                    setEditingTripId(trip.id);
                                                    setExistingImages(trip.images || []);
                                                    setIsAdding(true);
                                                    // In edit view we need tracking of existing images
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTrip(trip.id);
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mb-3">
                                            <Calendar size={12} />
                                            {trip.date ? new Date(trip.date).toLocaleDateString() : "No date"}
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors mb-2 italic uppercase">{trip.title}</h3>
                                        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs mb-4">
                                            <MapPin size={14} className="text-gray-200" />
                                            {trip.location}
                                        </div>
                                        <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed">{trip.description}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white rounded-[2.5rem] p-16 border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-6">
                                    <Compass size={32} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase italic mb-2">Start Your Travel Journal</h3>
                                <p className="text-gray-400 font-bold text-sm max-w-sm mb-8">You haven&apos;t shared any trips yet. Add your first adventure to show tourists what you can offer!</p>
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-900/10"
                                >
                                    Share Your First Adventure
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trip View Modal */}
            <AnimatePresence>
                {viewingTrip && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                            onClick={() => setViewingTrip(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="pr-12">
                                        <h2 className="text-3xl font-black text-gray-900 uppercase italic mb-3 underline decoration-primary/30 decoration-4 underline-offset-8">{viewingTrip.title}</h2>
                                        <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-gray-400">
                                            <span className="flex items-center gap-2"><Calendar size={14} className="text-primary"/> {viewingTrip.date ? new Date(viewingTrip.date).toLocaleDateString() : "No Date"}</span>
                                            <span className="flex items-center gap-2"><MapPin size={14} className="text-gray-300"/> {viewingTrip.location}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setViewingTrip(null)}
                                        className="w-12 h-12 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                                    >
                                        <Plus size={24} className="rotate-45" />
                                    </button>
                                </div>

                                <p className="text-gray-600 text-lg leading-relaxed font-medium mb-12">
                                    {viewingTrip.description}
                                </p>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic flex items-center gap-3 border-b-2 border-gray-100 pb-4">
                                        <div className="bg-primary/10 p-2 rounded-xl">
                                            <ImageIcon className="text-primary" size={18} />
                                        </div>
                                        Photo Gallery
                                    </h3>
                                    
                                    {viewingTrip.images && viewingTrip.images.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {viewingTrip.images.map((img, idx) => (
                                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 group relative border border-gray-100 shadow-sm">
                                                    <img 
                                                        src={img.startsWith("/") ? `${apiClient.defaults.baseURL?.replace('/api', '')}${img}` : img} 
                                                        alt={`Trip photo ${idx + 1}`} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 shadow-sm mb-6">
                                                <ImageIcon size={32} />
                                            </div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-2">No Photos Added</h4>
                                            <p className="text-xs font-bold text-gray-400 max-w-xs">Upload some photos to showcase this amazing experience.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
