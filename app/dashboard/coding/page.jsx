"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { chatSession } from "@/utils/GeminiAIModel";
import { toast } from "sonner";
import { LoaderCircle, Lock } from "lucide-react";
import BackButton from '@/components/BackButton';
import DailyWarmup from "./_components/DailyWarmup";
import { usePlan } from "@/hooks/usePlan";
import Link from "next/link";

function CodingInterview() {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");
    const { canUse, used, limit, consume } = usePlan("codingChallenges");

    const difficulties = ["Easy", "Medium", "Hard"];
    const topics = [
        "Arrays",
        "Strings",
        "Linked Lists",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "Sorting & Searching",
        "Hash Tables",
        "Stacks & Queues",
        "Recursion & Backtracking"
    ];

    const generateChallenge = async () => {
        if (!difficulty || !topic) { toast.error("Please select both difficulty and topic"); return; }
        if (!canUse) { toast.error(`Weekly limit reached (${used}/${limit}). Upgrade to Pro!`); return; }
        setGenerating(true);
        try {
            // Consume one slot
            await consume();
            const prompt = `Generate a ${difficulty} level coding problem on ${topic}.

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "Problem title",
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "description": "Detailed problem description",
  "constraints": ["constraint 1", "constraint 2"],
  "examples": [
    {
      "input": "example input",
      "output": "example output",
      "explanation": "why this output"
    }
  ],
  "starterCode": {
    "javascript": "function solution() {\\n  // Your code here\\n}",
    "python": "def solution():\\n    # Your code here\\n    pass",
    "java": "class Solution {\\n    public void solution() {\\n        // Your code here\\n    }\\n}",
    "cpp": "#include <iostream>\\nusing namespace std;\\n\\nvoid solution() {\\n    // Your code here\\n}"
  },
  "testCases": [
    {"input": "test input 1", "expectedOutput": "expected output 1"},
    {"input": "test input 2", "expectedOutput": "expected output 2"}
  ],
  "hints": ["hint 1", "hint 2"],
  "optimalComplexity": {
    "time": "O(n)",
    "space": "O(1)"
  }
}`;

            const result = await chatSession.sendMessage(prompt);
            const responseText = result.response.text();

            // Clean up response
            const cleanedResponse = responseText
                .replace(/```json\n?/gi, "")
                .replace(/```\n?/gi, "")
                .trim();

            const challenge = JSON.parse(cleanedResponse);

            // Store in sessionStorage and navigate
            sessionStorage.setItem("currentChallenge", JSON.stringify(challenge));
            router.push("/dashboard/coding/solve");

        } catch (error) {
            console.error("Error generating challenge:", error);
            toast.error("Failed to generate challenge. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="p-10 bg-background min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <BackButton variant="inline" className="mb-0" />
                    <div>
                        <h2 className="font-bold text-3xl text-gray-900 dark:text-white">Coding Interview</h2>
                        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Practice DSA problems with AI-powered assistance</p>
                    </div>
                </div>

                {/* Daily Warmup */}
                <DailyWarmup />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Challenge Generator */}
                    <div className="lg:col-span-2">
                        <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Generate a Coding Challenge</h3>

                            {/* Difficulty Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Select Difficulty
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {difficulties.map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => setDifficulty(diff)}
                                            className={`p-4 rounded-xl border-2 transition-all font-semibold ${difficulty === diff
                                                ? diff === "Easy"
                                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700"
                                                    : diff === "Medium"
                                                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700"
                                                        : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700"
                                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                                                }`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Topic Selection */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Select Topic
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {topics.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTopic(t)}
                                            className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${topic === t
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700"
                                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!canUse ? (
                                <div className="flex flex-col items-center gap-3 py-6 text-center border-2 border-dashed border-orange-200 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                                    <Lock className="w-7 h-7 text-orange-500" />
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">Weekly Coding Limit Reached</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{used}/{limit} free challenges used. Resets Monday.</p>
                                    <Link href="/upgrade">
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">Upgrade to Pro — ₹100</Button>
                                    </Link>
                                </div>
                            ) : (
                            <Button
                                onClick={generateChallenge}
                                disabled={generating || !difficulty || !topic}
                                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {generating ? (
                                    <><LoaderCircle className="animate-spin mr-2" />Generating Challenge...</>
                                ) : (
                                    `Generate Challenge (${used}/${limit} used this week)`
                                )}
                            </Button>
                            )}
                        </div>
                    </div>

                    {/* Right: Features */}
                    <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/40">
                            <div className="text-3xl mb-3">💡</div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">AI Hints</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Get intelligent hints when you're stuck without spoiling the solution.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-100">
                            <div className="text-3xl mb-3">🐛</div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Debug Help</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                AI-powered debugging assistance to help you fix errors quickly.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                            <div className="text-3xl mb-3">📊</div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Complexity Analysis</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Get detailed time and space complexity analysis of your solution.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                            <div className="text-3xl mb-3">✨</div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Code Editor</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Monaco Editor with syntax highlighting for multiple languages.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodingInterview;
