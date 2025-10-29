// import { AlertTriangle, Pill, ClipboardList } from "lucide-react";
// import apiService from "../../../core/services/apiService";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";

// export default function ClinicalSnapshot({ patientId }) {
//   const dispatch = useDispatch();
//   const [diagnoses, setDiagnoses] = useState([]);
//   const [medications, setMedications] = useState([]);
//   const [allergies, setAllergies] = useState([]);

//   useEffect(() => {
//     if (!patientId) return;

//     const fetchSnapshotData = async () => {
//       try {
//         const [diag, meds, allergy] = await Promise.all([
//           apiService.get(dispatch, "conditions", { patient: patientId }),
//           apiService.get(dispatch, "medications", { patient: patientId }),
//           apiService.get(dispatch, "allergies", { patient: patientId }),
//         ]);

//         const sortedDiag = (diag || [])
//           .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
//           .slice(0, 3);

//         const isActive = (med) => {
//           const now = new Date();
//           const start = new Date(med.start_date);
//           const end = med.end_date ? new Date(med.end_date) : null;
//           return start <= now && (!end || end >= now);
//         };

//         const activeMeds = (meds || []).filter(isActive).slice(0, 3);
//         const latestAllergies = (allergy || []).slice(0, 3);

//         setDiagnoses(sortedDiag);
//         setMedications(activeMeds);
//         setAllergies(latestAllergies);
//       } catch (error) {
//         console.error("Error fetching snapshot:", error);
//       }
//     };

//     fetchSnapshotData();
//   }, [dispatch, patientId]);

//   return (
//     <div>
//       {/* 🧾 Snapshot summary in grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//         {/* ⚠️ Allergies */}
//         <div className="border rounded-md p-2 bg-red-50/50">
//           <div className="flex items-center gap-1 mb-1">
//             <AlertTriangle className="w-4 h-4 text-red-500" />
//             <span className="text-xs font-semibold text-red-700">
//               Allergies
//             </span>
//           </div>
//           {allergies.length > 0 ? (
//             <ul className="flex flex-wrap gap-1 text-xs text-red-700">
//               {allergies.map((a) => (
//                 <li
//                   key={a._id}
//                   className="px-2 py-0.5 bg-red-100 border border-red-200 rounded-md"
//                 >
//                   {a.allergy_name || a.name}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-xs text-gray-400 italic">None</p>
//           )}
//         </div>

//         {/* 🩺 Diagnoses */}
//         <div className="border rounded-md p-2 bg-blue-50/50">
//           <div className="flex items-center gap-1 mb-1">
//             <ClipboardList className="w-4 h-4 text-blue-500" />
//             <span className="text-xs font-semibold text-blue-700">
//               Diagnoses
//             </span>
//           </div>
//           {diagnoses.length > 0 ? (
//             <ul className="space-y-0.5 text-xs text-gray-700">
//               {diagnoses.map((d) => (
//                 <li key={d._id} className="flex justify-between">
//                   <span>{d.name}</span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-xs text-gray-400 italic">No recent records.</p>
//           )}
//         </div>

//         {/* 💊 Medications */}
//         <div className="border rounded-md p-2 bg-green-50/50">
//           <div className="flex items-center gap-1 mb-1">
//             <Pill className="w-4 h-4 text-green-500" />
//             <span className="text-xs font-semibold text-green-700">
//               Active Medications
//             </span>
//           </div>
//           {medications.length > 0 ? (
//             <ul className="space-y-0.5 text-xs text-gray-700">
//               {medications.map((m) => (
//                 <li key={m._id} className="flex justify-between">
//                   <span>{m.name}</span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-xs text-gray-400 italic">No active meds.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { AlertTriangle, Pill, ClipboardList } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClinicalFormModal from "./ClinicalFormModal";
import { adminOnlyRoles } from "../../../core/constants/rolePresets";

export default function ClinicalSnapshot({ patientId }) {
  const dispatch = useDispatch();
  const [diagnoses, setDiagnoses] = useState([]);
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null);

  const currentUser = useSelector((state) => state.user.userInfo);
  const hasPermission =
    currentUser && adminOnlyRoles.includes(currentUser.role);

  useEffect(() => {
    if (!patientId) return;

    const fetchSnapshotData = async () => {
      try {
        const [diag, meds, allergy] = await Promise.all([
          apiService.get(dispatch, "conditions", { patient: patientId }),
          apiService.get(dispatch, "medications", { patient: patientId }),
          apiService.get(dispatch, "allergies", { patient: patientId }),
        ]);

        const sortedDiag = (diag || [])
          .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
          .slice(0, 3);

        const isActive = (med) => {
          const now = new Date();
          const start = new Date(med.start_date);
          const end = med.end_date ? new Date(med.end_date) : null;
          return start <= now && (!end || end >= now);
        };

        const activeMeds = (meds || []).filter(isActive).slice(0, 3);
        const latestAllergies = (allergy || []).slice(0, 3);

        setDiagnoses(sortedDiag);
        setMedications(activeMeds);
        setAllergies(latestAllergies);
      } catch (error) {
        console.error("Error fetching snapshot:", error);
      }
    };

    fetchSnapshotData();
  }, [dispatch, patientId]);

  const handleRecordClick = (record, type) => {
    setViewData(record);
    setViewType(type);
    setOpenViewModal(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* ⚠️ Allergies */}
        <div className="border rounded-md p-2 bg-red-50/50">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700">
              Allergies
            </span>
          </div>
          {allergies.length > 0 ? (
            <ul className="flex flex-wrap gap-1 text-xs">
              {allergies.map((a) => (
                <li key={a._id}>
                  <button
                    onClick={() => handleRecordClick(a, "allergies")}
                    className="px-2 py-0.5 bg-red-100 border border-red-200 rounded-md text-red-700 hover:bg-red-200 transition"
                  >
                    {a.allergy_name || a.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">None</p>
          )}
        </div>

        {/* 🩺 Diagnoses */}
        <div className="border rounded-md p-2 bg-blue-50/50">
          <div className="flex items-center gap-1 mb-1">
            <ClipboardList className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-blue-700">
              Diagnoses
            </span>
          </div>
          {diagnoses.length > 0 ? (
            <ul className="flex flex-wrap gap-1 text-xs">
              {diagnoses.map((d) => (
                <li key={d._id}>
                  <button
                    onClick={() => handleRecordClick(d, "conditions")}
                    className="px-2 py-0.5 bg-blue-100 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-200 transition"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">No recent records.</p>
          )}
        </div>

        {/* 💊 Medications */}
        <div className="border rounded-md p-2 bg-green-50/50">
          <div className="flex items-center gap-1 mb-1">
            <Pill className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-green-700">
              Active Medications
            </span>
          </div>
          {medications.length > 0 ? (
            <ul className="flex flex-wrap gap-1 text-xs">
              {medications.map((m) => (
                <li key={m._id}>
                  <button
                    onClick={() => handleRecordClick(m, "medications")}
                    className="px-2 py-0.5 bg-green-100 border border-green-200 rounded-md text-green-700 hover:bg-green-200 transition"
                  >
                    {m.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">No active meds.</p>
          )}
        </div>
      </div>

      {/* 🧾 Modal */}
      {openViewModal && (
        <ClinicalFormModal
          onClose={() => {
            setOpenViewModal(false);
            setViewData(null);
            setViewType(null);
          }}
          mode={hasPermission ? "edit" : "view"}
          initialData={viewData}
          type={viewType}
          patient={patientId}
        />
      )}
    </div>
  );
}
