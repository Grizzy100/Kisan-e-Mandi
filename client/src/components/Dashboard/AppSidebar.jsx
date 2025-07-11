import React, { useEffect, useState } from "react";
import {
  MdDashboard,
  MdShoppingCart,
  MdHelp,
  MdHistory,
  MdGroup,
  MdSettings,
  MdCreditCard,
  MdLogout,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

export function AppSidebar({
  isOpen,
  setIsOpen,
  onSectionChange,
  currentSection,
  isMinimized,
  setIsMinimized,
}) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsMinimized(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { title: "Dashboard", key: "dashboard", icon: MdDashboard },
    { title: "Items", key: "item", icon: MdShoppingCart, badge: "10" },
    { title: "Help & Support", key: "help", icon: MdHelp },
    { title: "Orders", key: "orders", icon: MdHistory },
    { title: "Community", key: "community", icon: MdGroup },
  ];

  const settingsItems = [
    { title: "Settings", key: "settings", icon: MdSettings },
    { title: "Billing", key: "billing", icon: MdCreditCard },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      width: 256,
      transition: { type: "spring", stiffness: 150, damping: 20 },
    },
    closed: {
      x: 0,
      width: 80,
      transition: { type: "spring", stiffness: 150, damping: 20 },
    },
    mobileHidden: {
      x: "-100%",
      width: 256,
      transition: { type: "tween", duration: 0.3 },
    },
    mobileVisible: {
      x: 0,
      width: 256,
      transition: { type: "tween", duration: 0.3 },
    },
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("user");
    toast.success("Logged out successfully 👋");
    navigate("/login");
  };

  const renderButton = (item) => {
    const isActive = currentSection === item.key;
    return (
      <div className="relative group" key={item.key}>
        <button
          onClick={() => {
            onSectionChange(item.key);
            if (isMobile) setIsOpen(false);
          }}
          className={`flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3 rounded-lg w-full text-[11px] sm:text-sm transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-br from-green-500 to-green-700 text-white shadow"
              : "text-gray-600 hover:bg-gray-100 hover:text-green-700"
          } ${isMinimized ? "justify-center px-0" : ""}`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            {!isMinimized && <span className="font-medium">{item.title}</span>}
          </div>
          {!isMinimized && item.badge && (
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
              {item.badge}
            </span>
          )}
        </button>

        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-1.5 py-0.5 text-[10px] sm:text-xs rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
          >
            {item.title}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:relative top-0 left-0 h-full bg-white shadow-lg flex flex-col z-50 lg:z-0`}
        variants={isMobile ? sidebarVariants : sidebarVariants}
        animate={
          isMobile ? (isOpen ? "mobileVisible" : "mobileHidden") : isMinimized ? "closed" : "open"
        }
        initial={false}
      >
        {/* Logo */}
        <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md bg-white flex items-center justify-center">
            <img
              src="/Kisan.png"
              alt="Kisan Logo"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          {!isMinimized && (
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-[13px] sm:text-sm text-gray-800 whitespace-nowrap"
            >
              Kisan-e-Mandi
            </motion.h1>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-auto px-2 py-3 sm:px-3 sm:py-4">
          {!isMinimized && (
            <h2 className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 sm:px-2">
              Platform
            </h2>
          )}
          <nav className="space-y-2">{menuItems.map(renderButton)}</nav>

          {!isMinimized && (
            <h2 className="mt-4 sm:mt-6 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 sm:px-2">
              Account
            </h2>
          )}
          <nav className="space-y-2">{settingsItems.map(renderButton)}</nav>
        </div>

        {/* Logout */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-2 py-2 sm:px-4 sm:py-3 rounded-lg w-full text-[11px] sm:text-sm transition-all duration-200 ${
                currentSection === "logout"
                  ? "bg-gradient-to-br from-red-500 to-red-700 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100 hover:text-red-600"
              } ${isMinimized ? "justify-center px-0" : ""}`}
            >
              <MdLogout className="w-4 h-4 sm:w-5 sm:h-5" />
              {!isMinimized && <span className="font-medium">Logout</span>}
            </button>
            {isMinimized && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-1.5 py-0.5 text-[10px] sm:text-xs rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
              >
                Logout
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
