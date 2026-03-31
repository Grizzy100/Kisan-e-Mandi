import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

import { AppSidebar } from "../components/Dashboard/AppSidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import HelpAndSupport from "../components/Dashboard/HelpAndSupport";
import Community from "../components/Dashboard/Community";
import Item from "../components/Dashboard/Item/Item";
import FarmerMarketplace from "../components/Dashboard/FarmerMarketplace";
import { DashboardContent } from "../components/Dashboard/DashBoardContent";
import AdminApproval from "../components/Dashboard/AdminApproval";
import MySection from "../components/Dashboard/MySection";
import CustomerOverview from "../components/Dashboard/CustomerOverview";
import AdminOverview from "../components/Dashboard/AdminOverview";
import CustomerOrders from "../components/Dashboard/CustomerOrders";
import VendorOrders from "../components/Dashboard/VendorOrders";
import OrderTrackingPage from "../components/Dashboard/OrderTrackingPage";

const MainDashboard = () => {
  // Extract user info
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : {};
  const role = user.role || "customer";

  const navigate = useNavigate();
  const location = useLocation();

  const [currentSection, setCurrentSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const contentRef = useRef(null);

  // Sync currentSection with URL
  useEffect(() => {
    const segments = location.pathname.split("/");
    const last = segments[segments.length - 1];
    if (last && last !== "dashboard" && !last.match(/^[0-9a-fA-F]{24}$/)) {
      setCurrentSection(last);
    } else if (location.pathname.includes("/track/")) {
        setCurrentSection("orders"); // Keep orders highlighted when tracking
    } else {
      setCurrentSection("dashboard");
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    navigate(`/dashboard/${section === "dashboard" ? "" : section}`);
  };

  return (
    <div className="relative flex h-screen w-full max-w-full bg-gray-50 overflow-hidden font-inter">
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              key="sidebar"
              className="fixed top-0 left-0 z-40 h-full"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.4 }}
            >
              <AppSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                currentSection={currentSection}
                onSectionChange={handleSectionChange}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isMobile && (
        <AppSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />
      )}

      <div className="relative z-10 flex-1 flex flex-col w-full bg-gray-50">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main ref={contentRef} className="flex-1 overflow-y-auto w-full">
          <Routes>
            <Route path="/" element={role === "admin" ? <AdminOverview /> : (role === "customer" ? <CustomerOverview /> : <DashboardContent />)} />
            <Route path="help" element={<HelpAndSupport />} />
            <Route path="community" element={<Community />} />
            <Route path="item" element={role === "farmer" ? <FarmerMarketplace /> : <Item />} />
            <Route path="admin" element={<AdminApproval />} />
            <Route path="my" element={<MySection />} />
            <Route path="orders" element={role === "farmer" ? <VendorOrders /> : <CustomerOrders />} />
            <Route path="track/:orderId" element={<OrderTrackingPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;
