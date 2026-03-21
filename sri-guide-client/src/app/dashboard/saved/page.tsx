"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Heart, Compass, Loader2 } from "lucide-react";
import apiClient from "@/services/api-client";
import Card from "@/components/ui/Card";

interface LikedTrip {
    id: string;
    title: string;
    primaryImageUrl: string | null;
    date: string | null;
    description: string;
    location: string;
    images: string[];
    type: "tour" | "adventure";
}

export default function SavedToursPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [likedTrips, setLikedTrips] = useState<LikedTrip[]>([]);
    const [tripsLoading, setTripsLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (user.role !== "Tourist") {
                router.replace("/dashboard");
            } else {
                fetchLikedTrips();
            }
        }
    }, [user, loading, router]);

    const fetchLikedTrips = async () => {
        try {
            const response = await apiClient.get<LikedTrip[]>("/trip/liked");
            setLikedTrips(response.data);
        } catch (error) {
            console.error("Failed to fetch liked trips", error);
        } finally {
            setTripsLoading(false);
        }
    };

    const handleToggleLike = async (id: string, type: string) => {
        try {
            const endpoint = type === 'tour' ? `/tours/${id}/toggle-like` : `/trip/${id}/toggle-like`;
            await apiClient.post(endpoint);
            // Since we are in the "Saved" page, toggling like always means removing it from the list
            setLikedTrips(prev => prev.filter(t => t.id !== id));
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

            {tripsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-white rounded-3xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : likedTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {likedTrips.map((trip) => (
                        <Card
                            key={trip.id}
                            id={trip.id}
                            title={trip.title}
                            image={trip.primaryImageUrl || "/images/placeholder-trip.jpg"}
                            location={trip.location}
                            type={trip.type}
                            subtitle={trip.description}
                            tags={[]}
                            isLiked={true}
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
