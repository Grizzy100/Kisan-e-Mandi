import React, { useState } from "react";
import { MdSearch, MdNotifications, MdShield } from "react-icons/md";
import { ThemeToggle } from "./ThemeToggle";

export default function AdminNavbar() {
    const [search, setSearch] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tickets, users..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3 ml-4">
                {/* Theme toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                    <MdNotifications className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </button>

                {/* Admin badge + Avatar */}
                <div className="flex items-center gap-2.5 pl-3 border-l border-gray-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white leading-tight">{user.name || "Admin"}</p>
                        <div className="flex items-center gap-1 justify-end">
                            <MdShield className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">Admin</span>
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">
                            {user.name?.[0]?.toUpperCase() || "A"}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
