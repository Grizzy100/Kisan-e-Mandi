import React, { useEffect, useRef, useState } from "react";
import { AppSidebar } from "../components/Dashboard/AppSidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import HelpAndSupport from "../components/Dashboard/HelpandSupport";
import Community from "../components/Dashboard/Community";
import Item from "../components/Dashboard/Item/Item";
import { DashboardContent } from "../components/Dashboard/DashBoardContent";
import Lenis from "@studio-freight/lenis";
import { AnimatePresence, motion } from "framer-motion";

const VendorDashboard = () => {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // close on small
      if (mobile) setIsSidebarMinimized(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wrapper: contentRef.current,
      content: contentRef.current,
      smooth: true,
      smoothTouch: false,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const renderContent = () => {
    switch (currentSection) {
      case "help":
        return <HelpAndSupport />;
      case "community":
        return <Community />;
      case "item":
        return <Item />;
      case "dashboard":
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="relative flex h-screen w-full max-w-full bg-gray-50 overflow-hidden">
      {/* Backdrop + Sidebar for mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            {/* Overlay Blur */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              key="sidebar"
              className="fixed top-0 left-0 z-40 h-full"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "tween", duration: 0.4 }}
            >
              <AppSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                currentSection={currentSection}
                onSectionChange={setCurrentSection}
                isMinimized={isSidebarMinimized}
                setIsMinimized={setIsSidebarMinimized}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop (no animation) */}
      {!isMobile && sidebarOpen && (
        <AppSidebar
          isOpen={true} // always true in lg
          setIsOpen={setSidebarOpen}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          isMinimized={isSidebarMinimized} // ← IMPORTANT
          setIsMinimized={setIsSidebarMinimized} // ← IMPORTANT
        />
      )}


      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col w-full">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isSidebarMinimized={isSidebarMinimized}
          setIsSidebarMinimized={setIsSidebarMinimized}
        />
        <main
          ref={contentRef}
          className="p-3 sm:p-4 md:p-6 overflow-y-auto w-full max-w-full"
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
