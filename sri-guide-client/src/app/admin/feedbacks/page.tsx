"use client";

import React, { useState, useEffect } from "react";
import { 
    MessageSquare, Search, Filter, Calendar, 
    User, Mail, ArrowRight, CheckCircle2, 
    Clock, Trash2, ChevronLeft, ChevronRight
} from "lucide-react";
import apiClient from "@/services/api-client";
import { format } from "date-fns";

interface Feedback {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    isReviewed: boolean;
}

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "reviewed">("all");

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<Feedback[]>("/feedback");
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Failed to fetch feedbacks", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesSearch = 
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            filterStatus === "all" || 
            (filterStatus === "reviewed" && f.isReviewed) || 
            (filterStatus === "pending" && !f.isReviewed);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#7367F0]/10 text-[#7367F0] rounded-xl flex items-center justify-center">
                            <MessageSquare size={20} />
                        </div>
                        <h1 className="text-[28px] font-black text-[#5D596C] tracking-tight truncate uppercase italic">System Feedbacks</h1>
                    </div>
                    <p className="text-[#A5A3AE] font-medium text-sm">Review and manage user feedback submitted via the system.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5A3AE]" size={18} />
                        <input 
                            type="text"
                            placeholder="Search feedbacks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-[#DBDADE] rounded-xl pl-12 pr-6 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#7367F0]/20 transition-all outline-none w-full md:w-64"
                        />
                    </div>
                    
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-white border border-[#DBDADE] rounded-xl px-4 py-2.5 text-sm font-bold text-[#5D596C] outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                    </select>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[2rem] border border-[#DBDADE]/50 shadow-sm overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-8 h-8 border-4 border-[#7367F0] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Loading Feedbacks</span>
                    </div>
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                        <div className="w-20 h-20 bg-[#F8F7FA] rounded-full flex items-center justify-center mb-6 text-[#A5A3AE]">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-xl font-black text-[#5D596C] uppercase italic mb-2 tracking-tight">No Feedbacks Found</h3>
                        <p className="text-[#A5A3AE] text-sm max-w-xs font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#F8F7FA]">
                                    <th className="px-8 py-5 text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">User Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Feedback Message</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Submitted At</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F8F7FA]">
                                {filteredFeedbacks.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#F8F7FA]/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#7367F0]/5 flex items-center justify-center text-[#7367F0] font-black text-sm">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-[#5D596C] tracking-tight">{item.name}</div>
                                                    <div className="text-[11px] text-[#A5A3AE] font-medium flex items-center gap-1.5 mt-0.5">
                                                        <Mail size={12} />
                                                        {item.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <div className="text-xs font-bold text-[#5D596C] mb-1 uppercase tracking-wider">{item.subject}</div>
                                            <p className="text-sm text-[#A5A3AE] line-clamp-2 leading-relaxed italic">"{item.message}"</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-[#6F6B7D]">
                                                <Calendar size={14} className="text-[#A5A3AE]" />
                                                <span className="text-sm font-bold tracking-tight">{format(new Date(item.createdAt), "MMM dd, yyyy")}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#A5A3AE] mt-1">
                                                <Clock size={12} />
                                                <span className="text-[11px] font-medium uppercase tracking-widest">{format(new Date(item.createdAt), "HH:mm")}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {item.isReviewed ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-600 border border-green-100">
                                                    <CheckCircle2 size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Reviewed</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                                                    <Clock size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">New</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-all">
                                                <button className="p-2 text-[#6F6B7D] hover:bg-white hover:text-[#7367F0] rounded-xl transition-all shadow-sm border border-transparent hover:border-[#DBDADE]/50">
                                                    <ArrowRight size={18} />
                                                </button>
                                                <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination Placeholder */}
                {!loading && filteredFeedbacks.length > 0 && (
                    <div className="px-8 py-6 border-t border-[#F8F7FA] flex items-center justify-between">
                        <p className="text-[11px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Showing {filteredFeedbacks.length} feedbacks</p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-[#DBDADE] rounded-lg text-[#A5A3AE] hover:bg-[#F8F7FA] disabled:opacity-50 transition-all">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="p-2 border border-[#DBDADE] rounded-lg text-[#A5A3AE] hover:bg-[#F8F7FA] disabled:opacity-50 transition-all">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
