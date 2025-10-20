import React, { useEffect, useState, useRef } from "react";
import { formatDate } from "../../../core/utils/dateUtils";
import apiService from "../../../core/services/apiService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ChevronDown, ChevronRight, Download } from "lucide-react";
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
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [loadingGroup, setLoadingGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 6;

  const printContainerRef = useRef(null);

  // console.log(selectedReport);

  // Helper function: calculate age from date of birth
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
        // console.log(records);
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
    await handleUltrasoundSubmit({ dispatch, data });
  };

  // ✅ Use your existing print components for bundle ZIP generation
  const handleDownloadBundle = async (records, radiologist, date) => {
    const groupKey = `${date}_${radiologist}`;
    setLoadingGroup(groupKey); // start loading

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
        container.style.position = "fixed"; // doesn't affect page layout
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

        // ✅ Wait until React commit + DOM paint
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });

        // ✅ Wait for all images (more robust)
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

        // ✅ Small buffer for fonts/layout (optional but helps prevent blank render)
        await new Promise((r) => setTimeout(r, 150));

        try {
          const doc = new jsPDF("p", "px", "a4");

          // ✅ Wrap doc.html in a safe timeout to avoid silent hangs
          await Promise.race([
            new Promise((resolve, reject) => {
              doc.html(container, {
                callback: (doc) => {
                  try {
                    const pdfBlob = doc.output("blob");
                    const fileName = `(${index + 1}) ${
                      rec.patient?.fullname || "patient"
                    } - ${rec.type || "Ultrasound"}.pdf`;
                    zip.file(`${fileName}.pdf`, pdfBlob);
                    // console.log(
                    //   `✅ [${index + 1}/${records.length}] Added ${fileName}`
                    // );
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
            // Timeout fallback — if jsPDF hangs more than 10s
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Timeout on jsPDF.html()")),
                10000
              )
            ),
          ]);
        } catch (err) {
          console.error("❌ Error generating PDF for:", rec._id, err);
        }

        root.unmount();
        document.body.removeChild(container);

        // Small gap between renders to reduce memory stress
        await new Promise((r) => setTimeout(r, 300));
      }

      const content = await zip.generateAsync({ type: "blob" });
      await new Promise((resolve) => {
        saveAs(content, `${date}_${radiologist}.zip`);
        // Small delay to ensure file dialog appears before stopping loading
        setTimeout(resolve, 1000);
      });
    } catch (err) {
      console.error("Error creating ZIP bundle:", err);
    } finally {
      setLoadingGroup(null); // ✅ Now only after everything truly finishes
    }
  };

  if (loading) return <Reloader text="Loading data..." />;

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
                          (Total Fee: ₱{totalFee.toFixed(2)})
                        </span>
                      </h5>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (loadingGroup !== `${date}_${radiologist}`) {
                              handleDownloadBundle(records, radiologist, date);
                            }
                          }}
                          disabled={loadingGroup === `${date}_${radiologist}`}
                          className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-blue-50 text-blue-600"
                        >
                          <Download className="h-3 w-3" />
                          {loadingGroup === `${date}_${radiologist}`
                            ? "Loading..."
                            : "ZIP"}
                        </button>
                        <span>
                          {records.length} record{records.length > 1 ? "s" : ""}
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
                                new Date(b.created_on) - new Date(a.created_on)
                            ) // newest first
                            .map((rec) => (
                              <tr
                                key={rec._id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedReport(rec)}
                              >
                                <td className="px-2 py-1">
                                  {formatDate(
                                    rec.appointment?.date || rec.date
                                  )}
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
          initialData={selectedReport}
          patient={selectedReport.patient}
          doctor={selectedReport.appointment.doctor}
        />
      )}

      {/* Hidden render container */}
      <div ref={printContainerRef} style={{ display: "none" }} />
    </div>
  );
}
