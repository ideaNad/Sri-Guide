import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Comfortaa } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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

export const metadata: Metadata = {
  title: "SriGuide — Discover Sri Lanka with Expert Local Guides",
  description: "Find certified local guides, explore curated tours and travel the authentic Sri Lanka.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.variable} ${comfortaa.variable} antialiased selection:bg-primary selection:text-white font-jakarta`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
