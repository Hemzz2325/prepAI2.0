import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.placifyai.com";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Placify AI – AI-Powered Mock Interview & Career Prep Platform",
    template: "%s | Placify AI",
  },
  description:
    "Placify AI is your personal AI interview coach. Practice mock interviews, get instant AI feedback, analyze your resume, identify skill gaps, and land your dream job faster.",
  keywords: [
    "AI mock interview",
    "interview preparation",
    "AI interview coach",
    "resume analyzer",
    "skill gap analysis",
    "coding interview practice",
    "job interview tips",
    "AI career coach",
    "Placify AI",
    "interview feedback",
    "HR round practice",
    "technical interview prep",
  ],
  authors: [{ name: "Placify AI Team", url: BASE_URL }],
  creator: "Placify AI",
  publisher: "Placify AI",
  category: "Education, Career, AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Placify AI",
    title: "Placify AI – AI-Powered Mock Interview & Career Prep Platform",
    description:
      "Practice mock interviews with AI, get instant feedback, analyze your resume, and crack your next job interview. Free to start.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Placify AI – AI-Powered Interview Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@placifyai",
    creator: "@placifyai",
    title: "Placify AI – AI-Powered Mock Interview & Career Prep Platform",
    description:
      "Practice mock interviews with AI, get instant feedback, analyze your resume, and crack your next job interview. Free to start.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your Google Search Console verification token here when available
    // google: "your-google-verification-code",
  },
};

import Footer from "./_components/Footer";
import { ThemeProvider, AnalyticsProvider } from "./providers";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AnalyticsProvider>
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </AnalyticsProvider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast: 'dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100',
                }
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
