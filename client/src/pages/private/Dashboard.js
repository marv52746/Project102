import React from "react";
import { User, BarChart, DollarSign } from "lucide-react";
import StatCard from "../../core/components/StatCard";
import ChartComponent from "../../core/components/ChartComponent";
import AppointmentsTable from "../../core/components/AppointmentsTable";

function Dashboard() {
  // Dummy data for the charts
  const appointmentData = [
    { year: 2018, appointments: 50 },
    { year: 2019, appointments: 60 },
    { year: 2020, appointments: 55 },
    { year: 2021, appointments: 70 },
    { year: 2022, appointments: 65 },
    { year: 2023, appointments: 80 },
  ];

  const patientData = [
    { year: 2018, patients: 40 },
    { year: 2019, patients: 55 },
    { year: 2020, patients: 60 },
    { year: 2021, patients: 65 },
    { year: 2022, patients: 70 },
    { year: 2023, patients: 85 },
  ];

  // Example appointments data
  const appointments = [
    {
      name: "Rajesh",
      doctor: "Manoj Kumar",
      checkUp: "Dental",
      date: "12-10-2018",
      time: "12:10PM",
      status: "Completed",
    },
    {
      name: "Riya",
      doctor: "Daniel",
      checkUp: "Ortho",
      date: "12-10-2018",
      time: "1:10PM",
      status: "Pending",
    },
    {
      name: "Siri",
      doctor: "Daniel",
      checkUp: "Ortho",
      date: "12-10-2018",
      time: "1:30PM",
      status: "Cancelled",
    },
    {
      name: "Rajesh",
      doctor: "Manoj Kumar",
      checkUp: "Dental",
      date: "12-10-2018",
      time: "12:10PM",
      status: "Completed",
    },
    {
      name: "Riya",
      doctor: "Daniel",
      checkUp: "Ortho",
      date: "12-10-2018",
      time: "1:10PM",
      status: "Pending",
    },
    {
      name: "Siri",
      doctor: "Daniel",
      checkUp: "Ortho",
      date: "12-10-2018",
      time: "1:30PM",
      status: "Cancelled",
    },
  ];

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

      {/* Charts Section - Two columns layout */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartComponent
          title="Yearly Appointment Trends"
          data={appointmentData} // Pass the appointmentData here
          chartType="line"
        />
        <ChartComponent
          title="Yearly Patient Growth"
          data={patientData} // Pass the patientData here
          chartType="bar"
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
