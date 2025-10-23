import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UltrasoundModalNew from "../../../core/components/modal/UltrasoundModalNew";
import { adminOnlyRoles } from "../../../core/constants/rolePresets";
import { useDispatch, useSelector } from "react-redux";
import { handleUltrasoundSubmit } from "../../../core/components/formActions/handleUltrasoundSubmit";

const PregnancyChart = ({ pregnancies }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUltrasound, setSelectedUltrasound] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.userInfo);
  const hasPermission = adminOnlyRoles.includes(currentUser.role);
  const dispatch = useDispatch();

  const active = pregnancies.filter((p) => p.status === "active");
  const completed = pregnancies.filter((p) => p.status === "delivered");
  const others = pregnancies.filter(
    (p) => p.status !== "active" && p.status !== "delivered"
  );

  const data = useMemo(
    () => [
      { name: "Active", value: active.length, color: "#ec4899" },
      { name: "Delivered", value: completed.length, color: "#10b981" },
      { name: "Others", value: others.length, color: "#94a3b8" },
    ],
    [pregnancies]
  );

  // console.log(active);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const handleSliceClick = (entry) => {
    setSelectedCategory(entry.name);
  };

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

  const getPregnanciesForCategory = () => {
    if (selectedCategory === "Active") return active;
    if (selectedCategory === "Delivered") return completed;
    if (selectedCategory === "Others") return others;
    return [];
  };

  const handleSave = async (type, data) => {
    await handleUltrasoundSubmit({ dispatch, data });
  };

  return (
    <div>
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
              onClick={handleSliceClick}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{
                    cursor: "pointer",
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
              formatter={(value) => `${value}`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total */}
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-800">{total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>

      {/* Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[20]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedCategory} Pregnancies (
              {getPregnanciesForCategory().length})
            </h4>

            {getPregnanciesForCategory().length === 0 ? (
              <p className="text-gray-500 text-sm">No records found.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2 border-b">Patient</th>
                      <th className="p-2 border-b">Status</th>
                      <th className="p-2 border-b">Doctor</th>
                      <th className="p-2 border-b">EDD</th>
                      <th className="p-2 border-b">Ultrasound</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPregnanciesForCategory().map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td
                          className="p-2 border-b text-emerald-600 cursor-pointer hover:underline"
                          onClick={() =>
                            window.open(
                              `/form/users/view/${p.patient?._id || ""}`,
                              "_blank"
                            )
                          }
                        >
                          {p.patient?.name || "Unknown"}
                        </td>
                        <td className="p-2 border-b capitalize">{p.status}</td>
                        <td className="p-2 border-b">
                          {p.doctor?.name || "Unknown"}
                        </td>
                        <td className="p-2 border-b text-gray-500">
                          {p.edd
                            ? new Date(p.edd).toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </td>
                        <td
                          className="p-2 border-b text-blue-600 cursor-pointer hover:underline"
                          onClick={() => setSelectedUltrasound(p)}
                        >
                          {p.ultrasound ? "View" : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ultrasound Modal */}
      {selectedUltrasound && (
        <UltrasoundModalNew
          title={"Ultrasound Data"}
          isOpen={selectedUltrasound}
          hasPermission={hasPermission}
          onClose={() => setSelectedUltrasound(null)}
          onSave={(data) => handleSave("ultrasound", data)}
          initialData={selectedUltrasound.ultrasound}
          patient={selectedUltrasound.patient}
          doctor={selectedUltrasound.doctor}
        />
      )}
    </div>
  );
};

export default PregnancyChart;
