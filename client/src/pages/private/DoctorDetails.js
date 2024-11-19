import React from "react";
import { useParams } from "react-router-dom";
import doctorsData from "../../core/data/doctorsData.json";
import doctorsActivity from "../../core/data/doctorsActivity.json";
import DoctorDetailsCard from "../../core/components/DoctorDetailsCard";
import DoctorActivity from "../../core/components/DoctorActivity";

function DoctorDetails() {
  const { id } = useParams();
  const doctors = doctorsData.doctors;

  // Filter the patients array to find the patient by ID
  const doctor = doctors.find((doctor) => doctor.id.toString() === id);

  const doctorActivity = doctorsActivity.appointments.filter(
    (activity) => activity.doctor_id.toString() === id.toString()
  );

  const doctorInfo = {
    name: doctor.name,
    image: doctor.image,
    description: doctor.description,
  };

  const tableData = [
    { field: "Specialization", value: doctor.specialization },
    { field: "Experience", value: `${doctor.years_of_experience} Years` },
    { field: "Gender", value: doctor.gender },
    { field: "Address", value: doctor.clinic_location },
    { field: "Phone", value: doctor.phone },
    { field: "Email", value: doctor.email },
  ];

  // If no patient is found
  if (!doctor) {
    return <div>Doctor not found.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        <DoctorDetailsCard doctorInfo={doctorInfo} tableData={tableData} />
      </div>

      <div>
        <DoctorActivity doctorActivity={doctorActivity} />
      </div>
    </div>
  );
}

export default DoctorDetails;
