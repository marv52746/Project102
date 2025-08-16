import { useEffect, useState } from "react";
import Card from "./Card";
import { FileText, Thermometer, HeartPulse, Gauge, Weight } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";

import ActivitiesTimeline from "./ActivitiesTimeline";

import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import { capitalizeText } from "../../../core/utils/stringUtils";
import AppointmentModal from "./AppointmentModal";
import { formConfigMap } from "../../../core/constants/FieldConfigMap";

// Helper component to show each vital
function VitalItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <li className="flex items-center gap-2 p-3 rounded-md bg-blue-50 border border-blue-100">
      <Icon className="h-5 w-5 text-blue-600" />
      <div>
        <div className="font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-500">{value}</div>
      </div>
    </li>
  );
}

const documentsSeed = [
  { id: 1, name: "Check In" },
  { id: 2, name: "Consent Form" },
  { id: 3, name: "Lab Results" },
];

// Main Component
export default function DashboardTab({ patientId, data }) {
  const { refreshKey } = useSelector((state) => state.utils);

  const [vitals, setVitals] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null); // "conditions", "medications", etc.

  const dispatch = useDispatch();
  const fields = formConfigMap["appointments"].getFields("create");

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        const [vitalData, appointmentData] = await Promise.all([
          apiService.get(dispatch, "vitals"),

          apiService.get(dispatch, "appointments"),
        ]);

        const filterByPatient = (arr) =>
          arr.filter(
            (item) =>
              item.patient === patientId || item.patient?._id === patientId
          );

        const sortedVitals = filterByPatient(vitalData).sort(
          (a, b) =>
            new Date(b.created_on || b._id) - new Date(a.created_on || a._id)
        );

        setVitals(sortedVitals[0] || null);
        setAppointments(
          filterByPatient(appointmentData)
            // .filter((app) => new Date(app.date) >= new Date())
            // .sort((a, b) => new Date(a.date) - new Date(b.date))
            .filter((app) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const appDate = new Date(app.date);
              appDate.setHours(0, 0, 0, 0);

              return (
                appDate >= today &&
                ["scheduled", "rescheduled"].includes(app.status)
              );
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
        );
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
    };

    fetchData();
  }, [dispatch, patientId, refreshKey]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-4">
        {/* VITALS */}
        <Card>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {vitals ? (
              <>
                <VitalItem
                  icon={Gauge}
                  label="Blood Pressure"
                  value={vitals.blood_pressure}
                />
                <VitalItem
                  icon={HeartPulse}
                  label="Heart Rate"
                  value={vitals.heart_rate}
                />
                <VitalItem
                  icon={Thermometer}
                  label="Temperature"
                  value={vitals.temperature}
                />
                <VitalItem icon={Weight} label="Weight" value={vitals.weight} />
              </>
            ) : (
              <p className="col-span-full text-center text-gray-400">
                No vitals available.
              </p>
            )}
          </ul>
        </Card>

        {/* Upcoming Appointments */}

        <Card>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-md font-semibold text-gray-700">
              Upcoming Appointments
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              + Schedule Appointment
            </button>
          </div>
          {appointments.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appointments.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    setViewType("appointments");
                    setViewData(app);
                    setOpenViewModal(true);
                  }}
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
                          : app.status === "cancelled"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {capitalizeText(app.status) || "Scheduled"}
                    </span>
                  </div>

                  <div className="mt-2 text-gray-700 font-medium">
                    {app.doctor?.name || "Doctor"}
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
            <p className="text-gray-500 text-center">
              No upcoming appointments.
            </p>
          )}
        </Card>
      </div>

      {/* TIMELINE + DOCUMENTS */}
      <div className="space-y-4">
        <ActivitiesTimeline patientId={patientId} />
        <Card title="Documents">
          <ul className="divide-y text-sm">
            {documentsSeed.map((d) => (
              <li key={d.id} className="py-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" /> {d.name}
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <button className="hover:text-gray-600" title="Print">
                    🖨️
                  </button>
                  <button className="hover:text-gray-600" title="Download">
                    ⬇️
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {openViewModal && (
        <CalendarModalDetails
          report={viewData}
          onClose={() => {
            setOpenViewModal(false);
            setViewData(null);
            setViewType(null);
          }}
          isOpen={true}
        />
      )}

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <AppointmentModal
              patient={patientId}
              patientData={data}
              type={"appointments"}
              mode={"create"}
              onClose={() => setShowModal(false)}
              fields={fields}
            />
          </div>
        </div>
      )}
    </div>
  );
}
