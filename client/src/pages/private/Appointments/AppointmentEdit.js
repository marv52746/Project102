import React, { useState } from "react";
import doctorsActivity from "../../../core/data/doctorsActivity.json";
import { useParams } from "react-router-dom";

const AppointmentEdit = () => {
  const { id } = useParams();
  // Find the appointment data based on the `id` parameter from URL
  const data = doctorsActivity.appointments.find(
    (item) => item.id.toString() === id
  );

  const [formData, setFormData] = useState({
    patientId: data.id,
    department: data.department,
    doctorName: data.doctor_name,
    appointmentDate: data.appointment_date,
    timeSlot: data.appointment_time,
    tokenNumber: data.token_number,
    problem: data.problem,
    confirmed: false,
  });

  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert("success");
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div className="container mx-auto p-4 relative">
      <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Appointment</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient ID */}
            <div className="form-group">
              <label
                htmlFor="patientId"
                className="block text-sm font-medium text-gray-700"
              >
                Patient ID
              </label>
              <input
                type="text"
                id="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Patient ID"
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option>Neuro</option>
                <option>Ortho</option>
                <option>General</option>
              </select>
            </div>

            {/* Doctor Name */}
            <div className="form-group">
              <label
                htmlFor="doctorName"
                className="block text-sm font-medium text-gray-700"
              >
                Doctor Name
              </label>
              <input
                type="text"
                id="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Doctor Name"
              />
            </div>

            {/* Appointment Date */}
            <div className="form-group">
              <label
                htmlFor="appointmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Appointment Date
              </label>
              <input
                type="date"
                id="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Time Slot */}
            <div className="form-group">
              <label
                htmlFor="timeSlot"
                className="block text-sm font-medium text-gray-700"
              >
                Time Slot
              </label>
              <select
                id="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option>10AM-11AM</option>
                <option>11AM-12pm</option>
                <option>12PM-01PM</option>
                <option>2PM-3PM</option>
                <option>3PM-4PM</option>
                <option>4PM-5PM</option>
                <option>6PM-7PM</option>
                <option>7PM-8PM</option>
                <option>8PM-9PM</option>
              </select>
            </div>

            {/* Token Number */}
            <div className="form-group">
              <label
                htmlFor="tokenNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Token Number <small>(Auto Generated)</small>
              </label>
              <input
                type="text"
                id="tokenNumber"
                value={formData.tokenNumber}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Token Number"
              />
            </div>

            {/* Problem */}
            <div className="form-group col-span-2">
              <label
                htmlFor="problem"
                className="block text-sm font-medium text-gray-700"
              >
                Problem
              </label>
              <textarea
                id="problem"
                value={formData.problem}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                rows="3"
                placeholder="Problem"
              ></textarea>
            </div>

            {/* Confirm Checkbox */}
            <div className="form-check col-span-2">
              <label className="inline-flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  id="confirmed"
                  checked={formData.confirmed}
                  onChange={handleChange}
                  className="form-checkbox text-indigo-600"
                />
                <span className="ml-2">Please Confirm</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="col-span-2">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Update
              </button>
            </div>
          </div>
        </form>

        {/* Alerts */}
        {alert && (
          <div
            className={`absolute top-[-15px] w-3/4 mt-4 p-4 rounded-lg transition-all ease-in-out duration-300 ${
              alert === "success"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <div className="flex justify-between">
              <div className="flex">
                <strong className="mr-2">
                  {alert === "success"
                    ? "Successfully Updated!"
                    : "Holy guacamole!"}
                </strong>
                <p>
                  {alert === "success"
                    ? "Appointment updated"
                    : "You should check in on some of those fields below."}
                </p>
              </div>
              <button
                onClick={closeAlert}
                className="text-lg font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentEdit;
