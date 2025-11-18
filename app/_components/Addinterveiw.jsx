"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";
import { prepai } from "@/utils/schema";

const Addinterveiw = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [jobPosition, setJobPosition] = React.useState("");
  const [jobDesc, setJobDesc] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const Inputprompt = `
You are generating interview questions.

Role: ${jobPosition}
Tech Stack: ${jobDesc}
Experience: ${experience} years

Generate EXACTLY ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5} interview questions and answers.

STRICT RULES:
- Output ONLY valid JSON.
- NO markdown, NO backticks, NO extra text.
- Only an array of objects.
Example format:
[
  {
    "question": "string",
    "answer": "string"
  }
]
`;

      // CALLING INTERNAL ROUTE -> /api/generate-gemini
     const response = await fetch("/api/generate-gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: Inputprompt }),
});

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`API Error: ${result.error || "Unknown error"} - Status: ${response.status}`);
      }

      let MockJsonResp = result?.data || "";


      // CLEAN OUTPUT
      MockJsonResp = MockJsonResp
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // Extract pure JSON array
      const start = MockJsonResp.indexOf("[");
      const end = MockJsonResp.lastIndexOf("]") + 1;

      if (start !== -1 && end > start) {
        MockJsonResp = MockJsonResp.substring(start, end);
      }

      // TRY PARSING JSON
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(MockJsonResp);

        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
          throw new Error("Invalid format");
        }

        parsedQuestions.forEach((item) => {
          if (!item.question || !item.answer) {
            throw new Error("Invalid question object");
          }
        });
      } catch (err) {
        console.error("JSON Parse Error:", err);
        console.error("RAW OUTPUT:", MockJsonResp);
        alert("AI returned invalid JSON. Try again.");
        setLoading(false);
        return;
      }

      const mockId = uuidv4();

      const resp = await db
        .insert(prepai)
        .values({
          mockId,
          jsonMockResp: MockJsonResp,
          jobPosition,
          jobDesc,
          jobExperience: experience,
          createdBy: user?.primaryEmailAddress?.emailAddress || "guest",
          createdAt: Date.now(),
        })
        .returning({ mockId: prepai.mockId });

      router.push(`/dashboard/interveiw/${resp[0].mockId}`);

      setOpenDialog(false);
      setJobPosition("");
      setJobDesc("");
      setExperience("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-8 border rounded-lg bg-secondary m-5 hover:scale-105 transition-all cursor-pointer hover:shadow-md"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-2xl text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger />
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              Add details about your role, job description and experience.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4">
            <div className="my-3">
              <label className="font-medium">Job Role/Title</label>
              <Input
                required
                placeholder="Ex - Full Stack Developer"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            <div className="my-3">
              <label className="font-medium">Job Desc / Tech Stack</label>
              <Textarea
                required
                placeholder="Ex - React, Angular, NodeJS, MySQL"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <div className="my-3">
              <label className="font-medium">Years of Experience</label>
              <Input
                required
                type="number"
                max="50"
                min="0"
                placeholder="Ex - 3"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="flex gap-4 justify-end mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                disabled={loading}
                type="submit"
                className="px-4 py-2 rounded-md bg-green-600 text-white flex items-center"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  "Start Interview"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Addinterveiw;
