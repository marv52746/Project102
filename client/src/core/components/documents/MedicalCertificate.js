// MedicalCertificate.js
import React, { forwardRef } from "react";

const styles = {
  container: {
    background: "#fff",
    color: "#000",
    minWidth: "210mm", // minimum width for A4
    width: "auto", // expand if parent/container allows
    maxWidth: "100%", // do not overflow parent
    height: "297mm", // A4 height
    margin: "0 auto",
    padding: "8mm",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  headerName: {
    fontFamily: "Brush Script MT, cursive",
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "5px",
  },
  clinicRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "12px",
  },
  divider: {
    borderTop: "1px solid #000",
    margin: "0",
  },
  title: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    // textDecoration: "underline",
    margin: "10px 0",
  },
  signature: {
    textAlign: "right",
    fontSize: "14px",
  },
};

// Inline underline field
const Field = ({ value, width = "200px" }) => (
  <span
    style={{
      display: "inline-block",
      borderBottom: "1px solid #000",
      minWidth: width,
      paddingBottom: "2px",
      margin: "0 4px",
    }}
  >
    {value || "\u00A0"}
  </span>
);

const MedicalCertificate = forwardRef(
  ({ data = {}, doctor = {}, clinics = {} }, ref) => {
    const specialization = Array.isArray(doctor.specialization)
      ? doctor.specialization.join(", ")
      : doctor.specialization || "";

    return (
      <div ref={ref} style={styles.container}>
        {/* Header */}
        <div>
          <div style={styles.headerName}>{doctor.name}</div>
          <div style={styles.headerTitle}>{specialization}</div>

          <div style={styles.clinicRow}>
            {clinics.left?.name && (
              <div>
                <strong>Clinic Address:</strong> <br />
                {clinics.left?.name} <br />
                {clinics.left?.address} <br />
                <strong>{clinics.left?.schedule}</strong>: {clinics.left?.time}
                <br />
                <strong>Cell No:</strong> {clinics.left?.phone_number}
                <br />
                {clinics.left?.website}
              </div>
            )}

            {clinics.right?.name && (
              <div style={{ textAlign: "right" }}>
                <strong>Clinic Address:</strong> <br />
                {clinics.right?.name} <br />
                {clinics.right?.address} <br />
                <strong>{clinics.right?.schedule}</strong>:{" "}
                {clinics.right?.time}
                <br />
                <strong>Cell No:</strong> {clinics.right?.phone_number}
                <br />
                {clinics.right?.website}
              </div>
            )}
          </div>

          <div style={styles.divider}></div>
        </div>

        {/* Title */}
        <div style={styles.title}>MEDICAL CERTIFICATE</div>

        {/* Body */}
        <div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              textAlign: "justify",
              margin: "0",
            }}
          >
            This is to certify that{"  "}
            <span
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {data.patientName}
            </span>
            {"  "}
            of{" "}
            <span
              style={{
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {data.address}
            </span>
            {"  "}
            has been examined / treated on{"  "}
            <span
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {data.date}
            </span>
            .
          </p>

          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              margin: "0",
              marginTop: "10px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Diagnosis: </span>
            <span
              style={{
                textDecoration: "underline",
                textUnderlineOffset: "3px", // 👈 lowers underline
              }}
            >
              {data.diagnosis || "N/A"}
            </span>
          </p>

          <p style={{ fontSize: "14px", lineHeight: "1.5", margin: "0" }}>
            <span style={{ fontWeight: "bold" }}>Remarks: </span>
            <span
              style={{
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {data.remarks || "N/A"}
            </span>
          </p>
        </div>

        <p style={{ fontSize: "14px", marginTop: "20px" }}>
          This certificate is being issued upon the request of
          <Field value={data.requestor} width="250px" /> for whatever purpose it
          may serve (excluding legal matters).
        </p>

        {/* Signature */}
        <div style={styles.signature}>
          <p style={{ margin: "0" }}>Respectfully yours,</p>
          <p style={{ fontWeight: "bold", margin: "0", marginTop: "35px" }}>
            {doctor.name}
          </p>
          <p style={{ margin: "2px 0 0" }}>License No.: {doctor.license}</p>
        </div>
      </div>
    );
  }
);

export default MedicalCertificate;
