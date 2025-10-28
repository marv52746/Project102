import React from "react";

export default function TablePagination({
  currentPage,
  totalPages,
  totalRecords,
  rowsPerPage,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center mt-4 text-sm">
      <span className="text-gray-600">
        Showing {(currentPage - 1) * rowsPerPage + 1}–
        {Math.min(currentPage * rowsPerPage, totalRecords)} of {totalRecords}{" "}
        records
      </span>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={handlePrev}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Prev
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
