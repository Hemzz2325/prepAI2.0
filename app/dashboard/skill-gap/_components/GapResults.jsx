"use client";
import React from "react";
import { CheckCircle2, XCircle, TrendingUp, Lightbulb, Target } from "lucide-react";

function GapResults({ analysis }) {
    if (!analysis) return null;

    const { skillsHave, skillsNeeded, gaps, roadmap, projectSuggestions, resumeImprovements } = analysis;

    return (
        <div className="space-y-6">
            {/* Skills You Have */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Skills You Have
                </h3>
                <div className="flex flex-wrap gap-2">
                    {skillsHave.map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-full text-sm font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Skill Gaps */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Skills You Need to Learn
                </h3>
                <div className="space-y-3">
                    {gaps.map((gap, index) => (
                        <div
                            key={index}
                            className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/40"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900 dark:text-white">{gap.skill}</h4>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${gap.priority === "High"
                                            ? "bg-red-100 dark:bg-red-900/30 text-red-700"
                                            : gap.priority === "Medium"
                                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700"
                                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700"
                                        }`}
                                >
                                    {gap.priority} Priority
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{gap.reason}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Learning Roadmap */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Your Learning Roadmap
                </h3>
                <div className="space-y-4">
                    {roadmap.map((week, index) => (
                        <div
                            key={index}
                            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {week.week}
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{week.focus}</h4>
                            </div>
                            <ul className="space-y-2 ml-13">
                                {week.tasks.map((task, taskIndex) => (
                                    <li
                                        key={taskIndex}
                                        className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                                    >
                                        <span className="text-purple-600 mt-1">•</span>
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Suggestions */}
            {projectSuggestions && projectSuggestions.length > 0 && (
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Project Ideas
                    </h3>
                    <ul className="space-y-2">
                        {projectSuggestions.map((project, index) => (
                            <li
                                key={index}
                                className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                            >
                                <span className="text-blue-600 mt-1">→</span>
                                {project}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Resume Improvements */}
            {resumeImprovements && resumeImprovements.length > 0 && (
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Resume Improvement Tips
                    </h3>
                    <ul className="space-y-2">
                        {resumeImprovements.map((tip, index) => (
                            <li
                                key={index}
                                className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                            >
                                <span className="text-yellow-600 mt-1">💡</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GapResults;
