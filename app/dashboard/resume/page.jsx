"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle, Upload } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function ResumeAnalyzer() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

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
        if (!file) {
            toast.error("Please upload a resume first.");
            return;
        }

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
            toast.success("Analysis complete!");
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

    return (
        <div className="p-10 md:px-20 lg:px-32 min-h-screen bg-gray-50">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                    &larr; Back
                </Button>
                <div>
                    <h2 className="font-bold text-3xl text-gray-900">Resume Analyzer</h2>
                    <p className="text-gray-500">AI-powered resume analysis and feedback.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Left Column: Upload Section (Sticky) */}
                <div className="lg:sticky lg:top-10 h-fit">
                    <div className={`p-8 border rounded-2xl shadow-sm bg-white flex flex-col items-center justify-center transition-all duration-300 ${analysisResult ? 'h-auto py-10' : 'h-[400px]'}`}>
                        <div className="bg-blue-50 p-6 rounded-full mb-6">
                            <Upload className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Upload Your Resume</h3>
                        <p className="text-sm text-gray-500 mb-8 text-center max-w-xs">
                            Upload your resume (PDF, DOCX, Image) to get an instant ATS score and personalized feedback.
                        </p>

                        <Input
                            type="file"
                            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            className="max-w-xs mb-4"
                        />

                        <Button
                            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={onAnalyze}
                            disabled={loading || !file}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="animate-spin mr-2" />
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze Resume"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="flex flex-col gap-6">
                    {analysisResult && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                            {/* Score Card */}
                            <div className="p-6 border rounded-2xl shadow-sm bg-white relative overflow-hidden flex flex-col justify-center items-center text-center">
                                <div className={`absolute top-0 left-0 w-full h-2 ${analysisResult.score >= 80 ? "bg-green-500" : analysisResult.score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}></div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">ATS Score</h3>
                                <div className={`text-6xl font-black mb-2 ${analysisResult.score >= 80 ? "text-green-600" : analysisResult.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                                    {analysisResult.score}
                                </div>
                                <span className="text-gray-400 font-medium">out of 100</span>

                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6 max-w-[200px]">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${analysisResult.score >= 80 ? "bg-green-500" : analysisResult.score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                        style={{ width: `${analysisResult.score}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Feedback Card */}
                            <div className="p-6 border rounded-2xl shadow-sm bg-white">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="p-2 bg-blue-100 rounded-lg text-blue-600">💡</span> Feedback
                                </h4>
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    {analysisResult.feedback}
                                </p>
                            </div>

                            {/* Improvements Card */}
                            <div className="p-6 border rounded-2xl shadow-sm bg-white">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="p-2 bg-purple-100 rounded-lg text-purple-600">🚀</span> Improvements
                                </h4>
                                <ul className="space-y-3">
                                    {analysisResult.improvements.map((item, index) => (
                                        <li key={index} className="flex gap-3 text-sm text-gray-700">
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
