import React, { useState } from "react";
import {
  MdHome,
  MdShoppingCart,
  MdHelp,
  MdHistory,
  MdGroup,
  MdExpandLess,
  MdExpandMore,
  MdPerson,
  MdSettings,
  MdCreditCard,
} from "react-icons/md";

export function AppSidebar({ isOpen, setIsOpen, onSectionChange }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const menuItems = [
    { title: "Home", key: "home", icon: MdHome },
    { title: "Items", key: "item", icon: MdShoppingCart },
    { title: "Help & Support", key: "help", icon: MdHelp },
    { title: "Orders", key: "orders", icon: MdHistory },
    { title: "Community", key: "community", icon: MdGroup },
  ];

  const settingsItems = [
    { title: "Settings", key: "settings", icon: MdSettings },
    { title: "Billing", key: "billing", icon: MdCreditCard },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-green-100 via-white to-green-50 shadow-lg h-screen flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md bg-white">
            <img
              src="/Kisan.png"
              alt="Kisan Logo"
              className="w-full h-full object-cover"
            />
          </div>
          {isOpen && (
            <div>
              <h1 className="font-semibold text-sm">Kisan-e-Mandi</h1>
              <p className="text-xs text-gray-500">Farmer Portal</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="mb-6">
          {isOpen && (
            <h2 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase">
              Platform
            </h2>
          )}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onSectionChange(item.key)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-700 hover:bg-green-100 hover:text-green-800 ${
                  !isOpen ? "justify-center" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                {isOpen && <span>{item.title}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {isOpen && (
            <h2 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase">
              Account
            </h2>
          )}
          <nav className="space-y-1">
            {settingsItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onSectionChange(item.key)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors ${
                  !isOpen ? "justify-center" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                {isOpen && <span>{item.title}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
