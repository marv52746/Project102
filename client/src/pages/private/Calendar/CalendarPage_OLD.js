import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import CalendarModal from "../../../core/components/calendar/CalendarModal";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import CalendarPatientList from "../../../core/components/calendar/CalendarPatientList";
import apiService from "../../../core/services/apiService";
import { getStatusClass } from "../../../core/utils/calendarUtils";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../core/services/slices/notificationSlice";
import { generateDaysInMonth } from "./Utils";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [appointments, setAppointments] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownData, setDropdownData] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const fetchAppointments = useCallback(async () => {
    try {
      // setIsLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const data = await apiService.get(
        null,
        `calendar?month=${month}&year=${year}`
      );
      // console.log(data);
      const map = {};

      data.forEach((appt) => {
        const date = appt.date.split("T")[0];
        if (!map[date]) map[date] = [];
        map[date].push(appt);
      });

      setAppointments(map);
      setHolidays(data.holidays || []);
    } catch (err) {
      dispatch(
        showNotification({
          message: "Failed to load appointments!",
          type: "error",
        })
      );
    }
  }, [currentDate, dispatch]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    setDaysInMonth(generateDaysInMonth(currentDate, appointments, holidays));
  }, [appointments, currentDate, holidays]);

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const today = useMemo(() => new Date(), []);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const handleViewAllAppointments = (day, event) => {
    const rect = event.target.getBoundingClientRect();
    setDropdownData(day.appointments);
    setDropdownPosition({
      top: rect.top + rect.height,
      left: rect.left + rect.width,
    });
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full p-2 box-border bg-white flex">
      <div className="w-4/5  p-2 pt-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToday}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <Home size={20} />
            <span>Today</span>
          </button>

          <button
            onClick={handlePrevMonth}
            className="bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNextMonth}
            className="bg-gray-200 p-2 rounded-full"
          >
            <ChevronRight size={20} />
          </button>

          <div className="text-xl font-medium">
            {monthName} {year}
          </div>
        </div>

        <div
          className="grid grid-cols-7 text-center text-black text-sm"
          style={{ gridTemplateRows: "auto repeat(6, 1fr)", height: "100vh" }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div key={index} className="py-2 border-b border-gray-300">
                {day}
              </div>
            )
          )}

          {daysInMonth.map((day, index) => {
            const appointmentsForDay = day.appointments || [];
            const isCurrentDay =
              day.date.toDateString() === today.toDateString();
            const appointmentsToShow = appointmentsForDay.slice(0, 2);
            const remainingCount = appointmentsForDay.length - 2;

            return (
              <div
                key={index}
                className={`w-full p-2 border ${
                  day.prevMonth ? "text-gray-300" : "text-black"
                } relative flex flex-col justify-start`}
                style={{ minHeight: "100%" }}
              >
                <div className="flex justify-center">
                  <div
                    className={`font-light text-xs ${
                      isCurrentDay ? "rounded-full bg-blue-500 text-white" : ""
                    } inline-block px-2`}
                  >
                    {day.day}
                  </div>
                </div>

                {appointmentsForDay.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {appointmentsToShow.map((appointment, idx) => (
                      <div
                        key={idx}
                        className={`truncate p-1 px-2 rounded shadow-sm mb-1 hover:scale-105 transform cursor-pointer transition ${getStatusClass(
                          appointment.status
                        )}`}
                        onClick={() => handleOpenModal(appointment)}
                      >
                        {appointment.patient_name}
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div
                        className="text-xs text-gray-500 cursor-pointer hover:scale-125 transform transition"
                        onClick={(e) => handleViewAllAppointments(day, e)}
                      >
                        + {remainingCount} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="w-1/3 lg:w-1/4 xl:w-1/5 ml-5 mt-5"> */}
      <div className="p-2 pt-6">
        <CalendarPatientList
          title="Upcoming Appointments"
          patients={Object.values(appointments)
            .flat()
            .filter((appt) => {
              const apptDate = new Date(appt.date);
              apptDate.setHours(0, 0, 0, 0);
              const todayStart = new Date();
              todayStart.setHours(0, 0, 0, 0);
              return apptDate >= todayStart;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // sort by upcoming
            .slice(0, 5)} // show top 5
          handleOpenModal={handleOpenModal}
        />
      </div>

      <CalendarModal
        report={selectedReport}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />

      {isDropdownOpen && dropdownData && (
        <div
          ref={dropdownRef}
          className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 p-2 max-w-xs"
          style={{
            top: dropdownPosition.top - 30 + "px",
            left: dropdownPosition.left - 10 + "px",
          }}
        >
          <ul>
            {dropdownData.map((appointment, idx) => (
              <li
                key={idx}
                className={`text-sm truncate p-1 px-3 rounded shadow-sm mb-1 hover:scale-105 transform cursor-pointer transition ${getStatusClass(
                  appointment.status
                )}`}
                onClick={() => handleOpenModal(appointment)}
              >
                {appointment.patient_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
