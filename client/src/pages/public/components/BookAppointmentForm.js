import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Check } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { appointmentFormFields } from "../../../core/constants/appointmentPresets";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
import CustomDatePicker from "../../../core/components/custom/DatePicker";

import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";

export default function BookAppointmentForm({
  doctor,
  userInfo,
  dispatch,
  title = "Book Your Appointment",
  description = "",
  onClose,
}) {
  const [formData, setFormData] = useState({
    id: userInfo?.id || "",
    fullname: userInfo?.fullname || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone_number || "",
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  //   return (
  //     <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
  //       <h2 className="text-3xl font-bold text-pink-700">{title}</h2>
  //       <p className="mt-2 text-gray-600">{description}</p>

  //       <form onSubmit={handleSubmit} className="mt-6">
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //           {/* Full Name */}
  //           <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400 col-span-1">
  //             <User className="w-5 h-5 text-gray-400 mr-2" />
  //             <input
  //               type="text"
  //               name="fullname"
  //               placeholder="Full Name"
  //               className="flex-1 outline-none text-sm"
  //               value={formData.fullname}
  //               onChange={handleChange}
  //               required
  //             />
  //           </div>
  //           {/* Email */}
  //           <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400 col-span-1">
  //             <Mail className="w-5 h-5 text-gray-400 mr-2" />
  //             <input
  //               type="email"
  //               name="email"
  //               placeholder="Email Address"
  //               className="flex-1 outline-none text-sm"
  //               value={formData.email}
  //               onChange={handleChange}
  //               required
  //             />
  //           </div>
  //           {/* Phone */}
  //           <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400 col-span-1">
  //             <Phone className="w-5 h-5 text-gray-400 mr-2" />
  //             <input
  //               type="number"
  //               name="phone"
  //               placeholder="Phone Number"
  //               className="flex-1 outline-none text-sm"
  //               value={formData.phone}
  //               onChange={handleChange}
  //               required
  //             />
  //           </div>
  //           {/* Doctor */}
  //           <div className="relative col-span-1">
  //             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
  //             <select
  //               name="doctor"
  //               className="w-full pl-10 pr-8 py-2 border rounded-lg text-sm text-gray-700
  //                bg-white appearance-none outline-none focus:ring-2 focus:ring-pink-400
  //                transition-all"
  //               value={formData.doctor}
  //               onChange={handleChange}
  //               required
  //             >
  //               <option value="">Select Doctor</option>
  //               {doctorOptions.map((doc) => (
  //                 <option key={doc.id} value={doc.id}>
  //                   {doc.name}
  //                 </option>
  //               ))}
  //             </select>
  //             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
  //               ▼
  //             </span>
  //           </div>

  //           {/* Date */}
  //           <div className="relative col-span-1">
  //             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
  //             <input
  //               type="date"
  //               name="date"
  //               className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm text-gray-700
  //                bg-white outline-none focus:ring-2 focus:ring-pink-400
  //                transition-all"
  //               value={formData.date}
  //               onChange={handleChange}
  //               required
  //             />
  //           </div>

  //           {/* Custome Date */}
  //           {/* <div className="relative col-span-1">
  //             <div
  //               className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400 cursor-pointer"
  //               onClick={() => setShowDatePicker(true)}
  //             >
  //               <Calendar className="w-5 h-5 text-gray-400 mr-2" />
  //               <span className="text-sm text-gray-700">
  //                 {formData.date
  //                   ? new Date(formData.date).toLocaleDateString("en-US", {
  //                       year: "numeric",
  //                       month: "short",
  //                       day: "numeric",
  //                     })
  //                   : "Select Date"}
  //               </span>
  //             </div>
  //             <CustomDatePicker
  //               value={formData.date}
  //               onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
  //               open={showDatePicker}
  //               onClose={() => setShowDatePicker(false)}
  //             />
  //           </div> */}

  //           <div className="relative col-span-1">
  //             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
  //             <input
  //               type="time"
  //               name="time"
  //               className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm text-gray-700
  //                bg-white outline-none focus:ring-2 focus:ring-pink-400
  //                transition-all"
  //               value={formData.time}
  //               onChange={handleChange}
  //               required
  //             />
  //           </div>
  //           {/* Reason */}
  //           <div className="col-span-2">
  //             <textarea
  //               name="reason"
  //               placeholder="Reason for Appointment"
  //               className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-400"
  //               rows="3"
  //               value={formData.reason}
  //               onChange={handleChange}
  //               required
  //             ></textarea>
  //           </div>
  //           {/* Submit */}
  //           <div className="col-span-2">
  //             <button
  //               type="submit"
  //               disabled={loading}
  //               className={`w-full py-3 rounded-lg shadow-md font-semibold transition-all duration-300 flex items-center justify-center gap-2
  //                 ${
  //                   submitted
  //                     ? "bg-green-600 text-white hover:bg-green-700"
  //                     : "bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-700 hover:to-pink-600 hover:shadow-lg"
  //                 }`}
  //             >
  //               {submitted ? (
  //                 <>
  //                   <Check size={18} /> Appointment Booked
  //                 </>
  //               ) : loading ? (
  //                 "Booking..." // ⏳ shows instantly on click
  //               ) : (
  //                 "Confirm Appointment"
  //               )}
  //             </button>
  //           </div>
  //         </div>
  //       </form>
  //     </div>
  //   );

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-700">
          {title}
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">{description}</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="flex-1 outline-none text-sm sm:text-base"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Doctor */}
            <div className="relative col-span-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="doctor"
                className="w-full pl-10 pr-8 py-2 border rounded-lg text-sm sm:text-base text-gray-700 
             bg-white appearance-none outline-none focus:ring-2 focus:ring-pink-400
             transition-all"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>
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
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm sm:text-base text-gray-700
             bg-white outline-none focus:ring-2 focus:ring-pink-400
             transition-all"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Time */}
            <div className="relative col-span-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="time"
                name="time"
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm sm:text-base text-gray-700
             bg-white outline-none focus:ring-2 focus:ring-pink-400
             transition-all"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            {/* Reason */}
            <div className="col-span-1 sm:col-span-2">
              <textarea
                name="reason"
                placeholder="Reason for Appointment"
                className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-pink-400"
                rows="3"
                value={formData.reason}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Submit */}
            <div className="col-span-1 sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg shadow-md font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${
                submitted
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-700 hover:to-pink-600 hover:shadow-lg"
              }`}
              >
                {submitted ? (
                  <>
                    <Check size={18} /> Appointment Booked
                  </>
                ) : loading ? (
                  "Booking..."
                ) : (
                  "Confirm Appointment"
                )}
              </button>
            </div>
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
