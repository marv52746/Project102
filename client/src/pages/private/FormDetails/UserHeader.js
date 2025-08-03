import {
  FileText,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
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

  const [userData, setUserData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const { tablename, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(data);
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

  const user = userData?.user;
  const age = getAge(user?.date_of_birth);
  const formattedDate = formatFullDate(user?.date_of_birth);

  if (!hasValidRole) return <div>Access denied</div>;
  if (!data || !user) return <div className="p-4">User not found.</div>;

  const handleDeleteConfirm = () => {
    setShowDropdown(false);
    handleFormDelete({ dispatch, tablename, id, navigate });
    setShowDeleteModal(false);
  };
  const hasSpecialties = userData?.specialization?.length > 0;

  return (
    <section className="bg-white border rounded-lg p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 relative">
      {/* Avatar + Info */}
      <div
        className={`flex items-center gap-4 flex-1 min-w-[250px] ${
          hasSpecialties ? "items-start" : "items-center"
        }`}
      >
        <img
          src={getAvatarUrl(user.avatar)}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="space-y-1">
          <div className="text-lg font-semibold text-gray-800">
            {user.name || "-"}
          </div>
          <div className="text-sm text-gray-500">
            {age ? age : "-"} {formattedDate && `(${formattedDate})`}
          </div>

          {/* Specialties */}
          {hasSpecialties && (
            <div className="flex flex-wrap gap-2 mt-2">
              {userData.specialization.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-1 text-sm text-gray-600 min-w-[200px]">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {user.phone_number || "-"}
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {user.email || "-"}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {user.address || "-"}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-start gap-2 relative min-w-fit">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Clinical Record
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded-md transition"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10 overflow-hidden">
              <button
                onClick={() =>
                  handleEdit({ tablename: tablename, id: id, navigate })
                }
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-blue-600"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <ClinicalFormModal
              patient={user}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
