import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { User2, Clock } from "lucide-react";
import { getAge } from "../../../core/utils/tableUtils";
import { getStatusClass } from "../../../core/utils/calendarUtils";
import { capitalizeText } from "../../../core/utils/stringUtils";
import { useNavigate } from "react-router-dom";
import apiService from "../../../core/services/apiService";

export default function PatientsTab({ appointments }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState("patients"); // appointments | patients

  // pagination states
  const [visibleAppointments, setVisibleAppointments] = useState(5);
  const [visiblePatients, setVisiblePatients] = useState(5);

  const handleClick = async (record) => {
    if (activeTab === "appointments") {
      navigate(`/form/appointments/view/${record}`);
    } else if (activeTab === "patients") {
      try {
        if (record?._id) {
          navigate(`/form/patients/view/${record._id}`);
        } else {
          console.error("Patient not found for user:", record.name);
        }
      } catch (error) {
        console.error("Error fetching patient by user:", error);
      }
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const now = new Date();
        // ✅ today/past appointments only
        const filtered = (appointments || []).filter(
          (appt) => new Date(appt.date) <= now
        );

        setFilteredAppointments(filtered);

        // Collect unique patients
        const patientMap = new Map();
        (appointments || []).forEach((appt) => {
          const patientId = appt?.patient?._id;
          if (!patientId) return;
          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, appt.patient);
          }
        });

        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error(`Error fetching appointments list:`, error);
      }
    };

    fetchDetails();
  }, [appointments, dispatch]);

  const renderAppointmentsTable = (data) => (
    <div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-lg">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">Patient</th>
              <th className="px-4 py-2 text-left">Last Visit</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  No appointments found.
                </td>
              </tr>
            ) : (
              data
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, visibleAppointments) // ✅ only show visible
                .map((appt, idx) => (
                  <tr
                    key={idx}
                    className=" hover:bg-blue-100 
           cursor-pointer transition"
                    onClick={() => handleClick(appt._id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                          {appt.patient?.name?.[0] || "?"}
                        </div>
                        <span className="text-gray-800 font-medium">
                          {appt.patient?.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(appt.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {appt.reason || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(
                          appt.status?.toLowerCase()
                        )}`}
                      >
                        {capitalizeText(appt.status) || "—"}
                      </span>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {visibleAppointments < data.length && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setVisibleAppointments((prev) => prev + 10)}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );

  const renderPatientsTable = (data) => (
    <div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Birthday</th>
              <th className="px-4 py-2 text-left">Age</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  No patients found.
                </td>
              </tr>
            ) : (
              data
                .slice(0, visiblePatients) // ✅ only show visible
                .map((patient, idx) => (
                  <tr
                    key={idx}
                    className=" hover:bg-blue-100 
           cursor-pointer transition"
                    onClick={() => handleClick(patient)}
                  >
                    <td className="px-4 py-3 text-gray-800 font-medium">
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
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {visiblePatients < data.length && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setVisiblePatients((prev) => prev + 10)}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Tabs Header */}
      <div className="flex gap-8 mb-4 border-b">
        <button
          className={`pb-2 flex items-center gap-2 ${
            activeTab === "patients"
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("patients")}
        >
          <User2 className="w-4 h-4" />
          Patient List
        </button>
        <button
          className={`pb-2 flex items-center gap-2 ${
            activeTab === "appointments"
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("appointments")}
        >
          <Clock className="w-4 h-4" />
          Recent Appointments
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "appointments"
        ? renderAppointmentsTable(filteredAppointments)
        : renderPatientsTable(patients)}
    </div>
  );
}
