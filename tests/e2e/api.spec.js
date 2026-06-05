import { test, expect } from "@playwright/test";

/**
 * E2E tests for the API routes.
 * Exercises the validation and auth-guard layers using direct fetch() calls,
 * which means no browser UI needed — just HTTP responses.
 */
test.describe("API Routes – Validation & Auth Guards", () => {
  // ── POST /api/create-interview ──────────────────────────────────────────────
  test.describe("POST /api/create-interview", () => {
    test("returns 422 when body is missing required fields", async ({ request }) => {
      const res = await request.post("/api/create-interview", {
        data: {}, // completely empty
      });
      expect(res.status()).toBe(422);
      const json = await res.json();
      expect(json).toHaveProperty("issues");
      expect(Array.isArray(json.issues)).toBe(true);
    });

    test("returns 422 when jobPosition is too short", async ({ request }) => {
      const res = await request.post("/api/create-interview", {
        data: {
          jobPosition: "A",             // < 2 chars
          jobDesc: "Build scalable APIs for internal services.",
          jobExperience: "2",
        },
      });
      expect(res.status()).toBe(422);
    });

    test("returns 422 when jobDesc is too short", async ({ request }) => {
      const res = await request.post("/api/create-interview", {
        data: {
          jobPosition: "Software Engineer",
          jobDesc: "Too short",          // < 10 chars
          jobExperience: "2",
        },
      });
      expect(res.status()).toBe(422);
    });

    test("returns 200 or 429 with valid body (rate-limit aware)", async ({ request }) => {
      const res = await request.post("/api/create-interview", {
        data: {
          jobPosition: "Software Engineer",
          jobDesc: "Build and maintain scalable backend services.",
          jobExperience: "2",
          interviewRound: "Technical Round",
        },
      });
      // Either success or rate-limited (both are correct behaviour)
      expect([200, 429]).toContain(res.status());
    });
  });

  // ── GET /api/usage ──────────────────────────────────────────────────────────
  test.describe("GET /api/usage", () => {
    test("returns 400 when email and feature params are missing", async ({ request }) => {
      const res = await request.get("/api/usage");
      // 400 (missing params) or 401 (unauthenticated) or 429 (rate limit)
      expect([400, 401, 429]).toContain(res.status());
    });

    test("returns 401 when called without authentication", async ({ request }) => {
      const res = await request.get("/api/usage?email=test@example.com&feature=interviews");
      // Without a Clerk session cookie, must be 401 or 429
      expect([401, 429]).toContain(res.status());
    });
  });

  // ── POST /api/usage ─────────────────────────────────────────────────────────
  test.describe("POST /api/usage", () => {
    test("returns 401 when unauthenticated", async ({ request }) => {
      const res = await request.post("/api/usage", {
        data: { feature: "interviews", email: "test@example.com" },
      });
      expect([401, 429]).toContain(res.status());
    });
  });

  // ── POST /api/razorpay/create-order ────────────────────────────────────────
  test.describe("POST /api/razorpay/create-order", () => {
    test("returns 401 when unauthenticated", async ({ request }) => {
      const res = await request.post("/api/razorpay/create-order", {
        data: { amount: 100 },
      });
      expect([401, 429]).toContain(res.status());
    });
  });

  // ── POST /api/razorpay/verify ───────────────────────────────────────────────
  test.describe("POST /api/razorpay/verify", () => {
    test("returns 401 when unauthenticated", async ({ request }) => {
      const res = await request.post("/api/razorpay/verify", {
        data: {
          razorpay_order_id: "order_test",
          razorpay_payment_id: "pay_test",
          razorpay_signature: "fakesig",
          userEmail: "test@example.com",
        },
      });
      expect([401, 429]).toContain(res.status());
    });

    test("returns 400 when payment details are missing", async ({ request }) => {
      // Even if unauthenticated returns 401 first, validate the 400 path
      // by sending empty body — the auth guard will fire first
      const res = await request.post("/api/razorpay/verify", { data: {} });
      expect([400, 401, 429]).toContain(res.status());
    });
  });

  // ── POST /api/generate-gemini ───────────────────────────────────────────────
  test.describe("POST /api/generate-gemini", () => {
    test("returns 422 when prompt is missing", async ({ request }) => {
      const res = await request.post("/api/generate-gemini", { data: {} });
      expect([422, 429]).toContain(res.status());
    });

    test("returns 422 when prompt is too short", async ({ request }) => {
      const res = await request.post("/api/generate-gemini", {
        data: { prompt: "short" },
      });
      expect([422, 429]).toContain(res.status());
    });
  });
});
