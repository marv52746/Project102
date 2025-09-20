import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  Stethoscope,
  FileText,
  CalendarClock,
  CalendarCheck2,
  CalendarX2,
  UserPlus,
  CalendarPlus,
  Pill,
  Receipt,
  FlaskConical,
} from "lucide-react";
import { useDispatch } from "react-redux";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import UpcomingAppointments from "../FormDetails/UpcomingAppointments";
import apiService from "../../../core/services/apiService";
import UpcomingAppointmentsList from "./UpcomingAppointmentsList";
import AppointmentModal from "./AppointmentModal";
import { formConfigMap } from "../../../core/constants/FieldConfigMap";
import NewPatientModal from "./NewPatientModal";
import NewBaseModal from "./NewBaseModal";
import ActivitiesTimeline from "./ActivitiesTimeline";
import { useParams } from "react-router-dom";

export default function DashboardTabStaff() {
  const { id } = useParams();
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
  const [showAppointmentModal, setAppointmentShowModal] = useState(false);
  const [showPatientModal, setPatientShowModal] = useState(false);
  const [showMedicineModal, setMedicineShowModal] = useState(false);

  const appointmentFields = formConfigMap["appointments"].getFields("create");
  const patientFields = formConfigMap["users"].getFields("create");
  const medicineFields = formConfigMap["inventoryLogs"].getFields("create");

  // Add new states
  const [showStatListModal, setShowStatListModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

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

  // Map stats to appointments
  const statAppointmentsMap = {
    "In Lobby": inLobbyAppointments,
    "Completed Appointments Today": activities.filter((a) =>
      a.action.includes("completed")
    ),
    "Upcoming Appointments": upcomingAppointments,
  };

  const quickActions = [
    {
      label: "New Patient",
      icon: <UserPlus className="w-6 h-6" />,
      color: "text-green-600 hover:bg-green-50",
      action: () => setPatientShowModal(true),
    },
    {
      label: "New Appointment",
      icon: <CalendarPlus className="w-6 h-6" />,
      color: "text-amber-600 hover:bg-amber-50",
      action: () => setAppointmentShowModal(true),
    },
    {
      label: "Log Inventory",
      icon: <FlaskConical className="w-6 h-6" />,
      color: "text-indigo-600 hover:bg-indigo-50",
      action: () => setMedicineShowModal(true),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all duration-150 ${action.color}`}
              >
                <span className="w-6 h-6">{action.icon}</span>{" "}
                {/* bigger icon */}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedStat(card.label);
                setShowStatListModal(true);
              }}
              className={`flex items-center gap-4 p-4 rounded-lg shadow bg-white border-l-4 cursor-pointer hover:shadow-md transition ${card.color}`}
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
              // scheduleAppointment={true}
              onSelect={(app) => {
                setViewType("appointments");
                setViewData(app);
                setOpenViewModal(true);
              }}
            />
          </div>

          <ActivitiesTimeline userID={id} />
        </div>
      </div>

      {/* Appointment Modals */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <AppointmentModal
              tablename={"appointments"}
              type={"Appointment"}
              mode={"create"}
              onClose={() => setAppointmentShowModal(false)}
              fields={appointmentFields}
              setManualRefresh={setManualRefresh}
            />
          </div>
        </div>
      )}

      {/* Patient Modals */}
      {showPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <NewPatientModal
              tablename={"users"}
              mode={"create"}
              onClose={() => setPatientShowModal(false)}
              fields={patientFields}
            />
          </div>
        </div>
      )}

      {/* Medicine Modals */}
      {showMedicineModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg relative z-50">
            <NewBaseModal
              title={"Log Inventory (Sales / Stock In / Stock Out)"}
              tablename={"inventoryLogs"}
              mode={"create"}
              onClose={() => setMedicineShowModal(false)}
              fields={medicineFields}
            />
          </div>
        </div>
      )}

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

      {showStatListModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowStatListModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">{selectedStat}</h2>

            {statAppointmentsMap[selectedStat] &&
            statAppointmentsMap[selectedStat].length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-3 py-2 text-left">
                        Patient
                      </th>
                      <th className="border border-gray-200 px-3 py-2 text-left">
                        Date
                      </th>
                      <th className="border border-gray-200 px-3 py-2 text-left">
                        Status
                      </th>
                      <th className="border border-gray-200 px-3 py-2 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statAppointmentsMap[selectedStat].map((app, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setViewData(app);
                          setViewType("appointments");
                          setShowStatListModal(false);
                          setOpenViewModal(true);
                        }}
                      >
                        <td className="border border-gray-200 px-3 py-2">
                          {app.patient?.name || "Unknown Patient"}
                        </td>
                        <td className="border border-gray-200 px-3 py-2">
                          {new Date(app.date).toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 capitalize">
                          {app.status}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent triggering row click
                              setViewData(app);
                              setViewType("appointments");
                              setShowStatListModal(false);
                              setOpenViewModal(true);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No records found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
