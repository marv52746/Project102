import { useEffect, useState } from "react";
import Card from "./Card";
import {
  FileText,
  Plus,
  ShieldAlert,
  Thermometer,
  HeartPulse,
  Gauge,
  Weight,
} from "lucide-react";
import { formatFullDate } from "../../../core/utils/tableUtils";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";
import ClinicalFormModal from "./ClinicalFormModal";

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

// Static Seeds
const followUpsSeed = [
  { id: 1, title: "Tobacco Screening", date: null },
  {
    id: 2,
    title: "Alcohol Misuse Screening",
    date: new Date("2021-05-01T17:30:00"),
  },
  {
    id: 3,
    title: "Abdominal Aortic Aneurysm Screening by ultrasonography",
    date: null,
  },
  { id: 4, title: "Depression Screening", date: null },
];

const activitiesSeed = [
  {
    id: 1,
    date: "2025-01-21",
    title: "Appointment",
    reason: "back pain",
    amount: null,
  },
  {
    id: 2,
    date: "2025-01-20",
    title: "Payment Made",
    reason: null,
    amount: 20,
  },
  {
    id: 3,
    date: "2025-01-13",
    title: "Annual Wellness Completed",
    reason: null,
    amount: null,
  },
];

const documentsSeed = [
  { id: 1, name: "Check In" },
  { id: 2, name: "Consent Form" },
  { id: 3, name: "Lab Results" },
];

// Main Component
export default function DashboardTab({ patientId }) {
  const [followUps, setFollowUps] = useState(followUpsSeed);
  const [clinicalTab, setClinicalTab] = useState("conditions");
  const { refreshKey } = useSelector((state) => state.utils);

  const [vitals, setVitals] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [surgeries, setSurgical] = useState([]);

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
        ] = await Promise.all([
          apiService.get(dispatch, "vitals"),
          apiService.get(dispatch, "conditions"),
          apiService.get(dispatch, "medications"),
          apiService.get(dispatch, "allergies"),
          apiService.get(dispatch, "surgeries"),
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
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
    };

    fetchData();
  }, [dispatch, patientId, refreshKey]);

  const schedule = (id) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, date: new Date() } : f))
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-4">
        {/* VITALS */}
        <Card title="Vitals">
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

        {/* CLINICAL DATA */}
        <Card
          title={
            <div className="flex items-center gap-4 text-sm">
              {["conditions", "medications", "allergies", "surgeries"].map(
                (key) => {
                  const map = {
                    conditions: `Conditions (${conditions.length})`,
                    medications: `Medications (${medications.length})`,
                    allergies: `Allergies (${allergies.length})`,
                    surgeries: `Surgical History (${surgeries.length})`,
                  };
                  return (
                    <button
                      key={key}
                      onClick={() => setClinicalTab(key)}
                      className={`pb-1 border-b-2 -mb-1 transition-colors ${
                        clinicalTab === key
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {map[key]}
                    </button>
                  );
                }
              )}
            </div>
          }
        >
          {clinicalTab === "conditions" && (
            <ul className="space-y-2">
              {conditions.map((c, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setViewType(clinicalTab);
                    setViewData(c);
                    setOpenViewModal(true);
                  }}
                  className="flex items-center justify-between p-3 rounded-md bg-yellow-50 border border-yellow-100"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <ShieldAlert className="h-4 w-4 text-yellow-500" /> {c.name}
                  </span>
                  <span className="text-xs text-gray-500">{c.code}</span>
                </li>
              ))}
            </ul>
          )}

          {clinicalTab === "medications" && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 font-medium">Medication</th>
                    <th className="py-2 font-medium">Dose</th>
                    <th className="py-2 font-medium">Frequency</th>
                    {/* <th className="py-2 font-medium">Start Date</th>
                    <th className="py-2 font-medium">End Date</th> */}
                    <th className="py-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((m, index) => (
                    <tr
                      key={index}
                      className="border-t"
                      onClick={() => {
                        setViewType(clinicalTab);
                        setViewData(m);
                        setOpenViewModal(true);
                      }}
                    >
                      <td className="py-2">{m.name}</td>
                      <td className="py-2">{m.dose}</td>
                      <td className="py-2">{m.frequency}</td>
                      {/* <td className="py-2">{m.start_date}</td>
                      <td className="py-2">{m.end_date}</td> */}
                      <td className="py-2">{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {clinicalTab === "allergies" && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {allergies.map((a, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setViewType(clinicalTab);
                    setViewData(a);
                    setOpenViewModal(true);
                  }}
                >
                  {a.name} - <span className="text-gray-500">{a.reaction}</span>
                </li>
              ))}
            </ul>
          )}

          {clinicalTab === "surgeries" && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {surgeries.map((s, index) => (
                <li
                  key={index}
                  // className="py-1 flex items-center gap-2"
                  onClick={() => {
                    setViewType(clinicalTab);
                    setViewData(s);
                    setOpenViewModal(true);
                  }}
                >
                  {s.name} ({s.year})
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* TIMELINE + DOCUMENTS */}
      <div className="space-y-4">
        <Card title="Activities Timeline">
          <ol className="relative border-s border-gray-200 ml-2 text-sm">
            {activitiesSeed.map((a) => (
              <li key={a.id} className="mb-6 ms-4">
                <div className="absolute w-3 h-3 bg-blue-200 rounded-full -start-1.5 mt-1.5 border border-white"></div>
                <time className="text-xs text-gray-500">
                  {formatFullDate(a.date)}
                </time>
                <div className="font-medium">{a.title}</div>
                {a.reason && (
                  <div className="text-gray-500 text-xs">
                    Reason: {a.reason}
                  </div>
                )}
                {a.amount && (
                  <div className="text-gray-500 text-xs">${a.amount}</div>
                )}
              </li>
            ))}
          </ol>
        </Card>

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
