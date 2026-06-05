import { NextResponse } from "next/server";
import { chatSession } from "@/utils/GeminiAIModel";
import { applyRateLimit } from "@/lib/ratelimit";
import { parseBody, skillGapSchema } from "@/lib/validators";

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
    const validation = parseBody(skillGapSchema, body);
    if (validation.error) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.issues },
        { status: 422 }
      );
    }

    const { resumeText, targetRole, targetCompany } = validation.data;

    const prompt = `
You are a career advisor analyzing a resume against a target job role.

**Resume:**
${resumeText}

**Target Role:** ${targetRole}
${targetCompany ? `**Target Company:** ${targetCompany}` : ""}

Analyze the resume and provide a detailed skill gap analysis in the following JSON format:

{
  "skillsHave": ["skill1", "skill2", ...],
  "skillsNeeded": ["skill1", "skill2", "skill3", ...],
  "gaps": [
    {
      "skill": "Docker",
      "priority": "High",
      "reason": "Required for containerization in modern DevOps workflows"
    }
  ],
  "roadmap": [
    {
      "week": 1,
      "focus": "Docker Fundamentals",
      "tasks": ["Complete Docker official tutorial", "Build and deploy a simple containerized app"]
    }
  ],
  "projectSuggestions": ["Build a microservices app with Docker"],
  "resumeImprovements": ["Add quantifiable metrics to project descriptions"]
}

**Instructions:**
1. Extract all technical and soft skills from the resume
2. Identify skills typically required for the target role
3. Calculate gaps (skills needed but not present in resume)
4. Generate a 4-8 week learning roadmap focusing on the most critical gaps
5. Suggest 2-3 projects to build these skills
6. Provide 3-5 resume improvement tips

Return ONLY valid JSON, no additional text.
`;

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    let jsonText = responseText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const analysis = JSON.parse(jsonText);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing skill gap:", error);
    return NextResponse.json(
      { error: "Failed to analyze skill gap. Please try again." },
      { status: 500 }
    );
  }
}
