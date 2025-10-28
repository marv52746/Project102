import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import apiService from "../../../core/services/apiService";
import UserHeader from "./UserHeader";
import DashboardTab from "./DashboardTab";
import OverviewTab from "../DoctorDetails/OverviewTab";
import ScheduleTab from "../DoctorDetails/ScheduleTab";

import ReviewsTab from "../DoctorDetails/ReviewsTab";
import CalendarTab from "../Calendar/CalendarTab";
import ClinicalRecordTab from "./ClinicalRecordTab";
import ConsultationHistoryTab from "./ConsultationHistoryTab";

import PatientsList from "./PatientsList";
import UltrasoundTab from "./UltrasoundTab";
import ALLAppointments from "./ALLAppointments";
import CalendarMain from "../Calendar/CalendarMain";
import AdminStaffDashboard from "./AdminStaff/AdminStaffDashboard";
import useSocket from "../../../core/hooks/useSocket";
import { dashboardUserRoles } from "../../../core/constants/rolePresets";

export default function UserDashboardPage({ data }) {
  const currentUser = useSelector((state) => state.user.userInfo);
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { refreshKey } = useSelector((state) => state.utils);
  const [manualRefresh, setManualRefresh] = useState(0);

  const [appointments, setAppointments] = useState(null);
  const [appointmentsToday, setAppointmentsToday] = useState(null);
  const [mainTab, setMainTab] = useState(null); // <== will be set dynamically
  const [loading, setLoading] = useState(true);

  useSocket({
    // When a new appointment is created
    appointment_created: (data) => {
      setManualRefresh((prev) => prev + 1);
    },

    // When an existing appointment is updated
    appointment_updated: (data) => {
      setManualRefresh((prev) => prev + 1);
    },
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userAppointments = await apiService.get(
          dispatch,
          "appointments",
          data._id ? { doctor: data._id } : {}
        );

        const userAppointmentsToday = await apiService.get(
          dispatch,
          "appointments",
          {
            date: "today",
          }
        );

        // console.log(userAppointmentsToday);

        setAppointments(userAppointments);
        setAppointmentsToday(userAppointmentsToday);

        // Dynamically set default tab based on role
        const role = data.role;
        if (role === "doctor") {
          setMainTab("overview");
        } else if (role === "patient") {
          setMainTab("dashboard");
        } else if (role === "staff" || role === "admin") {
          setMainTab("staff-dashboard");
        } else {
          setMainTab("dashboard");
        }
      } catch (error) {
        console.error(`Error fetching user details:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, dispatch, refreshKey, data, location.pathname, manualRefresh]);

  const getTabItemsForRole = (role) => {
    // console.log(role);
    switch (role) {
      case "staff":
      case "admin":
        return [
          { key: "staff-dashboard", label: "Overview" },
          { key: "patients-all", label: "Patient List" },
          { key: "calendar-main", label: "Calendar" },
          { key: "appointment-history", label: "Apppointments" },
        ];

      case "doctor":
        return [
          { key: "overview", label: "Overview" },
          // { key: "schedule", label: "Schedule" },
          { key: "calendar", label: "Calendar" },
          { key: "patients", label: "Recent Patients" },
          { key: "consultation-history", label: "Apppointment History" },
          { key: "ultrasound", label: "Ultrasound Records" },
        ];
      case "patient":
        return [
          { key: "dashboard", label: "Overview" },
          { key: "clinical-records", label: "Clinical Records" },
          { key: "patientCalendar", label: "Calendar" },
          { key: "consultation-history", label: "Apppointment History" },
        ];

      default:
        return [{ key: "dashboard", label: "Overview" }];
    }
  };

  const tabItems = getTabItemsForRole(data.role);
  // console.log(tabItems);

  const renderTabContent = () => {
    // Optional fallback UI if not authorized (for safety)
    if (!dashboardUserRoles.includes(currentUser.role)) {
      return (
        <div className="p-10 text-center text-gray-500">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p>You do not have permission to view this dashboard.</p>
        </div>
      );
    }

    if (!data || !mainTab) {
      return (
        <div className="text-center text-gray-500">No user data found.</div>
      );
    }

    const userId = data._id;
    // console.log(userId);
    // console.log(appointments);

    switch (mainTab) {
      // patient
      case "dashboard":
        return <DashboardTab data={data} patientId={userId} />;
      case "patientCalendar":
        return <CalendarTab id={userId} tablename={"patients"} />;
      case "clinical-records":
        return <ClinicalRecordTab data={data} patientId={userId} />;
      case "consultation-history":
        return <ConsultationHistoryTab data={data} />;

      // doctor
      case "overview":
        return <OverviewTab appointments={appointments} />;
      case "schedule":
        return <ScheduleTab data={data} />;
      case "patients":
        return <PatientsList doctorID={userId} />;
      // return <PatientsTab appointments={appointments} doctorID={userId} />;
      case "calendar":
        return <CalendarMain id={userId} tablename={"doctors"} />;
      case "reviews":
        return <ReviewsTab data={data} />;
      case "ultrasound":
        return <UltrasoundTab data={data} />;

      // staff
      case "staff-dashboard":
        // return <DashboardTabStaff appointments={appointments} />;
        return <AdminStaffDashboard appointments={appointmentsToday} />;
      case "patients-all":
        return <PatientsList />;
      case "appointment-history":
        return <ALLAppointments data={data} />;
      case "calendar-main":
        return <CalendarMain />;

      default:
        return (
          <div className="text-center text-gray-500">Unknown tab selected.</div>
        );
    }
  };

  if (loading || !mainTab)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading user data...</span>
      </div>
    );

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
