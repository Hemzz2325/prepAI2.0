export const metadata = {
  title: 'Blog – Interview Tips, Career Advice & AI Insights | Placify AI',
  description: 'Read expert tips on cracking FAANG interviews, writing a winning resume, salary negotiation, DSA patterns, and more. Fresh career advice from the Placify AI team.',
  keywords: ['interview tips', 'career advice', 'FAANG interview', 'resume tips', 'DSA patterns', 'salary negotiation'],
  alternates: { canonical: 'https://www.placifyai.com/blog' },
  openGraph: {
    title: 'Placify AI Blog – Interview Tips & Career Advice',
    description: 'Expert insights on cracking interviews, resume writing, system design, salary negotiation, and more.',
    url: 'https://www.placifyai.com/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Placify AI Blog', images: ['/og-image.png'] },
};
export default function Layout({ children }) { return children; }
