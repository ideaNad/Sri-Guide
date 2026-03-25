"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Heart, Compass, Loader2 } from "lucide-react";
import apiClient from "@/services/api-client";
import Card from "@/components/ui/Card";

interface LikedItem {
    id: string;
    title: string;
    primaryImageUrl: string | null;
    date: string | null;
    description: string;
    location: string;
    images: string[];
    type: "tour" | "adventure" | "event";
    likeCount?: number;
    averageRating?: number;
    reviewCount?: number;
}

export default function SavedToursPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [savedItems, setSavedItems] = useState<LikedItem[]>([]);
    const [itemsLoading, setItemsLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (user.role !== "Tourist") {
                router.replace("/dashboard");
            } else {
                fetchSavedItems();
            }
        }
    }, [user, loading, router]);

    const fetchSavedItems = async () => {
        try {
            // Fetch trips/tours
            const tripsRes = await apiClient.get<LikedItem[]>("/trip/liked");
            
            // Fetch events
            let events: LikedItem[] = [];
            try {
                const eventsRes = await apiClient.get<any[]>("/events/liked");
                events = eventsRes.data.map(e => ({
                    id: e.id,
                    title: e.title,
                    primaryImageUrl: e.coverImage,
                    date: e.startDate,
                    description: e.shortDescription,
                    location: e.locationName,
                    images: e.galleryImages || [],
                    type: "event" as const,
                    likeCount: e.likeCount,
                    averageRating: e.averageRating,
                    reviewCount: e.reviewCount
                }));
            } catch (err) {
                console.error("Failed to fetch liked events", err);
            }

            setSavedItems([...tripsRes.data, ...events]);
        } catch (error) {
            console.error("Failed to fetch saved items", error);
        } finally {
            setItemsLoading(false);
        }
    };

    const handleToggleLike = async (id: string, type: string) => {
        try {
            let endpoint = "";
            if (type === 'tour') endpoint = `/tours/${id}/toggle-like`;
            else if (type === 'event') endpoint = `/events/${id}/like`;
            else endpoint = `/trip/${id}/toggle-like`;

            await apiClient.post(endpoint);
            // Since we are in the "Saved" page, toggling like always means removing it from the list
            setSavedItems(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    if (loading || !user || user.role !== "Tourist") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Heart className="text-rose-500 fill-rose-500" size={28} />
                        Saved Adventures
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Your personal collection of Sri Lankan journeys</p>
                </div>
                
                <button 
                    onClick={() => router.push('/adventures')}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                >
                    <Compass size={18} />
                    Find More
                </button>
            </div>

            {itemsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-white rounded-3xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : savedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {savedItems.map((item) => (
                        <Card
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            image={item.primaryImageUrl || "/images/placeholder-trip.jpg"}
                            location={item.location}
                            type={item.type}
                            subtitle={item.description}
                            tags={[]}
                            isLiked={true}
                            likeCount={item.likeCount}
                            rating={item.averageRating}
                            reviews={item.reviewCount}
                            onToggleLike={handleToggleLike}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] p-12 md:p-20 text-center border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                        <Heart size={40} className="stroke-[1.5px]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">No saved items yet</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
                        Start exploring our curated trips and click the heart icon to save your favorites for later.
                    </p>
                    <button 
                        onClick={() => router.push('/adventures')}
                        className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                    >
                        Explore Adventures
                    </button>
                </div>
            )}
        </div>
    );
}
