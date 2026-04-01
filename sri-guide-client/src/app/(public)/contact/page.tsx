"use client";

import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ChevronRight, CheckCircle2, Loader2, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";

const TikTokIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
    <svg className={className} viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.32h0q2.55,11.33,8.06,21.57h0a121.72,121.72,0,0,0,112.82,66.07Z" />
    </svg>
);

const WhatsAppIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
    <svg className={className} viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.4 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.7 2.8-3.3 3.7-5.7 5.5-9.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
);

const ContactPage = () => {
    const [formData, setFormData] = React.useState({
        fullName: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await apiClient.post("/Inquiry", formData);
            setSubmitted(true);
            setFormData({ fullName: "", email: "", subject: "", message: "" });
        } catch (err) {
            console.error("Failed to send inquiry:", err);
            setError("Failed to send inquiry. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4">
                <SectionHeader
                    badge="Support"
                    title="Get in Touch"
                    subtitle="We're here to help you plan your perfect Sri Lankan adventure."
                />

                <div className="mt-16 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                                <h3 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tight">Contact Information</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-5 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                                            <a href="mailto:sriguidecontact@gmail.com" className="text-base sm:text-lg font-bold text-gray-900 hover:text-primary transition-colors break-words">
                                                sriguidecontact@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                                            <p className="text-lg font-bold text-gray-900">+94 76 414 9630</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-highlight/10 text-highlight flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Office</p>
                                            <p className="text-lg font-bold text-gray-900">Kaluthara South, Sri Lanka, 12000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 text-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <h3 className="text-2xl font-black mb-4 italic tracking-tight uppercase">Need 24/7 Support?</h3>
                                <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed italic">Our dedicated team is ready to assist you at any time with your bookings or inquiries.</p>

                                <div className="space-y-6">
                                    <div className="relative z-10">
                                        <a
                                            href="https://wa.me/94764149630"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <button className="w-full bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-green-600 transition-all border border-transparent hover:border-green-600 flex items-center justify-center gap-3 shadow-lg shadow-green-600/20">
                                                <WhatsAppIcon size={18} />
                                                <span>WhatsApp Support</span>
                                            </button>
                                        </a>
                                    </div>

                                    <div className="flex justify-center flex-wrap gap-4 py-4 border-t border-white/10 mt-4">
                                        {[
                                            { Icon: Facebook, href: "https://web.facebook.com/people/SRIGuide/61579538772356/", color: "hover:bg-[#1877F2]" },
                                            { Icon: Instagram, href: "https://www.instagram.com/sriguide?igsh=OTA4c2ljZWNobTRp", color: "hover:bg-[#E4405F]" },
                                            { Icon: Youtube, href: "https://youtu.be/2nbxd746agU?si=5L9eT1veN83IxGOb", color: "hover:bg-[#FF0000]" },
                                            { Icon: Linkedin, href: "https://www.linkedin.com/company/sriguide/", color: "hover:bg-[#0A66C2]" },
                                            { Icon: TikTokIcon, href: "https://www.tiktok.com/@sriguide?_r=1&_t=ZS-95BBqbWyX2I", color: "hover:bg-black" },
                                        ].map((social, idx) => (
                                            <a
                                                key={idx}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-all ${social.color} hover:scale-110`}
                                            >
                                                <social.Icon size={20} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl lg:sticky lg:top-32">
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2 italic uppercase">Message Received!</h3>
                                        <p className="text-gray-500 font-medium mb-8 italic">We&apos;ll get back to you within 24 hours.</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all"
                                        >
                                            Send Another Message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <h3 className="text-2xl font-black text-gray-900 mb-8 italic tracking-tight uppercase">Send a Message</h3>
                                        <form className="space-y-6" onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Your Name</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Subject</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                                                    placeholder="How can we help?"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows={6}
                                                    className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-[2rem] px-6 py-5 text-sm font-bold outline-none transition-all placeholder:text-gray-300 resize-none"
                                                    placeholder="Tell us about your trip..."
                                                />
                                            </div>

                                            {error && (
                                                <p className="text-red-500 text-xs font-bold italic ml-2">{error}</p>
                                            )}

                                            <button
                                                disabled={loading}
                                                className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <Loader2 className="animate-spin" size={16} />
                                                ) : (
                                                    <>
                                                        <span>Send Inquiry</span>
                                                        <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
