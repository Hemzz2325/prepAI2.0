const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Preferred model → fallback chain
const MODEL_CHAIN = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-pro",
];

/**
 * Sends a message with automatic model fallback.
 * If the primary model returns 503 / high-demand, tries the next model.
 */
async function sendWithFallback(message) {
  let lastError;
  for (const modelName of MODEL_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const session = model.startChat({ generationConfig, history: [] });
      const result = await session.sendMessage(message);
      return result;
    } catch (err) {
      const isTransient =
        err.message?.includes("503") ||
        err.message?.includes("high demand") ||
        err.message?.includes("overloaded") ||
        err.message?.includes("unavailable");
      if (isTransient) {
        console.warn(`[GeminiAI] ${modelName} unavailable, trying next model…`);
        lastError = err;
        continue;
      }
      // Non-transient error (auth, quota, etc.) — rethrow immediately
      throw err;
    }
  }
  throw lastError;
}

// Keep the same chatSession interface that the rest of the app uses
export const chatSession = {
  sendMessage: sendWithFallback,
};
