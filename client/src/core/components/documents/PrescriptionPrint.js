// Prescription.js
import React, { forwardRef } from "react";

const styles = {
  container: {
    background: "#fff",
    color: "#000",
    minWidth: "210mm",
    minHeight: "297mm",
    margin: "0 auto",
    padding: "10mm",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    lineHeight: "1.4",
    position: "relative",
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
    marginBottom: "8px",
  },
  clinicRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginBottom: "8px",
  },
  divider: {
    borderTop: "1px solid #000",
    margin: "10px 0",
  },
  patientRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: "6px",
    gap: "10px",
  },
  label: {
    fontWeight: "bold",
    marginRight: "4px",
  },
  fieldLine: {
    display: "inline-block",
    borderBottom: "1px solid #000",
    minWidth: "80px",
    paddingBottom: "2px",
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
  footer: {
    position: "absolute",
    bottom: "30px",
    right: "40px",
    textAlign: "center",
    fontSize: "12px",
    borderTop: "1px solid #000",
    width: "250px",
    paddingTop: "4px",
  },
  labTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  labTableHeader: {
    border: "1px solid #000",
    padding: "4px 6px",
    fontWeight: "bold",
    textAlign: "left",
    backgroundColor: "#f0f0f0",
  },
  labTableCell: {
    border: "1px solid #000",
    padding: "4px 6px",
    textAlign: "left",
  },
};

const Field = ({ value, width = "120px" }) => (
  <span style={{ ...styles.fieldLine, minWidth: width }}>
    {value || "\u00A0"}
  </span>
);

const Prescription = forwardRef(
  ({ data = {}, doctor = {}, clinics = {} }, ref) => {
    const prescriptions = data.prescriptionList || [];
    const labRequests = data.labRequests || []; // Array of lab requests

    const specialization = Array.isArray(doctor.specialization)
      ? doctor.specialization.join(", ")
      : doctor.specialization || "";

    return (
      <div ref={ref} style={styles.container}>
        {/* Header */}
        <div style={styles.headerName}>{doctor.name}</div>
        <div style={styles.headerTitle}>{specialization}</div>

        {/* Clinic Info */}
        <div style={styles.clinicRow}>
          {clinics.left?.name && (
            <div>
              <strong>Clinic Address:</strong> <br />
              {clinics.left?.name} <br />
              {clinics.left?.address} <br />
              <strong>{clinics.left?.schedule}</strong> {clinics.left?.time}{" "}
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
              <strong>{clinics.right?.schedule}</strong> {clinics.right?.time}{" "}
              <br />
              <strong>Cell No:</strong> {clinics.right?.phone_number}
              <br />
              {clinics.right?.website}
            </div>
          )}
        </div>

        <div style={styles.divider}></div>

        {/* Patient Info */}
        <div style={{ ...styles.patientRow, marginBottom: "4px" }}>
          <div
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Patient Name */}
            <div style={{ minWidth: "220px", flexGrow: 1 }}>
              <span style={{ ...styles.label, marginRight: "4px" }}>
                Patient's Name:
              </span>
              <Field value={data.patientName} width="220px" />
            </div>

            {/* Age & Sex */}
            <div
              style={{ display: "inline-flex", gap: "6px", minWidth: "100px" }}
            >
              <span style={styles.label}>Age:</span>
              <Field value={data.age} width="35px" />
              <span style={styles.label}>Sex:</span>
              <Field value={data.gender} width="35px" />
            </div>

            {/* Address */}
            <div style={{ flexGrow: 2, minWidth: "250px" }}>
              <span style={{ ...styles.label, marginRight: "4px" }}>
                Address:
              </span>
              <Field value={data.address} />
            </div>

            {/* Date */}
            <div style={{ minWidth: "100px" }}>
              <span style={{ ...styles.label, marginRight: "4px" }}>Date:</span>
              <Field value={data.date} width="90px" />
            </div>
          </div>
        </div>

        {/* Rx Symbol */}
        {/* <div style={styles.rxSymbol}>℞</div> */}

        <div style={styles.rxSymbol}>
          <img
            src="/assets/images/RX.jpg"
            alt="Rx Symbol"
            style={{
              maxHeight: "36px", // same as fontSize
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

        {/* Lab Request Table */}
        {labRequests.length > 0 && (
          <>
            <div style={{ marginTop: "15px", fontWeight: "bold" }}>
              Lab Request:
            </div>
            <table style={styles.labTable}>
              <thead>
                <tr>
                  <th style={styles.labTableHeader}>Test Name</th>
                  <th style={styles.labTableHeader}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {labRequests.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.labTableCell}>
                      {item.name === "Others"
                        ? `Others > ${item.name_custom || ""}`
                        : item.name}
                    </td>
                    <td style={styles.labTableCell}>{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={{ fontWeight: "bold" }}>{doctor.name}</div>
          <div>{doctor.specialization}</div>
          <div>License No.: {doctor.license}</div>
        </div>
      </div>
    );
  }
);

export default Prescription;
