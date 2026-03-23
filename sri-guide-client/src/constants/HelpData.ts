export interface HelpItem {
  title: string;
  description: string;
  category: 'general' | 'tourist' | 'guide' | 'agency';
  content?: string;
}

export const HELP_ITEMS: HelpItem[] = [
  // General
  {
    category: 'general',
    title: 'What is SriGuide?',
    description: 'Learn about our platform and how we help travelers explore Sri Lanka.',
    content: 'SriGuide is a comprehensive travel platform dedicated to showcasing the beauty of Sri Lanka. We connect travelers with professional guides and travel agencies to ensure an unforgettable experience.'
  },
  {
    category: 'general',
    title: 'Contact Support',
    description: 'Reach out to our team for any inquiries or issues.',
    content: 'You can contact us via email at sriguidecontact@gmail.com or call us at +94 76 414 9630. Our office is located at 123 Galle Road, Colombo 03, Sri Lanka.'
  },
  
  // Tourist
  {
    category: 'tourist',
    title: 'How to book a tour?',
    description: 'Step-by-step guide on finding and booking your perfect tour.',
    content: '1. Browse our collection of tours.\n2. Select a tour that interests you.\n3. Click the "Book Now" button.\n4. Follow the prompts to complete your booking and payment.'
  },
  {
    category: 'tourist',
    title: 'Payment Methods',
    description: 'Understand the different ways you can pay for your bookings.',
    content: 'We support major credit/debit cards (Visa, MasterCard, Amex) and various online payment gateways to ensure secure and convenient transactions.'
  },
  {
    category: 'tourist',
    title: 'Cancellation Policy',
    description: 'Find out how to cancel a booking and what the refund terms are.',
    content: 'Cancellation policies vary by tour and provider. Generally, cancellations made 48 hours before the tour are eligible for a full refund. Please check the specific terms on the tour detail page before booking.'
  },
  {
    category: 'tourist',
    title: 'Traveling with Kids',
    description: 'Important information for families traveling with children.',
    content: 'Many of our tours are family-friendly. Please check the "Suitability" section of each tour for age recommendations and special child rates.'
  },

  // Guide
  {
    category: 'guide',
    title: 'Become a Guide',
    description: 'Join our community of professional guides and share your expertise.',
    content: 'To become a guide, sign up and complete your profile. You will need to provide your professional certifications, ID, and experience details for our verification team.'
  },
  {
    category: 'guide',
    title: 'Managing Your Tours',
    description: 'Learn how to create, update, and manage your tour listings.',
    content: 'Access your Guide Dashboard to add new tours, upload stunning photos, update pricing, and manage your incoming bookings in real-time.'
  },
  {
    category: 'guide',
    title: 'Payout Schedule',
    description: 'When and how you will receive your earnings.',
    content: 'Payouts are processed weekly. You can track your earnings and withdrawal history directly from your dashboard settings.'
  },

  // Agency
  {
    category: 'agency',
    title: 'Registering as an Agency',
    description: 'Register your travel agency to reach a wider audience.',
    content: 'Agencies can register by providing their business registration details and tourism licenses. Once verified, you can start listing your tours and adventures under your agency brand.'
  },
  {
    category: 'agency',
    title: 'Agency Dashboard Features',
    description: 'Overview of the tools available for travel agencies.',
    content: 'The Agency Dashboard provides comprehensive tools for managing multiple tours, tracking performance analytics, and handling large-scale bookings for groups.'
  },
  {
    category: 'agency',
    title: 'Bulk Pricing & Discounts',
    description: 'Setting up special rates for larger groups.',
    content: 'Agencies can configure tiered pricing and early-bird discounts to attract more bookings and manage seasonal demand effectively.'
  }
];

export const CONTACT_INFO = {
  email: 'sriguidecontact@gmail.com',
  phone: '+94 76 414 9630',
  address: '123 Galle Road, Colombo 03, Sri Lanka',
  whatsapp: '+94764149630'
};
