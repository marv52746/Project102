import React, { useEffect, useState } from "react";
import { User, BarChart, DollarSign } from "lucide-react";
import StatCard from "../../../core/components/dashboard/StatCard";
import AppointmentsTable from "../../../core/components/appoinment/AppointmentsTable";
import ComboChart2 from "../../../core/components/dashboard/ComboChart2";
import useComboData from "../../../core/hooks/useComboData";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";

function Dashboard() {
  const today = new Date();
  const currentYear = today.getFullYear();
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
          apiService.get(dispatch, "patients"),
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

  return (
    <div className="mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon={User}
          title="Patients"
          value={patients.length.toString()}
          percentage="+20%"
          trend="up"
          color="#f97316"
        />

        <StatCard
          icon={BarChart}
          title="Appointments"
          value={appointments.length.toString()}
          percentage="-15%"
          trend="down"
          color="#10B981"
        />

        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value="₱7,300"
          percentage="+10%"
          trend="up"
          color="#f59e0b"
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
        {/* <ListFormat
          apiURL={config.apiURL}
          fieldData={config.fieldData}
          mode="view"
          title={config.title}
        /> */}
      </div>
    </div>
  );
}

export default Dashboard;
