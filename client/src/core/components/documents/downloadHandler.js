import jsPDF from "jspdf";

export const handlePDFDownload = (ref, fileName) => {
  if (!ref.current) return;
  const doc = new jsPDF("p", "mm", "a4");

  // Use html2canvas if you want the HTML content as image
  doc.html(ref.current, {
    callback: function (doc) {
      doc.save(`${fileName}.pdf`); // <- THIS sets the filename
    },
    x: 10,
    y: 10,
    html2canvas: { scale: 0.25 },
  });
};
