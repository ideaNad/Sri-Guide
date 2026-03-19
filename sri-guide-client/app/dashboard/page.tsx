"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/**
 * Universal Dashboard Redirector
 * Users landing on /dashboard are sent to their role-specific portal.
 */
export default function DashboardRedirectPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (user.role === "Admin") {
                router.replace("/admin");
            } else if (user.role === "Guide") {
                router.replace("/guide");
            } else if (user.role === "TravelAgency") {
                router.replace("/agency");
            } else {
                router.replace("/");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
