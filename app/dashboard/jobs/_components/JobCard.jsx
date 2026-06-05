"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Trash2, ExternalLink, ChevronRight } from "lucide-react";

function JobCard({ job, onStatusChange, onDelete, statuses }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative group"
        >
            {/* Menu Button */}
            <div className="absolute top-2 right-2">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                >
                    <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
                {showMenu && (
                    <div className="absolute right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this job?")) {
                                    onDelete(job.id);
                                }
                                setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:bg-red-900/20 flex items-center gap-2 rounded-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Company & Role */}
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 pr-8">{job.companyName}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{job.jobRole}</p>

            {/* Details */}
            <div className="space-y-1 mb-3">
                {job.salary && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">💰 {job.salary}</p>
                )}
                {job.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">📍 {job.location}</p>
                )}
            </div>

            {/* Job URL */}
            {job.jobUrl && (
                <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-3"
                >
                    View Job <ExternalLink className="w-3 h-3" />
                </a>
            )}

            {/* Notes */}
            {job.notes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 italic mb-3 line-clamp-2">
                    "{job.notes}"
                </p>
            )}

            {/* Status Change Dropdown */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <select
                    value={job.status}
                    onChange={(e) => onStatusChange(job.id, e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                    {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date */}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Added {new Date(job.createdAt).toLocaleDateString()}
            </p>
        </motion.div>
    );
}

export default JobCard;
