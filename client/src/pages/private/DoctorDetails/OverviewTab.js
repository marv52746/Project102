import React from "react";
import {
  MapPin,
  ClipboardList,
  Clock,
  Stethoscope,
  FileText,
  CalendarClock,
  CalendarCheck2,
  CalendarX2,
} from "lucide-react";

export default function OverviewTab() {
  const doctor = {
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

  const statCards = [
    {
      label: "Upcoming",
      value: doctor.appointmentStats.upcoming,
      color: "bg-blue-100 text-blue-800",
      icon: <CalendarClock className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Completed",
      value: doctor.appointmentStats.completed,
      color: "bg-green-100 text-green-800",
      icon: <CalendarCheck2 className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Cancelled",
      value: doctor.appointmentStats.cancelled,
      color: "bg-red-100 text-red-800",
      icon: <CalendarX2 className="w-6 h-6 text-red-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Appointment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 p-4 rounded-lg shadow bg-white border-l-4 ${card.color}`}
          >
            <div>{card.icon}</div>
            <div>
              <p className="text-sm">{card.label} Appointments</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
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
