import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const AppointmentDetailsCard = ({ tableData }) => {
  const { tablename, id } = useParams();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/form/${tablename}/edit/${id}`);
  };
  return (
    <div className="p-4 rounded-lg shadow-lg bg-white w-full">
      <h3 className="text-xl font-semibold mb-4 text-text-secondary">
        Appointment Details
      </h3>

      <div className="table-responsive overflow-x-auto mb-4">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 font-medium text-gray-700 w-1/4">
                  <strong>{item.field}</strong>
                </td>
                <td className="py-2 px-4 text-gray-900 w-3/4">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleEdit}
          className="btn btn-success mb-3 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
        >
          <span className="ti-pencil-alt mr-2" /> Edit Appointment
        </button>
        <button
          type="button"
          className="btn btn-danger mb-3 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <span className="ti-trash mr-2" /> Delete Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetailsCard;
