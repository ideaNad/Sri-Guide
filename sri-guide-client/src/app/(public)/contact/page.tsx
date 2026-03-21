"use client";

import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";

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
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                                <h3 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tight">Contact Information</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-5 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                                            <a href="mailto:sriguidecontact@gmail.com" className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
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
                                            <p className="text-lg font-bold text-gray-900">123 Galle Road, Colombo 03, Sri Lanka</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <h3 className="text-2xl font-black mb-4 italic tracking-tight">Need 24/7 Support?</h3>
                                <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed italic">Our dedicated team is ready to assist you at any time with your bookings or inquiries.</p>
                                {/* <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all flex items-center gap-3 relative z-10">
                                    <MessageCircle size={16} />
                                    <span>Chat with us on WhatsApp</span>
                                </button> */}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl lg:sticky lg:top-32">
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
