// app/sitemap.js
// Automatically generates /sitemap.xml for search engine crawlers

const BASE_URL = "https://www.placifyonline.co.in";

export default function sitemap() {
  const now = new Date().toISOString();

  const staticRoutes = [
    { url: "/",              priority: 1.0,  changeFrequency: "weekly"  },
    { url: "/upgrade",       priority: 0.9,  changeFrequency: "monthly" },
    { url: "/how-it-works",  priority: 0.8,  changeFrequency: "monthly" },
    { url: "/about",         priority: 0.7,  changeFrequency: "monthly" },
    { url: "/blog",          priority: 0.8,  changeFrequency: "weekly"  },
    { url: "/careers",       priority: 0.6,  changeFrequency: "monthly" },
    { url: "/contact",       priority: 0.6,  changeFrequency: "yearly"  },
    { url: "/privacy",       priority: 0.3,  changeFrequency: "yearly"  },
    { url: "/terms",         priority: 0.3,  changeFrequency: "yearly"  },
    { url: "/cookies",       priority: 0.3,  changeFrequency: "yearly"  },
  ];

  return staticRoutes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
