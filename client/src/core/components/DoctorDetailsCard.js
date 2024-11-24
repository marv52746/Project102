import React from "react";

const DoctorDetailsCard = ({ doctorInfo, tableData }) => {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      {/* <h3 className="text-2xl font-semibold mb-6 text-text-secondary">
        Doctor Details
      </h3> */}
      <div className="flex flex-wrap -mx-4">
        {/* Doctor Card */}
        <div className="w-full md:w-1/3 px-4 mb-6">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <img
              className="w-full h-48 object-cover"
              // src={doctorInfo.image || "images/doctor.jpeg"}
              src={
                process.env.PUBLIC_URL + `/assets/images/${doctorInfo.image}`
              }
              alt={doctorInfo.name}
            />
            <div className="p-4">
              <h4 className="text-xl font-semibold mb-2">{doctorInfo.name}</h4>
              <p className="text-gray-600 mb-4">
                {doctorInfo.description || "No description available."}
              </p>
              <div className="flex space-x-4">
                <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 flex items-center">
                  <span className="ti-pencil-alt mr-2"></span> Edit Doctor
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 flex items-center">
                  <span className="ti-trash mr-2"></span> Delete Doctor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Details Table */}
        <div className="w-full md:w-2/3 px-4">
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="w-full text-left table-auto">
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-600">
                      {row.field}
                    </td>
                    <td className="p-3 text-gray-800">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <ExportLinks /> */}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsCard;
