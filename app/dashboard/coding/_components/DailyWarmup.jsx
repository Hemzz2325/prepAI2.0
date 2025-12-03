"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Play } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function DailyWarmup() {
    const router = useRouter();
    const { user } = useUser();
    const [streak, setStreak] = useState(0);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentDay, setCurrentDay] = useState(0);

    useEffect(() => {
        if (user) {
            loadStreakData();
        }
    }, [user]);

    const loadStreakData = () => {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const userEmail = user.primaryEmailAddress.emailAddress;
        const streakKey = `codingStreak_${userEmail}`;
        const dateKey = `lastCompletedDate_${userEmail}`;
        const dayKey = `warmupDayCount_${userEmail}`;

        const streakData = localStorage.getItem(streakKey);
        const lastCompletedDate = localStorage.getItem(dateKey);
        const dayCount = localStorage.getItem(dayKey) || "0";
        const today = new Date().toDateString();

        setCurrentDay(parseInt(dayCount));

        if (streakData) {
            setStreak(parseInt(streakData));
        }

        if (lastCompletedDate === today) {
            setTodayCompleted(true);
        } else if (lastCompletedDate) {
            const lastDate = new Date(lastCompletedDate);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                // Streak broken
                setStreak(0);
                setCurrentDay(0);
                localStorage.setItem(streakKey, "0");
                localStorage.setItem(dayKey, "0");
            }
        }
    };

    const getDifficulty = (day) => {
        if (day < 7) return "Easy";
        if (day < 14) return "Medium";
        return "Hard";
    };

    const getTopic = (day) => {
        const topics = [
            "Arrays",
            "Strings",
            "Linked Lists",
            "Hash Tables",
            "Stacks & Queues",
            "Trees",
            "Graphs",
            "Dynamic Programming",
            "Sorting & Searching",
            "Recursion & Backtracking"
        ];
        return topics[day % topics.length];
    };

    const startWarmup = async () => {
        setLoading(true);
        try {
            const difficulty = getDifficulty(currentDay);
            const topic = getTopic(currentDay);

            const prompt = `Generate a ${difficulty} level coding problem on ${topic} suitable for a 5-minute warmup.

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "Problem title",
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "description": "Detailed problem description (keep it concise for a 5-min warmup)",
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

            // Mark as daily warmup
            challenge.isDailyWarmup = true;

            // Store in sessionStorage and navigate
            sessionStorage.setItem("currentChallenge", JSON.stringify(challenge));
            router.push("/dashboard/coding/solve");

        } catch (error) {
            console.error("Error generating warmup:", error);
            toast.error("Failed to generate warmup. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200 shadow-sm"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-xl">
                        <Flame className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Daily 5-Min Warmup</h3>
                        <p className="text-sm text-gray-600">Quick problem to keep your skills sharp</p>
                    </div>
                </div>

                {/* Streak Counter */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-orange-200">
                    <Trophy className="w-5 h-5 text-orange-600" />
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{streak}</p>
                        <p className="text-xs text-gray-500">day streak</p>
                    </div>
                </div>
            </div>

            {/* Daily Problem Info */}
            <div className="bg-white rounded-xl p-4 mb-4 border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">Today's Challenge</h4>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficulty(currentDay) === "Easy"
                            ? "bg-green-100 text-green-700"
                            : getDifficulty(currentDay) === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                            {getDifficulty(currentDay)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {getTopic(currentDay)}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-gray-600">
                    Day {currentDay + 1} • Difficulty increases every 7 days
                </p>
            </div>

            {/* Action Button */}
            {todayCompleted ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl border border-green-200">
                    <Trophy className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Completed Today! 🎉 Come back tomorrow!</span>
                </div>
            ) : (
                <button
                    onClick={startWarmup}
                    disabled={loading}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Start Warmup
                        </>
                    )}
                </button>
            )}
        </motion.div>
    );
}

export default DailyWarmup;
