import React from "react";
import { MdMonitor, MdLightMode, MdDarkMode } from "react-icons/md";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const OPTIONS = [
    { icon: MdDarkMode, value: "dark", label: "Dark" },
    { icon: MdLightMode, value: "light", label: "Light" },
];

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="inline-flex items-center gap-0.5 bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-lg p-0.5">
            {OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    aria-label={opt.label}
                    className={`relative flex items-center justify-center w-7 h-7 rounded-md transition-colors ${theme === opt.value ? "text-white" : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    {theme === opt.value && (
                        <motion.div
                            layoutId="theme-indicator"
                            className="absolute inset-0 bg-gray-600 rounded-md"
                            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                        />
                    )}
                    <opt.icon className="w-3.5 h-3.5 relative z-10" />
                </button>
            ))}
        </div>
    );
}
