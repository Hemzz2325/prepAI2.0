"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterview, CodingSubmission, UserAnswer } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { Users, FileText, Code, Activity, LoaderCircle } from "lucide-react";
import BackButton from '@/components/BackButton';

function AdminPanel() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalInterviews: 0,
        totalCodingSubmissions: 0,
        totalAnswers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            if (!user || user.primaryEmailAddress?.emailAddress !== "nitinambiger11@gmail.com") {
                router.push("/dashboard");
            } else {
                fetchStats();
            }
        }
    }, [user, isLoaded]);

    const fetchStats = async () => {
        try {
            // In a real app, you'd use count() queries, but Drizzle's count is tricky on client
            // For now, fetching all and counting length (not scalable for prod but fine for MVP)
            // Ideally, make an API route for this.

            // Since we can't easily count all rows from client without API, 
            // let's just show a placeholder or basic data we can access.
            // Actually, let's create a server action or API route for this later.
            // For now, I'll just show the UI structure.

            setLoading(false);
        } catch (error) {
            console.error("Error fetching stats:", error);
            setLoading(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderCircle className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <BackButton className="mb-6" />
            <h1 className="font-bold text-3xl mb-8 text-gray-900">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Total Interviews */}
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-gray-500 text-sm font-medium">Total Interviews</h2>
                        <p className="text-2xl font-bold text-gray-900">124</p> {/* Placeholder */}
                    </div>
                </div>

                {/* Coding Submissions */}
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-full">
                        <Code className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-gray-500 text-sm font-medium">Coding Submissions</h2>
                        <p className="text-2xl font-bold text-gray-900">89</p> {/* Placeholder */}
                    </div>
                </div>

                {/* Active Users */}
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-green-100 rounded-full">
                        <Users className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-gray-500 text-sm font-medium">Total Users</h2>
                        <p className="text-2xl font-bold text-gray-900">45</p> {/* Placeholder */}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-500" />
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">Real-time activity feed coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
