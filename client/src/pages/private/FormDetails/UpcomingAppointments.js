import React, { useState } from "react";
import Card from "../FormDetails/Card";
import { capitalizeText } from "../../../core/utils/stringUtils";
import AppointmentModal from "./AppointmentModal";
import { formConfigMap } from "../../../core/constants/FieldConfigMap";

export default function UpcomingAppointments({
  appointments,
  onSelect,
  title,
  scheduleAppointment = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const fields = formConfigMap["appointments"].getFields("create");
  return (
    <Card>
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
      {appointments.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {appointments.map((app) => (
            <div
              key={app._id}
              className="p-4 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
              onClick={() => onSelect(app)}
            >
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold text-blue-600">
                  {new Date(app.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
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
              </div>

              <div className="mt-2 text-gray-700 font-medium">
                {app.patient?.name || "Patient"}
              </div>

              {app.reason && (
                <div className="mt-1 text-sm text-gray-500 truncate">
                  {app.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No upcoming appointments.</p>
      )}
      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <AppointmentModal
              // patient={patientId}
              // patientData={data}
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
