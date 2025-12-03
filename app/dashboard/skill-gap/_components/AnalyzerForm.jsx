"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Upload, Sparkles, FileText, Brain } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { SkillGapAnalysis } from "@/utils/schema";

function AnalyzerForm({ onAnalysisComplete, loading, setLoading }) {
    const { user } = useUser();
    const [resumeText, setResumeText] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [targetCompany, setTargetCompany] = useState("");

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
            toast.error("Please upload a .txt file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setResumeText(event.target.result);
            toast.success("Resume uploaded successfully!");
        };
        reader.readAsText(file);
    };

    const handleAnalyze = async () => {
        if (!resumeText || !targetRole) {
            toast.error("Please provide both resume and target role");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/analyze-skill-gap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText, targetRole, targetCompany }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            // Save to database
            await db.insert(SkillGapAnalysis).values({
                userEmail: user?.primaryEmailAddress?.emailAddress,
                targetRole,
                targetCompany: targetCompany || null,
                skillsHave: JSON.stringify(data.analysis.skillsHave),
                skillsNeeded: JSON.stringify(data.analysis.skillsNeeded),
                gaps: JSON.stringify(data.analysis.gaps),
                roadmap: JSON.stringify(data.analysis.roadmap),
                createdAt: new Date().toISOString(),
            });

            onAnalysisComplete(data.analysis);
            toast.success("Analysis complete!");
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Failed to analyze. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Analyze Your Skills
            </h2>

            {/* Resume Upload */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Resume (TXT)
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                    />
                    <label
                        htmlFor="resume-upload"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                    >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            {resumeText ? "Resume uploaded ✓" : "Click to upload resume"}
                        </span>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Or paste your resume text below
                </p>
                <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="6"
                    placeholder="Paste your resume here..."
                />
            </div>

            {/* Target Role */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Job Role *
                </label>
                <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Senior React Developer"
                />
            </div>

            {/* Target Company (Optional) */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Company (Optional)
                </label>
                <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Google, Amazon"
                />
            </div>

            {/* Analyze Button */}
            <button
                onClick={handleAnalyze}
                disabled={loading || !resumeText || !targetRole}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Brain className="w-5 h-5" />
                        Analyze Skills
                    </>
                )}
            </button>
        </div>
    );
}

export default AnalyzerForm;
