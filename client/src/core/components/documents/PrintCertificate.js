import React, { useEffect, useRef, useState } from "react";
import MedicalCertificate from "./MedicalCertificate";
import Prescription from "./PrescriptionPrint";
import { useDispatch } from "react-redux";
import apiService from "../../services/apiService";

export default function PrintActionButtons({ data }) {
  const certRef = useRef(); // separate ref for certificate
  const prescRef = useRef(); // separate ref for prescription
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

  // Doctor data (example)
  const doctorShalomData = {
    details: {
      name: "Shalom C. Victoriano, M.D.",
      specialization: "Obstetrician - Gynecologist",
      title: "Physician",
      license: "0117246",
    },
    leftAdd: {
      address1: "Bislig Premiere Birthing Home",
      address2: "EGS Building, Espirito Street, Mangagoy, Bislig City",
      schedule: "Monday - Saturday:",
      time: "9:00 am - 5:00 pm",
      phone: "09171135187",
    },
    // rightAdd: {
    //   address1: "Door P-1 OJLC Bldg., Datu Abing St., Calinan, D.C.",
    //   address2: "",
    //   schedule: "MWTF Sat:",
    //   time: "1:00 pm - 5:00 pm",
    //   phone: "0923-521-6714",
    // },
  };

  const doctorKarolData = {
    details: {
      name: "Karol Augustus L. Lesiguez, M.D.",
      specialization: "General Surgery",
      license: "0117220",
    },
    leftAdd: {
      address1: "Room 611, Medical Arts Building",
      address2: "San Pedro Hospital, C. Guzman Street, Davao City",
      schedule: "Monday-Wednesday:",
      time: "10:00 am - 4:00 pm",
      phone: "0943-525-9582",
    },
    rightAdd: {
      address1: "Room 3, Bislig Medical Specialists and Wound Care Clinic",
      address2: "EGS Building, Espiritu Street, Mangagoy, Bislig City",
      schedule: "Thurs.-Sun.:",
      time: "9:00 am - 5:00 pm",
      phone: "0923-521-6714",
    },
  };

  const doctor = doctorKarolData;

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
            // display: flex;
            // justify-content: center;
            // align-items: center;
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

  return (
    <>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => handlePrint(prescRef, "Prescription", "portrait")}
          className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
        >
          🖨️ Print Prescription
        </button>

        <button
          onClick={() =>
            handlePrint(certRef, "Medical Certificate", "landscape")
          }
          className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
        >
          🖨️ Print Medical Certificate
        </button>
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
            labRequests: data.labrequest,
          }}
          doctor={data.doctor}
          clinics={{ left: clinics[0], right: clinics[1] }}
        />
      </div>
    </>
  );
}
