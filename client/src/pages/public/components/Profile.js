import React, { useState } from "react";
import { Pencil, Save, X, Camera, LogOut } from "lucide-react";
import { logoutUser } from "../../../core/services/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    first_name: "Maria",
    last_name: "Lopez",
    email: "maria.lopez@example.com",
    phone: "+63 912 345 6789",
    address: "Bislig City, Surigao del Sur",
    about: "Expecting mom, 28 years old. Excited for this new journey.",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleSave = () => {
    // TODO: Integrate API call here
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file),
      }));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    window.location.reload(); // force full page reload
  };

  return (
    <section
      id="profile"
      className="py-16 bg-gray-50 min-h-screen flex items-center pt-24"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-start gap-10">
          {/* Avatar Section */}
          <div className="relative group w-full md:w-1/3 flex justify-center">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-48 h-48 rounded-full shadow object-cover"
            />
            {/* Edit Avatar Button */}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-4 right-10 bg-pink-600 text-white p-2 rounded-full cursor-pointer shadow hover:bg-pink-700 transition"
            >
              <Camera size={18} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-pink-700 mb-6">
              Profile Information
            </h2>
            <div className="space-y-6">
              {[
                { label: "First Name", key: "first_name" },
                { label: "Last Name", key: "last_name" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Address", key: "address" },
                { label: "About Me", key: "about", textarea: true },
              ].map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4"
                >
                  <span className="font-medium text-gray-700 w-32">
                    {field.label}
                  </span>
                  {isEditing ? (
                    field.textarea ? (
                      <textarea
                        name={field.key}
                        value={user[field.key]}
                        onChange={handleChange}
                        rows="3"
                        className="flex-1 mt-2 md:mt-0 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                      />
                    ) : (
                      <input
                        type="text"
                        name={field.key}
                        value={user[field.key]}
                        onChange={handleChange}
                        className="flex-1 mt-2 md:mt-0 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                      />
                    )
                  ) : (
                    <span className="text-gray-600 mt-2 md:mt-0 flex-1 text-left">
                      {user[field.key]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-8 gap-3 flex-wrap">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
                  >
                    <Save size={18} /> Save
                  </button>
                  <button
                    onClick={toggleEdit}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
                  >
                    <X size={18} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEdit}
                  className="flex items-center gap-2 px-5 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
                >
                  <Pencil size={18} /> Edit Profile
                </button>
              )}
              {/* Logout always visible */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
