// import React, { useState, useMemo } from "react";
// import {
//   X,
//   CalendarDays,
//   Stethoscope,
//   Clock,
//   FileText,
//   Search,
// } from "lucide-react";
// import { capitalizeText } from "../../../../core/utils/stringUtils";
// import CalendarModalDetails from "../../../../core/components/calendar/CalendarModalDetails";

// const TableListAppointments = ({ isOpen, onClose, appointments = [] }) => {
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔍 Filter logic - checks all visible columns
//   const filteredAppointments = useMemo(() => {
//     if (!searchTerm.trim()) return appointments;
//     const term = searchTerm.toLowerCase();

//     return appointments.filter((app) => {
//       const dateStr = app.date
//         ? new Date(app.date).toLocaleDateString().toLowerCase()
//         : "";
//       const timeStr = app.time ? app.time.toLowerCase() : "";
//       const doctorStr = app.doctor?.name?.toLowerCase() || "";
//       const reasonStr = app.reason?.toLowerCase() || "";
//       const statusStr = app.status?.toLowerCase() || "";

//       return (
//         dateStr.includes(term) ||
//         timeStr.includes(term) ||
//         doctorStr.includes(term) ||
//         reasonStr.includes(term) ||
//         statusStr.includes(term)
//       );
//     });
//   }, [appointments, searchTerm]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-lg w-[95%] max-w-5xl p-6 relative animate-fadeIn">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3 mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <CalendarDays className="w-5 h-5 text-blue-600" />
//             Appointment Records
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-1.5 rounded-full hover:bg-gray-100 transition"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Search Input */}
//         <div className="relative mb-3">
//           <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by date, time, doctor, status, or reason..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
//           />
//         </div>

//         {/* Content */}
//         {filteredAppointments.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">
//             No appointments found.
//           </p>
//         ) : (
//           <>
//             <div className="max-h-[65vh] overflow-y-auto border rounded-lg">
//               <table className="w-full text-sm border-collapse">
//                 <thead className="bg-blue-50 sticky top-0 z-10">
//                   <tr className="text-gray-700">
//                     <th className="text-left py-2 px-3 font-semibold w-[15%]">
//                       Date
//                     </th>
//                     <th className="text-left py-2 px-3 font-semibold w-[15%]">
//                       Time
//                     </th>
//                     <th className="text-left py-2 px-3 font-semibold w-[25%]">
//                       Doctor
//                     </th>
//                     <th className="text-left py-2 px-3 font-semibold w-[25%]">
//                       Reason
//                     </th>
//                     <th className="text-left py-2 px-3 font-semibold w-[15%]">
//                       Status
//                     </th>
//                     <th className="text-left py-2 px-3 font-semibold w-[10%]">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredAppointments.map((app, i) => (
//                     <tr
//                       key={i}
//                       className="border-t hover:bg-blue-50 transition text-gray-700"
//                     >
//                       {/* Date */}
//                       <td className="py-2 px-3 align-middle">
//                         <div className="flex items-center gap-1">
//                           <Clock className="w-4 h-4 text-gray-400" />
//                           {app.date
//                             ? new Date(app.date).toLocaleDateString()
//                             : "—"}
//                         </div>
//                       </td>

//                       {/* Time */}
//                       <td className="py-2 px-3 align-middle text-gray-600">
//                         {app.time || "—"}
//                       </td>

//                       {/* Doctor */}
//                       <td className="py-2 px-3 align-middle">
//                         <div className="flex items-center gap-1">
//                           <Stethoscope className="w-4 h-4 text-gray-400" />
//                           {app.doctor?.name || "—"}
//                         </div>
//                       </td>

//                       {/* Reason */}
//                       <td className="py-2 px-3 align-middle text-gray-600 max-w-[200px]">
//                         <div className="flex items-center gap-1">
//                           <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                           <span
//                             className="truncate block"
//                             title={app.reason || "—"}
//                           >
//                             {app.reason || "—"}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="py-2 px-3 align-middle">
//                         <span
//                           className={`px-2 py-0.5 text-xs rounded-full font-medium ${
//                             app.status === "completed"
//                               ? "bg-green-100 text-green-700"
//                               : app.status === "cancelled"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-yellow-100 text-yellow-700"
//                           }`}
//                         >
//                           {capitalizeText(app.status) || "Pending"}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="py-2 px-3 align-middle">
//                         <button
//                           onClick={() => setSelectedReport(app)}
//                           className="text-blue-600 hover:underline text-sm"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Record count + Footer */}
//             <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
//               <span>
//                 Showing {filteredAppointments.length} record
//                 {filteredAppointments.length !== 1 && "s"}
//               </span>
//               <button
//                 onClick={onClose}
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
//               >
//                 Close
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* CalendarModalDetails */}
//       {selectedReport && (
//         <CalendarModalDetails
//           report={selectedReport}
//           onClose={() => setSelectedReport(null)}
//           onRefresh={() => setSelectedReport(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default TableListAppointments;

import React, { useState, useMemo, useEffect } from "react";
import { X, CalendarDays, Stethoscope, Clock, FileText } from "lucide-react";
import { capitalizeText } from "../../../../core/utils/stringUtils";
import CalendarModalDetails from "../../../../core/components/calendar/CalendarModalDetails";
import TableFilters from "../TableUtils/TableFilters";
import TablePagination from "../TableUtils/TablePagination";
import { getUniqueOptions } from "../TableUtils/Utils";

// ✅ Reusable components

const TableListAppointments = ({ isOpen, onClose, appointments = [] }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  // 🔍 Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 🧩 Reset pagination when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const uniqueTimes = useMemo(
    () => getUniqueOptions(appointments, "time"),
    [appointments]
  );
  const uniqueReasons = useMemo(
    () => getUniqueOptions(appointments, "reason"),
    [appointments]
  );
  const uniqueStatus = useMemo(
    () => getUniqueOptions(appointments, "status"),
    [appointments]
  );
  const uniqueDoctors = useMemo(
    () => getUniqueOptions(appointments, "doctor.name"),
    [appointments]
  );

  const filterConfig = [
    { key: "date", label: "Date", type: "date" },
    { key: "time", label: "Session", type: "select", options: uniqueTimes },
    {
      key: "doctor",
      label: "Doctor Name",
      type: "select",
      options: uniqueDoctors,
    },
    { key: "reason", label: "Reason", type: "select", options: uniqueReasons },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: uniqueStatus,
    },
  ];

  // 🧠 Filtering logic
  const filteredAppointments = useMemo(() => {
    let data = [...appointments];

    // Search term (matches text fields)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((app) => {
        const dateStr = app.date
          ? new Date(app.date).toLocaleDateString().toLowerCase()
          : "";
        const timeStr = app.time?.toLowerCase() || "";
        const doctorStr = app.doctor?.name?.toLowerCase() || "";
        const reasonStr = app.reason?.toLowerCase() || "";
        const statusStr = app.status?.toLowerCase() || "";
        return (
          dateStr.includes(term) ||
          timeStr.includes(term) ||
          doctorStr.includes(term) ||
          reasonStr.includes(term) ||
          statusStr.includes(term)
        );
      });
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      data = data.filter((a) => {
        if (key === "date") {
          return (
            a.date &&
            new Date(a.date).toLocaleDateString() ===
              new Date(value).toLocaleDateString()
          );
        }

        const fieldValue = key === "doctor" ? a.doctor?.name : a[key]; // supports time, reason, status, etc.

        return fieldValue?.toLowerCase() === value.toLowerCase();
      });
    });

    return data;
  }, [appointments, searchTerm, filters]);

  // 📄 Pagination slice
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAppointments.slice(start, start + rowsPerPage);
  }, [filteredAppointments, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-[95%] max-w-5xl p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Appointment Records
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ✅ Reusable Filter Section */}
        <TableFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          filterConfig={filterConfig}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          clearFilters={() => setFilters({})}
        />

        {/* Table Content */}
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No appointments found.
          </p>
        ) : (
          <>
            <div className="max-h-[65vh] overflow-y-auto border rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-blue-50 sticky top-0 z-10">
                  <tr className="text-gray-700">
                    <th className="text-left py-2 px-3 font-semibold w-[15%]">
                      Date
                    </th>
                    <th className="text-left py-2 px-3 font-semibold w-[15%]">
                      Time
                    </th>
                    <th className="text-left py-2 px-3 font-semibold w-[25%]">
                      Doctor
                    </th>
                    <th className="text-left py-2 px-3 font-semibold w-[25%]">
                      Reason
                    </th>
                    <th className="text-left py-2 px-3 font-semibold w-[15%]">
                      Status
                    </th>
                    <th className="text-left py-2 px-3 font-semibold w-[10%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map((app, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-blue-50 transition text-gray-700"
                    >
                      {/* Date */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {app.date
                            ? new Date(app.date).toLocaleDateString()
                            : "—"}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-2 px-3 text-gray-600">
                        {app.time || "—"}
                      </td>

                      {/* Doctor */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          {app.doctor?.name || "—"}
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-2 px-3 text-gray-600 max-w-[200px]">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span
                            className="truncate block"
                            title={app.reason || "—"}
                          >
                            {app.reason || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            app.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : app.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {capitalizeText(app.status) || "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3">
                        <button
                          onClick={() => setSelectedReport(app)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Record Count + Pagination */}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={filteredAppointments.length}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* 📄 Appointment Details */}
      {selectedReport && (
        <CalendarModalDetails
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onRefresh={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default TableListAppointments;
