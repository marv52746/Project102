import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PregnancyChart = ({ pregnancies }) => {
  const active = pregnancies.filter((p) => p.status === "active").length;
  const completed = pregnancies.filter((p) => p.status === "delivered").length;
  const others = pregnancies.length - active - completed;

  const data = useMemo(
    () => [
      { name: "Active", value: active, color: "#ec4899" },
      { name: "Delivered", value: completed, color: "#10b981" },
      { name: "Others", value: others, color: "#94a3b8" },
    ],
    [pregnancies]
  );

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="">
      <div className="h-72 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                borderColor: "#e5e7eb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                opacity: 1,
                zIndex: 50,
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value, entry) => {
                // const d = data.find((x) => x.name === value);
                // const pct = total ? ((d.value / total) * 100).toFixed(1) : 0;
                return `${value} `;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 🟣 Center Text */}
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-800">{total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyChart;
