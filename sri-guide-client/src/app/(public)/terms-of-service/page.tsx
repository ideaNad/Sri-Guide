"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, FileText, UserCheck, HelpCircle, ChevronRight, Scale } from "lucide-react";

const TermsOfServicePage = () => {
    const sections = [
        {
            icon: <UserCheck className="text-primary" size={24} />,
            title: "User Responsibilities",
            content: "As a user of SriGuide, you agree to provide accurate information, maintain the security of your account, and use our platform for lawful travel-related purposes only."
        },
        {
            icon: <HelpCircle className="text-secondary" size={24} />,
            title: "Inquiries & Communication",
            content: "Our platform facilitates communication between travelers and guides. Users are expected to maintain professional conduct in all interactions and inquiries sent through the platform."
        },
        {
            icon: <FileText className="text-gray-600" size={24} />,
            title: "Platform Rules",
            content: "Users may not engage in any activity that interferes with the platform's operation. This includes but is not limited to scraping data, attempting to bypass security measures, or posting fraudulent reviews."
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/5 rounded-full text-secondary text-xs font-black uppercase tracking-widest mb-6">
                        <Scale size={14} />
                        Our Commitment to You
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter mb-8 leading-[0.9]">
                        Terms of <span className="text-secondary">Service</span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-16 border-l-4 border-secondary/20 pl-8">
                        Welcome to SriGuide. By using our platform, you agree to these terms. We aim to provide a fair, transparent, and safe environment for both travelers and our local partners in Sri Lanka.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-secondary/5 transition-all group"
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

                    <div className="bg-gray-900 text-white p-12 rounded-[3rem] relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Need Clarification?</h2>
                            <p className="text-gray-400 mb-8 max-w-lg">
                                If you have any questions regarding these terms, our support team is happy to help you understand your rights and responsibilities.
                            </p>
                            <Link href="/contact" className="block w-fit">
                                <button className="flex items-center gap-3 px-8 py-4 bg-secondary hover:bg-white hover:text-black text-white rounded-full text-sm font-black uppercase tracking-widest transition-all">
                                    Get Support
                                    <ChevronRight size={18} />
                                </button>
                            </Link>
                        </div>
                        {/* Abstract background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            Last Updated: March 24, 2026 • © 2026 SriGuide Team
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
