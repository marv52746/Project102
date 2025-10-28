import React, { useEffect, useState } from "react";
import { formatDate } from "../../../core/utils/dateUtils";
import { capitalizeText } from "../../../core/utils/stringUtils";
import apiService from "../../../core/services/apiService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import Reloader from "../../../core/components/utils/reloader";
import TableFilters from "./TableUtils/TableFilters";
import TablePagination from "./TableUtils/TablePagination";

export default function ConsultationHistoryTab({ data }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { refreshKey } = useSelector((state) => state.utils);

  const [appointments, setAppointments] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 search + filters + pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const userAppointments = await apiService.get(
          dispatch,
          "appointments",
          {
            [data.role]: data._id,
          }
        );

        const sortedAppointments = (userAppointments || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAppointments(sortedAppointments || []);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, dispatch, refreshKey, data]);

  // 🧩 Filter handler
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // 🧮 Nested value helper
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  // 🎯 Filter logic
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.time?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      const recordVal = getNestedValue(app, key);

      // Handle react-select values
      const filterValue =
        typeof val === "object" && val.value ? val.value : val;

      // Date comparison (strict)
      if (key.toLowerCase().includes("date")) {
        return formatDate(recordVal) === formatDate(filterValue);
      }

      // Text match (case-insensitive, partial)
      return recordVal
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toString().toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) return <Reloader text="Loading appointments..." />;

  if (!appointments.length)
    return (
      <div className="text-center text-gray-500 p-6">
        No consultation history found.
      </div>
    );

  const clearFilters = () => setFilters({});

  const doctorOptions = [
    ...new Set(appointments.map((a) => a.doctor?.name).filter(Boolean)),
  ].map((d) => ({ value: d, label: d }));
  const patientOptions = [
    ...new Set(appointments.map((a) => a.patient?.name).filter(Boolean)),
  ].map((p) => ({ value: p, label: p }));
  const statusOptions = [
    ...new Set(appointments.map((a) => a.status).filter(Boolean)),
  ].map((s) => ({ value: s, label: capitalizeText(s) }));

  const filterConfig = [
    { key: "date", label: "Date", type: "date" },
    { key: "time", label: "Session", type: "text" },
    {
      key: "doctor.name",
      label: "Doctor",
      type: "select",
      options: doctorOptions,
    },
    {
      key: "patient.name",
      label: "Patient",
      type: "select",
      options: patientOptions,
    },
    { key: "reason", label: "Reason", type: "text" },
    { key: "status", label: "Status", type: "select", options: statusOptions },
    { key: "notes", label: "Doctor Notes", type: "text" },
  ];

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      {/* 🔍 Search + Filter toggle */}
      <TableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        filterConfig={filterConfig}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
      />

      {/* 📋 Table */}
      <div className="overflow-x-auto mt-3">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Date",
                "Session",
                "Doctor",
                "Patient",
                "Reason",
                "Status",
                "Doctor Notes",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-2 text-left font-medium text-gray-600"
                >
                  {head}
                </th>
              ))}
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
                <td className="px-4 py-2">{app.time}</td>
                <td className="px-4 py-2">{app.doctor?.name || "N/A"}</td>
                <td className="px-4 py-2">{app.patient?.name || "N/A"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate">
                  {app.reason || "-"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      app.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : app.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
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
      {/* <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Showing {paginatedAppointments.length} of{" "}
          {filteredAppointments.length} records
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-3 py-1 rounded-md border text-sm transition ${
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
                className={`px-3 py-1 rounded-md border text-sm transition ${
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
      </div> */}

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredAppointments.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* 🩺 Modal */}
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
