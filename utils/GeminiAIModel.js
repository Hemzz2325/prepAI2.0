const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Base chat session
const baseChatSession = model.startChat({
  generationConfig,
  history: [],
});

/**
 * Wrapper function to handle API calls with retry logic and error handling.
 * This ensures a smoother user experience during high traffic or rate limits.
 */
export const chatSession = {
  sendMessage: async (prompt) => {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await baseChatSession.sendMessage(prompt);
      } catch (error) {
        // Check for rate limit errors (429) or server errors (503)
        const isRateLimit = error.message.includes('429') || error.message.includes('Resource exhausted');
        const isServerBusy = error.message.includes('503') || error.message.includes('Overloaded');

        if ((isRateLimit || isServerBusy) && attempt < maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`AI API busy (Attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // If it's the last attempt or a different error, throw it
          throw error;
        }
      }
    }
  }
};
