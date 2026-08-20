// Server component — exports metadata for Google
// The actual interactive UI is in HomeClient.jsx (client component)

import HomeClient from "./_components/HomeClient";

export const metadata = {
  title: "Placify AI – Free AI Mock Interview & Career Prep Platform",
  description:
    "Placify AI is India's free AI-powered mock interview platform. Practice technical, HR, and aptitude rounds, get instant AI feedback, analyze your resume for ATS score, and crack your next job interview. No credit card needed.",
  keywords: [
    "Placify AI",
    "placify ai mock interview",
    "free AI mock interview India",
    "AI interview preparation",
    "resume ATS checker free",
    "interview practice tool",
    "coding interview practice AI",
    "skill gap analysis free",
    "job preparation app India",
    "campus placement preparation",
  ],
  alternates: {
    canonical: "https://www.placifyonline.co.in/",
  },
  openGraph: {
    title: "Placify AI – Free AI Mock Interview & Career Prep Platform",
    description:
      "Practice mock interviews with AI, get instant feedback, analyze your resume for ATS score, and crack your next job interview. Free to start.",
    url: "https://www.placifyonline.co.in/",
    siteName: "Placify AI",
    images: [
      {
        url: "https://www.placifyonline.co.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Placify AI – AI Mock Interview Platform",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Placify AI – Free AI Mock Interview & Career Prep",
    description:
      "Practice mock interviews with AI, get instant feedback, analyze your resume, and crack your next job interview. Free to start.",
    images: ["https://www.placifyonline.co.in/og-image.png"],
  },
};

// JSON-LD Structured Data for Google rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.placifyonline.co.in/#website",
      url: "https://www.placifyonline.co.in",
      name: "Placify AI",
      description: "AI-powered mock interview and career preparation platform for students and job seekers in India",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.placifyonline.co.in/blog?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://www.placifyonline.co.in/#organization",
      name: "Placify AI",
      url: "https://www.placifyonline.co.in",
      logo: {
        "@type": "ImageObject",
        url: "https://www.placifyonline.co.in/logo.svg",
        width: 200,
        height: 60,
      },
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@placifyonline.com",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: "English",
      },
      foundingDate: "2025",
      description: "Placify AI provides AI-powered mock interview practice, resume ATS analysis, skill gap detection, and job tracking for Indian students and job seekers.",
    },
    {
      "@type": "SoftwareApplication",
      name: "Placify AI",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: "https://www.placifyonline.co.in",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free plan available. Pro plan for unlimited access.",
      },
      description:
        "Practice mock interviews with AI, get instant feedback on your answers, analyze your resume for ATS score, identify skill gaps, and track job applications.",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1200",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "AI Mock Interview Practice",
        "Resume ATS Score Analyzer",
        "Skill Gap Analysis",
        "Coding Challenge Practice",
        "Job Application Tracker",
        "Communication Training",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Placify AI free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Placify AI has a free plan that lets you practice mock interviews, analyze your resume, and more every week. A Pro plan is available for unlimited access.",
          },
        },
        {
          "@type": "Question",
          name: "What is Placify AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Placify AI is an AI-powered career preparation platform for students and job seekers in India. It offers AI mock interviews, resume ATS analysis, skill gap detection, coding challenge practice, and job application tracking.",
          },
        },
        {
          "@type": "Question",
          name: "How does Placify AI help with interview preparation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Placify AI generates realistic interview questions based on your target job and experience level, records your answers, provides instant AI feedback, and gives you a performance score to help you improve.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
