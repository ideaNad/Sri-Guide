"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
    Users, Search, User, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";

interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

interface PaginatedResult {
    items: AdminUser[];
    totalCount: number;
    page: number;
    pageSize: number;
}

const ROLE_TABS = [
    { label: "All Users", value: "" },
    { label: "Tourists", value: "Tourist" },
    { label: "Guides", value: "Guide" },
    { label: "Agencies", value: "TravelAgency" },
    { label: "Admins", value: "Admin" },
];

const UserDirectoryPage = () => {
    const [data, setData] = useState<PaginatedResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeRole, setActiveRole] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("pageSize", pageSize.toString());
            if (activeRole) params.set("role", activeRole);
            if (searchQuery) params.set("search", searchQuery);

            const response = await apiClient.get<PaginatedResult>(`/admin/users?${params.toString()}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [page, activeRole, searchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleTabChange = (role: string) => {
        setActiveRole(role);
        setPage(1);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "Admin": return "bg-rose-50 text-rose-500 border-rose-100";
            case "Guide": return "bg-indigo-50 text-indigo-500 border-indigo-100";
            case "TravelAgency": return "bg-teal-50 text-teal-500 border-teal-100";
            case "Transport": return "bg-amber-50 text-amber-500 border-amber-100";
            default: return "bg-blue-50 text-blue-500 border-blue-100";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#5D596C] tracking-tighter">
                        User <span className="text-[#7367F0]">Directory</span>
                    </h1>
                    <p className="text-xs font-bold text-[#A5A3AE] uppercase tracking-widest mt-1">
                        {data ? `${data.totalCount} total users on platform` : "Loading..."}
                    </p>
                </div>
                
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5A3AE]" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-[#DBDADE] rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-[#7367F0] focus:shadow-[0_2px_12px_rgba(115,103,240,0.15)] transition-all text-sm w-72 font-medium text-[#5D596C]"
                        />
                    </div>
                </form>
            </div>

            {/* Role Tabs */}
            <div className="flex items-center gap-1 bg-[#F8F7FA] p-1.5 rounded-xl w-fit">
                {ROLE_TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                            activeRole === tab.value
                                ? "bg-white text-[#7367F0] shadow-sm"
                                : "text-[#A5A3AE] hover:text-[#6F6B7D]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#DBDADE] shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#DBDADE]/50 bg-[#F8F7FA]">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#A5A3AE]">User</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#A5A3AE]">Role</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#A5A3AE]">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#A5A3AE]">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DBDADE]/30">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-6 py-5">
                                        <div className="h-8 bg-[#F8F7FA] rounded-lg w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : data?.items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <Users className="mx-auto text-[#DBDADE] mb-4" size={40} />
                                    <p className="text-sm font-bold text-[#A5A3AE]">No users found matching your criteria</p>
                                </td>
                            </tr>
                        ) : data?.items.map((u, i) => (
                            <motion.tr
                                key={u.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="group hover:bg-[#F8F7FA]/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${getRoleBadge(u.role)}`}>
                                            {u.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#5D596C]">{u.fullName}</p>
                                            <p className="text-[11px] text-[#A5A3AE]">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(u.role)}`}>
                                        {u.role === "TravelAgency" ? "Agency" : u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? 'bg-green-500' : 'bg-amber-400'}`} />
                                        <span className="text-[11px] font-bold text-[#6F6B7D]">
                                            {u.isVerified ? "Verified" : "Unverified"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[11px] text-[#A5A3AE] font-medium">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-[#A5A3AE]">
                        Page {data?.page} of {totalPages} • {data?.totalCount} total
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="flex items-center gap-1 px-4 py-2 bg-white border border-[#DBDADE] text-[11px] font-bold text-[#6F6B7D] rounded-lg hover:border-[#7367F0] transition-all disabled:opacity-30 disabled:hover:border-[#DBDADE]"
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="flex items-center gap-1 px-4 py-2 bg-[#7367F0] text-white text-[11px] font-bold rounded-lg hover:bg-[#685DD8] transition-all disabled:opacity-30"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDirectoryPage;
