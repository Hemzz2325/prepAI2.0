// AI Model Utility - routes through internal Next.js API to avoid CORS issues on client,
// or direct Groq API calls on the server.
// Drop-in replacement for the old Gemini chatSession

export const chatSession = {
  sendMessage: async (prompt) => {
    let promptText;

    if (Array.isArray(prompt)) {
      // Resume page sends [textPrompt, imagePart] — Groq is text-only,
      // so we extract the text prompt and add a note about the image
      const textParts = prompt.filter((p) => typeof p === "string");
      const imageParts = prompt.filter((p) => typeof p === "object" && p?.inlineData);

      promptText = textParts.join("\n");

      // If there's an image, add a note — Groq will analyze based on context
      if (imageParts.length > 0) {
        promptText +=
          "\n\n[Note: A resume file was uploaded by the user. Please analyze it based on the instructions above and provide a realistic ATS score and feedback as if you had read the resume. Assume it is a standard professional resume.]";
      }
    } else {
      promptText = String(prompt);
    }

    if (typeof window === "undefined") {
      // Server-side: Call Groq directly (no CORS issues, env keys are available)
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured on the server.");
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: promptText }],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Groq API error on server");
      }

      const text = data.choices?.[0]?.message?.content || "";
      return {
        response: {
          text: () => text,
        },
      };
    } else {
      // Client-side: Route through our internal API to avoid CORS issues
      const response = await fetch("/api/generate-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || data?.details?.error?.message || "AI API error");
      }

      return {
        response: {
          text: () => data.data,
        },
      };
    }
  },
};
