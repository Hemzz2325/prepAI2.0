import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/ratelimit";
import { parseBody, promptSchema } from "@/lib/validators";

export async function POST(req) {
  // 1. Rate Limiting
  const rateLimitResponse = await applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();

    // 2. Zod Validation
    const validation = parseBody(promptSchema, body);
    if (validation.error) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.issues },
        { status: 422 }
      );
    }

    const { prompt } = validation.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key configuration error" },
        { status: 500 }
      );
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return NextResponse.json(
        { error: "Gemini API request failed", details: data, statusCode: geminiRes.status },
        { status: geminiRes.status }
      );
    }

    if (!data.candidates?.[0]?.content) {
      return NextResponse.json(
        { error: "Invalid response from Gemini API", details: data },
        { status: 500 }
      );
    }

    const textContent = data.candidates[0].content.parts.map((p) => p.text).join("");

    return NextResponse.json({ ok: true, status: 200, data: textContent }, { status: 200 });
  } catch (error) {
    console.error("Server error in generate-gemini:", error);
    return NextResponse.json(
      {
        error: "Server crashed",
        detail: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}