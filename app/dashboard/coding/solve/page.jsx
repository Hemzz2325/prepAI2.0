"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { chatSession } from "@/utils/GeminiAIModel";
import { toast } from "sonner";
import { LoaderCircle, Lightbulb, Bug, BarChart3, Play, CheckCircle, ArrowRight } from "lucide-react";
import { db } from "@/utils/db";
import { CodingSubmission } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function CodingSolver() {
    const router = useRouter();
    const { user } = useUser();
    const [challenge, setChallenge] = useState(null);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAIHelper, setShowAIHelper] = useState(false);
    const [aiResponse, setAIResponse] = useState("");
    const [aiLoading, setAILoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [complexity, setComplexity] = useState(null);

    const languages = [
        { value: "javascript", label: "JavaScript", ext: "js" },
        { value: "python", label: "Python", ext: "py" },
        { value: "java", label: "Java", ext: "java" },
        { value: "cpp", label: "C++", ext: "cpp" },
    ];

    useEffect(() => {
        const storedChallenge = sessionStorage.getItem("currentChallenge");
        if (storedChallenge) {
            const parsedChallenge = JSON.parse(storedChallenge);
            setChallenge(parsedChallenge);
            setCode(parsedChallenge.starterCode[language] || "");
        } else {
            router.push("/dashboard/coding");
        }
    }, []);

    useEffect(() => {
        if (challenge) {
            setCode(challenge.starterCode[language] || "");
        }
    }, [language, challenge]);

    const runCode = async () => {
        setLoading(true);
        setOutput("");

        try {
            if (language === "javascript") {
                try {
                    const result = eval(code);
                    setOutput(`✅ Code executed successfully!\n\nOutput: ${JSON.stringify(result, null, 2)}`);
                } catch (error) {
                    setOutput(`❌ Runtime Error:\n${error.message}`);
                }
            } else {
                setOutput(`⚠️ Code execution for ${languages.find(l => l.value === language)?.label} is simulated.\n\nYour code looks good! Use the AI Helper to analyze complexity.`);
            }
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const submitSolution = async () => {
        if (!user) {
            toast.error("Please sign in to submit");
            return;
        }

        setSubmitting(true);
        try {
            const complexityPrompt = `Analyze the time and space complexity of this code:\n\n${code}\n\nReturn ONLY a JSON object: {"time": "O(...)", "space": "O(...)"}`;
            const complexityResult = await chatSession.sendMessage(complexityPrompt);
            const complexityText = complexityResult.response.text().replace(/```json|```/g, "").trim();
            const complexityData = JSON.parse(complexityText);

            setComplexity(complexityData);

            await db.insert(CodingSubmission).values({
                userEmail: user.primaryEmailAddress.emailAddress,
                challengeTitle: challenge.title,
                difficulty: challenge.difficulty,
                topic: challenge.topic,
                language: language,
                code: code,
                solved: "true",
                timeComplexity: complexityData.time,
                spaceComplexity: complexityData.space,
                createdAt: moment().format("DD-MM-YYYY")
            });

            setSubmitted(true);
            toast.success("Solution submitted successfully!");
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to submit solution");
        } finally {
            setSubmitting(false);
        }
    };

    const loadNextChallenge = async () => {
        setSubmitting(true);
        setSubmitted(false);
        setComplexity(null);
        setOutput("");
        setAIResponse("");
        setShowAIHelper(false);

        try {
            const prompt = `Generate a ${challenge.difficulty} level coding problem on ${challenge.topic}.

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "Problem title",
  "difficulty": "${challenge.difficulty}",
  "topic": "${challenge.topic}",
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

            const cleanedResponse = responseText
                .replace(/```json\n?/gi, "")
                .replace(/```\n?/gi, "")
                .trim();

            const newChallenge = JSON.parse(cleanedResponse);

            setChallenge(newChallenge);
            setCode(newChallenge.starterCode[language] || "");
            sessionStorage.setItem("currentChallenge", JSON.stringify(newChallenge));

            toast.success("New challenge loaded!");
        } catch (error) {
            console.error("Error loading next challenge:", error);
            toast.error("Failed to load next challenge. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getAIHelp = async (type) => {
        setAILoading(true);
        setShowAIHelper(true);

        try {
            let prompt = "";

            if (type === "hint") {
                prompt = `Problem: ${challenge.title}\n\nDescription: ${challenge.description}\n\nProvide a helpful hint to solve this problem WITHOUT giving away the complete solution. Focus on the approach and key insights.`;
            } else if (type === "debug") {
                prompt = `Problem: ${challenge.title}\n\nUser's Code:\n${code}\n\nAnalyze this code and help debug any issues. Point out logical errors, syntax problems, or suggest improvements.`;
            } else if (type === "complexity") {
                prompt = `Problem: ${challenge.title}\n\nUser's Code:\n${code}\n\nAnalyze the time and space complexity of this solution. Explain the complexity in detail and suggest optimizations if possible. Compare with the optimal complexity: Time ${challenge.optimalComplexity?.time}, Space ${challenge.optimalComplexity?.space}`;
            }

            const result = await chatSession.sendMessage(prompt);
            setAIResponse(result.response.text());
        } catch (error) {
            console.error("AI Helper error:", error);
            toast.error("Failed to get AI help. Please try again.");
            setAIResponse("Failed to get AI assistance. Please try again.");
        } finally {
            setAILoading(false);
        }
    };

    if (!challenge) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderCircle className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between max-w-[1800px] mx-auto">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/coding")}>
                            &larr; Back
                        </Button>
                        <div>
                            <h2 className="font-bold text-xl text-gray-900">{challenge.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${challenge.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                                        challenge.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-red-100 text-red-700"
                                    }`}>
                                    {challenge.difficulty}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                    {challenge.topic}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitted}
                        >
                            {languages.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>

                        <Button
                            onClick={runCode}
                            disabled={loading || submitted}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Run Code
                                </>
                            )}
                        </Button>

                        {!submitted ? (
                            <Button
                                onClick={submitSolution}
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Submit Solution
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={loadNextChallenge}
                                disabled={submitting}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Next Challenge
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {submitted && (
                <div className="bg-green-50 border-b border-green-200 p-4">
                    <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="font-bold text-green-900">Solution Submitted!</p>
                                <p className="text-sm text-green-700">
                                    Complexity: Time {complexity?.time || "N/A"}, Space {complexity?.space || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white">
                    <div className="p-6">
                        <h3 className="font-bold text-lg mb-4">Description</h3>
                        <p className="text-gray-700 leading-relaxed mb-6">{challenge.description}</p>

                        <h3 className="font-bold text-lg mb-3">Constraints</h3>
                        <ul className="list-disc list-inside space-y-1 mb-6">
                            {challenge.constraints.map((constraint, idx) => (
                                <li key={idx} className="text-gray-700 text-sm">{constraint}</li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-lg mb-3">Examples</h3>
                        {challenge.examples.map((example, idx) => (
                            <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm mb-1"><strong>Input:</strong> {example.input}</p>
                                <p className="text-sm mb-1"><strong>Output:</strong> {example.output}</p>
                                <p className="text-sm text-gray-600"><strong>Explanation:</strong> {example.explanation}</p>
                            </div>
                        ))}

                        <div className="mt-8 space-y-3">
                            <h3 className="font-bold text-lg mb-3">AI Assistance</h3>
                            <Button
                                onClick={() => getAIHelp("hint")}
                                variant="outline"
                                className="w-full justify-start"
                                disabled={aiLoading || submitted}
                            >
                                <Lightbulb className="mr-2 h-4 w-4 text-yellow-600" />
                                Get Hint
                            </Button>
                            <Button
                                onClick={() => getAIHelp("debug")}
                                variant="outline"
                                className="w-full justify-start"
                                disabled={aiLoading || submitted}
                            >
                                <Bug className="mr-2 h-4 w-4 text-red-600" />
                                Debug My Code
                            </Button>
                            <Button
                                onClick={() => getAIHelp("complexity")}
                                variant="outline"
                                className="w-full justify-start"
                                disabled={aiLoading || submitted}
                            >
                                <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />
                                Analyze Complexity
                            </Button>
                        </div>

                        {showAIHelper && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                    <span>🤖</span> AI Assistant
                                </h4>
                                {aiLoading ? (
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <LoaderCircle className="animate-spin h-4 w-4" />
                                        <span className="text-sm">Analyzing...</span>
                                    </div>
                                ) : (
                                    <div className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                                        {aiResponse}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-1/2 flex flex-col">
                    <div className="flex-1 border-b border-gray-200">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                readOnly: submitted
                            }}
                        />
                    </div>

                    <div className="h-48 bg-gray-900 text-white p-4 overflow-y-auto">
                        <h3 className="font-bold text-sm mb-2 text-gray-300">Output</h3>
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                            {output || "Click 'Run Code' to see output..."}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodingSolver;
