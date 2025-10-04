import React, { forwardRef } from "react";
import PrintHeader from "./PrintHeader";
import { Footer } from "./PrintFooter";

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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  sectionTitle: {
    fontWeight: "bold",
    margin: "10px 0 4px",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "20% 30% 20% 30%",
    marginBottom: "4px",
    alignItems: "start",
  },
  gridRowEnd: {
    display: "grid",
    gridTemplateColumns: "20% 30% 20% 30%",
    marginBottom: "15px",
    alignItems: "start",
  },
  gridRowSummary: {
    display: "grid",
    gridTemplateColumns: "30% 30% 30% 10%",
    marginBottom: "4px",
    alignItems: "start",
  },
  th: {
    fontWeight: "bold",
    fontSize: "12px",
    verticalAlign: "top",
  },
  td: {
    fontSize: "12px",
    textAlign: "left",
    verticalAlign: "top",
  },
  centeredTh: {
    fontWeight: "bold",
    fontSize: "12px",
    verticalAlign: "top",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
  },
  signature: {
    textAlign: "right",
    marginTop: "40px",
  },
  sigBlock: {
    display: "inline-block",
    textAlign: "center",
    minWidth: "200px",
  },
  sigLine: {
    borderTop: "1px solid #000",
    marginBottom: "0px",
  },
  disclaimer: {
    fontSize: "10px",
    fontStyle: "italic",
    marginTop: "20px",
    textAlign: "justify",
  },
};

const formatDate = (raw) => {
  if (!raw) return "";
  const date = new Date(raw);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const UltrasoundBiometryPrint = forwardRef(
  ({ data = {}, patient = {} }, ref) => {
    return (
      <div ref={ref} style={styles.container}>
        <div>
          <PrintHeader />

          <div style={styles.titleRow}>
            <div>
              Examination: <strong>BIOMETRY</strong>
            </div>
            <div>Date: {formatDate(data.date)}</div>
          </div>

          {/* PATIENT DATA */}
          <div style={styles.sectionTitle}>PATIENT DATA</div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Name:</div>
            <div style={styles.td}>{patient?.name}</div>
            <div style={styles.th}>Date of Birth:</div>
            <div style={styles.td}>{formatDate(patient?.date_of_birth)}</div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Address:</div>
            <div style={styles.td}>{patient?.address}</div>
            <div style={styles.th}>Age:</div>
            <div style={styles.td}>{patient?.age} yo</div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>G/P:</div>
            <div style={styles.td}>{data.ob_data?.gravida_para}</div>
            <div style={styles.th}>AOG:</div>
            <div style={styles.td}>{data.ob_data?.aog}</div>
          </div>
          <div style={styles.gridRowEnd}>
            <div style={styles.th}>LMP:</div>
            <div style={styles.td}>{formatDate(data.ob_data?.lmp)}</div>
            <div style={styles.th}>EDD:</div>
            <div style={styles.td}>{formatDate(data.ob_data?.edd)}</div>
          </div>

          {/* FETAL SURVEY */}
          <div style={styles.sectionTitle}>FETAL SURVEY</div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Presentation:</div>
            <div style={styles.td}>{data.fetal_survey?.presentation}</div>
            <div style={styles.th}>Fetal Sex:</div>
            <div style={styles.td}>{data.fetal_survey?.fetal_sex}</div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>No. of Fetus:</div>
            <div style={styles.td}>{data.fetal_survey?.number_of_fetus}</div>
            <div style={styles.th}>Placental Grade:</div>
            <div style={styles.td}>{data.fetal_survey?.placenta_grade}</div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Fetal Heart Beat:</div>
            <div style={styles.td}>{data.fetal_survey?.fetal_heart_rate}</div>
            <div style={styles.th}>Placental Position:</div>
            <div style={styles.td}>{data.fetal_survey?.placenta_position}</div>
          </div>
          <div style={styles.gridRowEnd}>
            <div style={styles.th}>Amniotic Fluid:</div>
            <div style={styles.td}>
              {data.fetal_survey?.amniotic_fluid?.total}
            </div>
            <div style={styles.th}>SVP:</div>
            <div style={styles.td}>
              {data.fetal_survey?.amniotic_fluid?.svp}
            </div>
          </div>

          {/* FETAL BIOMETRY */}
          <div style={styles.sectionTitle}>FETAL BIOMETRY</div>
          <div style={{ marginBottom: "15px" }}>
            {["BPD", "OFD", "HC", "AC", "FL"].map((key) => (
              <div style={styles.gridRow} key={key}>
                <div style={styles.th}>
                  {data.fetal_biometry[key.toLowerCase()]?.label || key}:
                </div>
                <div style={styles.td}>
                  {data.fetal_biometry[key.toLowerCase()]?.measurement} cm
                </div>
                <div style={styles.td} colSpan={2}>
                  {data.fetal_biometry[key.toLowerCase()]?.age_equiv}
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div style={styles.gridRowSummary}>
            <div style={styles.th}>AVERAGE ULTRASONIC AGE:</div>
            <div style={styles.td}>{data.average_age}</div>
            <div></div>
            <div></div>
          </div>
          <div style={styles.gridRowSummary}>
            <div style={styles.th}>ULTRASONIC EDD:</div>
            <div style={styles.td}>{formatDate(data.ultrasonic_edd)}</div>
            <div></div>
            <div></div>
          </div>
          <div style={styles.gridRowSummary}>
            <div style={styles.th}>ESTIMATED FETAL WEIGHT (EFW):</div>
            <div style={styles.td}>{data.efw}</div>
            <div></div>
            <div></div>
          </div>

          {/* Others & Impression */}
          <div style={styles.sectionTitle}>OTHERS:</div>
          <p>{data.others}</p>
          <div style={styles.sectionTitle}>IMPRESSION:</div>
          <p>{data.impression}</p>
        </div>

        {/* Footer */}
        <Footer radiologist={data.radiologist} />
      </div>
    );
  }
);

export default UltrasoundBiometryPrint;
