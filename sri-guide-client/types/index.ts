export type UserRole = "Tourist" | "Guide" | "TravelAgency" | "Transport" | "Admin";

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    profileImageUrl?: string;
    isVerified: boolean;
    token?: string;
    createdAt?: string;
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
    registrationNumber?: string;
    licenseExpirationDate?: string;
}

export interface Profile extends User {
    guideProfile?: GuideProfile;
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
