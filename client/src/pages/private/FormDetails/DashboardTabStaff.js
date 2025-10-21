import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  FileText,
  CalendarClock,
  CalendarCheck2,
  UserPlus,
  CalendarPlus,
  FlaskConical,
  CalendarX2,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import UpcomingAppointments from "../FormDetails/UpcomingAppointments";
import apiService from "../../../core/services/apiService";
import AppointmentModal from "./AppointmentModal";
import { formConfigMap } from "../../../core/constants/FieldConfigMap";
import NewPatientModal from "./NewPatientModal";
import NewBaseModal from "./NewBaseModal";
import { useParams } from "react-router-dom";
import OngoingCheckup from "./OngoingCheckup";
import Reloader from "../../../core/components/utils/reloader";

export default function DashboardTabStaff() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { refreshKey } = useSelector((state) => state.utils);
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  const [activities, setActivities] = useState([]);
  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [cancelledAppointments, setcancelledAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [inLobbyAppointments, setInLobbyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const [dayBounds, setDayBounds] = useState({ start: null, end: null });

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0));
    const end = new Date(now.setHours(23, 59, 59, 999));
    setDayBounds({ start, end });
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointments = await apiService.get(dispatch, "appointments", {
          date: "today",
        });
        setAppointmentsToday(appointments);

        // console.log(appointments);

        let upcomingCount = 0;
        let completedTodayCount = 0;
        let inlobbyCount = 0;
        let cancelledCount = 0;
        const feeByDoctor = {};

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
        var completedAppointmentsArr = [];
        var cancelledAppointmentsArr = [];
        var inLobbyArr = [];

        appointments.forEach((a) => {
          if (a.status === "scheduled") {
            upcomingAppointmentsArr.push(a);
            upcomingCount++;
          }

          if (a.status === "ready") {
            inLobbyArr.push(a);
            inlobbyCount++;
          }

          if (a.status === "completed") {
            completedAppointmentsArr.push(a);
            completedTodayCount++;
            const doctorName = a.doctor?.name || "Unknown Doctor";
            const fee = parseFloat(a.amount || 0);
            if (!feeByDoctor[doctorName]) feeByDoctor[doctorName] = 0;
            feeByDoctor[doctorName] += fee;
          }
          if (a.status === "cancelled") {
            cancelledAppointmentsArr.push(a);
            cancelledCount++;
          }
        });

        setStats({
          upcoming: upcomingCount,
          completed: completedTodayCount,
          inLobby: inlobbyCount,
          cancelled: cancelledCount,
          feeByDoctor,
        });

        setActivities(recentActivities);
        setupcomingAppointments(upcomingAppointmentsArr);
        setCompletedAppointments(completedAppointmentsArr);
        setcancelledAppointments(cancelledAppointmentsArr);
        setInLobbyAppointments(inLobbyArr);
        // console.log(upcomingAppointmentsArr);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [dispatch, manualRefresh, refreshKey]);

  const feeCards = Object.entries(stats.feeByDoctor || {}).map(
    ([doctorName, totalFee]) => ({
      label: `${doctorName} - Today’s Fees`,
      value: `₱${totalFee.toLocaleString()}`,
      color: "text-amber-700 border-l-4 border-amber-400",
      icon: <Wallet className="w-6 h-6 text-amber-500" />,
    })
  );

  const statCards = [
    {
      label: "Upcoming Appointments",
      value: stats.upcoming,
      color: "bg-blue-100 text-blue-800",
      icon: <CalendarClock className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Completed Appointments",
      value: stats.completed,
      color: "bg-green-100 text-green-800",
      icon: <CalendarCheck2 className="w-6 h-6 text-green-600" />,
    },

    {
      label: "Cancelled Appointments",
      value: stats.cancelled,
      color: "bg-red-100 text-red-800",
      icon: <CalendarX2 className="w-6 h-6 text-red-600" />,
    },
    ...feeCards,
  ];

  const doctorFeeMap = Object.fromEntries(
    Object.keys(stats.feeByDoctor || {}).map((doctorName) => [
      `${doctorName} - Today’s Fees`,
      completedAppointments.filter(
        (a) => a.doctor?.name === doctorName && a.status === "completed"
      ),
    ])
  );

  // Map stats to appointments
  const statAppointmentsMap = {
    // "In Lobby": inLobbyAppointments,
    "Completed Appointments": completedAppointments,
    "Upcoming Appointments": upcomingAppointments,
    "Cancelled Appointments": cancelledAppointments,
  };

  // Merge into the main map
  const fullStatAppointmentsMap = {
    ...statAppointmentsMap,
    ...doctorFeeMap,
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

  if (loading) return <Reloader text="Loading dashboard..." />;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[90%]">
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
              title={"In Lobby"}
              appointments={inLobbyAppointments}
              // scheduleAppointment={true}
              onSelect={(app) => {
                setViewType("appointments");
                setViewData(app);
                setOpenViewModal(true);
              }}
            />

            <UpcomingAppointments
              title={"Appointments Scheduled Today"}
              appointments={upcomingAppointments}
              // scheduleAppointment={true}
              onSelect={(app) => {
                setViewType("appointments");
                setViewData(app);
                setOpenViewModal(true);
              }}
            />
          </div>

          <div className="space-y-4">
            {/* 🩺 Ongoing Checkup */}
            <OngoingCheckup
              appointments={appointmentsToday.filter(
                (a) =>
                  a.status === "in-progress" &&
                  dayBounds.start &&
                  new Date(a.date) >= dayBounds.start &&
                  new Date(a.date) <= dayBounds.end
              )}
              // appointments={upcomingAppointments}
              onSelect={(app) => {
                setViewType("appointments");
                setViewData(app);
                setOpenViewModal(true);
              }}
            />

            {/* Activity Timeline */}
            {/* <ActivitiesTimeline userID={id} /> */}
          </div>
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

            {fullStatAppointmentsMap[selectedStat] &&
            fullStatAppointmentsMap[selectedStat].length > 0 ? (
              <div className="overflow-x-auto">
                {selectedStat.includes("Fees") && (
                  <p className="text-sm text-gray-600 mb-2">
                    Total:{" "}
                    <span className="font-semibold text-amber-600">
                      ₱
                      {stats.feeByDoctor[
                        selectedStat.replace(" - Today’s Fees", "")
                      ]?.toLocaleString() || "0"}
                    </span>
                  </p>
                )}

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
                      <th className="border border-gray-200 px-3 py-2 text-left">
                        Consultation Fee
                      </th>
                      <th className="border border-gray-200 px-3 py-2 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullStatAppointmentsMap[selectedStat].map((app, idx) => (
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
                        <td className="border border-gray-200 px-3 py-2 capitalize">
                          {`₱ ${(app.amount || 0).toLocaleString()}`}
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
