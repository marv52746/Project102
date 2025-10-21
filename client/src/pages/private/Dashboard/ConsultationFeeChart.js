import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { CreditCard, X } from "lucide-react";

function ConsultationFeeChart({ appointments = [] }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);

  // 🧑‍⚕️ Extract unique doctors
  const doctors = useMemo(() => {
    const unique = new Map();
    appointments.forEach((a) => {
      if (a.doctor?._id && a.doctor?.name) {
        unique.set(a.doctor._id, a.doctor.name);
      }
    });
    return Array.from(unique, ([id, name]) => ({ id, name }));
  }, [appointments]);

  // 📊 Compute chart data
  const chartData = useMemo(() => {
    const filtered = selectedDoctor
      ? appointments.filter((a) => a.doctor?._id === selectedDoctor)
      : appointments;

    if (selectedMonth === "") {
      // --- MONTHLY MODE ---
      const months = Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("default", { month: "short" }),
        total: 0,
      }));

      filtered.forEach((a) => {
        if (a.status !== "completed" || !a.date) return;
        const date = new Date(a.date);
        if (date.getFullYear() !== selectedYear) return;
        const fee = Number(a.amount || 0);
        if (!isNaN(fee)) months[date.getMonth()].total += fee;
      });

      return months;
    } else {
      // --- DAILY MODE ---
      const daysInMonth = new Date(
        selectedYear,
        Number(selectedMonth) + 1,
        0
      ).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => ({
        label: (i + 1).toString(),
        total: 0,
      }));

      filtered.forEach((a) => {
        if (a.status !== "completed" || !a.date) return;
        const date = new Date(a.date);
        if (
          date.getFullYear() !== selectedYear ||
          date.getMonth() !== Number(selectedMonth)
        )
          return;
        const fee = Number(a.amount || 0);
        if (!isNaN(fee)) days[date.getDate() - 1].total += fee;
      });

      return days;
    }
  }, [appointments, selectedYear, selectedMonth, selectedDoctor]);

  const totalFee = chartData.reduce((sum, d) => sum + d.total, 0);
  const formattedTotal = totalFee.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  // 🧭 Handle click
  const handleBarClick = (data, index) => {
    if (selectedMonth === "") {
      // from monthly → daily
      setSelectedMonth(index.toString());
    } else {
      // from daily → show modal with appointments for that day
      const day = index + 1;
      const filtered = appointments.filter((a) => {
        const date = new Date(a.date);
        return (
          a.status === "completed" &&
          date.getFullYear() === selectedYear &&
          date.getMonth() === Number(selectedMonth) &&
          date.getDate() === day &&
          (!selectedDoctor || a.doctor?._id === selectedDoctor)
        );
      });
      setSelectedDayAppointments(filtered);
      setShowModal(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md mt-6 relative">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="text-emerald-600" size={20} />
          <h3 className="text-lg font-medium text-gray-800">
            Consultation Fees
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {selectedMonth !== "" && (
            <button
              onClick={() => setSelectedMonth("")}
              className="text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              ← Back to Monthly View
            </button>
          )}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Doctor Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedDoctor("")}
          className={`px-3 py-1 text-sm rounded-full border ${
            selectedDoctor === ""
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          All Doctors
        </button>
        {doctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelectedDoctor(doc.id)}
            className={`px-3 py-1 text-sm rounded-full border ${
              selectedDoctor === doc.id
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {doc.name}
          </button>
        ))}
      </div>

      {/* Summary */}
      <p className="text-gray-600 text-sm mb-2">
        Total Collected Fee (
        {selectedMonth === ""
          ? "All Months"
          : new Date(0, selectedMonth).toLocaleString("default", {
              month: "long",
            })}
        , {selectedYear}):{" "}
        <span className="font-semibold text-emerald-600">{formattedTotal}</span>
      </p>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activeLabel) {
                handleBarClick(
                  state.activePayload?.[0]?.payload,
                  state.activeTooltipIndex
                );
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#6b7280" }}
              label={{
                value: selectedMonth === "" ? "Month" : "Day",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              tickFormatter={(v) => `₱${v.toLocaleString()}`}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip
              formatter={(v) => `₱${v.toLocaleString()}`}
              labelFormatter={(label) =>
                selectedMonth === "" ? label : `Day ${label}`
              }
              contentStyle={{
                borderRadius: "8px",
                borderColor: "#e5e7eb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                zIndex: 50,
              }}
            />
            <Legend />
            <Bar
              dataKey="total"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
              name="Consultation Fee"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧾 Modal for Daily Appointments */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Appointments for{" "}
              {new Date(
                selectedYear,
                Number(selectedMonth),
                selectedDayAppointments[0]
                  ? new Date(selectedDayAppointments[0].date).getDate()
                  : ""
              ).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h4>

            {selectedDayAppointments.length === 0 ? (
              <p className="text-gray-500 text-sm">No appointments found.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {selectedDayAppointments.map((a) => (
                  <li
                    key={a._id}
                    className="border rounded-lg p-3 flex flex-col text-sm text-gray-700"
                  >
                    <span className="font-medium">
                      {a.patient?.name || "Unknown Patient"}
                    </span>
                    <span className="text-gray-500">
                      {a.doctor?.name || "Unknown Doctor"}
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      ₱{Number(a.amount || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(a.date).toLocaleTimeString("en-PH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultationFeeChart;
