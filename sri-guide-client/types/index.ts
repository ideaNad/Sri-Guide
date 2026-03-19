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
    specialty: string;
    dailyRate: number;
    yearsOfExperience: number;
    isGovernmentLicensed: boolean;
    isFirstAidCertified: boolean;
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
