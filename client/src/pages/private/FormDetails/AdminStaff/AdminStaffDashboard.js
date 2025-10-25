import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  FileText,
  CalendarClock,
  CalendarCheck2,
  CalendarX2,
  UserPlus,
  CalendarPlus,
  FlaskConical,
  Wallet,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { formConfigMap } from "../../../../core/constants/FieldConfigMap";
import UpcomingAppointments from "../UpcomingAppointments";
import OngoingCheckup from "../OngoingCheckup";
import CalendarModalDetails from "../../../../core/components/calendar/CalendarModalDetails";
import AppointmentModal from "../AppointmentModal";
import NewPatientModal from "../NewPatientModal";
import NewBaseModal from "../NewBaseModal";
import apiService from "../../../../core/services/apiService";
import InventoryMovementModal from "../Modals/InventoryTransactionModal";
import InventoryTransactionModal from "../Modals/InventoryTransactionModal";

export default function AdminStaffDashboard({ appointments }) {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  const [upcomingAppointments, setupcomingAppointments] = useState([]);
  const [todayAppointments, setuptodayAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [inLobbyAppointments, setInLobbyAppointments] = useState([]);
  const [manualRefresh, setManualRefresh] = useState(0);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewType, setViewType] = useState(null); // "conditions", "medications", etc.

  const [showAppointmentModal, setAppointmentShowModal] = useState(false);
  const [showPatientModal, setPatientShowModal] = useState(false);
  const [showMedicineModal, setMedicineShowModal] = useState(false);

  const appointmentFields = formConfigMap["appointments"].getFields("create");
  const patientFields = formConfigMap["users"].getFields("create");
  const medicineFields = formConfigMap["inventoryLogs"].getFields("create");

  const [showStatListModal, setShowStatListModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

  const [dayBounds, setDayBounds] = useState({ start: null, end: null });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const now = new Date();
        const startOfDayPH = new Date(now.setHours(0, 0, 0, 0));
        const endOfDayPH = new Date(now.setHours(23, 59, 59, 999));

        const doctors = await apiService.get(dispatch, "users", {
          role: "doctor",
        });

        let upcomingCount = 0;
        let completedCount = 0;
        let cancelledCount = 0;
        let todayTotal = 0;
        let totalConsultationFee = 0;

        const feeByDoctor = {};
        doctors.forEach((doctor) => (feeByDoctor[doctor.name] = 0));

        const upcomingAppointmentsArr = [];
        var completedAppointmentsArr = [];
        const todayAppointmentsArr = [];
        const inLobbyArr = [];

        appointments.forEach((a) => {
          const appointmentDate = new Date(a.date);

          if (
            appointmentDate >= startOfDayPH &&
            appointmentDate <= endOfDayPH
          ) {
            todayTotal++;
            todayAppointmentsArr.push(a);
            if (a.status === "scheduled") {
              upcomingAppointmentsArr.push(a);
              upcomingCount++;
            }
            if (a.status === "ready") {
              inLobbyArr.push(a);
            }
            if (a.status === "completed") {
              completedAppointmentsArr.push(a);
              completedCount++;
              //   totalConsultationFee += Number(a.amount || 0);
              const doctorName = a.doctor?.name || "Unknown Doctor";
              const fee = parseFloat(a.amount || 0);
              if (!feeByDoctor[doctorName]) feeByDoctor[doctorName] = 0;
              feeByDoctor[doctorName] += fee;
            }
            if (a.status === "cancelled") cancelledCount++;
          }
        });

        setStats({
          today: todayTotal,
          upcoming: upcomingCount,
          completed: completedCount,
          cancelled: cancelledCount,
          totalFee: totalConsultationFee,
          feeByDoctor,
        });

        setCompletedAppointments(completedAppointmentsArr);
        setupcomingAppointments(upcomingAppointmentsArr);
        setuptodayAppointments(todayAppointmentsArr);
        setInLobbyAppointments(inLobbyArr);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [dispatch, appointments, manualRefresh]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0));
    const end = new Date(now.setHours(23, 59, 59, 999));
    setDayBounds({ start, end });
  }, []);

  const feeCards = Object.entries(stats.feeByDoctor || {}).map(
    ([doctorName, totalFee]) => ({
      label: `${doctorName}`,
      value: `₱${totalFee.toLocaleString()}`,
      color: "text-amber-700 border-l-4 border-amber-400",
      icon: <Wallet className="w-6 h-6 text-amber-500" />,
    })
  );

  //   console.log(feeCards);

  // 👇 Update to only include today's completed & cancelled
  const statAppointmentsMap = {
    "Today’s Appointments": todayAppointments,

    "Completed Appointments": appointments.filter(
      (a) =>
        a.status === "completed" &&
        dayBounds.start &&
        new Date(a.date) >= dayBounds.start &&
        new Date(a.date) <= dayBounds.end
    ),
    "Cancelled Appointments": appointments.filter(
      (a) =>
        a.status === "cancelled" &&
        dayBounds.start &&
        new Date(a.date) >= dayBounds.start &&
        new Date(a.date) <= dayBounds.end
    ),
  };

  const statCards = [
    ...feeCards.map((f) => ({
      label: f.label,
      value: f.value,
      color: "text-amber-800",
      icon: <Wallet className="w-6 h-6 text-amber-500" />,
    })),
    {
      label: "Today’s Appointments",
      value: stats.today,
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
  ];

  const doctorFeeMap = Object.fromEntries(
    Object.keys(stats.feeByDoctor || {}).map((doctorName) => [
      `${doctorName}`,
      completedAppointments.filter(
        (a) => a.doctor?.name === doctorName && a.status === "completed"
      ),
    ])
  );

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

  // Merge into the main map
  const fullStatAppointmentsMap = {
    ...statAppointmentsMap,
    ...doctorFeeMap,
  };

  //   console.log(fullStatAppointmentsMap);

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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedStat(card.label);
                setShowStatListModal(true);
              }}
              className={`flex items-center gap-4 p-4 rounded-lg shadow bg-white border-l-4 ${card.color} cursor-pointer hover:bg-gray-50`}
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
              appointments={appointments.filter(
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
      {/* {showMedicineModal && (
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
      )} */}
      {showMedicineModal && (
        <InventoryTransactionModal
          onClose={() => setMedicineShowModal(false)}
          fields={medicineFields}
        />
      )}

      {showStatListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowStatListModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">{selectedStat}</h2>

            {fullStatAppointmentsMap[selectedStat] &&
            fullStatAppointmentsMap[selectedStat].length > 0 ? (
              <div className="overflow-x-auto">
                {Object.keys(stats.feeByDoctor || {}).includes(
                  selectedStat
                ) && (
                  <p className="text-sm text-gray-600 mb-2">
                    Total:{" "}
                    <span className="font-semibold text-amber-600">
                      ₱
                      {stats.feeByDoctor[selectedStat]?.toLocaleString() || "0"}
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
                          {new Date(app.date).toLocaleDateString()}
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
                              e.stopPropagation();
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
