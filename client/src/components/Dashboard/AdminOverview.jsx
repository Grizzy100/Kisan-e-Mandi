import React from "react";
import { MdPeople, MdPendingActions, MdLocalShipping, MdAttachMoney } from "react-icons/md";

export default function AdminOverview() {
    const stats = [
        { label: "Total Users", value: "1,245", icon: MdPeople, color: "bg-blue-500" },
        { label: "Pending Approvals", value: "12", icon: MdPendingActions, color: "bg-yellow-500" },
        { label: "Active Orders", value: "348", icon: MdLocalShipping, color: "bg-green-500" },
        { label: "Revenue (Mtd)", value: "₹45,200", icon: MdAttachMoney, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
                <p className="text-gray-500 text-sm">Monitor system health, user activity, and compliance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-4 rounded-xl text-white ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Activity Logs */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent System Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-gray-500 font-medium">SYS</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900">
                                        <span className="font-semibold">New Crop Verification</span> request submitted by Ramesh Singh.
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors text-left flex items-center justify-between">
                            Review Pending Crops
                            <MdPendingActions className="w-5 h-5" />
                        </button>
                        <button className="w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors text-left flex items-center justify-between">
                            Manage Users
                            <MdPeople className="w-5 h-5" />
                        </button>
                        <button className="w-full py-3 px-4 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors text-left flex items-center justify-between">
                            Payout Requests
                            <MdAttachMoney className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
