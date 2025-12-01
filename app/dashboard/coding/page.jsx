"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { chatSession } from "@/utils/GeminiAIModel";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import BackButton from "../../_components/BackButton";

function CodingInterview() {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");

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
        if (!difficulty || !topic) {
            toast.error("Please select both difficulty and topic");
            return;
        }

        setGenerating(true);
        try {
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
        <div className="p-10 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <BackButton className="" />
                    <div>
                        <h2 className="font-bold text-3xl text-gray-900">Coding Interview</h2>
                        <p className="text-gray-500">Practice DSA problems with AI-powered assistance</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Challenge Generator */}
                    <div className="lg:col-span-2">
                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate a Coding Challenge</h3>

                            {/* Difficulty Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Select Difficulty
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {difficulties.map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => setDifficulty(diff)}
                                            className={`p-4 rounded-xl border-2 transition-all font-semibold ${difficulty === diff
                                                ? diff === "Easy"
                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                    : diff === "Medium"
                                                        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                                        : "border-red-500 bg-red-50 text-red-700"
                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Topic Selection */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Select Topic
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {topics.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTopic(t)}
                                            className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${topic === t
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <Button
                                onClick={generateChallenge}
                                disabled={generating || !difficulty || !topic}
                                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {generating ? (
                                    <>
                                        <LoaderCircle className="animate-spin mr-2" />
                                        Generating Challenge...
                                    </>
                                ) : (
                                    "Generate Challenge"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Right: Features */}
                    <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                            <div className="text-3xl mb-3">💡</div>
                            <h4 className="font-bold text-gray-900 mb-2">AI Hints</h4>
                            <p className="text-sm text-gray-600">
                                Get intelligent hints when you're stuck without spoiling the solution.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-100">
                            <div className="text-3xl mb-3">🐛</div>
                            <h4 className="font-bold text-gray-900 mb-2">Debug Help</h4>
                            <p className="text-sm text-gray-600">
                                AI-powered debugging assistance to help you fix errors quickly.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                            <div className="text-3xl mb-3">📊</div>
                            <h4 className="font-bold text-gray-900 mb-2">Complexity Analysis</h4>
                            <p className="text-sm text-gray-600">
                                Get detailed time and space complexity analysis of your solution.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                            <div className="text-3xl mb-3">✨</div>
                            <h4 className="font-bold text-gray-900 mb-2">Code Editor</h4>
                            <p className="text-sm text-gray-600">
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
