export const metadata = {
  title: 'About Placify AI – Our Mission to Democratize Interview Prep',
  description: 'Learn about Placify AI – the team behind the AI-powered interview preparation platform. Our mission is to make world-class career coaching accessible to everyone.',
  alternates: { canonical: 'https://www.placifyonline.co.in/about' },
  openGraph: {
    title: 'About Placify AI – Our Mission to Democratize Interview Prep',
    description: 'Meet the team building Placify AI. We help every job seeker land their dream role using AI-powered interview coaching.',
    url: 'https://www.placifyonline.co.in/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'About Placify AI', images: ['/og-image.png'] },
};
export default function Layout({ children }) { return children; }
