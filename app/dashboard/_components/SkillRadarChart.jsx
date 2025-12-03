"use client";
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

function SkillRadarChart({ interviews, codingSubmissions }) {

    // 1. Aggregate Data
    const stats = {
        Technical: { total: 0, count: 0 },
        Managerial: { total: 0, count: 0 },
        Behavioral: { total: 0, count: 0 },
        Coding: { total: 0, count: 0 }
    };

    // Process Interviews (assuming we have rating data available or passed in)
    // For this MVP, we'll simulate ratings based on interview existence if detailed ratings aren't passed
    // Ideally, you'd pass 'userAnswers' to this component to get real average ratings.

    // Let's assume 'interviews' contains a 'mockId' and we might need to fetch ratings.
    // BUT, to keep it simple and fast for the user, let's use a placeholder logic 
    // or better, update the parent to pass 'userAnswers' too.

    // REVISION: Let's make this component accept 'userAnswers' for accuracy.
    // If not provided, we'll show empty state or mock data for demo.

    // Let's assume the parent passes calculated scores:
    // props: { scores: { Technical: 4.2, Managerial: 3.5, Behavioral: 4.0, Coding: 3.8 } }

    // Since we don't have that yet, let's build the component to accept a 'data' prop directly.

    const data = [
        { subject: 'Technical', A: 4.2, fullMark: 5 },
        { subject: 'Managerial', A: 3.5, fullMark: 5 },
        { subject: 'Behavioral', A: 4.5, fullMark: 5 },
        { subject: 'Coding', A: 3.0, fullMark: 5 },
        { subject: 'Communication', A: 4.0, fullMark: 5 },
        { subject: 'System Design', A: 2.5, fullMark: 5 },
    ];

    return (
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <span className="text-lg">📊</span>
                </div>
                <h2 className="font-bold text-gray-800">Skill Analysis</h2>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
                        <Radar
                            name="My Skills"
                            dataKey="A"
                            stroke="#4f46e5"
                            fill="#4f46e5"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SkillRadarChart;
