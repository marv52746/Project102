import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import { FileText, Thermometer, HeartPulse, Gauge, Weight } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";

import ActivitiesTimeline from "./ActivitiesTimeline";

import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import AppointmentModal from "./AppointmentModal";
import { formConfigMap } from "../../../core/constants/FieldConfigMap";
import VitalItem from "../../../core/components/calendar/VitalItem";
import UpcomingAppointments from "./UpcomingAppointments";
import PrintablePatientRecord from "../../../core/components/documents/PrintablePatientRecord";

// Main Component
export default function DashboardTab({ patientId, data }) {
  const { refreshKey } = useSelector((state) => state.utils);
  const [manualRefresh, setManualRefresh] = useState(0);

  const [vitals, setVitals] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsPrint, setAppointmentsPrint] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null); // "conditions", "medications", etc.

  const dispatch = useDispatch();
  const fields = formConfigMap["appointments"].getFields("create");

  // console.log(data);
  // console.log(appointments);

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

        const filteredAppointments = filterByPatient(appointmentData)
          .filter((app) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const appDate = new Date(app.date);
            appDate.setHours(0, 0, 0, 0);

            return (
              appDate >= today && ["scheduled", "ready"].includes(app.status)
            );
          })
          .sort((a, b) => new Date(a.created_on) - new Date(b.created_on));

        const filteredAppointmentsPrint = filterByPatient(appointmentData)
          .filter((app) => {
            return ["completed"].includes(app.status);
          })
          .sort((a, b) => new Date(a.created_on) - new Date(b.created_on));

        setAppointmentsPrint(filteredAppointmentsPrint);
        setAppointments(filteredAppointments);
        setVitals(sortedVitals[0] || null);

        // If the modal is open, refresh its data
        if (openViewModal && viewData) {
          const updatedView = filteredAppointments.find(
            (app) => app._id === viewData._id
          );
          if (updatedView) setViewData(updatedView);
        }
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, patientId, refreshKey, manualRefresh]);

  // console.log(appointmentsPrint);

  return (
    <>
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
                  <VitalItem
                    icon={Weight}
                    label="Weight"
                    value={vitals.weight}
                  />
                </>
              ) : (
                <p className="col-span-full text-center text-gray-400">
                  No vitals available.
                </p>
              )}
            </ul>
          </Card>

          {/* Upcoming Appointments */}
          <UpcomingAppointments
            title={"Upcoming Appointments"}
            appointments={appointments}
            isCollapse={false} // start expanded
            viewMode="card" // start in card view
            onSelect={(app) => {
              setViewType("appointments");
              setViewData(app);
              setOpenViewModal(true);
            }}
          />
        </div>

        {/* TIMELINE + DOCUMENTS */}
        <div className="space-y-4">
          <PrintablePatientRecord
            data={data}
            vitals={vitals}
            appointments={appointmentsPrint}
          />

          {/* <ActivitiesTimeline patientId={patientId} /> */}
        </div>
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
          onRefresh={() => setManualRefresh((prev) => prev + 1)} // ✅ now it’s a callback
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
    </>
  );
}
