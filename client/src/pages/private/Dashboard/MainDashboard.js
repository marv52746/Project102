import React, { useState } from "react";
import { User, Stethoscope, Boxes } from "lucide-react";
import InventoryDashboard from "./InventoryDashboard";
import Dashboard from "./Dashboard";

export default function MainDashboard() {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: User,
      component: <Dashboard />,
    },
    // {
    //   id: "doctors",
    //   label: "Doctors",
    //   icon: Stethoscope,
    //   component: <Dashboard />,
    // },
    {
      id: "inventory",
      label: "Inventory",
      icon: Boxes,
      component: <InventoryDashboard />,
    },
  ];

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="bg-white shadow rounded-lg p-4">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}
