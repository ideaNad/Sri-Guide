import React from "react";
import { Metadata } from "next";
import apiClient from "@/services/api-client";
import ProfileClient, { PublicProfile } from "./ProfileClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await apiClient.get<PublicProfile>(`/profile/public/${slug}`);
    const profile = response.data;

    return {
      title: `${profile.fullName} | Local Guide in Sri Lanka`,
      description: profile.bio?.substring(0, 160) || `Explore Sri Lanka with ${profile.fullName}. Certified local guide specialized in ${profile.specialties?.join(', ') || 'authentic experiences'}.`,
      openGraph: {
        title: `${profile.fullName} | SriGuide`,
        description: profile.bio?.substring(0, 160),
        images: profile.profileImageUrl ? [profile.profileImageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Guide Profile | SriGuide",
      description: "Discover expert local guides in Sri Lanka.",
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  
  // Optional: Prefetch data on server
  let initialData: PublicProfile | undefined = undefined;
  try {
      const response = await apiClient.get<PublicProfile>(`/profile/public/${slug}`);
      initialData = response.data;
  } catch (e) {}

  return <ProfileClient slug={slug} initialData={initialData} />;
}
