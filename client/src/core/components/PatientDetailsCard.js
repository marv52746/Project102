import React from "react";

function PatientDetailsCard({ patientInfo }) {
  return (
    <div className="md:w-1/2 mx-auto bg-white shadow-lg p-6 rounded-lg flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-text-secondary">
        Patient Details
      </h3>

      {/* Table container with fixed height and overflow for scrolling */}
      <div className="overflow-x-auto flex-grow h-80">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b">
              <td className="font-semibold p-2">Name</td>
              <td className="p-2">{patientInfo.name}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Birth Date</td>
              <td className="p-2">{patientInfo.dob}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Age</td>
              <td className="p-2">{patientInfo.age}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Gender</td>
              <td className="p-2">{patientInfo.gender}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Address</td>
              <td className="p-2">{patientInfo.address}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Phone</td>
              <td className="p-2">{patientInfo.phone}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold p-2">Email</td>
              <td className="p-2">{patientInfo.email}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Export Links fixed at the bottom */}
      {/* <div className="mt-4">
        <ExportLinks />
      </div> */}

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-4">
        <button
          type="button"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <span className="ti-pencil-alt"></span> Edit Patient
        </button>
        <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <span className="ti-trash"></span> Delete Patient
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span className="ti-arrow-down"></span> Download File
        </button>
      </div>
    </div>
  );
}

export default PatientDetailsCard;
