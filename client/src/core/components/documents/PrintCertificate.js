import React, { useEffect, useRef, useState } from "react";
import MedicalCertificate from "./MedicalCertificate";
import Prescription from "./PrescriptionPrint";
import { useDispatch } from "react-redux";
import apiService from "../../services/apiService";
import jsPDF from "jspdf";
import UltrasoundPhysicalPrint from "./UltrasoundBiophysical";
import UltrasoundTransvaginalOBPrint from "./UltrasoundTVSOB";
import TransvaginalUltrasoundGynePrint from "./UltrasoundTVSGyne";
import LabRequestPrint from "./LabRequestPrint";
import html2canvas from "html2canvas";

export default function PrintActionButtons({ data }) {
  const certRef = useRef(); // separate ref for certificate
  const prescRef = useRef(); // separate ref for prescription
  const usRef = useRef(); // ✅ new ref for ultrasound
  const labreqRef = useRef(); // ✅ new ref for ultrasound
  const patientName = data?.patient?.name || "Patient";

  const [clinics, setClinics] = useState([]);
  const dispatch = useDispatch();
  // console.log(data);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const clinicRecords = await apiService.get(dispatch, "clinic", {
          doctors: { $in: [data.doctor._id] },
        });
        if (Array.isArray(clinicRecords) && clinicRecords.length > 0) {
          setClinics(clinicRecords);
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    if (data.doctor._id) {
      fetchClinics();
    }
  }, [dispatch, data]);

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

  // Format date to human-readable
  const formatDate = (rawDate) => {
    if (!rawDate) return "";
    const date = new Date(rawDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handlePrintPrescription = (ref, title, orientation = "portrait") => {
    if (!ref.current) return;

    const printContent = ref.current.innerHTML;

    // ✅ Swap dimensions dynamically based on orientation
    const isLandscape = orientation === "landscape";
    const pageWidth = isLandscape ? "7.9in" : "5.5in";
    const pageHeight = isLandscape ? "5.5in" : "7.9in";

    const win = window.open("", "", "width=800,height=1000");
    win.document.write(`
    <html>
      <head>
        <title>${title} - ${patientName}</title>
        <link rel="stylesheet" href="/output.css" />
        <style>
          @page { 
            size: 5.5in 8in portrait; /* Half Letter size */
            margin: 5mm; 
          }

          html, body {
            margin: 0;
            padding: 0;
            width: ${pageWidth};
            height: ${pageHeight};
          }

           body {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background: white;
          }

           #print-container {
            width: ${pageWidth};
            height: ${pageHeight};
            box-sizing: border-box;
            padding: 3mm;
            font-family: 'Arial', sans-serif;
            font-size: 12px; /* scaled down */
            line-height: 1.3;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          #print-container * {
            box-sizing: border-box;
          }

          #print-container,
          .print-content {
            page-break-inside: auto;
          }

          /* Each page container */
          .page {
            page-break-after: always;
            position: relative;
          }

          /* Repeat header/footer for each printed page */
          .print-header,
          .print-footer {
            position: fixed;
            left: 0;
            right: 0;
            height: 40px;
            text-align: center;
            font-size: 11px;
          }

          .print-header {
            top: 0;
            border-bottom: 1px solid #000;
          }

          .print-footer {
            bottom: 0;
            border-top: 1px solid #000;
          }

          /* Content should leave space for header/footer */
          .print-content {
            margin-top: 50px;
            margin-bottom: 50px;
          }

         /* Fix table behavior */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          border: 1px solid #000;
          page-break-inside: auto !important;
        }

        thead {
          display: table-header-group !important;
        }

        tfoot {
          display: table-footer-group !important;
        }

        tr, td, th {
          page-break-inside: avoid;
          page-break-after: auto;
          border: 1px solid #000;
          padding: 2px 4px;
          vertical-align: top;
          word-wrap: break-word;
        }

          h1, h2, h3, h4 {
            margin: 0;
            font-weight: normal;
          }
        </style>
      </head>
      <body>
        <div id="print-container">${printContent}</div>
      </body>
    </html>
  `);

    win.document.close();
    win.focus();
    // win.print();
    // win.close();
    // ✅ Wait a short delay before printing to ensure styles load
    win.onload = () => {
      win.focus();
      win.print();

      // ✅ Clear document content before closing to avoid cache
      setTimeout(() => {
        win.document.body.innerHTML = "";
        win.close();
      }, 500);
    };
  };

  const handlePDFDownload = (ref, fileName) => {
    if (!ref.current) return;
    const doc = new jsPDF("p", "px", "a4");

    // Use html2canvas if you want the HTML content as image
    doc.html(ref.current, {
      callback: function (doc) {
        doc.save(`${fileName}.pdf`);
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.5 },
      margin: 11,
    });
  };

  return (
    <>
      <div className="flex gap-2 mt-2">
        {/* Only show Prescription button if data.medication exists */}
        {data.medication && data.medication.length > 0 && (
          <button
            onClick={() =>
              handlePrintPrescription(prescRef, "Prescription", "portrait")
            }
            className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
          >
            🖨️ Prescription
          </button>
        )}

        {/* Only show Lab Request button if data.labrequest exists */}
        {data.labrequest && data.labrequest.length > 0 && (
          <button
            onClick={() =>
              handlePrintPrescription(labreqRef, "Lab Request", "portrait")
            }
            className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
          >
            🖨️ Lab Request
          </button>
        )}

        {/* Only show Medical Certificate button if diagnosis exists */}
        {data.diagnosis && data.diagnosis.length > 0 && (
          <button
            onClick={() =>
              handlePrintPrescription(
                certRef,
                "Medical Certificate",
                "landscape"
              )
            }
            className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
          >
            🖨️ Medical Certificate
          </button>
        )}

        {/* Only show Ultrasound button if ultrasound array exists and has items */}
        {data.ultrasound && data.ultrasound.length > 0 && (
          <button
            onClick={() =>
              handlePDFDownload(
                usRef,
                `${data.patient?.name} - ${data.ultrasound[0].type}`
              )
            }
            className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
          >
            🖨️ Ultrasound
          </button>
        )}
      </div>

      {/* Hidden printable content */}
      <div style={{ display: "none" }}>
        <MedicalCertificate
          ref={certRef}
          data={{
            patientName: data.patient?.name,
            address: data.patient?.address,
            date: formatDate(data.date),
            diagnosis: data.diagnosis,
            remarks: data.notes,
            requestor: "",
          }}
          doctor={data.doctor}
          clinics={{ left: clinics[0], right: clinics[1] }}
        />
      </div>

      <div style={{ display: "none" }}>
        <Prescription
          ref={prescRef}
          data={{
            patientName: data.patient?.name,
            address: data.patient?.address,
            date: formatDate(data.date),
            remarks: data.notes,
            requestor: "Employer",
            gender: data.patient?.gender,
            age: calculateAge(data.patient?.date_of_birth), // transform DOB to age
            prescriptionList: data.medication,
          }}
          doctor={data.doctor}
          clinics={{ left: clinics[0], right: clinics[1] }}
        />
      </div>

      <div style={{ display: "none" }}>
        <LabRequestPrint
          ref={labreqRef}
          data={{
            patientName: data.patient?.name,
            address: data.patient?.address,
            date: formatDate(data.date),
            remarks: data.notes,
            requestor: "Employer",
            gender: data.patient?.gender,
            age: calculateAge(data.patient?.date_of_birth), // transform DOB to age
            labRequests: data.labrequest,
          }}
          doctor={data.doctor}
          clinics={{ left: clinics[0], right: clinics[1] }}
        />
      </div>

      <div style={{ display: "none" }}>
        {(() => {
          const firstUS = data.ultrasound?.[0];
          const type = firstUS?.type;

          if (!firstUS || !type) return null;

          switch (type) {
            case "Biometry":
              return (
                <UltrasoundPhysicalPrint
                  ref={usRef}
                  data={{
                    ...data.ultrasound[0],
                    date: formatDate(data.date),
                  }}
                  patient={{
                    ...data.patient,
                    age: calculateAge(data.patient?.date_of_birth),
                  }}
                />
              );

            case "Biophysical Score":
              return (
                <UltrasoundPhysicalPrint
                  ref={usRef}
                  data={{
                    ...data.ultrasound[0],
                    date: formatDate(data.date),
                  }}
                  patient={{
                    ...data.patient,
                    age: calculateAge(data.patient?.date_of_birth),
                  }}
                />
              );

            case "Transvaginal Ultrasound - OB":
              return (
                <UltrasoundTransvaginalOBPrint
                  ref={usRef}
                  data={{
                    ...data.ultrasound[0],
                    date: formatDate(data.date),
                  }}
                  patient={{
                    ...data.patient,
                    age: calculateAge(data.patient?.date_of_birth),
                  }}
                />
              );

            case "Transvaginal Ultrasound - Gyne":
              return (
                <TransvaginalUltrasoundGynePrint
                  ref={usRef}
                  data={{
                    ...data.ultrasound[0],
                    date: formatDate(data.date),
                  }}
                  patient={{
                    ...data.patient,
                    age: calculateAge(data.patient?.date_of_birth),
                  }}
                />
              );

            default:
              return null;
          }
        })()}
      </div>
    </>
  );
}
