import React, { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Mapping keys to human-readable labels
const columnLabels = {
  name: "Full Name",
  dob: "Date of Birth",
  gender: "Gender",
  address: "Address",
  phone: "Phone Number",
  relationship: "Relationship",
  // provider: "Insurance Provider",
  // policyNumber: "Policy Number",
  // validUntil: "Policy Expiry Date",
  age: "Age",
  email: "Email",
  // nationality: "Nationality",
  // occupation: "Occupation",
  // employer: "Employer",
};

// Reusable Table Component
const InfoTable = ({ title, data, columns }) => {
  // Check if columns are provided, otherwise use all keys of the data
  const columnsToDisplay = columns || Object.keys(data || {});

  return (
    <div className="overflow-x-auto flex-grow mb-6">
      <h4 className="text-lg font-semibold mb-4 text-text-secondary">
        {title}
      </h4>
      <div className="space-y-4">
        {columnsToDisplay.map((col) => (
          <div key={col} className="flex space-x-4 border-b">
            <div className="font-semibold w-1/3">
              {columnLabels[col] || col}
            </div>
            <div className="flex-1">{data[col] || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PatientDetailsCard = ({ patientInfo }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleTable = () => {
    setIsVisible(!isVisible);
  };

  // Define columns for each section
  const personalInfoColumns = [
    "name",
    "dob",
    "age",
    "gender",
    "phone",
    "email",
    "address",
    "nationality",
    "occupation",
    "employer",
  ];
  const emergencyContactColumns = ["name", "phone", "relationship"];
  const insuranceColumns = ["provider", "policyNumber", "validUntil"];

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleTable}
      >
        <h3 className="text-xl font-semibold text-text-secondary">
          Information Details
        </h3>
        <div>
          {isVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>
      {isVisible && (
        <div className="flex justify-between space-x-14 mt-6">
          <div className="md:w-1/2 mx-auto flex flex-col">
            <InfoTable
              title="Personal Information"
              data={patientInfo}
              columns={personalInfoColumns}
            />
          </div>

          <div className="md:w-1/2 mx-auto flex flex-col">
            <InfoTable
              title="Emergency Contact"
              data={patientInfo.emergency_contact}
              columns={emergencyContactColumns}
            />
            <InfoTable
              title="Insurance Provider"
              data={patientInfo.insurance_provider}
              columns={insuranceColumns}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Exporting without PropTypes or TypeScript
export default memo(PatientDetailsCard);
