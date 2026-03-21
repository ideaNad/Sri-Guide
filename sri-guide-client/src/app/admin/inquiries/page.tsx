"use client";

import React, { useState, useEffect } from "react";
import { Mail, Clock, User, MessageSquare, Search, Trash2, ExternalLink, ChevronRight, Filter, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { format } from "date-fns";

interface Inquiry {
    id: string;
    fullName: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<Inquiry[]>("/Inquiry");
            setInquiries(response.data || []);
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const filteredInquiries = inquiries.filter(inquiry =>
        inquiry.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#5D596C] italic uppercase tracking-tight">Customer Inquiries</h1>
                    <p className="text-[#A5A3AE] text-sm font-medium mt-1">Manage and respond to customer messages from the contact form.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A3AE]" size={18} />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-[#DBDADE] rounded-xl text-sm font-medium focus:border-[#7367F0] outline-none transition-all w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List View */}
                {!selectedInquiry && (
                    <div className="lg:col-span-12 space-y-4">
                        <div className="bg-white rounded-3xl border border-[#DBDADE]/50 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8F7FA] border-b border-[#DBDADE]/50">
                                        <tr>
                                            <th className="px-6 py-4 text-[11px] font-black text-[#A5A3AE] uppercase tracking-[0.1em]">Customer</th>
                                            <th className="px-6 py-4 text-[11px] font-black text-[#A5A3AE] uppercase tracking-[0.1em]">Subject</th>
                                            <th className="px-6 py-4 text-[11px] font-black text-[#A5A3AE] uppercase tracking-[0.1em]">Date</th>
                                            <th className="px-6 py-4 text-right text-[11px] font-black text-[#A5A3AE] uppercase tracking-[0.1em]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#DBDADE]/50">
                                        {loading ? (
                                            Array(5).fill(0).map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-3/4"></div></td>
                                                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-1/2"></div></td>
                                                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-1/4"></div></td>
                                                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-10 ml-auto"></div></td>
                                                </tr>
                                            ))
                                        ) : filteredInquiries.length > 0 ? (
                                            filteredInquiries.map((inquiry) => (
                                                <tr
                                                    key={inquiry.id}
                                                    className="group hover:bg-[#F8F7FA] transition-colors cursor-pointer"
                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                >
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#7367F0]/10 flex items-center justify-center text-[#7367F0] font-bold text-xs uppercase">
                                                                {inquiry.fullName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-[#5D596C] tracking-tight">{inquiry.fullName}</p>
                                                                <p className="text-[11px] text-[#A5A3AE] font-medium">{inquiry.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <p className="text-sm font-bold text-[#5D596C] italic tracking-tight line-clamp-1">{inquiry.subject}</p>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className="text-xs font-medium text-[#A5A3AE]">
                                                            {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 text-right">
                                                        <button className="p-2 text-[#A5A3AE] hover:text-[#7367F0] hover:bg-[#7367F0]/10 rounded-lg transition-all">
                                                            <ChevronRight size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Mail size={40} className="text-[#DBDADE]" />
                                                        <p className="text-[#A5A3AE] font-bold uppercase tracking-widest text-xs">No inquiries found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detail View */}
                <AnimatePresence>
                    {selectedInquiry && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="lg:col-span-12"
                        >
                            <div className="bg-white rounded-[2rem] border border-[#DBDADE]/50 shadow-xl overflow-hidden">
                                <div className="p-8 border-b border-[#DBDADE]/50 flex items-center justify-between bg-[#F8F7FA]/50">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setSelectedInquiry(null)}
                                            className="p-2 text-[#A5A3AE] hover:text-[#7367F0] hover:bg-[#7367F0]/10 rounded-xl transition-all mr-2 flex items-center gap-2"
                                        >
                                            <ArrowLeft size={20} />
                                            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Back to List</span>
                                        </button>
                                        <div className="w-14 h-14 rounded-2xl bg-[#7367F0] text-white flex items-center justify-center font-black text-xl italic shadow-lg shadow-[#7367F0]/20">
                                            {selectedInquiry.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-[#5D596C] italic uppercase tracking-tight">{selectedInquiry.fullName}</h3>
                                            <div className="flex items-center gap-3 text-xs font-bold text-[#A5A3AE] uppercase tracking-widest mt-1">
                                                <Clock size={12} className="text-[#7367F0]" />
                                                {format(new Date(selectedInquiry.createdAt), 'MMMM dd, yyyy • p')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedInquiry(null)}
                                            className="p-2 text-[#A5A3AE] hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-10 space-y-10">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Contact Email</p>
                                            <p className="text-sm font-black text-[#7367F0] underline decoration-2 underline-offset-4">{selectedInquiry.email}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Subject Line</p>
                                            <p className="text-sm font-black text-[#5D596C] italic">{selectedInquiry.subject}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-[#A5A3AE] uppercase tracking-[0.2em]">Message Content</p>
                                        <div className="bg-[#F8F7FA] p-8 rounded-3xl border border-[#DBDADE]/30 relative group">
                                            <MessageSquare className="absolute -right-4 -top-4 w-12 h-12 text-[#DBDADE] opacity-20 group-hover:scale-110 transition-transform" />
                                            <p className="text-[#6F6B7D] leading-relaxed font-medium italic whitespace-pre-wrap">
                                                &quot;{selectedInquiry.message}&quot;
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <a
                                            href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                                            className="flex-1 bg-[#7367F0] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#685dd8] transition-all shadow-lg shadow-[#7367F0]/20 flex items-center justify-center gap-3 group"
                                        >
                                            <Mail size={14} className="group-hover:scale-110 transition-transform" />
                                            Compose Reply
                                        </a>
                                        <button className="px-6 bg-[#F8F7FA] text-[#6F6B7D] rounded-2xl border border-[#DBDADE] hover:bg-white hover:border-[#7367F0] hover:text-[#7367F0] transition-all">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
