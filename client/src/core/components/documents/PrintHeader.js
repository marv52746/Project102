import React, { forwardRef } from "react";

const styles = {
  container: {
    background: "#fff",
    color: "#000",
    minWidth: "210mm",
    height: "297mm",
    margin: "0 auto",
    padding: "10mm",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "40px",
  },
  logo: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
  },
  headerCenter: {
    textAlign: "center",
    flex: 1,
  },
  clinicName: {
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "1.2",
  },
  address: {
    fontSize: "12px",
    marginTop: "4px",
  },
};

const PrintHeader = () => (
  <div style={styles.header}>
    {/* Left Logo */}
    <img
      src="/assets/images/logo_left.png"
      alt="Logo Left"
      style={styles.logo}
    />

    {/* Center Title */}
    <div style={styles.headerCenter}>
      <div style={styles.clinicName}>
        BISLIG MEDICAL SPECIALISTS AND WOUND CARE CLINIC
      </div>
      <div style={styles.clinicName}>BISLIG PREMIER BIRTHING HOME</div>
      <div style={styles.address}>
        E.G.S. Building, Espiritu Street, Barangay Mangagoy, Bislig City,
        Surigao del Sur
      </div>
    </div>

    {/* Right Logo */}
    <img src="/assets/images/Logo.png" alt="Logo Right" style={styles.logo} />
  </div>
);

export default PrintHeader;
