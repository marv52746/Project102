import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import apiService from "../../../core/services/apiService";
import UserHeader from "./UserHeader";
import DashboardTab from "./DashboardTab";
import AppointmentsTab from "./AppointmentsTab";
import OverviewTab from "../DoctorDetails/OverviewTab";
import ScheduleTab from "../DoctorDetails/ScheduleTab";
import PatientsTab from "../DoctorDetails/PatientsTab";
import ReviewsTab from "../DoctorDetails/ReviewsTab";
import CalendarTab from "../DoctorDetails/CalendarTab";

export default function UserDashboardPage() {
  const { tablename, id } = useParams();
  const dispatch = useDispatch();
  const { refreshKey } = useSelector((state) => state.utils);

  const [data, setData] = useState(null);
  const [mainTab, setMainTab] = useState(null); // <== will be set dynamically
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const record = await apiService.get(dispatch, `${tablename}/${id}`);
        setData(record);

        // Dynamically set default tab based on role
        const role = record?.user?.role;
        if (role === "doctor") {
          setMainTab("overview");
        } else if (role === "patient") {
          setMainTab("dashboard");
        } else {
          setMainTab("dashboard");
        }
      } catch (error) {
        console.error(`Error fetching ${tablename} details:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tablename, id, dispatch, refreshKey]);

  const getTabItemsForRole = (role) => {
    switch (role) {
      case "doctor":
        return [
          { key: "overview", label: "Overview" },
          { key: "schedule", label: "Schedule" },
          { key: "calendar", label: "Calendar" },
          { key: "patients", label: "Patients" },
          { key: "reviews", label: "Reviews" },
        ];
      case "patient":
        return [
          { key: "dashboard", label: "Dashboard" },
          // { key: "appointments", label: "Appointments" },
          { key: "patientCalendar", label: "Calendar" },
        ];
      default:
        return [{ key: "dashboard", label: "Dashboard" }];
    }
  };

  const tabItems = data?.user ? getTabItemsForRole(data.user.role) : [];

  const renderTabContent = () => {
    if (!data || !data.user || !mainTab) {
      return (
        <div className="text-center text-gray-500">No user data found.</div>
      );
    }

    const userId = data.user._id;

    switch (mainTab) {
      // patient
      case "dashboard":
        return <DashboardTab data={data} patientId={userId} />;
      // case "appointments":
      //   return <AppointmentsTab id={userId} />;
      case "patientCalendar":
        return <CalendarTab id={userId} tablename={tablename} />;

      // doctor
      case "overview":
        return <OverviewTab data={data} />;
      case "schedule":
        return <ScheduleTab data={data} />;
      case "patients":
        return <PatientsTab data={data} doctorID={userId} />;
      case "calendar":
        return <CalendarTab id={userId} tablename={tablename} />;
      case "reviews":
        return <ReviewsTab data={data} />;

      default:
        return (
          <div className="text-center text-gray-500">Unknown tab selected.</div>
        );
    }
  };

  if (loading || !mainTab) {
    return (
      <div className="p-6 text-center text-gray-500">Loading user data...</div>
    );
  }

  return (
    <div className="min-h-screen text-slate-700">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Header */}
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
