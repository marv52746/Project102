// import React, { useEffect, useState } from "react";
// import { formatDate } from "../../../core/utils/dateUtils";
// import { capitalizeText } from "../../../core/utils/stringUtils";
// import apiService from "../../../core/services/apiService";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
// import { Search, Filter } from "lucide-react";
// import Select from "react-select";
// import Reloader from "../../../core/components/utils/reloader";

// export default function ALLAppointments({ data }) {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { refreshKey } = useSelector((state) => state.utils);

//   const [appointments, setAppointments] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({});
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   useEffect(() => {
//     const fetchDetails = async () => {
//       setLoading(true);
//       try {
//         const userAppointments = await apiService.get(dispatch, "appointments");
//         const sortedAppointments = (userAppointments || []).sort(
//           (a, b) => new Date(b.date) - new Date(a.date)
//         );
//         setAppointments(sortedAppointments || []);
//       } catch (error) {
//         console.error("Error fetching appointment details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id, dispatch, refreshKey, data]);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const clearFilters = () => setFilters({});

//   // 🔍 Apply search + filters
//   const filteredAppointments = appointments.filter((app) => {
//     const matchesSearch =
//       app.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.notes?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesFilters = Object.entries(filters).every(([key, value]) => {
//       if (!value) return true;

//       if (key === "date") return app.date?.startsWith(value);
//       if (key === "status") return app.status === value;
//       if (key === "doctor") return app.doctor?.name === value;
//       if (key === "patient") return app.patient?.name === value;
//       if (key === "reason")
//         return app.reason?.toLowerCase().includes(value.toLowerCase());
//       return true;
//     });

//     return matchesSearch && matchesFilters;
//   });

//   const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
//   const paginatedAppointments = filteredAppointments.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const compactSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "28px",
//       height: "28px",
//       borderColor: state.isFocused ? "#94a3b8" : "#d1d5db",
//       boxShadow: "none",
//       "&:hover": { borderColor: "#94a3b8" },
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       height: "28px",
//       padding: "0 6px",
//     }),
//     input: (base) => ({ ...base, margin: 0, padding: 0 }),
//     indicatorsContainer: (base) => ({ ...base, height: "28px" }),
//     dropdownIndicator: (base) => ({ ...base, padding: "2px" }),
//     clearIndicator: (base) => ({ ...base, padding: "2px" }),
//     menu: (base) => ({ ...base, fontSize: "12px" }),
//   };

//   if (loading) return <Reloader text="Loading appointments..." />;

//   if (!loading && !appointments.length)
//     return (
//       <div className="text-center text-gray-500 p-6">
//         No consultation history found.
//       </div>
//     );

//   // Get unique values for dropdown filters
//   const doctorOptions = [
//     ...new Set(appointments.map((a) => a.doctor?.name).filter(Boolean)),
//   ];
//   const patientOptions = [
//     ...new Set(appointments.map((a) => a.patient?.name).filter(Boolean)),
//   ];
//   const statusOptions = [
//     ...new Set(appointments.map((a) => a.status).filter(Boolean)),
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow border p-4">
//       {/* 🔍 Search + Filter toggle */}
//       <div className="mb-2 flex items-center justify-between">
//         <div className="relative w-1/3">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search doctor, reason, or notes..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
//           />
//         </div>

//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
//         >
//           <Filter className="w-4 h-4" />
//           Filters
//         </button>
//       </div>

//       {/* 🧩 Collapsible Filters */}
//       {showFilters && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 bg-gray-50 p-2 rounded-md border border-gray-200">
//           {/* Date */}
//           <div className="flex flex-col text-xs">
//             <label className="text-gray-600 font-medium mb-1">Date</label>
//             <input
//               type="date"
//               value={filters.date || ""}
//               onChange={(e) => handleFilterChange("date", e.target.value)}
//               className="border border-gray-300 rounded-md px-2 py-[2px] text-xs h-[28px]"
//             />
//           </div>

//           {/* Doctor */}
//           <div className="flex flex-col text-xs">
//             <label className="text-gray-600 font-medium mb-1">Doctor</label>
//             <Select
//               options={[
//                 { value: "", label: "All" },
//                 ...doctorOptions.map((opt) => ({
//                   value: opt,
//                   label: opt,
//                 })),
//               ]}
//               value={
//                 filters.doctor
//                   ? { value: filters.doctor, label: filters.doctor }
//                   : { value: "", label: "All" }
//               }
//               onChange={(selected) =>
//                 handleFilterChange("doctor", selected?.value || "")
//               }
//               styles={compactSelectStyles}
//               classNamePrefix="react-select"
//               isClearable
//               isSearchable
//             />
//           </div>

//           {/* Patient */}
//           <div className="flex flex-col text-xs">
//             <label className="text-gray-600 font-medium mb-1">Patient</label>
//             <Select
//               options={[
//                 { value: "", label: "All" },
//                 ...patientOptions.map((opt) => ({
//                   value: opt,
//                   label: opt,
//                 })),
//               ]}
//               value={
//                 filters.patient
//                   ? { value: filters.patient, label: filters.patient }
//                   : { value: "", label: "All" }
//               }
//               onChange={(selected) =>
//                 handleFilterChange("patient", selected?.value || "")
//               }
//               styles={compactSelectStyles}
//               classNamePrefix="react-select"
//               isClearable
//               isSearchable
//             />
//           </div>

//           {/* Status */}
//           <div className="flex flex-col text-xs">
//             <label className="text-gray-600 font-medium mb-1">Status</label>
//             <Select
//               options={[
//                 { value: "", label: "All" },
//                 ...statusOptions.map((opt) => ({
//                   value: opt,
//                   label: capitalizeText(opt),
//                 })),
//               ]}
//               value={
//                 filters.status
//                   ? {
//                       value: filters.status,
//                       label: capitalizeText(filters.status),
//                     }
//                   : { value: "", label: "All" }
//               }
//               onChange={(selected) =>
//                 handleFilterChange("status", selected?.value || "")
//               }
//               styles={compactSelectStyles}
//               classNamePrefix="react-select"
//               isClearable
//               isSearchable
//             />
//           </div>

//           {/* Clear Filters */}
//           <div className="col-span-2 md:col-span-4 flex justify-end mt-2">
//             <button
//               onClick={clearFilters}
//               className="text-xs px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 📋 Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left font-medium text-gray-600">
//                 Date
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600">
//                 Time
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600">
//                 Doctor
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600">
//                 Patient
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600">
//                 Reason
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600">
//                 Status
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600">
//                 Doctor Notes
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginatedAppointments.map((app) => (
//               <tr
//                 key={app._id}
//                 className="hover:bg-gray-50 cursor-pointer"
//                 onClick={() => setSelectedReport(app)}
//               >
//                 <td className="px-4 py-2">{formatDate(app.date)}</td>
//                 <td className="px-4 py-2">{app.time}</td>
//                 <td className="px-4 py-2">{app.doctor?.name || "N/A"}</td>
//                 <td className="px-4 py-2">{app.patient?.name || "N/A"}</td>
//                 <td className="px-4 py-2 max-w-[200px] truncate">
//                   {app.reason || "-"}
//                 </td>
//                 <td className="px-4 py-2">
//                   <span
//                     className={`px-2 py-0.5 text-xs rounded-full font-medium ${
//                       app.status === "completed"
//                         ? "bg-green-100 text-green-700"
//                         : app.status === "cancelled"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {capitalizeText(app.status)}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2 max-w-[250px] truncate">
//                   {app.notes || "-"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 📑 Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-4 text-sm">
//           <span className="text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>
//           <div className="flex gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className={`px-3 py-1 rounded-lg border ${
//                 currentPage === 1
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : "bg-white hover:bg-gray-50"
//               }`}
//             >
//               Prev
//             </button>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className={`px-3 py-1 rounded-lg border ${
//                 currentPage === totalPages
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : "bg-white hover:bg-gray-50"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Modal */}
//       {selectedReport && (
//         <CalendarModalDetails
//           report={selectedReport}
//           onClose={() => setSelectedReport(null)}
//           onRefresh={() => setSelectedReport(null)}
//         />
//       )}
//     </div>
//   );
// }

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

export default function ALLAppointments({ data }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { refreshKey } = useSelector((state) => state.utils);

  const [appointments, setAppointments] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const userAppointments = await apiService.get(dispatch, "appointments");
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

  const clearFilters = () => setFilters({});

  // 🧩 Define filterConfig (aligned with your TableFilters logic)
  const doctorOptions = [
    ...new Set(appointments.map((a) => a.doctor?.name).filter(Boolean)),
  ];
  const patientOptions = [
    ...new Set(appointments.map((a) => a.patient?.name).filter(Boolean)),
  ];
  const statusOptions = [
    ...new Set(appointments.map((a) => a.status).filter(Boolean)),
  ];

  const filterConfig = [
    { key: "date", label: "Date", type: "date" },
    { key: "time", label: "Session", type: "text" },
    {
      key: "doctor.name",
      label: "Doctor",
      type: "select",
      options: doctorOptions.map((d) => ({ value: d, label: d })),
    },
    {
      key: "patient.name",
      label: "Patient",
      type: "select",
      options: patientOptions.map((p) => ({ value: p, label: p })),
    },
    { key: "reason", label: "Reason", type: "text" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: statusOptions.map((s) => ({
        value: s,
        label: capitalizeText(s),
      })),
    },
    { key: "notes", label: "Doctor Notes", type: "text" },
  ];

  // 🧠 Utility for nested value access
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  // 🔍 Apply search + filters
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      !searchTerm ||
      app.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;

      const recordVal = getNestedValue(app, key);
      const filterValue =
        typeof val === "object" && val.value ? val.value : val;

      // Date = exact match
      if (key.toLowerCase().includes("date")) {
        return formatDate(recordVal) === formatDate(filterValue);
      }

      // Text match (partial, case-insensitive)
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

  if (!loading && !appointments.length)
    return (
      <div className="text-center text-gray-500 p-6">
        No consultation history found.
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      {/* 🔍 Reusable Table Filters */}
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Date
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Session
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

      {/* 📑 Pagination + Record Count */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredAppointments.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
      />

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
