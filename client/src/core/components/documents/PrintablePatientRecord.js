import React, { useRef } from "react";
import { Printer } from "lucide-react";
import PrintHeader from "./PrintHeader";

export default function PrintablePatientRecord({ data, appointments }) {
  const printRef = useRef();

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const newWindow = window.open("", "_blank", "width=900,height=700");
    newWindow.document.write(`
      <html>
        <head>
          <title>Patient Record - ${data?.name || "Unknown"}</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #222;
              padding: 30px;
              line-height: 1.5;
              background: #fff;
            }
            h2, h3 {
              text-align: center;
              margin-bottom: 8px;
              color: #222;
            }
            h2 {
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-size: 20px;
            }
            h3 {
              font-size: 16px;
              margin-top: 25px;
              border-bottom: 2px solid #ccc;
              padding-bottom: 5px;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              border-bottom: 3px solid #444;
              padding-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
              letter-spacing: 1px;
            }
            .header p {
              margin: 4px 0;
              font-size: 13px;
              color: #555;
            }
            .details {
              border: 1px solid #ccc;
              border-radius: 6px;
              padding: 10px 10px;
              margin-bottom: 25px;
              background: #fafafa;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px 30px;
              font-size: 14px;
            }
            .details p {
              margin: 0;
              padding: 2px 0;
            }
            .details strong {
              display: inline-block;
              width: 120px;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 13px;
              page-break-inside: auto;
            }
            th:nth-child(1), td.vitals { width: 30%; }   /* Slimmer first column */
            th:nth-child(2), td.findings { width: 35%; } /* Wider middle column */
            th:nth-child(3), td.treatment { width: 35%; } /* Keeps good space for notes */
            th, td {
              border: 1px solid #999;
              padding: 8px;
              vertical-align: top;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
              
            thead {
              display: table-header-group;
            }

            tfoot {
              display: table-footer-group;
            }
            th {
              background: #f2f2f2;
              text-align: center;
            }
            td {
              background: #fff;
            }
            .vitals { width: 30%; }
            .vitals-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px 15px;
              font-size: 13px;
            }
            .vitals-grid div {
              display: flex;
              border-bottom: 1px dotted #ddd;
              padding-bottom: 2px;
            }
            .vitals-grid label {
              font-weight: 600;
              color: #333;
              margin-right: 6px;
            }
            .findings { width: 40%; }
            .treatment { width: 30%; }
            .section { margin-top: 40px; }
            .no-record {
              text-align: center;
              color: #777;
              font-style: italic;
            }
            ul {
              padding-left: 16px;
              margin: 4px 0;
            }
            li {
              margin-bottom: 3px;
            }

            @media print {
              @page {
                  padding-top: 20px;
                margin-top: 50px; /* 👈 Add top margin for every new printed page */
                margin-bottom: 30px;
              }

              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              table {
                page-break-inside: auto;
                border-collapse: collapse;
                width: 100%;
              }

              thead {
                display: table-header-group;
              }

              tfoot {
                display: table-footer-group;
              }

              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }

              th, td {
                padding: 8px;
                vertical-align: top;
              }
            }

          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  };

  return (
    <>
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Documents</h3>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Patient Record
        </button>
      </div>

      {/* HIDDEN PRINT SECTION */}
      <div ref={printRef} className="hidden">
        <PrintHeader />

        {/* PERSONAL DETAILS */}
        <div className="details">
          <h3
            style={{
              textAlign: "left",
              border: "none",
              marginBottom: "10px",
              marginTop: "0",
            }}
          >
            Personal Details
          </h3>
          <div className="details-grid">
            <p>
              <strong>Patient Name:</strong> {data?.name || "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {data?.date_of_birth
                ? new Date(data.date_of_birth).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {data?.gender || "N/A"}
            </p>
            <p>
              <strong>Phone Number:</strong> {data?.phone_number || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {data?.address || "N/A"}
            </p>
            <p>
              <strong>Civil Status:</strong> {data?.civil_status || "N/A"}
            </p>
            <p>
              <strong>Age:</strong> {data?.age || "N/A"} years old
            </p>
            <p>
              <strong>Occupation:</strong> {data?.occupation || "N/A"}
            </p>
          </div>
        </div>

        {/* CONSULTATION / FOLLOW-UP RECORDS */}
        <div className="section">
          <h3>Consultation / Follow-up Records</h3>
          <table className="table-grid">
            <thead>
              <tr>
                <th>DATE / VITALS</th>
                <th>COMPLAINTS / FINDINGS</th>
                <th>TREATMENT / NOTES</th>
              </tr>
            </thead>
            <tbody>
              {appointments?.length ? (
                appointments.map((app) => {
                  const relatedSections = [];

                  if (app.ultrasound?.length) {
                    relatedSections.push({
                      type: "ultrasound",
                      data: app.ultrasound.map((u) => ({
                        Type: u.type || u.name || "-",
                        AOG: u.ob_data.aog || "-",
                        EDD:
                          new Date(u.ob_data.edd).toLocaleDateString() || "-",
                        Complaint: u.chief_complaint || "-",
                        "Other Findings": u.others || "-",
                        Impression: u.impression || "-",
                      })),
                    });
                  }

                  if (app.labrequest?.length) {
                    relatedSections.push({
                      type: "lab request",
                      data: app.labrequest.map((l) => ({
                        Name: l.name || "-",
                        Result: l.result || "-",
                        Remarks: l.notes || "-",
                      })),
                    });
                  }

                  if (app.medication?.length) {
                    relatedSections.push({
                      type: "medication",
                      data: app.medication.map((m) => ({
                        Name: m.name || "-",
                        Dosage: m.dose || "-",
                        Instructions: m.notes || "-",
                      })),
                    });
                  }

                  if (app.allergy?.length) {
                    relatedSections.push({
                      type: "allergy",
                      data: app.allergy.map((a) => ({
                        Allergen: a.name || "-",
                        Reaction: a.reaction || "-",
                        Severity: a.severity || "-",
                      })),
                    });
                  }

                  if (app.surgical?.length) {
                    relatedSections.push({
                      type: "surgical",
                      data: app.surgical.map((s) => ({
                        Name: s.name || "-",
                        Year: s.year || "-",
                        Surgeon: s.surgeon || "-",
                        Notes: s.notes || "-",
                      })),
                    });
                  }

                  if (app.pregnancy?.length) {
                    relatedSections.push({
                      type: "pregnancy",
                      data: app.pregnancy.map((p) => ({
                        aog: p.aog || "-",
                        condition: p.condition || "-",
                      })),
                    });
                  }

                  return (
                    <tr key={app._id}>
                      <td className="vitals">
                        <strong>
                          {new Date(app.date).toLocaleDateString()}
                        </strong>
                        <br />
                        {app.vitals?.length ? (
                          app.vitals.map((v, i) => (
                            <div
                              key={i}
                              className="vitals-grid"
                              style={{ marginTop: "10px" }}
                            >
                              <div>
                                <label>BP: </label>
                                <span>{v.blood_pressure || "-"}</span>
                              </div>
                              <div>
                                <label>PR: </label>
                                <span>{v.heart_rate || "-"} bpm</span>
                              </div>
                              <div>
                                <label>RR: </label>
                                <span>{v.respiratory_rate || "-"} cpm</span>
                              </div>
                              <div>
                                <label>Temp: </label>
                                <span>{v.temperature || "-"} °C</span>
                              </div>
                              <div>
                                <label>Wt: </label>
                                <span>{v.weight || "-"} kg</span>
                              </div>
                              <div>
                                <label>Ht: </label>
                                <span>{v.height || "-"} cm</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span>-</span>
                        )}
                      </td>

                      <td
                        className="findings"
                        style={{ "white-space": "pre-wrap" }}
                      >
                        {app.reason && (
                          <div>
                            <strong>Reason:</strong> {app.reason}
                          </div>
                        )}
                        {app.diagnosis && (
                          <div>
                            <strong>Diagnosis:</strong> {app.diagnosis}
                          </div>
                        )}

                        {relatedSections
                          .filter(
                            (s) =>
                              !["medication", "lab request"].includes(s.type) // 👈 exclude these
                          )
                          .map((s, idx) => (
                            <div key={idx} style={{ marginTop: "10px" }}>
                              <strong>{s.type.toUpperCase()}</strong>
                              <ul>
                                {s.data.map((d, i) => (
                                  <li key={i}>
                                    {Object.entries(d).map(([k, v]) => (
                                      <div key={k}>
                                        {k}: {String(v)}
                                      </div>
                                    ))}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </td>

                      <td
                        className="treatment"
                        style={{ "white-space": "pre-wrap" }}
                      >
                        Notes: {app.notes && <>{app.notes}</>}
                        {relatedSections
                          .filter((s) =>
                            ["medication", "lab request"].includes(s.type)
                          )
                          .map((s, idx) => (
                            <div key={idx} style={{ marginTop: "10px" }}>
                              <strong>{s.type.toUpperCase()}</strong>
                              <ul key={idx}>
                                {s.data.map((d, i) => (
                                  <li key={i}>
                                    {Object.entries(d).map(([k, v]) => (
                                      <div key={k}>
                                        {k}: {String(v)}
                                      </div>
                                    ))}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="no-record">
                    No consultation records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
