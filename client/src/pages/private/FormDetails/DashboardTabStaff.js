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
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import UpcomingAppointments from "../FormDetails/UpcomingAppointments";
import apiService from "../../../core/services/apiService";
import UpcomingAppointmentsList from "./UpcomingAppointmentsList";

export default function DashboardTabStaff() {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [activities, setActivities] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [inLobbyAppointments, setInLobbyAppointments] = useState([]);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [manualRefresh, setManualRefresh] = useState(0);

  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null); // "conditions", "medications", etc.

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date();
        const appointments = await apiService.get(dispatch, "appointments");

        let upcomingCount = 0;
        let completedTodayCount = 0;
        let inlobbyCount = 0;

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
        var inLobbyArr = [];

        appointments.forEach((a) => {
          const appointmentDate = new Date(a.date);
          if (
            a.status === "scheduled" &&
            appointmentDate >= new Date(today.setHours(0, 0, 0, 0))
          ) {
            upcomingAppointmentsArr.push(a);
            upcomingCount++;
          }

          if (
            a.status === "ready" &&
            appointmentDate >= new Date(today.setHours(0, 0, 0, 0))
          ) {
            inLobbyArr.push(a);
            inlobbyCount++;
          }

          if (
            a.status === "completed" &&
            appointmentDate === new Date(today.setHours(0, 0, 0, 0))
          ) {
            completedTodayCount++;
          }
        });

        setStats({
          upcoming: upcomingCount,
          completed: completedTodayCount,
          inLobby: inlobbyCount,
        });

        setActivities(recentActivities);
        setupcomingAppointments(upcomingAppointmentsArr);
        setInLobbyAppointments(inLobbyArr);
        // console.log(upcomingAppointmentsArr);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [dispatch, manualRefresh]);

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
      label: "In Lobby",
      value: stats.inLobby,
      color: "bg-green-100 text-green-800",
      icon: <ClipboardList className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Completed Appointments Today",
      value: stats.completed,
      color: "bg-green-100 text-green-800",
      icon: <CalendarCheck2 className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Upcoming Appointments",
      value: stats.upcoming,
      color: "bg-blue-100 text-blue-800",
      icon: <CalendarClock className="w-6 h-6 text-blue-600" />,
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
              <p className="text-sm">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Upcoming Appointments */}
        <div className="xl:col-span-2 space-y-4">
          <UpcomingAppointments
            title={"Upcoming Appointments"}
            appointments={upcomingAppointments}
            scheduleAppointment={true}
            onSelect={(app) => {
              setViewType("appointments");
              setViewData(app);
              setOpenViewModal(true);
            }}
          />
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {/* In Lobby Appointments */}
          <UpcomingAppointmentsList
            title={"In Lobby"}
            appointments={inLobbyAppointments}
            setShowModal
            onSelect={(app) => {
              setViewType("appointments");
              setViewData(app);
              setOpenViewModal(true);
            }}
          />

          {/* <div className="bg-white p-4 rounded-lg shadow">
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
          </div> */}
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
          onRefresh={() => setManualRefresh((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
