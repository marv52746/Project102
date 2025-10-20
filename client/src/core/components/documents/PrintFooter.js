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

  // signatureImage: {
  //   display: "block",
  //   margin: "0 auto 5px",
  //   width: "auto",
  //   height: "auto",
  //   maxWidth: "180px",
  //   maxHeight: "80px",
  //   objectFit: "contain",
  // },

  signatureImage: {
    display: "block",
    margin: "0 auto 5px",
    width: "auto",
    height: "auto",
    objectFit: "contain",
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

// 🧩 Adjusted per-signature size map for better visual balance
const signatureSizeMap = {
  "/assets/images/sign_liza.png": { maxWidth: "160px", maxHeight: "70px" },
  "/assets/images/sign_niel.png": { maxWidth: "220px", maxHeight: "80px" }, // slightly larger to match presence
};

export const Footer = ({ radiologist }) => {
  const signatureSrc = signatureMap[radiologist];
  const imageStyle = {
    ...styles.signatureImage,
    ...(signatureSrc ? signatureSizeMap[signatureSrc] : {}),
  };

  return (
    <div style={styles.footer}>
      <div style={styles.signature}>
        <div style={styles.sigBlock}>
          {signatureSrc && (
            <img src={signatureSrc} alt="Signature" style={imageStyle} />
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
