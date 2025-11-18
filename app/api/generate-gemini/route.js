import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt missing in request body" },
        { status: 400 }
      );
    }

    // USE SERVER-SIDE KEY ONLY (without NEXT_PUBLIC prefix)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables");
      return NextResponse.json(
        { error: "API key configuration error" },
        { status: 500 }
      );
    }

    console.log("Calling Gemini API with key:", apiKey.substring(0, 10) + "...");

    // Use the correct v1beta endpoint
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    // Log the full response for debugging
    console.log("Gemini API Response:", JSON.stringify(data, null, 2));

    if (!geminiRes.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json(
        {
          error: "Gemini API request failed",
          details: data,
          statusCode: geminiRes.status
        },
        { status: geminiRes.status }
      );
    }

    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Invalid Gemini response structure:", data);
      return NextResponse.json(
        {
          error: "Invalid response from Gemini API",
          details: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        status: 200,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error in generate-gemini:", error);
    return NextResponse.json(
      {
        error: "Server crashed",
        detail: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}