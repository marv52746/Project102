// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch } from "react-redux";
// import { Search, User, FileText } from "lucide-react";
// import { getAge } from "../../../core/utils/tableUtils";
// import apiService from "../../../core/services/apiService";
// import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";

// import TableListAppointments from "./Modals/TableListAppointments";

// export default function PatientsList({ doctorID }) {
//   const dispatch = useDispatch();

//   const [patients, setPatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedAppointments, setSelectedAppointments] = useState([]);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showRecordsModal, setShowRecordsModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   // 🔄 Fetch all patients
//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const users = await apiService.get(dispatch, "users?role=patient");
//         setPatients(users);
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//       }
//     };
//     fetchPatients();
//   }, [dispatch]);

//   // 🔍 Filtered patients
//   const filteredPatients = useMemo(() => {
//     return patients.filter((p) =>
//       p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [patients, searchTerm]);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPatients.length / pageSize);
//   const currentData = filteredPatients.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   const handlePatientClick = (record) => {
//     if (record?._id) {
//       window.open(`/form/patients/view/${record._id}`, "_blank");
//     }
//   };

//   const handleAppointmentClick = async (patientId) => {
//     try {
//       const appts = await apiService.get(dispatch, "appointments", {
//         patient: patientId,
//       });
//       appts.sort((a, b) => new Date(b.date) - new Date(a.date));
//       setSelectedAppointments(appts);
//       setShowRecordsModal(true);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     }
//   };

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
//               setCurrentPage(1);
//             }}
//             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* 🧾 Patient Table */}
//       <div className="overflow-x-auto max-h-[500px] overflow-y-auto border rounded-lg">
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
//             {currentData.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="px-4 py-6 text-center text-gray-500 italic"
//                 >
//                   No patients found.
//                 </td>
//               </tr>
//             ) : (
//               currentData.map((patient, idx) => (
//                 <tr key={idx} className="hover:bg-blue-50 transition border-b">
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

//       {/* 📄 Pagination */}
//       {filteredPatients.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
//           {/* Total records info */}
//           <div className="text-gray-600 mb-2 sm:mb-0">
//             Showing{" "}
//             <span className="font-semibold">
//               {(currentPage - 1) * pageSize + 1}
//             </span>{" "}
//             –{" "}
//             <span className="font-semibold">
//               {Math.min(currentPage * pageSize, filteredPatients.length)}
//             </span>{" "}
//             of <span className="font-semibold">{filteredPatients.length}</span>{" "}
//             patients
//           </div>

//           {/* Pagination buttons */}
//           <div className="flex items-center gap-1 text-sm">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="px-2.5 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Prev
//             </button>

//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handlePageChange(i + 1)}
//                   className={`w-7 h-7 flex items-center justify-center rounded-md border text-sm transition-all ${
//                     currentPage === i + 1
//                       ? "bg-blue-600 text-white border-blue-600 font-semibold"
//                       : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//               className="px-2.5 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 🗓️ Appointment Records Modal */}
//       <TableListAppointments
//         isOpen={showRecordsModal}
//         appointments={selectedAppointments}
//         onClose={() => setShowRecordsModal(false)}
//       />

//       {/* 📋 Appointment Details Modal */}
//       {showDetailModal && selectedAppointment && (
//         <CalendarModalDetails
//           report={selectedAppointment}
//           isOpen={true}
//           onClose={() => setShowDetailModal(false)}
//         />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Search, User, FileText } from "lucide-react";
import { getAge } from "../../../core/utils/tableUtils";
import apiService from "../../../core/services/apiService";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import TableListAppointments from "./Modals/TableListAppointments";

export default function PatientsList({ doctorID }) {
  const dispatch = useDispatch();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 🔄 Fetch patients (filtered by doctorID if available)
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (doctorID) {
          // ✅ Get only patients with appointments with this doctor
          const appts = await apiService.get(dispatch, "appointments", {
            doctor: doctorID,
          });

          // Extract unique patient IDs
          const patientIds = [...new Set(appts.map((a) => a.patient?._id))];

          if (patientIds.length > 0) {
            const allPatients = await apiService.get(
              dispatch,
              "users?role=patient"
            );
            const filtered = allPatients.filter((p) =>
              patientIds.includes(p._id)
            );
            setPatients(filtered);
          } else {
            setPatients([]); // no appointments for this doctor
          }
        } else {
          // fallback to all patients
          const users = await apiService.get(dispatch, "users?role=patient");
          setPatients(users);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [dispatch, doctorID]);

  // 🔍 Filter patients by search term
  const filteredPatients = useMemo(() => {
    return patients.filter((p) =>
      p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  const currentData = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePatientClick = (record) => {
    if (record?._id) {
      window.open(`/form/patients/view/${record._id}`, "_blank");
    }
  };

  const handleAppointmentClick = async (patientId) => {
    try {
      const appts = await apiService.get(dispatch, "appointments", {
        patient: patientId,
        ...(doctorID && { doctor: doctorID }), // ✅ filter by doctor if provided
      });
      appts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSelectedAppointments(appts);
      setShowRecordsModal(true);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

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
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:outline-none"
          />
        </div>
      </div>

      {/* 🧾 Patient Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto border rounded-lg">
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
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  {doctorID
                    ? "No patients with appointments for this doctor."
                    : "No patients found."}
                </td>
              </tr>
            ) : (
              currentData.map((patient, idx) => (
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

      {/* 📄 Pagination */}
      {filteredPatients.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
          <div className="text-gray-600 mb-2 sm:mb-0">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            –{" "}
            <span className="font-semibold">
              {Math.min(currentPage * pageSize, filteredPatients.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredPatients.length}</span>{" "}
            patients
          </div>

          <div className="flex items-center gap-1 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-2.5 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md border text-sm transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600 font-semibold"
                      : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-2.5 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 🗓️ Appointment Records Modal */}
      <TableListAppointments
        isOpen={showRecordsModal}
        appointments={selectedAppointments}
        onClose={() => setShowRecordsModal(false)}
      />

      {/* 📋 Appointment Details Modal */}
      {showDetailModal && selectedAppointment && (
        <CalendarModalDetails
          report={selectedAppointment}
          isOpen={true}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
}
