"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    centered?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, badge, centered = false }) => {
    return (
        <div className={`mb-12 ${centered ? "text-center" : "text-left"}`}>
            {badge && (
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 border-l-2 border-primary"
                >
                    {badge}
                </motion.span>
            )}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed"
                    style={{ margin: centered ? "0 auto" : "0" }}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeader;
