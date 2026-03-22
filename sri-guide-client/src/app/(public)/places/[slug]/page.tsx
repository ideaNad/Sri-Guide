import React from "react";
import { Metadata } from "next";
import apiClient from "@/services/api-client";
import PlaceClient from "./PlaceClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await apiClient.get<any>(`/places/${slug}`);
    const place = response.data;

    return {
      title: `${place.title} | Discover Sri Lanka`,
      description: place.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Explore the beauty and culture of ${place.title}, a must-visit destination in Sri Lanka.`,
      openGraph: {
        title: `${place.title} | SriGuide`,
        description: place.description?.replace(/<[^>]*>/g, '').substring(0, 160),
        images: place.imageUrl ? [place.imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Popular Place | SriGuide",
      description: "Explore breathtaking destinations across Sri Lanka.",
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  let initialData = null;
  try {
      const response = await apiClient.get<any>(`/places/${slug}`);
      initialData = response.data;
  } catch (e) {}

  return <PlaceClient slug={slug} initialData={initialData} />;
}
