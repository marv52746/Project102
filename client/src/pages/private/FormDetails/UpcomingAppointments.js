import React, { useState, useMemo, useEffect } from "react";
import Card from "../FormDetails/Card";
import { capitalizeText } from "../../../core/utils/stringUtils";
import AppointmentModal from "./AppointmentModal";
import { formConfigMap } from "../../../core/constants/FieldConfigMap";
import { ChevronDown, ChevronRight, LayoutGrid, List } from "lucide-react";

export default function UpcomingAppointments({
  appointments = [],
  onSelect,
  title,
  scheduleAppointment = false,
  isCollapse = true, // 🆕 external prop
  viewMode: initialViewMode = "list", // 🆕 external prop
}) {
  const [showModal, setShowModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isCollapse);
  const [viewMode, setViewMode] = useState(initialViewMode); // "card" or "list"
  const [search, setSearch] = useState("");
  const fields = formConfigMap["appointments"].getFields("create");

  // 🔍 Auto expand when searching
  useEffect(() => {
    if (search.trim()) setIsCollapsed(false);
  }, [search]);

  const filteredAppointments = useMemo(() => {
    if (!search.trim()) return appointments;
    return appointments.filter((a) =>
      a.patient?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [appointments, search]);

  return (
    <Card>
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between pb-4 gap-2">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
          <h2 className="text-md font-semibold text-gray-700 flex items-center gap-2">
            {title}
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {appointments.length}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === "list" && (
            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none"
            />
          )}

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
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
          </div>

          {scheduleAppointment && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              + Schedule
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {filteredAppointments.length ? (
            viewMode === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredAppointments.map((app) => (
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
              <div className="border-t border-gray-200 mt-2">
                {filteredAppointments.map((app) => (
                  <div
                    key={app._id}
                    onClick={() => onSelect(app)}
                    className="flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50 px-2 cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {app.patient?.name || "Patient"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {capitalizeText(app.status) || "Scheduled"}
                      </div>
                    </div>
                    {app.reason && (
                      <div className="text-sm text-gray-500 truncate max-w-[150px] text-right">
                        {app.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-gray-500 text-center py-4">
              No upcoming appointments.
            </p>
          )}
        </>
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
