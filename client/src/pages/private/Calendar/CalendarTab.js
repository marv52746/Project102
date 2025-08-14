import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import apiService from "../../../core/services/apiService";
import { showNotification } from "../../../core/services/slices/notificationSlice";
import CalendarModal from "../../../core/components/calendar/CalendarModal";
import { formatDate, generateDaysInMonth } from "./Utils";
import CalendarDayModal from "../../../core/components/calendar/CalendarDayModal";

export default function CalendarTab({ id, tablename }) {
  const dispatch = useDispatch();
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // const [showDayModal, setShowDayModal] = useState(false);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const monthLabel = currentDate.toLocaleString("default", { month: "long" });

  const fetchData = useCallback(async () => {
    try {
      const params = {
        month,
        year,
        ...(tablename === "doctors" && { doctor: id }),
        ...(tablename === "patients" && { patient: id }),
      };

      // 1. Fetch appointments
      const data = await apiService.get(dispatch, "calendar", params);

      // 2. Fetch EDD schedules
      const eddData = await apiService.get(dispatch, "pregnancies", {
        patient: id,
      });

      // console.log(eddData);

      const grouped = {};
      // Appointments
      data.forEach((a) => {
        const d = a.date.split("T")[0];
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(a);
      });

      // EDDs
      eddData.forEach((e) => {
        const d = e.edd.split("T")[0];
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push({
          ...e,
          date: e.edd, // so modal knows the date
          mode: "EDD",
          title: "Estimated Due Date", // optional extra label for modal
        });
      });

      setAppointments(grouped);
    } catch (error) {
      dispatch(
        showNotification({ message: "Failed to load calendar", type: "error" })
      );
    }
  }, [id, month, year, dispatch, tablename]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const daysInMonth = useMemo(() => {
    return generateDaysInMonth(currentDate, appointments, []);
  }, [appointments, currentDate]);

  const openDayModal = (dayAppointments) => {
    setSelectedDayAppointments(dayAppointments);
    // setShowDayModal(true);
  };

  const handleSelectAppointment = (appt) => {
    setSelectedAppointment(appt);
    // setShowDayModal(false);
  };

  const closeModal = () => {
    // setShowDayModal(false);
    setSelectedDayAppointments([]);
    setSelectedAppointment(null);
  };

  const navigateMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex gap-4">
      <div className="w-full p-2">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentDate(today)}
              className="text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition text-sm"
            >
              Today
            </button>

            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-md hover:bg-gray-200 transition"
              title="Previous Month"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-md hover:bg-gray-200 transition"
              title="Next Month"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="text-xl font-medium text-gray-800">
            {monthLabel} {year}
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-sm text-gray-600 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center font-semibold">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 grid-rows-6 gap-1 h-[600px]">
          {daysInMonth.map((day, idx) => {
            const isToday = formatDate(day.date) === formatDate(today);
            const appts = day.appointments || [];

            const typeCounts = appts.reduce((acc, a) => {
              const type = a.mode || "in-person";
              acc[type] = (acc[type] || 0) + 1;
              return acc;
            }, {});

            return (
              <div
                key={idx}
                className={`border rounded p-1 flex flex-col gap-1 h-full overflow-auto cursor-pointer ${
                  day.isHoliday ? "bg-red-50 text-red-500" : ""
                } ${day.prevMonth ? "text-gray-400" : "text-gray-800"}`}
                onClick={() => appts.length > 0 && openDayModal(appts)}
              >
                <div className="flex justify-between items-center text-xs font-light">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      isToday ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {day.day}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs mt-1">
                  {Object.entries(typeCounts).map(([type, count], i) => {
                    let icon;
                    if (type === "video") {
                      icon = "📹";
                    } else if (type === "in-person") {
                      icon = "😷";
                    } else if (type === "EDD") {
                      icon = "👶";
                    } else {
                      icon = "📅";
                    }

                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-gray-700 text-xs"
                      >
                        <span className="text-base">{icon}</span>
                        <span className="font-medium">{count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(selectedAppointment || selectedDayAppointments.length > 0) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-md w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedAppointment ? (
              <CalendarModal
                report={selectedAppointment}
                onClose={closeModal}
                isOpen={true}
              />
            ) : (
              <CalendarDayModal
                appointments={selectedDayAppointments}
                onClose={closeModal}
                onSelect={handleSelectAppointment}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
