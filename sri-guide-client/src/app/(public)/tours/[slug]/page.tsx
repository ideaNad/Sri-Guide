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
    const title = `${tour.title} | Guided Tour in Sri Lanka`;
    const description = tour.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Experience an unforgettable guided tour in ${tour.location}. Official agency verified experience by ${tour.agencyName || 'professional local experts'}.`;
    const url = `https://www.sriguide.com/tours/${slug}`;
    const image = tour.images?.length > 0 ? tour.images[0] : "/share-image.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${tour.title} | SriGuide`,
        description,
        url,
        siteName: "SriGuide",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: tour.title,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${tour.title} | SriGuide`,
        description,
        images: [image],
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
