import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { internalRoles } from "../../../core/constants/rolePresets";
import apiService from "../../../core/services/apiService";
import { getAvatarUrl } from "../../../core/utils/avatarURL";
import { userSettings } from "../../../core/constants/userPresets";
import { getInputValue } from "../../../core/utils/fieldUtils";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
import { handleFormDelete } from "../../../core/components/formActions/formHandlers";
import ConfirmDeleteModal from "../../../core/components/modal/ConfirmDeleteModal";
import ClinicForm from "./ClinicForm";
import { userClinicSettings } from "../../../core/constants/settings";
import QualificationForm from "./QualificationForm";
import LinkAccountForm from "./LinkAccountForm";

export default function SettingsPage() {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Account"); // ✅ Added state for active tab

  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.type);

  const [clinics, setClinics] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const clinicRecords = await apiService.get(dispatch, "clinic", {
          doctors: { $in: [userInfo.id] },
        });
        if (Array.isArray(clinicRecords) && clinicRecords.length > 0) {
          setClinics(clinicRecords);
        } else {
          setClinics([
            {
              name: "",
              address: "",
              phone_number: "",
              email: "",
              website: "",
              short_description: "",
              doctors: [userInfo.id],
              created_by: userInfo.id,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    if (userInfo?.id) {
      fetchClinics();
    }
  }, [dispatch, userInfo, refresh]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const record = await apiService.get(dispatch, `users/${userInfo.id}`);
        setData(record);
      } catch (error) {
        console.error(`Error fetching user details:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchDetails();
    }
  }, [dispatch, userInfo, refresh]);

  // console.log(data);

  const handleSubmit = async () => {
    await handleFormSubmit({
      dispatch,
      tablename: "users",
      id: userInfo.id,
      data,
      fields: [],
      fileData,
      userInfo: userInfo,
      // navigate: optional if needed
    });
  };

  const handleSubmitClinic = async () => {
    for (const clinic of clinics) {
      if (clinic._status === "deleted" && clinic._id) {
        // delete only if it exists in DB
        await handleFormDelete({
          dispatch,
          tablename: "clinic",
          id: clinic._id,
        });
      } else if (clinic._status === "new" || clinic._status === "updated") {
        await handleFormSubmit({
          dispatch,
          tablename: "clinic",
          id: clinic._id, // ✅ important for update
          data: {
            ...clinic,
            doctors: clinic.doctors?.length ? clinic.doctors : [userInfo.id], // ✅ keep doctor
            created_by: clinic.created_by || userInfo.id, // ✅ keep created_by
          },
          fields: userClinicSettings,
        });
      }
    }

    setRefresh(true);
  };

  const handleDeleteConfirm = () => {
    handleFormDelete({
      dispatch,
      tablename: "users",
      id: userInfo.id,
      // navigate,
    });
    setShowDeleteModal(false);
  };

  if (!hasValidRole) return <div>Access denied</div>;
  if (loading || !data) return <div className="p-4">Loading...</div>;

  const tabs = ["Account", "Qualifications", "Affiliations", "Link Account"];

  return (
    <div className="min-h-screen bg-white text-sm p-6">
      <div className="w-full mx-auto flex rounded-lg border shadow-sm">
        {/* Sidebar */}
        <div className="w-56 border-r p-4">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <nav className="space-y-2">
            {tabs.map((item) => (
              <div
                key={item}
                className={`px-3 py-2 rounded-md cursor-pointer ${
                  activeTab === item
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item)} // ✅ make clickable
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Account*/}
          {activeTab === "Account" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              encType="multipart/form-data"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Account</h3>
                <div className="space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Upload Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Photo
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      previewUrl ? previewUrl : getAvatarUrl(data.avatar || "")
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatarUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFileData(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("avatarUpload").click()
                      }
                      className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
                    >
                      Upload Image
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      JPG or PNG. 1MB max
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userSettings.map((field) => (
                  <div key={field.name}>
                    <label className="block mb-1 font-medium">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={getInputValue(data, field)}
                        onChange={(e) =>
                          setData({ ...data, [field.name]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        rows={5}
                        className="w-full border rounded px-3 py-2"
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={getInputValue(data, field)}
                        onChange={(e) =>
                          setData({ ...data, [field.name]: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Delete Account Section */}
              <div className="mt-10">
                <h4 className="font-semibold text-red-600 mb-1">
                  Delete account
                </h4>
                <p className="text-gray-600 text-sm mb-4 max-w-md">
                  When you delete your account, you lose access to Front account
                  services, and we permanently delete your personal data.
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Clinic*/}
          {activeTab === "Affiliations" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Affiliations</h3>
              </div>

              <ClinicForm
                data={clinics}
                setData={setClinics}
                handleSubmitClinic={handleSubmitClinic}
              />
            </>
          )}

          {activeTab === "Qualifications" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Qualifications</h3>
              </div>

              <QualificationForm
                data={data}
                setData={setData}
                handleSubmit={handleSubmit}
              />
            </>
          )}

          {activeTab === "Link Account" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Link Account</h3>
              </div>

              <LinkAccountForm
                data={data}
                setData={setData}
                handleSubmit={handleSubmit}
              />
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
