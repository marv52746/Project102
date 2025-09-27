import React, { useEffect, useState } from "react";
import { User, CalendarCheck2, CalendarClock } from "lucide-react";
import StatCard from "../../../core/components/dashboard/StatCard";
import AppointmentsTable from "../../../core/components/appoinment/AppointmentsTable";
import ComboChart2 from "../../../core/components/dashboard/ComboChart2";
import useComboData from "../../../core/hooks/useComboData";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";

function Dashboard() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0 = Jan
  const dispatch = useDispatch();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const comboData = useComboData(appointments, selectedYear);

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, patientsRes] = await Promise.all([
          apiService.get(dispatch, "appointments"),
          apiService.get(dispatch, "users", { role: "patient" }),
        ]);

        setAppointments(appointmentsRes || []);
        setPatients(patientsRes || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) return <div className="p-4">Loading...</div>;

  // console.log(patients);

  // 🔹 Filter patients created this month & last month
  const patientsThisMonth = patients.filter((p) => {
    const date = new Date(p.created_on);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  }).length;

  const patientsLastMonth = patients.filter((p) => {
    const date = new Date(p.createdAt);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth - 1
    );
  }).length;

  // 🔹 Filter appointments this month & last month
  const appointmentsThisMonth = appointments.filter((a) => {
    const date = new Date(a.date);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  }).length;

  const appointmentsLastMonth = appointments.filter((a) => {
    const date = new Date(a.date);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth - 1
    );
  }).length;

  // 🔹 Filter completed appointments this month & last month
  const completedAppointmentsThisMonth = appointments.filter((a) => {
    const date = new Date(a.date);
    return (
      a.status === "completed" &&
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth
    );
  }).length;

  const completedAppointmentsLastMonth = appointments.filter((a) => {
    const date = new Date(a.date);
    return (
      a.status === "completed" &&
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth - 1
    );
  }).length;

  // 🔹 Utility to calculate trend
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
    <div className="mx-auto p-4">
      {/* <h3 className="text-xl font-semibold text-text-secondary mb-4">
        Overview – {currentMonthName} {currentYear}
      </h3> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          title="Completed Appointments"
          value={completedAppointmentsThisMonth.toString()}
          percentage={completedAppointmentTrend.percentage}
          trend={completedAppointmentTrend.trend}
          color="#10B981"
        />
      </div>

      <div className="mt-6">
        <ComboChart2
          title={"Monthly Trends"}
          data={comboData}
          year={selectedYear}
          yearOptions={yearOptions}
          selectedYear={selectedYear}
          handleYearChange={handleYearChange}
        />
      </div>

      <div className="mt-6">
        <AppointmentsTable appointments={appointments} />
      </div>
    </div>
  );
}

export default Dashboard;
