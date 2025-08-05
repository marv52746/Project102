import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import apiService from "../../../core/services/apiService";
import { User2, Calendar, Stethoscope } from "lucide-react";

export default function PatientsTab({ doctorID }) {
  const dispatch = useDispatch();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!doctorID) return;

      try {
        const appointments = await apiService.get(dispatch, "appointments", {
          doctor: doctorID,
        });

        const patientMap = new Map();

        appointments.forEach((appt) => {
          const patientId = appt?.patient?._id;
          if (!patientId) return;

          const existing = patientMap.get(patientId);
          if (!existing || new Date(appt.date) > new Date(existing.date)) {
            patientMap.set(patientId, appt);
          }
        });

        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error(`Error fetching appointments list:`, error);
      }
    };

    fetchDetails();
  }, [doctorID, dispatch]);

  const renderAvatar = (name) => {
    const initials =
      name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "PT";
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <span>{name || "Unknown"}</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <User2 className="w-5 h-5 text-blue-600" />
        Recent Patients
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Patient</th>
              <th className="px-4 py-2 text-left">Last Visit</th>
              <th className="px-4 py-2 text-left">Condition</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          {/* <tbody>
            {patients.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  No recent patients found.
                </td>
              </tr>
            )}
            {patients.map((appt, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 text-gray-800">
                  {renderAvatar(appt.patient?.name)}
                </td>
                <td className="px-4 py-3 flex items-center gap-2 text-gray-700">
                  <>
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(appt.date).toLocaleDateString()}
                  </>
                </td>
                <td className="px-4 py-3 flex items-center gap-2 text-gray-700">
                  <>
                    <Stethoscope className="w-4 h-4 text-gray-400" />
                    {appt.reason || "—"}
                  </>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-blue-600 hover:underline text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  No recent patients found.
                </td>
              </tr>
            ) : (
              patients.map((appt, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-150"
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
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(appt.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-gray-400" />
                      {appt.reason || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
