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
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";

function ConsultationFeeChart({ appointments = [] }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const COLORS = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
    "#84CC16",
    "#6366F1",
  ];

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

  // 📊 Compute stacked chart data
  const chartData = useMemo(() => {
    const filtered = selectedDoctor
      ? appointments.filter((a) => a.doctor?._id === selectedDoctor)
      : appointments;

    const groupByPeriod = (getKeyFn, periodCount) => {
      const data = Array.from({ length: periodCount }, (_, i) => ({
        label:
          selectedMonth === ""
            ? new Date(0, i).toLocaleString("default", { month: "short" })
            : (i + 1).toString(),
      }));

      filtered.forEach((a) => {
        if (a.status !== "completed" || !a.date || !a.doctor?._id) return;
        const date = new Date(a.date);
        if (date.getFullYear() !== selectedYear) return;
        if (selectedMonth !== "" && date.getMonth() !== Number(selectedMonth))
          return;

        const idx = getKeyFn(date);
        const doctorName = doctors.find((d) => d.id === a.doctor._id)?.name;
        if (!doctorName) return;

        const fee = Number(a.amount || 0);
        if (!isNaN(fee)) {
          data[idx][doctorName] = (data[idx][doctorName] || 0) + fee;
        }
      });

      return data;
    };

    if (selectedMonth === "") {
      return groupByPeriod((date) => date.getMonth(), 12);
    } else {
      const daysInMonth = new Date(
        selectedYear,
        Number(selectedMonth) + 1,
        0
      ).getDate();
      return groupByPeriod((date) => date.getDate() - 1, daysInMonth);
    }
  }, [appointments, selectedYear, selectedMonth, selectedDoctor, doctors]);

  const totalFee = chartData.reduce(
    (sum, d) =>
      sum + doctors.reduce((docSum, doc) => docSum + (d[doc.name] || 0), 0),
    0
  );

  const formattedTotal = totalFee.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  // 🧭 Handle bar click
  const handleBarClick = (data, index) => {
    if (selectedMonth === "") {
      setSelectedMonth(index.toString());
    } else {
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
        Total Collected Fee for{" "}
        {selectedMonth === ""
          ? selectedYear
          : `${new Date(0, selectedMonth).toLocaleString("default", {
              month: "long",
            })} ${selectedYear}`}
        :{" "}
        <span className="font-semibold text-emerald-600">{formattedTotal}</span>
      </p>

      {/* Chart */}
      <div className="h-80 cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            style={{ cursor: "pointer" }}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }} // ⬇️ more space for legend
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
            <Legend
              verticalAlign="bottom"
              align="center"
              height={36}
              wrapperStyle={{
                bottom: 0,
                paddingTop: 16, // 👈 adds spacing above the legend
              }}
            />
            {/* ⬇️ moved legend */}
            {doctors.map((doc, i) => (
              <Bar
                key={doc.id}
                dataKey={doc.name}
                stackId="a"
                fill={COLORS[i % COLORS.length]}
                radius={i === doctors.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧾 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[99]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
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
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2 border-b">Patient</th>
                      <th className="p-2 border-b">Doctor</th>
                      <th className="p-2 border-b">Fee</th>
                      <th className="p-2 border-b text-center">Appointment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDayAppointments.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">
                          <button
                            onClick={() =>
                              window.open(
                                `/form/users/view/${a.patient?._id}`,
                                "_blank"
                              )
                            }
                            className="text-emerald-600 hover:underline"
                          >
                            {a.patient?.name || "Unknown Patient"}
                          </button>
                        </td>
                        <td className="p-2 border-b">
                          {a.doctor?.name || "Unknown Doctor"}
                        </td>
                        <td className="p-2 border-b text-emerald-600 font-semibold">
                          ₱{Number(a.amount || 0).toLocaleString()}
                        </td>

                        <td className="p-2 border-b text-center">
                          <button
                            onClick={() => setSelectedAppointment(a)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedDayAppointments.length > 0 && (
              <div className="mt-4 flex justify-end">
                <p className="text-gray-800 font-semibold">
                  Total Fee:{" "}
                  <span className="text-emerald-600">
                    ₱
                    {selectedDayAppointments
                      .reduce((sum, a) => sum + Number(a.amount || 0), 0)
                      .toLocaleString()}
                  </span>
                </p>
              </div>
            )}

            {selectedAppointment && (
              <CalendarModalDetails
                report={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onRefresh={() => setSelectedAppointment(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultationFeeChart;
