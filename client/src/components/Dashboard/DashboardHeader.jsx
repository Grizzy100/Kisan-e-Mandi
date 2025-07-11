import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdSearch, MdNotifications, MdMail, MdMenu, MdChevronLeft } from "react-icons/md";

const DashboardHeader = ({ sidebarOpen, setSidebarOpen, isSidebarMinimized, setIsSidebarMinimized }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  const currentPath = location.pathname.replace("/", "").replace("-", " ") || "overview";
  const capitalized = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className="sticky top-0 z-10 bg-gray-50 w-full max-w-full px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 shadow">
      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <button
  onClick={() => setIsSidebarMinimized((prev) => !prev)}
  className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
>
  {isSidebarMinimized ? (
    <MdMenu className="w-3 h-3 text-gray-600" />
  ) : (
    <MdChevronLeft className="w-3 h-3 text-gray-600" />
  )}
</button>

          <nav className="flex items-center text-sm text-gray-500 truncate">
            <Link to="/" className="hover:text-green-700 font-medium transition">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-green-700 font-semibold capitalize">{capitalized}</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative w-40 sm:w-52 md:w-64">
            <MdSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search anything..."
              className="w-full pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">⌘F</span>
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MdMail className="w-5 h-5" />
          </button>

          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <MdNotifications className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center space-x-3 group cursor-pointer hover:bg-gray-200 px-2 py-1 rounded-md transition">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
            />
            {user && (
              <div className="text-sm">
                <div className="font-medium text-gray-900 truncate">{user.name || "User"}</div>
                <div className="text-gray-500 text-xs truncate">{user.email}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex lg:hidden items-center justify-between w-full">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          <MdMenu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative w-24 sm:w-32 md:w-40">
          <MdSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MdMail className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <MdNotifications className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          <div className="relative group cursor-pointer">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover"
            />
            {user && (
              <div className="absolute top-full right-0 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
