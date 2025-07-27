import {
  FileText,
  MapPin,
  MoreHorizontal,
  Phone,
  Stethoscope,
  Video,
  Plus,
  X,
} from "lucide-react";

import { useSelector } from "react-redux";
import { internalRoles } from "../../../core/constants/rolePresets";
import { formatFullDate, getAge } from "../../../core/utils/tableUtils";
import { getAvatarUrl } from "../../../core/utils/avatarURL";
import { useEffect, useState } from "react";
import ClinicalFormModal from "./ClinicalFormModal";

export default function UserHeader({ data }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

  const [patientData, setPatientData] = useState();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setPatientData(data);
  }, [data]);

  const patient = patientData?.patient;
  const age = getAge(patient?.date_of_birth);
  const formattedDate = formatFullDate(patient?.date_of_birth);

  if (!hasValidRole) return <div>Access denied</div>;
  if (!data || !patient) return <div className="p-4">Patient not found.</div>;

  return (
    <section className="bg-white border rounded-lg p-4 flex flex-wrap items-center gap-4 relative">
      <div className="flex items-center gap-3">
        <img
          src={getAvatarUrl(patient.avatar)}
          alt="Avatar"
          className="mt-2 w-14 h-14 object-cover rounded-full"
        />

        <div>
          <div className="font-semibold text-gray-900">
            {patient.name || "-"}
          </div>
          <div className="text-xs text-gray-500">
            {age ? `${age} yo` : "-"} ({formattedDate}), English
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-px h-10 bg-gray-200" />

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone className="h-4 w-4" /> {patient.phone_number}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FileText className="h-4 w-4" /> {patient.email}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4" /> {patient.address}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Stethoscope className="h-4 w-4" /> Mary Ryan DNP
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Clinical Record
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Video className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <FileText className="h-4 w-4" />
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <ClinicalFormModal
              patient={patient}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
