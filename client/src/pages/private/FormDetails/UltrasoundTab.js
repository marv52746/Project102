import React, { useEffect, useState, useRef } from "react";
import { formatDate } from "../../../core/utils/dateUtils";
import apiService from "../../../core/services/apiService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ChevronDown, ChevronRight, Download, X } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

import UltrasoundModalNew from "../../../core/components/modal/UltrasoundModalNew";

import UltrasoundBiophysicalPrint from "../../../core/components/documents/UltrasoundBiophysical";
import UltrasoundTransvaginalOBPrint from "../../../core/components/documents/UltrasoundTVSOB";
import TransvaginalUltrasoundGynePrint from "../../../core/components/documents/UltrasoundTVSGyne";

import { adminOnlyRoles } from "../../../core/constants/rolePresets";
import { handleUltrasoundSubmit } from "../../../core/components/formActions/handleUltrasoundSubmit";
import Reloader from "../../../core/components/utils/reloader";

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

  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [loadingGroup, setLoadingGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRadiologist, setSelectedRadiologist] = useState("");

  // Helper: calculate age
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const records = await apiService.get(dispatch, "ultrasound", {
          doctor: id,
        });
        const sorted = (records || []).sort(
          (a, b) =>
            new Date(b.appointment?.date || b.date) -
            new Date(a.appointment?.date || a.date)
        );
        setUltrasound(sorted);
      } catch (err) {
        console.error("Error fetching ultrasound:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, dispatch, refreshKey]);

  // Get all dates for day filter
  const allDates = Array.from(
    new Set(
      ultrasound.map((rec) => formatDate(rec.appointment?.date || rec.date))
    )
  );

  // Filtering logic
  const filteredRecords = ultrasound.filter((rec) => {
    const date = new Date(rec.appointment?.date || rec.date);
    const monthName = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const dayFormatted = formatDate(date);
    const matchesSearch =
      rec.radiologist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.patient?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.impression?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth = !selectedMonth || monthName === selectedMonth;
    const matchesDay = !selectedDay || dayFormatted === selectedDay;
    const matchesRadiologist =
      !selectedRadiologist || rec.radiologist === selectedRadiologist;

    return matchesSearch && matchesMonth && matchesDay && matchesRadiologist;
  });

  // Group by month → date → radiologist
  const groupedByMonth = filteredRecords.reduce((acc, rec) => {
    const date = new Date(rec.appointment?.date || rec.date);
    const monthKey = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const dateKey = formatDate(date);
    const radiologist = rec.radiologist || "Unknown Radiologist";

    if (!acc[monthKey]) acc[monthKey] = {};
    if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = {};
    if (!acc[monthKey][dateKey][radiologist])
      acc[monthKey][dateKey][radiologist] = [];

    acc[monthKey][dateKey][radiologist].push(rec);
    return acc;
  }, {});

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const toggleGroup = (date, radiologist) => {
    const key = `${date}_${radiologist}`;
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (type, data) => {
    await handleUltrasoundSubmit({ dispatch, data });
  };

  const handleDownloadBundle = async (records, radiologist, date) => {
    const groupKey = `${date}_${radiologist}`;
    setLoadingGroup(groupKey);
    try {
      const zip = new JSZip();

      for (const [index, rec] of records.entries()) {
        const container = document.createElement("div");
        container.style.width = "210mm";
        container.style.minHeight = "297mm";
        container.style.background = "#fff";
        container.style.zIndex = "-999";
        container.style.opacity = "1";
        container.style.pointerEvents = "none";
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        document.body.appendChild(container);

        const printData = { ...rec, date: formatDate(rec.date) };
        const patientData = {
          ...rec.patient,
          age: calculateAge(rec.patient?.date_of_birth),
        };

        const renderPrint = () => {
          const uniqueKey = `${rec._id}-${rec.type}`;
          switch (rec.type) {
            case "Biometry":
            case "Biophysical Score":
              return (
                <UltrasoundBiophysicalPrint
                  key={uniqueKey}
                  data={printData}
                  patient={patientData}
                />
              );
            case "Transvaginal Ultrasound - OB":
              return (
                <UltrasoundTransvaginalOBPrint
                  key={uniqueKey}
                  data={printData}
                  patient={patientData}
                />
              );
            case "Transvaginal Ultrasound - Gyne":
              return (
                <TransvaginalUltrasoundGynePrint
                  key={uniqueKey}
                  data={printData}
                  patient={patientData}
                />
              );
            default:
              return null;
          }
        };

        const { createRoot } = await import("react-dom/client");
        const root = createRoot(container);
        root.render(renderPrint());

        await new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });

        const images = Array.from(container.querySelectorAll("img"));
        if (images.length) {
          await Promise.all(
            images.map(
              (img) =>
                new Promise((resolve) => {
                  if (img.complete && img.naturalHeight !== 0) resolve();
                  else {
                    const done = () => {
                      img.onload = img.onerror = null;
                      resolve();
                    };
                    img.onload = done;
                    img.onerror = done;
                  }
                })
            )
          );
        }

        await new Promise((r) => setTimeout(r, 150));

        try {
          const doc = new jsPDF("p", "px", "a4");
          await Promise.race([
            new Promise((resolve, reject) => {
              doc.html(container, {
                callback: (doc) => {
                  try {
                    const pdfBlob = doc.output("blob");
                    const fileName = `(${index + 1}) ${
                      rec.patient?.fullname || "patient"
                    } - ${rec.type || "Ultrasound"}`;
                    zip.file(`${fileName}.pdf`, pdfBlob);
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                },
                x: 10,
                y: 10,
                margin: 11,
                html2canvas: { scale: 0.5, useCORS: true },
              });
            }),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Timeout on jsPDF.html()")),
                10000
              )
            ),
          ]);
        } catch (err) {
          console.error("Error generating PDF for:", rec._id, err);
        }

        root.unmount();
        document.body.removeChild(container);
        await new Promise((r) => setTimeout(r, 300));
      }

      const content = await zip.generateAsync({ type: "blob" });
      await new Promise((resolve) => {
        saveAs(content, `${date}_${radiologist}.zip`);
        setTimeout(resolve, 1000);
      });
    } catch (err) {
      console.error("Error creating ZIP bundle:", err);
    } finally {
      setLoadingGroup(null);
    }
  };

  if (loading) return <Reloader text="Loading data..." />;

  if (!ultrasound.length)
    return (
      <div className="text-center text-gray-500 p-6">
        No ultrasound records found.
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      {/* Filters */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative w-1/4 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reason, notes, or radiologist..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus-visible:border-blue-300"
          />
        </div>

        {/* Month filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
        >
          <option value="">All Months</option>
          {Array.from(
            new Set(
              ultrasound.map((rec) =>
                new Date(rec.date || rec.appointment?.date).toLocaleString(
                  "default",
                  { month: "long", year: "numeric" }
                )
              )
            )
          )
            .sort()
            .map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
        </select>

        {/* Day filter */}
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
        >
          <option value="">All Days</option>
          {allDates
            .sort((a, b) => new Date(b) - new Date(a))
            .map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
        </select>

        {/* Radiologist filter */}
        <select
          value={selectedRadiologist}
          onChange={(e) => setSelectedRadiologist(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
        >
          <option value="">All Radiologists</option>
          {Array.from(
            new Set(
              ultrasound.map((r) => r.radiologist || "Unknown Radiologist")
            )
          )
            .sort()
            .map((rad) => (
              <option key={rad} value={rad}>
                {rad}
              </option>
            ))}
        </select>

        {/* Clear Filter Button */}
        {(searchTerm ||
          selectedMonth ||
          selectedDay ||
          selectedRadiologist) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedMonth("");
              setSelectedDay("");
              setSelectedRadiologist("");
              setCurrentPage(1);
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-red-400 text-red-600 hover:bg-red-50 transition"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Render hierarchy */}
      {Object.keys(groupedByMonth)
        .sort(
          (a, b) =>
            new Date(
              b.split(" ")[1],
              new Date(Date.parse(b.split(" ")[0] + " 1, 2020")).getMonth()
            ) -
            new Date(
              a.split(" ")[1],
              new Date(Date.parse(a.split(" ")[0] + " 1, 2020")).getMonth()
            )
        )
        .map((month) => {
          const isMonthExpanded = expandedMonths[month] || false;
          const datesInMonth = groupedByMonth[month];
          return (
            <div key={month} className="mb-4 border rounded-lg">
              <div
                className="flex items-center justify-between cursor-pointer p-2 bg-blue-100 hover:bg-blue-200"
                onClick={() => toggleMonth(month)}
              >
                <h3 className="font-bold text-sm">{month}</h3>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    {Object.values(datesInMonth).reduce(
                      (monthTotal, dateGroups) =>
                        monthTotal +
                        Object.values(dateGroups).reduce(
                          (sum, recs) => sum + recs.length,
                          0
                        ),
                      0
                    )}{" "}
                    records
                  </span>
                  {isMonthExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>

              {isMonthExpanded &&
                Object.keys(datesInMonth)
                  .sort((a, b) => new Date(b) - new Date(a))
                  .map((date) => {
                    const isDateExpanded = expandedDates[date] || false;
                    const radiologists = datesInMonth[date];
                    return (
                      <div key={date} className="ml-4 mt-2 border rounded-lg">
                        <div
                          className="flex items-center justify-between cursor-pointer p-2 bg-blue-50 hover:bg-blue-100"
                          onClick={() => toggleDate(date)}
                        >
                          <h4 className="font-bold text-xs flex items-center gap-2">
                            {date}
                          </h4>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500">
                            <span className="text-[11px] text-gray-500">
                              {Object.values(radiologists).reduce(
                                (sum, recs) => sum + recs.length,
                                0
                              )}{" "}
                              records
                            </span>

                            {isDateExpanded ? (
                              <ChevronDown />
                            ) : (
                              <ChevronRight />
                            )}
                          </div>
                        </div>

                        {isDateExpanded &&
                          Object.keys(radiologists).map((radiologist) => {
                            const key = `${date}_${radiologist}`;
                            const isExpanded = expandedGroups[key] || false;
                            const records = radiologists[radiologist];
                            const totalFee = records.reduce((sum, rec) => {
                              const fee = parseFloat(rec.radio_fee);
                              return sum + (isNaN(fee) ? 0 : fee);
                            }, 0);

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
                                    {radiologist}
                                    <span className="text-xs text-gray-500">
                                      (₱{totalFee.toFixed(2)})
                                    </span>
                                  </h5>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                          loadingGroup !==
                                          `${date}_${radiologist}`
                                        ) {
                                          handleDownloadBundle(
                                            records,
                                            radiologist,
                                            date
                                          );
                                        }
                                      }}
                                      disabled={
                                        loadingGroup ===
                                        `${date}_${radiologist}`
                                      }
                                      className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-blue-50 text-blue-600"
                                    >
                                      <Download className="h-3 w-3" />
                                      {loadingGroup === `${date}_${radiologist}`
                                        ? "Loading..."
                                        : "ZIP"}
                                    </button>
                                    <span>
                                      {records.length} record
                                      {records.length > 1 ? "s" : ""}
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
                                        <th className="px-2 py-1 text-left font-medium text-gray-600">
                                          Radiologist
                                        </th>
                                        <th className="px-2 py-1 text-left font-medium text-gray-600">
                                          Type
                                        </th>
                                        <th className="px-2 py-1 text-left font-medium text-gray-600">
                                          Patient
                                        </th>
                                        <th className="px-2 py-1 text-left font-medium text-gray-600">
                                          Fee
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-xs">
                                      {records
                                        .sort(
                                          (a, b) =>
                                            new Date(b.created_on) -
                                            new Date(a.created_on)
                                        )
                                        .map((rec) => (
                                          <tr
                                            key={rec._id}
                                            onClick={() =>
                                              setSelectedReport(rec)
                                            }
                                            className="hover:bg-gray-50 cursor-pointer"
                                          >
                                            <td className="px-2 py-1">
                                              {formatDate(rec.date)}
                                            </td>
                                            <td className="px-2 py-1">
                                              {rec.radiologist}
                                            </td>
                                            <td className="px-2 py-1">
                                              {rec.type}
                                            </td>
                                            <td className="px-2 py-1">
                                              {rec.patient?.fullname}
                                            </td>
                                            <td className="px-2 py-1">
                                              ₱
                                              {parseFloat(
                                                rec.radio_fee
                                              ).toFixed(2)}
                                            </td>
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
            </div>
          );
        })}

      {selectedReport && (
        <UltrasoundModalNew
          title={"Ultrasound Data"}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          initialData={selectedReport}
          onSave={(data) => handleSave("ultrasound", data)}
          hasPermission={hasPermission}
          patient={selectedReport.patient}
          doctor={selectedReport.appointment.doctor}
        />
      )}
    </div>
  );
}
