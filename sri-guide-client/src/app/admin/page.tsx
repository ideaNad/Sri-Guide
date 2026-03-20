"use client";

import React from "react";
import { 
    Users, TrendingUp, AlertCircle, ArrowUpRight, 
    MoreVertical, Info, Globe, ShieldCheck, 
    Activity, LayoutGrid, DollarSign, Clock, 
    ArrowDownRight, ChevronRight, Mail, 
    MessageSquare, HelpCircle, UserCheck, Monitor, Loader2, Heart
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar,
    Cell, PieChart, Pie, RadialBarChart, RadialBar,
    Legend
} from 'recharts';

// --- Dashboard ---

interface AdminStats {
    totalGuides: number;
    pendingGuideVerifications: number;
    totalTourists: number;
    totalAgencies: number;
    pendingAgencyUpgrades: number;
    totalTrips: number;
    totalLikes: number;
    totalBookings: number;
    dailyBookings: { label: string; value: number }[];
    dailyRegistrations: { label: string; value: number }[];
    apiResponseMs: number;
    memoryUsagePercent: number;
    uptimePercent: number;
}

const AnalyticsCard = ({ stats }: { stats: AdminStats | null }) => (
    <div className="bg-[#7367F0] rounded-[1.5rem] p-8 text-white relative overflow-hidden h-full shadow-lg shadow-[#7367F0]/20">
        <div className="relative z-10">
            <h3 className="text-xl font-black mb-1">Sri-Guide Analytics</h3>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-8">Platform performance overview</p>

            <div className="flex flex-wrap gap-x-12 gap-y-6 mt-10">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Guides</p>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">{stats?.totalGuides || 0}</div>
                        <span className="text-xs font-bold text-white/80">Total Guides</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">{stats?.pendingGuideVerifications || 0}</div>
                        <span className="text-xs font-bold text-white/80">Pending Verifications</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 px-2">Users</p>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">{stats?.totalTourists || 0}</div>
                        <span className="text-xs font-bold text-white/80">Tourists</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">{stats?.totalAgencies || 0}</div>
                        <span className="text-xs font-bold text-white/80">Agencies</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden xl:block">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl opacity-50" />
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
            >
                <div className="w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 rotate-12 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#7367F0] via-transparent to-white/30" />
                    <Activity size={80} className="text-white opacity-20" />
                </div>
            </motion.div>
        </div>
    </div>
);

export default function AdminDashboardPage() {
    const [stats, setStats] = React.useState<AdminStats | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get<AdminStats>("/admin/stats");
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-10 space-y-6">
            {/* Top Row: Analytics & Summary */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
                <div className="xl:col-span-2">
                    <AnalyticsCard stats={stats} />
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 border border-[#DBDADE]/50 shadow-sm col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-black text-[#5D596C] uppercase tracking-tight">Total Bookings</h4>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Live</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest leading-none mb-6">Confirmed across platform</p>
                    <div className="mb-4">
                        <p className="text-2xl font-black text-[#5D596C] tracking-tight">{stats?.totalBookings || 0}</p>
                    </div>
                    <div className="h-[90px] -mx-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.dailyBookings.map(d => ({ name: d.label, value: d.value }))}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#28C76F" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#28C76F" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#28C76F" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 border border-[#DBDADE]/50 shadow-sm col-span-1">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-sm font-black text-[#5D596C] uppercase tracking-tight">System Overview</h4>
                            <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1">Platform Activity</p>
                        </div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase">Live</p>
                    </div>
                    <div className="flex items-end justify-between mb-6">
                        <p className="text-2xl font-black text-[#5D596C] tracking-tight">{stats?.totalTrips || 0}</p>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-[#DBDADE]/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Heart size={14} /></div>
                                <span className="text-xs font-black text-[#5D596C] uppercase">Likes</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-[#6F6B7D]">{stats?.totalLikes || 0}</span>
                                <p className="text-[9px] font-bold text-[#A5A3AE]">Total Interactions</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><TrendingUp size={14} /></div>
                                <span className="text-xs font-black text-[#5D596C] uppercase">Growth</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-[#6F6B7D]">{stats?.pendingAgencyUpgrades || 0}</span>
                                <p className="text-[9px] font-bold text-[#A5A3AE]">Pending Agencies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: Reports & Trackers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earning Reports */}
                <div className="bg-white rounded-[1.5rem] p-8 border border-[#DBDADE]/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-lg font-black text-[#5D596C] uppercase italic">User Registrations</h4>
                            <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1 italic leading-none">Weekly Growth Overview</p>
                        </div>
                        <MoreVertical size={20} className="text-[#A5A3AE] cursor-pointer" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="space-y-4 min-w-[140px]">
                            <p className="text-3xl font-black text-[#5D596C] tracking-tight italic">{stats?.totalTourists || 0} <span className="text-[10px] text-emerald-500 align-top">Users</span></p>
                            <p className="text-[11px] font-medium text-[#A5A3AE] leading-relaxed">Platform-wide tourist signups across all regions.</p>
                            
                            <div className="space-y-3 pt-4">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#6F6B7D]">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#7367F0]"></div> Guides</div>
                                    <span>{stats?.totalGuides || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#6F6B7D]">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div> Agencies</div>
                                    <span>{stats?.totalAgencies || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.dailyRegistrations.map(d => ({ name: d.label, value: d.value }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DBDADE" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A5A3AE', fontSize: 10, fontWeight: 700}} />
                                    <Tooltip cursor={{fill: '#F8F7FA'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                    <Bar dataKey="value" fill="#7367F0" radius={[4, 4, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* System Health Overview Simplified */}
                <div className="bg-white rounded-[1.5rem] p-8 border border-[#DBDADE]/50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-lg font-black text-[#5D596C] uppercase italic">System Health</h4>
                            <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1 italic">Real-time platform status</p>
                        </div>
                        <MoreVertical size={20} className="text-[#A5A3AE] cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-10">
                            <div>
                                <p className="text-xs font-black text-[#A5A3AE] uppercase tracking-[0.2em] mb-4">API Response</p>
                                <p className="text-4xl font-black text-[#5D596C] tracking-tighter italic">{stats?.apiResponseMs.toFixed(1)}<span className="text-lg opacity-40 ml-1">ms</span></p>
                                <div className="w-full h-1.5 bg-emerald-50 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[94%] rounded-full shadow-[0_0_8px_rgba(40,199,111,0.4)]"></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#A5A3AE] uppercase tracking-[0.2em] mb-4">Uptime</p>
                                <p className="text-4xl font-black text-[#5D596C] tracking-tighter italic">{stats?.uptimePercent}%</p>
                                <div className="w-full h-1.5 bg-blue-50 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[99%] rounded-full shadow-[0_0_8px_rgba(0,123,255,0.4)]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#7367F0] to-[#8E85F3] rounded-3xl p-6 text-white flex flex-col justify-between">
                            <h5 className="font-black text-xs uppercase tracking-widest leading-none">Memory Usage</h5>
                            <p className="text-3xl font-black italic mt-4">{stats?.memoryUsagePercent.toFixed(1)}%</p>
                            <div className="mt-8 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Status</span>
                                <span className="text-sm font-black italic">Healthy</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/20 rounded-full mt-2">
                                <div className="h-full bg-white w-[42%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Redirects */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-[1.5rem] p-8 border border-[#DBDADE]/50 shadow-sm flex flex-col justify-center gap-4">
                     <h4 className="text-md font-black text-[#5D596C] uppercase italic mb-2">Quick Actions</h4>
                     <button onClick={() => window.location.href = '/admin/verifications'} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-4">
                            <UserCheck className="text-primary" />
                            <span className="font-black uppercase text-xs">Verify Guides</span>
                        </div>
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                     </button>
                     <button onClick={() => window.location.href = '/admin/upgrades'} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-4">
                            <TrendingUp className="text-emerald-500" />
                            <span className="font-black uppercase text-xs">Approve Agencies</span>
                        </div>
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                     </button>
                </div>
                
                <div className="xl:col-span-2 bg-[#7367FO]/5 border-2 border-dashed border-[#7367F0]/20 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                    <Activity size={48} className="text-[#7367F0] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-black text-[#5D596C] uppercase italic mb-2">Platform Performance</h4>
                    <p className="text-gray-500 font-bold text-sm max-w-md">Sri-Guide is currently operating at optimal efficiency. All systems are operational with {stats?.uptimePercent}% uptime reported over the last 30 days.</p>
                </div>
            </div>
        </div>
    );
}
