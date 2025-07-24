import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { internalRoles } from "../../../core/constants/rolePresets";
import apiService from "../../../core/services/apiService";
import { getAvatarUrl } from "../../../core/utils/avatarURL";
import { userSettings } from "../../../core/constants/userPresets";
import { getInputValue } from "../../../core/utils/fieldUtils";
import { handleFormSubmit } from "../../../core/utils/formActions/formSubmit";

export default function SettingsPage() {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

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
  }, [dispatch, userInfo]);

  const handleSubmit = async () => {
    await handleFormSubmit({
      dispatch,
      tablename: "users",
      id: userInfo.id,
      data,
      fields: userSettings,
      fileData,
      // navigate: optional if needed
    });
  };

  if (!hasValidRole) return <div>Access denied</div>;
  if (loading || !data) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-sm p-6">
      <div className="max-w-6xl mx-auto flex rounded-lg border shadow-sm">
        {/* Sidebar */}
        <div className="w-64 border-r p-4">
          <nav className="space-y-2">
            {[
              "General",
              "Plan & Pricing",
              "Account",
              "Payment & Billings",
              "Link Account",
              "Language",
              "Preferences",
              "Push Notifications",
            ].map((item, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-md cursor-pointer ${
                  item === "Account"
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          encType="multipart/form-data"
          className="flex-1 p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Account</h3>
            <div className="space-x-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
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
                src={previewUrl ? previewUrl : getAvatarUrl(data.avatar || "")}
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
            {userSettings.map((field, index) => (
              <div key={field.name}>
                <label className="block mb-1 font-medium">{field.label}</label>
                <input
                  type={field.type || "text"}
                  value={getInputValue(data, field)}
                  onChange={(e) =>
                    setData({ ...data, [field.name]: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Delete Account Section */}
          <div className="mt-10">
            <h4 className="font-semibold text-red-600 mb-1">Delete account</h4>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              When you delete your account, you lose access to Front account
              services, and we permanently delete your personal data. You can
              cancel the deletion for 14 days.
            </p>
            <div className="space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Account
              </button>
              <button
                type="button"
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Learn More
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
