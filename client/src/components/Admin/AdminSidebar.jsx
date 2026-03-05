import React, { useState } from "react";
import {
    MdDashboard,
    MdConfirmationNumber,
    MdPeople,
    MdPerson,
    MdBugReport,
    MdLogout,
    MdChevronLeft,
    MdChevronRight,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NAV = [
    { key: "analytics", label: "Analytics", icon: MdDashboard },
    { key: "tickets", label: "Tickets", icon: MdConfirmationNumber, badge: true },
    { key: "vendors", label: "Manage Vendors", icon: MdPeople },
    { key: "customers", label: "Manage Customers", icon: MdPerson },
    { key: "problems", label: "Problems", icon: MdBugReport },
];

export default function AdminSidebar({ currentSection, onSectionChange }) {
    const [minimized, setMinimized] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/admin/login");
    };

    return (
        <motion.aside
            animate={{ width: minimized ? 72 : 240 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="flex flex-col h-full bg-gray-900 border-r border-gray-800 flex-shrink-0 relative"
        >
            {/* Collapse toggle */}
            <button
                onClick={() => setMinimized(!minimized)}
                className="absolute -right-3 top-8 w-6 h-6 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full flex items-center justify-center z-10 transition-colors"
            >
                {minimized ? (
                    <MdChevronRight className="w-3.5 h-3.5 text-gray-300" />
                ) : (
                    <MdChevronLeft className="w-3.5 h-3.5 text-gray-300" />
                )}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">K</span>
                </div>
                <AnimatePresence>
                    {!minimized && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="text-white text-sm font-bold whitespace-nowrap">Kisan-e-Mandi</p>
                            <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Admin Panel</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {NAV.map((item) => {
                    const active = currentSection === item.key;
                    return (
                        <div key={item.key} className="relative group">
                            <button
                                onClick={() => onSectionChange(item.key)}
                                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                    } ${minimized ? "justify-center px-2" : ""}`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <AnimatePresence>
                                    {!minimized && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                            {/* Tooltip when minimized */}
                            {minimized && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                    {item.label}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div className="p-3 border-t border-gray-800 space-y-2">
                <AnimatePresence>
                    {!minimized && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 px-2 py-1"
                        >
                            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase() || "A"}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-white text-xs font-semibold truncate">{user.name || "Admin"}</p>
                                <p className="text-gray-500 text-[10px] truncate">{user.email}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-all ${minimized ? "justify-center" : ""
                        }`}
                >
                    <MdLogout className="w-5 h-5 flex-shrink-0" />
                    {!minimized && <span>Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
}
