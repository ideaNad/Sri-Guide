"use client";

import React, { useEffect, useState } from "react";
import { 
    Utensils, Plus, Edit2, Trash2, Save, X, 
    ChevronDown, ChevronUp, Image as ImageIcon, 
    MoreVertical, Check, AlertCircle, Loader2, Star
} from "lucide-react";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";
import ImageUpload from "@/components/ui/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
    id: string;
    menuId: string;
    name: string;
    description?: string;
    price?: number;
    currency: string;
    image?: string;
    isAvailable: boolean;
    isFeatured: boolean;
    spiceLevel?: string;
    portionSize?: string;
}

interface Menu {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    items: MenuItem[];
}

interface RestaurantProfile {
    id: string;
    menus: Menu[];
}

export default function RestaurantMenusPage() {
    const { toast } = useToast();
    const [profile, setProfile] = useState<RestaurantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    
    // Modal states
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState<Partial<Menu> | null>(null);
    const [currentItem, setCurrentItem] = useState<Partial<MenuItem> | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [toast]);

    const fetchProfile = async () => {
        try {
            const { data } = await apiClient.get<RestaurantProfile>("/restaurants/my-profile");
            setProfile(data);
            if (data.menus.length > 0 && !activeMenuId) {
                setActiveMenuId(data.menus[0].id);
            }
        } catch (error) {
            console.error("Failed to load menus", error);
            toast.error("Failed to load menus");
        } finally {
            setLoading(false);
        }
    };

    const handleMenuSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMenu?.name) return;
        setSubmitting(true);
        try {
            if (currentMenu.id) {
                await apiClient.put("/restaurants/menus", currentMenu);
                toast.success("Menu updated");
            } else {
                await apiClient.post("/restaurants/menus", { 
                    ...currentMenu, 
                    restaurantProfileId: profile?.id 
                });
                toast.success("Menu created");
            }
            await fetchProfile();
            setIsMenuModalOpen(false);
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem?.name || !activeMenuId) return;
        setSubmitting(true);
        try {
            if (currentItem.id) {
                await apiClient.put("/restaurants/items", currentItem);
                toast.success("Item updated");
            } else {
                await apiClient.post("/restaurants/items", { 
                    ...currentItem, 
                    menuId: activeMenuId 
                });
                toast.success("Item added");
            }
            await fetchProfile();
            setIsItemModalOpen(false);
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMenu = async (id: string) => {
        if (!confirm("Are you sure? All items in this menu will be removed.")) return;
        try {
            await apiClient.delete(`/restaurants/menus/${id}`);
            toast.success("Menu removed");
            fetchProfile();
        } catch (error) {
            toast.error("Failed to delete menu");
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Remove this item?")) return;
        try {
            await apiClient.delete(`/restaurants/items/${id}`);
            toast.success("Item removed");
            fetchProfile();
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            </div>
        );
    }

    const activeMenu = profile?.menus.find(m => m.id === activeMenuId);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">Menus & Gastronomy</h1>
                    <p className="text-gray-500 font-medium mt-1">Design your culinary experience for travelers.</p>
                </div>
                <button 
                    onClick={() => { setCurrentMenu({ name: "", description: "" }); setIsMenuModalOpen(true); }}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-rose-600 transition-all text-xs uppercase tracking-widest shadow-xl shadow-gray-900/10"
                >
                    <Plus size={18} /> New Menu Category
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Menu Categories */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Categories</h3>
                        <div className="space-y-2">
                            {profile?.menus.map(menu => (
                                <div key={menu.id} className="relative group">
                                    <button
                                        onClick={() => setActiveMenuId(menu.id)}
                                        className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${
                                            activeMenuId === menu.id 
                                            ? "bg-rose-50 text-rose-600 border border-rose-100 shadow-sm" 
                                            : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Utensils size={16} className={activeMenuId === menu.id ? "text-rose-500" : "text-gray-400"} />
                                            {menu.name}
                                        </div>
                                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-100 text-gray-400">
                                            {menu.items.length}
                                        </span>
                                    </button>
                                </div>
                            ))}
                            {profile?.menus.length === 0 && (
                                <p className="text-xs text-center py-8 text-gray-400 font-medium italic">No categories created</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main: Items List */}
                <div className="lg:col-span-3 space-y-6">
                    {activeMenu ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Menu Header / Actions */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-6 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-1">
                                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">{activeMenu.name}</h2>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setCurrentMenu(activeMenu); setIsMenuModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteMenu(activeMenu.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">{activeMenu.description || "No description provided."}</p>
                                </div>
                                <button 
                                    onClick={() => { setCurrentItem({ name: "", price: 0, currency: "LKR", isAvailable: true, isFeatured: false }); setIsItemModalOpen(true); }}
                                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-rose-200 shadow-rose-500/10"
                                >
                                    <Plus size={16} /> Add Dish
                                </button>
                            </div>

                            {/* Items Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeMenu.items.map(item => (
                                    <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-5 group relative">
                                        <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-50 relative">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                            {item.isFeatured && (
                                                <div className="absolute top-1 right-1 bg-amber-400 text-white p-1 rounded-full shadow-sm">
                                                    <Star size={10} fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-black text-gray-900 truncate pr-6 uppercase tracking-tight">{item.name}</h4>
                                                <div className="flex gap-1 absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setCurrentItem(item); setIsItemModalOpen(true); }} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed mb-3 pr-4 h-8">
                                                {item.description || "No description."}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black text-rose-600">
                                                    {item.currency} {item.price?.toLocaleString()}
                                                </span>
                                                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isAvailable ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                                    {item.isAvailable ? "Available" : "Sold Out"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {activeMenu.items.length === 0 && (
                                    <div className="md:col-span-2 bg-rose-50/30 border border-dashed border-rose-100 rounded-[2.5rem] p-12 text-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Utensils className="text-rose-200" size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">No items in this category</h3>
                                        <p className="text-sm text-gray-400 font-medium">Click "Add Dish" to list your culinary creations.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-20 rounded-[3rem] border border-gray-100 shadow-sm text-center">
                            <Utensils className="text-gray-100 mx-auto mb-6" size={80} />
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic mb-2">Initialize Your Gastronomy</h2>
                            <p className="text-gray-500 max-w-sm mx-auto font-medium mb-8">Create categories like "Signature Dishes" or "Desserts" to begin organizing your menu.</p>
                            <button 
                                onClick={() => { setCurrentMenu({ name: "", description: "" }); setIsMenuModalOpen(true); }}
                                className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-2xl shadow-gray-900/10 active:scale-95"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Modal */}
            <AnimatePresence>
                {isMenuModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMenuModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10"
                        >
                            <form onSubmit={handleMenuSubmit} className="p-10 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">{currentMenu?.id ? "Edit Category" : "New Category"}</h3>
                                    <button type="button" onClick={() => setIsMenuModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="e.g. Signature Specialties"
                                            value={currentMenu?.name || ""} 
                                            onChange={(e) => setCurrentMenu(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                                        <textarea 
                                            value={currentMenu?.description || ""} 
                                            onChange={(e) => setCurrentMenu(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-medium h-24"
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={submitting}
                                    className="w-full py-5 bg-rose-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-900/20 hover:bg-gray-900 transition-all"
                                >
                                    {submitting ? "Processing..." : currentMenu?.id ? "Update Category" : "Build Category"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Item Modal */}
            <AnimatePresence>
                {isItemModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsItemModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row"
                        >
                            <div className="w-full md:w-2/5 p-10 bg-gray-50 border-r border-gray-100">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Item Imagery</h4>
                                <ImageUpload
                                    value={currentItem?.image || ""}
                                    onChange={(url) => setCurrentItem(prev => ({ ...prev, image: url }))}
                                />
                                <div className="mt-8 space-y-4">
                                    <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:bg-rose-50/30 transition-all">
                                        <input 
                                            type="checkbox" 
                                            className="accent-rose-500 w-5 h-5 rounded-lg"
                                            checked={currentItem?.isAvailable ?? true}
                                            onChange={(e) => setCurrentItem(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                        />
                                        <span className="text-xs font-bold text-gray-700">Display as Available</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:bg-amber-50/30 transition-all">
                                        <input 
                                            type="checkbox" 
                                            className="accent-amber-500 w-5 h-5 rounded-lg"
                                            checked={currentItem?.isFeatured || false}
                                            onChange={(e) => setCurrentItem(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                        />
                                        <span className="text-xs font-bold text-gray-700 font-italic italic">Recommend to Tourists</span>
                                    </label>
                                </div>
                            </div>
                            <form onSubmit={handleItemSubmit} className="flex-1 p-10 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">{currentItem?.id ? "Edit Item" : "New Dish"}</h3>
                                    <button type="button" onClick={() => setIsItemModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dish Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            value={currentItem?.name || ""} 
                                            onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</label>
                                            <input 
                                                type="number" 
                                                value={currentItem?.price || 0} 
                                                onChange={(e) => setCurrentItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Currency</label>
                                            <select 
                                                value={currentItem?.currency || "LKR"}
                                                onChange={(e) => setCurrentItem(prev => ({ ...prev, currency: e.target.value }))}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-sm"
                                            >
                                                <option value="LKR">LKR</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Description</label>
                                        <textarea 
                                            value={currentItem?.description || ""} 
                                            onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500/20 outline-none font-medium h-24"
                                            placeholder="Mention key ingredients or why this is special..."
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={submitting}
                                    className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-900/10 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? "Processing..." : <><Check size={18} /> {currentItem?.id ? "Update Item" : "Create Item"}</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
