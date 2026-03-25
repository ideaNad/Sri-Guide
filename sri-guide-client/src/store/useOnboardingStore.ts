import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'tourist' | 'guide' | 'agency' | 'eventOrganizer' | null;

interface OnboardingState {
  userRole: UserRole;
  onboardingStep: number;
  onboardingCompleted: boolean;
  translateDismissed: boolean;
  
  // Onboarding Data
  interests: string[];
  budget: string;
  travelDuration: string;
  preferredLocation: string;
  
  // Guide Onboarding Data
  guideProfile: {
    fullName: string;
    about: string;
    firstTripTitle: string;
    location: string;
    duration: string;
    listingPrice: string;
    priceUnit: string;
  };

  // Agency Onboarding Data
  agencyProfile: {
    agencyName: string;
    registrationNumber: string;
    businessType: string;
    pricingModel: string;
  };
  
  // Event Organizer Onboarding Data
  eventOrganizerProfile: {
    organizationName: string;
    website: string;
    bio: string;
  };

  // Actions
  setUserRole: (role: UserRole) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setTranslateDismissed: (dismissed: boolean) => void;
  updateData: (data: Partial<Pick<OnboardingState, 'interests' | 'budget' | 'travelDuration' | 'preferredLocation'>>) => void;
  updateGuideData: (data: Partial<OnboardingState['guideProfile']>) => void;
  updateAgencyData: (data: Partial<OnboardingState['agencyProfile']>) => void;
  updateEventOrganizerData: (data: Partial<OnboardingState['eventOrganizerProfile']>) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      userRole: null,
      onboardingStep: 0,
      onboardingCompleted: false,
      translateDismissed: false,
      interests: [],
      budget: '',
      travelDuration: '',
      preferredLocation: '',
      guideProfile: {
        fullName: '',
        about: '',
        firstTripTitle: '',
        location: '',
        duration: '',
        listingPrice: '',
        priceUnit: 'per Day'
      },
      agencyProfile: {
        agencyName: '',
        registrationNumber: '',
        businessType: '',
        pricingModel: ''
      },
      eventOrganizerProfile: {
        organizationName: '',
        website: '',
        bio: ''
      },

      setUserRole: (role) => set({ userRole: role }),
      setStep: (step) => set({ onboardingStep: step }),
      nextStep: () => set((state) => ({ onboardingStep: state.onboardingStep + 1 })),
      prevStep: () => set((state) => ({ onboardingStep: Math.max(0, state.onboardingStep - 1) })),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      resetOnboarding: () => set({ 
        userRole: null, 
        onboardingStep: 0, 
        onboardingCompleted: false,
        interests: [],
        budget: '',
        travelDuration: '',
        preferredLocation: '',
        guideProfile: {
          fullName: '',
          about: '',
          firstTripTitle: '',
          location: '',
          duration: '',
          listingPrice: '',
          priceUnit: 'per Day'
        },
        agencyProfile: {
          agencyName: '',
          registrationNumber: '',
          businessType: '',
          pricingModel: ''
        },
        eventOrganizerProfile: {
          organizationName: '',
          website: '',
          bio: ''
        }
      }),
      setTranslateDismissed: (dismissed) => set({ translateDismissed: dismissed }),
      updateData: (data) => set((state) => ({ ...state, ...data })),
      updateGuideData: (data) => set((state) => ({ 
        guideProfile: { ...state.guideProfile, ...data } 
      })),
      updateAgencyData: (data) => set((state) => ({ 
        agencyProfile: { ...state.agencyProfile, ...data } 
      })),
      updateEventOrganizerData: (data) => set((state) => ({ 
        eventOrganizerProfile: { ...state.eventOrganizerProfile, ...data } 
      })),
    }),
    {
      name: 'sriguide-onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
