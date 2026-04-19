import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a shared rate limiter: 10 requests per 60 seconds per IP (sliding window)
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "@prepai/ratelimit",
});

/**
 * Helper to apply rate limiting inside any Next.js route handler.
 * Returns a 429 NextResponse if the limit is exceeded, otherwise returns null.
 */
export async function applyRateLimit(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    const { NextResponse } = await import("next/server");
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down.",
        limit,
        remaining,
        reset,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    );
  }

  return null; // no rate limit exceeded → proceed normally
}
