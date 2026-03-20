"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Compass, Calendar, Heart, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (user.role === "Admin") {
                router.replace("/admin");
            } else if (user.role === "Guide") {
                router.replace("/guide");
            } else if (user.role === "TravelAgency") {
                router.replace("/agency");
            }
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user.role !== "Tourist") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user.fullName.split(' ')[0]}!</h1>
                <p className="text-gray-500 font-medium mt-1">Ready for your next Sri Lankan adventure?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">0</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Upcoming Trips</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                        <Heart size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">0</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Saved Tours</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Verified</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Account Status</p>
                    </div>
                </div>
            </div>

            <div className="bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl -z-10 rounded-full" />
                <h2 className="text-2xl font-black text-gray-900 mb-2">Find your perfect guide</h2>
                <p className="text-gray-600 mb-8 max-w-lg">Browse our curated list of verified local experts to make your Sri Lankan journey truly unforgettable.</p>
                
                <button 
                    onClick={() => router.push('/guides')}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                >
                    <Compass size={18} />
                    Explore Guides
                </button>
            </div>
        </div>
    );
}
