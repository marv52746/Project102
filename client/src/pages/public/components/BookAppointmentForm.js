import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Check } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { appointmentFormFields } from "../../../core/constants/appointmentPresets";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";

import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
import BookingButton from "./BookingButton";

export default function BookAppointmentForm({
  doctor,
  userInfo,
  dispatch,
  title = "Book Your Appointment",
  description = "",
  onClose,
}) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const currentDate = `${yyyy}-${mm}-${dd}`;

  const [formData, setFormData] = useState({
    id: userInfo?.id || "",
    fullname: userInfo?.fullname || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone_number || "",
    doctor: "",
    date: currentDate,
    time: "Morning",
    reason: "",
  });

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ✅ Load doctors + update user info if needed
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo?.id) {
          const currentUser = await apiService.get(
            dispatch,
            `users/${userInfo.id}`
          );
          setFormData((prev) => ({
            ...prev,
            id: userInfo?.id || "",
            fullname: userInfo?.fullname || "",
            email: currentUser?.email || "",
            phone: currentUser?.phone_number || "",
          }));
        }

        const res = await apiService.get(dispatch, "users", { role: "doctor" });
        const data = Array.isArray(res) ? res : [];
        setDoctorOptions(
          data.map((doc) => ({
            id: doc._id,
            name: doc.fullname || doc.name,
          }))
        );

        // ✅ if doctor prop is passed, set as default
        if (doctor?._id) {
          setFormData((prev) => ({
            ...prev,
            doctor: doctor._id,
          }));
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchData();
  }, [dispatch, userInfo, doctor]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚫 Block if not logged in
    if (!userInfo?.id) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      patient: userInfo?.id,
    };

    await handleFormSubmit({
      dispatch,
      tablename: "appointments",
      data: payload,
      fields: appointmentFormFields,
      userInfo: userInfo,
      notificationMessage: "Your appointment has been scheduled!",
    });

    setLoading(false);
    setSubmitted(true);
    // ✅ close modal after success
    if (onClose) onClose();

    // Reset form
    setFormData({
      id: userInfo?.id || "",
      fullname: userInfo?.fullname || "",
      email: userInfo?.email || "",
      phone: userInfo?.phone_number || "",
      doctor: "",
      date: "",
      time: "",
      reason: "",
    });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-4 sm:p-8">
        <h2 className="text-xl sm:text-3xl font-bold text-pink-700">{title}</h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">{description}</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {/* Full Name */}
            <div
              className="flex items-center border rounded-lg px-3 py-2 bg-white 
  focus-within:ring-2 focus-within:ring-pink-400 col-span-1"
            >
              <User className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                className="w-full min-w-0 outline-none text-sm"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div
              className="flex items-center border rounded-lg px-3 py-2 bg-white 
  focus-within:ring-2 focus-within:ring-pink-400 col-span-1"
            >
              <Mail className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full min-w-0 outline-none text-sm"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400 col-span-1">
              <Phone className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                className="flex-1 outline-none text-sm sm:text-base [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Doctor */}
            <div className="relative col-span-1 ">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="doctor"
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 
               bg-white appearance-none outline-none 
               focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 
               transition-all duration-150"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Doctor
                </option>
                {doctorOptions.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </span>
            </div>

            {/* Date */}
            <div className="relative col-span-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700
               bg-white outline-none 
               focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300
               transition-all duration-150"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Session */}
            <div className="relative col-span-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="time"
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 
      bg-white appearance-none outline-none shadow-sm
      hover:border-pink-400 
      focus-visible:border-pink-400 focus-visible:ring-4 focus-visible:ring-pink-100 
      transition-all duration-150 ease-in-out"
                value={formData.time || "Morning"}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Session
                </option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
              </select>

              {/* ▼ Dropdown Icon */}
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                ▼
              </span>
            </div>

            {/* Reason */}
            <div className="col-span-1 sm:col-span-2 ">
              <textarea
                name="reason"
                placeholder="Reason for Appointment"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base outline-none 
               focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 
               transition-all duration-150"
                rows="3"
                value={formData.reason}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Submit */}
            <BookingButton loading={loading} submitted={submitted} />
          </div>
        </form>
      </div>

      {/* ✅ Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Login Required
            </h2>
            <p className="text-gray-600 mb-4">
              You need to log in to book an appointment.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
              <Link
                to={all_routes.login}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
