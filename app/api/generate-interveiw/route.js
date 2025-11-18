import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    // ... your existing logic: read jobPosition, jobDesc, jobExperience, build prompt ...

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    // ... parse completion and return questions ...
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error("Interview API Error:", error);

    // Special case for quota / 429
    if (error.status === 429 || error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "OpenAI quota exceeded. Please check your plan and billing." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate interview", details: error.message },
      { status: 500 }
    );
  }
}
