/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DRIZZLE_DB_URL: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT: process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT,
    NEXT_PUBLIC_INFORMATION: process.env.NEXT_PUBLIC_INFORMATION,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;