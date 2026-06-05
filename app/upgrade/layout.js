// app/upgrade/layout.js
// Server Component: exports metadata for the /upgrade route.
// The actual page.jsx stays 'use client' for Razorpay + Clerk hooks.

export const metadata = {
  title: 'Pricing – Upgrade to Placify AI Pro | Lifetime Access for ₹100',
  description:
    'Upgrade to Placify AI Pro for just ₹100 – one-time, lifetime access. Get unlimited AI mock interviews, resume analyses, skill gap reports, and coding challenges.',
  keywords: ['AI interview prep pricing', 'mock interview subscription', 'interview prep lifetime deal', 'Placify AI Pro'],
  alternates: { canonical: 'https://www.placifyai.com/upgrade' },
  openGraph: {
    title: 'Upgrade to Placify AI Pro – Lifetime Access for ₹100',
    description: 'One-time payment. Unlimited AI interviews, resume analysis, coding challenges, and more. No recurring fees.',
    url: 'https://www.placifyai.com/upgrade',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Placify AI Pro – ₹100 Lifetime Deal',
    description: 'Unlimited AI mock interviews and resume analysis for just ₹100. One-time payment, lifetime access.',
    images: ['/og-image.png'],
  },
};

export default function UpgradeLayout({ children }) {
  return children;
}
