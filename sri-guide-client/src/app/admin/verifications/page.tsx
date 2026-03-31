"use client";

import React, { useEffect, useState } from "react";
import { 
    CheckCircle2, XCircle, Clock, Search, 
    Filter, ShieldCheck, User, Building2, 
    Eye, MoreVertical, Check, X, Trash2,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useRouter } from "next/navigation";

interface VerificationRequest {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    role: "Guide" | "TravelAgency";
    registrationNumber: string;
    licenseExpirationDate?: string;
    registrationDocUrl?: string;
    createdAt: string;
}

const AdminVerificationsPage = () => {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await apiClient.get<VerificationRequest[]>("/admin/pending-verifications");
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setActionLoading(id);
        try {
            await apiClient.post(`/admin/verify-guide/${id}`, { 
                guideProfileId: id,
                approve: action === "approve"
            });
            setRequests(requests.filter(r => r.id !== id));
        } catch (error) {
            console.error(`Error during ${action}:`, error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteGuide = async (id: string, fullName: string) => {
        if (!window.confirm(`Are you sure you want to delete the guide profile for ${fullName}? This will remove all their trips and content, but keep the user account.`)) {
            return;
        }

        setActionLoading(id);
        try {
            await apiClient.delete(`/admin/guide/${id}`);
            setRequests(requests.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting guide:", error);
            alert("Failed to delete guide profile.");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredRequests = requests.filter(r => 
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                        Verification <span className="text-primary">Requests</span>
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Review and approve platform professionals</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search applicants..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm w-64 font-bold"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center px-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                            <Clock size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Requests Found</h3>
                        <p className="text-sm text-gray-400 font-medium">There are no pending verification requests at the moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Applicant</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Account Type</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date Logged</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Registration Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredRequests.map((req, i) => (
                                    <motion.tr 
                                        key={req.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                                                    {req.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{req.fullName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{req.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                req.role === 'Guide' ? 'bg-indigo-50 text-indigo-500' : 'bg-teal-50 text-teal-500'
                                            }`}>
                                                {req.role === 'Guide' ? <User size={12} /> : <Building2 size={12} />}
                                                {req.role}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-gray-600">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-gray-900">{req.registrationNumber || 'N/A'}</p>
                                            {req.licenseExpirationDate && (
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    Exp: {new Date(req.licenseExpirationDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button 
                                                    onClick={() => router.push(`/profile/${req.userId}`)}
                                                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                    title="View Profile"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {req.registrationDocUrl && (
                                                    <a 
                                                        href={`${apiClient.defaults.baseURL?.replace('/api', '')}${req.registrationDocUrl}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                                                        title="View Document"
                                                    >
                                                        <FileText size={18} />
                                                    </a>
                                                )}
                                                <button 
                                                    disabled={!!actionLoading}
                                                    onClick={() => handleAction(req.id, "reject")}
                                                    className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <X size={18} />
                                                </button>
                                                <button 
                                                    disabled={!!actionLoading}
                                                    onClick={() => handleAction(req.id, "approve")}
                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                                    title="Approve Verification"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button 
                                                    disabled={!!actionLoading}
                                                    onClick={() => handleDeleteGuide(req.id, req.fullName)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Delete Guide Profile"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminVerificationsPage;
