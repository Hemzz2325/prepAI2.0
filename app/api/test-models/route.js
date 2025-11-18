import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key missing" },
        { status: 500 }
      );
    }

    // List available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    const data = await response.json();

    return NextResponse.json({
      status: response.status,
      models: data.models || [],
      error: data.error
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message
      },
      { status: 500 }
    );
  }
}
