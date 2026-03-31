import React, { useState } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminNavbar from "../components/Admin/AdminNavbar";
import AdminAnalytics from "../components/Admin/AdminAnalytics";
import TicketsPanel from "../components/Admin/TicketsPanel";
import VendorsPanel from "../components/Admin/VendorsPanel";
import CustomersPanel from "../components/Admin/CustomersPanel";
import ProblemsPanel from "../components/Admin/ProblemsPanel";
import { AnimatePresence, motion } from "framer-motion";

// Panels map
const PANELS = {
    analytics: AdminAnalytics,
    approvals: TicketsPanel,
    vendors: VendorsPanel,
    customers: CustomersPanel,
    problems: ProblemsPanel,
};

const AdminDashboard = () => {
    const [currentSection, setCurrentSection] = useState("analytics");

    const ActivePanel = PANELS[currentSection] || AdminAnalytics;

    return (
        <ThemeProvider>
            {/* Force dark background regardless of other CSS */}
            <div className="flex h-screen overflow-hidden bg-gray-950 font-sans">
                {/* Sidebar */}
                <AdminSidebar
                    currentSection={currentSection}
                    onSectionChange={setCurrentSection}
                />

                {/* Main */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Navbar */}
                    <AdminNavbar />

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ActivePanel />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default AdminDashboard;
