import { useState } from "react";
import { useDispatch } from "react-redux";
import apiService from "../../core/services/apiService";
import { showNotification } from "../../core/services/slices/notificationSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { logoutUser } from "../../core/services/slices/userSlice";

const ForcePasswordChange = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShow = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newpassword !== confirm) {
      dispatch(
        showNotification({ message: "Passwords do not match", type: "error" })
      );
      return;
    }

    try {
      await apiService.post(dispatch, "auth/change-password", {
        password: password,
        newPassword: newpassword,
      });
      dispatch(
        showNotification({
          message: "Password changed successfully!",
          type: "success",
        })
      );

      dispatch(logoutUser());
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClasses = "w-full p-3 border rounded-md pr-10"; // add padding-right for eye button
  const btnClasses = "absolute right-3 top-3 text-gray-500 hover:text-gray-700";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-bold mb-6 text-center">
          Set a New Password
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Current password */}
          <div className="mb-4 relative">
            <input
              type={showPassword.current ? "text" : "password"}
              name="password"
              placeholder="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              required
            />
            <button
              type="button"
              onClick={() => toggleShow("current")}
              className={btnClasses}
            >
              {showPassword.current ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* New password */}
          <div className="mb-4 relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="new_password"
              placeholder="New Password"
              value={newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClasses}
              required
            />
            <button
              type="button"
              onClick={() => toggleShow("new")}
              className={btnClasses}
            >
              {showPassword.new ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Confirm password */}
          <div className="mb-6 relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClasses}
              required
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className={btnClasses}
            >
              {showPassword.confirm ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;
