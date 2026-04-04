"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Compass, 
    MapPin, 
    Camera, 
    CheckCircle2, 
    Lock, 
    Trophy, 
    ArrowLeft, 
    ListFilter,
    Navigation2,
    Star,
    Award,
    Plus,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import apiClient from "@/services/api-client";
import { useRef } from "react";
import { QuestCategory, QuestDifficulty } from "@/types"; // Enums from backend models, using strings for simplicity in frontend for now

interface Quest {
    id: string;
    name: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
    proximityRadiusInMeters: number;
    category: string;
    difficulty: string;
    rewardXP: number;
    rewardBadgeName?: string;
    rewardBadgeIconUrl?: string;
    rewardTitle?: string;
    photoRequirement: string;
    iconUrl?: string;
    isCompletedByUser: boolean;
}

interface SubmissionResult {
    success: boolean;
    message: string;
    earnedXP: number;
    newTotalXP: number;
    currentLevel: number;
    leveledUp: boolean;
    earnedBadgeName?: string;
}

const CATEGORIES = [
    { id: 'All', label: 'All Quests', icon: <Compass size={18} /> },
    { id: 'Nature', label: 'Nature 🌿', icon: '🌿' },
    { id: 'Adventure', label: 'Adventure 🧗', icon: '🧗' },
    { id: 'Culture', label: 'Culture 🏯', icon: '🏯' },
    { id: 'Food', label: 'Food 🍛', icon: '🍛' },
    { id: 'Ocean', label: 'Ocean 🌊', icon: '🌊' }
];

export default function IslandExplorerPage() {
    const router = useRouter();
    const { user, loading: authLoading, refreshUser } = useAuth();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [waitingForLocation, setWaitingForLocation] = useState(true);
    const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [rewardModal, setRewardModal] = useState<SubmissionResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        } else if (user) {
            fetchQuests();
            requestLocation();
        }
    }, [user, authLoading]);

    const fetchQuests = async () => {
        try {
            const endpoint = selectedCategory === 'All' 
                ? '/quests' 
                : `/quests?category=${selectedCategory}`;
            const response = await apiClient.get<Quest[]>(endpoint);
            setQuests(response.data);
        } catch (error) {
            console.error("Failed to fetch quests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchQuests();
    }, [selectedCategory]);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setWaitingForLocation(false);
            return;
        }

        setWaitingForLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationError(null);
                setWaitingForLocation(false);
                
                // Also start watching for better accuracy
                navigator.geolocation.watchPosition(
                    (p) => {
                        setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude });
                    },
                    null,
                    { enableHighAccuracy: true }
                );
            },
            (error) => {
                setWaitingForLocation(false);
                if (!userLocation) {
                    setLocationError("Location access denied. Enable it to verify quest proximity.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // meters
        const p1 = lat1 * Math.PI / 180;
        const p2 = lat2 * Math.PI / 180;
        const dphi = (lat2 - lat1) * Math.PI / 180;
        const dlambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dphi / 2) * Math.sin(dphi / 2) +
                Math.cos(p1) * Math.cos(p2) *
                Math.sin(dlambda / 2) * Math.sin(dlambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const isGlobalQuest = (quest: Quest) => quest.proximityRadiusInMeters >= 100000;

    const isQuestInRange = (quest: Quest) => {
        if (!userLocation) return false;
        if (isGlobalQuest(quest)) return true; // Unlock global quests if we have any location
        
        const dist = calculateDistance(userLocation.lat, userLocation.lng, quest.latitude, quest.longitude);
        return dist <= quest.proximityRadiusInMeters;
    };

    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        if (path.startsWith('/uploads')) return `${apiClient.defaults.baseURL?.replace('/api', '')}${path}`;
        return path; // Frontend public folder assets
    };

    const triggerPhotoUpload = (quest: Quest) => {
        setActiveQuest(quest);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeQuest || !userLocation) return;

        setSubmitting(true);
        try {
            // 1. Upload to Media Controller
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await apiClient.post<{url: string}>('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const photoUrl = uploadResponse.data.url;

            // 2. Submit Quest Proof
            const result = await apiClient.post<SubmissionResult>(`/quests/${activeQuest.id}/submit`, {
                photoProofUrl: photoUrl,
                latitude: userLocation.lat,
                longitude: userLocation.lng
            });
            
            if (result.data.success) {
                setRewardModal(result.data);
                fetchQuests(); // Refresh status
                refreshUser(); // Refresh global XP/Level in header
            }
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setSubmitting(false);
            setActiveQuest(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'text-emerald-500 bg-emerald-50';
            case 'Medium': return 'text-amber-500 bg-amber-50';
            case 'Hard': return 'text-rose-500 bg-rose-50';
            case 'Legendary': return 'text-purple-600 bg-purple-50 border-purple-100 border';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;

    return (
        <div className="min-h-screen pb-20 bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black uppercase italic tracking-tighter">Island Explorer</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gaining levels in Sri Lanka</p>
                        </div>
                    </div>
                    {user && (
                        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm transition-all hover:shadow-md">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            >
                                <Star className="text-amber-500 fill-amber-500" size={16} />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="font-black text-amber-700 text-sm leading-none">LVL {user.level}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-20 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ 
                                                width: `${Math.min(100, (
                                                    (user.xp ?? 0) - (Math.pow((user.level ?? 1) - 1, 2) * 100)
                                                ) / (
                                                    (Math.pow(user.level ?? 1, 2) * 100) - (Math.pow((user.level ?? 1) - 1, 2) * 100)
                                                ) * 100)}%` 
                                            }}
                                            className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                                        />
                                    </div>
                                    <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">
                                        {user.xp ?? 0} XP
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories */}
                <div className="max-w-7xl mx-auto px-4 py-4 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                                selectedCategory === cat.id 
                                ? 'bg-primary text-white shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.4)] scale-105' 
                                : 'bg-white border border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary'
                            }`}
                        >
                            {typeof cat.icon === 'string' ? <span className="text-lg">{cat.icon}</span> : cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
                {/* Location Status */}
                {locationError && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-3xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                            <MapPin size={20} />
                        </div>
                        <p className="text-sm font-bold text-rose-700">{locationError}</p>
                        <button onClick={() => requestLocation()} className="ml-auto bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase">Allow</button>
                    </div>
                )}

                {/* Quest List */}
                {!userLocation && !waitingForLocation ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl text-center flex flex-col items-center max-w-lg mx-auto mt-12"
                    >
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                            <MapPin size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3 uppercase italic">Location Required</h2>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                            Island Explorer uses your real-time location to verify that you've reached quest destinations. Please enable location access to start your adventure.
                        </p>
                        <button 
                            onClick={requestLocation}
                            className="w-full bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                        >
                            Enable Location Access
                        </button>
                    </motion.div>
                ) : waitingForLocation || loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-12">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 h-64 animate-pulse flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-3 w-20 bg-gray-100 rounded" />
                                        <div className="h-5 w-3/4 bg-gray-100 rounded" />
                                        <div className="h-3 w-full bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="mt-auto flex justify-between">
                                    <div className="h-4 w-24 bg-gray-50 rounded" />
                                    <div className="h-10 w-24 bg-gray-50 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-12">
                        {quests.map((quest, index) => {
                            const inRange = isQuestInRange(quest);
                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={quest.id}
                                    className={`group bg-white p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col h-full relative overflow-hidden ${
                                        quest.isCompletedByUser 
                                        ? 'border-emerald-100 bg-emerald-50/10' 
                                        : inRange 
                                            ? 'border-primary/20 shadow-xl shadow-primary/5' 
                                            : 'border-transparent hover:border-gray-200'
                                    }`}
                                >
                                    {/* Glass Highlight */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                                    
                                    {quest.isCompletedByUser && (
                                        <div className="absolute top-6 right-6 text-emerald-500 z-10 bg-white p-2 rounded-full shadow-sm border border-emerald-50">
                                            <CheckCircle2 size={20} className="fill-emerald-500" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`w-40 h-40 rounded-[3.5rem] flex items-center justify-center text-6xl shrink-0 overflow-hidden shadow-2xl border-4 border-white ${getDifficultyColor(quest.difficulty)}`}>
                                            {quest.iconUrl ? (
                                                <img 
                                                    src={getImageUrl(quest.iconUrl)} 
                                                    alt={quest.name} 
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                                                />
                                            ) : (
                                                quest.isCompletedByUser ? '🏆' : '📍'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-lg ${getDifficultyColor(quest.difficulty)}`}>
                                                    {quest.difficulty}
                                                </span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">• {quest.category}</span>
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors truncate">{quest.name}</h3>
                                            <p className="text-xs text-gray-500 font-medium mb-4 line-clamp-2 h-8">{quest.description}</p>
                                            
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                    <MapPin size={12} className="text-primary" />
                                                    <span className="truncate max-w-[100px]">{quest.locationName}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                    <Award size={12} />
                                                    +{quest.rewardXP} XP
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                                        {!quest.isCompletedByUser ? (
                                            <>
                                                <div className="flex flex-col gap-1">
                                                    <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${inRange ? 'text-emerald-500 animate-pulse' : 'text-gray-400'}`}>
                                                        {inRange ? <Navigation2 size={12} className="fill-emerald-500" /> : <Lock size={12} />}
                                                        {isGlobalQuest(quest) ? '🌍 Global Quest' : (inRange ? 'In Range' : 'Locked')}
                                                    </div>
                                                </div>
                                                <button
                                                    disabled={!inRange || submitting}
                                                    onClick={() => triggerPhotoUpload(quest)}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                        inRange 
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95' 
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {submitting && activeQuest?.id === quest.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Camera size={14} />
                                                    )}
                                                    {submitting && activeQuest?.id === quest.id ? 'Uploading...' : 'Verify'}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Trophy size={14} />
                                                Achieved
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Reward Modal */}
            <AnimatePresence>
                {rewardModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] w-full max-w-sm p-10 text-center shadow-2xl relative overflow-hidden"
                        >
                            {/* Confetti Animation Placeholder */}
                            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#FFD700,transparent_50%)]" />

                            <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <Trophy size={48} className="fill-amber-500/20" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic">Success!</h2>
                            <p className="text-gray-500 font-bold mb-8">{rewardModal.message}</p>
                            
                            <div className="space-y-4 mb-10">
                                <div className="bg-gray-50 p-6 rounded-3xl flex justify-between items-center">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">XP Earned</span>
                                    <span className="text-xl font-black text-emerald-500">+{rewardModal.earnedXP}</span>
                                </div>
                                {rewardModal.leveledUp && (
                                    <div className="bg-amber-500 p-6 rounded-3xl flex flex-col items-center text-white scale-110 shadow-xl shadow-amber-500/30">
                                        <span className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Level Up!</span>
                                        <span className="text-3xl font-black italic uppercase">Rank {rewardModal.currentLevel}</span>
                                    </div>
                                )}
                                {rewardModal.earnedBadgeName && (
                                    <div className="bg-purple-50 p-6 rounded-3xl flex flex-col items-center">
                                        <Award className="text-purple-500 mb-2" size={32} />
                                        <span className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">Badge Earned</span>
                                        <span className="text-lg font-black text-purple-700 uppercase">{rewardModal.earnedBadgeName}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setRewardModal(null)}
                                className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                            >
                                Keep Exploring
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
        </div>
    );
}
