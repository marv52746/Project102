import React from "react";
import PatientEmergencyContact from "../../../core/components/patient/PatientEmergencyContact";
import PatientDetailsCard from "../../../core/components/patient/PatientDetailsCard";
import { useParams } from "react-router-dom";
import birthReports from "../../../core/data/birthReports.json";
import mockPatientData from "../../../core/data/mockPatientData.json";

function BirthReportDetails() {
  const { id } = useParams();

  const reports = birthReports.birthReports;
  const report = reports.find((item) => item.id.toString() === id);

  const patients = mockPatientData.patients;
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
    </div>
  );
}

export default BirthReportDetails;
