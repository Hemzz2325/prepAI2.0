import OpenAI from "openai";

export async function POST(req) {
  console.log("API HIT: /api/generate-interveiw");

  try {
    const body = await req.json();
    console.log("BODY RECEIVED:", body);

    const { prompt } = body;

    if (!prompt) {
      console.log("ERROR: No prompt received");
      return new Response(JSON.stringify({ error: "Prompt missing" }), {
        status: 400
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log("Calling OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You output JSON only." },
        { role: "user", content: prompt }
      ]
    });

    console.log("OPENAI RESPONSE:", completion);

    return Response.json({
      success: true,
      data: completion.choices[0].message.content
    });
  } catch (err) {
    console.error("Interview API Error:", err);
    return new Response(JSON.stringify({ error: "AI generation failed" }), {
      status: 500
    });
  }
}
