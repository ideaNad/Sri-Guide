"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { 
    Trophy, Plus, Edit, Trash2, Image as ImageIcon, Loader2, X, Save, 
    MapPin, Award, Crosshair, HelpCircle, Eye, EyeOff, LayoutGrid, List as ListIcon,
    Search, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

interface Quest {
    id: string;
    name: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
    proximityRadiusInMeters: number;
    category: number;
    difficulty: number;
    rewardXP: number;
    photoRequirement: string;
    iconUrl: string;
    isActive: boolean;
    createdAt: string;
}

const CATEGORIES = ["Nature", "Adventure", "Culture", "Food", "Ocean", "HiddenGems", "Extreme"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Legendary"];

export default function QuestManagementPage() {
    const { toast } = useToast();
    const { confirm } = useConfirm();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        locationName: "",
        latitude: 6.9271,
        longitude: 79.8612,
        proximityRadiusInMeters: 500,
        category: 0,
        difficulty: 0,
        rewardXP: 100,
        photoRequirement: "",
        iconUrl: "",
        isActive: true
    });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchQuests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<Quest[]>("/admin/quests");
            setQuests(response.data);
        } catch (error) {
            console.error("Error fetching quests:", error);
            toast.error("Could not load quests", "Fetch Error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuests();
    }, [fetchQuests]);

    const handleOpenModal = (quest: Quest | null = null) => {
        if (quest) {
            setEditingQuest(quest);
            setFormData({
                name: quest.name,
                description: quest.description,
                locationName: quest.locationName || "",
                latitude: quest.latitude,
                longitude: quest.longitude,
                proximityRadiusInMeters: quest.proximityRadiusInMeters,
                category: quest.category,
                difficulty: quest.difficulty,
                rewardXP: quest.rewardXP,
                photoRequirement: quest.photoRequirement,
                iconUrl: quest.iconUrl || "",
                isActive: quest.isActive
            });
        } else {
            setEditingQuest(null);
            setFormData({
                name: "",
                description: "",
                locationName: "",
                latitude: 6.9271,
                longitude: 79.8612,
                proximityRadiusInMeters: 500,
                category: 0,
                difficulty: 0,
                rewardXP: 100,
                photoRequirement: "",
                iconUrl: "",
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingQuest(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await apiClient.post<{ url: string }>("/media/upload", uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, iconUrl: response.data.url }));
            toast.success("Icon uploaded successfully");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Icon upload failed", "Upload Error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingQuest) {
                await apiClient.put(`/admin/quests/${editingQuest.id}`, { 
                    ...formData, 
                    id: editingQuest.id 
                });
                toast.success("Quest updated successfully");
            } else {
                await apiClient.post("/admin/quests", formData);
                toast.success("Quest created successfully");
            }
            fetchQuests();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving quest:", error);
            toast.error("Failed to save quest", "Save Error");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await apiClient.delete(`/admin/quests/${id}`);
            setQuests(prev => prev.map(q => q.id === id ? { ...q, isActive: !currentStatus } : q));
            toast.success(`Quest ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const filteredQuests = quests.filter(q => 
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getImageUrl = (path: string | null) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        if (path.startsWith('/uploads')) return `${apiClient.defaults.baseURL?.replace('/api', '')}${path}`;
        return path;
    };

    return (
        <div className="space-y-8 min-h-screen pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#5D596C] tracking-tighter uppercase italic">
                        Island <span className="text-[#7367F0]">Quests</span>
                    </h1>
                    <p className="text-xs font-bold text-[#A5A3AE] uppercase tracking-[0.3em] mt-1">
                        Gamification Command Center
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#DBDADE]/50 rounded-xl p-1 flex shadow-sm">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#7367F0]/10 text-[#7367F0]' : 'text-[#A5A3AE] hover:bg-gray-50'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#7367F0]/10 text-[#7367F0]' : 'text-[#A5A3AE] hover:bg-gray-50'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-[#7367F0] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#685DD8] transition-all shadow-lg shadow-[#7367F0]/20 active:scale-95"
                    >
                        <Plus size={16} /> New Quest
                    </button>
                </div>
            </div>

            {/* Filter Area */}
            <div className="container-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7367F0] transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search quests by name or location..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 outline-none focus:bg-white focus:ring-4 focus:ring-[#7367F0]/10 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                        {quests.filter(q => q.isActive).length} Active
                    </div>
                    <div className="px-4 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200">
                        {quests.length} Total
                    </div>
                </div>
            </div>

            {/* Grid/List View */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={40} className="text-[#7367F0] animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading your world data...</p>
                </div>
            ) : filteredQuests.length === 0 ? (
                <div className="py-20 bg-white rounded-[3rem] border border-dashed border-[#DBDADE] flex flex-col items-center justify-center text-[#A5A3AE]">
                    <Trophy size={48} className="mb-4 opacity-20" />
                    <p className="font-black uppercase tracking-widest text-xs">No quests discovered in this region</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredQuests.map((quest) => (
                        <motion.div
                            key={quest.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`group bg-white rounded-[2.5rem] border transition-all duration-500 flex flex-col relative overflow-hidden ${
                                quest.isActive ? 'hover:shadow-2xl hover:shadow-[#7367F0]/10 border-[#DBDADE]/50' : 'opacity-60 border-dashed saturate-0'
                            }`}
                        >
                            <div className="relative h-48 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                                {quest.iconUrl ? (
                                    <img 
                                        src={getImageUrl(quest.iconUrl)} 
                                        alt={quest.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="text-5xl opacity-40">📍</div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                    <button 
                                        onClick={() => handleOpenModal(quest)}
                                        className="p-3 bg-white text-[#7367F0] rounded-2xl hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleToggleStatus(quest.id, quest.isActive)}
                                        className={`p-3 bg-white rounded-2xl hover:scale-110 transition-transform shadow-lg ${quest.isActive ? 'text-rose-500' : 'text-emerald-500'}`}
                                    >
                                        {quest.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                        quest.isActive ? 'bg-white text-[#7367F0]' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {CATEGORIES[quest.category]}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-black text-[#5D596C] italic uppercase tracking-tight truncate">
                                        {quest.name}
                                    </h3>
                                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                                        {DIFFICULTIES[quest.difficulty]}
                                    </span>
                                </div>
                                <p className="text-xs text-[#A5A3AE] font-medium line-clamp-2 h-8 mb-4">
                                    {quest.description}
                                </p>
                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-2 text-[#7367F0]">
                                            <MapPin size={14} />
                                            {quest.locationName}
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Award size={14} />
                                            {quest.rewardXP} XP
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-[#DBDADE]/30 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#7367F0] rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Radius: {quest.proximityRadiusInMeters}m</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Quest</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category / Difficulty</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Location</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredQuests.map((quest) => (
                                <tr key={quest.id} className={`hover:bg-gray-50/50 transition-colors ${!quest.isActive && 'bg-gray-50/30'}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                {quest.iconUrl ? (
                                                    <img src={getImageUrl(quest.iconUrl)} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-lg">📍</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-700 uppercase italic tracking-tight">{quest.name}</p>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+{quest.rewardXP} XP</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{CATEGORIES[quest.category]}</span>
                                            <span className="text-[10px] font-bold text-amber-500">{DIFFICULTIES[quest.difficulty]}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-500 text-xs">
                                        {quest.locationName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            quest.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {quest.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(quest)} className="p-2 hover:bg-[#7367F0]/10 text-[#7367F0] rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleToggleStatus(quest.id, quest.isActive)} className={`p-2 rounded-lg transition-colors ${quest.isActive ? 'hover:bg-rose-50 text-rose-400' : 'hover:bg-emerald-50 text-emerald-400'}`}>
                                                {quest.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-[#F8F7FA]">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
                                        {editingQuest ? "Refine" : "Create"} <span className="text-[#7367F0]">Quest</span>
                                    </h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                        Design the next challenge for the island explorers
                                    </p>
                                </div>
                                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                                <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                                    {/* Left Column - Metadata */}
                                    <div className="md:col-span-2 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="label-admin">Quest Name</label>
                                                <input required type="text" className="input-admin" placeholder="Name" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-admin">Location Name</label>
                                                <input required type="text" className="input-admin" placeholder="e.g. Galle Fort" value={formData.locationName} onChange={e => setFormData(p => ({...p, locationName: e.target.value}))} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="label-admin">Description</label>
                                            <textarea required rows={3} className="input-admin resize-none" placeholder="Describe the adventure..." value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div className="space-y-2">
                                                <label className="label-admin">Category</label>
                                                <select className="input-admin" value={formData.category} onChange={e => setFormData(p => ({...p, category: parseInt(e.target.value)}))}>
                                                    {CATEGORIES.map((c, i) => <option key={c} value={i}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-admin">Difficulty</label>
                                                <select className="input-admin" value={formData.difficulty} onChange={e => setFormData(p => ({...p, difficulty: parseInt(e.target.value)}))}>
                                                    {DIFFICULTIES.map((d, i) => <option key={d} value={i}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-admin">Reward XP</label>
                                                <input type="number" className="input-admin" value={formData.rewardXP} onChange={e => setFormData(p => ({...p, rewardXP: parseInt(e.target.value)}))} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-admin">Radius (m)</label>
                                                <input type="number" className="input-admin" value={formData.proximityRadiusInMeters} onChange={e => setFormData(p => ({...p, proximityRadiusInMeters: parseInt(e.target.value)}))} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="label-admin flex items-center gap-2"><MapPin size={12}/> Latitude</label>
                                                <input type="number" step="any" className="input-admin" value={formData.latitude} onChange={e => setFormData(p => ({...p, latitude: parseFloat(e.target.value)}))} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-admin flex items-center gap-2"><MapPin size={12}/> Longitude</label>
                                                <input type="number" step="any" className="input-admin" value={formData.longitude} onChange={e => setFormData(p => ({...p, longitude: parseFloat(e.target.value)}))} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="label-admin flex items-center gap-2"><Award size={12}/> Photo Requirement Hint</label>
                                            <input required type="text" className="input-admin" placeholder="e.g. A clear photo of the sunset..." value={formData.photoRequirement} onChange={e => setFormData(p => ({...p, photoRequirement: e.target.value}))} />
                                        </div>
                                    </div>

                                    {/* Right Column - Image Upload */}
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="label-admin">Quest Icon / Cover</label>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="relative aspect-square rounded-[3rem] bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#7367F0] cursor-pointer overflow-hidden flex flex-col items-center justify-center group transition-all"
                                            >
                                                {formData.iconUrl ? (
                                                    <>
                                                        <img 
                                                            src={getImageUrl(formData.iconUrl)} 
                                                            className="w-full h-full object-cover" 
                                                            alt="Preview"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                                            <ImageIcon size={32} className="mb-2" />
                                                            <span className="font-black text-[10px] uppercase tracking-widest">Change Icon</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400 group-hover:text-[#7367F0]">
                                                        {uploading ? <Loader2 className="animate-spin mb-3" size={32} /> : <ImageIcon className="mb-3" size={32} />}
                                                        <span className="font-black text-[10px] uppercase tracking-widest">Select Visual</span>
                                                    </div>
                                                )}
                                            </div>
                                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                        </div>

                                        <div className="container-card p-6 bg-gray-50/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <HelpCircle className="text-[#7367F0]" size={20} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Explorer Hint</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-gray-400 leading-relaxed uppercase">
                                                Make sure the coordinates are precisely at the point of interest. The proximity radius determines how close a traveler must be to unlock verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        Discard
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex items-center gap-2 px-10 py-3 bg-[#67C926] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#59AD21] transition-all shadow-xl shadow-[#67C926]/20 active:scale-95"
                                    >
                                        <Save size={16} /> {editingQuest ? "Commit Changes" : "Forge Quest"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .label-admin {
                    display: block;
                    font-size: 11px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #5D596C;
                    margin-bottom: 0.5rem;
                }
                .input-admin {
                    width: 100%;
                    background: #F8F7FA;
                    border: 1px solid #DBDADE;
                    border-radius: 1rem;
                    padding: 1rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #5D596C;
                    outline: none;
                    transition: all 0.3s;
                }
                .input-admin:focus {
                    border-color: #7367F0;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(115, 103, 240, 0.1);
                }
                .container-card {
                    background: white;
                    border: 1px solid #DBDADE;
                    border-radius: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }
            `}</style>
        </div>
    );
}
