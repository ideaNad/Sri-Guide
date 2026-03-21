"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import apiClient from "@/services/api-client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await apiClient.post("/auth/forgot-password", { email });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                            <Mail size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2 italic uppercase tracking-tight">Forgot Password?</h1>
                        <p className="text-gray-500 font-medium">No worries, it happens. Enter your email and we&apos;ll send you a reset link.</p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hello@example.com"
                                    className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                                />
                            </div>

                            {error && (
                                <p className="text-rose-500 text-xs font-bold italic text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                <span>{loading ? "Sending..." : "Send Reset Link"}</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 italic">Check Your Email</h3>
                            <p className="text-gray-500 text-sm font-medium mb-8">We&apos;ve sent a password reset link to <span className="text-primary font-bold">{email}</span></p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Back to Home
                            </Link>
                        </motion.div>
                    )}

                    {!submitted && (
                        <div className="mt-10 text-center">
                            <Link
                                href="/"
                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={14} />
                                Back to login
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
