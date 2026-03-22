"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ChevronRight } from "lucide-react";

const PrivacyPolicyPage = () => {
    const sections = [
        {
            icon: <Shield className="text-primary" size={24} />,
            title: "Data Protection",
            content: "We take the security of your personal data seriously. SriGuide employs industry-standard encryption and security measures to protect your information from unauthorized access, alteration, or disclosure."
        },
        {
            icon: <Eye className="text-secondary" size={24} />,
            title: "Information We Collect",
            content: "We collect information you provide directly to us, such as when you create an account, book a tour, or communicate with a guide. This may include your name, email address, phone number, and preferences."
        },
        {
            icon: <Lock className="text-primary" size={24} />,
            title: "How We Use Data",
            content: "Your data is used to provide and improve our services, facilitate bookings between tourists and guides, personalize your experience, and send important updates regarding your tours."
        },
        {
            icon: <FileText className="text-gray-600" size={24} />,
            title: "Third-Party Sharing",
            content: "We do not sell your personal information. We only share data with guides or agencies you've booked with, or with service providers who help us operate our platform (e.g., payment processors)."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-6">
                        <Lock size={14} />
                        Your Privacy Matters
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter mb-8 leading-[0.9]">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-16 border-l-4 border-primary/20 pl-8">
                        At SriGuide, we are committed to protecting your privacy and ensuring a safe, transparent experience for all our travelers and local partners. This policy outlines how we handle your digital footprint.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                            >
                                <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                                    {section.icon}
                                </div>
                                <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4 tracking-tight">
                                    {section.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    {section.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-black text-white p-12 rounded-[3rem] relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Questions about your data?</h2>
                            <p className="text-gray-400 mb-8 max-w-lg">
                                If you have any questions or concerns regarding our privacy practices, please don't hesitate to reach out to our dedicated privacy team.
                            </p>
                            <button className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-white hover:text-black text-white rounded-full text-sm font-black uppercase tracking-widest transition-all">
                                Contact Privacy Team
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        {/* Abstract background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            Last Updated: March 23, 2026 • © 2026 SriGuide Team
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
