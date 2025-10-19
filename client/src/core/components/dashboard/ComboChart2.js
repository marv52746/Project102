import React, { useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ComboChart2 = ({
  title = "",
  data = [],
  year = "",
  yearOptions = [],
  selectedYear = "",
  handleYearChange = () => {},
  loading = false,
}) => {
  // 🔒 Defensive: ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  // ✅ Memoized version of chart data
  const chartData = useMemo(() => {
    return safeData.map((item) => ({
      ...item,
      patients: Number(item.patients) || 0,
      appointments: Number(item.appointments) || 0,
    }));
  }, [safeData]);

  return (
    <div className="widget">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {/* <h3 className="text-xl font-semibold text-sidetext-active">
          {year ? `${year} - ${title}` : title}
        </h3>

        {yearOptions?.length > 0 && (
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={handleYearChange}
            className="border p-2 rounded-md text-sm focus:ring-2 focus:ring-primary"
          >
            {yearOptions.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        )} */}
      </div>

      {/* Chart Container */}
      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="patients"
                fill="#FF7D00"
                barSize={30}
                name="Patients"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="var(--chart-stroke-fill)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Appointments"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ComboChart2;
