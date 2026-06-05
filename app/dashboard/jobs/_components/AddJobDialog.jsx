"use client";
import React, { useState } from "react";
import { db } from "@/utils/db";
import { JobApplication } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import { toast } from "sonner";

function AddJobDialog({ onClose, onSuccess }) {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        companyName: "",
        jobRole: "",
        salary: "",
        location: "",
        jobUrl: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.companyName || !formData.jobRole) {
            toast.error("Company name and job role are required!");
            return;
        }

        try {
            setLoading(true);
            await db.insert(JobApplication).values({
                userEmail: user?.primaryEmailAddress?.emailAddress,
                companyName: formData.companyName,
                jobRole: formData.jobRole,
                salary: formData.salary || null,
                location: formData.location || null,
                jobUrl: formData.jobUrl || null,
                notes: formData.notes || null,
                status: "Applied",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            toast.success("Job added successfully!");
            onSuccess();
        } catch (error) {
            console.error("Error adding job:", error);
            toast.error("Failed to add job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Job</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Company Name *
                        </label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) =>
                                setFormData({ ...formData, companyName: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Google"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Job Role *
                        </label>
                        <input
                            type="text"
                            value={formData.jobRole}
                            onChange={(e) =>
                                setFormData({ ...formData, jobRole: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Senior Software Engineer"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Salary
                            </label>
                            <input
                                type="text"
                                value={formData.salary}
                                onChange={(e) =>
                                    setFormData({ ...formData, salary: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., $120k"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Remote"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Job URL
                        </label>
                        <input
                            type="url"
                            value={formData.jobUrl}
                            onChange={(e) =>
                                setFormData({ ...formData, jobUrl: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            placeholder="Any additional notes..."
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddJobDialog;
