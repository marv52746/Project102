import { useEffect, useState } from "react";
import Card from "./Card";
import {
  ShieldAlert,
  Pill,
  AlertTriangle,
  Scissors,
  Activity,
  Baby,
} from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";
import ClinicalFormModal from "./ClinicalFormModal";
import { formatFullDate } from "../../../core/utils/tableUtils";

export default function ClinicalRecordTab({ patientId }) {
  const [clinicalTab, setClinicalTab] = useState("conditions");
  const { refreshKey } = useSelector((state) => state.utils);

  const [vitals, setVitals] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [surgeries, setSurgical] = useState([]);
  const [pregnancies, setPregnancy] = useState([]);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null);

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
          prenancyData,
        ] = await Promise.all([
          apiService.get(dispatch, "vitals", { patient: patientId }),
          apiService.get(dispatch, "conditions", { patient: patientId }),
          apiService.get(dispatch, "medications", { patient: patientId }),
          apiService.get(dispatch, "allergies", { patient: patientId }),
          apiService.get(dispatch, "surgeries", { patient: patientId }),
          apiService.get(dispatch, "pregnancies", { patient: patientId }),
        ]);

        setVitals(vitalData);
        setConditions(conditionData);
        setMedications(medicationData);
        setAllergies(allergyData);
        setSurgical(surgicalData);
        setPregnancy(prenancyData);
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
    };

    fetchData();
  }, [dispatch, patientId, refreshKey]);

  const tabConfig = {
    conditions: {
      label: `Diagnosis(${conditions.length})`,
      icon: ShieldAlert,
    },
    medications: {
      label: `Medications(${medications.length})`,
      icon: Pill,
    },
    allergies: {
      label: `Allergies(${allergies.length})`,
      icon: AlertTriangle,
    },
    vitals: {
      label: `Vitals Log(${vitals.length})`,
      icon: Activity,
    },
    surgeries: {
      label: `Surgical History(${surgeries.length})`,
      icon: Scissors,
    },
    pregnancies: {
      label: `Pregnancy(${pregnancies.length})`,
      icon: Baby,
    },
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full">
      <div className="xl:col-span-3 space-y-4">
        <Card
          title={
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {Object.keys(tabConfig).map((key) => {
                const { label } = tabConfig[key];
                return (
                  <button
                    key={key}
                    onClick={() => setClinicalTab(key)}
                    className={`flex items-center gap-2 pb-1 border-b-2 -mb-1 transition-colors ${
                      clinicalTab === key
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {/* <Icon className="h-4 w-4" /> */}
                    {label}
                  </button>
                );
              })}
            </div>
          }
        >
          {/* --- PREGNANCY TAB --- */}
          {clinicalTab === "pregnancies" && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 w-full">
              {pregnancies.map((p, index) => {
                const gestationalWeeks = p.lmp
                  ? Math.floor(
                      (new Date() - new Date(p.lmp)) / (1000 * 60 * 60 * 24 * 7)
                    )
                  : null;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setViewType(clinicalTab);
                      setViewData(p);
                      setOpenViewModal(true);
                    }}
                    className="cursor-pointer p-4 rounded-lg bg-pink-50 border border-pink-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Baby className="h-6 w-6 text-pink-500" />
                      <h4 className="text-sm font-semibold text-pink-700">
                        {p.is_pregnant ? "Pregnant" : "Not Pregnant"}
                      </h4>
                    </div>

                    {p.is_pregnant && (
                      <>
                        <div className="text-xs text-pink-800 mb-1">
                          <strong>Gravida:</strong> {p.gravida || "0"} |{" "}
                          <strong>Para:</strong> {p.para || "0"}
                        </div>
                        <div className="text-xs text-pink-800 mb-1">
                          <strong>LMP:</strong> {formatFullDate(p.lmp) || "N/A"}
                        </div>
                        <div className="text-xs text-pink-800 mb-1">
                          <strong>EDD:</strong> {formatFullDate(p.edd) || "N/A"}
                        </div>
                        <div className="text-xs text-pink-800 mb-1">
                          <strong>Trimester:</strong> {p.trimester || "N/A"}
                        </div>
                        {gestationalWeeks !== null && (
                          <div className="text-xs text-pink-800 mb-1">
                            <strong>Gestational Age:</strong> {gestationalWeeks}{" "}
                            weeks
                          </div>
                        )}
                        {p.notes && (
                          <p className="text-xs text-pink-900 mt-2">
                            <strong>Notes:</strong> {p.notes}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CONDITIONS */}
          {clinicalTab === "conditions" && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 w-full">
              {conditions.map((c, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setViewType(clinicalTab);
                    setViewData(c);
                    setOpenViewModal(true);
                  }}
                  className="cursor-pointer p-4 rounded-lg bg-yellow-50 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className="h-6 w-6 text-yellow-500" />
                    <h4 className="text-sm font-semibold text-yellow-700">
                      {c.name}
                    </h4>
                  </div>

                  <div className="text-xs text-yellow-800 mb-1">
                    <strong>Diagnosed:</strong>{" "}
                    {formatFullDate(c.diagnosed_date) || "N/A"}
                  </div>

                  <p className="text-xs text-yellow-900 mb-2">
                    <strong>Notes:</strong>{" "}
                    {c.notes ? c.notes : "No notes available."}
                  </p>

                  {c.code && (
                    <span className="inline-block bg-yellow-200 text-yellow-900 text-xs font-medium px-2 py-0.5 rounded">
                      Code: {c.code.toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* MEDICATIONS */}
          {clinicalTab === "medications" && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 w-full">
              {medications.map((m, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setViewType(clinicalTab);
                    setViewData(m);
                    setOpenViewModal(true);
                  }}
                  className="cursor-pointer p-4 rounded-lg bg-green-50 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Pill className="h-6 w-6 text-green-500" />
                    <h4 className="text-sm font-semibold text-green-700">
                      {m.name}
                    </h4>
                  </div>

                  <div className="text-xs text-green-800 mb-1">
                    <strong>Dose:</strong> {m.dose || "N/A"}
                  </div>
                  <div className="text-xs text-green-800 mb-1">
                    <strong>Frequency:</strong> {m.frequency || "N/A"}
                  </div>

                  <div className="text-xs text-green-800 mb-1">
                    <strong>Start:</strong>{" "}
                    {formatFullDate(m.start_date) || "N/A"}
                  </div>
                  <div className="text-xs text-green-800 mb-1">
                    <strong>End:</strong> {formatFullDate(m.end_date) || "N/A"}
                  </div>

                  {m.notes && (
                    <p className="text-xs text-green-900 mt-2">
                      <strong>Notes:</strong> {m.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ALLERGIES */}
          {clinicalTab === "allergies" && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 w-full">
              {allergies.map((a, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setViewType(clinicalTab);
                    setViewData(a);
                    setOpenViewModal(true);
                  }}
                  className="cursor-pointer p-4 rounded-lg bg-red-50 border border-red-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <h4 className="text-sm font-semibold text-red-700">
                      {a.name}
                    </h4>
                  </div>

                  <div className="text-xs text-red-800 mb-1">
                    <strong>Reaction:</strong> {a.reaction || "N/A"}
                  </div>

                  <div className="text-xs text-red-800 mb-1">
                    <strong>Severity:</strong> {a.severity || "Unknown"}
                  </div>

                  <div className="text-xs text-red-800 mb-2">
                    <strong>Recorded:</strong>{" "}
                    {a.created_on
                      ? new Date(a.created_on).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SURGERIES */}
          {/* SURGERIES */}
          {clinicalTab === "surgeries" && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 w-full">
              {surgeries.map((s, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setViewType(clinicalTab);
                    setViewData(s);
                    setOpenViewModal(true);
                  }}
                  className="cursor-pointer p-4 rounded-lg bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Scissors className="h-6 w-6 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-700">
                      {s.name}
                    </h4>
                  </div>

                  <div className="text-xs text-gray-600 mb-1">
                    <strong>Year:</strong> {s.year || "N/A"}
                  </div>

                  {s.surgeon && (
                    <div className="text-xs text-gray-600 mb-1">
                      <strong>Surgeon:</strong> {s.surgeon}
                    </div>
                  )}

                  {s.notes && (
                    <p className="text-xs text-gray-700 mt-2">
                      <strong>Notes:</strong> {s.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* VITALS LOG */}

          {clinicalTab === "vitals" && (
            <ul className="space-y-3 w-full">
              {vitals.map((v, index) => {
                const heightMeters = v.height ? v.height / 100 : null;
                const bmi =
                  heightMeters && v.weight
                    ? (v.weight / (heightMeters * heightMeters)).toFixed(2)
                    : null;

                // Determine BMI category and color
                let bmiCategory = "";
                let bmiColor = "";

                if (bmi) {
                  const bmiValue = parseFloat(bmi);
                  if (bmiValue < 18.5) {
                    bmiCategory = "Underweight";
                    bmiColor = "text-yellow-600";
                  } else if (bmiValue < 25) {
                    bmiCategory = "Normal";
                    bmiColor = "text-green-600";
                  } else if (bmiValue < 30) {
                    bmiCategory = "Overweight";
                    bmiColor = "text-orange-600";
                  } else {
                    bmiCategory = "Obese";
                    bmiColor = "text-red-600";
                  }
                }

                return (
                  <li
                    key={index}
                    onClick={() => {
                      setViewType(clinicalTab);
                      setViewData(v);
                      setOpenViewModal(true);
                    }}
                    className="p-3 rounded-md bg-blue-50 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1 text-blue-700 font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span>{formatFullDate(v.date)}</span>
                      </div>
                      <span className="text-xs text-blue-600">
                        {v.time || ""}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-gray-700 text-xs">
                      <div>
                        <strong>BP:</strong> {v.blood_pressure || "-"}
                      </div>
                      <div>
                        <strong>HR:</strong>{" "}
                        {v.heart_rate ? `${v.heart_rate} bpm` : "-"}
                      </div>
                      <div>
                        <strong>Temp:</strong>{" "}
                        {v.temperature ? `${v.temperature} °C` : "-"}
                      </div>
                      <div>
                        <strong>RR:</strong> {v.respiratory_rate || "-"}
                      </div>
                      <div>
                        <strong>Weight:</strong>{" "}
                        {v.weight ? `${v.weight} kg` : "-"}
                      </div>
                      <div>
                        <strong>Height:</strong>{" "}
                        {v.height ? `${v.height} cm` : "-"}
                      </div>
                      {bmi && (
                        <div className="col-span-2">
                          <strong>BMI:</strong> {bmi}{" "}
                          <span className={`${bmiColor} font-semibold ml-2`}>
                            ({bmiCategory})
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
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
        />
      )}
    </div>
  );
}
