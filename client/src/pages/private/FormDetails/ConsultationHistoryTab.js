import React, { useEffect, useState } from "react";
import { formatDate, formatTime } from "../../../core/utils/dateUtils";
import { capitalizeText } from "../../../core/utils/stringUtils";
import apiService from "../../../core/services/apiService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function ConsultationHistoryTab() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { refreshKey } = useSelector((state) => state.utils);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userAppointments = await apiService.get(
          dispatch,
          "appointments",
          {
            patient: id,
            status: "completed",
          }
        );

        setAppointments(userAppointments || []);
        console.log("Consultation history:", userAppointments);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };

    fetchDetails();
  }, [id, dispatch, refreshKey]);

  if (!appointments.length) {
    return (
      <div className="text-center text-gray-500 p-6">
        No consultation history found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Date
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Time
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Doctor
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Reason
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Status
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Doctor Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {appointments.map((app) => (
            <tr key={app._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{formatDate(app.date)}</td>
              <td className="px-4 py-2">{formatTime(app.time)}</td>
              <td className="px-4 py-2">{app.doctor?.name || "N/A"}</td>
              <td className="px-4 py-2">{app.reason || "-"}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : app.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {capitalizeText(app.status)}
                </span>
              </td>
              <td className="px-4 py-2">{app.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
