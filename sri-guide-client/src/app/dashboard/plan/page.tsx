"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Compass, Loader2, ArrowRight } from "lucide-react";
import apiClient from "@/services/api-client";

interface Plan {
    id: string;
    guideName: string;
    guideImage: string | null;
    bookingDate: string;
    status: string;
    totalAmount: number;
}

export default function PlanPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [plansLoading, setPlansLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (user.role !== "Tourist") {
                router.replace("/dashboard");
            } else {
                fetchPlans();
            }
        }
    }, [user, loading, router]);

    const fetchPlans = async () => {
        try {
            const response = await apiClient.get<Plan[]>("/profile/my-plans");
            setPlans(response.data);
        } catch (error) {
            console.error("Failed to fetch plans", error);
        } finally {
            setPlansLoading(false);
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
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Calendar className="text-emerald-500" size={28} />
                    My Travel Plan
                </h1>
                <p className="text-gray-500 font-medium mt-1">Manage your upcoming bookings and journey details</p>
            </div>

            {plansLoading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : plans.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                    <img 
                                        src={plan.guideImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${plan.guideName}`} 
                                        alt={plan.guideName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-900 text-lg">{plan.guideName}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1 font-medium">
                                            <Calendar size={14} className="text-primary" />
                                            {new Date(plan.bookingDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1 font-medium text-emerald-600">
                                            <Clock size={14} />
                                            Confirmed
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Paid</p>
                                    <p className="text-xl font-black text-gray-900">${plan.totalAmount}</p>
                                </div>
                                <button className="bg-gray-50 text-gray-900 px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-primary hover:text-white transition-all">
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] p-12 md:p-20 text-center border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                        <Calendar size={40} className="stroke-[1.5px]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">No upcoming trips</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
                        You haven't booked any guides or planned any trips yet. Explore our trusted guides to get started.
                    </p>
                    <button 
                        onClick={() => router.push('/guides')}
                        className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                    >
                        Explore Guides
                    </button>
                </div>
            )}

            <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
                <div className="relative z-10 max-w-lg">
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">Pro Tip</span>
                    <h2 className="text-3xl font-black mb-4 leading-tight">Plan your itinerary with local experts</h2>
                    <p className="text-gray-400 font-medium mb-10 leading-relaxed">
                        Message guides directly to create a custom journey tailored to your interests. From hidden beaches to ancient temples, see Sri Lanka like a local.
                    </p>
                    <button className="flex items-center gap-3 font-black text-sm uppercase tracking-widest group/btn hover:text-primary transition-colors">
                        Get Started
                        <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
