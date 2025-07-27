import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import apiService from "../../../core/services/apiService";
import UserHeader from "./UserHeader";
import DashboardTab from "./DashboardTab";
import AppointmentsTab from "./AppointmentsTab";

export default function UserDashboardPage() {
  const { tablename, id } = useParams();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [mainTab, setMainTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const record = await apiService.get(dispatch, `${tablename}/${id}`);
        setData(record);
      } catch (error) {
        console.error(`Error fetching ${tablename} details:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tablename, id, dispatch]);

  const tabItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "appointments", label: "Appointments" },
    // You can add more here: { key: "vitals", label: "Vitals" }
  ];

  const renderTabContent = () => {
    if (!data || !data.patient) {
      return (
        <div className="text-center text-gray-500">No patient data found.</div>
      );
    }

    switch (mainTab) {
      case "dashboard":
        return <DashboardTab data={data} patientId={data.patient._id} />;
      case "appointments":
        return <AppointmentsTab id={data.patient._id} />;
      default:
        return (
          <div className="text-center text-gray-500">Unknown tab selected.</div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading patient data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-700">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Patient Header */}
        <UserHeader data={data} />

        {/* Tabs */}
        <div className="border-b text-sm flex items-center gap-6">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className={`pb-2 border-b-2 -mb-px transition-colors ${
                mainTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </main>
    </div>
  );
}
