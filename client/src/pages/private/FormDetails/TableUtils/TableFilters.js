import React from "react";
import { Filter, Search, X } from "lucide-react";
import Select from "react-select";

export default function TableFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  filterConfig = [],
  showFilters,
  setShowFilters,
  clearFilters,
}) {
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  // check if at least one filter is applied
  const hasActiveFilters = Object.values(filters).some((v) => v && v !== "");

  const compactSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "28px",
      height: "28px",
      borderColor: state.isFocused ? "#94a3b8" : "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#94a3b8" },
    }),
    valueContainer: (base) => ({
      ...base,
      height: "28px",
      padding: "0 6px",
    }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base) => ({ ...base, height: "28px" }),
    dropdownIndicator: (base) => ({ ...base, padding: "2px" }),
    clearIndicator: (base) => ({ ...base, padding: "2px" }),
    menu: (base) => ({
      ...base,
      fontSize: "12px",
      zIndex: 9999, // 👈 Add this line
    }),
  };

  // ✅ Only active when filter section is open
  const filterButtonClass = `
    flex items-center gap-1 px-3 py-1 border rounded-md text-sm
    ${
      showFilters
        ? "bg-blue-50 border-blue-400 text-blue-700 hover:bg-blue-100"
        : "text-gray-700 border-gray-300 hover:bg-gray-100"
    }
  `;

  return (
    <>
      {/* 🔍 Search + Filter toggle */}
      <div className="mb-2 flex items-center justify-between">
        {/* 🔍 Search input */}
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          />
        </div>

        {/* ⚙️ Filters + Clear */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={filterButtonClass}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* 🧩 Dynamic Filters */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 bg-gray-50 p-2 rounded-md border border-gray-200 z-50">
          {filterConfig.map(({ key, label, type, options }) => (
            <div key={key} className="flex flex-col text-xs">
              <label className="text-gray-600 font-medium mb-1">{label}</label>

              {type === "date" ? (
                <input
                  type="date"
                  value={filters[key] || ""}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-[2px] text-xs h-[28px]"
                />
              ) : type === "select" ? (
                <Select
                  options={[{ value: "", label: "All" }, ...options]}
                  value={
                    filters[key]
                      ? { value: filters[key], label: filters[key] }
                      : { value: "", label: "All" }
                  }
                  onChange={(selected) =>
                    handleFilterChange(key, selected?.value || "")
                  }
                  styles={compactSelectStyles}
                  classNamePrefix="react-select"
                  isClearable
                  isSearchable
                />
              ) : (
                <input
                  type="text"
                  placeholder={`Filter ${label}`}
                  value={filters[key] || ""}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-[2px] text-xs h-[28px]"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
