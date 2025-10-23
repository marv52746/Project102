// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getAge } from "../../../core/utils/tableUtils";
// import { useNavigate } from "react-router-dom";
// import { Search, Calendar, User, FileText, X } from "lucide-react";
// import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
// import { capitalizeText } from "../../../core/utils/stringUtils";

// export default function PatientsTab({ appointments }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [patients, setPatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [visiblePatients, setVisiblePatients] = useState(5);
//   const [selectedAppointments, setSelectedAppointments] = useState(null);
//   const [selectedAppointment, setSelectedAppointment] = useState(null); // ✅ new state
//   const [showModal, setShowModal] = useState(false);

//   // ✅ Filter and sort appointments: completed only, sorted by created_on
//   const completedAppointments = useMemo(() => {
//     return appointments
//       .filter((appt) => appt?.status === "completed")
//       .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
//   }, [appointments]);

//   const handlePatientClick = (record) => {
//     if (record?._id) {
//       window.open(`/form/patients/view/${record._id}`, "_blank");
//     }
//   };

//   const handleAppointmentClick = (patientId) => {
//     const appts = (appointments || [])
//       .filter((appt) => appt?.patient?._id === patientId)
//       .sort((a, b) => new Date(b.date) - new Date(a.date));
//     setSelectedAppointments(appts);
//   };

//   const closeModal = () => {
//     setSelectedAppointment(null); // ✅ ensures CalendarModalDetails unmounts
//   };
//   const closeModalParent = () => {
//     setSelectedAppointments(null);
//   };

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const patientMap = new Map();
//         (appointments || []).forEach((appt) => {
//           const patientId = appt?.patient?._id;
//           if (!patientId) return;
//           if (!patientMap.has(patientId)) {
//             patientMap.set(patientId, { ...appt.patient, appointments: [] });
//           }
//           patientMap.get(patientId).appointments.push(appt);
//         });

//         const patientsWithVisits = Array.from(patientMap.values()).map((p) => {
//           const sortedAppts = p.appointments.sort(
//             (a, b) => new Date(b.date) - new Date(a.date)
//           );
//           return { ...p, lastVisit: sortedAppts[0]?.date || null };
//         });

//         setPatients(patientsWithVisits);
//       } catch (error) {
//         console.error(`Error fetching appointments list:`, error);
//       }
//     };

//     fetchDetails();
//   }, [appointments, dispatch]);

//   const filteredPatients = patients.filter((p) =>
//     p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       {/* 🔍 Search bar */}
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
//               <th className="px-4 py-2 text-left font-semibold">Last Visit</th>
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
//                   {/* Name → clickable */}
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
//                   {/* Last Visit */}
//                   <td className="px-4 py-3 text-gray-700">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4 text-gray-500" />
//                       {patient?.lastVisit
//                         ? new Date(patient.lastVisit).toLocaleDateString()
//                         : "—"}
//                     </div>
//                   </td>

//                   {/* Appointment record → clickable */}
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

//       {/* Appointment Modal */}
//       {selectedAppointments && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-5/6 lg:w-3/4 max-h-[80vh] overflow-y-auto relative">
//             <button
//               onClick={closeModalParent}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
//               <FileText className="w-6 h-6 text-blue-600" /> Appointment Records
//             </h2>

//             {/* Modal Search */}
//             <div className="relative mb-3 w-1/3">
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search appointment..."
//                 onChange={(e) =>
//                   setSelectedAppointments(
//                     completedAppointments.filter(
//                       (appt) =>
//                         appt?.patient?._id ===
//                           selectedAppointments[0]?.patient?._id &&
//                         (appt.reason
//                           ?.toLowerCase()
//                           .includes(e.target.value.toLowerCase()) ||
//                           appt.diagnosis
//                             ?.toLowerCase()
//                             .includes(e.target.value.toLowerCase()) ||
//                           appt.notes
//                             ?.toLowerCase()
//                             .includes(e.target.value.toLowerCase()))
//                     )
//                   )
//                 }
//                 className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* Appointment Table */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-3 py-2 text-left">Date</th>
//                     <th className="px-3 py-2 text-left">Doctor</th>
//                     <th className="px-3 py-2 text-left">Reason</th>
//                     <th className="px-3 py-2 text-left">Diagnosis</th>
//                     <th className="px-3 py-2 text-left">Notes</th>
//                     <th className="px-3 py-2 text-left">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedAppointments.map((appt, idx) => (
//                     <tr
//                       key={idx}
//                       onClick={() => {
//                         setSelectedAppointment(appt);
//                         setShowModal(true);
//                       }}
//                       className="hover:bg-blue-50 cursor-pointer border-b"
//                     >
//                       <td className="px-3 py-2">
//                         {new Date(appt.date).toLocaleDateString()}
//                       </td>
//                       <td className="px-3 py-2">{appt?.doctor?.name || "—"}</td>
//                       <td className="px-3 py-2 max-w-[150px] truncate">
//                         {appt?.reason || "—"}
//                       </td>
//                       <td className="px-3 py-2 max-w-[150px] truncate">
//                         {appt?.diagnosis || "—"}
//                       </td>
//                       <td className="px-3 py-2 max-w-[150px] truncate">
//                         {appt?.notes || "—"}
//                       </td>

//                       <td className="px-3 py-2">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             appt.status === "completed"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-gray-100 text-gray-700"
//                           }`}
//                         >
//                           {capitalizeText(appt.status)}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       {showModal && selectedAppointment && (
//         <CalendarModalDetails
//           report={selectedAppointment} // ✅ pass the clicked appointment
//           isOpen={true}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, User, FileText, X } from "lucide-react";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import { getAge } from "../../../core/utils/tableUtils";
import { capitalizeText } from "../../../core/utils/stringUtils";

export default function PatientsTab({ appointments = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  // ✅ Filter and sort appointments: completed only, sorted by created_on
  const completedAppointments = useMemo(() => {
    return appointments
      .filter((appt) => appt?.status === "completed")
      .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
  }, [appointments]);

  useEffect(() => {
    const patientMap = new Map();

    completedAppointments.forEach((appt) => {
      const patientId = appt?.patient?._id;
      if (!patientId) return;

      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, { ...appt.patient, appointments: [] });
      }
      patientMap.get(patientId).appointments.push(appt);
    });

    const patientsWithLastVisit = Array.from(patientMap.values()).map((p) => {
      const sortedAppts = p.appointments.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return { ...p, lastVisit: sortedAppts[0]?.date || null };
    });

    setPatients(patientsWithLastVisit);
  }, [completedAppointments, dispatch]);

  // ✅ Filter by name
  const filteredPatients = patients.filter((p) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  const handlePatientClick = (record) => {
    if (record?._id) window.open(`/form/patients/view/${record._id}`, "_blank");
  };

  const handleAppointmentClick = (patientId) => {
    const appts = completedAppointments
      .filter((appt) => appt?.patient?._id === patientId)
      .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
    setSelectedAppointments(appts);
  };

  const closeModalParent = () => {
    setSelectedAppointments(null);
    setShowModal(false);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Search bar */}
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
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead className="bg-gray-100 text-gray-700 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left w-[25%]">Name</th>
              <th className="px-4 py-2 text-left w-[10%]">Gender</th>
              <th className="px-4 py-2 text-left w-[15%]">Birthday</th>
              <th className="px-4 py-2 text-left w-[5%]">Age</th>
              <th className="px-4 py-2 text-left w-[15%]">Last Visit</th>
              <th className="px-4 py-2 text-left w-[15%]">
                Appointment Record
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No completed patients found.
                </td>
              </tr>
            ) : (
              currentPatients.map((patient, idx) => (
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
                  {/* last visit: ensure the inner flex can shrink (min-w-0) to avoid overflow */}
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-1 min-w-0">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="truncate">
                        {patient?.lastVisit
                          ? new Date(patient.lastVisit).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </td>

                  {/* view record: make the clickable element an inline button to avoid cell overflow */}
                  <td className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleAppointmentClick(patient._id)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      type="button"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      View Records
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "border text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Appointment Modal */}
      {selectedAppointments && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-5/6 lg:w-3/4 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={closeModalParent}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <FileText className="w-6 h-6 text-blue-600" /> Appointment Records
            </h2>

            {/* Modal Search */}
            <div className="relative mb-3 w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointment..."
                onChange={(e) =>
                  setSelectedAppointments(
                    completedAppointments.filter(
                      (appt) =>
                        appt?.patient?._id ===
                          selectedAppointments[0]?.patient?._id &&
                        (appt.reason
                          ?.toLowerCase()
                          .includes(e.target.value.toLowerCase()) ||
                          appt.diagnosis
                            ?.toLowerCase()
                            .includes(e.target.value.toLowerCase()) ||
                          appt.notes
                            ?.toLowerCase()
                            .includes(e.target.value.toLowerCase()))
                    )
                  )
                }
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Appointment Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Doctor</th>
                    <th className="px-3 py-2 text-left">Reason</th>
                    <th className="px-3 py-2 text-left">Diagnosis</th>
                    <th className="px-3 py-2 text-left">Notes</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAppointments.map((appt, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setShowModal(true);
                      }}
                      className="hover:bg-blue-50 cursor-pointer border-b"
                    >
                      <td className="px-3 py-2">
                        {new Date(appt.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2">{appt?.doctor?.name || "—"}</td>
                      <td className="px-3 py-2 max-w-[150px] truncate">
                        {appt?.reason || "—"}
                      </td>
                      <td className="px-3 py-2 max-w-[150px] truncate">
                        {appt?.diagnosis || "—"}
                      </td>
                      <td className="px-3 py-2 max-w-[150px] truncate">
                        {appt?.notes || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appt.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {capitalizeText(appt.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal Details */}
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
