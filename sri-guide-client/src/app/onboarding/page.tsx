'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore, UserRole } from '@/store/useOnboardingStore';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { RoleSelector } from '@/components/onboarding/RoleSelector';
import { InterestsForm } from '@/components/onboarding/tourist/InterestsForm';
import { BudgetForm } from '@/components/onboarding/tourist/BudgetForm';
import { DurationForm } from '@/components/onboarding/tourist/DurationForm';
import { LocationForm } from '@/components/onboarding/tourist/LocationForm';
import { TranslateBanner } from '@/components/translate/TranslateBanner';
import { HelpDrawer } from '@/components/help/HelpDrawer';
import { HelpCircle, ChevronRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Joyride, { Step as JoyrideStep } from 'react-joyride';
import { GuideFlow } from '@/components/onboarding/guide/GuideFlow';
import { AgencyFlow } from '@/components/onboarding/agency/AgencyFlow';
import { useAuth } from '@/providers/AuthContext';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/useToast';


export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const { toast } = useToast();

  const { 
    userRole, 
    setUserRole, 
    onboardingStep, 
    setStep,
    completeOnboarding,
    // onboardingCompleted, // Removed to avoid naming conflict and loop
    resetOnboarding,
    interests,
    budget,
    travelDuration,
    preferredLocation,
    guideProfile,
    agencyProfile,
    updateData,
    updateGuideData,
    updateAgencyData
  } = useOnboardingStore();

  // Redirect if onboarding already completed or user not logged in
  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (user.onboardingCompleted) {
        // Find correct dashboard based on role
        if (user.role === 'Guide') router.push('/guide');
        else if (user.role === 'TravelAgency') router.push('/agency');
        else router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Guided Tour Steps
  const tourSteps: JoyrideStep[] = [
    {
      target: '.role-selection-title',
      content: 'Welcome! First, let us know how you will use the platform.',
      placement: 'bottom',
    },
    {
      target: '.role-card-tourist',
      content: 'If you are looking for tours, select Tourist.',
    },
    {
      target: '.help-center-button',
      content: 'Stuck? Access our help center anytime from here.',
    }
  ];

  // Handle completion
  const handleComplete = async () => {
    try {
      if (!user) return;

      if (userRole === 'tourist') {
        await apiClient.post('/profile/update-user', {
          userId: user.id,
          onboardingCompleted: true,
          interests: interests.join(','),
          budget: budget,
          travelDuration: travelDuration,
          preferredLocation: preferredLocation
        });
      } else if (userRole === 'guide') {
        // Update basic user info
        await apiClient.post('/profile/update-user', {
          userId: user.id,
          onboardingCompleted: true,
          fullName: guideProfile.fullName || user.fullName
        });

        // Update guide specific info
        await apiClient.post('/profile/update-guide', {
          userId: user.id,
          bio: guideProfile.about,
          dailyRate: guideProfile.priceUnit === 'per Day' ? parseFloat(guideProfile.listingPrice) : null,
          hourlyRate: guideProfile.priceUnit === 'per Hour' ? parseFloat(guideProfile.listingPrice) : null,
        });
      } else if (userRole === 'agency') {
        // Update basic user info
        await apiClient.post('/profile/update-user', {
          userId: user.id,
          onboardingCompleted: true,
          fullName: agencyProfile.agencyName || user.fullName
        });

        // Update agency specific info (using the update-user for onboardingCompleted, and agency/update for profile)
        await apiClient.post('/profile/agency/update', {
          userId: user.id,
          companyName: agencyProfile.agencyName,
          bio: `Business Type: ${agencyProfile.businessType}. Pricing: ${agencyProfile.pricingModel}`
        });
      }

      // Refresh user data in context
      const { data: updatedUser } = await apiClient.get('/profile/me');
      updateUser(updatedUser as any);

      // Local store update
      completeOnboarding();
      
      // Navigate based on role
      if (userRole === 'guide') router.push('/guide');
      else if (userRole === 'agency') router.push('/agency');
      else router.push('/dashboard');

    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to save onboarding data. Please try again.', 'Update Failed');
    }

  };

  // Tourist Steps
  const touristSteps = [
    {
      id: 0,
      title: "What do you love?",
      description: "Pick your interests so we can personalize your Sri Lankan adventure.",
      component: (
        <InterestsForm 
          selectedInterests={interests} 
          onChange={(newInterests) => updateData({ interests: newInterests })}
        />
      ),
    },
    {
      id: 1,
      title: "What's your budget?",
      description: "Don't worry, we have something for everyone.",
      component: (
        <BudgetForm 
          selectedBudget={budget}
          onChange={(newBudget) => updateData({ budget: newBudget })}
        />
      ),
    },
    {
      id: 2,
      title: "How long is the trip?",
      description: "Tell us your duration to find the perfect itinerary.",
      component: (
        <DurationForm 
          selectedDuration={travelDuration}
          onChange={(duration) => updateData({ travelDuration: duration })}
        />
      ),
    },
    {
      id: 3,
      title: "Where to start?",
      description: "Pick a region that catches your eye.",
      component: (
        <LocationForm 
          selectedLocation={preferredLocation}
          onChange={(location) => updateData({ preferredLocation: location })}
        />
      ),
    },
  ];

  // Guide Steps
  const guideSteps = [
    {
      id: 0,
      title: "Your Profile",
      description: "Tell travelers who you are and why they should book with you.",
      component: <GuideFlow data={guideProfile} setData={updateGuideData} step={0} />,
    },
    {
      id: 1,
      title: "Add a Trip",
      description: "Create your first experience to share with the world.",
      component: <GuideFlow data={guideProfile} setData={updateGuideData} step={1} />,
    },
    {
      id: 2,
      title: "Set Pricing",
      description: "Choose a fair price for your amazing expertise.",
      component: <GuideFlow data={guideProfile} setData={updateGuideData} step={2} />,
    },
  ];

  // Agency Steps
  const agencySteps = [
    {
      id: 0,
      title: "Business Details",
      description: "Let's get your agency registered and ready.",
      component: <AgencyFlow data={agencyProfile} setData={updateAgencyData} step={0} />,
    },
    {
      id: 1,
      title: "Listing Status",
      description: "Ready to showcase your tour packages?",
      component: <AgencyFlow data={agencyProfile} setData={updateAgencyData} step={1} />,
    },
    {
      id: 2,
      title: "Choose Plan",
      description: "Pick the best way to grow your business.",
      component: <AgencyFlow data={agencyProfile} setData={updateAgencyData} step={2} />,
    },
  ];

  // Logic to determine if current step is valid
  const isStepValid = () => {
    if (userRole === 'tourist') {
      if (onboardingStep === 0) return interests.length > 0;
      if (onboardingStep === 1) return budget !== '';
      if (onboardingStep === 2) return travelDuration !== '';
      if (onboardingStep === 3) return preferredLocation !== '';
    }
    if (userRole === 'guide') {
        // Simple validation for guide
        if (onboardingStep === 0) return guideProfile.fullName !== '';
        return true;
    }
    if (userRole === 'agency') {
        // Simple validation for agency
        if (onboardingStep === 0) return agencyProfile.agencyName !== '';
        return true;
    }
    return true;
  };

  const getSteps = () => {
    if (userRole === 'tourist') return touristSteps;
    if (userRole === 'guide') return guideSteps;
    if (userRole === 'agency') return agencySteps;
    return [];
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-12 sm:pt-32">
      <TranslateBanner />
      
      <Joyride
        steps={tourSteps}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            primaryColor: '#0ea5e9',
          },
        }}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {!userRole ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="mb-12 role-selection-title">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-black uppercase tracking-widest mb-4">
                  Welcome to SriGuide
                </span>
                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                  How will you use <br />
                  <span className="text-sky-600">SriGuide?</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                  We'll customize your experience based on your role. <br className="hidden sm:block" />
                  You can always change this later in your settings.
                </p>
              </div>

              <RoleSelector 
                selectedRole={userRole} 
                onSelect={(role) => {
                  setUserRole(role);
                  setStep(0);
                }} 
              />

              <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">10k+ Travelers</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="onboarding-stepper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OnboardingStepper 
                steps={getSteps()} 
                onComplete={handleComplete}
                isStepValid={isStepValid()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <HelpDrawer 
          title="Onboarding Help"
          description="Stuck? We're here to help you get started with SriGuide."
          items={[
            { title: "Choosing a Role", description: "Learn about the differences between Tourist, Guide, and Agency.", category: "general" },
            { title: "Personalization", description: "How we use your interests to show you the best content.", category: "general" },
            { title: "Privacy", description: "Your data is safe with us. Read our privacy policy.", category: "general" },
          ]}
          trigger={
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-900 font-bold rounded-full shadow-lg hover:bg-slate-50 transition-all group help-center-button">
              <HelpCircle className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
              <span>Help Center</span>
            </button>
          }
        />
      </div>
    </main>
  );
}
