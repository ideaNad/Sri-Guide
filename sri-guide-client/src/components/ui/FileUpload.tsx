"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, FileText, CheckCircle2, File as FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
    accept?: string;
}

export default function FileUpload({ 
    value, 
    onChange, 
    label, 
    className = "",
    accept = "image/*,application/pdf"
}: FileUploadProps) {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync preview with value when it changes externally
    React.useEffect(() => {
        if (value !== undefined) {
            setPreview(value || null);
        }
    }, [value]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await apiClient.post<{ url: string }>("/media/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const uploadedUrl = response.data.url;
            onChange(uploadedUrl);
            
            // Immediately update preview so it doesn't disappear before parent re-renders
            setPreview(uploadedUrl);
            if (fileInputRef.current) fileInputRef.current.value = "";
            toast.success("Document uploaded successfully.", "Success");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload document. Please try again.", "Upload Error");
            setPreview(value || null);
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const isImage = (url: string) => {
        return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
    };

    const resolvedPreview = preview 
        ? ((preview.startsWith("/") || (!preview.startsWith("http") && !preview.startsWith("blob:"))) 
            ? `${apiClient.defaults.baseURL?.replace("/api", "")}${preview.startsWith("/") ? "" : "/"}${preview}` 
            : preview)
        : null;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                    {label}
                </label>
            )}
            
            <div 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`group relative overflow-hidden rounded-3xl border-2 border-dashed transition-all cursor-pointer min-h-[140px] flex items-center justify-center ${
                    preview 
                        ? "border-primary/20 bg-gray-50" 
                        : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-primary/40"
                }`}
            >
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="hidden"
                    accept={accept}
                />

                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex flex-col items-center justify-center p-6 gap-3"
                        >
                            {isImage(preview) ? (
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                                    <img 
                                        src={resolvedPreview!} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-white border border-gray-100 text-primary rounded-2xl flex items-center justify-center shadow-sm">
                                    <FileText size={32} />
                                </div>
                            )}
                            
                            <div className="text-center">
                                <p className="text-xs font-black text-gray-900 tracking-tight truncate max-w-[200px]">
                                    {preview.split("/").pop()}
                                </p>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                                    Document Uploaded
                                </p>
                            </div>

                            <button 
                                onClick={removeFile}
                                className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 shadow-sm border border-gray-100"
                            >
                                <X size={16} />
                            </button>
                            
                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                    <span className="text-xs font-black uppercase tracking-widest text-primary">Uploading...</span>
                                </div>
                            )}

                            {!uploading && (
                                <div className="absolute bottom-4 right-4 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                    <CheckCircle2 size={12} />
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center gap-4 p-8 text-center"
                        >
                            <div className="w-14 h-14 bg-white border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                                <FileIcon size={24} className="group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-gray-900 tracking-tight">Select registration document</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">PDF, PNG, JPG up to 10MB</p>
                            </div>
                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
