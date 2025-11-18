import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  GoogleSearchRetrievalTool,
} from "@google/generative-ai";
dotenv.config();

export async function runGemini() {
  const apiKey = NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in environment variables.");
  }

  // Create client
  const client = new GoogleGenerativeAI(apiKey);

  // Tools (Google Search)
  const tools = [
    GoogleSearchRetrievalTool({
      // same as builder().build()
    })
  ];

  // Model
  const model = client.getGenerativeModel({
    model: "gemini-2.5-pro",
    tools,
    generationConfig: {
      thinking: { budgetTokens: -1 },
      imageConfig: { imageSize: "1K" }
    }
  });

  // Contents (role + parts)
  const contents = [
    {
      role: "user",
      parts: [
        { text: "INSERT_INPUT_HERE" }
      ]
    }
  ];

  // Stream response
  const stream = await model.generateContentStream({
    contents,
  });

  for await (const response of stream.stream) {
    const candidates = response.candidates ?? [];
    if (
      candidates.length === 0 ||
      !candidates[0].content ||
      !candidates[0].content.parts
    ) {
      continue;
    }

    const parts = candidates[0].content.parts;

    for (const part of parts) {
      if (part.text) console.log(part.text);
    }
  }
}
