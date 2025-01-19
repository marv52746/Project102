import React from "react";
import { useParams } from "react-router-dom";
import staffData from "../../../core/data/clinic/staff.json";
import patientsData from "../../../core/data/clinic/patients.json";
import appointmentData from "../../../core/data/clinic/appointments.json";
import DoctorDetailsCard from "../../../core/components/doctor/DoctorDetailsCard";
import DoctorActivity from "../../../core/components/doctor/DoctorActivity";

function DoctorDetails() {
  const { id } = useParams();
  const doctors = staffData.staff;

  const doctor = doctors.find((doctor) => doctor.id.toString() === id);

  if (!doctor) {
    return <div>Doctor not found.</div>;
  }

  const data = appointmentData.appointments
    .filter((appointment) => appointment.staff_id.toString() === id.toString())
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .map((appointment) => {
      const patient = patientsData.patients.find(
        (p) => p.id === appointment.patient_id
      );
      const appointmentDoctor = staffData.staff.find(
        (d) => d.id === appointment.staff_id
      );

      const formattedDate = new Date(
        appointment.appointment_date
      ).toLocaleString();

      return {
        ...appointment,
        patient_name: patient ? patient.name : "Unknown Patient",
        doctor_name: appointmentDoctor
          ? appointmentDoctor.name
          : "Unknown Doctor",
        appointment_date: formattedDate,
      };
    });

  const doctorInfo = {
    name: doctor.name,
    avatar: doctor.avatar,
    description: doctor.description,
  };

  const tableData = [
    { field: "Role", value: doctor.role },
    { field: "Specialization", value: doctor.specialization },
    { field: "Experience", value: `${doctor.years_of_experience} Years` },
    { field: "Qualification", value: doctor.qualification },
    { field: "Phone", value: doctor.phone },
    { field: "Email", value: doctor.email },
    { field: "Address", value: doctor.clinic_location || "N/A" },
  ];

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        <DoctorDetailsCard doctorInfo={doctorInfo} tableData={tableData} />
      </div>

      <div>
        <DoctorActivity doctorActivity={data} />
      </div>
    </div>
  );
}

export default DoctorDetails;
