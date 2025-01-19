import React from "react";
import ExportLinks from "../ExportLinks";

function PatientVisitCard({ patientVisits }) {
  return (
    <div className="bg-white md:w-1/2 mx-auto shadow-lg p-6 rounded-lg flex flex-col">
      <h3 className="text-xl font-semibold mb-4">Patient Visits</h3>

      {/* Table container with fixed height and overflow for scrolling */}
      <div className="overflow-x-auto flex-grow h-80">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Doctor Name</th>
              <th className="p-2 text-left">Cost</th>
              <th className="p-2 text-left">Visit Date</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Corrected map function */}
            {patientVisits.map((visit, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{visit.doctor_name}</td>
                <td className="p-2">{visit.cost}</td>
                <td className="p-2">{visit.visit_date}</td>
                <td className="p-2">{visit.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export links fixed at the bottom */}
      <div className="mt-4">
        <ExportLinks />
      </div>
    </div>
  );
}

export default PatientVisitCard;
