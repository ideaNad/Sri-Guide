"use client";

import React from "react";
import { 
    Users, Map, Briefcase, TrendingUp, 
    ArrowUpRight, AlertCircle, Plus, Calendar,
    Building2, Globe, Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function AgencyDashboardPage() {
    const stats = [
        { label: "Our Tours", value: "8", icon: <Map size={20} />, change: "Active" },
        { label: "Assigned Guides", value: "12", icon: <Users size={20} />, change: "Verified" },
        { label: "Bookings", value: "42", icon: <Calendar size={20} />, change: "+15% month" },
        { label: "Net Revenue", value: "$4.2k", icon: <TrendingUp size={20} />, change: "This Season" },
    ];

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                {stat.icon}
                            </div>
                            <ArrowUpRight size={16} className="text-gray-300" />
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-1 tracking-tighter italic">{stat.value}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <span className="text-[9px] font-bold text-teal-600">{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Roster */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase italic">Active Guide Roster</h3>
                            <p className="text-xs text-gray-500 font-bold mt-1">Status of your currently assigned professionals.</p>
                        </div>
                        <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">Manage All</button>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            { name: "Kasun Perera", status: "On Tour", location: "Kandy", date: "Mar 19-22" },
                            { name: "Sarah Mitchell", status: "Available", location: "Galle", date: "-" },
                            { name: "Nuwan Silva", status: "Booking Pending", location: "Ella", date: "Mar 25-27" }
                        ].map((guide, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-teal-50 transition-all border border-transparent hover:border-teal-100 cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
                                    {guide.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-gray-900">{guide.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <div className="flex items-center gap-1">
                                            <Globe size={10} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{guide.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={10} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{guide.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    guide.status === 'On Tour' ? 'bg-blue-100 text-blue-600' : 
                                    guide.status === 'Available' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {guide.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Add Section */}
                <div className="space-y-6">
                    <div className="bg-teal-600 rounded-[2rem] p-6 text-white shadow-xl shadow-teal-600/20">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Tour Operations</h4>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <Plus size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">New Package</span>
                                </div>
                                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <Users size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Invite Guide</span>
                                </div>
                                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 text-emerald-600 mb-4">
                            <AlertCircle size={20} />
                            <h4 className="font-black text-[10px] uppercase tracking-widest">Agency Tip</h4>
                        </div>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                            Adding high-res drone shots to your tour packages increases conversion by <span className="text-teal-600 font-black">40%</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
