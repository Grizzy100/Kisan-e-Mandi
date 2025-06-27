import React, { useState } from "react";
import { AppSidebar } from "../components/Dashboard/AppSidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";

import HelpAndSupport from "../components/Dashboard/HelpandSupport";
import Community from "../components/Dashboard/Community";
import Item from "../components/Dashboard/Item/Item";
import { DashboardContent } from "../components/Dashboard/DashBoardContent";

const VendorDashboard = () => {
  const [currentSection, setCurrentSection] = useState("home");

  const renderContent = () => {
    switch (currentSection) {
      case "help":
        return <HelpAndSupport />;
      case "community":
        return <Community />;
      case "item":
        return <Item />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar
        isOpen={true}
        setIsOpen={() => {}}
        onSectionChange={setCurrentSection}
      />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default VendorDashboard;
