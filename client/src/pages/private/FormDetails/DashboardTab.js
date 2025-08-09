import { useEffect, useState } from "react";
import Card from "./Card";
import {
  FileText,
  ShieldAlert,
  Thermometer,
  HeartPulse,
  Gauge,
  Weight,
  Pill,
  AlertTriangle,
  Scissors,
} from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";
import ClinicalFormModal from "./ClinicalFormModal";
import ActivitiesTimeline from "./ActivitiesTimeline";

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
export default function DashboardTab({ patientId }) {
  const { refreshKey } = useSelector((state) => state.utils);

  const [vitals, setVitals] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [surgeries, setSurgical] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null); // "conditions", "medications", etc.

  const dispatch = useDispatch();

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        const [
          vitalData,
          conditionData,
          medicationData,
          allergyData,
          surgicalData,
          appointmentData,
        ] = await Promise.all([
          apiService.get(dispatch, "vitals"),
          apiService.get(dispatch, "conditions"),
          apiService.get(dispatch, "medications"),
          apiService.get(dispatch, "allergies"),
          apiService.get(dispatch, "surgeries"),
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
        setConditions(filterByPatient(conditionData));
        setMedications(filterByPatient(medicationData));
        setAllergies(filterByPatient(allergyData));
        setSurgical(filterByPatient(surgicalData));
        setAppointments(
          filterByPatient(appointmentData)
            .filter((app) => new Date(app.date) >= new Date())
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
        <Card title="Upcoming Appointments">
          {appointments.length ? (
            <ul className="divide-y text-sm">
              {appointments.map((app) => (
                <li
                  key={app._id}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setViewType("appointments");
                    setViewData(app);
                    setOpenViewModal(true);
                  }}
                >
                  <div className="font-semibold">
                    {app.doctor?.name || "Doctor"}
                  </div>
                  <div className="text-gray-600">
                    {new Date(app.date).toLocaleDateString()} —{" "}
                    {app.status || "Scheduled"}
                  </div>
                </li>
              ))}
            </ul>
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
        <ClinicalFormModal
          onClose={() => {
            setOpenViewModal(false);
            setViewData(null);
            setViewType(null);
          }}
          mode="view"
          initialData={viewData}
          type={viewType}
          // patient={patient}
        />
      )}
    </div>
  );
}
