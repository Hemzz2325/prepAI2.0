"use client";
import { db } from "@/utils/db";
import { JobApplication } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, desc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Briefcase } from "lucide-react";
import AddJobDialog from "./_components/AddJobDialog";
import JobCard from "./_components/JobCard";
import BackButton from '@/components/BackButton';
import { JobTrackerSkeleton } from "@/components/Skeletons";


const STATUSES = [
    { id: "Applied", label: "📝 Applied", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40" },
    { id: "Interview", label: "📞 Interview", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200" },
    { id: "Shortlisted", label: "⭐ Shortlisted", color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200" },
    { id: "Rejected", label: "❌ Rejected", color: "bg-red-50 dark:bg-red-900/20 border-red-200" },
    { id: "Offer", label: "🎉 Offer", color: "bg-green-50 dark:bg-green-900/20 border-green-200" },
];

function JobTrackerPage() {
    const { user } = useUser();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const result = await db
                .select()
                .from(JobApplication)
                .where(eq(JobApplication.userEmail, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(JobApplication.createdAt));
            setJobs(result);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            await db
                .update(JobApplication)
                .set({ status: newStatus, updatedAt: new Date().toISOString() })
                .where(eq(JobApplication.id, jobId));
            fetchJobs();
        } catch (error) {
            console.error("Error updating job status:", error);
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await db.delete(JobApplication).where(eq(JobApplication.id, jobId));
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    if (loading) return <JobTrackerSkeleton />;

    return (
        <div className="p-5 sm:p-8 md:p-10 bg-background min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <BackButton variant="inline" className="mb-0" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-blue-600" />
                            Job Tracker
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mt-1">
                            Manage your job applications in one place
                        </p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Job
                </motion.button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {STATUSES.map((status) => {
                    const statusJobs = jobs.filter((job) => job.status === status.id);
                    return (
                        <div key={status.id} className="flex flex-col">
                            <div className={`p-4 rounded-t-xl border-2 ${status.color}`}>
                                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                                    {status.label}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                                    {statusJobs.length} {statusJobs.length === 1 ? "job" : "jobs"}
                                </p>
                            </div>
                            <div className="flex-1 bg-white dark:bg-gray-900 border-2 border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl p-3 min-h-[400px] space-y-3">
                                {statusJobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                        statuses={STATUSES}
                                    />
                                ))}
                                {statusJobs.length === 0 && (
                                    <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-10">
                                        No jobs yet
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Job Dialog */}
            {showAddDialog && (
                <AddJobDialog
                    onClose={() => setShowAddDialog(false)}
                    onSuccess={() => {
                        setShowAddDialog(false);
                        fetchJobs();
                    }}
                />
            )}
        </div>
    );
}

export default JobTrackerPage;
