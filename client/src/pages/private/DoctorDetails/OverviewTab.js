import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  Stethoscope,
  FileText,
  CalendarClock,
  CalendarCheck2,
  CalendarX2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import Card from "../FormDetails/Card";
import { capitalizeText } from "../../../core/utils/stringUtils";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";

export default function OverviewTab({ appointments }) {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [activities, setActivities] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null); // "conditions", "medications", etc.

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date();

        let upcomingCount = 0;
        let completedCount = 0;
        let cancelledCount = 0;

        const recentActivities = appointments
          .slice(-5) // last 5 appointments
          .reverse()
          .map((a) => {
            let icon;
            if (a.status === "completed") {
              icon = <ClipboardList className="w-4 h-4 text-green-600" />;
            } else if (a.status === "cancelled") {
              icon = <FileText className="w-4 h-4 text-red-600" />;
            } else {
              icon = <ClipboardList className="w-4 h-4 text-blue-600" />;
            }

            return {
              time: new Date(a.date).toLocaleString(),
              action: `${a.status} appointment with ${
                a.patient?.name || "Unknown"
              }`,
              icon,
            };
          });

        var upcomingAppointmentsArr = [];

        appointments.forEach((a) => {
          const appointmentDate = new Date(a.date);
          if (
            a.status === "scheduled" &&
            appointmentDate >= new Date(today.setHours(0, 0, 0, 0))
          ) {
            upcomingAppointmentsArr.push(a);
            upcomingCount++;
          }
          if (a.status === "completed") completedCount++;
          if (a.status === "cancelled") cancelledCount++;
        });

        setStats({
          upcoming: upcomingCount,
          completed: completedCount,
          cancelled: cancelledCount,
        });

        setActivities(recentActivities);
        setupcomingAppointments(upcomingAppointmentsArr);
        // console.log(upcomingAppointmentsArr);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [dispatch, appointments]);

  const doctor = {
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
      value: stats.upcoming,
      color: "bg-blue-100 text-blue-800",
      icon: <CalendarClock className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "bg-green-100 text-green-800",
      icon: <CalendarCheck2 className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Upcoming Appointments */}
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-md font-semibold text-gray-700">
                Upcoming Appointments
              </h2>
            </div>
            {upcomingAppointments.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingAppointments.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setViewType("appointments");
                      setViewData(app);
                      setOpenViewModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-md font-semibold text-blue-600">
                        {new Date(app.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === "scheduled"
                            ? "bg-gray-100 text-gray-700"
                            : app.status === "cancelled"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {capitalizeText(app.status) || "Scheduled"}
                      </span>
                    </div>

                    <div className="mt-2 text-gray-700 font-medium">
                      {app.patient?.name || "Patient"}
                    </div>

                    {app.reason && (
                      <div className="mt-1 text-sm text-gray-500 truncate">
                        {app.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No upcoming appointments.
              </p>
            )}
          </Card>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
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
      </div>

      {openViewModal && (
        <CalendarModalDetails
          report={viewData}
          onClose={() => {
            setOpenViewModal(false);
            setViewData(null);
            setViewType(null);
          }}
          isOpen={true}
        />
      )}
    </div>
  );
}
