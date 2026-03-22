"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { 
    MapPin, Plus, Edit, Trash2, Image as ImageIcon, Loader2, X, Save, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import dynamic from 'next/dynamic';
import Link from "next/link";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface PopularPlace {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    mapLink?: string;
    viewCount: number;
    createdAt: string;
}

const PlacesManagementPage = () => {
    const [places, setPlaces] = useState<PopularPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlace, setEditingPlace] = useState<PopularPlace | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        mapLink: ""
    });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const fetchPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<PopularPlace[]>("/places");
            setPlaces(response.data);
        } catch (error) {
            console.error("Error fetching places:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);

    const handleOpenModal = (place: PopularPlace | null = null) => {
        if (place) {
            setEditingPlace(place);
            setFormData({
                title: place.title,
                description: place.description,
                imageUrl: place.imageUrl,
                mapLink: place.mapLink || ""
            });
        } else {
            setEditingPlace(null);
            setFormData({
                title: "",
                description: "",
                imageUrl: "",
                mapLink: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlace(null);
        setFormData({ title: "", description: "", imageUrl: "", mapLink: "" });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await apiClient.post<{ url: string }>("/media/upload", uploadData);
            setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPlace) {
                await apiClient.put(`/places/${editingPlace.id}`, { ...formData, id: editingPlace.id });
            } else {
                await apiClient.post("/places", formData);
            }
            fetchPlaces();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving place:", error);
            alert("Failed to save place");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this place?")) return;
        try {
            await apiClient.delete(`/places/${id}`);
            fetchPlaces();
        } catch (error) {
            console.error("Error deleting place:", error);
            alert("Failed to delete place");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#5D596C] tracking-tighter">
                        Popular <span className="text-[#7367F0]">Places</span>
                    </h1>
                    <p className="text-xs font-bold text-[#A5A3AE] uppercase tracking-widest mt-1">
                        Manage destinations shown on the landing page
                    </p>
                </div>
                
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#7367F0] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#685DD8] transition-all shadow-lg shadow-[#7367F0]/20"
                >
                    <Plus size={16} /> Add New Place
                </button>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-[#DBDADE]/50" />
                    ))
                ) : places.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-[#DBDADE] flex flex-col items-center justify-center text-[#A5A3AE]">
                        <MapPin size={48} className="mb-4 opacity-20" />
                        <p className="font-bold uppercase tracking-widest text-xs">No places added yet</p>
                    </div>
                ) : places.map((place) => (
                    <motion.div
                        key={place.id}
                        layout
                        className="bg-white rounded-[2.5rem] border border-[#DBDADE]/50 overflow-hidden group hover:shadow-2xl hover:shadow-[#7367F0]/10 transition-all duration-500 flex flex-col"
                    >
                        <div className="relative h-48 overflow-hidden shrink-0">
                            <img 
                                src={place.imageUrl.startsWith('/') ? `${apiClient.defaults.baseURL?.replace('/api', '')}${place.imageUrl}` : place.imageUrl} 
                                alt={place.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button 
                                    onClick={() => handleOpenModal(place)}
                                    className="p-3 bg-white text-[#7367F0] rounded-2xl hover:scale-110 transition-transform shadow-lg"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(place.id)}
                                    className="p-3 bg-white text-rose-500 rounded-2xl hover:scale-110 transition-transform shadow-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                                <Eye size={12} className="text-[#7367F0]" />
                                <span className="text-[10px] font-black text-[#5D596C]">{place.viewCount} views</span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                            <h3 className="text-xl font-black text-[#5D596C] italic uppercase tracking-tight mb-2 truncate">
                                {place.title}
                            </h3>
                            <div 
                                className="text-xs text-[#A5A3AE] font-medium line-clamp-2 h-8"
                                dangerouslySetInnerHTML={{ __html: place.description }}
                            />
                            <div className="mt-auto pt-6 border-t border-[#DBDADE]/30 flex items-center justify-between text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest">
                                <span>{new Date(place.createdAt).toLocaleDateString()}</span>
                                <Link href={`/places/${place.id}`} className="text-[#7367F0] hover:underline">Preview Page</Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-10 py-8 border-b border-[#DBDADE]/30 flex items-center justify-between bg-[#F8F7FA]">
                                <div>
                                    <h2 className="text-2xl font-black text-[#5D596C] italic uppercase tracking-tight">
                                        {editingPlace ? "Edit" : "Add New"} <span className="text-[#7367F0]">Place</span>
                                    </h2>
                                    <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1">
                                        Fill in the details for the destination
                                    </p>
                                </div>
                                <button onClick={handleCloseModal} className="p-2 hover:bg-[#DBDADE]/30 rounded-full transition-colors">
                                    <X className="text-[#A5A3AE]" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-[#5D596C] uppercase tracking-widest">Place Title</label>
                                            <input 
                                                type="text"
                                                required
                                                placeholder="e.g. Sigiriya Rock Fortress"
                                                className="w-full bg-[#F8F7FA] border border-[#DBDADE] rounded-2xl px-5 py-4 text-sm font-bold text-[#5D596C] outline-none focus:border-[#7367F0] focus:ring-4 focus:ring-[#7367F0]/10 transition-all"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-[#5D596C] uppercase tracking-widest">Description</label>
                                            <div className="bg-white border border-[#DBDADE] rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                                                <ReactQuill 
                                                    theme="snow"
                                                    value={formData.description}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                                                    modules={quillModules}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-[#5D596C] uppercase tracking-widest">Google Map Link</label>
                                            <input 
                                                type="url"
                                                placeholder="https://maps.google.com/..."
                                                className="w-full bg-[#F8F7FA] border border-[#DBDADE] rounded-2xl px-5 py-4 text-sm font-bold text-[#5D596C] outline-none focus:border-[#7367F0] focus:ring-4 focus:ring-[#7367F0]/10 transition-all"
                                                value={formData.mapLink}
                                                onChange={(e) => setFormData(prev => ({ ...prev, mapLink: e.target.value }))}
                                            />
                                            <p className="text-[9px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1">Provide a shareable link from Google Maps</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[11px] font-black text-[#5D596C] uppercase tracking-widest block">Cover Image</label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative aspect-video rounded-[2.5rem] bg-[#F8F7FA] border-2 border-dashed border-[#DBDADE] hover:border-[#7367F0] cursor-pointer overflow-hidden flex flex-col items-center justify-center group transition-all"
                                        >
                                            {formData.imageUrl ? (
                                                <>
                                                    <img 
                                                        src={formData.imageUrl.startsWith('/') ? `${apiClient.defaults.baseURL?.replace('/api', '')}${formData.imageUrl}` : formData.imageUrl} 
                                                        className="w-full h-full object-cover" 
                                                        alt="Preview"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                        <ImageIcon size={32} className="mb-2" />
                                                        <span className="font-black text-[10px] uppercase tracking-widest">Change Image</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-[#A5A3AE] group-hover:text-[#7367F0]">
                                                    {uploading ? <Loader2 className="animate-spin mb-3" size={32} /> : <ImageIcon className="mb-3" size={32} />}
                                                    <span className="font-black text-[10px] uppercase tracking-widest">Upload Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleImageUpload} 
                                            className="hidden" 
                                            accept="image/*" 
                                        />
                                        <p className="text-[9px] font-bold text-[#A5A3AE] uppercase tracking-widest text-center">
                                            Recommended size: 1200x800px (JPG, PNG)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-10 py-8 bg-[#F8F7FA] border-t border-[#DBDADE]/30 flex justify-end gap-4">
                                <button 
                                    onClick={handleCloseModal}
                                    className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#A5A3AE] hover:text-[#5D596C] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSubmit}
                                    disabled={!formData.title || !formData.description || !formData.imageUrl}
                                    className="flex items-center gap-2 px-10 py-4 bg-[#67C926] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#59AD21] transition-all shadow-xl shadow-[#67C926]/20 disabled:opacity-50 disabled:shadow-none"
                                >
                                    <Save size={16} /> {editingPlace ? "Save Changes" : "Publish Place"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlacesManagementPage;
