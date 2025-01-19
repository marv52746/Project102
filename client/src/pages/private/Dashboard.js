import React, { useState } from "react";
import { User, BarChart, DollarSign } from "lucide-react";
import StatCard from "../../core/components/dashboard/StatCard";
import AppointmentsTable from "../../core/components/appoinment/AppointmentsTable";

import patientsData from "../../core/data/clinic/patients.json";
import appointmentsData from "../../core/data/clinic/appointments.json";
import staffData from "../../core/data/clinic/staff.json";

import ComboChart2 from "../../core/components/dashboard/ComboChart2";
import useComboData from "../../core/hooks/useComboData";
import { useAppointments } from "../../core/hooks/useAppointments";

function Dashboard() {
  // Get today's date as a formatted string (only date part)
  const today = new Date();
  const currentYear = today.getFullYear(); // Get the current year

  // Create a state for the selected year
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Get data based on the selected year
  const comboData = useComboData(appointmentsData.appointments, selectedYear);
  const appointments = useAppointments(
    appointmentsData,
    patientsData,
    staffData
  );

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  // Create a list of years (e.g., last 5 years)
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push(currentYear - i);
  }

  return (
    <div className="mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Patients Widget */}
        <StatCard
          icon={User}
          title="Patients"
          value="348"
          percentage="+20%"
          trend="up"
          color="#f97316"
        />

        {/* Appointments Widget */}
        <StatCard
          icon={BarChart}
          title="Appointments"
          value="1585"
          percentage="-15%"
          trend="down"
          color="#10B981"
        />

        {/* Total Revenue Widget */}
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value="$7300"
          percentage="+10%"
          trend="up"
          color="#f59e0b"
        />
      </div>

      <div className="mt-6">
        <ComboChart2
          title={"Monthly Appointment/Patient Trends"}
          data={comboData}
          year={selectedYear}
          yearOptions={yearOptions}
          selectedYear={selectedYear}
          handleYearChange={handleYearChange}
        />
      </div>

      {/* Appointments Table Section */}
      <div className="mt-6">
        <AppointmentsTable appointments={appointments} />
      </div>
    </div>
  );
}

export default Dashboard;
