import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdSearch, MdNotifications, MdMenu } from "react-icons/md";
import { FiSidebar } from "react-icons/fi";
const DashboardHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  // Dynamically extract the current route
  const currentPath = location.pathname.replace("/", "").replace("-", " ") || "overview";
  const capitalized = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className="ml-2 sticky top-0 z-10 bg-gradient-to-r from-green-100 via-white to-green-50 shadow-sm px-4 py-3 border-b border-gray-200">
  <div className="h-12 flex items-center justify-between">
    {/* Left: Sidebar Toggle & Breadcrumb */}
    <div className="flex items-center gap-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Toggle Sidebar"
      >
        <FiSidebar className="w-6 h-6 text-gray-600" />
      </button>

      <nav className="hidden md:flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-green-700 font-medium transition">
          Dashboard
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-green-700 font-semibold capitalize">{capitalized}</span>
      </nav>
    </div>

    {/* Right: Search & Notifications */}
    <div className="flex items-center gap-4">
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search anything..."
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
      </div>

      <button
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <MdNotifications className="w-6 h-6 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
    </div>
  </div>
</header>

  );
};

export default DashboardHeader;
