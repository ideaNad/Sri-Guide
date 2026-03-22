import React from "react";
import { Metadata } from "next";
import apiClient from "@/services/api-client";
import AdventureClient from "../../adventures/[slug]/AdventureClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await apiClient.get<any>(`/Tours/${slug}`);
    const tour = response.data;

    return {
      title: `${tour.title} | Guided Tour in Sri Lanka`,
      description: tour.description?.substring(0, 160) || `Experience an unforgettable guided tour in ${tour.location}. Official agency verified experience by ${tour.agencyName || 'professional local experts'}.`,
      openGraph: {
        title: `${tour.title} | SriGuide`,
        description: tour.description?.substring(0, 160),
        images: tour.images?.length > 0 ? [tour.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: "Tour Package | SriGuide",
      description: "Discover curated tours and experiences in Sri Lanka.",
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  let initialData = null;
  try {
      const response = await apiClient.get<any>(`/Tours/${slug}`);
      initialData = response.data;
  } catch (e) {}

  return <AdventureClient slug={slug} initialData={initialData} type="tour" />;
}
