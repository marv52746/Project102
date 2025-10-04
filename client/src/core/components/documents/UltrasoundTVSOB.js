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
  gridRowBiometry: {
    display: "grid",
    gridTemplateColumns: "40% 15% 15% 30%",
    marginBottom: "4px",
    alignItems: "start",
  },
  gridRowAmniotic: {
    display: "grid",
    gridTemplateColumns: "20% 15% 15% 15% 15% 15%",
    marginBottom: "4px",
    alignItems: "start",
  },
  gridRowEnd: {
    display: "grid",
    gridTemplateColumns: "20% 30% 20% 30%",
    marginBottom: "20px",
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
    timeZone: "Asia/Manila", // Philippine Time
  }).format(date);
};

const UltrasoundTransvaginalOBPrint = forwardRef(
  ({ data = {}, patient = {} }, ref) => {
    return (
      <div ref={ref} style={styles.container}>
        <div>
          <PrintHeader />

          <div style={styles.titleRow}>
            <div>
              Examination: <strong>TRANSVAGINAL ULTRASOUND</strong>
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

          {/* OVARY*/}
          <div style={styles.gridRow}>
            <div style={styles.th}>Gestational Sac:</div>
            <div style={styles.td}>
              {data.early_pregnancy?.gestational_sac.size}
            </div>
            <div style={styles.td}>
              {data.early_pregnancy?.gestational_sac.age_equiv}
            </div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Crown Rump Length:</div>
            <div style={styles.td}>
              {data.early_pregnancy?.crown_rump_length.size}
            </div>
            <div style={styles.td}>
              {data.early_pregnancy?.crown_rump_length.age_equiv}
            </div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Yolk sac:</div>
            <div style={styles.td}>{data.early_pregnancy?.yolk_sac}</div>
          </div>
          <div style={styles.gridRowEnd}>
            <div style={styles.th}>Fetal Heart Rate:</div>
            <div style={styles.td}>
              {data.early_pregnancy?.fetal_heart_rate}
            </div>
          </div>

          {/* Common*/}
          <div style={styles.gridRow}>
            <div style={styles.th}>Average Ultrasonic Age:</div>
            <div style={styles.td}>
              {data.early_pregnancy?.average_ultrasonic_age}
            </div>
          </div>
          <div style={styles.gridRowEnd}>
            <div style={styles.th}>Ultrasonic EDC:</div>
            <div style={styles.td}>
              {formatDate(data.early_pregnancy?.ultrasonic_edc)}
            </div>
          </div>

          {/* UTERUS*/}
          <div style={styles.gridRow}>
            <div style={styles.th}>Uterus:</div>
            <div style={styles.td}>{data.early_pregnancy?.uterus}</div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Adnexa:</div>
            <div style={styles.td}>
              <div style={styles.td}>
                Right Ovary: {data.early_pregnancy?.adnexae.right_ovary}
              </div>
              <div style={styles.td}>
                Left Ovary: {data.early_pregnancy?.adnexae.left_ovary}
              </div>
            </div>
          </div>
          <div style={styles.gridRowEnd}>
            <div style={styles.th}>Cervix:</div>
            <div style={styles.td}>
              <div style={styles.td}>
                Dimensions: {data.early_pregnancy?.cervix.dimensions}
              </div>
              <div style={styles.td}>
                Volume: {data.early_pregnancy?.cervix.volume}
              </div>
              <div style={styles.td}>
                Notes: {data.early_pregnancy?.cervix.notes}
              </div>
            </div>
          </div>

          {/* OTHERS & IMPRESSION */}
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

export default UltrasoundTransvaginalOBPrint;
