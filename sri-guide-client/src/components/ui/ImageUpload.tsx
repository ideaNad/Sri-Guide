"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/services/api-client";
import { useToast } from "@/hooks/useToast";


interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onMultipleChange?: (urls: string[]) => void;
    label?: string;
    className?: string;
    aspectRatio?: "square" | "video" | "auto";
    multiple?: boolean;
    maxCount?: number;
    currentCount?: number;
}

export default function ImageUpload({ 
    value, 
    onChange, 
    onMultipleChange,
    label, 
    className = "",
    aspectRatio = "video",
    multiple = false,
    maxCount = 10,
    currentCount = 0
}: ImageUploadProps) {
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

        if (multiple && onMultipleChange) {
            const remaining = maxCount - currentCount;
            if (remaining <= 0) {
                toast.warning(`You can only upload up to ${maxCount} images.`, "Upload Limit");
                return;
            }

            
            const filesToUpload = Array.from(files).slice(0, remaining);
            setUploading(true);

            try {
                const uploadPromises = filesToUpload.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await apiClient.post<{ url: string }>("/media/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    return response.data.url;
                });

                const urls = await Promise.all(uploadPromises);
                onMultipleChange(urls);
                if (fileInputRef.current) fileInputRef.current.value = "";
            } catch (error) {
                console.error("Multi-upload failed:", error);
                toast.error("Some images failed to upload. Please try again.", "Upload Error");
            } finally {

                setUploading(false);
            }
        } else {
            const file = files[0];
            // Show local preview immediately
            const localPreview = URL.createObjectURL(file);
            setPreview(localPreview);
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
            } catch (error) {
                console.error("Upload failed:", error);
                toast.error("Failed to upload image. Please try again.", "Upload Error");
                setPreview(value || null);

            } finally {
                setUploading(false);
            }
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const resolvedPreview = preview 
        ? ((preview.startsWith("/") || (!preview.startsWith("http") && !preview.startsWith("blob:"))) 
            ? `${apiClient.defaults.baseURL?.replace("/api", "")}${preview.startsWith("/") ? "" : "/"}${preview}` 
            : preview)
        : null;

    const aspectRatioClass = aspectRatio === "square" ? "aspect-square" : aspectRatio === "video" ? "aspect-video" : "h-48";

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                    {label}
                </label>
            )}
            
            <div 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`group relative overflow-hidden rounded-3xl border-2 border-dashed transition-all cursor-pointer ${
                    preview 
                        ? "border-primary/20 bg-gray-50" 
                        : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-primary/40"
                } ${aspectRatioClass}`}
            >
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="hidden"
                    accept="image/*"
                    multiple={multiple}
                />

                <AnimatePresence mode="wait">
                    {resolvedPreview ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            <img 
                                src={resolvedPreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                                >
                                    <Upload size={20} />
                                </button>
                                <button 
                                    onClick={removeImage}
                                    className="p-3 bg-white text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                    <span className="text-xs font-black uppercase tracking-widest text-primary">Uploading...</span>
                                </div>
                            )}

                            {!uploading && (preview?.startsWith("http") || preview?.startsWith("blob:")) === false && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                                    <CheckCircle2 size={16} />
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-white border border-gray-100 text-gray-400 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                                <ImageIcon size={28} className="group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-gray-900 tracking-tight">Click to upload photo{multiple ? "s" : ""}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">PNG, JPG or WebP up to {multiple ? "10MB each" : "10MB"}</p>
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
