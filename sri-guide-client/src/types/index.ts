export type UserRole = "Tourist" | "Guide" | "TravelAgency" | "Transport" | "EventOrganizer" | "Admin";

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    profileImageUrl?: string;
    isVerified: boolean;
    token?: string;
    createdAt?: string;
    onboardingCompleted?: boolean;
    interests?: string[];
    budget?: string;
    slug?: string;
    travelDuration?: string;
    preferredLocation?: string;
    eventOrganizerProfile?: EventOrganizerProfile;
}

export interface EventOrganizerProfile {
    organizationName: string;
    website?: string;
    bio?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    tikTokLink?: string;
    youTubeLink?: string;
    linkedinLink?: string;
    languages?: string[];
    specialties?: string[];
    operatingAreas?: string[];
    isVerified: boolean;
}

export interface GuideProfile {
    id: string;
    userId: string;
    bio: string;
    languages: string[];
    specialties: string[];
    operatingAreas: string[];
    dailyRate: number;
    hourlyRate?: number;
    yearsOfExperience: number;
    isGovernmentLicensed: boolean;
    isFirstAidCertified: boolean;
    contactForPrice?: boolean;
    phoneNumber?: string;
    whatsAppNumber?: string;
    youTubeLink?: string;
    tikTokLink?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    linkedinLink?: string;
    verificationStatus?: "None" | "Pending" | "Approved" | "Rejected";
    registrationNumber?: string;
    licenseExpirationDate?: string;
}

export interface AgencyProfile {
    id: string;
    companyName: string;
    bio?: string;
    companyEmail?: string;
    registrationNumber?: string;
    phone?: string;
    whatsApp?: string;
    youTubeLink?: string;
    tikTokLink?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    linkedinLink?: string;
    isVerified: boolean;
    verificationStatus: "None" | "Pending" | "Approved" | "Rejected";
    companyAddress?: string;
    specialties?: string[];
    languages?: string[];
    operatingRegions?: string[];
    slug?: string;
}

export interface Profile extends User {
    guideProfile?: GuideProfile;
    agencyProfile?: AgencyProfile;
    rating: number;
    reviewCount: number;
}

export interface Tour {
    id: string;
    title: string;
    description: string;
    price: number;
    durationDays: number;
    image: string;
    location: string;
    rating: number;
    guideId: string;
    guideName: string;
}

export interface EventCategory {
    id: string;
    name: string;
    icon?: string;
    isActive: boolean;
}

export interface Event {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    categoryId: string;
    category?: EventCategory;
    organizerProfileId: string;
    eventType: string;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    locationName: string;
    district?: string;
    mapLocation?: string;
    price: number;
    currency: string;
    maxParticipants: number;
    coverImage?: string;
    galleryImages?: string;
    isPublished: boolean;
    isCancelled: boolean;
    createdAt: string;
    updatedAt?: string;
}
