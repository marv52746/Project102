import React, { useState } from "react";
import { Pencil, Save, X, Camera, LogOut } from "lucide-react";
import { logoutUser } from "../../../core/services/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
import {
  userFormFields,
  userSettings,
} from "../../../core/constants/userPresets";
import { getInputValue } from "../../../core/utils/fieldUtils";
import { getAvatarUrl } from "../../../core/utils/avatarURL";
import ConfirmDeleteModal from "../../../core/components/modal/ConfirmDeleteModal";
import { handleFormDelete } from "../../../core/components/formActions/formHandlers";

export function Profile({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState(user);
  const [fileData, setFileData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async () => {
    await handleFormSubmit({
      dispatch,
      tablename: "users",
      id: user._id,
      data,
      fields: userSettings,
      fileData,
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    window.location.reload(); // force full page reload
  };

  const handleDeleteConfirm = () => {
    handleFormDelete({
      dispatch,
      tablename: "users",
      id: user._id,
      // navigate,
    });
    setShowDeleteModal(false);
  };

  return (
    <>
      <section
        id="profile"
        className="py-16 bg-gray-50 min-h-screen flex items-center pt-24"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          encType="multipart/form-data"
          className="bg-white rounded-2xl shadow-lg p-8 mt-10 max-w-5xl mx-auto w-full"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold text-pink-700">Account</h3>
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
              >
                <Save size={18} /> Save
              </button>
              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Upload Image */}
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={
                previewUrl ||
                getAvatarUrl(data?.avatar || "") ||
                "/assets/images/default-male.jpg"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow"
            />
            <div className="flex flex-col gap-2">
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
                onClick={() => document.getElementById("avatarUpload").click()}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition"
              >
                Upload Image
              </button>
              <div className="text-xs text-gray-500">JPG or PNG. Max 1MB</div>
            </div>
          </div>

          {/* Form Fields: Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userSettings.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={getInputValue(data, field) || ""}
                    onChange={(e) =>
                      setData({ ...data, [field.name]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    rows={3}
                    required={field.required}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    value={getInputValue(data, field) || ""}
                    onChange={(e) =>
                      setData({ ...data, [field.name]: e.target.value })
                    }
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Delete Account Section */}
          <div className="mt-10">
            <h4 className="font-semibold text-red-600 mb-2">Delete account</h4>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Deleting your account will remove your access to all services, and
              your personal data will be permanently deleted.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete Account
            </button>
          </div>
        </form>
      </section>

      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
