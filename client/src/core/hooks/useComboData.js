import { useState, useEffect } from "react";

const useComboData = (appointments, currentYear) => {
  const [comboData, setComboData] = useState([]);

  useEffect(() => {
    const processAppointments = () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const currentMonth = new Date().getMonth(); // Get the current month index (0-11)

      // Initialize an array to store the processed data
      const monthlyData = months.map((month) => ({
        month,
        appointments: 0,
        patients: new Set(),
      }));

      // Loop through each appointment and process the data
      appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date);
        const appointmentYear = appointmentDate.getFullYear(); // Get the year of the appointment
        const monthIndex = appointmentDate.getMonth(); // Get the month index (0-11)

        // Skip appointments that are not from the current year
        if (appointmentYear !== currentYear) {
          return;
        }

        // Skip future months (after the current month)
        if (appointmentYear === currentYear && monthIndex > currentMonth) {
          return;
        }

        // Count the number of appointments for each month
        monthlyData[monthIndex].appointments += 1;

        // Track unique patients for each month using a Set
        monthlyData[monthIndex].patients.add(appointment.patient_id);
      });

      // Convert patients Set to the number of distinct patients
      const finalData = monthlyData.map((data, index) => {
        if (index > currentMonth) {
          // Set appointments and patients to null for future months
          return {
            ...data,
            appointments: null,
            patients: null,
          };
        }
        return {
          ...data,
          patients: data.patients.size,
        };
      });

      setComboData(finalData);
    };

    processAppointments();
  }, [appointments, currentYear]); // Re-run when appointments or currentYear change

  return comboData;
};

export default useComboData;
