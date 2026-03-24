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
    content: 'You can contact us via email at sriguidecontact@gmail.com or call us at +94 76 414 9630. Our office is located at Kaluthara South, Sri Lanka, 12000.'
  },

  // Tourist
  {
    category: 'tourist',
    title: 'How to Send an Inquiry?',
    description: 'Directly contact support or guides for your travel questions.',
    content: 'Browse any tour or visit our "Contact Us" page to send a message. Our support team or the relevant guide will respond to your queries within 24 hours.'
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
    title: 'Creating Tours',
    description: 'Learn how to list your professional tour experiences.',
    content: 'Navigate to your Guide Dashboard and select "Create Tour". Provide a catchy title, detailed description, high-quality images, and set your pricing to start receiving bookings.'
  },
  {
    category: 'guide',
    title: 'Sharing Adventures',
    description: 'Showcase your latest journeys through trips.',
    content: 'Guides can share their latest travel stories and photos as "Recent Adventures" (Trips) directly through their profile to build trust and attract more tourists.'
  },
  {
    category: 'guide',
    title: 'How to Verify?',
    description: 'Get your professional account verified by our team.',
    content: 'Go to your profile settings and upload your ID and professional certifications. Our admin team will review your documents to grant you a verified status badge.'
  },

  // Agency
  {
    category: 'agency',
    title: 'How to Upgrade to Agency?',
    description: 'Scale your business by becoming a registered travel agency.',
    content: 'Registered guides can apply for Agency status in the dashboard by providing business registration details. Once approved, you can manage a team of guides and list multi-day packages.'
  },
  {
    category: 'agency',
    title: 'Agency Dashboard Features',
    description: 'Overview of the tools available for travel agencies.',
    content: 'The Agency Dashboard provides comprehensive tools for managing multiple tours, tracking performance analytics, and handling large-scale bookings for groups.'
  }
];

export const CONTACT_INFO = {
  email: 'sriguidecontact@gmail.com',
  phone: '+94 76 414 9630',
  address: 'Kaluthara South, Sri Lanka, 12000',
  whatsapp: '+94764149630'
};
