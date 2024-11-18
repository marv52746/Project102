import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  //   Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ChartComponent = ({ title, data, chartType }) => {
  return (
    <div className="widget bg-background shadow-lg p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-sidetext-active">
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid stroke="none" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              {/* <Legend /> */}
              <Line
                type="monotone"
                dataKey={
                  title.includes("Appointment") ? "appointments" : "patients"
                }
                stroke="var(--chart-stroke-fill)"
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid stroke="none" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              {/* <Legend /> */}
              <Bar
                dataKey={
                  title.includes("Appointment") ? "appointments" : "patients"
                }
                // fill="var(--chart-stroke-fill)"
                fill="#FF7D00"
                barSize={30}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
