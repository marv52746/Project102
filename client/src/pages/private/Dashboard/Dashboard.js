import React, { useEffect, useState, useMemo } from "react";
import {
  User,
  CalendarCheck2,
  CalendarClock,
  Baby,
  CalendarDays,
} from "lucide-react";
import { useDispatch } from "react-redux";
import StatCard from "../../../core/components/dashboard/StatCard";
import AppointmentsTable from "../../../core/components/appoinment/AppointmentsTable";
import ComboChart2 from "../../../core/components/dashboard/ComboChart2";
import useComboData from "../../../core/hooks/useComboData";
import apiService from "../../../core/services/apiService";
import PregnancyChart from "./PregnancyChart";
import ConsultationFeeChart from "./ConsultationFeeChart";

function Dashboard() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const dispatch = useDispatch();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pregnancies, setPregnancies] = useState([]);
  const [loading, setLoading] = useState(true);

  const comboData = useComboData(appointments, selectedYear);
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, patientsRes, pregnanciesRes] =
          await Promise.all([
            apiService.get(dispatch, "appointments"),
            apiService.get(dispatch, "users", { role: "patient" }),
            apiService.get(dispatch, "pregnancies"),
          ]);

        setAppointments(appointmentsRes || []);
        setPatients(patientsRes || []);
        setPregnancies(pregnanciesRes || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // 🧮 Memoized counts
  const patientsThisMonth = useMemo(
    () =>
      patients.filter((p) => {
        const date = new Date(p.created_on || p.createdAt);
        return (
          date.getFullYear() === currentYear && date.getMonth() === currentMonth
        );
      }).length,
    [patients, currentYear, currentMonth]
  );

  const patientsLastMonth = useMemo(
    () =>
      patients.filter((p) => {
        const date = new Date(p.created_on || p.createdAt);
        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth - 1
        );
      }).length,
    [patients, currentYear, currentMonth]
  );

  const appointmentsThisMonth = useMemo(
    () =>
      appointments.filter((a) => {
        const date = new Date(a.date);
        return (
          date.getFullYear() === currentYear && date.getMonth() === currentMonth
        );
      }).length,
    [appointments, currentYear, currentMonth]
  );

  const appointmentsLastMonth = useMemo(
    () =>
      appointments.filter((a) => {
        const date = new Date(a.date);
        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth - 1
        );
      }).length,
    [appointments, currentYear, currentMonth]
  );

  const completedAppointmentsThisMonth = useMemo(
    () =>
      appointments.filter((a) => {
        const date = new Date(a.date);
        return (
          a.status === "completed" &&
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth
        );
      }).length,
    [appointments, currentYear, currentMonth]
  );

  const completedAppointmentsLastMonth = useMemo(
    () =>
      appointments.filter((a) => {
        const date = new Date(a.date);
        return (
          a.status === "completed" &&
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth - 1
        );
      }).length,
    [appointments, currentYear, currentMonth]
  );

  const pregnantCount = useMemo(
    () => pregnancies.filter((p) => p.status === "active").length,
    [pregnancies]
  );

  const eddThisMonth = useMemo(
    () =>
      pregnancies.filter((p) => {
        if (!p.edd || p.status !== "active") return false;
        const eddDate = new Date(p.edd);
        return (
          eddDate.getFullYear() === currentYear &&
          eddDate.getMonth() === currentMonth
        );
      }).length,
    [pregnancies, currentYear, currentMonth]
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );

  const getTrend = (current, prev) => {
    if (prev === 0 && current === 0)
      return { percentage: "0%", trend: "neutral" };
    if (prev === 0) return { percentage: "+100%", trend: "up" };
    const diff = current - prev;
    const percent = ((diff / prev) * 100).toFixed(1);
    return {
      percentage: `${diff >= 0 ? "+" : ""}${percent}%`,
      trend: diff >= 0 ? "up" : "down",
    };
  };

  const patientTrend = getTrend(patientsThisMonth, patientsLastMonth);
  const appointmentTrend = getTrend(
    appointmentsThisMonth,
    appointmentsLastMonth
  );
  const completedAppointmentTrend = getTrend(
    completedAppointmentsThisMonth,
    completedAppointmentsLastMonth
  );

  return (
    <div className="min-h-screen space-y-6">
      {/* 🧾 Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        <StatCard
          icon={User}
          title="New Patients"
          value={patientsThisMonth.toString()}
          percentage={patientTrend.percentage}
          trend={patientTrend.trend}
          color="#f97316"
        />
        <StatCard
          icon={CalendarClock}
          title="Appointments"
          value={appointmentsThisMonth.toString()}
          percentage={appointmentTrend.percentage}
          trend={appointmentTrend.trend}
          color="#3b82f6"
        />
        <StatCard
          icon={CalendarCheck2}
          title="Completed"
          value={completedAppointmentsThisMonth.toString()}
          percentage={completedAppointmentTrend.percentage}
          trend={completedAppointmentTrend.trend}
          color="#10B981"
        />
      </div>

      {/* 📊 Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Appointment Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Monthly Trends
            </h3>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <ComboChart2 data={comboData} year={selectedYear} />
        </div>

        {/* Right: Pregnancy Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Pregnancy Overview
            </h3>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Baby size={16} className="text-pink-500" />
                <span>{pregnantCount} Active</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays size={16} className="text-violet-500" />
                <span>{eddThisMonth} EDD this month</span>
              </div>
            </div>
          </div>
          <PregnancyChart pregnancies={pregnancies} />
        </div>
      </div>

      {/* Consultation Fee Chart */}
      <ConsultationFeeChart appointments={appointments} />

      {/* 📅 Recent Appointments */}

      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No appointments found.
        </div>
      ) : (
        <AppointmentsTable appointments={appointments} />
      )}
    </div>
  );
}

export default Dashboard;
