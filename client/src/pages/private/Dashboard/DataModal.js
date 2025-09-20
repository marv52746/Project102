import React, { useState } from "react";
import { X } from "lucide-react";

export default function DataModal({ isOpen, onClose, title, data = [], type }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  if (!isOpen) return null;

  const handleClose = () => {
    setSearch(""); // clear search
    setPage(1); // reset page
    onClose();
  };

  // 🔹 Sort data by date (desc)
  const sortedData = [...data].sort((a, b) => {
    const dateA =
      type === "items"
        ? new Date(a.expiryDate || 0)
        : new Date(a.timestamp || 0);
    const dateB =
      type === "items"
        ? new Date(b.expiryDate || 0)
        : new Date(b.timestamp || 0);
    return dateB - dateA;
  });

  // 🔹 Filter by search
  const filteredData = sortedData.filter((row) => {
    if (type === "items") {
      return (
        row.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.category?.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return (
        row.item?.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.type?.toLowerCase().includes(search.toLowerCase())
      );
    }
  });

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(start, start + itemsPerPage);
  // console.log(paginatedData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden animate-fadeIn">
        {/* Header with Search */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50 gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="px-3 py-1.5 border rounded-lg text-sm w-48 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {paginatedData && paginatedData.length > 0 ? (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  {type === "items" ? (
                    <>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Item
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Category
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Expiry
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Created by
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Updated by
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Item
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Date
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Created by
                      </th>
                      <th className="px-4 py-2 border-b font-medium text-gray-600">
                        Updated by
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    {type === "items" ? (
                      <>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.name}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.category || "-"}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.quantity}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.expiryDate
                            ? new Date(row.expiryDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.created_by.name}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.updated_by.name}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.item?.name}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.type}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.quantity} {row.unit}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {new Date(row.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.created_by.name}
                        </td>
                        <td className="px-4 py-2 border-b text-gray-700">
                          {row.updated_by.name}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No records found</p>
          )}
        </div>

        {/* Pagination */}
        {filteredData.length > itemsPerPage && (
          <div className="flex justify-between items-center px-6 py-3 border-t bg-gray-50 text-sm">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-3 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
