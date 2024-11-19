import React from "react";
import PatientDetailsCard from "../../core/components/PatientDetailsCard";
import mockPatientData from "../../core/data/mockPatientData.json";
import { useParams } from "react-router-dom";
import PatientEmergencyContact from "../../core/components/PatientEmergencyContact";
import PatientHistory from "../../core/components/PatientHistory";

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
      <div className="flex space-x-4 mb-6">
        <PatientDetailsCard patientInfo={patient} />

        <PatientEmergencyContact
          emergencyContact={patient.emergencyContact}
          insurance={patient.insurance}
        />
      </div>

      <div>
        <PatientHistory visits={patient.visits} />
      </div>
    </div>
  );
}

export default PatientDetails;
