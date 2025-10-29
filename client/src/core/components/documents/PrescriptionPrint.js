// Prescription.js
import React, { forwardRef } from "react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#fff",
    color: "#000",
    minHeight: "8.3in", // ensures at least one page
    height: "auto", // allow natural growth
    pageBreakInside: "avoid",
    margin: "10mm auto",
    padding: "8mm",
    fontFamily: "Arial, sans-serif",
    fontSize: "11px",
    lineHeight: "1.3",
    position: "relative",
    boxSizing: "border-box",
  },

  headerName: {
    fontFamily: "Brush Script MT, cursive",
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "12px",
    textAlign: "center",
    marginBottom: "6px",
  },
  clinicRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "10px",
    marginBottom: "6px",
  },
  divider: {
    borderTop: "1px solid #000",
    margin: "10px 0",
  },
  patientGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 60px 70px", // name/addr, age, sex/date
    gridTemplateRows: "auto auto",
    gridTemplateAreas: `
      "name age sex"
      "address date date"
    `,
    gap: "0",
    alignItems: "start",
    marginBottom: "8px",
    fontSize: "11px",
  },
  gridItem: {
    display: "block",
  },
  label: {
    fontWeight: "bold",
    marginRight: "4px",
    display: "inline-block",
    verticalAlign: "top",
  },
  value: {
    display: "inline-block",
    padding: "0 2px",
    whiteSpace: "normal", // allow wrapping
    wordBreak: "break-word",
    maxWidth: "100%",
  },
  rxSymbol: {
    fontSize: "36px",
    fontWeight: "bold",
    fontFamily: "serif",
    margin: "15px 0",
  },
  rxTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "5px",
    fontSize: "10px",
  },
  rxTableHeader: {
    border: "1px solid #000",
    padding: "4px 6px",
    fontWeight: "bold",
    textAlign: "left",
  },
  rxTableCell: {
    border: "1px solid #000",
    padding: "4px 6px",
    textAlign: "left",
  },

  // footer: {
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "flex-end", // ✅ move signature to the right side
  //   width: "100%", // full width to align content properly
  //   paddingTop: "4px",
  //   pageBreakBefore: "avoid",
  // },
  // signatureBlock: {
  //   textAlign: "center",
  //   fontSize: "10px",
  //   borderTop: "1px solid #000",
  //   width: "250px",
  //   paddingTop: "4px",
  //   marginTop: "20mm", // add spacing before signature
  // },

  footer: {
    alignSelf: "flex-end", // ✅ move to right side
    textAlign: "center",
    fontSize: "10px",
    borderTop: "1px solid #000",
    width: "250px",
    paddingTop: "4px",
    marginTop: "10mm", // spacing before signature
    pageBreakBefore: "avoid",
  },

  signatureBlock: {
    width: "100%",
  },
};

const Prescription = forwardRef(
  ({ data = {}, doctor = {}, clinics = {} }, ref) => {
    const prescriptions = data.prescriptionList || [];
    const specialization = Array.isArray(doctor.specialization)
      ? doctor.specialization.join(", ")
      : doctor.specialization || "";

    return (
      <div ref={ref} style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerName}>{doctor.name}</div>
          <div style={styles.headerTitle}>{specialization}</div>
          {/* Clinics */}
          <div style={styles.clinicRow}>
            {clinics.left && (
              <div>
                <strong>Clinic Address:</strong> <br />
                {clinics.left.name} <br />
                {clinics.left.address} <br />
                <strong>{clinics.left.schedule}</strong> {clinics.left.time}{" "}
                <br />
                <strong>Cell No:</strong> {clinics.left.phone_number}
                <br />
                {clinics.left.website}
              </div>
            )}
            {clinics.right && (
              <div style={{ textAlign: "right" }}>
                <strong>Clinic Address:</strong> <br />
                {clinics.right.name} <br />
                {clinics.right.address} <br />
                <strong>{clinics.right.schedule}</strong> {clinics.right.time}{" "}
                <br />
                <strong>Cell No:</strong> {clinics.right.phone_number}
                <br />
                {clinics.right.website}
              </div>
            )}
          </div>
          <div style={styles.divider}></div>

          {/* Patient Info Grid */}
          <div style={styles.patientGrid}>
            <div style={{ gridArea: "name" }}>
              <span style={styles.label}>Patient's Name:</span>
              <span style={styles.value}>
                {data.patientName || "Juan Dela Cruz"}
              </span>
            </div>

            <div style={{ gridArea: "age" }}>
              <span style={styles.label}>Age:</span>
              <span style={styles.value}>{data.age || "32"}</span>
            </div>

            <div style={{ gridArea: "sex" }}>
              <span style={styles.label}>Sex:</span>
              <span style={styles.value}>{data.gender || "M"}</span>
            </div>

            <div style={{ gridArea: "address" }}>
              <span style={styles.label}>Address:</span>{" "}
              <span>
                {data.address ||
                  "123 Mabuhay St., Barangay Example, Las Piñas City — beside the long compound near the market."}
              </span>
            </div>

            <div style={{ gridArea: "date" }}>
              <span style={styles.label}>Date:</span>
              <span style={styles.value}>{data.date || "Oct 9, 2025"}</span>
            </div>
          </div>

          {/* Rx Symbol */}
          <div style={styles.rxSymbol}>
            <img
              src="/assets/images/RX.jpg"
              // src={`${window.location.origin}/assets/images/RX.jpg`}
              alt="Rx Symbol"
              style={{
                maxHeight: "36px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          {/* Prescription Table */}
          {prescriptions.length > 0 && (
            <table style={styles.rxTable}>
              <thead>
                <tr>
                  <th style={styles.rxTableHeader}>Medicine</th>
                  <th style={styles.rxTableHeader}>Dose</th>
                  <th style={styles.rxTableHeader}>Frequency</th>
                  <th style={styles.rxTableHeader}>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.rxTableCell}>{item.name}</td>
                    <td style={styles.rxTableCell}>{item.dose}</td>
                    <td style={styles.rxTableCell}>{item.frequency}</td>
                    <td style={styles.rxTableCell}>{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.signatureBlock}>
            <div style={{ fontWeight: "bold", fontSize: "12px" }}>
              {doctor.name}
            </div>
            <div>{doctor.specialization}</div>
            <div>License No.: {doctor.license}</div>
          </div>
        </div>
      </div>
    );
  }
);

export default Prescription;
