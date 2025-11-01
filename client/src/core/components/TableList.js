import React, { useState } from "react";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import ExportLinks from "./ExportLinks";
import { getAvatarUrl } from "../utils/avatarURL";
import { getStatusClass } from "../utils/calendarUtils";
import { formatFullDate, getNestedValue } from "../utils/tableUtils";
import { capitalizeText } from "../utils/stringUtils";
import { ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { canEditForms } from "../constants/rolePresets";

const TableList = ({ data, columns }) => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const { tablename } = useParams();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);

  // Handle filter value change
  const handleFilterChange = (colName, value) => {
    setFilters((prev) => ({ ...prev, [colName]: value }));
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
  };

  // 🔍 Filtering logic
  const filteredData = data.filter((item) => {
    // text search
    const matchesSearch = columns.some((col) => {
      const value = getNestedValue(item, col.name);
      return String(value || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    });

    // field filters
    const matchesFilters = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      const rawValue = getNestedValue(item, key);

      if (!rawValue) return false;

      const isDate = key.toLowerCase().includes("date");
      if (isDate) {
        const recordDate = new Date(rawValue).toISOString().split("T")[0];
        return recordDate === val;
      }

      return String(rawValue).toLowerCase().includes(String(val).toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  // sort by time
  const sortedData = filteredData.sort((a, b) => {
    const getTime = (item) =>
      new Date(item.createdAt || item.created_on || item.timestamp).getTime() ||
      0;
    return getTime(b) - getTime(a);
  });

  const startIndex = (currentPage - 1) * entries;
  const endIndex = startIndex + entries;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleCreateNew = () => navigate(`/form/${tablename}/create`);
  const handleRowClick = (item) =>
    navigate(`/form/${tablename}/view/${item._id}`);

  const compactSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "28px",
      height: "28px",
      borderColor: state.isFocused ? "#94a3b8" : "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#94a3b8",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      height: "28px",
      padding: "0 6px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "28px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "2px",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "2px",
    }),
    menu: (base) => ({
      ...base,
      fontSize: "12px",
    }),
  };

  const canEdit = userInfo && canEditForms.includes(userInfo.role);

  return (
    <div className="px-4 py-2 shadow-lg bg-white rounded-lg overflow-hidden">
      {/* 🔍 Search + Create */}
      <div className="flex justify-between items-center mb-2">
        {/* 🔽 Filters below Search */}
        <div className="flex justify-between items-center mb-2 gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm flex items-center gap-1 px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              {showFilters ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              Filters
            </button>
            {Object.keys(filters).some((k) => filters[k]) && (
              <button
                onClick={clearFilters}
                className="text-sm flex items-center gap-1 px-3 py-1 border rounded-md text-red-500 hover:bg-red-50"
              >
                <XCircle size={14} /> Clear
              </button>
            )}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="form-control w-64 border border-gray-300 rounded-md px-3 py-1 text-sm focus:border-text-secondary focus:outline-none"
          />
        </div>
        {canEdit && (
          <button
            onClick={handleCreateNew}
            className="bg-green-500 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-green-600 transition"
          >
            Create New
          </button>
        )}
      </div>

      {/* 🧩 Collapsible Filter Section (Movedbelow Search) */}

      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
          {columns.map((col) => {
            const key = col.name;
            const label = col.label;
            const lowerKey = key.toLowerCase();
            const isDate = lowerKey.includes("date");
            const isNumber =
              lowerKey.includes("amount") ||
              lowerKey.includes("price") ||
              lowerKey.includes("reorderlevel") ||
              lowerKey.includes("phone_number") ||
              lowerKey.includes("quantity");

            const uniqueValues = [
              ...new Set(
                data
                  .map((item) => getNestedValue(item, key))
                  .filter((v) => v && v !== "")
              ),
            ];

            const isSelect =
              ["status", "role", "user_type"].includes(lowerKey) ||
              (uniqueValues.length > 0 && uniqueValues.length <= 10);

            return (
              <div key={key} className="flex flex-col text-xs">
                <label className="text-gray-600 font-medium mb-1">
                  {label}
                </label>

                {isDate ? (
                  <input
                    type="date"
                    value={filters[key] || ""}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-[2px] text-xs h-[28px]"
                  />
                ) : isNumber ? (
                  <input
                    type="number"
                    value={filters[key] || ""}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    placeholder={`Filter ${label}`}
                    className="border border-gray-300 rounded-md px-2 py-[2px] text-xs h-[28px] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                ) : isSelect ? (
                  <Select
                    options={[
                      { value: "", label: "All" },
                      ...uniqueValues.map((opt) => ({
                        value: opt,
                        label: capitalizeText(opt, true),
                      })),
                    ]}
                    value={
                      filters[key]
                        ? {
                            value: filters[key],
                            label: capitalizeText(filters[key], true),
                          }
                        : { value: "", label: "All" }
                    }
                    onChange={(selected) =>
                      handleFilterChange(key, selected ? selected.value : "")
                    }
                    styles={compactSelectStyles}
                    classNamePrefix="react-select"
                    isClearable
                    isSearchable
                  />
                ) : (
                  <input
                    type="text"
                    value={filters[key] || ""}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    placeholder={`Filter ${label}`}
                    className="border border-gray-300 rounded-md px-2 py-[2px] text-xs h-[28px]"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table + Pagination */}
      <div className="table-responsive mb-4">
        <div className="flex justify-between mb-2 items-center">
          <div className="flex items-center space-x-2 text-sm">
            <label>Show</label>
            <select
              value={entries}
              onChange={(e) => setEntries(parseInt(e.target.value, 10))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <label>entries</label>
          </div>
          <ExportLinks data={filteredData} />
        </div>

        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.name}
                  className="p-2 font-semibold text-gray-600 text-left"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, i) => (
              <tr
                key={item._id}
                onClick={() => handleRowClick(item)}
                className={`border-b hover:bg-side-active cursor-pointer ${
                  i % 2 === 0 ? "" : "bg-white"
                }`}
              >
                {columns.map((col) => {
                  const val = getNestedValue(item, col.name);
                  return (
                    <td key={col.name} className="p-2 truncate max-w-[180px]">
                      {col.name === "status" ||
                      col.name === "role" ||
                      col.name === "user_type" ? (
                        <span
                          className={`px-2 py-1 rounded-md text-xs ${getStatusClass(
                            val?.toLowerCase()
                          )}`}
                        >
                          {capitalizeText(val, true)}
                        </span>
                      ) : col.name.toLowerCase().includes("date") ? (
                        formatFullDate(val)
                      ) : col.name === "avatar" ? (
                        <img
                          src={getAvatarUrl(val)}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        val || "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between mt-4 items-center text-sm text-gray-600">
          <div>
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
            entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  p * entries < filteredData.length ? p + 1 : p
                )
              }
              disabled={currentPage * entries >= filteredData.length}
              className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200"
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
