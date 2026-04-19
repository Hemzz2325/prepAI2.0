import PostHog from "posthog-js";

let posthogInstance = null;

export function getPostHogClient() {
  if (typeof window === "undefined") return null;
  if (posthogInstance) return posthogInstance;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!key) {
    console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY is not set. Analytics disabled.");
    return null;
  }

  PostHog.init(key, {
    api_host: host,
    capture_pageview: false, // We capture it manually via the provider
    persistence: "localStorage",
  });

  posthogInstance = PostHog;
  return posthogInstance;
}
