import React from "react";
import { Metadata } from "next";
import apiClient from "@/services/api-client";
import AdventureClient from "./AdventureClient";

interface AdventureTrip {
  title: string;
  description?: string;
  images?: string[];
  duration?: string;
  location?: string;
  type?: string; // Assuming 'type' might be part of the trip data if 'isTour' was derived from it
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await apiClient.get<AdventureTrip>(`/trip/${slug}`);
    const trip = response.data;

    return {
      title: `${trip.title} | Adventure in Sri Lanka`,
      description: trip.description?.substring(0, 160),
      openGraph: {
        title: `${trip.title} | SriGuide`,
        description: trip.description?.substring(0, 160),
        images: (trip.images && trip.images.length > 0) ? [trip.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: "Adventure Package | SriGuide",
      description: "Explore authentic Sri Lankan travel experiences.",
    };
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { type } = await searchParams;

  let initialData = null;
  try {
      const response = await apiClient.get<any>(`/trip/${slug}`);
      initialData = response.data;
  } catch (e) {}

  return <AdventureClient slug={slug} initialData={initialData} type={type} />;
}
