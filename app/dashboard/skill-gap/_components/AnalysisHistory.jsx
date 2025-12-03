"use client";
import React from "react";
import { Clock, ChevronRight } from "lucide-react";

function AnalysisHistory({ history, onSelect }) {
    if (!history || history.length === 0) {
        return (
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Past Analyses
                </h3>
                <p className="text-sm text-gray-500 text-center py-10">
                    No analyses yet. Start by analyzing your first resume!
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Past Analyses
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {history.map((analysis) => (
                    <div
                        key={analysis.id}
                        onClick={() => onSelect(analysis)}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-600">
                                {analysis.targetRole}
                            </h4>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                        </div>
                        {analysis.targetCompany && (
                            <p className="text-xs text-gray-600 mb-2">
                                @ {analysis.targetCompany}
                            </p>
                        )}
                        <p className="text-xs text-gray-400">
                            {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AnalysisHistory;
