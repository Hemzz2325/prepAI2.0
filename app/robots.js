// app/robots.js
// Automatically generates /robots.txt for search engine crawlers

const BASE_URL = "https://www.placifyai.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/upgrade", "/how-it-works", "/about", "/blog", "/careers", "/contact", "/privacy", "/terms", "/cookies"],
        disallow: ["/dashboard", "/admin", "/api/", "/_next/", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
