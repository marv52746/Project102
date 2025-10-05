import React, { useEffect, useState } from "react";
import { formatDate } from "../../../core/utils/dateUtils";
import apiService from "../../../core/services/apiService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CalendarModalDetails from "../../../core/components/calendar/CalendarModalDetails";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import UltrasoundModalNew from "../../../core/components/modal/UltrasoundModalNew";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
import { adminOnlyRoles } from "../../../core/constants/rolePresets";

export default function UltrasoundTab() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { refreshKey } = useSelector((state) => state.utils);
  const currentUser = useSelector((state) => state.user.userInfo);
  const hasPermission = adminOnlyRoles.includes(currentUser.role);

  const [ultrasound, setUltrasound] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDates, setExpandedDates] = useState({}); // track date expansion
  const [expandedGroups, setExpandedGroups] = useState({}); // track radiologist expansion
  const rowsPerPage = 6;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const records = await apiService.get(dispatch, "ultrasound");
        const sorted = (records || []).sort(
          (a, b) =>
            new Date(b.appointment?.date || b.date) -
            new Date(a.appointment?.date || a.date)
        );
        setUltrasound(sorted);
      } catch (err) {
        console.error("Error fetching ultrasound:", err);
      }
    };
    fetchDetails();
  }, [id, dispatch, refreshKey]);

  //   console.log(selectedReport);

  const filteredRecords = ultrasound.filter(
    (rec) =>
      rec.radiologist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.patient?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.impression?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedRecords = filteredRecords.reduce((acc, rec) => {
    const dateKey = formatDate(rec.appointment?.date || rec.date);
    if (!acc[dateKey]) acc[dateKey] = {};
    const radiologist = rec.radiologist || "Unknown Radiologist";
    if (!acc[dateKey][radiologist]) acc[dateKey][radiologist] = [];
    acc[dateKey][radiologist].push(rec);
    return acc;
  }, {});

  const dates = Object.keys(groupedRecords).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  const totalPages = Math.ceil(dates.length / rowsPerPage);
  const paginatedDates = dates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const toggleGroup = (date, radiologist) => {
    const key = `${date}_${radiologist}`;
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (type, data) => {
    if (data._id) {
      // update existing
      return handleFormSubmit({
        dispatch,
        tablename: type,
        data: data,
        id: data._id,
        fields: [], // <-- pass an empty array if no fields
      });
    }
  };

  if (!ultrasound.length) {
    return (
      <div className="text-center text-gray-500 p-6">
        No ultrasound records found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      {/* Search */}
      <div className="mb-4 flex items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reason, notes, or radiologist..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grouped Records */}
      {paginatedDates.map((date) => {
        const isDateExpanded = expandedDates[date] || false;
        const radiologists = groupedRecords[date];
        return (
          <div key={date} className="mb-4 border rounded-lg">
            {/* Date Header */}
            <div
              className="flex items-center justify-between cursor-pointer p-2 bg-blue-100 hover:bg-blue-200"
              onClick={() => toggleDate(date)}
            >
              <h4 className="font-bold text-sm">{date}</h4>
              {isDateExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>

            {/* Radiologist Groups */}
            {isDateExpanded &&
              Object.keys(radiologists).map((radiologist) => {
                const key = `${date}_${radiologist}`;
                const isExpanded = expandedGroups[key] || false;

                // Calculate total fee for this radiologist
                const totalFee = radiologists[radiologist].reduce(
                  (sum, rec) => {
                    const fee = parseFloat(rec.radio_fee);
                    return sum + (isNaN(fee) ? 0 : fee);
                  },
                  0
                );

                return (
                  <div
                    key={radiologist}
                    className="mb-2 border rounded-lg mx-2"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 hover:bg-gray-100"
                      onClick={() => toggleGroup(date, radiologist)}
                    >
                      <h5 className="font-semibold text-xs flex items-center gap-2">
                        {radiologist}{" "}
                        <span className="text-xs text-gray-500">
                          (Total Fee: ₱{totalFee.toFixed(2)})
                        </span>
                      </h5>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>
                          {radiologists[radiologist].length} record
                          {radiologists[radiologist].length > 1 ? "s" : ""}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left font-medium text-gray-600">
                              Date
                            </th>
                            <th className="px-2 py-1  text-left font-medium text-gray-600">
                              Radiologist
                            </th>
                            <th className="px-2 py-1  text-left font-medium text-gray-600">
                              Ultrasound Type
                            </th>
                            <th className="px-2 py-1  text-left font-medium text-gray-600">
                              Patient
                            </th>
                            <th className="px-2 py-1  text-left font-medium text-gray-600">
                              Fee
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-xs">
                          {radiologists[radiologist].map((rec) => (
                            <tr
                              key={rec._id}
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedReport(rec)}
                            >
                              <td className="px-2 py-1">
                                {formatDate(rec.appointment?.date || rec.date)}
                              </td>
                              <td className="px-2 py-1">{rec.radiologist}</td>
                              <td className="px-2 py-1">{rec.type}</td>
                              <td className="px-2 py-1">
                                {rec.patient?.fullname || "N/A"}
                              </td>
                              <td className="px-2 py-1">₱ {rec.radio_fee}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
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
              onClick={() => setCurrentPage((p) => p + 1)}
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
      )}

      {/* Modal */}
      {selectedReport && (
        <UltrasoundModalNew
          title={"Ultrasound Data"}
          isOpen={selectedReport}
          hasPermission={hasPermission}
          onClose={() => setSelectedReport(null)}
          onSave={(data) => handleSave("ultrasound", data)}
          initialData={selectedReport} // empty array
          patient={selectedReport.patient}
        />
      )}
    </div>
  );
}
