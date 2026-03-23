import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Comfortaa } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthContext";
import CookieConsent from "@/components/layout/CookieConsent";
import Script from "next/script";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | SriGuide",
    default: "SriGuide — Discover Sri Lanka with Expert Local Guides",
  },
  description: "Experience the authentic Sri Lanka. Find certified local guides, discover curated tours, hidden adventures, and high-quality agency listings including hotels and vehicles.",
  keywords: ["tourism", "Sri Lanka travel", "local guides Sri Lanka", "Sri Lanka tours", "adventure Sri Lanka", "hotels Sri Lanka", "safari tours", "Galle guides", "Kandy tours"],
  authors: [{ name: "SriGuide Team" }],
  creator: "SriGuide",
  publisher: "SriGuide",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.sriguide.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SriGuide — Discover Sri Lanka with Expert Local Guides",
    description: "Experience the authentic Sri Lanka. Find certified local guides, discover curated tours, and hidden adventures.",
    url: "https://www.sriguide.com",
    siteName: "SriGuide",
    images: [
      {
        url: "/share-image.jpg",
        width: 1200,
        height: 630,
        alt: "SriGuide - Discover Sri Lanka",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SriGuide — Discover Sri Lanka with Expert Local Guides",
    description: "Experience the authentic Sri Lanka. Find certified local guides and discover curated tours.",
    images: ["/share-image.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { ToastContainer } from "@/components/ui/Toast";
import { ConfirmBottomSheet } from "@/components/ui/ConfirmBottomSheet";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${jakarta.variable} ${comfortaa.variable} antialiased selection:bg-primary selection:text-white font-jakarta`}>
        <AuthProvider>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-RB3LFLMMSP"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-RB3LFLMMSP');
            `}
          </Script>
          {children}
          <CookieConsent />
          <ToastContainer />
          <ConfirmBottomSheet />
        </AuthProvider>
      </body>
    </html>
  );
}
