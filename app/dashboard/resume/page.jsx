"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle, Upload, Lock } from "lucide-react";
import BackButton from '@/components/BackButton';
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { ResumeAnalysis } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import moment from "moment";
import { usePlan } from "@/hooks/usePlan";
import Link from "next/link";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function ResumeAnalyzer() {
    const { user } = useUser();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [resumeHistory, setResumeHistory] = useState([]);
    const { canUse, used, limit, consume } = usePlan("resumeAnalyses");

    useEffect(() => {
        user && GetResumeHistory();
    }, [user]);

    const GetResumeHistory = async () => {
        try {
            const result = await db
                .select()
                .from(ResumeAnalysis)
                .where(eq(ResumeAnalysis.userEmail, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(ResumeAnalysis.createdAt));
            setResumeHistory(result);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const fileToGenerativePart = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1];
                resolve({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type,
                    },
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onAnalyze = async () => {
        if (!file) { toast.error("Please upload a resume first."); return; }
        if (!canUse) { toast.error(`Weekly limit reached (${used}/${limit}). Upgrade to Pro!`); return; }
        setLoading(true);
        try {
            const imagePart = await fileToGenerativePart(file);

            const prompt = `Analyze this resume and provide an ATS score (0-100) and detailed feedback on how to improve it. 
      
      IMPORTANT: Return the response in strictly JSON format with the following structure:
      {
        "score": number,
        "feedback": "General feedback summary",
        "improvements": ["Point 1", "Point 2", "Point 3"]
      }
      `;

            // Retry logic with exponential backoff
            let retries = 3;
            let delay = 2000; // Start with 2 seconds for resume analysis
            let result = null;

            for (let i = 0; i < retries; i++) {
                try {
                    result = await chatSession.sendMessage([prompt, imagePart]);
                    break; // Success, exit retry loop
                } catch (error) {
                    if (error.message.includes('429') || error.message.includes('Resource exhausted')) {
                        if (i < retries - 1) {
                            console.log(`Rate limit hit, retrying in ${delay}ms...`);
                            toast.info(`API rate limit reached. Retrying in ${delay / 1000} seconds...`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            delay *= 2; // Exponential backoff
                        } else {
                            throw new Error('API rate limit exceeded. Please wait a moment and try again.');
                        }
                    } else {
                        throw error; // Re-throw non-rate-limit errors
                    }
                }
            }

            const responseText = result.response.text();

            // Clean up JSON
            const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
            const jsonResponse = JSON.parse(cleanedResponse);

            setAnalysisResult(jsonResponse);

            // Save to DB + consume one slot
            await consume();
            await db.insert(ResumeAnalysis).values({
                userEmail: user?.primaryEmailAddress?.emailAddress,
                score: jsonResponse.score.toString(),
                feedback: jsonResponse.feedback,
                createdAt: moment().format('DD-MM-YYYY')
            });

            toast.success("Analysis complete & saved!");
            GetResumeHistory(); // Refresh history
        } catch (error) {
            console.error("Analysis failed:", error);
            if (error.message.includes('429') || error.message.includes('Resource exhausted') || error.message.includes('rate limit')) {
                toast.error("API rate limit exceeded. Please wait 15-20 seconds and try again.");
            } else {
                toast.error("Failed to analyze resume: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Prepare Chart Data
    const chartData = resumeHistory.map((item, index) => ({
        name: `Scan ${resumeHistory.length - index}`, // Reverse order for display
        score: Number(item.score),
        date: item.createdAt
    })).reverse(); // Show oldest to newest left to right

    return (
        <div className="p-10 md:px-20 lg:px-32 min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <BackButton variant="inline" className="mb-0" />
                <div>
                    <h2 className="font-bold text-3xl text-gray-900 dark:text-white">Resume Analyzer</h2>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm md:text-base">AI-powered resume analysis and feedback.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Left Column: Upload Section & History */}
                <div className="flex flex-col gap-6 lg:sticky lg:top-10 h-fit">
                    <div className={`p-8 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 flex flex-col items-center justify-center transition-all duration-300 ${analysisResult ? 'h-auto py-10' : 'h-[400px]'}`}>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
                            <Upload className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Upload Your Resume</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-8 text-center max-w-xs">
                            Upload your resume (PDF, DOCX, Image) to get an instant ATS score and personalized feedback.
                        </p>

                        <Input
                            type="file"
                            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            className="max-w-xs mb-4"
                        />

                        {!canUse ? (
                            <div className="flex flex-col items-center gap-3 py-8 text-center">
                                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                    <Lock className="w-6 h-6 text-orange-500" />
                                </div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">Weekly Limit Reached</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{used}/{limit} free analyses used. Resets Monday.</p>
                                <Link href="/upgrade">
                                    <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm">
                                        Upgrade to Pro — ₹100
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                        <Button
                            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={onAnalyze}
                            disabled={loading || !file}
                        >
                            {loading ? (<><LoaderCircle className="animate-spin mr-2" />Analyzing...</>) : `Analyze Resume (${used}/${limit} used)`}
                        </Button>
                        )}
                    </div>

                    {/* History Chart */}
                    {resumeHistory.length > 0 && (
                        <div className="p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">Score History</h3>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis domain={[0, 100]} hide />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#4F46E5"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="flex flex-col gap-6">
                    {analysisResult && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                            {/* Score Card */}
                            <div className="p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 relative overflow-hidden flex flex-col justify-center items-center text-center">
                                <div className={`absolute top-0 left-0 w-full h-2 ${analysisResult.score >= 80 ? "bg-green-500" : analysisResult.score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}></div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">ATS Score</h3>
                                <div className={`text-6xl font-black mb-2 ${analysisResult.score >= 80 ? "text-green-600" : analysisResult.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                                    {analysisResult.score}
                                </div>
                                <span className="text-gray-400 dark:text-gray-500 font-medium">out of 100</span>

                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6 max-w-[200px]">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${analysisResult.score >= 80 ? "bg-green-500" : analysisResult.score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                        style={{ width: `${analysisResult.score}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Feedback Card */}
                            <div className="p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">💡</span> Feedback
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                    {analysisResult.feedback}
                                </p>
                            </div>

                            {/* Improvements Card */}
                            <div className="p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">🚀</span> Improvements
                                </h4>
                                <ul className="space-y-3">
                                    {analysisResult.improvements.map((item, index) => (
                                        <li key={index} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-bold text-purple-500 select-none">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumeAnalyzer;
