import React, { useState } from "react";
import Card from "../FormDetails/Card";
import { capitalizeText } from "../../../core/utils/stringUtils";
import AppointmentModal from "./AppointmentModal";
import { formConfigMap } from "../../../core/constants/FieldConfigMap";

export default function UpcomingAppointmentsList({
  appointments,
  onSelect,
  title,
  scheduleAppointment = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const fields = formConfigMap["appointments"].getFields("create");

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-md font-semibold text-gray-700">{title}</h2>
        {scheduleAppointment && (
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
          >
            + Schedule Appointment
          </button>
        )}
      </div>

      {/* Appointment List with Scroll */}
      {appointments.length ? (
        <div className="max-h-80 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {appointments.map((app) => (
              <li
                key={app._id}
                className="py-3 px-2 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                onClick={() => onSelect(app)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-blue-600">
                    {new Date(app.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {app.patient?.name || "Patient"}
                  </span>
                  {app.reason && (
                    <span className="text-sm text-gray-500 truncate">
                      {app.reason}
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === "scheduled"
                      ? "bg-gray-100 text-gray-700"
                      : app.status === "ready"
                      ? "bg-green-100 text-green-700"
                      : app.status === "cancelled"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {capitalizeText(app.status) || "Scheduled"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No upcoming appointments.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <AppointmentModal
              type={"appointments"}
              mode={"create"}
              onClose={() => setShowModal(false)}
              fields={fields}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
