import React, { useEffect, useState } from "react";
import { formatDate, formatTime } from "../../../core/utils/dateUtils";
import { capitalizeText } from "../../../core/utils/stringUtils";
import apiService from "../../../core/services/apiService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import { Search } from "lucide-react";
import Reloader from "../../../core/components/utils/reloader";

export default function ALLAppointments({ data }) {
  // console.log(data);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { refreshKey } = useSelector((state) => state.utils);

  const [appointments, setAppointments] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 search + pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const userAppointments = await apiService.get(dispatch, "appointments");

        // console.log(userAppointments);

        // ✅ sort by date
        const sortedAppointments = (userAppointments || []).sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });

        setAppointments(sortedAppointments || []);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, dispatch, refreshKey, data]);

  // 🔍 Filtered + Paginated Data
  const filteredAppointments = appointments.filter(
    (app) =>
      app.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient?.name?.toLowerCase().includes10(searchTerm.toLowerCase()) ||
      app.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) return <Reloader text="Loading appointments..." />;

  if (!loading && !appointments.length) {
    return (
      <div className="text-center text-gray-500 p-6">
        No consultation history found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      {/* 🔍 Search */}
      <div className="mb-4 flex items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctor, reason, or notes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
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
                Patient
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
            {paginatedAppointments.map((app) => (
              <tr
                key={app._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedReport(app)}
              >
                <td className="px-4 py-2">{formatDate(app.date)}</td>
                <td className="px-4 py-2">{formatTime(app.time)}</td>
                <td className="px-4 py-2">{app.doctor?.name || "N/A"}</td>
                <td className="px-4 py-2">{app.patient?.name || "N/A"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate">
                  {app.reason || "-"}
                </td>
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
                <td className="px-4 py-2 max-w-[250px] truncate">
                  {app.notes || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📑 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedReport && (
        <CalendarModalDetails
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onRefresh={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
