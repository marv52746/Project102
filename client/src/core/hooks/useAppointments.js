import { useState, useEffect } from "react";

export const useAppointments = (appointmentsData, patientsData, staffData) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Helper function to format date
    const formatDate = (date) => new Date(date).toLocaleString();
    const extractDate = (date) => new Date(date).toLocaleDateString();

    const todayString = new Date().toLocaleDateString(); // Current date string for comparison

    const filteredAppointments = appointmentsData.appointments
      .map((appointment) => {
        // Find patient name based on patient_id
        const patient = patientsData.patients.find(
          (p) => p.id === appointment.patient_id
        );
        // Find doctor name based on doctor_id
        const doctor = staffData.staff.find(
          (d) => d.id === appointment.staff_id
        );

        // Format the appointment_date to local date string
        const formattedDate = formatDate(appointment.appointment_date);

        // Extract only the date part from the appointment_date
        const appointmentDateString = extractDate(appointment.appointment_date);

        // Only return the appointment if the date matches today
        if (appointmentDateString === todayString) {
          return {
            ...appointment,
            patient_name: patient ? patient.name : "Unknown Patient",
            doctor_name: doctor ? doctor.name : "Unknown Doctor",
            appointment_date: formattedDate, // Add formatted date here
          };
        }
        return null; // Filter out appointments not on today
      })
      .filter((appointment) => appointment !== null) // Remove any null values (appointments not today)
      .sort((a, b) => b.id - a.id); // Sort by appointment ID in descending order

    // Update the state with filtered and sorted appointments
    setAppointments(filteredAppointments);
  }, [appointmentsData, patientsData, staffData]); // Re-run when any of the data props change

  return appointments;
};
