import React from "react";
import {
  MapPin,
  ClipboardList,
  Clock,
  Stethoscope,
  FileText,
} from "lucide-react";

export default function OverviewTab() {
  const doctor = {
    name: "Dr. Jane Smith",
    specialization: "Pediatrician",
    location: "123 Main St, Springfield",
    specialties: ["Cardiology", "Pediatrics", "Neurology"],
    education: [
      { title: "MD, Health University", year: 2008 },
      { title: "Residency, City Hospital", year: 2012 },
      { title: "Cardiologist, Central Med", year: "2015–Present" },
    ],
    appointmentStats: {
      upcoming: 8,
      completed: 42,
      cancelled: 3,
    },
    recentActivities: [
      {
        time: "Today 10:00 AM",
        action: "Completed check-up with Ana Cruz",
        icon: <Stethoscope className="w-4 h-4 text-blue-600" />,
      },
      {
        time: "Yesterday 4:15 PM",
        action: "Prescribed antibiotics to Juan Dela Cruz",
        icon: <ClipboardList className="w-4 h-4 text-green-600" />,
      },
      {
        time: "2 days ago",
        action: "Added clinical notes for Maria Lopez",
        icon: <FileText className="w-4 h-4 text-purple-600" />,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Appointment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Upcoming", value: doctor.appointmentStats.upcoming },
          { label: "Completed", value: doctor.appointmentStats.completed },
          { label: "Cancelled", value: doctor.appointmentStats.cancelled },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg shadow text-center space-y-1"
          >
            <p className="text-sm text-gray-500">{item.label} Appointments</p>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Education & Experience */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2 text-gray-800">
          Education & Experience
        </h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {(doctor.education || []).map((item, idx) => (
            <li key={idx}>
              <strong>{item.title}</strong>{" "}
              {item.year && <span>({item.year})</span>}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Location */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2 text-gray-800">
          Clinic Location
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-5 h-5 mr-2" />
          {doctor.location || "No location provided"}
        </div>
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
          <span className="text-sm text-gray-500">Map Placeholder</span>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4 text-gray-800">
          Recent Activity
        </h3>
        <ul className="space-y-4 text-sm text-gray-700">
          {doctor.recentActivities.map((item, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <div className="mt-1">{item.icon}</div>
              <div>
                <p>{item.action}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
