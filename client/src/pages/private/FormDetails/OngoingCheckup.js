import React, { useState } from "react";
import {
  Stethoscope,
  Calendar,
  User,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { capitalizeText } from "../../../core/utils/stringUtils";

export default function OngoingCheckup({ appointments = [], onSelect, title }) {
  const currentUser = useSelector((state) => state.user.userInfo);
  const [openIndexes, setOpenIndexes] = useState([]);

  const isDoctor = currentUser?.role === "doctor";

  // ✅ Filter only current doctor's ongoing checkups
  const filteredAppointments = isDoctor
    ? appointments.filter(
        (a) =>
          a.doctor?._id === currentUser.id ||
          a.doctor?.user?._id === currentUser.id
      )
    : appointments;

  const toggleCollapse = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Stethoscope className="w-5 h-5 text-green-600" />
        <h2 className="text-md font-semibold text-gray-700">
          {title ? title : "Ongoing Checkups"}
        </h2>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          {title === "Last Visit Appointment"
            ? "No completed appointments."
            : title
            ? `No ${title.toLowerCase()}.`
            : "No ongoing checkups."}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((ongoing, idx) => {
            const isOpen = isDoctor || openIndexes.includes(idx);

            return (
              <div
                key={idx}
                className="border border-green-100 bg-green-50 rounded-lg p-4 hover:shadow transition"
              >
                {/* Header (Patient + Doctor + Chevron) */}
                <div className="flex items-center justify-between">
                  {/* Left: Patient + Doctor */}
                  <div
                    className="flex flex-col cursor-pointer"
                    onClick={() => onSelect?.(ongoing)}
                  >
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                      <User className="w-4 h-4 text-gray-600" />
                      {ongoing.patient?.name || "Unknown Patient"}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {ongoing.doctor?.name
                        ? `Dr. ${ongoing.doctor.name}`
                        : "No assigned doctor"}
                    </div>
                  </div>

                  {/* Right: Chevron only for staff */}
                  {!isDoctor && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(idx);
                      }}
                      className="p-1 rounded hover:bg-green-100 transition"
                    >
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>

                {/* Collapsible / Always Visible Section */}
                {isOpen && (
                  <div
                    className={`mt-3 cursor-pointer ${
                      !isDoctor ? "pt-3 border-t border-green-100" : ""
                    }`}
                    onClick={() => onSelect?.(ongoing)}
                  >
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {new Date(ongoing.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    {/* Reason */}
                    {ongoing.reason && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {ongoing.reason}
                      </div>
                    )}

                    {/* Status */}
                    <div className="mt-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ongoing.status === "in-progress"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {capitalizeText(ongoing.status)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
