import { Download } from "lucide-react";
import React from "react";
import * as XLSX from "xlsx";
// import { jsPDF } from "jspdf";
import { useParams } from "react-router-dom";

function ExportLinks({ data }) {
  const { tablename } = useParams();

  // Function to export data as CSV
  // const exportCSV = () => {
  //   const header = Object.keys(data[0]);
  //   const rows = data.map((item) => Object.values(item));

  //   const csvContent = [
  //     header.join(","),
  //     ...rows.map((row) => row.join(",")),
  //   ].join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `${tablename}.csv`;
  //   link.click();
  // };

  // Function to export data as Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${tablename}.xlsx`);
  };

  // Function to export data as PDF
  // const exportPDF = () => {
  //   const doc = new jsPDF();
  //   let y = 10;

  //   data.forEach((row, index) => {
  //     doc.text(`${row.name}, ${row.age}, ${row.city}`, 10, y);
  //     y += 10;
  //   });

  //   doc.save(`${tablename}.pdf`);
  // };

  // Function to trigger print
  // const printData = () => {
  //   const printWindow = window.open("", "_blank", "width=600,height=400");
  //   printWindow.document.write(
  //     "<html><head><title>Print Data</title></head><body>"
  //   );
  //   printWindow.document.write(
  //     "<pre>" + JSON.stringify(data, null, 2) + "</pre>"
  //   );
  //   printWindow.document.write("</body></html>");
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  return (
    <nav aria-label="Page navigation example" className="my-4">
      <ul className="flex justify-center space-x-4">
        {/* <li>
          <button
            onClick={printData}
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </li> */}
        {/* <li>
          <button
            onClick={exportCSV}
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </li> */}
        {/* <li>
          <button
            onClick={exportPDF}
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </li> */}
        <li>
          <button
            onClick={exportExcel}
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default ExportLinks;
