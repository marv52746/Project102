import React from "react";
import PatientDetailsCard from "../../../core/components/patient/PatientDetailsCard";
import patientData from "../../../core/data/clinic/patients.json";
import appointmentData from "../../../core/data/clinic/appointments.json";
import staffData from "../../../core/data/clinic/staff.json";
import { useParams } from "react-router-dom";
import PatientHistory from "../../../core/components/patient/PatientHistory";
import PatientBMI from "../../../core/components/patient/PatientBMI";
import PatientDetailsCardv2 from "../../../core/components/patient/PatientDetailsCardv2";

function PatientDetails() {
  const { id } = useParams();
  const patients = patientData.patients;

  // Filter the patients array to find the patient by ID
  const patient = patients.find((patient) => patient.id.toString() === id);

  const data = appointmentData.appointments
    .filter(
      (appointment) => appointment.patient_id.toString() === id.toString()
    )
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .map((appointment) => {
      const appointmentDoctor = staffData.staff.find(
        (d) => d.id === appointment.staff_id
      );

      const formattedDate = new Date(
        appointment.appointment_date
      ).toLocaleString();

      return {
        ...appointment,
        doctor_name: appointmentDoctor
          ? appointmentDoctor.name
          : "Unknown Doctor",
        appointment_date: formattedDate,
      };
    });

  // If no patient is found
  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <PatientDetailsCardv2 tableData={patient} />
      </div>

      <div className="mb-6">
        <PatientDetailsCard patientInfo={patient} />
      </div>

      {/* <div className="mb-6">
        <PatientBMI visits={patient.visits} />
      </div> */}

      <PatientHistory visits={data} />
    </div>
  );
}

export default PatientDetails;
