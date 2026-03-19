"use client";

import React, { useEffect, useState } from "react";
import { 
    Users, Search, Filter, MoreVertical, 
    User, Building2, MapPin, Shield, 
    Mail, Phone, Trash2, Edit2
} from "lucide-react";
import { motion } from "framer-motion";

interface PlatformUser {
    id: string;
    fullName: string;
    email: string;
    role: "Tourist" | "Guide" | "TravelAgency" | "Transport" | "Admin";
    status: "Active" | "Inactive" | "Suspended";
    joinedAt: string;
}

const UserDirectoryPage = () => {
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Mocking user data
        setTimeout(() => {
            setUsers([
                { id: "1", fullName: "Admin Nadun", email: "admin@sriguide.com", role: "Admin", status: "Active", joinedAt: "2023-01-15" },
                { id: "2", fullName: "Nuwan Perera", email: "nuwan@guide.lk", role: "Guide", status: "Active", joinedAt: "2023-05-20" },
                { id: "3", fullName: "John Doe", email: "john@traveler.com", role: "Tourist", status: "Active", joinedAt: "2023-08-10" },
                { id: "4", fullName: "Lanka Travels", email: "info@lankatravels.lk", role: "TravelAgency", status: "Active", joinedAt: "2023-03-05" },
                { id: "5", fullName: "Quick Transport", email: "cars@quick.lk", role: "Transport", status: "Inactive", joinedAt: "2023-11-12" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "Admin": return "bg-rose-50 text-rose-500";
            case "Guide": return "bg-indigo-50 text-indigo-500";
            case "TravelAgency": return "bg-teal-50 text-teal-500";
            case "Transport": return "bg-amber-50 text-amber-500";
            default: return "bg-blue-50 text-blue-500";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                        User <span className="text-primary">Directory</span>
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage all platform participants and access levels</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find users..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm w-64 font-bold"
                        />
                    </div>
                    <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User Identity</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Account Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-8 py-6">
                                        <div className="h-10 bg-gray-50 rounded-xl w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredUsers.map((u, i) => (
                            <motion.tr 
                                key={u.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${getRoleBadge(u.role)}`}>
                                            {u.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 leading-tight">{u.fullName}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getRoleBadge(u.role)}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_theme(colors.green.500)]' : 'bg-gray-300'}`} />
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{u.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-8 py-4 bg-gray-900 rounded-[2rem]">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Showing {filteredUsers.length} of {users.length} users</p>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white/5 text-white text-[10px] font-black rounded-lg hover:bg-white/10 transition-all uppercase tracking-widest disabled:opacity-30" disabled>Prev</button>
                    <button className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-lg hover:bg-primary/80 transition-all uppercase tracking-widest">Next</button>
                </div>
            </div>
        </div>
    );
};

export default UserDirectoryPage;
