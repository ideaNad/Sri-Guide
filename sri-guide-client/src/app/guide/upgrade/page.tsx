"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { 
    Building2, Mail, FileText, Phone, 
    MessageSquare, CheckCircle2, Loader2, Clock, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";


const UpgradePage = () => {
    const { user, login } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { confirm } = useConfirm();
    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);
    const [status, setStatus] = useState<"None" | "Pending" | "Approved" | "Rejected">("None");
    const [fetchingStatus, setFetchingStatus] = useState(true);

    const [formData, setFormData] = useState({
        companyName: "",
        companyEmail: "",
        regNumber: "",
        phone: "",
        whatsApp: ""
    });

    React.useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await apiClient.get<any>("/profile/me");
                if (res.data.agencyProfile) {
                    setStatus(res.data.agencyProfile.verificationStatus);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFetchingStatus(false);
            }
        };
        checkStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient.post("/profile/upgrade-to-agency", formData);
            
            const profileRes = await apiClient.get("/profile/me");
            login(profileRes.data as any);
            
            setSuccess(true);
            setTimeout(() => {
                router.push("/guide");
            }, 3000);
        } catch (error) {
            console.error("Upgrade failed:", error);
            toast.error("Upgrade failed. You may have already submitted a request, or only Guides can upgrade.", "Upgrade Error");
        } finally {

            setLoading(false);
        }
    };

    if (fetchingStatus) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Checking Eligibility...</p>
            </div>
        );
    }

    if (status === "Pending") {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[3rem] text-center max-w-lg mx-auto shadow-xl border border-gray-100"
                >
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Application Pending</h2>
                    <p className="text-gray-500 font-medium mb-8">
                        You already submit the request, please wait for approval or confirmation from our admins.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (status === "Rejected") {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[3rem] text-center max-w-lg mx-auto shadow-xl border border-gray-100"
                >
                    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Application Rejected</h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Your previous request to upgrade to a Travel Agency was rejected. Please contact support for more details, or you can try submitting a fresh application.
                    </p>
                    <button 
                        onClick={async () => {
                            const confirmed = await confirm({
                                title: "Reset Application?",
                                message: "Are you sure you want to reset your application?",
                                variant: "danger"
                            });
                            if (!confirmed) return;

                            try {
                                await apiClient.post("/profile/reset-agency-upgrade");
                                window.location.reload();
                            } catch (err) {
                                toast.error("Failed to reset application.", "Error");
                            }
                        }}

                        className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
                    >
                        Reset & Try Again
                    </button>
                </motion.div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[3rem] text-center max-w-lg mx-auto shadow-xl border border-gray-100"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Application Submitted!</h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Your request to become a Travel Agency is being processed. An admin will review your details.
                    </p>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest animate-pulse">
                        Redirecting to dashboard...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                    Upgrade to <span className="text-primary">Agency</span>
                </h1>
                <p className="text-gray-500 font-bold mt-2">Scale your business and manage a team of certified guides.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Left: Info */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
                        Scale Your Business as an <span className="text-secondary">Agency</span>
                    </h2>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                        Join our network of premium travel agencies. As an agency, you can:
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Manage a team of certified guides",
                            "List multi-day luxury tour packages",
                            "Get priority support and placement",
                            "Access advanced booking analytics"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                                <CheckCircle2 size={18} className="text-secondary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Company Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            required
                                            type="text"
                                            placeholder="e.g. Lanka Voyage Pvt Ltd"
                                            className="w-full bg-gray-50 border border-transparent focus:border-secondary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm font-bold"
                                            value={formData.companyName}
                                            onChange={e => setFormData({...formData, companyName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Company Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            required
                                            type="email"
                                            placeholder="contact@agency.com"
                                            className="w-full bg-gray-50 border border-transparent focus:border-secondary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm font-bold"
                                            value={formData.companyEmail}
                                            onChange={e => setFormData({...formData, companyEmail: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Business Registration No.</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. PV-123456"
                                        className="w-full bg-gray-50 border border-transparent focus:border-secondary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm font-bold"
                                        value={formData.regNumber}
                                        onChange={e => setFormData({...formData, regNumber: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Office Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            required
                                            type="tel"
                                            placeholder="+94 11 234 5678"
                                            className="w-full bg-gray-50 border border-transparent focus:border-secondary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm font-bold"
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">WhatsApp Business</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            required
                                            type="tel"
                                            placeholder="+94 77 123 4567"
                                            className="w-full bg-gray-50 border border-transparent focus:border-secondary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm font-bold"
                                            value={formData.whatsApp}
                                            onChange={e => setFormData({...formData, whatsApp: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Application"}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase tracking-tighter">
                                    By submitting, you agree to our Travel Agency Partnership Terms.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;
