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

  const handlePrint = (ref, title, orientation = "portrait") => {
    if (!ref.current) return;

    const printContent = ref.current.innerHTML;

    const pageSize =
      orientation === "landscape" ? "297mm 210mm" : "210mm 297mm";

    const win = window.open("", "", "width=1000,height=600");
    win.document.write(`
    <html>
      <head>
        <title>${title} - ${patientName}</title>
        <link rel="stylesheet" href="/output.css" />
        <style>
          @page { size: ${pageSize}; margin: 5mm; }

          html, body {
            margin: 5mm;
            padding: 0;
            height: 100%;
          }

          body {
            display: flex;
            justify-content: center; /* horizontal center */
            align-items: center;    /* vertical center */
          }

          #print-container {
            width: 100%;
            height: 100%;
          }

          /* Optional: scale down if content is too big */
          #print-container > * {
            max-width: 100%;
            max-height: 100%;
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
    win.print();
    win.close();
  };

  const handlePrintA4 = (ref, title) => {
    if (!ref.current) return;
    const printContent = ref.current.innerHTML;

    const win = window.open("", "", "width=1000,height=600");
    win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <link rel="stylesheet" href="/output.css" />
        <style>
          @page {
            size: A4 portrait;   /* or 'A4 landscape' */
          }

          html, body {
            margin: 0;
            padding: 0;
            width: 210mm;   /* A4 width */
            height: 297mm;  /* A4 height */
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
    win.print();
    win.close();
  };

  // const handlePrintIframe = (ref, title) => {
  //   if (!ref.current) return;

  //   const patientName = data.patient?.name || "Patient"; // fallback
  //   const dynamicTitle = `${title} - ${patientName}`;

  //   const printContent = ref.current.innerHTML;
  //   const iframe = document.createElement("iframe");
  //   iframe.style.position = "absolute";
  //   iframe.style.left = "-9999px";
  //   document.body.appendChild(iframe);

  //   const doc = iframe.contentWindow.document;
  //   doc.open();
  //   doc.write(`
  //   <html>
  //     <head>
  //       <title>${dynamicTitle}</title>
  //       <link rel="stylesheet" href="/output.css" />
  //     </head>
  //     <body>${printContent}</body>
  //   </html>
  // `);
  //   doc.close();

  //   // Set the dynamic title for the print dialog
  //   iframe.contentWindow.document.title = dynamicTitle;

  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();

  //   document.body.removeChild(iframe);
  // };

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
    });
  };

  return (
    <>
      <div className="flex gap-2 mt-2">
        {/* Only show Prescription button if data.medication exists */}
        {data.medication && data.medication.length > 0 && (
          <button
            onClick={() => handlePrint(prescRef, "Prescription", "portrait")}
            className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
          >
            🖨️ Prescription
          </button>
        )}

        {/* Only show Lab Request button if data.labrequest exists */}
        {data.labrequest && data.labrequest.length > 0 && (
          <button
            onClick={() => handlePrint(labreqRef, "Lab Request", "portrait")}
            className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
          >
            🖨️ Lab Request
          </button>
        )}

        {/* Only show Medical Certificate button if diagnosis exists */}
        {data.diagnosis && data.diagnosis.length > 0 && (
          <button
            onClick={() =>
              handlePrint(certRef, "Medical Certificate", "landscape")
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
