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
  MdAdminPanelSettings,
  MdPerson,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function AppSidebar({
  isOpen,
  setIsOpen,
  onSectionChange,
  currentSection,
}) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "customer"; // "farmer", "customer", "admin"

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMenuItems = () => {
    const baseItems = [
      { title: "Dashboard", key: "dashboard", icon: MdDashboard },
    ];

    if (role === "admin") {
      baseItems.push(
        { title: "Platform Users", key: "users", icon: MdGroup },
        { title: "Crop Approvals", key: "admin", icon: MdAdminPanelSettings, badge: "!" }
      );
    }

    if (role === "farmer") {
      baseItems.push(
        { title: "My Inventory", key: "my", icon: MdPerson },
        { title: "Marketplace", key: "item", icon: MdShoppingCart },
        { title: "Help & Support", key: "help", icon: MdHelp },
        { title: "Orders", key: "orders", icon: MdHistory }
      );
    }

    if (role === "customer") {
      baseItems.push(
        { title: "Marketplace", key: "item", icon: MdShoppingCart },
        { title: "My Orders", key: "orders", icon: MdHistory }
      );
    }

    // Community & Help only for farmers
    if (role === "farmer") {
      baseItems.push({ title: "Community", key: "community", icon: MdGroup });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const settingsItems = [
    { title: "Settings", key: "settings", icon: MdSettings },
  ];

  const sidebarVariants = {
    desktopOpen: {
      x: 0,
      width: 256,
      opacity: 1,
      transition: { type: "spring", stiffness: 160, damping: 22 },
    },
    desktopClosed: {
      x: -12,
      width: 0,
      opacity: 0,
      transition: { type: "tween", duration: 0.28, ease: "easeInOut" },
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

  const handleLogout = () => {
    const currentRole = user?.role;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully 👋");
    navigate(currentRole === "admin" ? "/admin/login" : "/login");
  };

  const renderButton = (item) => {
    const isActive = currentSection === item.key;
    return (
      <div className="relative" key={item.key}>
        <button
          onClick={() => {
            onSectionChange(item.key);
            if (isMobile) setIsOpen(false);
          }}
          className={`flex items-center justify-between px-4 py-2.5 rounded-sm w-full text-sm transition-all duration-200 group ${isActive
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-green-700"
            }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-green-600"}`} />
            <span className={`font-bold tracking-tight transition-colors ${isActive ? "text-white" : "text-gray-600 group-hover:text-green-700"}`}>
              {item.title}
            </span>
          </div>
          {item.badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-sm font-black ${isActive ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
              {item.badge}
            </span>
          )}
        </button>
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
        className={`fixed lg:relative top-0 left-0 h-full bg-white shadow-lg flex flex-col z-50 lg:z-0 overflow-hidden`}
        variants={sidebarVariants}
        animate={
          isMobile ? (isOpen ? "mobileVisible" : "mobileHidden") : isOpen ? "desktopOpen" : "desktopClosed"
        }
        initial={false}
      >
        <motion.div
          className="flex flex-col h-full"
          initial={false}
          animate={{ opacity: isOpen || isMobile ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Logo */}
          <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm overflow-hidden shadow-md bg-white flex items-center justify-center">
              <img
                src="/Kisan.png"
                alt="Kisan Logo"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-[13px] sm:text-sm text-gray-800 whitespace-nowrap"
            >
              Kisan-e-Mandi
            </motion.h1>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-auto px-2 py-3 sm:px-3 sm:py-4">
            <h2 className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 sm:px-2">
              Platform
            </h2>
            <nav className="space-y-2">{menuItems.map(renderButton)}</nav>

            <h2 className="mt-4 sm:mt-6 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 sm:px-2">
              Account
            </h2>
            <nav className="space-y-2">{settingsItems.map(renderButton)}</nav>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-sm w-full text-sm font-bold text-gray-500 hover:bg-neutral-100 hover:text-gray-900 transition-all active:scale-95 group"
            >
              <MdLogout className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <span className="tracking-tight uppercase tracking-widest text-[10px] font-black">Logout</span>
            </button>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}
