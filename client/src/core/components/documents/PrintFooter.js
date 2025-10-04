const styles = {
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
  signatureImage: {
    maxWidth: "150px",
    height: "auto",
    marginBottom: "5px",
  },
  disclaimer: {
    fontSize: "10px",
    fontStyle: "italic",
    marginTop: "20px",
    textAlign: "justify",
  },
};

const signatureMap = {
  "LIZA M. MUÑEZ, MD, FPCR": "/assets/images/sign_liza.png",
  "NIEL KRISTOFFER P. GAMBOA, MD, DPBR": "/assets/images/sign_niel.png",
};

export const Footer = ({ radiologist }) => {
  const signatureSrc = signatureMap[radiologist];

  return (
    <div style={styles.footer}>
      <div style={styles.signature}>
        <div style={styles.sigBlock}>
          {signatureSrc && (
            <img
              src={signatureSrc}
              alt="Signature"
              style={styles.signatureImage}
            />
          )}
          <div style={styles.sigLine}></div>
          <p style={{ marginBottom: "2px" }}>{radiologist}</p>
          <p style={{ fontWeight: "bold", margin: 0 }}>RADIOLOGIST</p>
        </div>
      </div>
      <div style={styles.disclaimer}>
        * Disclaimer: The transmitted images are performed by radiologic
        technologist and are interpreted and electronically signed by
        radiologist. The image findings are to be correlated by attending
        physician.
      </div>
    </div>
  );
};
