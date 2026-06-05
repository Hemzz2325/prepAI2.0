/**
 * Unit tests for lib/planLimits.js
 *
 * Verifies the plan limit constants are correct and that the
 * getWeekKey() utility (extracted from usage/route.js) produces
 * a properly formatted ISO week string.
 */
import { describe, it, expect } from "vitest";
import { PLAN_LIMITS } from "../../lib/planLimits.js";

// ─── PLAN_LIMITS structure ────────────────────────────────────────────────────
describe("PLAN_LIMITS", () => {
  const FEATURES = [
    "interviews",
    "resumeAnalyses",
    "codingChallenges",
    "skillGapAnalyses",
    "communicationSessions",
    "jobTracker",
  ];

  it("has both 'free' and 'pro' tiers", () => {
    expect(PLAN_LIMITS).toHaveProperty("free");
    expect(PLAN_LIMITS).toHaveProperty("pro");
  });

  it("free tier defines all 6 features", () => {
    FEATURES.forEach((f) => {
      expect(PLAN_LIMITS.free).toHaveProperty(f);
    });
  });

  it("pro tier defines all 6 features", () => {
    FEATURES.forEach((f) => {
      expect(PLAN_LIMITS.pro).toHaveProperty(f);
    });
  });

  it("free tier: interviews limit is 3", () => {
    expect(PLAN_LIMITS.free.interviews).toBe(3);
  });

  it("free tier: resumeAnalyses limit is 2", () => {
    expect(PLAN_LIMITS.free.resumeAnalyses).toBe(2);
  });

  it("free tier: codingChallenges limit is 2", () => {
    expect(PLAN_LIMITS.free.codingChallenges).toBe(2);
  });

  it("free tier: skillGapAnalyses limit is 2", () => {
    expect(PLAN_LIMITS.free.skillGapAnalyses).toBe(2);
  });

  it("free tier: communicationSessions limit is 2", () => {
    expect(PLAN_LIMITS.free.communicationSessions).toBe(2);
  });

  it("free tier: jobTracker is unlimited (Infinity)", () => {
    expect(PLAN_LIMITS.free.jobTracker).toBe(Infinity);
  });

  it("pro tier: all features are unlimited (Infinity)", () => {
    FEATURES.forEach((f) => {
      expect(PLAN_LIMITS.pro[f]).toBe(Infinity);
    });
  });

  it("free limits are finite numbers (not Infinity) except jobTracker", () => {
    const finiteFree = FEATURES.filter((f) => f !== "jobTracker");
    finiteFree.forEach((f) => {
      expect(Number.isFinite(PLAN_LIMITS.free[f])).toBe(true);
    });
  });

  it("all free limits are positive integers", () => {
    FEATURES.forEach((f) => {
      const v = PLAN_LIMITS.free[f];
      expect(v === Infinity || (Number.isInteger(v) && v > 0)).toBe(true);
    });
  });
});

// ─── getWeekKey utility ───────────────────────────────────────────────────────
/**
 * We inline the function here because it is not exported from route.js.
 * Tests verify the format and weekly-reset boundary behaviour.
 */
function getWeekKey(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((date - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

describe("getWeekKey", () => {
  it("returns a string matching YYYY-WNN format", () => {
    const key = getWeekKey();
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });

  it("pads single-digit week numbers with a leading zero", () => {
    // January 3rd is always week 01 or 02 depending on year, never double-digit start
    const jan3 = new Date(2025, 0, 3); // Jan 3 2025
    const key = getWeekKey(jan3);
    expect(key).toMatch(/-W0\d$/);
  });

  it("returns the same key for two dates in the same week", () => {
    // Use two dates that are unambiguously in the same calendar week
    // for this algorithm (both in the same 7-day window from Jan 1)
    const dayA = new Date(2025, 0, 15); // Jan 15 2025 (Wednesday)
    const dayB = new Date(2025, 0, 17); // Jan 17 2025 (Friday) — same week
    expect(getWeekKey(dayA)).toBe(getWeekKey(dayB));
  });

  it("returns different keys for dates in different weeks", () => {
    const week1 = new Date(2025, 0, 6);  // Jan 6
    const week2 = new Date(2025, 0, 13); // Jan 13
    expect(getWeekKey(week1)).not.toBe(getWeekKey(week2));
  });

  it("returns different keys for the same date in different years", () => {
    const y2024 = new Date(2024, 5, 2);
    const y2025 = new Date(2025, 5, 2);
    expect(getWeekKey(y2024)).not.toBe(getWeekKey(y2025));
  });

  it("year in the key matches the date's year", () => {
    const date = new Date(2026, 3, 15); // April 15, 2026
    const key = getWeekKey(date);
    expect(key.startsWith("2026-")).toBe(true);
  });
});

// ─── plan resolution logic ────────────────────────────────────────────────────
describe("plan resolution (as used in usage/route.js)", () => {
  // Mirror the logic from route.js: subRows[0]?.plan === "pro" ? "pro" : "free"
  function resolvePlan(subRows) {
    return subRows[0]?.plan === "pro" ? "pro" : "free";
  }

  it("resolves to 'pro' when subscription row has plan='pro'", () => {
    expect(resolvePlan([{ plan: "pro" }])).toBe("pro");
  });

  it("resolves to 'free' when subscription row has plan='free'", () => {
    expect(resolvePlan([{ plan: "free" }])).toBe("free");
  });

  it("resolves to 'free' when subscription rows are empty (no record)", () => {
    expect(resolvePlan([])).toBe("free");
  });

  it("resolves to 'free' when plan is an unexpected value", () => {
    expect(resolvePlan([{ plan: "enterprise" }])).toBe("free");
  });

  it("pro plan has Infinity limit for 'interviews'", () => {
    const plan = resolvePlan([{ plan: "pro" }]);
    expect(PLAN_LIMITS[plan].interviews).toBe(Infinity);
  });

  it("free plan has finite limit for 'interviews'", () => {
    const plan = resolvePlan([]);
    expect(Number.isFinite(PLAN_LIMITS[plan].interviews)).toBe(true);
  });

  // Mirror: allowed = limit === Infinity || used < limit
  function isAllowed(limit, used) {
    return limit === Infinity || used < limit;
  }

  it("allows access when usage is below the free limit", () => {
    expect(isAllowed(PLAN_LIMITS.free.interviews, 2)).toBe(true);
  });

  it("blocks access when usage equals the free limit", () => {
    expect(isAllowed(PLAN_LIMITS.free.interviews, 3)).toBe(false);
  });

  it("blocks access when usage exceeds the free limit", () => {
    expect(isAllowed(PLAN_LIMITS.free.interviews, 5)).toBe(false);
  });

  it("always allows access for pro plan (Infinity limit)", () => {
    expect(isAllowed(Infinity, 9999)).toBe(true);
  });
});
