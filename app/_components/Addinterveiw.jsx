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
import { toast } from "sonner";

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

  // Plan-based question count: pro plan gets 15, free gets 10
  const questionCount = (canUse !== undefined && limit >= 999) ? 15 : 10;
  // canUse comes from usePlan which exposes plan info; check via limit (unlimited = pro)
  // Safer: use a state variable fetched from /api/usage
  const techCount = questionCount - 3; // reserve 3 slots for coding questions

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let InputPrompt = "";

      // Fetch actual plan to determine question count
      let isPro = false;
      try {
        const email = user?.primaryEmailAddress?.emailAddress;
        const planRes = await fetch(`/api/usage?email=${encodeURIComponent(email)}&feature=interviews`);
        const planData = await planRes.json();
        isPro = planData?.plan === "pro";
      } catch (_) {}
      const totalQ = isPro ? 15 : 10;
      const mainQ = totalQ - 3; // 3 slots for code questions

      if (interviewRound === "Technical Round") {
        InputPrompt = `Generate a technical interview with EXACTLY ${totalQ} questions for the role below.

Job Position: ${jobPosition}
Tech Stack / Job Description: ${jobDesc}
Years of Experience: ${jobExperience}

RULES:
- First ${mainQ} questions: pure technical/conceptual questions on the given tech stack.
  - 0-2 yrs experience: foundational & basic concept questions.
  - 3-5 yrs: intermediate, problem-solving, design patterns.
  - 5+ yrs: advanced, system design, architecture, trade-offs.
- Last 3 questions: short coding questions. Use these types ONLY:
  1. "Predict the Output" — show a ${jobDesc.split(',')[0] || 'code'} snippet and ask what it prints/returns.
  2. "Write a Function" — ask to write a small utility function (10-15 lines max).
  3. "Fix the Bug" — show broken code and ask what is wrong.
  For coding questions, the "answer" field must contain the correct output/solution WITH a brief explanation.

IMPORTANT: Return ONLY a valid JSON array. No markdown, no extra text.
[
  {"question": "Question text?", "answer": "Answer text."},
  ...
]`;

      } else if (interviewRound === "Managerial Round") {
        InputPrompt = `Generate a managerial interview with EXACTLY ${totalQ} questions for the role below.

Job Position: ${jobPosition}
Years of Experience: ${jobExperience}

THIS IS A BEHAVIORAL/LEADERSHIP ROUND. DO NOT ask technical or coding questions.
Focus ONLY on:
- Leadership & people management (how they lead/motivate teams)
- Conflict resolution (handling disagreements, difficult colleagues)
- Problem-solving mindset (how they approach ambiguous problems)
- Behavioral traits (use STAR method scenarios — Situation, Task, Action, Result)
- Cultural fit & values (collaboration, ownership, growth mindset)
- Communication & stakeholder management

Question volume breakdown for ${totalQ} questions:
- 3 questions: leadership & team management scenarios
- 3 questions: conflict resolution & handling pressure
- 2 questions: behavioral (STAR format — "Tell me about a time when...")
- 2 questions: cultural fit & values (teamwork, ownership, learning)
${isPro ? '- 3 questions: strategic thinking, product decisions, stakeholder alignment, cross-team influence\n- 2 questions: mentoring, delegation, and driving results' : '- 2 questions: initiative & ownership examples'}

IMPORTANT: Return ONLY a valid JSON array. No markdown, no extra text.
[
  {"question": "Tell me about a time when...", "answer": "A strong answer would include..."},
  ...
]`;

      } else if (interviewRound === "Aptitude & Scenario-Based Round") {
        InputPrompt = `Generate EXACTLY ${totalQ} aptitude and scenario-based questions.

Job Position: ${jobPosition} (context only — do NOT focus on tech)
Years of Experience: ${jobExperience}

RULES:
- Do NOT ask coding or technical questions.
- Focus on: quantitative aptitude, logical reasoning, workplace ethics, time management, data interpretation.
- Provide 4 options (A, B, C, D) for each question.
- Difficulty scales with experience: higher exp = more ambiguous, multi-step scenarios.

IMPORTANT: Return ONLY a valid JSON array. No markdown, no extra text.
[
  {
    "question": "Question text...",
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
        toast.error('AI returned an invalid response. Please try again.');
        setLoading(false);
        return;
      }

      if (!parsed || parsed.length === 0) {
        toast.error('AI generated no questions. Please try again.');
        setLoading(false);
        return;
      }

      const mockId = uuidv4();
      const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";

      // Consume one usage slot before saving
      const allowed = await consume();
      if (!allowed) {
        toast.warning('Weekly interview limit reached. Upgrade to Pro for unlimited access!', {
          action: { label: 'Upgrade', onClick: () => router.push('/upgrade') },
          duration: 6000,
        });
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
      toast.error(error?.message || 'Something went wrong. Please try again.');
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
        className="p-10 border-2 border-dashed border-blue-300 dark:border-green-700/40 bg-gradient-to-br from-green-50 to-indigo-50 dark:from-green-900/10 dark:to-indigo-900/10 rounded-xl hover:shadow-xl dark:hover:shadow-none dark:hover:border-green-500/60 shadow-md cursor-pointer transition-all flex flex-col items-center"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center font-bold text-indigo-600 dark:text-green-400">
          + Add New Interview
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            <DialogContent className="max-w-2xl border-2 shadow-xl rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-700">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.25 }}
              >
                {!canUse ? (
                  /* Plan limit reached */
                  <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Lock className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl">Weekly Interview Limit Reached</h3>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm">
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
                            className="w-full p-2 border rounded-md transition-all hover:border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-300 bg-white dark:bg-gray-900"
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
