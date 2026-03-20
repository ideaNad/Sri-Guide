"use client";

import React from "react";
import { 
    Briefcase, Search, Filter, 
    Calendar, User, MapPin, 
    CheckCircle2, Clock, AlertCircle,
    MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";

interface Booking {
    id: string;
    customerName: string;
    tourName: string;
    guests: number;
    dateRange: string;
    status: string;
}

export default function AgencyBookingsPage() {
    const [bookings, setBookings] = React.useState<Booking[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await apiClient.get<Booking[]>("/agency/bookings");
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>;

    const stats = [
        { label: "New Requests", value: bookings.filter(b => b.status === 'Pending').length.toString(), color: "bg-orange-50 text-orange-600", icon: <AlertCircle size={20} /> },
        { label: "Confirmed", value: bookings.filter(b => b.status === 'Confirmed').length.toString(), color: "bg-emerald-50 text-emerald-600", icon: <CheckCircle2 size={20} /> },
        { label: "Total", value: bookings.length.toString(), color: "bg-blue-50 text-blue-600", icon: <Clock size={20} /> }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <Briefcase className="text-teal-600" size={36} />
                        Booking Ledger
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Oversee all incoming and upcoming tour reservations</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${stat.color} shadow-sm`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 italic">{stat.value}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find booking # or customer..." 
                            className="w-full bg-gray-50 border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:bg-white focus:border-teal-200 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tour Group</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date Range</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map((row, i) => (
                                <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400">
                                                {row.customerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{row.customerName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{row.guests} Guests</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600 italic">
                                            <MapPin size={14} className="text-teal-600" />
                                            {row.tourName}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                            <Calendar size={14} />
                                            {row.dateRange}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            row.status === 'Confirmed' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-orange-100 bg-orange-50 text-orange-600'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-gray-50/30 flex items-center justify-between border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Showing {bookings.length} total bookings</p>
                </div>
            </div>
        </div>
    );
}
