// import { useEffect, useState, useMemo } from "react";
// import {
//   ShieldAlert,
//   Pill,
//   AlertTriangle,
//   Scissors,
//   Activity,
//   Baby,
//   Stethoscope,
//   FlaskConical,
//   LayoutList,
//   LayoutGrid,
// } from "lucide-react";
// import apiService from "../../../core/services/apiService";
// import { useDispatch, useSelector } from "react-redux";
// import ClinicalFormModal from "./ClinicalFormModal";
// import { formatFullDate } from "../../../core/utils/tableUtils";
// import { adminOnlyRoles } from "../../../core/constants/rolePresets";
// import UltrasoundModalNew from "../../../core/components/modal/UltrasoundModalNew";
// import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
// import { handleUltrasoundSubmit } from "../../../core/components/formActions/handleUltrasoundSubmit";

// export default function ClinicalRecordTab({ patientId }) {
//   const [clinicalTab, setClinicalTab] = useState("conditions");
//   const [viewMode, setViewMode] = useState("list");
//   const [search, setSearch] = useState("");

//   const { refreshKey } = useSelector((state) => state.utils);
//   const currentUser = useSelector((state) => state.user.userInfo);
//   const hasPermission =
//     currentUser && adminOnlyRoles.includes(currentUser.role);

//   const [data, setData] = useState({
//     vitals: [],
//     conditions: [],
//     medications: [],
//     allergies: [],
//     surgeries: [],
//     pregnancies: [],
//     ultrasounds: [],
//     labrequest: [],
//   });

//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [openUltrasound, setOpenUltrasound] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [viewType, setViewType] = useState(null);

//   const dispatch = useDispatch();
//   console.log(viewData);

//   useEffect(() => {
//     if (!patientId) return;
//     const fetchData = async () => {
//       try {
//         const [
//           vitals,
//           conditions,
//           medications,
//           allergies,
//           surgeries,
//           pregnancies,
//           ultrasounds,
//           labrequest,
//         ] = await Promise.all([
//           apiService.get(dispatch, "vitals", { patient: patientId }),
//           apiService.get(dispatch, "conditions", { patient: patientId }),
//           apiService.get(dispatch, "medications", { patient: patientId }),
//           apiService.get(dispatch, "allergies", { patient: patientId }),
//           apiService.get(dispatch, "surgeries", { patient: patientId }),
//           apiService.get(dispatch, "pregnancies", { patient: patientId }),
//           apiService.get(dispatch, "ultrasound", { patient: patientId }),
//           apiService.get(dispatch, "labrequest", { patient: patientId }),
//         ]);

//         setData({
//           vitals,
//           conditions,
//           medications,
//           allergies,
//           surgeries,
//           pregnancies,
//           ultrasounds,
//           labrequest,
//         });
//       } catch (error) {
//         console.error("Error fetching clinical data:", error);
//       }
//     };
//     fetchData();
//   }, [dispatch, patientId, refreshKey]);

//   const tabConfig = {
//     conditions: { label: "Diagnosis", icon: ShieldAlert, color: "yellow" },
//     medications: { label: "Medications", icon: Pill, color: "green" },
//     pregnancies: { label: "Pregnancy", icon: Baby, color: "pink" },
//     ultrasounds: { label: "Ultrasound", icon: Stethoscope, color: "blue" },
//     labrequest: { label: "Lab Requests", icon: FlaskConical, color: "green" },
//     allergies: { label: "Allergies", icon: AlertTriangle, color: "red" },
//     vitals: { label: "Vitals Log", icon: Activity, color: "blue" },
//     surgeries: { label: "Surgical History", icon: Scissors, color: "gray" },
//   };

//   const fieldMap = {
//     vitals: [
//       { key: "blood_pressure", label: "BP" },
//       { key: "heart_rate", label: "HR" },
//       { key: "temperature", label: "Temp" },
//       { key: "weight", label: "Weight" },
//       { key: "height", label: "Height" },
//     ],
//     conditions: [
//       { key: "name", label: "Diagnosis" },
//       { key: "notes", label: "Notes" },
//     ],
//     medications: [
//       { key: "name", label: "Medicine" },
//       { key: "dose", label: "Dosage" },
//       { key: "frequency", label: "Frequency" },
//     ],
//     allergies: [
//       { key: "reaction", label: "Reaction" },
//       { key: "notes", label: "Notes" },
//     ],
//     surgeries: [
//       { key: "year", label: "Year" },
//       { key: "surgeon", label: "Surgeon" },
//       { key: "notes", label: "Notes" },
//     ],
//     pregnancies: [
//       { key: "gravida_para", label: "Gravida / Para" },
//       { key: "lmp", label: "LMP" },
//       { key: "edd", label: "EDD" },
//       { key: "status", label: "Status" },
//     ],
//     ultrasounds: [
//       { key: "others", label: "Findings" },
//       { key: "impression", label: "Impression" },
//     ],
//     labrequest: [
//       { key: "status", label: "Status" },
//       { key: "result", label: "Results" },
//       { key: "notes", label: "Notes" },
//     ],
//   };

//   const currentData = useMemo(() => {
//     const list = data[clinicalTab] || [];
//     if (!search.trim()) return list;

//     const searchTerm = search.toLowerCase();

//     // Only search among visible fields for the current tab
//     const searchKeys = [
//       "name",
//       "type",
//       "status",
//       "result",
//       ...fieldMap[clinicalTab]?.map((f) => f.key),
//     ];

//     return list.filter((item) =>
//       searchKeys.some((key) => {
//         const value = item[key];
//         if (value == null) return false;

//         // handle dates and other values gracefully
//         const text =
//           typeof value === "string"
//             ? value.toLowerCase()
//             : typeof value === "number"
//             ? String(value)
//             : value?.toString().toLowerCase();

//         return text.includes(searchTerm);
//       })
//     );
//   }, [clinicalTab, data, search]);

//   const handleSave = async (type, formData) => {
//     if (type === "ultrasound") {
//       await handleUltrasoundSubmit({ dispatch, data: formData });
//     }
//     if (formData._id) {
//       await handleFormSubmit({
//         dispatch,
//         tablename: type,
//         data: formData,
//         id: formData._id,
//         fields: [],
//       });
//     }
//   };

//   const { icon: TabIcon, color } = tabConfig[clinicalTab];
//   const textColor = `text-${color}-700`;
//   const bgColor = `bg-${color}-50 border-${color}-200`;
//   const iconColor = `text-${color}-500`;

//   return (
//     <div className="w-full space-y-4">
//       <div className="bg-white border rounded-lg p-4">
//         <div className="pb-4 border-b space-y-3 mb-5">
//           {/* Tabs */}
//           <div className="flex flex-wrap items-center gap-3 text-sm">
//             {Object.keys(tabConfig).map((key) => {
//               const { label } = tabConfig[key];
//               const count = data[key]?.length || 0;
//               const isActive = clinicalTab === key;
//               return (
//                 <button
//                   key={key}
//                   onClick={() => setClinicalTab(key)}
//                   className={`px-3 py-1.5 rounded-full border transition-all duration-150 ${
//                     isActive
//                       ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
//                       : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {label} <span className="text-xs opacity-70">({count})</span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Search + Toggle */}
//           <div className="flex flex-wrap justify-end items-center gap-2">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search records..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-3 pr-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 absolute right-2 top-2.5 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
//                 />
//               </svg>
//             </div>

//             <button
//               onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}
//               className="p-2 border rounded-lg hover:bg-gray-100 transition-colors"
//               title={
//                 viewMode === "list"
//                   ? "Switch to Card View"
//                   : "Switch to List View"
//               }
//             >
//               {viewMode === "list" ? (
//                 <LayoutGrid className="h-5 w-5 text-gray-600" />
//               ) : (
//                 <LayoutList className="h-5 w-5 text-gray-600" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         {viewMode === "card" ? (
//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {currentData
//               .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
//               .map((item, index) => (
//                 <div
//                   key={index}
//                   onClick={() => {
//                     if (clinicalTab === "ultrasounds") setOpenUltrasound(true);
//                     else setOpenViewModal(true);
//                     setViewType(clinicalTab);
//                     setViewData(item);
//                   }}
//                   className={`cursor-pointer p-4 rounded-lg ${bgColor} shadow-sm hover:shadow-md transition-shadow`}
//                 >
//                   <div className="flex items-center gap-3 mb-2">
//                     <TabIcon className={`h-6 w-6 ${iconColor}`} />
//                     <h4 className={`text-sm font-semibold ${textColor}`}>
//                       {item.name || item.type || "Record"}
//                     </h4>
//                   </div>
//                   <p className="text-xs text-gray-600 mb-2">
//                     {formatFullDate(item.created_on)}
//                   </p>
//                   <div className="text-xs space-y-1">
//                     {fieldMap[clinicalTab]?.map((f) => (
//                       <p key={f.key}>
//                         <strong>{f.label}:</strong>{" "}
//                         {["lmp", "edd"].includes(f.key)
//                           ? formatFullDate(item[f.key])
//                           : item[f.key] || "—"}
//                       </p>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th className="p-2">Name / Type</th>
//                   {fieldMap[clinicalTab]?.map((f) => (
//                     <th key={f.key} className="p-2 truncate max-w-[250px]">
//                       {f.label}
//                     </th>
//                   ))}
//                   <th className="p-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentData.length > 0 ? (
//                   currentData
//                     .sort(
//                       (a, b) => new Date(b.created_on) - new Date(a.created_on)
//                     )
//                     .map((item, i) => (
//                       <tr
//                         key={i}
//                         onClick={() => {
//                           if (clinicalTab === "ultrasounds")
//                             setOpenUltrasound(true);
//                           else setOpenViewModal(true);
//                           setViewType(clinicalTab);
//                           setViewData(item);
//                         }}
//                         className="cursor-pointer hover:bg-gray-50"
//                       >
//                         <td className="p-2 flex items-center gap-2 ">
//                           <TabIcon className={`h-4 w-4 ${iconColor}`} />
//                           {item.name || item.type || "Record"}
//                         </td>
//                         {fieldMap[clinicalTab]?.map((f) => (
//                           <td
//                             key={f.key}
//                             className="p-2 truncate max-w-[250px]"
//                           >
//                             {["lmp", "edd"].includes(f.key)
//                               ? formatFullDate(item[f.key])
//                               : item[f.key] || "—"}
//                           </td>
//                         ))}
//                         <td className="p-2">
//                           {formatFullDate(item.created_on) || "N/A"}
//                         </td>
//                       </tr>
//                     ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={fieldMap[clinicalTab]?.length + 2}
//                       className="p-4 text-center text-gray-500"
//                     >
//                       No records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {openViewModal && (
//         <ClinicalFormModal
//           onClose={() => {
//             setOpenViewModal(false);
//             setViewData(null);
//             setViewType(null);
//           }}
//           mode={hasPermission ? "edit" : "view"}
//           initialData={viewData}
//           type={viewType}
//           patient={patientId}
//         />
//       )}

//       {openUltrasound && (
//         <UltrasoundModalNew
//           title="Ultrasound Data"
//           hasPermission={hasPermission}
//           isOpen={openUltrasound}
//           onClose={() => setOpenUltrasound(false)}
//           onSave={(data) => handleSave("ultrasound", data)}
//           initialData={viewData}
//           patient={viewData?.patient}
//           doctor={viewData?.appointment.doctor}
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useMemo } from "react";
import {
  ShieldAlert,
  Pill,
  AlertTriangle,
  Scissors,
  Activity,
  Baby,
  Stethoscope,
  FlaskConical,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";
import ClinicalFormModal from "./ClinicalFormModal";
import { formatFullDate } from "../../../core/utils/tableUtils";
import { adminOnlyRoles } from "../../../core/constants/rolePresets";
import UltrasoundModalNew from "../../../core/components/modal/UltrasoundModalNew";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
import { handleUltrasoundSubmit } from "../../../core/components/formActions/handleUltrasoundSubmit";

export default function ClinicalRecordTab({ patientId }) {
  const [clinicalTab, setClinicalTab] = useState("conditions");
  const [viewMode, setViewMode] = useState("list");
  const [search, setSearch] = useState("");

  const { refreshKey } = useSelector((state) => state.utils);
  const currentUser = useSelector((state) => state.user.userInfo);
  const hasPermission =
    currentUser && adminOnlyRoles.includes(currentUser.role);

  const [data, setData] = useState({
    vitals: [],
    conditions: [],
    medications: [],
    allergies: [],
    surgeries: [],
    pregnancies: [],
    ultrasounds: [],
    labrequest: [],
  });

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openUltrasound, setOpenUltrasound] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!patientId) return;
    const fetchData = async () => {
      try {
        const [
          vitals,
          conditions,
          medications,
          allergies,
          surgeries,
          pregnancies,
          ultrasounds,
          labrequest,
        ] = await Promise.all([
          apiService.get(dispatch, "vitals", { patient: patientId }),
          apiService.get(dispatch, "conditions", { patient: patientId }),
          apiService.get(dispatch, "medications", { patient: patientId }),
          apiService.get(dispatch, "allergies", { patient: patientId }),
          apiService.get(dispatch, "surgeries", { patient: patientId }),
          apiService.get(dispatch, "pregnancies", { patient: patientId }),
          apiService.get(dispatch, "ultrasound", { patient: patientId }),
          apiService.get(dispatch, "labrequest", { patient: patientId }),
        ]);

        setData({
          vitals,
          conditions,
          medications,
          allergies,
          surgeries,
          pregnancies,
          ultrasounds,
          labrequest,
        });
      } catch (error) {
        console.error("Error fetching clinical data:", error);
      }
    };
    fetchData();
  }, [dispatch, patientId, refreshKey]);

  const tabConfig = {
    conditions: { label: "Diagnosis", icon: ShieldAlert, color: "yellow" },
    medications: { label: "Medications", icon: Pill, color: "green" },
    pregnancies: { label: "Pregnancy", icon: Baby, color: "pink" },
    ultrasounds: { label: "Ultrasound", icon: Stethoscope, color: "blue" },
    labrequest: { label: "Lab Requests", icon: FlaskConical, color: "green" },
    allergies: { label: "Allergies", icon: AlertTriangle, color: "red" },
    vitals: { label: "Vitals Log", icon: Activity, color: "blue" },
    surgeries: { label: "Surgical History", icon: Scissors, color: "gray" },
  };

  const fieldMap = {
    vitals: [
      { key: "blood_pressure", label: "BP" },
      { key: "heart_rate", label: "HR" },
      { key: "temperature", label: "Temp" },
      { key: "weight", label: "Weight" },
      { key: "height", label: "Height" },
    ],
    conditions: [
      { key: "name", label: "Diagnosis" },
      { key: "notes", label: "Notes" },
    ],
    medications: [
      { key: "name", label: "Medicine" },
      { key: "dose", label: "Dosage" },
      { key: "frequency", label: "Frequency" },
    ],
    allergies: [
      { key: "reaction", label: "Reaction" },
      { key: "notes", label: "Notes" },
    ],
    surgeries: [
      { key: "year", label: "Year" },
      { key: "surgeon", label: "Surgeon" },
      { key: "notes", label: "Notes" },
    ],
    pregnancies: [
      { key: "gravida_para", label: "Gravida / Para" },
      { key: "lmp", label: "LMP" },
      { key: "edd", label: "EDD" },
      { key: "status", label: "Status" },
    ],
    ultrasounds: [
      { key: "others", label: "Findings" },
      { key: "impression", label: "Impression" },
    ],
    labrequest: [
      { key: "status", label: "Status" },
      { key: "result", label: "Results" },
      { key: "notes", label: "Notes" },
    ],
  };

  // Filter + Search
  const currentData = useMemo(() => {
    const list = data[clinicalTab] || [];
    if (!search.trim()) return list;

    const searchTerm = search.toLowerCase();
    const searchKeys = [
      "name",
      "type",
      "status",
      "result",
      ...fieldMap[clinicalTab]?.map((f) => f.key),
    ];

    return list.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;

        const text =
          typeof value === "string"
            ? value.toLowerCase()
            : typeof value === "number"
            ? String(value)
            : value?.toString().toLowerCase();

        return text.includes(searchTerm);
      })
    );
  }, [clinicalTab, data, search]);

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(currentData.length / rowsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return currentData
      .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
      .slice(start, end);
  }, [currentData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [clinicalTab, search]);

  const handleSave = async (type, formData) => {
    if (type === "ultrasound") {
      await handleUltrasoundSubmit({ dispatch, data: formData });
    }
    if (formData._id) {
      await handleFormSubmit({
        dispatch,
        tablename: type,
        data: formData,
        id: formData._id,
        fields: [],
      });
    }
  };

  const { icon: TabIcon, color } = tabConfig[clinicalTab];
  const textColor = `text-${color}-700`;
  const bgColor = `bg-${color}-50 border-${color}-200`;
  const iconColor = `text-${color}-500`;

  return (
    <div className="w-full space-y-4">
      <div className="bg-white border rounded-lg p-4">
        <div className="pb-4 border-b space-y-3 mb-5">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {Object.keys(tabConfig).map((key) => {
              const { label } = tabConfig[key];
              const count = data[key]?.length || 0;
              const isActive = clinicalTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setClinicalTab(key)}
                  className={`px-3 py-1.5 rounded-full border transition-all duration-150 ${
                    isActive
                      ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                      : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {label} <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search + Toggle */}
          <div className="flex flex-wrap justify-start items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}
              className="p-2 border rounded-lg hover:bg-gray-100 transition-colors"
              title={
                viewMode === "list"
                  ? "Switch to Card View"
                  : "Switch to List View"
              }
            >
              {viewMode === "list" ? (
                <LayoutGrid className="h-5 w-5 text-gray-600" />
              ) : (
                <LayoutList className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <div className="relative w-full sm:w-64">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute right-2 top-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "card" ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentData
              .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
              .map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (clinicalTab === "ultrasounds") setOpenUltrasound(true);
                    else setOpenViewModal(true);
                    setViewType(clinicalTab);
                    setViewData(item);
                  }}
                  className={`cursor-pointer p-4 rounded-lg ${bgColor} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TabIcon className={`h-6 w-6 ${iconColor}`} />
                    <h4 className={`text-sm font-semibold ${textColor}`}>
                      {item.name || item.type || "Record"}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {formatFullDate(item.created_on)}
                  </p>
                  <div className="text-xs space-y-1">
                    {fieldMap[clinicalTab]?.map((f) => (
                      <p key={f.key}>
                        <strong>{f.label}:</strong>{" "}
                        {["lmp", "edd"].includes(f.key)
                          ? formatFullDate(item[f.key])
                          : item[f.key] || "—"}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <>
            {/* Table View with Pagination */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Name / Type</th>
                    {fieldMap[clinicalTab]?.map((f) => (
                      <th key={f.key} className="p-2 truncate max-w-[250px]">
                        {f.label}
                      </th>
                    ))}
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, i) => (
                      <tr
                        key={i}
                        onClick={() => {
                          if (clinicalTab === "ultrasounds")
                            setOpenUltrasound(true);
                          else setOpenViewModal(true);
                          setViewType(clinicalTab);
                          setViewData(item);
                        }}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="p-2 flex items-center gap-2 ">
                          <TabIcon className={`h-4 w-4 ${iconColor}`} />
                          {item.name || item.type || "Record"}
                        </td>
                        {fieldMap[clinicalTab]?.map((f) => (
                          <td
                            key={f.key}
                            className="p-2 truncate max-w-[250px]"
                          >
                            {["lmp", "edd"].includes(f.key)
                              ? formatFullDate(item[f.key])
                              : item[f.key] || "—"}
                          </td>
                        ))}
                        <td className="p-2">
                          {formatFullDate(item.created_on) || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={fieldMap[clinicalTab]?.length + 2}
                        className="p-4 text-center text-gray-500"
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-end items-center gap-3 mt-3 px-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={`px-3 py-1 border rounded-lg text-sm ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={`px-3 py-1 border rounded-lg text-sm ${
                      currentPage === totalPages
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
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

      {openUltrasound && (
        <UltrasoundModalNew
          title="Ultrasound Data"
          hasPermission={hasPermission}
          isOpen={openUltrasound}
          onClose={() => setOpenUltrasound(false)}
          onSave={(data) => handleSave("ultrasound", data)}
          initialData={viewData}
          patient={viewData?.patient}
          doctor={viewData?.appointment?.doctor}
        />
      )}
    </div>
  );
}
