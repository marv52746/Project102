import React from "react";

function PatientEmergencyContact({ emergencyContact, insurance }) {
  return (
    <div className="md:w-1/2 mx-auto bg-white shadow-lg p-6 rounded-lg flex flex-col">
      {/* Emergency Contact Table */}
      <div className="overflow-x-auto flex-grow mb-6">
        <h4 className="text-lg font-semibold mb-2 text-text-secondary">
          Emergency Contact
        </h4>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b">
              <td className="font-semibold p-2">Name</td>
              <td className="p-2">{emergencyContact.name}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Relationship</td>
              <td className="p-2">{emergencyContact.relationship}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Phone</td>
              <td className="p-2">{emergencyContact.phone}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Address</td>
              <td className="p-2">{emergencyContact.address}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Insurance Provider Table */}
      <div className="overflow-x-auto flex-grow">
        <h4 className="text-lg font-semibold mb-2 text-text-secondary">
          Insurance Provider
        </h4>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b">
              <td className="font-semibold p-2">Provider</td>
              <td className="p-2">{insurance.provider}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Policy Number</td>
              <td className="p-2">{insurance.policyNumber}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Coverage Type</td>
              <td className="p-2">{insurance.coverageType}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Valid Until</td>
              <td className="p-2">{insurance.validUntil}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientEmergencyContact;
