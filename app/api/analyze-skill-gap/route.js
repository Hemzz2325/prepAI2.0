import { NextResponse } from "next/server";
import { chatSession } from "@/utils/GeminiAIModel";

export async function POST(req) {
    try {
        const { resumeText, targetRole, targetCompany } = await req.json();

        if (!resumeText || !targetRole) {
            return NextResponse.json(
                { error: "Resume text and target role are required" },
                { status: 400 }
            );
        }

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
    },
    ...
  ],
  "roadmap": [
    {
      "week": 1,
      "focus": "Docker Fundamentals",
      "tasks": [
        "Complete Docker official tutorial",
        "Build and deploy a simple containerized app",
        "Learn docker-compose basics"
      ]
    },
    {
      "week": 2,
      "focus": "Advanced Docker & Kubernetes Intro",
      "tasks": [
        "Multi-stage Docker builds",
        "Introduction to Kubernetes",
        "Deploy app to Kubernetes cluster"
      ]
    },
    ...
  ],
  "projectSuggestions": [
    "Build a microservices app with Docker",
    "Create a CI/CD pipeline using Docker",
    "Deploy a full-stack app on Kubernetes"
  ],
  "resumeImprovements": [
    "Add quantifiable metrics to project descriptions",
    "Highlight leadership experience",
    "Include specific technologies used in each project"
  ]
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

        // Clean the response to extract JSON
        let jsonText = responseText.trim();
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/```\n?/g, "");
        }

        const analysis = JSON.parse(jsonText);

        return NextResponse.json({
            success: true,
            analysis,
        });
    } catch (error) {
        console.error("Error analyzing skill gap:", error);
        return NextResponse.json(
            { error: "Failed to analyze skill gap. Please try again." },
            { status: 500 }
        );
    }
}
