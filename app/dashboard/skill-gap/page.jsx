"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/utils/db";
import { SkillGapAnalysis } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, desc } from "drizzle-orm";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import BackButton from '@/components/BackButton';
import AnalyzerForm from "./_components/AnalyzerForm";
import GapResults from "./_components/GapResults";
import AnalysisHistory from "./_components/AnalysisHistory";
import { usePlan } from "@/hooks/usePlan";

function SkillGapPage() {
    const { user } = useUser();
    const [currentAnalysis, setCurrentAnalysis] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const { canUse, used, limit, consume } = usePlan("skillGapAnalyses");

    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        try {
            const result = await db
                .select()
                .from(SkillGapAnalysis)
                .where(eq(SkillGapAnalysis.userEmail, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(SkillGapAnalysis.createdAt));
            setHistory(result);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    const handleAnalysisComplete = (analysis) => {
        setCurrentAnalysis(analysis);
        fetchHistory();
    };

    return (
        <div className="p-5 sm:p-8 md:p-10 bg-background min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-4"
            >
                <BackButton variant="inline" className="mb-0" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Brain className="w-8 h-8 text-purple-600" />
                        Skill Gap Analyzer
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mt-1">
                        Get a personalized learning roadmap to land your dream job
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Analyzer Form */}
                <div className="lg:col-span-2">
                    <AnalyzerForm
                        onAnalysisComplete={handleAnalysisComplete}
                        loading={loading}
                        setLoading={setLoading}
                        canUse={canUse}
                        used={used}
                        limit={limit}
                        consume={consume}
                    />

                    {/* Results */}
                    {currentAnalysis && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6"
                        >
                            <GapResults analysis={currentAnalysis} />
                        </motion.div>
                    )}
                </div>

                {/* Right: History */}
                <div>
                    <AnalysisHistory
                        history={history}
                        onSelect={(analysis) => {
                            setCurrentAnalysis({
                                skillsHave: JSON.parse(analysis.skillsHave),
                                skillsNeeded: JSON.parse(analysis.skillsNeeded),
                                gaps: JSON.parse(analysis.gaps),
                                roadmap: JSON.parse(analysis.roadmap),
                                projectSuggestions: analysis.projectSuggestions
                                    ? JSON.parse(analysis.projectSuggestions)
                                    : [],
                                resumeImprovements: analysis.resumeImprovements
                                    ? JSON.parse(analysis.resumeImprovements)
                                    : [],
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default SkillGapPage;
