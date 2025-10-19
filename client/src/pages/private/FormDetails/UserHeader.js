import {
  FileText,
  MapPin,
  Phone,
  Edit,
  Trash2,
  MoreVertical,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { internalRoles } from "../../../core/constants/rolePresets";
import {
  formatFullDate,
  getAge,
  normalizeTableName,
} from "../../../core/utils/tableUtils";
import { getAvatarUrl } from "../../../core/utils/avatarURL";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  handleEdit,
  handleFormDelete,
} from "../../../core/components/formActions/formHandlers";
import ConfirmDeleteModal from "../../../core/components/modal/ConfirmDeleteModal";
import { logoutUser } from "../../../core/services/slices/userSlice";
import apiService from "../../../core/services/apiService";

export default function UserHeader({ data }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activePregnancy, setActivePregnancy] = useState(null);

  const dropdownRef = useRef(null);
  const { tablename: rawTablename, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tablename = normalizeTableName(rawTablename);

  // 🟢 Fetch pregnancy info
  useEffect(() => {
    if (!id) return;
    const fetchPregnancy = async () => {
      try {
        const res = await apiService.get(dispatch, "pregnancies", {
          patient: id,
        });
        if (Array.isArray(res)) {
          const active = res.find((p) => p.status === "active");
          setActivePregnancy(active || null);
        }
      } catch (err) {
        console.error("Error fetching pregnancy data:", err);
      }
    };
    fetchPregnancy();
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = data;
  const age = getAge(user?.date_of_birth);
  const formattedDate = formatFullDate(user?.date_of_birth);

  if (!hasValidRole) return <div>Access denied</div>;
  if (!data || !user) return <div className="p-4">User not found.</div>;

  const handleDeleteConfirm = () => {
    setShowDropdown(false);
    handleFormDelete({ dispatch, tablename, id, navigate });
    setShowDeleteModal(false);
  };

  const isCurrentUser = userInfo?.id === id;

  const handleLogout = () => {
    dispatch(logoutUser()); // 🟢 clear redux state
    navigate("/login"); // 🟢 redirect to login
  };

  // 🟢 Self-view header
  if (isCurrentUser) {
    return (
      <section className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(user.avatar)}
            alt="Avatar"
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Hi {user.name?.split(" ")[0] || "there"}!
            </h2>
            <p className="text-sm text-gray-500">Welcome back 👋</p>
          </div>
        </div>

        {/* Dropdown Actions */}
        <div
          className="flex items-start gap-2 relative min-w-fit"
          ref={dropdownRef}
        >
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded-md transition"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10 overflow-hidden">
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

              {/* 🟢 Logout button (only for current user) */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      </section>
    );
  }

  // 🟣 Default view for other users
  const hasSpecialties = data?.specialization?.length > 0;

  return (
    <section className="bg-white border rounded-lg p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 relative">
      {/* Avatar + Info */}
      <div
        className={`flex items-center gap-4 flex-1 min-w-[350px] max-w-[400px] ${
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

          {/* 🩷 Show pregnancy image & EDD */}
          {activePregnancy && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src="/assets/images/tabs3.png"
                alt="Pregnancy Status"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-sm text-pink-700 font-medium">
                {activePregnancy.edd
                  ? formatFullDate(activePregnancy.edd)
                  : "N/A"}
              </span>
            </div>
          )}

          {/* Specialties */}
          {hasSpecialties && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.specialization.map((item, idx) => (
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

      {/* Dropdown Actions */}
      <div
        className="flex items-start gap-2 relative min-w-fit"
        ref={dropdownRef}
      >
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="p-2 hover:bg-gray-100 rounded-md transition"
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
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

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
