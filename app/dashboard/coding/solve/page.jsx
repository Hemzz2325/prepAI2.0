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
    const [testResults, setTestResults] = useState([]);

    const languages = [
        { value: "javascript", label: "JavaScript", ext: "js", pistonVersion: "18.15.0" },
        { value: "python", label: "Python", ext: "py", pistonVersion: "3.10.0" },
        { value: "java", label: "Java", ext: "java", pistonVersion: "15.0.2" },
        { value: "cpp", label: "C++", ext: "cpp", pistonVersion: "10.2.0" },
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
    }, [language]);

    const runCode = async () => {
        setLoading(true);
        setOutput("");
        setTestResults([]);

        try {
            const results = [];
            const langConfig = languages.find(l => l.value === language);

            for (let i = 0; i < challenge.testCases.length; i++) {
                const testCase = challenge.testCases[i];

                try {
                    // Prepare code with input
                    let executableCode = code;

                    // Add input handling based on language
                    if (language === "javascript") {
                        executableCode = `${code}\n\n// Test input\nconst input = ${JSON.stringify(testCase.input)};\nconst result = solution(input);\nconsole.log(JSON.stringify(result));`;
                    } else if (language === "python") {
                        executableCode = `${code}\n\n# Test input\ninput_data = ${JSON.stringify(testCase.input)}\nresult = solution(input_data)\nprint(result)`;
                    } else if (language === "java") {
                        executableCode = code.replace(
                            "public static void main(String[] args)",
                            `public static void main(String[] args) {\n        String input = ${JSON.stringify(testCase.input)};\n        System.out.println(solution(input));\n    }\n    public static String solution(String input)`
                        );
                    } else if (language === "cpp") {
                        executableCode = `${code}\n\nint main() {\n    std::string input = ${JSON.stringify(testCase.input)};\n    std::cout << solution(input) << std::endl;\n    return 0;\n}`;
                    }

                    // Execute via Piston API
                    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            language: language === "cpp" ? "c++" : language,
                            version: langConfig.pistonVersion,
                            files: [{
                                name: `solution.${langConfig.ext}`,
                                content: executableCode
                            }]
                        })
                    });

                    const data = await response.json();

                    if (data.run && data.run.output) {
                        const actualOutput = data.run.output.trim();
                        const expectedOutput = String(testCase.expectedOutput).trim();
                        const passed = actualOutput === expectedOutput;

                        results.push({
                            testCase: i + 1,
                            input: testCase.input,
                            expected: testCase.expectedOutput,
                            actual: actualOutput,
                            passed: passed,
                            error: data.run.stderr || null
                        });
                    } else if (data.run && data.run.stderr) {
                        results.push({
                            testCase: i + 1,
                            input: testCase.input,
                            expected: testCase.expectedOutput,
                            actual: null,
                            passed: false,
                            error: data.run.stderr
                        });
                    } else {
                        throw new Error("Execution failed");
                    }
                } catch (error) {
                    results.push({
                        testCase: i + 1,
                        input: testCase.input,
                        expected: testCase.expectedOutput,
                        actual: null,
                        passed: false,
                        error: error.message
                    });
                }
            }

            setTestResults(results);
            const passedCount = results.filter(r => r.passed).length;
            const totalCount = results.length;

            setOutput(`✅ Executed ${totalCount} test cases\n✓ Passed: ${passedCount}/${totalCount}\n${passedCount === totalCount ? '🎉 All tests passed!' : '❌ Some tests failed'}`);

            if (passedCount === totalCount) {
                toast.success("All test cases passed!");
            } else {
                toast.error(`${totalCount - passedCount} test case(s) failed`);
            }
        } catch (error) {
            console.error("Execution error:", error);
            setOutput(`❌ Error: ${error.message}`);
            toast.error("Code execution failed");
        } finally {
            setLoading(false);
        }
    };

    const submitSolution = async () => {
        setSubmitting(true);

        try {
            const prompt = `Analyze this ${language} code and provide time and space complexity in Big O notation.
            
Code:
${code}

Return ONLY a JSON object with this structure:
{
  "time": "O(...)",
  "space": "O(...)"
}`;

            const result = await chatSession.sendMessage(prompt);
            const responseText = result.response.text();
            const cleanedResponse = responseText
                .replace(/```json\n?/gi, "")
                .replace(/```\n?/gi, "")
                .trim();

            const complexityData = JSON.parse(cleanedResponse);
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

            // Check if this is a daily warmup
            if (challenge.isDailyWarmup) {
                const today = new Date().toDateString();
                const userEmail = user.primaryEmailAddress.emailAddress;
                const streakKey = `codingStreak_${userEmail}`;
                const dateKey = `lastCompletedDate_${userEmail}`;
                const dayKey = `warmupDayCount_${userEmail}`;

                const currentStreak = parseInt(localStorage.getItem(streakKey) || "0");
                const currentDay = parseInt(localStorage.getItem(dayKey) || "0");
                const newStreak = currentStreak + 1;
                const newDay = currentDay + 1;

                localStorage.setItem(streakKey, newStreak.toString());
                localStorage.setItem(dateKey, today);
                localStorage.setItem(dayKey, newDay.toString());

                toast.success(`🔥 ${newStreak} day streak! Day ${newDay} completed!`);
            }

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
        setTestResults([]);

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
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between max-w-[1800px] mx-auto">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/coding")}>
                            &larr; Back
                        </Button>
                        <div>
                            <h2 className="font-bold text-xl text-gray-900 dark:text-white">{challenge.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${challenge.difficulty === "Easy" ? "bg-green-100 dark:bg-green-900/30 text-green-700" :
                                    challenge.difficulty === "Medium" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700" :
                                        "bg-red-100 dark:bg-red-900/30 text-red-700"
                                    }`}>
                                    {challenge.difficulty}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 font-semibold">
                                    {challenge.topic}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        ) : challenge.isDailyWarmup ? (
                            <Button
                                onClick={() => router.push('/dashboard/coding')}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Back to Coding
                                <ArrowRight className="ml-2 h-4 w-4" />
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
                <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 p-4">
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
                <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-900">
                    <div className="p-6">
                        <h3 className="font-bold text-lg mb-4">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{challenge.description}</p>

                        <h3 className="font-bold text-lg mb-3">Constraints</h3>
                        <ul className="list-disc list-inside space-y-1 mb-6">
                            {challenge.constraints.map((constraint, idx) => (
                                <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">{constraint}</li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-lg mb-3">Examples</h3>
                        {challenge.examples.map((example, idx) => (
                            <div key={idx} className="mb-4 p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                                <p className="text-sm mb-1"><strong>Input:</strong> {example.input}</p>
                                <p className="text-sm mb-1"><strong>Output:</strong> {example.output}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Explanation:</strong> {example.explanation}</p>
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
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/40">
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
                    <div className="flex-1 border-b border-gray-200 dark:border-gray-700">
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
                        <pre className="text-sm font-mono whitespace-pre-wrap mb-4">
                            {output || "Click 'Run Code' to see output..."}
                        </pre>

                        {/* Test Results */}
                        {testResults.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="font-bold text-sm text-gray-300 mb-2">Test Results:</h4>
                                {testResults.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded border ${result.passed
                                            ? 'bg-green-900/30 border-green-500'
                                            : 'bg-red-900/30 border-red-500'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold">
                                                Test Case {result.testCase}
                                            </span>
                                            <span className={`text-xs font-bold ${result.passed ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {result.passed ? '✓ PASSED' : '✗ FAILED'}
                                            </span>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <div className="text-gray-400 dark:text-gray-500">
                                                Input: <span className="text-white">{JSON.stringify(result.input)}</span>
                                            </div>
                                            <div className="text-gray-400 dark:text-gray-500">
                                                Expected: <span className="text-white">{JSON.stringify(result.expected)}</span>
                                            </div>
                                            <div className="text-gray-400 dark:text-gray-500">
                                                Got: <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                                                    {result.error ? `Error: ${result.error}` : JSON.stringify(result.actual)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodingSolver;
