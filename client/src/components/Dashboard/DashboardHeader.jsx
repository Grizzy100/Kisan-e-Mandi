import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdSearch, MdNotifications, MdMail, MdChevronLeft, MdChevronRight, MdMenu } from "react-icons/md";

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch (err) { console.error("Failed to parse user", err); }
    }
  }, []);

  const path = location.pathname.split("/").pop() || "overview";
  const currentPath = path === "dashboard" ? "overview" : path.replace("-", " ");
  const capitalized = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className="sticky top-0 z-[40] bg-white border-b border-gray-100 py-3 px-4 md:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Left: Sidebar Toggle & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
          >
            {sidebarOpen ? <MdChevronLeft className="w-5 h-5 text-gray-500" /> : <MdChevronRight className="w-5 h-5 text-gray-500" />}
          </button>

          <nav className="hidden sm:flex items-center text-xs font-black tracking-[0.1em]">
            <Link to="/dashboard" className="text-gray-400 hover:text-green-600 transition">DASHBOARD</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-emerald-700 uppercase">{path === 'dashboard' || !path ? 'OVERVIEW' : capitalized}</span>
          </nav>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Search Bar - Minimalist */}
          <div className="relative hidden sm:block">
            <MdSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search..."
              className="w-48 md:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50 focus:outline-none transition-all text-xs"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-sm transition-all relative">
              <MdNotifications className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-sm transition-all">
              <MdMail className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block" />

          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-800 truncate leading-none mb-1">{user?.name || "User"}</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none">{user?.role || "Member"}</p>
            </div>
            <div className="relative">
              <img
                src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "U") + "&background=10b981&color=fff"}
                alt="Profile"
                className="w-9 h-9 rounded-sm object-cover ring-2 ring-transparent group-hover:ring-green-100 transition-all"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
