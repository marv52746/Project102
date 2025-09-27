import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAge } from "../../../core/utils/tableUtils";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, User, FileText, X } from "lucide-react";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import { capitalizeText } from "../../../core/utils/stringUtils";

export default function PatientsTab({ appointments }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePatients, setVisiblePatients] = useState(5);
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // ✅ new state
  const [showModal, setShowModal] = useState(false);

  const handlePatientClick = (record) => {
    if (record?._id) {
      navigate(`/form/patients/view/${record._id}`);
    }
  };

  const handleAppointmentClick = (patientId) => {
    const appts = (appointments || []).filter(
      (appt) => appt?.patient?._id === patientId
    );
    setSelectedAppointments(appts);
  };

  const closeModal = () => {
    setSelectedAppointment(null); // ✅ ensures CalendarModalDetails unmounts
  };
  const closeModalParent = () => {
    setSelectedAppointments(null);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const patientMap = new Map();
        (appointments || []).forEach((appt) => {
          const patientId = appt?.patient?._id;
          if (!patientId) return;
          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, { ...appt.patient, appointments: [] });
          }
          patientMap.get(patientId).appointments.push(appt);
        });

        const patientsWithVisits = Array.from(patientMap.values()).map((p) => {
          const sortedAppts = p.appointments.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          return { ...p, lastVisit: sortedAppts[0]?.date || null };
        });

        setPatients(patientsWithVisits);
      } catch (error) {
        console.error(`Error fetching appointments list:`, error);
      }
    };

    fetchDetails();
  }, [appointments, dispatch]);

  const filteredPatients = patients.filter((p) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* 🔍 Search bar */}
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
              <th className="px-4 py-2 text-left font-semibold">Last Visit</th>
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
                  {/* Name → clickable */}
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
                  {/* Last Visit */}
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {patient?.lastVisit
                        ? new Date(patient.lastVisit).toLocaleDateString()
                        : "—"}
                    </div>
                  </td>

                  {/* Appointment record → clickable */}
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

      {/* Appointment Modal */}
      {selectedAppointments && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-5/6 lg:w-3/4 max-h-[80vh] overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={closeModalParent}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <FileText className="w-6 h-6 text-blue-600" /> Appointment Records
            </h2>

            {/* Grid of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedAppointments.map((appt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedAppointment(appt); // ✅ set selected appointment
                    setShowModal(true); // ✅ open modal
                  }}
                  className="p-4 border rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer bg-white"
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-800">
                        {new Date(appt.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700 text-sm">
                      👨‍⚕️ {appt?.doctor?.name || "N/A"}
                    </div>
                  </div>

                  {/* Details in single-column layout */}
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-1">
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
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Reason:</span>{" "}
                      <span className="truncate max-w-[500px] inline-block">
                        {appt?.reason || "—"}
                      </span>
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Diagnosis:</span>{" "}
                      <span className="truncate max-w-[500px] inline-block">
                        {appt?.diagnosis || "—"}
                      </span>
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Notes:</span>{" "}
                      <span className="truncate max-w-[500px] inline-block">
                        {appt?.notes || "—"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && selectedAppointment && (
        <CalendarModalDetails
          report={selectedAppointment} // ✅ pass the clicked appointment
          isOpen={true}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
