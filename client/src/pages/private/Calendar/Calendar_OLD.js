import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import birthReports from "../../../core/data/birthReports.json";
import CalendarModal from "../../../core/components/CalendarModal";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import CalendarPatientList from "../../../core/components/CalendarPatientList";

// Helper function to format dates
const formatDate = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// Helper function to generate a days array for the month view
const generateDaysInMonth = (date, appointments) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days = [];

  const startDay = startOfMonth.getDay();

  // Add previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = new Date(date.getFullYear(), date.getMonth(), -i);
    days.push({ day: day.getDate(), prevMonth: true, date: day });
  }

  // Add current month days
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    const currentDay = new Date(date.getFullYear(), date.getMonth(), i);
    const formattedDate = formatDate(currentDay);
    days.push({
      day: i,
      prevMonth: false,
      date: currentDay,
      appointments: appointments[formattedDate] || [],
    });
  }

  // Add next month days
  const nextMonthStartDay = (startDay + endOfMonth.getDate()) % 7;
  for (let i = 0; nextMonthStartDay + i < 6; i++) {
    const day = new Date(date.getFullYear(), date.getMonth() + 1, i + 1);
    days.push({ day: day.getDate(), prevMonth: true, date: day });
  }

  return days;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownData, setDropdownData] = useState(null); // Data for the dropdown
  const [dropdownPosition, setDropdownPosition] = useState(null); // Position for the dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // To toggle dropdown visibility

  const dropdownRef = useRef(null); // Reference for the dropdown menu

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const appointments = useMemo(() => {
    const appointmentsMap = {};
    birthReports.birthReports.forEach((report) => {
      const dateToUse = report.actualBirthDate || report.forecastDate;
      if (!appointmentsMap[dateToUse]) {
        appointmentsMap[dateToUse] = [];
      }
      appointmentsMap[dateToUse].push(report);
    });
    return appointmentsMap;
  }, []);

  const getDaysInMonth = useCallback(
    (date) => {
      return generateDaysInMonth(date, appointments);
    },
    [appointments]
  );

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDate));
  }, [currentDate, getDaysInMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const today = useMemo(() => new Date(), []);
  const overduePatients = useMemo(
    () =>
      birthReports.birthReports.filter(
        (report) =>
          new Date(report.forecastDate) < today && !report.actualBirthDate
      ),
    [today]
  );

  const upcomingPatients = useMemo(
    () =>
      birthReports.birthReports.filter(
        (report) =>
          new Date(report.forecastDate) >= today && !report.actualBirthDate
      ),
    [today]
  );

  const completedPatients = useMemo(
    () =>
      birthReports.birthReports.filter((report) => {
        if (!report.actualBirthDate) return false;
        const actualBirthDate = new Date(report.actualBirthDate);
        const today = new Date();

        return (
          actualBirthDate.getFullYear() === today.getFullYear() &&
          actualBirthDate.getMonth() === today.getMonth()
        );
      }),
    []
  );

  // Handle view all appointments click
  const handleViewAllAppointments = (day, event) => {
    const rect = event.target.getBoundingClientRect();
    setDropdownData(day.appointments);
    setDropdownPosition({
      top: rect.top + rect.height, // Position it below the clicked cell
      left: rect.left + rect.width, // Position it to the right of the clicked cell
    });
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  // const PatientList = ({ title, patients, statusColor }) => {

  //   if (patients.length === 0) return null;

  //   // Sort the patients array by forecastDate
  //   const sortedPatients = [...patients].sort((a, b) => {
  //     const dateA = new Date(a.forecastDate);
  //     const dateB = new Date(b.forecastDate);
  //     return dateA - dateB; // Sort in ascending order (earliest first)
  //   });

  //   return (
  //     <div className="mb-5">
  //       <h3 className=" font-semibold text-gray-800 flex items-center space-x-2">
  //         <span>{title}</span>
  //       </h3>

  //       <ul className=" text-sm text-gray-700">
  //         {sortedPatients.map((patient, idx) => (
  //           <li
  //             key={idx}
  //             className="flex items-center space-x-4 py-1 px-4 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out"
  //             onClick={() => handleOpenModal(patient)}
  //           >
  //             <div
  //               className={`w-3 h-3 rounded-full ${statusColor} transition-all duration-300`}
  //             ></div>
  //             <div className="flex flex-col">
  //               <span className="font-medium text-gray-800">
  //                 {patient.patientName}
  //               </span>
  //               <span className="text-xs text-gray-500">
  //                 {patient.forecastDate}
  //               </span>
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // };

  // Click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full p-2 box-border bg-white flex">
      <div className="w-4/5">
        <div className="flex justify-start items-center space-x-4">
          <div className="flex items-center space-x-4 text-black">
            <button
              onClick={handleToday}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold transition duration-200 py-2 px-6 rounded-lg flex items-center space-x-2"
            >
              <Home size={20} />
              <span>Today</span>
            </button>
            <button
              onClick={handlePrevMonth}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="text-xl flex items-center">
            <span>
              {monthName} {year}
            </span>
          </div>
        </div>

        <div
          className="grid grid-cols-7 gap-0 text-center text-black text-sm"
          style={{
            gridTemplateRows: "auto repeat(6, 1fr)",
            height: "100vh",
          }}
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
                className={`w-full p-2 border hover:bg-blue-100 ${
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
                        className={`truncate overflow-hidden whitespace-nowrap p-1 rounded-md shadow-sm mb-1 hover:scale-105 transform cursor-pointer transition-transform duration-200 ${
                          !appointment.actualBirthDate &&
                          new Date(appointment.forecastDate) < today
                            ? "bg-red-500 text-white"
                            : appointment.actualBirthDate
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                        onClick={() => handleOpenModal(appointment)}
                      >
                        {appointment.patientName}
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div
                        className="text-xs text-gray-500 cursor-pointer hover:scale-125 transform transition-transform duration-200"
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

      <div className="w-1/3 lg:w-1/4 xl:w-1/5 ml-10 rounded-lg flex flex-col justify-center mt-5">
        <CalendarPatientList
          title="Completed Births this Month"
          patients={completedPatients}
          statusColor="bg-green-500"
          handleOpenModal={handleOpenModal}
        />
        <CalendarPatientList
          title="Overdue"
          patients={overduePatients}
          statusColor="bg-red-500"
          handleOpenModal={handleOpenModal}
        />
        <CalendarPatientList
          title="Upcoming Births"
          patients={upcomingPatients.slice(0, 5)}
          statusColor="bg-blue-500"
          handleOpenModal={handleOpenModal}
        />
      </div>

      {/* Modal */}
      <CalendarModal
        report={selectedReport}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />

      {/* Dropdown Menu for Appointments */}
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
                className={`text-sm truncate overflow-hidden whitespace-nowrap p-1 px-3 rounded-md shadow-sm mb-1 hover:scale-105 transform cursor-pointer transition-transform duration-200 ${
                  !appointment.actualBirthDate &&
                  new Date(appointment.forecastDate) < today
                    ? "bg-red-500 text-white"
                    : appointment.actualBirthDate
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
                onClick={() => handleOpenModal(appointment)}
              >
                {appointment.patientName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendar;
