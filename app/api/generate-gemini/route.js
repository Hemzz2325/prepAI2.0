import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/ratelimit";
import { parseBody, promptSchema } from "@/lib/validators";

export async function POST(req) {
  // 1. Rate Limiting
  const rateLimitResponse = await applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // 2. Zod Validation
    const validation = parseBody(promptSchema, body);
    if (validation.error) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.issues },
        { status: 422 }
      );
    }

    const { prompt } = validation.data;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key configuration error" },
        { status: 500 }
      );
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return NextResponse.json(
        { error: "Groq API request failed", details: data, statusCode: groqRes.status },
        { status: groqRes.status }
      );
    }

    const textContent = data.choices?.[0]?.message?.content;
    if (!textContent) {
      return NextResponse.json(
        { error: "Invalid response from Groq API", details: data },
        { status: 500 }
      );
    }

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