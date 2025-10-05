import React, { forwardRef } from "react";
import PrintHeader from "./PrintHeader";
import { Footer } from "./PrintFooter";
import { formatDate } from "../../utils/dateUtils";

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
  gridRowGyneMid: {
    display: "grid",
    gridTemplateColumns: "20% 70%",
    alignItems: "start",
    marginBottom: "4px",
    padding: "6px 8px",
  },
  gridRowGyneEnd: {
    display: "grid",
    gridTemplateColumns: "20% 70%",
    alignItems: "start",
    marginBottom: "20px",
    padding: "6px 8px",
  },
  gridRowGyneTop: {
    display: "grid",
    gridTemplateColumns: "20% 15% 20% 15% 20% 15%",
    marginBottom: "20px",
    alignItems: "start",
  },
  gridRowEnd: {
    display: "grid",
    gridTemplateColumns: "20% 80%",
    marginBottom: "20px",
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

const TransvaginalUltrasoundGynePrint = forwardRef(
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
            <div style={styles.th}>Chief Complaint:</div>
            <div style={styles.td}>{data?.chief_complaint}</div>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.th}>Address:</div>
            <div style={styles.td}>{patient?.address}</div>
            <div style={styles.th}>Date of Birth:</div>
            <div style={styles.td}>{formatDate(patient?.date_of_birth)}</div>
          </div>
          <div style={styles.gridRowGyneTop}>
            <div style={styles.th}>Age:</div>
            <div style={styles.td}>{patient?.age} y.o.</div>
            <div style={styles.th}>G/P:</div>
            <div style={styles.td}>{data.ob_data?.gravida_para}</div>
            <div style={styles.th}>Day of Cycle:</div>
            <div style={styles.td}>{data.ob_data?.day_of_cycle || "-"}</div>
          </div>

          {/* EXAMINATION FINDINGS */}
          <div style={styles.gridRowGyneMid}>
            <div style={styles.th}>I. Cervix</div>
            <div style={styles.td}>
              <p>{data.gyn_findings.cervix?.dimensions}</p>
              <p>{data.gyn_findings.cervix?.notes}</p>
            </div>
          </div>

          <div style={styles.gridRowGyneMid}>
            <div style={styles.th}>II. Uterus</div>
            <div style={styles.td}>
              <p>{data.gyn_findings.uterus?.dimensions}</p>

              <p>{data.gyn_findings.uterus?.orientation}</p>
              <p>{data.gyn_findings.uterus?.wall_thickness.anterior}</p>
              <p>{data.gyn_findings.uterus?.wall_thickness.posterior}</p>
              <p>{data.gyn_findings.uterus?.notes}</p>
            </div>
          </div>

          <div style={styles.gridRowGyneMid}>
            <div style={styles.th}>III. Endometrium</div>
            <div style={styles.td}>
              <p>{data.gyn_findings.endometrium?.thickness}</p>
              <p>{data.gyn_findings.endometrium?.notes}</p>
            </div>
          </div>

          <div style={styles.gridRowGyneMid}>
            <div style={styles.th}>IV. Right Ovary</div>
            <div style={styles.td}>
              <p>{data.gyn_findings.right_ovary?.dimensions}</p>
              <p>{data.gyn_findings.right_ovary?.volume}</p>
              <p>{data.gyn_findings.right_ovary?.notes}</p>
            </div>
          </div>

          <div style={styles.gridRowGyneMid}>
            <div style={styles.th}>V. Left Ovary</div>
            <div style={styles.td}>
              <p>{data.gyn_findings.left_ovary?.dimensions}</p>
              <p>{data.gyn_findings.left_ovary?.volume}</p>
              <p>{data.gyn_findings.left_ovary?.notes}</p>
            </div>
          </div>

          <div style={styles.gridRowGyneEnd}>
            <div style={styles.th}>VI. Others</div>
            <p>{data.others?.notes}</p>
          </div>

          <div style={styles.sectionTitle}>IMPRESSION</div>
          <p>{data.impression}</p>
        </div>

        {/* Footer */}
        <Footer radiologist={data.radiologist} />
      </div>
    );
  }
);

export default TransvaginalUltrasoundGynePrint;
