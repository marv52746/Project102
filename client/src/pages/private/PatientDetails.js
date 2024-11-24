import React from "react";
import PatientDetailsCard from "../../core/components/PatientDetailsCard";
import mockPatientData from "../../core/data/mockPatientData.json";
import { useParams } from "react-router-dom";
import PatientHistory from "../../core/components/PatientHistory";
import PatientBMI from "../../core/components/PatientBMI";
import PatientDetailsCardv2 from "../../core/components/PatientDetailsCardv2";

function PatientDetails() {
  const { id } = useParams();
  const patients = mockPatientData.patients;

  // Filter the patients array to find the patient by ID
  const patient = patients.find((patient) => patient.id.toString() === id);

  // If no patient is found
  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <PatientDetailsCardv2 />
      </div>

      <div className="mb-6">
        <PatientDetailsCard patientInfo={patient} />
      </div>

      <div className="mb-6">
        <PatientBMI visits={patient.visits} />
      </div>

      <PatientHistory visits={patient.visits} />
    </div>
  );
}

export default PatientDetails;
