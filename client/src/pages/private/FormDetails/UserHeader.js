import {
  FileText,
  MapPin,
  MoreHorizontal,
  Phone,
  Stethoscope,
  Video,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { internalRoles } from "../../../core/constants/rolePresets";
import { formatFullDate, getAge } from "../../../core/utils/tableUtils";
import { getAvatarUrl } from "../../../core/utils/avatarURL";
import { useEffect, useState, useRef } from "react";
import ClinicalFormModal from "./ClinicalFormModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  handleEdit,
  handleFormDelete,
} from "../../../core/components/formActions/formHandlers";
import ConfirmDeleteModal from "../../../core/components/modal/ConfirmDeleteModal";

export default function UserHeader({ data }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

  const [patientData, setPatientData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const { tablename, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPatientData(data);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const patient = patientData?.patient;
  const age = getAge(patient?.date_of_birth);
  const formattedDate = formatFullDate(patient?.date_of_birth);

  if (!hasValidRole) return <div>Access denied</div>;
  if (!data || !patient) return <div className="p-4">Patient not found.</div>;

  // const handleEdit = () => {
  //   setShowDropdown(false);
  //   alert("Edit clicked"); // Replace with actual edit logic
  // };

  const handleDeleteConfirm = () => {
    setShowDropdown(false);
    handleFormDelete({ dispatch, tablename, id, navigate });
    setShowDeleteModal(false);
  };

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

      <div className="ml-auto flex items-center gap-2 relative">
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Clinical Record
        </button>

        {/* More button and dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="p-2 hover:bg-gray-100 rounded-md"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-30 bg-white border rounded shadow z-10">
              <button
                onClick={() => handleEdit({ tablename, id, navigate })}
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm text-left text-blue-600"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm text-left text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>

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
      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
