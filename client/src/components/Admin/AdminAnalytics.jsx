import React, { useEffect, useState } from "react";
import { MdPeople, MdStore, MdCheckCircle, MdPendingActions, MdShoppingBag, MdTrendingUp } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import axiosInstance from "../../api/axios";
import { motion } from "framer-motion";

const StatCard = ({ label, value, icon: Icon, color, loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center gap-4"
    >
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-400 text-xs font-medium">{label}</p>
            <p className="text-white text-2xl font-bold mt-0.5">
                {loading ? <span className="inline-block w-12 h-6 bg-gray-700 rounded animate-pulse" /> : value}
            </p>
        </div>
    </motion.div>
);

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/users/stats")
            .then((res) => setStats(res.data))
            .catch((err) => console.error("Stats fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: "Total Users", value: stats?.totalUsers, icon: FaUsers, color: "bg-blue-600" },
        { label: "Farmers", value: stats?.totalFarmers, icon: MdStore, color: "bg-emerald-600" },
        { label: "Customers", value: stats?.totalCustomers, icon: MdPeople, color: "bg-purple-600" },
        { label: "Total Items", value: stats?.totalItems, icon: MdShoppingBag, color: "bg-orange-600" },
        { label: "Pending Tickets", value: stats?.pendingTickets, icon: MdPendingActions, color: "bg-yellow-600" },
        { label: "Live Listings", value: stats?.publishedItems, icon: MdCheckCircle, color: "bg-teal-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
                <p className="text-gray-400 text-sm mt-1">Real-time overview of your platform's health.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((c, i) => (
                    <StatCard key={i} {...c} loading={loading} />
                ))}
            </div>

            {/* Growth note */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-3 bg-emerald-600/20 rounded-xl">
                    <MdTrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-1">Platform Growing</h3>
                    <p className="text-gray-400 text-sm">
                        You have <span className="text-emerald-400 font-semibold">{stats?.pendingTickets ?? "—"}</span> pending ticket{stats?.pendingTickets !== 1 ? "s" : ""} awaiting approval.
                        Review them in the <span className="text-emerald-400 font-semibold">Tickets</span> tab.
                    </p>
                </div>
            </div>
        </div>
    );
}
