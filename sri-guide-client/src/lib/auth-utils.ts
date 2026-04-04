import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard URL for a given user role.
 */
export const getDashboardHref = (role?: UserRole | string): string => {
    if (!role) return "/dashboard";
    
    switch (role) {
        case "Admin":
            return "/admin";
        case "Guide":
            return "/guide";
        case "TravelAgency":
            return "/agency";
        case "EventOrganizer":
            return "/organizer";
        case "TransportProvider":
            return "/transport-dashboard";
        case "RestaurantOwner":
            return "/restaurant-dashboard";
        case "Tourist":
        default:
            return "/dashboard";
    }
};
