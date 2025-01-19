import React from "react";
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
  title,
  data,
  year,
  yearOptions,
  selectedYear,
  handleYearChange,
}) => {
  return (
    <div className="widget bg-background shadow-lg p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold  text-sidetext-active">
          {year} - {title}
        </h3>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={handleYearChange}
          className="border p-2 rounded-md"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke="none" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {/* Use CustomLegend to capitalize the legend text */}
            <Legend />
            <Bar
              dataKey={"patients"}
              fill="#FF7D00"
              barSize={30}
              name="Patients"
            />
            <Line
              type="monotone"
              dataKey={"appointments"}
              stroke="var(--chart-stroke-fill)"
              name="Appointments"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComboChart2;
