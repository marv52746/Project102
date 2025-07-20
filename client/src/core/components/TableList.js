import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExportLinks from "./ExportLinks";
import { getAvatarUrl } from "../utils/avatarURL";
import { getStatusClass } from "../utils/calendarUtils";
import { getNestedValue } from "../utils/tableUtils";

const TableList = ({ data, columns }) => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10); // Number of entries per page
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const { tablename } = useParams();
  const navigate = useNavigate();

  // Filter data based on the search query
  const filteredData = data.filter((item) =>
    columns.some((col) => {
      const value = getNestedValue(item, col.name);
      return String(value || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    })
  );

  // Get the start and end index of data for current page
  const startIndex = (currentPage - 1) * entries;
  const endIndex = startIndex + entries;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handleEntriesChange = (e) => {
    setEntries(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to page 1 when entries per page change
  };

  const handleNextPage = () => {
    if (currentPage * entries < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowClick = (item) => {
    navigate(`/form/${tablename}/view/${item._id}`);
  };

  const handleCreateNew = () => {
    navigate(`/form/${tablename}/create`);
  };

  return (
    <div className="px-4 py-2 shadow-lg bg-white rounded-lg overflow-hidden">
      <div className="flex justify-between mb-2">
        {/* <h3 className="text-2xl font-semibold mb-4 text-sidetext-active">
          {label}
        </h3> */}

        <div className="flex justify-center items-center">
          {/* Search Input */}
          <input
            type="search"
            value={search}
            onChange={handleChangeSearch}
            placeholder="Search"
            className="form-control form-control-sm w-80 border border-gray-300 rounded-md px-4 py-2 text-sm  focus:border-text-secondary  focus:outline-none"
          />
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-green-500 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition"
        >
          Create New
        </button>
      </div>

      <div className="table-responsive mb-4">
        <div className="flex justify-between mb-3 items-center">
          {/* Entries per page */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Show</label>
            <select
              value={entries}
              onChange={handleEntriesChange}
              className="custom-select custom-select-sm form-control-sm border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <label className="text-sm text-gray-600">entries</label>
          </div>
          <ExportLinks data={filteredData} />
        </div>

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className=" text-left border-b">
              {/* Dynamic Table Headers */}
              {columns.map((col) => (
                <th
                  key={col.name}
                  className="p-3 font-semibold text-sm text-gray-600"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item._id}
                className={`border-b ${
                  index % 2 === 0 ? "" : "bg-white"
                } hover:bg-side-active hover:text-text-secondary hover:cursor-pointer transition-colors duration-200`}
                onClick={() => handleRowClick(item)}
              >
                {/* Dynamic Table Row Data */}
                {columns.map((col) => {
                  const value = getNestedValue(item, col.name);
                  // if (col.name == "avatar") console.log(value);
                  return (
                    <td key={col.name} className="p-3">
                      {
                        col.name === "status" ? (
                          <span
                            className={`badge px-2 py-1 rounded-full text-xs ${getStatusClass(
                              item.status?.toLowerCase()
                            )}`}
                            // className={`badge px-2 py-1 rounded-full text-white text-xs ${
                            //   item.status === "Completed"
                            //     ? "bg-green-500"
                            //     : item.status === "Pending"
                            //     ? "bg-yellow-500"
                            //     : "bg-red-500"
                            // }`}
                          >
                            {value}
                          </span>
                        ) : col.name === "avatar" || col.name === "image" ? (
                          // If the column name is "avatar", render a rounded avatar
                          <img
                            src={getAvatarUrl(value)}
                            // src={
                            //   value
                            //     ? `${
                            //         process.env.REACT_APP_BASE_URL_IMAGE + value
                            //       }?t=${new Date().getTime()}`
                            //     : process.env.PUBLIC_URL +
                            //       "/assets/images/default-male.jpg"
                            // } // Assuming the avatar URL is in the item name
                            alt="Avatar"
                            className="w-10 h-10 rounded-full" // Adjust size and rounded styling
                          />
                        ) : (
                          value || "-"
                        ) // Render the data for other names
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between mt-4 items-center">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
            entries
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePreviousPage}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200"
              disabled={currentPage * entries >= filteredData.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableList;
