import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/ratelimit";
import { parseBody, createInterviewSchema } from "@/lib/validators";

export async function POST(req) {
  // 1. Rate Limiting
  const rateLimitResponse = await applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();

    // 2. Zod Validation
    const validation = parseBody(createInterviewSchema, body);
    if (validation.error) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.issues },
        { status: 422 }
      );
    }

    const mock_id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    return NextResponse.json({ success: true, mock_id }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Server error", detail: e?.message ?? "" },
      { status: 500 }
    );
  }
}
