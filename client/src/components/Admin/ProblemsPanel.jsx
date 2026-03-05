import React from "react";
import { MdBugReport } from "react-icons/md";

export default function ProblemsPanel() {
    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-white">Reported Problems</h1>
                <p className="text-gray-400 text-sm mt-0.5">Issues reported by farmers and customers will appear here.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-800 border border-gray-700 rounded-2xl">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <MdBugReport className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">No reported problems yet</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                    When users report issues via the Help system, they'll show up here for review.
                </p>
            </div>
        </div>
    );
}
