"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle, Lock } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlan } from "@/hooks/usePlan";
import Link from "next/link";

function Addinterveiw() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [interviewRound, setInterviewRound] = useState("Technical Round");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { canUse, used, limit, loading: planLoading, consume } = usePlan("interviews");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let InputPrompt = "";

      if (interviewRound === "Technical Round") {
        InputPrompt = `Generate exactly 5 technical interview questions and answers for the following position.
        
Job Position: ${jobPosition}
Job Description/Tech Stack: ${jobDesc}
Years of Experience: ${jobExperience}

IMPORTANT: Adjust the difficulty of the questions based on the Years of Experience provided. 
- If experience is low (0-2 years), ask foundational and basic questions.
- If experience is medium (3-5 years), ask intermediate questions involving problem-solving.
- If experience is high (5+ years), ask advanced, architectural, and complex scenario-based questions.

IMPORTANT: You MUST respond with ONLY a valid JSON array. No other text before or after.

Response format - must be exactly this structure:
[
  {"question": "What is...?", "answer": "The answer is..."},
  {"question": "How do...?", "answer": "You should..."}
]`;
      } else if (interviewRound === "Managerial Round") {
        InputPrompt = `Generate exactly 5 managerial and behavioral interview questions and answers for the following position. Focus on leadership, conflict resolution, and soft skills.

Job Position: ${jobPosition}
Job Description/Tech Stack: ${jobDesc}
Years of Experience: ${jobExperience}

IMPORTANT: Adjust the difficulty and depth of the questions based on the Years of Experience.
- Junior roles: Focus on basic team interaction and work ethic.
- Senior roles: Focus on leadership, conflict resolution, and strategic thinking.

IMPORTANT: You MUST respond with ONLY a valid JSON array. No other text before or after.

Response format - must be exactly this structure:
[
  {"question": "What is...?", "answer": "The answer is..."},
  {"question": "How do...?", "answer": "You should..."}
]`;
      } else if (interviewRound === "Aptitude & Scenario-Based Round") {
        InputPrompt = `Generate exactly 5 general aptitude, logical reasoning, and scenario-based questions. 
        
        IMPORTANT: 
        - Do NOT ask technical coding questions. 
        - Focus on quantitative aptitude, logical reasoning, and general workplace scenarios (e.g., time management, ethics).
        - The questions should be suitable for a professional with ${jobExperience} years of experience, but NOT specific to the tech stack.
        - Provide 4 options for each question.

Job Position: ${jobPosition} (For context only, do not focus on technical details)
Years of Experience: ${jobExperience}

IMPORTANT: Adjust the complexity of the scenarios based on the Years of Experience. Higher experience should face more ambiguous and complex decision-making scenarios.

IMPORTANT: You MUST respond with ONLY a valid JSON array. No other text before or after.

Response format - must be exactly this structure:
[
  {
    "question": "Question text here...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct Answer Text",
    "correctOption": "Option A"
  }
]`;
      }

      const result = await chatSession.sendMessage(InputPrompt);
      let rawResponse = result.response.text();

      let cleaned = rawResponse
        .replace(/```\n?/g, "")
        .replace(/^\n+|\n+$/g, "")
        .trim();

      const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) cleaned = match[0];

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        alert("AI response was invalid. Please try again.");
        setLoading(false);
        return;
      }

      if (!parsed || parsed.length === 0) {
        alert("Generated questions are empty. Please try again.");
        setLoading(false);
        return;
      }

      const mockId = uuidv4();
      const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";

      // Consume one usage slot before saving
      const allowed = await consume();
      if (!allowed) {
        alert("You have reached your weekly interview limit. Please upgrade to Pro!");
        setLoading(false);
        return;
      }

      await db.insert(MockInterview).values({
        mockId: mockId,
        jsonMockResp: cleaned,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: userEmail,
        createdAt: moment().format("DD-MM-YYYY"),
        interviewRound: interviewRound,
      });

      setOpenDialog(false);
      await new Promise((res) => setTimeout(res, 300));
      router.push(`/dashboard/interveiw/${mockId}`);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add New Interview Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.25 }}
        className="p-10 border-2 border-dashed border-blue-300 bg-gradient-to-br from-green-50 to-indigo-50 rounded-xl hover:shadow-xl shadow-md cursor-pointer transition-all flex flex-col items-center"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center font-bold text-indigo-600">
          + Add New Interview
        </h2>
        <span className="text-xs text-gray-500 mt-1">
          {planLoading
            ? "Loading..."
            : canUse
            ? `${used}/${limit} interviews used this week`
            : "⚠️ Weekly limit reached — Upgrade to Pro"}
        </span>
      </motion.div>

      {/* Dialog */}
      <AnimatePresence>
        {openDialog && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="max-w-2xl border-2 shadow-xl rounded-2xl">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.25 }}
              >
                {!canUse ? (
                  /* Plan limit reached */
                  <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <div className="p-3 rounded-full bg-orange-100">
                      <Lock className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-xl">Weekly Interview Limit Reached</h3>
                    <p className="text-gray-500 text-sm">
                      You&apos;ve used <b>{used}/{limit}</b> free interviews this week.
                      <br />Resets every Monday.
                    </p>
                    <Link href="/upgrade">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                        Upgrade to Pro — ₹100 only
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => setOpenDialog(false)}>Close</Button>
                  </div>
                ) : (
                  /* Interview form */
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Tell us more about your job interview
                      </DialogTitle>
                      <DialogDescription>
                        Add Details about your job position/role, Job description and years of experience
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit}>
                      <div className="mt-7">
                        <div className="my-3">
                          <label className="block mb-2">Job Role/Job Position</label>
                          <Input
                            placeholder="Ex. Full Stack Developer"
                            required
                            value={jobPosition}
                            onChange={(e) => setJobPosition(e.target.value)}
                            className="border transition-all hover:border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-300"
                          />
                        </div>

                        <div className="my-3">
                          <label className="block mb-2">Interview Round</label>
                          <select
                            className="w-full p-2 border rounded-md transition-all hover:border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-300 bg-white"
                            value={interviewRound}
                            onChange={(e) => setInterviewRound(e.target.value)}
                          >
                            <option value="Technical Round">Technical Round</option>
                            <option value="Managerial Round">Managerial Round</option>
                            <option value="Aptitude & Scenario-Based Round">
                              Aptitude &amp; Scenario-Based Round
                            </option>
                          </select>
                        </div>

                        <div className="my-3">
                          <label className="block mb-2">Job Description / Tech Stack</label>
                          <Textarea
                            placeholder="Ex. React, Angular, NodeJs, MySql etc"
                            required
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            className="border transition-all hover:border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-300"
                          />
                        </div>

                        <div className="my-3">
                          <label className="block mb-2">Years of Experience</label>
                          <Input
                            placeholder="Ex. 5"
                            type="number"
                            min="0"
                            max="50"
                            required
                            value={jobExperience}
                            onChange={(e) => setJobExperience(e.target.value)}
                            className="border transition-all hover:border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                      </div>

                      <div className="flex gap-5 justify-end mt-5">
                        <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <LoaderCircle className="animate-spin mr-2" />
                              Generating from AI
                            </>
                          ) : (
                            "Start Interview"
                          )}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Addinterveiw;
