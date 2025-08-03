import React, { useState } from "react";
import {
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  FileTextIcon,
  StarIcon,
  LineChart,
  UsersIcon,
  UserCircleIcon,
} from "lucide-react";

const DoctorDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const doctor = {
    name: "Dr. Jane Smith",
    specialization: "Pediatrician",
    phone: "(123) 456-7890",
    email: "jane.smith@example.com",
    image: "https://via.placeholder.com/150",
    location: "123 Main St, Springfield",
    specialties: ["Cardiology", "Pediatrics", "Neurology"],
    education: [
      { title: "MD, Health University", year: 2008 },
      { title: "Residency, City Hospital", year: 2012 },
      { title: "Cardiologist, Central Med", year: "2015–Present" },
    ],
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "schedule", label: "Schedule" },
    { key: "patients", label: "Patients" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Doctor Profile */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
        <img
          className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-sm"
          src={doctor.image}
          alt="Doctor"
        />
        <h2 className="mt-4 text-2xl font-semibold">{doctor.name}</h2>
        <p className="text-gray-600">{doctor.specialization}</p>
        <div className="mt-4 space-y-1 text-gray-600 text-sm">
          <div className="flex items-center justify-center gap-2">
            <PhoneIcon className="w-4 h-4 text-gray-400" />
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MailIcon className="w-4 h-4 text-gray-400" />
            <span>{doctor.email}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 -mb-px ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-600"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Appointment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Upcoming", "Completed", "Cancelled"].map((label, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">{label} Appointments</p>
                <p className="mt-2 text-2xl font-bold">{[8, 42, 3][idx]}</p>
              </div>
            ))}
            <div className="col-span-full flex space-x-4">
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <CalendarIcon className="w-5 h-5 mr-2" /> Book Appointment
              </button>
              <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                <LineChart className="w-5 h-5 mr-2" /> Message
              </button>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Education & Experience</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {doctor.education.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.title}</strong>{" "}
                  {item.year && <span>({item.year})</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Clinic Location</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPinIcon className="w-5 h-5 mr-2" />
              {doctor.location}
            </div>
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-sm text-gray-500">Map Placeholder</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Weekly Schedule</h3>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Morning</th>
                <th className="px-4 py-2">Afternoon</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Monday", "9:00–12:00", "1:00–4:00"],
                ["Tuesday", "9:00–12:00", "-"],
                ["Wednesday", "-", "-"],
              ].map(([day, morning, afternoon], i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{day}</td>
                  <td className="px-4 py-2">{morning}</td>
                  <td className="px-4 py-2">{afternoon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "patients" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Recent Patients</h3>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Last Visit</th>
                <th className="px-4 py-2 text-left">Condition</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {["John Doe", "Alice Brown"].map((name, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{name}</td>
                  <td className="px-4 py-2">Jul {idx + 1}</td>
                  <td className="px-4 py-2">Flu</td>
                  <td className="px-4 py-2 text-center">
                    <button className="text-blue-500 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Patient Reviews</h3>
          <div className="flex items-center text-yellow-400 mb-2">
            {[...Array(4)].map((_, i) => (
              <StarIcon key={i} className="w-4 h-4" />
            ))}
            <StarIcon className="w-4 h-4 text-gray-300" />
            <span className="ml-2 text-sm text-gray-600">4.0</span>
          </div>
          <p className="text-sm text-gray-700">
            Great experience. Dr. Smith is very attentive.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorDetailsPage;
