"use client";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import SkillRadarChart from "../_components/SkillRadarChart";
import ActivityHeatmap from "../_components/ActivityHeatmap";
import { PerformanceSkeleton } from "@/components/Skeletons";

function PerformanceDashboard() {
    const { user } = useUser();
    const [userAnswers, setUserAnswers] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        user && GetPerformanceData();
    }, [user]);

    const GetPerformanceData = async () => {
        setLoading(true);
        try {
            // Fetch all user answers
            const answerResult = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(UserAnswer.createdAt));

            setUserAnswers(answerResult);

            // Fetch all interviews
            const interviewResult = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.createdAt));

            setInterviews(interviewResult);
        } catch (error) {
            console.error("Error fetching performance data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Stats
    const totalInterviews = interviews.length;
    const totalQuestionsAnswered = userAnswers.length;

    const averageRating =
        userAnswers.length > 0
            ? (
                userAnswers.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) /
                userAnswers.length
            ).toFixed(1)
            : 0;

    // Prepare Chart Data: Average Rating per Interview (Mock ID)
    const interviewRatings = {};
    userAnswers.forEach((ans) => {
        if (!interviewRatings[ans.mockIdRef]) {
            interviewRatings[ans.mockIdRef] = { total: 0, count: 0, date: ans.createdAt };
        }
        interviewRatings[ans.mockIdRef].total += Number(ans.rating) || 0;
        interviewRatings[ans.mockIdRef].count += 1;
    });

    const chartData = Object.keys(interviewRatings).map((mockId, index) => ({
        name: `Interview ${index + 1}`,
        rating: (
            interviewRatings[mockId].total / interviewRatings[mockId].count
        ).toFixed(1),
        date: interviewRatings[mockId].date,
    }));

    // Identify Weak Areas (Questions with rating < 3)
    const weakAreas = userAnswers.filter((ans) => Number(ans.rating) < 3);

    if (loading) return <PerformanceSkeleton />;

    return (
        <div className="p-10 bg-background min-h-screen">
            <h2 className="font-bold text-3xl text-gray-900 dark:text-white mb-6">Performance Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium mb-2">Total Interviews</h3>
                    <p className="text-4xl font-bold text-blue-600">{totalInterviews}</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium mb-2">Questions Answered</h3>
                    <p className="text-4xl font-bold text-purple-600">{totalQuestionsAnswered}</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium mb-2">Average Rating</h3>
                    <p className="text-4xl font-bold text-green-600">{averageRating}/5</p>
                </div>
            </div>

            {/* Skill Analysis & Heatmap Section */}
            {/* Skill Analysis & Heatmap Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                <div className="h-full">
                    <SkillRadarChart />
                </div>
                <div className="h-full">
                    <ActivityHeatmap interviewList={interviews} />
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                {/* Rating Trend */}
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">Rating Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                                <YAxis domain={[0, 5]} stroke="#888" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="rating"
                                    stroke="#4F46E5"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weak Areas List */}
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-y-auto max-h-[400px]">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> Weak Areas (Rating &lt; 3)
                    </h3>
                    {weakAreas.length > 0 ? (
                        <div className="space-y-4">
                            {weakAreas.map((area, index) => (
                                <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/40">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                        Q: {area.question}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-2">
                                        Your Answer: {area.userAns?.substring(0, 100)}...
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                                            Rating: {area.rating}/5
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">{area.createdAt}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-center py-10">Great job! No weak areas found yet.</p>
                    )}
                </div>
            </div>

            {/* All Interviews Section */}
            <div className="mb-10">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-blue-500">📋</span> All Your Interviews
                    </h3>
                    {interviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {interviews.map((interview, index) => {
                                // Calculate average rating for this interview
                                const interviewAnswers = userAnswers.filter(ans => ans.mockIdRef === interview.mockId);
                                const avgRating = interviewAnswers.length > 0
                                    ? (interviewAnswers.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / interviewAnswers.length).toFixed(1)
                                    : 'N/A';

                                return (
                                    <div
                                        key={index}
                                        className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800/40 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => window.location.href = `/dashboard/interveiw/${interview.mockId}/feedback`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                                    {interview.jobPosition}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">
                                                    {interview.interviewRound || 'Technical Round'}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {interview.jobExperience} years exp
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-lg font-bold ${avgRating === 'N/A' ? 'text-gray-400 dark:text-gray-500' :
                                                    Number(avgRating) >= 4 ? 'text-green-600' :
                                                        Number(avgRating) >= 3 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {avgRating}
                                                </span>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {avgRating !== 'N/A' ? '/5' : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-blue-200 dark:border-blue-700/40">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                                                {interviewAnswers.length} questions answered
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {interview.createdAt}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-center py-10">No interviews yet. Start your first interview!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PerformanceDashboard;
