// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getAge } from "../../../core/utils/tableUtils";
// import { useNavigate } from "react-router-dom";
// import { Search, Calendar, User, FileText, X } from "lucide-react";
// import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
// import { capitalizeText } from "../../../core/utils/stringUtils";
// import apiService from "../../../core/services/apiService"; // ✅ import to fetch users

// export default function PatientsList() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [patients, setPatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [visiblePatients, setVisiblePatients] = useState(5);
//   const [selectedAppointments, setSelectedAppointments] = useState(null);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const handlePatientClick = (record) => {
//     if (record?._id) {
//       navigate(`/form/patients/view/${record._id}`);
//     }
//   };

//   const handleAppointmentClick = async (patientId) => {
//     const appts = await apiService.get(dispatch, "appointments", {
//       patient: patientId,
//     });
//     appts.sort((a, b) => new Date(b.date) - new Date(a.date));
//     setSelectedAppointments(appts);
//   };

//   const closeModal = () => setSelectedAppointment(null);
//   const closeModalParent = () => setSelectedAppointments(null);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         // ✅ Get all users with patient role
//         const users = await apiService.get(dispatch, "users?role=patient");

//         setPatients(users);
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//       }
//     };

//     fetchPatients();
//   }, [dispatch]);

//   const filteredPatients = patients.filter((p) =>
//     p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       {/* 🔍 Search */}
//       <div className="mb-4 flex items-center">
//         <div className="relative w-1/3">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search patient..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setVisiblePatients(5);
//             }}
//             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//       </div>

//       {/* Patient Table */}
//       <div className="overflow-x-auto max-h-[420px] overflow-y-auto border rounded-lg">
//         <table className="min-w-full text-sm divide-y divide-gray-200">
//           <thead className="bg-gray-100 text-gray-700 sticky top-0">
//             <tr>
//               <th className="px-4 py-2 text-left font-semibold">Name</th>
//               <th className="px-4 py-2 text-left font-semibold">Gender</th>
//               <th className="px-4 py-2 text-left font-semibold">Birthday</th>
//               <th className="px-4 py-2 text-left font-semibold">Age</th>
//               <th className="px-4 py-2 text-left font-semibold">
//                 Appointment Record
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPatients.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="px-4 py-6 text-center text-gray-500 italic"
//                 >
//                   No patients found.
//                 </td>
//               </tr>
//             ) : (
//               filteredPatients.slice(0, visiblePatients).map((patient, idx) => (
//                 <tr key={idx} className="hover:bg-blue-50 transition border-b">
//                   {/* Name */}
//                   <td
//                     onClick={() => handlePatientClick(patient)}
//                     className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-2"
//                   >
//                     <User className="w-4 h-4 text-gray-500" />
//                     {patient?.name || "Unknown"}
//                   </td>
//                   <td className="px-4 py-3 text-gray-700 capitalize">
//                     {patient?.gender || "—"}
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     {patient?.date_of_birth
//                       ? new Date(patient.date_of_birth).toLocaleDateString()
//                       : "—"}
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     {patient?.date_of_birth
//                       ? getAge(patient.date_of_birth)
//                       : "—"}
//                   </td>
//                   <td
//                     onClick={() => handleAppointmentClick(patient._id)}
//                     className="px-4 py-3 text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
//                   >
//                     <FileText className="w-4 h-4 text-blue-500" />
//                     View Records
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {visiblePatients < filteredPatients.length && (
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={() => setVisiblePatients((prev) => prev + 10)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
//           >
//             Load More
//           </button>
//         </div>
//       )}

//       {/* Appointment Records Modal */}
//       {selectedAppointments && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-5/6 lg:w-3/4 max-h-[80vh] overflow-y-auto relative">
//             <button
//               onClick={closeModalParent}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
//               <FileText className="w-6 h-6 text-blue-600" /> Appointment Records
//             </h2>

//             {selectedAppointments.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {selectedAppointments.map((appt, idx) => (
//                   <div
//                     key={idx}
//                     onClick={() => {
//                       setSelectedAppointment(appt);
//                       setShowModal(true);
//                     }}
//                     className="p-4 border rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer bg-white"
//                   >
//                     <div className="flex items-center justify-between pb-2 mb-3 border-b">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-4 h-4 text-gray-500" />
//                         <span className="font-semibold text-gray-800">
//                           {new Date(appt.date).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1 text-gray-700 text-sm">
//                         👨‍⚕️ {appt?.doctor?.name || "N/A"}
//                       </div>
//                     </div>
//                     <div className="space-y-2 text-sm text-gray-700">
//                       <p>
//                         <span className="font-medium">Status:</span>{" "}
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             appt.status === "completed" ||
//                             appt.status === "ready"
//                               ? "bg-green-100 text-green-700"
//                               : appt.status === "cancelled"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-gray-100 text-gray-700"
//                           }`}
//                         >
//                           {capitalizeText(appt.status)}
//                         </span>
//                       </p>
//                       <p>
//                         <span className="font-medium">Reason:</span>{" "}
//                         {appt?.reason || "—"}
//                       </p>
//                       <p>
//                         <span className="font-medium">Diagnosis:</span>{" "}
//                         {appt?.diagnosis || "—"}
//                       </p>
//                       <p>
//                         <span className="font-medium">Notes:</span>{" "}
//                         {appt?.notes || "—"}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-center text-gray-500 py-10">
//                 📅 No appointment records found.
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Appointment Detail Modal */}
//       {showModal && selectedAppointment && (
//         <CalendarModalDetails
//           report={selectedAppointment}
//           isOpen={true}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getAge } from "../../../core/utils/tableUtils";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  User,
  FileText,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import { capitalizeText } from "../../../core/utils/stringUtils";
import apiService from "../../../core/services/apiService";

export default function PatientsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePatients, setVisiblePatients] = useState(5);
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔄 Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const users = await apiService.get(dispatch, "users?role=patient");
        setPatients(users);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, [dispatch]);

  const handlePatientClick = (record) => {
    if (record?._id) {
      navigate(`/form/patients/view/${record._id}`);
    }
  };

  const handleAppointmentClick = async (patientId) => {
    const appts = await apiService.get(dispatch, "appointments", {
      patient: patientId,
    });
    appts.sort((a, b) => new Date(b.date) - new Date(a.date));
    setSelectedAppointments(appts);
  };

  const closeModal = () => setSelectedAppointment(null);
  const closeModalParent = () => setSelectedAppointments(null);

  const filteredPatients = patients.filter((p) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* 🔍 Search */}
      <div className="mb-4 flex items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisiblePatients(5);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto border rounded-lg">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Gender</th>
              <th className="px-4 py-2 text-left font-semibold">Birthday</th>
              <th className="px-4 py-2 text-left font-semibold">Age</th>
              <th className="px-4 py-2 text-left font-semibold">
                Appointment Record
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No patients found.
                </td>
              </tr>
            ) : (
              filteredPatients.slice(0, visiblePatients).map((patient, idx) => (
                <tr key={idx} className="hover:bg-blue-50 transition border-b">
                  <td
                    onClick={() => handlePatientClick(patient)}
                    className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    {patient?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 capitalize">
                    {patient?.gender || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {patient?.date_of_birth
                      ? new Date(patient.date_of_birth).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {patient?.date_of_birth
                      ? getAge(patient.date_of_birth)
                      : "—"}
                  </td>
                  <td
                    onClick={() => handleAppointmentClick(patient._id)}
                    className="px-4 py-3 text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    View Records
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {visiblePatients < filteredPatients.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisiblePatients((prev) => prev + 10)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Appointment Records Modal */}
      {selectedAppointments && (
        <AppointmentRecordsModal
          data={selectedAppointments}
          onClose={closeModalParent}
          onSelect={(appt) => {
            setSelectedAppointment(appt);
            setShowModal(true);
          }}
        />
      )}

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <CalendarModalDetails
          report={selectedAppointment}
          isOpen={true}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function AppointmentRecordsModal({ data, onClose, onSelect }) {
  const [viewMode, setViewMode] = useState("list"); // list | card
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((appt) => {
      const searchLower = search.toLowerCase();
      return (
        appt?.reason?.toLowerCase().includes(searchLower) ||
        appt?.doctor?.name?.toLowerCase().includes(searchLower) ||
        appt?.status?.toLowerCase().includes(searchLower) ||
        new Date(appt.date)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower)
      );
    });
  }, [data, search]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-5/6 lg:w-3/4 max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <FileText className="w-6 h-6 text-blue-600" /> Appointment Records
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {filteredData.length}
            </span>
          </h2>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search date, status, reason, or doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 ${
                  viewMode === "card"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredData.length > 0 ? (
          viewMode === "list" ? (
            <div className="border-t border-gray-200 divide-y divide-gray-100">
              {filteredData.map((appt, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelect(appt)}
                  className="py-3 px-2 hover:bg-gray-50 transition cursor-pointer flex justify-between items-center"
                >
                  {/* Left: Date + Reason + Status */}
                  <div className="flex-1 px-3 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <div>
                      <div className="font-medium text-gray-800 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(appt.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appt?.reason || "—"}
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium min-w-[85px] text-center sm:mt-0 mt-1 ${
                        appt.status === "completed" || appt.status === "ready"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {capitalizeText(appt.status)}
                    </span>
                  </div>

                  {/* Right: Doctor */}
                  <div className="flex items-center gap-1 text-gray-700 text-sm whitespace-nowrap">
                    <User className="w-4 h-4 text-blue-500" />
                    {appt?.doctor?.name || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Card View (unchanged)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((appt, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelect(appt)}
                  className="p-4 border rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer bg-white"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-800">
                        {new Date(appt.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700 text-sm">
                      <User className="w-4 h-4 text-blue-500" />
                      {appt?.doctor?.name || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === "completed" || appt.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {capitalizeText(appt.status)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Reason:</span>{" "}
                      {appt?.reason || "—"}
                    </p>
                    <p>
                      <span className="font-medium">Diagnosis:</span>{" "}
                      {appt?.diagnosis || "—"}
                    </p>
                    <p>
                      <span className="font-medium">Notes:</span>{" "}
                      {appt?.notes || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <p className="text-center text-gray-500 py-10">
            📅 No appointment records found.
          </p>
        )}
      </div>
    </div>
  );
}
