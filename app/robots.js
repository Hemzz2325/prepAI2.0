// app/robots.js
// Automatically generates /robots.txt for search engine crawlers and AI bots

const BASE_URL = "https://www.placifyonline.co.in";

export default function robots() {
  return {
    rules: [
      {
        // Standard search engines
        userAgent: "*",
        allow: ["/", "/upgrade", "/how-it-works", "/about", "/blog", "/careers", "/contact", "/privacy", "/terms", "/cookies"],
        disallow: ["/dashboard", "/admin", "/api/", "/_next/", "/sign-in", "/sign-up"],
      },
      {
        // ChatGPT crawler (OpenAI) — allow all public pages
        userAgent: "OAI-SearchBot",
        allow: ["/", "/upgrade", "/how-it-works", "/about", "/blog", "/careers", "/contact"],
        disallow: ["/dashboard", "/admin", "/api/"],
      },
      {
        // Claude crawler (Anthropic)
        userAgent: "ClaudeBot",
        allow: ["/", "/upgrade", "/how-it-works", "/about", "/blog", "/careers", "/contact"],
        disallow: ["/dashboard", "/admin", "/api/"],
      },
      {
        // Perplexity AI crawler
        userAgent: "PerplexityBot",
        allow: ["/", "/upgrade", "/how-it-works", "/about", "/blog", "/careers", "/contact"],
        disallow: ["/dashboard", "/admin", "/api/"],
      },
      {
        // GPTBot (OpenAI training crawler)
        userAgent: "GPTBot",
        allow: ["/", "/upgrade", "/how-it-works", "/about", "/blog", "/careers", "/contact"],
        disallow: ["/dashboard", "/admin", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
