"use client";

import React from "react";
import { 
    Users, TrendingUp, AlertCircle, ArrowUpRight, 
    MoreVertical, Info, Globe, ShieldCheck, 
    Activity, LayoutGrid, DollarSign, Clock, 
    ArrowDownRight, ChevronRight, Mail, 
    MessageSquare, HelpCircle, UserCheck, Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar,
    Cell, PieChart, Pie, RadialBarChart, RadialBar,
    Legend
} from 'recharts';

// --- Mock Data ---

const dailySalesData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 200 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 400 },
];

const earningsData = [
    { day: 'Mo', earnings: 45, profit: 30, expense: 15 },
    { day: 'Tu', earnings: 52, profit: 40, expense: 12 },
    { day: 'We', earnings: 38, profit: 25, expense: 13 },
    { day: 'Th', earnings: 65, profit: 50, expense: 15 },
    { day: 'Fr', earnings: 48, profit: 35, expense: 13 },
    { day: 'Sa', earnings: 61, profit: 45, expense: 16 },
    { day: 'Su', earnings: 55, profit: 40, expense: 15 },
];

const supportData = [
    { name: 'Completed', value: 85, fill: '#7367F0' },
];

const salesByCountry = [
    { country: 'US', sales: '$8,567k', flag: '🇺🇸', change: '+25.8%' },
    { country: 'Brazil', sales: '$4,523k', flag: '🇧🇷', change: '-10.2%' },
    { country: 'India', sales: '$3,823k', flag: '🇮🇳', change: '+15.4%' },
    { country: 'Australia', sales: '$2,143k', flag: '🇦🇺', change: '+5.1%' },
    { country: 'France', sales: '$1,823k', flag: '🇫🇷', change: '+12.7%' },
];

// --- Sub-Components ---

const AnalyticsCard = () => (
    <div className="bg-[#7367F0] rounded-[1.5rem] p-8 text-white relative overflow-hidden h-full shadow-lg shadow-[#7367F0]/20">
        <div className="relative z-10">
            <h3 className="text-xl font-black mb-1">Website Analytics</h3>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-8">Total 28.5% Conversion Rate</p>

            <div className="flex flex-wrap gap-x-12 gap-y-6 mt-10">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Traffic</p>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">28%</div>
                        <span className="text-xs font-bold text-white/80">Sessions</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">1.2k</div>
                        <span className="text-xs font-bold text-white/80">Leads</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 px-2"></p>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">3.1k</div>
                        <span className="text-xs font-bold text-white/80">Page Views</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-black/10 rounded-lg font-black text-xs">12%</div>
                        <span className="text-xs font-bold text-white/80">Conversions</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Abstract 3D Object Mockup */}
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
    return (
        <div className="space-y-10">
            {/* Top Row: Analytics & Summary */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
                <div className="xl:col-span-2">
                    <AnalyticsCard />
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 border border-[#DBDADE]/50 shadow-sm col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-black text-[#5D596C] uppercase tracking-tight">Average Daily Sales</h4>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">+15.4%</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest leading-none mb-6">Total Sales This Month</p>
                    <div className="mb-4">
                        <p className="text-2xl font-black text-[#5D596C] tracking-tight">$28,450</p>
                    </div>
                    <div className="h-[90px] -mx-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailySalesData}>
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
                            <h4 className="text-sm font-black text-[#5D596C] uppercase tracking-tight">Sales Overview</h4>
                            <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1">Productivity Report</p>
                        </div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase">+18.2%</p>
                    </div>
                    <div className="flex items-end justify-between mb-6">
                        <p className="text-2xl font-black text-[#5D596C] tracking-tight">$42.5k</p>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-[#DBDADE]/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><LayoutGrid size={14} /></div>
                                <span className="text-xs font-black text-[#5D596C] uppercase">Order</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-[#6F6B7D]">62.2%</span>
                                <p className="text-[9px] font-bold text-[#A5A3AE]">6,440</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><Globe size={14} /></div>
                                <span className="text-xs font-black text-[#5D596C] uppercase">Visits</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-[#6F6B7D]">25.5%</span>
                                <p className="text-[9px] font-bold text-[#A5A3AE]">12,749</p>
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
                            <h4 className="text-lg font-black text-[#5D596C] uppercase italic">Earning Reports</h4>
                            <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1 italic leading-none">Weekly Earnings Overview</p>
                        </div>
                        <MoreVertical size={20} className="text-[#A5A3AE] cursor-pointer" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="space-y-4 min-w-[140px]">
                            <p className="text-3xl font-black text-[#5D596C] tracking-tight italic">$468 <span className="text-[10px] text-emerald-500 align-top">+4.2%</span></p>
                            <p className="text-[11px] font-medium text-[#A5A3AE] leading-relaxed">Weekly performance compared to last period reports.</p>
                            
                            <div className="space-y-3 pt-4">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#6F6B7D]">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#7367F0]"></div> Earnings</div>
                                    <span>$545.69</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#6F6B7D]">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div> Profit</div>
                                    <span>$256.34</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#6F6B7D]">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> Expense</div>
                                    <span>$74.19</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={earningsData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DBDADE" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#A5A3AE', fontSize: 10, fontWeight: 700}} />
                                    <Tooltip cursor={{fill: '#F8F7FA'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                    <Bar dataKey="profit" fill="#7367F0" radius={[4, 4, 0, 0]} barSize={12} />
                                    <Bar dataKey="expense" fill="#DBDADE" radius={[4, 4, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Support Tracker */}
                <div className="bg-white rounded-[1.5rem] p-8 border border-[#DBDADE]/50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-lg font-black text-[#5D596C] uppercase italic">Support Tracker</h4>
                            <p className="text-[10px] font-bold text-[#A5A3AE] uppercase tracking-widest mt-1 italic">Tickets Status (Last 7 Days)</p>
                        </div>
                        <MoreVertical size={20} className="text-[#A5A3AE] cursor-pointer" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-20">
                        <div className="text-center md:text-left flex-1">
                            <p className="text-5xl font-black text-[#5D596C] tracking-tighter italic">164</p>
                            <p className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-widest mt-2 mb-10">Total Tickets</p>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-50 text-[#7367F0] rounded-xl"><Mail size={18} /></div>
                                    <div>
                                        <p className="text-sm font-black text-[#5D596C] leading-none">New Tickets</p>
                                        <p className="text-[10px] font-bold text-[#A5A3AE] mt-1">142 Active</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><UserCheck size={18} /></div>
                                    <div>
                                        <p className="text-sm font-black text-[#5D596C] leading-none">Open Tickets</p>
                                        <p className="text-[10px] font-bold text-[#A5A3AE] mt-1">28 Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                    innerRadius="80%" 
                                    outerRadius="100%" 
                                    data={supportData} 
                                    startAngle={180} 
                                    endAngle={0}
                                >
                                    <RadialBar
                                        background
                                        dataKey="value"
                                        cornerRadius={20}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute top-[60%] text-center">
                                <p className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em] mb-1">Completed Task</p>
                                <p className="text-4xl font-black text-[#5D596C] tracking-tighter italic">85%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Detailed Lists */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-[1.5rem] p-8 border border-[#DBDADE]/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-md font-black text-[#5D596C] uppercase italic">Sales by Countries</h4>
                        <MoreVertical size={18} className="text-[#A5A3AE]" />
                    </div>
                    <div className="space-y-6 text-sm">
                        {salesByCountry.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <span className="text-2xl">{item.flag}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold text-[#5D596C] uppercase text-xs">{item.country}</p>
                                        <span className={`text-[10px] font-black ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.change}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-[#A5A3AE] font-black uppercase tracking-widest">
                                        <span>Total Sales</span>
                                        <span className="text-[#5D596C] font-black">{item.sales}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="xl:col-span-2 bg-white rounded-[1.5rem] p-8 border border-[#DBDADE]/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-md font-black text-[#5D596C] uppercase italic">System Health Overview</h4>
                        <button className="text-[10px] font-black bg-[#7367F0]/10 text-[#7367F0] px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-[#7367F0] hover:text-white transition-all">View Details</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-8">
                            <div>
                                <p className="text-xs font-black text-[#A5A3AE] uppercase tracking-[0.2em] mb-4">API Response</p>
                                <p className="text-4xl font-black text-[#5D596C] tracking-tighter italic">98.2<span className="text-lg opacity-40 ml-1">ms</span></p>
                                <div className="w-full h-1.5 bg-emerald-50 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[90%] rounded-full shadow-[0_0_8px_rgba(40,199,111,0.4)]"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Globe size={20} /></div>
                                <div>
                                    <p className="text-xs font-black text-[#5D596C] uppercase leading-none">Global Reach</p>
                                    <p className="text-[10px] font-bold text-[#A5A3AE] mt-1 uppercase">12 Regions Active</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <p className="text-xs font-black text-[#A5A3AE] uppercase tracking-[0.2em] mb-4">Memory Usage</p>
                                <p className="text-4xl font-black text-[#5D596C] tracking-tighter italic">42<span className="text-lg opacity-40 ml-1">%</span></p>
                                <div className="w-full h-1.5 bg-blue-50 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[42%] rounded-full shadow-[0_0_8px_rgba(0,123,255,0.4)]"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Monitor size={20} /></div>
                                <div>
                                    <p className="text-xs font-black text-[#5D596C] uppercase leading-none">Uptime</p>
                                    <p className="text-[10px] font-bold text-[#A5A3AE] mt-1 uppercase">99.9% Last 30d</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#7367F0] to-[#8E85F3] rounded-3xl p-6 text-white flex flex-col justify-between">
                            <h5 className="font-black text-xs uppercase tracking-widest leading-none">Monthly Upgrade Target</h5>
                            <p className="text-3xl font-black italic mt-4">$25,000</p>
                            <div className="mt-8 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Progress</span>
                                <span className="text-sm font-black italic">68%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/20 rounded-full mt-2">
                                <div className="h-full bg-white w-[68%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
