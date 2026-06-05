import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { UserSubscription, UserUsage } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { PLAN_LIMITS } from "@/lib/planLimits";
import { applyRateLimit } from "@/lib/ratelimit";

// Get current ISO week key e.g. "2025-W16"
function getWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * GET /api/usage?feature=interviews
 * Returns: { plan, used, limit, allowed }
 */
export async function GET(req) {
  const rateLimitRes = await applyRateLimit(req);
  if (rateLimitRes) return rateLimitRes;

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("email");
  const feature = searchParams.get("feature");

  if (!userEmail || !feature) {
    return NextResponse.json({ error: "email and feature required" }, { status: 400 });
  }

  const weekKey = getWeekKey();

  // Get user plan
  const subRows = await db
    .select()
    .from(UserSubscription)
    .where(eq(UserSubscription.userEmail, userEmail))
    .limit(1);

  const plan = subRows[0]?.plan === "pro" ? "pro" : "free";
  const limit = PLAN_LIMITS[plan][feature];

  // Get weekly usage
  const usageRows = await db
    .select()
    .from(UserUsage)
    .where(
      and(
        eq(UserUsage.userEmail, userEmail),
        eq(UserUsage.feature, feature),
        eq(UserUsage.weekKey, weekKey)
      )
    )
    .limit(1);

  const used = usageRows[0]?.count ?? 0;
  const allowed = limit === Infinity || used < limit;

  return NextResponse.json({ plan, used, limit: limit === Infinity ? -1 : limit, allowed });
}

/**
 * POST /api/usage
 * Body: { feature, email }
 * Increments usage count by 1. Returns { allowed, used, limit }
 */
export async function POST(req) {
  const rateLimitRes = await applyRateLimit(req);
  if (rateLimitRes) return rateLimitRes;

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { feature, email } = body;
  if (!feature || !email) {
    return NextResponse.json({ error: "feature and email required" }, { status: 400 });
  }

  const weekKey = getWeekKey();

  // Get user plan
  const subRows = await db
    .select()
    .from(UserSubscription)
    .where(eq(UserSubscription.userEmail, email))
    .limit(1);

  const plan = subRows[0]?.plan === "pro" ? "pro" : "free";
  const limit = PLAN_LIMITS[plan][feature];

  // Get current usage
  const usageRows = await db
    .select()
    .from(UserUsage)
    .where(
      and(
        eq(UserUsage.userEmail, email),
        eq(UserUsage.feature, feature),
        eq(UserUsage.weekKey, weekKey)
      )
    )
    .limit(1);

  const currentCount = usageRows[0]?.count ?? 0;

  if (limit !== Infinity && currentCount >= limit) {
    return NextResponse.json(
      { allowed: false, used: currentCount, limit },
      { status: 403 }
    );
  }

  // Upsert usage
  if (usageRows.length > 0) {
    await db
      .update(UserUsage)
      .set({ count: currentCount + 1, updatedAt: new Date().toISOString() })
      .where(eq(UserUsage.id, usageRows[0].id));
  } else {
    await db.insert(UserUsage).values({
      userEmail: email,
      feature,
      weekKey,
      count: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    allowed: true,
    used: currentCount + 1,
    limit: limit === Infinity ? -1 : limit,
  });
}
